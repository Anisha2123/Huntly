'use client'
import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight, SlidersHorizontal, X, MapPin, BadgeCheck, Award, Bookmark, ArrowUpRight, Hash, Monitor, Building2, Video } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import { doctorsApi, authApi, categoriesApi } from '@/lib/api'
import { useAuthStore } from '@/lib/store'
import { formatFee, getAvatarUrl } from '@/lib/utils'
import toast from 'react-hot-toast'

/* ── Fonts ─────────────────────────────────────────────── */
const cormorant = Cormorant_Garamond({
  subsets: ['latin'], weight: ['400','600','700'],
  style: ['normal','italic'], display: 'swap', variable: '--font-cormorant',
})
const dmSans = DM_Sans({
  subsets: ['latin'], weight: ['300','400','500','600'],
  display: 'swap', variable: '--font-dm',
})

/* ── Tokens ─────────────────────────────────────────────── */
const C = {
  bg:    '#FFFAF4', pink:  '#D25380', coral: '#E08E6D', peach: '#F6C391',
  ink:   '#2A1520', muD:   '#7A4A58', mu:    '#AA8090',
  sf:    '#FFF0E6', bd:    'rgba(210,83,128,0.12)', wh: '#ffffff',
  sg:    '#8FAF45', sgD:   '#5A6B2A',
  shadowCard:    '0 2px 12px rgba(160,60,80,0.10), 0 1px 4px rgba(160,60,80,0.06)',
  shadowSidebar: '0 4px 24px rgba(160,60,80,0.13), 0 1px 6px rgba(160,60,80,0.07)',
  shadowHover:   '0 8px 32px rgba(160,60,80,0.16), 0 2px 8px rgba(160,60,80,0.08)',
}

const SORT_OPTIONS = [
  { value: '',           label: 'Most Relevant'    },
  { value: 'rating',     label: 'Highest Rated'    },
  { value: 'reviews',    label: 'Most Reviewed'    },
  { value: 'experience', label: 'Most Experienced' },
  { value: 'fee_asc',    label: 'Fee: Low to High' },
  { value: 'fee_desc',   label: 'Fee: High to Low' },
  { value: 'rank',       label: 'By Rank'          },
]

const FEE_RANGES = [
  { label: 'Any',         min: '',    max: ''    },
  { label: 'Under ₹300',  min: '0',   max: '300' },
  { label: '₹300 – ₹600', min: '300', max: '600' },
  { label: '₹600+',       min: '600', max: ''    },
]

const CITIES = ['Jaipur','Mumbai','Delhi','Bangalore','Chennai','Hyderabad']

/* ── Mode badge ─────────────────────────────────────────── */
function ModeBadge({ mode }: { mode?: string }) {
  if (!mode) return null
  const cfg: Record<string, { icon: React.ReactNode; label: string; bg: string; color: string }> = {
    Clinic: { icon: <Building2 size={10}/>, label: 'Clinic',          bg: 'rgba(246,195,145,0.18)', color: '#8A5020' },
    Online: { icon: <Monitor   size={10}/>, label: 'Online',          bg: 'rgba(143,175,69,0.12)',  color: C.sgD    },
    Both:   { icon: <Video     size={10}/>, label: 'Clinic + Online', bg: 'rgba(210,83,128,0.08)', color: C.pink   },
  }
  const c = cfg[mode]
  if (!c) return null
  return (
    <span className={dmSans.className} style={{ display:'inline-flex', alignItems:'center', gap:4, fontSize:10, fontWeight:600, padding:'3px 9px', borderRadius:100, background:c.bg, color:c.color, letterSpacing:'0.04em' }}>
      {c.icon} {c.label}
    </span>
  )
}

