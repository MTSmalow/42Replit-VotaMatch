import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function Scene1() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 100),
      setTimeout(() => setPhase(2), 600),
      setTimeout(() => setPhase(3), 1100),
      setTimeout(() => setPhase(4), 1800),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-bg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex flex-col items-center gap-2 mb-10 relative z-10">
        <motion.div 
          className="w-24 h-24 bg-card rounded-3xl shadow-[0_10px_25px_rgba(26,82,118,0.15)] flex items-center justify-center overflow-hidden"
          initial={{ scale: 0, rotate: -20 }}
          animate={phase >= 1 ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <div className="w-12 h-12 bg-primary rounded-xl" />
        </motion.div>
        
        <motion.h1 
          className="text-4xl font-bold text-primary tracking-tight mt-2"
          initial={{ opacity: 0, y: 20 }}
          animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          VotaMatch
        </motion.h1>
        
        <motion.p 
          className="text-sm font-medium text-agree uppercase tracking-widest"
          initial={{ opacity: 0 }}
          animate={phase >= 2 ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Brasil · 2026
        </motion.p>
      </div>

      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={phase >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        <h2 className="text-3xl font-semibold text-text leading-tight">
          Encontre candidatos que<br />pensam como você
        </h2>
      </motion.div>

    </motion.div>
  );
}
