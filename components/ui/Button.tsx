import React from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, disabled, children, ...props }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 active:scale-[0.98]',
          'focus-visible-ring',
          'disabled:pointer-events-none disabled:opacity-50',
          {
            'bg-brand hover:bg-brand-700 text-white shadow-sm hover:shadow-md': variant === 'primary' || variant === 'secondary',
            'border-2 border-gray-200 bg-white hover:bg-gray-50 text-gray-900': variant === 'outline',
            'hover:bg-brand/10 hover:text-brand': variant === 'ghost',
            'h-9 px-4 text-xs tracking-wide': size === 'sm',
            'h-10 px-6 text-sm': size === 'md',
            'h-12 px-8 text-base': size === 'lg',
          },
          className
        )}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button

