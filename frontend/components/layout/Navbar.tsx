'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X, Search, User, Heart, LogOut, ChevronDown, MapPin, ArrowUpRight } from 'lucide-react'
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
  { label: 'Home',           href: '/' },
  { label: 'Find Doctors',   href: '/doctors' },
  // { label: 'Online Consult', href: '/doctors?availableOnline=true' },
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

  // Lock body scroll when drawer open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  const handleLogout = () => {
    logout(); setProfileOpen(false); setOpen(false)
    toast.success('Signed out')
    router.push('/')
  }

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
    <>
      <style>{`
        @keyframes navDropIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes navOverlayIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes navDrawerIn {
          from { opacity: 0; transform: translateX(100%); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes navLinkIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .nav-overlay { animation: navOverlayIn .25s ease both; }
        .nav-drawer  { animation: navDrawerIn .3s cubic-bezier(.16,1,.3,1) both; }
        .nav-link-1  { animation: navLinkIn .35s cubic-bezier(.16,1,.3,1) .08s both; }
        .nav-link-2  { animation: navLinkIn .35s cubic-bezier(.16,1,.3,1) .14s both; }
        .nav-link-3  { animation: navLinkIn .35s cubic-bezier(.16,1,.3,1) .20s both; }
        .nav-link-4  { animation: navLinkIn .35s cubic-bezier(.16,1,.3,1) .26s both; }
        .nav-link-5  { animation: navLinkIn .35s cubic-bezier(.16,1,.3,1) .32s both; }
        .nav-cta-row { animation: navLinkIn .35s cubic-bezier(.16,1,.3,1) .38s both; }
      `}</style>

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
        <nav className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-12 h-[64px] lg:h-[68px] flex items-center justify-between gap-4 lg:gap-8">

          {/* ── Wordmark ── */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group" onClick={() => setOpen(false)}>
            <Logo size={26} />
            <span style={{
              fontFamily: 'var(--font-cormorant), serif',
              fontSize: 20, fontWeight: 600,
              letterSpacing: '-0.02em',
              color: '#2A1520',
              lineHeight: 1,
            }}>
              Hunt<em style={{ fontStyle: 'italic', color: '#D25380' }}>ly</em>
            </span>
          </Link>

          {/* ── Centre pill nav — desktop only ── */}
          <div className="hidden lg:flex items-center"
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
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(210,83,128,0.09)'; el.style.color = '#D25380' }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'transparent'; el.style.color = scrolled ? '#7A3A50' : 'rgba(42,21,32,0.75)' }}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* ── Right actions — desktop ── */}
          <div className="hidden lg:flex items-center gap-2">
            <Link href="/doctors"
              className="flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200"
              style={{ color: '#7A3A50' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(210,83,128,0.08)'; el.style.color = '#D25380' }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'transparent'; el.style.color = '#7A3A50' }}
            >
              <Search size={16} strokeWidth={2} />
            </Link>

            {isAuthenticated && user ? (
              <div className="relative" data-profile-menu>
                <button
                  onClick={() => setProfileOpen(p => !p)}
                  className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border transition-all duration-200 cursor-pointer"
                  style={{ background: 'transparent', border: '1px solid rgba(210,83,128,0.15)', color: '#2A1520' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(210,83,128,0.3)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(210,83,128,0.15)')}
                >
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0"
                    style={{ background: 'linear-gradient(135deg,#D25380,#E08E6D)' }}>
                    {getInitials(user.name)}
                  </div>
                  <span style={{ fontFamily: 'var(--font-dm)', fontSize: 13, fontWeight: 500, color: '#2A1520' }}>
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown size={12} style={{ color: '#AA8090', transition: 'transform .2s', transform: profileOpen ? 'rotate(180deg)' : 'none' }} />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-[calc(100%+10px)] w-[220px] overflow-hidden z-50"
                    style={{ background: '#FFFAF4', border: '1px solid rgba(210,83,128,0.1)', borderRadius: 18, boxShadow: '0 8px 40px rgba(42,21,32,0.12), 0 2px 8px rgba(42,21,32,0.06)', animation: 'navDropIn .18s cubic-bezier(.16,1,.3,1)' }}>
                    <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(210,83,128,0.07)' }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#2A1520' }}>{user.name}</div>
                      <div style={{ fontSize: 11, color: '#AA8090', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</div>
                    </div>
                    {[
                      { href: '/dashboard',          icon: <User size={13}/>,  label: 'My Dashboard' },
                      { href: '/dashboard/bookings', icon: <Heart size={13}/>, label: 'My Bookings'  },
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
                  style={{ fontFamily: 'var(--font-dm)', fontSize: 13, fontWeight: 500, color: '#7A3A50', padding: '8px 16px', borderRadius: 100, textDecoration: 'none', transition: 'all .18s ease' }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.color = '#D25380'; el.style.background = 'rgba(210,83,128,0.07)' }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.color = '#7A3A50'; el.style.background = 'transparent' }}
                >
                  Sign In
                </Link>
                <Link href="/auth/register"
                  style={{ fontFamily: 'var(--font-dm)', fontSize: 13, fontWeight: 600, color: '#fff', letterSpacing: '0.01em', background: 'linear-gradient(135deg,#D25380 0%,#E08E6D 100%)', padding: '9px 20px', borderRadius: 100, textDecoration: 'none', boxShadow: '0 2px 10px rgba(210,83,128,0.25)', transition: 'all .2s ease' }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.opacity = '0.9'; el.style.transform = 'translateY(-1px)' }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.opacity = '1'; el.style.transform = 'none' }}
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* ── Mobile / Tablet right: search + hamburger ── */}
          <div className="flex lg:hidden items-center gap-1">
            <Link href="/doctors"
              className="flex items-center justify-center w-9 h-9 rounded-full"
              style={{ color: '#7A3A50' }}
              onClick={() => setOpen(false)}>
              <Search size={16} strokeWidth={2} />
            </Link>
            <button
              onClick={() => setOpen(o => !o)}
              className="flex items-center justify-center w-9 h-9 rounded-full transition-all"
              style={{ color: '#7A3A50', background: open ? 'rgba(210,83,128,0.08)' : 'transparent', border: 'none', cursor: 'pointer' }}
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>
      </header>


      {/* ══════════════════════════════════════════
          MOBILE / TABLET FULL-SCREEN DRAWER
          Slides in from right, overlays everything
      ══════════════════════════════════════════ */}
      {open && (
        <div className={`${cormorant.variable} ${dmSans.variable} fixed inset-0 z-40 lg:hidden`} style={{ fontFamily: 'var(--font-dm)' }}>

          {/* Backdrop */}
          <div
            className="nav-overlay absolute inset-0"
            style={{ background: 'rgba(42,21,32,0.35)', backdropFilter: 'blur(3px)', WebkitBackdropFilter: 'blur(3px)' }}
            onClick={() => setOpen(false)}
          />

          {/* Drawer panel */}
          <div
            className="nav-drawer absolute top-0 right-0 bottom-0 flex flex-col"
            style={{
              width: 'min(320px, 88vw)',
              background: '#FFFAF4',
              boxShadow: '-8px 0 48px rgba(42,21,32,0.14)',
              overflowY: 'auto',
            }}
          >
            {/* Drawer header */}
            <div style={{ padding: '20px 24px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Link href="/" onClick={() => setOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
                <Logo size={24} />
                <span style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: 19, fontWeight: 600, letterSpacing: '-0.02em', color: '#2A1520', lineHeight: 1 }}>
                  Hunt<em style={{ fontStyle: 'italic', color: '#D25380' }}>ly</em>
                </span>
              </Link>
              {/* <button
                onClick={() => setOpen(false)}
                style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(210,83,128,0.07)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D25380' }}>
                <X size={16} />
              </button> */}
            </div>

            {/* Location hint */}
            <div style={{ padding: '16px 24px 0', display: 'flex', alignItems: 'center', gap: 6 }}>
              <MapPin size={10} style={{ color: '#E08E6D', flexShrink: 0 }} />
              <span style={{ fontFamily: 'var(--font-dm)', fontSize: 10, color: 'rgba(42,21,32,0.32)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Jaipur, Rajasthan
              </span>
            </div>

            {/* Thin rule */}
            <div style={{ height: 1, background: 'linear-gradient(to right, rgba(210,83,128,0.12), transparent)', margin: '16px 24px' }} />

            {/* Nav links */}
            <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 2 }}>
              {NAV_LINKS.map(({ label, href }, i) => (
                <Link
                  key={label}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={`nav-link-${i + 1}`}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: 'var(--font-dm)', fontSize: 15, fontWeight: 500, color: '#2A1520', padding: '13px 12px', borderRadius: 14, textDecoration: 'none', transition: 'all .15s' }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(210,83,128,0.06)'; el.style.color = '#D25380' }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'transparent'; el.style.color = '#2A1520' }}
                >
                  {label}
                  <ArrowUpRight size={13} style={{ color: 'rgba(210,83,128,0.3)', flexShrink: 0 }} />
                </Link>
              ))}
            </div>

            {/* Spacer */}
            <div style={{ flex: 1, minHeight: 24 }} />

            {/* Auth section */}
            <div style={{ padding: '0 16px 32px' }}>
              <div style={{ height: 1, background: 'rgba(210,83,128,0.08)', marginBottom: 16 }} />

              {isAuthenticated && user ? (
                <>
                  {/* User pill */}
                  <div className="nav-link-4" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderRadius: 14, background: 'rgba(210,83,128,0.05)', marginBottom: 8 }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#D25380,#E08E6D)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                      {getInitials(user.name)}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#2A1520', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</div>
                      <div style={{ fontSize: 11, color: '#AA8090', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</div>
                    </div>
                  </div>

                  <div className="nav-link-5" style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 8 }}>
                    {[
                      { href: '/dashboard',          icon: <User size={13}/>,  label: 'My Dashboard' },
                      { href: '/dashboard/bookings', icon: <Heart size={13}/>, label: 'My Bookings'  },
                    ].map(item => (
                      <Link key={item.href} href={item.href} onClick={() => setOpen(false)}
                        style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'var(--font-dm)', fontSize: 13, fontWeight: 500, color: '#7A3A50', padding: '10px 14px', borderRadius: 12, textDecoration: 'none', transition: 'all .15s' }}
                        onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(210,83,128,0.06)'; el.style.color = '#D25380' }}
                        onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'transparent'; el.style.color = '#7A3A50' }}
                      >
                        <span style={{ color: '#D25380' }}>{item.icon}</span>
                        {item.label}
                      </Link>
                    ))}
                  </div>

                  <button onClick={handleLogout} className="nav-cta-row"
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'var(--font-dm)', fontSize: 13, fontWeight: 600, color: '#c0394f', padding: '12px', background: 'rgba(192,57,79,0.06)', border: '1px solid rgba(192,57,79,0.15)', borderRadius: 14, cursor: 'pointer' }}>
                    <LogOut size={14} /> Sign Out
                  </button>
                </>
              ) : (
                <div className="nav-cta-row" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {/* Feature pills */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 4 }}>
                    {['Verified Doctors', 'Instant Booking', 'Free to Use'].map(f => (
                      <span key={f} style={{ fontSize: 10, fontWeight: 500, padding: '3px 10px', borderRadius: 100, background: 'rgba(210,83,128,0.07)', color: '#D25380', letterSpacing: '0.04em' }}>
                        {f}
                      </span>
                    ))}
                  </div>
                  <Link href="/auth/register" onClick={() => setOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontFamily: 'var(--font-dm)', fontSize: 14, fontWeight: 600, color: '#fff', padding: '14px', borderRadius: 16, background: 'linear-gradient(135deg,#D25380 0%,#E08E6D 100%)', textDecoration: 'none', boxShadow: '0 4px 16px rgba(210,83,128,0.28)', letterSpacing: '0.01em' }}>
                    Get Started — It's Free
                  </Link>
                  <Link href="/auth/login" onClick={() => setOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-dm)', fontSize: 13, fontWeight: 500, color: '#D25380', padding: '12px', borderRadius: 14, border: '1.5px solid rgba(210,83,128,0.2)', textDecoration: 'none', transition: 'all .15s' }}>
                    Sign In
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}