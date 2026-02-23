import { Hero } from "@/features/home/components/hero/Hero"
import { SelectedWork } from "@/features/home/components/selected-work/SelectedWork"
import { HowIThink } from "@/features/home/components/how-i-think/HowIThink"
import { EngineeringPrinciples } from "@/features/home/components/testimonials/Testimonials"
import { BookingCta } from "@/features/home/components/booking-cta/BookingCta"

export function HomeView() {
  return (
    <>
      <Hero />
      <SelectedWork />
      <HowIThink />
      <EngineeringPrinciples />
      <BookingCta />
    </>
  )
}
