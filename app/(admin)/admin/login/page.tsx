import { AdminLoginForm } from "@/features/admin/components/AdminLoginForm"

type AdminLoginPageProps = {
  searchParams: Promise<{
    next?: string
  }>
}

function toSafeNextPath(next: string | undefined): string {
  const normalized = next?.trim() ?? ""
  if (!normalized) {
    return "/admin"
  }

  // Allow only same-origin absolute paths.
  if (!normalized.startsWith("/")) {
    return "/admin"
  }

  // Reject protocol-relative redirects like //evil.example.
  if (normalized.startsWith("//")) {
    return "/admin"
  }

  return normalized
}

export default async function AdminLoginPage({
  searchParams,
}: AdminLoginPageProps) {
  const params = await searchParams
  const nextPath = toSafeNextPath(params.next)
  return <AdminLoginForm nextPath={nextPath} />
}
