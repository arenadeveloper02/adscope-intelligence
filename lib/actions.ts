'use server'

import { prisma } from '@/lib/prisma'
import { runAnalysis } from '@/lib/adsEngine'
import type { AnalyzeResponse, RecentSearch } from '@/lib/types'

export async function analyzeCompany(query: string): Promise<AnalyzeResponse> {
  const trimmed = query.trim()
  if (!trimmed) {
    return { success: false, error: 'Enter a company name or website to analyze.' }
  }
  if (trimmed.length > 120) {
    return { success: false, error: 'Query is too long.' }
  }
  try {
    const data = runAnalysis(trimmed)
    // data.ads contains ONLY currently-live ads; totalAds is the live count.
    await prisma.adAnalysis.create({
      data: {
        query: trimmed,
        companyName: data.companyName,
        domain: data.domain,
        totalAds: data.kpis.totalAds,
        volumeScore: data.volumeScore,
      },
    })
    return { success: true, data }
  } catch {
    return { success: false, error: 'Analysis failed. Please try again.' }
  }
}

export async function getRecentSearches(): Promise<RecentSearch[]> {
  try {
    const rows = await prisma.adAnalysis.findMany({
      orderBy: { createdAt: 'desc' },
      take: 6,
    })
    return rows.map((r) => ({
      id: r.id,
      companyName: r.companyName,
      domain: r.domain,
      totalAds: r.totalAds,
      createdAt: r.createdAt.toISOString(),
    }))
  } catch {
    return []
  }
}
