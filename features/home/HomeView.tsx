import type { Project } from "@/data/projects"
import { Hero } from "@/features/home/components/hero/Hero"
import { SelectedWork } from "@/features/home/components/selected-work/SelectedWork"
import { HowIThink } from "@/features/home/components/how-i-think/HowIThink"
import { EngineeringPrinciples } from "@/features/home/components/testimonials/Testimonials"
import { BookingCta } from "@/features/home/components/booking-cta/BookingCta"

type HomeViewProps = {
  selectedProjects: Project[]
}

export function HomeView({ selectedProjects }: HomeViewProps) {
  return (
    <>
      <Hero />
      <SelectedWork projects={selectedProjects} />
      <HowIThink />
      <EngineeringPrinciples />
      <BookingCta />
    </>
  )
}
