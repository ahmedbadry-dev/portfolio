import "./globals.css"
import type { Metadata } from "next"
import { Footer } from "@/components/layout/Footer"
import { cn } from "@/lib/cn"
import Particles from "@/components/Particles"
import { Navbar } from "@/components/layout/Navbar"

export const metadata: Metadata = {
  title: "AB.dev — Frontend Specialist",
  description:
    "Building cutting-edge web experiences. Elevating performance & design.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={cn(
          "min-h-screen bg-background text-foreground antialiased overflow-x-hidden"
        )}
      >
        {/* Main Frame */}
        <div className="relative mx-auto max-w-350 px-6 lg:px-8">
          <div className="relative min-h-screen overflow-hidden">
            <Navbar />
            <main className="relative">
              {children}
            </main>

            <Footer />
          </div>
        </div>

      </body>
    </html>
  )
}
