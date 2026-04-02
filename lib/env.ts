function requireEnv(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback
  if (!value && process.env.NODE_ENV === "production") {
    throw new Error(`Missing required environment variable: ${key}`)
  }
  return value ?? ""
}

export const env = {
  NEXT_PUBLIC_APP_URL: requireEnv("NEXT_PUBLIC_APP_URL", "http://localhost:3000"),
  CONVEX_URL: process.env.CONVEX_URL ?? "",
  RESEND_API_KEY: process.env.RESEND_API_KEY ?? "",
} as const
