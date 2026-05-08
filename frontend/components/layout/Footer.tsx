'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import { X, MapPin, Phone, Mail, ArrowUpRight, Shield, FileText, RefreshCw, HelpCircle } from 'lucide-react'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'], weight: ['400', '600', '700'],
  style: ['normal', 'italic'], display: 'swap', variable: '--font-cormorant',
})
const dmSans = DM_Sans({
  subsets: ['latin'], weight: ['300', '400', '500', '600'],
  display: 'swap', variable: '--font-dm',
})

// ─── Logo ─────────────────────────────────────────────────────────────────────
function Logo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ftLg" x1="0" y1="0" x2="30" y2="30" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#D25380" />
          <stop offset="55%"  stopColor="#E08E6D" />
          <stop offset="100%" stopColor="#F6C391" />
        </linearGradient>
      </defs>
      <path d="M15 1.5C10.306 1.5 6.5 5.306 6.5 10c0 6.25 8.5 18.5 8.5 18.5S23.5 16.25 23.5 10c0-4.694-3.806-8.5-8.5-8.5Z" fill="url(#ftLg)" />
      <rect x="13.5" y="6.5" width="3"  height="7"   rx="1.25" fill="#FFFAF4" />
      <rect x="11"   y="9"   width="8"  height="2.5" rx="1.25" fill="#FFFAF4" />
    </svg>
  )
}

