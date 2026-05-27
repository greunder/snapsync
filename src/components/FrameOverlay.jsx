import React from 'react';
import { motion } from 'framer-motion';

// Decorative components for festive card designs
export const GoldBalloons = ({ className }) => (
  <svg viewBox="0 0 100 120" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="goldBalloonGrad" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="25%" stopColor="#fdf0cd" />
        <stop offset="55%" stopColor="#d4af37" />
        <stop offset="85%" stopColor="#aa771c" />
        <stop offset="100%" stopColor="#5c4008" />
      </radialGradient>
      <filter id="balloonShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="1" dy="2" stdDeviation="1.5" floodOpacity="0.4"/>
      </filter>
    </defs>
    {/* Strings */}
    <path d="M 30,65 Q 45,95 50,118" stroke="#dddddd" strokeWidth="1" fill="none" opacity="0.5" />
    <path d="M 50,55 Q 50,95 50,118" stroke="#dddddd" strokeWidth="1" fill="none" opacity="0.5" />
    <path d="M 70,65 Q 55,95 50,118" stroke="#dddddd" strokeWidth="1" fill="none" opacity="0.5" />
    
    {/* Left Balloon */}
    <g filter="url(#balloonShadow)">
      <ellipse cx="30" cy="60" rx="14" ry="19" transform="rotate(-15, 30, 60)" fill="url(#goldBalloonGrad)" />
      <polygon points="30,79 27,83 33,83" fill="#aa771c" />
    </g>
    
    {/* Right Balloon */}
    <g filter="url(#balloonShadow)">
      <ellipse cx="70" cy="60" rx="14" ry="19" transform="rotate(15, 70, 60)" fill="url(#goldBalloonGrad)" />
      <polygon points="70,79 67,83 73,83" fill="#aa771c" />
    </g>
    
    {/* Center Balloon */}
    <g filter="url(#balloonShadow)">
      <ellipse cx="50" cy="50" rx="16" ry="21" fill="url(#goldBalloonGrad)" />
      <polygon points="50,71 47,75 53,75" fill="#aa771c" />
    </g>
  </svg>
);

export const GreenBalloons = ({ className }) => (
  <svg viewBox="0 0 100 120" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="greenBalloonGrad" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="25%" stopColor="#c2ffd0" />
        <stop offset="55%" stopColor="#00a82d" />
        <stop offset="85%" stopColor="#004d11" />
        <stop offset="100%" stopColor="#002107" />
      </radialGradient>
    </defs>
    <path d="M 30,65 Q 45,95 50,118" stroke="#dddddd" strokeWidth="1" fill="none" opacity="0.5" />
    <path d="M 50,55 Q 50,95 50,118" stroke="#dddddd" strokeWidth="1" fill="none" opacity="0.5" />
    <path d="M 70,65 Q 55,95 50,118" stroke="#dddddd" strokeWidth="1" fill="none" opacity="0.5" />
    
    <g filter="url(#balloonShadow)">
      <ellipse cx="30" cy="60" rx="14" ry="19" transform="rotate(-15, 30, 60)" fill="url(#greenBalloonGrad)" />
      <polygon points="30,79 27,83 33,83" fill="#004d11" />
    </g>
    <g filter="url(#balloonShadow)">
      <ellipse cx="70" cy="60" rx="14" ry="19" transform="rotate(15, 70, 60)" fill="url(#greenBalloonGrad)" />
      <polygon points="70,79 67,83 73,83" fill="#004d11" />
    </g>
    <g filter="url(#balloonShadow)">
      <ellipse cx="50" cy="50" rx="16" ry="21" fill="url(#greenBalloonGrad)" />
      <polygon points="50,71 47,75 53,75" fill="#004d11" />
    </g>
  </svg>
);

