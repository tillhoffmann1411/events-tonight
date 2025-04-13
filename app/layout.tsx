import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import BottomNav from '../components/bottom-nav'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Dance Cologne',
  description: 'Find dance events in Cologne',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className}`} suppressHydrationWarning>
        <div className="mb-20">
          {children}
        </div>
        <BottomNav />
      </body>
    </html>
  )
}