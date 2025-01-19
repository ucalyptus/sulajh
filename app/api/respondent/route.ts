import { OpenAIStream, StreamingTextResponse } from 'ai'
import OpenAI from 'openai'

// Create OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export const runtime = 'edge'

export async function POST(req: Request) {
  const { prompt } = await req.json()
  
  // Parse the stringified data
  const { caseId, responseText } = JSON.parse(prompt)
  
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    stream: true,
    messages: [
      {
        role: 'system',
        content: 'You are an AI agent acting as a respondent in a dispute resolution process. Help formulate a clear and professional response to the claim.'
      },
      {
        role: 'user',
        content: `Case ID: ${caseId}\nResponse: ${responseText}\n\nPlease help refine and formalize this response.`
      }
    ]
  })

  const stream = OpenAIStream(response)
  return new StreamingTextResponse(stream)
}

