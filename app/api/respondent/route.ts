import { streamText } from 'ai'
import { openrouter } from '@openrouter/ai-sdk-provider'

export const runtime = 'edge'

export async function POST(req: Request) {
  const { prompt } = await req.json()
  
  const { caseId, responseText } = JSON.parse(prompt)

  const result = streamText({
    model: openrouter('google/gemma-4-26b-a4b-it'),
    system: 'You are an AI agent acting as a respondent in a dispute resolution process. Help formulate a clear and professional response to the claim.',
    prompt: `Case ID: ${caseId}\nResponse: ${responseText}\n\nPlease help refine and formalize this response.`,
  })

  return result.toTextStreamResponse()
}

