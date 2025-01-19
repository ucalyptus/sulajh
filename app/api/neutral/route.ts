import { OpenAIStream, StreamingTextResponse } from 'ai'
import OpenAI from 'openai'

// Create OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export const runtime = 'edge'

export async function POST(req: Request) {
  const { prompt } = await req.json()
  
  // Parse the case data from the prompt
  const caseData = JSON.parse(prompt)
  
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    stream: true,
    messages: [
      {
        role: 'system',
        content: `You are an AI agent acting as a neutral third party in a dispute resolution process. 
        Review the case and provide a structured decision with the following sections:
        1. Summary of Claims
        2. Key Issues
        3. Analysis
        4. Decision
        5. Recommendations`
      },
      {
        role: 'user',
        content: `Please review the following case and provide a decision:
        
        Case ID: ${caseData.id}
        
        Claimant's Request:
        ${caseData.claimantRequest}
        
        Respondent's Response:
        ${caseData.respondentResponse}
        
        Please analyze the dispute and provide your structured decision.`
      }
    ]
  })

  const stream = OpenAIStream(response)
  return new StreamingTextResponse(stream)
}

