export function generateCaseInvitationEmail(props: {
  inviteUrl: string;
  caseId: string;
}): string {
  const { inviteUrl, caseId } = props;
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Case Response Invitation</title>
      </head>
      <body style="font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; padding: 40px 20px; background: #f4f4f5;">
        <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; padding: 40px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <h1 style="color: #18181b; font-size: 24px; margin-bottom: 24px;">
            Case Response Invitation
          </h1>
          <p style="color: #3f3f46; font-size: 16px; line-height: 24px; margin-bottom: 24px;">
            You have been invited to respond to Case #${caseId} on our dispute resolution platform. Please click the button below to view and respond to the case.
          </p>
          <div style="text-align: center; margin-bottom: 32px;">
            <a href="${inviteUrl}" 
               style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 500;">
              View and Respond to Case
            </a>
          </div>
          <p style="color: #71717a; font-size: 14px; text-align: center; margin-top: 32px;">
            This invitation link will expire in 7 days. If you have any issues, please contact support.
          </p>
        </div>
      </body>
    </html>
  `;
}

interface UserInvitationEmailProps {
  name: string
  email: string
  password: string
  role: string
}

export function generateUserInvitationEmail({ name, email, password, role }: UserInvitationEmailProps): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Your Account Details</title>
      </head>
      <body style="font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; padding: 40px 20px; background: #f4f4f5;">
        <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; padding: 40px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <h1 style="color: #18181b; font-size: 24px; margin-bottom: 24px;">
            Welcome to the Dispute Resolution Platform
          </h1>
          <p style="color: #3f3f46; font-size: 16px; line-height: 24px; margin-bottom: 24px;">
            Hello ${name},
          </p>
          <p style="color: #3f3f46; font-size: 16px; line-height: 24px; margin-bottom: 24px;">
            Your account has been created as a ${role}. Here are your login credentials:
          </p>
          <div style="background: #f4f4f5; padding: 20px; border-radius: 8px; margin-bottom: 24px;">
            <p style="margin: 0; color: #18181b;">
              <strong>Email:</strong> ${email}<br>
              <strong>Temporary Password:</strong> ${password}
            </p>
          </div>
          <p style="color: #3f3f46; font-size: 16px; line-height: 24px; margin-bottom: 24px;">
            Please log in and change your password immediately.
          </p>
          <div style="text-align: center;">
            <a href="${process.env.NEXTAUTH_URL}/auth/signin" 
               style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 500;">
              Log In Now
            </a>
          </div>
        </div>
      </body>
    </html>
  `
} 