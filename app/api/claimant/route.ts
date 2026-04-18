import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'

export const runtime = 'edge'

export async function POST(req: Request) {
  const { prompt } = await req.json()

  const result = streamText({
    model: openai('gpt-4o'),
    system: 'You are an AI agent acting as a claimant in a dispute resolution process. Provide a detailed description of your dispute.',
    prompt,
  })

  return result.toTextStreamResponse()
}

