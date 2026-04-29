"use client";


import Link from 'next/link'
import { Heart } from 'lucide-react'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-cormorant',
})
const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  display: 'swap',
  variable: '--font-dm',
})

const SPECIALIZATIONS = ['Cardiologist', 'Dermatologist', 'Dentist', 'Orthopedist', 'Neurologist', 'Pediatrician']
const LOCALITIES       = ['Malviya Nagar', 'Vaishali Nagar', 'C-Scheme', 'Mansarovar', 'Tonk Road', 'Raja Park']
const COMPANY          = ['About Us', 'Careers', 'Press', 'Blog', 'Help Center', 'Privacy Policy', 'Terms of Service']

function HuntlyLogo({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ftLg" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#D25380" />
          <stop offset="60%"  stopColor="#E08E6D" />
          <stop offset="100%" stopColor="#F6C391" />
        </linearGradient>
      </defs>
      <path d="M18 2C12.477 2 8 6.477 8 12c0 7.5 10 22 10 22s10-14.5 10-22C28 6.477 23.523 2 18 2Z" fill="url(#ftLg)" />
      <rect x="16"   y="7.5"  width="4"  height="9" rx="1.5" fill="#FFFAF4" />
      <rect x="13"   y="10.5" width="10" height="3" rx="1.5" fill="#FFFAF4" />
    </svg>
  )
}

const linkStyle = {
  fontSize: 13, fontWeight: 300,
  color: 'rgba(255,250,244,0.45)',
  textDecoration: 'none',
  transition: 'color .15s ease',
  display: 'block',
}

