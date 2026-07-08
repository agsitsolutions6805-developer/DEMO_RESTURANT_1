'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface MenuItem {
  id: string;
  name: string;
  price: string;
  description: string;
  image?: string;
  featured?: boolean;
}

const MENU_DATA: Record<string, MenuItem[]> = {
  appetizers: [
    {
      id: 'app-1',
      name: 'Caviar Empress Dome',
      price: '$180',
      description: 'Premium black sturgeon caviar served on mother-of-pearl spoon, sitting on a bed of ice, decorated with delicate edible gold leaf and micro flowers.',
      image: '/images/caviar.png',
      featured: true,
    },
    {
      id: 'app-2',
      name: 'Glacier Oyster Duo',
      price: '$60',
      description: 'Chilled oysters from the Alaskan depths, topped with yuzu foam, finger lime pearls, and fresh sea grapes.',
      image: '/images/salmon_hq.png',
    },
    {
      id: 'app-3',
      name: 'Heirloom Tomato Tartare',
      price: '$42',
      description: 'Compressed heirloom tomatoes, smoked almond ricotta, basil essence cloud, and aged balsamic glaze spheres.',
      image: '/images/caviar_hq.png',
    },
  ],
  mains: [
    {
      id: 'main-1',
      name: 'Wood-Charred Miyazaki Wagyu',
      price: '$250',
      description: 'A5 Japanese Miyazaki Wagyu perfectly seared, sliced, garnished with microgreens, gold leaf flakes, served on a charcoal stone plate with red wine truffle reduction.',
      image: '/images/wagyu.png',
      featured: true,
    },
    {
      id: 'main-2',
      name: 'Truffle Lobster Thermidor',
      price: '$145',
      description: 'Maine lobster tail butter-poached in cognac cream, gratinéed under 36-month Parmigiano and fresh shaved Alba white truffles.',
      image: '/images/wagyu.png',
    },
    {
      id: 'main-3',
      name: 'Golden Saffron Seabass',
      price: '$110',
      description: 'Pan-seared Chilean sea bass wrapped in edible gold foil, served over saffron emulsion and sea bean salad.',
      image: '/images/salmon_hq.png',
    },
  ],
  signatures: [
    {
      id: 'sig-1',
      name: 'Caviar Empress Dome',
      price: '$180',
      description: 'Premium black sturgeon caviar served on mother-of-pearl spoon, sitting on a bed of ice, decorated with delicate edible gold leaf and micro flowers.',
      image: '/images/caviar.png',
      featured: true,
    },
    {
      id: 'sig-2',
      name: 'Wood-Charred Miyazaki Wagyu',
      price: '$250',
      description: 'A5 Japanese Miyazaki Wagyu perfectly seared, sliced, garnished with microgreens, gold leaf flakes, served on a charcoal stone plate with red wine truffle reduction.',
      image: '/images/wagyu.png',
      featured: true,
    },
    {
      id: 'sig-3',
      name: 'White Truffle & Porcini Tagliolini',
      price: '$120',
      description: 'Hand-cut egg pasta tossed in emulsified Normandy butter, served tableside with unlimited shavings of premium winter white truffles.',
      image: '/images/dessert_hq.png',
    },
  ],
  desserts: [
    {
      id: 'des-1',
      name: 'Imperial Cocoa Dome',
      price: '$75',
      description: 'Glossy dark single-origin chocolate sphere, drizzled with hot golden caramel sauce to melt, gold leaf, and micro mint.',
      image: '/images/dessert.png',
      featured: true,
    },
    {
      id: 'des-2',
      name: 'Saffron Gold Crème',
      price: '$55',
      description: 'Rich Madagascan vanilla bean custard infused with organic saffron threads, topped with a crisp caramelized sugar disk and gold flakes.',
      image: '/images/dessert_hq.png',
    },
    {
      id: 'des-3',
      name: 'Matcha Forest Moss',
      price: '$60',
      description: 'Ceremonial-grade Japanese matcha sponge, sweet yuzu gel cores, dark chocolate branches, and white chocolate powder.',
      image: '/images/dessert.png',
    },
  ],
  mixology: [
    {
      id: 'mix-1',
      name: 'The Elixir Royale',
      price: '$45',
      description: 'Smoky artisanal mezcal combined with clarified orange bitters, resting on a slow-melting clear ice cube, decorated with floating gold leaf.',
      image: '/images/cocktail.png',
      featured: true,
    },
    {
      id: 'mix-2',
      name: 'Smoked Cedar Old Fashioned',
      price: '$38',
      description: '18-year aged single malt scotch, custom aromatic house bitters, stirred on cedar wood fire tableside and served in a flamed glass.',
      image: '/images/cocktail_hq.png',
    },
    {
      id: 'mix-3',
      name: 'Jasmine Blossom Negroni',
      price: '$35',
      description: 'Clarified dry gin, jasmine-flower-infused sweet vermouth, elderflower mist, and an edible flower floating garnish.',
      image: '/images/cocktail.png',
    },
  ],
};

const CATEGORIES = [
  { key: 'signatures', label: 'Chef\'s Signatures' },
  { key: 'appetizers', label: 'Appetizers' },
  { key: 'mains', label: 'Main Course' },
  { key: 'desserts', label: 'Desserts' },
  { key: 'mixology', label: 'Mixology' },
];

// Extract all valid image paths to preload
const ALL_MENU_IMAGES = Object.values(MENU_DATA)
  .flatMap((items) => items.map((item) => item.image))
  .filter((img): img is string => !!img);

