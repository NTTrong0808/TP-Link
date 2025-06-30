'use client'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/tw'
import { appDayJs } from '@/utils/dayjs'
import { vi } from 'date-fns/locale'
import dayjs from 'dayjs'
import { Calendar as CalendarIcon, ChevronDownIcon } from 'lucide-react'
import * as React from 'react'
import { useRef } from 'react'
import { DateRange } from 'react-day-picker'
import { useUpdateEffect } from 'react-use'
import { Input } from './input'

interface DateRangePickerProps {
  className?: string
  from?: Date
  to?: Date
  onSelect: (range: DateRange | undefined) => void

  showIcon?: boolean

  presetRanges?: PresetRange[]
  openIcon?: boolean
  placeholder?: string
  disabled?: boolean
  loading?: boolean
}

interface PresetRange {
  label: string
  range: DateRange
}

const DATE_FORMATS = [
  'DD/MM/YYYY',
  'DD-MM-YYYY',
  'DD.MM.YYYY',
  'YYYY-MM-DD',
  'YYYY/MM/DD',
  'YYYY.MM.DD',
  'YYYYMMDD',
  'DDMMYYYY',
]

const presetRanges = [
  {
    label: 'Hôm nay',
    range: {
      from: appDayJs().startOf('day').toDate(),
      to: appDayJs().endOf('day').toDate(),
    },
  },
  {
    label: 'Hôm qua',
    range: {
      from: appDayJs().subtract(1, 'day').startOf('day').toDate(),
      to: appDayJs().subtract(1, 'day').endOf('day').toDate(),
    },
  },
  {
    label: '7 ngày qua',
    range: {
      from: appDayJs().subtract(6, 'day').startOf('day').toDate(),
      to: appDayJs().endOf('day').toDate(),
    },
  },
  {
    label: '30 ngày qua',
    range: {
      from: appDayJs().subtract(29, 'day').startOf('day').toDate(),
      to: appDayJs().endOf('day').toDate(),
    },
  },
  {
    label: 'Tháng này',
    range: {
      from: appDayJs().startOf('month').toDate(),
      to: appDayJs().endOf('month').toDate(),
    },
  },
  {
    label: 'Tháng trước',
    range: {
      from: appDayJs().subtract(1, 'month').startOf('month').toDate(),
      to: appDayJs().subtract(1, 'month').endOf('month').toDate(),
    },
  },
]

