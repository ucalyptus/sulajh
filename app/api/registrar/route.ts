import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'

export const runtime = 'edge'

export async function POST(req: Request) {
  const { prompt } = await req.json()

  const result = streamText({
    model: openai('gpt-4o'),
    system: 'You are an AI agent acting as a registrar in a dispute resolution process. Process and manage case registrations and administrative tasks.',
    prompt,
  })

  return result.toTextStreamResponse()
}

