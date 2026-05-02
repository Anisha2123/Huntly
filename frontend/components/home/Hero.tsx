import Link from 'next/link'
import Image from 'next/image'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import SearchBar from '@/components/ui/SearchBar'
import { formatFee, getAvatarUrl } from '@/lib/utils'
import { ArrowUpRight, BadgeCheck, Star } from 'lucide-react'

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

interface HeroProps {
  doctors: any[]
}

export default function HuntlyHero({ doctors }: HeroProps) {
  const d0 = doctors[0]
  const d1 = doctors[1]
  const d2 = doctors[2]

  return (
    <section
      className={`${cormorant.variable} ${dmSans.variable} relative overflow-hidden`}
      style={{ background: '#FFFAF4', minHeight: '100vh', paddingTop: 72 }}
    >
      <style>{`
        /* ── Animations ── */
        @keyframes h-bob    { 0%,100%{transform:translateY(0)}    50%{transform:translateY(-8px)} }
        @keyframes h-bob2   { 0%,100%{transform:translateY(0)}    50%{transform:translateY(-6px)} }
        @keyframes h-bob3   { 0%,100%{transform:translateY(0)}    50%{transform:translateY(-5px)} }
        @keyframes h-orbit  { from{transform:rotate(0deg)}  to{transform:rotate(360deg)} }
        @keyframes h-orbit-rev { from{transform:rotate(0deg)} to{transform:rotate(-360deg)} }
        @keyframes h-ticker { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes h-pulse  { 0%,100%{opacity:.7;transform:scale(1)} 50%{opacity:1;transform:scale(1.04)} }
        @keyframes h-fade-up { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes h-fade-in { from{opacity:0} to{opacity:1} }
        @keyframes h-slide-up { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }

        .h-bob  { animation: h-bob  5s ease-in-out infinite; }
        .h-bob2 { animation: h-bob2 6.5s ease-in-out infinite; }
        .h-bob3 { animation: h-bob3 8s ease-in-out infinite; }
        .h-orbit { animation: h-orbit 22s linear infinite; }
        .h-orbit-rev { animation: h-orbit-rev 18s linear infinite; }
        .h-glow-pulse { animation: h-pulse 6s ease-in-out infinite; }
        .h-ticker-inner { animation: h-ticker 28s linear infinite; }

        /* Desktop staggered reveal */
        @media (min-width: 1024px) {
          .h-r2 { animation: h-fade-up .6s ease both; animation-delay: .05s; }
          .h-r3 { animation: h-fade-up .65s ease both; animation-delay: .15s; }
          .h-rule-anim { animation: h-fade-in .7s ease both; animation-delay: .3s; }
          .h-r4 { animation: h-fade-up .65s ease both; animation-delay: .25s; }
          .h-r5 { animation: h-fade-up .65s ease both; animation-delay: .35s; }
          .h-r6 { animation: h-fade-up .65s ease both; animation-delay: .45s; }
        }

        /* ── Mobile staggered reveal ── */
        @media (max-width: 767px) {
          .m-r1 { animation: h-fade-in .5s ease both; animation-delay: .05s; }
          .m-r2 { animation: h-slide-up .6s ease both; animation-delay: .1s; }
          .m-r3 { animation: h-slide-up .6s ease both; animation-delay: .2s; }
          .m-r4 { animation: h-slide-up .6s ease both; animation-delay: .3s; }
          .m-r5 { animation: h-slide-up .6s ease both; animation-delay: .4s; }
          .m-r6 { animation: h-slide-up .6s ease both; animation-delay: .5s; }
          .m-r7 { animation: h-slide-up .6s ease both; animation-delay: .6s; }
        }

        /* ── Tablet staggered reveal ── */
        @media (min-width: 768px) and (max-width: 1023px) {
          .t-r1 { animation: h-fade-in .5s ease both; animation-delay: .05s; }
          .t-r2 { animation: h-slide-up .6s ease both; animation-delay: .1s; }
          .t-r3 { animation: h-slide-up .6s ease both; animation-delay: .2s; }
          .t-r4 { animation: h-slide-up .6s ease both; animation-delay: .3s; }
          .t-r5 { animation: h-slide-up .6s ease both; animation-delay: .4s; }
          .t-r6 { animation: h-slide-up .6s ease both; animation-delay: .5s; }
        }

        /* Gradient headline */
        .h-headline-grad {
          background: linear-gradient(135deg, #D25380 0%, #E08E6D 55%, #F6C391 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Card link reset */
        .h-card-link { display: block; text-decoration: none; color: inherit; }

        /* Pill hover */
        .h-pill-hover:hover {
          background: rgba(210,83,128,0.07) !important;
          border-color: rgba(210,83,128,0.25) !important;
          color: #D25380 !important;
        }

        /* Search bar wrapper */
        .h-search-wrap input,
        .h-search-wrap button { font-family: var(--font-dm), sans-serif !important; }

        /* ── MOBILE FEATURED CARD ── */
        .m-featured-card {
          position: relative;
          border-radius: 24px;
          overflow: hidden;
          background: linear-gradient(145deg, #ffffff 0%, #FFF8F4 100%);
          border: 1.5px solid rgba(210,83,128,0.11);
          box-shadow:
            0 2px 4px rgba(210,83,128,0.04),
            0 12px 40px rgba(210,83,128,0.12),
            0 32px 64px rgba(210,83,128,0.07);
        }

        /* ── MOBILE STATS ROW ── */
        .m-stat-pill {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 14px 20px;
          border-radius: 16px;
          background: rgba(255,255,255,0.8);
          border: 1px solid rgba(210,83,128,0.1);
          backdrop-filter: blur(8px);
          flex: 1;
        }

        /* ── MOBILE MINI CARD ── */
        .m-mini-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          border-radius: 16px;
          background: rgba(255,255,255,0.9);
          border: 1px solid rgba(224,142,109,0.18);
          box-shadow: 0 4px 20px rgba(224,142,109,0.1);
          text-decoration: none;
          color: inherit;
          flex: 1;
          min-width: 0;
        }

        /* ── TABLET CARD ── */
        .t-doctor-card {
          border-radius: 20px;
          background: linear-gradient(145deg, #ffffff 0%, #FFF8F4 100%);
          border: 1.5px solid rgba(210,83,128,0.1);
          box-shadow: 0 8px 32px rgba(210,83,128,0.1);
          padding: 18px;
          text-decoration: none;
          color: inherit;
          display: block;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .t-doctor-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 40px rgba(210,83,128,0.15);
        }

        /* ── Search wrapper mobile ── */
        .m-search-wrap {
          background: #fff;
          border: 1.5px solid rgba(210,83,128,0.13);
          border-radius: 16px;
          padding: 5px;
          box-shadow:
            0 4px 6px rgba(210,83,128,0.04),
            0 12px 32px rgba(210,83,128,0.09);
        }

        /* CTA gradient button */
        .h-cta-btn {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-radius: 16px;
          text-decoration: none;
          background: linear-gradient(135deg, #D25380 0%, #E08E6D 100%);
          box-shadow: 0 4px 8px rgba(210,83,128,0.15), 0 12px 32px rgba(210,83,128,0.22);
          transition: opacity 0.2s ease, transform 0.2s ease;
        }
        .h-cta-btn:hover { opacity: .9; transform: translateY(-1px); }
      `}</style>

      {/* ══ BACKGROUND SYSTEM (shared all breakpoints) ══ */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(160deg, #FFFAF4 0%, #FFF3EC 45%, #FFFAF4 100%)' }} />
      <div className="h-glow-pulse absolute pointer-events-none"
        style={{ right: '-5%', top: '-8%', width: '60%', height: '65%', borderRadius: '50%', background: 'radial-gradient(ellipse at center, rgba(210,83,128,0.09) 0%, rgba(210,83,128,0.04) 40%, transparent 70%)', filter: 'blur(1px)' }} />
      <div className="absolute pointer-events-none"
        style={{ left: '-8%', bottom: '-5%', width: '50%', height: '55%', borderRadius: '50%', background: 'radial-gradient(ellipse at center, rgba(224,142,109,0.1) 0%, rgba(224,142,109,0.04) 45%, transparent 70%)', filter: 'blur(2px)' }} />
      <div className="absolute pointer-events-none"
        style={{ left: '25%', top: '-10%', width: '50%', height: '40%', borderRadius: '50%', background: 'radial-gradient(ellipse at 50% 0%, rgba(246,195,145,0.22) 0%, rgba(246,195,145,0.06) 50%, transparent 75%)', filter: 'blur(1px)' }} />
      <div className="absolute inset-0 pointer-events-none"
        style={{ opacity: 0.028, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23grain)'/%3E%3C/svg%3E")`, backgroundRepeat: 'repeat', backgroundSize: '256px' }} />


      {/* ══════════════════════════════════════
          MOBILE LAYOUT  (< 768px)
      ══════════════════════════════════════ */}
      <div className="block md:hidden relative z-10 px-5 pt-6 pb-0">

        {/* Badge */}
        <div className="m-r1 inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full"
          style={{ background: 'rgba(210,83,128,0.07)', border: '1px solid rgba(210,83,128,0.15)' }}>
          <BadgeCheck size={10} style={{ color: '#D25380' }} />
          <span style={{ fontFamily: 'var(--font-dm)', fontSize: 9, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#D25380' }}>
            India's Premium Doctor Network
          </span>
        </div>

        {/* Headline — large, airy */}
        <div className="m-r2 mb-5">
          <div style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: 'clamp(44px, 12vw, 56px)', fontWeight: 300, lineHeight: 0.92, letterSpacing: '-0.02em', color: '#2A1520' }}>
            Find your
          </div>
          <div className="h-headline-grad" style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: 'clamp(48px, 14vw, 64px)', fontWeight: 600, fontStyle: 'italic', lineHeight: 0.92, letterSpacing: '-0.025em', display: 'block' }}>
            perfect doctor
          </div>
          <div style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: 'clamp(32px, 9vw, 44px)', fontWeight: 300, lineHeight: 0.92, letterSpacing: '-0.02em', color: '#2A1520' }}>
            in Jaipur
          </div>
        </div>

        {/* Thin rule */}
        <div className="m-r3 mb-5 h-px w-14"
          style={{ background: 'linear-gradient(to right, #D25380, rgba(246,195,145,0.5), transparent)' }} />

        {/* Featured Doctor Card — full width, cinematic */}
        {d0 && (
          <div className="m-r4 h-bob mb-4">
            <Link href={`/doctors/${d0.slug}`} className="m-featured-card block no-underline" style={{ color: 'inherit' }}>
              {/* Avatar banner strip */}
              <div className="relative flex items-center gap-4 px-5 pt-5 pb-4"
                style={{ borderBottom: '1px solid rgba(210,83,128,0.07)' }}>
                {/* Ambient glow behind avatar */}
                <div style={{ position: 'absolute', left: 12, top: 8, width: 72, height: 72, borderRadius: '50%', background: 'radial-gradient(circle, rgba(210,83,128,0.18) 0%, transparent 70%)', filter: 'blur(8px)', pointerEvents: 'none' }} />
                <div style={{ width: 64, height: 64, borderRadius: 18, overflow: 'hidden', flexShrink: 0, border: '2px solid rgba(210,83,128,0.14)', boxShadow: '0 4px 20px rgba(210,83,128,0.16)', position: 'relative' }}>
                  <Image src={d0.photo || getAvatarUrl(d0.name)} alt={d0.name} width={64} height={64} className="object-cover w-full h-full" unoptimized />
                </div>
                <div className="flex-1 min-w-0">
                  <div style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: 19, fontWeight: 600, color: '#2A1520', lineHeight: 1.15 }} className="truncate">{d0.name}</div>
                  <div style={{ fontFamily: 'var(--font-dm)', fontSize: 11, color: '#D25380', marginTop: 3, letterSpacing: '0.03em' }}>{d0.specializations?.[0]?.name || 'Specialist'}</div>
                  {d0.experience && <div style={{ fontFamily: 'var(--font-dm)', fontSize: 10, color: 'rgba(42,21,32,0.35)', marginTop: 2 }}>{d0.experience} yrs experience</div>}
                </div>
                <ArrowUpRight size={16} style={{ color: 'rgba(210,83,128,0.35)', flexShrink: 0 }} />
              </div>

              {/* Stats row */}
              <div className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-1.5">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map(i => (
                      <Star key={i} size={11} style={{ color: i <= Math.round(d0.averageRating || 5) ? '#F6C391' : 'rgba(42,21,32,0.1)', fill: i <= Math.round(d0.averageRating || 5) ? '#F6C391' : 'rgba(42,21,32,0.07)' }} />
                    ))}
                  </div>
                  <span style={{ fontFamily: 'var(--font-dm)', fontSize: 12, fontWeight: 500, color: '#2A1520' }}>{d0.averageRating?.toFixed(1) || '5.0'}</span>
                  <span style={{ fontFamily: 'var(--font-dm)', fontSize: 10, color: 'rgba(42,21,32,0.3)' }}>({d0.totalReviews || 0})</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--font-dm)', fontSize: 9, color: 'rgba(42,21,32,0.3)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>From</div>
                  <div style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: 22, fontWeight: 700, color: '#D25380', lineHeight: 1 }}>
                    {d0.consultationFee ? formatFee(d0.consultationFee) : 'On request'}
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Mini cards row — d1 + d2 side by side */}
        {(d1 || d2) && (
          <div className="m-r5 flex gap-3 mb-5">
            {d1 && (
              <div className="h-bob2">
                <Link href={`/doctors/${d1.slug}`} className="m-mini-card">
                  <div style={{ width: 36, height: 36, borderRadius: 10, overflow: 'hidden', flexShrink: 0, border: '1.5px solid rgba(224,142,109,0.2)' }}>
                    <Image src={d1.photo || getAvatarUrl(d1.name)} alt={d1.name} width={36} height={36} className="object-cover w-full h-full" unoptimized />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: 13, fontWeight: 600, color: '#2A1520' }} className="truncate">{d1.name}</div>
                    <div style={{ fontFamily: 'var(--font-dm)', fontSize: 10, color: '#E08E6D', marginTop: 1 }}>{d1.consultationFee ? formatFee(d1.consultationFee) : '—'}</div>
                  </div>
                </Link>
              </div>
            )}
            {d2 && (
              <div className="h-bob3">
                <Link href={`/doctors/${d2.slug}`} className="m-mini-card" style={{ border: '1px solid rgba(246,195,145,0.3)', background: 'linear-gradient(135deg, rgba(246,195,145,0.08) 0%, rgba(255,255,255,0.9) 100%)' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, overflow: 'hidden', flexShrink: 0, border: '1px solid rgba(246,195,145,0.35)' }}>
                    <Image src={d2.photo || getAvatarUrl(d2.name)} alt={d2.name} width={36} height={36} className="object-cover w-full h-full" unoptimized />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: 13, fontWeight: 600, color: '#2A1520' }} className="truncate">{d2.name}</div>
                    <div className="flex gap-0.5 mt-1">
                      {[1, 2, 3, 4, 5].map(i => <Star key={i} size={8} style={{ color: '#F6C391', fill: '#F6C391' }} />)}
                    </div>
                  </div>
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Search */}
        <div className="m-r6 m-search-wrap mb-4">
          <SearchBar />
        </div>

        {/* CTA */}
        <div className="m-r7 mb-6">
          <Link href="/doctors?city=jaipur" className="h-cta-btn px-5 py-4">
            <span style={{ fontFamily: 'var(--font-dm)', fontSize: 11, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.9)' }}>
              View All Doctors
            </span>
            <ArrowUpRight size={15} style={{ color: 'rgba(255,255,255,0.7)' }} />
          </Link>
        </div>

        {/* Stats strip */}
        <div className="m-r7 flex items-center gap-3 mb-8">
          {[{ val: '1,200+', label: 'Doctors' }, { val: '4.8★', label: 'Rating' }, { val: '50K+', label: 'Patients' }].map(s => (
            <div key={s.label} className="m-stat-pill">
              <div style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: 20, fontWeight: 600, color: '#D25380', lineHeight: 1 }}>{s.val}</div>
              <div style={{ fontFamily: 'var(--font-dm)', fontSize: 9, fontWeight: 400, color: 'rgba(42,21,32,0.38)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 3 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>


      {/* ══════════════════════════════════════
          TABLET LAYOUT  (768px – 1023px)
      ══════════════════════════════════════ */}
      <div className="hidden md:block lg:hidden relative z-10 px-8 pt-8 pb-0">

        {/* Dot grid — tablet version */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(210,83,128,0.06) 1px, transparent 1px)', backgroundSize: '28px 28px', maskImage: 'radial-gradient(ellipse 60% 60% at 80% 40%, rgba(0,0,0,0.8) 10%, transparent 75%)', WebkitMaskImage: 'radial-gradient(ellipse 60% 60% at 80% 40%, rgba(0,0,0,0.8) 10%, transparent 75%)' }} />

        {/* Orbital rings — tablet, smaller */}
        <div className="h-orbit absolute pointer-events-none"
          style={{ right: 'calc(38% - 130px)', top: '50%', marginTop: -130, width: 260, height: 260, borderRadius: '50%', border: '1px solid rgba(210,83,128,0.07)' }} />
        <div className="h-orbit-rev absolute pointer-events-none"
          style={{ right: 'calc(38% - 90px)', top: '50%', marginTop: -90, width: 180, height: 180, borderRadius: '50%', border: '1px dashed rgba(246,195,145,0.16)' }} />

        <div className="flex items-start gap-8">

          {/* ── Tablet Left ── */}
          <div className="flex-1" style={{ maxWidth: '52%' }}>

            {/* Badge */}
            <div className="t-r1 inline-flex items-center gap-2 mb-7 px-3.5 py-1.5 rounded-full"
              style={{ background: 'rgba(210,83,128,0.07)', border: '1px solid rgba(210,83,128,0.15)' }}>
              <BadgeCheck size={10} style={{ color: '#D25380' }} />
              <span style={{ fontFamily: 'var(--font-dm)', fontSize: 9, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#D25380' }}>
                India's Premium Doctor Network
              </span>
            </div>

            {/* Headline */}
            <div className="t-r2 mb-5">
              <div style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: 'clamp(46px, 6vw, 58px)', fontWeight: 300, lineHeight: 0.93, letterSpacing: '-0.025em', color: '#2A1520' }}>
                Find your
              </div>
              <div className="h-headline-grad" style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: 'clamp(52px, 7.5vw, 72px)', fontWeight: 600, fontStyle: 'italic', lineHeight: 0.93, letterSpacing: '-0.025em', display: 'block' }}>
                perfect doctor
              </div>
              <div style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: 'clamp(36px, 5vw, 48px)', fontWeight: 300, lineHeight: 0.93, letterSpacing: '-0.025em', color: '#2A1520' }}>
                in Jaipur
              </div>
            </div>

            {/* Rule */}
            <div className="t-r3 mb-5 h-px w-16"
              style={{ background: 'linear-gradient(to right, #D25380, rgba(246,195,145,0.5), transparent)' }} />

            {/* Sub */}
            <p className="t-r4" style={{ fontFamily: 'var(--font-dm)', fontSize: 13.5, fontWeight: 300, color: 'rgba(42,21,32,0.5)', lineHeight: 1.8, maxWidth: 360, letterSpacing: '0.01em', marginBottom: 28 }}>
              Hand-picked, fully verified specialists — with real reviews, transparent fees, and instant booking.
            </p>

            {/* Search */}
            <div className="t-r5 m-search-wrap mb-5">
              <SearchBar />
            </div>

            {/* Pills */}
            <div className="t-r6 flex flex-wrap gap-2 mb-7">
              {['Cardiologist', 'Dermatologist', 'Neurologist', 'Dentist'].map(s => (
                <Link key={s} href={`/doctors?specialization=${s.toLowerCase()}&city=jaipur`}
                  className="h-pill-hover transition-all duration-200"
                  style={{ fontFamily: 'var(--font-dm)', fontSize: 10, fontWeight: 400, padding: '5px 12px', borderRadius: 100, background: 'rgba(42,21,32,0.04)', border: '1px solid rgba(42,21,32,0.1)', color: 'rgba(42,21,32,0.45)', textDecoration: 'none', letterSpacing: '0.05em', display: 'inline-block' }}>
                  {s}
                </Link>
              ))}
            </div>

            {/* Stats */}
            <div className="t-r6 flex items-center gap-6 pt-6"
              style={{ borderTop: '1px solid rgba(210,83,128,0.08)' }}>
              {[{ val: '1,200+', label: 'Doctors' }, { val: '4.8★', label: 'Avg. Rating' }, { val: '50K+', label: 'Patients' }].map(s => (
                <div key={s.label}>
                  <div style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: 22, fontWeight: 600, color: '#D25380', lineHeight: 1 }}>{s.val}</div>
                  <div style={{ fontFamily: 'var(--font-dm)', fontSize: 9, fontWeight: 400, color: 'rgba(42,21,32,0.38)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 3 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Tablet Right: cards stacked compactly ── */}
          <div className="flex flex-col gap-3" style={{ width: '44%', paddingTop: 8 }}>

            {/* Ghost depth card */}
            <div style={{ position: 'absolute', top: 108, right: 24, width: 260, height: 160, background: 'linear-gradient(145deg, rgba(246,195,145,0.16), rgba(224,142,109,0.06))', border: '1px solid rgba(246,195,145,0.3)', borderRadius: 20, boxShadow: '0 8px 24px rgba(246,195,145,0.08)', zIndex: 0 }} />

            {/* Card 1 */}
            {d0 && (
              <div className="h-bob t-r2" style={{ position: 'relative', zIndex: 10 }}>
                <Link href={`/doctors/${d0.slug}`} className="t-doctor-card">
                  <div className="flex items-start gap-3 mb-3">
                    <div style={{ width: 50, height: 50, borderRadius: 14, overflow: 'hidden', flexShrink: 0, border: '2px solid rgba(210,83,128,0.12)', boxShadow: '0 4px 14px rgba(210,83,128,0.14)' }}>
                      <Image src={d0.photo || getAvatarUrl(d0.name)} alt={d0.name} width={50} height={50} className="object-cover w-full h-full" unoptimized />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: 15, fontWeight: 600, color: '#2A1520', lineHeight: 1.2 }} className="truncate">{d0.name}</div>
                      <div style={{ fontFamily: 'var(--font-dm)', fontSize: 10, color: '#D25380', marginTop: 2 }}>{d0.specializations?.[0]?.name || 'Specialist'}</div>
                    </div>
                    <ArrowUpRight size={13} style={{ color: 'rgba(210,83,128,0.3)', flexShrink: 0 }} />
                  </div>

                  <div style={{ height: 1, background: 'linear-gradient(to right, rgba(210,83,128,0.08), rgba(246,195,145,0.18), transparent)', marginBottom: 10 }} />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map(i => (
                          <Star key={i} size={10} style={{ color: i <= Math.round(d0.averageRating || 5) ? '#F6C391' : 'rgba(42,21,32,0.1)', fill: i <= Math.round(d0.averageRating || 5) ? '#F6C391' : 'rgba(42,21,32,0.07)' }} />
                        ))}
                      </div>
                      <span style={{ fontFamily: 'var(--font-dm)', fontSize: 10, fontWeight: 500, color: '#2A1520' }}>{d0.averageRating?.toFixed(1) || '5.0'}</span>
                    </div>
                    <div style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: 18, fontWeight: 700, color: '#D25380', lineHeight: 1 }}>
                      {d0.consultationFee ? formatFee(d0.consultationFee) : 'On request'}
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* Card 2 */}
            {d1 && (
              <div className="h-bob2 t-r4" style={{ marginLeft: 20, position: 'relative', zIndex: 8 }}>
                <Link href={`/doctors/${d1.slug}`} className="block no-underline"
                  style={{ background: '#ffffff', border: '1.5px solid rgba(224,142,109,0.13)', borderRadius: 16, padding: '14px 16px', boxShadow: '0 2px 4px rgba(224,142,109,0.05), 0 8px 24px rgba(224,142,109,0.1)', color: 'inherit' }}>
                  <div className="flex items-center gap-3">
                    <div style={{ width: 36, height: 36, borderRadius: 10, overflow: 'hidden', border: '1.5px solid rgba(224,142,109,0.18)', flexShrink: 0 }}>
                      <Image src={d1.photo || getAvatarUrl(d1.name)} alt={d1.name} width={36} height={36} className="object-cover w-full h-full" unoptimized />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: 13, fontWeight: 600, color: '#2A1520' }} className="truncate">{d1.name}</div>
                      <div style={{ fontFamily: 'var(--font-dm)', fontSize: 10, color: '#E08E6D', marginTop: 1 }}>{d1.specializations?.[0]?.name || 'Specialist'}</div>
                    </div>
                    <div style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: 14, fontWeight: 700, color: '#E08E6D', flexShrink: 0 }}>
                      {d1.consultationFee ? formatFee(d1.consultationFee) : '—'}
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* Card 3 */}
            {d2 && (
              <div className="h-bob3 t-r5" style={{ marginRight: 16, position: 'relative', zIndex: 6 }}>
                <Link href={`/doctors/${d2.slug}`} className="block no-underline"
                  style={{ background: 'linear-gradient(135deg, rgba(246,195,145,0.1) 0%, rgba(255,255,255,0.95) 100%)', border: '1px solid rgba(246,195,145,0.3)', borderRadius: 14, padding: '12px 14px', boxShadow: '0 2px 8px rgba(246,195,145,0.1)', color: 'inherit' }}>
                  <div className="flex items-center gap-3">
                    <div style={{ width: 30, height: 30, borderRadius: 9, overflow: 'hidden', border: '1px solid rgba(246,195,145,0.35)', flexShrink: 0 }}>
                      <Image src={d2.photo || getAvatarUrl(d2.name)} alt={d2.name} width={30} height={30} className="object-cover w-full h-full" unoptimized />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: 12, fontWeight: 600, color: '#2A1520' }} className="truncate">{d2.name}</div>
                      <div className="flex gap-0.5 mt-1">
                        {[1, 2, 3, 4, 5].map(i => <Star key={i} size={7} style={{ color: '#F6C391', fill: '#F6C391' }} />)}
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* CTA */}
            <div className="t-r6" style={{ marginTop: 4 }}>
              <Link href="/doctors?city=jaipur" className="h-cta-btn px-4 py-3.5">
                <span style={{ fontFamily: 'var(--font-dm)', fontSize: 10, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.9)' }}>
                  View All Doctors in Jaipur
                </span>
                <ArrowUpRight size={13} style={{ color: 'rgba(255,255,255,0.7)' }} />
              </Link>
            </div>
          </div>
        </div>
      </div>


      {/* ══════════════════════════════════════
          DESKTOP LAYOUT  (≥ 1024px) — UNCHANGED
      ══════════════════════════════════════ */}
      <div className="hidden lg:block relative z-10 max-w-[1240px] mx-auto px-8 lg:px-12">
        <div className="flex flex-col lg:flex-row items-start gap-10 lg:gap-0 mt-10 lg:mt-0">

          {/* ── LEFT ── */}
          <div className="lg:w-[56%] lg:pr-16 lg:pt-2 lg:pb-20">
            <div className="h-r2 inline-flex items-center gap-2 mb-8 px-3.5 py-1.5 rounded-full"
              style={{ background: 'rgba(210,83,128,0.07)', border: '1px solid rgba(210,83,128,0.15)' }}>
              <BadgeCheck size={11} style={{ color: '#D25380' }} />
              <span style={{ fontFamily: 'var(--font-dm)', fontSize: 10, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#D25380' }}>
                India's Premium Doctor Network
              </span>
            </div>

            <div className="h-r3">
              <div style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: 'clamp(60px, 7.5vw, 68px)', fontWeight: 300, lineHeight: 0.95, letterSpacing: '-0.025em', color: '#2A1520' }}>Find your</div>
              <div className="h-headline-grad" style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: 'clamp(60px, 7.5vw, 108px)', fontWeight: 600, fontStyle: 'italic', lineHeight: 0.95, letterSpacing: '-0.025em', display: 'block' }}>perfect doctor</div>
              <div style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: 'clamp(60px, 7.5vw, 58px)', fontWeight: 300, lineHeight: 0.95, letterSpacing: '-0.025em', color: '#2A1520' }}>in Jaipur</div>
            </div>

            <div className="h-rule-anim mt-7 mb-7 h-px w-20"
              style={{ background: 'linear-gradient(to right, #D25380, rgba(246,195,145,0.5), transparent)' }} />

            <p className="h-r4" style={{ fontFamily: 'var(--font-dm)', fontSize: 15, fontWeight: 300, color: 'rgba(42,21,32,0.5)', lineHeight: 1.85, maxWidth: 420, letterSpacing: '0.01em', marginBottom: 36 }}>
              Huntly hand-picks only the top-rated, fully verified specialists — with real reviews, transparent fees, and instant booking.
            </p>

            <div className="h-r5 h-search-wrap mb-7"
              style={{ background: '#fff', border: '1.5px solid rgba(210,83,128,0.13)', borderRadius: 16, padding: 5, boxShadow: '0 4px 6px rgba(210,83,128,0.04), 0 12px 32px rgba(210,83,128,0.09), 0 24px 48px rgba(210,83,128,0.05)' }}>
              <SearchBar />
            </div>

            <div className="h-r6 flex flex-wrap gap-2">
              {['Cardiologist', 'Dermatologist', 'Neurologist', 'Dentist', 'Gynaecologist'].map(s => (
                <Link key={s} href={`/doctors?specialization=${s.toLowerCase()}&city=jaipur`}
                  className="h-pill-hover transition-all duration-200"
                  style={{ fontFamily: 'var(--font-dm)', fontSize: 11, fontWeight: 400, padding: '5px 13px', borderRadius: 100, background: 'rgba(42,21,32,0.04)', border: '1px solid rgba(42,21,32,0.1)', color: 'rgba(42,21,32,0.45)', textDecoration: 'none', letterSpacing: '0.05em', display: 'inline-block' }}>
                  {s}
                </Link>
              ))}
            </div>

            <div className="h-r6 flex items-center gap-8 mt-10 pt-8"
              style={{ borderTop: '1px solid rgba(210,83,128,0.08)' }}>
              {[{ val: '1,200+', label: 'Verified Doctors' }, { val: '4.8★', label: 'Avg. Rating' }, { val: '50K+', label: 'Patients Served' }].map(s => (
                <div key={s.label}>
                  <div style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: 26, fontWeight: 600, color: '#D25380', lineHeight: 1 }}>{s.val}</div>
                  <div style={{ fontFamily: 'var(--font-dm)', fontSize: 10, fontWeight: 400, color: 'rgba(42,21,32,0.38)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT ── */}
          <div className="lg:w-[44%] relative lg:min-h-[calc(100vh-72px)] flex items-center justify-center pb-10 lg:pb-0">
            <div className="relative w-full max-w-[320px] mx-auto">
              <div className="absolute"
                style={{ top: 24, left: 18, right: -18, height: 190, background: 'linear-gradient(145deg, rgba(246,195,145,0.18), rgba(224,142,109,0.08))', border: '1px solid rgba(246,195,145,0.35)', borderRadius: 24, boxShadow: '0 8px 32px rgba(246,195,145,0.1)' }} />

              {/* Orbital rings */}
              <div className="h-orbit absolute pointer-events-none"
                style={{ right: 'calc(44% - 170px)', top: '50%', marginTop: -170, width: 340, height: 340, borderRadius: '50%', border: '1px solid rgba(210,83,128,0.07)' }} />
              <div className="h-orbit-rev absolute pointer-events-none"
                style={{ right: 'calc(44% - 120px)', top: '50%', marginTop: -120, width: 240, height: 240, borderRadius: '50%', border: '1px dashed rgba(246,195,145,0.18)' }} />
              <div className="h-orbit absolute pointer-events-none"
                style={{ right: 'calc(44% - 170px)', top: '50%', marginTop: -170, width: 340, height: 340 }}>
                <div style={{ position: 'absolute', top: -4, left: '50%', marginLeft: -4, width: 8, height: 8, borderRadius: '50%', background: '#D25380', opacity: 0.35, boxShadow: '0 0 8px rgba(210,83,128,0.6)' }} />
              </div>

              {d0 && (
                <div className="h-bob relative z-10" style={{ marginTop: 0 }}>
                  <Link href={`/doctors/${d0.slug}`} className="h-card-link"
                    style={{ background: 'linear-gradient(145deg, #ffffff 0%, #FFF8F4 100%)', border: '1.5px solid rgba(210,83,128,0.11)', borderRadius: 22, padding: '22px 22px 18px', boxShadow: '0 2px 4px rgba(210,83,128,0.04), 0 8px 24px rgba(210,83,128,0.09), 0 20px 48px rgba(210,83,128,0.06)' }}>
                    <div className="flex items-start gap-3 mb-4">
                      <div style={{ width: 58, height: 58, borderRadius: 16, overflow: 'hidden', flexShrink: 0, border: '2px solid rgba(210,83,128,0.12)', boxShadow: '0 4px 16px rgba(210,83,128,0.14)' }}>
                        <Image src={d0.photo || getAvatarUrl(d0.name)} alt={d0.name} width={58} height={58} className="object-cover w-full h-full" unoptimized />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div style={{ fontFamily: 'var(--font-cormorant),serif', fontSize: 17, fontWeight: 600, color: '#2A1520', lineHeight: 1.2 }} className="truncate">{d0.name}</div>
                        <div style={{ fontFamily: 'var(--font-dm)', fontSize: 11, color: '#D25380', marginTop: 3, letterSpacing: '0.03em' }}>{d0.specializations?.[0]?.name || 'Specialist'}</div>
                        {d0.experience && <div style={{ fontFamily: 'var(--font-dm)', fontSize: 10, color: 'rgba(42,21,32,0.35)', marginTop: 2 }}>{d0.experience} yrs experience</div>}
                      </div>
                      <ArrowUpRight size={15} style={{ color: 'rgba(210,83,128,0.28)', flexShrink: 0 }} />
                    </div>
                    <div style={{ height: 1, background: 'linear-gradient(to right, rgba(210,83,128,0.09), rgba(246,195,145,0.2), transparent)', marginBottom: 14 }} />
                    <div className="flex items-center gap-1.5 mb-3">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map(i => (
                          <Star key={i} size={11} style={{ color: i <= Math.round(d0.averageRating || 5) ? '#F6C391' : 'rgba(42,21,32,0.1)', fill: i <= Math.round(d0.averageRating || 5) ? '#F6C391' : 'rgba(42,21,32,0.07)' }} />
                        ))}
                      </div>
                      <span style={{ fontFamily: 'var(--font-dm)', fontSize: 11, fontWeight: 500, color: '#2A1520' }}>{d0.averageRating?.toFixed(1) || '5.0'}</span>
                      <span style={{ fontFamily: 'var(--font-dm)', fontSize: 10, color: 'rgba(42,21,32,0.3)' }}>({d0.totalReviews || 0} reviews)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        {d0.isVerified && (
                          <div className="flex items-center gap-1.5">
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4CAF50', display: 'block', boxShadow: '0 0 5px rgba(76,175,80,0.5)' }} />
                            <span style={{ fontFamily: 'var(--font-dm)', fontSize: 10, color: 'rgba(42,21,32,0.4)', letterSpacing: '0.05em' }}>Huntly Verified</span>
                          </div>
                        )}
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontFamily: 'var(--font-dm)', fontSize: 9, color: 'rgba(42,21,32,0.3)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Consult from</div>
                        <div style={{ fontFamily: 'var(--font-cormorant),serif', fontSize: 20, fontWeight: 700, color: '#D25380', lineHeight: 1 }}>
                          {d0.consultationFee ? formatFee(d0.consultationFee) : 'On request'}
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              )}

              {d1 && (
                <div className="h-bob2" style={{ marginTop: -14, marginLeft: 24, position: 'relative', zIndex: 8 }}>
                  <Link href={`/doctors/${d1.slug}`} className="h-card-link"
                    style={{ background: '#ffffff', border: '1.5px solid rgba(224,142,109,0.13)', borderRadius: 18, padding: '16px 18px', boxShadow: '0 2px 4px rgba(224,142,109,0.05), 0 8px 28px rgba(224,142,109,0.1)' }}>
                    <div className="flex items-center gap-3">
                      <div style={{ width: 40, height: 40, borderRadius: 12, overflow: 'hidden', border: '1.5px solid rgba(224,142,109,0.18)', flexShrink: 0 }}>
                        <Image src={d1.photo || getAvatarUrl(d1.name)} alt={d1.name} width={40} height={40} className="object-cover w-full h-full" unoptimized />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div style={{ fontFamily: 'var(--font-cormorant),serif', fontSize: 14, fontWeight: 600, color: '#2A1520' }} className="truncate">{d1.name}</div>
                        <div style={{ fontFamily: 'var(--font-dm)', fontSize: 10, color: '#E08E6D', marginTop: 2 }}>{d1.specializations?.[0]?.name || 'Specialist'}</div>
                      </div>
                      <div style={{ fontFamily: 'var(--font-cormorant),serif', fontSize: 15, fontWeight: 700, color: '#E08E6D', flexShrink: 0 }}>
                        {d1.consultationFee ? formatFee(d1.consultationFee) : '—'}
                      </div>
                    </div>
                  </Link>
                </div>
              )}

              {d2 && (
                <div className="h-bob3" style={{ marginTop: -10, marginRight: 20, position: 'relative', zIndex: 6 }}>
                  <Link href={`/doctors/${d2.slug}`} className="h-card-link"
                    style={{ background: 'linear-gradient(135deg, rgba(246,195,145,0.1) 0%, rgba(255,255,255,0.95) 100%)', border: '1px solid rgba(246,195,145,0.3)', borderRadius: 16, padding: '14px 16px', boxShadow: '0 2px 8px rgba(246,195,145,0.12), 0 8px 24px rgba(246,195,145,0.1)' }}>
                    <div className="flex items-center gap-3">
                      <div style={{ width: 34, height: 34, borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(246,195,145,0.35)', flexShrink: 0 }}>
                        <Image src={d2.photo || getAvatarUrl(d2.name)} alt={d2.name} width={34} height={34} className="object-cover w-full h-full" unoptimized />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div style={{ fontFamily: 'var(--font-cormorant),serif', fontSize: 13, fontWeight: 600, color: '#2A1520' }} className="truncate">{d2.name}</div>
                        <div style={{ fontFamily: 'var(--font-dm)', fontSize: 10, color: 'rgba(42,21,32,0.4)' }}>{d2.specializations?.[0]?.name || 'Specialist'}</div>
                      </div>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map(i => <Star key={i} size={8} style={{ color: '#F6C391', fill: '#F6C391' }} />)}
                      </div>
                    </div>
                  </Link>
                </div>
              )}

              <Link href="/doctors?city=jaipur"
                className="flex items-center justify-between mt-5 px-5 py-4 rounded-2xl no-underline transition-all duration-300 hover:opacity-90 hover:-translate-y-0.5"
                style={{ background: 'linear-gradient(135deg, #D25380 0%, #E08E6D 100%)', boxShadow: '0 4px 8px rgba(210,83,128,0.15), 0 12px 32px rgba(210,83,128,0.22)' }}>
                <span style={{ fontFamily: 'var(--font-dm)', fontSize: 12, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.9)' }}>
                  View All Doctors in Jaipur
                </span>
                <ArrowUpRight size={15} style={{ color: 'rgba(255,255,255,0.7)' }} />
              </Link>
            </div>
          </div>
        </div>
      </div>


      {/* ══ TICKER (all breakpoints) ══ */}
      <div className="relative z-10 overflow-hidden mt-0"
        style={{ borderTop: '1px solid rgba(210,83,128,0.07)', background: 'linear-gradient(to right, rgba(255,250,244,0) 0%, rgba(224,142,109,0.04) 30%, rgba(246,195,145,0.06) 50%, rgba(224,142,109,0.04) 70%, rgba(255,250,244,0) 100%)' }}>
        <div className="absolute inset-y-0 left-0 w-16 z-10 pointer-events-none" style={{ background: 'linear-gradient(to right, #FFFAF4, transparent)' }} />
        <div className="absolute inset-y-0 right-0 w-16 z-10 pointer-events-none" style={{ background: 'linear-gradient(to left, #FFFAF4, transparent)' }} />
        <div className="h-ticker-inner flex whitespace-nowrap select-none py-[14px]" style={{ width: 'max-content' }}>
          {[...Array(2)].map((_, pass) => (
            <span key={pass} className="flex items-center">
              {['Cardiology', 'Dermatology', 'Neurology', 'Oncology', 'Orthopaedics', 'Ophthalmology', 'Gynaecology', 'Psychiatry', 'Endocrinology', 'Urology', 'Nephrology', 'Pulmonology', 'ENT', 'Paediatrics'].map((s, i) => (
                <span key={`${pass}-${i}`} className="flex items-center gap-5 px-5"
                  style={{ fontFamily: 'var(--font-dm)', fontSize: 10, fontWeight: 400, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(42,21,32,0.22)' }}>
                  <span style={{ color: 'rgba(210,83,128,0.28)', fontSize: 5 }}>◆</span>
                  {s}
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}