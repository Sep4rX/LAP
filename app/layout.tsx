import type { Metadata } from 'next'
import { Navbar } from '@/components/Navbar'
import './globals.css'

export const metadata: Metadata = {
  title: 'AlphaEdge - Hedge Fund ML Prediction Engine',
  description: 'Real-time stock prediction analytics using ensemble ML models',
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-background text-text">
        <Navbar />
        <main className="min-h-screen bg-background">
          {children}
        </main>
      </body>
    </html>
  )
}
