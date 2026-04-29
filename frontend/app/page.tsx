import Link from 'next/link'
import { Stethoscope, Star, Shield, Clock, ArrowRight, CheckCircle2, ChevronRight, ArrowUpRight, Search, MapPin } from 'lucide-react'
import SearchBar from '@/components/ui/SearchBar'
import { formatFee, getAvatarUrl } from '@/lib/utils'
import Image from 'next/image'
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
        <FeaturedDoctors doctors={doctors} />

        {/* Divider */}
        <div style={{ height:1, background:'linear-gradient(to right, transparent, rgba(210,83,128,0.12), transparent)' }}/>

        {/* ══════════════════════════════════════════
            WHY Huntly
        ══════════════════════════════════════════ */}
        <WhyChooseUs />

        {/* ══════════════════════════════════════════
            HOW IT WORKS  ← FIXED: uses palette, not dark bg
        ══════════════════════════════════════════ */}
        <HowItWorks />
   

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
                    Join thousands of patients who trust Huntly to connect them with the best healthcare professionals.
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