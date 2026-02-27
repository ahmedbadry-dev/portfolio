import "./globals.css"
import { Suspense } from "react"
import type { Metadata, Viewport } from "next"
import { Footer } from "@/components/layout/Footer"
import { Navbar } from "@/components/layout/Navbar"
import { RouteProgress } from "@/components/layout/RouteProgress"
import { Toaster } from "@/components/ui/sonner"
import { cn } from "@/lib/cn"
import { getMetadataBase } from "@/lib/seo"
import { ThemeProvider } from "@/components/theme-provider"

const defaultDescription =
  "Frontend Engineer building scalable Next.js + React systems with strong architecture, performance discipline, and polished UI."

const twitterCreator = process.env.NEXT_PUBLIC_TWITTER_HANDLE?.trim() || undefined

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: {
    default: "Ahmed Badry - Frontend Engineer",
    template: "%s | Ahmed Badry - Frontend Engineer",
  },
  description: defaultDescription,
  keywords: [
    "Frontend Engineer",
    "Next.js",
    "React",
    "TypeScript",
    "Performance",
    "UI Engineering",
    "Architecture",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "AB.dev",
    title: "Ahmed Badry - Frontend Engineer",
    description: defaultDescription,
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "Ahmed Badry - Frontend Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ahmed Badry - Frontend Engineer",
    description: defaultDescription,
    images: ["/og-default.png"],
    ...(twitterCreator ? { creator: twitterCreator } : {}),
  },
  icons: {
    icon: [{ url: "/favicon.ico" }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
    },
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0B0B10" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
  colorScheme: "dark light",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background text-foreground antialiased overflow-x-hidden"
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Suspense fallback={null}>
            <RouteProgress />
          </Suspense>
          <div className="relative mx-auto max-w-350 px-4 sm:px-6 lg:px-8">
            <div className="relative min-h-screen overflow-x-hidden">
              <Navbar />
              <main className="relative">
                {children}
                <Toaster position="top-center" richColors />
              </main>
              <Footer />
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
