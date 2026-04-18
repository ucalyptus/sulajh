import { streamText } from 'ai'
import { openrouter } from '@openrouter/ai-sdk-provider'

export const runtime = 'edge'

export async function POST(req: Request) {
  const { prompt } = await req.json()

  const result = streamText({
    model: openrouter('google/gemma-4-26b-a4b-it'),
    system: 'You are an AI agent acting as a claimant in a dispute resolution process. Provide a detailed description of your dispute.',
    prompt,
  })

  return result.toTextStreamResponse()
}

