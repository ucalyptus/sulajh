import { streamText } from 'ai'
import { openrouter } from '@openrouter/ai-sdk-provider'

export const runtime = 'edge'

export async function POST(req: Request) {
  const { prompt } = await req.json()

  const result = streamText({
    model: openrouter('google/gemma-4-26b-a4b-it'),
    system: 'You are an AI agent acting as a platform in a dispute resolution process. Help resolve disputes fairly.',
    prompt,
    temperature: 0.7,
    maxOutputTokens: 1024,
  })

  return result.toTextStreamResponse()
}

