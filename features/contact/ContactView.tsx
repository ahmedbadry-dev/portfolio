import { Container } from "@/components/layout/Container"
import ContactForm from "@/features/contact/components/ContactForm"

export function ContactView() {
  return (
    <section className="py-16 md:py-24 lg:py-32">
      <Container>
        <div className="mx-auto mb-8 max-w-2xl space-y-4 text-center md:mb-12 md:space-y-6 lg:mb-16">
          <h1 className="text-3xl font-medium tracking-tight sm:text-4xl md:text-5xl">
            Start a Conversation
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
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

