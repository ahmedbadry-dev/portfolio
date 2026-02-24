import Image from "next/image";
import ME from "@/public/me/me6.png";
import Orbit3D from "@/components/shared/Orbit3D";
import { StaggerContainer, StaggerItem } from "@/features/animations/motion/Stagger";
import { heroOrbitImages } from "@/data/home";

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
                    <div className="relative h-[240px] w-[240px] overflow-hidden rounded-2xl">
                        <Image
                            src={ME}
                            alt="Profile photo"
                            width={240}
                            height={240}
                            className="h-full w-full object-cover"
                            priority
                        />
                    </div>
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
                    <div className="relative h-[290px] w-[290px] overflow-hidden rounded-2xl">
                        <Image
                            src={ME}
                            alt="Profile photo"
                            width={290}
                            height={290}
                            className="h-full w-full object-cover"
                            priority
                        />
                    </div>
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
                    <div className="relative h-[440px] w-[440px] overflow-hidden rounded-2xl">
                        <Image
                            src={ME}
                            alt="Profile photo"
                            width={390}
                            height={390}
                            className="h-full w-full object-contain aspect-square"
                            priority
                        />

                    </div>
                </Orbit3D>
            </StaggerItem>
        </StaggerContainer>
    );
};
