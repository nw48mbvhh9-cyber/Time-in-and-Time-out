import React, { useState } from 'react';
import { X, Save, RotateCcw } from 'lucide-react';
import { TimeSelector } from './TimeSelector';
import { TimeState } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTimeIn: TimeState;
  defaultTimeOut: TimeState;
  onSave: (newIn: TimeState, newOut: TimeState) => void;
}

const DEFAULT_IN_RESET: TimeState = { hour: 8, minute: 30, period: 'AM' };
const DEFAULT_OUT_RESET: TimeState = { hour: 6, minute: 30, period: 'PM' };

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  defaultTimeIn,
  defaultTimeOut,
  onSave,
}) => {
  const [localIn, setLocalIn] = useState<TimeState>(defaultTimeIn);
  const [localOut, setLocalOut] = useState<TimeState>(defaultTimeOut);

  if (!isOpen) return null;

  const handleReset = () => {
    setLocalIn(DEFAULT_IN_RESET);
    setLocalOut(DEFAULT_OUT_RESET);
  };

  const handleSave = () => {
    onSave(localIn, localOut);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
          <h2 className="text-lg font-bold text-slate-800">Default Settings</h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-8">
            <div className="bg-blue-50 text-blue-800 text-sm p-4 rounded-xl">
                Set your standard working hours (e.g. UAE Standard Time). These values will be used as the default for new days.
            </div>

          {/* Time In Setting */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">
              Default Time In
            </label>
            <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                <TimeSelector time={localIn} onChange={setLocalIn} />
            </div>
          </div>

          {/* Time Out Setting */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">
              Default Time Out
            </label>
            <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                <TimeSelector time={localOut} onChange={setLocalOut} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex gap-3">
          <button
            onClick={handleReset}
            className="flex-1 py-3 px-4 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-white hover:border-slate-300 transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw size={18} />
            Reset
          </button>
          <button
            onClick={handleSave}
            className="flex-[2] py-3 px-4 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20"
          >
            <Save size={18} />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
