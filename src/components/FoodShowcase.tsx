'use client';

import { useEffect, useCallback, useState, useRef, useLayoutEffect } from 'react';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  animate,
  useSpring,
} from 'framer-motion';
import { Star, MapPin, Wine } from 'lucide-react';
import { useShowcase } from '@/context/ShowcaseContext';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// DATA
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
interface DishData {
  id: string;
  index: string;
  name: string;
  subtitle: string;
  description: string;
  price: number;
  rating: number;
  ratingStr: string;
  origin: string;
  pairing: string;
  calories: string;
  ingredients: string[];
  image: string;
  accentColor: string;
}

const DISHES: DishData[] = [
  {
    id: 'wagyu',
    index: '01',
    name: 'MIYAZAKI WAGYU',
    subtitle: 'A5 Ribeye Â· Binchotan',
    description: 'Legendary Miyazaki A5 marbling, hand-charred over binchotan and glazed with bone-marrow truffle butter.',
    price: 2200,
    rating: 5,
    ratingStr: '4.9',
    origin: 'Miyazaki Prefecture, Japan',
    pairing: 'Cabernet Sauvignon',
    calories: '680 kcal',
    ingredients: ['A5 Wagyu', 'Truffle Butter', 'Binchotan Coal', 'Bone Marrow'],
    image: '/images/wagyu.png',
    accentColor: 'rgba(180,70,30,0.10)',
  },
  {
    id: 'salmon',
    index: '02',
    name: 'KING SALMON',
    subtitle: 'Sashimi Â· Yuzu',
    description: 'Prime Norwegian King Salmon on cold slate with yuzu glaze, pickled ginger, and micro dill.',
    price: 1850,
    rating: 5,
    ratingStr: '4.8',
    origin: 'Lofoten Islands, Norway',
    pairing: 'Dry Riesling',
    calories: '420 kcal',
    ingredients: ['Ora King Salmon', 'Yuzu Miso', 'Pickled Ginger', 'Micro Dill'],
    image: '/images/salmon_hq.png',
    accentColor: 'rgba(240,100,50,0.08)',
  },
  {
    id: 'caviar',
    index: '03',
    name: 'OSETRA CAVIAR',
    subtitle: 'Imperial Â· Ice Service',
    description: 'Siberian Osetra on crushed ice with warm buckwheat blinis and crÃ¨me fraÃ®che.',
    price: 2850,
    rating: 5,
    ratingStr: '4.9',
    origin: 'Astrakhan, Russia',
    pairing: 'Vintage Brut Champagne',
    calories: '210 kcal',
    ingredients: ['Osetra Roe', 'Buckwheat Blinis', 'CrÃ¨me FraÃ®che', 'Chives'],
    image: '/images/caviar_hq.png',
    accentColor: 'rgba(200,169,126,0.08)',
  },
  {
    id: 'cocktail',
    index: '04',
    name: 'GOLDEN HOUR',
    subtitle: 'Signature Martini',
    description: 'Artisanal dry gin martini with blood-orange pearls, fresh dill, and 24k gold dust.',
    price: 1250,
    rating: 5,
    ratingStr: '4.7',
    origin: 'London, United Kingdom',
    pairing: 'Caviar Blinis',
    calories: '185 kcal',
    ingredients: ['Triple-Distilled Gin', 'Blood Orange', 'Dry Vermouth', '24k Gold'],
    image: '/images/cocktail_hq.png',
    accentColor: 'rgba(200,150,70,0.08)',
  },
  {
    id: 'dessert',
    index: '05',
    name: 'GOLD SOUFFLÃ‰',
    subtitle: 'Wagyu Cacao Â· 24k',
    description: 'Venezuelan dark chocolate cube with pistachio praline, salted caramel, and edible gold leaf.',
    price: 1650,
    rating: 5,
    ratingStr: '5.0',
    origin: 'Tachira Valley, Venezuela',
    pairing: '20-Year Tawny Port',
    calories: '520 kcal',
    ingredients: ['72% Valrhona Cacao', 'Pistachio Praline', 'Caramel', 'Gold Leaf'],
    image: '/images/dessert_hq.png',
    accentColor: 'rgba(130,90,50,0.10)',
  },
];

