import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function POST(req: Request) {
  try {
    const { role, prompt } = await req.json()
    
    const systemPrompts = {
      neutral: `You are an AI agent acting as a neutral third party in a dispute resolution process. 
      Review the case and provide a structured decision with the following sections:
      1. Summary of Claims
      2. Key Issues
      3. Analysis
      4. Decision
      5. Recommendations`,
      
      platform: `You are an AI agent acting as a platform in a dispute resolution process. Help resolve disputes fairly.`,
      
      judgment: `You are an experienced arbitrator with deep expertise in dispute resolution. 
      Your role is to:
      1. Carefully analyze the presented claims and responses
      2. Consider principles of fairness, applicable norms, and precedent
      3. Evaluate evidence and arguments objectively
      4. Make clear, reasoned decisions
      5. Provide specific, actionable recommendations`
    }

    const fullPrompt = `${systemPrompts[role] || systemPrompts.platform}

    Test request: ${prompt}`

    const response = await fetch('http://127.0.0.1:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3.2',
        prompt: fullPrompt,
        stream: true,
        options: {
          temperature: 0.1,
          top_k: 10,
          top_p: 0.8,
          repeat_penalty: 1.5,
          mirostat: 2,
          mirostat_tau: 3,
          mirostat_eta: 0.1,
          num_ctx: 4096,
          num_thread: 8,
          stop: ["\n\n\n", "</response>"],
          num_predict: 1000,
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
  } catch (error) {
    console.error('Test LLM Error:', error)
    return new NextResponse('Error testing LLM', { status: 500 })
  }
} 