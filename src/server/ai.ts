import { createServerFn } from '@tanstack/react-start'
import { generateText } from 'ai'
import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/src/server/auth'

const openrouter = createOpenRouter({ apiKey: process.env.OPENROUTER_API_KEY })
const MODEL = 'stealth/ox-alpha'

async function requireSession() {
  const session = await getSession()
  if (!session) throw new Error('Unauthorized')
  return session
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Retry an async AI call with exponential backoff + jitter.
 * Retries transient failures (rate limits, 5xx, network) up to `maxAttempts`.
 */
async function withRetry<T>(
  fn: () => Promise<T>,
  { maxAttempts = 4, baseDelayMs = 800 }: { maxAttempts?: number; baseDelayMs?: number } = {}
): Promise<T> {
  let lastError: unknown
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (err) {
      lastError = err
      if (attempt === maxAttempts) break
      const backoff = baseDelayMs * 2 ** (attempt - 1)
      const jitter = Math.random() * backoff * 0.25
      await sleep(backoff + jitter)
    }
  }
  throw lastError
}

type PartyField = 'claimantId' | 'respondentId' | 'caseManagerId' | 'neutralId'

/**
 * Load a case only when the session user occupies `field` on it.
 * Registrars may read any case but never satisfy a specific party field.
 */
async function loadCaseAsParty(
  caseId: string,
  userId: string,
  role: string,
  field?: PartyField
) {
  if (field && role !== 'REGISTRAR') {
    const case_ = await prisma.case.findFirst({
      where: { id: caseId, [field]: userId },
    })
    if (!case_) throw new Error('Forbidden')
    return case_
  }

  const where =
    role === 'REGISTRAR'
      ? { id: caseId }
      : {
          id: caseId,
          OR: [
            { claimantId: userId },
            { respondentId: userId },
            { caseManagerId: userId },
            { neutralId: userId },
          ],
        }
  const case_ = await prisma.case.findFirst({ where })
  if (!case_) throw new Error('Case not found')
  return case_
}

export const aiClaimantAssist = createServerFn({ method: 'POST' })
  .validator((d: { request: string }) => d)
  .handler(async ({ data }) => {
    await requireSession()
    const { text } = await withRetry(() =>
      generateText({
        model: openrouter(MODEL),
        prompt: `You are a dispute-resolution intake assistant. Summarize and structure the following claim description into clear facts. Keep it under 300 words.\n\nClaim:\n${data.request}`,
      })
    )
    return text
  })

export const aiRespondentAssist = createServerFn({ method: 'POST' })
  .validator((d: { caseId: string; responseText: string }) => d)
  .handler(async ({ data }) => {
    const session = await requireSession()
    await loadCaseAsParty(data.caseId, session.id, session.role, 'respondentId')

    const { text } = await withRetry(() =>
      generateText({
        model: openrouter(MODEL),
        prompt: `You are a dispute-resolution assistant helping a respondent articulate their position clearly and factually. Keep it under 300 words.\n\nRespondent draft:\n${data.responseText}`,
      })
    )
    return text
  })

export const aiCaseManagerPreProceeding = createServerFn({ method: 'POST' })
  .validator((d: { caseId: string }) => d)
  .handler(async ({ data }) => {
    const session = await requireSession()
    if (session.role !== 'CASE_MANAGER' && session.role !== 'REGISTRAR') {
      throw new Error('Forbidden')
    }
    const case_ = await loadCaseAsParty(
      data.caseId,
      session.id,
      session.role,
      'caseManagerId'
    )

    const { text } = await withRetry(() =>
      generateText({
        model: openrouter(MODEL),
        prompt: `You are a case manager preparing a pre-proceeding summary for dispute case ${case_.id}.\n\nClaim:\n${case_.claimantRequest ?? '(none)'}\n\nProduce a short pre-proceeding checklist and neutral framing of the dispute.`,
      })
    )
    return text
  })

export const aiPlatformNotifyRegistrar = createServerFn({ method: 'POST' })
  .validator((d: { caseId: string }) => d)
  .handler(async ({ data }) => {
    const session = await requireSession()
    // Status transition to the registrar queue is registrar-controlled.
    if (session.role !== 'REGISTRAR') throw new Error('Forbidden')

    const case_ = await prisma.case.findUnique({ where: { id: data.caseId } })
    if (!case_) throw new Error('Case not found')

    await prisma.case.update({
      where: { id: data.caseId },
      data: { status: 'PENDING_RESPONDENT' },
    })

    const { text } = await withRetry(() =>
      generateText({
        model: openrouter(MODEL),
        prompt: `Draft a concise notification to a dispute-resolution registrar that case ${data.caseId} is ready for assignment. Include a one-line summary of why cases reach this stage. Under 120 words.`,
      })
    )
    return text
  })

export const aiRegistrarAssign = createServerFn({ method: 'POST' })
  .validator((d: { caseId: string }) => d)
  .handler(async ({ data }) => {
    const session = await requireSession()
    if (session.role !== 'REGISTRAR') throw new Error('Forbidden')

    const case_ = await prisma.case.findUnique({ where: { id: data.caseId } })
    if (!case_) throw new Error('Case not found')

    const { text } = await withRetry(() =>
      generateText({
        model: openrouter(MODEL),
        prompt: `As a registrar's assistant, recommend whether dispute case ${data.caseId} needs a case manager, a neutral, or both, with one sentence of justification.`,
      })
    )
    return text
  })

export const aiNeutralDecision = createServerFn({ method: 'POST' })
  .validator((d: { caseId: string }) => d)
  .handler(async ({ data }) => {
    const session = await requireSession()
    if (session.role !== 'NEUTRAL') throw new Error('Forbidden')
    const case_ = await loadCaseAsParty(
      data.caseId,
      session.id,
      session.role,
      'neutralId'
    )

    const { text } = await withRetry(() =>
      generateText({
        model: openrouter(MODEL),
        prompt: `You are an impartial neutral in an online dispute resolution proceeding. Review both sides and issue a fair, balanced decision or recommended settlement. Structure it as: Summary of Claim, Summary of Response, Analysis, Decision.\n\nClaim:\n${case_.claimantRequest ?? '(none)'}\n\nResponse:\n${case_.respondentResponse ?? '(none)'}`,
      })
    )

    // Draft only — the neutral reviews, edits, and explicitly issues the
    // decision via `issueJudgment`, which persists it.
    return text
  })
