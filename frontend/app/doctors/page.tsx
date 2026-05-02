'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight, SlidersHorizontal, X, MapPin, BadgeCheck, Award, Bookmark, ArrowUpRight, Hash, Monitor, Building2, Video, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import { doctorsApi, authApi } from '@/lib/api'
import { useAuthStore } from '@/lib/store'
import { formatFee, getAvatarUrl } from '@/lib/utils'
import toast from 'react-hot-toast'

const cormorant = Cormorant_Garamond({ subsets:['latin'], weight:['400','600','700'], style:['normal','italic'], display:'swap', variable:'--font-cormorant' })
const dmSans    = DM_Sans({ subsets:['latin'], weight:['300','400','500','600'], display:'swap', variable:'--font-dm' })

const PINK  = 'color:#D25380;font-weight:bold'
const AMBER = 'color:#C47A3A;font-weight:bold'
const RED   = 'color:#cc0000;font-weight:bold'
function clog(tag: string, ...args: unknown[]) { console.log(`%c[DOCTORS:${tag}]`, PINK, ...args) }
function cwarn(tag: string, ...args: unknown[]) { console.warn(`%c[DOCTORS:${tag}] ⚠`, AMBER, ...args) }
function cerr(tag: string, ...args: unknown[]) { console.error(`%c[DOCTORS:${tag}] ✗`, RED, ...args) }

const C = {
  bg:'#FFFAF4', pink:'#D25380', coral:'#E08E6D', peach:'#F6C391',
  ink:'#2A1520', muD:'#7A4A58', mu:'#AA8090',
  sf:'#FFF0E6', bd:'rgba(210,83,128,0.12)', wh:'#ffffff',
  sg:'#8FAF45', sgD:'#5A6B2A',
  shadowCard:    '0 2px 12px rgba(160,60,80,0.10), 0 1px 4px rgba(160,60,80,0.06)',
  shadowSidebar: '0 4px 24px rgba(160,60,80,0.13), 0 1px 6px rgba(160,60,80,0.07)',
  shadowHover:   '0 8px 32px rgba(160,60,80,0.16), 0 2px 8px rgba(160,60,80,0.08)',
}

const SORT_OPTIONS = [
  { value:'',           label:'Most Relevant'    },
  { value:'rating',     label:'Highest Rated'    },
  { value:'reviews',    label:'Most Reviewed'    },
  { value:'experience', label:'Most Experienced' },
  { value:'fee_asc',    label:'Fee: Low → High'  },
  { value:'fee_desc',   label:'Fee: High → Low'  },
  { value:'rank',       label:'By Rank'          },
]
const FEE_RANGES = [
  { label:'Any',         min:'',    max:''    },
  { label:'Under ₹300',  min:'0',   max:'300' },
  { label:'₹300 – ₹600', min:'300', max:'600' },
  { label:'₹600+',       min:'600', max:''    },
]
const JAIPUR_AREAS = [
  'Adarsh Nagar','Bani Park','Bapu Nagar','C Scheme','Chitrakoot',
  'Durgapura','Gopalpura','Jagatpura','Jhotwara','Lal Kothi',
  'Malviya Nagar','Mansarovar','Nirman Nagar','Pratap Nagar',
  'Raja Park','Sanganer','Shastri Nagar','Sirsi Road','Sodala',
  'Tilak Nagar','Vaishali Nagar','Vidhyadhar Nagar',
]

function ModeBadge({ mode }: { mode?:string }) {
  if (!mode) return null
  const cfg: Record<string,{icon:React.ReactNode;label:string;bg:string;color:string}> = {
    Clinic: { icon:<Building2 size={10}/>, label:'Clinic',          bg:'rgba(246,195,145,0.18)', color:'#8A5020' },
    Online: { icon:<Monitor   size={10}/>, label:'Online',          bg:'rgba(143,175,69,0.12)',  color:C.sgD    },
    Both:   { icon:<Video     size={10}/>, label:'Clinic + Online', bg:'rgba(210,83,128,0.08)', color:C.pink   },
  }
  const c = cfg[mode]; if (!c) return null
  return (
    <span className={dmSans.className} style={{ display:'inline-flex', alignItems:'center', gap:4, fontSize:10, fontWeight:600, padding:'3px 9px', borderRadius:100, background:c.bg, color:c.color, letterSpacing:'0.04em' }}>
      {c.icon} {c.label}
    </span>
  )
}

