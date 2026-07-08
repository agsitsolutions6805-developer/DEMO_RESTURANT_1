'use client';

import React, { useRef, useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

// -------------------------------------------------------------
// DATA
// -------------------------------------------------------------
const SENSES = [
  {
    id: 'taste',
    title: 'Taste',
    subtitle: 'A SYMPHONY OF FLAVOR',
    description: 'Every ingredient is meticulously sourced and balanced to perfection. Experience the subtle interplay of sweet, umami, and rich earthy undertones.',
    image: '/images/wagyu.png',
  },
  {
    id: 'aroma',
    title: 'Aroma',
    subtitle: 'ESSENCE OF THE HEARTH',
    description: 'Breathe in the ancient elements. Aged cedar and hickory wood smoke infuse each dish with a primal, nostalgic fragrance that awakens the senses.',
    image: '/images/caviar_hq.png',
  },
  {
    id: 'sight',
    title: 'Sight',
    subtitle: 'PLATING AS CANVAS',
    description: 'Visual architecture crafted on marble. We play with geometry, contrast, and negative space to compose a masterpiece that devours the eyes first.',
    image: '/images/salmon_hq.png',
  },
  {
    id: 'sound',
    title: 'Sound',
    subtitle: 'RESONANCE OF LUXURY',
    description: 'The crisp snap of a sugar dome, the effervescent pour of vintage champagne, the ambient acoustic resonance of our dining hall.',
    image: '/images/cocktail_hq.png',
  },
  {
    id: 'touch',
    title: 'Touch',
    subtitle: 'TACTILE ELEGANCE',
    description: 'From the weight of bespoke silverware to the warmth of hand-thrown ceramics, every texture is designed to ground you in the moment.',
    image: '/images/dessert_hq.png',
  }
];

// -------------------------------------------------------------
// 3D PARTICLE COMPONENTS
// -------------------------------------------------------------

function TasteParticles({ scrollProgress }: { scrollProgress: any }) {
  const ref = useRef<THREE.Points>(null);
  const count = 500;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = 2 + Math.random() * 3;
      const theta = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 4;
      pos[i * 3] = Math.cos(theta) * radius;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = Math.sin(theta) * radius;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.1;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3}>
      <PointMaterial transparent color="#C8A97E" size={0.03} sizeAttenuation={true} depthWrite={false} opacity={0.6} />
    </Points>
  );
}

function AromaParticles() {
  const ref = useRef<THREE.Points>(null);
  const count = 800;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 6;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4 - 2;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      const positions = ref.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < count; i++) {
        positions[i * 3 + 1] += 0.01;
        if (positions[i * 3 + 1] > 4) positions[i * 3 + 1] = -4;
        positions[i * 3] += Math.sin(state.clock.elapsedTime + i) * 0.005;
      }
      ref.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3}>
      <PointMaterial transparent color="#F5F1EA" size={0.05} sizeAttenuation={true} depthWrite={false} opacity={0.3} />
    </Points>
  );
}

