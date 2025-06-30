import { cn } from '@/lib/tw'
import { ComponentProps } from 'react'

export interface OverallContainerProps extends ComponentProps<'section'> {}

const OverallContainer = (props: OverallContainerProps) => {
  return <section {...props} className={cn('max-w-[1200px] mx-auto h-full', props.className)} />
}

export default OverallContainer
