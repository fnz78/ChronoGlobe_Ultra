import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, Clock, Globe } from 'lucide-react';
import { TIMEZONES } from '../data/timezones';

interface TimezoneSelectorProps {
  selectedTimezone: string;
  onSelect: (tz: string) => void;
  isDarkMode: boolean;
}

export function TimezoneSelector({ selectedTimezone, onSelect, isDarkMode }: TimezoneSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filteredTimezones = TIMEZONES.filter(tz => 
    tz.label.toLowerCase().includes(search.toLowerCase())
  );

  const selectedLabel = TIMEZONES.find(tz => tz.value === selectedTimezone)?.label || selectedTimezone;

  return (
    <div className="relative z-50">
      <label className="block text-xs font-bold uppercase tracking-widest opacity-40 ml-1 mb-2 font-sans">
        Select Timezone
      </label>
      
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-4 rounded-2xl border outline-none transition-all cursor-pointer font-medium flex justify-between items-center ${
          isDarkMode 
            ? 'bg-zinc-800/50 border-white/10 hover:bg-zinc-800' 
            : 'bg-white/50 border-black/5 hover:bg-white'
        }`}
      >
        <span className="truncate mr-2 font-sans">{selectedLabel}</span>
        <Clock className="w-4 h-4 opacity-40 flex-shrink-0" />
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className={`absolute top-full left-0 right-0 mt-2 p-2 rounded-2xl border shadow-2xl z-50 max-h-80 flex flex-col ${
                isDarkMode 
                  ? 'bg-zinc-900 border-white/10 shadow-black/50' 
                  : 'bg-white border-black/5 shadow-zinc-200'
              }`}
            >
              <div className={`flex items-center px-3 py-2 rounded-xl mb-2 ${isDarkMode ? 'bg-zinc-800' : 'bg-zinc-100'}`}>
                <Search className="w-4 h-4 opacity-40 mr-2" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search city..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-transparent outline-none w-full text-sm font-sans"
                />
                {search && (
                  <button onClick={() => setSearch('')}>
                    <X className="w-3 h-3 opacity-40 hover:opacity-100" />
                  </button>
                )}
              </div>

              <div className="overflow-y-auto flex-1 custom-scrollbar">
                {filteredTimezones.length > 0 ? (
                  filteredTimezones.map((tz) => (
                    <button
                      key={tz.value}
                      onClick={() => {
                        onSelect(tz.value);
                        setIsOpen(false);
                        setSearch('');
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors font-sans ${
                        selectedTimezone === tz.value
                          ? (isDarkMode ? 'bg-indigo-500/20 text-indigo-300' : 'bg-indigo-50 text-indigo-600')
                          : (isDarkMode ? 'hover:bg-white/5' : 'hover:bg-black/5')
                      }`}
                    >
                      {tz.label}
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center opacity-40 text-sm font-sans">
                    No cities found
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
