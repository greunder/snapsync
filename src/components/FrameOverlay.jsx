import React from 'react';
import { motion } from 'framer-motion';

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
    bgType: "confetti",
    cornerEmoji: "🎉",
    overlayText: "Bon Anniversaire!" 
  },
  { 
    id: "anniv-2", 
    name: "Ballons", 
    category: "Anniversaire", 
    emoji: "🎈", 
    bgType: "confetti",
    cornerEmoji: "🎈",
    overlayText: "Happy Birthday" 
  },
  { 
    id: "anniv-3", 
    name: "Étoiles", 
    category: "Anniversaire", 
    emoji: "⭐", 
    bgType: "confetti",
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
    bgType: "wood",
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

  return (
    <div 
      ref={slotRef}
      className="w-full relative shadow-md rounded border-[4px] md:border-[6px] border-white bg-white overflow-hidden group transition-all duration-300 shrink-0"
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

