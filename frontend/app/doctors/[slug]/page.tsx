'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import {
  MapPin, Clock, BadgeCheck, Award, Phone, Calendar,
  ChevronRight, MessageSquare, ArrowUpRight, Monitor,
  Building2, Hash, Stethoscope, Wrench, Languages,
  CheckCircle, Bookmark, Video, TrendingUp, Users, Star
} from 'lucide-react'
import { doctorsApi, reviewsApi, bookingsApi } from '@/lib/api'
import { useAuthStore } from '@/lib/store'
import { formatFee, formatDate, getAvatarUrl } from '@/lib/utils'
import toast from 'react-hot-toast'

/* ── Fonts ─────────────────────────────────────────────── */
const cormorant = Cormorant_Garamond({
  subsets: ['latin'], weight: ['400','500','600','700'],
  style: ['normal','italic'], display: 'swap', variable: '--font-cormorant',
})
const dmSans = DM_Sans({
  subsets: ['latin'], weight: ['300','400','500','600'],
  display: 'swap', variable: '--font-dm',
})

/* ── Design tokens ─────────────────────────────────────── */
const C = {
  bg:    '#FFFAF4', pink:  '#D25380', coral: '#E08E6D', peach: '#F6C391',
  ink:   '#2A1520', muD:   '#7A4A58', mu:    '#AA8090',
  bd:    'rgba(210,83,128,0.1)', sf: '#FFF0E6', wh: '#FFFFFF',
  sgD:   '#5A6B2A', sg: '#8FAF45',
}

/* ── Stars ─────────────────────────────────────────────── */
function Stars({ n, size=13, pick, onPick }: { n:number; size?:number; pick?:number; onPick?:(v:number)=>void }) {
  const [h, sH] = useState(0)
  const act = onPick ? (h || pick || 0) : Math.round(n)
  return (
    <span className="inline-flex" style={{ gap:1 }}>
      {[1,2,3,4,5].map(i => (
        <span key={i}
          style={{ fontSize:size, color:i<=act?C.peach:'#E8D5C0', cursor:onPick?'pointer':'default', lineHeight:1 }}
          onMouseEnter={()=>onPick&&sH(i)} onMouseLeave={()=>onPick&&sH(0)}
          onClick={()=>onPick?.(i)}>★</span>
      ))}
    </span>
  )
}

/* ── Chip ──────────────────────────────────────────────── */
const Chip = ({ label, v='d' }: { label:string; v?:'d'|'c'|'p'|'g'|'w' }) => {
  const m = {
    d: { bg:'rgba(210,83,128,0.08)', c:C.pink },
    c: { bg:'rgba(224,142,109,0.1)', c:C.coral },
    p: { bg:'rgba(246,195,145,0.2)', c:'#B86A2A' },
    g: { bg:'#FFF0E6',               c:C.muD },
    w: { bg:'rgba(255,255,255,0.15)',c:'rgba(255,255,255,0.9)' },
  }
  const s = m[v]
  return (
    <span style={{ display:'inline-block', fontSize:11, fontWeight:500, padding:'4px 11px',
      borderRadius:100, background:s.bg, color:s.c,
      border:v==='w'?'1px solid rgba(255,255,255,0.2)':'none',
      fontFamily:'var(--font-dm)' }}>
      {label}
    </span>
  )
}

/* ── Section heading ───────────────────────────────────── */
const SH = ({ t }: { t:string }) => (
  <div className="flex items-center gap-2.5 mb-3.5">
    <span className="text-[16px] font-semibold whitespace-nowrap tracking-[0.01em]"
      style={{ fontFamily:'var(--font-cormorant)', color:C.ink }}>{t}</span>
    <div className="flex-1 h-px" style={{ background:`linear-gradient(to right,${C.bd},transparent)` }}/>
  </div>
)

/* ── Shared input class ────────────────────────────────── */
const INP = 'dp-inp w-full bg-white border border-[#D25380]/15 rounded-[10px] px-3.5 py-2.5 text-[13px] text-[#2A1520] outline-none transition-colors'

/* ── Shared button classes ─────────────────────────────── */
const BTN_PRI = 'flex items-center justify-center gap-2 w-full text-white border-none rounded-xl px-4 py-3.5 text-[14px] font-semibold cursor-pointer tracking-[0.02em] transition-opacity hover:opacity-90 disabled:opacity-45 disabled:cursor-not-allowed'
const BTN_OUT = 'flex items-center justify-center gap-2 w-full bg-white text-[#D25380] border border-[#D25380]/25 rounded-xl py-3 text-[13px] font-semibold cursor-pointer transition-all hover:border-[#D25380] hover:bg-[#D25380]/[0.03] no-underline'