export const ChristmasOrnaments = ({ className }) => (
  <svg viewBox="0 0 120 100" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="redOrnamentGrad" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="30%" stopColor="#ff5e5e" />
        <stop offset="75%" stopColor="#cc0000" />
        <stop offset="100%" stopColor="#590000" />
      </radialGradient>
      <radialGradient id="goldOrnamentGrad" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="30%" stopColor="#fdf0cd" />
        <stop offset="70%" stopColor="#d4af37" />
        <stop offset="100%" stopColor="#6b4c04" />
      </radialGradient>
    </defs>
    
    <line x1="30" y1="0" x2="30" y2="40" stroke="#ffd700" strokeWidth="1.5" />
    <circle cx="30" cy="52" r="12" fill="url(#redOrnamentGrad)" />
    <rect x="27.5" y="39" width="5" height="2" fill="#ffd700" />
    
    <line x1="90" y1="0" x2="90" y2="30" stroke="#ffd700" strokeWidth="1.5" />
    <circle cx="90" cy="42" r="12" fill="url(#goldOrnamentGrad)" />
    <rect x="87.5" y="29" width="5" height="2" fill="#ffd700" />

    <line x1="60" y1="0" x2="60" y2="55" stroke="#ffd700" strokeWidth="1.5" />
    <circle cx="60" cy="68" r="14" fill="url(#redOrnamentGrad)" />
    <rect x="57.5" y="53" width="5" height="2" fill="#ffd700" />
  </svg>
);

export const HalloweenSpiders = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M 0,0 L 60,0 M 0,0 L 0,60 M 0,0 L 50,50" stroke="#ffffff" strokeWidth="0.8" opacity="0.5" fill="none" />
    <path d="M 20,0 C 20,12 12,20 0,20" stroke="#ffffff" strokeWidth="0.6" opacity="0.5" fill="none" />
    <path d="M 40,0 C 40,24 24,40 0,40" stroke="#ffffff" strokeWidth="0.6" opacity="0.5" fill="none" />
    <path d="M 55,0 C 55,33 33,55 0,55" stroke="#ffffff" strokeWidth="0.6" opacity="0.5" fill="none" />
    
    <line x1="25" y1="25" x2="25" y2="65" stroke="#ffffff" strokeWidth="0.8" opacity="0.6" />
    <circle cx="25" cy="68" r="3.5" fill="#151413" stroke="#fff" strokeWidth="0.5" />
    {/* Legs */}
    <path d="M 22,67 Q 17,65 19,62 M 28,67 Q 33,65 31,62" stroke="#fff" strokeWidth="0.5" fill="none" />
    <path d="M 22,68 Q 16,68 18,66 M 28,68 Q 34,68 32,66" stroke="#fff" strokeWidth="0.5" fill="none" />
    <path d="M 22,69 Q 17,72 20,74 M 28,69 Q 33,72 30,74" stroke="#fff" strokeWidth="0.5" fill="none" />
  </svg>
);

export const HalloweenBats = ({ className }) => (
  <svg viewBox="0 0 100 80" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M 20,30 C 15,25 5,35 12,42 C 16,39 20,40 20,40 C 20,40 24,39 28,42 C 35,35 25,25 20,30" fill="#151413" stroke="#ff8c00" strokeWidth="0.5" />
    <path d="M 60,15 C 56,11 48,19 54,25 C 57,22 60,23 60,23 C 60,23 63,22 66,25 C 72,19 64,11 60,15" fill="#151413" stroke="#ff8c00" strokeWidth="0.5" opacity="0.8" />
  </svg>
);

export const EasterDeco = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Flowers */}
    <circle cx="20" cy="20" r="5" fill="#ffd700" />
    <circle cx="12" cy="20" r="4.5" fill="#ffb7b2" />
    <circle cx="28" cy="20" r="4.5" fill="#ffb7b2" />
    <circle cx="20" cy="12" r="4.5" fill="#ffb7b2" />
    <circle cx="20" cy="28" r="4.5" fill="#ffb7b2" />
    
    {/* Easter Egg */}
    <path d="M 65,55 C 65,40 80,40 80,55 C 80,67 65,67 65,55" fill="#ffc6ff" stroke="#fff" strokeWidth="0.8" />
    <path d="M 67,55 Q 72.5,52.5 78,55" stroke="#ffb703" strokeWidth="0.8" fill="none" />
    <path d="M 66,60 Q 72.5,57.5 79,60" stroke="#b5e2fa" strokeWidth="0.8" fill="none" />
  </svg>
);

