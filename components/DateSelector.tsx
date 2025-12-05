import React, { useMemo } from 'react';
import { WheelPicker } from './WheelPicker';
import { getDaysInMonth, MONTH_NAMES } from '../utils';

interface DateSelectorProps {
  date: Date;
  onChange: (newDate: Date) => void;
}

export const DateSelector: React.FC<DateSelectorProps> = ({ date, onChange }) => {
  const year = date.getFullYear();
  const month = date.getMonth(); // 0-11
  const day = date.getDate();

  // Generate ranges
  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);
  }, []);
  
  const daysInMonth = getDaysInMonth(year, month);
  const days = useMemo(() => Array.from({ length: daysInMonth }, (_, i) => i + 1), [daysInMonth]);

  const handleYearChange = (val: string | number) => {
    const newYear = Number(val);
    // Adjust day if needed (e.g. going from Leap year Feb 29 to non-leap)
    const maxDay = getDaysInMonth(newYear, month);
    const newDay = Math.min(day, maxDay);
    onChange(new Date(newYear, month, newDay));
  };

  const handleMonthChange = (val: string | number) => {
    const newMonthIndex = MONTH_NAMES.indexOf(String(val));
    if (newMonthIndex === -1) return;
    
    // Adjust day if needed (e.g. Jan 31 -> Feb 28)
    const maxDay = getDaysInMonth(year, newMonthIndex);
    const newDay = Math.min(day, maxDay);
    onChange(new Date(year, newMonthIndex, newDay));
  };

  const handleDayChange = (val: string | number) => {
    onChange(new Date(year, month, Number(val)));
  };

  return (
    <div className="flex justify-center items-center gap-2 bg-white rounded-xl p-4 shadow-sm border border-slate-100">
      <WheelPicker 
        items={MONTH_NAMES} 
        value={MONTH_NAMES[month]} 
        onChange={handleMonthChange} 
        width="w-20" 
      />
      <WheelPicker 
        items={days} 
        value={day} 
        onChange={handleDayChange} 
        width="w-16" 
      />
      <WheelPicker 
        items={years} 
        value={year} 
        onChange={handleYearChange} 
        width="w-20" 
      />
    </div>
  );
};
