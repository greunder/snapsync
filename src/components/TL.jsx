import React from 'react';
import { motion } from 'framer-motion';
import { Hourglass } from 'lucide-react';

export default function MobileWaiting({ position, displayName }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="min-h-screen flex flex-col items-center justify-center px-6"
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
      <div className="flex gap-1.5 mt-8">
        {[0, 1, 2].map((n) => (
          <motion.div
            key={n}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: n * 0.2 }}
            className="w-2.5 h-2.5 rounded-full bg-primary"
          />
        ))}
      </div>
    </motion.div>
  );
}
