'use client';

import CorollaGleam from '@/components/originkit/ui/corolla-gleam';
import Link from 'next/link';
import { ArrowRight, Heart } from 'lucide-react';

export default function Home() {
  return (
    <div className="fixed inset-0 z-50 w-screen h-screen bg-[#040201] flex items-center justify-center overflow-hidden">
      {/* Originkit Corolla Gleam Full-Screen Background */}
      <CorollaGleam
        background="#040201"
        warm="#ea580c"
        cool="#f59e0b"
        count={27}
        scale={205}
        innerRadius={24}
        speed={42}
        hover={100}
        breathe={55}
        spin={10}
        advanced={{
          pinkColor: '#f97316',
          deepColor: '#7c2d12',
          lightColor: '#fde047',
          tealColor: '#ea580c',
          hotColor: '#ffedd5',
          shadow: 0,
          contact: 45,
          specular: 70,
          shininess: 60,
        }}
        style={{
          width: '100%',
          height: '100%',
          minWidth: '100vw',
          minHeight: '100vh',
        }}
      />

      {/* Floating Navigation Pill to Reverse Dating Portfolio */}
      <div className="absolute bottom-8 z-40 flex items-center gap-3">
        <Link
          href="/dashboard"
          className="px-6 py-3 rounded-full bg-orange-500/20 hover:bg-orange-500/35 backdrop-blur-xl border border-orange-400/50 text-white text-xs font-semibold tracking-wide transition-all shadow-[0_0_25px_rgba(249,115,22,0.4)] flex items-center gap-2 cursor-pointer"
        >
          <Heart className="w-3.5 h-3.5 fill-orange-400 text-orange-400" />
          <span>Enter Pruthviraj's Portfolio</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
