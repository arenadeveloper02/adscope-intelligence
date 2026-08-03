import { getRecentSearches } from '@/lib/actions'
import HomeClient from '@/components/HomeClient'

export const dynamic = 'force-dynamic'
// The analysis workflow can run for several minutes — give the server action
// invoked from this segment enough time to finish instead of being killed
// mid-flight (which surfaced as a generic "Analysis failed" error).
export const maxDuration = 300

export default async function HomePage() {
  const recentSearches = await getRecentSearches()
  return <HomeClient recentSearches={recentSearches} />
}
