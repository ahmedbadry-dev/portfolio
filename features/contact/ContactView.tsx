import { Container } from "@/components/layout/Container"
import ContactForm from "@/features/contact/components/ContactForm"

export function ContactView() {
  return (
    <section className="py-32">
      <Container>
        <div className="mx-auto mb-16 max-w-2xl space-y-6 text-center">
          <h1 className="text-4xl font-medium tracking-tight md:text-5xl">
            Start a Conversation
          </h1>
          <p className="leading-relaxed text-muted-foreground">
            Tell me about your product, timeline, and goals.
          </p>
        </div>

        <div className="mx-auto max-w-xl">
          <ContactForm />
        </div>
      </Container>
    </section>
  )
}

