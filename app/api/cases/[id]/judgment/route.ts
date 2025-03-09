import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/email'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'NEUTRAL') {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const case_ = await prisma.case.findUnique({
      where: { id: params.id },
      include: {
        claimant: true,
        respondent: true
      }
    })

    if (!case_ || case_.neutralId !== session.user.id) {
      return new NextResponse('Not found', { status: 404 })
    }

    // Check if judgment already exists
    if (case_?.status === 'DECISION_ISSUED') {
      return new NextResponse('Judgment already issued', { status: 400 })
    }

    const response = await fetch('http://127.0.0.1:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3.2',
        prompt: `You are an experienced arbitrator with deep expertise in dispute resolution. 
        Your role is to:
        1. Carefully analyze the presented claims and responses
        2. Consider principles of fairness, applicable norms, and precedent
        3. Evaluate evidence and arguments objectively
        4. Make clear, reasoned decisions
        5. Provide specific, actionable recommendations
        
        Structure your response professionally and authoritatively.
        Be decisive and clear in your ruling while maintaining impartiality.
        Consider both immediate resolution and long-term relationship implications.

        Case details:
        ${JSON.stringify({
          caseId: case_.id,
          claimantRequest: case_.claimantRequest,
          respondentResponse: case_.respondentResponse,
          context: {
            claimantType: case_.claimant.role,
            respondentType: case_.respondent?.role,
            caseStatus: case_.status
          }
        })}`,
        options: {
          temperature: 0.7,
          top_k: 40,
          top_p: 0.9,
          num_predict: 2048
        }
      })
    })

    const result = await response.json()
    const judgment = result.response

    // Update case with judgment and status
    const updatedCase = await prisma.case.update({
      where: { id: params.id },
      data: {
        finalDecision: judgment,
        status: 'DECISION_ISSUED'
      }
    })

    const parties = [case_.claimant, case_.respondent].filter(Boolean)
    await Promise.all(
      parties.map(party => 
        sendEmail({
          to: party.email,
          subject: `Decision Issued for Case #${case_.id}`,
          text: `A decision has been issued for your case #${case_.id}. Please log in to view the complete judgment.`
        })
      )
    )

    return new NextResponse(judgment)
  } catch (error) {
    console.error('Error generating judgment:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 