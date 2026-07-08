'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useSpring, useMotionValue } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';

export default function PremiumFinishingTouches() {
  // ── LOADING INTRO SCREEN ──────────────────────────────────────
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setLoading(false), 900);
          return 100;
        }
        const step = Math.floor(Math.random() * 12) + 4;
        return Math.min(100, prev + step);
      });
    }, 85);
    return () => clearInterval(timer);
  }, []);

  // ── CUSTOM CURSOR GLOW ────────────────────────────────────────
  const [isTouchDevice, setIsTouchDevice] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { stiffness: 450, damping: 30 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const checkTouch = () => {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    checkTouch();

    const onMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest('a, button, input, select, textarea, [role="button"], .interactive-element')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseover', onMouseOver);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onMouseOver);
    };
  }, [mouseX, mouseY]);

  // ── AMBIENT BACKGROUND MUSIC ──────────────────────────────────
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Royalty-free soft ambient chill music loop
    const audio = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3');
    audio.loop = true;
    audio.volume = 0.0; // Start at 0 volume for smooth fade-in
    audioRef.current = audio;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      // Fade out
      let vol = audioRef.current.volume;
      const fadeOut = setInterval(() => {
        if (audioRef.current && vol > 0.05) {
          vol -= 0.05;
          audioRef.current.volume = Math.max(0, vol);
        } else {
          clearInterval(fadeOut);
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.volume = 0;
          }
          setIsPlaying(false);
        }
      }, 30);
    } else {
      // Play and Fade in
      audioRef.current.volume = 0;
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        let vol = 0;
        const fadeIn = setInterval(() => {
          if (audioRef.current && vol < 0.18) {
            vol += 0.02;
            audioRef.current.volume = Math.min(0.2, vol);
          } else {
            clearInterval(fadeIn);
          }
        }, 50);
      }).catch((err) => {
        console.warn('Playback blocked by browser policy until interaction:', err);
      });
    }
  };

  // ── GLOBAL FLOATING PARTICLES ─────────────────────────────────
  const [glowParticles] = useState(() =>
    Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 12 + 8,
      delay: Math.random() * -5,
    }))
  );

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* 1. Global Floating Gold Embers */}
      <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden select-none">
        {glowParticles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ y: '110vh', opacity: 0 }}
            animate={{
              y: '-10vh',
              opacity: [0, 0.45, 0.45, 0],
              x: [0, Math.random() > 0.5 ? 40 : -40, 0],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              ease: 'linear',
              delay: p.delay,
            }}
            className="absolute rounded-full bg-luxury-gold/30 blur-[0.5px]"
            style={{
              left: `${p.left}%`,
              width: p.size,
              height: p.size,
              boxShadow: '0 0 10px rgba(200, 169, 126, 0.4)',
            }}
          />
        ))}
      </div>

      {/* 2. Custom Cursor Glow overlay (only renders on desktop mouse screens) */}
      {!isTouchDevice && (
        <motion.div
          style={{
            x: cursorX,
            y: cursorY,
            translateX: '-50%',
            translateY: '-50%',
            scale: isHovering ? 1.5 : 1.0,
          }}
          className="fixed top-0 left-0 w-8 h-8 rounded-full border border-luxury-gold/30 bg-luxury-gold/5 blur-[0.5px] pointer-events-none z-[9999] hidden md:block"
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-luxury-gold" />
        </motion.div>
      )}

      {/* 3. Luxury Ambient Music Controller (Floating Bottom-Left) */}
      <div className="fixed bottom-6 left-6 z-[999] pointer-events-auto flex items-center gap-3">
        <button
          onClick={toggleMusic}
          className="w-10 h-10 rounded-full border border-luxury-gold/20 bg-luxury-bg/60 backdrop-blur-md flex items-center justify-center text-luxury-gold hover:text-luxury-cream hover:border-luxury-gold/50 hover:bg-luxury-gold/10 transition-all duration-300 shadow-[0_4px_16px_rgba(0,0,0,0.4)] focus:outline-none cursor-pointer relative group"
          aria-label="Toggle Background Music"
        >
          {isPlaying ? (
            <Volume2 className="w-4.5 h-4.5" />
          ) : (
            <VolumeX className="w-4.5 h-4.5 text-luxury-cream/50" />
          )}

          {/* Pulsing visualizer circle */}
          {isPlaying && (
            <div className="absolute inset-0 rounded-full border border-luxury-gold/40 animate-ping opacity-45 pointer-events-none" />
          )}
        </button>

        {/* Dynamic visualizer bars */}
        <div className="flex gap-0.5 items-end h-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <motion.div
              key={i}
              animate={
                isPlaying
                  ? { height: [4, 12, 4] }
                  : { height: 3 }
              }
              transition={{
                duration: 0.6 + i * 0.12,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="w-[1.8px] bg-luxury-gold/60"
            />
          ))}
        </div>
      </div>

      {/* 4. Glassmorphism Screen Intro Loader */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }}
            className="fixed inset-0 z-[10000] bg-luxury-bg flex flex-col items-center justify-center"
          >
            {/* Background luxury gradient radial */}
            <div className="absolute w-[600px] h-[600px] bg-luxury-gold/3 blur-[180px] rounded-full pointer-events-none" />

            <div className="flex flex-col items-center space-y-10 relative z-10">
              {/* Animated luxury brand name */}
              <div className="overflow-hidden py-2">
                <motion.h1
                  initial={{ y: 80, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  className="font-serif text-5xl md:text-7xl tracking-[0.4em] text-luxury-cream text-center"
                >
                  ATIKUA
                </motion.h1>
              </div>

              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-[9px] tracking-[0.45em] uppercase text-luxury-gold/70 font-sans block text-center"
              >
                ✦ The Ethos of Culinary Alchemy ✦
              </motion.span>

              {/* Progress Bar Container */}
              <div className="w-48 h-[1px] bg-luxury-gold/10 relative overflow-hidden mt-6">
                <motion.div
                  className="absolute left-0 top-0 bottom-0 bg-luxury-gold shadow-[0_0_8px_#C8A97E]"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Percentage */}
              <motion.span
                className="font-sans text-[10px] tracking-[0.2em] text-luxury-cream/40"
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                {progress}%
              </motion.span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
