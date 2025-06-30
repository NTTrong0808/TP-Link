import { cn } from '@/lib/tw'
import { useState } from 'react'
import { startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns'
import CaretLeftIcon from '@/components/widgets/icons/caret-left-icon'

type Props = {
  onChangeDates: (days: string[]) => void
}

const YearCalendar = ({ onChangeDates }: Props) => {
  const [choosenMonth, setChoosenMonth] = useState<number | null>(null)

  const handleChooseMonth = (month: number | null) => {
    setChoosenMonth(month)
    onChangeDates([])
  }

  const onChangeMonthDays = (days: number[]) => {
    onChangeDates(
      days.map(
        (day) =>
          `${day.toString().length === 1 ? `0${day}` : day}/${choosenMonth?.toString()?.length == 1 ? `0${choosenMonth}` : choosenMonth}`,
      ),
    )
  }

  return (
    <div className="flex flex-col gap-1">
      {!choosenMonth && (
        <div className="grid grid-cols-3 gap-1 w-full">
          {['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'].map((month, index) => (
            <span
              key={`Month-${month}`}
              onClick={() => handleChooseMonth(index + 1)}
              className={cn(
                'w-full h-9 flex items-center justify-center rounded-md border border-gray-300 bg-gray-50 font-medium text-sm cursor-pointer transition-all duration-200',
                choosenMonth === index + 1 && 'border-green-500 bg-green-100 text-green-700',
              )}
            >
              {month}
            </span>
          ))}
        </div>
      )}

      {choosenMonth && (
        <div
          onClick={() => handleChooseMonth(null)}
          className="flex items-center gap-1 text-sm font-medium mb-1 hover:cursor-pointer w-fit"
        >
          <CaretLeftIcon className="[&_path]:stroke-[2px] [&_path]:stroke-[#616161]" />
          Tháng {choosenMonth}
        </div>
      )}
      {choosenMonth && <MonthCalendar month={choosenMonth} onChangeMonthDays={onChangeMonthDays} />}
    </div>
  )
}

const MonthCalendar = ({
  month,
  onChangeMonthDays,
}: {
  month: number
  onChangeMonthDays: (days: number[]) => void
}) => {
  const [choosenDays, setChoosenDays] = useState<number[]>([])
  const currentYear = new Date().getFullYear()
  const firstDayOfMonth = startOfMonth(new Date(currentYear, month - 1))
  const lastDayOfMonth = endOfMonth(new Date(currentYear, month - 1))
  const days = eachDayOfInterval({
    start: firstDayOfMonth,
    end: lastDayOfMonth,
  })

  const handleChooseDay = (day: number) => {
    setChoosenDays((state) => {
      if (state.includes(day)) {
        onChangeMonthDays(state.filter((e) => e !== day))
        return state.filter((e) => e !== day)
      }
      onChangeMonthDays([...state, day])
      return [...state, day]
    })
  }

  return (
    <div className="grid grid-cols-7 gap-1">
      {days.map((date) => (
        <span
          key={date.getDate()}
          onClick={() => handleChooseDay(date.getDate())}
          className={cn(
            'w-9 h-9 flex items-center justify-center rounded-md border border-gray-300 bg-gray-50 font-medium text-sm cursor-pointer transition-all duration-200',
            choosenDays.includes(date.getDate()) && 'border-green-500 bg-green-100 text-green-700',
          )}
        >
          {date.getDate()}
        </span>
      ))}
    </div>
  )
}

export default YearCalendar
