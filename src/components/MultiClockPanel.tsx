import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Trash2, Clock, Globe } from 'lucide-react';
import { useWorldTime } from '../hooks/useWorldTime';

interface MultiClockPanelProps {
  isDarkMode: boolean;
}

const AVAILABLE_CITIES = [
  { label: 'New York', value: 'America/New_York' },
  { label: 'London', value: 'Europe/London' },
  { label: 'Dubai', value: 'Asia/Dubai' },
  { label: 'Tokyo', value: 'Asia/Tokyo' },
  { label: 'Sydney', value: 'Australia/Sydney' },
  { label: 'Paris', value: 'Europe/Paris' },
  { label: 'Singapore', value: 'Asia/Singapore' },
  { label: 'Los Angeles', value: 'America/Los_Angeles' },
  { label: 'Berlin', value: 'Europe/Berlin' },
  { label: 'Hong Kong', value: 'Asia/Hong_Kong' },
];

function ClockCard({ city, timezone, isDarkMode, onRemove }: { city: string, timezone: string, isDarkMode: boolean, onRemove: () => void }) {
  const { formattedTime, offset, isDay } = useWorldTime(timezone);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`relative p-4 rounded-2xl border flex flex-col justify-between h-32 group transition-all hover:shadow-lg ${
        isDarkMode 
          ? 'bg-zinc-800/40 border-white/5 hover:border-white/10' 
          : 'bg-white/60 border-black/5 hover:border-black/10'
      }`}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider opacity-70 font-sans">{city}</h3>
          <span className={`text-xs font-mono opacity-50 ${offset.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
            {offset}
          </span>
        </div>
        <div className={`p-1.5 rounded-full ${isDay ? 'bg-amber-500/10 text-amber-500' : 'bg-indigo-500/10 text-indigo-400'}`}>
          {isDay ? <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]" /> : <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]" />}
        </div>
      </div>
      
      <div className="mt-auto">
        <div className="text-2xl font-display font-medium tracking-tight tabular-nums">
          {formattedTime}
        </div>
      </div>

      <button 
        onClick={onRemove}
        className="absolute top-2 right-2 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/10 hover:text-red-500"
      >
        <X className="w-3 h-3" />
      </button>
    </motion.div>
  );
}

export function MultiClockPanel({ isDarkMode }: MultiClockPanelProps) {
  const [clocks, setClocks] = useState<{id: string, city: string, timezone: string}[]>([
    { id: '1', city: 'New York', timezone: 'America/New_York' },
    { id: '2', city: 'London', timezone: 'Europe/London' },
  ]);
  const [isAdding, setIsAdding] = useState(false);

  const addClock = (city: string, timezone: string) => {
    if (clocks.length >= 6) return;
    setClocks([...clocks, { id: Math.random().toString(36).substr(2, 9), city, timezone }]);
    setIsAdding(false);
  };

  const removeClock = (id: string) => {
    setClocks(clocks.filter(c => c.id !== id));
  };

  return (
    <div className="w-full mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-bold uppercase tracking-widest opacity-60 font-sans flex items-center gap-2">
          <Globe className="w-4 h-4" /> World Clocks
        </h2>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          disabled={clocks.length >= 6}
          className={`p-2 rounded-xl transition-all active:scale-95 disabled:opacity-30 ${
            isDarkMode ? 'hover:bg-white/10' : 'hover:bg-black/5'
          }`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {clocks.map(clock => (
            <ClockCard 
              key={clock.id} 
              {...clock} 
              isDarkMode={isDarkMode} 
              onRemove={() => removeClock(clock.id)} 
            />
          ))}
          
          {isAdding && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`p-4 rounded-2xl border flex flex-col gap-2 h-32 overflow-y-auto custom-scrollbar ${
                isDarkMode ? 'bg-zinc-900/60 border-dashed border-white/20' : 'bg-white/60 border-dashed border-black/20'
              }`}
            >
              <div className="text-xs font-bold opacity-50 mb-2 uppercase">Select City</div>
              {AVAILABLE_CITIES.filter(c => !clocks.find(cl => cl.timezone === c.value)).map(city => (
                <button
                  key={city.value}
                  onClick={() => addClock(city.label, city.value)}
                  className={`text-left text-sm py-1 px-2 rounded hover:bg-indigo-500/10 hover:text-indigo-500 transition-colors font-sans`}
                >
                  {city.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
