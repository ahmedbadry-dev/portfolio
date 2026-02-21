import { Container } from "@/components/layout/Container"
import { Input } from "@/components/ui/input"
import ContactForm from "@/features/contact/components/ContactForm"

export default function ContactPage() {
    return (
        <section className="py-32">
            <Container>
                <div className="mx-auto max-w-2xl text-center space-y-6 mb-16">
                    <h1 className="text-4xl md:text-5xl font-medium tracking-tight">
                        Start a Conversation
                    </h1>
                    <p className="text-muted-foreground leading-relaxed">
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