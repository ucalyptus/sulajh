import { OpenAIStream, StreamingTextResponse } from 'ai'
import OpenAI from 'openai'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

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

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      stream: false,
      messages: [
        {
          role: 'system',
          content: `You are an experienced arbitrator with deep expertise in dispute resolution. 
          Your role is to:
          1. Carefully analyze the presented claims and responses
          2. Consider principles of fairness, applicable norms, and precedent
          3. Evaluate evidence and arguments objectively
          4. Make clear, reasoned decisions
          5. Provide specific, actionable recommendations
          
          Structure your response professionally and authoritatively.
          Be decisive and clear in your ruling while maintaining impartiality.
          Consider both immediate resolution and long-term relationship implications.`
        },
        {
          role: 'user',
          content: JSON.stringify({
            caseId: case_.id,
            claimantRequest: case_.claimantRequest,
            respondentResponse: case_.respondentResponse,
            context: {
              claimantType: case_.claimant.role,
              respondentType: case_.respondent?.role,
              caseStatus: case_.status
            }
          })
        }
      ]
    })

    const judgment = response.choices[0].message.content

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