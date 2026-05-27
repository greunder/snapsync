import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScanLine, Camera, Monitor, Trash2 } from 'lucide-react';
import { kt, socket } from '../utils/syncClient';
import { FrameOverlay } from './FrameOverlay';
import { generateFramedPhoto, captureVideoSnapshot } from '../utils/photoGenerator';
import { QueueSidebar } from './QueueSidebar';

export default function KioskView() {
  const [queue, setQueue] = useState([]);
  const [localIp, setLocalIp] = useState('');
  const [capturedPhotos, setCapturedPhotos] = useState([]);
  
  // Kiosk PC webcam stream states
  const [kioskStream, setKioskStream] = useState(null);
  const kioskVideoElementRef = useRef(null);
  const persistentVideoRef = useRef(null);
  const isCapturingRef = useRef(false);

  // Play stream on the persistent video element to prevent stream suspension and ensure stable captures
  useEffect(() => {
    if (persistentVideoRef.current && kioskStream) {
      persistentVideoRef.current.srcObject = kioskStream;
      persistentVideoRef.current.play()
        .then(() => console.log('[KioskView] Persistent webcam video playback active'))
        .catch(err => console.error("[KioskView] Error playing persistent video stream:", err));
    }
  }, [kioskStream]);


  // Callback ref to bind the stream to the video element whenever it mounts/remounts
  const kioskVideoRef = useCallback((node) => {
    if (node === null) {
      if (kioskVideoElementRef.current) {
        try {
          kioskVideoElementRef.current.srcObject = null;
          kioskVideoElementRef.current.load();
        } catch (e) {
          console.warn('[KioskView] Error cleaning up unmounting video element:', e);
        }
      }
      kioskVideoElementRef.current = null;
    } else {
      kioskVideoElementRef.current = node;
      console.log('[KioskView] kioskVideoRef callback called with node:', node, 'stream:', kioskStream);
      if (kioskStream) {
        if (node.srcObject !== kioskStream) {
          node.srcObject = kioskStream;
        }
        node.play()
          .then(() => console.log('[KioskView] Kiosk video playback started successfully'))
          .catch(err => console.error("[KioskView] Error starting kiosk camera video playback:", err));
      }
    }
  }, [kioskStream]);

  // Kiosk countdown states
  const [kioskCount, setKioskCount] = useState(-1);
  const [showFlash, setShowFlash] = useState(false);

  // Fetch queue entries and subscribe to Socket.io realtime broadcasts
  const fetchQueue = useCallback(async () => {
    const entries = await kt.entities.QueueEntry.list();
    setQueue(entries.filter(entry => entry.status !== 'done'));
  }, []);

  // Fetch local network IP for Wi-Fi auto-discovery
  useEffect(() => {
    fetch('/api/ip')
      .then(res => res.json())
      .then(data => setLocalIp(data.ip))
      .catch(err => console.error('Error fetching local IP:', err));
  }, []);

  // Setup Socket.io subscription
  useEffect(() => {
    fetchQueue();
    const unsubscribe = kt.entities.QueueEntry.subscribe((updatedQueue) => {
      setQueue(updatedQueue.filter(entry => entry.status !== 'done'));
    });
    return () => unsubscribe();
  }, [fetchQueue]);

  // Extract current active entry in the queue
  const activeEntry = queue.length > 0 && queue[0].status === 'active' ? queue[0] : null;
  const isKioskCameraActive = activeEntry && activeEntry.camera_source === 'kiosk';

  // Handle PC webcam stream activation/release based on active entry state
  useEffect(() => {
    let activeStream = null;
    
    if (isKioskCameraActive) {
      if (!kioskStream) {
        navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'user',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        })
          .then(s => {
            activeStream = s;
            setKioskStream(s);
          })
          .catch(err => {
            console.error("Kiosk webcam not available:", err);
          });
      }
    } else {
      // Release PC camera if not in Kiosk-Cam mode
      if (kioskStream) {
        kioskStream.getTracks().forEach(track => track.stop());
        setKioskStream(null);
      }
    }

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
      if (kioskStream) {
        kioskStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isKioskCameraActive]);

  // Video element binding is now handled dynamically by the kioskVideoRef callback ref

  // Reset local captured photos if activeEntry changes or is idle
  useEffect(() => {
    if (!activeEntry || activeEntry.capture_state === 'idle') {
      setCapturedPhotos([]);
    }
  }, [activeEntry?.id, activeEntry?.capture_state]);

  // Watch for countdown triggers sent from the mobile remote
  useEffect(() => {
    if (activeEntry && activeEntry.capture_state === 'countdown') {
      const total = activeEntry.capture_total || 1;
      if (kioskCount === -1 && capturedPhotos.length < total) {
        setKioskCount(3);
      }
    } else {
      setKioskCount(-1);
      setShowFlash(false);
    }
  }, [activeEntry, capturedPhotos.length]);

  // Update countdown_count in the database to sync with phone remote
  useEffect(() => {
    if (activeEntry && activeEntry.capture_state === 'countdown') {
      kt.entities.QueueEntry.update(activeEntry.id, {
        countdown_count: kioskCount
      }).catch(err => console.error("Error syncing countdown_count:", err));
    }
  }, [kioskCount, activeEntry?.id]);

  // Run the countdown timer and execute canvas photo capture at 0
  useEffect(() => {
    if (kioskCount === 0) {
      if (isCapturingRef.current) return;
      isCapturingRef.current = true;
      setShowFlash(true);
      
      const captureSnapshot = async () => {
        console.log('[KioskView] captureSnapshot called. Video element ref:', persistentVideoRef.current);
        if (persistentVideoRef.current && activeEntry) {
          // Capture raw cropped snapshot for this slot from the persistent video element
          const snapshot = await captureVideoSnapshot(
            persistentVideoRef.current,
            activeEntry.aspect_ratio || '4:3'
          );
          
          const nextPhotos = [...capturedPhotos, snapshot];
          const total = activeEntry.capture_total || 1;
          
          // Shutter flash effect timeout
          setTimeout(async () => {
            setShowFlash(false);
            setKioskCount(-1);
            setCapturedPhotos(nextPhotos);
            
            // Sync captured photos and capture index to server so phone remote receives them immediately
            await kt.entities.QueueEntry.update(activeEntry.id, {
              captured_photos: nextPhotos,
              capture_index: nextPhotos.length
            });
            
            if (nextPhotos.length < total) {
              isCapturingRef.current = false; // Reset capturing flag for next pose
              // Wait 1.5s before starting the next count to allow user to adjust pose
              setTimeout(() => {
                setKioskCount(3);
              }, 1500);
            } else {
              // Final photo collage compilation!
              const compiledPhoto = await generateFramedPhoto(
                nextPhotos,
                activeEntry.frame,
                activeEntry.custom_text,
                activeEntry.layout || 'single',
                activeEntry.aspect_ratio || '4:3'
              );
              
              // Upload collage and mark capture_state as captured, clean countdown sync fields
              await kt.entities.QueueEntry.update(activeEntry.id, {
                photo_url: compiledPhoto,
                capture_state: 'captured',
                countdown_count: -1,
                captured_photos: nextPhotos
              });
              isCapturingRef.current = false; // Reset capturing flag
            }
          }, 600);
        } else {
          setShowFlash(false);
          setKioskCount(-1);
          isCapturingRef.current = false;
        }
      };
      
      captureSnapshot();
      return;
    }

    if (kioskCount > 0) {
      const timer = setTimeout(() => {
        setKioskCount(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [kioskCount, activeEntry, capturedPhotos]);

  // Emit live low-res preview frames from Kiosk to the Server for the active phone remote
  useEffect(() => {
    if (!kioskStream || !activeEntry) return;

    console.log('[KioskView] Starting live webcam frame stream for mobile remote preview...');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const intervalId = setInterval(() => {
      const video = kioskVideoElementRef.current;
      if (video && video.readyState >= 2) {
        const ratio = activeEntry.aspect_ratio || '4:3';
        let canvasWidth = 320;
        let canvasHeight = 240;
        
        if (ratio === '1:1') {
          canvasWidth = 240;
          canvasHeight = 240;
        } else if (ratio === '16:9') {
          canvasWidth = 320;
          canvasHeight = 180;
        } else if (ratio === '3:4') {
          canvasWidth = 240;
          canvasHeight = 320;
        } else if (ratio === '9:16') {
          canvasWidth = 180;
          canvasHeight = 320;
        }

        if (canvas.width !== canvasWidth || canvas.height !== canvasHeight) {
          canvas.width = canvasWidth;
          canvas.height = canvasHeight;
        }

        ctx.save();
        // Mirror horizontally
        ctx.translate(canvasWidth, 0);
        ctx.scale(-1, 1);

        const vWidth = video.videoWidth;
        const vHeight = video.videoHeight;
        const targetRatio = canvasWidth / canvasHeight;
        const sourceRatio = vWidth / vHeight;

        let sx = 0, sy = 0, sWidth = vWidth, sHeight = vHeight;
        if (sourceRatio > targetRatio) {
          // Crop width
          sWidth = vHeight * targetRatio;
          sx = (vWidth - sWidth) / 2;
        } else {
          // Crop height
          sHeight = vWidth / targetRatio;
          sy = (vHeight - sHeight) / 2;
        }

        ctx.drawImage(video, sx, sy, sWidth, sHeight, 0, 0, canvasWidth, canvasHeight);
        ctx.restore();

        // Convert canvas content to base64 JPEG at 40% quality
        const frameData = canvas.toDataURL('image/jpeg', 0.4);
        
        // Emit via Socket.io
        socket.emit('kiosk_frame_upload', {
          entryId: activeEntry.id,
          frameData: frameData
        });
      }
    }, 250); // 4 frames per second

    return () => {
      console.log('[KioskView] Stopping live webcam frame stream...');
      clearInterval(intervalId);
    };
  }, [kioskStream, activeEntry]);

  // Handle resetting the queue
  const handleResetQueue = async () => {
    if (window.confirm("Voulez-vous vider la file d'attente ?")) {
      await kt.entities.QueueEntry.reset();
      if (kioskStream) {
        kioskStream.getTracks().forEach(track => track.stop());
        setKioskStream(null);
      }
      setKioskCount(-1);
      setShowFlash(false);
    }
  };

  const handleRemoveQueueEntry = async (id, displayName) => {
    if (window.confirm(`Voulez-vous supprimer "${displayName}" de la file d'attente ?`)) {
      await kt.entities.QueueEntry.update(id, { status: 'done' });
    }
  };

  // Construct join URL (use local IP only if accessed via localhost/127.0.0.1, otherwise use current window origin)
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const joinUrl = (isLocalhost && localIp)
    ? `https://${localIp}:8443/join`
    : `${window.location.origin}/join`;
  
  const qrCodeApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(joinUrl)}&bgcolor=ffffff&color=0f172a&margin=1`;

  return (
    <div className="min-h-screen bg-gradient-to-tr from-background via-background to-primary/5 flex flex-col lg:flex-row items-center justify-center lg:items-stretch relative p-6 gap-6 overflow-hidden font-body select-none">
      {/* Full screen white flash simulation */}
      {showFlash && (
        <div className="fixed inset-0 bg-white z-[999] pointer-events-none" />
      )}
      
      {/* Dynamic ambient blobs */}
      <div className="absolute top-[-10%] left-[-15%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-primary/10 to-amber-200/10 filter blur-3xl opacity-75 pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-15%] w-[700px] h-[700px] rounded-full bg-gradient-to-tr from-rose-200/10 to-primary/10 filter blur-3xl opacity-60 pointer-events-none z-0" />
      
      {/* Main Kiosk Dashboard Area (Left/Center) */}
      <div className="flex-1 flex flex-col items-center justify-center relative w-full min-h-0 bg-card/40 backdrop-blur-md border border-border/80 rounded-3xl p-6 lg:p-12 z-10 shadow-sm">
        {/* Brand logo header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => history.pushState(null, '', '/')}
          className="absolute top-6 left-6 flex items-center gap-3 cursor-pointer z-30"
        >
          <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center">
            <Camera className="w-5 h-5 text-primary" />
          </div>
          <span className="font-heading font-bold text-xl text-foreground select-none">SnapSync</span>
        </motion.div>

        {/* Main Kiosk Dashboard - Animated transition between QR Code and live WebCam feed */}
        <AnimatePresence mode="wait">
          {!isKioskCameraActive ? (
            /* STATE 1: Idle Kiosk - Centered QR Code with scanning laser */
            <motion.div
              key="qr-view"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center gap-8 text-center"
            >
              <div className="relative">
                {/* Pulsing halo background */}
                <motion.div
                  animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -inset-6 bg-primary/25 rounded-3xl blur-2xl"
                />
                
                <div className="relative bg-card border border-primary/30 rounded-2xl p-6 shadow-2xl overflow-hidden animate-pulse-glow flex items-center justify-center">
                  <img
                    src={qrCodeApiUrl}
                    alt="Join Queue QR Code"
                    className="w-64 h-64 rounded-lg border border-white/5 relative z-10"
                  />
                  {/* Camera logo centered on the QR Code */}
                  <div className="absolute w-12 h-12 bg-card rounded-2xl border border-primary/20 flex items-center justify-center shadow-lg z-30">
                    <Camera className="w-6 h-6 text-primary fill-primary/10" />
                  </div>
                  <motion.div
                    animate={{ y: [0, 256, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute left-6 right-6 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent z-20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 justify-center text-primary">
                  <ScanLine className="w-5 h-5 animate-pulse" />
                  <span className="font-heading font-bold text-xl">Scannez pour commencer</span>
                </div>
                <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
                  Connectez votre smartphone pour rejoindre la file et personnaliser vos photos.
                </p>
              </div>
            </motion.div>
          ) : (
            /* STATE 2: Active Kiosk-Cam - Shows large live frame preview on desktop screen */
            <motion.div
              key="camera-view"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="flex flex-col items-center gap-6 w-full"
            >
              <div className="relative">
                {/* Photo Frame overlay rendering live PC webcam preview */}
                <FrameOverlay
                  frame={activeEntry.frame}
                  customText={activeEntry.custom_text}
                  videoRef={kioskStream ? kioskVideoRef : null}
                  stream={kioskStream}
                  className="max-w-[320px] sm:max-w-[380px] md:max-w-[440px] shadow-[0_0_50px_rgba(255,86,34,0.25)] border border-primary/20"
                  layout={activeEntry.layout || 'single'}
                  aspectRatio={activeEntry.aspect_ratio || '4:3'}
                  captureIndex={activeEntry.capture_index || 0}
                  capturedPhotos={capturedPhotos}
                />
                
                {/* Giant Countdown Overlay */}
                <AnimatePresence>
                  {kioskCount > 0 && (
                    <motion.div
                      initial={{ scale: 3, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.3, opacity: 0 }}
                      className="absolute inset-0 z-30 flex items-center justify-center bg-black/30 rounded-xl"
                    >
                      <span className="font-heading text-[10rem] font-black text-primary filter drop-shadow-[0_0_30px_rgba(255,86,34,0.55)] select-none">
                        {kioskCount}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Shutter Shimmer Flash */}
                {showFlash && (
                  <div className="absolute inset-0 bg-white z-50 rounded-xl" />
                )}
              </div>

              {/* Instruction Banner */}
              <div className="text-center space-y-1 bg-secondary/60 border border-border px-6 py-3 rounded-2xl">
                <p className="text-foreground font-heading font-bold text-base flex items-center justify-center gap-2">
                  <Monitor className="w-5 h-5 text-primary" />
                  Regardez l'écran !
                </p>
                {activeEntry.capture_total > 1 && (
                  <p className="text-primary font-heading font-bold text-xs">
                    Photo {(activeEntry.capture_index || 0) + 1} sur {activeEntry.capture_total}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Prise de vue pour <span className="text-primary font-bold">{activeEntry.display_name}</span>.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Discreet Queue Reset Admin Button */}
        <button
          onClick={handleResetQueue}
          className="absolute bottom-6 right-6 z-30 w-12 h-12 rounded-xl bg-card/60 hover:bg-destructive border border-border hover:border-destructive/30 flex items-center justify-center text-muted-foreground hover:text-white transition-all backdrop-blur-md shadow-lg"
          title="Vider la file d'attente"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {/* Queue Sidebar Area (Right) */}
      <div className="w-full lg:w-80 shrink-0 flex flex-col justify-center z-20">
        <QueueSidebar queue={queue} onRemove={handleRemoveQueueEntry} />
      </div>

      {/* Hidden persistent webcam video element for stable snapshot captures */}
      {kioskStream && (
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
