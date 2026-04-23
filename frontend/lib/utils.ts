export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ')
}

export function formatFee(amount: number): string {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount)
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(date))
}

export function getInitials(name: string): string {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

export function getAvatarUrl(name: string): string {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1F6F5F&color=fff&size=128&font-size=0.4`
}

export function truncate(str: string, n: number): string {
  return str.length > n ? str.slice(0, n) + '…' : str
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
}

export const SORT_OPTIONS = [
  { value: '',           label: 'Relevance' },
  { value: 'rating',     label: 'Highest Rated' },
  { value: 'reviews',    label: 'Most Reviewed' },
  { value: 'experience', label: 'Most Experienced' },
  { value: 'fee_asc',    label: 'Fee: Low to High' },
  { value: 'fee_desc',   label: 'Fee: High to Low' },
  { value: 'newest',     label: 'Newest' },
]

export const RATING_OPTIONS = [
  { value: '',  label: 'Any Rating' },
  { value: '4', label: '4★ & above' },
  { value: '3', label: '3★ & above' },
]

export const FEE_RANGES = [
  { label: 'Any',        min: '',    max: '' },
  { label: 'Under ₹500', min: '0',   max: '500' },
  { label: '₹500–₹1000', min: '500', max: '1000' },
  { label: '₹1000+',     min: '1000',max: '' },
]
