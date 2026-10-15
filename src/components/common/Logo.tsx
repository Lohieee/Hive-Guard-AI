import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  lightMode?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showTagline = false,
  lightMode = false,
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
    xl: 'w-14 h-14'
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Brand Icon: Honeybee + Shield + Honeycomb + AI Pulse */}
      <div className={`relative flex items-center justify-center shrink-0 ${iconSizes[size]}`}>
        <svg viewBox="0 0 48 48" fill="none" className="w-full h-full drop-shadow-sm">
          {/* Shield Outline */}
          <path
            d="M24 4L8 10V22C8 31.5 14.8 40.2 24 44C33.2 40.2 40 31.5 40 22V10L24 4Z"
            fill={lightMode ? '#143D2B' : '#1B4332'}
            stroke="#2D6A4F"
            strokeWidth="2"
          />
          {/* Honeycomb Hexagon Accent */}
          <path
            d="M24 14L32 18.5V27.5L24 32L16 27.5V18.5L24 14Z"
            stroke="#F59E0B"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#0F2D20"
          />
          {/* Bee Abdomen */}
          <ellipse cx="24" cy="23" rx="4" ry="6" fill="#F59E0B" />
          {/* Stripes */}
          <line x1="20.5" y1="21" x2="27.5" y2="21" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="20.5" y1="24" x2="27.5" y2="24" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" />
          {/* Wings */}
          <path d="M21 21C18 17 14 18 16 21C18 24 21 22 21 22" fill="#D8F3DC" fillOpacity="0.85" />
          <path d="M27 21C30 17 34 18 32 21C30 24 27 22 27 22" fill="#D8F3DC" fillOpacity="0.85" />
          {/* AI / Sensor Heartbeat Pulse */}
          <circle cx="24" cy="36" r="2.2" fill="#10B981" />
        </svg>
      </div>

      {/* Brand Text */}
      <div className="flex flex-col leading-tight">
        <div className={`font-extrabold tracking-tight flex items-center gap-1 ${textSizes[size]} ${lightMode ? 'text-white' : 'text-slate-900'}`}>
          <span className="text-emerald-800 dark:text-emerald-400">HIVE</span>
          <span className="text-amber-500">GUARD</span>
          <span className="text-xs uppercase tracking-widest px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 font-bold border border-amber-500/20 ml-1">
            AI
          </span>
        </div>
        {showTagline && (
          <span className="text-[11px] font-medium text-slate-500 tracking-wide">
            Protect Every Colony. Predict Every Risk.
          </span>
        )}
      </div>
    </div>
  );
};
