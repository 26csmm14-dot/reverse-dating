'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import ReflectShader from '@/components/originkit/ui/reflect-shader';
import {
  Send,
  Check,
  Copy,
  ExternalLink,
  Instagram,
  Ghost,
  MessageCircle,
} from 'lucide-react';

export default function AcceptedPage() {
  const [copiedKey, setCopiedKey] = useState(null);

  // Trigger celebration confetti cannon
  useEffect(() => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
    });

    const timer = setTimeout(() => {
      confetti({
        particleCount: 70,
        angle: 60,
        spread: 60,
        origin: { x: 0 },
      });
      confetti({
        particleCount: 70,
        angle: 120,
        spread: 60,
        origin: { x: 1 },
      });
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  const handleCopy = async (text, key) => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        setCopiedKey(key);
        setTimeout(() => setCopiedKey(null), 2000);
      }
    } catch (err) {
      console.warn('Clipboard write prevented:', err);
    }
  };

  const commsChannels = [
    {
      key: 'instagram',
      name: 'Instagram',
      handle: '@ur_frnd.lee_neighbor',
      desc: 'Follow or drop a DM directly on Instagram',
      url: 'https://www.instagram.com/ur_frnd.lee_neighbor?exln=Y2g1NHo4dTYwN3N3',
      icon: Instagram,
      color: 'from-orange-500 via-rose-500 to-amber-500',
    },
    {
      key: 'telegram',
      name: 'Telegram',
      handle: '@Mokunaa',
      desc: 'Instant direct chat with Pruthviraj',
      url: 'https://t.me/Mokunaa',
      icon: Send,
      color: 'from-amber-500 via-orange-500 to-amber-600',
    },
    {
      key: 'snapchat',
      name: 'Snapchat',
      handle: 'itznotpruthvi',
      desc: 'Add on Snap for daily snaps & moments',
      url: 'https://www.snapchat.com/add/itznotpruthvi?share_id=I9K-xg9BemE&locale=en-US',
      icon: Ghost,
      color: 'from-amber-400 via-yellow-500 to-orange-500',
    },
    {
      key: 'whatsapp',
      name: 'WhatsApp',
      handle: 'wa.me/qr/LJ6L7N35FTO6J1',
      desc: 'Chat directly with Pruthviraj on WhatsApp',
      url: 'https://wa.me/qr/LJ6L7N35FTO6J1',
      icon: MessageCircle,
      color: 'from-emerald-500 via-green-500 to-teal-500',
    },
  ];

  return (
    <div className="relative min-h-[75vh] flex flex-col items-center justify-center">
      {/* Originkit Reflect Shader Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <ReflectShader
          background="#0a0502"
          tint="#ff9944"
          speed={40}
          brightness={150}
          thickness={30}
          chromatic={22}
          bandGap={16}
          zoom={240}
          hover={85}
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

      <div className="relative z-10 flex flex-col items-center justify-center max-w-2xl mx-auto py-10 px-4 w-full">
        {/* Unlocked Channels Card Deck */}
        <motion.div
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-10"
        >
        {commsChannels.map((s) => {
          const Icon = s.icon;
          const isCopied = copiedKey === s.key;
          return (
            <div
              key={s.key}
              className="p-5 rounded-3xl border border-white/15 bg-black/40 backdrop-blur-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_16px_36px_rgba(0,0,0,0.5)] hover:border-orange-400/60 hover:bg-black/50 flex flex-col justify-between transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${s.color} flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform border border-white/10`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <button
                    onClick={() => handleCopy(s.handle, s.key)}
                    className="p-1.5 text-zinc-400 hover:text-orange-300 rounded-lg hover:bg-white/10 text-xs flex items-center gap-1 transition-colors cursor-pointer border border-transparent hover:border-white/10"
                    title="Copy handle"
                  >
                    {isCopied ? (
                      <Check className="w-3.5 h-3.5 text-orange-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                <h3 className="font-bold text-white text-base mb-0.5 tracking-tight font-sans">
                  {s.name}
                </h3>
                <p className="text-xs text-orange-400 font-mono mb-2">{s.handle}</p>
                <p className="text-xs text-zinc-300 leading-relaxed mb-4 font-sans">{s.desc}</p>
              </div>

              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-3 rounded-xl bg-white/5 hover:bg-orange-500/20 text-orange-200 text-xs font-semibold flex items-center justify-center gap-1.5 border border-white/10 hover:border-orange-400/50 backdrop-blur-md transition-all font-sans cursor-pointer shadow-sm"
              >
                <span>Open {s.name}</span>
                <ExternalLink className="w-3.5 h-3.5 text-orange-400" />
              </a>
            </div>
          );
        })}
      </motion.div>

      {/* Return link */}
      <Link
        href="/dashboard"
        className="px-4 py-2 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 hover:border-orange-400/50 text-xs text-zinc-300 hover:text-orange-300 transition-all font-mono shadow-sm"
      >
        ← Back to Portfolio
      </Link>
      </div>
    </div>
  );
}
