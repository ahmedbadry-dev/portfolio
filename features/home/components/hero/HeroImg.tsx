import Image from "next/image";
import ME from "@/public/me/me6.png";
import Orbit3D from "@/components/shared/Orbit3D";
import { StaggerContainer, StaggerItem } from "@/features/animations/motion/Stagger";
import { heroOrbitImages } from "@/data/home";

function HeroPhotoFrame({
    sizeClassName,
    imageWidth,
    imageHeight,
}: {
    sizeClassName: string
    imageWidth: number
    imageHeight: number
}) {
    return (
        <div className={`relative ${sizeClassName}`}>
            <div className="absolute inset-0 rounded-[2rem] border border-border/50 bg-linear-to-br from-background/85 via-card/90 to-muted/55 shadow-[0_20px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:shadow-[0_24px_80px_rgba(0,0,0,0.38)]" />
            <div className="absolute inset-[10px] rounded-[1.6rem] border border-white/35 bg-background/18 dark:border-white/10 dark:bg-white/4" />
            <div className="relative h-full w-full overflow-hidden rounded-[1.7rem] p-[10px]">
                <div className="relative h-full w-full overflow-hidden rounded-[1.35rem] bg-muted/30">
                    <Image
                        src={ME}
                        alt="Profile photo"
                        width={imageWidth}
                        height={imageHeight}
                        className="h-full w-full object-cover"
                        priority
                    />
                </div>
            </div>
        </div>
    )
}

export const HeroImg = () => {
    return (
        <StaggerContainer className="mx-auto flex w-full max-w-[680px] justify-center">
            <StaggerItem>
                <Orbit3D
                    images={heroOrbitImages}
                    radiusX={190}
                    radiusY={0}
                    orbitOffsetY={108}
                    duration={22}
                    itemSize={50}
                    className="mx-auto md:hidden"
                >
                    <HeroPhotoFrame sizeClassName="h-[240px] w-[240px]" imageWidth={240} imageHeight={240} />
                </Orbit3D>

                <Orbit3D
                    images={heroOrbitImages}
                    radiusX={235}
                    radiusY={0}
                    orbitOffsetY={136}
                    duration={20}
                    itemSize={58}
                    className="mx-auto hidden md:flex lg:hidden"
                >
                    <HeroPhotoFrame sizeClassName="h-[290px] w-[290px]" imageWidth={290} imageHeight={290} />
                </Orbit3D>

                <Orbit3D
                    images={heroOrbitImages}
                    radiusX={280}
                    radiusY={0}
                    orbitOffsetY={160}
                    duration={18}
                    itemSize={64}
                    className="mx-auto hidden lg:flex"
                >
                    <HeroPhotoFrame sizeClassName="h-[440px] w-[440px]" imageWidth={440} imageHeight={440} />
                </Orbit3D>
            </StaggerItem>
        </StaggerContainer>
    );
};
