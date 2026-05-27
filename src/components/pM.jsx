import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Monitor, Smartphone, LogOut } from 'lucide-react';
import { kt, socket } from '../utils/syncClient';
import { FrameOverlay, FrameSelectorGrid, thematicFrames, customFrames, frameCategories } from './FrameOverlay';

export default function MobileFrameSelection({ onCapture, queueEntry, stream, kioskPreviewFrame, onCameraSourceChange, onQuit }) {
  const [cameraSource, setCameraSource] = useState(queueEntry?.camera_source || 'mobile'); // 'mobile' | 'kiosk'
  const [selectedFrame, setSelectedFrame] = useState(queueEntry?.frame || thematicFrames[0]);
  const [customText, setCustomText] = useState(queueEntry?.custom_text || (queueEntry?.frame || thematicFrames[0]).overlayText || 'Réunion famille 2026');
  const [aspectRatio, setAspectRatio] = useState(queueEntry?.aspect_ratio || '4:3'); // '1:1' | '4:3' | '16:9' | '3:4' | '9:16'
  const [layout, setLayout] = useState(queueEntry?.layout || 'single'); // 'single' | 'strip' | 'grid'

  // Helper to determine initial orientation and ratioType from queueEntry
  const getInitialStates = () => {
    const initialRatio = queueEntry?.aspect_ratio || '4:3';
    if (initialRatio === '1:1') return { orientation: 'portrait', ratioType: 'square' };
    if (initialRatio === '3:4') return { orientation: 'portrait', ratioType: 'standard' };
    if (initialRatio === '9:16') return { orientation: 'portrait', ratioType: 'widescreen' };
    if (initialRatio === '16:9') return { orientation: 'landscape', ratioType: 'widescreen' };
    return { orientation: 'landscape', ratioType: 'standard' }; // default '4:3'
  };

  const initialStates = getInitialStates();
  const [orientation, setOrientation] = useState(initialStates.orientation); // 'landscape' | 'portrait'
  const [ratioType, setRatioType] = useState(initialStates.ratioType); // 'square' | 'standard' | 'widescreen'
  const [activeTab, setActiveTab] = useState('thematic'); // 'thematic' | 'custom'
  const [activeCategory, setActiveCategory] = useState('all');
  
  const videoElementRef = useRef(null);

  // Callback ref to bind the stream to the video element whenever it mounts/remounts
  const videoRef = useCallback((node) => {
    if (node === null) {
      if (videoElementRef.current) {
        try {
          videoElementRef.current.srcObject = null;
          videoElementRef.current.load();
        } catch (e) {
          console.warn('[pM] Error cleaning up unmounting video element:', e);
        }
      }
      videoElementRef.current = null;
    } else {
      videoElementRef.current = node;
      console.log('[pM] videoRef callback called with node:', node, 'stream:', stream);
      if (stream && cameraSource === 'mobile') {
        if (node.srcObject !== stream) {
          node.srcObject = stream;
        }
        node.play()
          .then(() => console.log('[pM] Mobile camera playback started successfully'))
          .catch(err => console.error("[pM] Error starting mobile camera preview playback:", err));
      }
    }
  }, [stream, cameraSource]);

  // Push frame updates to server in real-time
  const pushConfiguration = async (frame, text, source, currentRatio = aspectRatio, currentLayout = layout) => {
    if (queueEntry) {
      const captureTotal = currentLayout === 'single' ? 1 : (currentLayout === 'strip' ? 3 : 4);
      await kt.entities.QueueEntry.update(queueEntry.id, {
        frame: frame,
        custom_text: text,
        camera_source: source,
        aspect_ratio: currentRatio,
        layout: currentLayout,
        capture_total: captureTotal
      });
    }
  };

  // Sync initial configuration on mount
  useEffect(() => {
    pushConfiguration(selectedFrame, customText, cameraSource, aspectRatio, layout);
  }, []);

  // Handle Camera Source toggle
  const handleCameraToggle = (source) => {
    setCameraSource(source);
    onCameraSourceChange(source); // Trigger stream lifecycle start/stop in parent
    pushConfiguration(selectedFrame, customText, source, aspectRatio, layout);
  };

  const getAspectRatioString = (orient, type) => {
    if (type === 'square') return '1:1';
    if (orient === 'portrait') {
      return type === 'widescreen' ? '9:16' : '3:4';
    } else {
      return type === 'widescreen' ? '16:9' : '4:3';
    }
  };

  // Handle Orientation Change
  const handleOrientationChange = (orient) => {
    setOrientation(orient);
    const nextRatio = getAspectRatioString(orient, ratioType);
    setAspectRatio(nextRatio);
    pushConfiguration(selectedFrame, customText, cameraSource, nextRatio, layout);
  };

  // Handle Ratio Type Change
  const handleRatioTypeChange = (type) => {
    setRatioType(type);
    const nextRatio = getAspectRatioString(orientation, type);
    setAspectRatio(nextRatio);
    pushConfiguration(selectedFrame, customText, cameraSource, nextRatio, layout);
  };

  // Handle Layout Change
  const handleLayoutChange = (lay) => {
    setLayout(lay);
    pushConfiguration(selectedFrame, customText, cameraSource, aspectRatio, lay);
  };

  // Handle Tab Switch
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    let nextFrame = tab === 'thematic' ? thematicFrames[0] : customFrames[0];
    let nextText = tab === 'thematic' ? (nextFrame.overlayText || '') : customText;
    setSelectedFrame(nextFrame);
    setCustomText(nextText);
    
    pushConfiguration(nextFrame, nextText, cameraSource, aspectRatio, layout);
  };

  // Handle frame selection
  const handleSelectFrame = (frame) => {
    const nextFrame = activeTab === 'custom' ? { ...frame, overlayText: customText } : frame;
    const nextText = activeTab === 'custom' ? customText : (frame.overlayText || '');
    
    setSelectedFrame(nextFrame);
    setCustomText(nextText);
    pushConfiguration(nextFrame, nextText, cameraSource, aspectRatio, layout);
  };

  // Handle custom text input
  const handleTextChangeCallback = (txt) => {
    setCustomText(txt);
    if (selectedFrame) {
      const nextFrame = { ...selectedFrame, overlayText: txt };
      setSelectedFrame(nextFrame);
      pushConfiguration(nextFrame, txt, cameraSource, aspectRatio, layout);
    }
  };

  const handleTextChange = (e) => {
    handleTextChangeCallback(e.target.value);
  };

  // Trigger countdown sequence
  const triggerCapture = async () => {
    const text = customText;
    const captureTotal = layout === 'single' ? 1 : (layout === 'strip' ? 3 : 4);
    
    if (cameraSource === 'kiosk') {
      if (queueEntry) {
        await kt.entities.QueueEntry.update(queueEntry.id, {
          frame: selectedFrame,
          custom_text: text,
          capture_state: 'countdown',
          camera_source: 'kiosk',
          aspect_ratio: aspectRatio,
          layout: layout,
          capture_index: 0,
          capture_total: captureTotal
        });
      }
      onCapture(selectedFrame, text, 'kiosk', layout, aspectRatio);
    } else {
      if (queueEntry) {
        await kt.entities.QueueEntry.update(queueEntry.id, {
          frame: selectedFrame,
          custom_text: text,
          capture_state: 'countdown',
          camera_source: 'mobile',
          aspect_ratio: aspectRatio,
          layout: layout,
          capture_index: 0,
          capture_total: captureTotal
        });
      }
      onCapture(selectedFrame, text, 'mobile', layout, aspectRatio);
    }
  };

  // Filter thematic frames
  const filteredThematic = activeCategory === 'all'
    ? thematicFrames
    : thematicFrames.filter(f => f.category === activeCategory);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen flex flex-col px-4 py-6 max-w-md mx-auto"
    >
      <div className="flex items-center justify-between mb-1">
        <div className="w-8" /> {/* spacer */}
        <h2 className="font-heading text-xl font-bold text-foreground text-center flex-1">
          Personnalisez votre photo
        </h2>
        {onQuit && (
          <button
            onClick={() => {
              if (window.confirm("Quitter la session ? Vous perdrez votre place.")) {
                onQuit();
              }
            }}
            className="w-8 h-8 rounded-lg border border-destructive/30 text-destructive hover:bg-destructive/10 flex items-center justify-center transition-all"
            title="Quitter la session"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
      <p className="text-muted-foreground text-xs text-center mb-4 uppercase tracking-wider font-semibold text-primary">
        C'est votre tour !
      </p>

      {/* Camera Selection Toggle */}
      <div className="grid w-full grid-cols-2 bg-secondary/80 p-1 rounded-xl mb-4 border border-border shadow-sm">
        <button
          onClick={() => handleCameraToggle('mobile')}
          className={`py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
            cameraSource === 'mobile' 
              ? 'bg-primary text-primary-foreground shadow-md' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          Mon Smartphone
        </button>
        <button
          onClick={() => handleCameraToggle('kiosk')}
          className={`py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
            cameraSource === 'kiosk' 
              ? 'bg-primary text-primary-foreground shadow-md' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Monitor className="w-3.5 h-3.5" />
          Borne PC
        </button>
      </div>

      {/* Live frame preview area */}
      <div className="mb-4 relative flex justify-center items-center shrink-0">
        {selectedFrame ? (
          <>
            <FrameOverlay
              frame={selectedFrame}
              customText={customText}
              photoUrl={cameraSource === 'kiosk' ? kioskPreviewFrame : null}
              videoRef={cameraSource === 'mobile' && stream ? videoRef : null}
              stream={cameraSource === 'mobile' ? stream : null}
              layout={layout}
              aspectRatio={aspectRatio}
              onTextChange={handleTextChangeCallback}
            />
            {cameraSource === 'kiosk' && !kioskPreviewFrame && (
              <div className="absolute inset-0 bg-black/85 rounded-2xl flex flex-col items-center justify-center text-center p-4 gap-2 z-20">
                <Monitor className="w-8 h-8 text-primary animate-pulse" />
                <p className="text-sm font-heading font-semibold text-foreground">Connexion Borne...</p>
                <p className="text-xs text-muted-foreground max-w-[160px]">
                  Récupération du flux vidéo de la borne...
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="w-full aspect-[3/4] max-w-[280px] mx-auto rounded-xl bg-secondary/50 border border-dashed border-border flex items-center justify-center">
            <p className="text-muted-foreground text-sm">Sélectionnez un cadre</p>
          </div>
        )}
      </div>

      {/* Take Photo Action Button (Moved below camera preview) */}
      {selectedFrame && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-4"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={triggerCapture}
            className="w-full h-14 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-heading font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20"
          >
            <Camera className="w-5 h-5" />
            {cameraSource === 'kiosk' ? "Déclencher la borne" : "Prendre la photo"}
          </motion.button>
        </motion.div>
      )}

      {/* Composition, Orientation & Ratio Controls */}
      <div className="space-y-3 mb-4 bg-secondary/30 border border-border/60 p-3 rounded-2xl">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
              Orientation
            </label>
            <div className="grid grid-cols-2 gap-1 bg-secondary/85 p-0.5 rounded-lg border border-border/40 font-heading">
              {[
                { id: 'landscape', label: 'Paysage' },
                { id: 'portrait', label: 'Portrait' }
              ].map((orient) => (
                <button
                  key={orient.id}
                  onClick={() => handleOrientationChange(orient.id)}
                  className={`py-1 text-[10px] font-bold rounded-md transition-all ${
                    orientation === orient.id
                      ? 'bg-primary text-primary-foreground shadow'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {orient.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
              Composition
            </label>
            <div className="grid grid-cols-3 gap-1 bg-secondary/85 p-0.5 rounded-lg border border-border/40 font-heading">
              {[
                { id: 'single', label: '1' },
                { id: 'strip', label: 'Bande' },
                { id: 'grid', label: 'Grille' }
              ].map((comp) => (
                <button
                  key={comp.id}
                  onClick={() => handleLayoutChange(comp.id)}
                  className={`py-1 text-[10px] font-bold rounded-md transition-all truncate ${
                    layout === comp.id
                      ? 'bg-primary text-primary-foreground shadow'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  title={comp.id === 'single' ? 'Simple' : comp.id === 'strip' ? 'Bande de 3' : 'Grille de 4'}
                >
                  {comp.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
            Format d'image (Ratio)
          </label>
          <div className="grid grid-cols-3 gap-1 bg-secondary/85 p-0.5 rounded-lg border border-border/40 font-heading">
            {[
              { id: 'square', label: 'Carré (1:1)' },
              { id: 'standard', label: orientation === 'portrait' ? 'Standard (3:4)' : 'Standard (4:3)' },
              { id: 'widescreen', label: orientation === 'portrait' ? 'Large (9:16)' : 'Large (16:9)' }
            ].map((ratio) => (
              <button
                key={ratio.id}
                onClick={() => handleRatioTypeChange(ratio.id)}
                className={`py-1 text-[10px] font-bold rounded-md transition-all ${
                  ratioType === ratio.id
                    ? 'bg-primary text-primary-foreground shadow'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {ratio.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs Control */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="grid w-full grid-cols-2 bg-secondary/80 p-1 rounded-lg mb-3">
          <button
            onClick={() => handleTabChange('thematic')}
            className={`py-1.5 text-xs font-medium rounded-md transition-all ${
              activeTab === 'thematic' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Thématiques
          </button>
          <button
            onClick={() => handleTabChange('custom')}
            className={`py-1.5 text-xs font-medium rounded-md transition-all ${
              activeTab === 'custom' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Personnalisés
          </button>
        </div>

        {/* Tab 1 Content: Thematic Selection */}
        {activeTab === 'thematic' && (
          <div className="space-y-3 flex-1 overflow-y-auto no-scrollbar">
            {/* Categories horizontal filter */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              <button
                onClick={() => setActiveCategory('all')}
                className={`shrink-0 text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
                  activeCategory === 'all' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                }`}
              >
                Tous
              </button>
              {frameCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`shrink-0 text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
                    activeCategory === cat ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            
            {/* Thematic selector grid */}
            <FrameSelectorGrid
              frames={filteredThematic}
              selectedFrame={selectedFrame}
              onSelect={handleSelectFrame}
            />
          </div>
        )}

        {/* Tab 2 Content: Custom Banner Text & Frame Selection */}
        {activeTab === 'custom' && (
          <div className="space-y-3 flex-1 overflow-y-auto no-scrollbar">
            <input
              type="text"
              placeholder="Votre texte personnalisé"
              value={customText}
              onChange={handleTextChange}
              maxLength={25}
              className="w-full h-11 px-3 bg-secondary border border-border text-foreground text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
            
            {/* Custom/Gala selector grid */}
            <FrameSelectorGrid
              frames={customFrames}
              selectedFrame={selectedFrame}
              onSelect={handleSelectFrame}
            />
          </div>
        )}
      </div>

    </motion.div>
  );
}
