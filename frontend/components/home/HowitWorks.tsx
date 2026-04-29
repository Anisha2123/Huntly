import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import Link from 'next/link'
import { Search, SlidersHorizontal, CalendarCheck, ArrowUpRight } from 'lucide-react'

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


const STEPS = [
  {
    num: '01',
    icon: Search,
    iconColor: '#D25380',
    iconBg: 'rgba(210,83,128,0.07)',
    iconBgHover: 'rgba(210,83,128,0.12)',
    title: 'Search',
    titleItalic: 'by need',
    body: 'Enter a condition, specialist name, or procedure. Huntly surfaces only verified, top-rated doctors — not directories.',
    accent: '#D25380',
    tag: 'Smart search',
  },
  {
    num: '02',
    icon: SlidersHorizontal,
    iconColor: '#E08E6D',
    iconBg: 'rgba(224,142,109,0.08)',
    iconBgHover: 'rgba(224,142,109,0.15)',
    title: 'Compare',
    titleItalic: 'with clarity',
    body: 'See real patient ratings, verified credentials, consultation fees and clinic timings — everything side by side.',
    accent: '#E08E6D',
    tag: 'Transparent profiles',
  },
  {
    num: '03',
    icon: CalendarCheck,
    iconColor: '#C47A3A',
    iconBg: 'rgba(246,195,145,0.18)',
    iconBgHover: 'rgba(246,195,145,0.32)',
    title: 'Book',
    titleItalic: 'in seconds',
    body: 'Pick a slot, confirm instantly. Clinic visit or online consult — your appointment is locked in under 60 seconds.',
    accent: '#F6C391',
    tag: 'Instant confirmation',
  },
]

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className={`${cormorant.variable} ${dmSans.variable} relative overflow-hidden`}
      style={{
        background: '#FFFAF4',
        padding: '120px 0 100px',
      }}
    >
      {/* ── Subtle background depth ── */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(246,195,145,0.12) 0%, transparent 65%)' }} />
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 40% at 0% 100%, rgba(210,83,128,0.04) 0%, transparent 60%)' }} />

      <div className="relative z-10 max-w-[1240px] mx-auto px-8 lg:px-12">

        {/* ── Section header ── */}
        <div className="mb-20">
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-6">
            <span style={{
              fontFamily: 'var(--font-dm)',
              fontSize: 10, fontWeight: 500,
              letterSpacing: '0.22em', textTransform: 'uppercase',
              color: 'rgba(210,83,128,0.55)',
            }}>
              The process
            </span>
            <div style={{ width: 32, height: 1, background: 'rgba(210,83,128,0.2)' }} />
          </div>

          {/* Headline — two-line editorial split */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-0 sm:gap-5">
            <h2 style={{
              fontFamily: 'var(--font-cormorant), serif',
              fontSize: 'clamp(42px, 5.5vw, 72px)',
              fontWeight: 300,
              lineHeight: 1.0,
              letterSpacing: '-0.02em',
              color: '#2A1520',
              margin: 0,
            }}>
              How Huntly
            </h2>
            <h2 style={{
              fontFamily: 'var(--font-cormorant), serif',
              fontSize: 'clamp(42px, 5.5vw, 72px)',
              fontWeight: 600,
              fontStyle: 'italic',
              lineHeight: 1.0,
              letterSpacing: '-0.02em',
              background: 'linear-gradient(135deg, #D25380 0%, #E08E6D 60%, #F6C391 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              margin: 0,
            }}>
              works
            </h2>
          </div>

          {/* Sub */}
          <p style={{
            fontFamily: 'var(--font-dm)',
            fontSize: 15, fontWeight: 300,
            color: 'rgba(42,21,32,0.42)',
            lineHeight: 1.8,
            maxWidth: 380,
            marginTop: 18,
            letterSpacing: '0.01em',
          }}>
            From search to confirmed appointment — three steps, no friction.
          </p>
        </div>

        {/* ── Steps layout ── */}
        <div
          className="hiw-steps-wrap"
          style={{ position: 'relative' }}
          data-hiw
        >

          {/* Horizontal connector line — desktop */}
          <div className="hidden lg:block absolute pointer-events-none"
            style={{ top: 52, left: 'calc(16.66% + 28px)', right: 'calc(16.66% + 28px)', height: 1 }}>
            {/* Track */}
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(210,83,128,0.08)' }} />
            {/* Animated fill */}
            <div className="hiw-connector"
              style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, #D25380, #E08E6D, #F6C391)', transformOrigin: 'left', transform: 'scaleX(0)' }} />
          </div>

          {/* Steps grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8">
            {STEPS.map((step, i) => {
              const Icon = step.icon
              return (
                <div key={step.num} className="hiw-step" data-step={i}>
                  <div className="hiw-step-inner">

                    {/* Number + connector dot */}
                    <div className="flex items-center gap-3 mb-6">
                      <span className="hiw-step-num" style={{
                        fontFamily: 'var(--font-cormorant), serif',
                        fontSize: 13, fontWeight: 600,
                        color: step.accent,
                        letterSpacing: '0.12em',
                        lineHeight: 1,
                      }}>
                        {step.num}
                      </span>
                      {/* Dot with ping ring */}
                      <div style={{ position: 'relative', width: 8, height: 8, flexShrink: 0 }}>
                        <div className="hiw-dot-ping" style={{
                          position: 'absolute', inset: 0,
                          borderRadius: '50%',
                          background: step.accent,
                          opacity: 0.25,
                        }} />
                        <div style={{
                          position: 'absolute', inset: 0,
                          borderRadius: '50%',
                          background: step.accent,
                          opacity: 0.8,
                        }} />
                      </div>
                    </div>

                    {/* Icon */}
                    <div className="hiw-step-icon-wrap"
                      style={{
                        width: 60, height: 60,
                        borderRadius: 18,
                        background: step.iconBg,
                        border: `1px solid ${step.accent}22`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        marginBottom: 28,
                        boxShadow: `0 4px 20px ${step.accent}18`,
                        transition: 'all .28s cubic-bezier(.16,1,.3,1)',
                        cursor: 'default',
                      }}>
                      <Icon size={22} style={{ color: step.iconColor }} strokeWidth={1.5} />
                    </div>

                    {/* Title */}
                    <div style={{ marginBottom: 14 }}>
                      <span style={{
                        fontFamily: 'var(--font-cormorant), serif',
                        fontSize: 28, fontWeight: 300,
                        letterSpacing: '-0.015em',
                        color: '#2A1520',
                        lineHeight: 1,
                      }}>
                        {step.title}{' '}
                      </span>
                      <span style={{
                        fontFamily: 'var(--font-cormorant), serif',
                        fontSize: 28, fontWeight: 600,
                        fontStyle: 'italic',
                        letterSpacing: '-0.015em',
                        color: step.accent,
                        lineHeight: 1,
                      }}>
                        {step.titleItalic}
                      </span>
                    </div>

                    {/* Body */}
                    <p style={{
                      fontFamily: 'var(--font-dm)',
                      fontSize: 14, fontWeight: 300,
                      color: 'rgba(42,21,32,0.48)',
                      lineHeight: 1.8,
                      letterSpacing: '0.005em',
                      marginBottom: 20,
                      maxWidth: 280,
                    }}>
                      {step.body}
                    </p>

                    {/* Tag pill */}
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 5,
                      padding: '4px 12px',
                      borderRadius: 100,
                      background: `${step.accent}10`,
                      border: `1px solid ${step.accent}22`,
                    }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: step.accent, display: 'inline-block', opacity: 0.7 }} />
                      <span style={{
                        fontFamily: 'var(--font-dm)',
                        fontSize: 10, fontWeight: 500,
                        letterSpacing: '0.1em', textTransform: 'uppercase',
                        color: step.accent,
                      }}>
                        {step.tag}
                      </span>
                    </div>

                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Bottom CTA strip ── */}
        <div className="mt-20 pt-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
          style={{ borderTop: '1px solid rgba(210,83,128,0.07)' }}>
          <div>
            <p style={{
              fontFamily: 'var(--font-cormorant), serif',
              fontSize: 22, fontWeight: 400,
              fontStyle: 'italic',
              color: '#2A1520',
              letterSpacing: '-0.01em',
              margin: 0, lineHeight: 1.3,
            }}>
              Ready to find your doctor?
            </p>
            <p style={{
              fontFamily: 'var(--font-dm)',
              fontSize: 13, fontWeight: 300,
              color: 'rgba(42,21,32,0.38)',
              marginTop: 4, letterSpacing: '0.01em',
            }}>
              No signup required to search.
            </p>
          </div>

          <Link href="/doctors?city=jaipur"
            className="inline-flex items-center gap-2.5 transition-all duration-200 hover:opacity-90 hover:-translate-y-px"
            style={{
              fontFamily: 'var(--font-dm)',
              fontSize: 12, fontWeight: 500,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              color: '#fff',
              background: 'linear-gradient(135deg, #D25380 0%, #E08E6D 100%)',
              padding: '13px 24px',
              borderRadius: 12,
              textDecoration: 'none',
              boxShadow: '0 4px 8px rgba(210,83,128,0.15), 0 12px 32px rgba(210,83,128,0.2)',
              whiteSpace: 'nowrap',
            }}>
            Start Searching
            <ArrowUpRight size={14} style={{ opacity: 0.8 }} />
          </Link>
        </div>

      </div>

      {/* ── Scroll-trigger observer (client island) ── */}
      <HowItWorksObserver />
    </section>
  )
}

/* ── Tiny client component — only runs the IntersectionObserver ── */
function HowItWorksObserver() {
  // Rendered as a script-only island; no visible output
  return (
    <script
      suppressHydrationWarning
      dangerouslySetInnerHTML={{
        __html: `
(function() {
  function init() {
    var section = document.querySelector('[data-hiw]');
    if (!section) return;

    var steps = section.querySelectorAll('.hiw-step');
    var connector = document.querySelector('.hiw-connector');

    var io = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (!entry.isIntersecting) return;

        // Animate connector line
        if (connector) connector.classList.add('hiw-visible');

        // Animate each step with stagger
        steps.forEach(function(step, i) {
          setTimeout(function() {
            step.classList.add('hiw-visible');
          }, i * 120);
        });

        io.disconnect();
      });
    }, { threshold: 0.15 });

    io.observe(section);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
        `,
      }}
    />
  )
}