'use client';

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import {
  User,
  Trophy,
  Compass,
  CheckCircle2,
  Sparkles,
  Heart,
  ArrowUp,
} from 'lucide-react';

const SECTIONS = [
  { id: 'hero', label: 'Story', icon: User },
  { id: 'achievements', label: 'Craft & Wins', icon: Trophy },
  { id: 'ambitions', label: 'Vision', icon: Compass },
  { id: 'strengths', label: 'Green & Yellow', icon: CheckCircle2 },
  { id: 'hobbies', label: 'Passions', icon: Sparkles },
  { id: 'pitch', label: 'The Pitch', icon: Heart },
];

export default function PortfolioNav() {
  const [activeSection, setActiveSection] = useState('hero');
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Framer Motion scroll progress
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    // Show back to top button after 300px
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Track active section via IntersectionObserver
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-25% 0px -40% 0px' }
    );

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* ── Fixed Liquid Top Scroll Progress Bar ── */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500 origin-left z-30 shadow-[0_0_14px_rgba(249,115,22,0.85)] pointer-events-none"
        style={{ scaleX }}
      />

      {/* ── Floating Sticky Quick Section Pill Dock ── */}
      <nav
        aria-label="Portfolio sections"
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 px-3 py-2 rounded-full glass-panel border border-white/15 bg-black/60 backdrop-blur-2xl shadow-[0_12px_36px_rgba(0,0,0,0.6)] flex items-center gap-1 sm:gap-1.5"
      >
        {SECTIONS.map((sec) => {
          const Icon = sec.icon;
          const isActive = activeSection === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => scrollToSection(sec.id)}
              aria-label={sec.label}
              title={sec.label}
              className={`relative p-2.5 rounded-full transition-all duration-200 cursor-pointer flex items-center justify-center ${
                isActive
                  ? 'text-white'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.08]'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeSectionPill"
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500/35 to-amber-500/35 border border-orange-400/60 shadow-md shadow-orange-500/25"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
              <Icon className="w-4 h-4 relative z-10 shrink-0 text-orange-300" />
            </button>
          );
        })}

        {showBackToTop && (
          <button
            onClick={scrollToTop}
            title="Scroll to top"
            aria-label="Scroll to top"
            className="ml-1 p-2.5 rounded-full text-zinc-400 hover:text-orange-300 hover:bg-white/10 transition-colors cursor-pointer flex items-center justify-center"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        )}
      </nav>
    </>
  );
}
