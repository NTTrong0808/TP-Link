import { cn } from '@/lib/tw'
import { LoaderIcon } from 'lucide-react'
import { ComponentProps } from 'react'

export interface LoaderProps extends ComponentProps<'div'> {
  loading?: any
}

const Loader = ({ loading, className, ...props }: LoaderProps) => {
  if (!Boolean(loading)) return null

  return (
    <div
      className={cn(
        'absolute inset-0 flex items-center justify-center bg-neutral-white/50 backdrop-blur-sm z-[50]',
        className,
      )}
    >
      <LoaderIcon className="size-6 animate-spin" />
    </div>
  )
}

export default Loader
