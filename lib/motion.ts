export const motionDuration = {
  fast: 0.2,
  base: 0.3,
  slow: 0.4,
} as const

export const motionEase = {
  standard: [0.22, 1, 0.36, 1] as const,
  out: "easeOut" as const,
} as const

export const fadeInUp = {
  initial: { opacity: 0, y: 4 },
  animate: { opacity: 1, y: 0 },
} as const

