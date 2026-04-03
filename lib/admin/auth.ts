import { NextResponse } from "next/server"
import { compare } from "bcryptjs"
import {
  ADMIN_SESSION_COOKIE_NAME,
  ADMIN_SESSION_TTL_SECONDS,
} from "@/lib/admin/constants"
import {
  createAdminSessionToken,
  isAdminSessionValidFromCookieHeader,
} from "@/lib/admin/session"

type AdminAuthConfig = {
  passwordHash: string
  sessionSecret: string
}

export function getAdminAuthConfig(): AdminAuthConfig | null {
  const passwordHash = process.env.ADMIN_PASSWORD_HASH?.trim() ?? ""
  const sessionSecret = process.env.ADMIN_SESSION_SECRET?.trim() ?? ""

  if (!passwordHash || !sessionSecret) {
    return null
  }

  return {
    passwordHash,
    sessionSecret,
  }
}

export async function verifyAdminPassword(
  password: string,
  passwordHash: string
): Promise<boolean> {
  try {
    return await compare(password, passwordHash)
  } catch {
    return false
  }
}

export async function createAdminAuthToken(config: AdminAuthConfig): Promise<string> {
  return createAdminSessionToken(config.sessionSecret, ADMIN_SESSION_TTL_SECONDS)
}

export function getAdminSessionCookieOptions(token: string) {
  return {
    name: ADMIN_SESSION_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    maxAge: ADMIN_SESSION_TTL_SECONDS,
  }
}

export function clearAdminSessionCookie(response: NextResponse): NextResponse {
  response.cookies.set({
    name: ADMIN_SESSION_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  })
  return response
}

export async function requireAdminRequest(
  request: Request
): Promise<{ ok: true } | { ok: false; response: NextResponse }> {
  const config = getAdminAuthConfig()
  if (!config) {
    return {
      ok: false,
      response: NextResponse.json(
        { success: false, message: "Admin auth is not configured." },
        { status: 503 }
      ),
    }
  }

  const authorized = await isAdminSessionValidFromCookieHeader(
    request.headers.get("cookie"),
    config.sessionSecret
  )

  if (!authorized) {
    return {
      ok: false,
      response: NextResponse.json(
        { success: false, message: "Unauthorized." },
        { status: 401 }
      ),
    }
  }

  return { ok: true }
}
