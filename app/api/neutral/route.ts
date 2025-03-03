import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function POST(req: Request) {
  const { prompt } = await req.json()
  
  // Parse the case data from the prompt
  const caseData = JSON.parse(prompt)
  
  const response = await fetch('http://127.0.0.1:11434/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama3.2',
      prompt: `You are an AI agent acting as a neutral third party in a dispute resolution process. 
      Review the case and provide a structured decision with the following sections:
      1. Summary of Claims
      2. Key Issues
      3. Analysis
      4. Decision
      5. Recommendations

      Please review the following case and provide a decision:
      
      Case ID: ${caseData.id}
      
      Claimant's Request:
      ${caseData.claimantRequest}
      
      Respondent's Response:
      ${caseData.respondentResponse}
      
      Please analyze the dispute and provide your structured decision.`,
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

