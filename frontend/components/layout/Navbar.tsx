'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X, Search, User, Heart, LogOut, ChevronDown } from 'lucide-react'
import { useAuthStore } from '@/lib/store'
import { getInitials } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = () => {
    logout()
    setProfileOpen(false)
    toast.success('Logged out successfully')
    router.push('/')
  }

  return (
    <header
      className={[
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-[#FFFAF4]/95 backdrop-blur-md shadow-[0_1px_0_rgba(210,83,128,0.08),0_4px_16px_rgba(210,83,128,0.06)]'
          : 'bg-transparent',
      ].join(' ')}
    >
      <nav className="max-w-[1200px] mx-auto px-6 sm:px-10 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-[10px] bg-[#D25380] group-hover:bg-[#bf4470] flex items-center justify-center transition-colors shrink-0">
            <span className="text-white text-sm font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>H</span>
          </div>
          <span
            className="text-xl font-semibold tracking-tight text-[#D25380]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            H<span className="text-[#E08E6D]">untly</span>
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-0.5">
          {[
            { label: 'Home',    href: '/' },
            { label: 'Find Doctors',    href: '/doctors' },
            // { label: 'Specialists',     href: '/doctors?specialization=cardiologist' },
            { label: 'Online Consult',  href: '/doctors?availableOnline=true' },
          ].map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="text-[13.5px] font-medium text-[#7A3A50] hover:text-[#D25380] hover:bg-[#D25380]/[0.07] px-3.5 py-2 rounded-[10px] transition-all"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-1.5">
          <Link
            href="/doctors"
            className="p-2 rounded-[10px] text-[#7A3A50] hover:text-[#D25380] hover:bg-[#D25380]/[0.07] transition-all"
          >
            <Search size={17} />
          </Link>

          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-xl hover:bg-[#D25380]/[0.07] transition-all border-none bg-transparent cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-[#D25380] flex items-center justify-center text-white text-[11px] font-bold shrink-0">
                  {getInitials(user.name)}
                </div>
                <span className="text-[13.5px] font-medium text-[#2C1018]">
                  {user.name.split(' ')[0]}
                </span>
                <ChevronDown
                  size={13}
                  className={`text-[#7A3A50] transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-[calc(100%+8px)] w-[212px] bg-[#FFFAF4] border border-[#D25380]/[0.12] rounded-2xl shadow-[0_8px_32px_rgba(44,16,24,0.12)] overflow-hidden z-50 animate-[dropIn_0.15s_ease]">
                  <div className="px-4 py-3 border-b border-[#D25380]/[0.08]">
                    <p className="text-[13px] font-semibold text-[#2C1018]">{user.name}</p>
                    <p className="text-[11px] text-[#7A3A50] truncate mt-0.5">{user.email}</p>
                  </div>
                  <Link
                    href="/dashboard"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-[#7A3A50] hover:bg-[#D25380]/[0.06] hover:text-[#D25380] transition-colors"
                  >
                    <User size={14} /> My Dashboard
                  </Link>
                  <Link
                    href="/dashboard/bookings"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-[#7A3A50] hover:bg-[#D25380]/[0.06] hover:text-[#D25380] transition-colors"
                  >
                    <Heart size={14} /> My Bookings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-[#c0394f] hover:bg-[#c0394f]/[0.06] hover:text-[#a02c3f] transition-colors border-none bg-transparent cursor-pointer text-left"
                  >
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-[13.5px] font-medium text-[#7A3A50] hover:text-[#D25380] hover:bg-[#D25380]/[0.07] px-4 py-2 rounded-[10px] transition-all"
              >
                Sign In
              </Link>
              <Link
                href="/auth/register"
                className="text-[13.5px] font-semibold text-white bg-[#D25380] hover:bg-[#bf4470] px-5 py-2 rounded-full shadow-[0_2px_12px_rgba(210,83,128,0.3)] hover:shadow-[0_4px_16px_rgba(210,83,128,0.4)] hover:-translate-y-px transition-all"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded-[10px] text-[#7A3A50] hover:bg-[#D25380]/[0.07] transition-all border-none bg-transparent cursor-pointer"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[#FFFAF4] border-t border-[#D25380]/[0.08] px-4 py-3 pb-4 shadow-[0_8px_24px_rgba(44,16,24,0.08)]">
          <Link
            href="/doctors"
            onClick={() => setOpen(false)}
            className="block px-4 py-3 text-sm font-medium text-[#7A3A50] hover:text-[#D25380] hover:bg-[#D25380]/[0.07] rounded-xl transition-all"
          >
            Find Doctors
          </Link>
          <Link
            href="/doctors?availableOnline=true"
            onClick={() => setOpen(false)}
            className="block px-4 py-3 text-sm font-medium text-[#7A3A50] hover:text-[#D25380] hover:bg-[#D25380]/[0.07] rounded-xl transition-all"
          >
            Online Consult
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="block px-4 py-3 text-sm font-medium text-[#7A3A50] hover:text-[#D25380] hover:bg-[#D25380]/[0.07] rounded-xl transition-all"
              >
                Dashboard
              </Link>
              <button
                onClick={() => { handleLogout(); setOpen(false) }}
                className="w-full text-left px-4 py-3 text-sm font-medium text-[#c0394f] hover:bg-[#c0394f]/[0.06] rounded-xl transition-all border-none bg-transparent cursor-pointer"
              >
                Sign Out
              </button>
            </>
          ) : (
            <div className="flex gap-2 pt-2 mt-1">
              <Link
                href="/auth/login"
                onClick={() => setOpen(false)}
                className="flex-1 text-center py-2.5 text-[13.5px] font-medium text-[#D25380] border border-[#D25380]/30 rounded-xl hover:bg-[#D25380]/[0.06] transition-all"
              >
                Sign In
              </Link>
              <Link
                href="/auth/register"
                onClick={() => setOpen(false)}
                className="flex-1 text-center py-2.5 text-[13.5px] font-semibold text-white bg-[#D25380] hover:bg-[#bf4470] rounded-xl shadow-[0_2px_10px_rgba(210,83,128,0.3)] transition-all"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  )
}