import { Slot } from '@radix-ui/react-slot'

import { cn } from '@/lib/tw'
import { Loader2 } from 'lucide-react'
import { forwardRef } from 'react'
import { tv, VariantProps } from 'tailwind-variants'

const buttonVariants = tv({
  base: [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md',
    'text-sm font-medium transition-colors focus-visible:outline-none',
    'focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none',
    'disabled:opacity-50 [&_svg]:pointer-events-none',
    '[&_svg]:size-4 [&_svg]:shrink-0',
    'transition-all duration-300 ease-out',
  ],
  variants: {
    variant: {
      default: 'bg-green-700 text-neutral-white hover:bg-green-800',
      outline: 'border border-neutral-grey-200 bg-transparent hover:bg-neutral-grey-100',

      destructive: 'bg-secondary-strawberry-300 text-white hover:bg-secondary-strawberry-400/90',

      secondary: 'bg-neutral-grey-100 text-neutral-grey-600 hover:bg-neutral-grey-200',
      ghost: 'hover:bg-neutral-grey-50',
      link: 'text-primary underline-offset-4 hover:underline',

      primary: 'bg-primary-orange-400 text-neutral-white hover:bg-primary-orange-500',
    },
    size: {
      default: 'h-9 px-4 py-2',
      sm: 'h-8 rounded-md px-3 text-xs',
      lg: 'h-10 rounded-md px-3',
      xl: 'h-12 rounded-lg text-base font-semibold',
      icon: 'size-9',
      'tiny-icon': 'size-6',
    },
    shadow: {
      true: '',
      false: '',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
    shadow: false,
  },
  compoundVariants: [
    {
      variant: ['default'],
      shadow: true,
      className: 'shadow',
    },
    {
      variant: ['destructive', 'outline', 'secondary'],
      shadow: true,
      className: 'shadow-sm',
    },
  ],
})

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  isLoading?: boolean
  loading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, isLoading, loading, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    const loadingState = isLoading || loading

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
        disabled={Boolean(loadingState || props?.disabled)}
      >
        {loadingState ? <Loader2 className="animate-spin" /> : children}
      </Comp>
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
