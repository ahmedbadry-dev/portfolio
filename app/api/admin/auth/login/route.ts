import { NextResponse } from "next/server"
import {
  createAdminAuthToken,
  getAdminAuthConfig,
  getAdminSessionCookieOptions,
  verifyAdminPassword,
} from "@/lib/admin/auth"

type LoginPayload = {
  password?: string
}

const MAX_ATTEMPTS_PER_WINDOW = 10
const WINDOW_MS = 15 * 60 * 1000
const loginAttemptsByIp = new Map<string, { count: number; resetAt: number }>()

function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for")
  if (!forwardedFor) {
    return "unknown"
  }

  const first = forwardedFor.split(",")[0]?.trim()
  return first || "unknown"
}

export async function POST(request: Request) {
  const config = getAdminAuthConfig()
  if (!config) {
    return NextResponse.json(
      { success: false, message: "Admin auth is not configured." },
      { status: 503 }
    )
  }

  let payload: LoginPayload
  try {
    payload = (await request.json()) as LoginPayload
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid JSON payload." },
      { status: 400 }
    )
  }

  const ip = getClientIp(request)
  const now = Date.now()
  const existingAttempt = loginAttemptsByIp.get(ip)
  if (existingAttempt && now > existingAttempt.resetAt) {
    loginAttemptsByIp.delete(ip)
  }

  const activeAttempt = loginAttemptsByIp.get(ip)
  if (activeAttempt && activeAttempt.count >= MAX_ATTEMPTS_PER_WINDOW) {
    return NextResponse.json(
      {
        success: false,
        message: "Too many login attempts. Try again later.",
      },
      { status: 429 }
    )
  }

  const password = payload.password?.trim() ?? ""
  if (!password) {
    return NextResponse.json(
      { success: false, message: "Password is required." },
      { status: 400 }
    )
  }

  const valid = await verifyAdminPassword(password, config.passwordHash)
  if (!valid) {
    if (activeAttempt) {
      loginAttemptsByIp.set(ip, {
        count: activeAttempt.count + 1,
        resetAt: activeAttempt.resetAt,
      })
    } else {
      loginAttemptsByIp.set(ip, {
        count: 1,
        resetAt: now + WINDOW_MS,
      })
    }

    return NextResponse.json(
      { success: false, message: "Invalid credentials." },
      { status: 401 }
    )
  }

  loginAttemptsByIp.delete(ip)

  const token = await createAdminAuthToken(config)
  const response = NextResponse.json({ success: true })
  response.cookies.set(getAdminSessionCookieOptions(token))
  return response
}
