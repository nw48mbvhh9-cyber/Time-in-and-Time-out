import React, { useState, useEffect } from 'react';
import { SettingsModal } from './components/SettingsModal';
import { EmailManagerModal } from './components/EmailManagerModal';
import { DaySection } from './components/DaySection';
import { 
  formatNumericDate,
  getPreviousWorkingDay, 
  formatTime, 
  parseISODate,
  isWeekend
} from './utils';
import { TimeState, LocationType } from './types';
import { Send, Settings, Users } from 'lucide-react';

const STORAGE_KEY_IN = 'attendance_default_in_v3';
const STORAGE_KEY_OUT = 'attendance_default_out_v3';
const STORAGE_KEY_TO_EMAILS = 'attendance_to_emails';
const STORAGE_KEY_CC_EMAILS = 'attendance_cc_emails';

// Default Defaults (UAE Standard Time)
const DEFAULT_IN_FALLBACK: TimeState = { hour: 8, minute: 30, period: 'AM' };
const DEFAULT_OUT_FALLBACK: TimeState = { hour: 6, minute: 30, period: 'PM' };

const loadSavedTime = (key: string, fallback: TimeState): TimeState => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch (e) {
    return fallback;
  }
};

const loadSavedEmails = (key: string): string[] => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
};

