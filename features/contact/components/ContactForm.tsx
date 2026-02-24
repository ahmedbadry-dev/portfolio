"use client"

import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { contactSchema, type ContactInput } from "@/features/contact/schema"
import { toast } from "sonner"

import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card"

import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function ContactForm() {
  const {
    handleSubmit,
    reset,
    control,
    register,
    formState: { isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
      website: "",
    },
    mode: "onBlur",
  })

  async function onSubmit(values: ContactInput) {
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        let message = "Something went wrong"
        try {
          const data: { message?: string } = await response.json()
          if (data.message) {
            message = data.message
          }
        } catch {
          // Keep fallback message.
        }
        throw new Error(message)
      }

      toast.success("Message sent successfully")
      reset()
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong"
      toast.error(message)
    }
  }

  return (
    <Card className="w-full border-0 bg-card/40 backdrop-blur-xl">
      <CardContent>
        <form id="contact-form" onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>

            {/* Honeypot */}
            <input
              type="text"
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
              {...register("website")}
            />

            {/* Name */}
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Your name</FieldLabel>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    placeholder="John Doe"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Email */}
            <Controller
              name="email"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Email</FieldLabel>
                  <Input
                    {...field}
                    type="email"
                    aria-invalid={fieldState.invalid}
                    placeholder="john@example.com"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Message */}
            <Controller
              name="message"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Message</FieldLabel>

                  <InputGroup>
                    <InputGroupTextarea
                      {...field}
                      rows={6}
                      maxLength={400}
                      aria-invalid={fieldState.invalid}
                      placeholder="Tell me about your project..."
                      className="min-h-28 resize-none"
                    />
                    <InputGroupAddon align="block-end">
                      <InputGroupText className="tabular-nums">
                        {field.value.length}/400
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>

                  <FieldDescription>
                    Include goals, timeline, and technical context.
                  </FieldDescription>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter>
        <Field orientation="horizontal">
          <Button
            type="button"
            variant="outline"
            onClick={() => reset()}
            disabled={isSubmitting}
          >
            Reset
          </Button>

          <Button
            className="flex-1"
            type="submit"
            form="contact-form"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Submit"}
          </Button>
        </Field>
      </CardFooter>
    </Card>
  )
}
