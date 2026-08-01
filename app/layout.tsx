import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import { StoreProvider } from '@/lib/store'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Campus Pulse — College Event & Fest Management',
    template: '%s · Campus Pulse',
  },
  description:
    'Campus Pulse runs your college fests end to end: publish events, collect registrations, scan QR passes at the gate, issue certificates and track live analytics without a single paper form.',
  generator: 'v0.app',
  keywords: [
    'college event management',
    'fest management',
    'QR check-in',
    'student registrations',
    'campus events',
  ],
  openGraph: {
    title: 'Campus Pulse — College Event & Fest Management',
    description:
      'One platform for event registrations, QR check-in, certificates and live fest analytics.',
    type: 'website',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fbfcfe' },
    { media: '(prefers-color-scheme: dark)', color: '#101725' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        <StoreProvider>
          {children}
          <Toaster position="top-center" />
        </StoreProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
