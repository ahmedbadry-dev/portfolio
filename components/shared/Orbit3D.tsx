"use client";

import React from "react";

type OrbitImage = {
  src: string;
  alt?: string;
  glow?: string;
  tintFrom?: string;
  tintTo?: string;
};

type Orbit3DProps = {
  images: Array<string | OrbitImage>;
  radius?: number;
  radiusX?: number;
  radiusY?: number;
  orbitOffsetX?: number;
  orbitOffsetY?: number;
  duration?: number;
  itemSize?: number;
  className?: string;
  children?: React.ReactNode;
};

export default function Orbit3D({
  images,
  radius = 220,
  radiusX,
  radiusY,
  orbitOffsetX = 0,
  orbitOffsetY = 0,
  duration = 18,
  itemSize = 80,
  className,
  children,
}: Orbit3DProps) {
  const safeImages = images.filter(Boolean);

  const orbitRadiusX = radiusX ?? radius;
  const orbitRadiusY = radiusY ?? radius;
  const ratio = orbitRadiusX > 0 ? Math.min(Math.max(orbitRadiusY / orbitRadiusX, 0), 1) : 0;
  const tiltDeg = Math.asin(ratio) * (180 / Math.PI);

  const containerWidth = Math.max(orbitRadiusX * 2 + itemSize + 24, itemSize * 3);
  const containerHeight = Math.max(orbitRadiusY * 2 + itemSize + 24, itemSize * 3);

  return (
    <div
      className={`orbit-3d-scene relative flex items-center justify-center ${className ?? ""}`}
      style={{
        width: containerWidth,
        height: containerHeight,
        ["--orbit-duration" as string]: `${duration}s`,
        ["--orbit-tilt" as string]: `${tiltDeg}deg`,
        ["--orbit-offset-x" as string]: `${orbitOffsetX}px`,
        ["--orbit-offset-y" as string]: `${orbitOffsetY}px`,
      }}
    >
      <div className="orbit-3d-stage absolute inset-0">
        <div className="orbit-3d-center">{children}</div>

        <div className="orbit-3d-track absolute inset-0">
          {safeImages.map((rawItem, index) => {
            const item = typeof rawItem === "string" ? { src: rawItem } : rawItem;
            const angle = (360 / safeImages.length) * index;
            const delay = `-${(duration * index) / safeImages.length}s`;

            return (
              <div
                key={`${item.src}-${index}`}
                className="orbit-3d-item"
                style={{
                  width: itemSize,
                  height: itemSize,
                  transform: `translate(-50%, -50%) rotateY(${angle}deg) translateZ(${orbitRadiusX}px)`,
                  ["--orbit-angle" as string]: `${angle}deg`,
                  ["--orbit-delay" as string]: delay,
                }}
              >
                <div className="orbit-3d-facing">
                  <div
                    className="orbit-3d-visual orbit-3d-badge"
                    style={{
                      ["--orbit-glow" as string]: item.glow ?? "rgba(144, 158, 184, 0.45)",
                      ["--orbit-tint-from" as string]: item.tintFrom ?? "rgba(255, 255, 255, 0.42)",
                      ["--orbit-tint-to" as string]: item.tintTo ?? "rgba(255, 255, 255, 0.1)",
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.src}
                      alt={item.alt ?? "Technology icon"}
                      loading="lazy"
                      className="orbit-3d-icon"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
