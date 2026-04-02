import { ConvexHttpClient } from "convex/browser"

export function getConvexServerUrl(): string {
  const convexUrl =
    process.env.CONVEX_URL?.trim() || process.env.NEXT_PUBLIC_CONVEX_URL?.trim() || ""

  if (!convexUrl) {
    throw new Error("Convex URL is not configured.")
  }

  return convexUrl
}

export function getConvexAdminMutationKey(): string {
  const adminKey = process.env.CONVEX_ADMIN_MUTATION_KEY?.trim() ?? ""
  if (!adminKey) {
    throw new Error("CONVEX_ADMIN_MUTATION_KEY is not configured.")
  }
  return adminKey
}

export function getConvexServerClient(): ConvexHttpClient {
  return new ConvexHttpClient(getConvexServerUrl())
}

