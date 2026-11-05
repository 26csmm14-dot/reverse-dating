'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import BubbleType from '@/components/originkit/ui/bubble-text-custom-style';
import PredictiveArc from '@/components/originkit/ui/predictive-arc';
import {
  RefreshCw,
  LogIn,
} from 'lucide-react';

export default function RejectedPage() {
  const consolations = [
    '“Not every encounter turns into a spark, and that is okay. The right connection is worth the wait.”',
    '“A respectful answer right away is always better than ghosting. Wishing you pure happiness on your journey.”',
    '“The vibe didn’t fully align, but you deserve someone who is 100% excited and all in for you.”',
    '“Chemistry cannot be forced—someone out there is looking for exactly your kind of energy.”',
  ];

  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  const rotateQuote = () => {
    setCurrentQuoteIndex((prev) => (prev + 1) % consolations.length);
  };

  return (
    <div className="relative min-h-[75vh] flex flex-col items-center justify-center">
      {/* Originkit Predictive Arc Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <PredictiveArc
          density={75}
          dotSize={95}
          speed={45}
          arch={{ peak: 40, archHeight: 50, thickness: 110, falloff: 280 }}
          pointer={{ enabled: true, radius: 320, strength: 85 }}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            minWidth: 0,
            minHeight: 0,
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center max-w-2xl mx-auto text-center py-6 px-4 w-full">
        {/* Originkit 3D Soap-Bubble Type Headline */}
        <div className="w-full h-80 sm:h-96 relative flex items-center justify-center my-2 overflow-hidden">
          <BubbleType
            text={"ERROR 404:\nLOVE\nNOT FOUND"}
            tint="#ffffff"
            opacity={18}
            bubbleSize={20}
            density={20}
            speed={10}
            style={{
              width: '100%',
              height: '100%',
            }}
          />
        </div>


      {/* Clean Match Decision Status Log */}
      <motion.div
        initial={{ opacity: 1, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full glass-panel p-5 rounded-2xl border border-white/10 text-left font-mono text-xs mb-8 overflow-hidden shadow-xl"
      >
        <div className="flex items-center gap-1.5 pb-3 mb-3 border-b border-white/5 text-zinc-500 text-[11px]">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500/80 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
          <span className="ml-2 text-zinc-400">match_decision.log</span>
        </div>

        <div className="space-y-1.5 text-zinc-400">
          <p className="text-orange-400">
            &gt; Status: 404 (Love Not Found)
          </p>
          <p>&gt; Note: No hard feelings—honest communication always wins over ghosting.</p>
          <p className="text-zinc-500">
            &gt; Wish: May you find someone who cherishes everything you bring to the table.
          </p>
        </div>
      </motion.div>

      {/* Reassurance Quote Card */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.25 }}
        className="glass-panel p-4 rounded-2xl border border-white/5 mb-8 max-w-md w-full"
      >
        <p className="text-xs text-orange-300 italic mb-3 font-mono">
          {consolations[currentQuoteIndex]}
        </p>
        <button
          onClick={rotateQuote}
          className="inline-flex items-center gap-1.5 text-[11px] text-zinc-400 hover:text-white transition-colors cursor-pointer font-mono"
        >
          <RefreshCw className="w-3 h-3 text-orange-400" />
          <span>Next comforting thought</span>
        </button>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex flex-wrap items-center justify-center gap-3"
      >
        <Link
          href="/dashboard"
          className="px-5 py-2.5 rounded-xl font-semibold text-xs text-zinc-200 hover:text-white glass-panel hover:bg-white/10 transition-colors flex items-center gap-2 border border-white/10 font-mono shadow-sm"
        >
          <span>← Back to Portfolio</span>
        </Link>

        <Link
          href="/login"
          className="px-5 py-2.5 rounded-xl font-semibold text-xs text-zinc-200 hover:text-white glass-panel hover:bg-white/10 transition-colors flex items-center gap-2 border border-white/10 font-mono shadow-sm"
        >
          <LogIn className="w-4 h-4 text-orange-400" />
          <span>Return to Login Page</span>
        </Link>
      </motion.div>
      </div>
    </div>
  );
}
