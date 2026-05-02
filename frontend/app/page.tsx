import Link from 'next/link'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import HuntlyHero from '@/components/home/Hero'
import HowItWorks from '@/components/home/HowitWorks'
import WhyChooseUs from '@/components/home/WhyChooseUs'
import FeaturedDoctors from '@/components/home/FeaturedDoctors'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
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

async function getData() {
  try {
    const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
    const [featuredRes, catsRes, statsRes] = await Promise.all([
      fetch(`${API}/doctors/featured`, { next: { revalidate: 300 } }),
      fetch(`${API}/categories`,        { next: { revalidate: 3600 } }),
      fetch(`${API}/stats`,             { next: { revalidate: 600 } }),
    ])
    const [featured, cats, stats] = await Promise.all([featuredRes.json(), catsRes.json(), statsRes.json()])
    return {
      doctors:    featured.doctors    || [],
      categories: cats.categories     || [],
      stats:      stats.stats         || { doctors: 500, reviews: 10000, users: 50000, categories: 30 },
    }
  } catch {
    return { doctors: [], categories: [], stats: { doctors: 500, reviews: 10000, users: 50000, categories: 30 } }
  }
}

export default async function HomePage() {
  const { doctors, categories, stats } = await getData()

  return (
    <>
      <style>{`
        /* ── Shared animations ── */
        @keyframes float   { 0%,100%{transform:translateY(0)}  50%{transform:translateY(-10px)} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes shimmer { 0%{background-position:200% 0}  100%{background-position:-200% 0} }
        @keyframes pulse-dot{ 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.8)} }
        @keyframes blob-drift { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(20px,-15px) scale(1.05)} 66%{transform:translate(-10px,10px) scale(.97)} }
        @keyframes scroll-x { from{transform:translateX(0)} to{transform:translateX(-50%)} }

        .fu1{animation:fadeUp .5s .1s ease both}
        .fu2{animation:fadeUp .5s .2s ease both}
        .fu3{animation:fadeUp .5s .3s ease both}
        .fu4{animation:fadeUp .5s .4s ease both}
        .float-card{animation:float 6s ease-in-out infinite}
        .blob-drift{animation:blob-drift 9s ease-in-out infinite}
        .lift{transition:transform .2s ease,box-shadow .2s ease}
        .lift:hover{transform:translateY(-3px)}

        /* ── Stats strip: mobile horizontal scroll ── */
        .stats-scroll {
          display: flex;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          gap: 0;
          padding: 0;
        }
        .stats-scroll::-webkit-scrollbar { display: none; }

        /* ── Mobile stat pill ── */
        .m-stat-item {
          flex: 0 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px 28px;
          border-right: 1px solid rgba(210,83,128,0.07);
          min-width: 110px;
          background: #fff;
        }
        .m-stat-item:last-child { border-right: none; }

        /* ── Tablet stats 2×2 ── */
        @media (min-width: 640px) and (max-width: 1023px) {
          .stats-grid-tablet {
            display: grid;
            grid-template-columns: 1fr 1fr;
          }
          .stats-grid-tablet .m-stat-item {
            border-right: 1px solid rgba(210,83,128,0.07);
            border-bottom: 1px solid rgba(210,83,128,0.07);
            padding: 24px 32px;
            min-width: unset;
          }
          .stats-grid-tablet .m-stat-item:nth-child(2n) { border-right: none; }
          .stats-grid-tablet .m-stat-item:nth-child(3),
          .stats-grid-tablet .m-stat-item:nth-child(4) { border-bottom: none; }
        }

        /* ── Desktop stats 4-col ── */
        @media (min-width: 1024px) {
          .stats-grid-desktop {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
          }
          .stats-grid-desktop .m-stat-item {
            border-right: 1px solid rgba(210,83,128,0.07);
            border-bottom: none;
            padding: 28px 32px;
            min-width: unset;
          }
          .stats-grid-desktop .m-stat-item:last-child { border-right: none; }
        }

        /* ── CTA section: mobile ── */
        .cta-mobile {
          padding: 48px 20px;
          background: #fff;
          border-top: 1px solid rgba(210,83,128,0.07);
        }
        .cta-card-mobile {
          position: relative;
          overflow: hidden;
          border-radius: 24px;
          padding: 44px 28px 40px;
          background: linear-gradient(145deg, #D25380 0%, #E08E6D 100%);
          box-shadow: 0 16px 48px rgba(210,83,128,0.28);
          text-align: center;
        }

        /* ── CTA section: tablet ── */
        .cta-tablet {
          padding: 64px 32px;
          background: #fff;
          border-top: 1px solid rgba(210,83,128,0.07);
        }
        .cta-card-tablet {
          position: relative;
          overflow: hidden;
          border-radius: 24px;
          padding: 52px 40px;
          background: linear-gradient(135deg, #D25380 0%, #E08E6D 60%, #D25380 100%);
          box-shadow: 0 20px 60px rgba(210,83,128,0.3);
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 32px;
          align-items: center;
        }

        /* ── CTA desktop ── */
        .cta-desktop {
          padding: 96px 0;
          background: #fff;
          border-top: 1px solid rgba(210,83,128,0.07);
        }
        .cta-card-desktop {
          position: relative;
          overflow: hidden;
          border-radius: 28px;
          padding: 72px 60px;
          background: linear-gradient(135deg, #D25380 0%, #E08E6D 60%, #D25380 100%);
          box-shadow: 0 20px 60px rgba(210,83,128,0.3);
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 48px;
          align-items: center;
        }

        /* ── CTA blob bg ── */
        .cta-blob-1 {
          position: absolute;
          border-radius: 50%;
          background: rgba(246,195,145,0.15);
          pointer-events: none;
        }
        .cta-blob-2 {
          position: absolute;
          border-radius: 50%;
          background: rgba(0,0,0,0.08);
          pointer-events: none;
        }

        /* ── Stat tile in CTA ── */
        .cta-stat-tile {
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.18);
          border-radius: 14px;
          padding: 16px 24px;
          text-align: center;
          box-shadow: 0 2px 12px rgba(0,0,0,0.1);
        }

        /* ── Mobile CTA stat row ── */
        .cta-stats-row {
          display: flex;
          gap: 10px;
          justify-content: center;
          margin-top: 28px;
          flex-wrap: wrap;
        }
        .cta-stat-pill {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: rgba(255,255,255,0.13);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 12px;
          padding: 12px 18px;
          min-width: 76px;
        }
      `}</style>

      <div className={`${cormorant.variable} ${dmSans.variable}`}
        style={{ fontFamily: 'var(--font-dm),sans-serif', background: '#FFFAF4', color: '#2C1018' }}>

        {/* ══ HERO ══ */}
        <HuntlyHero doctors={doctors} />


        {/* ══════════════════════════════════════════
            STATS STRIP
            Mobile:  horizontal scroll row
            Tablet:  2×2 grid
            Desktop: 4-col grid
        ══════════════════════════════════════════ */}
        <section style={{ background: '#fff', borderBottom: '1px solid rgba(210,83,128,0.08)', boxShadow: '0 4px 20px rgba(210,83,128,0.06)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>

            {/* Mobile: horizontal scroll */}
            <div className="stats-scroll sm:hidden fu1">
              {[
                { value: `${stats.doctors}+`,    label: 'Verified Doctors' },
                { value: `${stats.users}+`,      label: 'Happy Patients' },
                { value: `${stats.reviews}+`,    label: 'Reviews' },
                { value: `${stats.categories}+`, label: 'Specialities' },
              ].map((s) => (
                <div key={s.label} className="m-stat-item">
                  <div style={{ fontFamily: 'var(--font-cormorant),serif', fontSize: 28, fontWeight: 700, color: '#D25380', lineHeight: 1, marginBottom: 5 }}>{s.value}</div>
                  <div style={{ fontSize: 10, color: '#7A3A50', letterSpacing: '0.06em', textAlign: 'center', whiteSpace: 'nowrap' }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Tablet: 2×2 grid */}
            <div className="hidden sm:grid lg:hidden stats-grid-tablet fu1" style={{ padding: '0 32px' }}>
              {[
                { value: `${stats.doctors}+`,    label: 'Verified Doctors' },
                { value: `${stats.users}+`,      label: 'Happy Patients' },
                { value: `${stats.reviews}+`,    label: 'Verified Reviews' },
                { value: `${stats.categories}+`, label: 'Specializations' },
              ].map((s) => (
                <div key={s.label} className="m-stat-item">
                  <div style={{ fontFamily: 'var(--font-cormorant),serif', fontSize: 32, fontWeight: 700, color: '#D25380', lineHeight: 1, marginBottom: 5 }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: '#7A3A50', letterSpacing: '0.05em' }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Desktop: 4-col grid */}
            <div className="hidden lg:grid stats-grid-desktop" style={{ padding: '0 40px' }}>
              {[
                { value: `${stats.doctors}+`,    label: 'Verified Doctors' },
                { value: `${stats.users}+`,      label: 'Happy Patients' },
                { value: `${stats.reviews}+`,    label: 'Verified Reviews' },
                { value: `${stats.categories}+`, label: 'Specializations' },
              ].map((s) => (
                <div key={s.label} className="m-stat-item" style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-cormorant),serif', fontSize: 34, fontWeight: 700, color: '#D25380', lineHeight: 1, marginBottom: 5 }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: '#7A3A50', letterSpacing: '0.04em' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Divider */}
        <div style={{ height: 1, background: 'linear-gradient(to right, transparent, rgba(210,83,128,0.12), transparent)' }} />

        {/* ══ FEATURED DOCTORS ══ */}
        <FeaturedDoctors doctors={doctors} />

        {/* Divider */}
        <div style={{ height: 1, background: 'linear-gradient(to right, transparent, rgba(210,83,128,0.12), transparent)' }} />

        {/* ══ WHY HUNTLY ══ */}
        <WhyChooseUs />

        {/* ══ HOW IT WORKS ══ */}
        <HowItWorks />


        {/* ══════════════════════════════════════════
            CTA SECTION
            Mobile:  Full-bleed gradient card, centred, minimal copy + 3 stat pills
            Tablet:  2-col card inside wrapper
            Desktop: Original layout, unchanged
        ══════════════════════════════════════════ */}

        {/* ── MOBILE CTA ── */}
        <section className="cta-mobile sm:hidden">
          <div className="cta-card-mobile fu2">
            {/* Ambient blobs */}
            <div className="cta-blob-1 blob-drift" style={{ width: 200, height: 200, top: -60, right: -40 }} />
            <div className="cta-blob-2"            style={{ width: 140, height: 140, bottom: -50, left: '15%' }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
              {/* Eyebrow */}
              <p style={{ fontFamily: 'var(--font-dm)', fontSize: 10, fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', marginBottom: 14 }}>
                Join Huntly Today
              </p>

              {/* Headline */}
              <h2 style={{ fontFamily: 'var(--font-cormorant),serif', fontSize: 'clamp(32px,9vw,42px)', fontWeight: 600, color: '#fff', lineHeight: 1.1, marginBottom: 12 }}>
                Ready to find your<br />
                <em style={{ fontStyle: 'italic', color: '#F6C391' }}>doctor?</em>
              </h2>

              {/* Sub */}
              <p style={{ fontFamily: 'var(--font-dm)', fontSize: 13, fontWeight: 300, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, marginBottom: 28, maxWidth: 300, margin: '0 auto 28px' }}>
                Thousands of patients trust Huntly to find the best specialists in Jaipur.
              </p>

              {/* CTA Button */}
              <Link href="/doctors" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: '#FFFAF4', color: '#D25380',
                fontSize: 13, fontWeight: 600, padding: '13px 28px',
                borderRadius: 100, textDecoration: 'none',
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              }}>
                Browse Doctors <ArrowRight size={15} />
              </Link>

              {/* Minimal stat pills */}
              <div className="cta-stats-row">
                {[
                  { val: `${stats.doctors}+`, lbl: 'Doctors' },
                  { val: `${stats.reviews}+`, lbl: 'Reviews' },
                  { val: `${stats.users}+`,   lbl: 'Patients' },
                ].map(s => (
                  <div key={s.lbl} className="cta-stat-pill">
                    <div style={{ fontFamily: 'var(--font-cormorant),serif', fontSize: 20, fontWeight: 700, color: '#fff', lineHeight: 1 }}>{s.val}</div>
                    <div style={{ fontFamily: 'var(--font-dm)', fontSize: 9, color: 'rgba(255,255,255,0.5)', marginTop: 3, letterSpacing: '0.08em' }}>{s.lbl}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── TABLET CTA ── */}
        <section className="cta-tablet hidden sm:block lg:hidden">
          <div className="cta-card-tablet fu3">
            {/* Blobs */}
            <div className="cta-blob-1 blob-drift" style={{ width: 260, height: 260, top: -70, right: -50 }} />
            <div className="cta-blob-2"            style={{ width: 180, height: 180, bottom: -70, left: '18%' }} />

            {/* Left: copy */}
            <div style={{ position: 'relative', zIndex: 1 }}>
              <p style={{ fontFamily: 'var(--font-dm)', fontSize: 10, fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: 12 }}>Join Huntly Today</p>
              <h2 style={{ fontFamily: 'var(--font-cormorant),serif', fontSize: 'clamp(28px,4.5vw,40px)', fontWeight: 600, color: '#fff', lineHeight: 1.15, marginBottom: 14 }}>
                Ready to find your<br /><em style={{ fontStyle: 'italic', color: '#F6C391' }}>doctor?</em>
              </h2>
              <p style={{ fontFamily: 'var(--font-dm)', fontSize: 13, color: 'rgba(255,255,255,0.6)', fontWeight: 300, marginBottom: 24, lineHeight: 1.7 }}>
                Join thousands of patients who trust Huntly for verified, top-rated specialists.
              </p>
              {/* Feature chips */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginBottom: 28 }}>
                {['Verified Profiles', 'Instant Booking', 'Real Reviews'].map(t => (
                  <span key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>
                    <CheckCircle2 size={13} style={{ color: '#F6C391', flexShrink: 0 }} /> {t}
                  </span>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <Link href="/doctors" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 7,
                  background: '#FFFAF4', color: '#D25380',
                  fontSize: 13, fontWeight: 600, padding: '12px 26px',
                  borderRadius: 100, textDecoration: 'none',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                }}>
                  Browse Doctors <ArrowRight size={15} />
                </Link>
                <Link href="/auth/register" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 7,
                  background: 'transparent', color: 'rgba(255,255,255,0.8)',
                  fontSize: 13, fontWeight: 400, padding: '12px 20px',
                  borderRadius: 100, textDecoration: 'none',
                  border: '1px solid rgba(255,255,255,0.25)',
                }}>
                  Create Account
                </Link>
              </div>
            </div>

            {/* Right: compact stat tiles */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minWidth: 140, position: 'relative', zIndex: 1 }}>
              {[
                { val: `${stats.doctors}+`, lbl: 'Doctors' },
                { val: `${stats.reviews}+`, lbl: 'Reviews' },
                { val: `${stats.users}+`,   lbl: 'Patients' },
              ].map(s => (
                <div key={s.lbl} className="cta-stat-tile">
                  <div style={{ fontFamily: 'var(--font-cormorant),serif', fontSize: 22, fontWeight: 700, color: '#fff' }}>{s.val}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: 2, letterSpacing: '0.06em' }}>{s.lbl}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── DESKTOP CTA (original, unchanged) ── */}
        <section className="cta-desktop hidden lg:block">
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px' }}>
            <div className="cta-card-desktop">
              {/* Blobs */}
              <div style={{ position: 'absolute', top: -60, right: -60, width: 300, height: 300, borderRadius: '50%', background: 'rgba(246,195,145,0.15)', pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', bottom: -80, left: '20%', width: 200, height: 200, borderRadius: '50%', background: 'rgba(0,0,0,0.08)', pointerEvents: 'none' }} />

              <div style={{ position: 'relative', zIndex: 1 }}>
                <h2 style={{ fontFamily: 'var(--font-cormorant),serif', fontSize: 'clamp(30px,4vw,46px)', fontWeight: 600, color: '#fff', lineHeight: 1.15, marginBottom: 16 }}>
                  Ready to find your<br /><em style={{ fontStyle: 'italic', color: '#F6C391' }}>doctor?</em>
                </h2>
                <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)', fontWeight: 300, margin: '0 0 28px' }}>
                  Join thousands of patients who trust Huntly to connect them with the best healthcare professionals.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, marginBottom: 32 }}>
                  {['Verified Profiles', 'Instant Booking', 'Real Reviews', 'Free to Use'].map(t => (
                    <span key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>
                      <CheckCircle2 size={14} style={{ color: '#F6C391', flexShrink: 0 }} /> {t}
                    </span>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <Link href="/doctors" style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    background: '#FFFAF4', color: '#D25380',
                    fontSize: 14, fontWeight: 600, padding: '14px 32px',
                    borderRadius: 100, textDecoration: 'none',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                  }}>
                    Browse Doctors <ArrowRight size={16} />
                  </Link>
                  <Link href="/auth/register" style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    background: 'transparent', color: 'rgba(255,255,255,0.8)',
                    fontSize: 14, fontWeight: 400, padding: '14px 24px',
                    borderRadius: 100, textDecoration: 'none',
                    border: '1px solid rgba(255,255,255,0.25)',
                  }}>
                    Create Account
                  </Link>
                </div>
              </div>

              {/* Stat tiles */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minWidth: 160, position: 'relative', zIndex: 1 }}>
                {[
                  { val: `${stats.doctors}+`, lbl: 'Doctors' },
                  { val: `${stats.reviews}+`, lbl: 'Reviews' },
                  { val: `${stats.users}+`,   lbl: 'Patients' },
                ].map(s => (
                  <div key={s.lbl} className="cta-stat-tile">
                    <div style={{ fontFamily: 'var(--font-cormorant),serif', fontSize: 24, fontWeight: 700, color: '#fff' }}>{s.val}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 2, letterSpacing: '0.06em' }}>{s.lbl}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

      </div>
    </>
  )
}