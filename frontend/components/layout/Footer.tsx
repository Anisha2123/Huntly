import Link from 'next/link'
import { Heart } from 'lucide-react'

export default function Footer() {
  const specializations = ['Cardiologist', 'Dermatologist', 'Dentist', 'Orthopedist', 'Neurologist', 'Pediatrician']
  const localities = ['Malviya Nagar', 'Vaishali Nagar', 'C-Scheme', 'Mansarovar', 'Tonk Road', 'Raja Park']

  return (
    <footer className="relative mt-20 bg-[#2a1019] text-[#FFFAF4] border-t border-[#D25380]/20">

      {/* top glow line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-[#D25380]/50 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#D25380] to-[#E08E6D] flex items-center justify-center shrink-0">
                <span className="text-[#FFFAF4] text-base font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>M</span>
              </div>
              <span className="text-2xl font-semibold tracking-tight text-[#FFFAF4]" style={{ fontFamily: "'Playfair Display', serif" }}>
                Med<span className="text-[#F6C391]">List</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-6 text-[#FFFAF4]/45">
              Jaipur's most trusted platform to discover and connect with verified, top-rated doctors and specialists.
            </p>
            <div className="flex gap-2.5">
              {['tw', 'fb', 'in', 'yt'].map(s => (
                <div
                  key={s}
                  className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer uppercase text-[10px] font-semibold tracking-wide text-[#FFFAF4]/50 bg-[#D25380]/10 border border-[#D25380]/20 hover:bg-[#D25380] hover:text-[#FFFAF4] hover:border-[#D25380] transition-all duration-150"
                >
                  {s}
                </div>
              ))}
            </div>
          </div>

          {/* Specializations */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.12em] text-[#F6C391] mb-5">
              Specialists
            </h4>
            <ul className="space-y-2.5">
              {specializations.map(s => (
                <li key={s}>
                  <Link
                    href={`/doctors?specialization=${s.toLowerCase()}&city=jaipur`}
                    className="text-sm text-[#FFFAF4]/50 hover:text-[#F6C391] transition-colors duration-150 no-underline"
                  >
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Jaipur Localities */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.12em] text-[#F6C391] mb-5">
              Jaipur Areas
            </h4>
            <ul className="space-y-2.5">
              {localities.map(loc => (
                <li key={loc}>
                  <Link
                    href={`/doctors?city=jaipur&area=${loc.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-sm text-[#FFFAF4]/50 hover:text-[#F6C391] transition-colors duration-150 no-underline"
                  >
                    Doctors in {loc}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.12em] text-[#F6C391] mb-5">
              Company
            </h4>
            <ul className="space-y-2.5">
              {['About Us', 'Careers', 'Press', 'Blog', 'Help Center', 'Privacy Policy', 'Terms of Service'].map(item => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-sm text-[#FFFAF4]/50 hover:text-[#F6C391] transition-colors duration-150 no-underline"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#D25380]/12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* suppressHydrationWarning fixes the server/client year mismatch */}
          <p className="text-[12.5px] text-[#FFFAF4]/28" suppressHydrationWarning>
            © <span suppressHydrationWarning>{new Date().getFullYear()}</span> MedList. All rights reserved.
          </p>
          <p className="text-[12.5px] text-[#FFFAF4]/28 flex items-center gap-1.5">
            Made with{' '}
            <Heart size={12} className="text-[#D25380] fill-[#D25380] shrink-0" />
            {' '}for better healthcare in Jaipur
          </p>
        </div>
      </div>
    </footer>
  )
}