export const GoldConfetti = ({ className }) => (
  <svg viewBox="0 0 100 100" className={`absolute inset-0 w-full h-full pointer-events-none ${className}`} xmlns="http://www.w3.org/2000/svg">
    <circle cx="15" cy="20" r="1.2" fill="#ffd700" opacity="0.6" />
    <circle cx="85" cy="15" r="1.0" fill="#ffffff" opacity="0.8" />
    <circle cx="80" cy="75" r="1.5" fill="#ffd700" opacity="0.5" />
    <circle cx="20" cy="85" r="1.3" fill="#ffd700" opacity="0.6" />
    
    <path d="M 12,40 L 13.5,42 L 16.5,42 L 14.5,44 L 15,47 L 12,45.5 L 9,47 L 9.5,44 L 7.5,42 L 10.5,42 Z" fill="#ffd700" opacity="0.65" transform="scale(0.7)" />
    <path d="M 80,50 L 81.5,52 L 84.5,52 L 82.5,54 L 83,57 L 80,55.5 L 77,57 L 77.5,54 L 75.5,52 L 78.5,52 Z" fill="#ffffff" opacity="0.8" transform="scale(0.6)" />
    <path d="M 50,90 L 51.5,92 L 54.5,92 L 52.5,94 L 53,97 L 50,95.5 L 47,97 L 47.5,94 L 45.5,92 L 48.5,92 Z" fill="#ffd700" opacity="0.55" transform="scale(0.5)" />
  </svg>
);

export const SnowflakesBackground = ({ className }) => (
  <svg viewBox="0 0 100 100" className={`absolute inset-0 w-full h-full pointer-events-none ${className}`} xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="18" r="1.5" fill="#ffffff" opacity="0.9" />
    <circle cx="88" cy="22" r="2.0" fill="#ffffff" opacity="0.75" />
    <circle cx="22" cy="78" r="1.2" fill="#ffffff" opacity="0.9" />
    <circle cx="78" cy="88" r="1.8" fill="#ffffff" opacity="0.85" />
    
    <path d="M12,40 L22,40 M17,35 L17,45 M14,37 L20,43 M20,37 L14,43" stroke="#ffffff" strokeWidth="0.8" opacity="0.6" />
    <path d="M80,60 L90,60 M85,55 L85,65 M82,57 L88,63 M88,57 L82,63" stroke="#ffffff" strokeWidth="0.8" opacity="0.6" />
  </svg>
);

export const StPatrickCoins = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
    <circle cx="35" cy="75" r="8" fill="#ffd700" stroke="#b38728" strokeWidth="0.8" />
    <circle cx="35" cy="75" r="5" fill="#ffea00" />
    <text x="35" y="78" fontSize="6" fontWeight="bold" fill="#b38728" textAnchor="middle">☘️</text>

    <circle cx="55" cy="80" r="8" fill="#ffd700" stroke="#b38728" strokeWidth="0.8" />
    <circle cx="55" cy="80" r="5" fill="#ffea00" />
    <text x="55" y="83" fontSize="6" fontWeight="bold" fill="#b38728" textAnchor="middle">☘️</text>

    <circle cx="45" cy="70" r="9" fill="#ffd700" stroke="#b38728" strokeWidth="0.8" />
    <circle cx="45" cy="70" r="6" fill="#ffea00" />
    <text x="45" y="73" fontSize="7" fontWeight="bold" fill="#b38728" textAnchor="middle">☘️</text>
  </svg>
);

