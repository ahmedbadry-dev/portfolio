import {
  aboutHero,
  architectureDives,
  corePillars,
  engineeringPhilosophy,
  realSystemsBuilt,
} from "@/data/about"

export const aboutData = {
  aboutHero,
  architectureDives,
  corePillars,
  engineeringPhilosophy,
  realSystemsBuilt,
} as const

export type AboutPageData = typeof aboutData

export function getAboutPageData() {
  return aboutData
}
