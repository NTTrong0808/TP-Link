import { cn } from '@/lib/tw'
import * as React from 'react'
import { tv, VariantProps } from 'tailwind-variants'

const componentVariants = tv({
  base: ['relative text-gray-500  ml-4'],
  variants: {
    orientation: {
      vertical: 'flex-col',
      horizontal: 'flex-row',
    },
    type: {
      value: '',
      dot: 'ml-0',
    },
  },
  defaultVariants: {
    orientation: 'vertical',
    type: 'value',
  },
})

const itemVariants = tv({
  base: ['pb-5 last:pb-0 pl-6 [&:not(:last-child)]:border-s  border-dashed'],
  variants: {
    type: {
      value: '',
      dot: '',
    },
    color: {
      primary: 'border-primary-orange-100',
      default: 'border-green-100',
      secondary: 'border-neutral-gray-100',
      destructive: 'border-red-100',
    },
  },
  defaultVariants: {
    type: 'value',
    color: 'default',
  },
})

const stepperVariants = tv({
  base: ['absolute flex items-center justify-center rounded-full w-8 h-8 -start-4'],
  variants: {
    color: {
      default: 'bg-green-50',
      secondary: 'bg-neutral-gray-50',
      destructive: 'bg-red-50',
      primary: 'bg-primary-orange-50',
    },
    type: {
      value: '',
      dot: 'bg-primary-orange-400 w-2 h-2 left-0 -translate-x-1/2',
    },
  },
  defaultVariants: {
    color: 'default',
    type: 'value',
  },
})

const iconVariants = tv({
  base: ['w-full h-full flex items-center justify-center [&>svg]:h-4 [&>svg]:w-4'],
  variants: {
    color: {
      default: 'text-green-500',
      secondary: 'text-gray-500',
      destructive: 'text-secondary-strawberry-300',
      primary: 'text-primary-orange-500',
    },
    type: {
      value: '',
      dot: 'hidden',
    },
  },
  defaultVariants: {
    color: 'secondary',
    type: 'value',
  },
})

export interface TimelineStep {
  value?: React.ReactNode | string
  title: React.ReactNode | string
  description?: React.ReactNode | string
  content?: React.ReactNode | string
  color?: 'default' | 'secondary' | 'destructive'
  icon?: React.ReactNode
}
export interface TimelineStepper
  extends Omit<VariantProps<typeof stepperVariants>, 'color'>,
    React.HTMLAttributes<HTMLDivElement> {
  steps: TimelineStep[]
  orientation?: 'vertical' | 'horizontal'
  type?: 'value' | 'dot'
  color?: 'default' | 'secondary' | 'destructive' | 'primary'
}

export function TimelineStepper({
  steps,
  orientation = 'vertical',
  className,
  type = 'value',
  color,
}: TimelineStepper) {
  return (
    <ol className={cn(componentVariants({ orientation, type }), className)}>
      {steps.map((step, index) => (
        <li key={index} className={cn(itemVariants({ type, color }))}>
          <span className={cn(stepperVariants({ color: step.color || color, type }))}>
            <span className={cn(iconVariants({ color: step.color || color, type }))}>{step.icon || index + 1}</span>
          </span>
          <div className="flex flex-col gap-2 text-neutral-black">
            <div className="text-sm">
              {step.title}
              {step.description && <p className="text-xs text-neutral-grey-300">{step.description}</p>}
            </div>
            {step.content && <div className="text-xs">{step.content}</div>}
          </div>
        </li>
      ))}
    </ol>
  )
}