// ─── Desktop / Tablet Doctor Card (horizontal) ───────────────────────────────
function DoctorRow({ doctor, saved, onSave }: { doctor:any; saved:boolean; onSave:(id:string)=>void }) {
  const specs      = (doctor.specializations || []).slice(0,2)
  const conditions = (doctor.conditionsTreated || []).slice(0,3)
  const procedures = (doctor.proceduresOffered || []).slice(0,2)
  const accentBg   = doctor.isFeatured ? `linear-gradient(to bottom,${C.pink},${C.coral})` : C.sf

  return (
    <div
      className="dre bg-white rounded-2xl overflow-hidden mb-2.5 flex cursor-pointer"
      style={{ border:'1.5px solid rgba(210,83,128,0.07)', boxShadow:C.shadowCard, transition:'all .2s ease' }}
      onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.borderColor=C.bd;el.style.boxShadow=C.shadowHover;el.style.transform='translateY(-1px)'}}
      onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.borderColor='rgba(210,83,128,0.07)';el.style.boxShadow=C.shadowCard;el.style.transform='none'}}
    >
      <div className="w-1 shrink-0 rounded-l-2xl" style={{ background:accentBg }}/>
      <div className="p-[18px_0_18px_18px] shrink-0">
        <div className="relative">
          <div className="w-[70px] h-[70px] rounded-[14px] overflow-hidden border-2 border-[#D25380]/10" style={{ background:C.sf }}>
            <Image src={doctor.photo||getAvatarUrl(doctor.name)} alt={doctor.name} width={70} height={70} className="object-cover w-full h-full" unoptimized/>
          </div>
          {doctor.availableToday && (
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white" style={{ background:C.sg, boxShadow:`0 0 6px ${C.sg}` }}/>
          )}
        </div>
      </div>
      <div className="flex-1 min-w-0 p-[18px_16px_18px_14px]">
        <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
          <h3 className={cormorant.className} style={{ fontSize:17, fontWeight:600, color:C.ink, lineHeight:1.2, margin:0 }}>{doctor.name}</h3>
          {doctor.isVerified && <BadgeCheck size={14} className="shrink-0" style={{ color:C.pink }}/>}
          {doctor.rank!=null && (
            <span className={`${dmSans.className} inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full`} style={{ color:C.mu, background:C.sf }}>
              <Hash size={8}/> {doctor.rank}
            </span>
          )}
        </div>
        {(doctor.qualificationText||doctor.experience) && (
          <p className={dmSans.className} style={{ fontSize:12, color:C.mu, margin:'0 0 8px', fontWeight:400 }}>
            {[doctor.qualificationText, doctor.experience?`${doctor.experience} yrs exp`:null].filter(Boolean).join(' · ')}
          </p>
        )}
        <div className="flex flex-wrap gap-1.5 mb-2">
          {specs.map((s:any,i:number) => (
            <span key={i} className={`${dmSans.className} text-[11px] font-medium px-2.5 py-0.5 rounded-full`} style={{ color:C.pink, background:'rgba(210,83,128,0.07)' }}>
              {s.icon||'🩺'} {s.name}
            </span>
          ))}
          <ModeBadge mode={doctor.consultationMode}/>
          {doctor.badge && (
            <span className={`${dmSans.className} inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-0.5 rounded-full`}
              style={{ background:doctor.badge==='Top Doctor'?'rgba(246,195,145,0.2)':'rgba(210,83,128,0.07)', color:doctor.badge==='Top Doctor'?'#8A5020':C.pink }}>
              <Award size={9}/> {doctor.badge}
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-1">
          {conditions.map((c:string) => (
            <span key={c} className={`${dmSans.className} text-[11px] px-2 py-0.5 rounded-[6px]`} style={{ color:C.muD, background:C.sf }}>{c}</span>
          ))}
          {procedures.map((p:string) => (
            <span key={p} className={`${dmSans.className} text-[11px] px-2 py-0.5 rounded-[6px] font-medium`} style={{ color:'#8A5020', background:'rgba(246,195,145,0.15)' }}>{p}</span>
          ))}
        </div>
      </div>
      <div className="p-[18px_18px_18px_0] flex flex-col items-end justify-between shrink-0 min-w-[176px]">
        <div className="flex flex-col items-end gap-2">
          <button onClick={e=>{e.stopPropagation();onSave(doctor._id)}} className="bg-transparent border-none cursor-pointer p-1" style={{ color:saved?C.pink:'rgba(210,83,128,0.25)' }}>
            <Bookmark size={16} fill={saved?C.pink:'none'}/>
          </button>
          {doctor.averageRating > 0 && (
            <div className="text-right">
              <div className="flex items-center gap-1 justify-end">
                <span style={{ color:C.peach, fontSize:13 }}>★</span>
                <span className={cormorant.className} style={{ fontSize:15, fontWeight:700, color:C.ink }}>{Number(doctor.averageRating).toFixed(1)}</span>
              </div>
              {doctor.totalReviews > 0 && <div className={dmSans.className} style={{ fontSize:11, color:C.mu }}>{doctor.totalReviews} reviews</div>}
            </div>
          )}
        </div>
        <div className="text-right">
          {(doctor.primaryArea||doctor.primaryCity) && (
            <div className={`${dmSans.className} flex items-center gap-1 text-[11px] mb-2 justify-end`} style={{ color:C.mu }}>
              <MapPin size={10} style={{ color:C.coral }}/> {[doctor.primaryArea,doctor.primaryCity].filter(Boolean).join(', ')}
            </div>
          )}
          <div className="mb-3">
            <div className={`${dmSans.className} text-[10px] tracking-[0.06em] uppercase`} style={{ color:C.mu }}>Fee</div>
            <div className={cormorant.className} style={{ fontSize:18, fontWeight:700, color:C.pink, lineHeight:1.2 }}>
              {doctor.consultationFee != null && doctor.consultationFee > 0
                ? formatFee(doctor.consultationFee)
                : <span className={dmSans.className} style={{ fontSize:12, fontWeight:400, color:C.mu }}>On request</span>}
            </div>
          </div>
          <Link href={`/doctors/${doctor.slug}`} className={dmSans.className} onClick={e=>e.stopPropagation()}
            style={{ display:'inline-flex', alignItems:'center', gap:6, background:`linear-gradient(135deg,${C.pink},${C.coral})`, color:'#fff', fontSize:12, fontWeight:600, padding:'9px 17px', borderRadius:10, textDecoration:'none', letterSpacing:'0.02em', boxShadow:'0 3px 12px rgba(210,83,128,0.25)' }}>
            View Profile <ArrowUpRight size={13}/>
          </Link>
        </div>
      </div>
    </div>
  )
}