// ─── Image Component with Fallback ────────────────────────────────
function MenuItemImage({ src, alt, imagesLoaded }: { src?: string; alt: string; imagesLoaded: boolean }) {
  const [failed, setFailed] = useState(!src);

  if (failed || !src) {
    return (
      <div className="w-full h-full min-h-[500px] flex flex-col items-center justify-center bg-luxury-bg/60 border border-luxury-gold/8">
        <div className="w-12 h-12 rounded-full border border-luxury-gold/20 flex items-center justify-center mb-3">
          <span className="text-luxury-gold/30 text-lg">✦</span>
        </div>
        <span className="text-[10px] tracking-[0.2em] uppercase text-luxury-cream/20 font-sans">Image Coming Soon</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="100vw"
      className="object-contain transition-transform duration-700 group-hover:scale-105"
      onError={() => setFailed(true)}
      priority={imagesLoaded}
    />
  );
}

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState('signatures');
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // Preload all menu images
  useEffect(() => {
    let active = true;
    const preload = async () => {
      try {
        const promises = ALL_MENU_IMAGES.map((src) => {
          return new Promise((resolve) => {
            const img = new window.Image();
            img.src = src;
            img.onload = resolve;
            img.onerror = resolve; // Resolve anyway to prevent blocking forever if an image fails
          });
        });
        await Promise.all(promises);
        if (active) setImagesLoaded(true);
      } catch (e) {
        if (active) setImagesLoaded(true);
      }
    };
    preload();
    return () => {
      active = false;
    };
  }, []);

  const sectionRef = useRef<HTMLDivElement>(null);

  if (!imagesLoaded) {
    return (
      <section
        id="menu"
        className="relative py-24 md:py-40 bg-luxury-bg z-10 border-t border-luxury-gold/5 flex items-center justify-center min-h-screen"
      >
        <div className="text-center space-y-4">
          <div className="w-10 h-10 rounded-full border-2 border-luxury-gold/20 border-t-luxury-gold animate-spin mx-auto" />
          <span className="text-[9px] tracking-[0.25em] uppercase text-luxury-gold/50 font-sans block">Preloading Gallery...</span>
        </div>
      </section>
    );
  }

  const activeDishes = MENU_DATA[activeCategory] || [];

  return (
    <section
      id="menu"
      ref={sectionRef}
      className="relative py-24 md:py-40 bg-luxury-bg z-10 border-t border-luxury-gold/5 overflow-hidden w-full"
      style={{ minHeight: '100vh' }}
    >
      {/* Decorative gradient radial background */}
      <div className="absolute left-0 bottom-1/4 w-[500px] h-[500px] bg-luxury-gold/2 blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative">
        
        {/* Title */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center space-y-3 mb-16 md:mb-24"
        >
          <span className="text-xs md:text-sm tracking-[0.4em] uppercase text-luxury-gold block font-sans">
            Culinary Offerings
          </span>
          <h2 className="text-4xl md:text-6xl font-serif tracking-[0.1em] text-luxury-cream">
            THE ART OF GASTRONOMY
          </h2>
          <div className="w-24 h-[1px] bg-luxury-gold/50 mx-auto mt-6" />
        </motion.div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-16 md:mb-24 relative z-20">
          {CATEGORIES.map((cat) => {
            const active = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`relative px-4 py-2 text-xs md:text-sm tracking-[0.2em] uppercase font-sans transition-colors duration-300 cursor-pointer ${
                  active ? 'text-luxury-gold font-medium' : 'text-luxury-cream/60 hover:text-luxury-cream'
                }`}
              >
                <span className="relative z-10">{cat.label}</span>
                {active && (
                  <motion.span
                    layoutId="active-menu-tab"
                    className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-luxury-gold"
                    transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Menu Items - Only display activeCategory items with smooth cross-fade */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-[95vw] xl:max-w-[1400px] mx-auto space-y-8"
          >
            {activeDishes.map((item, idx) => (
              <div
                key={item.id}
                className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 bg-luxury-card/30 p-6 md:p-8 lg:p-10 border border-luxury-gold/10 glass-panel group"
              >
                {/* Image Container */}
                <div className="md:col-span-4 lg:col-span-3 relative overflow-hidden w-full aspect-square rounded-sm">
                  <MenuItemImage src={item.image || '/images/wagyu.png'} alt={item.name} imagesLoaded={imagesLoaded} />
                </div>

                {/* Text details */}
                <div className="md:col-span-8 lg:col-span-9 flex flex-col justify-center space-y-5">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-baseline gap-2 md:gap-4">
                    <h3 className="font-serif text-xl md:text-2xl tracking-[0.1em] text-luxury-cream group-hover:text-luxury-gold transition-colors duration-300">
                      {item.name}
                    </h3>
                    <span className="hidden md:block border-b border-dotted border-luxury-gold/25 mx-4 h-[1px] grow" />
                    <span className="font-serif text-xl md:text-2xl text-luxury-gold tracking-[0.05em]">
                      {item.price}
                    </span>
                  </div>

                  <p className="text-sm md:text-base text-luxury-cream/65 font-sans font-light leading-relaxed tracking-[0.05em] max-w-4xl">
                    {item.description}
                  </p>

                  {item.featured && (
                    <div className="pt-3 flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-luxury-gold animate-pulse shadow-[0_0_8px_rgba(200,169,126,0.6)]" />
                      <span className="text-xs tracking-[0.25em] uppercase text-luxury-gold font-semibold">
                        Chef's Recommendation
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
}
