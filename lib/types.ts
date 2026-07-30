export type AdFormat = 'Search' | 'Display' | 'Video' | 'Shopping'

export interface AdItem {
  id: string
  headline: string
  description: string
  format: AdFormat
  firstSeen: string
  region: string
  impressions: string
  status: 'Active' | 'Paused'
}

export interface AnalysisKpis {
  totalAds: number
  formatCount: number
  firstSeen: string
  regionCount: number
}

export interface FormatBreakdown {
  format: AdFormat
  count: number
  color: string
}

export interface AnalysisResult {
  companyName: string
  domain: string
  volumeScore: number
  kpis: AnalysisKpis
  formats: FormatBreakdown[]
  ads: AdItem[]
}

export interface RecentSearch {
  id: string
  companyName: string
  domain: string
  totalAds: number
  createdAt: string
}

export interface AnalyzeResponse {
  success: boolean
  error?: string
  data?: AnalysisResult
}
