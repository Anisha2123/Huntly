'use client'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  rating: number
  max?: number
  size?: number
  showNumber?: boolean
  interactive?: boolean
  onChange?: (r: number) => void
  className?: string
}

export default function StarRating({
  rating,
  max = 5,
  size = 14,
  showNumber = false,
  interactive = false,
  onChange,
  className,
}: Props) {
  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      {Array.from({ length: max }).map((_, i) => {
        const filled = i < Math.floor(rating)
        const half   = !filled && i < rating
        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange?.(i + 1)}
            className={cn(
              'transition-transform',
              interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default',
            )}
          >
            <Star
              size={size}
              className={cn(
                filled || half
                  ? 'text-[#F6C391] fill-[#F6C391]'   // amber from palette
                  : 'text-[#D25380]/15 fill-[#D25380]/10', // soft rose empty state
              )}
            />
          </button>
        )
      })}
      {showNumber && (
        <span className="ml-1 text-sm font-semibold text-[#2A1520]">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  )
}