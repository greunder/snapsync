import React from 'react';
import { motion } from 'framer-motion';
import { Check, Download, RotateCcw, LogOut } from 'lucide-react';
import { FrameOverlay } from './FrameOverlay';

export default function MobileResult({ frame, customText, photoUrl, layout = 'single', aspectRatio = '4:3', onRetake, onFinish }) {
  
  const handleDownload = () => {
    if (!photoUrl) return;

    try {
      let downloadUrl = photoUrl;
      let isBlobCreated = false;

      if (photoUrl.startsWith('data:image')) {
        // Convert base64 data URL to a Blob to support iOS Safari downloads and avoid URL length limits
        const parts = photoUrl.split(',');
        const mime = parts[0].match(/:(.*?);/)[1];
        const bstr = atob(parts[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        const blob = new Blob([u8arr], { type: mime });
        downloadUrl = URL.createObjectURL(blob);
        isBlobCreated = true;
      }

      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `snapsync-photobooth-${Date.now()}.jpg`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(link);
        if (isBlobCreated) {
          URL.revokeObjectURL(downloadUrl);
        }
      }, 100);
    } catch (e) {
      console.error('Error generating download link:', e);
      // Fallback: open in new window
      window.open(photoUrl, '_blank');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col items-center justify-center px-6 py-8 max-w-md mx-auto"
    >
      {/* Result Visual Card Container */}
      <motion.div
        initial={{ scale: 0.8, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
        className="mb-6 flex flex-col items-center"
      >
        {/* Success badge */}
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-2 rounded-full mb-6 shadow-sm">
          <Check className="w-4 h-4" />
          <span className="text-sm font-medium">Photo capturée !</span>
        </div>

        {/* Frame Overlay Preview */}
        <FrameOverlay
          frame={frame}
          customText={customText}
          photoUrl={photoUrl}
          layout={layout}
          aspectRatio={aspectRatio}
        />
      </motion.div>

      {/* Action buttons stack */}
      <div className="w-full max-w-xs space-y-3">
        {/* Download Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleDownload}
          className="w-full h-14 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-heading font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20"
        >
          <Download className="w-5 h-5" />
          Télécharger ma photo
        </motion.button>

        {/* Reprendre / Retake Button - Keeps the user active at the booth to take other photos */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onRetake}
          className="w-full h-12 rounded-xl border border-border bg-transparent hover:bg-secondary text-foreground font-medium text-sm flex items-center justify-center gap-2 transition-all"
        >
          <RotateCcw className="w-4 h-4 text-primary" />
          Prendre une autre photo
        </motion.button>

        {/* Terminer / Exit Button - Marks the user as done and frees the queue */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onFinish}
          className="w-full h-12 rounded-xl bg-destructive/10 border border-destructive/20 hover:bg-destructive text-destructive hover:text-destructive-foreground font-semibold text-sm flex items-center justify-center gap-2 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Quitter la borne
        </motion.button>
      </div>
    </motion.div>
  );
}
