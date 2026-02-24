import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { contactSchema } from '@/features/contact/schema'

const SENDER = 'Portfolio <onboarding@resend.dev>'
const OWNER_EMAIL = 'ahmedbadry.dev@gmail.com'

export async function POST(request: Request) {
  let payload: unknown

  try {
    payload = await request.json()
  } catch {
    return NextResponse.json(
      { success: false, message: 'Invalid JSON payload.' },
      { status: 400 }
    )
  }

  const parsed = contactSchema.safeParse(payload)
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: 'Validation failed.' },
      { status: 400 }
    )
  }

  const { name, email, message, website } = parsed.data

  // Honeypot check: pretend success to avoid bot feedback loops.
  if (website && website.trim().length > 0) {
    return NextResponse.json({ success: true })
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { success: false, message: 'Email service not configured.' },
      { status: 500 }
    )
  }

  const resend = new Resend(apiKey)
  const timestamp = new Date().toISOString()

  const ownerHtml = `
    <div style="font-family:Arial,sans-serif;line-height:1.5;color:#111827">
      <h2 style="margin:0 0 12px 0;font-size:18px;">New Contact Message from Portfolio</h2>
      <p style="margin:0 0 8px 0;"><strong>Name:</strong> ${name}</p>
      <p style="margin:0 0 8px 0;"><strong>Email:</strong> ${email}</p>
      <p style="margin:0 0 8px 0;"><strong>Message:</strong><br/>${message.replace(/\n/g, '<br/>')}</p>
      <p style="margin:12px 0 0 0;color:#6b7280;"><strong>Timestamp:</strong> ${timestamp}</p>
    </div>
  `

  const userHtml = `
    <div style="font-family:Arial,sans-serif;line-height:1.5;color:#111827">
      <p style="margin:0 0 12px 0;">Hi ${name},</p>
      <p style="margin:0 0 12px 0;">Thanks for reaching out. I received your message and will get back to you soon.</p>
      <p style="margin:16px 0 0 0;">Ahmed Badry<br/>Frontend Specialist</p>
    </div>
  `

  try {
    await resend.emails.send({
      from: SENDER,
      to: OWNER_EMAIL,
      subject: 'New Contact Message from Portfolio',
      replyTo: email,
      html: ownerHtml,
    })

    await resend.emails.send({
      from: SENDER,
      to: email,
      subject: 'Thanks for reaching out',
      html: userHtml,
    })
  } catch {
    return NextResponse.json(
      { success: false, message: 'Failed to send email.' },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true })
}
