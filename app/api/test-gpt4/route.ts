import { OpenAIStream, StreamingTextResponse } from 'ai'
import OpenAI from 'openai'

export const runtime = 'edge'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

type SystemRole = 'neutral' | 'platform' | 'judgment'

export async function POST(req: Request) {
  try {
    const { role, prompt } = await req.json()
    
    const systemPrompts: Record<SystemRole, string> = {
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

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: systemPrompts[role as SystemRole] || systemPrompts.platform },
        { role: 'user', content: prompt }
      ],
      stream: true,
      temperature: 0.7,
      max_tokens: 1000
    })

    const stream = OpenAIStream(response)
    return new StreamingTextResponse(stream)
  } catch (error) {
    console.error('Test GPT-4 Error:', error)
    return new Response('Error testing GPT-4', { status: 500 })
  }
} 