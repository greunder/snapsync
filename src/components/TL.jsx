import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hourglass, LogOut, AlertTriangle, X } from 'lucide-react';

export default function MobileWaiting({ position, displayName, onQuit }) {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="min-h-screen flex flex-col items-center justify-center px-6 relative"
    >
      {/* Spinning loading spinner */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary mb-8"
      />

      {/* User Name */}
      <h2 className="font-heading text-2xl font-bold text-foreground mb-2 text-center">
        {displayName}
      </h2>

      {/* Queue position banner */}
      <div className="flex items-center gap-2 bg-secondary/80 border border-border px-5 py-3 rounded-xl mb-6 shadow-md">
        <Hourglass className="w-4 h-4 text-primary animate-spin" style={{ animationDuration: '3s' }} />
        <span className="text-foreground font-medium text-sm">
          Position <span className="text-primary font-bold text-xl ml-1 mr-1">{position}</span> dans la file
        </span>
      </div>

      {/* Encouragement message */}
      <p className="text-muted-foreground text-sm text-center max-w-xs leading-relaxed">
        Patientez, votre tour arrive bientôt…
      </p>

      {/* Pulse loading dots */}
      <div className="flex gap-1.5 mt-8 mb-12">
        {[0, 1, 2].map((n) => (
          <motion.div
            key={n}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: n * 0.2 }}
            className="w-2.5 h-2.5 rounded-full bg-primary"
          />
        ))}
      </div>

      {/* Quit / Exit Button */}
      {onQuit && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowConfirm(true)}
          className="mt-4 px-5 py-2.5 rounded-xl border border-destructive/30 text-destructive hover:bg-destructive/10 hover:border-destructive text-xs font-semibold flex items-center gap-2 transition-all"
        >
          <LogOut className="w-3.5 h-3.5" />
          Quitter la file d'attente
        </motion.button>
      )}

      {/* Confirmation Modal Overlay */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-card border border-border w-full max-w-xs rounded-2xl p-6 shadow-2xl relative"
            >
              <button 
                onClick={() => setShowConfirm(false)}
                className="absolute top-4 right-4 p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-4">
                  <AlertTriangle className="w-6 h-6" />
                </div>

                <h3 className="font-heading text-lg font-bold text-foreground mb-2">
                  Quitter la file ?
                </h3>
                <p className="text-muted-foreground text-xs leading-relaxed mb-6">
                  Vous perdrez votre place actuelle dans la file d'attente. Cette action est irréversible.
                </p>

                <div className="flex flex-col gap-2 w-full">
                  <button
                    onClick={() => {
                      setShowConfirm(false);
                      onQuit();
                    }}
                    className="w-full h-11 bg-destructive hover:bg-destructive/90 text-destructive-foreground font-heading font-semibold text-sm rounded-xl transition-all shadow-md shadow-destructive/10"
                  >
                    Oui, quitter
                  </button>
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="w-full h-11 bg-secondary hover:bg-secondary/80 text-foreground font-heading font-semibold text-sm rounded-xl transition-all border border-border"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
