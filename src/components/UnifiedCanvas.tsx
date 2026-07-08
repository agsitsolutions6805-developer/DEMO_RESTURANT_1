'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useTexture, useGLTF } from '@react-three/drei';
import { useRef, useState, useEffect, Suspense } from 'react';
import * as THREE from 'three';
import { useShowcase, useScroll } from '@/context/ShowcaseContext';

// -------------------------------------------------------------
// TABLES & DATA FOR FLOOR MAP
// -------------------------------------------------------------
interface TableData {
  id: number;
  area: string;
  capacity: number;
  available: boolean;
  position: [number, number, number];
  type: 'round' | 'square' | 'rect';
}

const TABLES: TableData[] = [
  { id: 1, area: 'Main Hall', capacity: 4, available: true, position: [-2.0, 0, -1.0], type: 'round' },
  { id: 2, area: 'Main Hall', capacity: 2, available: true, position: [-2.0, 0, 1.0], type: 'square' },
  { id: 3, area: 'Main Hall', capacity: 6, available: true, position: [0.0, 0, -1.2], type: 'round' },
  { id: 4, area: 'The Vault', capacity: 8, available: true, position: [2.2, 0, -1.0], type: 'rect' },
  { id: 5, area: 'Chefs Counter', capacity: 2, available: true, position: [2.2, 0, 1.2], type: 'square' },
  { id: 6, area: 'Terrace Bar', capacity: 2, available: true, position: [0.2, 0, 1.2], type: 'square' },
  { id: 7, area: 'Terrace Bar', capacity: 4, available: true, position: [-0.9, 0, 0.15], type: 'round' },
  { id: 8, area: 'Main Hall', capacity: 4, available: false, position: [-3.2, 0, 0.0], type: 'square' }
];

// Hotspot coordinates matching dish images
const DISH_HOTSPOTS: Record<string, { position: [number, number, number] }[]> = {
  wagyu: [
    { position: [-0.4, 0.22, 0.06] },
    { position: [0.35, 0.2, 0.06] },
    { position: [-0.5, -0.05, 0.06] },
    { position: [0.42, -0.15, 0.06] }
  ],
  salmon: [
    { position: [-0.35, 0.15, 0.06] },
    { position: [0.4, -0.1, 0.06] }
  ],
  caviar: [
    { position: [-0.2, 0.1, 0.06] },
    { position: [0.35, -0.05, 0.06] }
  ],
  cocktail: [
    { position: [-0.15, 0.15, 0.06] },
    { position: [0.2, -0.1, 0.06] }
  ],
  dessert: [
    { position: [-0.3, 0.2, 0.06] },
    { position: [0.35, -0.15, 0.06] }
  ]
};

// -------------------------------------------------------------
// 3D CORRIDOR MESHES
// -------------------------------------------------------------
function ArchColumn({ position }: { position: [number, number, number] }) {
  const { size } = useThree();
  const isMobile = size.width < 768;
  return (
    <group position={position}>
      {/* Base Column */}
      <mesh castShadow={!isMobile}>
        <cylinderGeometry args={[0.08, 0.08, 2.8, isMobile ? 8 : 16]} />
        <meshStandardMaterial color="#1f140e" roughness={0.65} />
      </mesh>
      {/* Decorative Gold Rings */}
      <mesh position={[0, 1.1, 0]}>
        <cylinderGeometry args={[0.09, 0.09, 0.04, isMobile ? 8 : 16]} />
        <meshStandardMaterial color="#C8A97E" metalness={0.9} roughness={0.15} />
      </mesh>
      <mesh position={[0, -1.1, 0]}>
        <cylinderGeometry args={[0.09, 0.09, 0.04, isMobile ? 8 : 16]} />
        <meshStandardMaterial color="#C8A97E" metalness={0.9} roughness={0.15} />
      </mesh>
    </group>
  );
}

function ArchCeiling({ position }: { position: [number, number, number] }) {
  const { size } = useThree();
  const isMobile = size.width < 768;
  return (
    <mesh position={position} rotation={[0, 0, Math.PI / 2]}>
      <torusGeometry args={[1.5, 0.04, isMobile ? 4 : 8, isMobile ? 12 : 24, Math.PI]} />
      <meshStandardMaterial color="#C8A97E" metalness={0.8} roughness={0.2} />
    </mesh>
  );
}

