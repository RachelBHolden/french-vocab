
import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export const Logo: React.FC<LogoProps> = ({ className = "", size = 48 }) => {
  return (
    <div 
      className={`relative flex items-center justify-center bg-black border-2 border-black group overflow-hidden ${className}`}
      style={{ width: size, height: size }}
    >
      <svg 
        viewBox="0 0 100 100" 
        className="w-full h-full text-white transition-transform duration-300 group-hover:scale-110"
        fill="currentColor"
      >
        {/* Adjusted vertical positioning for better centering (shifted up by ~2 units) */}
        
        {/* Fedora Hat */}
        <rect x="25" y="28" width="50" height="8" />
        <rect x="35" y="13" width="30" height="15" />
        
        {/* Face shadow / Gap */}
        <rect x="35" y="43" width="30" height="2" opacity="0.5" />
        
        {/* Minimalist Eyes (Glint) */}
        <rect x="40" y="40" width="5" height="2" className="animate-pulse" />
        <rect x="55" y="40" width="5" height="2" className="animate-pulse" />
        
        {/* Trench Coat Collar */}
        <path d="M20 58 L50 83 L80 58 L80 93 L20 93 Z" />
        
        {/* Minimalist Bow Tie - Noir style */}
        <path d="M42 62 L50 67 L42 72 Z" fill="white" />
        <path d="M58 62 L50 67 L58 72 Z" fill="white" />
        <circle cx="50" cy="67" r="1.5" fill="white" />
      </svg>
      
      {/* Glitch Overlay Effect */}
      <div className="absolute inset-0 bg-white mix-blend-difference opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none"></div>
    </div>
  );
};
