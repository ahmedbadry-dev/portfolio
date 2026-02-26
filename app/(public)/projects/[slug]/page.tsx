import type { Metadata } from "next"
import { Suspense } from "react"
import { notFound } from "next/navigation"
import { CaseStudyPageSkeleton } from "@/components/layout/RouteSkeletons"
import { getProjectBySlug } from "@/data/projects"
import { CaseStudyContainer } from "@/features/case-study/CaseStudyContainer"
import { absoluteUrl } from "@/lib/seo"
import {
  getCaseStudyPageData,
  getCaseStudyStaticParams,
} from "@/services/caseStudyService"

interface Props {
  params: Promise<{
    slug: string
  }>
}

export function generateStaticParams() {
  return getCaseStudyStaticParams()
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const project = getProjectBySlug(slug)

  if (!project) {
    return {
      title: "Project Not Found",
      description: "The requested project case study could not be found.",
      alternates: {
        canonical: absoluteUrl(`/projects/${slug}`),
      },
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  const canonical = absoluteUrl(`/projects/${slug}`)
  const projectImage = project.screenshots.desktop[0]
  const screenshotImage = projectImage ? absoluteUrl(projectImage) : null
  const dynamicOgImage = absoluteUrl(`/projects/${slug}/opengraph-image`)
  const fallbackImage = absoluteUrl("/og-default.png")

  const imageCandidates = [screenshotImage, dynamicOgImage, fallbackImage].filter(
    (image): image is string => Boolean(image)
  )

  const description = project.seo.description || project.shortDescription
  const title = project.seo.title || project.meta.title

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "article",
      locale: "en_US",
      url: canonical,
      siteName: "AB.dev",
      title,
      description,
      images: imageCandidates.map((url, index) => ({
        url,
        ...(index > 0 ? { width: 1200, height: 630 } : {}),
        alt: `${project.meta.title} case study preview`,
      })),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: imageCandidates,
    },
  }
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params
  const data = getCaseStudyPageData(slug)

  if (!data) {
    notFound()
  }

  return (
    <Suspense fallback={<CaseStudyPageSkeleton />}>
      <CaseStudyContainer {...data} />
    </Suspense>
  )
}

