import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, ArrowRight } from 'lucide-react';

export default function MobileJoinForm({ onJoin, isLoading }) {
  const [name, setName] = useState(() => {
    return localStorage.getItem('snapsync_user_name') || '';
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      localStorage.setItem('snapsync_user_name', name.trim());
      onJoin(name.trim());
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen flex flex-col items-center justify-center px-6 py-12"
    >
      {/* Brand logo icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.1 }}
        className="w-20 h-20 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center mb-8"
      >
        <Camera className="w-10 h-10 text-primary" />
      </motion.div>

      {/* Titles */}
      <h1 className="font-heading text-3xl font-bold text-foreground mb-2 text-center">
        Photobooth
      </h1>
      <p className="text-muted-foreground text-center mb-10 max-w-xs text-sm">
        Entrez votre prénom pour rejoindre la file d'attente
      </p>

      {/* Input name form */}
      <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-4">
        <input
          type="text"
          placeholder="Votre prénom"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full h-14 text-lg text-center bg-secondary border border-border text-foreground placeholder:text-muted-foreground rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          autoFocus
          disabled={isLoading}
        />
        
        {/* Submit button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={!name.trim() || isLoading}
          className="w-full h-14 text-lg rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-heading font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Rejoindre la file
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </form>
    </motion.div>
  );
}