// ─── Mobile Doctor Card (vertical, compact) ───────────────────────────────────
function DoctorCard({ doctor, saved, onSave }: { doctor:any; saved:boolean; onSave:(id:string)=>void }) {
  const specs = (doctor.specializations || []).slice(0,1)
  const accentBg = doctor.isFeatured ? `linear-gradient(135deg,${C.pink},${C.coral})` : C.sf

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden cursor-pointer"
      style={{ border:'1.5px solid rgba(210,83,128,0.07)', boxShadow:C.shadowCard, transition:'all .2s ease' }}
    >
      {/* Gradient header strip */}
      <div style={{ background:`linear-gradient(135deg,${C.pink} 0%,${C.coral} 100%)`, padding:'14px 14px 20px', position:'relative' }}>
        <div style={{ position:'absolute', bottom:-1, left:0, right:0, height:16, background:'#fff', borderRadius:'14px 14px 0 0' }} />
        {/* Top row: avatar + bookmark */}
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between' }}>
          <div style={{ position:'relative' }}>
            <div style={{ width:50, height:50, borderRadius:13, overflow:'hidden', border:'2px solid rgba(255,255,255,0.35)', boxShadow:'0 4px 14px rgba(0,0,0,0.15)' }}>
              <Image src={doctor.photo||getAvatarUrl(doctor.name)} alt={doctor.name} width={50} height={50} className="object-cover w-full h-full" unoptimized/>
            </div>
            {doctor.availableToday && (
              <span style={{ position:'absolute', bottom:-1, right:-1, width:11, height:11, borderRadius:'50%', border:'2px solid white', background:C.sg, boxShadow:`0 0 5px ${C.sg}` }}/>
            )}
          </div>
          <button onClick={e=>{e.stopPropagation();onSave(doctor._id)}} style={{ background:'rgba(255,255,255,0.18)', border:'none', cursor:'pointer', width:28, height:28, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <Bookmark size={13} style={{ color:saved?C.peach:'rgba(255,255,255,0.7)' }} fill={saved?C.peach:'none'}/>
          </button>
        </div>
        {/* Name */}
        <div style={{ position:'relative', zIndex:1, marginTop:8 }}>
          <div style={{ display:'flex', alignItems:'center', gap:5 }}>
            <span className={cormorant.className} style={{ fontSize:15, fontWeight:600, color:'#fff', lineHeight:1.2, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:140 }}>
              {doctor.name}
            </span>
            {doctor.isVerified && <BadgeCheck size={12} style={{ color:'rgba(255,255,255,0.8)', flexShrink:0 }}/>}
          </div>
          {specs[0] && (
            <span className={dmSans.className} style={{ fontSize:10, color:'rgba(255,255,255,0.65)', marginTop:2, display:'block' }}>
              {specs[0].icon||'🩺'} {specs[0].name}
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding:'10px 14px 14px' }}>
        {doctor.experience && (
          <div className={dmSans.className} style={{ fontSize:10, color:C.mu, marginBottom:8 }}>
            {doctor.experience} yrs experience
            {doctor.primaryCity && <> · <MapPin size={8} style={{ display:'inline', verticalAlign:'middle', color:C.coral }}/> {doctor.primaryCity}</>}
          </div>
        )}

        {/* Rating row */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
          {doctor.averageRating > 0 ? (
            <div style={{ display:'flex', alignItems:'center', gap:4 }}>
              <span style={{ color:C.peach, fontSize:12 }}>★</span>
              <span className={cormorant.className} style={{ fontSize:14, fontWeight:700, color:C.ink }}>{Number(doctor.averageRating).toFixed(1)}</span>
              {doctor.totalReviews > 0 && <span className={dmSans.className} style={{ fontSize:10, color:C.mu }}>({doctor.totalReviews})</span>}
            </div>
          ) : <span/>}
          <div style={{ textAlign:'right' }}>
            <div className={dmSans.className} style={{ fontSize:8, color:C.mu, letterSpacing:'0.06em', textTransform:'uppercase' }}>Fee</div>
            <div className={cormorant.className} style={{ fontSize:16, fontWeight:700, color:C.pink, lineHeight:1 }}>
              {doctor.consultationFee != null && doctor.consultationFee > 0
                ? formatFee(doctor.consultationFee)
                : <span className={dmSans.className} style={{ fontSize:11, fontWeight:400, color:C.mu }}>On request</span>}
            </div>
          </div>
        </div>

        {/* CTA */}
        <Link href={`/doctors/${doctor.slug}`} onClick={e=>e.stopPropagation()}
          style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:6, background:`linear-gradient(135deg,${C.pink},${C.coral})`, color:'#fff', fontSize:11, fontWeight:600, padding:'9px 0', borderRadius:10, textDecoration:'none', letterSpacing:'0.04em', boxShadow:'0 3px 12px rgba(210,83,128,0.22)', width:'100%' }}>
          View Profile <ArrowUpRight size={12}/>
        </Link>
      </div>
    </div>
  )
}