function CorridorGroup({ opacity }: { opacity: number }) {
  if (opacity <= 0.01) return null;

  return (
    <group>
      {/* Floor & Ceiling Plates */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.4, 0]}>
        <planeGeometry args={[10, 20]} />
        <meshStandardMaterial color="#0A0604" roughness={0.85} transparent opacity={opacity} />
      </mesh>
      
      {/* Side arch pillars */}
      {[-4, -2, 0, 2, 4].map((z) => (
        <group key={z}>
          <ArchColumn position={[-1.5, 0, z]} />
          <ArchColumn position={[1.5, 0, z]} />
          <ArchCeiling position={[0, 1.4, z]} />
        </group>
      ))}
    </group>
  );
}

// -------------------------------------------------------------
// FLOOR PLAN ENVIRONMENT COMPONENTS
// -------------------------------------------------------------

function TableCandle({ position }: { position: [number, number, number] }) {
  const { size } = useThree();
  const isMobile = size.width < 768;
  const lightRef = useRef<THREE.PointLight>(null);
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (lightRef.current) {
      lightRef.current.intensity = (isMobile ? 0.7 : 1.2) + Math.sin(time * 9) * 0.18 + Math.sin(time * 22) * 0.08;
    }
  });

  return (
    <group position={position}>
      <mesh position={[0, 0.28, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 0.08, isMobile ? 4 : 8]} />
        <meshStandardMaterial color="#FAF6EF" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.33, 0]}>
        <sphereGeometry args={[0.012, isMobile ? 4 : 8, isMobile ? 4 : 8]} />
        <meshBasicMaterial color="#E67E22" />
      </mesh>
      <pointLight ref={lightRef} position={[0, 0.35, 0]} intensity={isMobile ? 0.8 : 1.5} color="#E67E22" distance={isMobile ? 0.8 : 1.2} decay={1.8} />
    </group>
  );
}

function Chandelier({ position }: { position: [number, number, number] }) {
  const { size } = useThree();
  const isMobile = size.width < 768;
  return (
    <group position={position}>
      <mesh position={[0, 1.3, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 1.0, isMobile ? 4 : 8]} />
        <meshStandardMaterial color="#C8A97E" metalness={0.9} roughness={0.15} />
      </mesh>
      <mesh position={[0, 0.8, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.55, 0.016, isMobile ? 4 : 8, isMobile ? 12 : 24]} />
        <meshStandardMaterial color="#C8A97E" metalness={0.9} roughness={0.15} />
      </mesh>
      {Array.from({ length: 5 }).map((_, i) => {
        const angle = (i * Math.PI * 2) / 5;
        const x = Math.cos(angle) * 0.55;
        const z = Math.sin(angle) * 0.55;
        return (
          <group key={i} position={[x, 0.8, z]}>
            <mesh>
              <sphereGeometry args={[0.04, isMobile ? 4 : 8, isMobile ? 4 : 8]} />
              <meshBasicMaterial color="#FFF2CD" />
            </mesh>
            <pointLight intensity={isMobile ? 1.8 : 3.5} color="#F5CFAB" distance={isMobile ? 2.0 : 3.2} decay={1.8} />
          </group>
        );
      })}
    </group>
  );
}

function DecorativePlant({ position }: { position: [number, number, number] }) {
  const { size } = useThree();
  const isMobile = size.width < 768;
  return (
    <group position={position}>
      <mesh position={[0, -0.15, 0]} castShadow={!isMobile}>
        <cylinderGeometry args={[0.18, 0.12, 0.3, isMobile ? 6 : 12]} />
        <meshStandardMaterial color="#191919" roughness={0.3} metalness={0.7} />
      </mesh>
      <mesh position={[0, 0.18, 0]} castShadow={!isMobile}>
        <sphereGeometry args={[0.26, isMobile ? 6 : 12, isMobile ? 6 : 12]} />
        <meshStandardMaterial color="#1B3819" roughness={0.9} />
      </mesh>
    </group>
  );
}

