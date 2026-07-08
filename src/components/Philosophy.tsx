'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';

export default function Philosophy() {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  // Parallax scroll settings
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start']
  });

  const imageTranslateY = useTransform(scrollYProgress, [0, 1], [-80, 80]);
  const borderTranslateY = useTransform(scrollYProgress, [0, 1], [-40, 40]);
  const textTranslateY = useTransform(scrollYProgress, [0, 1], [30, -30]);

  return (
    <section
      id="philosophy"
      ref={sectionRef}
      className="relative py-24 md:py-40 bg-luxury-bg z-10 overflow-hidden border-t border-luxury-gold/5 flex items-center"
    >
      {/* Decorative subtle background gold accent */}
      <div className="absolute right-0 top-1/4 w-[400px] h-[400px] bg-luxury-gold/2 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
          
          {/* Asymmetrical Image Layout (lg: 7 cols) */}
          <div className="relative lg:col-span-6 h-[400px] sm:h-[500px] md:h-[600px] flex items-center justify-center">
            
            {/* Parallax Golden Frame */}
            <motion.div
              style={{ y: borderTranslateY }}
              className="absolute inset-0 border border-luxury-gold/20 m-6 translate-x-4 translate-y-4 pointer-events-none"
            />
            
            {/* Parallax Image Wrapper */}
            <motion.div
              style={{ y: imageTranslateY }}
              className="relative w-full h-full overflow-hidden filter grayscale brightness-90 contrast-105"
            >
              <Image
                src="/images/interior.png"
                alt="ATIKUA Dining Atmosphere"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 hover:scale-105"
                priority
              />
              {/* Overlay styling to blend image borders into dark background */}
              <div className="absolute inset-0 bg-gradient-to-t from-luxury-bg/50 via-transparent to-luxury-bg/20" />
            </motion.div>
          </div>

          {/* Description Text Layout (lg: 5 cols) */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <motion.div
              style={{ y: textTranslateY }}
              className="space-y-8"
            >
              {/* Heading */}
              <div className="space-y-3">
                <span className="text-xs md:text-sm tracking-[0.4em] uppercase text-luxury-gold block font-sans">
                  The Philosophy
                </span>
                <h2 className="text-4xl md:text-5xl font-serif tracking-[0.1em] text-luxury-cream leading-tight">
                  THE ETHOS OF <br />CULINARY ALCHEMY
                </h2>
              </div>

              {/* Decorative line */}
              <div className="w-16 h-[1px] bg-luxury-gold/50" />

              {/* Details paragraphs */}
              <div className="space-y-6 text-sm md:text-base text-luxury-cream/70 font-sans font-light leading-relaxed tracking-[0.08em]">
                <p>
                  At ATIKUA, dining is not merely a meal; it is a sacred ceremony of elements. Our culinary creations pay homage to fire, earth, water, and air, harmonizing them into rare gastronomic textures and unforgettable palettes.
                </p>
                <p>
                  Led by Master Chef Alejandro Silva, our team sourcing organic rarities from exclusive micro-estates. We synthesize traditional, ancestral wood-fire smoking methods with vanguard culinary science, transforming pure ingredients into liquid gold and sensory art.
                </p>
              </div>

              {/* Signature element */}
              <div className="pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <div>
                  <span className="font-serif text-2xl tracking-[0.15em] text-luxury-gold italic block">
                    Alejandro Silva
                  </span>
                  <span className="text-[10px] tracking-[0.3em] uppercase text-luxury-cream/40 block mt-1">
                    Culinary Director & Founder
                  </span>
                </div>
                <div className="pt-2 sm:pt-0">
                  <a
                    href="/experience"
                    className="inline-block px-5 py-3 border border-luxury-gold/30 hover:border-luxury-gold text-luxury-gold text-[9px] tracking-[0.25em] uppercase font-sans transition-all duration-500 rounded-none bg-luxury-bg/40 backdrop-blur-sm shadow-sm"
                  >
                    Discover The Experience →
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
