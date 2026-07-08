'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Users, MapPin, Clock, Calendar, Sparkles, ChevronRight, Plus, Minus } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useShowcase } from '@/context/ShowcaseContext';

// ─────────────────────────────────────────────
// TABLE DATA
// ─────────────────────────────────────────────
interface TableMeta {
  id: number;
  name: string;
  area: string;
  capacity: number;
  available: boolean;
  view: string;
  perks: string;
}

const TABLES: TableMeta[] = [
  { id: 1, name: 'Table 1', area: 'The Grand Salon',    capacity: 4, available: true,  view: 'Grand Chandelier',    perks: 'Near live classical harp' },
  { id: 2, name: 'Table 2', area: 'The Grand Salon',    capacity: 2, available: true,  view: 'Fireplace Hearth',    perks: 'Warm, intimate setting' },
  { id: 3, name: 'Table 3', area: 'The Grand Salon',    capacity: 6, available: true,  view: 'Open Kitchen Grills', perks: 'Full chef action view' },
  { id: 4, name: 'Table 4', area: 'The Obsidian Vault', capacity: 8, available: true,  view: 'Private Chamber',     perks: 'Soundproof · fully private' },
  { id: 5, name: 'Table 5', area: 'The Hearth Counter', capacity: 2, available: true,  view: 'Kitchen Counter',     perks: 'Dedicated sommelier service' },
  { id: 6, name: 'Table 6', area: 'The Solar Terrace',  capacity: 2, available: true,  view: 'Rooftop Skyline',     perks: 'Perfect sunset orientation' },
  { id: 7, name: 'Table 7', area: 'The Solar Terrace',  capacity: 4, available: true,  view: 'City Horizon',        perks: 'Adjacent acoustic violin balcony' },
  { id: 8, name: 'Table 8', area: 'The Grand Salon',    capacity: 4, available: false, view: 'Garden Window',       perks: 'Currently in service' },
];

const TIME_SLOTS = ['17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'];

function fireConfetti() {
  const end = Date.now() + 1800;
  const colors = ['#C8A97E', '#F5F1EA', '#8E754F'];
  const tick = () => {
    confetti({ particleCount: 3, angle: 60,  spread: 50, origin: { x: 0 }, colors });
    confetti({ particleCount: 3, angle: 120, spread: 50, origin: { x: 1 }, colors });
    if (Date.now() < end) requestAnimationFrame(tick);
  };
  tick();
}

// ─────────────────────────────────────────────
// AMBIENT BACKGROUNDS
// ─────────────────────────────────────────────
const CANDLE_COUNT = 4;
const FloatingCandles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <style>{`
        @keyframes flicker {
          0%, 100% { transform: scale(1) translate(-50%, -100%); opacity: 0.95; }
          20% { transform: scale(0.92, 1.08) translate(-51%, -100%); opacity: 0.85; }
          40% { transform: scale(1.08, 0.92) translate(-49%, -100%); opacity: 1; }
          60% { transform: scale(0.96, 1.04) translate(-50%, -100%); opacity: 0.9; }
          80% { transform: scale(1.04, 0.96) translate(-51%, -100%); opacity: 0.95; }
        }
      `}</style>
      {Array.from({ length: CANDLE_COUNT }).map((_, i) => {
        const left = [8, 20, 76, 88, 14, 82, 32, 68][i % 8];
        const top = [25, 60, 20, 75, 45, 38, 80, 15][i % 8];
        const scale = [0.8, 1.0, 0.9, 0.95, 0.7, 1.05, 0.75, 0.9][i % 8];
        const duration = [14, 18, 16, 22, 15, 17, 20, 19][i % 8];
        const delay = i * -1.8;

        return (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0, 0.5, 0.5, 0],
              y: [120, -160],
              x: [0, i % 2 === 0 ? 10 : -10, 0],
            }}
            transition={{
              duration: duration + 10,
              repeat: Infinity,
              ease: "linear",
              delay: delay,
            }}
            className="absolute flex flex-col items-center select-none"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              scale: scale,
            }}
          >
            {/* Flame */}
            <div className="relative w-4 h-6">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-luxury-gold/15 blur-md" />
              <div 
                className="absolute top-0 left-1/2 w-3 h-4 bg-gradient-to-b from-[#FFF2CC] via-[#FFD966] to-[#E69138] rounded-full origin-bottom"
                style={{
                  animation: 'flicker 2s infinite ease-in-out',
                  clipPath: 'polygon(50% 0%, 100% 40%, 85% 100%, 15% 100%, 0% 40%)'
                }}
              />
            </div>
            {/* Wick */}
            <div className="w-[1px] h-2 bg-zinc-800" />
            {/* Candle Body */}
            <div className="w-3.5 h-16 bg-gradient-to-r from-zinc-850 via-zinc-800 to-zinc-900 border border-white/5 shadow-md rounded-sm" />
          </motion.div>
        );
      })}
    </div>
  );
};

const GoldParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {Array.from({ length: 12 }).map((_, i) => {
        const left = [5, 15, 25, 35, 45, 55, 65, 75, 85, 95, 12, 28, 42, 58, 72, 88, 3, 21, 37, 51, 69, 83, 97, 30, 70][i % 25];
        const top = [10, 85, 20, 70, 40, 95, 15, 60, 30, 80, 50, 65, 12, 78, 32, 90, 48, 5, 58, 83, 23, 44, 8, 38, 74][i % 25];
        const scale = 0.4 + (i % 5) * 0.2;
        const duration = 14 + (i % 6) * 2;
        const delay = i * -1.2;

        return (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{
              y: [0, -180],
              x: [0, i % 2 === 0 ? 30 : -30],
              opacity: [0, 0.4, 0.4, 0],
            }}
            transition={{
              duration: duration,
              repeat: Infinity,
              ease: "linear",
              delay: delay,
            }}
            className="absolute w-1 h-1 rounded-full bg-luxury-gold/40 blur-[0.5px]"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              scale: scale,
            }}
          />
        );
      })}
    </div>
  );
};

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────
export default function Reservation() {
  const {
    selectedTableId,
    setSelectedTableId,
    isSuccess,
    setIsSuccess,
    reservedTableIds,
    addReservedTableId,
  } = useShowcase();

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', date: '', time: '19:00', notes: '',
  });
  const [guests, setGuests] = useState(2);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const selectedTable = TABLES.find((t) => t.id === selectedTableId);

  // Sync maximum guest limit when table selection changes
  useEffect(() => {
    if (selectedTable) {
      if (guests > selectedTable.capacity) {
        setGuests(selectedTable.capacity);
      }
    }
  }, [selectedTableId, selectedTable, guests]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => { const n = { ...p }; delete n[name]; return n; });
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.name.trim())  e.name  = 'Required';
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) e.email = 'Valid email required';
    if (!formData.phone.trim()) e.phone = 'Required';
    if (!formData.date)         e.date  = 'Required';
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setIsSuccess(true);
      if (selectedTableId !== null) addReservedTableId(selectedTableId);
      fireConfetti();
    }, 1800);
  };

  const reset = () => {
    setFormData({ name: '', email: '', phone: '', date: '', time: '19:00', notes: '' });
    setGuests(2);
    setErrors({});
    setSelectedTableId(null);
    setIsSuccess(false);
  };

  const maxGuests = selectedTable ? selectedTable.capacity : 8;

  const incrementGuests = () => {
    setGuests((g) => Math.min(g + 1, maxGuests));
  };

  const decrementGuests = () => {
    setGuests((g) => Math.max(g - 1, 1));
  };

  const inp = (field: string) =>
    `w-full bg-transparent border-b py-2 text-sm text-luxury-cream placeholder-luxury-cream/15 tracking-wide focus:outline-none transition-colors duration-300 font-sans font-light ${
      errors[field] ? 'border-red-500/50 focus:border-red-500/80' : 'border-luxury-gold/18 focus:border-luxury-gold/60'
    }`;

  // Show panel modal when table is selected OR user explicitly opened it
  const [isBookingFormOpen, setIsBookingFormOpen] = useState(false);

  useEffect(() => {
    console.log("Selected table", selectedTable);
    console.log("Modal open", isBookingFormOpen);
  }, [selectedTable, isBookingFormOpen]);

  return (
    <div className="relative w-full min-h-screen pointer-events-none overflow-hidden">
      
      {/* Ambient backgrounds */}
      <FloatingCandles />
      <GoldParticles />
      <div className="absolute top-[30%] left-[25%] w-96 h-96 bg-luxury-gold/3 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-[20%] right-[25%] w-[400px] h-[400px] bg-luxury-gold/2 rounded-full blur-[160px] pointer-events-none z-0" />

      {/* LEFT: Legend / instruction overlay — pointer-events-none so canvas gets clicks */}
      <div className="absolute top-0 left-0 h-full flex flex-col justify-center px-8 md:px-14 pointer-events-none" style={{ maxWidth: '42%' }}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="space-y-6 relative z-20 pointer-events-auto"
        >
          <span className="text-[9px] tracking-[0.4em] uppercase text-luxury-gold/70 font-sans block">ATIKUA · INTERACTIVE</span>
          <h2 className="text-4xl md:text-5xl font-serif tracking-widest text-luxury-cream leading-snug">
            The<br />Alchemy<br />Floor Plan
          </h2>
          <p className="text-[10px] text-luxury-cream/40 font-sans leading-relaxed max-w-[260px]">
            Click on a glowing table in the 3D floor plan to select your preferred vantage point. Your seat will be held for 10 minutes.
          </p>
          <div className="space-y-2.5 text-[8px] tracking-[0.25em] uppercase text-luxury-cream/35 font-sans">
            <div className="flex items-center gap-2.5"><span className="w-2 h-2 rounded-full bg-luxury-gold shadow-[0_0_8px_rgba(200,169,126,0.8)]" /> Available</div>
            <div className="flex items-center gap-2.5"><span className="w-2 h-2 rounded-full bg-white/80 shadow-[0_0_6px_rgba(255,255,255,0.5)]" /> Selected</div>
            <div className="flex items-center gap-2.5"><span className="w-2 h-2 rounded-full bg-amber-500/60" /> Reserved / Occupied</div>
          </div>
          {/* Manual open button — pointer-events-auto only here */}
          {!isBookingFormOpen && !selectedTableId && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              onClick={() => setIsBookingFormOpen(true)}
              className="pointer-events-auto mt-2 px-6 py-3 bg-luxury-gold/10 hover:bg-luxury-gold/20 border border-luxury-gold/25 hover:border-luxury-gold/50 text-luxury-gold text-[9px] tracking-[0.25em] uppercase font-sans transition-all duration-300 cursor-pointer rounded-none"
            >
              Make a Reservation →
            </motion.button>
          )}
        </motion.div>
      </div>

      {/* FLOATING CARD: Selected table details */}
      <AnimatePresence>
        {selectedTable && !isBookingFormOpen && !isSuccess && (
          <motion.div
            key="table-floating-card"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-10 right-10 z-[90] w-80 bg-luxury-bg/90 backdrop-blur-md border border-luxury-gold/20 p-5 rounded-2xl shadow-[0_16px_40px_rgba(0,0,0,0.6)] pointer-events-auto flex flex-col space-y-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[8px] tracking-[0.25em] uppercase text-luxury-gold font-sans font-bold block mb-1">
                  {selectedTable.area}
                </span>
                <h4 className="text-base font-serif text-luxury-cream">{selectedTable.name}</h4>
              </div>
              <button
                onClick={() => setSelectedTableId(null)}
                className="text-luxury-cream/40 hover:text-luxury-cream text-xs leading-none cursor-pointer p-1"
                aria-label="Deselect Table"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-[10px] text-luxury-cream/70 font-sans">
              <div className="flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-luxury-gold/70" />
                <span>Up to {selectedTable.capacity} Guests</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-luxury-gold/70" />
                <span>Vantage: {selectedTable.view}</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-luxury-gold/70" />
                <span>Perk: {selectedTable.perks}</span>
              </div>
            </div>

            <button
              onClick={() => setIsBookingFormOpen(true)}
              className="w-full py-3 bg-luxury-gold hover:bg-luxury-cream text-luxury-bg text-[10px] tracking-[0.2em] uppercase font-sans font-bold transition-all duration-300 rounded-none shadow-md cursor-pointer"
            >
              Reserve Seat
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL: Complete Booking Form / Success Confirmation */}
      <AnimatePresence>
        {(isBookingFormOpen || isSuccess) && (
          <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4 pointer-events-auto">
            {/* Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (!isSuccess) setIsBookingFormOpen(false);
              }}
              className="absolute inset-0 bg-[#0B0B0B]/80 backdrop-blur-md"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-lg bg-luxury-bg/95 border border-luxury-gold/25 p-8 rounded-3xl shadow-[0_24px_80px_rgba(0,0,0,0.85)] max-h-[90vh] overflow-y-auto z-10"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-[8px] tracking-[0.3em] uppercase text-luxury-gold font-sans font-bold block mb-1">
                    {isSuccess ? 'Reservation Secured' : (selectedTable ? selectedTable.area : 'Bespoke Experience')}
                  </span>
                  <h3 className="text-2xl font-serif text-luxury-cream tracking-wider">
                    {isSuccess ? 'Your Sanctuary is Secured' : (selectedTable ? `Reserve ${selectedTable.name}` : 'Reserve A Sanctuary')}
                  </h3>
                  <div className="w-12 h-[1px] bg-luxury-gold/40 mt-2" />
                </div>
                <button
                  onClick={() => {
                    setIsBookingFormOpen(false);
                    if (isSuccess) reset();
                  }}
                  className="text-luxury-cream/40 hover:text-luxury-cream text-sm cursor-pointer p-1"
                  aria-label="Close Modal"
                >
                  ✕
                </button>
              </div>

              {/* Dynamic Form / Success Content */}
              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center text-center py-4 space-y-5"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 280, damping: 20 }}
                      className="w-14 h-14 rounded-full border border-luxury-gold/50 flex items-center justify-center relative"
                      style={{ background: 'rgba(200,169,126,0.06)', boxShadow: '0 0 25px rgba(200,169,126,0.2)' }}
                    >
                      <div className="absolute inset-0 rounded-full border border-luxury-gold/10 animate-ping opacity-30" />
                      <ShieldCheck className="w-7 h-7 text-luxury-gold" />
                    </motion.div>

                    <div className="space-y-1">
                      <h4 className="text-base font-serif tracking-widest text-luxury-cream">SEAT SECURED</h4>
                      <p className="text-[9px] text-luxury-gold tracking-[0.35em] uppercase font-sans">
                        Booking ID #{String(Math.floor(Math.random() * 90000 + 10000))}
                      </p>
                    </div>

                    <div className="p-3.5 bg-black/30 border border-luxury-gold/8 rounded-xl w-full text-left space-y-2 font-sans text-xs">
                      <div className="flex justify-between border-b border-luxury-gold/5 pb-1.5">
                        <span className="text-luxury-cream/30">Table</span>
                        <span className="text-luxury-gold font-serif">{selectedTable ? `${selectedTable.name} (${selectedTable.area})` : 'Auto-Assigned'}</span>
                      </div>
                      <div className="flex justify-between border-b border-luxury-gold/5 pb-1.5">
                        <span className="text-luxury-cream/30">Date & Time</span>
                        <span className="text-luxury-cream">{formData.date} at {formData.time}</span>
                      </div>
                      <div className="flex justify-between border-b border-luxury-gold/5 pb-1.5">
                        <span className="text-luxury-cream/30">Party Size</span>
                        <span className="text-luxury-cream">{guests} Guest{guests > 1 ? 's' : ''}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-luxury-cream/30">Guest Name</span>
                        <span className="text-luxury-cream font-medium">{formData.name}</span>
                      </div>
                    </div>

                    <p className="text-[9px] text-luxury-cream/40 leading-relaxed font-sans">
                      Confirmation sent to <span className="text-luxury-cream/70">{formData.email}</span>
                    </p>

                    <button
                      onClick={() => { reset(); setIsBookingFormOpen(false); }}
                      className="w-full py-3 border border-luxury-gold/30 hover:border-luxury-gold text-[9px] tracking-[0.25em] uppercase font-sans text-luxury-gold hover:text-luxury-bg hover:bg-luxury-gold transition-all duration-300 rounded-full cursor-pointer"
                    >
                      Book Another Table
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    noValidate
                    className="space-y-4"
                  >
                    {/* Party Size & Table */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-black/20 border border-luxury-gold/10 p-3 rounded-2xl flex flex-col justify-between h-[72px]">
                        <span className="text-[8px] tracking-[0.25em] uppercase text-luxury-cream/40 font-sans font-semibold flex items-center gap-1">
                          <Users className="w-2.5 h-2.5 text-luxury-gold/60" /> Party
                        </span>
                        <div className="flex items-center justify-between">
                          <button type="button" onClick={decrementGuests} disabled={guests <= 1}
                            className="w-6 h-6 rounded-full border border-luxury-gold/20 hover:border-luxury-gold/50 flex items-center justify-center text-luxury-cream/50 hover:text-luxury-cream disabled:opacity-30 transition-all duration-200 cursor-pointer">
                            <Minus className="w-2.5 h-2.5" />
                          </button>
                          <span className="text-xl font-serif text-luxury-gold leading-none font-bold min-w-6 text-center select-none">{guests}</span>
                          <button type="button" onClick={incrementGuests} disabled={guests >= maxGuests}
                            className="w-6 h-6 rounded-full border border-luxury-gold/20 hover:border-luxury-gold/50 flex items-center justify-center text-luxury-cream/50 hover:text-luxury-cream disabled:opacity-30 transition-all duration-200 cursor-pointer">
                            <Plus className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      </div>

                      <div className="bg-black/20 border border-luxury-gold/10 p-3 rounded-2xl flex flex-col justify-between h-[72px]">
                        <span className="text-[8px] tracking-[0.25em] uppercase text-luxury-cream/40 font-sans font-semibold flex items-center gap-1">
                          <MapPin className="w-2.5 h-2.5 text-luxury-gold/60" /> Table
                        </span>
                        <select
                          name="tableId"
                          value={selectedTableId || ''}
                          onChange={(e) => setSelectedTableId(e.target.value ? Number(e.target.value) : null)}
                          className="w-full bg-transparent border-0 py-0.5 text-[11px] text-luxury-cream focus:outline-none font-sans font-light [color-scheme:dark] cursor-pointer"
                        >
                          <option value="" className="bg-zinc-950 text-luxury-cream/50">Auto-Assign</option>
                          {TABLES.map((t) => (
                            <option key={t.id} value={t.id} disabled={!t.available || reservedTableIds.includes(t.id)} className="bg-zinc-950 text-luxury-cream">
                              Table {t.id} (Max {t.capacity}){!t.available || reservedTableIds.includes(t.id) ? ' ✗' : ''}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Selected table perks */}
                    {selectedTable && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                        className="bg-luxury-gold/5 border border-luxury-gold/15 p-2.5 rounded-xl space-y-0.5">
                        <div className="flex justify-between items-center text-[9px] tracking-wider uppercase text-luxury-gold font-sans font-semibold">
                          <span>{selectedTable.area}</span>
                          <span className="text-[8px] opacity-75 font-normal">{selectedTable.view}</span>
                        </div>
                        <p className="text-[9px] text-luxury-cream/50 font-sans italic">"{selectedTable.perks}"</p>
                      </motion.div>
                    )}

                    {/* Date */}
                    <div className="bg-black/20 border border-luxury-gold/10 p-3 rounded-2xl">
                      <span className="text-[8px] tracking-[0.25em] uppercase text-luxury-cream/40 font-sans font-semibold flex items-center gap-1 mb-1.5">
                        <Calendar className="w-2.5 h-2.5 text-luxury-gold/60" /> Date *
                      </span>
                      <input type="date" name="date" value={formData.date} onChange={handleChange}
                        className="w-full bg-transparent border-0 border-b border-luxury-gold/10 py-0.5 text-sm text-luxury-cream focus:outline-none font-sans font-light [color-scheme:dark]" />
                      {errors.date && <span className="text-[8px] text-red-400/80 font-sans block mt-0.5">{errors.date}</span>}
                    </div>

                    {/* Time slots */}
                    <div className="bg-black/20 border border-luxury-gold/10 p-3 rounded-2xl">
                      <span className="text-[8px] tracking-[0.25em] uppercase text-luxury-cream/40 font-sans font-semibold flex items-center gap-1 mb-2">
                        <Clock className="w-2.5 h-2.5 text-luxury-gold/60" /> Hour *
                      </span>
                      <div className="grid grid-cols-5 gap-1">
                        {TIME_SLOTS.map((slot) => (
                          <button type="button" key={slot} onClick={() => setFormData((p) => ({ ...p, time: slot }))}
                            className={`py-1.5 rounded-md text-[8px] font-sans transition-all duration-300 cursor-pointer ${
                              formData.time === slot
                                ? 'bg-luxury-gold text-luxury-bg font-semibold scale-105 border border-luxury-gold shadow-[0_0_10px_rgba(200,169,126,0.25)]'
                                : 'bg-black/30 border border-luxury-gold/10 text-luxury-cream/70 hover:border-luxury-gold/30'
                            }`}>
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Contact fields */}
                    <div className="bg-black/20 border border-luxury-gold/10 p-3.5 rounded-2xl space-y-3.5">
                      <div>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name *" className={inp('name')} />
                        {errors.name && <span className="text-[8px] text-red-400/80 font-sans block mt-0.5">{errors.name}</span>}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email *" className={inp('email')} />
                          {errors.email && <span className="text-[8px] text-red-400/80 font-sans block mt-0.5">{errors.email}</span>}
                        </div>
                        <div>
                          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone *" className={inp('phone')} />
                          {errors.phone && <span className="text-[8px] text-red-400/80 font-sans block mt-0.5">{errors.phone}</span>}
                        </div>
                      </div>
                      <textarea name="notes" rows={1} value={formData.notes} onChange={handleChange}
                        placeholder="Special requests, allergies, celebrations..."
                        className="w-full bg-transparent border-0 border-b border-luxury-gold/10 focus:border-luxury-gold/50 focus:outline-none py-1 text-xs text-luxury-cream placeholder-luxury-cream/15 resize-none font-sans font-light transition-colors duration-300" />
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="relative overflow-hidden w-full py-3.5 bg-luxury-gold text-luxury-bg text-[10px] tracking-[0.3em] uppercase font-sans font-bold hover:bg-luxury-cream hover:text-luxury-bg transition-all duration-500 disabled:opacity-50 shadow-[0_8px_25px_rgba(200,169,126,0.12)] cursor-pointer rounded-full group focus:outline-none"
                    >
                      <span className="absolute inset-0 w-[200%] bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                      {submitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-3.5 w-3.5 text-luxury-bg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Securing Sanctuary...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-1.5">
                          Confirm Reservation <ChevronRight className="w-3.5 h-3.5 translate-x-0 group-hover:translate-x-1 transition-transform" />
                        </span>
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}