import type { CanonicalProject } from "@/lib/projects/schema"

export type AdminSubmission = {
  _id: string
  _creationTime: number
  name: string
  email: string
  message: string
  createdAt: number
  read: boolean
}

export type AdminProject = CanonicalProject & {
  _id: string
  _creationTime: number
}

export type AdminAnalyticsSummary = {
  totals: {
    totalViews: number
    uniqueVisitors: number
    homeViews: number
    workViews: number
    projectViews: number
  }
  topProjects: Array<{
    slug: string
    views: number
  }>
  lastViewedAt: number | null
}
