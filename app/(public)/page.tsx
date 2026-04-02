import { PageViewTracker } from "@/features/analytics/components/PageViewTracker"
import { HomeContainer } from "@/features/home/HomeContainer"

export default function HomePage() {
  return (
    <>
      <PageViewTracker routeType="home" />
      <HomeContainer />
    </>
  )
}

