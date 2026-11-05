'use client';

import Link from 'next/link';
import { ShieldCheck, ArrowRight, Bot, CheckCircle2 } from 'lucide-react';

export default function AdminPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full p-8 rounded-3xl bg-zinc-900/90 border border-orange-500/30 backdrop-blur-xl shadow-2xl text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
          <Bot className="w-8 h-8" />
        </div>

        <h1 className="text-2xl font-bold text-white mb-3">
          Managed via Telegram Bot
        </h1>

        <p className="text-zinc-300 text-sm leading-relaxed mb-6 font-sans">
          A separate admin panel is no longer required. Whenever a visitor submits an "I'm Interested" match proposal, an instant notification with candidate details and interactive <strong>Agree (Accept)</strong> and <strong>Reject</strong> buttons is sent straight to Pruthviraj's Telegram bot.
        </p>

        <div className="p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-xs text-orange-200 mb-6 flex items-center gap-2.5 text-left">
          <CheckCircle2 className="w-5 h-5 text-orange-400 shrink-0" />
          <span>Bot active. Decisions are cast directly within your Telegram chat with one tap.</span>
        </div>

        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center gap-2 w-full py-3 px-6 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm transition-all shadow-lg shadow-orange-500/20 cursor-pointer"
        >
          <span>Return to Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
