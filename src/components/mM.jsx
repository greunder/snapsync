import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateFramedPhoto, captureVideoSnapshot } from '../utils/photoGenerator';
import { FrameOverlay } from './FrameOverlay';
import { kt } from '../utils/syncClient';

export default function MobileCountdown({ 
  queueEntry, 
  layout = 'single', 
  aspectRatio = '4:3', 
  cameraSource = 'mobile',
  onComplete, 
  stream, 
  photoUrl, 
  frame, 
  customText 
}) {
  const totalPhotos = layout === 'single' ? 1 : (layout === 'strip' ? 3 : 4);

  // If mobile camera source, use local state. Otherwise, mirror kiosk state from database.
  const isMobile = cameraSource === 'mobile';
  
  const [localCaptureIndex, setLocalCaptureIndex] = useState(0);
  const [localCount, setLocalCount] = useState(3);
  const [localCapturedPhotos, setLocalCapturedPhotos] = useState([]);
  
  const count = isMobile ? localCount : (queueEntry?.countdown_count !== undefined ? queueEntry.countdown_count : -1);
  const capturedPhotos = isMobile ? localCapturedPhotos : (queueEntry?.captured_photos || []);
  const captureIndex = isMobile ? localCaptureIndex : (queueEntry?.capture_index || 0);

  const [showFlash, setShowFlash] = useState(false);
  
  const isKioskCompiling = cameraSource === 'kiosk' && 
    capturedPhotos.length === totalPhotos && 
    (!queueEntry?.photo_url);

  const [isCompiling, setIsCompiling] = useState(false);
  const compiling = isMobile ? isCompiling : isKioskCompiling;

  const videoElementRef = useRef(null);
  const persistentVideoRef = useRef(null);
  const isCapturingRef = useRef(false);

  // Play stream on the persistent video element to prevent stream suspension and ensure stable captures
  useEffect(() => {
    if (persistentVideoRef.current && stream) {
      persistentVideoRef.current.srcObject = stream;
      persistentVideoRef.current.play()
        .then(() => console.log('[MobileCountdown] Persistent stream video playback active'))
        .catch(err => console.error("[MobileCountdown] Error playing persistent video stream:", err));
    }
  }, [stream]);

  // Callback ref to bind stream to the video element
  const videoRef = useCallback((node) => {
    if (node === null) {
      if (videoElementRef.current) {
        try {
          videoElementRef.current.srcObject = null;
          videoElementRef.current.load();
        } catch (e) {
          console.warn('[MobileCountdown] Error cleaning up unmounting video element:', e);
        }
      }
      videoElementRef.current = null;
    } else {
      videoElementRef.current = node;
      console.log('[MobileCountdown] videoRef callback with stream:', stream);
      if (stream) {
        if (node.srcObject !== stream) {
          node.srcObject = stream;
        }
        node.play()
          .then(() => console.log('[MobileCountdown] Live stream playback active'))
          .catch(err => console.error("[MobileCountdown] Error playing video stream:", err));
      }
    }
  }, [stream]);

  // Flash synchronization in Kiosk mode
  useEffect(() => {
    if (cameraSource === 'kiosk' && queueEntry?.countdown_count === 0) {
      setShowFlash(true);
      const timer = setTimeout(() => {
        setShowFlash(false);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [queueEntry?.countdown_count, cameraSource]);

  // Countdown timer effect for local mobile camera mode
  useEffect(() => {
    if (!isMobile) return;

    if (count === 0) {
      if (isCapturingRef.current) return;
      isCapturingRef.current = true;
      setShowFlash(true);

      const performCapture = async () => {
        let snapshot = null;
        if (stream && persistentVideoRef.current) {
          snapshot = await captureVideoSnapshot(persistentVideoRef.current, aspectRatio);
        } else if (photoUrl) {
          snapshot = photoUrl;
        }

        const nextPhotos = [...capturedPhotos, snapshot];

        // Flash duration hold
        setTimeout(async () => {
          setShowFlash(false);
          setLocalCapturedPhotos(nextPhotos);

          if (captureIndex < totalPhotos - 1) {
            const nextIndex = captureIndex + 1;
            setLocalCaptureIndex(nextIndex);
            setLocalCount(3); // Reset countdown for the next photo
            isCapturingRef.current = false; // Reset capturing flag for next pose

            // Broadcast the next capture index to the server
            if (queueEntry) {
              await kt.entities.QueueEntry.update(queueEntry.id, {
                capture_index: nextIndex
              });
            }
          } else {
            setIsCompiling(true);
            
            // Immediately release mobile camera stream tracks to free GPU/CPU memory
            // before running canvas compilation
            if (stream) {
              try {
                stream.getTracks().forEach(track => track.stop());
                console.log('[MobileCountdown] Camera tracks stopped before collage compilation');
              } catch (err) {
                console.error('[MobileCountdown] Error stopping tracks:', err);
              }
            }

            const compiled = await generateFramedPhoto(nextPhotos, frame, customText, layout, aspectRatio);
            
            // Upload collage to server
            if (queueEntry) {
              await kt.entities.QueueEntry.update(queueEntry.id, {
                photo_url: compiled,
                capture_state: 'captured'
              });
            }

            isCapturingRef.current = false;
            onComplete(compiled);
          }
        }, 600);
      };

      performCapture();
      return;
    }

    const interval = setTimeout(() => {
      setLocalCount(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(interval);
  }, [count, stream, frame, customText, captureIndex, totalPhotos, capturedPhotos, aspectRatio, layout, photoUrl, queueEntry, onComplete, isMobile]);

  return (
    <div className="fixed inset-0 bg-background text-foreground z-50 flex flex-col items-center justify-start py-12 px-4 overflow-y-auto">
      
      {/* Responsive layout frame cards preview in center */}
      <div className="relative z-10 w-full flex flex-col items-center max-w-[340px] md:max-w-[420px]">
        {compiling ? (
          <div className="flex flex-col items-center gap-4 py-12 text-center text-foreground">
            <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
            <p className="font-heading font-semibold text-base text-primary">Génération du collage...</p>
            <p className="text-xs text-muted-foreground">Veuillez patienter pendant la création de votre souvenir.</p>
          </div>
        ) : (
          <>
            <FrameOverlay
              frame={frame}
              customText={customText}
              videoRef={stream ? videoRef : null}
              stream={stream}
              photoUrl={photoUrl}
              layout={layout}
              aspectRatio={aspectRatio}
              captureIndex={captureIndex}
              capturedPhotos={capturedPhotos}
              className="shadow-2xl border border-border"
            />

            <div className="mt-4 bg-card px-4 py-1.5 rounded-full border border-border text-foreground text-xs font-semibold uppercase tracking-wider shadow-sm">
              Photo {captureIndex + 1} / {totalPhotos}
            </div>
          </>
        )}
      </div>

      {/* Giant Countdown floating number overlay */}
      <AnimatePresence>
        {count > 0 && !compiling && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-30 bg-transparent pointer-events-none">
            <motion.span
              key={count}
              initial={{ scale: 3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.3, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="font-heading text-[10rem] font-black text-primary filter drop-shadow-[0_4px_25px_rgba(255,86,34,0.45)] select-none"
            >
              {count}
            </motion.span>
            <p className="text-primary font-heading text-xl font-black tracking-widest uppercase mt-4 animate-pulse select-none filter drop-shadow-[0_2px_8px_rgba(255,255,255,0.8)]">
              Souriez !
            </p>
          </div>
        )}
      </AnimatePresence>

      {/* Screen shutter flash overlay */}
      {showFlash && (
        <div className="fixed inset-0 bg-white z-[100] pointer-events-none" />
      )}

      {/* Hidden persistent webcam video element for stable snapshot captures */}
      {stream && (
        <div style={{ position: 'absolute', overflow: 'hidden', width: '320px', height: '240px', left: '-9999px', top: '-9999px', pointerEvents: 'none' }}>
          <video
            ref={persistentVideoRef}
            autoPlay
            playsInline
            muted
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      )}
    </div>
  );
}
