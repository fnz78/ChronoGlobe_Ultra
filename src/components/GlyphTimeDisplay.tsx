import { useEffect, useState, useRef, FC } from 'react';

interface GlyphTimeDisplayProps {
  time: string;
  isDarkMode: boolean;
}

const GLYPHS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const GlyphChar: FC<{ char: string, isDarkMode: boolean }> = ({ char, isDarkMode }) => {
  const [display, setDisplay] = useState(char);
  
  useEffect(() => {
    // Don't animate separators or AM/PM often
    if ([':', ' ', 'A', 'P', 'M'].includes(char)) {
      setDisplay(char);
      return;
    }

    let iterations = 0;
    const maxIterations = 3; // Quick shuffle for responsiveness
    
    const interval = setInterval(() => {
      if (iterations >= maxIterations) {
        setDisplay(char);
        clearInterval(interval);
      } else {
        setDisplay(GLYPHS[Math.floor(Math.random() * GLYPHS.length)]);
        iterations++;
      }
    }, 40);

    return () => clearInterval(interval);
  }, [char]);

  return (
    <span className={`inline-block text-center w-[0.6em] ${char === ':' ? 'opacity-50 animate-pulse' : ''}`}>
      {display}
    </span>
  );
};

export function GlyphTimeDisplay({ time, isDarkMode }: GlyphTimeDisplayProps) {
  return (
    <div className="relative mb-8 group">
      {/* Glow effect */}
      <div className={`absolute -inset-4 rounded-3xl blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 ${isDarkMode ? 'bg-indigo-500' : 'bg-indigo-300'}`} />
      
      <div className={`relative text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-mono font-bold tracking-tighter leading-none flex justify-center lg:justify-start select-none
        ${isDarkMode ? 'text-white' : 'text-zinc-900'}
      `}>
        {time.split('').map((char, i) => (
          <GlyphChar key={i} char={char} isDarkMode={isDarkMode} />
        ))}
      </div>
    </div>
  );
}
