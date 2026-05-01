'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight, SlidersHorizontal, X, MapPin, BadgeCheck, Award, Bookmark, ArrowUpRight, Hash, Monitor, Building2, Video } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import { doctorsApi, authApi } from '@/lib/api'
import { useAuthStore } from '@/lib/store'
import { formatFee, getAvatarUrl } from '@/lib/utils'
import toast from 'react-hot-toast'

const cormorant = Cormorant_Garamond({ subsets:['latin'], weight:['400','600','700'], style:['normal','italic'], display:'swap', variable:'--font-cormorant' })
const dmSans    = DM_Sans({ subsets:['latin'], weight:['300','400','500','600'], display:'swap', variable:'--font-dm' })

// ─────────────────────────────────────────────────────────────────────────────
// Client-side logger — colour-coded groups in browser DevTools console
// Open DevTools → Console to see these
// ─────────────────────────────────────────────────────────────────────────────
const PINK  = 'color:#D25380;font-weight:bold'
const AMBER = 'color:#C47A3A;font-weight:bold'
const RED   = 'color:#cc0000;font-weight:bold'

function clog(tag: string, ...args: unknown[]) {
  console.log(`%c[DOCTORS:${tag}]`, PINK, ...args)
}
function cwarn(tag: string, ...args: unknown[]) {
  console.warn(`%c[DOCTORS:${tag}] ⚠`, AMBER, ...args)
}
function cerr(tag: string, ...args: unknown[]) {
  console.error(`%c[DOCTORS:${tag}] ✗`, RED, ...args)
}