export function FrameDecorations({ category, frameId }) {
  const isGala = frameId?.startsWith('gala') || frameId?.startsWith('corpo') || frameId?.startsWith('mariage');
  const isAnniversary = category === 'Anniversaire' || isGala;
  
  return (
    <div className="absolute inset-0 pointer-events-none z-25">
      {/* 1. Theme Specific Border Gradients */}
      {isAnniversary && (
        <>
          <div className="absolute inset-1.5 border-[3px] rounded-xl opacity-90" style={{ borderImage: 'linear-gradient(135deg, #bf953f 0%, #fcf6ba 30%, #b38728 50%, #fbf5b7 70%, #aa771c 100%) 1', borderRadius: '12px' }} />
          <div className="absolute inset-3 border border-dashed border-[#ffd700]/40 rounded-lg" />
          <GoldBalloons className="absolute left-[-12px] top-[18%] w-[55px] h-[65px] filter drop-shadow" />
          <GoldBalloons className="absolute right-[-12px] top-[45%] w-[55px] h-[65px] filter drop-shadow transform scale-x-[-1]" />
          <GoldConfetti className="absolute inset-0" />
        </>
      )}

      {category === 'Halloween' && (
        <>
          <div className="absolute inset-1.5 border-[3px] rounded-xl opacity-85" style={{ borderImage: 'linear-gradient(135deg, #ff8c00 0%, #7b2cbf 50%, #ff8c00 100%) 1', borderRadius: '12px' }} />
          <div className="absolute inset-3 border border-dashed border-[#7b2cbf]/40 rounded-lg" />
          <HalloweenSpiders className="absolute top-1 left-1 w-12 h-12" />
          <HalloweenBats className="absolute top-[35%] right-1 w-10 h-8" />
        </>
      )}

      {category === 'Noël' && (
        <>
          <div className="absolute inset-1.5 border-[3px] rounded-xl opacity-90" style={{ borderImage: 'linear-gradient(135deg, #cc0000 0%, #006400 50%, #cc0000 100%) 1', borderRadius: '12px' }} />
          <div className="absolute inset-3 border border-dashed border-[#ffea00]/30 rounded-lg" />
          <ChristmasOrnaments className="absolute top-1 right-1 w-[55px] h-[45px]" />
          <SnowflakesBackground className="absolute inset-0" />
        </>
      )}

      {category === 'St-Patrick' && (
        <>
          <div className="absolute inset-1.5 border-[3px] rounded-xl opacity-90" style={{ borderImage: 'linear-gradient(135deg, #008000 0%, #ffd700 50%, #004d00 100%) 1', borderRadius: '12px' }} />
          <div className="absolute inset-3 border border-dashed border-[#ffd700]/40 rounded-lg" />
          <GreenBalloons className="absolute left-[-12px] top-[18%] w-[55px] h-[65px] filter drop-shadow" />
          <GreenBalloons className="absolute right-[-12px] top-[45%] w-[55px] h-[65px] filter drop-shadow transform scale-x-[-1]" />
          <StPatrickCoins className="absolute bottom-1 right-1 w-14 h-14" />
        </>
      )}

      {category === 'Pâques' && (
        <>
          <div className="absolute inset-1.5 border-[3px] rounded-xl opacity-90" style={{ borderImage: 'linear-gradient(135deg, #ffd166 0%, #ffb7b2 50%, #ffc6ff 100%) 1', borderRadius: '12px' }} />
          <div className="absolute inset-3 border border-dashed border-white/40 rounded-lg" />
          <EasterDeco className="absolute bottom-1 left-[1px] w-12 h-12" />
          <EasterDeco className="absolute top-1 right-[1px] w-12 h-12 transform scale-y-[-1] scale-x-[-1]" />
        </>
      )}
    </div>
  );
}

