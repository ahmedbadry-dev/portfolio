import { z } from "zod"

export function toValidationMessage(error: z.ZodError): string {
  const first = error.issues[0]
  if (!first) {
    return "Validation failed."
  }
  const path = first.path.join(".")
  return path ? `${path}: ${first.message}` : first.message
}
