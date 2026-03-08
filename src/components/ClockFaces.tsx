import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

interface ClockFaceProps {
  time: string;
  isDarkMode: boolean;
}

// Classic Digital Clock (The original one)
export function ClassicDigitalClock({ time, isDarkMode }: ClockFaceProps) {
  return (
    <div className="relative mb-8 group select-none">
      <div className={`absolute -inset-4 rounded-3xl blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 ${isDarkMode ? 'bg-violet-500' : 'bg-sky-500'}`} />
      <motion.div 
        key={time}
        initial={{ opacity: 0.8, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative text-7xl sm:text-8xl md:text-9xl font-display font-bold tracking-tighter tabular-nums leading-none mb-4 text-[#808080] ${
          isDarkMode ? 'drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]' : 'drop-shadow-[0_0_5px_rgba(0,0,0,0.4)]'
        }`}
      >
        {time}
      </motion.div>
    </div>
  );
}

// Neon Clock
export function NeonClock({ time, isDarkMode }: ClockFaceProps) {
  return (
    <div className="relative mb-8 group">
      <div className={`absolute -inset-8 rounded-full blur-3xl opacity-40 transition-opacity duration-500 ${isDarkMode ? 'bg-pink-500' : 'bg-cyan-400'}`} />
      <div className={`relative text-6xl sm:text-8xl md:text-9xl font-mono font-bold tracking-widest leading-none mb-4 select-none
        ${isDarkMode ? 'text-pink-500 drop-shadow-[0_0_10px_rgba(236,72,153,0.8)]' : 'text-cyan-600 drop-shadow-[0_0_10px_rgba(8,145,178,0.5)]'}
      `}
      style={{ textShadow: isDarkMode ? '0 0 20px #ec4899, 0 0 40px #ec4899' : '0 0 20px #06b6d4' }}
      >
        {time}
      </div>
    </div>
  );
}

// Minimal Clock
export function MinimalClock({ time, isDarkMode }: ClockFaceProps) {
  return (
    <div className="relative mb-8">
      <div className={`text-6xl sm:text-8xl md:text-9xl font-sans font-thin tracking-tight leading-none mb-4 select-none
        ${isDarkMode ? 'text-white/90' : 'text-zinc-900/90'}
      `}>
        {time}
      </div>
      <div className={`h-1 w-24 mx-auto rounded-full ${isDarkMode ? 'bg-white/20' : 'bg-black/10'}`} />
    </div>
  );
}
