import { CaseStudyView } from "@/features/case-study/CaseStudyView"
import type { CaseStudyPageData } from "@/services/caseStudyService"

type CaseStudyContainerProps = CaseStudyPageData

export function CaseStudyContainer(props: CaseStudyContainerProps) {
  return <CaseStudyView {...props} />
}

