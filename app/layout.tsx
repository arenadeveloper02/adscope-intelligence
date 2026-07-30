import type { Metadata, Viewport } from 'next'
import { Inter, Instrument_Serif } from 'next/font/google'
import './globals.css'
import BackgroundFX from '@/components/BackgroundFX'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
const instrumentSerif = Instrument_Serif({
  weight: '400',
  style: 'italic',
  subsets: ['latin'],
  variable: '--font-serif',
})

export const metadata: Metadata = {
  title: 'AdScope Intelligence — Google Ads Competitive Intel',
  description:
    'Enter any company name or website and see the Google Ads it is currently running — formats, regions, and volume signals.',
}

export const viewport: Viewport = {
  themeColor: '#050714',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${instrumentSerif.variable} font-sans`}>
        <BackgroundFX />
        {children}
      </body>
    </html>
  )
}
