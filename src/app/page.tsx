'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShowcaseProvider, useShowcase, useScroll } from '@/context/ShowcaseContext';
import dynamic from 'next/dynamic';

const UnifiedCanvas = dynamic(() => import('@/components/UnifiedCanvas'), { ssr: false });
const Hero = dynamic(() => import('@/components/Hero'), { ssr: false });
const FoodShowcase = dynamic(() => import('@/components/FoodShowcase'), { ssr: false });
const Menu = dynamic(() => import('@/components/Menu'), { ssr: false });
const Philosophy = dynamic(() => import('@/components/Philosophy'), { ssr: false });
const Reservation = dynamic(() => import('@/components/Reservation'), { ssr: false });
const Footer = dynamic(() => import('@/components/Footer'), { ssr: false });
const Navbar = dynamic(() => import('@/components/Navbar'), { ssr: false });


gsap.registerPlugin(ScrollTrigger);

function MainStoryteller() {
  const { activeSection, setActiveSection } = useShowcase();
  const { setScrollProgress } = useScroll();

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: '#section-hero',
        start: 'top center',
        end: 'bottom center',
        onEnter: () => setActiveSection(0),
        onEnterBack: () => setActiveSection(0),
      });

      ScrollTrigger.create({
        trigger: '#section-showcase',
        start: 'top center',
        end: 'bottom center',
        onEnter: () => setActiveSection(1),
        onEnterBack: () => setActiveSection(1),
        onUpdate: (self) => setScrollProgress(self.progress),
      });

      ScrollTrigger.create({
        trigger: '#section-menu',
        start: 'top center',
        end: 'bottom center',
        onEnter: () => setActiveSection(2),
        onEnterBack: () => setActiveSection(2),
      });

      ScrollTrigger.create({
        trigger: '#section-philosophy',
        start: 'top center',
        end: 'bottom center',
        onEnter: () => setActiveSection(3),
        onEnterBack: () => setActiveSection(3),
      });

      ScrollTrigger.create({
        trigger: '#section-reservation',
        start: 'top center',
        end: 'bottom center',
        onEnter: () => setActiveSection(4),
        onEnterBack: () => setActiveSection(4),
      });
    });

    return () => {
      ctx.revert();
    };
  }, [setActiveSection, setScrollProgress]);

  return (
    <main className="relative w-full bg-luxury-bg text-luxury-cream overflow-x-hidden min-h-screen">
      <Navbar />

      {/*
        FIXED 3D BACKGROUND — stays at z-0. 
        Because overlay sections above use pointer-events-none, clicks pass through
        to the 3D canvas automatically, without needing to raise canvas z-index.
      */}
      <div className="fixed inset-0 w-full h-screen pointer-events-auto transition-all duration-300 z-0">
        <UnifiedCanvas />
      </div>

      {/*
        OVERLAY SECTIONS — z-10, pointer-events-none by default.
        Each section uses pointer-events-none so transparent areas pass clicks
        straight down to the canvas below.
        Only concrete interactive elements (buttons, inputs, links) opt back in
        with pointer-events-auto inside each component.
      */}
      <div className="relative z-10 w-full pointer-events-none">

        {/* Section 0: Hero */}
        <div 
          id="section-hero" 
          className={`relative w-full pointer-events-none ${activeSection === 0 ? 'z-10' : activeSection > 0 ? 'z-[1]' : 'z-[0]'}`}
        >
          <Hero />
        </div>

        {/* Section 1: Food Showcase */}
        <div 
          id="section-showcase" 
          className={`relative w-full pointer-events-none ${activeSection === 1 ? 'z-10' : activeSection > 1 ? 'z-[1]' : 'z-[0]'}`}
        >
          <FoodShowcase />
        </div>

        {/* Section 2: Menu */}
        <div 
          id="section-menu" 
          className={`relative w-full pointer-events-none ${activeSection === 2 ? 'z-10' : activeSection > 2 ? 'z-[1]' : 'z-[0]'}`}
        >
          <Menu />
        </div>

        {/* Section 3: Philosophy */}
        <div 
          id="section-philosophy" 
          className={`relative w-full pointer-events-none ${activeSection === 3 ? 'z-10' : activeSection > 3 ? 'z-[1]' : 'z-[0]'}`}
        >
          <Philosophy />
        </div>

        {/* Section 4: Reservation */}
        <div 
          id="section-reservation" 
          className={`relative w-full pointer-events-none ${activeSection === 4 ? 'z-10' : activeSection > 4 ? 'z-[1]' : 'z-[0]'}`}
        >
          <Reservation />
        </div>

        {/* Footer — opaque background, fully interactive */}
        <div className="w-full pointer-events-auto bg-luxury-bg border-t border-luxury-gold/10 relative z-20">
          <Footer />
        </div>

      </div>
    </main>
  );
}

export default function Home() {
  return (
    <ShowcaseProvider>
      <MainStoryteller />
    </ShowcaseProvider>
  );
}