// ─────────────────────────────────────────────────────────────────────────────

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
  { value:'fee_asc',    label:'Fee: Low to High' },
  { value:'fee_desc',   label:'Fee: High to Low' },
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

  // ── 1. Load specialization options from /filters/meta ────────
  useEffect(() => {
    const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
    const url = `${API}/doctors/filters/meta?city=Jaipur`
    clog('META', `Fetching → ${url}`)

    fetch(url)
      .then(r => {
        clog('META', `HTTP ${r.status} ${r.statusText}`)
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then(data => {
        clog('META', 'Response:', data)
        if (data.specializations?.length) {
          clog('META', `✓ ${data.specializations.length} specializations loaded:`, data.specializations.map((s:any)=>s.name))
          setSpecOptions(data.specializations)
        } else {
          cwarn('META', 'specializations array is empty — sidebar filter will show nothing')
          cwarn('META', 'Possible cause: specializations.name field is empty in all DB docs')
        }
        if (data.areas?.length) {
          clog('META', `Areas: [${data.areas.join(', ')}]`)
        } else {
          cwarn('META', 'No areas returned — check primaryArea field in DB docs')
        }
      })
      .catch(err => {
        cerr('META', 'Fetch failed:', err.message)
        cerr('META', 'Check: Is backend running? Is NEXT_PUBLIC_API_URL set correctly?')
        cerr('META', `Current NEXT_PUBLIC_API_URL = "${process.env.NEXT_PUBLIC_API_URL || '(not set)'}"`)
      })
  }, [])

  // ── 2. Fetch doctors when filters or page changes ─────────────
  useEffect(() => {
    const activeFilters = Object.fromEntries(
      Object.entries(filters).filter(([k,v]) => v && k !== 'city')
    )
    console.group(`%c[DOCTORS:FETCH] page=${page}`, PINK)
    clog('FETCH', 'Active filters (excluding city=Jaipur):', activeFilters)
    clog('FETCH', 'Full params sent to API:', { ...filters, page, limit:12 })

    setLoading(true)

    doctorsApi.list({ ...filters, page, limit:12 })
      .then(r => {
        const { doctors: docs, total: tot, pages: pg, currentPage: cp } = r.data
        clog('FETCH', `✓ Response: total=${tot} returned=${docs?.length} pages=${pg} currentPage=${cp}`)

        if (!docs || docs.length === 0) {
          cwarn('FETCH', '--- ZERO DOCTORS RETURNED ---')
          cwarn('FETCH', 'Check backend terminal for [DOCTORS:LIST] logs which will show the MongoDB query and diagnostics')
          cwarn('FETCH', 'Common causes:')
          cwarn('FETCH', '  1. Seed data not imported — run mongoimport first')
          cwarn('FETCH', '  2. isActive field is missing or false in seed docs')
          cwarn('FETCH', '  3. primaryCity does not match "Jaipur" (case sensitive regex should handle this)')
          cwarn('FETCH', '  4. Fee filter too narrow — try clearing fee filter')
          cwarn('FETCH', '  5. Specialization slug mismatch — slug in DB vs URL param')
          cwarn('FETCH', '  6. NEXT_PUBLIC_API_URL points to wrong server or port')
        } else {
          clog('FETCH', `First doctor: "${docs[0].name}" | area="${docs[0].primaryArea}" | fee=${docs[0].consultationFee} | rating=${docs[0].averageRating}`)
          clog('FETCH', `  specializations:`, docs[0].specializations)
        }

        setDoctors(docs || [])
        setTotal(tot || 0)
        setPages(pg || 1)
        console.groupEnd()
      })
      .catch(err => {
        console.groupEnd()
        cerr('FETCH', 'API call failed:', err.message)
        cerr('FETCH', 'Full error:', err)
        cerr('FETCH', `NEXT_PUBLIC_API_URL = "${process.env.NEXT_PUBLIC_API_URL || '(not set — defaulting to http://localhost:5000/api)'}"`)
        toast.error('Failed to load doctors')
      })
      .finally(() => setLoading(false))
  }, [filters, page])

  // ── 3. Saved doctors ──────────────────────────────────────────
  useEffect(() => {
    if (!isAuthenticated) return
    clog('SAVED', 'Fetching user saved doctors')
    authApi.me()
      .then(r => {
        const ids = r.data.user.savedDoctors?.map((d:any) => d._id || d) || []
        clog('SAVED', `User has ${ids.length} saved doctor(s)`)
        setSavedIds(ids)
      })
      .catch(err => cwarn('SAVED', 'Could not load saved doctors:', err.message))
  }, [isAuthenticated])

  const handleSave = async (id:string) => {
    if (!isAuthenticated) { toast.error('Sign in to save doctors'); return }
    try {
      const r = await authApi.saveDoctor(id)
      if (r.data.saved) { setSavedIds(p=>[...p,id]); toast.success('Saved!') }
      else              { setSavedIds(p=>p.filter(s=>s!==id)); toast.success('Removed') }
    } catch (err:any) {
      cerr('SAVE', err.message)
      toast.error('Something went wrong')
    }
  }

  const handleSearch = (e:React.FormEvent) => {
    e.preventDefault()
    clog('SEARCH', `Submitting search: "${searchQ}"`)
    setF('search', searchQ||undefined)
  }

  const hasFilters = Object.entries(filters).some(([k,v]) => k !== 'city' && Boolean(v))

  return (
    <div className={`${cormorant.variable} ${dmSans.variable} min-h-screen pt-16`} style={{ background:C.bg, fontFamily:'var(--font-dm)' }}>

      {/* Top search/sort bar */}
      <div className="sticky top-16 z-40 border-b border-white/10"
        style={{ background:`linear-gradient(135deg,${C.pink} 0%,#B03060 100%)`, boxShadow:'0 4px 20px rgba(176,48,96,0.28)' }}>
        <div className="max-w-[1280px] mx-auto px-8 py-3 flex items-center justify-between gap-4">
          <form onSubmit={handleSearch} className="flex-1 max-w-[520px] flex items-center gap-2.5 bg-white/15 border border-white/25 rounded-[10px] px-3.5 pr-1">
            <input value={searchQ} onChange={e=>setSearchQ(e.target.value)}
              placeholder="Search doctors, conditions, procedures..."
              className={`${dmSans.className} flex-1 bg-transparent border-none text-[13px] text-white py-2.5 outline-none placeholder:text-white/60`}/>
            <button type="submit" className={`${dmSans.className} bg-white/20 border-none rounded-[7px] px-3.5 py-1.5 text-white text-xs font-semibold cursor-pointer tracking-[0.04em] hover:bg-white/30 transition-colors shrink-0`}>
              Search
            </button>
          </form>
          <select value={filters.sortBy||''} onChange={e=>setF('sortBy',e.target.value)} className={dmSans.className}
            style={{ background:'rgba(255,255,255,0.18)', border:'1px solid rgba(255,255,255,0.28)', borderRadius:9, padding:'9px 14px', fontSize:13, color:'#fff', cursor:'pointer', outline:'none' }}>
            {SORT_OPTIONS.map(o=><option key={o.value} value={o.value} style={{ color:'#2A1520', background:'#fff' }}>{o.label}</option>)}
          </select>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-[1280px] mx-auto px-8 py-6 flex gap-6 items-start">

        {/* Sidebar */}
        <aside className="w-[252px] shrink-0 bg-white rounded-2xl overflow-hidden sticky top-32" style={{ border:`1px solid ${C.bd}`, boxShadow:C.shadowSidebar }}>
          <div className="px-4 py-4 flex items-center justify-between" style={{ borderBottom:`1px solid ${C.sf}` }}>
            <div className="flex flex-col gap-1">
              <span className={`${cormorant.className} text-[16px] font-semibold flex items-center gap-1.5`} style={{ color:C.pink }}>
                <SlidersHorizontal size={14}/> Filters
              </span>
              <span className={`${dmSans.className} inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full w-fit`} style={{ background:'rgba(210,83,128,0.07)', color:C.pink }}>
                <MapPin size={8}/> Jaipur, Rajasthan
              </span>
            </div>
            {hasFilters && (
              <button onClick={clearAll} className={`${dmSans.className} bg-transparent border-none cursor-pointer text-[11px] font-semibold flex items-center gap-1`} style={{ color:C.coral }}>
                <X size={11}/> Clear
              </button>
            )}
          </div>

          {/* Area */}
          <div className="px-4 py-3.5" style={{ borderBottom:`1px solid ${C.sf}` }}>
            <div className={`${dmSans.className} text-[10px] font-semibold tracking-[0.12em] uppercase mb-2`} style={{ color:C.coral }}>Area in Jaipur</div>
            <select value={filters.area||''} onChange={e=>setF('area',e.target.value||undefined)} className={dmSans.className}
              style={{ width:'100%', background:C.sf, border:'1px solid rgba(210,83,128,0.12)', borderRadius:9, padding:'8px 12px', fontSize:12, color:C.ink, outline:'none', cursor:'pointer' }}>
              <option value="">All Areas</option>
              {JAIPUR_AREAS.map(a=><option key={a} value={a}>{a}</option>)}
            </select>
          </div>

          {/* Specialization */}
          <div className="px-4 py-3.5" style={{ borderBottom:`1px solid ${C.sf}` }}>
            <div className={`${dmSans.className} text-[10px] font-semibold tracking-[0.12em] uppercase mb-3`} style={{ color:C.coral }}>
              Specialization
              {specOptions.length === 0 && (
                <span style={{ fontWeight:400, textTransform:'none', letterSpacing:0, color:C.mu, marginLeft:4 }}>(loading…)</span>
              )}
            </div>
            <div className="flex flex-col gap-1.5 max-h-[200px] overflow-y-auto">
              <button onClick={()=>setF('specialization','')} className={dmSans.className}
                style={{ display:'flex', alignItems:'center', width:'100%', padding:'8px 11px', borderRadius:10, fontSize:12, fontWeight:!filters.specialization?600:400, background:!filters.specialization?`linear-gradient(135deg,${C.pink},${C.coral})`:'rgba(210,83,128,0.05)', color:!filters.specialization?'#fff':C.muD, border:'none', cursor:'pointer', textAlign:'left', transition:'all .15s', boxShadow:!filters.specialization?'0 3px 10px rgba(210,83,128,0.22)':'none' }}>
                🩺 All Specializations
              </button>
              {specOptions.map(s => {
                const active = filters.specialization === s.slug
                return (
                  <button key={s.slug} onClick={()=>setF('specialization',s.slug)} className={dmSans.className}
                    style={{ display:'flex', alignItems:'center', justifyContent:'space-between', width:'100%', padding:'8px 11px', borderRadius:10, fontSize:12, fontWeight:active?600:400, background:active?`linear-gradient(135deg,${C.pink},${C.coral})`:'rgba(210,83,128,0.04)', color:active?'#fff':C.muD, border:active?'none':'1px solid rgba(210,83,128,0.08)', cursor:'pointer', textAlign:'left', transition:'all .15s', boxShadow:active?'0 3px 10px rgba(210,83,128,0.22)':'none' }}>
                    {s.icon} {s.name}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Fee */}
          <div className="px-4 py-3.5" style={{ borderBottom:`1px solid ${C.sf}` }}>
            <div className={`${dmSans.className} text-[10px] font-semibold tracking-[0.12em] uppercase mb-2`} style={{ color:C.coral }}>Consultation Fee</div>
            {FEE_RANGES.map(f => {
              const active=(filters.minFee||'')=== f.min&&(filters.maxFee||'')=== f.max
              return (
                <FO key={f.label} active={active}
                  onClick={()=>{ const n={...filters,minFee:f.min||undefined,maxFee:f.max||undefined,city:'Jaipur'}; setFilters(n as any); setPage(1); updateURL(n,1) }}>
                  {f.label}
                </FO>
              )
            })}
          </div>

          {/* Rating */}
          <div className="px-4 py-3.5" style={{ borderBottom:`1px solid ${C.sf}` }}>
            <div className={`${dmSans.className} text-[10px] font-semibold tracking-[0.12em] uppercase mb-2`} style={{ color:C.coral }}>Min Rating</div>
            {[{label:'Any Rating',value:''},{label:'4★ & above',value:'4'},{label:'3★ & above',value:'3'}].map(r=>(
              <FO key={r.value} active={(filters.minRating||'')===r.value} onClick={()=>setF('minRating',r.value)}>{r.label}</FO>
            ))}
          </div>

          {/* Availability */}
          <div className="px-4 py-3.5">
            <div className={`${dmSans.className} text-[10px] font-semibold tracking-[0.12em] uppercase mb-2.5`} style={{ color:C.coral }}>Availability</div>
            {[{key:'availableOnline',label:'Online Consult'},{key:'availableToday',label:'Available Today'}].map(item=>{
              const checked=filters[item.key as keyof typeof filters]==='true'
              return (
                <label key={item.key} className="flex items-center gap-2 py-1.5 cursor-pointer">
                  <div onClick={()=>setF(item.key,checked?'':'true')}
                    className="w-4 h-4 rounded-[5px] flex items-center justify-center shrink-0 cursor-pointer transition-all"
                    style={{ border:`1.5px solid ${checked?C.pink:'rgba(210,83,128,0.25)'}`, background:checked?C.pink:C.wh }}>
                    {checked&&<span className="text-white text-[9px] font-bold leading-none">✓</span>}
                  </div>
                  <span className={`${dmSans.className} text-[13px] cursor-pointer`} style={{ color:C.muD }}
                    onClick={()=>setF(item.key,checked?'':'true')}>{item.label}</span>
                </label>
              )
            })}
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className={cormorant.className} style={{ fontSize:26, fontWeight:600, color:C.ink, lineHeight:1.2, margin:0 }}>
                {filters.specialization
                  ? filters.specialization.charAt(0).toUpperCase()+filters.specialization.slice(1).replace(/-/g,' ')+'s'
                  : 'Doctors'}
                <span style={{ color:C.mu, fontStyle:'italic' }}>
                  {filters.area ? ` in ${filters.area}` : ' in Jaipur'}
                </span>
              </h1>
              {!loading && (
                <p className={`${dmSans.className} text-[13px] mt-0.5 font-light`} style={{ color:C.mu }}>
                  {total} {total===1?'doctor':'doctors'} found
                </p>
              )}
            </div>
            {hasFilters && (
              <div className="flex gap-1.5 flex-wrap justify-end max-w-[380px]">
                {filters.search && (
                  <span className={`${dmSans.className} text-[11px] px-2.5 py-1 rounded-full flex items-center gap-1.5`} style={{ background:'rgba(210,83,128,0.08)', color:C.pink }}>
                    "{filters.search}"<button onClick={()=>setF('search','')} className="bg-transparent border-none cursor-pointer text-[13px] leading-none p-0" style={{ color:C.pink }}>×</button>
                  </span>
                )}
                {filters.area && (
                  <span className={`${dmSans.className} text-[11px] px-2.5 py-1 rounded-full flex items-center gap-1.5`} style={{ background:'rgba(224,142,109,0.1)', color:C.coral }}>
                    <MapPin size={9}/> {filters.area}<button onClick={()=>setF('area','')} className="bg-transparent border-none cursor-pointer text-[13px] leading-none p-0" style={{ color:C.coral }}>×</button>
                  </span>
                )}
                {filters.specialization && (
                  <span className={`${dmSans.className} text-[11px] px-2.5 py-1 rounded-full flex items-center gap-1.5`} style={{ background:'rgba(210,83,128,0.08)', color:C.pink }}>
                    {filters.specialization}<button onClick={()=>setF('specialization','')} className="bg-transparent border-none cursor-pointer text-[13px] leading-none p-0" style={{ color:C.pink }}>×</button>
                  </span>
                )}
              </div>
            )}
          </div>

          {loading
            ? Array.from({length:5}).map((_,i)=><SkeletonRow key={i}/>)
            : doctors.length===0
            ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className={cormorant.className} style={{ fontSize:24, color:C.ink, marginBottom:8 }}>No doctors found</h3>
                <p className={`${dmSans.className} text-sm font-light mb-6`} style={{ color:C.mu }}>
                  Try adjusting your filters or search terms.<br/>
                  <span style={{ fontSize:11, color:C.mu, opacity:0.7 }}>Check browser console for detailed diagnostics.</span>
                </p>
                <button onClick={clearAll} className={`${dmSans.className} text-white border-none rounded-xl px-7 py-3 text-[13px] font-semibold cursor-pointer`}
                  style={{ background:`linear-gradient(135deg,${C.pink},${C.coral})`, boxShadow:'0 4px 16px rgba(210,83,128,0.25)' }}>
                  Clear All Filters
                </button>
              </div>
            )
            : doctors.map((doc,i)=>(
              <div key={doc._id} className="dre" style={{ animationDelay:`${i*0.04}s`, opacity:0 }}>
                <DoctorRow doctor={doc} saved={savedIds.includes(doc._id)} onSave={handleSave}/>
              </div>
            ))
          }

          {pages>1 && (
            <div className="flex items-center justify-center gap-1.5 mt-8">
              <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1}
                className="w-9 h-9 rounded-[9px] flex items-center justify-center bg-white border transition-all"
                style={{ color:C.pink, borderColor:C.bd, cursor:page===1?'not-allowed':'pointer', opacity:page===1?0.4:1 }}>
                <ChevronLeft size={16}/>
              </button>
              {Array.from({length:pages}).map((_,i)=>{
                const n=i+1
                if(n!==1&&n!==pages&&Math.abs(n-page)>2) return (n===2||n===pages-1)?<span key={n} className={`${dmSans.className} px-1 text-sm`} style={{ color:C.mu }}>…</span>:null
                const act=n===page
                return (
                  <button key={n} onClick={()=>setPage(n)} className={`${dmSans.className} w-9 h-9 rounded-[9px] flex items-center justify-center text-[13px] border transition-all`}
                    style={{ fontWeight:act?600:400, background:act?`linear-gradient(135deg,${C.pink},${C.coral})`:'#fff', color:act?'#fff':C.muD, borderColor:act?'transparent':C.bd, cursor:'pointer', boxShadow:act?'0 3px 12px rgba(210,83,128,0.25)':'none' }}>
                    {n}
                  </button>
                )
              })}
              <button onClick={()=>setPage(p=>Math.min(pages,p+1))} disabled={page===pages}
                className="w-9 h-9 rounded-[9px] flex items-center justify-center bg-white border transition-all"
                style={{ color:C.pink, borderColor:C.bd, cursor:page===pages?'not-allowed':'pointer', opacity:page===pages?0.4:1 }}>
                <ChevronRight size={16}/>
              </button>
            </div>
          )}
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
