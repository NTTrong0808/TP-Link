'use client'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/tw'
import { appDayJs } from '@/utils/dayjs'
import { PopoverContentProps } from '@radix-ui/react-popover'
import dayjs from 'dayjs'
import { XIcon } from 'lucide-react'
import { ComponentProps, HTMLAttributes, useEffect, useId, useState } from 'react'
import { SelectSingleEventHandler } from 'react-day-picker'
import { tv, VariantProps } from 'tailwind-variants'
import CalendarIcon from '../widgets/icons/calendar-icon'
import { inputVariants } from './input'

export const datePickerVariants = tv({
  extend: inputVariants,
  base: ['group justify-start'],
})

export interface DatePickerProps
  extends VariantProps<typeof datePickerVariants>,
    Omit<ComponentProps<'input'>, 'value' | 'onChange' | 'size'> {
  label?: string
  id?: string
  placeholder?: string
  value?: any
  onChange?: (value: any) => void
  format?: string
  currentDate?: boolean
  datePickerAlign?: PopoverContentProps['align']
  fromDate?: Date
  clearable?: boolean
}

export function DatePicker({
  size,
  value,
  onChange,
  format = 'DD/MM/YYYY',
  placeholder,
  currentDate = false,
  datePickerAlign = 'start',
  fromDate,
  clearable,
  ...props
}: DatePickerProps) {
  const id = useId()
  const [date, setDate] = useState<Date | undefined>(value ? dayjs(value).toDate() : undefined)

  const setDateValue: SelectSingleEventHandler = (date) => {
    setDate(date)
    onChange?.(date ? dayjs(date).toDate() : undefined)
  }

  useEffect(() => {
    if (value) {
      setDate(dayjs(value).toDate())
    }
  }, [value])

  const button = (
    <div className="relative">
      <Button
        {...(props as HTMLAttributes<HTMLButtonElement>)}
        id={id}
        variant={'outline'}
        className={cn(datePickerVariants({ size }), !date && 'text-neutral-grey-300', props.className)}
      >
        <CalendarIcon className="shrink-0 transition-colors !size-5 ml-auto text-neutral-grey-300" aria-hidden="true" />
        <span className={cn('truncate', !date && 'text-muted-foreground')}>
          {currentDate && appDayJs().isSame(date, 'D') ? 'Hôm nay, ' : ''}
          {date ? dayjs(date).format(format) : placeholder}
        </span>
      </Button>
      {clearable && date && (
        <XIcon
          className="text-neutral-grey-400 absolute top-1/2 -translate-y-1/2 right-[6px] hover:cursor-pointer size-5"
          onClick={() => {
            setDate(undefined)
            onChange?.(undefined)
          }}
        />
      )}
    </div>
  )

  return props.disabled ? (
    button
  ) : (
    <Popover>
      <PopoverTrigger asChild>{button}</PopoverTrigger>
      <PopoverContent className="w-auto p-2" align={datePickerAlign}>
        <Calendar mode="single" selected={date} onSelect={setDateValue} fromDate={fromDate} />
      </PopoverContent>
    </Popover>
  )
}
