import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Monitor, Smartphone, Zap, Heart, LayoutGrid, CheckCircle2, Star, Sparkles } from 'lucide-react';

export default function PortalHome() {
  const navigateTo = (path) => {
    history.pushState(null, '', path);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-tr from-background via-background to-primary/5 text-foreground flex flex-col items-center justify-between p-6 md:p-12 relative overflow-hidden font-body selection:bg-primary/20">
      
      {/* Dynamic ambient blobs */}
      <div className="absolute top-[-10%] left-[-15%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-primary/15 to-amber-200/10 filter blur-3xl opacity-85 pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-15%] w-[700px] h-[700px] rounded-full bg-gradient-to-tr from-rose-200/10 to-primary/10 filter blur-3xl opacity-75 pointer-events-none z-0" />

      {/* Navigation Header */}
      <header className="w-full max-w-6xl flex items-center justify-between relative z-10 mb-8 md:mb-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/25 hover:scale-105 transition-transform duration-300">
            <Camera className="w-5 h-5 text-white" />
          </div>
          <span className="font-heading font-black text-2xl text-foreground tracking-tight select-none">SnapSync</span>
        </div>
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-border text-primary text-xs font-semibold uppercase tracking-wider shadow-sm">
          <Zap className="w-3.5 h-3.5 fill-primary text-primary animate-pulse" />
          Live Event Hub
        </div>
      </header>

      {/* Main Hero Split Area */}
      <main className="w-full max-w-6xl flex-1 flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-12 relative z-10 py-6">
        
        {/* Left Side: Copywriting & CTA */}
        <div className="flex-1 text-center lg:text-left max-w-xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-6"
          >
            <Sparkles className="w-3.5 h-3.5 text-primary fill-primary animate-pulse" />
            L'expérience photo connectée
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-heading text-4xl sm:text-5xl md:text-6xl font-black text-foreground mb-6 tracking-tight leading-[1.05]"
          >
            Sublimez vos fêtes avec un <span className="text-primary bg-gradient-to-r from-primary via-primary/95 to-amber-600 bg-clip-text text-transparent">photomaton intelligent</span>.
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-muted-foreground text-base md:text-lg leading-relaxed mb-10 max-w-lg"
          >
            SnapSync réinvente la cabine photo. Vos invités s'inscrivent sur leur mobile, personnalisent leurs cadres et déclenchent la prise de vue à distance. Fini les files d'attente interminables.
          </motion.p>

          {/* Pathways Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid gap-4 sm:grid-cols-2"
          >
            {/* Button Kiosk */}
            <button
              onClick={() => navigateTo('/kiosk')}
              className="group flex flex-col justify-between items-start text-left p-5 rounded-2xl border border-border bg-white hover:bg-foreground hover:border-foreground text-foreground hover:text-background transition-all duration-300 shadow-md hover:shadow-xl shadow-border/50 hover:shadow-foreground/20"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/5 group-hover:bg-white/10 flex items-center justify-center mb-4 transition-colors">
                <Monitor className="w-5 h-5 text-primary group-hover:text-background" />
              </div>
              <div>
                <span className="font-heading font-black text-lg block mb-0.5">Écran Borne PC</span>
                <span className="text-xs text-muted-foreground group-hover:text-muted-foreground/80">Interface caméra et affichage public</span>
              </div>
            </button>

            {/* Button Mobile */}
            <button
              onClick={() => navigateTo('/join')}
              className="group flex flex-col justify-between items-start text-left p-5 rounded-2xl border border-border bg-white hover:bg-primary hover:border-primary text-foreground hover:text-white transition-all duration-300 shadow-md hover:shadow-xl shadow-border/50 hover:shadow-primary/20"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/5 group-hover:bg-white/10 flex items-center justify-center mb-4 transition-colors">
                <Smartphone className="w-5 h-5 text-primary group-hover:text-white" />
              </div>
              <div>
                <span className="font-heading font-black text-lg block mb-0.5">Interface Mobile</span>
                <span className="text-xs text-muted-foreground group-hover:text-white/80">Rejoindre la file et choisir un cadre</span>
              </div>
            </button>
          </motion.div>
        </div>

        {/* Right Side: High Fidelity Photobooth Card Mockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotateY: 15 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ type: "spring", stiffness: 80, damping: 15, delay: 0.2 }}
          className="flex-1 w-full flex items-center justify-center relative select-none"
        >
          {/* Card Wrapper with depth effect */}
          <div className="relative group/mockup perspective-1000 transform hover:scale-[1.03] transition-transform duration-500">
            {/* Soft shadow background */}
            <div className="absolute inset-0 bg-primary/10 rounded-[28px] blur-2xl transform translate-y-6 scale-95 pointer-events-none group-hover/mockup:bg-primary/15 transition-all duration-500" />
            
            {/* Themed card (Wood print look) */}
            <div 
              style={{
                backgroundColor: '#472d1a',
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Cpath d='M0,30 Q30,25 60,30 T120,30 M0,75 Q40,70 80,75 T120,75 M0,105 Q30,100 70,105 T120,105' fill='none' stroke='%232b170c' stroke-width='1.5' opacity='0.22'/%3E%3Cpath d='M0,5 Q40,15 80,5 T120,5 M0,50 Q20,60 60,50 T120,50' fill='none' stroke='%232b170c' stroke-width='1' opacity='0.12'/%3E%3C/svg%3E")`
              }}
              className="w-[200px] sm:w-[220px] aspect-[1/3.1] rounded-[24px] shadow-2xl p-3 border border-white/5 flex flex-col justify-between items-center transform -rotate-2 group-hover/mockup:rotate-1 transition-transform duration-700 ease-out"
            >
              {/* Header Icon */}
              <div className="text-xl pt-1">⭐️</div>

              {/* Photo slots column */}
              <div className="flex-1 flex flex-col gap-2 w-full py-2">
                {[
                  "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=300&q=80",
                  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80",
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
                ].map((imgUrl, idx) => (
                  <div key={idx} className="w-full relative shadow-md rounded border-[4px] border-white bg-white aspect-[4/3] overflow-hidden">
                    <img 
                      src={imgUrl} 
                      alt="Mockup pose" 
                      className="w-full h-full object-cover pointer-events-none select-none grayscale hover:grayscale-0 transition-all duration-500" 
                    />
                    <span className="absolute -bottom-1 -right-1 text-xs z-10 pointer-events-none select-none">
                      ✨
                    </span>
                  </div>
                ))}
              </div>

              {/* Footer text */}
              <div className="text-center pb-2 pt-1 flex flex-col items-center">
                <span className="text-yellow-500 font-serif text-[7px] tracking-[0.2em] uppercase font-bold">SOIRÉE GALA</span>
                <span className="text-white font-script text-base mt-0.5 leading-none">Souvenirs mémorables</span>
              </div>
            </div>
          </div>
        </motion.div>
        
      </main>

      {/* Feature Highlights Section */}
      <section className="w-full max-w-6xl border-t border-border pt-8 mt-8 z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex gap-3">
            <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <h4 className="font-heading font-black text-foreground text-sm mb-0.5">Synchronisation instantanée</h4>
              <p className="text-muted-foreground text-xs leading-normal">WebSockets gère la file d'attente et le retour caméra en direct en temps réel.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <LayoutGrid className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <h4 className="font-heading font-black text-foreground text-sm mb-0.5">Format collages multiples</h4>
              <p className="text-muted-foreground text-xs leading-normal">Prenez une photo simple, une bande classique ou une grille 4 poses.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Star className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <h4 className="font-heading font-black text-foreground text-sm mb-0.5">Rendus TemplatesBooth</h4>
              <p className="text-muted-foreground text-xs leading-normal">Cadres à textures bois, kraft, ardoise et ornements de fête.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights bottom spacing */}
      <div className="h-4" />

      {/* Footer */}
      <footer className="w-full max-w-6xl flex items-center justify-center relative z-10 mt-12 border-t border-border pt-6">
        <p className="text-muted-foreground text-xs flex items-center gap-1">
          Fait avec <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> pour vos plus belles fêtes.
        </p>
      </footer>
    </div>
  );
}
