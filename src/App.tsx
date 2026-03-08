import { useState, useEffect, useMemo } from 'react';
import { Moon, Sun, Globe, Clock, Calendar, Bell, BellOff, X, Plus, Trash2, Search, Settings, Sunrise, Sunset } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useWorldTime } from './hooks/useWorldTime';
import { TimezoneSelector } from './components/TimezoneSelector';
import { MultiClockPanel } from './components/MultiClockPanel';
import { ReminderPanel } from './components/ReminderPanel';
import { SettingsPanel } from './components/SettingsPanel';
import { GlyphTimeDisplay } from './components/GlyphTimeDisplay';
import { ClockFaceSelector, ClockFaceType } from './components/ClockFaceSelector';
import { ClassicDigitalClock, NeonClock, MinimalClock } from './components/ClockFaces';

export default function App() {
  const [selectedTimezone, setSelectedTimezone] = useState('local');
  const [clockFace, setClockFace] = useState<ClockFaceType>('glyph');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return true;
  });

  const [settings, setSettings] = useState({
    showSeconds: true,
    use24Hour: false,
    showTimezoneAbbr: true,
    enableAnimations: true,
  });

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const { formattedTime, formattedDate, isDay, offset, sunrise, sunset, time } = useWorldTime(selectedTimezone, {
    use24Hour: settings.use24Hour,
    showSeconds: settings.showSeconds
  });

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const handleSettingsUpdate = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 flex flex-col items-center justify-center p-4 font-sans overflow-x-hidden ${isDarkMode ? 'bg-zinc-950 text-white' : 'bg-zinc-50 text-zinc-900'}`}>
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-24 -left-24 w-96 h-96 rounded-full blur-3xl opacity-20 transition-colors duration-1000 ${isDay ? (isDarkMode ? 'bg-indigo-500' : 'bg-indigo-300') : (isDarkMode ? 'bg-indigo-900' : 'bg-indigo-200')}`} />
        <div className={`absolute -bottom-24 -right-24 w-96 h-96 rounded-full blur-3xl opacity-20 transition-colors duration-1000 ${isDay ? (isDarkMode ? 'bg-emerald-500' : 'bg-emerald-300') : (isDarkMode ? 'bg-purple-900' : 'bg-purple-200')}`} />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative z-10 w-full max-w-5xl p-8 rounded-[2.5rem] border backdrop-blur-xl shadow-2xl transition-all duration-300 ${
          isDarkMode 
            ? 'bg-zinc-900/40 border-white/10 shadow-black/50' 
            : 'bg-white/40 border-black/5 shadow-zinc-200'
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl ${isDarkMode ? 'bg-white/10' : 'bg-black/5'}`}>
              <Globe className="w-6 h-6 animate-pulse-slow" />
            </div>
            <div>
              <h1 className="font-display font-bold tracking-tight text-lg uppercase">ChronoGlobe <span className="text-indigo-500">Ultra</span></h1>
              <p className="text-[10px] font-mono opacity-50 tracking-widest uppercase">Time Intelligence Dashboard</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <SettingsPanel isDarkMode={isDarkMode} settings={settings} onUpdate={handleSettingsUpdate} />
            <button 
              onClick={toggleDarkMode}
              className={`p-2 rounded-xl transition-all hover:scale-110 active:scale-95 ${isDarkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-black/5 hover:bg-black/10'}`}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Clock Section */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="mb-8">
              <TimezoneSelector 
                selectedTimezone={selectedTimezone} 
                onSelect={setSelectedTimezone} 
                isDarkMode={isDarkMode} 
              />
            </div>

            <div className="mb-8 flex justify-center lg:justify-start">
              <ClockFaceSelector selectedFace={clockFace} onSelect={setClockFace} isDarkMode={isDarkMode} />
            </div>

            <div className="text-center lg:text-left mb-8 relative group">
              <div className="grid grid-cols-1">
                <AnimatePresence>
                  <motion.div
                    key={clockFace}
                    initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
                    transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                    className="col-start-1 row-start-1 w-full"
                  >
                    {clockFace === 'glyph' && <GlyphTimeDisplay time={formattedTime} isDarkMode={isDarkMode} />}
                    {clockFace === 'digital' && <ClassicDigitalClock time={formattedTime} isDarkMode={isDarkMode} />}
                    {clockFace === 'neon' && <NeonClock time={formattedTime} isDarkMode={isDarkMode} />}
                    {clockFace === 'minimal' && <MinimalClock time={formattedTime} isDarkMode={isDarkMode} />}
                  </motion.div>
                </AnimatePresence>
              </div>
              
              <div className="flex flex-col gap-4 opacity-60">
                <div className="flex flex-col lg:flex-row items-center lg:items-start gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    <span className="text-lg font-medium font-sans">{formattedDate}</span>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${isDay ? 'bg-amber-500/10 text-amber-500' : 'bg-indigo-500/10 text-indigo-400'}`}>
                    {isDay ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}
                    {isDay ? 'Daytime' : 'Nighttime'}
                  </div>
                  {offset && (
                    <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider font-mono ${offset.startsWith('+') ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                      {offset} from Local
                    </div>
                  )}
                </div>

                {/* Sunrise/Sunset Indicator */}
                {(sunrise && sunset) && (
                  <div className="flex items-center justify-center lg:justify-start gap-6 text-xs font-mono mt-2">
                    <div className="flex items-center gap-2 bg-amber-500/5 px-3 py-1.5 rounded-lg border border-amber-500/10">
                      <Sunrise className="w-4 h-4 text-amber-500" />
                      <div className="flex flex-col leading-none gap-0.5">
                        <span className="opacity-50 text-[10px] uppercase font-sans">Sunrise</span>
                        <span>{sunrise}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 bg-indigo-500/5 px-3 py-1.5 rounded-lg border border-indigo-500/10">
                      <Sunset className="w-4 h-4 text-indigo-400" />
                      <div className="flex flex-col leading-none gap-0.5">
                        <span className="opacity-50 text-[10px] uppercase font-sans">Sunset</span>
                        <span>{sunset}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleSettingsUpdate('use24Hour', !settings.use24Hour)}
                      className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold uppercase tracking-wider transition-all ${
                        isDarkMode 
                          ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white/70' 
                          : 'bg-black/5 border-black/5 hover:bg-black/10 text-black/70'
                      }`}
                    >
                      {settings.use24Hour ? '24H' : '12H'}
                    </button>
                  </div>
                )}
              </div>
            </div>

            <ReminderPanel isDarkMode={isDarkMode} currentDate={time} timezone={selectedTimezone} />
          </div>

          {/* Side Panel */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Global Date Tracker */}
            <div className={`p-6 rounded-3xl border ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-black/5 border-black/5'}`}>
              <h3 className="text-xs font-bold uppercase tracking-widest opacity-40 mb-4 font-sans">Global Date Tracker</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-3xl font-display font-bold">
                    {Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24)}
                  </div>
                  <div className="text-xs opacity-50 font-sans">Day of Year</div>
                </div>
                <div>
                  <div className="text-3xl font-display font-bold">
                    {Math.ceil((((new Date().getTime() - new Date(new Date().getFullYear(), 0, 1).getTime()) / 86400000) + new Date(new Date().getFullYear(), 0, 1).getDay() + 1) / 7)}
                  </div>
                  <div className="text-xs opacity-50 font-sans">Week Number</div>
                </div>
              </div>
            </div>

            {/* Multi-Clock Panel */}
            <MultiClockPanel isDarkMode={isDarkMode} />
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center opacity-40 text-[10px] uppercase tracking-[0.2em] font-bold gap-4">
          <span className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            System Operational
          </span>
          <span className="font-mono">v2.0.0 Ultra Build</span>
          <span>{selectedTimezone === 'local' ? 'System Sync' : 'Network Sync'}</span>
        </div>
      </motion.div>
    </div>
  );
}