function SkeletonRow() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden mb-2.5 flex gap-4 p-[18px]" style={{ border:'1px solid rgba(210,83,128,0.07)', boxShadow:C.shadowCard }}>
      <div className="w-1 rounded shrink-0 animate-pulse" style={{ background:C.sf }}/>
      <div className="w-[70px] h-[70px] rounded-[14px] shrink-0 animate-pulse" style={{ background:C.sf }}/>
      <div className="flex-1 flex flex-col gap-2.5">
        <div className="h-[17px] w-[40%] rounded-md animate-pulse" style={{ background:C.sf }}/>
        <div className="h-3 w-[28%] rounded-md animate-pulse" style={{ background:C.sf }}/>
        <div className="flex gap-1.5">
          <div className="h-[22px] w-20 rounded-full animate-pulse" style={{ background:C.sf }}/>
          <div className="h-[22px] w-20 rounded-full animate-pulse" style={{ background:C.sf }}/>
        </div>
      </div>
      <div className="w-[150px] flex flex-col items-end gap-2.5">
        <div className="h-[30px] w-[55px] rounded-md animate-pulse" style={{ background:C.sf }}/>
        <div className="h-9 w-[115px] rounded-[10px] animate-pulse" style={{ background:C.sf }}/>
      </div>
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden animate-pulse" style={{ border:'1px solid rgba(210,83,128,0.07)' }}>
      <div style={{ height:90, background:C.sf }}/>
      <div style={{ padding:'10px 14px 14px', display:'flex', flexDirection:'column', gap:8 }}>
        <div style={{ height:12, width:'60%', borderRadius:6, background:C.sf }}/>
        <div style={{ height:10, width:'40%', borderRadius:6, background:C.sf }}/>
        <div style={{ height:32, borderRadius:10, background:C.sf }}/>
      </div>
    </div>
  )
}

function FO({ active, onClick, children }: { active:boolean; onClick:()=>void; children:React.ReactNode }) {
  return (
    <button onClick={onClick} className={dmSans.className}
      style={{ display:'flex', alignItems:'center', justifyContent:'space-between', width:'100%', padding:'7px 10px', borderRadius:9, fontSize:13, fontWeight:active?600:400, background:active?'rgba(210,83,128,0.09)':'transparent', color:active?C.pink:C.muD, border:'none', cursor:'pointer', textAlign:'left', transition:'all 0.12s' }}>
      {children}
    </button>
  )
}

function PageSkeleton() {
  return (
    <div className="min-h-screen pt-16" style={{ background:C.bg }}>
      <div className="h-[52px]" style={{ background:C.pink }}/>
      <div className="max-w-[1280px] mx-auto px-8 py-6 flex gap-6">
        <div className="w-[252px] shrink-0 rounded-2xl h-[500px] animate-pulse" style={{ background:C.wh, boxShadow:C.shadowSidebar }}/>
        <div className="flex-1">{Array.from({length:5}).map((_,i)=><SkeletonRow key={i}/>)}</div>
      </div>
    </div>
  )
}

