import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, ArrowRight, Lock, AlertCircle } from 'lucide-react';

export default function MobileJoinForm({ onJoin, isLoading, error, initialCode }) {
  const [name, setName] = useState(() => {
    return localStorage.getItem('snapsync_user_name') || '';
  });
  const [code, setCode] = useState(initialCode || '');

  useEffect(() => {
    if (initialCode) {
      setCode(initialCode);
    }
  }, [initialCode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() && code.trim()) {
      localStorage.setItem('snapsync_user_name', name.trim());
      onJoin(name.trim(), code.trim());
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
        Entrez votre prénom et le code d'accès pour rejoindre la file d'attente
      </p>

      {/* Input name form */}
      <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Votre prénom"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full h-14 px-4 text-lg text-center bg-secondary border border-border text-foreground placeholder:text-muted-foreground rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            autoFocus
            disabled={isLoading}
          />
        </div>
        
        {/* Passcode input field */}
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Lock className="w-5 h-5" />
          </div>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={4}
            placeholder="Code d'accès"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            className="w-full h-14 pl-12 pr-4 text-lg text-center font-mono tracking-widest bg-secondary border border-border text-foreground placeholder:text-muted-foreground placeholder:font-sans placeholder:tracking-normal rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            disabled={isLoading}
          />
        </div>

        {/* Error notification */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3 p-4 bg-destructive/10 border border-destructive/25 text-destructive rounded-xl text-xs leading-relaxed"
          >
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </motion.div>
        )}
        
        {/* Submit button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={!name.trim() || !code.trim() || code.length < 4 || isLoading}
          className="w-full h-14 text-lg rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-heading font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Rejoindre la file
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </form>
    </motion.div>
  );
}
