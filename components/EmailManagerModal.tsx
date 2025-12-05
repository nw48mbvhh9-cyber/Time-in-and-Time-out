import React, { useState } from 'react';
import { X, Plus, Trash2, Users } from 'lucide-react';

interface EmailManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  toEmails: string[];
  setToEmails: (emails: string[]) => void;
  ccEmails: string[];
  setCcEmails: (emails: string[]) => void;
}

export const EmailManagerModal: React.FC<EmailManagerModalProps> = ({
  isOpen,
  onClose,
  toEmails,
  setToEmails,
  ccEmails,
  setCcEmails,
}) => {
  const [newTo, setNewTo] = useState('');
  const [newCc, setNewCc] = useState('');

  if (!isOpen) return null;

  const handleAddTo = () => {
    if (newTo.trim() && !toEmails.includes(newTo.trim())) {
      setToEmails([...toEmails, newTo.trim()]);
      setNewTo('');
    }
  };

  const handleRemoveTo = (email: string) => {
    setToEmails(toEmails.filter((e) => e !== email));
  };

  const handleAddCc = () => {
    if (newCc.trim() && !ccEmails.includes(newCc.trim())) {
      setCcEmails([...ccEmails, newCc.trim()]);
      setNewCc('');
    }
  };

  const handleRemoveCc = (email: string) => {
    setCcEmails(ccEmails.filter((e) => e !== email));
  };

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter') {
      action();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Users size={20} className="text-blue-500" />
            Email Recipients
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-8">
          
          {/* TO Section */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-700 uppercase tracking-wide flex items-center gap-2">
              To <span className="text-xs font-normal text-slate-400 normal-case">(Primary Recipients)</span>
            </label>
            
            <div className="flex gap-2">
              <input
                type="email"
                value={newTo}
                onChange={(e) => setNewTo(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, handleAddTo)}
                placeholder="Enter email address"
                className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
              <button
                onClick={handleAddTo}
                className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors"
              >
                <Plus size={24} />
              </button>
            </div>

            <div className="space-y-2">
              {toEmails.length === 0 && (
                <p className="text-sm text-slate-400 italic">No recipients added.</p>
              )}
              {toEmails.map((email) => (
                <div key={email} className="flex items-center justify-between bg-slate-50 border border-slate-100 px-3 py-2 rounded-lg group">
                  <span className="text-slate-700 text-sm">{email}</span>
                  <button
                    onClick={() => handleRemoveTo(email)}
                    className="text-slate-400 hover:text-red-500 transition-colors p-1"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-100"></div>

          {/* CC Section */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-700 uppercase tracking-wide flex items-center gap-2">
              Cc <span className="text-xs font-normal text-slate-400 normal-case">(Carbon Copy)</span>
            </label>
            
            <div className="flex gap-2">
              <input
                type="email"
                value={newCc}
                onChange={(e) => setNewCc(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, handleAddCc)}
                placeholder="Enter email address"
                className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
              <button
                onClick={handleAddCc}
                className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors"
              >
                <Plus size={24} />
              </button>
            </div>

            <div className="space-y-2">
              {ccEmails.length === 0 && (
                <p className="text-sm text-slate-400 italic">No CC recipients added.</p>
              )}
              {ccEmails.map((email) => (
                <div key={email} className="flex items-center justify-between bg-slate-50 border border-slate-100 px-3 py-2 rounded-lg group">
                  <span className="text-slate-700 text-sm">{email}</span>
                  <button
                    onClick={() => handleRemoveCc(email)}
                    className="text-slate-400 hover:text-red-500 transition-colors p-1"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50">
          <button
            onClick={onClose}
            className="w-full py-3 px-4 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