export function DateRangePicker({
  className,
  from,
  to,
  onSelect,
  showIcon = true,
  openIcon = true,
  placeholder,
  disabled,
  loading,
}: DateRangePickerProps) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from,
    to,
  })

  const inputFromRef = useRef<HTMLInputElement>(null)
  const inputToRef = useRef<HTMLInputElement>(null)

  useUpdateEffect(() => {
    if (inputFromRef.current) {
      if (date?.from && appDayJs(date?.from).isValid()) {
        inputFromRef.current.value = appDayJs(date?.from).format('DD/MM/YYYY')
      } else {
        inputFromRef.current.value = ''
      }
    }

    if (inputToRef.current) {
      if (date?.to && appDayJs(date?.to).isValid()) {
        inputToRef.current.value = appDayJs(date?.to).format('DD/MM/YYYY')
      } else {
        inputToRef.current.value = ''
      }
    }
  }, [date])

  // useUpdateEffect(() => {
  //   if (from && appDayJs(from).isValid() && to && appDayJs(to).isValid()) {
  //     setDate({
  //       from: appDayJs(from).toDate(),
  //       to: appDayJs(to).toDate(),
  //     })
  //   } else {
  //     setDate(undefined)
  //   }

  //   if (from && appDayJs(from).isValid()) {
  //     setDate((prev) => ({
  //       ...prev,
  //       from: appDayJs(from).toDate(),
  //     }))
  //   } else if (to && appDayJs(to).isValid()) {
  //     setDate((prev) => ({
  //       from: prev?.from || from,
  //       to: appDayJs(to).toDate(),
  //     }))
  //   }
  // }, [from, to])

  const button = (
    <Button
      id="date"
      variant={'outline'}
      className={cn(
        'max-w-[300px] w-fit justify-start text-left font-normal border border-low bg-neutral-white',
        !date && 'text-muted-foreground',
      )}
      disabled={disabled || loading}
      loading={loading}
    >
      {showIcon && <CalendarIcon className="mr-2 size-4" />}
      {date?.from ? (
        date.to ? (
          <>
            {dayjs(date.from).format('DD/MM/YYYY')} - {dayjs(date.to).format('DD/MM/YYYY')}
          </>
        ) : (
          dayjs(date.from).format('DD/MM/YYYY')
        )
      ) : (
        <span>{placeholder ? placeholder : 'Pick a date'}</span>
      )}
      {openIcon && <ChevronDownIcon className="!w-6 !h-6" />}
    </Button>
  )

  if (disabled) return button

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>{button}</PopoverTrigger>
        <PopoverContent
          className="w-auto p-0 flex flex-col sm:flex-row max-h-[calc(100dvh-210px)] overflow-y-auto"
          align="start"
        >
          <div className="flex flex-col border-r min-w-[160px]">
            {presetRanges.map((preset) => (
              <Button
                key={preset.label}
                variant="ghost"
                className={cn(
                  'py-3 border-b rounded-none justify-start',
                  dayjs(preset.range.from).isSame(date?.from, 'day') &&
                    dayjs(preset.range.to).isSame(date?.to, 'day') &&
                    '!text-primary',
                )}
                onClick={() => {
                  setDate(preset.range)
                  onSelect(preset.range)
                }}
              >
                {preset.label}
              </Button>
            ))}
          </div>
          <div>
            <div className="flex flex-col sm:flex-row gap-4 px-4 pt-4">
              <Input
                className="flex-1 text-center"
                defaultValue={appDayJs(date?.from).format('DD/MM/YYYY')}
                placeholder="Từ ngày DD/MM/YYYY"
                onChange={(e) => {
                  const newDate = appDayJs(e.target.value, DATE_FORMATS)
                  if (newDate.isValid()) {
                    setDate((prev) => ({
                      ...prev,
                      from: newDate.toDate(),
                    }))
                    onSelect?.({
                      from: newDate.toDate(),
                      to: date?.to || to,
                    })
                  }
                }}
                ref={inputFromRef}
              />
              <Input
                className="flex-1 text-center"
                defaultValue={appDayJs(date?.to).format('DD/MM/YYYY')}
                placeholder="Đến ngày DD/MM/YYYY"
                onChange={(e) => {
                  const newDate = appDayJs(e.target.value, DATE_FORMATS)
                  if (newDate.isValid()) {
                    setDate((prev) => ({
                      from: prev?.from || from,
                      to: newDate.toDate(),
                    }))
                    onSelect?.({
                      from: date?.from || from,
                      to: newDate.toDate(),
                    })
                  }
                }}
                ref={inputToRef}
              />
            </div>
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={(range) => {
                setDate(range)
                onSelect(range)
              }}
              captionLayout="dropdown-buttons"
              fromYear={2021}
              toYear={appDayJs().year()}
              numberOfMonths={2}
              classNames={{
                nav: 'space-x-1 flex items-center justify-between relative w-full',
                nav_button: 'w-7 bg-transparent p-0 opacity-50 hover:opacity-100 [&_svg]:!h-6 [&_svg]:!w-6',
                nav_button_variant: 'ghost',

                months: cn(
                  '[&>:nth-child(odd)>div>div>div.select-year]:hidden',
                  '[&>:nth-child(odd)>div>div>div.select-month]:text-end',
                  '[&>:nth-child(odd)>div>div>div.select-month>select]:text-end',
                  '[&>:nth-child(even)>div>div>div.select-month]:hidden',
                ),

                caption: 'flex flex-col-reverse',
                nav_button_previous: '-top-1',
                nav_button_next: '-top-1',

                dropdown_icon: 'hidden',
                caption_dropdowns: 'flex flex-col-reverse w-full gap-6',
                dropdown_month: '[&>span]:hidden [&>div]:hidden w-full text-sm font-medium select-month',
                dropdown_year: '[&>span]:hidden [&>div]:hidden w-full text-sm font-medium select-year',

                head_cell: 'text-neutral-grey-300 rounded-md w-8 font-normal text-xs font-medium',
                cell: 'relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-green-50 [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-start)]:rounded-l-2xl [&:has([aria-selected].day-range-end)]:rounded-r-2xl',

                day_selected: 'aria-selected:bg-green-50 aria-selected:text-green-500',
                day_today: 'hover:text-green-500 rounded-2xl border border-1 border-green-500 underline',
                day_outside: 'aria-selected:bg-neutral-grey-50 aria-selected:text-green-500 aria-selected:rounded-none',
              }}
              locale={vi}
              formatters={{
                formatCaption: (date) => (
                  <span className="capitalize text-xs font-medium text-neutral-grey-400">
                    {appDayJs(date).localeData().months()[appDayJs(date).month()]}
                  </span>
                ),
                formatWeekdayName: (date) => (
                  <span className="text-xs font-medium text-neutral-grey-300">
                    {appDayJs(date).locale('en').localeData().weekdaysShort()[appDayJs(date).day()]}
                  </span>
                ),
              }}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
