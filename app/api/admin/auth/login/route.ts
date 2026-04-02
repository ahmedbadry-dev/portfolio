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

  const password = payload.password?.trim() ?? ""
  if (!password) {
    return NextResponse.json(
      { success: false, message: "Password is required." },
      { status: 400 }
    )
  }

  const valid = await verifyAdminPassword(password, config.passwordHash)
  if (!valid) {
    return NextResponse.json(
      { success: false, message: "Invalid credentials." },
      { status: 401 }
    )
  }

  const token = await createAdminAuthToken(config)
  const response = NextResponse.json({ success: true })
  response.cookies.set(getAdminSessionCookieOptions(token))
  return response
}
