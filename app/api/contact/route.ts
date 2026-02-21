import { NextResponse } from 'next/server'
import { contactSchema } from '@/features/contact/schema'

type Bucket = { count: number; resetAt: number }
const RATE = {
  windowMs: 60_000, // 1 min
  max: 5, // 5 requests/min per IP
}

const buckets = new Map<string, Bucket>()

function getIP(req: Request) {
  const xf = req.headers.get('x-forwarded-for')
  if (xf) return xf.split(',')[0]?.trim() || 'unknown'
  return 'unknown'
}

function rateLimit(ip: string) {
  const now = Date.now()
  const b = buckets.get(ip)

  if (!b || now > b.resetAt) {
    buckets.set(ip, { count: 1, resetAt: now + RATE.windowMs })
    return {
      allowed: true,
      remaining: RATE.max - 1,
      resetAt: now + RATE.windowMs,
    }
  }

  if (b.count >= RATE.max) {
    return { allowed: false, remaining: 0, resetAt: b.resetAt }
  }

  b.count += 1
  buckets.set(ip, b)
  return { allowed: true, remaining: RATE.max - b.count, resetAt: b.resetAt }
}

export async function POST(req: Request) {
  const ip = getIP(req)
  const rl = rateLimit(ip)

  if (!rl.allowed) {
    return NextResponse.json(
      { message: 'Too many requests. Please wait a bit and try again.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((rl.resetAt - Date.now()) / 1000)),
        },
      }
    )
  }

  let raw: unknown
  try {
    raw = await req.json()
  } catch {
    return NextResponse.json(
      { message: 'Invalid JSON payload.' },
      { status: 400 }
    )
  }

  const parsed = contactSchema.safeParse(raw)
  if (!parsed.success) {
    return NextResponse.json(
      { message: 'Please check your inputs and try again.' },
      { status: 400 }
    )
  }

  const data = parsed.data

  // Honeypot check (bots fill this)
  if (data.website && data.website.trim().length > 0) {
    return NextResponse.json({ message: 'Spam detected.' }, { status: 400 })
  }

  // ✅ Static-first: no DB now. Later you can plug Resend.
  console.log('📩 Contact submission:', {
    name: data.name,
    email: data.email,
    message: data.message,
    ip,
    at: new Date().toISOString(),
  })

  return NextResponse.json({ ok: true })
}
