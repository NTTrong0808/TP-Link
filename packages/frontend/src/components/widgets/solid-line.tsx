import { cn } from '@/lib/tw'

export interface SolidLineProps extends React.HTMLAttributes<HTMLDivElement> {}

const SolidLine = (props: SolidLineProps) => {
  return (
    <div {...props} className={cn('w-full h-px border-t border-solid border-black col-span-full', props.className)} />
  )
}

export default SolidLine
