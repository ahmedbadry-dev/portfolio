import { Container } from "@/components/layout/Container"
import HeroContent from "./HeroContent"
import Particles from "@/components/Particles"

export function Hero() {
  return (
    <section className="relative overflow-hidden py-28">

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
        <div className="grid items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">

          {/* Left Content */}
          <HeroContent />

          {/* Right Orb */}
          {/* <div className="relative flex justify-center lg:justify-end">

            <div className="absolute h-[500px] w-[500px] rounded-full bg-primary/20 blur-[140px]" />

            <div className="relative h-[380px] w-[380px] rounded-full border border-primary/20 bg-gradient-to-br from-primary/30 via-primary/10 to-background shadow-2xl backdrop-blur-xl" />

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-[420px] w-[420px] rounded-full border border-border/40 opacity-40" />
            </div>

          </div> */}

        </div>
      </Container>
    </section>
  )
}
