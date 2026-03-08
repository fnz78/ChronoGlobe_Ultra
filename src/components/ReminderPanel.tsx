import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, BellOff, X, Check, Calendar } from 'lucide-react';

interface ReminderPanelProps {
  isDarkMode: boolean;
  currentDate: Date;
  timezone: string;
}

export function ReminderPanel({ isDarkMode, currentDate, timezone }: ReminderPanelProps) {
  const [reminderTime, setReminderTime] = useState('');
  const [reminderDate, setReminderDate] = useState('');
  const [activeReminder, setActiveReminder] = useState<{ date: string, time: string } | null>(null);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    // Set default date to today in the selected timezone
    if (!reminderDate) {
      const today = new Date().toLocaleDateString('en-CA', { timeZone: timezone === 'local' ? undefined : timezone });
      setReminderDate(today);
    }
  }, [timezone]);

  useEffect(() => {
    if (activeReminder) {
      // Get current time in selected timezone as strings
      const now = new Date();
      const currentTzDate = now.toLocaleDateString('en-CA', { timeZone: timezone === 'local' ? undefined : timezone });
      const currentTzTime = now.toLocaleTimeString('en-GB', { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: false,
        timeZone: timezone === 'local' ? undefined : timezone 
      });

      if (currentTzDate === activeReminder.date && currentTzTime === activeReminder.time) {
        setShowNotification(true);
        setActiveReminder(null); // Clear after triggering
        // Play sound
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
        audio.play().catch(e => console.log("Audio play failed", e));
      }
    }
  }, [currentDate, activeReminder, timezone]);

  const handleSetReminder = () => {
    if (reminderTime && reminderDate) {
      setActiveReminder({ date: reminderDate, time: reminderTime });
      // Don't clear inputs so user can see what they set, or maybe clear them? 
      // Let's keep them for now or reset. Resetting feels cleaner.
      setReminderTime('');
      setReminderDate('');
    }
  };

  const cancelReminder = () => {
    setActiveReminder(null);
  };

  return (
    <div className="mt-8 relative">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold uppercase tracking-widest opacity-60 font-sans flex items-center gap-2">
          <Bell className="w-4 h-4" /> Reminder
        </h2>
        {activeReminder && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono bg-indigo-500/10 text-indigo-500 px-2 py-1 rounded-md flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
              {activeReminder.date} {activeReminder.time}
            </span>
            <button onClick={cancelReminder} className="p-1 hover:bg-red-500/10 rounded text-red-500 transition-colors">
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <div className={`flex-1 flex items-center px-4 py-3 rounded-xl border transition-all ${
            isDarkMode 
              ? 'bg-zinc-800/50 border-white/10 focus-within:border-indigo-500/50' 
              : 'bg-white/50 border-black/5 focus-within:border-indigo-500/50'
          }`}>
          <Calendar className="w-4 h-4 opacity-50 mr-2" />
          <input
            type="date"
            value={reminderDate}
            onChange={(e) => setReminderDate(e.target.value)}
            className={`bg-transparent outline-none w-full font-mono text-sm ${isDarkMode ? 'text-white' : 'text-zinc-900'} [color-scheme:dark]`}
            style={{ colorScheme: isDarkMode ? 'dark' : 'light' }}
          />
        </div>
        
        <div className={`flex-1 flex items-center px-4 py-3 rounded-xl border transition-all ${
            isDarkMode 
              ? 'bg-zinc-800/50 border-white/10 focus-within:border-indigo-500/50' 
              : 'bg-white/50 border-black/5 focus-within:border-indigo-500/50'
          }`}>
          <Bell className="w-4 h-4 opacity-50 mr-2" />
          <input
            type="time"
            value={reminderTime}
            onChange={(e) => setReminderTime(e.target.value)}
            className={`bg-transparent outline-none w-full font-mono text-sm ${isDarkMode ? 'text-white' : 'text-zinc-900'} [color-scheme:dark]`}
            style={{ colorScheme: isDarkMode ? 'dark' : 'light' }}
          />
        </div>

        <button
          onClick={handleSetReminder}
          disabled={!reminderTime || !reminderDate}
          className={`px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all active:scale-95 disabled:opacity-30 disabled:pointer-events-none ${
            isDarkMode 
              ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_15px_rgba(79,70,229,0.3)]' 
              : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-[0_0_15px_rgba(79,70,229,0.2)]'
          }`}
        >
          Set
        </button>
      </div>

      {/* Notification Popup */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -50, x: '-50%' }}
            className={`fixed top-8 left-1/2 z-[100] w-full max-w-sm p-4 rounded-2xl border shadow-2xl flex items-center gap-4 backdrop-blur-xl ${
              isDarkMode 
                ? 'bg-zinc-900/90 border-indigo-500/50 text-white shadow-indigo-500/20' 
                : 'bg-white/90 border-indigo-500/50 text-zinc-900 shadow-indigo-500/10'
            }`}
          >
            <div className="p-3 bg-indigo-500 rounded-xl text-white animate-pulse">
              <Bell className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg font-display">Reminder!</h3>
              <p className="text-sm opacity-70 font-sans">
                It is now {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </p>
            </div>
            <button 
              onClick={() => setShowNotification(false)}
              className="p-2 hover:bg-black/5 rounded-full transition-colors"
            >
              <X className="w-5 h-5 opacity-50 hover:opacity-100" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
