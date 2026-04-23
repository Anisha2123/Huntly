'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Heart, Star, User, Clock, CheckCircle, XCircle, AlertCircle, ChevronRight, LogOut } from 'lucide-react'
import { authApi, bookingsApi } from '@/lib/api'
import { useAuthStore } from '@/lib/store'
import { formatFee, formatDate, getAvatarUrl, cn } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function DashboardPage() {
  const { user, isAuthenticated, logout } = useAuthStore()
  const router = useRouter()
  const [tab, setTab]           = useState<'bookings'|'saved'|'profile'>('bookings')
  const [bookings, setBookings] = useState<any[]>([])
  const [saved,    setSaved]    = useState<any[]>([])
  const [loading,  setLoading]  = useState(true)
  const [profileForm, setProfileForm] = useState({ name: '', phone: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) { router.push('/auth/login'); return }
    Promise.all([
      bookingsApi.my(),
      authApi.me(),
    ]).then(([bRes, uRes]) => {
      setBookings(bRes.data.bookings || [])
      setSaved(uRes.data.user.savedDoctors || [])
      setProfileForm({ name: uRes.data.user.name || '', phone: uRes.data.user.phone || '' })
    }).catch(() => toast.error('Failed to load data'))
      .finally(() => setLoading(false))
  }, [isAuthenticated])

  const handleCancelBooking = async (id: string) => {
    try {
      await bookingsApi.cancel(id)
      setBookings(prev => prev.map(b => b._id === id ? { ...b, status: 'cancelled' } : b))
      toast.success('Booking cancelled')
    } catch { toast.error('Failed to cancel') }
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await authApi.update(profileForm)
      toast.success('Profile updated!')
    } catch { toast.error('Failed to update') }
    finally { setSaving(false) }
  }

  const STATUS_STYLES: Record<string, string> = {
    pending:   'bg-amber-50 text-amber-700',
    confirmed: 'bg-blue-50 text-blue-700',
    completed: 'bg-emerald-50 text-emerald-700',
    cancelled: 'bg-red-50 text-red-500',
  }
  const STATUS_ICONS: Record<string, any> = {
    pending: AlertCircle, confirmed: CheckCircle, completed: CheckCircle, cancelled: XCircle,
  }

  if (!isAuthenticated) return null

  return (
    <div className="pt-20 bg-surface min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary-500 flex items-center justify-center text-white font-display text-2xl font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="font-display text-2xl font-semibold text-gray-900">{user?.name}</h1>
              <p className="text-sm text-gray-400">{user?.email}</p>
            </div>
          </div>
          <button onClick={() => { logout(); router.push('/') }} className="flex items-center gap-2 text-sm text-red-500 hover:bg-red-50 px-4 py-2 rounded-xl transition-colors">
            <LogOut size={15} /> Sign Out
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Bookings',      value: bookings.length,                        icon: Calendar, color: 'bg-blue-50 text-blue-500' },
            { label: 'Saved Doctors', value: saved.length,                           icon: Heart,    color: 'bg-rose-50 text-rose-500' },
            { label: 'Reviews Given', value: bookings.filter(b => b.status === 'completed').length, icon: Star, color: 'bg-amber-50 text-amber-500' },
          ].map(s => (
            <div key={s.label} className="card p-4 flex items-center gap-3">
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', s.color)}>
                <s.icon size={18} />
              </div>
              <div>
                <p className="font-display text-2xl font-semibold text-gray-800">{s.value}</p>
                <p className="text-xs text-gray-400">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="card overflow-hidden">
          <div className="flex border-b border-gray-100">
            {([
              { key: 'bookings', label: '📅 My Bookings' },
              { key: 'saved',    label: '❤️ Saved Doctors' },
              { key: 'profile',  label: '👤 Profile' },
            ] as const).map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={cn('flex-1 py-3.5 text-sm font-medium transition-colors', tab === t.key ? 'text-primary-500 border-b-2 border-primary-500' : 'text-gray-500 hover:text-gray-700')}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <>
                {/* Bookings */}
                {tab === 'bookings' && (
                  <div className="space-y-3">
                    {bookings.length === 0 ? (
                      <div className="empty-state">
                        <Calendar size={40} className="text-gray-200 mb-3" />
                        <p className="text-gray-500 font-medium">No appointments yet</p>
                        <Link href="/doctors" className="btn-primary mt-4 !text-sm">Find a Doctor</Link>
                      </div>
                    ) : bookings.map(b => {
                      const Icon = STATUS_ICONS[b.status]
                      return (
                        <div key={b._id} className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 hover:border-primary-100 transition-colors">
                          <Image
                            src={b.doctor?.photo || getAvatarUrl(b.doctor?.name || 'D')}
                            alt={b.doctor?.name || ''}
                            width={48} height={48}
                            className="rounded-xl object-cover flex-shrink-0"
                            unoptimized
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <Link href={`/doctors/${b.doctor?.slug}`} className="font-semibold text-gray-800 hover:text-primary-500 transition-colors text-sm">
                                  {b.doctor?.name}
                                </Link>
                                <p className="text-xs text-gray-400">{b.doctor?.specializations?.[0]?.name}</p>
                              </div>
                              <span className={cn('flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full capitalize flex-shrink-0', STATUS_STYLES[b.status])}>
                                <Icon size={11} /> {b.status}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                              <span className="flex items-center gap-1"><Clock size={11} /> {formatDate(b.appointmentDate)} at {b.appointmentTime}</span>
                              <span className={cn('px-2 py-0.5 rounded-full font-medium', b.type === 'online' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-600')}>
                                {b.type === 'online' ? '🌐 Online' : '🏥 Clinic'}
                              </span>
                              <span className="font-semibold text-primary-500">{formatFee(b.fees)}</span>
                            </div>
                            {b.reason && <p className="text-xs text-gray-400 mt-1 truncate">Reason: {b.reason}</p>}
                          </div>
                          {['pending', 'confirmed'].includes(b.status) && (
                            <button
                              onClick={() => handleCancelBooking(b._id)}
                              className="text-xs text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors flex-shrink-0"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* Saved */}
                {tab === 'saved' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {saved.length === 0 ? (
                      <div className="empty-state col-span-2">
                        <Heart size={40} className="text-gray-200 mb-3" />
                        <p className="text-gray-500 font-medium">No saved doctors yet</p>
                        <Link href="/doctors" className="btn-primary mt-4 !text-sm">Browse Doctors</Link>
                      </div>
                    ) : saved.map((doc: any) => (
                      <Link key={doc._id} href={`/doctors/${doc.slug}`} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-primary-200 hover:bg-primary-50/30 transition-all group">
                        <Image src={doc.photo || getAvatarUrl(doc.name)} alt={doc.name} width={44} height={44} className="rounded-xl object-cover" unoptimized />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 truncate group-hover:text-primary-500 transition-colors">{doc.name}</p>
                          <p className="text-xs text-gray-400">{doc.specializations?.[0]?.name}</p>
                          <p className="text-xs text-primary-500 font-medium">{formatFee(doc.consultationFee)}</p>
                        </div>
                        <ChevronRight size={15} className="text-gray-300 group-hover:text-primary-400 transition-colors" />
                      </Link>
                    ))}
                  </div>
                )}

                {/* Profile */}
                {tab === 'profile' && (
                  <form onSubmit={handleSaveProfile} className="max-w-md space-y-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Full Name</label>
                      <input type="text" value={profileForm.name} onChange={e => setProfileForm(p => ({ ...p, name: e.target.value }))} className="input-field" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Email</label>
                      <input type="email" value={user?.email || ''} className="input-field bg-gray-50 cursor-not-allowed" disabled />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Phone</label>
                      <input type="tel" value={profileForm.phone} onChange={e => setProfileForm(p => ({ ...p, phone: e.target.value }))} placeholder="+91 98765 43210" className="input-field" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Account Type</label>
                      <div className="flex items-center gap-2 px-4 py-3 bg-primary-50 rounded-xl border border-primary-100">
                        <User size={15} className="text-primary-500" />
                        <span className="text-sm font-medium text-primary-600 capitalize">{user?.role}</span>
                      </div>
                    </div>
                    <button type="submit" disabled={saving} className="btn-primary !py-3 disabled:opacity-60">
                      {saving ? 'Saving…' : 'Save Changes'}
                    </button>
                  </form>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
