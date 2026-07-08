'use client';

import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export default function Hero() {
  const scrollToSection = (id: string) => {
    const el = document.querySelector(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden z-10 px-6 md:px-12 bg-transparent pointer-events-none"
    >
      {/* Dim overlay for text readability over WebGL corridor */}
      <div className="absolute inset-0 bg-[#0B0B0B]/40 pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center flex flex-col items-center mt-12 pointer-events-auto">
        {/* Top Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="text-xs md:text-sm tracking-[0.45em] uppercase text-luxury-gold mb-6 font-sans font-medium gold-glow pointer-events-none"
        >
          A Private Gastronomic Estate
        </motion.p>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-7xl md:text-9xl font-serif tracking-[0.25em] text-gold-gradient mb-6 select-none pointer-events-none"
        >
          ATIKUA
        </motion.h1>

        {/* Subtitle */}
        <motion.h2
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
          className="text-xl md:text-3xl font-serif tracking-[0.2em] text-luxury-cream/90 font-light mb-12 uppercase pointer-events-none"
        >
          Experience Fine Dining
        </motion.h2>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-6 items-center pointer-events-auto"
        >
          <button
            onClick={() => {
              console.log("Hero button clicked: Reserve Table");
              scrollToSection('#section-reservation');
            }}
            className="w-48 py-4 bg-luxury-gold text-luxury-bg hover:bg-luxury-cream hover:text-luxury-bg text-xs tracking-[0.25em] uppercase font-sans font-semibold transition-all duration-500 rounded-none gold-glow-btn cursor-pointer"
          >
            Reserve Table
          </button>
          <button
            onClick={() => {
              console.log("Hero button clicked: Explore Menu");
              scrollToSection('#section-menu');
            }}
            className="w-48 py-4 border border-luxury-cream/20 text-luxury-cream hover:border-luxury-gold hover:text-luxury-gold text-xs tracking-[0.25em] uppercase font-sans font-medium transition-all duration-500 rounded-none bg-luxury-bg/30 backdrop-blur-sm cursor-pointer"
          >
            Explore Menu
          </button>
        </motion.div>

        {/* Scroll down indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-8 flex flex-col items-center cursor-pointer group pointer-events-auto"
          onClick={() => scrollToSection('#section-showcase')}
        >
          <span className="text-[9px] tracking-[0.35em] uppercase text-luxury-cream/40 group-hover:text-luxury-gold transition-colors duration-300 mb-2 font-light">
            Scroll To Enter
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 2.0, ease: "easeInOut" }}
          >
            <ChevronDown className="w-5 h-5 text-luxury-gold/50 group-hover:text-luxury-gold transition-colors duration-300" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
