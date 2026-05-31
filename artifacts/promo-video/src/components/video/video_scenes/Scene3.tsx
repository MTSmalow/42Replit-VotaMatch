import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CANDIDATES = [
  { role: 'Deputado Federal', num: '1234', name: 'João Silva', partido: 'ABC' },
  { role: 'Senador', num: '123', name: 'Maria Santos', partido: 'XYZ' },
  { role: 'Presidente', num: '12', name: 'José Lima', partido: 'PQR' },
];

export function Scene3() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 100),
      setTimeout(() => setPhase(2), 2200),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex flex-col p-6 bg-bg overflow-hidden"
      initial={{ x: '-100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="pt-12 pb-6 px-4">
        <motion.h2 
          className="text-2xl font-bold text-text mb-1"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Minha Cola
        </motion.h2>
        <motion.p 
          className="text-sm text-text-muted"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Eleições Brasil · Outubro 2026
        </motion.p>
      </div>

      <div className="flex-1 flex flex-col gap-4 px-2">
        {CANDIDATES.map((cand, i) => (
          <motion.div 
            key={i}
            className="bg-card rounded-2xl p-5 shadow-sm border-l-4 border-primary relative overflow-hidden"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.6 + (i * 0.2) }}
          >
            <div className="flex justify-between items-center mb-2">
              <div className="text-[10px] font-bold text-text-muted tracking-widest uppercase">{cand.role}</div>
              <div className="text-xs font-bold text-primary px-2 py-0.5 bg-primary/10 rounded-full border border-primary/20">{cand.partido}</div>
            </div>
            
            <div className="font-mono text-4xl font-extrabold tracking-widest text-primary my-1">
              {cand.num}
            </div>
            
            <div className="text-lg font-bold text-text">{cand.name}</div>
          </motion.div>
        ))}
      </div>
      
      {/* Footer CTA-like graphic (non-interactive) */}
      <motion.div 
        className="mt-4 mb-8 mx-2 bg-primary rounded-xl py-4 flex justify-center items-center shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, type: 'spring' }}
      >
        <span className="text-card font-semibold text-lg">Baixar PDF da cola</span>
      </motion.div>
    </motion.div>
  );
}
