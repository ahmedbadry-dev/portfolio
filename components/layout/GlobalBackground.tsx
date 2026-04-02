export function GlobalBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-b from-background via-background to-background" />

      <div
        className="absolute -top-64 -right-56 h-[44rem] w-[44rem] rounded-full blur-3xl"
        style={{ background: "oklch(0.52 0.19 292 / 0.2)" }}
      />
      <div
        className="absolute -bottom-72 -left-56 h-[48rem] w-[48rem] rounded-full blur-3xl"
        style={{ background: "oklch(0.5 0.16 284 / 0.14)" }}
      />
      <div
        className="absolute left-1/2 top-1/3 h-80 w-80 -translate-x-1/2 rounded-full blur-3xl"
        style={{ background: "oklch(0.88 0.05 280 / 0.06)" }}
      />

      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.04] mix-blend-overlay" />
    </div>
  )
}