// Get CSS styles for procedural backgrounds
export const getBgStyle = (bgType) => {
  // Procedural SVG patterns matching TemplatesBooth style
  const woodPattern = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Cpath d='M0,30 Q30,25 60,30 T120,30 M0,75 Q40,70 80,75 T120,75 M0,105 Q30,100 70,105 T120,105' fill='none' stroke='%232b170c' stroke-width='1.5' opacity='0.22'/%3E%3Cpath d='M0,5 Q40,15 80,5 T120,5 M0,50 Q20,60 60,50 T120,50' fill='none' stroke='%232b170c' stroke-width='1' opacity='0.12'/%3E%3C/svg%3E")`;
  
  const greenWoodPattern = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Cpath d='M0,30 Q30,25 60,30 T120,30 M0,75 Q40,70 80,75 T120,75' fill='none' stroke='%23061f14' stroke-width='1.5' opacity='0.25'/%3E%3C/svg%3E")`;

  const paperPattern = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0.5 0 0 0 0 0.45 0 0 0 0 0.4 0 0 0 0.12 0'/%3E%3C/filter%3E%3Crect width='80' height='80' filter='url(%23noise)'/%3E%3C/svg%3E")`;

  const chalkboardPattern = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.5' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='1 0 0 0 1 0 1 0 0 1 0 0 1 0 1 0 0 0 0.07 0'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)'/%3E%3C/svg%3E")`;

  const confettiPattern = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Ccircle cx='10' cy='15' r='1.5' fill='%23f43f5e' opacity='0.3'/%3E%3Ccircle cx='35' cy='25' r='2' fill='%233b82f6' opacity='0.3'/%3E%3Ccircle cx='50' cy='10' r='1' fill='%23eab308' opacity='0.4'/%3E%3Ccircle cx='20' cy='45' r='2.5' fill='%2310b981' opacity='0.3'/%3E%3Ccircle cx='45' cy='50' r='1.5' fill='%238b5cf6' opacity='0.3'/%3E%3C/svg%3E")`;

  const marblePattern = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Cpath d='M0,50 Q50,40 80,70 T150,110 T200,90' fill='none' stroke='%23d1d5db' stroke-width='1.5' opacity='0.2'/%3E%3Cpath d='M50,200 Q90,150 120,180 T200,160' fill='none' stroke='%23d1d5db' stroke-width='1' opacity='0.15'/%3E%3C/svg%3E")`;

  switch(bgType) {
    case 'wood':
      return { backgroundColor: '#472d1a', backgroundImage: woodPattern };
    case 'greenWood':
      return { backgroundColor: '#0c2e1b', backgroundImage: greenWoodPattern };
    case 'kraft':
      return { backgroundColor: '#d4be98', backgroundImage: paperPattern };
    case 'chalkboard':
      return { backgroundColor: '#1a1b1e', backgroundImage: chalkboardPattern };
    case 'confetti':
      return { backgroundColor: '#fcfaf2', backgroundImage: confettiPattern };
    case 'marble':
      return { backgroundColor: '#f5f5f5', backgroundImage: marblePattern };
    case 'slate':
      return { backgroundColor: '#2d3139', backgroundImage: chalkboardPattern };
    default:
      return { backgroundColor: '#111111' };
  }
};

// Thematic Frames list with TemplatesBooth procedural styling
export const thematicFrames = [
  { 
    id: "halloween-1", 
    name: "Nuit d'horreur", 
    category: "Halloween", 
    emoji: "🎃", 
    bgType: "chalkboard",
    cornerEmoji: "🕸️",
    overlayText: "Halloween" 
  },
  { 
    id: "halloween-2", 
    name: "Fantômes", 
    category: "Halloween", 
    emoji: "👻", 
    bgType: "chalkboard",
    cornerEmoji: "🦇",
    overlayText: "Boo!" 
  },
  { 
    id: "noel-1", 
    name: "Sapin de Noël", 
    category: "Noël", 
    emoji: "🎄", 
    bgType: "wood",
    cornerEmoji: "❄️",
    overlayText: "Joyeux Noël" 
  },
  { 
    id: "noel-2", 
    name: "Flocons", 
    category: "Noël", 
    emoji: "❄️", 
    bgType: "slate",
    cornerEmoji: "🎁",
    overlayText: "Let it snow" 
  },
  { 
    id: "paques-1", 
    name: "Chasse aux œufs", 
    category: "Pâques", 
    emoji: "🥚", 
    bgType: "kraft",
    cornerEmoji: "🌸",
    overlayText: "Joyeuses Pâques" 
  },
  { 
    id: "paques-2", 
    name: "Lapin", 
    category: "Pâques", 
    emoji: "🐰", 
    bgType: "kraft",
    cornerEmoji: "🥕",
    overlayText: "Pâques" 
  },
  { 
    id: "stpatrick-1", 
    name: "Trèfle", 
    category: "St-Patrick", 
    emoji: "☘️", 
    bgType: "greenWood",
    cornerEmoji: "🪙",
    overlayText: "St. Patrick" 
  },
  { 
    id: "anniv-1", 
    name: "Confettis", 
    category: "Anniversaire", 
    emoji: "🎂", 
    bgType: "chalkboard",
    cornerEmoji: "🎉",
    overlayText: "Bon Anniversaire!" 
  },
  { 
    id: "anniv-2", 
    name: "Ballons", 
    category: "Anniversaire", 
    emoji: "🎈", 
    bgType: "slate",
    cornerEmoji: "🎈",
    overlayText: "Happy Birthday" 
  },
  { 
    id: "anniv-3", 
    name: "Étoiles", 
    category: "Anniversaire", 
    emoji: "⭐", 
    bgType: "chalkboard",
    cornerEmoji: "🎉",
    overlayText: "Joyeux Anniversaire" 
  }
];

