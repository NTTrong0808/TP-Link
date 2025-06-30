import * as React from 'react'

import { cn } from '@/lib/tw'
import { inputVariants } from './input'

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<'textarea'>>(
  ({ className, ...props }, ref) => {
    const maxLength = props?.maxLength
    const value = typeof props.value === 'string' ? props.value : ''
    return (
      <div className="relative">
        {maxLength && maxLength > 0 && (
          <p className="text-xs text-neutral-grey-400 absolute bottom-1 right-1">
            {value.length}/{maxLength}
          </p>
        )}
        <textarea
          className={cn(
            inputVariants({}),
            'flex min-h-[60px] w-full rounded-md border border-neutral-grey-200 placeholder:text-sm',
            className,
          )}
          ref={ref}
          {...props}
        />
      </div>
    )
  },
)
Textarea.displayName = 'Textarea'

export { Textarea }
