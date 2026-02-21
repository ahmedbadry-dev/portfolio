import Image from "next/image";
import ME from "@/public/me.png";
import Orbit3D from "@/components/shared/Orbit3D";
import { StaggerContainer, StaggerItem } from "@/features/animations/motion/Stagger";
import { heroOrbitImages } from "@/data/home";

export const HeroImg = () => {
    return (
        <StaggerContainer className="w-full max-w-[520px]">
            <StaggerItem>
                <Orbit3D
                    images={heroOrbitImages}
                    radiusX={165}
                    radiusY={0}
                    orbitOffsetY={92}
                    duration={22}
                    itemSize={46}
                    className="mx-auto md:hidden"
                >
                    <Image
                        src={ME}
                        alt="Profile photo"
                        width={200}
                        height={200}
                        className="h-[200px] w-[200px] rounded-2xl shadow-2xl"
                        priority
                    />
                </Orbit3D>

                <Orbit3D
                    images={heroOrbitImages}
                    radiusX={200}
                    radiusY={0}
                    orbitOffsetY={118}
                    duration={20}
                    itemSize={54}
                    className="mx-auto hidden md:flex lg:hidden"
                >
                    <Image
                        src={ME}
                        alt="Profile photo"
                        width={236}
                        height={236}
                        className="h-[236px] w-[236px] rounded-2xl shadow-2xl"
                        priority
                    />
                </Orbit3D>

                <Orbit3D
                    images={heroOrbitImages}
                    radiusX={230}
                    radiusY={0}
                    orbitOffsetY={140}
                    duration={18}
                    itemSize={60}
                    className="mx-auto hidden lg:flex"
                >
                    <Image
                        src={ME}
                        alt="Profile photo"
                        width={260}
                        height={260}
                        className="h-[260px] w-[260px] rounded-2xl shadow-2xl"
                        priority
                    />
                </Orbit3D>
            </StaggerItem>
        </StaggerContainer>
    );
};
