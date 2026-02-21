import { z } from 'zod'

export const contactSchema = z.object({
  name: z.string().min(2, 'Please enter your name.'),
  email: z.email('Enter a valid email.'),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters.')
    .max(400, 'Message must not exceed 400 characters.'),
  website: z.string().optional(), // honeypot
})

export type ContactInput = z.infer<typeof contactSchema>
