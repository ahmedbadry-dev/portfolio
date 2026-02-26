import type { Metadata } from "next"
import { AboutContainer } from "@/features/about/AboutContainer"
import { buildPageMetadata } from "@/lib/seo"
import { getAboutPageData } from "@/services/aboutService"

export function generateMetadata(): Metadata {
  return buildPageMetadata({
    title: "About",
    description:
      "Senior Frontend Engineer focused on scalable architecture, rendering performance, and resilient UI systems in Next.js and React.",
    pathname: "/about",
  })
}

export default function AboutPage() {
  const data = getAboutPageData()

  return <AboutContainer data={data} />
}