/* ════════════════════════════════════════════════════════ */
export default function DoctorProfilePage() {
  const { slug } = useParams()
  const { isAuthenticated } = useAuthStore()
  const [doc,  setDoc]  = useState<any>(null)
  const [revs, setRevs] = useState<any[]>([])
  const [load, setLoad] = useState(true)
  const [tab,  setTab]  = useState<'ov'|'cl'|'rv'|'bk'>('ov')
  const [saved,setSaved]= useState(false)
  const [rf, sRf] = useState({ rating:5, title:'', comment:'', visitType:'clinic' })
  const [bf, sBf] = useState({ date:'', time:'', type:'clinic', reason:'' })
  const [sbR, ssbR] = useState(false)
  const [sbB, ssbB] = useState(false)
  const TIMES = ['09:00 AM','09:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM','02:00 PM','02:30 PM','03:00 PM','04:00 PM','05:00 PM','06:00 PM']

  useEffect(() => {
    if (!slug) return
    doctorsApi.getBySlug(slug as string)
      .then(r => setDoc(r.data.doctor))
      .catch(() => toast.error('Doctor not found'))
      .finally(() => setLoad(false))
  }, [slug])

  useEffect(() => {
    if (!doc) return
    reviewsApi.list(doc._id, { limit:30 }).then(r => setRevs(r.data.reviews||[])).catch(()=>{})
  }, [doc])

  const doReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAuthenticated) { toast.error('Sign in to review'); return }
    if (!rf.comment.trim()) { toast.error('Write a comment'); return }
    ssbR(true)
    try {
      const r = await reviewsApi.create(doc._id, rf)
      setRevs(p => [r.data.review, ...p])
      toast.success('Review submitted!')
      sRf({ rating:5, title:'', comment:'', visitType:'clinic' })
    } catch(e:any) { toast.error(e.response?.data?.message||'Failed') }
    finally { ssbR(false) }
  }

  const doBook = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAuthenticated) { toast.error('Sign in to book'); return }
    if (!bf.date || !bf.time) { toast.error('Pick date & time'); return }
    ssbB(true)
    try {
      await bookingsApi.create({ doctorId:doc._id, ...bf })
      toast.success('Appointment booked!')
      sBf({ date:'', time:'', type:'clinic', reason:'' })
      setTab('ov')
    } catch(e:any) { toast.error(e.response?.data?.message||'Failed') }
    finally { ssbB(false) }
  }

  /* ── Loading ── */
  if (load) return (
    <div className={`${cormorant.variable} ${dmSans.variable} min-h-screen flex items-center justify-center bg-[#FFFAF4] pt-20`}>
      <div className="dp-spin w-8 h-8 rounded-full border-[2.5px] border-[#D25380] border-t-transparent" />
    </div>
  )

  /* ── Not found ── */
  if (!doc) return (
    <div className={`${cormorant.variable} ${dmSans.variable} min-h-screen flex flex-col items-center justify-center gap-4 bg-[#FFFAF4]`}>
      <p className="text-2xl text-[#2A1520]" style={{ fontFamily:'var(--font-cormorant)' }}>Doctor not found</p>
      <Link href="/doctors" className="bg-[#D25380] text-white px-7 py-3 rounded-xl text-sm font-semibold no-underline">Browse Doctors</Link>
    </div>
  )

  const cl   = doc.clinics?.[0]
  const mode = doc.consultationMode==='Both' ? 'Clinic + Online' : (doc.consultationMode||'Clinic')
  const rd: Record<number,number> = {}
  revs.forEach(r => { rd[r.rating]=(rd[r.rating]||0)+1 })

  return (
    <div className={`${cormorant.variable} ${dmSans.variable} bg-[#FFFAF4] min-h-screen pt-16 text-[#2A1520]`}
      style={{ fontFamily:'var(--font-dm)' }}>

      {/* ── Breadcrumb ── */}
      <div style={{ background:'linear-gradient(135deg,#D25380,#E08E6D)' }}>
        <div className="max-w-[1100px] mx-auto px-8 py-2.5 flex items-center gap-1.5 text-xs">
          <Link href="/"        className="text-white/55 no-underline">Home</Link>
          <ChevronRight size={11} className="text-white/30"/>
          <Link href="/doctors" className="text-white/55 no-underline">Doctors</Link>
          <ChevronRight size={11} className="text-white/30"/>
          <span className="text-white/90">{doc.name}</span>
        </div>
      </div>

      {/* ── Hero ── */}
      <div className="relative overflow-hidden" style={{ background:'linear-gradient(135deg,#D25380 0%,#E08E6D 60%,#F6C391 100%)' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage:'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.08) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(255,255,255,0.05) 0%, transparent 40%)' }}/>
        <div className="max-w-[1100px] mx-auto px-8 pt-8 pb-[68px] relative z-10">
          <div className="flex gap-5 items-start">

            {/* Avatar */}
            <div className="shrink-0 relative">
              <div className="w-[86px] h-[86px] rounded-[20px] overflow-hidden border-[3px] border-white/35 bg-white/15 shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
                <Image src={doc.photo||getAvatarUrl(doc.name)} alt={doc.name} width={86} height={86}
                  className="object-cover w-full h-full" unoptimized/>
              </div>
              {doc.availableToday && (
                <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white/95 text-[#5A6B2A] text-[9px] font-bold px-2.5 py-0.5 rounded-full tracking-[0.07em] shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
                  ● AVAILABLE
                </span>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1.5">
                <h1 className="text-[clamp(20px,3vw,30px)] font-semibold text-white m-0 leading-[1.15] tracking-[-0.01em]"
                  style={{ fontFamily:'var(--font-cormorant)' }}>{doc.name}</h1>
                {doc.isVerified && <BadgeCheck size={18} className="text-white/90 shrink-0"/>}
                {doc.rank!=null && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-white/70 bg-white/15 px-2.5 py-0.5 rounded-full border border-white/20 whitespace-nowrap">
                    <Hash size={8}/> Rank {doc.rank}
                  </span>
                )}
                {doc.badge && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-white/20 text-white px-2.5 py-0.5 rounded-full border border-white/25 whitespace-nowrap">
                    <Award size={8}/> {doc.badge}
                  </span>
                )}
              </div>

              {(doc.qualificationText||doc.experience) && (
                <p className="text-white/70 text-[13px] font-normal m-0 mb-2.5 leading-[1.4]" style={{ fontFamily:'var(--font-dm)' }}>
                  {[doc.qualificationText, doc.experience?`${doc.experience} yrs experience`:null].filter(Boolean).join(' · ')}
                </p>
              )}

              {doc.specializations?.length>0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {doc.specializations.map((s:any) => <Chip key={s._id} label={`${s.icon} ${s.name}`} v="w"/>)}
                </div>
              )}

              <div className="flex flex-wrap gap-4 items-center">
                <span className="flex items-center gap-1.5 text-xs text-white/65">
                  {doc.consultationMode==='Online'?<Monitor size={12}/>:doc.consultationMode==='Both'?<Video size={12}/>:<Building2 size={12}/>} {mode}
                </span>
                {(doc.primaryArea||doc.primaryCity) && (
                  <span className="flex items-center gap-1.5 text-xs text-white/65">
                    <MapPin size={12}/> {[doc.primaryArea,doc.primaryCity].filter(Boolean).join(', ')}
                  </span>
                )}
                {doc.languages?.length>0 && (
                  <span className="flex items-center gap-1.5 text-xs text-white/65">
                    <Languages size={12}/> {doc.languages.join(', ')}
                  </span>
                )}
                {doc.totalReviews>0 && (
                  <span className="flex items-center gap-1.5">
                    <Stars n={doc.averageRating} size={13}/>
                    <span className="text-[13px] font-semibold text-white">{doc.averageRating.toFixed(1)}</span>
                    <span className="text-xs text-white/50">({doc.totalReviews})</span>
                  </span>
                )}
              </div>
            </div>

            {/* Save */}
            <button onClick={()=>setSaved(p=>!p)}
              className="shrink-0 bg-white/15 border border-white/25 rounded-xl p-2.5 cursor-pointer backdrop-blur-md transition-all hover:bg-white/25"
              style={{ color:saved?'#fff':'rgba(255,255,255,0.5)' }}>
              <Bookmark size={17} fill={saved?'#fff':'none'}/>
            </button>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-[1100px] mx-auto px-8 pb-16">
        <div className="grid gap-5 items-start" style={{ gridTemplateColumns:'1fr 268px', marginTop:'-32px' }}>

          {/* ════ LEFT ════ */}
          <div className="dp-fu flex flex-col gap-3.5">

            {/* Stats bar */}
            <div className="flex gap-2.5">
              {[
                { icon:<TrendingUp size={15} style={{ color:C.pink }}/>,  val:doc.experience?`${doc.experience} yrs`:'—', label:'Experience' },
                { icon:<Star       size={15} style={{ color:C.peach }}/>, val:`${doc.averageRating.toFixed(1)}/5`,         label:'Rating'     },
                { icon:<Users      size={15} style={{ color:C.coral }}/>, val:String(doc.totalReviews||0),                 label:'Reviews'    },
                { icon:<Calendar   size={15} style={{ color:C.muD  }}/>, val:`${doc.totalBookings||0}+`,                  label:'Bookings'   },
              ].map(s => (
                <div key={s.label} className="flex-1 flex flex-col items-center justify-center py-4 px-2 bg-white rounded-[14px] border border-[#D25380]/10 text-center shadow-[0_1px_8px_rgba(210,83,128,0.06)]">
                  <div className="mb-1.5">{s.icon}</div>
                  <div className="text-[20px] font-bold leading-none text-[#2A1520]"
                    style={{ fontFamily:'var(--font-cormorant)' }}>{s.val}</div>
                  <div className="text-[11px] text-[#AA8090] mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Tabs card */}
            <div className="bg-white rounded-2xl border border-[#D25380]/10 shadow-[0_2px_12px_rgba(210,83,128,0.06)] overflow-hidden">
              {/* Tab bar */}
              <div className="flex border-b border-[#FFF0E6] overflow-x-auto">
                {[{k:'ov',l:'Overview'},{k:'cl',l:'Clinical'},{k:'rv',l:`Reviews (${revs.length})`},{k:'bk',l:'Book'}].map(t => (
                  <button key={t.k}
                    className={`flex-1 px-2 py-3.5 text-[13px] bg-transparent border-none cursor-pointer whitespace-nowrap transition-all min-w-0 ${tab===t.k?'dp-tb-on font-semibold text-[#D25380]':'dp-tb-off text-[#AA8090]'}`}
                    style={{ fontFamily:'var(--font-dm)' }}
                    onClick={()=>setTab(t.k as any)}>
                    {t.k==='ov'?'📋 ':t.k==='cl'?'🩺 ':t.k==='rv'?'⭐ ':'📅 '}{t.l}
                  </button>
                ))}
              </div>

              <div className="p-6">

                {/* ── OVERVIEW ── */}
                {tab==='ov' && (
                  <div className="flex flex-col gap-5">
                    {doc.about && (
                      <div>
                        <SH t="About"/>
                        <p className="text-sm text-[#7A4A58] leading-[1.8] font-light m-0">{doc.about}</p>
                      </div>
                    )}

                    {(doc.qualifications?.length>0||doc.qualificationText) && (
                      <div>
                        <SH t="Education"/>
                        <div className="flex flex-col gap-2">
                          {doc.qualificationText && !doc.qualifications?.length ? (
                            <div className="flex items-center gap-3 px-4 py-3 rounded-[11px]" style={{ background:C.sf }}>
                              <div className="w-9 h-9 rounded-[9px] bg-[#D25380]/[0.08] flex items-center justify-center shrink-0">
                                <span className="text-[10px] font-bold text-[#D25380]" style={{ fontFamily:'var(--font-dm)' }}>MD</span>
                              </div>
                              <span className="text-sm font-medium text-[#2A1520]">{doc.qualificationText}</span>
                            </div>
                          ) : doc.qualifications?.map((q:any,i:number) => (
                            <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-[11px]" style={{ background:C.sf }}>
                              <div className="w-9 h-9 rounded-[9px] bg-[#D25380]/[0.08] flex items-center justify-center shrink-0">
                                <span className="text-[10px] font-bold text-[#D25380]">{q.degree?.slice(0,2)}</span>
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-[#2A1520]">{q.degree}</div>
                                {q.institution && <div className="text-xs text-[#AA8090] mt-0.5">{q.institution}{q.year?` · ${q.year}`:''}</div>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {cl && (
                      <div>
                        <SH t="Clinic"/>
                        <div className="rounded-[13px] p-4 border border-[#D25380]/[0.08]" style={{ background:C.sf }}>
                          <div className="text-sm font-semibold text-[#2A1520] mb-2">{cl.name}</div>
                          {(cl.address||cl.area||cl.city) && (
                            <div className="flex items-start gap-2 mb-2.5">
                              <MapPin size={13} className="shrink-0 mt-0.5" style={{ color:C.pink }}/>
                              <span className="text-[13px] text-[#7A4A58] leading-[1.55]">
                                {[cl.address,cl.area,cl.city,cl.state].filter(Boolean).join(', ')}{cl.pincode?` — ${cl.pincode}`:''}
                              </span>
                            </div>
                          )}
                          {cl.timings?.length>0 && (
                            <div className="border-t border-[#D25380]/[0.08] pt-2.5">
                              {cl.timings.map((t:any,i:number) => (
                                <div key={i} className="flex items-center gap-2 mb-1.5">
                                  <Clock size={11} style={{ color:C.coral }}/>
                                  <span className="text-xs text-[#AA8090] min-w-[130px]">{t.day}</span>
                                  <span className="text-xs font-medium text-[#2A1520]">{t.startTime} – {t.endTime}</span>
                                </div>
                              ))}
                            </div>
                          )}
                          <div className="flex gap-4 mt-2.5 flex-wrap">
                            {cl.phone && (
                              <a href={`tel:${cl.phone}`} className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D25380] no-underline">
                                <Phone size={12}/> {cl.phone}
                              </a>
                            )}
                            {cl.googleMapsLink && (
                              <a href={cl.googleMapsLink} target="_blank" rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-xs font-semibold no-underline" style={{ color:C.sgD }}>
                                <MapPin size={12}/> Maps <ArrowUpRight size={11}/>
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-5">
                      {doc.languages?.length>0 && (
                        <div><SH t="Languages"/><div className="flex flex-wrap gap-1.5">{doc.languages.map((l:string) => <Chip key={l} label={l} v="g"/>)}</div></div>
                      )}
                      {doc.services?.length>0 && (
                        <div><SH t="Services"/><div className="flex flex-wrap gap-1.5">{doc.services.slice(0,6).map((s:string) => <Chip key={s} label={s} v="d"/>)}</div></div>
                      )}
                    </div>

                    {(doc.conditionsTreated?.length>0||doc.proceduresOffered?.length>0) && (
                      <div>
                        <SH t="Speciality at a Glance"/>
                        <div className="grid grid-cols-2 gap-3">
                          {doc.conditionsTreated?.length>0 && (
                            <div className="rounded-xl p-4 border border-[#D25380]/[0.08]" style={{ background:C.sf }}>
                              <div className="text-[10px] font-semibold tracking-[0.1em] uppercase text-[#D25380] mb-2.5" style={{ fontFamily:'var(--font-dm)' }}>Conditions</div>
                              {doc.conditionsTreated.slice(0,5).map((c:string) => (
                                <div key={c} className="flex items-center gap-2 py-1">
                                  <div className="w-1.5 h-1.5 rounded-full bg-[#D25380] shrink-0"/>
                                  <span className="text-xs text-[#7A4A58]">{c}</span>
                                </div>
                              ))}
                              {doc.conditionsTreated.length>5 && <span className="text-[11px] text-[#AA8090] mt-1 block">+{doc.conditionsTreated.length-5} more</span>}
                            </div>
                          )}
                          {doc.proceduresOffered?.length>0 && (
                            <div className="rounded-xl p-4 border border-[#F6C391]/30 bg-[#F6C391]/10">
                              <div className="text-[10px] font-semibold tracking-[0.1em] uppercase text-[#B86A2A] mb-2.5" style={{ fontFamily:'var(--font-dm)' }}>Procedures</div>
                              {doc.proceduresOffered.slice(0,5).map((p:string) => (
                                <div key={p} className="flex items-center gap-2 py-1">
                                  <CheckCircle size={11} className="shrink-0" style={{ color:C.coral }}/>
                                  <span className="text-xs text-[#8A5020]">{p}</span>
                                </div>
                              ))}
                              {doc.proceduresOffered.length>5 && <span className="text-[11px] text-[#AA8090] mt-1 block">+{doc.proceduresOffered.length-5} more</span>}
                            </div>
                          )}
                        </div>
                        {(doc.conditionsTreated?.length>5||doc.proceduresOffered?.length>5) && (
                          <button onClick={()=>setTab('cl')} className="mt-2.5 text-xs text-[#D25380] font-semibold bg-transparent border-none cursor-pointer p-0"
                            style={{ fontFamily:'var(--font-dm)' }}>View full clinical details →</button>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* ── CLINICAL ── */}
                {tab==='cl' && (
                  <div className="flex flex-col gap-5">
                    {doc.conditionsTreated?.length>0 && (
                      <div>
                        <SH t="Conditions Treated"/>
                        <div className="grid gap-2" style={{ gridTemplateColumns:'repeat(auto-fill,minmax(148px,1fr))' }}>
                          {doc.conditionsTreated.map((c:string) => (
                            <div key={c} className="flex items-center gap-2 px-3.5 py-2.5 rounded-[10px] text-[13px] font-medium border border-[#D25380]/[0.08]" style={{ background:C.sf }}>
                              <Stethoscope size={12} className="shrink-0" style={{ color:C.pink }}/>
                              <span style={{ color:C.ink }}>{c}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {doc.proceduresOffered?.length>0 && (
                      <div>
                        <SH t="Procedures Offered"/>
                        <div className="grid gap-2" style={{ gridTemplateColumns:'repeat(auto-fill,minmax(148px,1fr))' }}>
                          {doc.proceduresOffered.map((p:string) => (
                            <div key={p} className="flex items-center gap-2 px-3.5 py-2.5 rounded-[10px] text-[13px] font-medium border border-[#E08E6D]/20 bg-[#F6C391]/10">
                              <CheckCircle size={12} className="shrink-0" style={{ color:C.coral }}/>
                              <span style={{ color:'#8A5020' }}>{p}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {doc.equipment?.length>0 && (
                      <div>
                        <SH t="Equipment"/>
                        <div className="flex flex-wrap gap-2">
                          {doc.equipment.map((e:string) => (
                            <span key={e} className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white rounded-full border border-[#D25380]/10 text-xs text-[#7A4A58] font-medium">
                              <Wrench size={10} style={{ color:C.mu }}/> {e}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {!doc.conditionsTreated?.length && !doc.proceduresOffered?.length && (
                      <p className="text-center text-[#AA8090] py-10 text-sm">No clinical details available.</p>
                    )}
                  </div>
                )}

                {/* ── REVIEWS ── */}
                {tab==='rv' && (
                  <div className="flex flex-col gap-4">
                    {revs.length>0 && (
                      <div className="flex gap-6 p-4 rounded-[13px] items-center border border-[#D25380]/[0.08]" style={{ background:C.sf }}>
                        <div className="text-center shrink-0">
                          <div className="text-[44px] font-bold text-[#D25380] leading-none"
                            style={{ fontFamily:'var(--font-cormorant)' }}>{doc.averageRating.toFixed(1)}</div>
                          <Stars n={doc.averageRating} size={15}/>
                          <div className="text-[11px] text-[#AA8090] mt-1">{revs.length} reviews</div>
                        </div>
                        <div className="flex-1">
                          {[5,4,3,2,1].map(n => {
                            const ct=rd[n]||0, pct=revs.length?(ct/revs.length)*100:0
                            return (
                              <div key={n} className="flex items-center gap-2 mb-1.5">
                                <span className="text-[11px] text-[#AA8090] w-[18px]">{n}★</span>
                                <div className="flex-1 h-1.5 bg-[#D25380]/10 rounded-full overflow-hidden">
                                  <div className="h-full rounded-full" style={{ width:`${pct}%`, background:`linear-gradient(to right,${C.pink},${C.peach})` }}/>
                                </div>
                                <span className="text-[11px] text-[#AA8090] w-5 text-right">{ct}</span>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {/* Write review */}
                    <div className="p-4 rounded-[13px] border border-[#D25380]/10 bg-[#D25380]/[0.03]">
                      <div className="text-[13px] font-semibold text-[#2A1520] mb-3.5 flex items-center gap-1.5">
                        <MessageSquare size={14} style={{ color:C.pink }}/> Share Your Experience
                      </div>
                      <form onSubmit={doReview} className="flex flex-col gap-2.5">
                        <Stars n={rf.rating} size={28} pick={rf.rating} onPick={v=>sRf(p=>({...p,rating:v}))}/>
                        <input className={INP} value={rf.title} onChange={e=>sRf(p=>({...p,title:e.target.value}))} placeholder="Headline (optional)"/>
                        <textarea className={INP} value={rf.comment} onChange={e=>sRf(p=>({...p,comment:e.target.value}))}
                          placeholder="Describe your experience…" rows={3} style={{ resize:'none' }} required/>
                        <div className="flex items-center justify-between gap-2.5">
                          <select className={INP} value={rf.visitType} onChange={e=>sRf(p=>({...p,visitType:e.target.value}))} style={{ width:'auto' }}>
                            <option value="clinic">Clinic Visit</option>
                            <option value="online">Online Consult</option>
                          </select>
                          <button type="submit" disabled={sbR||!isAuthenticated} className={BTN_PRI}
                            style={{ width:'auto', padding:'10px 22px', fontSize:13, background:'linear-gradient(135deg,#D25380,#E08E6D)', boxShadow:'0 4px 16px rgba(210,83,128,0.25)' }}>
                            {sbR?'Submitting…':'Submit'}
                          </button>
                        </div>
                        {!isAuthenticated && <p className="text-xs text-[#D25380] m-0"><Link href="/auth/login" className="text-[#D25380] font-semibold">Sign in</Link> to submit.</p>}
                      </form>
                    </div>

                    {revs.length===0
                      ? <p className="text-center text-[#AA8090] py-7 text-sm">No reviews yet. Be the first!</p>
                      : revs.map(r => (
                        <div key={r._id} className="p-4 rounded-xl border border-[#D25380]/[0.08] bg-white">
                          <div className="flex items-center justify-between mb-2.5">
                            <div className="flex items-center gap-2.5">
                              <div className="w-[34px] h-[34px] rounded-[10px] bg-[#D25380]/[0.08] flex items-center justify-center text-[13px] font-bold text-[#D25380]">
                                {r.user?.name?.charAt(0)?.toUpperCase()}
                              </div>
                              <div>
                                <div className="text-[13px] font-semibold text-[#2A1520]">{r.user?.name}</div>
                                <div className="text-[11px] text-[#AA8090]">{formatDate(r.createdAt)}</div>
                              </div>
                            </div>
                            <Stars n={r.rating} size={12}/>
                          </div>
                          {r.title && <div className="text-[13px] font-semibold text-[#2A1520] mb-1">{r.title}</div>}
                          <p className="text-[13px] text-[#7A4A58] leading-[1.65] font-light m-0">{r.comment}</p>
                          <div className="flex gap-2 mt-2">
                            <span className="text-[11px] px-2.5 py-0.5 rounded-full font-medium"
                              style={{ background:r.visitType==='online'?'rgba(224,142,109,0.1)':C.sf, color:r.visitType==='online'?C.coral:C.mu }}>
                              {r.visitType==='online'?'🌐 Online':'🏥 Clinic'}
                            </span>
                            {r.recommended && <span className="text-[11px] font-medium" style={{ color:C.sgD }}>✓ Recommended</span>}
                          </div>
                        </div>
                      ))
                    }
                  </div>
                )}

                {/* ── BOOK ── */}
                {tab==='bk' && (
                  <form onSubmit={doBook} className="flex flex-col gap-5">
                    <div className="text-[22px] font-semibold text-[#2A1520]"
                      style={{ fontFamily:'var(--font-cormorant)' }}>Book an Appointment</div>

                    <div>
                      <div className="text-[11px] font-semibold text-[#AA8090] tracking-[0.1em] uppercase mb-2.5">Consultation Type</div>
                      <div className="flex gap-3">
                        {['clinic','online'].map(type => (
                          <button key={type} type="button"
                            className={`flex-1 px-2.5 py-4 rounded-[14px] border text-center cursor-pointer transition-all ${bf.type===type?'dp-tyb-on border-[#D25380] bg-[#D25380]/[0.04]':'border-[#D25380]/15 bg-white hover:border-[#D25380]'}`}
                            style={{ fontFamily:'var(--font-dm)' }}
                            onClick={()=>sBf(p=>({...p,type}))}>
                            <div className="text-[22px] mb-1.5">{type==='clinic'?'🏥':'🌐'}</div>
                            <div className="text-[13px] font-semibold text-[#2A1520]">{type==='clinic'?'Clinic Visit':'Online Consult'}</div>
                            <div className="text-xs text-[#D25380] font-semibold mt-0.5">
                              {type==='clinic'?(doc.consultationFee!=null?formatFee(doc.consultationFee):'Call for fee'):(doc.onlineFee!=null?formatFee(doc.onlineFee):'Call for fee')}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-[11px] font-semibold text-[#AA8090] tracking-[0.1em] uppercase mb-2">Date</div>
                        <input type="date" className={INP} value={bf.date}
                          onChange={e=>sBf(p=>({...p,date:e.target.value}))}
                          min={new Date().toISOString().split('T')[0]} required/>
                      </div>
                      <div>
                        <div className="text-[11px] font-semibold text-[#AA8090] tracking-[0.1em] uppercase mb-2">
                          Reason <span className="font-light normal-case">(opt)</span>
                        </div>
                        <input className={INP} value={bf.reason} onChange={e=>sBf(p=>({...p,reason:e.target.value}))} placeholder="Brief concern…"/>
                      </div>
                    </div>

                    <div>
                      <div className="text-[11px] font-semibold text-[#AA8090] tracking-[0.1em] uppercase mb-2">Time Slot</div>
                      <div className="grid gap-1.5" style={{ gridTemplateColumns:'repeat(6,1fr)' }}>
                        {TIMES.map(t => (
                          <button key={t} type="button"
                            className={`py-2 px-0.5 rounded-[9px] text-[11px] font-medium border cursor-pointer transition-all text-center ${bf.time===t?'dp-tm-on bg-[#D25380] text-white border-[#D25380]':'border-[#D25380]/15 bg-white text-[#AA8090] hover:border-[#D25380] hover:text-[#D25380]'}`}
                            style={{ fontFamily:'var(--font-dm)' }}
                            onClick={()=>sBf(p=>({...p,time:t}))}>{t}</button>
                        ))}
                      </div>
                    </div>

                    {!isAuthenticated && <p className="text-xs text-[#D25380] m-0"><Link href="/auth/login" className="text-[#D25380] font-semibold">Sign in</Link> to book.</p>}
                    <button type="submit" disabled={sbB||!isAuthenticated} className={BTN_PRI}
                      style={{ padding:15, background:'linear-gradient(135deg,#D25380,#E08E6D)', boxShadow:'0 4px 16px rgba(210,83,128,0.25)' }}>
                      {sbB?'Booking…':'Confirm Appointment'}
                    </button>
                  </form>
                )}

              </div>
            </div>
          </div>

          {/* ════ RIGHT SIDEBAR ════ */}
          <div className="flex flex-col gap-3.5 relative z-20">

            {/* Fee card */}
            <div className="bg-white rounded-2xl border border-[#D25380]/10 shadow-[0_2px_12px_rgba(210,83,128,0.06)] overflow-hidden">
              <div className="px-5 py-4" style={{ background:'linear-gradient(135deg,#D25380,#E08E6D)' }}>
                <div className="text-[10px] font-semibold tracking-[0.1em] uppercase text-white/55 mb-1">Consultation Fee</div>
                <div className="text-[30px] font-bold text-white leading-none" style={{ fontFamily:'var(--font-cormorant)' }}>
                  {doc.consultationFee!=null ? formatFee(doc.consultationFee) : <span className="text-base font-normal">On Request</span>}
                </div>
                {doc.onlineFee!=null && (
                  <div className="text-xs text-white/65 mt-1.5">
                    Online: <span className="font-bold text-white">{formatFee(doc.onlineFee)}</span>
                  </div>
                )}
              </div>
              <div className="p-4 flex flex-col gap-2 bg-white">
                <button onClick={()=>setTab('bk')} className={BTN_PRI}
                  style={{ background:'linear-gradient(135deg,#D25380,#E08E6D)', boxShadow:'0 4px 16px rgba(210,83,128,0.25)' }}>
                  <Calendar size={15}/> Book Appointment
                </button>
                {doc.phone && <a href={`tel:${doc.phone}`} className={BTN_OUT}><Phone size={13}/> Call Clinic</a>}
                {doc.googleMapsLink && (
                  <a href={doc.googleMapsLink} target="_blank" rel="noopener noreferrer"
                    className={BTN_OUT} style={{ color:C.sgD, borderColor:'rgba(143,175,69,0.3)' }}>
                    <MapPin size={13}/> View on Maps
                  </a>
                )}
              </div>
            </div>

            {/* Doctor info */}
            <div className="bg-white rounded-2xl border border-[#D25380]/10 shadow-[0_2px_12px_rgba(210,83,128,0.06)] p-4">
              <div className="text-[16px] font-semibold text-[#2A1520] mb-3.5" style={{ fontFamily:'var(--font-cormorant)' }}>About the Doctor</div>
              <div className="flex flex-col gap-2">
                {doc.isVerified && (
                  <div className="flex items-center gap-2 px-3 py-2.5 rounded-[10px] bg-[#8FAF45]/[0.08] border border-[#8FAF45]/[0.18]">
                    <BadgeCheck size={14} className="shrink-0" style={{ color:C.sgD }}/>
                    <span className="text-xs font-medium" style={{ color:C.sgD }}>Verified Doctor</span>
                  </div>
                )}
                {doc.consultationMode && (
                  <div className="flex items-center gap-2 px-3 py-2.5 rounded-[10px]" style={{ background:C.sf }}>
                    {doc.consultationMode==='Online'?<Monitor size={13} className="shrink-0" style={{ color:C.mu }}/>:doc.consultationMode==='Both'?<Video size={13} className="shrink-0" style={{ color:C.mu }}/>:<Building2 size={13} className="shrink-0" style={{ color:C.mu }}/>}
                    <span className="text-xs" style={{ color:C.muD }}>{mode}</span>
                  </div>
                )}
                {doc.availableToday && (
                  <div className="flex items-center gap-2 px-3 py-2.5 rounded-[10px] bg-[#8FAF45]/[0.08]">
                    <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background:C.sg, boxShadow:`0 0 6px ${C.sg}` }}/>
                    <span className="text-xs font-medium" style={{ color:C.sgD }}>Available Today</span>
                  </div>
                )}
                {doc.experience && (
                  <div className="flex items-center gap-2 px-3 py-2.5 rounded-[10px]" style={{ background:C.sf }}>
                    <TrendingUp size={13} className="shrink-0" style={{ color:C.coral }}/>
                    <span className="text-xs" style={{ color:C.muD }}>{doc.experience} years experience</span>
                  </div>
                )}
              </div>
            </div>

            {/* Location */}
            {cl && (
              <div className="bg-white rounded-2xl border border-[#D25380]/10 shadow-[0_2px_12px_rgba(210,83,128,0.06)] p-4">
                <div className="text-[16px] font-semibold text-[#2A1520] mb-3" style={{ fontFamily:'var(--font-cormorant)' }}>Location</div>
                <div className="text-[13px] font-semibold text-[#2A1520] mb-1.5">{cl.name}</div>
                {(cl.area||cl.city) && (
                  <div className="flex items-start gap-1.5 mb-2.5">
                    <MapPin size={12} className="shrink-0 mt-0.5" style={{ color:C.pink }}/>
                    <span className="text-xs leading-[1.55]" style={{ color:C.muD }}>{[cl.area,cl.city,cl.state].filter(Boolean).join(', ')}</span>
                  </div>
                )}
                {cl.googleMapsLink && (
                  <a href={cl.googleMapsLink} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold no-underline" style={{ color:C.sgD }}>
                    <ArrowUpRight size={11}/> Open in Maps
                  </a>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}