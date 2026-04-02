"use client"

import { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"

type AdminLoginFormProps = {
  nextPath: string
}

export function AdminLoginForm({ nextPath }: AdminLoginFormProps) {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
        credentials: "same-origin",
      })

      const payload = (await response.json()) as {
        success?: boolean
        message?: string
      }

      if (!response.ok || !payload.success) {
        setError(payload.message || "Login failed.")
        return
      }

      router.replace(nextPath)
      router.refresh()
    } catch {
      setError("Login failed.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="mx-auto max-w-md rounded-xl border border-border/60 bg-card/40 p-6">
      <h1 className="text-lg font-semibold tracking-tight">Admin Login</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Enter the admin password to access dashboard routes.
      </p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <label className="block text-sm">
          <span className="mb-2 block text-muted-foreground">Password</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="h-10 w-full rounded-md border border-border/60 bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            autoComplete="current-password"
            required
          />
        </label>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <button
          type="submit"
          className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground disabled:opacity-60"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </section>
  )
}
