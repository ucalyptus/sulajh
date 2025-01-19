import { OpenAIStream, StreamingTextResponse } from 'ai'
import OpenAI from 'openai'

// Create OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export const runtime = 'edge'

export async function POST(req: Request) {
  const { prompt } = await req.json()
  
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    stream: true,
    messages: [
      {
        role: 'system',
        content: 'You are an AI agent acting as a platform in a dispute resolution process. Help resolve disputes fairly.'
      },
      {
        role: 'user',
        content: prompt
      }
    ]
  })

  const stream = OpenAIStream(response)
  return new StreamingTextResponse(stream)
}

