import { streamText } from 'ai'
import { openrouter } from '@openrouter/ai-sdk-provider'

export async function POST(req: Request) {
  const { prompt } = await req.json()

  const result = streamText({
    model: openrouter('google/gemma-4-26b-a4b-it'),
    system: 'You are an experienced arbitrator. Analyze the dispute carefully, consider fairness and applicable norms, evaluate evidence objectively, and provide a clear, reasoned judgment with specific recommendations.',
    prompt,
    temperature: 0.7,
    maxOutputTokens: 1024,
  })

  return result.toTextStreamResponse()
} 