import React from 'react';
import { LocationType } from '../types';

interface SegmentedControlProps {
  options: LocationType[];
  value: LocationType;
  onChange: (value: LocationType) => void;
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({ options, value, onChange }) => {
  return (
    <div className="flex p-1 bg-slate-100 rounded-lg">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
            value === option
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
};
