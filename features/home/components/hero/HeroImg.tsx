import Image from "next/image";
import ME from "@/public/me.png";
import Orbit3D from "@/components/shared/Orbit3D";
import { StaggerContainer, StaggerItem } from "@/features/animations/motion/Stagger";

const images = [
    {
        src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
        alt: "Next.js",
        glow: "rgba(201, 205, 214, 0.42)",
        tintFrom: "rgba(255, 255, 255, 0.5)",
        tintTo: "rgba(28, 30, 36, 0.18)",
    },
    {
        src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
        alt: "React",
        glow: "rgba(88, 205, 255, 0.5)",
        tintFrom: "rgba(255, 255, 255, 0.5)",
        tintTo: "rgba(17, 95, 136, 0.2)",
    },
    {
        src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg",
        alt: "Tailwind CSS",
        glow: "rgba(44, 220, 255, 0.52)",
        tintFrom: "rgba(255, 255, 255, 0.5)",
        tintTo: "rgba(13, 133, 152, 0.2)",
    },
    {
        src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg",
        alt: "Redux Toolkit",
        glow: "rgba(162, 109, 255, 0.5)",
        tintFrom: "rgba(255, 255, 255, 0.52)",
        tintTo: "rgba(89, 48, 150, 0.2)",
    },
    {
        src: "https://cdn.simpleicons.org/convex/16A34A",
        alt: "Convex",
        glow: "rgba(68, 214, 113, 0.54)",
        tintFrom: "rgba(255, 255, 255, 0.5)",
        tintTo: "rgba(31, 119, 55, 0.22)",
    },
    {
        src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
        alt: "TypeScript",
        glow: "rgba(82, 159, 255, 0.48)",
        tintFrom: "rgba(255, 255, 255, 0.52)",
        tintTo: "rgba(35, 83, 163, 0.2)",
    },
];

export const HeroImg = () => {
    return (
        <StaggerContainer className="w-full max-w-[520px]">
            <StaggerItem>
                <Orbit3D
                    images={images}
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
                    images={images}
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
                    images={images}
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
