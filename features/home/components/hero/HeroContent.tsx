"use client"

import { Button } from "@/components/ui/button"
import {
    StaggerContainer,
    StaggerItem,
} from "@/features/animations/motion/Stagger"

export default function HeroContent() {
    return (
        <div className="space-y-10">
            <StaggerContainer className="space-y-6">

                <StaggerItem>
                    <h1 className="text-6xl font-semibold tracking-tight leading-[1.05] sm:text-7xl">
                        AB.dev
                    </h1>
                </StaggerItem>

                <StaggerItem>
                    <h2 className="text-2xl font-medium text-muted-foreground">
                        Frontend Specialist
                    </h2>
                </StaggerItem>

                <StaggerItem>
                    <div className="space-y-3 text-muted-foreground text-lg ">
                        <p>Building cutting-edge web experiences</p>
                        <p>Elevating performance & design</p>
                    </div>
                </StaggerItem>

                <StaggerItem>
                    <div className="flex flex-wrap gap-5 pt-4">
                        <Button
                            size="lg"
                            className="px-8 h-12 text-base shadow-md transition"
                        >
                            View Work
                        </Button>

                        <Button
                            size="lg"
                            variant="secondary"
                            className="rounded-full px-8 h-12 text-base transition "
                        >
                            Book a Call
                        </Button>
                    </div>
                </StaggerItem>

            </StaggerContainer>
        </div>
    )
}
