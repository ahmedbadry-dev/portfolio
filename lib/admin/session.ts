import {
  ADMIN_SESSION_COOKIE_NAME,
  ADMIN_SESSION_TTL_SECONDS,
} from "@/lib/admin/constants"

type SessionPayload = {
  exp: number
  nonce: string
}

const encoder = new TextEncoder()
const decoder = new TextDecoder()

function toBase64Url(bytes: Uint8Array): string {
  let binary = ""
  for (const byte of bytes) {
    binary += String.fromCharCode(byte)
  }

  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "")
}

function fromBase64Url(value: string): Uint8Array | null {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/")
  const padding = (4 - (normalized.length % 4)) % 4
  const padded = normalized + "=".repeat(padding)

  try {
    const binary = atob(padded)
    const bytes = new Uint8Array(binary.length)
    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index)
    }
    return bytes
  } catch {
    return null
  }
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

async function hmacSign(value: string, secret: string): Promise<Uint8Array> {
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  )

  const signature = await crypto.subtle.sign(
    "HMAC",
    cryptoKey,
    encoder.encode(value)
  )

  return new Uint8Array(signature)
}

function parseSessionPayload(value: string): SessionPayload | null {
  try {
    const parsed = JSON.parse(value) as SessionPayload
    if (
      !parsed ||
      typeof parsed !== "object" ||
      typeof parsed.exp !== "number" ||
      typeof parsed.nonce !== "string"
    ) {
      return null
    }
    return parsed
  } catch {
    return null
  }
}

export function getCookieValue(cookieHeader: string | null, name: string): string | null {
  if (!cookieHeader) {
    return null
  }

  const parts = cookieHeader.split(";")
  for (const part of parts) {
    const [rawName, ...rawValue] = part.trim().split("=")
    if (rawName !== name) {
      continue
    }
    return rawValue.join("=")
  }

  return null
}

export async function createAdminSessionToken(
  secret: string,
  ttlSeconds = ADMIN_SESSION_TTL_SECONDS
): Promise<string> {
  const payload: SessionPayload = {
    exp: Math.floor(Date.now() / 1000) + ttlSeconds,
    nonce: crypto.randomUUID(),
  }

  const payloadEncoded = toBase64Url(encoder.encode(JSON.stringify(payload)))
  const signature = await hmacSign(payloadEncoded, secret)
  const signatureEncoded = toBase64Url(signature)

  return `${payloadEncoded}.${signatureEncoded}`
}

export async function verifyAdminSessionToken(
  token: string,
  secret: string
): Promise<boolean> {
  if (!token || !secret) {
    return false
  }

  const separatorIndex = token.lastIndexOf(".")
  if (separatorIndex <= 0 || separatorIndex >= token.length - 1) {
    return false
  }

  const payloadEncoded = token.slice(0, separatorIndex)
  const signatureEncoded = token.slice(separatorIndex + 1)

  const providedSignature = fromBase64Url(signatureEncoded)
  if (!providedSignature) {
    return false
  }

  const expectedSignature = await hmacSign(payloadEncoded, secret)
  if (!constantTimeEqual(providedSignature, expectedSignature)) {
    return false
  }

  const payloadBytes = fromBase64Url(payloadEncoded)
  if (!payloadBytes) {
    return false
  }

  const payload = parseSessionPayload(decoder.decode(payloadBytes))
  if (!payload) {
    return false
  }

  const now = Math.floor(Date.now() / 1000)
  return payload.exp > now
}

export async function isAdminSessionValidFromCookieHeader(
  cookieHeader: string | null,
  secret: string
): Promise<boolean> {
  const token = getCookieValue(cookieHeader, ADMIN_SESSION_COOKIE_NAME)
  if (!token) {
    return false
  }

  return verifyAdminSessionToken(token, secret)
}
