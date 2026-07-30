import { getRecentSearches } from '@/lib/actions'
import HomeClient from '@/components/HomeClient'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const recentSearches = await getRecentSearches()
  return <HomeClient recentSearches={recentSearches} />
}
