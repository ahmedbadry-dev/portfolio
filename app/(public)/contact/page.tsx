import type { Metadata } from "next"
import { ContactContainer } from "@/features/contact/ContactContainer"
import { buildPageMetadata } from "@/lib/seo"

export function generateMetadata(): Metadata {
  return buildPageMetadata({
    title: "Contact",
    description:
      "Collaborate on high-quality frontend systems, performance optimization, and UI architecture for product-focused teams.",
    pathname: "/contact",
  })
}

export default function ContactPage() {
  return <ContactContainer />
}

