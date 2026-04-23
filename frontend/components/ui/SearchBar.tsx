'use client'
import { useState } from 'react'
import { Search, MapPin, ChevronDown } from 'lucide-react'
import { useRouter } from 'next/navigation'

const POPULAR_SEARCHES = ['Cardiologist', 'Dermatologist', 'Dentist', 'Orthopedist', 'Neurologist', 'Pediatrician']
const CITIES = ['Jaipur', 'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune']

export default function SearchBar({ compact = false }: { compact?: boolean }) {
  const [query,    setQuery]    = useState('')
  const [city,     setCity]     = useState('')
  const [cityOpen, setCityOpen] = useState(false)
  const router = useRouter()

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (query) params.set('search', query)
    if (city)  params.set('city', city)
    router.push(`/doctors?${params.toString()}`)
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch()
  }

  return (
    <div className={compact ? '' : 'space-y-3'}>

      {/* ── Bar ── */}
      <div className={[
        'flex items-stretch rounded-2xl overflow-hidden bg-white',
        'border border-[#D25380]/15',
        'shadow-[0_4px_24px_rgba(210,83,128,0.12),0_1px_6px_rgba(210,83,128,0.07)]',
        compact ? 'h-11' : 'h-14',
      ].join(' ')}>

        {/* City selector */}
        <div className="relative border-r border-[#D25380]/10">
          <button
            onClick={() => setCityOpen(!cityOpen)}
            className={[
              'flex items-center gap-2 h-full px-4 font-medium text-[#7A3A50]',
              'hover:bg-[#D25380]/[0.04] transition-colors whitespace-nowrap',
              compact ? 'text-xs gap-1.5 px-3' : 'text-sm',
            ].join(' ')}
          >
            <MapPin size={compact ? 13 : 15} className="text-[#D25380] shrink-0" />
            <span className="max-w-[80px] truncate">{city || 'All Cities'}</span>
            <ChevronDown
              size={12}
              className={`text-[#AA8090] transition-transform ${cityOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {cityOpen && (
            <div className="absolute top-full left-0 mt-1.5 w-44 bg-[#FFFAF4] rounded-xl border border-[#D25380]/12 py-1 z-50
              shadow-[0_8px_32px_rgba(210,83,128,0.14),0_2px_8px_rgba(210,83,128,0.07)]">
              <button
                onClick={() => { setCity(''); setCityOpen(false) }}
                className="block w-full text-left px-4 py-2 text-sm text-[#AA8090] hover:bg-[#D25380]/[0.05] transition-colors"
              >
                All Cities
              </button>
              {CITIES.map(c => (
                <button
                  key={c}
                  onClick={() => { setCity(c); setCityOpen(false) }}
                  className="block w-full text-left px-4 py-2 text-sm text-[#2A1520] hover:bg-[#D25380]/[0.07] hover:text-[#D25380] transition-colors"
                >
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search input */}
        <div className="flex-1 flex items-center">
          <Search size={compact ? 15 : 17} className="ml-4 text-[#D25380]/30 shrink-0" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKey}
            placeholder={compact ? 'Search doctors...' : 'Search by name, specialization, clinic...'}
            className={[
              'flex-1 px-3 bg-transparent outline-none text-[#2A1520]',
              'placeholder:text-[#AA8090]/60',
              compact ? 'text-sm' : 'text-base',
            ].join(' ')}
          />
        </div>

        {/* Submit */}
        <button
          onClick={handleSearch}
          className={[
            'text-white font-semibold shrink-0 transition-all active:scale-95',
            'bg-[#D25380] hover:bg-[#bf4470]',
            'shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]',
            compact ? 'px-5 text-sm' : 'px-7 text-base',
          ].join(' ')}
        >
          Search
        </button>
      </div>

      {/* Popular searches */}
      {/* {!compact && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-[#AA8090]/70">Popular:</span>
          {POPULAR_SEARCHES.map(s => (
            <button
              key={s}
              onClick={() => { setQuery(s); setTimeout(handleSearch, 50) }}
              className={[
                'text-xs font-medium text-[#D25380] bg-white',
                'border border-[#D25380]/20 hover:border-[#D25380]/50 hover:bg-[#D25380]/[0.05]',
                'px-3 py-1 rounded-full transition-all',
                'shadow-[0_1px_4px_rgba(210,83,128,0.08)]',
              ].join(' ')}
            >
              {s}
            </button>
          ))}
        </div>
      )} */}
    </div>
  )
}