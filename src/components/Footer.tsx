'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Phone, Mail } from 'lucide-react';

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function FacebookIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function TwitterIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  );
}

const LOCATIONS = [
  {
    city: 'New York',
    address: '42 Wall Street, Manhattan, NY 10005',
    phone: '+1 (212) 555-0199',
    hours: '12:00 PM - 11:00 PM',
  },
  {
    city: 'Paris',
    address: '18 Rue de la Paix, 75002 Paris',
    phone: '+33 1 55 55 01 22',
    hours: '12:00 PM - Midnight',
  },
  {
    city: 'Tokyo',
    address: '5 Chome-11 Minamiaoyama, Minato City, 107-0062',
    phone: '+81 3-5555-0188',
    hours: '06:00 PM - 02:00 AM',
  },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
    }, 1500);
  };

  return (
    <footer
      id="lounge"
      className="relative bg-luxury-bg text-luxury-cream z-10 border-t border-luxury-gold/10 pt-20 pb-8 overflow-hidden"
    >
      {/* Background soft glow */}
      <div className="absolute left-1/4 top-0 w-[500px] h-[300px] bg-luxury-gold/2 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full space-y-16">
        
        {/* Top: Locations Grid & Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 pb-12 border-b border-luxury-gold/5">
          
          {/* Branches (lg: 8 cols) */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-8">
            {LOCATIONS.map((loc) => (
              <div key={loc.city} className="space-y-4">
                <h4 className="font-serif text-lg tracking-[0.1em] text-luxury-gold uppercase">
                  ATIKUA {loc.city}
                </h4>
                <div className="w-8 h-[1px] bg-luxury-gold/30" />
                <p className="text-xs text-luxury-cream/60 font-sans font-light leading-relaxed tracking-[0.05em]">
                  {loc.address}
                </p>
                <div className="text-[11px] font-sans font-light tracking-[0.05em] text-luxury-cream/80 space-y-1">
                  <div className="flex items-center gap-1.5 hover:text-luxury-gold transition-colors duration-300">
                    <Phone className="w-3 h-3 text-luxury-gold/75" />
                    <span>{loc.phone}</span>
                  </div>
                  <div className="text-[10px] text-luxury-cream/40 mt-1 uppercase tracking-[0.1em]">
                    Hours: {loc.hours}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Newsletter / Circle Signup (lg: 4 cols) */}
          <div className="lg:col-span-4 flex flex-col justify-start space-y-6">
            <div className="space-y-2">
              <h4 className="font-serif text-lg tracking-[0.1em] text-luxury-cream uppercase">
                THE EPICUREAN CLUB
              </h4>
              <p className="text-xs text-luxury-cream/50 font-sans font-light tracking-[0.05em] leading-relaxed">
                Join our private circle to receive tasting reservations, chef logs, and exclusive invitations.
              </p>
            </div>

            <form onSubmit={handleSubscribe} className="relative flex items-center border-b border-luxury-gold/30 focus-within:border-luxury-gold transition-colors duration-300">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={subscribed ? "Welcome to the circle." : "Enter your email address"}
                disabled={subscribed}
                className="w-full bg-transparent text-xs py-3 pr-10 focus:outline-none placeholder-luxury-cream/30 text-luxury-cream tracking-[0.08em] disabled:text-luxury-gold"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="absolute right-0 hover:text-luxury-gold text-luxury-cream/60 transition-colors duration-300"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>

        {/* Bottom: Socials, Logo & Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-xs tracking-[0.1em] text-luxury-cream/40 font-sans font-light">
          
          {/* Logo brand */}
          <div className="flex items-center gap-4">
            <span className="font-serif text-xl tracking-[0.25em] text-luxury-cream/80">
              ATIKUA
            </span>
            <span className="w-1.5 h-1.5 bg-luxury-gold rounded-full" />
            <span>Est. 2012</span>
          </div>

          {/* Copyright */}
          <div className="text-center md:text-right order-last md:order-none">
            &copy; {new Date().getFullYear()} ATIKUA Gastronomy Group. All rights reserved.
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-6">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="hover:text-luxury-gold transition-colors duration-300"
            >
              <InstagramIcon className="w-4 h-4" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="hover:text-luxury-gold transition-colors duration-300"
            >
              <FacebookIcon className="w-4 h-4" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="hover:text-luxury-gold transition-colors duration-300"
            >
              <TwitterIcon className="w-4 h-4" />
            </a>
          </div>

        </div>

      </div>
    </footer>
  );
}