export default function Footer() {
  return (
    <footer
      className={`${cormorant.variable} ${dmSans.variable} relative mt-20 overflow-hidden`}
      style={{
        /* Dark rose — exact same hue as #D25380, lightness ~20% */
        background: '#50152A',
        color: '#FFFAF4',
        fontFamily: 'var(--font-dm)',
      }}
    >
      {/* ── Atmosphere ── */}

      {/* Rose mid-bloom — top centre */}
      <div className="absolute pointer-events-none"
        style={{
          top: 0, left: '50%', transform: 'translateX(-50%)',
          width: '70%', height: '50%',
          background: 'radial-gradient(ellipse 80% 80% at 50% 0%, rgba(210,83,128,0.25) 0%, transparent 65%)',
        }} />

      {/* Peach warmth — bottom right */}
      <div className="absolute pointer-events-none"
        style={{
          bottom: 0, right: 0, width: '40%', height: '50%',
          background: 'radial-gradient(ellipse 70% 70% at 100% 100%, rgba(224,142,109,0.12) 0%, transparent 65%)',
        }} />

      {/* Amber left edge */}
      <div className="absolute pointer-events-none"
        style={{
          top: 0, left: 0, width: '30%', height: '40%',
          background: 'radial-gradient(ellipse 60% 60% at 0% 0%, rgba(246,195,145,0.07) 0%, transparent 65%)',
        }} />

      {/* Noise grain */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.045,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px',
        }} />

      {/* Top glow line */}
      <div className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(to right, transparent, rgba(246,195,145,0.35) 30%, rgba(210,83,128,0.5) 50%, rgba(246,195,145,0.35) 70%, transparent)' }} />

      {/* ── Content ── */}
      <div className="relative z-10 max-w-[1240px] mx-auto px-8 lg:px-12 pt-16 pb-8">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">

          {/* ── Brand ── */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <HuntlyLogo size={36} />
              <div>
                <div style={{
                  fontFamily: 'var(--font-cormorant), serif',
                  fontSize: 24, fontWeight: 600,
                  letterSpacing: '-0.02em', color: '#FFFAF4', lineHeight: 1,
                }}>
                  Hunt<em style={{ fontStyle: 'italic', color: '#F6C391' }}>ly</em>
                </div>
                <div style={{
                  fontFamily: 'var(--font-dm)',
                  fontSize: 8, fontWeight: 400,
                  letterSpacing: '0.22em', textTransform: 'uppercase',
                  color: 'rgba(255,250,244,0.35)', marginTop: 2,
                }}>
                  Find Better Doctors
                </div>
              </div>
            </div>

            <p style={{
              fontSize: 13, fontWeight: 300, lineHeight: 1.8,
              color: 'rgba(255,250,244,0.42)', marginBottom: 20, maxWidth: 240,
            }}>
              Jaipur's most trusted platform to discover and connect with verified, top-rated doctors and specialists.
            </p>

            {/* Socials */}
            <div className="flex gap-2">
              {[
                { id: 'tw', label: 'X'  },
                { id: 'fb', label: 'f'  },
                { id: 'in', label: 'in' },
                { id: 'yt', label: '▶' },
              ].map(s => (
                <div key={s.id}
                  className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer text-[11px] font-semibold transition-all duration-150 hover:-translate-y-0.5"
                  style={{
                    color: 'rgba(255,250,244,0.4)',
                    background: 'rgba(255,250,244,0.07)',
                    border: '1px solid rgba(255,250,244,0.1)',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement
                    el.style.background = 'rgba(246,195,145,0.18)'
                    el.style.color = '#F6C391'
                    el.style.borderColor = 'rgba(246,195,145,0.3)'
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement
                    el.style.background = 'rgba(255,250,244,0.07)'
                    el.style.color = 'rgba(255,250,244,0.4)'
                    el.style.borderColor = 'rgba(255,250,244,0.1)'
                  }}
                >
                  {s.label}
                </div>
              ))}
            </div>
          </div>

          {/* ── Specialists ── */}
          <div>
            <h4 style={{
              fontSize: 10, fontWeight: 600, letterSpacing: '0.18em',
              textTransform: 'uppercase', color: '#F6C391', opacity: 0.7,
              marginBottom: 18,
            }}>
              Specialists
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {SPECIALIZATIONS.map(s => (
                <li key={s}>
                  <Link href={`/doctors?specialization=${s.toLowerCase()}&city=jaipur`}
                    style={linkStyle}
                    onMouseEnter={e => (e.currentTarget.style.color = '#F6C391')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,250,244,0.45)')}>
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Jaipur Areas ── */}
          <div>
            <h4 style={{
              fontSize: 10, fontWeight: 600, letterSpacing: '0.18em',
              textTransform: 'uppercase', color: '#F6C391', opacity: 0.7,
              marginBottom: 18,
            }}>
              Jaipur Areas
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {LOCALITIES.map(loc => (
                <li key={loc}>
                  <Link
                    href={`/doctors?city=jaipur&area=${loc.toLowerCase().replace(/\s+/g, '-')}`}
                    style={linkStyle}
                    onMouseEnter={e => (e.currentTarget.style.color = '#F6C391')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,250,244,0.45)')}>
                    Doctors in {loc}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Company ── */}
          <div>
            <h4 style={{
              fontSize: 10, fontWeight: 600, letterSpacing: '0.18em',
              textTransform: 'uppercase', color: '#F6C391', opacity: 0.7,
              marginBottom: 18,
            }}>
              Company
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {COMPANY.map(item => (
                <li key={item}>
                  <Link href="#"
                    style={linkStyle}
                    onMouseEnter={e => (e.currentTarget.style.color = '#F6C391')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,250,244,0.45)')}>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Divider ── */}
        <div style={{
          height: 1, marginBottom: 20,
          background: 'linear-gradient(to right, transparent, rgba(246,195,145,0.2) 20%, rgba(210,83,128,0.25) 50%, rgba(246,195,145,0.2) 80%, transparent)',
        }} />

        {/* ── Bottom bar ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p style={{ fontSize: 12, color: 'rgba(255,250,244,0.25)', fontWeight: 300 }} suppressHydrationWarning>
            © <span suppressHydrationWarning>{new Date().getFullYear()}</span> Huntly. All rights reserved.
          </p>
          <p style={{ fontSize: 12, color: 'rgba(255,250,244,0.25)', fontWeight: 300, display: 'flex', alignItems: 'center', gap: 5 }}>
            Made with
            <Heart size={11} style={{ color: '#D25380', fill: '#D25380', flexShrink: 0 }} />
            for better healthcare in Jaipur
          </p>
        </div>
      </div>
    </footer>
  )
}