// Custom / Gala Frames list
export const customFrames = [
  { 
    id: "gala-1", 
    name: "Gala Élégant", 
    emoji: "✨", 
    bgType: "chalkboard",
    cornerEmoji: "★"
  },
  { 
    id: "gala-2", 
    name: "Soirée Prestige", 
    emoji: "🥂", 
    bgType: "slate",
    cornerEmoji: "★"
  },
  { 
    id: "corpo-1", 
    name: "Événement Pro", 
    emoji: "💼", 
    bgType: "marble",
    cornerEmoji: "🔹"
  },
  { 
    id: "corpo-2", 
    name: "Conférence", 
    emoji: "🎤", 
    bgType: "slate",
    cornerEmoji: "🔹"
  },
  { 
    id: "mariage-1", 
    name: "Mariage", 
    emoji: "💍", 
    bgType: "marble",
    cornerEmoji: "🌸"
  },
  { 
    id: "minimal-1", 
    name: "Minimaliste", 
    emoji: "◻️", 
    bgType: "marble",
    cornerEmoji: "◽"
  }
];

export const frameCategories = ["Halloween", "Noël", "Pâques", "St-Patrick", "Anniversaire"];

// Default mockup Unsplash image
export const defaultMockupImage = "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&fit=crop";

/**
 * Component to render a photobooth card preview matching the TemplatesBooth layouts
 * and card styling options.
 */
