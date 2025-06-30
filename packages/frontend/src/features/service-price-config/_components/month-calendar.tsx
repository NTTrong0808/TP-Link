import { cn } from '@/lib/tw';
import { useState } from 'react';

type Props = {
  onChangeMonthDays: (days: string[]) => void;
};

const MonthCalendar = ({ onChangeMonthDays }: Props) => {
  const [choosenDays, setChoosenDays] = useState<number[]>([]);
  const days = new Array(31).fill(0).map((_, index) => index + 1);

  const handleChooseDay = (day: number) => {
    setChoosenDays((state) => {
      if (state.includes(day)) {
        const _days = state.filter((e) => e !== day);
        onChangeMonthDays(
          [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].reduce(
            (arr: string[], month) => [
              ...arr,
              ..._days.map(
                (day) =>
                  `${day.toString().length === 1 ? `0${day}` : day}/${month.toString().length === 1 ? `0${month}` : month}`
              ),
            ],
            []
          )
        );
        return state.filter((e) => e !== day);
      }
      const _days = [...state, day];

      onChangeMonthDays(
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].reduce(
          (arr: string[], month) => [
            ...arr,
            ..._days.map(
              (day) =>
                `${day.toString().length === 1 ? `0${day}` : day}/${month.toString().length === 1 ? `0${month}` : month}`
            ),
          ],
          []
        )
      );
      return [...state, day];
    });
  };

  return (
    <div className='flex w-full flex-col gap-1'>
      <div className='grid grid-cols-7 gap-1'>
        {days.map((day) => (
          <span
            key={`day-${day}`}
            onClick={() => handleChooseDay(day)}
            className={cn(
              'w-9 h-9 flex items-center justify-center rounded-md border border-gray-300 bg-gray-50 font-medium text-sm cursor-pointer transition-all duration-200',
              choosenDays.includes(day) &&
                'border-green-500 bg-green-100 text-green-700'
            )}
          >
            {day}
          </span>
        ))}
      </div>
      <p className='text-xs text-[#616161]'>
        Ngày <b>31</b> chỉ có trong tháng <b>1,3,5,7,8,10,12</b>
      </p>
    </div>
  );
};

export default MonthCalendar;
