import { cn } from '@/lib/utils'

interface ErrorMessageProps {
  message: string
  className?: string
}

export default function ErrorMessage({ message, className }: ErrorMessageProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 text-sm text-destructive',
        className
      )}
      role="alert"
      aria-live="polite"
    >
      <svg
        className="h-4 w-4 flex-shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>{message}</span>
    </div>
  )
}

