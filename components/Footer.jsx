'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, ArrowUp, Sparkles, ShieldCheck } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="w-full border-t border-white/10 bg-black/40 backdrop-blur-xl mt-20 relative z-30">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-white/5">
          {/* Brand & Tagline */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <Link href="/" className="flex items-center gap-2 mb-2 group">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-orange-500 via-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
                <Heart className="w-4 h-4 fill-white/20" />
              </div>
              <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-orange-400 via-amber-300 to-orange-400 bg-clip-text text-transparent">
                WANNA DATE U
              </span>
            </Link>
            <p className="text-xs text-zinc-400 max-w-sm">
              On a scale of 1 to America, how free are you this weekend?
            </p>
          </div>

          {/* Back to Top */}
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium text-zinc-300 bg-white/5 hover:bg-white/10 hover:text-white border border-white/10 transition-all cursor-pointer shadow-sm"
          >
            <ArrowUp className="w-3.5 h-3.5 text-orange-400" />
            <span>Back to top</span>
          </button>
        </div>

        {/* Bottom Credits & Status Pill */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-zinc-400 font-mono text-[11px]">
              Status: Open to genuine sparks
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-center text-zinc-400">
            <Heart className="w-3.5 h-3.5 text-orange-400 fill-orange-400/30" />
            <span>crafted with intentionality, good humor, and high standards</span>
          </div>

          <div className="text-[11px] text-zinc-500">
            &copy; {new Date().getFullYear()} WANNA DATE U. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
