import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import Link from 'next/link'
import { ShieldCheck, Star, Zap, Users, ArrowUpRight } from 'lucide-react'

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

/*
─── globals.css — append once ─────────────────────────────────────────────

@keyframes wcu-rise {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes wcu-rule-grow {
  from { transform: scaleX(0); }
  to   { transform: scaleX(1); }
}
@keyframes wcu-count-up {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}

.wcu-section .wcu-head    { opacity: 0; }
.wcu-section .wcu-sub     { opacity: 0; }
.wcu-section .wcu-rule    { transform: scaleX(0); transform-origin: left; }
.wcu-section .wcu-card    { opacity: 0; }
.wcu-section .wcu-stat    { opacity: 0; }

.wcu-section.wcu-in .wcu-head {
  animation: wcu-rise .65s cubic-bezier(.16,1,.3,1) .05s both;
}
.wcu-section.wcu-in .wcu-sub {
  animation: wcu-rise .65s cubic-bezier(.16,1,.3,1) .18s both;
}
.wcu-section.wcu-in .wcu-rule {
  animation: wcu-rule-grow .8s cubic-bezier(.16,1,.3,1) .25s forwards;
}
.wcu-section.wcu-in .wcu-card:nth-child(1) { animation: wcu-rise .6s cubic-bezier(.16,1,.3,1) .10s both; }
.wcu-section.wcu-in .wcu-card:nth-child(2) { animation: wcu-rise .6s cubic-bezier(.16,1,.3,1) .22s both; }
.wcu-section.wcu-in .wcu-card:nth-child(3) { animation: wcu-rise .6s cubic-bezier(.16,1,.3,1) .34s both; }
.wcu-section.wcu-in .wcu-card:nth-child(4) { animation: wcu-rise .6s cubic-bezier(.16,1,.3,1) .46s both; }
.wcu-section.wcu-in .wcu-stat:nth-child(1) { animation: wcu-count-up .5s cubic-bezier(.16,1,.3,1) .55s both; }
.wcu-section.wcu-in .wcu-stat:nth-child(2) { animation: wcu-count-up .5s cubic-bezier(.16,1,.3,1) .65s both; }
.wcu-section.wcu-in .wcu-stat:nth-child(3) { animation: wcu-count-up .5s cubic-bezier(.16,1,.3,1) .75s both; }

.wcu-card {
  transition: border-color .22s ease, box-shadow .22s ease, transform .22s cubic-bezier(.16,1,.3,1);
}
.wcu-card:hover {
  border-color: rgba(210,83,128,0.22) !important;
  box-shadow: 0 12px 40px rgba(210,83,128,0.1) !important;
  transform: translateY(-4px);
}
.wcu-card:hover .wcu-icon {
  background: rgba(210,83,128,0.1) !important;
}
.wcu-card:hover .wcu-num {
  color: #D25380 !important;
}

──────────────────────────────────────────────────────────────────────── */

const FEATURES = [
  {
    icon: ShieldCheck,
    num: '01',
    title: 'Only verified',
    titleEm: 'doctors',
    body: 'Every listing is manually reviewed — medical registration, credentials and clinic details confirmed before going live.',
  },
  {
    icon: Star,
    num: '02',
    title: 'Real patient',
    titleEm: 'reviews',
    body: 'Ratings come only from confirmed visits. No anonymous scores, no paid boosts — just honest feedback.',
  },
  {
    icon: Zap,
    num: '03',
    title: 'Book in',
    titleEm: 'seconds',
    body: 'Pick a time slot and confirm instantly. Clinic or online — your appointment is locked under 60 seconds.',
  },
  {
    icon: Users,
    num: '04',
    title: 'Patients',
    titleEm: 'first, always',
    body: 'No ads. No promoted rankings. Doctors surface purely on verified quality and patient satisfaction.',
  },
]

