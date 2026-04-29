'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, ArrowRight, CheckCircle2, Mail, RefreshCw } from 'lucide-react'
import { authApi } from '@/lib/api'
import { useAuthStore } from '@/lib/store'
import toast from 'react-hot-toast'
import { Playfair_Display, Outfit } from 'next/font/google'

const playfair = Playfair_Display({
  subsets: ['latin'], weight: ['400','600','700'],
  style: ['normal','italic'], display: 'swap', variable: '--font-playfair',
})
const outfit = Outfit({
  subsets: ['latin'], weight: ['300','400','500','600'],
  display: 'swap', variable: '--font-outfit',
})

const PERKS = [
  'Book appointments instantly',
  'Save your favourite doctors',
  'Leave verified reviews',
  'Track your health history',
]

type Step = 'form' | 'otp'

export default function RegisterPage() {
  const [step,    setStep]    = useState<Step>('form')
  const [form,    setForm]    = useState({ name: '', email: '', password: '', phone: '' })
  const [show,    setShow]    = useState(false)
  const [loading, setLoading] = useState(false)
  const [otp,     setOtp]     = useState(['', '', '', '', '', ''])
  const [resendCd,setResendCd]= useState(0)   // seconds remaining
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])
  const { setAuth } = useAuthStore()
  const router = useRouter()

  /* countdown timer for resend */
  useEffect(() => {
    if (resendCd <= 0) return
    const t = setTimeout(() => setResendCd(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [resendCd])

  /* ── Step 1: send OTP ── */
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.password || !form.phone) {
      toast.error('All fields are required'); return
    }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return }
    setLoading(true)
    try {
      await authApi.sendOtp(form)
      toast.success('OTP sent to your email!')
      setStep('otp')
      setResendCd(60)
      setTimeout(() => otpRefs.current[0]?.focus(), 100)
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  /* ── OTP input helpers ── */
  const handleOtpChange = (i: number, val: string) => {
    if (!/^\d*$/.test(val)) return
    const next = [...otp]
    next[i] = val.slice(-1)
    setOtp(next)
    if (val && i < 5) otpRefs.current[i + 1]?.focus()
  }

  const handleOtpKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus()
  }

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (text.length === 6) {
      setOtp(text.split(''))
      otpRefs.current[5]?.focus()
    }
  }

  /* ── Step 2: verify OTP ── */
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    const code = otp.join('')
    if (code.length < 6) { toast.error('Enter the 6-digit code'); return }
    setLoading(true)
    try {
      const r = await authApi.verifyOtp({ email: form.email, otp: code })
      setAuth(r.data.user, r.data.token)
      toast.success(`Welcome to Huntly, ${r.data.user.name.split(' ')[0]}!`)
      router.push('/')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Invalid or expired OTP')
      setOtp(['', '', '', '', '', ''])
      setTimeout(() => otpRefs.current[0]?.focus(), 50)
    } finally {
      setLoading(false)
    }
  }

  /* ── Resend ── */
  const handleResend = async () => {
    if (resendCd > 0) return
    try {
      await authApi.resendOtp({ email: form.email })
      toast.success('New OTP sent!')
      setResendCd(60)
      setOtp(['', '', '', '', '', ''])
      setTimeout(() => otpRefs.current[0]?.focus(), 50)
    } catch {
      toast.error('Could not resend OTP')
    }
  }

  return (
    <div className={`${playfair.variable} ${outfit.variable} min-h-screen pt-16 flex items-center justify-center px-4`}
      style={{ fontFamily:'var(--font-outfit)', background:'linear-gradient(135deg, #FFFAF4 0%, #fff0e8 100%)' }}>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* ── Left panel ── */}
        <div className="flex flex-col justify-center py-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-[0_4px_16px_rgba(210,83,128,0.25)]"
            style={{ background:'linear-gradient(135deg,#D25380,#E08E6D)' }}>
            <span className="text-2xl font-bold text-white" style={{ fontFamily:'var(--font-playfair)' }}>M</span>
          </div>

          <h2 className="text-4xl font-semibold leading-tight mb-3 text-[#D25380]"
            style={{ fontFamily:'var(--font-playfair)' }}>
            Join<br /><em className="italic">Huntly</em>
          </h2>
          <p className="text-[#7A4A58] mb-8 leading-relaxed text-[15px] font-light">
            Create a free account and take control of your healthcare journey.
          </p>

          <ul className="space-y-3">
            {PERKS.map(p => (
              <li key={p} className="flex items-center gap-3 text-sm text-[#7A4A58]">
                <CheckCircle2 size={16} className="text-[#D25380] shrink-0" /> {p}
              </li>
            ))}
          </ul>

          {step === 'otp' && (
            <div className="mt-8 p-4 rounded-2xl border border-[#D25380]/15 bg-white/60 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-sm text-[#7A4A58]">
                <Mail size={14} className="text-[#D25380] shrink-0"/>
                <span>OTP sent to <span className="font-semibold text-[#2A1520]">{form.email}</span></span>
              </div>
              <button onClick={() => setStep('form')}
                className="mt-2 text-xs text-[#D25380] hover:underline font-medium">
                ← Change email
              </button>
            </div>
          )}
        </div>

        {/* ── Form card ── */}
        <div className="bg-white rounded-3xl p-8 border border-[#D25380]/10
          shadow-[0_8px_40px_rgba(210,83,128,0.12),0_2px_12px_rgba(210,83,128,0.07)]">

          {step === 'form' ? (
            <>
              <h1 className="text-2xl font-semibold text-[#2A1520] mb-1" style={{ fontFamily:'var(--font-playfair)' }}>
                Create Account
              </h1>
              <p className="text-[#AA8090] text-sm mb-6">
                Already have one?{' '}
                <Link href="/auth/login" className="text-[#D25380] font-medium hover:underline">Sign in</Link>
              </p>

              <form onSubmit={handleSendOtp} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#AA8090] mb-1.5">
                    Full Name *
                  </label>
                  <input type="text" value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    placeholder="Your full name"
                    className="w-full bg-[#FFFAF4] border border-[#D25380]/15 rounded-xl px-4 py-3 text-sm text-[#2A1520] placeholder:text-[#AA8090]/50 outline-none focus:border-[#D25380] focus:ring-2 focus:ring-[#D25380]/10 transition-all"
                    required />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#AA8090] mb-1.5">
                    Email Address *
                  </label>
                  <input type="email" value={form.email}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    placeholder="you@example.com"
                    className="w-full bg-[#FFFAF4] border border-[#D25380]/15 rounded-xl px-4 py-3 text-sm text-[#2A1520] placeholder:text-[#AA8090]/50 outline-none focus:border-[#D25380] focus:ring-2 focus:ring-[#D25380]/10 transition-all"
                    required />
                </div>

                {/* Phone — required */}
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#AA8090] mb-1.5">
                    Phone Number *
                  </label>
                  <input type="tel" value={form.phone}
                    onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                    placeholder="+91 98765 43210"
                    className="w-full bg-[#FFFAF4] border border-[#D25380]/15 rounded-xl px-4 py-3 text-sm text-[#2A1520] placeholder:text-[#AA8090]/50 outline-none focus:border-[#D25380] focus:ring-2 focus:ring-[#D25380]/10 transition-all"
                    required />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#AA8090] mb-1.5">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type={show ? 'text' : 'password'}
                      value={form.password}
                      onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                      placeholder="Min. 6 characters"
                      className="w-full bg-[#FFFAF4] border border-[#D25380]/15 rounded-xl px-4 py-3 pr-10 text-sm text-[#2A1520] placeholder:text-[#AA8090]/50 outline-none focus:border-[#D25380] focus:ring-2 focus:ring-[#D25380]/10 transition-all"
                      required />
                    <button type="button" onClick={() => setShow(!show)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#AA8090] hover:text-[#7A4A58] transition-colors">
                      {show ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button type="submit" disabled={loading}
                  className="w-full flex items-center justify-center gap-2 text-white font-semibold py-3.5 rounded-xl mt-2 transition-all active:scale-95 disabled:opacity-60"
                  style={{ background:'linear-gradient(135deg,#D25380,#E08E6D)', boxShadow:'0 4px 16px rgba(210,83,128,0.3)' }}>
                  {loading
                    ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/> Sending OTP…</>
                    : <>Send Verification Code <ArrowRight size={16}/></>}
                </button>
              </form>

              <p className="mt-4 text-xs text-[#AA8090] text-center">
                By registering, you agree to our{' '}
                <Link href="#" className="underline">Terms</Link> and{' '}
                <Link href="#" className="underline">Privacy Policy</Link>.
              </p>
            </>
          ) : (
            /* ── OTP step ── */
            <>
              <div className="w-12 h-12 rounded-2xl bg-[#D25380]/10 flex items-center justify-center mb-5">
                <Mail size={22} className="text-[#D25380]"/>
              </div>

              <h1 className="text-2xl font-semibold text-[#2A1520] mb-1" style={{ fontFamily:'var(--font-playfair)' }}>
                Check your email
              </h1>
              <p className="text-[#AA8090] text-sm mb-7">
                We sent a 6-digit code to{' '}
                <span className="font-semibold text-[#2A1520]">{form.email}</span>
              </p>

              <form onSubmit={handleVerify} className="space-y-6">
                {/* OTP boxes */}
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#AA8090] mb-3">
                    Verification Code
                  </label>
                  <div className="flex gap-2.5" onPaste={handleOtpPaste}>
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        ref={el => { otpRefs.current[i] = el }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={e => handleOtpChange(i, e.target.value)}
                        onKeyDown={e => handleOtpKey(i, e)}
                        className={[
                          'flex-1 h-14 text-center text-xl font-bold rounded-xl border-2 outline-none transition-all',
                          'bg-[#FFFAF4] text-[#2A1520]',
                          digit
                            ? 'border-[#D25380] bg-[#D25380]/[0.04] shadow-[0_0_0_3px_rgba(210,83,128,0.1)]'
                            : 'border-[#D25380]/20 focus:border-[#D25380] focus:shadow-[0_0_0_3px_rgba(210,83,128,0.1)]',
                        ].join(' ')}
                      />
                    ))}
                  </div>
                </div>

                <button type="submit" disabled={loading || otp.join('').length < 6}
                  className="w-full flex items-center justify-center gap-2 text-white font-semibold py-3.5 rounded-xl transition-all active:scale-95 disabled:opacity-50"
                  style={{ background:'linear-gradient(135deg,#D25380,#E08E6D)', boxShadow:'0 4px 16px rgba(210,83,128,0.3)' }}>
                  {loading
                    ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/> Verifying…</>
                    : <>Verify & Create Account <ArrowRight size={16}/></>}
                </button>
              </form>

              {/* Resend */}
              <div className="mt-5 text-center">
                {resendCd > 0 ? (
                  <p className="text-sm text-[#AA8090]">
                    Resend in <span className="font-semibold text-[#D25380]">{resendCd}s</span>
                  </p>
                ) : (
                  <button onClick={handleResend}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-[#D25380] hover:underline">
                    <RefreshCw size={13}/> Resend code
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}