// ─── Modal content definitions ────────────────────────────────────────────────
const MODALS: Record<string, { title: string; icon: React.ReactNode; content: React.ReactNode }> = {
  privacy: {
    title: 'Privacy Policy',
    icon: <Shield size={18} style={{ color: '#D25380' }} />,
    content: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <p style={{ color: '#7A4A58', fontSize: 13, lineHeight: 1.8, margin: 0 }}>
          Last updated: May 2025 · Effective immediately upon account creation.
        </p>
        {[
          {
            h: '1. Information We Collect',
            b: 'We collect information you provide directly — such as your name, email address, phone number, and health-related information you choose to share when booking appointments or leaving reviews. We also collect usage data automatically, including pages visited, search queries, and device information.',
          },
          {
            h: '2. How We Use Your Information',
            b: 'Your information is used to connect you with verified healthcare professionals, process appointment bookings, send appointment reminders, personalise your experience, and improve our platform. We do not sell your personal data to third parties.',
          },
          {
            h: '3. Data Sharing',
            b: 'We share only the information necessary to facilitate your appointment — your name and contact number — with the doctor or clinic you book with. Aggregate, anonymised data may be used for analytics and research purposes.',
          },
          {
            h: '4. Data Security',
            b: 'We implement industry-standard security measures including encrypted data transmission (HTTPS), hashed password storage, and access controls. Despite these measures, no system is completely secure.',
          },
          {
            h: '5. Your Rights',
            b: 'You may request access to, correction of, or deletion of your personal data at any time by contacting us at privacy@huntly.in. We will respond within 30 days.',
          },
          {
            h: '6. Cookies',
            b: 'We use essential cookies to keep you signed in and remember your preferences. We do not use advertising or third-party tracking cookies.',
          },
          {
            h: '7. Contact',
            b: 'For privacy-related queries, reach us at privacy@huntly.in or write to: Huntly Health Technologies, C-12 Tilak Nagar, Jaipur, Rajasthan 302004.',
          },
        ].map(({ h, b }) => (
          <div key={h}>
            <div style={{ fontFamily: 'var(--font-cormorant)', fontSize: 17, fontWeight: 600, color: '#2A1520', marginBottom: 6 }}>{h}</div>
            <p style={{ color: '#7A4A58', fontSize: 13, lineHeight: 1.8, margin: 0 }}>{b}</p>
          </div>
        ))}
      </div>
    ),
  },

  terms: {
    title: 'Terms & Conditions',
    icon: <FileText size={18} style={{ color: '#D25380' }} />,
    content: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <p style={{ color: '#7A4A58', fontSize: 13, lineHeight: 1.8, margin: 0 }}>
          Last updated: May 2025 · By using Huntly, you agree to these terms.
        </p>
        {[
          {
            h: '1. Platform Role',
            b: 'Huntly is a doctor discovery and appointment booking platform. We connect patients with independent healthcare professionals. Huntly is not a healthcare provider and does not practice medicine.',
          },
          {
            h: '2. Account Responsibility',
            b: 'You are responsible for maintaining the confidentiality of your account credentials. Any activity under your account is your responsibility. You must be at least 18 years old to create an account.',
          },
          {
            h: '3. Appointment Bookings',
            b: 'Booking confirmation through Huntly does not guarantee the availability of the doctor. Clinics may reschedule or cancel appointments. We will notify you of any changes as soon as possible.',
          },
          {
            h: '4. Doctor Verification',
            b: 'Doctors marked "Verified" have had their medical registration credentials confirmed by our team. However, Huntly does not warrant or guarantee the quality of medical services provided by any listed professional.',
          },
          {
            h: '5. Reviews',
            b: 'Reviews must be based on genuine personal experiences. Fake, defamatory, or incentivised reviews are prohibited and will be removed. Huntly reserves the right to moderate all user-generated content.',
          },
          {
            h: '6. Prohibited Uses',
            b: 'You may not use Huntly to misrepresent your identity, submit fraudulent bookings, scrape doctor data, or engage in any activity that disrupts the platform or harms other users.',
          },
          {
            h: '7. Limitation of Liability',
            b: 'Huntly is not liable for any medical outcomes, missed appointments, or damages arising from your use of the platform beyond the amount you paid for our services, if any.',
          },
          {
            h: '8. Governing Law',
            b: 'These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in Jaipur, Rajasthan.',
          },
        ].map(({ h, b }) => (
          <div key={h}>
            <div style={{ fontFamily: 'var(--font-cormorant)', fontSize: 17, fontWeight: 600, color: '#2A1520', marginBottom: 6 }}>{h}</div>
            <p style={{ color: '#7A4A58', fontSize: 13, lineHeight: 1.8, margin: 0 }}>{b}</p>
          </div>
        ))}
      </div>
    ),
  },

  refund: {
    title: 'Cancellation & Refund Policy',
    icon: <RefreshCw size={18} style={{ color: '#D25380' }} />,
    content: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <p style={{ color: '#7A4A58', fontSize: 13, lineHeight: 1.8, margin: 0 }}>
          Last updated: May 2025 · Applies to all bookings made through Huntly.
        </p>
        {[
          {
            h: 'Cancellation by Patient',
            b: 'You may cancel an appointment free of charge up to 4 hours before the scheduled time. Cancellations within 4 hours of the appointment may be subject to a cancellation fee of up to ₹50 or 10% of the consultation fee, whichever is lower.',
          },
          {
            h: 'Cancellation by Doctor or Clinic',
            b: 'If a doctor cancels or reschedules your appointment, you will receive a full refund of any amount paid through Huntly, or the option to reschedule at no additional cost.',
          },
          {
            h: 'Refund Processing',
            b: 'Approved refunds are processed within 5–7 business days to your original payment method. For UPI and wallet payments, refunds may reflect within 24–48 hours.',
          },
          {
            h: 'No-Show Policy',
            b: 'If you do not attend a booked appointment without prior cancellation, you will not be eligible for a refund. Repeated no-shows may result in account suspension.',
          },
          {
            h: 'Online Consultation Refunds',
            b: 'For online consultations, if a technical issue on our end prevents the consultation from taking place, a full refund will be issued. Issues on the patient\'s device or network are not grounds for a refund.',
          },
          {
            h: 'How to Request a Refund',
            b: 'To request a refund, email refunds@huntly.in with your booking ID, the reason for the request, and any supporting information. Our team will respond within 2 business days.',
          },
        ].map(({ h, b }) => (
          <div key={h}>
            <div style={{ fontFamily: 'var(--font-cormorant)', fontSize: 17, fontWeight: 600, color: '#2A1520', marginBottom: 6 }}>{h}</div>
            <p style={{ color: '#7A4A58', fontSize: 13, lineHeight: 1.8, margin: 0 }}>{b}</p>
          </div>
        ))}
      </div>
    ),
  },

  faq: {
    title: 'Frequently Asked Questions',
    icon: <HelpCircle size={18} style={{ color: '#D25380' }} />,
    content: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {[
          { q: 'Is Huntly free to use?', a: 'Yes. Browsing doctor profiles, reading reviews, and comparing fees is completely free. Some premium features like priority booking may be introduced in the future.' },
          { q: 'How are doctors verified?', a: 'Our team manually verifies each doctor\'s medical registration number against the National Medical Register (NMR) and state medical council records before awarding the "Verified" badge.' },
          { q: 'Can I book an online consultation?', a: 'Yes. Many doctors on Huntly offer online consultations. Look for the "Online" or "Clinic + Online" badge on the doctor\'s profile.' },
          { q: 'How do I leave a review?', a: 'Sign in to your Huntly account, navigate to the doctor\'s profile, and click the "Reviews" tab. You can rate your experience and leave a written comment after a verified visit.' },
          { q: 'Can I save doctors for later?', a: 'Yes. Click the bookmark icon on any doctor card to save them to your profile. You can view all saved doctors in your dashboard.' },
          { q: 'What if my appointment is cancelled?', a: 'If the clinic cancels, you\'ll be notified via email and SMS. You can reschedule or request a full refund per our cancellation policy.' },
          { q: 'How do I contact support?', a: 'Email us at support@huntly.in or call +91-141-400-0011 between 9 AM – 6 PM, Monday to Saturday.' },
          { q: 'Are doctor fees shown on Huntly accurate?', a: 'Fees are provided by doctors or their clinics and are updated periodically. Actual fees may vary slightly; we recommend confirming at the clinic.' },
        ].map(({ q, a }) => (
          <div key={q} style={{ paddingBottom: 16, borderBottom: '1px solid rgba(210,83,128,0.08)' }}>
            <div style={{ fontFamily: 'var(--font-cormorant)', fontSize: 16, fontWeight: 600, color: '#2A1520', marginBottom: 5 }}>{q}</div>
            <p style={{ color: '#7A4A58', fontSize: 13, lineHeight: 1.75, margin: 0 }}>{a}</p>
          </div>
        ))}
      </div>
    ),
  },
}