export function FrameOverlay({ 
  frame, 
  customText, 
  photoUrl, 
  videoRef, 
  stream,
  className = "", 
  layout = 'single', 
  aspectRatio = '4:3', 
  captureIndex = 0, 
  capturedPhotos = [] 
}) {
  if (!frame) return null;
  const overlayText = customText !== undefined ? customText : (frame.overlayText || "");
  const bgStyle = getBgStyle(frame.bgType || 'wood');

  const hasWidth = className && (className.includes('w-') || className.includes('max-w-'));
  const widthClass = hasWidth ? 'w-full' : (
    layout === 'strip' 
      ? 'w-[180px] sm:w-[220px]' 
      : (layout === 'grid' ? 'w-[320px] sm:w-[380px]' : 'w-[280px] sm:w-[320px]')
  );

  const getCardAspectClass = () => {
    if (layout === 'strip') {
      if (aspectRatio === '16:9') return 'aspect-[1/2.6]';
      if (aspectRatio === '3:4') return 'aspect-[1/4.2]';
      if (aspectRatio === '9:16') return 'aspect-[1/5.5]';
      return 'aspect-[1/3.2]'; // 4:3 or 1:1
    } else { // single or grid
      if (aspectRatio === '16:9') return 'aspect-[4/3.5]';
      if (aspectRatio === '3:4') return 'aspect-[3/4.5]';
      if (aspectRatio === '9:16') return 'aspect-[3/5.5]';
      return 'aspect-[3/4]'; // default
    }
  };

  // If photoUrl is a compiled collage, render it directly spanning the card
  if (photoUrl && typeof photoUrl === 'string' && (photoUrl.startsWith('data:image') || photoUrl.includes('/api/photos') || photoUrl.startsWith('http'))) {
    return (
      <div 
        className={`relative overflow-hidden shadow-2xl rounded-2xl border border-white/10 select-none mx-auto ${widthClass} ${className} ${
          getCardAspectClass()
        }`}
      >
        <img src={photoUrl} alt="Photo Booth Collage" className="w-full h-full object-cover animate-fade-in" />
      </div>
    );
  }

  const getAspectClass = () => {
    if (aspectRatio === '1:1') return 'aspect-square';
    if (aspectRatio === '16:9') return 'aspect-[16/9]';
    if (aspectRatio === '3:4') return 'aspect-[3/4]';
    if (aspectRatio === '9:16') return 'aspect-[9/16]';
    return 'aspect-[4/3]'; // Default '4:3'
  };

// Sub-component to manage slot-level scroll-into-view triggers
function PhotoSlot({ 
  index, 
  isActive, 
  isCaptured, 
  capturedPhotos, 
  videoRef, 
  photoUrl, 
  frame, 
  layout, 
  getAspectClass 
}) {
  const slotRef = React.useRef(null);

  React.useEffect(() => {
    if (isActive && slotRef.current) {
      const timer = setTimeout(() => {
        slotRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'nearest'
        });
      }, 150); // Small delay to let rendering complete
      return () => clearTimeout(timer);
    }
  }, [isActive]);

  const isGala = frame?.id?.startsWith('gala') || frame?.id?.startsWith('corpo') || frame?.id?.startsWith('mariage');
  const isAnniversary = frame?.category === 'Anniversaire' || isGala;
  
  let slotBorderClass = "border-[4px] md:border-[6px] border-white bg-white";
  let slotBorderStyle = {};
  
  if (isAnniversary) {
    slotBorderClass = "border-[3px] bg-zinc-950";
    slotBorderStyle = { borderColor: '#bf953f' };
  } else if (frame?.category === 'Halloween') {
    slotBorderClass = "border-[3px] bg-zinc-950";
    slotBorderStyle = { borderColor: '#ff8c00' };
  } else if (frame?.category === 'Noël') {
    slotBorderClass = "border-[3px] bg-zinc-950";
    slotBorderStyle = { borderColor: '#cc0000' };
  } else if (frame?.category === 'St-Patrick') {
    slotBorderClass = "border-[3px] bg-zinc-950";
    slotBorderStyle = { borderColor: '#008000' };
  } else if (frame?.category === 'Pâques') {
    slotBorderClass = "border-[3px] bg-zinc-950";
    slotBorderStyle = { borderColor: '#ffd166' };
  }

  return (
    <div 
      ref={slotRef}
      className={`w-full relative shadow-md rounded overflow-hidden group transition-all duration-300 shrink-0 ${slotBorderClass}`}
      style={slotBorderStyle}
    >
      <div className={`w-full overflow-hidden bg-zinc-950 relative ${getAspectClass()}`}>
        {isCaptured ? (
          <img 
            src={capturedPhotos[index]} 
            alt={`Capture ${index + 1}`}
            className="w-full h-full object-cover animate-fade-in" 
          />
        ) : isActive ? (
          videoRef ? (
            <div className="w-full h-full scale-x-[-1] overflow-hidden relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
              />
            </div>
          ) : photoUrl ? (
            <div className="w-full h-full scale-x-[-1] overflow-hidden relative">
              <img
                src={photoUrl}
                alt="Aperçu Live"
                className="w-full h-full object-cover"
                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
              />
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-zinc-600 animate-pulse bg-zinc-900">
              <span className="text-[10px] font-heading font-bold">En direct...</span>
            </div>
          )
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-zinc-900/70 text-zinc-500 text-sm font-heading font-semibold">
            {index + 1}
          </div>
        )}
      </div>
      {/* Repeating column/corner ornaments overlapping the photo borders */}
      {frame.cornerEmoji && (
        <span className="absolute -bottom-1 -right-1 text-xs md:text-sm z-10 pointer-events-none select-none filter drop-shadow">
          {frame.cornerEmoji}
        </span>
      )}
    </div>
  );
}

  const renderSlot = (index) => {
    const isCaptured = capturedPhotos && capturedPhotos[index];
    const isActive = index === captureIndex;

    return (
      <PhotoSlot
        key={index}
        index={index}
        isActive={isActive}
        isCaptured={isCaptured}
        capturedPhotos={capturedPhotos}
        videoRef={videoRef}
        photoUrl={photoUrl}
        frame={frame}
        layout={layout}
        getAspectClass={getAspectClass}
      />
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      style={bgStyle}
      className={`relative mx-auto rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex flex-col justify-between p-3 select-none shrink-0 ${widthClass} ${className} ${
        getCardAspectClass()
      }`}
    >
      {/* Visual Overlays for Festive themes */}
      <FrameDecorations category={frame.category} frameId={frame.id} />

      {/* Top Banner Header / Logo */}
      <div className="flex items-center justify-center py-1 relative z-10">
        <span className="text-xl md:text-2xl filter drop-shadow-md select-none">
          {frame.emoji}
        </span>
      </div>

      {/* Collage Slots Area */}
      <div className="flex-1 flex flex-col justify-center px-1 py-1.5 relative z-10">
        {layout === 'single' && (
          <div className="w-full max-w-[90%] mx-auto">
            {renderSlot(0)}
          </div>
        )}

        {layout === 'strip' && (
          <div className="flex flex-col gap-2 w-full">
            {renderSlot(0)}
            {renderSlot(1)}
            {renderSlot(2)}
          </div>
        )}

        {layout === 'grid' && (
          <div className="grid grid-cols-2 gap-2 w-full">
            {renderSlot(0)}
            {renderSlot(1)}
            {renderSlot(2)}
            {renderSlot(3)}
          </div>
        )}
      </div>

      {/* Footer Title & Text */}
      <div className="flex flex-col items-center justify-center text-center pt-2 pb-1 relative z-10">
        <p className="text-yellow-500 font-serif text-[8px] md:text-[10px] tracking-[0.2em] uppercase font-semibold filter drop-shadow">
          {frame.name}
        </p>
        {overlayText ? (
          <p className="text-white font-script text-lg md:text-2xl leading-none truncate max-w-[90%] filter drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.9)]">
            {overlayText}
          </p>
        ) : (
          <p className="text-zinc-500/50 font-script text-base leading-none">
            Texte...
          </p>
        )}
      </div>

      {/* Card outer corner ornaments */}
      {frame.cornerEmoji && (
        <>
          <span className="absolute top-2 left-2 text-xs md:text-sm z-20 opacity-70 pointer-events-none select-none">
            {frame.cornerEmoji}
          </span>
          <span className="absolute top-2 right-2 text-xs md:text-sm z-20 opacity-70 pointer-events-none select-none">
            {frame.cornerEmoji}
          </span>
          <span className="absolute bottom-2 left-2 text-xs md:text-sm z-20 opacity-70 pointer-events-none select-none">
            {frame.cornerEmoji}
          </span>
          <span className="absolute bottom-2 right-2 text-xs md:text-sm z-20 opacity-70 pointer-events-none select-none">
            {frame.cornerEmoji}
          </span>
        </>
      )}
    </motion.div>
  );
}

