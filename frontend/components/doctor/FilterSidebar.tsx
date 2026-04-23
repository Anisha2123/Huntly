'use client'
import { useEffect, useState } from 'react'
import { X, SlidersHorizontal } from 'lucide-react'
import { categoriesApi, locationsApi } from '@/lib/api'
import { RATING_OPTIONS, FEE_RANGES } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface Filters {
  city?: string
  specialization?: string
  minFee?: string
  maxFee?: string
  minRating?: string
  availableOnline?: string
  availableToday?: string
  sortBy?: string
}

interface Props {
  filters: Filters
  onChange: (f: Filters) => void
  className?: string
}

export default function FilterSidebar({ filters, onChange, className }: Props) {
  const [categories, setCategories] = useState<any[]>([])
  const [cities, setCities] = useState<string[]>([])
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    categoriesApi.list().then(r => setCategories(r.data.categories || []))
    locationsApi.list().then(r => {
      const locs: any[] = r.data.locations || []
      setCities(locs.map(l => l.city))
    })
  }, [])

  const set = (key: keyof Filters, value: string) => {
    onChange({ ...filters, [key]: value || undefined })
  }

  const clear = () => onChange({})

  const hasFilters = Object.values(filters).some(v => v && v !== '')

  const panel = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold text-primary-500 flex items-center gap-2">
          <SlidersHorizontal size={17} /> Filters
        </h3>
        {hasFilters && (
          <button onClick={clear} className="text-xs text-red-500 hover:underline flex items-center gap-1">
            <X size={12} /> Clear All
          </button>
        )}
      </div>

      {/* City */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">City</label>
        <select value={filters.city || ''} onChange={e => set('city', e.target.value)} className="input-field text-sm">
          <option value="">All Cities</option>
          {cities.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Specialization */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Specialization</label>
        <div className="space-y-1 max-h-52 overflow-y-auto pr-1">
          <button
            onClick={() => set('specialization', '')}
            className={cn('w-full text-left px-3 py-2 rounded-lg text-sm transition-all', !filters.specialization ? 'bg-primary-500 text-white' : 'text-gray-600 hover:bg-gray-100')}
          >
            All Specializations
          </button>
          {categories.map(c => (
            <button
              key={c._id}
              onClick={() => set('specialization', c.slug)}
              className={cn('w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center gap-2', filters.specialization === c.slug ? 'bg-primary-500 text-white' : 'text-gray-600 hover:bg-gray-100')}
            >
              <span>{c.icon}</span>
              <span className="flex-1 truncate">{c.name}</span>
              <span className={cn('text-xs', filters.specialization === c.slug ? 'text-primary-100' : 'text-gray-400')}>{c.doctorCount}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Fee Range */}
      {/* <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Consultation Fee</label>
        <div className="space-y-1">
          {FEE_RANGES.map(f => {
            const active = filters.minFee === f.min && filters.maxFee === f.max
            return (
              <button
                key={f.label}
                onClick={() => onChange({ ...filters, minFee: f.min || undefined, maxFee: f.max || undefined })}
                className={cn('w-full text-left px-3 py-2 rounded-lg text-sm transition-all', active ? 'bg-primary-500 text-white' : 'text-gray-600 hover:bg-gray-100')}
              >
                {f.label}
              </button>
            )
          })}
        </div>
      </div> */}

      {/* Rating */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Min Rating</label>
        <div className="space-y-1">
          {RATING_OPTIONS.map(r => (
            <button
              key={r.value}
              onClick={() => set('minRating', r.value)}
              className={cn('w-full text-left px-3 py-2 rounded-lg text-sm transition-all', (filters.minRating || '') === r.value ? 'bg-primary-500 text-white' : 'text-gray-600 hover:bg-gray-100')}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Availability</label>
        <div className="space-y-2">
          {[
            { key: 'availableOnline', label: 'Online Consultation', icon: '🌐' },
            { key: 'availableToday', label: 'Available Today',      icon: '📅' },
          ].map(item => (
            <label key={item.key} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters[item.key as keyof Filters] === 'true'}
                onChange={e => set(item.key as keyof Filters, e.target.checked ? 'true' : '')}
                className="w-4 h-4 rounded accent-primary-500 cursor-pointer"
              />
              <span className="text-sm text-gray-600 group-hover:text-primary-500 transition-colors">
                {item.icon} {item.label}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile toggle */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setMobileOpen(true)}
          className={cn('flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all', hasFilters ? 'bg-primary-500 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:border-primary-300')}
        >
          <SlidersHorizontal size={15} /> Filters {hasFilters && '•'}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute right-0 inset-y-0 w-80 bg-white shadow-2xl overflow-y-auto">
            <div className="p-5">
              <div className="flex items-center justify-between mb-5">
                <span className="font-semibold text-gray-800">Filters</span>
                <button onClick={() => setMobileOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100"><X size={18} /></button>
              </div>
              {panel}
              <button onClick={() => setMobileOpen(false)} className="mt-6 btn-primary w-full justify-center">Apply Filters</button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className={cn('hidden lg:block', className)}>
        <div className="bg-white rounded-xl2 p-5 shadow-card sticky top-24">
          {panel}
        </div>
      </div>
    </>
  )
}