const STATS = [
  { val: '1,200+', label: 'Verified doctors' },
  { val: '4.8 ★',  label: 'Average rating'  },
  { val: '50K+',   label: 'Patients served' },
]

export default function WhyChooseUs() {
  return (
    <section
      className={`${cormorant.variable} ${dmSans.variable} wcu-section relative overflow-hidden`}
      data-wcu
      style={{ background: '#FFFAF4', padding: '120px 0 110px' }}
    >

      {/* ── Subtle atmospheric bg ── */}
      {/* Rose bloom — top right */}
      <div className="absolute pointer-events-none"
        style={{
          right: 0, top: 0, width: '45%', height: '60%',
          background: 'radial-gradient(ellipse 80% 70% at 100% 0%, rgba(210,83,128,0.06) 0%, transparent 65%)',
        }} />
      {/* Peach — bottom left */}
      <div className="absolute pointer-events-none"
        style={{
          left: 0, bottom: 0, width: '40%', height: '50%',
          background: 'radial-gradient(ellipse 70% 60% at 0% 100%, rgba(224,142,109,0.07) 0%, transparent 60%)',
        }} />
      {/* Amber centre glow */}
      <div className="absolute pointer-events-none"
        style={{
          left: '50%', top: '50%', transform: 'translate(-50%,-50%)',
          width: '60%', height: '50%',
          background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(246,195,145,0.07) 0%, transparent 70%)',
        }} />

      <div className="relative z-10 max-w-[1240px] mx-auto px-8 lg:px-12">

        {/* ════ HEADER ════ */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">

          {/* Left: headline */}
          <div>
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-6">
              <span style={{
                fontFamily: 'var(--font-dm)', fontSize: 10, fontWeight: 500,
                letterSpacing: '0.22em', textTransform: 'uppercase',
                color: 'rgba(210,83,128,0.5)',
              }}>Why Huntly</span>
              <div style={{ width: 28, height: 1, background: 'rgba(210,83,128,0.2)' }} />
            </div>

            <div className="wcu-head">
              <div style={{
                fontFamily: 'var(--font-cormorant), serif',
                fontSize: 'clamp(40px,5.5vw,70px)', fontWeight: 300,
                lineHeight: 1.0, letterSpacing: '-0.022em', color: '#2A1520',
              }}>
                The standard
              </div>
              <div style={{
                fontFamily: 'var(--font-cormorant), serif',
                fontSize: 'clamp(40px,5.5vw,70px)', fontWeight: 600,
                fontStyle: 'italic', lineHeight: 1.0, letterSpacing: '-0.022em',
                background: 'linear-gradient(135deg,#D25380 0%,#E08E6D 55%,#F6C391 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>
                you deserve.
              </div>
            </div>
          </div>

          {/* Right: sub + rule */}
          <div style={{ maxWidth: 360 }}>
            <p className="wcu-sub" style={{
              fontFamily: 'var(--font-dm)', fontSize: 14, fontWeight: 300,
              color: 'rgba(42,21,32,0.45)', lineHeight: 1.85,
              letterSpacing: '0.01em', marginBottom: 0,
            }}>
              Finding a good doctor shouldn't require guesswork. Every Huntly feature is built around getting you to the right specialist, fast.
            </p>
          </div>
        </div>

        {/* ── Gradient rule ── */}
        <div className="wcu-rule mb-14 h-px"
          style={{ background: 'linear-gradient(to right, #D25380, #E08E6D, rgba(246,195,145,0.4), transparent)' }} />

        {/* ════ FEATURES GRID ════ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {FEATURES.map((f) => {
            const Icon = f.icon
            return (
              <div key={f.num} className="wcu-card"
                style={{
                  background: '#fff',
                  border: '1px solid rgba(210,83,128,0.08)',
                  borderRadius: 20,
                  padding: '28px 24px 26px',
                  boxShadow: '0 1px 4px rgba(210,83,128,0.04)',
                }}>

                {/* Number + icon row */}
                <div className="flex items-start justify-between mb-6">
                  <span className="wcu-num" style={{
                    fontFamily: 'var(--font-cormorant), serif',
                    fontSize: 13, fontWeight: 600,
                    letterSpacing: '0.12em', color: 'rgba(42,21,32,0.2)',
                    transition: 'color .22s ease',
                  }}>
                    {f.num}
                  </span>
                  <div className="wcu-icon"
                    style={{
                      width: 42, height: 42, borderRadius: 12,
                      background: 'rgba(210,83,128,0.06)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'background .22s ease',
                    }}>
                    <Icon size={18} style={{ color: '#D25380' }} strokeWidth={1.5} />
                  </div>
                </div>

                {/* Title */}
                <div style={{ marginBottom: 12, lineHeight: 1.1 }}>
                  <span style={{
                    fontFamily: 'var(--font-cormorant), serif',
                    fontSize: 22, fontWeight: 300,
                    letterSpacing: '-0.01em', color: '#2A1520',
                  }}>
                    {f.title}{' '}
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-cormorant), serif',
                    fontSize: 22, fontWeight: 600,
                    fontStyle: 'italic',
                    letterSpacing: '-0.01em', color: '#D25380',
                  }}>
                    {f.titleEm}
                  </span>
                </div>

                {/* Body */}
                <p style={{
                  fontFamily: 'var(--font-dm)',
                  fontSize: 13, fontWeight: 300,
                  color: 'rgba(42,21,32,0.45)',
                  lineHeight: 1.8, margin: 0,
                }}>
                  {f.body}
                </p>
              </div>
            )
          })}
        </div>

        {/* ════ BOTTOM STRIP — stats + CTA ════ */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 pt-10"
          style={{ borderTop: '1px solid rgba(210,83,128,0.08)' }}>

          {/* Stats row */}
          <div className="flex items-center gap-10 sm:gap-14">
            {STATS.map((s, i) => (
              <div key={s.label} className="wcu-stat">
                <div style={{
                  fontFamily: 'var(--font-cormorant), serif',
                  fontSize: 28, fontWeight: 600,
                  color: '#D25380', lineHeight: 1,
                }}>
                  {s.val}
                </div>
                <div style={{
                  fontFamily: 'var(--font-dm)',
                  fontSize: 10, fontWeight: 400,
                  color: 'rgba(42,21,32,0.35)',
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  marginTop: 5,
                }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <p style={{
              fontFamily: 'var(--font-cormorant), serif',
              fontSize: 17, fontWeight: 400, fontStyle: 'italic',
              color: 'rgba(42,21,32,0.4)', margin: 0,
            }}>
              See the difference for yourself.
            </p>
            <Link href="/doctors?city=jaipur"
              className="inline-flex items-center gap-2 shrink-0 transition-all duration-200 hover:opacity-90 hover:-translate-y-px"
              style={{
                fontFamily: 'var(--font-dm)',
                fontSize: 11, fontWeight: 500,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                color: '#fff',
                background: 'linear-gradient(135deg,#D25380 0%,#E08E6D 100%)',
                padding: '12px 20px', borderRadius: 10, textDecoration: 'none',
                boxShadow: '0 4px 8px rgba(210,83,128,0.15), 0 12px 28px rgba(210,83,128,0.18)',
                whiteSpace: 'nowrap',
              }}>
              Browse Doctors
              <ArrowUpRight size={13} />
            </Link>
          </div>
        </div>

      </div>

      {/* ── Scroll observer ── */}
      <script suppressHydrationWarning dangerouslySetInnerHTML={{ __html: `
(function(){
  function init(){
    var s=document.querySelector('[data-wcu]');
    if(!s)return;
    new IntersectionObserver(function(e){
      e.forEach(function(x){ if(x.isIntersecting){ x.target.classList.add('wcu-in'); } });
    },{threshold:0.12}).observe(s);
  }
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
})();
      ` }} />
    </section>
  )
}