export function FrameSelectorGrid({ frames, selectedFrame, onSelect }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {frames.map((frame) => {
        const isSelected = selectedFrame?.id === frame.id;
        const bgStyle = getBgStyle(frame.bgType || 'wood');
        return (
          <motion.button
            key={frame.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(frame)}
            style={bgStyle}
            className={`relative aspect-[3/4] rounded-xl overflow-hidden border-2 transition-all flex flex-col justify-between p-2 select-none shadow-sm ${
              isSelected ? "border-primary ring-2 ring-primary/45 scale-[1.02]" : "border-border/60 hover:border-white/40"
            }`}
          >
            {/* Miniature frame header emoji */}
            <div className="flex items-center justify-center">
              <span className="text-xs filter drop-shadow">{frame.emoji}</span>
            </div>
            
            {/* Miniature photo slots inside the ticket */}
            <div className="w-[85%] mx-auto flex flex-col gap-0.5 p-1 bg-white/10 backdrop-blur-[1px] border border-white/20 rounded-md aspect-[3/4] items-center justify-center">
              <div className="w-full aspect-[4/3] bg-zinc-950/20 border border-white/30 rounded flex items-center justify-center">
                <span className="text-[6px] text-white/50">📸</span>
              </div>
              <div className="w-full aspect-[4/3] bg-zinc-950/20 border border-white/30 rounded flex items-center justify-center">
                <span className="text-[6px] text-white/50">📸</span>
              </div>
            </div>

            {/* Miniature frame footer title */}
            <div className="flex items-center justify-center w-full">
              <span className="text-[7px] text-white font-medium truncate max-w-full filter drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
                {frame.name}
              </span>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}

