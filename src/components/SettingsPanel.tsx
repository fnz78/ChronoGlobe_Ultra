import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, X, Check, Globe, Clock, Zap, Wifi } from 'lucide-react';

interface SettingsPanelProps {
  isDarkMode: boolean;
  settings: {
    showSeconds: boolean;
    use24Hour: boolean;
    showTimezoneAbbr: boolean;
    enableAnimations: boolean;
  };
  onUpdate: (key: string, value: boolean) => void;
}

export function SettingsPanel({ isDarkMode, settings, onUpdate }: SettingsPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className={`p-2 rounded-xl transition-all hover:scale-110 active:scale-95 ${isDarkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-black/5 hover:bg-black/10'}`}
      >
        <Settings className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: '100%' }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: '100%' }}
              className={`fixed top-0 right-0 h-full w-80 z-50 p-6 shadow-2xl border-l flex flex-col ${
                isDarkMode 
                  ? 'bg-zinc-900/90 border-white/10 backdrop-blur-xl text-white' 
                  : 'bg-white/90 border-black/5 backdrop-blur-xl text-zinc-900'
              }`}
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-display font-bold uppercase tracking-wider">Settings</h2>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-black/5 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6 flex-1">
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest opacity-40 font-sans">Display</h3>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium font-sans">Show Seconds</span>
                    <button 
                      onClick={() => onUpdate('showSeconds', !settings.showSeconds)}
                      className={`w-12 h-6 rounded-full p-1 transition-colors ${settings.showSeconds ? 'bg-indigo-500' : 'bg-zinc-500/20'}`}
                    >
                      <motion.div 
                        layout
                        className="w-4 h-4 bg-white rounded-full shadow-sm"
                        animate={{ x: settings.showSeconds ? 24 : 0 }}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium font-sans">Timezone Abbr.</span>
                    <button 
                      onClick={() => onUpdate('showTimezoneAbbr', !settings.showTimezoneAbbr)}
                      className={`w-12 h-6 rounded-full p-1 transition-colors ${settings.showTimezoneAbbr ? 'bg-indigo-500' : 'bg-zinc-500/20'}`}
                    >
                      <motion.div 
                        layout
                        className="w-4 h-4 bg-white rounded-full shadow-sm"
                        animate={{ x: settings.showTimezoneAbbr ? 24 : 0 }}
                      />
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest opacity-40 font-sans">Performance</h3>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium font-sans">Animations</span>
                    <button 
                      onClick={() => onUpdate('enableAnimations', !settings.enableAnimations)}
                      className={`w-12 h-6 rounded-full p-1 transition-colors ${settings.enableAnimations ? 'bg-indigo-500' : 'bg-zinc-500/20'}`}
                    >
                      <motion.div 
                        layout
                        className="w-4 h-4 bg-white rounded-full shadow-sm"
                        animate={{ x: settings.enableAnimations ? 24 : 0 }}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Status Panel */}
              <div className={`mt-auto p-4 rounded-xl border ${isDarkMode ? 'bg-black/20 border-white/5' : 'bg-zinc-100 border-black/5'}`}>
                <h3 className="text-xs font-bold uppercase tracking-widest opacity-40 mb-3 font-sans">System Status</h3>
                <div className="space-y-2 text-xs font-mono opacity-70">
                  <div className="flex justify-between">
                    <span className="flex items-center gap-2"><Wifi className="w-3 h-3" /> Network</span>
                    <span className="text-emerald-500">Online</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center gap-2"><Clock className="w-3 h-3" /> Sync</span>
                    <span className="text-indigo-500">Atomic</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center gap-2"><Zap className="w-3 h-3" /> Latency</span>
                    <span>24ms</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