// Round Table with chairs
function RoundTableMesh({ hovered, selected, available }: { hovered: boolean; selected: boolean; available: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (groupRef.current) {
      const targetY = hovered ? 0.08 : 0;
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.1);
      
      if (hovered || selected) {
        const pulse = 1.0 + Math.sin(time * 8) * 0.02;
        groupRef.current.scale.set(pulse, pulse, pulse);
      } else {
        groupRef.current.scale.set(1, 1, 1);
      }
    }
  });

  const color = selected
    ? '#C8A97E'
    : !available
    ? '#3F1814'
    : hovered
    ? '#D8B88A'
    : '#1F1F1F';

  const { size } = useThree();
  const isMobile = size.width < 768;

  return (
    <group ref={groupRef}>
      <mesh position={[0, 0.22, 0]} castShadow={!isMobile} receiveShadow={!isMobile}>
        <cylinderGeometry args={[0.35, 0.35, 0.05, isMobile ? 12 : 24]} />
        <meshStandardMaterial color={color} roughness={0.35} metalness={selected ? 0.65 : 0.25} />
      </mesh>
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.5, isMobile ? 6 : 12]} />
        <meshStandardMaterial color="#1E1E1E" roughness={0.7} />
      </mesh>
      <TableCandle position={[0, 0, 0]} />
      {Array.from({ length: 4 }).map((_, idx) => {
        const angle = (idx * Math.PI) / 2;
        const x = Math.cos(angle) * 0.56;
        const z = Math.sin(angle) * 0.56;
        return (
          <mesh key={idx} position={[x, 0.05, z]} rotation={[0, -angle, 0]} castShadow={!isMobile}>
            <boxGeometry args={[0.18, 0.26, 0.18]} />
            <meshStandardMaterial color="#2E2E2E" roughness={0.8} />
          </mesh>
        );
      })}
    </group>
  );
}

