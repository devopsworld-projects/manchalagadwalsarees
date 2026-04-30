import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function TempleSplash({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<'enter' | 'hold' | 'exit'>('enter');

  useEffect(() => {
    const holdTimer = setTimeout(() => setPhase('hold'), 400);
    const exitTimer = setTimeout(() => setPhase('exit'), 2200);
    const doneTimer = setTimeout(() => onComplete(), 3000);
    return () => { clearTimeout(holdTimer); clearTimeout(exitTimer); clearTimeout(doneTimer); };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== 'exit' ? null : null}
      <motion.div
        className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
        style={{ background: 'hsl(15, 20%, 12%)' }}
        initial={{ opacity: 1 }}
        animate={{ opacity: phase === 'exit' ? 0 : 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Concentric temple rings */}
        {[320, 240, 160].map((size, i) => (
          <motion.div
            key={size}
            className="absolute border rounded-full"
            style={{
              width: size,
              height: size,
              borderColor: `hsl(36, 72%, 48%, ${0.08 + i * 0.06})`,
            }}
            initial={{ scale: 0, opacity: 0, rotate: 0 }}
            animate={{ scale: 1, opacity: 1, rotate: 90 }}
            transition={{ duration: 1.2, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
          />
        ))}

        {/* Diamond motifs rotating around center */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
          <motion.div
            key={deg}
            className="absolute w-2 h-2 rotate-45"
            style={{
              background: `hsl(36, 72%, ${48 + i * 3}%)`,
              transformOrigin: `center ${100}px`,
              transform: `rotate(${deg}deg) translateY(-100px) rotate(45deg)`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 0.8, 0.4], scale: [0, 1.2, 1] }}
            transition={{ duration: 1, delay: 0.5 + i * 0.05 }}
          />
        ))}

        {/* Center content */}
        <div className="relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex items-center justify-center gap-2 mb-3"
          >
            <div className="w-8 h-[1px] bg-gradient-to-r from-transparent to-[hsl(36,72%,48%)]" />
            <span className="text-[hsl(36,72%,48%)] text-[7px]">◆</span>
            <div className="w-8 h-[1px] bg-gradient-to-l from-transparent to-[hsl(36,72%,48%)]" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="font-display text-xl sm:text-2xl font-bold tracking-[0.15em] text-[hsl(35,30%,90%)]"
          >
            MANCHALA
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="font-display text-[10px] tracking-[0.4em] text-[hsl(36,72%,48%)] mt-1 uppercase"
          >
            Gadwal Sarees
          </motion.p>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="mt-4 h-[1px] w-24 mx-auto"
            style={{
              background: 'linear-gradient(90deg, transparent, hsl(36,72%,48%), transparent)',
            }}
          />
        </div>

        {/* Corner temple ornaments */}
        {['top-6 left-6', 'top-6 right-6', 'bottom-6 left-6', 'bottom-6 right-6'].map((pos, i) => {
          const isTop = pos.includes('top');
          const isLeft = pos.includes('left');
          return (
            <motion.div
              key={pos}
              className={`absolute ${pos} hidden sm:block`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              transition={{ duration: 0.8, delay: 0.4 + i * 0.1 }}
            >
              <div className={`w-10 h-10 ${isTop ? 'border-t' : 'border-b'} ${isLeft ? 'border-l' : 'border-r'}`} style={{ borderColor: 'hsl(36, 72%, 48%, 0.4)' }} />
              <div className={`absolute ${isTop ? 'top-1' : 'bottom-1'} ${isLeft ? 'left-1' : 'right-1'} w-1.5 h-1.5 rotate-45`} style={{ background: 'hsl(36, 72%, 48%, 0.3)' }} />
            </motion.div>
          );
        })}
      </motion.div>
    </AnimatePresence>
  );
}
