import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight, ChevronRight, MapPin, BadgeCheck, Star } from 'lucide-react'
import { formatFee, getAvatarUrl } from '@/lib/utils'

/*
─── globals.css — append once ─────────────────────────────────────────────

@keyframes fd-rise {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

.fd-section .fd-head  { opacity: 0; }
.fd-section .fd-card  { opacity: 0; }

.fd-section.fd-in .fd-head {
  animation: fd-rise .65s cubic-bezier(.16,1,.3,1) .05s both;
}
.fd-section.fd-in .fd-card:nth-child(1) { animation: fd-rise .6s cubic-bezier(.16,1,.3,1) .10s both; }
.fd-section.fd-in .fd-card:nth-child(2) { animation: fd-rise .6s cubic-bezier(.16,1,.3,1) .20s both; }
.fd-section.fd-in .fd-card:nth-child(3) { animation: fd-rise .6s cubic-bezier(.16,1,.3,1) .30s both; }
.fd-section.fd-in .fd-card:nth-child(4) { animation: fd-rise .6s cubic-bezier(.16,1,.3,1) .40s both; }

.fd-card {
  transition: box-shadow .28s ease, transform .28s cubic-bezier(.16,1,.3,1), border-color .28s ease;
}
.fd-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 56px rgba(210,83,128,0.14), 0 4px 12px rgba(210,83,128,0.08) !important;
  border-color: rgba(210,83,128,0.2) !important;
}
.fd-card:hover .fd-view-btn {
  background: #D25380 !important;
  color: #fff !important;
  gap: 8px !important;
}
.fd-card:hover .fd-avatar {
  box-shadow: 0 0 0 3px rgba(255,255,255,0.6) !important;
}

──────────────────────────────────────────────────────────────────────── */

interface Props {
  doctors: any[]
}

