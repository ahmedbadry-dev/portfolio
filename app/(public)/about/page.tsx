import { AboutContainer } from "@/features/about/AboutContainer"
import { getAboutPageData } from "@/services/aboutService"

export default function AboutPage() {
  const data = getAboutPageData()

  return <AboutContainer data={data} />
}

