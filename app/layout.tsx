import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'The Federal — YouTube Trends',
  description: 'Editorial intelligence for discovering rising YouTube topics and stories.',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
