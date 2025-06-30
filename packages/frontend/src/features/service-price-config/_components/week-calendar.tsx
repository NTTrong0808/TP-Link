import { cn } from '@/lib/tw';
import { useState } from 'react';

type Props = {
  onChangeWeekDays: (days: string[]) => void;
};

const options = [
  { label: 'T2', value: 'Mon' },
  { label: 'T3', value: 'Tue' },
  { label: 'T4', value: 'Wed' },
  { label: 'T5', value: 'Thu' },
  { label: 'T6', value: 'Fri' },
  { label: 'T7', value: 'Sat' },
  { label: 'CN', value: 'Sun' },
];

const WeekCalendar = ({ onChangeWeekDays }: Props) => {
  const [choosenDays, setChoosenDays] = useState<string[]>([]);

  const handleChooseDay = (day: string) => {
    setChoosenDays((state) => {
      if (state.includes(day)) {
        onChangeWeekDays(state.filter((e) => e !== day));
        return state.filter((e) => e !== day);
      }
      onChangeWeekDays([...state, day]);
      return [...state, day];
    });
  };

  return (
    <div className='grid grid-cols-7 gap-1'>
      {options.map((day) => (
        <span
          key={day.value}
          onClick={() => handleChooseDay(day.value)}
          className={cn(
            'w-9 h-9 flex items-center justify-center rounded-md border border-gray-300 bg-gray-50 font-medium text-sm cursor-pointer transition-all duration-200',
            choosenDays.includes(day.value) &&
              'border-green-500 bg-green-100 text-green-700'
          )}
        >
          {day.label}
        </span>
      ))}
    </div>
  );
};

export default WeekCalendar;
