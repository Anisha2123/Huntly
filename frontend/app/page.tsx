import Link from 'next/link'
import { Stethoscope, Star, Shield, Clock, ArrowRight, CheckCircle2, ChevronRight, ArrowUpRight, Search, MapPin } from 'lucide-react'
import SearchBar from '@/components/ui/SearchBar'
import { formatFee, getAvatarUrl } from '@/lib/utils'
import Image from 'next/image'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import HuntlyHero from '@/components/home/Hero'

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
        @keyframes float    { 0%,100%{transform:translateY(0)}   50%{transform:translateY(-10px)} }
        @keyframes fadeUp   { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer  { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes pulse-dot{ 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.8)} }
        @keyframes orbit    { from{transform:rotate(0deg) translateX(90px) rotate(0deg)} to{transform:rotate(360deg) translateX(90px) rotate(-360deg)} }
        @keyframes orbit2   { from{transform:rotate(120deg) translateX(70px) rotate(-120deg)} to{transform:rotate(480deg) translateX(70px) rotate(-480deg)} }
        @keyframes orbit3   { from{transform:rotate(240deg) translateX(55px) rotate(-240deg)} to{transform:rotate(600deg) translateX(55px) rotate(-600deg)} }

        .fu1{animation:fadeUp .5s .1s ease both}
        .fu2{animation:fadeUp .5s .2s ease both}
        .fu3{animation:fadeUp .5s .3s ease both}
        .fu4{animation:fadeUp .5s .4s ease both}
        .float-card{animation:float 6s ease-in-out infinite}

        /* Orb rings */
        .orb-wrap{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%)}
        .orb1{position:absolute;width:8px;height:8px;border-radius:50%;background:#F6C391;animation:orbit 8s linear infinite}
        .orb2{position:absolute;width:6px;height:6px;border-radius:50%;background:#E08E6D;opacity:.8;animation:orbit2 12s linear infinite}
        .orb3{position:absolute;width:5px;height:5px;border-radius:50%;background:#D25380;opacity:.7;animation:orbit3 16s linear infinite}

        /* Card hover lift */
        .lift{transition:transform .2s ease,box-shadow .2s ease}
        .lift:hover{transform:translateY(-3px)}

        /* Pill button */
        .spec-pill:hover{background:rgba(210,83,128,.12);border-color:rgba(210,83,128,.3)}
      `}</style>

      <div className={`${cormorant.variable} ${dmSans.variable}`} style={{ fontFamily:'var(--font-dm),sans-serif', background:'#FFFAF4', color:'#2C1018' }}>

        {/* ══════════════════════════════════════════
            HERO
        ══════════════════════════════════════════ */}
       <HuntlyHero doctors={doctors} />
 

        {/* ══════════════════════════════════════════
            STATS STRIP
        ══════════════════════════════════════════ */}
        <section style={{ background:'#fff', borderBottom:'1px solid rgba(210,83,128,0.08)',
          boxShadow:'0 4px 20px rgba(210,83,128,0.06)' }}>
          <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 40px' }}>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)' }}>
              {[
                { value:`${stats.doctors}+`,    label:'Verified Doctors' },
                { value:`${stats.users}+`,      label:'Happy Patients' },
                { value:`${stats.reviews}+`,    label:'Verified Reviews' },
                { value:`${stats.categories}+`, label:'Specializations' },
              ].map((s,i) => (
                <div key={s.label} style={{ padding:'28px 32px', textAlign:'center',
                  borderRight: i<3 ? '1px solid rgba(210,83,128,0.07)' : 'none' }}>
                  <div style={{ fontFamily:'var(--font-cormorant),serif', fontSize:34, fontWeight:700,
                    color:'#D25380', lineHeight:1, marginBottom:5 }}>{s.value}</div>
                  <div style={{ fontSize:12, color:'#7A3A50', letterSpacing:'0.04em' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            SPECIALIZATIONS
        ══════════════════════════════════════════ */}
        {/* <section style={{ padding:'96px 0', background:'#FFFAF4' }}>
          <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 40px' }}>
            <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:48 }}>
              <div>
                <p style={{ fontSize:11, fontWeight:600, letterSpacing:'0.14em', textTransform:'uppercase', color:'#E08E6D', marginBottom:10 }}>Browse by Specialty</p>
                <h2 style={{ fontFamily:'var(--font-cormorant),serif', fontSize:'clamp(28px,4vw,40px)',
                  fontWeight:600, color:'#2C1018', lineHeight:1.15, margin:0 }}>
                  Find a <em style={{ fontStyle:'italic', color:'#D25380' }}>Specialist</em>
                </h2>
              </div>
              <Link href="/doctors" style={{ display:'inline-flex', alignItems:'center', gap:6,
                fontSize:13, fontWeight:500, color:'#D25380', textDecoration:'none', letterSpacing:'0.02em' }}>
                View All <ChevronRight size={14}/>
              </Link>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(118px,1fr))', gap:12 }}>
              {categories.slice(0,12).map((cat:any) => (
                <Link key={cat._id} href={`/doctors?specialization=${cat.slug}`} className="lift"
                  style={{
                    background:'#fff',
                    border:'1px solid rgba(210,83,128,0.1)',
                    borderRadius:18,
                    padding:'22px 14px',
                    textAlign:'center',
                    display:'flex',
                    flexDirection:'column',
                    alignItems:'center',
                    gap:10,
                    textDecoration:'none',
                    boxShadow:'0 2px 12px rgba(160,60,80,0.08), 0 1px 3px rgba(160,60,80,0.05)',
                  }}>
                  <div style={{ width:50, height:50, borderRadius:14, background:'rgba(246,195,145,0.2)',
                    display:'flex', alignItems:'center', justifyContent:'center', fontSize:24 }}>
                    {cat.icon}
                  </div>
                  <span style={{ fontSize:12, fontWeight:500, color:'#2C1018', lineHeight:1.3 }}>{cat.name}</span>
                  {cat.doctorCount>0 && (
                    <span style={{ fontSize:11, fontWeight:500, color:'#D25380' }}>{cat.doctorCount}</span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section> */}

        {/* Divider */}
        <div style={{ height:1, background:'linear-gradient(to right, transparent, rgba(210,83,128,0.12), transparent)' }}/>

        {/* ══════════════════════════════════════════
            FEATURED DOCTORS
        ══════════════════════════════════════════ */}
        {doctors.length>0 && (
          <section style={{ padding:'96px 0', background:'#fff' }}>
            <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 40px' }}>
              <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:48 }}>
                <div>
                  <p style={{ fontSize:11, fontWeight:600, letterSpacing:'0.14em', textTransform:'uppercase', color:'#E08E6D', marginBottom:10 }}>Hand-Picked</p>
                  <h2 style={{ fontFamily:'var(--font-cormorant),serif', fontSize:'clamp(28px,4vw,40px)',
                    fontWeight:600, color:'#2C1018', lineHeight:1.15, margin:0 }}>
                    Featured <em style={{ fontStyle:'italic', color:'#D25380' }}>Doctors</em>
                  </h2>
                </div>
                <Link href="/doctors?isFeatured=true" style={{ display:'inline-flex', alignItems:'center', gap:6,
                  fontSize:13, fontWeight:500, color:'#D25380', textDecoration:'none' }}>
                  See All <ChevronRight size={14}/>
                </Link>
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:20 }}>
                {doctors.slice(0,4).map((doc:any) => (
                  <Link key={doc._id} href={`/doctors/${doc.slug}`} className="lift"
                    style={{ background:'#fff', borderRadius:20, overflow:'hidden',
                      border:'1px solid rgba(210,83,128,0.1)', textDecoration:'none', display:'block',
                      boxShadow:'0 4px 20px rgba(160,60,80,0.1), 0 1px 4px rgba(160,60,80,0.06)' }}>
                    {/* Gradient top */}
                    <div style={{ position:'relative', padding:24, background:'linear-gradient(135deg,#D25380 0%,#E08E6D 100%)' }}>
                      <div style={{ position:'absolute', bottom:-1, left:0, right:0, height:20,
                        background:'#fff', borderRadius:'20px 20px 0 0' }}/>
                      <div style={{ display:'flex', gap:12, alignItems:'center', position:'relative', zIndex:1 }}>
                        <Image src={doc.photo||getAvatarUrl(doc.name)} alt={doc.name} width={52} height={52}
                          style={{ width:52, height:52, borderRadius:14, border:'2px solid rgba(255,255,255,0.3)', objectFit:'cover' }} unoptimized/>
                        <div>
                          <div style={{ fontFamily:'var(--font-cormorant),serif', fontSize:16, fontWeight:600,
                            color:'#fff', lineHeight:1.2 }}>{doc.name}</div>
                          <div style={{ fontSize:11, color:'rgba(255,255,255,0.6)', marginTop:2 }}>
                            {doc.specializations?.[0]?.name||'Specialist'}
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Body */}
                    <div style={{ padding:'20px 24px 24px' }}>
                      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:4 }}>
                          <span style={{ color:'#F6C391', fontSize:13 }}>★</span>
                          <span style={{ fontSize:14, fontWeight:700, color:'#2C1018',
                            fontFamily:'var(--font-cormorant),serif' }}>{doc.averageRating?.toFixed(1)}</span>
                          <span style={{ fontSize:11, color:'#7A3A50', marginLeft:2 }}>({doc.totalReviews})</span>
                        </div>
                        <div style={{ textAlign:'right' }}>
                          <div style={{ fontSize:10, color:'#7A3A50', letterSpacing:'0.04em', textTransform:'uppercase' }}>Fee</div>
                          <div style={{ fontSize:15, fontWeight:700, color:'#D25380',
                            fontFamily:'var(--font-cormorant),serif' }}>
                            {doc.consultationFee ? formatFee(doc.consultationFee) : '—'}
                          </div>
                        </div>
                      </div>
                      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
                        paddingTop:14, borderTop:'1px solid rgba(246,195,145,0.3)' }}>
                        <span style={{ fontSize:11, color:'#7A3A50' }}>{doc.primaryArea}, {doc.primaryCity}</span>
                        <span style={{ display:'inline-flex', alignItems:'center', gap:4,
                          fontSize:11, fontWeight:600, color:'#D25380' }}>View <ArrowUpRight size={12}/></span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Divider */}
        <div style={{ height:1, background:'linear-gradient(to right, transparent, rgba(210,83,128,0.12), transparent)' }}/>

        {/* ══════════════════════════════════════════
            WHY MEDLIST
        ══════════════════════════════════════════ */}
        <section style={{ padding:'96px 0', background:'#FFFAF4' }}>
          <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 40px' }}>
            <div style={{ textAlign:'center', maxWidth:520, margin:'0 auto 56px' }}>
              <p style={{ fontSize:11, fontWeight:600, letterSpacing:'0.14em', textTransform:'uppercase',
                color:'#E08E6D', marginBottom:10 }}>Why Choose Us</p>
              <h2 style={{ fontFamily:'var(--font-cormorant),serif', fontSize:'clamp(28px,4vw,40px)',
                fontWeight:600, color:'#2C1018', lineHeight:1.15, margin:'0 0 14px' }}>
                Healthcare Made <em style={{ fontStyle:'italic', color:'#D25380' }}>Simple</em>
              </h2>
              <p style={{ fontSize:14, color:'#7A3A50', lineHeight:1.75, fontWeight:300, margin:0 }}>
                We connect patients with the right doctors through a platform built on trust, transparency and ease.
              </p>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:16 }}>
              {[
                { icon:<Shield size={20} color="#D25380"/>,      title:'Verified Listings',    desc:'Every doctor is verified with valid registration and credentials.' },
                { icon:<Star size={20} color="#D25380"/>,        title:'Genuine Reviews',      desc:'Reviews only from verified patients who have visited the doctor.' },
                { icon:<Clock size={20} color="#D25380"/>,       title:'Book Instantly',       desc:'Confirm your appointment in under 60 seconds, online or at clinic.' },
                { icon:<Stethoscope size={20} color="#D25380"/>, title:'30+ Specializations',  desc:'From general physicians to highly specialized surgeons.' },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="lift" style={{
                  background:'#fff',
                  borderRadius:20,
                  padding:32,
                  border:'1px solid rgba(210,83,128,0.1)',
                  boxShadow:'0 2px 16px rgba(160,60,80,0.08), 0 1px 4px rgba(160,60,80,0.05)',
                }}>
                  <div style={{ width:48, height:48, borderRadius:14, background:'rgba(246,195,145,0.2)',
                    display:'flex', alignItems:'center', justifyContent:'center', marginBottom:20 }}>
                    {icon}
                  </div>
                  <div style={{ fontFamily:'var(--font-cormorant),serif', fontSize:18, fontWeight:600,
                    color:'#2C1018', marginBottom:8 }}>{title}</div>
                  <p style={{ fontSize:13, color:'#7A3A50', lineHeight:1.7, fontWeight:300, margin:0 }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            HOW IT WORKS  ← FIXED: uses palette, not dark bg
        ══════════════════════════════════════════ */}
        <section style={{
          padding:'96px 0',
          background:'linear-gradient(135deg, #D25380 0%, #C04070 50%, #E08E6D 100%)',
          position:'relative',
          overflow:'hidden',
        }}>
          {/* Texture */}
          <div style={{ position:'absolute', inset:0, pointerEvents:'none',
            backgroundImage:'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
            backgroundSize:'28px 28px' }}/>
          {/* Blobs */}
          <div style={{ position:'absolute', top:-200, right:-200, width:500, height:500, borderRadius:'50%', pointerEvents:'none',
            background:'radial-gradient(circle, rgba(246,195,145,0.18) 0%, transparent 70%)' }}/>
          <div style={{ position:'absolute', bottom:-100, left:-100, width:350, height:350, borderRadius:'50%', pointerEvents:'none',
            background:'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)' }}/>

          <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 40px', position:'relative', zIndex:1 }}>
            <div style={{ textAlign:'center', maxWidth:500, margin:'0 auto 56px' }}>
              <p style={{ fontSize:11, fontWeight:600, letterSpacing:'0.14em', textTransform:'uppercase',
                color:'rgba(255,255,255,0.7)', marginBottom:10 }}>Simple Process</p>
              <h2 style={{ fontFamily:'var(--font-cormorant),serif', fontSize:'clamp(28px,4vw,40px)',
                fontWeight:600, color:'#fff', lineHeight:1.15, margin:'0 0 14px' }}>
                How MedList <em style={{ fontStyle:'italic', color:'#F6C391' }}>Works</em>
              </h2>
              <p style={{ fontSize:14, color:'rgba(255,255,255,0.55)', fontWeight:300, margin:0 }}>
                Find and book your doctor appointment in just three easy steps.
              </p>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:16 }}>
              {[
                { step:'01', emoji:'🔍', title:'Search & Filter',  desc:'Search by specialization, location or doctor name. Use smart filters to narrow down options.' },
                { step:'02', emoji:'⭐', title:'Compare & Choose', desc:'Read genuine patient reviews, compare fees, check availability and pick the best match.' },
                { step:'03', emoji:'📅', title:'Book Appointment', desc:'Choose a convenient slot, confirm your booking and receive instant confirmation.' },
              ].map(({ step, emoji, title, desc }) => (
                <div key={step} style={{
                  background:'rgba(255,255,255,0.1)',
                  border:'1px solid rgba(255,255,255,0.18)',
                  borderRadius:20,
                  padding:32,
                  backdropFilter:'blur(8px)',
                  boxShadow:'0 8px 32px rgba(0,0,0,0.1)',
                }}>
                  <div style={{ fontFamily:'var(--font-cormorant),serif', fontSize:56, fontWeight:700,
                    color:'rgba(255,255,255,0.1)', lineHeight:1, marginBottom:16 }}>{step}</div>
                  <span style={{ fontSize:28, marginBottom:14, display:'block' }}>{emoji}</span>
                  <div style={{ fontFamily:'var(--font-cormorant),serif', fontSize:19, fontWeight:600,
                    color:'#fff', marginBottom:8 }}>{title}</div>
                  <p style={{ fontSize:13, color:'rgba(255,255,255,0.55)', lineHeight:1.7, fontWeight:300, margin:0 }}>{desc}</p>
                </div>
              ))}
            </div>

            <div style={{ textAlign:'center', marginTop:48 }}>
              <Link href="/doctors" style={{
                display:'inline-flex', alignItems:'center', gap:8,
                background:'#FFFAF4', color:'#D25380',
                fontSize:14, fontWeight:600, padding:'14px 32px',
                borderRadius:100, textDecoration:'none', letterSpacing:'0.02em',
                boxShadow:'0 8px 32px rgba(0,0,0,0.15)',
                transition:'all .2s',
              }}>
                Find a Doctor Now <ArrowRight size={16}/>
              </Link>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            CTA
        ══════════════════════════════════════════ */}
        <section style={{ padding:'96px 0', background:'#fff', borderTop:'1px solid rgba(210,83,128,0.07)' }}>
          <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 40px' }}>
            <div style={{
              position:'relative', overflow:'hidden',
              borderRadius:28,
              padding:'72px 60px',
              background:'linear-gradient(135deg, #D25380 0%, #E08E6D 60%, #D25380 100%)',
              boxShadow:'0 20px 60px rgba(210,83,128,0.3)',
            }}>
              {/* Blobs */}
              <div style={{ position:'absolute', top:-60, right:-60, width:300, height:300, borderRadius:'50%',
                background:'rgba(246,195,145,0.15)', pointerEvents:'none' }}/>
              <div style={{ position:'absolute', bottom:-80, left:'20%', width:200, height:200, borderRadius:'50%',
                background:'rgba(0,0,0,0.08)', pointerEvents:'none' }}/>

              <div style={{ position:'relative', zIndex:1, display:'grid', gridTemplateColumns:'1fr auto', gap:48, alignItems:'center' }}>
                <div>
                  <h2 style={{ fontFamily:'var(--font-cormorant),serif',
                    fontSize:'clamp(30px,4vw,46px)', fontWeight:600, color:'#fff', lineHeight:1.15, marginBottom:16 }}>
                    Ready to find your<br/><em style={{ fontStyle:'italic', color:'#F6C391' }}>doctor?</em>
                  </h2>
                  <p style={{ fontSize:15, color:'rgba(255,255,255,0.6)', fontWeight:300, marginBottom:28, margin:'0 0 28px' }}>
                    Join thousands of patients who trust MedList to connect them with the best healthcare professionals.
                  </p>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:20, marginBottom:32 }}>
                    {['Verified Profiles','Instant Booking','Real Reviews','Free to Use'].map(t => (
                      <span key={t} style={{ display:'inline-flex', alignItems:'center', gap:6,
                        fontSize:13, color:'rgba(255,255,255,0.7)' }}>
                        <CheckCircle2 size={14} style={{ color:'#F6C391', flexShrink:0 }}/> {t}
                      </span>
                    ))}
                  </div>
                  <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
                    <Link href="/doctors" style={{
                      display:'inline-flex', alignItems:'center', gap:8,
                      background:'#FFFAF4', color:'#D25380',
                      fontSize:14, fontWeight:600, padding:'14px 32px',
                      borderRadius:100, textDecoration:'none',
                      boxShadow:'0 4px 20px rgba(0,0,0,0.15)',
                      transition:'all .2s',
                    }}>
                      Browse Doctors <ArrowRight size={16}/>
                    </Link>
                    <Link href="/auth/register" style={{
                      display:'inline-flex', alignItems:'center', gap:8,
                      background:'transparent', color:'rgba(255,255,255,0.8)',
                      fontSize:14, fontWeight:400, padding:'14px 24px',
                      borderRadius:100, textDecoration:'none',
                      border:'1px solid rgba(255,255,255,0.25)',
                      transition:'all .2s',
                    }}>
                      Create Account
                    </Link>
                  </div>
                </div>

                {/* Stat tiles */}
                <div style={{ display:'flex', flexDirection:'column', gap:12, minWidth:160 }}>
                  {[
                    { val:`${stats.doctors}+`, lbl:'Doctors'  },
                    { val:`${stats.reviews}+`, lbl:'Reviews'  },
                    { val:`${stats.users}+`,   lbl:'Patients' },
                  ].map(s => (
                    <div key={s.lbl} style={{
                      background:'rgba(255,255,255,0.12)',
                      border:'1px solid rgba(255,255,255,0.18)',
                      borderRadius:14, padding:'16px 24px', textAlign:'center',
                      boxShadow:'0 2px 12px rgba(0,0,0,0.1)',
                    }}>
                      <div style={{ fontFamily:'var(--font-cormorant),serif', fontSize:24, fontWeight:700, color:'#fff' }}>{s.val}</div>
                      <div style={{ fontSize:11, color:'rgba(255,255,255,0.5)', marginTop:2, letterSpacing:'0.06em' }}>{s.lbl}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </>
  )
}