// Square Table
function SquareTableMesh({ hovered, selected, available }: { hovered: boolean; selected: boolean; available: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (groupRef.current) {
      const targetY = hovered ? 0.08 : 0;
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.1);
      
      if (hovered || selected) {
        const pulse = 1.0 + Math.sin(time * 8) * 0.02;
        groupRef.current.scale.set(pulse, pulse, pulse);
      } else {
        groupRef.current.scale.set(1, 1, 1);
      }
    }
  });

  const color = selected
    ? '#C8A97E'
    : !available
    ? '#3F1814'
    : hovered
    ? '#D8B88A'
    : '#1F1F1F';

  const { size } = useThree();
  const isMobile = size.width < 768;

  return (
    <group ref={groupRef}>
      <mesh position={[0, 0.22, 0]} castShadow={!isMobile} receiveShadow={!isMobile}>
        <boxGeometry args={[0.6, 0.05, 0.6]} />
        <meshStandardMaterial color={color} roughness={0.35} metalness={selected ? 0.65 : 0.25} />
      </mesh>
      {[-0.22, 0.22].map((x) =>
        [-0.22, 0.22].map((z) => (
          <mesh key={`${x}-${z}`} position={[x, -0.05, z]}>
            <cylinderGeometry args={[0.015, 0.015, 0.5, isMobile ? 4 : 8]} />
            <meshStandardMaterial color="#222" roughness={0.7} />
          </mesh>
        ))
      )}
      <TableCandle position={[0, 0, 0]} />
      {[-0.54, 0.54].map((z, idx) => (
        <mesh key={idx} position={[0, 0.05, z]} castShadow={!isMobile}>
          <boxGeometry args={[0.22, 0.26, 0.22]} />
          <meshStandardMaterial color="#2E2E2E" roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

// Rectangular Table
function RectTableMesh({ hovered, selected, available }: { hovered: boolean; selected: boolean; available: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (groupRef.current) {
      const targetY = hovered ? 0.08 : 0;
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.1);
      
      if (hovered || selected) {
        const pulse = 1.0 + Math.sin(time * 8) * 0.02;
        groupRef.current.scale.set(pulse, pulse, pulse);
      } else {
        groupRef.current.scale.set(1, 1, 1);
      }
    }
  });

  const color = selected
    ? '#C8A97E'
    : !available
    ? '#3F1814'
    : hovered
    ? '#D8B88A'
    : '#1F1F1F';

  const { size } = useThree();
  const isMobile = size.width < 768;

  return (
    <group ref={groupRef}>
      <mesh position={[0, 0.22, 0]} castShadow={!isMobile} receiveShadow={!isMobile}>
        <boxGeometry args={[1.2, 0.05, 0.6]} />
        <meshStandardMaterial color={color} roughness={0.35} metalness={selected ? 0.65 : 0.25} />
      </mesh>
      {[-0.5, 0.5].map((x) =>
        [-0.22, 0.22].map((z) => (
          <mesh key={`${x}-${z}`} position={[x, -0.05, z]}>
            <cylinderGeometry args={[0.015, 0.015, 0.5, isMobile ? 4 : 8]} />
            <meshStandardMaterial color="#222" roughness={0.7} />
          </mesh>
        ))
      )}
      <TableCandle position={[0, 0, 0]} />
      {[-0.4, 0, 0.4].map((x, idx) => (
        <mesh key={`top-${idx}`} position={[x, 0.05, -0.52]} castShadow={!isMobile}>
          <boxGeometry args={[0.2, 0.26, 0.2]} />
          <meshStandardMaterial color="#2E2E2E" roughness={0.8} />
        </mesh>
      ))}
      {[-0.4, 0, 0.4].map((x, idx) => (
        <mesh key={`bot-${idx}`} position={[x, 0.05, 0.52]} castShadow={!isMobile}>
          <boxGeometry args={[0.2, 0.26, 0.2]} />
          <meshStandardMaterial color="#2E2E2E" roughness={0.8} />
        </mesh>
      ))}
      {[-0.72, 0.72].map((x, idx) => (
        <mesh key={`end-${idx}`} position={[x, 0.05, 0]} castShadow={!isMobile}>
          <boxGeometry args={[0.2, 0.26, 0.2]} />
          <meshStandardMaterial color="#2E2E2E" roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

// -------------------------------------------------------------
// CENTRAL LIGHT & EMBERS
// -------------------------------------------------------------

function FloatingEmbers() {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 100;
  
  const [positions] = useState(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 6;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 6;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    return pos;
  });

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (pointsRef.current) {
      pointsRef.current.rotation.y = time * 0.02;
      pointsRef.current.rotation.x = time * 0.012;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        transparent
        color="#F8723C"
        size={0.035}
        opacity={0.65}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function VolumetricLightRays() {
  const { size } = useThree();
  const isMobile = size.width < 768;
  const groupRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh position={[-1.8, 1.2, -2.5]} rotation={[0.4, 0, 0.22]}>
        <cylinderGeometry args={[0.01, 0.45, 6.5, isMobile ? 8 : 16]} />
        <meshBasicMaterial color="#C8A97E" transparent opacity={0.035} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[1.8, 1.2, -2.5]} rotation={[0.4, 0, -0.22]}>
        <cylinderGeometry args={[0.01, 0.45, 6.5, isMobile ? 8 : 16]} />
        <meshBasicMaterial color="#C8A97E" transparent opacity={0.035} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function CircularHUD({ opacity }: { opacity: number }) {
  const { size } = useThree();
  const isMobile = size.width < 768;
  const hudRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (hudRef.current) {
      hudRef.current.rotation.z = time * 0.04;
    }
  });

  if (opacity <= 0.01) return null;

  return (
    <group ref={hudRef} rotation={[Math.PI / 2, 0, 0]}>
      <mesh>
        <ringGeometry args={[2.0, 2.015, isMobile ? 24 : 64]} />
        <meshBasicMaterial color="#C8A97E" transparent opacity={0.25 * opacity} side={THREE.DoubleSide} />
      </mesh>
      <mesh>
        <ringGeometry args={[1.7, 1.708, isMobile ? 24 : 64]} />
        <meshBasicMaterial color="#C8A97E" transparent opacity={0.12 * opacity} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function HotspotMarker({
  position,
  active,
  onClick
}: {
  position: [number, number, number];
  active: boolean;
  onClick: () => void;
}) {
  const { size } = useThree();
  const isMobile = size.width < 768;
  const [hovered, setHovered] = useState(false);

  return (
    <group position={position}>
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
      >
        <sphereGeometry args={[0.024, isMobile ? 8 : 16, isMobile ? 8 : 16]} />
        <meshBasicMaterial color={active || hovered ? '#F5F1EA' : '#C8A97E'} />
      </mesh>
      <mesh>
        <ringGeometry args={[0.055, 0.065, isMobile ? 16 : 32]} />
        <meshBasicMaterial
          color="#C8A97E"
          transparent
          opacity={hovered || active ? 0.95 : 0.4}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

// -------------------------------------------------------------
// CAM ACTION CONTROLLER FOR SCROLL AND SELECTIONS
// -------------------------------------------------------------
function CameraScrollController({
  activeSection,
  scrollProgress,
  selectedTablePosition
}: {
  activeSection: number;
  scrollProgress: number;
  selectedTablePosition: [number, number, number] | null;
}) {
  const { camera, controls } = useThree();

  useFrame(() => {
    const ctrl = controls as any;

    if (activeSection <= 1) {
      // Step 1: Hero & Food Card zoom-in
      const startPos = new THREE.Vector3(0, 0.1, 1.6);
      const endPos = new THREE.Vector3(0, 0.25, 2.45 - scrollProgress * 0.55);
      
      const targetPos = new THREE.Vector3().lerpVectors(startPos, endPos, scrollProgress);
      camera.position.lerp(targetPos, 0.08);
      
      if (ctrl) {
        ctrl.target.lerp(new THREE.Vector3(0, 0.15, 0), 0.08);
      }
    } else if (activeSection === 2) {
      // Step 2: Menu section (Card shifted to overlay text)
      const desiredPos = new THREE.Vector3(0.55, 0.35, 2.6);
      camera.position.lerp(desiredPos, 0.08);
      if (ctrl) {
        ctrl.target.lerp(new THREE.Vector3(0, 0.15, 0), 0.08);
      }
    } else if (activeSection >= 3) {
      // Step 3 & 4: Seating Plan overview & Reservation details zoom
      if (selectedTablePosition) {
        if (ctrl) {
          ctrl.target.lerp(new THREE.Vector3(selectedTablePosition[0], selectedTablePosition[1] + 0.18, selectedTablePosition[2]), 0.08);
        }
        const desiredPos = new THREE.Vector3(selectedTablePosition[0], selectedTablePosition[1] + 1.8, selectedTablePosition[2] + 1.45);
        camera.position.lerp(desiredPos, 0.08);
      } else {
        const desiredPos = new THREE.Vector3(0, 4.4, 3.8);
        camera.position.lerp(desiredPos, 0.08);
        if (ctrl) {
          ctrl.target.lerp(new THREE.Vector3(0, 0, 0), 0.08);
        }
      }
    }
  });

  return null;
}

// -------------------------------------------------------------
// GLTF DECORATIVE MODEL WITH SAFE LOADER
// -------------------------------------------------------------
function GLTFDecorModel() {
  return (
    <group position={[0, -0.6, -3.5]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.12, 0.15, 1.4, 16]} />
        <meshStandardMaterial color="#1f140e" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.7, 0]}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial color="#C8A97E" metalness={0.9} roughness={0.15} />
      </mesh>
    </group>
  );
}

// -------------------------------------------------------------
// UNIFIED SCENE ENGINE ORCHESTRATOR
// -------------------------------------------------------------
function SceneEngine() {
  const { size } = useThree();
  const isMobile = size.width < 768;

  const { scrollProgress } = useScroll();
  const {
    activeSection,
    activeIdx,
    activeHotspot,
    setActiveHotspot,
    selectedTableId,
    setSelectedTableId,
    hoveredTableId,
    setHoveredTableId,
    reservedTableIds,
  } = useShowcase();

  const textures = useTexture({
    wagyu: '/images/wagyu.png',
    salmon: '/images/salmon_hq.png',
    caviar: '/images/caviar_hq.png',
    cocktail: '/images/cocktail_hq.png',
    dessert: '/images/dessert_hq.png'
  }) as Record<string, THREE.Texture>;

  const [woodFloorTex, setWoodFloorTex] = useState<THREE.CanvasTexture | null>(null);

  // Compress textures on load
  useEffect(() => {
    Object.values(textures).forEach((tex) => {
      if (tex) {
        tex.generateMipmaps = false;
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
      }
    });
  }, [textures]);

  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#3E2516';
      ctx.fillRect(0, 0, 512, 512);
      ctx.strokeStyle = '#22130A';
      ctx.lineWidth = 4;
      for (let i = 0; i < 8; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * 64);
        ctx.lineTo(512, i * 64);
        ctx.stroke();
      }
      for (let i = 0; i < 1200; i++) {
        ctx.fillStyle = Math.random() > 0.5 ? '#4E311F' : '#2A180E';
        ctx.fillRect(Math.random() * 512, Math.random() * 512, Math.random() * 60 + 10, 1.5);
      }
    }
    const tex = new THREE.CanvasTexture(canvas);
    setWoodFloorTex(tex);
  }, []);

  const DISH_IDS = ['wagyu', 'salmon', 'caviar', 'cocktail', 'dessert'];
  const activeDishId = DISH_IDS[activeIdx];
  const activeTexture = textures[activeDishId] || null;

  // Render variables opacity fade triggers
  const corridorOpacity = activeSection === 0 ? 1.0 - scrollProgress * 5.0 : 0.0;
  const foodCardOpacity = activeSection === 1 || activeSection === 2 ? 1.0 : 0.0;
  const floorPlanOpacity = activeSection >= 4 ? 1.0 : 0.0;

  const selectedTable = TABLES.find((t) => t.id === selectedTableId);
  const selectedTablePosition = selectedTable ? selectedTable.position : null;

  const currentHotspots = DISH_HOTSPOTS[activeDishId] || [];

  const cardRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (cardRef.current && foodCardOpacity > 0.01) {
      cardRef.current.rotation.y = time * 0.14 + scrollProgress * Math.PI * 0.45;
      cardRef.current.rotation.x = 0.32 + Math.sin(time * 0.5) * 0.035;
    }
  });

  return (
    <group>
      {/* 1. Wood Corridor pillars */}
      {corridorOpacity > 0.01 && <CorridorGroup opacity={corridorOpacity} />}

      {/* 2. Floating Food Showcase Platter (Only visible section 1 & 2) */}
      {foodCardOpacity > 0.01 && (
        <group ref={cardRef} position={[0, 0.1, 0]}>
          {/* Main Stone Pedestal */}
          <mesh position={[0, -0.72, 0]} receiveShadow={!isMobile}>
            <cylinderGeometry args={[1.5, 1.58, 0.25, isMobile ? 16 : 32]} />
            <meshStandardMaterial color="#151515" roughness={0.8} metalness={0.2} />
          </mesh>

          {/* Detailed Michelin-Star Platter */}
          <group rotation={[0.3, 0, 0]}>
            {/* 1. Main Slate Plate Base */}
            <mesh castShadow={!isMobile} receiveShadow={!isMobile}>
              <cylinderGeometry args={[1.15, 1.18, 0.08, isMobile ? 24 : 64]} />
              <meshPhysicalMaterial
                color="#141414"
                roughness={0.45}
                metalness={0.3}
                clearcoat={isMobile ? 0 : 0.7}
                clearcoatRoughness={0.1}
              />
            </mesh>

            {/* 2. Inner Photo Reservoir Inlay (Centered Food) */}
            <mesh position={[0, 0.042, 0]} castShadow={!isMobile} receiveShadow={!isMobile}>
              <cylinderGeometry args={[0.9, 0.9, 0.01, isMobile ? 24 : 64]} />
              <meshPhysicalMaterial
                map={activeTexture || undefined}
                roughness={0.15}
                clearcoat={isMobile ? 0 : 1.0}
                clearcoatRoughness={0.05}
              />
            </mesh>

            {/* 3. Gold Outer Accent Ring */}
            <mesh position={[0, 0.043, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.9, 0.93, isMobile ? 24 : 64]} />
              <meshStandardMaterial
                color="#C8A97E"
                metalness={0.9}
                roughness={0.1}
                side={THREE.DoubleSide}
              />
            </mesh>
          </group>

          {/* Floating Hotspots on Card */}
          {currentHotspots.map((spot, idx) => (
            <HotspotMarker
              key={idx}
              position={spot.position}
              active={activeHotspot === idx}
              onClick={() => setActiveHotspot(activeHotspot === idx ? null : idx)}
            />
          ))}
        </group>
      )}

      {/* 3. Seating Floor plan map (Only visible section 3 & 4) */}
      {floorPlanOpacity > 0.01 && (
        <group>
          {/* Hardwood flooring */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.3, 0]} receiveShadow>
            <planeGeometry args={[10, 10]} />
            <meshStandardMaterial map={woodFloorTex || undefined} roughness={0.65} />
          </mesh>

          {/* Golden floor grid */}
          <gridHelper args={[10, 20, '#C8A97E', '#222222']} position={[0, -0.28, 0]} material-opacity={0.12} material-transparent />

          {/* Glass dividers */}
          <mesh position={[1.2, 0.05, -0.8]}>
            <boxGeometry args={[0.03, 0.6, 1.5]} />
            <meshStandardMaterial color="#C8A97E" transparent opacity={0.15} roughness={0.1} />
          </mesh>

          {/* Corner plants */}
          <DecorativePlant position={[-3.8, -0.15, -3.8]} />
          <DecorativePlant position={[3.8, -0.15, -3.8]} />
          <DecorativePlant position={[-3.8, -0.15, 3.8]} />

          {/* Tables layout */}
          {TABLES.map((table) => {
            const isHovered = hoveredTableId === table.id;
            const isSelected = selectedTableId === table.id;
            const isReserved = reservedTableIds.includes(table.id);
            const isClickable = table.available && !isReserved;
            return (
              <group
                key={table.id}
                position={table.position}
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("Table clicked", table.id);
                  if (isClickable) setSelectedTableId(table.id);
                }}
                onPointerOver={(e) => {
                  e.stopPropagation();
                  if (isClickable) {
                    setHoveredTableId(table.id);
                    document.body.style.cursor = 'pointer';
                  } else {
                    document.body.style.cursor = 'not-allowed';
                  }
                }}
                onPointerOut={(e) => {
                  e.stopPropagation();
                  setHoveredTableId(null);
                  document.body.style.cursor = 'auto';
                }}
              >
                {/* State rings */}
                {isReserved && (
                  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.25, 0]}>
                    <ringGeometry args={[0.62, 0.65, 32]} />
                    <meshBasicMaterial color="#D97706" transparent opacity={0.85} />
                  </mesh>
                )}
                {isClickable && !isSelected && (
                  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.25, 0]}>
                    <ringGeometry args={[0.62, 0.65, 32]} />
                    <meshBasicMaterial color="#C8A97E" transparent opacity={isHovered ? 0.9 : 0.3} />
                  </mesh>
                )}
                {isSelected && (
                  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.25, 0]}>
                    <ringGeometry args={[0.58, 0.67, 32]} />
                    <meshBasicMaterial color="#F5E6C8" transparent opacity={0.95} />
                  </mesh>
                )}

                {table.type === 'round' && (
                  <RoundTableMesh hovered={isHovered} selected={isSelected} available={table.available} />
                )}
                {table.type === 'square' && (
                  <SquareTableMesh hovered={isHovered} selected={isSelected} available={table.available} />
                )}
                {table.type === 'rect' && (
                  <RectTableMesh hovered={isHovered} selected={isSelected} available={table.available} />
                )}
              </group>
            );
          })}
        </group>
      )}

      {/* Global items */}
      <FloatingEmbers />
      <VolumetricLightRays />
      <CircularHUD opacity={foodCardOpacity} />

      {/* GLTF Model wrapper with safe async loaders */}
      <Suspense fallback={null}>
        <GLTFDecorModel />
      </Suspense>

      {/* Camera coordinates mapper */}
      <CameraScrollController
        activeSection={activeSection}
        scrollProgress={scrollProgress}
        selectedTablePosition={selectedTablePosition}
      />
    </group>
  );
}

export default function UnifiedCanvas() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 0.1, 1.5], fov: 42 }}
      gl={{ antialias: !isMobile, alpha: false, powerPreference: "high-performance" }}
      className="w-full h-full"
    >
      <color attach="background" args={['#0b0b0b']} />
      <fog attach="fog" args={['#0b0b0b', 1.8, 8.5]} />
      <ambientLight intensity={0.12} />

      {/* Direction & spots */}
      <directionalLight position={[0, 1.5, 4]} intensity={2.0} color="#F5F1EA" />
      <spotLight
        position={[0, 4.5, 0]}
        intensity={isMobile ? 35.0 : 70.0}
        angle={Math.PI / 6}
        penumbra={0.7}
        color="#F5F1EA"
        castShadow={!isMobile}
      />
      <pointLight position={[0, 0.5, -2.5]} intensity={isMobile ? 22.0 : 45.0} color="#C8A97E" />

      {/* Custom Unified Scene components wrapped in Suspense */}
      <Suspense fallback={null}>
        <SceneEngine />
      </Suspense>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate={!isMobile}
        maxPolarAngle={Math.PI / 2.2}
      />
    </Canvas>
  );
}
