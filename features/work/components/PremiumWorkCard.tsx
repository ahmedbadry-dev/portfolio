import { memo } from "react"
import { cn } from "@/lib/cn"
import {
    StaggerContainer,
    StaggerItem,
} from "@/features/animations/motion/Stagger"
import { Glass } from "@/components/shared/Glass"

interface PremiumWorkCardProps {
    title: string
    description: string
    stack: string[]
    lighthouse?: number
    ttfb?: number
    imageCount?: number
    reverse?: boolean
}

function PremiumWorkCard({
    title,
    description,
    stack,
    lighthouse,
    ttfb,
    imageCount,
    reverse = false,
}: PremiumWorkCardProps) {
    const metrics = [
        typeof lighthouse === "number"
            ? { label: "Lighthouse", value: `${lighthouse}` }
            : null,
        typeof ttfb === "number"
            ? { label: "TTFB", value: `${ttfb}ms` }
            : null,
        typeof imageCount === "number"
            ? { label: "Images", value: `${imageCount}` }
            : null,
    ].filter((metric): metric is { label: string; value: string } => metric !== null)

    return (
        <div className="relative group rounded-3xl transition-all duration-500">
            <Glass className="rounded-3xl p-12">
                <StaggerContainer
                    className={cn(
                        "relative grid items-center gap-14",
                        reverse
                            ? "lg:grid-cols-[0.7fr_1fr_1.2fr]"
                            : "lg:grid-cols-[1.2fr_1fr_0.7fr]"
                    )}
                >

                    {/* Device */}
                    <StaggerItem>
                        <div className="h-[300px] rounded-2xl border border-border/50 bg-muted/30" />
                    </StaggerItem>

                    {/* Content */}
                    <StaggerItem>
                        <div className="space-y-6">
                            <h3 className="text-3xl font-semibold tracking-tight">
                                {title}
                            </h3>

                            <p className="text-muted-foreground leading-relaxed">
                                {description}
                            </p>

                            <div className="flex flex-wrap gap-3 pt-2">
                                {stack.map((tech) => (
                                    <span
                                        key={tech}
                                        className="rounded-full border border-border/50 px-4 py-1 text-sm text-muted-foreground"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </StaggerItem>

                    {/* Metrics */}
                    <StaggerItem>
                        <div className="space-y-4 text-sm text-muted-foreground lg:text-right">
                            {metrics.map((metric) => (
                                <div key={metric.label}>
                                    <span className="text-foreground font-medium">
                                        {metric.label}:
                                    </span>{" "}
                                    {metric.value}
                                </div>
                            ))}
                        </div>
                    </StaggerItem>

                </StaggerContainer>

            </Glass>
        </div>
    )
}

export default memo(PremiumWorkCard)