const App: React.FC = () => {
  // --- Global Settings State ---
  const [showSettings, setShowSettings] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  
  // Load defaults from storage or fallback
  const [defaultTimeIn, setDefaultTimeIn] = useState<TimeState>(() => loadSavedTime(STORAGE_KEY_IN, DEFAULT_IN_FALLBACK));
  const [defaultTimeOut, setDefaultTimeOut] = useState<TimeState>(() => loadSavedTime(STORAGE_KEY_OUT, DEFAULT_OUT_FALLBACK));

  // Email Lists
  const [toEmails, setToEmails] = useState<string[]>(() => loadSavedEmails(STORAGE_KEY_TO_EMAILS));
  const [ccEmails, setCcEmails] = useState<string[]>(() => loadSavedEmails(STORAGE_KEY_CC_EMAILS));

  // --- State for Current Session (Time In) ---
  const [todayDate, setTodayDate] = useState<Date>(new Date());
  const [todayLocation, setTodayLocation] = useState<LocationType>('Office');
  const [todayClientName, setTodayClientName] = useState<string>('');
  const [todayTime, setTodayTime] = useState<TimeState>(defaultTimeIn);

  // --- State for Last Session (Time Out) ---
  const [yesterdayDate, setYesterdayDate] = useState<Date>(getPreviousWorkingDay(new Date()));
  const [yesterdayLocation, setYesterdayLocation] = useState<LocationType>('Office');
  const [yesterdayClientName, setYesterdayClientName] = useState<string>('');
  const [yesterdayTime, setYesterdayTime] = useState<TimeState>(defaultTimeOut);

  // Auto-update yesterday when today changes
  useEffect(() => {
    const newPrevDay = getPreviousWorkingDay(todayDate);
    setYesterdayDate(newPrevDay);
  }, [todayDate]);

  // Persist Email Lists
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_TO_EMAILS, JSON.stringify(toEmails));
  }, [toEmails]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CC_EMAILS, JSON.stringify(ccEmails));
  }, [ccEmails]);

  // Handler for Saving Settings
  const handleSaveSettings = (newIn: TimeState, newOut: TimeState) => {
    setDefaultTimeIn(newIn);
    setDefaultTimeOut(newOut);
    localStorage.setItem(STORAGE_KEY_IN, JSON.stringify(newIn));
    localStorage.setItem(STORAGE_KEY_OUT, JSON.stringify(newOut));
    
    // Update current view to match new defaults immediately
    setTodayTime(newIn);
    setYesterdayTime(newOut);
  };

  // Handlers for Native Date Input
  const handleTodayDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) setTodayDate(parseISODate(e.target.value));
  };

  const handleYesterdayDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) setYesterdayDate(parseISODate(e.target.value));
  };

  const formatLocationString = (location: LocationType, clientName: string) => {
    if (location === 'Client' && clientName.trim()) {
      return `Client: ${clientName}`;
    }
    return location;
  };

  const handleSendEmail = () => {
    // Validation
    if (todayLocation === 'Client' && !todayClientName.trim()) {
      alert("Please enter the Client Name for Current Session.");
      return;
    }
    if (yesterdayLocation === 'Client' && !yesterdayClientName.trim()) {
      alert("Please enter the Client Name for Last Session.");
      return;
    }

    if (toEmails.length === 0) {
        if(!confirm("You haven't configured any 'To' recipients. Do you want to continue with a blank recipient?")) {
            setShowEmailModal(true);
            return;
        }
    }

    // Use Numeric Date for subject and body as requested
    const subject = `Daily Attendance - ${formatNumericDate(todayDate)}`;
    
    // Constructing the body
    const todayLocStr = formatLocationString(todayLocation, todayClientName);
    const yesterdayLocStr = formatLocationString(yesterdayLocation, yesterdayClientName);

    const body = 
`Hi Team,

I hope you are doing well.

Please find the office or client office check in and check out timings

Current working day :-
Date: ${formatNumericDate(todayDate)}
Time In: ${formatTime(todayTime.hour, todayTime.minute, todayTime.period)} (${todayLocStr})

Last working day:-
Date: ${formatNumericDate(yesterdayDate)}
Time Out: ${formatTime(yesterdayTime.hour, yesterdayTime.minute, yesterdayTime.period)} (${yesterdayLocStr})

Let me know if you need any further information`;

    // Construct mailto link
    const to = toEmails.join(',');
    const cc = ccEmails.join(',');
    
    // Note: mailto supports multiple emails comma-separated
    let mailtoLink = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    if (cc) {
        mailtoLink += `&cc=${cc}`;
    }

    // Try to open mailto
    window.location.href = mailtoLink;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col max-w-lg mx-auto shadow-2xl shadow-slate-200">
      
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
          Attendance
        </h1>
        
        <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowEmailModal(true)}
              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all"
              title="Manage Recipients"
            >
              <Users size={22} />
            </button>
            <button 
              onClick={() => setShowSettings(true)}
              className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-all"
              title="Settings"
            >
              <Settings size={22} />
            </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-4 pb-32 space-y-6">
        
        {/* Section 1: Current Session */}
        <DaySection
          title="Current Session"
          subtitle="Start of the day"
          date={todayDate}
          onDateChange={handleTodayDateChange}
          location={todayLocation}
          onLocationChange={setTodayLocation}
          clientName={todayClientName}
          onClientNameChange={setTodayClientName}
          time={todayTime}
          onTimeChange={setTodayTime}
          timeLabel="Time In"
          iconColor="bg-indigo-500"
        />

        {/* Section 2: Last Session */}
        <DaySection
          title="Last Session"
          subtitle="End of previous working day"
          date={yesterdayDate}
          onDateChange={handleYesterdayDateChange}
          location={yesterdayLocation}
          onLocationChange={setYesterdayLocation}
          clientName={yesterdayClientName}
          onClientNameChange={setYesterdayClientName}
          time={yesterdayTime}
          onTimeChange={setYesterdayTime}
          timeLabel="Time Out"
          iconColor="bg-teal-500"
        />

        {/* Warning if Yesterday is weekend (Manual Override check) */}
        {isWeekend(yesterdayDate) && (
          <div className="bg-amber-50 text-amber-800 text-sm px-4 py-3 rounded-lg border border-amber-200">
            <strong>Note:</strong> The selected "Last Session" date is a weekend.
          </div>
        )}
      </main>

      {/* Settings Modal */}
      <SettingsModal 
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        defaultTimeIn={defaultTimeIn}
        defaultTimeOut={defaultTimeOut}
        onSave={handleSaveSettings}
      />

      {/* Email Recipients Modal */}
      <EmailManagerModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        toEmails={toEmails}
        setToEmails={setToEmails}
        ccEmails={ccEmails}
        setCcEmails={setCcEmails}
      />

      {/* Floating Action Button / Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-50 to-transparent max-w-lg mx-auto pointer-events-none">
         <div className="pointer-events-auto">
            <button
              onClick={handleSendEmail}
              className="w-full bg-slate-900 text-white font-semibold text-lg py-4 rounded-xl shadow-lg shadow-slate-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 hover:bg-slate-800"
            >
              <span>Generate Email</span>
              <Send size={20} />
            </button>
         </div>
      </div>
    </div>
  );
};

export default App;
