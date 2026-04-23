'use client'
import Link from 'next/link'
import Image from 'next/image'
import {
  MapPin, Clock, Video, Stethoscope, BadgeCheck, Bookmark,
  ChevronRight, Award, Monitor, Building2, Hash
} from 'lucide-react'
import { formatFee, getAvatarUrl, cn } from '@/lib/utils'
import StarRating from '@/components/ui/StarRating'

// ─── Types ────────────────────────────────────────────────────────────────────
interface Doctor {
  _id: string
  name: string
  slug: string
  photo?: string
  specializations: Array<{ name: string; slug: string; icon: string }>
  qualificationText?: string
  qualifications?: Array<{ degree: string; institution: string }>
  experience?: number | null
  primaryCity: string
  primaryArea?: string
  // new fields
  conditionsTreated?: string[]
  proceduresOffered?: string[]
  consultationMode?: 'Clinic' | 'Online' | 'Both'
  equipment?: string[]
  googleMapsLink?: string
  rank?: number | null
  // fees (nullable)
  consultationFee?: number | null
  onlineFee?: number | null
  // availability
  availableOnline: boolean
  availableToday: boolean
  // stats
  averageRating: number
  totalReviews: number
  // flags
  isVerified: boolean
  isFeatured: boolean
  badge?: string | null
  languages?: string[]
}

interface Props {
  doctor: Doctor
  saved?: boolean
  onSave?: (id: string) => void
  className?: string
}

// ─── Badge colours ─────────────────────────────────────────────────────────
const BADGE_STYLES: Record<string, string> = {
  'Top Doctor':   'bg-amber-50 text-amber-700 border-amber-200',
  'Highly Rated': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Most Booked':  'bg-blue-50 text-blue-700 border-blue-200',
}

// ─── Mode pill ─────────────────────────────────────────────────────────────
function ModePill({ mode }: { mode?: string }) {
  if (!mode) return null
  const cfg: Record<string, { icon: React.ReactNode; label: string; cls: string }> = {
    Clinic: { icon: <Building2 size={10} />, label: 'Clinic',  cls: 'bg-gray-100 text-gray-600' },
    Online: { icon: <Monitor   size={10} />, label: 'Online',  cls: 'bg-blue-50 text-blue-600'  },
    Both:   { icon: <Video     size={10} />, label: 'Clinic + Online', cls: 'bg-indigo-50 text-indigo-600' },
  }
  const c = cfg[mode]
  if (!c) return null
  return (
    <span className={cn('inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full', c.cls)}>
      {c.icon} {c.label}
    </span>
  )
}

