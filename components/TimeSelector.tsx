import React from 'react';
import { WheelPicker } from './WheelPicker';
import { TimeState } from '../types';

interface TimeSelectorProps {
  time: TimeState;
  onChange: (time: TimeState) => void;
}

export const TimeSelector: React.FC<TimeSelectorProps> = ({ time, onChange }) => {
  // Hours 1-12
  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  // Minutes 00-59
  const minutes = Array.from({ length: 60 }, (_, i) => i);
  // Periods
  const periods = ['AM', 'PM'];

  const handleHourChange = (val: string | number) => {
    onChange({ ...time, hour: Number(val) });
  };

  const handleMinuteChange = (val: string | number) => {
    onChange({ ...time, minute: Number(val) });
  };

  const handlePeriodChange = (val: string | number) => {
    onChange({ ...time, period: val as 'AM' | 'PM' });
  };

  // Format minutes for display (e.g., 0 -> "00")
  const minuteStrings = minutes.map(m => m.toString().padStart(2, '0'));
  const currentMinuteString = time.minute.toString().padStart(2, '0');

  return (
    <div className="flex justify-center items-center gap-2 bg-white rounded-xl p-4 shadow-sm border border-slate-100">
      <WheelPicker items={hours} value={time.hour} onChange={handleHourChange} width="w-14" />
      <div className="font-bold text-slate-300 pb-1">:</div>
      <WheelPicker items={minuteStrings} value={currentMinuteString} onChange={(v) => handleMinuteChange(Number(v))} width="w-14" />
      <div className="w-2"></div>
      <WheelPicker items={periods} value={time.period} onChange={handlePeriodChange} width="w-16" />
    </div>
  );
};
