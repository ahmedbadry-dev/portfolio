import { Container } from "@/components/layout/Container"
import HeroContent from "./HeroContent"
import Particles from "@/components/Particles"
import { HeroImg } from "./HeroImg"

export function Hero() {
  return (
    <section className="relative overflow-hidden py-14 sm:py-18 lg:py-28">

      {/* 🌌 Particles Background (Hero only) */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <Particles
          particleColors={["#7c3bed"]}
          particleCount={400}
          particleSpread={8}
          speed={0.15}
          particleBaseSize={80}
          moveParticlesOnHover={false}
          alphaParticles={true}
          disableRotation
          pixelRatio={1}
        />
      </div>

      <Container>
        <div className="grid grid-cols-1 items-center gap-10 sm:gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">

          {/* Left Content */}
          <HeroContent />

          {/* Right Orb */}
          <div className="flex justify-center lg:justify-end">
            <HeroImg />
          </div>

        </div>
      </Container>
    </section>
  )
}