// ─── Sidebar Filter Panel (shared between desktop and mobile drawer) ──────────
function FilterPanel({
  filters, specOptions, hasFilters,
  setF, clearAll, onClose,
}: {
  filters: any
  specOptions: any[]
  hasFilters: boolean
  setF: (k:string, v:string|undefined) => void
  clearAll: () => void
  onClose?: () => void
}) {
  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%' }}>
      {/* Header */}
      <div style={{ padding:'16px 18px', borderBottom:`1px solid ${C.sf}`, display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
        <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
          <span className={`${cormorant.className}`} style={{ fontSize:17, fontWeight:600, color:C.pink, display:'flex', alignItems:'center', gap:6 }}>
            <SlidersHorizontal size={14}/> Filters
          </span>
          <span className={dmSans.className} style={{ display:'inline-flex', alignItems:'center', gap:4, fontSize:10, fontWeight:500, padding:'2px 8px', borderRadius:100, background:'rgba(210,83,128,0.07)', color:C.pink, width:'fit-content' }}>
            <MapPin size={8}/> Jaipur, Rajasthan
          </span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          {hasFilters && (
            <button onClick={()=>{clearAll();onClose&&onClose()}} className={dmSans.className}
              style={{ background:'transparent', border:'none', cursor:'pointer', fontSize:11, fontWeight:600, display:'flex', alignItems:'center', gap:4, color:C.coral }}>
              <X size={11}/> Clear
            </button>
          )}
          {onClose && (
            <button onClick={onClose} style={{ background:'rgba(210,83,128,0.07)', border:'none', cursor:'pointer', width:28, height:28, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <X size={14} style={{ color:C.pink }}/>
            </button>
          )}
        </div>
      </div>

      {/* Scrollable body */}
      <div style={{ flex:1, overflowY:'auto', padding:'4px 0 16px' }}>

        {/* Area */}
        <div style={{ padding:'14px 18px', borderBottom:`1px solid ${C.sf}` }}>
          <div className={dmSans.className} style={{ fontSize:9, fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', color:C.coral, marginBottom:10 }}>
            Area in Jaipur
          </div>
          <select
            value={filters.area||''}
            onChange={e=>setF('area',e.target.value||undefined)}
            className={dmSans.className}
            style={{ width:'100%', background:C.sf, border:'1px solid rgba(210,83,128,0.12)', borderRadius:10, padding:'9px 12px', fontSize:12, color:C.ink, outline:'none', cursor:'pointer', appearance:'none', backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23AA8090' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat:'no-repeat', backgroundPosition:'right 10px center' }}
          >
            <option value="">All Areas</option>
            {JAIPUR_AREAS.map(a=><option key={a} value={a}>{a}</option>)}
          </select>
        </div>

        {/* Specialization */}
        <div style={{ padding:'14px 18px' }}>
          <div className={dmSans.className} style={{ fontSize:9, fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', color:C.coral, marginBottom:10 }}>
            Specialization
            {specOptions.length === 0 && (
              <span style={{ fontWeight:400, textTransform:'none', letterSpacing:0, color:C.mu, marginLeft:4, fontSize:10 }}>(loading…)</span>
            )}
          </div>

          {/* Scrollable list */}
          <div style={{
            maxHeight:220,
            overflowY:'auto',
            display:'flex',
            flexDirection:'column',
            gap:4,
            paddingRight:2,
            /* custom scrollbar */
            scrollbarWidth:'thin',
            scrollbarColor:`rgba(210,83,128,0.25) transparent`,
          }}>
            <style>{`
              .spec-scroll::-webkit-scrollbar { width: 3px; }
              .spec-scroll::-webkit-scrollbar-track { background: transparent; }
              .spec-scroll::-webkit-scrollbar-thumb { background: rgba(210,83,128,0.2); border-radius: 10px; }
              .spec-scroll::-webkit-scrollbar-thumb:hover { background: rgba(210,83,128,0.4); }
            `}</style>

            <button
              onClick={()=>setF('specialization','')}
              className={`${dmSans.className} spec-scroll`}
              style={{ display:'flex', alignItems:'center', width:'100%', padding:'8px 11px', borderRadius:10, fontSize:12, fontWeight:!filters.specialization?600:400, background:!filters.specialization?`linear-gradient(135deg,${C.pink},${C.coral})`:'rgba(210,83,128,0.04)', color:!filters.specialization?'#fff':C.muD, border:'none', cursor:'pointer', textAlign:'left', transition:'all .15s', boxShadow:!filters.specialization?'0 3px 10px rgba(210,83,128,0.22)':'none', flexShrink:0 }}>
              🩺 All Specializations
            </button>

            <div className="spec-scroll" style={{ overflowY:'auto', maxHeight:168, display:'flex', flexDirection:'column', gap:3 }}>
              {specOptions.map(s => {
                const active = filters.specialization === s.slug
                return (
                  <button key={s.slug} onClick={()=>setF('specialization',s.slug)} className={dmSans.className}
                    style={{ display:'flex', alignItems:'center', justifyContent:'space-between', width:'100%', padding:'8px 11px', borderRadius:10, fontSize:12, fontWeight:active?600:400, background:active?`linear-gradient(135deg,${C.pink},${C.coral})`:'rgba(210,83,128,0.04)', color:active?'#fff':C.muD, border:active?'none':'1px solid rgba(210,83,128,0.08)', cursor:'pointer', textAlign:'left', transition:'all .15s', boxShadow:active?'0 3px 10px rgba(210,83,128,0.22)':'none', flexShrink:0 }}>
                    {s.icon} {s.name}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Fee — COMMENTED KEPT */}
        {/* <div style={{ padding:'14px 18px', borderBottom:`1px solid ${C.sf}` }}>
          ...
        </div> */}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
function DoctorsPageInner() {
  const searchParams = useSearchParams()
  const router       = useRouter()
  const { isAuthenticated } = useAuthStore()

  const [doctors,     setDoctors]     = useState<any[]>([])
  const [loading,     setLoading]     = useState(true)
  const [total,       setTotal]       = useState(0)
  const [pages,       setPages]       = useState(1)
  const [page,        setPage]        = useState(1)
  const [savedIds,    setSavedIds]    = useState<string[]>([])
  const [specOptions, setSpecOptions] = useState<{name:string;slug:string;icon:string}[]>([])
  const [searchQ,     setSearchQ]     = useState(searchParams.get('search')||'')
  const [drawerOpen,  setDrawerOpen]  = useState(false)

  const getFilters = useCallback(() => ({
    search:          searchParams.get('search')          || undefined,
    city:            'Jaipur',
    area:            searchParams.get('area')            || undefined,
    specialization:  searchParams.get('specialization')  || undefined,
    minFee:          searchParams.get('minFee')          || undefined,
    maxFee:          searchParams.get('maxFee')          || undefined,
    minRating:       searchParams.get('minRating')       || undefined,
    availableOnline: searchParams.get('availableOnline') || undefined,
    availableToday:  searchParams.get('availableToday')  || undefined,
    sortBy:          searchParams.get('sortBy')          || undefined,
  }), [searchParams])

  const [filters, setFilters] = useState(getFilters())

  const updateURL = useCallback((f: Record<string,string|undefined>, p=1) => {
    const params = new URLSearchParams()
    Object.entries(f).forEach(([k,v]) => { if(v && k !== 'city') params.set(k,v) })
    if(p>1) params.set('page',String(p))
    router.push(`/doctors?${params.toString()}`)
  }, [router])

  const setF = (key:string, value:string|undefined) => {
    clog('FILTER', `${key} -> "${value || '(cleared)'}"`)
    const next = { ...filters, [key]: value||undefined, city:'Jaipur' }
    setFilters(next as any); setPage(1); updateURL(next,1)
  }

  const clearAll = () => {
    clog('FILTER', 'Cleared all filters')
    setFilters({ city:'Jaipur' } as any); setPage(1); router.push('/doctors')
  }

  useEffect(() => {
    const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
    fetch(`${API}/doctors/filters/meta?city=Jaipur`)
      .then(r=>{ if(!r.ok) throw new Error(`HTTP ${r.status}`); return r.json() })
      .then(data=>{ if(data.specializations?.length) setSpecOptions(data.specializations) })
      .catch(err=>cerr('META', err.message))
  }, [])

  useEffect(() => {
    setLoading(true)
    doctorsApi.list({ ...filters, page, limit:3 })
      .then(r => {
        const { doctors: docs, total: tot, pages: pg } = r.data
        setDoctors(docs || []); setTotal(tot || 0); setPages(pg || 1)
      })
      .catch(err=>{ cerr('FETCH', err.message); toast.error('Failed to load doctors') })
      .finally(()=>setLoading(false))
  }, [filters, page])

  useEffect(() => {
    if (!isAuthenticated) return
    authApi.me()
      .then(r=>{ setSavedIds(r.data.user.savedDoctors?.map((d:any)=>d._id||d)||[]) })
      .catch(err=>cwarn('SAVED', err.message))
  }, [isAuthenticated])

  const handleSave = async (id:string) => {
    if (!isAuthenticated) { toast.error('Sign in to save doctors'); return }
    try {
      const r = await authApi.saveDoctor(id)
      if (r.data.saved) { setSavedIds(p=>[...p,id]); toast.success('Saved!') }
      else              { setSavedIds(p=>p.filter(s=>s!==id)); toast.success('Removed') }
    } catch (err:any) { cerr('SAVE', err.message); toast.error('Something went wrong') }
  }

  const handleSearch = (e:React.FormEvent) => {
    e.preventDefault()
    setF('search', searchQ||undefined)
  }

  const hasFilters = Object.entries(filters).some(([k,v]) => k !== 'city' && Boolean(v))

  const activeFilterCount = Object.entries(filters).filter(([k,v]) => k !== 'city' && Boolean(v)).length

  return (
    <div className={`${cormorant.variable} ${dmSans.variable} min-h-screen pt-16`} style={{ background:C.bg, fontFamily:'var(--font-dm)' }}>

      {/* ── Global styles ── */}
      <style>{`
        @keyframes dr-slide-up { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes dr-fade-in  { from{opacity:0} to{opacity:1} }
        @keyframes dr-drawer-up { from{transform:translateY(100%)} to{transform:translateY(0)} }
        .dre { animation: dr-slide-up .35s cubic-bezier(.16,1,.3,1) both; }
        .dre:nth-child(1){animation-delay:.04s}
        .dre:nth-child(2){animation-delay:.09s}
        .dre:nth-child(3){animation-delay:.14s}
        .dre:nth-child(4){animation-delay:.19s}
        .dre:nth-child(5){animation-delay:.24s}
        .dr-drawer { animation: dr-drawer-up .32s cubic-bezier(.16,1,.3,1) both; }
        .dr-overlay { animation: dr-fade-in .2s ease both; }
        /* Thin scrollbar for spec list */
        .spec-list::-webkit-scrollbar { width: 3px; }
        .spec-list::-webkit-scrollbar-track { background: transparent; }
        .spec-list::-webkit-scrollbar-thumb { background: rgba(210,83,128,0.22); border-radius:10px; }
        .spec-list::-webkit-scrollbar-thumb:hover { background: rgba(210,83,128,0.4); }
      `}</style>

      {/* ══════════════════════════════════════════
          TOP BAR — shared all breakpoints
          Mobile: search full width, sort hidden
          Tablet/Desktop: search + sort side by side
      ══════════════════════════════════════════ */}
      <div className="sticky top-16 z-40 border-b border-white/10"
        style={{ background:`linear-gradient(135deg,${C.pink} 0%,#B03060 100%)`, boxShadow:'0 4px 20px rgba(176,48,96,0.28)' }}>
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center gap-3">

          {/* Mobile: filter trigger */}
          <button
            onClick={()=>setDrawerOpen(true)}
            className="lg:hidden flex items-center gap-1.5 shrink-0"
            style={{ background:'rgba(255,255,255,0.18)', border:'1px solid rgba(255,255,255,0.25)', borderRadius:9, padding:'8px 12px', color:'#fff', cursor:'pointer', position:'relative' }}>
            <SlidersHorizontal size={14}/>
            {activeFilterCount > 0 && (
              <span style={{ position:'absolute', top:-5, right:-5, width:16, height:16, borderRadius:'50%', background:C.peach, color:C.ink, fontSize:9, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center' }}>
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 flex items-center gap-2 bg-white/15 border border-white/25 rounded-[10px] px-3 pr-1">
            <input value={searchQ} onChange={e=>setSearchQ(e.target.value)}
              placeholder="Search doctors, conditions..."
              className={`${dmSans.className} flex-1 bg-transparent border-none text-[13px] text-white py-2.5 outline-none placeholder:text-white/55 min-w-0`}/>
            <button type="submit" className={`${dmSans.className} bg-white/20 border-none rounded-[7px] px-3 py-1.5 text-white text-xs font-semibold cursor-pointer tracking-[0.04em] hover:bg-white/30 transition-colors shrink-0`}>
              Go
            </button>
          </form>

          {/* Sort — hidden on mobile */}
          <select value={filters.sortBy||''} onChange={e=>setF('sortBy',e.target.value)}
            className={`${dmSans.className} hidden sm:block`}
            style={{ background:'rgba(255,255,255,0.18)', border:'1px solid rgba(255,255,255,0.28)', borderRadius:9, padding:'9px 12px', fontSize:12, color:'#fff', cursor:'pointer', outline:'none', flexShrink:0 }}>
            {SORT_OPTIONS.map(o=><option key={o.value} value={o.value} style={{ color:'#2A1520', background:'#fff' }}>{o.label}</option>)}
          </select>
        </div>
      </div>


      {/* ══════════════════════════════════════════
          MOBILE FILTER DRAWER (< 1024px)
          Bottom sheet, slides up
      ══════════════════════════════════════════ */}
      {drawerOpen && (
        <>
          {/* Backdrop */}
          <div className="dr-overlay fixed inset-0 z-50 lg:hidden" style={{ background:'rgba(42,21,32,0.45)', backdropFilter:'blur(2px)' }}
            onClick={()=>setDrawerOpen(false)}/>
          {/* Sheet */}
          <div className="dr-drawer fixed bottom-0 left-0 right-0 z-50 lg:hidden"
            style={{ background:'#fff', borderRadius:'20px 20px 0 0', maxHeight:'85vh', display:'flex', flexDirection:'column', boxShadow:'0 -8px 40px rgba(160,60,80,0.18)' }}>
            {/* Drag handle */}
            <div style={{ display:'flex', justifyContent:'center', padding:'10px 0 0' }}>
              <div style={{ width:36, height:4, borderRadius:100, background:'rgba(210,83,128,0.15)' }}/>
            </div>
            <FilterPanel
              filters={filters}
              specOptions={specOptions}
              hasFilters={hasFilters}
              setF={setF}
              clearAll={clearAll}
              onClose={()=>setDrawerOpen(false)}
            />
            {/* Apply button */}
            <div style={{ padding:'12px 18px 24px', borderTop:`1px solid ${C.sf}`, flexShrink:0 }}>
              <button onClick={()=>setDrawerOpen(false)} style={{ width:'100%', background:`linear-gradient(135deg,${C.pink},${C.coral})`, border:'none', borderRadius:12, padding:'13px', color:'#fff', fontSize:13, fontWeight:600, cursor:'pointer', boxShadow:'0 4px 16px rgba(210,83,128,0.25)', letterSpacing:'0.04em' }}>
                Apply Filters
              </button>
            </div>
          </div>
        </>
      )}


      {/* ══════════════════════════════════════════
          BODY LAYOUT
      ══════════════════════════════════════════ */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-5 lg:py-6">
        <div className="flex gap-6 items-start">

          {/* ── Desktop Sidebar (≥ 1024px) ── */}
          <aside className="hidden lg:flex w-[252px] shrink-0 bg-white rounded-2xl overflow-hidden sticky top-32 flex-col"
            style={{ border:`1px solid ${C.bd}`, boxShadow:C.shadowSidebar, maxHeight:'calc(100vh - 9rem)' }}>
            <FilterPanel
              filters={filters}
              specOptions={specOptions}
              hasFilters={hasFilters}
              setF={setF}
              clearAll={clearAll}
            />
          </aside>

          {/* ── Main content ── */}
          <div className="flex-1 min-w-0">

            {/* Result header */}
            <div className="flex items-start sm:items-center justify-between mb-4 gap-3 flex-wrap">
              <div>
                <h1 className={cormorant.className} style={{ fontSize:'clamp(20px,4vw,26px)', fontWeight:600, color:C.ink, lineHeight:1.2, margin:0 }}>
                  {filters.specialization
                    ? filters.specialization.charAt(0).toUpperCase()+filters.specialization.slice(1).replace(/-/g,' ')+'s'
                    : 'Doctors'}
                  <span style={{ color:C.mu, fontStyle:'italic' }}>
                    {filters.area ? ` in ${filters.area}` : ' in Jaipur'}
                  </span>
                </h1>
                {!loading && (
                  <p className={`${dmSans.className} text-[12px] mt-0.5 font-light`} style={{ color:C.mu }}>
                    {total} {total===1?'doctor':'doctors'} found
                  </p>
                )}
              </div>
              {hasFilters && (
                <div className="flex gap-1.5 flex-wrap">
                  {filters.search && (
                    <span className={`${dmSans.className} text-[11px] px-2.5 py-1 rounded-full flex items-center gap-1.5`} style={{ background:'rgba(210,83,128,0.08)', color:C.pink }}>
                      "{filters.search}"
                      <button onClick={()=>setF('search','')} style={{ background:'none', border:'none', cursor:'pointer', color:C.pink, lineHeight:1, padding:0, fontSize:13 }}>×</button>
                    </span>
                  )}
                  {filters.area && (
                    <span className={`${dmSans.className} text-[11px] px-2.5 py-1 rounded-full flex items-center gap-1.5`} style={{ background:'rgba(224,142,109,0.1)', color:C.coral }}>
                      <MapPin size={9}/> {filters.area}
                      <button onClick={()=>setF('area','')} style={{ background:'none', border:'none', cursor:'pointer', color:C.coral, lineHeight:1, padding:0, fontSize:13 }}>×</button>
                    </span>
                  )}
                  {filters.specialization && (
                    <span className={`${dmSans.className} text-[11px] px-2.5 py-1 rounded-full flex items-center gap-1.5`} style={{ background:'rgba(210,83,128,0.08)', color:C.pink }}>
                      {filters.specialization}
                      <button onClick={()=>setF('specialization','')} style={{ background:'none', border:'none', cursor:'pointer', color:C.pink, lineHeight:1, padding:0, fontSize:13 }}>×</button>
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* ── DESKTOP / WIDE TABLET: horizontal rows (≥ 768px) ── */}
            <div className="hidden sm:block">
              {loading
                ? Array.from({length:4}).map((_,i)=><SkeletonRow key={i}/>)
                : doctors.length===0
                ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="text-5xl mb-4">🔍</div>
                    <h3 className={cormorant.className} style={{ fontSize:24, color:C.ink, marginBottom:8 }}>No doctors found</h3>
                    <p className={`${dmSans.className} text-sm font-light mb-6`} style={{ color:C.mu }}>Try adjusting your filters or search terms.</p>
                    <button onClick={clearAll} className={`${dmSans.className} text-white border-none rounded-xl px-7 py-3 text-[13px] font-semibold cursor-pointer`}
                      style={{ background:`linear-gradient(135deg,${C.pink},${C.coral})`, boxShadow:'0 4px 16px rgba(210,83,128,0.25)' }}>
                      Clear All Filters
                    </button>
                  </div>
                )
                : doctors.map((doc)=>(
                  <div key={doc._id} className="dre">
                    <DoctorRow doctor={doc} saved={savedIds.includes(doc._id)} onSave={handleSave}/>
                  </div>
                ))
              }
            </div>

            {/* ── MOBILE: 2-column card grid (< 768px) ── */}
            <div className="block sm:hidden">
              {loading
                ? (
                  <div className="grid grid-cols-2 gap-3">
                    {Array.from({length:4}).map((_,i)=><SkeletonCard key={i}/>)}
                  </div>
                )
                : doctors.length===0
                ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="text-4xl mb-3">🔍</div>
                    <h3 className={cormorant.className} style={{ fontSize:20, color:C.ink, marginBottom:6 }}>No doctors found</h3>
                    <p className={`${dmSans.className} text-xs font-light mb-5`} style={{ color:C.mu }}>Try adjusting your filters.</p>
                    <button onClick={clearAll} className={`${dmSans.className} text-white border-none rounded-xl px-6 py-2.5 text-xs font-semibold cursor-pointer`}
                      style={{ background:`linear-gradient(135deg,${C.pink},${C.coral})` }}>
                      Clear Filters
                    </button>
                  </div>
                )
                : (
                  <div className="grid grid-cols-2 gap-3">
                    {doctors.map((doc)=>(
                      <div key={doc._id} className="dre">
                        <DoctorCard doctor={doc} saved={savedIds.includes(doc._id)} onSave={handleSave}/>
                      </div>
                    ))}
                  </div>
                )
              }
            </div>

            {/* Pagination — keep commented as original */}
            {/* {pages>1 && ( ... )} */}

          </div>
        </div>
      </div>
    </div>
  )
}

export default function DoctorsPage() {
  return (
    <Suspense fallback={<PageSkeleton/>}>
      <DoctorsPageInner/>
    </Suspense>
  )
}