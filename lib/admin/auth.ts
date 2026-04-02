import { NextResponse } from "next/server"
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

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")
}

function hexToBytes(hex: string): Uint8Array | null {
  const normalized = hex.trim().toLowerCase()
  if (!/^[0-9a-f]+$/.test(normalized) || normalized.length % 2 !== 0) {
    return null
  }

  const bytes = new Uint8Array(normalized.length / 2)
  for (let index = 0; index < normalized.length; index += 2) {
    const chunk = normalized.slice(index, index + 2)
    bytes[index / 2] = Number.parseInt(chunk, 16)
  }
  return bytes
}

function constantTimeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) {
    return false
  }
  let result = 0
  for (let index = 0; index < a.length; index += 1) {
    result |= a[index] ^ b[index]
  }
  return result === 0
}

async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(value)
  )
  return toHex(new Uint8Array(digest))
}

export function getAdminAuthConfig(): AdminAuthConfig | null {
  const passwordHash = process.env.ADMIN_PASSWORD_HASH?.trim().toLowerCase() ?? ""
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
  const computed = await sha256Hex(password)
  const expected = hexToBytes(passwordHash)
  const actual = hexToBytes(computed)

  if (!expected || !actual) {
    return false
  }

  return constantTimeEqual(actual, expected)
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
