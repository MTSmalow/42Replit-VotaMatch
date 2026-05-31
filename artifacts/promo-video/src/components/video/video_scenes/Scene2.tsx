import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function Scene2() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 100),
      setTimeout(() => setPhase(2), 1000), // Swipe right
      setTimeout(() => setPhase(3), 1300), // Stamp appear
      setTimeout(() => setPhase(4), 2200), // Exit transition starts
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-bg overflow-hidden"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="absolute top-16 w-full px-6 flex flex-col items-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="w-full h-1 bg-border rounded-full overflow-hidden mb-8">
          <div className="h-full bg-agree w-1/3 rounded-full" />
        </div>
      </motion.div>

      <div className="relative w-full max-w-[320px] aspect-[3/4]">
        {/* Next card behind */}
        <motion.div 
          className="absolute inset-0 bg-card rounded-3xl shadow-lg border border-border/50 p-8 flex flex-col items-center justify-center"
          initial={{ scale: 0.9, y: 20, opacity: 0 }}
          animate={{ scale: 0.95, y: 15, opacity: 0.8 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-6xl mb-4">🏫</div>
          <div className="text-xs font-bold text-primary tracking-widest uppercase mb-4">Educação</div>
        </motion.div>

        {/* Current card */}
        <motion.div 
          className="absolute inset-0 bg-card rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.08)] border border-border/50 p-8 flex flex-col items-center justify-center z-10"
          initial={{ y: 50, opacity: 0 }}
          animate={
            phase >= 2 
              ? { x: 150, y: 40, rotate: 12, opacity: 1 } 
              : { y: 0, x: 0, rotate: 0, opacity: 1 }
          }
          transition={
            phase >= 2 
              ? { type: 'spring', stiffness: 100, damping: 15 } 
              : { type: 'spring', stiffness: 300, damping: 25, delay: 0.3 }
          }
        >
          <div className="text-6xl mb-4">🌿</div>
          <div className="text-xs font-bold text-primary tracking-widest uppercase mb-4">Meio Ambiente</div>
          <h3 className="text-xl font-semibold text-center leading-snug">
            O desmatamento na Amazônia deve ser combatido com rigor?
          </h3>

          {/* Stamp overlay */}
          <motion.div
            className="absolute top-8 left-8 border-4 border-agree bg-agree/10 text-agree font-bold text-lg px-4 py-1 rounded-lg origin-center"
            initial={{ opacity: 0, scale: 2, rotate: -15 }}
            animate={phase >= 2 ? { opacity: 1, scale: 1, rotate: -10 } : { opacity: 0, scale: 2, rotate: -15 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.1 }}
          >
            CONCORDO
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