function SoundWaves() {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.children.forEach((child, i) => {
        const scale = 1 + (state.clock.elapsedTime * 0.5 + i * 0.5) % 3;
        child.scale.set(scale, scale, scale);
        ((child as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity = Math.max(0, 1 - scale / 3) * 0.4;
      });
    }
  });

  return (
    <group ref={ref} rotation={[Math.PI / 3, 0, 0]}>
      {[0, 1, 2].map((i) => (
        <mesh key={i}>
          <ringGeometry args={[2, 2.02, 64]} />
          <meshBasicMaterial color="#C8A97E" transparent opacity={0} depthWrite={false} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

function SensoryScene({ scrollProgress }: { scrollProgress: any }) {
  const [activeIdx, setActiveIdx] = React.useState(0);

  useFrame(() => {
    const progress = scrollProgress.get();
    let idx = Math.floor(progress * 5);
    if (idx >= 5) idx = 4;
    if (idx < 0) idx = 0;
    if (idx !== activeIdx) setActiveIdx(idx);
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      {activeIdx === 0 && <TasteParticles scrollProgress={scrollProgress} />}
      {activeIdx === 1 && <AromaParticles />}
      {activeIdx === 3 && <SoundWaves />}
    </>
  );
}

// -------------------------------------------------------------
// SUB-COMPONENTS FOR HOOKS
// -------------------------------------------------------------

// Build a strictly-increasing keyframe array clamped to [0,1].
// For idx=0, start is immediately visible (no fade-in).
// For idx=4, end stays visible (no fade-out).
function buildKeyframes(idx: number): [number[], number[], number[]] {
  const slot = 1 / 5; // 0.2
  const start = idx * slot;
  const end = (idx + 1) * slot;
  const overlap = 0.04; // cross-fade window

  if (idx === 0) {
    // Immediately visible; fades out at its end.
    // 3-point: [0, end, end+overlap] → [1, 1, 0]
    const a = 0;
    const b = end;
    const c = Math.min(1, end + overlap);
    return [[a, b, c], [1, 1, 0], [0, 0, 0]]; // third array = y offsets
  } else if (idx === 4) {
    // Fades in from start; stays visible to 1.0.
    // 3-point: [start-overlap, start, 1] → [0, 1, 1]
    const a = Math.max(0, start - overlap);
    const b = start;
    const c = 1;
    return [[a, b, c], [0, 1, 1], [0, 0, 0]];
  } else {
    // Normal: fade in before start, stay visible, fade out after end.
    const a = Math.max(0, start - overlap);
    const b = start;
    const c = end;
    const d = Math.min(1, end + overlap);
    return [[a, b, c, d], [0, 1, 1, 0], [0, 0, 0, 0]];
  }
}

function SenseVisualItem({ sense, idx, scrollYProgress }: { sense: any, idx: number, scrollYProgress: any }) {
  const [inputRange, opacityOutput] = buildKeyframes(idx);

  // y offset: senses come in from slightly below, exit upward
  const yInput = inputRange;
  const yOutput = idx === 0
    ? [0, 0, -30]          // already here; just exit up
    : idx === 4
    ? [20, 0, 0]           // enter from below; stay
    : [20, 0, 0, -20];     // enter from below, exit up

  const opacity = useTransform(scrollYProgress, inputRange, opacityOutput);
  const scale   = useTransform(scrollYProgress, inputRange,
    idx === 0 ? [1, 1, 1.05]
    : idx === 4 ? [1.05, 1, 1]
    : [1.05, 1, 1, 1.05]
  );

  return (
    <motion.div
      style={{ opacity, scale }}
      className="absolute inset-0 w-full h-full flex items-center justify-center"
    >
      {sense.id === 'taste' && (
        <div className="relative w-[300px] md:w-[500px] h-[300px] md:h-[500px] rounded-full overflow-hidden shadow-[0_0_100px_rgba(200,169,126,0.15)]">
          <Image src={sense.image} alt={sense.title} fill className="object-cover" />
        </div>
      )}

      {sense.id === 'aroma' && (
        <div className="relative w-full h-full opacity-60 mix-blend-screen">
          <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-luxury-gold/0 via-luxury-gold/20 to-luxury-gold/0 rotate-[15deg] blur-md" />
          <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-luxury-gold/0 via-luxury-cream/10 to-luxury-gold/0 -rotate-[25deg] blur-lg" />
        </div>
      )}

      {sense.id === 'sight' && (
        <div className="relative w-full h-full">
            <Image src={sense.image} alt={sense.title} fill className="object-cover opacity-40 brightness-75 contrast-125 saturate-50" />
            <div className="absolute inset-0 bg-gradient-to-tr from-luxury-gold/10 via-transparent to-black/80 mix-blend-overlay" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(200,169,126,0.15)_0%,rgba(0,0,0,0.8)_80%)]" />
        </div>
      )}

      {sense.id === 'touch' && (
        <div className="relative w-full h-full">
            <Image src={sense.image} alt={sense.title} fill className="object-cover opacity-30 grayscale blur-[2px]" />
            <div className="absolute inset-0 bg-black/50" />
        </div>
      )}
    </motion.div>
  );
}

function SenseTextItem({ sense, idx, scrollYProgress }: { sense: any, idx: number, scrollYProgress: any }) {
  const [inputRange, opacityOutput] = buildKeyframes(idx);

  const yOutput = idx === 0
    ? [0, 0, -40]
    : idx === 4
    ? [40, 0, 0]
    : [40, 0, 0, -40];

  const blurOutput = idx === 0
    ? ['blur(0px)', 'blur(0px)', 'blur(10px)']
    : idx === 4
    ? ['blur(10px)', 'blur(0px)', 'blur(0px)']
    : ['blur(10px)', 'blur(0px)', 'blur(0px)', 'blur(10px)'];

  const opacity = useTransform(scrollYProgress, inputRange, opacityOutput);
  const y       = useTransform(scrollYProgress, inputRange, yOutput);
  const filter  = useTransform(scrollYProgress, inputRange, blurOutput);

  return (
    <motion.div
      style={{ opacity, y, filter }}
      className="absolute inset-0 flex flex-col justify-center items-center space-y-6"
    >
      <h2 className="text-5xl md:text-7xl lg:text-8xl font-serif tracking-[0.15em] text-luxury-cream">
        {sense.title}
      </h2>
      <div className="w-12 h-[1px] bg-luxury-gold/50" />
      <h3 className="text-sm md:text-base tracking-[0.3em] uppercase text-luxury-gold font-medium">
        {sense.subtitle}
      </h3>
      <p className="text-sm md:text-base text-luxury-cream/70 font-sans font-light leading-relaxed tracking-[0.05em] max-w-2xl mt-4">
        {sense.description}
      </p>
    </motion.div>
  );
}

// -------------------------------------------------------------
// MAIN COMPONENT
// -------------------------------------------------------------

export default function SensoryExperience() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    // By ending at 'end end', the scroll progress hits 1 exactly when the bottom of the container reaches the bottom of the screen.
    offset: ['start start', 'end end'],
  });

  return (
    <section
      id="sensory"
      ref={containerRef}
      className="relative h-[350vh] bg-[#050505] z-20"
    >
      <div className="sticky top-0 h-screen w-full flex items-center overflow-hidden bg-[#050505]">
        <div className="absolute inset-0 bg-[#050505]" />
        
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 2]}>
            <SensoryScene scrollProgress={scrollYProgress} />
          </Canvas>
        </div>

        <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center">
          {SENSES.map((sense, idx) => (
            <SenseVisualItem key={`visual-${sense.id}`} sense={sense} idx={idx} scrollYProgress={scrollYProgress} />
          ))}
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-6 md:px-12 w-full h-full flex flex-col justify-center items-center text-center pointer-events-none">
          <div className="mb-20">
            <span className="text-xs md:text-sm tracking-[0.5em] uppercase text-luxury-gold block font-sans mb-4">
              The Sensory Experience
            </span>
          </div>

          <div className="relative w-full h-64 md:h-80 flex items-center justify-center">
            {SENSES.map((sense, idx) => (
              <SenseTextItem key={`text-${sense.id}`} sense={sense} idx={idx} scrollYProgress={scrollYProgress} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
