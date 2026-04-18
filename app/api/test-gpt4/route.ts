import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'

export const runtime = 'edge'

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

    const result = streamText({
      model: openai('gpt-4-turbo-preview'),
      system: systemPrompts[role as SystemRole] || systemPrompts.platform,
      prompt,
      temperature: 0.7,
      maxOutputTokens: 1000,
    })

    return result.toTextStreamResponse()
  } catch (error) {
    console.error('Test GPT-4 Error:', error)
    return new Response('Error testing GPT-4', { status: 500 })
  }
} 