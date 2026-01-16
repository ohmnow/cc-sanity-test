import {Resend} from 'resend'

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null

const FROM_EMAIL = 'Golden Gate Home Advisors <noreply@goldengateadvisors.com>'
const ADMIN_EMAIL = 'hello@goldengateadvisors.com'

interface SendEmailOptions {
  to: string | string[]
  subject: string
  html: string
  replyTo?: string
}

export async function sendEmail({to, subject, html, replyTo}: SendEmailOptions) {
  if (!resend) {
    console.log('[Email] Resend not configured, skipping email:', {to, subject})
    return {success: false, error: 'Email service not configured'}
  }

  try {
    const {data, error} = await resend.emails.send({
      from: FROM_EMAIL,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      replyTo: replyTo || ADMIN_EMAIL,
    })

    if (error) {
      console.error('[Email] Failed to send:', error)
      return {success: false, error: error.message}
    }

    console.log('[Email] Sent successfully:', data?.id)
    return {success: true, id: data?.id}
  } catch (err) {
    console.error('[Email] Error:', err)
    return {success: false, error: 'Failed to send email'}
  }
}

// Email template for new LOI submission (to admin)
export function loiSubmittedAdminTemplate({
  investorName,
  investorEmail,
  prospectusTitle,
  investmentAmount,
  loiId,
}: {
  investorName: string
  investorEmail: string
  prospectusTitle: string
  investmentAmount: string
  loiId: string
}) {
  const siteUrl = process.env.SITE_URL || 'http://localhost:5175'

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: #1a1a1a; padding: 30px; border-radius: 8px 8px 0 0;">
    <h1 style="color: #c9a961; margin: 0; font-size: 24px;">New Letter of Intent Submitted</h1>
  </div>

  <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px;">
    <p style="margin-top: 0;">A new Letter of Intent has been submitted and requires your review.</p>

    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #1a1a1a;">LOI Details</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #666;">Investor:</td>
          <td style="padding: 8px 0; font-weight: 600;">${investorName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;">Email:</td>
          <td style="padding: 8px 0;">${investorEmail}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;">Opportunity:</td>
          <td style="padding: 8px 0; font-weight: 600;">${prospectusTitle}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;">Investment Amount:</td>
          <td style="padding: 8px 0; font-weight: 600; color: #c9a961;">${investmentAmount}</td>
        </tr>
      </table>
    </div>

    <a href="${siteUrl}/admin/lois"
       style="display: inline-block; background: #c9a961; color: #1a1a1a; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600;">
      Review LOI in Admin Portal
    </a>

    <p style="margin-top: 30px; font-size: 14px; color: #666;">
      This is an automated notification from Golden Gate Home Advisors.
    </p>
  </div>
</body>
</html>
`
}

// Email template for LOI submission confirmation (to investor)
export function loiSubmittedInvestorTemplate({
  investorName,
  prospectusTitle,
  investmentAmount,
}: {
  investorName: string
  prospectusTitle: string
  investmentAmount: string
}) {
  const siteUrl = process.env.SITE_URL || 'http://localhost:5175'

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: #1a1a1a; padding: 30px; border-radius: 8px 8px 0 0;">
    <h1 style="color: #c9a961; margin: 0; font-size: 24px;">Letter of Intent Received</h1>
  </div>

  <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px;">
    <p style="margin-top: 0;">Dear ${investorName},</p>

    <p>Thank you for submitting your Letter of Intent. We have received your expression of interest and our team is reviewing your submission.</p>

    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #1a1a1a;">Your Submission</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #666;">Opportunity:</td>
          <td style="padding: 8px 0; font-weight: 600;">${prospectusTitle}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;">Investment Amount:</td>
          <td style="padding: 8px 0; font-weight: 600; color: #c9a961;">${investmentAmount}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;">Status:</td>
          <td style="padding: 8px 0;"><span style="background: #fef3c7; color: #92400e; padding: 4px 8px; border-radius: 4px; font-size: 14px;">Under Review</span></td>
        </tr>
      </table>
    </div>

    <h3>What Happens Next?</h3>
    <ol style="padding-left: 20px;">
      <li style="margin-bottom: 10px;">Our team will review your Letter of Intent within 2-3 business days.</li>
      <li style="margin-bottom: 10px;">If approved, we will send you the full investment documentation.</li>
      <li style="margin-bottom: 10px;">You will be contacted to schedule a call to discuss the opportunity in detail.</li>
    </ol>

    <a href="${siteUrl}/investor/lois"
       style="display: inline-block; background: #c9a961; color: #1a1a1a; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600;">
      View Your LOIs
    </a>

    <p style="margin-top: 30px; font-size: 14px; color: #666;">
      If you have any questions, please don't hesitate to contact us at
      <a href="mailto:hello@goldengateadvisors.com" style="color: #c9a961;">hello@goldengateadvisors.com</a>
    </p>

    <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 30px 0;">

    <p style="font-size: 12px; color: #999; margin-bottom: 0;">
      Golden Gate Home Advisors<br>
      123 Market Street, Suite 456<br>
      San Francisco, CA 94102<br>
      (415) 555-1234
    </p>
  </div>
</body>
</html>
`
}

// Email template for LOI status update (to investor)
export function loiStatusUpdateTemplate({
  investorName,
  prospectusTitle,
  status,
  message,
}: {
  investorName: string
  prospectusTitle: string
  status: 'approved' | 'rejected' | 'countersigned'
  message?: string
}) {
  const siteUrl = process.env.SITE_URL || 'http://localhost:5175'

  const statusConfig = {
    approved: {
      title: 'Letter of Intent Approved',
      color: '#10b981',
      bgColor: '#d1fae5',
      text: 'Your Letter of Intent has been approved.',
    },
    rejected: {
      title: 'Letter of Intent Update',
      color: '#ef4444',
      bgColor: '#fee2e2',
      text: 'Unfortunately, we are unable to proceed with your Letter of Intent at this time.',
    },
    countersigned: {
      title: 'Letter of Intent Countersigned',
      color: '#10b981',
      bgColor: '#d1fae5',
      text: 'Great news! Your Letter of Intent has been countersigned and is now fully executed.',
    },
  }

  const config = statusConfig[status]

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: #1a1a1a; padding: 30px; border-radius: 8px 8px 0 0;">
    <h1 style="color: #c9a961; margin: 0; font-size: 24px;">${config.title}</h1>
  </div>

  <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px;">
    <p style="margin-top: 0;">Dear ${investorName},</p>

    <div style="background: ${config.bgColor}; border-left: 4px solid ${config.color}; padding: 15px 20px; margin: 20px 0; border-radius: 0 8px 8px 0;">
      <p style="margin: 0; color: ${config.color}; font-weight: 600;">
        ${config.text}
      </p>
    </div>

    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #1a1a1a;">Opportunity Details</h3>
      <p style="margin-bottom: 0;"><strong>${prospectusTitle}</strong></p>
    </div>

    ${message ? `<p>${message}</p>` : ''}

    <a href="${siteUrl}/investor/lois"
       style="display: inline-block; background: #c9a961; color: #1a1a1a; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600;">
      View Your LOIs
    </a>

    <p style="margin-top: 30px; font-size: 14px; color: #666;">
      If you have any questions, please contact us at
      <a href="mailto:hello@goldengateadvisors.com" style="color: #c9a961;">hello@goldengateadvisors.com</a>
    </p>

    <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 30px 0;">

    <p style="font-size: 12px; color: #999; margin-bottom: 0;">
      Golden Gate Home Advisors<br>
      123 Market Street, Suite 456<br>
      San Francisco, CA 94102<br>
      (415) 555-1234
    </p>
  </div>
</body>
</html>
`
}

// Email template for new lead notification (to admin)
export function newLeadTemplate({
  name,
  email,
  phone,
  type,
  message,
}: {
  name: string
  email: string
  phone?: string
  type: string
  message?: string
}) {
  const siteUrl = process.env.SITE_URL || 'http://localhost:5175'

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: #1a1a1a; padding: 30px; border-radius: 8px 8px 0 0;">
    <h1 style="color: #c9a961; margin: 0; font-size: 24px;">New Lead Submitted</h1>
  </div>

  <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px;">
    <p style="margin-top: 0;">A new lead has been submitted through the website.</p>

    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #1a1a1a;">Lead Details</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #666;">Name:</td>
          <td style="padding: 8px 0; font-weight: 600;">${name}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;">Email:</td>
          <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #c9a961;">${email}</a></td>
        </tr>
        ${phone ? `
        <tr>
          <td style="padding: 8px 0; color: #666;">Phone:</td>
          <td style="padding: 8px 0;"><a href="tel:${phone}" style="color: #c9a961;">${phone}</a></td>
        </tr>
        ` : ''}
        <tr>
          <td style="padding: 8px 0; color: #666;">Interest Type:</td>
          <td style="padding: 8px 0;"><span style="background: #e0f2fe; color: #0277bd; padding: 4px 8px; border-radius: 4px; font-size: 14px; text-transform: capitalize;">${type}</span></td>
        </tr>
        ${message ? `
        <tr>
          <td style="padding: 8px 0; color: #666; vertical-align: top;">Message:</td>
          <td style="padding: 8px 0;">${message}</td>
        </tr>
        ` : ''}
      </table>
    </div>

    <a href="${siteUrl}/admin/leads"
       style="display: inline-block; background: #c9a961; color: #1a1a1a; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600;">
      View in Admin Portal
    </a>

    <p style="margin-top: 30px; font-size: 14px; color: #666;">
      This is an automated notification from Golden Gate Home Advisors.
    </p>
  </div>
</body>
</html>
`
}

// Send LOI submitted emails (both admin and investor)
export async function sendLoiSubmittedEmails({
  investorName,
  investorEmail,
  prospectusTitle,
  investmentAmount,
  loiId,
}: {
  investorName: string
  investorEmail: string
  prospectusTitle: string
  investmentAmount: string
  loiId: string
}) {
  // Send to admin
  await sendEmail({
    to: ADMIN_EMAIL,
    subject: `New LOI: ${investorName} - ${prospectusTitle}`,
    html: loiSubmittedAdminTemplate({
      investorName,
      investorEmail,
      prospectusTitle,
      investmentAmount,
      loiId,
    }),
  })

  // Send confirmation to investor
  await sendEmail({
    to: investorEmail,
    subject: `LOI Received: ${prospectusTitle}`,
    html: loiSubmittedInvestorTemplate({
      investorName,
      prospectusTitle,
      investmentAmount,
    }),
  })
}

// Send LOI status update email
export async function sendLoiStatusUpdateEmail({
  investorName,
  investorEmail,
  prospectusTitle,
  status,
  message,
}: {
  investorName: string
  investorEmail: string
  prospectusTitle: string
  status: 'approved' | 'rejected' | 'countersigned'
  message?: string
}) {
  const subjectMap = {
    approved: `LOI Approved: ${prospectusTitle}`,
    rejected: `LOI Update: ${prospectusTitle}`,
    countersigned: `LOI Executed: ${prospectusTitle}`,
  }

  await sendEmail({
    to: investorEmail,
    subject: subjectMap[status],
    html: loiStatusUpdateTemplate({
      investorName,
      prospectusTitle,
      status,
      message,
    }),
  })
}

// Send new lead notification
export async function sendNewLeadEmail({
  name,
  email,
  phone,
  type,
  message,
}: {
  name: string
  email: string
  phone?: string
  type: string
  message?: string
}) {
  await sendEmail({
    to: ADMIN_EMAIL,
    subject: `New Lead: ${name} (${type})`,
    html: newLeadTemplate({name, email, phone, type, message}),
  })
}
