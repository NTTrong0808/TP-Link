'use client'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { inputVariants } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import CalendarIcon from '@/components/widgets/icons/calendar-icon'
import { cn } from '@/lib/tw'
import { appDayJs } from '@/utils/dayjs'
import { PopoverContentProps } from '@radix-ui/react-popover'
import { XIcon } from 'lucide-react'
import { ComponentProps, forwardRef, HTMLAttributes, useEffect, useId, useImperativeHandle, useState } from 'react'
import { SelectSingleEventHandler } from 'react-day-picker'
import { tv, VariantProps } from 'tailwind-variants'

export const datePickerVariants = tv({
  extend: inputVariants,
  base: ['group justify-start'],
})

export interface FilterDateProps {
  clearFilters: () => void
}

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

export const DatePicker = forwardRef<FilterDateProps, DatePickerProps>(
  (
    {
      size,
      value,
      onChange,
      format = 'DD/MM/YYYY',
      placeholder,
      currentDate = false,
      datePickerAlign = 'start',
      fromDate,
      clearable,
      defaultValue,
      ...props
    },
    ref,
  ) => {
    const id = useId()
    const [date, setDate] = useState<Date | undefined>(
      value ? appDayJs(value).toDate() : defaultValue ? appDayJs(defaultValue as any).toDate() : undefined,
    )

    const setDateValue: SelectSingleEventHandler = (date) => {
      setDate(date)
      onChange?.(date ? appDayJs(date).toDate() : undefined)
    }

    const clearFilters = () => {
      setDate(undefined)
      onChange?.(null)
    }

    useImperativeHandle(ref, () => ({ clearFilters }))

    const button = (
      <div className="relative w-full">
        <Button
          {...(props as HTMLAttributes<HTMLButtonElement>)}
          id={id}
          variant="outline"
          className={cn(
            datePickerVariants({ size }),
            'h-8 !border-none !outline-none w-full rounded-l-[0px] rounded-r-sm hover:bg-white',
          )}
        >
          <span className={cn('truncate')}>
            {currentDate && appDayJs().isSame(date, 'D') ? 'Hôm nay, ' : ''}
            {date ? appDayJs(date).format(format) : placeholder}
          </span>

          <CalendarIcon
            className="shrink-0 transition-colors size-5 ml-auto text-neutral-grey-300"
            aria-hidden="true"
          />
          {clearable && date && <div className="w-[10px]" />}
        </Button>
        {clearable && date && (
          <XIcon
            className="text-neutral-grey-400 absolute top-1/2 -translate-y-1/2 right-[6px] hover:cursor-pointer size-5"
            onClick={() => {
              setDate(undefined)
              onChange?.(null)
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
  },
)

DatePicker.displayName = 'DatePicker'
