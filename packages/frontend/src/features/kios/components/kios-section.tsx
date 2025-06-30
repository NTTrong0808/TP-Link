import { cn } from '@/lib/tw'
import { ComponentProps, ReactNode } from 'react'

export interface KiosSectionProps extends Omit<ComponentProps<'div'>, 'title'> {
  title: ReactNode
  children?: ReactNode
  contentProps?: ComponentProps<'div'>
  extra?: ReactNode
}

export const KiosSection = ({ children, title, contentProps, extra, ...props }: KiosSectionProps) => {
  return (
    <div {...props} className={cn('flex flex-col rounded-lg border border-low', props?.className)}>
      <div
        className={cn(
          'bg-neutral-grey-50 px-4 py-[6px] border-b rounded-t-lg border-neutral-200',
          'text-base font-semibold text-neutral-black whitespace-nowrap',
          'flex justify-between gap-2 items-center',
        )}
      >
        {title}
        {extra}
      </div>
      <div {...contentProps} className={cn('p-4', contentProps?.className)}>
        {children}
      </div>
    </div>
  )
}
