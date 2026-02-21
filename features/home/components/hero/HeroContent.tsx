import { Button } from "@/components/ui/button"
import {
    StaggerContainer,
    StaggerItem,
} from "@/features/animations/motion/Stagger"

export default function HeroContent() {
    return (
        <div className="space-y-7 text-center sm:space-y-9 lg:text-left">
            <StaggerContainer className="space-y-5 sm:space-y-6">

                <StaggerItem>
                    <h1 className="text-4xl font-semibold leading-[1.05] tracking-tight md:text-5xl lg:text-6xl">
                        AB.dev
                    </h1>
                </StaggerItem>

                <StaggerItem>
                    <h2 className="text-lg font-medium text-muted-foreground sm:text-xl lg:text-2xl">
                        Frontend Specialist
                    </h2>
                </StaggerItem>

                <StaggerItem>
                    <div className="space-y-2 text-base text-muted-foreground sm:space-y-3 sm:text-lg">
                        <p>Building cutting-edge web experiences</p>
                        <p>Elevating performance & design</p>
                    </div>
                </StaggerItem>

                <StaggerItem>
                    <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4 lg:justify-start lg:gap-5 lg:pt-4">
                        <Button
                            size="lg"
                            className="h-11 w-full px-6 text-sm shadow-md transition sm:w-auto sm:px-8 sm:text-base"
                        >
                            View Work
                        </Button>

                        <Button
                            size="lg"
                            variant="secondary"
                            className="h-11 w-full rounded-full px-6 text-sm transition sm:w-auto sm:px-8 sm:text-base"
                        >
                            Book a Call
                        </Button>
                    </div>
                </StaggerItem>

            </StaggerContainer>
        </div>
    )
}
