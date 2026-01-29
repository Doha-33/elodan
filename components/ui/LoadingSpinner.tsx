import { cn } from '@/lib/utils'
import { ariaLabels } from '@/lib/accessibility'

interface LoadingSpinnerProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export default function LoadingSpinner({ className, size = 'md' }: LoadingSpinnerProps) {
  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-current border-t-transparent',
        {
          'h-4 w-4': size === 'sm',
          'h-6 w-6': size === 'md',
          'h-8 w-8': size === 'lg',
        },
        className
      )}
      role="status"
      aria-label={ariaLabels.loading}
    >
      <span className="sr-only">{ariaLabels.loading}</span>
    </div>
  )
}

