import React from 'react';
import { Calendar, MapPin, Clock, Building2 } from 'lucide-react';
import { TimeSelector } from './TimeSelector';
import { SegmentedControl } from './SegmentedControl';
import { formatDate, formatISODate } from '../utils';
import { TimeState, LocationType } from '../types';

interface DaySectionProps {
  title: string;
  subtitle: string;
  date: Date;
  onDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  location: LocationType;
  onLocationChange: (l: LocationType) => void;
  clientName: string;
  onClientNameChange: (val: string) => void;
  time: TimeState;
  onTimeChange: (t: TimeState) => void;
  timeLabel: string;
  iconColor: string;
}

export const DaySection: React.FC<DaySectionProps> = ({
  title,
  subtitle,
  date,
  onDateChange,
  location,
  onLocationChange,
  clientName,
  onClientNameChange,
  time,
  onTimeChange,
  timeLabel,
  iconColor
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-6">
      {/* Header */}
      <div className="bg-slate-50/50 p-4 border-b border-slate-100 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <span className={`w-2 h-8 rounded-full ${iconColor}`}></span>
            {title}
          </h2>
          <p className="text-xs text-slate-500 pl-4">{subtitle}</p>
        </div>
        
        {/* Right Side: Date Display & Native Picker Trigger */}
        <div className="flex items-center gap-3">
            <div className="text-sm font-medium text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-full shadow-sm">
                {formatDate(date)}
            </div>

            {/* Native Calendar Trigger */}
            <div 
                className="relative text-blue-500 hover:text-blue-700 hover:bg-blue-50 p-2 rounded-full transition-colors cursor-pointer"
                title="Change Date"
            >
                <Calendar size={20} />
                 <input
                    type="date"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    value={formatISODate(date)}
                    onChange={onDateChange}
                    aria-label={`Change ${title} date`}
                 />
            </div>
        </div>
      </div>

      <div className="p-5 space-y-6">
        {/* Location */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <MapPin size={12} />
            Location
          </label>
          <SegmentedControl
            options={['Office', 'Client']}
            value={location}
            onChange={onLocationChange}
          />
        </div>

        {/* Client Name Input */}
        {location === 'Client' && (
          <div className="space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
            <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <Building2 size={12} />
              Client Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => onClientNameChange(e.target.value)}
              placeholder="Enter client name"
              className={`w-full px-4 py-3 bg-slate-50 border rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all ${
                !clientName.trim() ? 'border-amber-300 focus:border-amber-500' : 'border-slate-200 focus:border-blue-500'
              }`}
            />
          </div>
        )}

        {/* Time Picker */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
             <Clock size={12} />
             {timeLabel}
          </label>
          <TimeSelector time={time} onChange={onTimeChange} />
        </div>
      </div>
    </div>
  );
};
