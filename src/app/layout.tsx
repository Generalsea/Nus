import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'NUS — Daily Operating Assistant',
  description: 'A focused operating assistant for professional workflows.',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar-EG" dir="rtl">
      <body>{children}</body>
    </html>
  )
}
