export const env = {
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL ?? "",
  CONVEX_URL: process.env.CONVEX_URL ?? "",
} as const;