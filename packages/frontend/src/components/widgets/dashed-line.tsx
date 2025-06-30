import { cn } from '@/lib/tw'
export interface DashedLineProps extends React.HTMLAttributes<HTMLDivElement> {}

const DashedLine = (props: DashedLineProps) => {
  return (
    <div {...props} className={cn('w-full h-px border-t border-dashed border-black col-span-full', props.className)} />
  )
}

export default DashedLine
