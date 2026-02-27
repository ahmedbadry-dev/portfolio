import type { Metadata } from "next"

type BuildPageMetadataInput = {
  title: string
  description: string
  pathname: string
  image?: string
}

const FALLBACK_SITE_URL = "https://your-domain-here.com"

function normalizeSiteUrl(input: string): string {
  const trimmed = input.trim()
  if (!trimmed) {
    return FALLBACK_SITE_URL
  }

  const withProtocol = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`

  return withProtocol.replace(/\/+$/, "")
}

export function getSiteUrl(): string {
  const rawSiteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? process.env.VERCEL_URL ?? FALLBACK_SITE_URL

  return normalizeSiteUrl(rawSiteUrl)
}

export function getMetadataBase(): URL {
  return new URL(getSiteUrl())
}

export function absoluteUrl(pathname: string): string {
  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`
  return new URL(normalizedPath, getSiteUrl()).toString()
}

export function buildPageMetadata({
  title,
  description,
  pathname,
  image = "/opengraph-image",
}: BuildPageMetadataInput): Metadata {
  const canonical = absoluteUrl(pathname)
  const imageUrl = absoluteUrl(image)

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: canonical,
      siteName: "AB.dev",
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: "Ahmed Badry - Frontend Engineer",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  }
}