// ─── Main component ────────────────────────────────────────────────────────
export default function DoctorCard({ doctor, saved, onSave, className }: Props) {
  // Build a short qualification display string
  const qualStr =
    doctor.qualificationText ||
    doctor.qualifications?.map(q => q.degree).join(', ') ||
    ''

  const specs       = doctor.specializations?.slice(0, 2) || []
  const conditions  = doctor.conditionsTreated?.slice(0, 3) || []
  const procedures  = doctor.proceduresOffered?.slice(0, 3) || []

  return (
    <div className={cn('card group relative flex flex-col', className)}>

      {/* ── Featured ribbon ── */}
      {doctor.isFeatured && (
        <div className="absolute top-0 left-0 bg-primary-500 text-white text-[10px] font-semibold uppercase tracking-wider px-3 py-1 rounded-tl-xl rounded-br-xl z-10">
          Featured
        </div>
      )}

      {/* ── Rank badge (top-right, only when rank exists) ── */}
      {doctor.rank != null && (
        <div className="absolute top-3 right-10 z-10 flex items-center gap-0.5 bg-white border border-gray-100 shadow-sm text-[10px] font-bold text-gray-500 px-1.5 py-0.5 rounded-full">
          <Hash size={9} />
          {doctor.rank}
        </div>
      )}

      {/* ── Save button ── */}
      <button
        onClick={() => onSave?.(doctor._id)}
        className="absolute top-3 right-3 z-10 p-1.5 rounded-lg bg-white/80 backdrop-blur hover:bg-white shadow-sm transition-all"
        aria-label="Save doctor"
      >
        <Bookmark
          size={15}
          className={cn('transition-colors', saved ? 'fill-primary-500 text-primary-500' : 'text-gray-400')}
        />
      </button>

      <div className="p-5 flex flex-col h-full">

        {/* ── Avatar + Core info ── */}
        <div className="flex gap-4 mb-3">
          <div className="relative flex-shrink-0">
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100">
              <Image
                src={doctor.photo || getAvatarUrl(doctor.name)}
                alt={doctor.name}
                width={64} height={64}
                className="object-cover w-full h-full"
                unoptimized
              />
            </div>
            {doctor.availableToday && (
              <span
                className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white"
                title="Available Today"
              />
            )}
          </div>

          <div className="flex-1 min-w-0">
            {/* Name + verified */}
            <div className="flex items-center gap-1.5 mb-0.5 pr-14">
              <h3 className="font-display text-lg font-semibold text-gray-800 leading-tight truncate">
                {doctor.name}
              </h3>
              {doctor.isVerified && (
                <BadgeCheck size={16} className="text-teal-mid flex-shrink-0" />
              )}
            </div>

            {/* Qualifications + experience */}
            {(qualStr || doctor.experience) && (
              <p className="text-xs text-gray-500 truncate mb-1">
                {qualStr}
                {qualStr && doctor.experience ? ' · ' : ''}
                {doctor.experience ? `${doctor.experience} yrs` : ''}
              </p>
            )}

            {/* Specializations */}
            {specs.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-1">
                {specs.map(s => (
                  <span key={s.slug} className="text-xs text-primary-600 font-medium">
                    {s.icon} {s.name}
                  </span>
                ))}
              </div>
            )}

            {/* Consultation mode */}
            <ModePill mode={doctor.consultationMode} />
          </div>
        </div>

        {/* ── Badge ── */}
        {doctor.badge && (
          <div className={cn(
            'inline-flex items-center gap-1 text-xs font-medium border px-2 py-0.5 rounded-full mb-3 self-start',
            BADGE_STYLES[doctor.badge] || 'bg-gray-50 text-gray-600 border-gray-200'
          )}>
            <Award size={11} /> {doctor.badge}
          </div>
        )}

        <div className="h-px bg-gray-100 mb-3" />

        {/* ── Details ── */}
        <div className="space-y-2 mb-3 flex-1">

          {/* Rating */}
          {(doctor.totalReviews > 0 || doctor.averageRating > 0) && (
            <div className="flex items-center gap-2">
              <StarRating rating={doctor.averageRating} size={13} />
              <span className="text-sm font-semibold text-gray-700">
                {doctor.averageRating.toFixed(1)}
              </span>
              <span className="text-xs text-gray-400">
                ({doctor.totalReviews} {doctor.totalReviews === 1 ? 'review' : 'reviews'})
              </span>
            </div>
          )}

          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <MapPin size={12} className="text-primary-400 flex-shrink-0" />
            <span className="truncate">
              {[doctor.primaryArea, doctor.primaryCity].filter(Boolean).join(', ')}
            </span>
          </div>

          {/* Conditions treated */}
          {conditions.length > 0 && (
            <div className="flex items-start gap-1.5">
              <Stethoscope size={11} className="text-primary-300 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-gray-500 leading-snug">
                <span className="font-medium text-gray-600">Treats: </span>
                {conditions.join(' · ')}
                {(doctor.conditionsTreated?.length ?? 0) > 3 && (
                  <span className="text-gray-400"> +{(doctor.conditionsTreated?.length ?? 0) - 3} more</span>
                )}
              </p>
            </div>
          )}

          {/* Procedures */}
          {procedures.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {procedures.map(p => (
                <span key={p} className="text-[10px] font-medium px-2 py-0.5 bg-primary-50 text-primary-600 rounded-full">
                  {p}
                </span>
              ))}
              {(doctor.proceduresOffered?.length ?? 0) > 3 && (
                <span className="text-[10px] font-medium px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">
                  +{(doctor.proceduresOffered?.length ?? 0) - 3}
                </span>
              )}
            </div>
          )}

          {/* Availability */}
          <div className="flex items-center gap-3">
            {doctor.availableToday && (
              <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                <Clock size={11} /> Available Today
              </span>
            )}
          </div>
        </div>

        {/* ── Footer: fee + CTA ── */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-400 leading-none mb-0.5">Consultation</p>
            <p className="text-base font-semibold text-gray-800">
              {doctor.consultationFee != null
                ? formatFee(doctor.consultationFee)
                : <span className="text-sm text-gray-400 font-normal">Call for fee</span>
              }
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Maps link */}
            {doctor.googleMapsLink && (
              <a
                href={doctor.googleMapsLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                className="p-2 rounded-xl border border-gray-200 hover:border-primary-300 hover:text-primary-500 transition-all"
                title="View on Google Maps"
              >
                <MapPin size={14} />
              </a>
            )}
            <Link
              href={`/doctors/${doctor.slug}`}
              className="flex items-center gap-1 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium px-4 py-2 rounded-xl transition-all group-hover:shadow-md active:scale-95"
            >
              View <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}