/* ── Doctor row ─────────────────────────────────────────── */
function DoctorRow({ doctor, saved, onSave }: { doctor:any; saved:boolean; onSave:(id:string)=>void }) {
  const specs      = doctor.specializations?.slice(0,2) || []
  const conditions = doctor.conditionsTreated?.slice(0,4) || []
  const procedures = doctor.proceduresOffered?.slice(0,3) || []

  const accentBg = doctor.isFeatured
    ? `linear-gradient(to bottom,${C.pink},${C.coral})`
    : doctor.badge==='Top Doctor'
    ? `linear-gradient(to bottom,${C.coral},${C.peach})`
    : C.sf

  return (
    <div
      className="dre group bg-white rounded-2xl overflow-hidden mb-2.5 flex transition-all duration-200 cursor-pointer"
      style={{ border:'1.5px solid rgba(210,83,128,0.07)', boxShadow:C.shadowCard }}
      onMouseEnter={e=>{const el=e.currentTarget;el.style.borderColor=C.bd;el.style.boxShadow=C.shadowHover;el.style.transform='translateY(-1px)'}}
      onMouseLeave={e=>{const el=e.currentTarget;el.style.borderColor='rgba(210,83,128,0.07)';el.style.boxShadow=C.shadowCard;el.style.transform='none'}}
    >
      {/* Accent bar */}
      <div className="w-1 shrink-0 rounded-l-2xl" style={{ background:accentBg }}/>

      {/* Avatar */}
      <div className="p-[18px_0_18px_18px] shrink-0">
        <div className="relative">
          <div className="w-[70px] h-[70px] rounded-[14px] overflow-hidden border-2 border-[#D25380]/10" style={{ background:C.sf }}>
            <Image src={doctor.photo||getAvatarUrl(doctor.name)} alt={doctor.name} width={70} height={70}
              className="object-cover w-full h-full" unoptimized/>
          </div>
          {doctor.availableToday && (
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white"
              style={{ background:C.sg, boxShadow:`0 0 6px ${C.sg}` }} title="Available Today"/>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 p-[18px_16px_18px_14px]">
        <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
          <h3 className={cormorant.className} style={{ fontSize:17, fontWeight:600, color:C.ink, lineHeight:1.2, margin:0 }}>
            {doctor.name}
          </h3>
          {doctor.isVerified && <BadgeCheck size={14} className="shrink-0" style={{ color:C.pink }}/>}
          {doctor.rank!=null && (
            <span className={`${dmSans.className} inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full`}
              style={{ color:C.mu, background:C.sf }}>
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
          {specs.map((s:any) => (
            <span key={s.slug} className={`${dmSans.className} text-[11px] font-medium px-2.5 py-0.5 rounded-full`}
              style={{ color:C.pink, background:'rgba(210,83,128,0.07)' }}>
              {s.icon} {s.name}
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
            <span key={c} className={`${dmSans.className} text-[11px] px-2 py-0.5 rounded-[6px] font-normal`}
              style={{ color:C.muD, background:C.sf }}>{c}</span>
          ))}
          {procedures.map((p:string) => (
            <span key={p} className={`${dmSans.className} text-[11px] px-2 py-0.5 rounded-[6px] font-medium`}
              style={{ color:'#8A5020', background:'rgba(246,195,145,0.15)' }}>{p}</span>
          ))}
        </div>
      </div>

      {/* Right col */}
      <div className="p-[18px_18px_18px_0] flex flex-col items-end justify-between shrink-0 min-w-[176px]">
        <div className="flex flex-col items-end gap-2">
          <button onClick={()=>onSave(doctor._id)}
            className="bg-transparent border-none cursor-pointer p-1 transition-colors"
            style={{ color:saved?C.pink:'rgba(210,83,128,0.25)' }} aria-label="Save">
            <Bookmark size={16} fill={saved?C.pink:'none'}/>
          </button>
          {doctor.totalReviews>0 && (
            <div className="text-right">
              <div className="flex items-center gap-1 justify-end">
                <span style={{ color:C.peach, fontSize:13 }}>★</span>
                <span className={cormorant.className} style={{ fontSize:15, fontWeight:700, color:C.ink }}>{doctor.averageRating?.toFixed(1)}</span>
              </div>
              <div className={dmSans.className} style={{ fontSize:11, color:C.mu }}>{doctor.totalReviews} reviews</div>
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
              {doctor.consultationFee!=null
                ? formatFee(doctor.consultationFee)
                : <span className={dmSans.className} style={{ fontSize:12, fontWeight:400, color:C.mu }}>On request</span>}
            </div>
          </div>
          <Link href={`/doctors/${doctor.slug}`} className={dmSans.className}
            style={{ display:'inline-flex', alignItems:'center', gap:6, background:`linear-gradient(135deg,${C.pink},${C.coral})`, color:'#fff', fontSize:12, fontWeight:600, padding:'9px 17px', borderRadius:10, textDecoration:'none', letterSpacing:'0.02em', boxShadow:'0 3px 12px rgba(210,83,128,0.25)' }}>
            View Profile <ArrowUpRight size={13}/>
          </Link>
        </div>
      </div>
    </div>
  )
}

/* ── Skeleton row ───────────────────────────────────────── */
function SkeletonRow() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden mb-2.5 flex gap-4 p-[18px]"
      style={{ border:'1px solid rgba(210,83,128,0.07)', boxShadow:C.shadowCard }}>
      <div className="w-1 rounded shrink-0" style={{ background:C.sf }}/>
      <div className="w-[70px] h-[70px] rounded-[14px] shrink-0" style={{ background:C.sf }}/>
      <div className="flex-1 flex flex-col gap-2.5">
        <div className="h-[17px] w-[40%] rounded-md" style={{ background:C.sf }}/>
        <div className="h-3 w-[28%] rounded-md" style={{ background:C.sf }}/>
        <div className="flex gap-1.5">
          <div className="h-[22px] w-20 rounded-full" style={{ background:C.sf }}/>
          <div className="h-[22px] w-20 rounded-full" style={{ background:C.sf }}/>
        </div>
      </div>
      <div className="w-[150px] flex flex-col items-end gap-2.5">
        <div className="h-[30px] w-[55px] rounded-md" style={{ background:C.sf }}/>
        <div className="h-9 w-[115px] rounded-[10px]" style={{ background:C.sf }}/>
      </div>
    </div>
  )
}

/* ── Filter option button ───────────────────────────────── */
function FO({ active, onClick, children }: { active:boolean; onClick:()=>void; children:React.ReactNode }) {
  return (
    <button onClick={onClick} className={dmSans.className}
      style={{ display:'flex', alignItems:'center', justifyContent:'space-between', width:'100%', padding:'7px 10px', borderRadius:9, fontSize:13, fontWeight:active?600:400, background:active?'rgba(210,83,128,0.09)':'transparent', color:active?C.pink:C.muD, border:'none', cursor:'pointer', textAlign:'left', transition:'all 0.12s' }}>
      {children}
    </button>
  )
}

/* ── Page skeleton ──────────────────────────────────────── */
function PageSkeleton() {
  return (
    <div className="min-h-screen pt-16" style={{ background:C.bg }}>
      <div className="h-[52px]" style={{ background:'#B03060' }}/>
      <div className="max-w-[1280px] mx-auto px-8 py-6 flex gap-6">
        <div className="w-[252px] shrink-0 rounded-2xl h-[420px]" style={{ background:C.wh, boxShadow:C.shadowSidebar }}/>
        <div className="flex-1">{Array.from({length:5}).map((_,i)=><SkeletonRow key={i}/>)}</div>
      </div>
    </div>
  )
}

/* ── Inner page ─────────────────────────────────────────── */
function DoctorsPageInner() {
  const searchParams = useSearchParams()
  const router       = useRouter()
  const { isAuthenticated } = useAuthStore()

  const [doctors,    setDoctors]    = useState<any[]>([])
  const [loading,    setLoading]    = useState(true)
  const [total,      setTotal]      = useState(0)
  const [pages,      setPages]      = useState(1)
  const [page,       setPage]       = useState(1)
  const [savedIds,   setSavedIds]   = useState<string[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [searchQ,    setSearchQ]    = useState(searchParams.get('search')||'')

  const getFilters = () => ({
    search:          searchParams.get('search')          || undefined,
    city:            searchParams.get('city')            || undefined,
    area:            searchParams.get('area')            || undefined,
    specialization:  searchParams.get('specialization')  || undefined,
    minFee:          searchParams.get('minFee')          || undefined,
    maxFee:          searchParams.get('maxFee')          || undefined,
    minRating:       searchParams.get('minRating')       || undefined,
    availableOnline: searchParams.get('availableOnline') || undefined,
    availableToday:  searchParams.get('availableToday')  || undefined,
    sortBy:          searchParams.get('sortBy')          || undefined,
  })

  const [filters, setFilters] = useState(getFilters())

  const updateURL = useCallback((f: Record<string,string|undefined>, p=1) => {
    const params = new URLSearchParams()
    Object.entries(f).forEach(([k,v]) => { if(v) params.set(k,v) })
    if(p>1) params.set('page',String(p))
    router.push(`/doctors?${params.toString()}`)
  }, [router])

  const setF = (key:string, value:string|undefined) => {
    const next = { ...filters, [key]: value||undefined }
    setFilters(next as any); setPage(1); updateURL(next,1)
  }

  const clearAll = () => { setFilters({}); setPage(1); router.push('/doctors') }

  useEffect(() => {
    categoriesApi.list().then(r=>setCategories(r.data.categories||[])).catch(()=>{})
  }, [])

  useEffect(() => {
    setLoading(true)
    doctorsApi.list({ ...filters, page, limit:12 })
      .then(r=>{ setDoctors(r.data.doctors||[]); setTotal(r.data.total||0); setPages(r.data.pages||1) })
      .catch(()=>toast.error('Failed to load doctors'))
      .finally(()=>setLoading(false))
  }, [filters, page])

  useEffect(() => {
    if(isAuthenticated) authApi.me().then(r=>setSavedIds(r.data.user.savedDoctors?.map((d:any)=>d._id||d)||[])).catch(()=>{})
  }, [isAuthenticated])

  const handleSave = async (id:string) => {
    if(!isAuthenticated){toast.error('Sign in to save doctors');return}
    try {
      const r = await authApi.saveDoctor(id)
      if(r.data.saved){setSavedIds(p=>[...p,id]);toast.success('Saved!')}
      else{setSavedIds(p=>p.filter(s=>s!==id));toast.success('Removed')}
    } catch { toast.error('Something went wrong') }
  }

  const handleSearch = (e:React.FormEvent) => { e.preventDefault(); setF('search', searchQ||undefined) }
  const hasFilters = Object.values(filters).some(Boolean)

  return (
    <div className={`${cormorant.variable} ${dmSans.variable} min-h-screen pt-16`}
      style={{ background:C.bg, fontFamily:'var(--font-dm)' }}>

      {/* Top bar */}
      <div className="sticky top-16 z-40 border-b border-white/10"
        style={{ background:'#B03060', boxShadow:'0 4px 20px rgba(176,48,96,0.25)' }}>
        <div className="max-w-[1280px] mx-auto px-8 py-3 flex items-center justify-between gap-4">

          {/* Search */}
          <form onSubmit={handleSearch}
            className="flex-1 max-w-[520px] flex items-center gap-2.5 bg-white/15 border border-white/25 rounded-[10px] px-3.5 pr-1">
            <input
              value={searchQ}
              onChange={e=>setSearchQ(e.target.value)}
              placeholder="Search doctors, conditions, procedures..."
              className={`${dmSans.className} search-inp flex-1 bg-transparent border-none text-[13px] text-white py-2.5 outline-none placeholder:text-white/60`}
            />
            <button type="submit" className={`${dmSans.className} bg-white/20 border-none rounded-[7px] px-3.5 py-1.5 text-white text-xs font-semibold cursor-pointer tracking-[0.04em] hover:bg-white/30 transition-colors shrink-0`}>
              Search
            </button>
          </form>

          {/* Sort */}
          <select
            value={filters.sortBy||''}
            onChange={e=>setF('sortBy',e.target.value)}
            className={`${dmSans.className} sort-sel bg-white/[0.18] border border-white/[0.28] rounded-[9px] px-3.5 py-2.5 text-[13px] text-white cursor-pointer outline-none`}
          >
            {SORT_OPTIONS.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-[1280px] mx-auto px-8 py-6 flex gap-6 items-start">

        {/* Sidebar */}
        <aside className="w-[252px] shrink-0 bg-white rounded-2xl overflow-hidden sticky top-32"
          style={{ border:`1px solid ${C.bd}`, boxShadow:C.shadowSidebar }}>

          {/* Head */}
          <div className="px-4 py-4 flex items-center justify-between" style={{ borderBottom:`1px solid ${C.sf}` }}>
            <span className={`${cormorant.className} text-[16px] font-semibold flex items-center gap-1.5`} style={{ color:C.pink }}>
              <SlidersHorizontal size={14}/> Filters
            </span>
            {hasFilters && (
              <button onClick={clearAll} className={`${dmSans.className} bg-transparent border-none cursor-pointer text-[11px] font-semibold flex items-center gap-1`} style={{ color:C.coral }}>
                <X size={11}/> Clear
              </button>
            )}
          </div>

          {/* City */}
          <div className="px-4 py-3.5" style={{ borderBottom:`1px solid ${C.sf}` }}>
            <div className={`${dmSans.className} text-[10px] font-semibold tracking-[0.12em] uppercase mb-2`} style={{ color:C.coral }}>City</div>
            <select value={filters.city||''} onChange={e=>setF('city',e.target.value)}
              className={dmSans.className}
              style={{ width:'100%', background:C.sf, border:'1px solid rgba(210,83,128,0.12)', borderRadius:9, padding:'8px 12px', fontSize:12, color:C.ink, outline:'none', cursor:'pointer' }}>
              <option value="">All Cities</option>
              {CITIES.map(c=><option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Specialization */}
          <div className="px-4 py-3.5" style={{ borderBottom:`1px solid ${C.sf}` }}>
            <div className={`${dmSans.className} text-[10px] font-semibold tracking-[0.12em] uppercase mb-2`} style={{ color:C.coral }}>Specialization</div>
            <div className="fsc max-h-[196px] overflow-y-auto" style={{ scrollbarWidth:'thin', scrollbarColor:'rgba(210,83,128,0.2) transparent' }}>
              <FO active={!filters.specialization} onClick={()=>setF('specialization','')}>All</FO>
              {categories.map((c:any)=>(
                <FO key={c._id} active={filters.specialization===c.slug} onClick={()=>setF('specialization',c.slug)}>
                  <span>{c.icon} {c.name}</span>
                  {c.doctorCount>0 && <span style={{ fontSize:10, color:C.mu }}>{c.doctorCount}</span>}
                </FO>
              ))}
            </div>
          </div>

          {/* Fee */}
          <div className="px-4 py-3.5" style={{ borderBottom:`1px solid ${C.sf}` }}>
            <div className={`${dmSans.className} text-[10px] font-semibold tracking-[0.12em] uppercase mb-2`} style={{ color:C.coral }}>Consultation Fee</div>
            {FEE_RANGES.map(f => {
              const active = (filters.minFee||'')===f.min && (filters.maxFee||'')===f.max
              return (
                <FO key={f.label} active={active}
                  onClick={()=>{ const n={...filters,minFee:f.min||undefined,maxFee:f.max||undefined}; setFilters(n as any); setPage(1); updateURL(n,1) }}>
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
              const checked = filters[item.key as keyof typeof filters]==='true'
              return (
                <label key={item.key} className="flex items-center gap-2 py-1.5 cursor-pointer">
                  <div onClick={()=>setF(item.key, checked?'':'true')}
                    className="w-4 h-4 rounded-[5px] flex items-center justify-center shrink-0 cursor-pointer transition-all"
                    style={{ border:`1.5px solid ${checked?C.pink:'rgba(210,83,128,0.25)'}`, background:checked?C.pink:C.wh }}>
                    {checked && <span className="text-white text-[9px] font-bold leading-none">✓</span>}
                  </div>
                  <span className={`${dmSans.className} text-[13px] cursor-pointer`} style={{ color:C.muD }}
                    onClick={()=>setF(item.key, checked?'':'true')}>
                    {item.label}
                  </span>
                </label>
              )
            })}
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 min-w-0">

          {/* Results header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className={cormorant.className} style={{ fontSize:26, fontWeight:600, color:C.ink, lineHeight:1.2, margin:0 }}>
                {filters.specialization
                  ? `${filters.specialization.charAt(0).toUpperCase()+filters.specialization.slice(1)}s`
                  : 'All Doctors'}
                {filters.city && <span style={{ color:C.mu, fontStyle:'italic' }}> in {filters.city}</span>}
              </h1>
              {!loading && (
                <p className={`${dmSans.className} text-[13px] mt-0.5 font-light`} style={{ color:C.mu }}>
                  {total} {total===1?'doctor':'doctors'} found
                </p>
              )}
            </div>

            {/* Active chips */}
            {hasFilters && (
              <div className="flex gap-1.5 flex-wrap justify-end max-w-[380px]">
                {filters.search && (
                  <span className={`${dmSans.className} text-[11px] px-2.5 py-1 rounded-full flex items-center gap-1.5`}
                    style={{ background:'rgba(210,83,128,0.08)', color:C.pink }}>
                    "{filters.search}"
                    <button onClick={()=>setF('search','')} className="bg-transparent border-none cursor-pointer text-[13px] leading-none p-0" style={{ color:C.pink }}>×</button>
                  </span>
                )}
                {filters.availableOnline==='true' && (
                  <span className={`${dmSans.className} text-[11px] px-2.5 py-1 rounded-full flex items-center gap-1.5`}
                    style={{ background:'rgba(143,175,69,0.1)', color:C.sgD }}>
                    Online
                    <button onClick={()=>setF('availableOnline','')} className="bg-transparent border-none cursor-pointer text-[13px] leading-none p-0" style={{ color:C.sgD }}>×</button>
                  </span>
                )}
                {filters.city && (
                  <span className={`${dmSans.className} text-[11px] px-2.5 py-1 rounded-full flex items-center gap-1.5`}
                    style={{ background:'rgba(224,142,109,0.1)', color:C.coral }}>
                    {filters.city}
                    <button onClick={()=>setF('city','')} className="bg-transparent border-none cursor-pointer text-[13px] leading-none p-0" style={{ color:C.coral }}>×</button>
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Cards / empty / skeleton */}
          {loading
            ? Array.from({length:5}).map((_,i)=><SkeletonRow key={i}/>)
            : doctors.length===0
            ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className={cormorant.className} style={{ fontSize:24, color:C.ink, marginBottom:8 }}>No doctors found</h3>
                <p className={`${dmSans.className} text-sm font-light mb-6`} style={{ color:C.mu }}>Try adjusting your filters or search terms</p>
                <button onClick={clearAll} className={`${dmSans.className} text-white border-none rounded-xl px-7 py-3 text-[13px] font-semibold cursor-pointer`}
                  style={{ background:`linear-gradient(135deg,${C.pink},${C.coral})`, boxShadow:'0 4px 16px rgba(210,83,128,0.25)' }}>
                  Clear Filters
                </button>
              </div>
            )
            : doctors.map((doc,i)=>(
              <div key={doc._id} className="dre" style={{ animationDelay:`${i*0.04}s`, opacity:0 }}>
                <DoctorRow doctor={doc} saved={savedIds.includes(doc._id)} onSave={handleSave}/>
              </div>
            ))
          }

          {/* Pagination */}
          {pages>1 && (
            <div className="flex items-center justify-center gap-1.5 mt-8">
              <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1}
                className="w-9 h-9 rounded-[9px] flex items-center justify-center bg-white border transition-all"
                style={{ color:C.pink, borderColor:C.bd, cursor:page===1?'not-allowed':'pointer', opacity:page===1?0.4:1 }}>
                <ChevronLeft size={16}/>
              </button>

              {Array.from({length:pages}).map((_,i)=>{
                const n=i+1
                if(n!==1&&n!==pages&&Math.abs(n-page)>2)
                  return (n===2||n===pages-1)?<span key={n} className={`${dmSans.className} px-1 text-sm`} style={{ color:C.mu }}>…</span>:null
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

/* ── Default export ─────────────────────────────────────── */
export default function DoctorsPage() {
  return (
    <Suspense fallback={<PageSkeleton/>}>
      <DoctorsPageInner/>
    </Suspense>
  )
}