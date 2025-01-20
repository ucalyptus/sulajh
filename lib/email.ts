import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface EmailParams {
  to: string
  subject: string
  text: string
}

export async function sendEmail({ to, subject, text }: EmailParams) {
  try {
    await resend.emails.send({
      from: 'Platform <notifications@platform.com>',
      to,
      subject,
      text,
    })
  } catch (error) {
    console.error('Error sending email:', error)
    throw new Error('Failed to send email')
  }
} 