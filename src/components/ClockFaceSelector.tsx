import { motion } from 'motion/react';
import { Clock, Type, Grid, Zap } from 'lucide-react';

export type ClockFaceType = 'digital' | 'glyph' | 'neon' | 'minimal';

interface ClockFaceSelectorProps {
  selectedFace: ClockFaceType;
  onSelect: (face: ClockFaceType) => void;
  isDarkMode: boolean;
}

export function ClockFaceSelector({ selectedFace, onSelect, isDarkMode }: ClockFaceSelectorProps) {
  const faces: { id: ClockFaceType; label: string; icon: any }[] = [
    { id: 'digital', label: 'Classic', icon: Clock },
    { id: 'glyph', label: 'Matrix', icon: Grid },
    { id: 'neon', label: 'Neon', icon: Zap },
    { id: 'minimal', label: 'Minimal', icon: Type },
  ];

  return (
    <div className={`flex items-center gap-1 p-1 rounded-xl mb-8 overflow-x-auto ${isDarkMode ? 'bg-white/5' : 'bg-black/5'}`}>
      {faces.map((face) => (
        <button
          key={face.id}
          onClick={() => onSelect(face.id)}
          className={`relative flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap z-10 ${
            selectedFace === face.id
              ? (isDarkMode ? 'text-black' : 'text-white')
              : (isDarkMode ? 'text-white/50 hover:text-white/80' : 'text-black/50 hover:text-black/80')
          }`}
        >
          {selectedFace === face.id && (
            <motion.div
              layoutId="activeClockFace"
              className={`absolute inset-0 rounded-lg -z-10 shadow-sm ${isDarkMode ? 'bg-white' : 'bg-black'}`}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
          <face.icon className="w-3 h-3 relative z-10" />
          <span className="relative z-10">{face.label}</span>
        </button>
      ))}
    </div>
  );
}