export default function FeaturedDoctors({ doctors }: Props) {
  if (!doctors.length) return null

  const cards = doctors.slice(0, 4)

  return (
    <section
      className="fd-section relative overflow-hidden"
      data-fd
      style={{ padding: '72px 0 80px', background: '#FFFAF4' }}
    >
      {/* Subtle bg atmosphere */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 100% 0%, rgba(210,83,128,0.05) 0%, transparent 60%)' }} />
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 50% 40% at 0% 100%, rgba(224,142,109,0.06) 0%, transparent 55%)' }} />

      <div className="relative z-10 max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-12">

        {/* ── Header ── */}
        <div className="fd-head flex items-end justify-between mb-8 lg:mb-14">
          <div>
            <div className="flex items-center gap-3 mb-3 lg:mb-5">
              <span style={{
                fontFamily: 'var(--font-dm)', fontSize: 10, fontWeight: 500,
                letterSpacing: '0.22em', textTransform: 'uppercase',
                color: 'rgba(210,83,128,0.5)',
              }}>Hand-Picked</span>
              <div style={{ width: 24, height: 1, background: 'rgba(210,83,128,0.2)' }} />
            </div>
            <div>
              <span style={{
                fontFamily: 'var(--font-cormorant), serif',
                fontSize: 'clamp(26px, 4.5vw, 56px)', fontWeight: 300,
                lineHeight: 1.0, letterSpacing: '-0.02em', color: '#2A1520',
              }}>Featured </span>
              <span style={{
                fontFamily: 'var(--font-cormorant), serif',
                fontSize: 'clamp(26px, 4.5vw, 56px)', fontWeight: 600,
                fontStyle: 'italic', lineHeight: 1.0, letterSpacing: '-0.02em',
                background: 'linear-gradient(135deg, #D25380 0%, #E08E6D 60%, #F6C391 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>Doctors</span>
            </div>
          </div>

          <Link href="/doctors?isFeatured=true"
            className="inline-flex items-center gap-1.5 transition-all duration-200 hover:gap-2.5"
            style={{
              fontFamily: 'var(--font-dm)', fontSize: 12, fontWeight: 500,
              letterSpacing: '0.06em', color: '#D25380', textDecoration: 'none',
            }}>
            See All <ChevronRight size={14} />
          </Link>
        </div>

        {/* ── Grid: 2 cols always, 4 on desktop ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {cards.map((doc: any) => (
            <Link
              key={doc._id}
              href={`/doctors/${doc.slug}`}
              className="fd-card"
              style={{
                background: '#fff',
                borderRadius: 18,
                border: '1px solid rgba(210,83,128,0.08)',
                overflow: 'hidden',
                textDecoration: 'none',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 2px 8px rgba(210,83,128,0.05), 0 1px 2px rgba(210,83,128,0.04)',
              }}
            >
              {/* ── Gradient top ── */}
              <div style={{
                position: 'relative',
                padding: '16px 14px 26px',
                background: 'linear-gradient(145deg, #D25380 0%, #E08E6D 100%)',
                flexShrink: 0,
              }}>
                {/* Bottom curve */}
                <div style={{
                  position: 'absolute', bottom: -1, left: 0, right: 0,
                  height: 16, background: '#fff', borderRadius: '16px 16px 0 0',
                }} />

                {/* Verified badge */}
                {doc.isVerified && (
                  <div style={{
                    position: 'absolute', top: 9, right: 9,
                    display: 'flex', alignItems: 'center', gap: 2,
                    background: 'rgba(255,255,255,0.18)',
                    border: '1px solid rgba(255,255,255,0.28)',
                    borderRadius: 100, padding: '2px 6px',
                  }}>
                    <BadgeCheck size={8} style={{ color: '#fff' }} />
                    <span style={{
                      fontFamily: 'var(--font-dm)', fontSize: 7, fontWeight: 600,
                      color: '#fff', letterSpacing: '0.05em',
                    }}>
                      VERIFIED
                    </span>
                  </div>
                )}

                {/* Avatar */}
                <div className="fd-avatar" style={{
                  width: 44, height: 44,
                  borderRadius: 12,
                  overflow: 'hidden',
                  border: '2px solid rgba(255,255,255,0.4)',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                  marginBottom: 9,
                  transition: 'box-shadow .28s ease',
                  position: 'relative', zIndex: 1,
                }}>
                  <Image
                    src={doc.photo || getAvatarUrl(doc.name)}
                    alt={doc.name}
                    width={44} height={44}
                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                    unoptimized
                  />
                </div>

                {/* Name + spec */}
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{
                    fontFamily: 'var(--font-cormorant), serif',
                    fontSize: 14, fontWeight: 600,
                    color: '#fff', lineHeight: 1.2, marginBottom: 2,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {doc.name}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-dm)', fontSize: 10,
                    color: 'rgba(255,255,255,0.65)',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {doc.specializations?.[0]?.name || 'Specialist'}
                  </div>
                </div>
              </div>

              {/* ── Body ── */}
              <div style={{
                padding: '10px 12px 14px',
                flex: 1, display: 'flex', flexDirection: 'column', gap: 8,
              }}>
                {/* Rating + fee */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <div style={{ display: 'flex', gap: 1 }}>
                      {[1,2,3,4,5].map(i => (
                        <Star key={i} size={8} style={{
                          color: i <= Math.round(doc.averageRating || 0) ? '#F6C391' : 'rgba(42,21,32,0.1)',
                          fill:  i <= Math.round(doc.averageRating || 0) ? '#F6C391' : 'rgba(42,21,32,0.06)',
                        }} />
                      ))}
                    </div>
                    {doc.averageRating > 0 && (
                      <span style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: 12, fontWeight: 700, color: '#2A1520' }}>
                        {doc.averageRating.toFixed(1)}
                      </span>
                    )}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'var(--font-dm)', fontSize: 7.5, color: 'rgba(42,21,32,0.3)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>From</div>
                    <div style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: 14, fontWeight: 700, color: '#D25380', lineHeight: 1 }}>
                      {doc.consultationFee ? formatFee(doc.consultationFee) : '—'}
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div style={{ height: 1, background: 'linear-gradient(to right, rgba(210,83,128,0.08), rgba(246,195,145,0.2), transparent)' }} />

                {/* CTA */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  {(doc.primaryCity) ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                      <MapPin size={9} style={{ color: '#E08E6D', flexShrink: 0 }} />
                      <span style={{ fontFamily: 'var(--font-dm)', fontSize: 9, color: 'rgba(42,21,32,0.38)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 60 }}>
                        {doc.primaryCity}
                      </span>
                    </div>
                  ) : <span />}
                  <div className="fd-view-btn" style={{
                    display: 'inline-flex', alignItems: 'center', gap: 3,
                    fontFamily: 'var(--font-dm)', fontSize: 9, fontWeight: 500,
                    color: '#D25380',
                    background: 'rgba(210,83,128,0.07)',
                    border: '1px solid rgba(210,83,128,0.12)',
                    padding: '4px 9px', borderRadius: 100,
                    transition: 'all .22s ease',
                    letterSpacing: '0.03em',
                  }}>
                    View <ArrowUpRight size={9} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>

      {/* ── Scroll observer ── */}
      <script suppressHydrationWarning dangerouslySetInnerHTML={{ __html: `
(function(){
  function init(){
    var s=document.querySelector('[data-fd]');
    if(!s)return;
    new IntersectionObserver(function(e){
      e.forEach(function(x){ if(x.isIntersecting) x.target.classList.add('fd-in'); });
    },{threshold:0.1}).observe(s);
  }
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
})();
      ` }} />
    </section>
  )
}