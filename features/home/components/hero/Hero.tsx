import { Container } from "@/components/layout/Container"
import Particles from "@/components/Particles"
import HeroContent from "./HeroContent"
import { HeroImg } from "./HeroImg"

export function Hero() {
  return (
    <section className="relative overflow-visible py-10 sm:py-14 lg:overflow-hidden lg:py-28">
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <Particles
          particleColors={["#7c3bed"]}
          particleCount={500}
          particleSpread={8}
          speed={0.15}
          particleBaseSize={100}
          moveParticlesOnHover={false}
          alphaParticles
          disableRotation
          pixelRatio={3}
        />
      </div>

      <Container>
        <div className="grid grid-cols-1 items-center gap-20 sm:gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div className="order-1 flex w-full justify-center lg:justify-start">
            <HeroContent />
          </div>
          <div className="order-2 flex w-full justify-center lg:justify-end">
            <HeroImg />
          </div>
        </div>
      </Container>
    </section>
  )
}
