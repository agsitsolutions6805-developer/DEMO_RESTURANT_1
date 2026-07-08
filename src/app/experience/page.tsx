'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SensoryExperience from '@/components/SensoryExperience';

export default function ExperiencePage() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Philosophy', href: '/#philosophy' },
    { name: 'Culinary Menu', href: '/#menu' },
    { name: 'Experience', href: '/experience' },
  ];

  return (
    <main className="relative w-full bg-[#050505] text-luxury-cream overflow-x-hidden min-h-screen">
      {/* Subtle floating Hamburger when not scrolled */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: (scrolled || isOpen) ? 0 : 0.35,
          pointerEvents: (scrolled || isOpen) ? 'none' : 'auto'
        }}
        transition={{ duration: 0.4 }}
        className="fixed top-6 right-6 md:right-12 z-[1000]"
      >
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center w-10 h-10 border border-luxury-cream/20 text-luxury-cream hover:text-luxury-gold hover:border-luxury-gold/50 rounded-full transition-all duration-300 bg-black/10 backdrop-blur-sm cursor-pointer"
          aria-label="Open Menu"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="stroke-current">
            <line x1="4" y1="6" x2="20" y2="6" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="4" y1="12" x2="20" y2="12" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="4" y1="18" x2="20" y2="18" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </motion.div>

      {/* Matching Scrolled Navbar */}
      <motion.nav
        initial={{ y: -120, opacity: 0 }}
        animate={{ 
          y: scrolled ? 0 : -120, 
          opacity: scrolled ? 1 : 0 
        }}
        transition={{ 
          type: 'spring', 
          stiffness: 120, 
          damping: 18,
          opacity: { duration: 0.4 } 
        }}
        className="fixed top-6 left-1/2 -translate-x-1/2 z-[1000] w-[calc(100%-2rem)] max-w-6xl rounded-full border border-luxury-gold/15 bg-luxury-bg/50 backdrop-blur-lg shadow-[0_12px_40px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.05),0_0_20px_rgba(200,169,126,0.02)] py-2.5 px-6 md:px-8 flex items-center justify-between"
      >
        <a href="/" className="font-serif text-xl tracking-[0.25em] text-luxury-cream hover:text-luxury-gold transition-colors duration-300">
          ATIKUA
        </a>
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={`text-[10px] tracking-[0.25em] uppercase font-sans hover:text-luxury-cream transition-colors duration-300 py-2 px-1 ${
                item.name === 'Experience' ? 'text-luxury-gold' : 'text-luxury-cream/80'
              }`}
            >
              {item.name}
            </a>
          ))}
        </div>
        <div className="hidden md:block">
          <a
            href="/#section-reservation"
            className="px-5 py-2 border border-luxury-gold/30 text-luxury-gold hover:text-luxury-bg hover:bg-luxury-gold text-[10px] tracking-[0.2em] uppercase font-sans transition-all duration-500 rounded-full"
          >
            Reserve A Table
          </a>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden flex items-center justify-center w-9 h-9 text-luxury-cream hover:text-luxury-gold focus:outline-none cursor-pointer"
          aria-label="Toggle Menu"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="stroke-current">
            <line x1="4" y1="6" x2="20" y2="6" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="4" y1="12" x2="20" y2="12" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="4" y1="18" x2="20" y2="18" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </motion.nav>

      {/* Fullscreen Overlay Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[999] bg-luxury-bg/85 backdrop-blur-2xl flex flex-col justify-center items-center"
          >
            <div className="absolute top-[20%] left-[10%] w-72 h-72 bg-luxury-gold/5 rounded-full blur-[100px]" />
            <div className="absolute bottom-[20%] right-[10%] w-72 h-72 bg-luxury-cream/3 rounded-full blur-[100px]" />
            <div className="absolute top-6 right-6 md:right-12 z-[1000]">
              <button
                onClick={() => setIsOpen(false)}
                className="text-luxury-cream/40 hover:text-luxury-cream text-lg cursor-pointer p-2"
              >
                ✕
              </button>
            </div>
            <div className="flex flex-col items-center gap-8 relative z-10">
              {navItems.map((item, idx) => (
                <motion.a
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ delay: idx * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="font-serif text-2xl tracking-[0.2em] text-luxury-cream hover:text-luxury-gold transition-all duration-300 py-1"
                >
                  {item.name}
                </motion.a>
              ))}
              <motion.a
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ delay: navItems.length * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                href="/#section-reservation"
                onClick={() => setIsOpen(false)}
                className="mt-6 px-8 py-3.5 border border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-luxury-bg text-xs tracking-[0.2em] uppercase font-sans transition-all duration-300 rounded-full"
              >
                Reserve A Table
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <SensoryExperience />
    </main>
  );
}
