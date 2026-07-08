'use client';

import React, { createContext, useContext, useState } from 'react';

interface ShowcaseContextType {
  activeSection: number;
  setActiveSection: (val: number) => void;

  // Showcase item index
  activeIdx: number;
  setActiveIdx: (val: number) => void;

  // Active Hotspot
  activeHotspot: number | null;
  setActiveHotspot: (val: number | null) => void;

  // Seating plan states
  selectedTableId: number | null;
  setSelectedTableId: (val: number | null) => void;
  hoveredTableId: number | null;
  setHoveredTableId: (val: number | null) => void;
  showFormPanel: boolean;
  setShowFormPanel: (val: boolean) => void;
  isSuccess: boolean;
  setIsSuccess: (val: boolean) => void;

  // Reserved tables (persists after booking)
  reservedTableIds: number[];
  addReservedTableId: (id: number) => void;
}

interface ScrollContextType {
  scrollProgress: number;
  setScrollProgress: (val: number) => void;
}

const ShowcaseContext = createContext<ShowcaseContextType | undefined>(undefined);
const ScrollContext = createContext<ScrollContextType | undefined>(undefined);

export function ShowcaseProvider({ children }: { children: React.ReactNode }) {
  const [activeSection, setActiveSection] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeIdx, setActiveIdx] = useState(0);
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);

  const [selectedTableId, setSelectedTableId] = useState<number | null>(null);
  const [hoveredTableId, setHoveredTableId] = useState<number | null>(null);
  const [showFormPanel, setShowFormPanel] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [reservedTableIds, setReservedTableIds] = useState<number[]>([]);

  const addReservedTableId = (id: number) => {
    setReservedTableIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  return (
    <ScrollContext.Provider value={{ scrollProgress, setScrollProgress }}>
      <ShowcaseContext.Provider
        value={{
          activeSection,
          setActiveSection,
          activeIdx,
          setActiveIdx,
          activeHotspot,
          setActiveHotspot,
          selectedTableId,
          setSelectedTableId,
          hoveredTableId,
          setHoveredTableId,
          showFormPanel,
          setShowFormPanel,
          isSuccess,
          setIsSuccess,
          reservedTableIds,
          addReservedTableId,
        }}
      >
        {children}
      </ShowcaseContext.Provider>
    </ScrollContext.Provider>
  );
}

export function useShowcase() {
  const context = useContext(ShowcaseContext);
  if (!context) {
    throw new Error('useShowcase must be used within a ShowcaseProvider');
  }
  return context;
}

export function useScroll() {
  const context = useContext(ScrollContext);
  if (!context) {
    throw new Error('useScroll must be used within a ShowcaseProvider');
  }
  return context;
}
