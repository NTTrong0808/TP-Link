import { cn } from '@/lib/tw'
import { ComponentProps } from 'react'
import { tv, VariantProps } from 'tailwind-variants'

export const inputVariants = tv({
  base: [
    'flex w-full rounded-md',
    'border border-neutral-grey-200 bg-transparent px-3 py-2 text-base',
    'file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground',
    'placeholder:text-neutral-grey-300 placeholder:text-sm',
    'transition-colors bg-neutral-white',

    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-100 focus-visible:ring-offset-0',
    'focus-visible:border focus-visible:border-green-600',
    'disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
  ],
  variants: {
    size: {
      sm: 'h-8 text-sm placeholder:text-sm',
      default: 'h-9',
      lg: 'h-10 placeholder:text-base',
      xl: 'h-12 placeholder:text-base',
    },
  },
  defaultVariants: {
    size: 'default',
  },
})

export interface InputProps extends Omit<ComponentProps<'input'>, 'size'>, VariantProps<typeof inputVariants> {
  suffix?: React.ReactNode
  addonAfter?: React.ReactNode
  /** @tw className */
  containerClassName?: ComponentProps<'div'>['className']
}

const handleWheel = (e: WheelEvent) => {
  e.preventDefault()
}

const Input = ({ className, type, ref, size, suffix, addonAfter, containerClassName, ...props }: InputProps) => {
  const input = (
    <input
      type={type}
      className={cn(inputVariants({ size, className }))}
      ref={ref}
      onFocus={(e) => e.target.addEventListener('wheel', handleWheel, { passive: false })}
      onBlur={(e) => e.target.removeEventListener('wheel', handleWheel)}
      {...props}
    />
  )
  if (suffix) {
    return (
      <div className="relative w-full">
        {input}
        {suffix && (
          <div
            className={cn(
              'absolute top-1/2 -translate-y-1/2 p-1 w-fit h-fit leading-none',
              typeof suffix === 'string' ? 'right-3' : 'right-0',
            )}
          >
            {suffix}
          </div>
        )}
      </div>
    )
  }

  if (addonAfter) {
    return (
      <div className={cn('flex gap-3 w-full items-center justify-between', containerClassName)}>
        {input}
        {addonAfter}
      </div>
    )
  }

  return input
}
Input.displayName = 'Input'

export { Input }
