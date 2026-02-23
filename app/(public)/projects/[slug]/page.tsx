import { notFound } from "next/navigation"
import { CaseStudyContainer } from "@/features/case-study/CaseStudyContainer"
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

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params
  const data = getCaseStudyPageData(slug)

  if (!data) {
    notFound()
  }

  return <CaseStudyContainer {...data} />
}

