import { cn } from '@/lib/tw'
import { ComponentProps, ReactNode } from 'react'

export interface NothingProps extends Omit<ComponentProps<'div'>, 'title'> {
  title?: ReactNode | string | null
}

const Nothing = ({ title, ...props }: NothingProps) => {
  return (
    <div className={cn('text-sm font-normal text-[#606060] flex flex-col justify-center items-center flex-1')}>
      <div>{title ?? 'Ở đây hơi trống...'}</div>
    </div>
  )
}

export default Nothing