// ————————————————————————————————————————————————————————————————————————————————
// MAIN
// ————————————————————————————————————————————————————————————————————————————————
export default function FoodShowcase() {
  const { activeIdx, setActiveIdx } = useShowcase();
  const dish = DISHES[activeIdx];
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const centerColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!sectionRef.current) return;
    
    const ctx = gsap.context(() => {
      // Create GSAP Timeline for pinning and exit animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=1200',
          pin: true,
          pinSpacing: true,
          scrub: 1,
        },
      });

      // 1. Image fades out and scales down
      tl.to(imageWrapperRef.current, { opacity: 0, scale: 0.8, duration: 1 }, 0);
      // 2. Circular plate scales down
      tl.to(bgRef.current, { scale: 0.5, opacity: 0, duration: 1 }, 0.2);
      // 3. Text fades out
      tl.to([leftColRef.current, rightColRef.current], { opacity: 0, y: -40, duration: 1 }, 0.4);
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Price animation
  const priceVal = useMotionValue(0);
  const roundedPrice = useTransform(priceVal, (v) => Math.round(v).toLocaleString());
  
  // Parallax
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 50, damping: 20 });
  const sy = useSpring(my, { stiffness: 50, damping: 20 });
  const dishX = useTransform(sx, [-1, 1], [-16, 16]);
  const dishY = useTransform(sy, [-1, 1], [-10, 10]);

  // Reset transform and dispatch resize layout triggers on dish change
  useEffect(() => {
    const c = animate(priceVal, dish.price, { duration: 0.9, ease: 'easeOut' });
    mx.set(0);
    my.set(0);
    setImageError(false);
    window.dispatchEvent(new Event('resize'));
    return () => c.stop();
  }, [activeIdx, dish.price]);

  useEffect(() => {
    console.log(`[DEBUG] activeIndex: ${activeIdx}, currentDish: ${dish.id}, imageSrc: ${dish.image}, imageLoaded: ${!imageError}`);
  }, [activeIdx, dish, imageError]);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width) * 2 - 1);
    my.set(((e.clientY - r.top) / r.height) * 2 - 1);
  }, []);
  const onMouseLeave = useCallback(() => { mx.set(0); my.set(0); }, []);

  return (
    <div className="w-full pointer-events-auto relative">
      <div
        ref={sectionRef}
        className="relative w-full min-h-screen flex flex-col z-[1] overflow-hidden pointer-events-auto"
        style={{ minHeight: '100vh' }}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
      >
        {/* Ambient dish colour wash */}
      <AnimatePresence mode="wait">
        <motion.div
          key={dish.id}
          ref={bgRef}
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4 }}
          style={{
            background: `radial-gradient(ellipse 50% 45% at 50% 55%, ${dish.accentColor}, transparent 75%)`,
          }}
        />
      </AnimatePresence>

      {/* Main three-column layout */}
      <div className="relative z-10 flex-1 flex items-center w-full max-w-7xl mx-auto px-8 md:px-14 overflow-hidden">
        <div className="grid grid-cols-12 gap-8 w-full items-center">

          {/* ── LEFT: dish info ────────────────────────────── */}
          <div ref={leftColRef} className="col-span-12 lg:col-span-3 pointer-events-auto" style={{ minHeight: isMobile ? '380px' : 'auto' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={dish.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-7"
              >
                <span className="text-[9px] tracking-[0.4em] text-luxury-cream/25 font-sans block">
                  {dish.index} / 05
                </span>

                <div className="space-y-2">
                  <h2 className="text-3xl lg:text-4xl font-serif tracking-[0.04em] text-luxury-cream leading-tight">
                    {dish.name}
                  </h2>
                  <span className="text-[10px] tracking-[0.25em] text-luxury-gold/80 font-sans uppercase block">
                    {dish.subtitle}
                  </span>
                </div>

                <p className="text-[11px] text-luxury-cream/50 leading-relaxed font-sans tracking-wide max-w-[220px]">
                  {dish.description}
                </p>

                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-2.5 h-2.5 ${i < dish.rating ? 'text-luxury-gold fill-current' : 'text-luxury-cream/12'}`} />
                  ))}
                  <span className="text-[9px] text-luxury-cream/30 ml-1.5 font-sans">{dish.ratingStr}</span>
                </div>

                <div className="space-y-1 pt-2 border-t border-luxury-gold/10">
                  <span className="text-[8px] tracking-[0.3em] text-luxury-cream/25 uppercase font-sans block">Price</span>
                  <div className="flex items-baseline gap-0.5 font-serif text-3xl text-luxury-gold">
                    <span className="text-lg">₹</span>
                    <motion.span>{roundedPrice}</motion.span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-[10px] text-luxury-cream/40 font-sans">
                  <MapPin className="w-3 h-3 text-luxury-gold/50 shrink-0" />
                  {dish.origin}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ── CENTER: Clean hero dish image ──────────────── */}
          <div ref={centerColRef} className="col-span-12 lg:col-span-6 relative flex items-center justify-center overflow-hidden w-full h-full" style={{ minHeight: isMobile ? 320 : 480 }}>
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at 50% 55%, rgba(200,120,50,0.06) 0%, transparent 65%)',
                filter: 'blur(30px)',
              }}
            />
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none"
              style={{ width: isMobile ? 200 : 260, height: isMobile ? 22 : 28, background: 'radial-gradient(ellipse, rgba(0,0,0,0.60) 0%, transparent 70%)', filter: 'blur(16px)' }} />

            {/* Showcase Card container */}
            <div 
              className="relative overflow-hidden border border-luxury-gold/10 shadow-[0_24px_48px_rgba(0,0,0,0.75)]"
              style={{ overflow: 'hidden', borderRadius: '50%', width: isMobile ? 260 : 320, height: isMobile ? 260 : 320 }}
            >
              {/* Image Container with: position: relative; overflow: hidden; width: 100%; height: 100%; */}
              <div 
                ref={imageWrapperRef}
                className="relative overflow-hidden w-full h-full" 
                style={{ position: 'relative', overflow: 'hidden', width: '100%', height: '100%', borderRadius: 'inherit' }}
              >
                <motion.div style={{ x: dishX, y: dishY }} className="w-full h-full relative">
                  <motion.div
                    className="w-full h-full relative"
                    animate={{ y: [-8, 8, -8] }}
                    transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <AnimatePresence mode="wait">
                      {imageError ? (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-luxury-card/60 border border-luxury-gold/10 text-center p-4">
                          <span className="text-[10px] tracking-[0.2em] uppercase text-luxury-gold/50 font-sans block mb-1">Image Coming Soon</span>
                          <span className="text-luxury-cream/20 text-xs">✦</span>
                        </div>
                      ) : (
                        <motion.img
                          key={dish.id}
                          src={dish.image}
                          alt={dish.name}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.93 }}
                          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            filter: 'contrast(1.05) saturate(1.10) brightness(1.04)',
                          }}
                          onError={() => setImageError(true)}
                        />
                      )}
                    </AnimatePresence>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* ── RIGHT: pairing + ingredients + calories ──── */}
          <div ref={rightColRef} className="col-span-12 lg:col-span-3 pointer-events-auto" style={{ minHeight: isMobile ? '340px' : 'auto' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={dish.id + 'r'}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <span className="text-[8px] tracking-[0.32em] text-luxury-cream/25 uppercase font-sans block">
                    Pairing
                  </span>
                  <span className="text-xs text-luxury-cream/80 font-serif block">{dish.pairing}</span>
                </div>

                <div className="space-y-2 border-t border-luxury-gold/8 pt-5">
                  <span className="text-[8px] tracking-[0.32em] text-luxury-cream/25 uppercase font-sans block">Calories</span>
                  <span className="text-xs text-luxury-cream/70 font-sans">{dish.calories}</span>
                </div>

                <div className="space-y-3 border-t border-luxury-gold/8 pt-5">
                  <span className="text-[8px] tracking-[0.32em] text-luxury-cream/25 uppercase font-sans block">Ingredients</span>
                  <ul className="space-y-1.5">
                    {dish.ingredients.map((ing) => (
                      <li key={ing} className="flex items-center gap-2 text-[10px] text-luxury-cream/60 font-sans">
                        <span className="w-1 h-1 rounded-full bg-luxury-gold/50 shrink-0" />
                        {ing}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2 border-t border-luxury-gold/8 pt-5">
                  <div className="flex justify-between items-center">
                    <span className="text-[8px] tracking-[0.32em] text-luxury-cream/25 uppercase font-sans">Rating</span>
                    <span className="text-[10px] text-luxury-gold font-sans font-semibold">{dish.ratingStr} / 5.0</span>
                  </div>
                  <div className="w-full h-[2px] bg-luxury-gold/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-luxury-gold rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(parseFloat(dish.ratingStr) / 5) * 100}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>

      {/* â”€â”€ Carousel â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="relative z-20 w-full border-t border-luxury-gold/8 pointer-events-auto"
        style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(12px)' }}>
        <div className="max-w-7xl mx-auto px-8 md:px-14 py-3.5 flex gap-2.5 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {DISHES.map((d, idx) => {
            const active = activeIdx === idx;
            return (
              <button
                key={d.id}
                onClick={() => setActiveIdx(idx)}
                className={`flex-shrink-0 relative overflow-hidden border transition-all duration-500 text-left cursor-pointer ${
                  active ? 'border-luxury-gold/50 w-40' : 'border-luxury-gold/8 w-28 hover:border-luxury-gold/20'
                }`}
                style={{ height: 72 }}
              >
                <img
                  src={d.image}
                  alt={d.name}
                  className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${active ? 'opacity-40 scale-105' : 'opacity-15 grayscale'}`}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
                <div className="relative z-10 p-2.5 h-full flex flex-col justify-between">
                  <span className={`font-serif text-[9px] leading-tight transition-colors duration-300 ${active ? 'text-luxury-gold' : 'text-luxury-cream/50'}`}>
                    {d.name}
                  </span>
                  <span className="font-sans text-[8px] text-luxury-gold/60 font-medium">â‚¹{d.price.toLocaleString()}</span>
                </div>
                {active && <motion.div layoutId="carousel-bar" className="absolute bottom-0 left-0 right-0 h-px bg-luxury-gold" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  </div>
);
}
