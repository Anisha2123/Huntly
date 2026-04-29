'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X, Search, User, Heart, LogOut, ChevronDown, MapPin } from 'lucide-react'
import { useAuthStore } from '@/lib/store'
import { getInitials } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import toast from 'react-hot-toast'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-cormorant',
})
const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-dm',
})

/* ── Logo SVG ── */
function Logo({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="navLg" x1="0" y1="0" x2="30" y2="30" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#D25380" />
          <stop offset="55%"  stopColor="#E08E6D" />
          <stop offset="100%" stopColor="#F6C391" />
        </linearGradient>
      </defs>
      <path d="M15 1.5C10.306 1.5 6.5 5.306 6.5 10c0 6.25 8.5 18.5 8.5 18.5S23.5 16.25 23.5 10c0-4.694-3.806-8.5-8.5-8.5Z" fill="url(#navLg)" />
      <rect x="13.5" y="6.5"  width="3"  height="7"   rx="1.25" fill="#FFFAF4" />
      <rect x="11"   y="9"    width="8"  height="2.5" rx="1.25" fill="#FFFAF4" />
    </svg>
  )
}

const NAV_LINKS = [
  { label: 'Home',   href: '/' },
  { label: 'Find Doctors',   href: '/doctors' },
  { label: 'Online Consult', href: '/doctors?availableOnline=true' },
]

