import { AboutView } from "@/features/about/AboutView"
import type { AboutPageData } from "@/services/aboutService"

type AboutContainerProps = {
  data: AboutPageData
}

export function AboutContainer({ data }: AboutContainerProps) {
  return <AboutView data={data} />
}
