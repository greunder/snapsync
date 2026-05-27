import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { kt, socket } from '../utils/syncClient';
import MobileJoinForm from './CL';
import MobileWaiting from './TL';
import MobileFrameSelection from './pM';
import MobileCountdown from './mM';
import MobileResult from './gM';

export default function MobileView() {
  const [status, setStatus] = useState('join'); // 'join' | 'waiting' | 'active' | 'countdown' | 'waiting_for_photo' | 'result'
  const [queueEntry, setQueueEntry] = useState(null);
  const [position, setPosition] = useState(0);
  const [joining, setJoining] = useState(false);
  
  // Custom camera selection and stream states
  const [cameraSource, setCameraSource] = useState('mobile'); // 'mobile' | 'kiosk'
  const [mobileStream, setMobileStream] = useState(null);
  
  const [selectedFrame, setSelectedFrame] = useState(null);
  const [customText, setCustomText] = useState('');
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [kioskPreviewFrame, setKioskPreviewFrame] = useState(null);
  const [layout, setLayout] = useState('single');
  const [aspectRatio, setAspectRatio] = useState('4:3');

  // Helper to start the smartphone camera stream
  const startMobileCamera = async () => {
    try {
      if (!mobileStream) {
        const s = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: 'user',
            width: { ideal: 640 },
            height: { ideal: 480 }
          } 
        });
        setMobileStream(s);
      }
    } catch (err) {
      console.warn("Mobile camera stream not available:", err);
    }
  };

  // Helper to stop the smartphone camera stream
  const stopMobileCamera = () => {
    if (mobileStream) {
      mobileStream.getTracks().forEach(track => track.stop());
      setMobileStream(null);
    }
  };

  // Initialize session state helper
  const initializeSessionState = useCallback((currentEntry, activeList) => {
    setQueueEntry(currentEntry);
    if (currentEntry.layout) setLayout(currentEntry.layout);
    if (currentEntry.aspect_ratio) setAspectRatio(currentEntry.aspect_ratio);
    if (currentEntry.camera_source) setCameraSource(currentEntry.camera_source);
    if (currentEntry.custom_text) setCustomText(currentEntry.custom_text);
    if (currentEntry.frame) setSelectedFrame(currentEntry.frame);
    
    const currentPos = activeList.indexOf(currentEntry) + 1;
    setPosition(currentPos);

    if (currentEntry.status === 'active' || currentPos === 1) {
      if (currentEntry.photo_url) {
        setCapturedPhoto(currentEntry.photo_url);
        setStatus('result');
      } else if (currentEntry.capture_state === 'countdown') {
        setStatus('countdown');
      } else {
        setStatus('active');
        if (currentEntry.camera_source === 'mobile') {
          startMobileCamera();
        }
      }
    } else {
      setStatus('waiting');
    }
  }, [mobileStream]);

  // Restore user session on mount if there's a saved entry ID in localStorage
  useEffect(() => {
    const restoreSession = async () => {
      const savedId = localStorage.getItem('snapsync_session_entry_id');
      if (savedId) {
        try {
          const list = await kt.entities.QueueEntry.list();
          if (list) {
            const activeList = list.filter(entry => entry.status !== 'done');
            const currentEntry = activeList.find(entry => entry.id === savedId);
            
            if (currentEntry) {
              initializeSessionState(currentEntry, activeList);
              console.log('[MobileView] Session restored successfully for ID:', savedId);
              return;
            }
          }
        } catch (err) {
          console.error('[MobileView] Failed to restore session:', err);
        }
        // Clear corrupt or non-existent session
        localStorage.removeItem('snapsync_session_entry_id');
      }
    };
    restoreSession();
  }, [initializeSessionState]);

  // Subscribe to Kiosk's live frame broadcast via WebSockets globally at MobileView level
  useEffect(() => {
    if (cameraSource !== 'kiosk' || status === 'join' || status === 'result') {
      setKioskPreviewFrame(null);
      return;
    }

    const handleKioskFrame = (data) => {
      if (queueEntry && data.entryId === queueEntry.id) {
        setKioskPreviewFrame(data.frameData);
      }
    };

    socket.on('kiosk_frame_broadcast', handleKioskFrame);
    return () => {
      socket.off('kiosk_frame_broadcast', handleKioskFrame);
    };
  }, [cameraSource, queueEntry, status]);

  // Subscribe to real-time database updates via WebSocket queue broadcasts
  useEffect(() => {
    if (!queueEntry || status === 'join') return;

    const unsubscribe = kt.entities.QueueEntry.subscribe((list) => {
      if (!list) return;
      const activeList = list.filter(entry => entry.status !== 'done');
      const currentEntry = activeList.find(entry => entry.id === queueEntry.id);
      
      if (!currentEntry) {
        setStatus('join');
        setQueueEntry(null);
        stopMobileCamera();
        localStorage.removeItem('snapsync_session_entry_id');
        return;
      }

      setQueueEntry(currentEntry);

      const currentPos = activeList.indexOf(currentEntry) + 1;
      setPosition(currentPos);
      if (currentEntry.layout) setLayout(currentEntry.layout);
      if (currentEntry.aspect_ratio) setAspectRatio(currentEntry.aspect_ratio);
      if (currentEntry.camera_source) setCameraSource(currentEntry.camera_source);

      // Transition from waiting to active when turn arrives
      if ((currentEntry.status === 'active' || currentPos === 1) && status === 'waiting') {
        kt.entities.QueueEntry.update(queueEntry.id, { status: 'active' });
        setStatus('active');
        if (currentEntry.camera_source === 'mobile') {
          startMobileCamera();
        }
      }

      // Transition from countdown or waiting_for_photo to result if photo has been generated
      if ((status === 'countdown' || status === 'waiting_for_photo') && currentEntry.photo_url) {
        setCapturedPhoto(currentEntry.photo_url);
        setStatus('result');
      }
    });

    return () => unsubscribe();
  }, [queueEntry?.id, status]);

  // Clean up camera stream if component unmounts
  useEffect(() => {
    return () => stopMobileCamera();
  }, [mobileStream]);

  // Handle joining the queue
  const handleJoin = async (name) => {
    setJoining(true);
    try {
      const entry = await kt.entities.QueueEntry.create({ name });
      if (entry) {
        localStorage.setItem('snapsync_session_entry_id', entry.id);
        const list = await kt.entities.QueueEntry.list();
        if (list) {
          const activeList = list.filter(e => e.status !== 'done');
          const currentEntry = activeList.find(e => e.id === entry.id) || entry;
          initializeSessionState(currentEntry, activeList);
        }
      }
    } catch (err) {
      console.error('Error joining queue:', err);
    } finally {
      setJoining(false);
    }
  };

  // Camera source change callback triggered by frame selector
  const handleCameraSourceChange = (source) => {
    setCameraSource(source);
    if (source === 'mobile') {
      startMobileCamera();
    } else {
      stopMobileCamera();
    }
  };

  // Transition to countdown screen
  const handleCapture = (frame, text, source, currentLayout = 'single', currentRatio = '4:3') => {
    setSelectedFrame(frame);
    setCustomText(text);
    setCameraSource(source);
    setLayout(currentLayout);
    setAspectRatio(currentRatio);
    setStatus('countdown');
  };

  // Triggered when countdown hits 0 (flashing)
  const handleCountdownComplete = async (compiledPhoto) => {
    if (cameraSource === 'kiosk') {
      // 🖥️ PC Kiosk capture mode: Phone pauses and waits for Kiosk to upload JPEG
      setStatus('waiting_for_photo');
    } else {
      // 📱 Local smartphone camera mode: Phone saves the locally compiled photo and uploads it
      if (compiledPhoto) {
        setCapturedPhoto(compiledPhoto);
      }
      
      // Stop phone camera tracks to release the hardware/light in results screen
      stopMobileCamera();
      
      setStatus('result');
    }
  };

  // Retake photo: Go back to frame selector, keeping the same queue position
  const handleRetake = async () => {
    if (queueEntry) {
      // Reset server values
      await kt.entities.QueueEntry.update(queueEntry.id, { 
        photo_url: null, 
        capture_state: 'idle' 
      });
    }
    
    setCapturedPhoto(null);
    
    // Reactivate mobile camera preview if in mobile cam mode
    if (cameraSource === 'mobile') {
      await startMobileCamera();
    }
    
    setStatus('active');
  };

  // Finish: Complete session, leave the queue, reset all states
  const handleFinish = async () => {
    if (queueEntry) {
      // Mark current user as done on database (which moves the next person in line)
      await kt.entities.QueueEntry.update(queueEntry.id, { status: 'done' });
    }
    
    // Clear localStorage session
    localStorage.removeItem('snapsync_session_entry_id');
    
    // Stop mobile camera stream
    stopMobileCamera();
    
    // Reset all local states
    setQueueEntry(null);
    setSelectedFrame(null);
    setCustomText('');
    setCapturedPhoto(null);
    setPosition(0);
    setStatus('join');
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-background via-background to-primary/5 text-foreground relative overflow-hidden font-body selection:bg-primary/20">
      
      {/* Dynamic ambient blobs */}
      <div className="absolute top-[-10%] left-[-15%] w-[400px] h-[400px] rounded-full bg-gradient-to-br from-primary/10 to-amber-200/10 filter blur-3xl opacity-75 pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-15%] w-[450px] h-[450px] rounded-full bg-gradient-to-tr from-rose-200/10 to-primary/10 filter blur-3xl opacity-60 pointer-events-none z-0" />
      
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {status === 'join' && (
            <MobileJoinForm key="join" onJoin={handleJoin} isLoading={joining} />
          )}
          
          {status === 'waiting' && (
            <MobileWaiting key="waiting" position={position} displayName={queueEntry?.display_name} />
          )}
          
          {status === 'active' && (
            <MobileFrameSelection 
              key="active" 
              onCapture={handleCapture} 
              queueEntry={queueEntry}
              stream={mobileStream}
              kioskPreviewFrame={kioskPreviewFrame}
              onCameraSourceChange={handleCameraSourceChange}
            />
          )}
          
          {status === 'countdown' && (
            <MobileCountdown 
              key="countdown" 
              queueEntry={queueEntry}
              layout={layout}
              aspectRatio={aspectRatio}
              cameraSource={cameraSource}
              onComplete={handleCountdownComplete} 
              stream={cameraSource === 'mobile' ? mobileStream : null}
              photoUrl={cameraSource === 'kiosk' ? kioskPreviewFrame : null}
              frame={selectedFrame}
              customText={customText}
            />
          )}

          {status === 'waiting_for_photo' && (
            <motion.div
              key="waiting_for_photo"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-h-screen flex flex-col items-center justify-center px-6 gap-4"
            >
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
              <h3 className="font-heading text-lg font-bold text-foreground">Création de la photo...</h3>
              <p className="text-muted-foreground text-xs text-center max-w-xs leading-relaxed">
                La borne capture votre pose. Veuillez patienter pendant la génération et le transfert de votre cliché.
              </p>
            </motion.div>
          )}
          
          {status === 'result' && (
            <MobileResult 
              key="result" 
              frame={selectedFrame} 
              customText={customText} 
              photoUrl={capturedPhoto} 
              layout={layout}
              aspectRatio={aspectRatio}
              onRetake={handleRetake}
              onFinish={handleFinish}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
