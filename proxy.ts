import { NextRequest, NextResponse } from "next/server"
import {
  ADMIN_HOME_PATH,
  ADMIN_LOGIN_PATH,
  ADMIN_SESSION_COOKIE_NAME,
} from "@/lib/admin/constants"
import { verifyAdminSessionToken } from "@/lib/admin/session"

function isAdminAuthConfigured(): boolean {
  const sessionSecret = process.env.ADMIN_SESSION_SECRET?.trim() ?? ""
  const passwordHash = process.env.ADMIN_PASSWORD_HASH?.trim() ?? ""
  return Boolean(sessionSecret && passwordHash)
}

async function isAuthenticated(request: NextRequest): Promise<boolean> {
  const sessionSecret = process.env.ADMIN_SESSION_SECRET?.trim() ?? ""
  if (!sessionSecret) {
    return false
  }

  const token = request.cookies.get(ADMIN_SESSION_COOKIE_NAME)?.value
  if (!token) {
    return false
  }

  return verifyAdminSessionToken(token, sessionSecret)
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const configured = isAdminAuthConfigured()
  const loggedIn = await isAuthenticated(request)

  const isAdminApi = pathname.startsWith("/api/admin")
  const isLoginApi = pathname === "/api/admin/auth/login"
  const isAdminPage = pathname.startsWith("/admin")
  const isLoginPage = pathname === ADMIN_LOGIN_PATH

  if (isAdminApi) {
    if (isLoginApi) {
      if (!configured) {
        return NextResponse.json(
          { success: false, message: "Admin auth is not configured." },
          { status: 503 }
        )
      }
      return NextResponse.next()
    }

    if (!configured) {
      return NextResponse.json(
        { success: false, message: "Admin auth is not configured." },
        { status: 503 }
      )
    }

    if (!loggedIn) {
      return NextResponse.json(
        { success: false, message: "Unauthorized." },
        { status: 401 }
      )
    }

    return NextResponse.next()
  }

  if (isAdminPage) {
    if (isLoginPage) {
      if (configured && loggedIn) {
        return NextResponse.redirect(new URL(ADMIN_HOME_PATH, request.url))
      }
      return NextResponse.next()
    }

    if (!configured || !loggedIn) {
      const loginUrl = new URL(ADMIN_LOGIN_PATH, request.url)
      loginUrl.searchParams.set(
        "next",
        `${pathname}${request.nextUrl.search || ""}`
      )
      return NextResponse.redirect(loginUrl)
    }

    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
}
