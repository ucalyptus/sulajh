import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function POST(req: Request) {
  const { prompt } = await req.json()
  
  const response = await fetch('http://127.0.0.1:11434/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama3.2',
      prompt: `You are an AI agent acting as a platform in a dispute resolution process. Help resolve disputes fairly.

      User request: ${prompt}`,
      stream: true,
      options: {
        temperature: 0.7,
        top_k: 40,
        top_p: 0.9,
        num_predict: 1024
      }
    })
  })

  return new Response(response.body, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}

