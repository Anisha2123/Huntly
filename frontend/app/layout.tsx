import type { Metadata } from 'next'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Huntly — Find the Best Doctors Near You',
    template: '%s | Huntly',
  },
  description: 'Discover top-rated doctors, specialists and clinics. Read verified reviews, compare fees, and book appointments instantly.',
  keywords: ['doctors', 'specialists', 'clinics', 'healthcare', 'medical', 'appointments', 'best doctors'],
  openGraph: {
    title: 'Huntly — Find the Best Doctors Near You',
    description: 'Discover top-rated doctors and book appointments instantly.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body className="font-body antialiased">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              fontFamily: 'var(--font-dm-sans)',
              fontSize: '14px',
              borderRadius: '12px',
              border: '1px solid rgba(31,111,95,0.15)',
            },
            success: { iconTheme: { primary: '#2FA084', secondary: '#fff' } },
          }}
        />
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
