'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_ITEMS = [
  { name: 'Philosophy', href: '#philosophy' },
  { name: 'Culinary Menu', href: '#menu' },
  { name: 'Experience', href: '/experience' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setScrolled(true);
      } else {
        setScrolled(false);
        // Also close the mobile menu if they scroll back to top
        setIsOpen(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    if (id.startsWith('#')) {
      e.preventDefault();
      setIsOpen(false);
      const element = document.querySelector(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
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
        className="fixed top-6 left-1/2 -translate-x-1/2 z-[1000] w-[calc(100%-2rem)] max-w-6xl rounded-full border border-luxury-gold/15 bg-luxury-bg/50 backdrop-blur-lg shadow-[0_12px_40px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.05),0_0_20px_rgba(200,169,126,0.02)] transition-all duration-300 py-2.5 px-6 md:px-8 pointer-events-auto"
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a
            href="#"
            onClick={(e) => scrollToSection(e, '#hero')}
            className="font-serif text-xl md:text-2xl tracking-[0.25em] text-luxury-cream hover:text-luxury-gold transition-colors duration-300 pointer-events-auto py-1"
          >
            ATIKUA
          </a>

          {/* Desktop Nav Items */}
          <div 
            className="hidden md:flex items-center gap-8 relative"
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {NAV_ITEMS.map((item, idx) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => scrollToSection(e, item.href)}
                onMouseEnter={() => setHoveredIndex(idx)}
                className="relative text-[10px] tracking-[0.25em] uppercase font-sans text-luxury-cream/80 hover:text-luxury-cream transition-colors duration-300 py-2 px-1 pointer-events-auto"
              >
                <span className="relative z-10">{item.name}</span>
                {hoveredIndex === idx && (
                  <motion.span
                    layoutId="hover-underline"
                    className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-luxury-gold"
                    transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                  />
                )}
              </a>
            ))}
          </div>

          {/* Book Table Button */}
          <div className="hidden md:block">
            <a
              href="#section-reservation"
              onClick={(e) => scrollToSection(e, '#section-reservation')}
              className="px-5 py-2 border border-luxury-gold/30 text-luxury-gold hover:text-luxury-bg hover:bg-luxury-gold text-[10px] tracking-[0.2em] uppercase font-sans transition-all duration-500 rounded-full gold-glow-btn pointer-events-auto"
            >
              Reserve A Table
            </a>
          </div>

          {/* Mobile Menu Toggle (Hamburger svg morphing to X) */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden flex items-center justify-center w-9 h-9 text-luxury-cream hover:text-luxury-gold transition-colors focus:outline-none pointer-events-auto cursor-pointer"
            aria-label="Toggle Menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="stroke-current">
              <line
                x1="4"
                y1="6"
                x2="20"
                y2="6"
                strokeWidth="1.5"
                strokeLinecap="round"
                className={`transition-all duration-300 origin-[12px_6px] ${
                  isOpen ? 'rotate-45 translate-y-[6px]' : ''
                }`}
              />
              <line
                x1="4"
                y1="12"
                x2="20"
                y2="12"
                strokeWidth="1.5"
                strokeLinecap="round"
                className={`transition-all duration-200 ${
                  isOpen ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <line
                x1="4"
                y1="18"
                x2="20"
                y2="18"
                strokeWidth="1.5"
                strokeLinecap="round"
                className={`transition-all duration-300 origin-[12px_18px] ${
                  isOpen ? '-rotate-45 -translate-y-[6px]' : ''
                }`}
              />
            </svg>
          </button>
        </div>
      </motion.nav>

      {/* Subtle floating hamburger trigger visible when not scrolled */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: (scrolled || isOpen) ? 0 : 0.3,
          pointerEvents: (scrolled || isOpen) ? 'none' : 'auto'
        }}
        transition={{ duration: 0.4 }}
        className="fixed top-6 right-6 md:right-12 z-[1000]"
      >
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center w-10 h-10 border border-luxury-cream/20 text-luxury-cream hover:text-luxury-gold hover:border-luxury-gold/50 rounded-full transition-all duration-300 pointer-events-auto cursor-pointer bg-black/10 backdrop-blur-sm"
          aria-label="Open Menu"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="stroke-current">
            <line x1="4" y1="6" x2="20" y2="6" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="4" y1="12" x2="20" y2="12" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="4" y1="18" x2="20" y2="18" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </motion.div>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[999] bg-luxury-bg/85 backdrop-blur-2xl flex flex-col justify-center items-center pointer-events-auto"
          >
            {/* Background geometric accents to feel premium */}
            <div className="absolute top-[20%] left-[10%] w-72 h-72 bg-luxury-gold/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[20%] right-[10%] w-72 h-72 bg-luxury-cream/3 rounded-full blur-[100px] pointer-events-none" />

            <div className="flex flex-col items-center gap-8 relative z-10">
              {NAV_ITEMS.map((item, idx) => (
                <motion.a
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ delay: idx * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  key={item.name}
                  href={item.href}
                  onClick={(e) => scrollToSection(e, item.href)}
                  className="font-serif text-2xl tracking-[0.2em] text-luxury-cream hover:text-luxury-gold transition-all duration-300 py-1 hover:scale-105 active:scale-95"
                >
                  {item.name}
                </motion.a>
              ))}
              <motion.a
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ delay: NAV_ITEMS.length * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                href="#section-reservation"
                onClick={(e) => scrollToSection(e, '#section-reservation')}
                className="mt-6 px-8 py-3.5 border border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-luxury-bg text-xs tracking-[0.2em] uppercase font-sans transition-all duration-300 rounded-full shadow-[0_0_20px_rgba(200,169,126,0.15)] hover:shadow-[0_0_30px_rgba(200,169,126,0.3)]"
              >
                Reserve A Table
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

