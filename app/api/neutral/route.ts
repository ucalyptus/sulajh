import { streamText } from 'ai'
import { openrouter } from '@openrouter/ai-sdk-provider'

export const runtime = 'edge'

export async function POST(req: Request) {
  const { prompt } = await req.json()
  
  const caseData = JSON.parse(prompt)

  const result = streamText({
    model: openrouter('google/gemma-4-26b-a4b-it'),
    system: `You are an AI agent acting as a neutral third party in a dispute resolution process. 
      Review the case and provide a structured decision with the following sections:
      1. Summary of Claims
      2. Key Issues
      3. Analysis
      4. Decision
      5. Recommendations`,
    prompt: `Please review the following case and provide a decision:
      
      Case ID: ${caseData.id}
      
      Claimant's Request:
      ${caseData.claimantRequest}
      
      Respondent's Response:
      ${caseData.respondentResponse}
      
      Please analyze the dispute and provide your structured decision.`,
    temperature: 0.7,
    maxOutputTokens: 1024,
  })

  return result.toTextStreamResponse()
}