export default function Navbar() {
  const [open,        setOpen]        = useState(false)
  const [scrolled,    setScrolled]    = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = () => {
    logout(); setProfileOpen(false)
    toast.success('Signed out')
    router.push('/')
  }

  /* close dropdown on outside click */
  useEffect(() => {
    if (!profileOpen) return
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('[data-profile-menu]')) setProfileOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [profileOpen])

  return (
    <header
      className={`${cormorant.variable} ${dmSans.variable} fixed inset-x-0 top-0 z-50 transition-all duration-500`}
      style={{
        fontFamily: 'var(--font-dm)',
        background: scrolled ? 'rgba(255,250,244,0.97)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
        boxShadow: scrolled
          ? '0 1px 0 rgba(210,83,128,0.08), 0 4px 24px rgba(210,83,128,0.07)'
          : 'none',
      }}
    >
      {/* ── Nav bar ── */}
      <nav className="max-w-[1240px] mx-auto px-8 lg:px-12 h-[68px] flex items-center justify-between gap-8">

        {/* ── Wordmark ── */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <Logo size={28} />
          <span style={{
            fontFamily: 'var(--font-cormorant), serif',
            fontSize: 22, fontWeight: 600,
            letterSpacing: '-0.02em',
            color: '#2A1520',
            lineHeight: 1,
            transition: 'color .2s',
          }}>
            Hunt<em style={{ fontStyle: 'italic', color: '#D25380' }}>ly</em>
          </span>
        </Link>

        {/* ── Centre pill nav ── */}
        <div className="hidden md:flex items-center"
          style={{
            background: scrolled ? 'rgba(210,83,128,0.05)' : 'rgba(255,250,244,0.12)',
            border: scrolled ? '1px solid rgba(210,83,128,0.1)' : '1px solid rgba(255,255,255,0.2)',
            borderRadius: 100,
            padding: '4px',
            backdropFilter: scrolled ? 'none' : 'blur(8px)',
            transition: 'all .4s ease',
          }}>
          {NAV_LINKS.map(({ label, href }) => (
            <Link key={label} href={href}
              style={{
                fontFamily: 'var(--font-dm)',
                fontSize: 13, fontWeight: 500,
                letterSpacing: '0.01em',
                color: scrolled ? '#7A3A50' : 'rgba(42,21,32,0.75)',
                padding: '7px 16px',
                borderRadius: 100,
                textDecoration: 'none',
                transition: 'all .18s ease',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement
                el.style.background = 'rgba(210,83,128,0.09)'
                el.style.color = '#D25380'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement
                el.style.background = 'transparent'
                el.style.color = scrolled ? '#7A3A50' : 'rgba(42,21,32,0.75)'
              }}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* ── Right actions ── */}
        <div className="hidden md:flex items-center gap-2">

          {/* Search icon */}
          <Link href="/doctors"
            className="flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200"
            style={{ color: '#7A3A50' }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement
              el.style.background = 'rgba(210,83,128,0.08)'
              el.style.color = '#D25380'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement
              el.style.background = 'transparent'
              el.style.color = '#7A3A50'
            }}
          >
            <Search size={16} strokeWidth={2} />
          </Link>

          {isAuthenticated && user ? (
            <div className="relative" data-profile-menu>
              <button
                onClick={() => setProfileOpen(p => !p)}
                className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border transition-all duration-200 cursor-pointer"
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(210,83,128,0.15)',
                  color: '#2A1520',
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(210,83,128,0.3)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(210,83,128,0.15)')}
              >
                {/* Avatar */}
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0"
                  style={{ background: 'linear-gradient(135deg,#D25380,#E08E6D)' }}>
                  {getInitials(user.name)}
                </div>
                <span style={{ fontFamily: 'var(--font-dm)', fontSize: 13, fontWeight: 500, color: '#2A1520' }}>
                  {user.name.split(' ')[0]}
                </span>
                <ChevronDown size={12} style={{ color: '#AA8090', transition: 'transform .2s', transform: profileOpen ? 'rotate(180deg)' : 'none' }} />
              </button>

              {/* Dropdown */}
              {profileOpen && (
                <div className="absolute right-0 top-[calc(100%+10px)] w-[220px] overflow-hidden z-50"
                  style={{
                    background: '#FFFAF4',
                    border: '1px solid rgba(210,83,128,0.1)',
                    borderRadius: 18,
                    boxShadow: '0 8px 40px rgba(42,21,32,0.12), 0 2px 8px rgba(42,21,32,0.06)',
                    animation: 'navDropIn .18s cubic-bezier(.16,1,.3,1)',
                  }}>
                  {/* User info */}
                  <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(210,83,128,0.07)' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#2A1520' }}>{user.name}</div>
                    <div style={{ fontSize: 11, color: '#AA8090', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</div>
                  </div>
                  {[
                    { href: '/dashboard',          icon: <User size={13}/>,    label: 'My Dashboard' },
                    { href: '/dashboard/bookings', icon: <Heart size={13}/>,   label: 'My Bookings'  },
                  ].map(item => (
                    <Link key={item.href} href={item.href} onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 transition-colors"
                      style={{ padding: '10px 16px', fontSize: 13, color: '#7A3A50', textDecoration: 'none' }}
                      onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(210,83,128,0.05)'; el.style.color = '#D25380' }}
                      onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'transparent'; el.style.color = '#7A3A50' }}
                    >
                      {item.icon} {item.label}
                    </Link>
                  ))}
                  <div style={{ height: 1, background: 'rgba(210,83,128,0.07)', margin: '2px 0' }} />
                  <button onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 transition-colors cursor-pointer"
                    style={{ padding: '10px 16px', fontSize: 13, color: '#c0394f', background: 'transparent', border: 'none', textAlign: 'left' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(192,57,79,0.05)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <LogOut size={13} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/auth/login"
                style={{
                  fontFamily: 'var(--font-dm)', fontSize: 13, fontWeight: 500,
                  color: '#7A3A50', padding: '8px 16px',
                  borderRadius: 100, textDecoration: 'none',
                  transition: 'all .18s ease',
                }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.color = '#D25380'; el.style.background = 'rgba(210,83,128,0.07)' }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.color = '#7A3A50'; el.style.background = 'transparent' }}
              >
                Sign In
              </Link>
              <Link href="/auth/register"
                style={{
                  fontFamily: 'var(--font-dm)', fontSize: 13, fontWeight: 600,
                  color: '#fff', letterSpacing: '0.01em',
                  background: 'linear-gradient(135deg,#D25380 0%,#E08E6D 100%)',
                  padding: '9px 20px', borderRadius: 100,
                  textDecoration: 'none',
                  boxShadow: '0 2px 10px rgba(210,83,128,0.25)',
                  transition: 'all .2s ease',
                }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.opacity = '0.9'; el.style.transform = 'translateY(-1px)'; el.style.boxShadow = '0 6px 20px rgba(210,83,128,0.35)' }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.opacity = '1'; el.style.transform = 'none'; el.style.boxShadow = '0 2px 10px rgba(210,83,128,0.25)' }}
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* ── Mobile toggle ── */}
        <button
          onClick={() => setOpen(o => !o)}
          className="md:hidden w-9 h-9 flex items-center justify-center rounded-full transition-all"
          style={{ color: '#7A3A50', background: 'transparent', border: 'none', cursor: 'pointer' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(210,83,128,0.08)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          {open ? <X size={19} /> : <Menu size={19} />}
        </button>
      </nav>

      {/* ── Mobile drawer ── */}
      {open && (
        <div
          className="md:hidden"
          style={{
            background: '#FFFAF4',
            borderTop: '1px solid rgba(210,83,128,0.08)',
            padding: '12px 16px 20px',
            boxShadow: '0 12px 32px rgba(42,21,32,0.1)',
            animation: 'navDropIn .2s ease',
          }}
        >
          {/* Location hint */}
          <div className="flex items-center gap-1.5 px-4 py-2 mb-1">
            <MapPin size={11} style={{ color: '#E08E6D' }} />
            <span style={{ fontFamily: 'var(--font-dm)', fontSize: 11, color: 'rgba(42,21,32,0.35)', letterSpacing: '0.06em' }}>
              Jaipur, Rajasthan
            </span>
          </div>

          {NAV_LINKS.map(({ label, href }) => (
            <Link key={label} href={href} onClick={() => setOpen(false)}
              className="block rounded-xl transition-all"
              style={{ fontFamily: 'var(--font-dm)', fontSize: 14, fontWeight: 500, color: '#7A3A50', padding: '12px 16px', textDecoration: 'none' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(210,83,128,0.06)'; el.style.color = '#D25380' }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'transparent'; el.style.color = '#7A3A50' }}
            >
              {label}
            </Link>
          ))}

          <div style={{ height: 1, background: 'rgba(210,83,128,0.07)', margin: '8px 0' }} />

          {isAuthenticated ? (
            <>
              <Link href="/dashboard" onClick={() => setOpen(false)}
                className="block rounded-xl"
                style={{ fontFamily: 'var(--font-dm)', fontSize: 14, fontWeight: 500, color: '#7A3A50', padding: '12px 16px', textDecoration: 'none' }}>
                Dashboard
              </Link>
              <button onClick={() => { handleLogout(); setOpen(false) }}
                className="w-full text-left rounded-xl"
                style={{ fontFamily: 'var(--font-dm)', fontSize: 14, fontWeight: 500, color: '#c0394f', padding: '12px 16px', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                Sign Out
              </button>
            </>
          ) : (
            <div className="flex gap-2 mt-2">
              <Link href="/auth/login" onClick={() => setOpen(false)}
                className="flex-1 text-center rounded-xl transition-all"
                style={{ fontFamily: 'var(--font-dm)', fontSize: 13.5, fontWeight: 500, color: '#D25380', padding: '11px', border: '1.5px solid rgba(210,83,128,0.25)', textDecoration: 'none' }}>
                Sign In
              </Link>
              <Link href="/auth/register" onClick={() => setOpen(false)}
                className="flex-1 text-center rounded-xl"
                style={{ fontFamily: 'var(--font-dm)', fontSize: 13.5, fontWeight: 600, color: '#fff', padding: '11px', background: 'linear-gradient(135deg,#D25380,#E08E6D)', textDecoration: 'none', boxShadow: '0 3px 12px rgba(210,83,128,0.28)' }}>
                Register
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Keyframe — injected once */}
      <style>{`
        @keyframes navDropIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </header>
  )
}