// ─── Modal component ──────────────────────────────────────────────────────────
function Modal({ id, onClose }: { id: string; onClose: () => void }) {
  const m = MODALS[id]
  if (!m) return null

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  // Lock scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: '0', background: 'rgba(42,21,32,0.45)', backdropFilter: 'blur(4px)', animation: 'ft-overlay .2s ease both' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      {/* Sheet — slides up, max 90vh, scrollable inside */}
      <div style={{
        width: '100%', maxWidth: 680,
        maxHeight: '90vh',
        background: '#FFFAF4',
        borderRadius: '24px 24px 0 0',
        display: 'flex', flexDirection: 'column',
        boxShadow: '0 -8px 48px rgba(42,21,32,0.14)',
        animation: 'ft-sheet .3s cubic-bezier(.16,1,.3,1) both',
        // On larger screens, center it instead of bottom-sheet
      }}>
        {/* Drag handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 0', flexShrink: 0 }}>
          <div style={{ width: 36, height: 4, borderRadius: 100, background: 'rgba(210,83,128,0.18)' }} />
        </div>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 24px 14px', borderBottom: '1px solid rgba(210,83,128,0.08)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {m.icon}
            <span style={{ fontFamily: 'var(--font-cormorant)', fontSize: 20, fontWeight: 600, color: '#2A1520' }}>{m.title}</span>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(210,83,128,0.07)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D25380' }}>
            <X size={15} />
          </button>
        </div>

        {/* Scrollable body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px 32px', scrollbarWidth: 'thin', scrollbarColor: 'rgba(210,83,128,0.2) transparent' }}>
          {m.content}
        </div>
      </div>
    </div>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────
export default function Footer() {
  const [activeModal, setActiveModal] = useState<string | null>(null)

  const openModal  = (id: string) => setActiveModal(id)
  const closeModal = ()           => setActiveModal(null)

  const SPECIALIZATIONS = [
    { label: 'Dermatologist',  href: '/doctors?specialization=dermatology'  },
    { label: 'Cardiologist',   href: '/doctors?specializations=cardiology'   },
    { label: 'Neurologist',    href: '/doctors?specialization=neurology'    },
    { label: 'Orthopaedist',   href: '/doctors?specialization=orthopaedics' },
    { label: 'Gynaecologist',  href: '/doctors?specialization=gynaecology'  },
    { label: 'Dentist',        href: '/doctors?specialization=dentistry'    },
  ]

  const QUICK_LINKS = [
    { label: 'Find Doctors',   href: '/doctors'                        },
    { label: 'Online Consult', href: '/doctors?availableOnline=true'   },
    { label: 'Sign In',        href: '/auth/login'                     },
    { label: 'Register',       href: '/auth/register'                  },
    { label: 'My Dashboard',   href: '/dashboard'                      },
  ]

  const LEGAL = [
    { label: 'Privacy Policy',       id: 'privacy' },
    { label: 'Terms & Conditions',   id: 'terms'   },
    { label: 'Refund Policy',        id: 'refund'  },
    { label: 'FAQ',                  id: 'faq'     },
  ]

  return (
    <>
      <style>{`
        @keyframes ft-overlay { from{opacity:0} to{opacity:1} }
        @keyframes ft-sheet   { from{transform:translateY(100%)} to{transform:translateY(0)} }
        .ft-link { transition: color .15s ease; cursor: pointer; }
        .ft-link:hover { color: #D25380 !important; }
        .ft-modal-btn { background: none; border: none; padding: 0; font-family: inherit; text-align: left; cursor: pointer; }
      `}</style>

      <footer className={`${cormorant.variable} ${dmSans.variable}`}
        style={{ background: '#2A1520', color: '#fff', fontFamily: 'var(--font-dm)' }}>

        {/* ══════════════════════════════════════════
            DESKTOP + TABLET  (≥ 640px)
        ══════════════════════════════════════════ */}
        <div className="hidden sm:block">
          <div style={{ maxWidth: 1240, margin: '0 auto', padding: '64px 40px 0' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr 1.4fr', gap: 48 }}>

              {/* Brand column */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <Logo size={26} />
                  <span style={{ fontFamily: 'var(--font-cormorant)', fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', color: '#fff', lineHeight: 1 }}>
                    Hunt<em style={{ fontStyle: 'italic', color: '#F6C391' }}>ly</em>
                  </span>
                </div>
                <p style={{ fontSize: 13, fontWeight: 300, color: 'rgba(255,255,255,0.45)', lineHeight: 1.8, maxWidth: 260, marginBottom: 20 }}>
                  Jaipur's most trusted doctor discovery platform — hand-picked specialists, real reviews, instant booking.
                </p>

                {/* Contact */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    { icon: <MapPin size={12}/>,  text: 'C-12 Tilak Nagar, Jaipur 302004' },
                    { icon: <Phone size={12}/>,   text: '+91-141-400-0011',  href: 'tel:+911414000011' },
                    { icon: <Mail size={12}/>,    text: 'hello@huntly.in',   href: 'mailto:hello@huntly.in' },
                  ].map(({ icon, text, href }) => (
                    <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ color: '#E08E6D', flexShrink: 0 }}>{icon}</span>
                      {href
                        ? <a href={href} style={{ fontSize: 12, color: 'rgba(255,255,255,0.38)', textDecoration: 'none' }} className="ft-link">{text}</a>
                        : <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.38)' }}>{text}</span>
                      }
                    </div>
                  ))}
                </div>
              </div>

              {/* Specializations */}
              <div>
                <div style={{ fontFamily: 'var(--font-dm)', fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#E08E6D', marginBottom: 16 }}>
                  Specialists
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {SPECIALIZATIONS.map(({ label, href }) => (
                    <Link key={label} href={href} className="ft-link"
                      style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', textDecoration: 'none', display: 'block' }}>
                      {label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Quick links */}
              <div>
                <div style={{ fontFamily: 'var(--font-dm)', fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#E08E6D', marginBottom: 16 }}>
                  Quick Links
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {QUICK_LINKS.map(({ label, href }) => (
                    <Link key={label} href={href} className="ft-link"
                      style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', textDecoration: 'none', display: 'block' }}>
                      {label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Legal + trust */}
              <div>
                <div style={{ fontFamily: 'var(--font-dm)', fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#E08E6D', marginBottom: 16 }}>
                  Legal & Help
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {LEGAL.map(({ label, id }) => (
                    <button key={id} onClick={() => openModal(id)} className="ft-link ft-modal-btn"
                      style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', display: 'block' }}>
                      {label}
                    </button>
                  ))}
                </div>

                {/* Trust badges */}
                <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    '✓ Verified Doctor Profiles',
                    '✓ Secure & Private',
                    '✓ Free to Use',
                  ].map(t => (
                    <div key={t} style={{ fontSize: 11, color: 'rgba(246,195,145,0.55)', display: 'flex', alignItems: 'center', gap: 6 }}>
                      {t}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{ maxWidth: 1240, margin: '0 auto', padding: '24px 40px', borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: 48, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.22)', margin: 0 }}>
              © {new Date().getFullYear()} Huntly Health Technologies Pvt. Ltd. · Jaipur, India
            </p>
            <div style={{ display: 'flex', gap: 20 }}>
              {LEGAL.map(({ label, id }) => (
                <button key={id} onClick={() => openModal(id)} className="ft-link ft-modal-btn"
                  style={{ fontSize: 11, color: 'rgba(255,255,255,0.22)' }}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>


        {/* ══════════════════════════════════════════
            MOBILE  (< 640px) — compact single column
        ══════════════════════════════════════════ */}
        <div className="block sm:hidden">
          {/* Top section */}
          <div style={{ padding: '36px 20px 24px' }}>
            {/* Brand */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <Logo size={22} />
              <span style={{ fontFamily: 'var(--font-cormorant)', fontSize: 19, fontWeight: 600, letterSpacing: '-0.02em', color: '#fff', lineHeight: 1 }}>
                Hunt<em style={{ fontStyle: 'italic', color: '#F6C391' }}>ly</em>
              </span>
            </div>
            <p style={{ fontSize: 12, fontWeight: 300, color: 'rgba(255,255,255,0.38)', lineHeight: 1.7, margin: '0 0 20px' }}>
              Jaipur's trusted doctor discovery platform.
            </p>

            {/* CTA row */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
              <Link href="/doctors"
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, fontSize: 12, fontWeight: 600, color: '#2A1520', background: 'linear-gradient(135deg,#F6C391,#E08E6D)', padding: '10px', borderRadius: 12, textDecoration: 'none' }}>
                Find Doctors <ArrowUpRight size={12}/>
              </Link>
              <Link href="/auth/register"
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, color: '#fff', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', padding: '10px', borderRadius: 12, textDecoration: 'none' }}>
                Register Free
              </Link>
            </div>

            {/* Quick links — 2 col grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 16px', marginBottom: 20 }}>
              {[...QUICK_LINKS, ...SPECIALIZATIONS.slice(0, 3)].slice(0, 8).map(({ label, href }) => (
                <Link key={label} href={href} className="ft-link"
                  style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', textDecoration: 'none', padding: '4px 0', display: 'block' }}>
                  {label}
                </Link>
              ))}
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', marginBottom: 16 }} />

            {/* Legal pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
              {LEGAL.map(({ label, id }) => (
                <button key={id} onClick={() => openModal(id)} className="ft-modal-btn"
                  style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', padding: '5px 12px', borderRadius: 100, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  {label}
                </button>
              ))}
            </div>

            {/* Contact row */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 8 }}>
              <a href="tel:+911414000011" style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>
                <Phone size={10} style={{ color: '#E08E6D' }}/> +91-141-400-0011
              </a>
              <a href="mailto:hello@huntly.in" style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>
                <Mail size={10} style={{ color: '#E08E6D' }}/> hello@huntly.in
              </a>
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{ padding: '12px 20px 20px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.18)', margin: 0, textAlign: 'center' }}>
              © {new Date().getFullYear()} Huntly Health Technologies · Jaipur, India
            </p>
          </div>
        </div>
      </footer>

      {/* ── Modal overlay ── */}
      {activeModal && <Modal id={activeModal} onClose={closeModal} />}
    </>
  )
}