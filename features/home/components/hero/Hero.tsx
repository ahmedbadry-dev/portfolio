import { Container } from "@/components/layout/Container"
import HeroContent from "./HeroContent"
import Particles from "@/components/Particles"
import { HeroImg } from "./HeroImg"

export function Hero() {
  return (
    <section className="relative overflow-visible py-14 sm:py-18 lg:overflow-hidden lg:py-28">

      {/* 🌌 Particles Background (Hero only) */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <Particles
          particleColors={["#7c3bed"]}
          particleCount={500}
          particleSpread={8}
          speed={0.15}
          particleBaseSize={100}
          moveParticlesOnHover={false}
          alphaParticles={true}
          disableRotation
          pixelRatio={3}
        />
      </div>

      <Container>
        <div className="grid grid-cols-1 items-center gap-20  lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">

          {/* Left Content */}
          <div className="order-1 flex w-full justify-center lg:order-1 lg:justify-start">
            <HeroContent />
          </div>

          {/* Right Orb */}
          <div className="order-2 flex w-full justify-center lg:order-2 lg:justify-end">
            <HeroImg />
          </div>

        </div>
      </Container>
    </section>
  )
}
