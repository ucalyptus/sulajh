import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface SendEmailParams {
  to: string
  subject: string
  text: string
  from?: string
}

export async function sendEmail({ to, subject, text, from }: SendEmailParams) {
  const fromEmail = from || process.env.RESEND_FROM_EMAIL || 'sulajh@resend.ucalyptus.me'
  const toEmail = process.env.NODE_ENV === 'development' 
    ? process.env.VERIFIED_EMAIL || to
    : to

  await resend.emails.send({
    from: `Sulajh <${fromEmail}>`,
    to: toEmail,
    subject,
    text,
    replyTo: process.env.SUPPORT_EMAIL || 'support@resend.ucalyptus.me'
  })
} 