'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Sparkles,
  Heart,
  Compass,
  Trophy,
  CheckCircle2,
  AlertCircle,
  Dumbbell,
  Code2,
  Coffee,
  Music,
  Mountain,
  BookOpen,
  Utensils,
  MessageCircle,
  Send,
  Check,
  ShieldCheck,
  User,
  ArrowRight,
  ExternalLink,
  RefreshCw,
  X,
  Loader2,
  Flame,
  Volume2,
  Target,
  Shield,
  Moon,
  Calculator,
} from 'lucide-react';
import Card3D from '@/components/portfolio/Card3D';
import PortfolioNav from '@/components/portfolio/PortfolioNav';
import CorollaGleam from '@/components/originkit/ui/corolla-gleam';
import CrystalGlow from '@/components/originkit/ui/crystal-glow';

const DATE_IDEAS = [
  {
    id: 'trail-trek',
    title: 'Scenic Mountain Trail Trek & Hilltop Sunset',
    desc: 'Escaping the city noise to hike rugged nature trails, sharing quiet moments, and catching golden hour at the summit.',
    icon: Mountain,
  },
  {
    id: 'home-cooked-dinner',
    title: 'Homemade Dinner & Soulful Music Session',
    desc: 'I will cook something special from scratch for us while we unwind to acoustic and emotional melodies.',
    icon: Utensils,
  },
  {
    id: 'night-owl-drive',
    title: 'Late-Night Drive & Deep Stargazing Talk',
    desc: 'Cruising through empty midnight roads with our favorite deep songs, grabbing street food, and talking till the stars fade.',
    icon: Moon,
  },
  {
    id: 'cafe-curiosity',
    title: 'Cozy Cafe Date, Mathematics & Creative Ideas',
    desc: 'Finding a tucked-away cafe corner, sipping warm drinks, and exchanging wild ambitions, coding projects, and curious thoughts.',
    icon: Coffee,
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const [visitor, setVisitor] = useState(null);
  const [loadingVisitor, setLoadingVisitor] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDateIdea, setSelectedDateIdea] = useState(DATE_IDEAS[0].id);
  const [customPitch, setCustomPitch] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [visitorName, setVisitorName] = useState('');
  const [visitorContact, setVisitorContact] = useState('');
  const [statusChecking, setStatusChecking] = useState(false);
  const [modalError, setModalError] = useState('');
  const [statusToast, setStatusToast] = useState('');

  // Fetch session on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.search.includes('modal=true')) {
      setModalOpen(true);
    }
    async function loadSession() {
      try {
        const res = await fetch('/api/auth');
        const data = await res.json();
        if (data.authenticated && data.applicant) {
          setVisitor(data.applicant);
          setVisitorName(data.applicant.name || '');
          setVisitorContact(data.applicant.contact || '');
          if (data.applicant.pitch) setCustomPitch(data.applicant.pitch);
          if (data.applicant.firstDateIdea) {
            const matched = DATE_IDEAS.find(
              (i) => i.id === data.applicant.firstDateIdea || i.title === data.applicant.firstDateIdea
            );
            setSelectedDateIdea(matched ? matched.id : data.applicant.firstDateIdea);
          }
        }
      } catch (err) {
        console.error('Failed to load session:', err);
      } finally {
        setLoadingVisitor(false);
      }
    }
    loadSession();
  }, [router]);

  // Real-time polling when proposal is pending (immediately detects Telegram decision)
  useEffect(() => {
    if (visitor?.status !== 'pending') return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/status');
        const d = await res.json();
        if (d.status === 'accepted') {
          router.push('/status/accepted');
        } else if (d.status === 'rejected') {
          router.push('/status/404-rejected');
        }
      } catch (err) {
        // quiet ignore
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [visitor?.status, router]);

  // Handle Application / Match Proposal Submission
  const handleApply = async (e) => {
    e.preventDefault();
    setModalError('');
    if (!visitorName.trim() || !visitorContact.trim()) {
      setModalError('Please share your sweet name and contact handle so we can connect.');
      return;
    }

    setSubmitting(true);
    try {
      const selectedIdeaObj = DATE_IDEAS.find((i) => i.id === selectedDateIdea);
      const res = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicantId: visitor?.id,
          name: visitorName.trim(),
          contact: visitorContact.trim(),
          pitch: customPitch.trim(),
          firstDateIdea: selectedIdeaObj ? selectedIdeaObj.title : selectedDateIdea,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Submission failed');
      }

      setSubmitSuccess(true);
      setVisitor((prev) => ({
        ...prev,
        status: 'pending',
        name: visitorName.trim(),
        contact: visitorContact.trim(),
        pitch: customPitch.trim(),
      }));

      setTimeout(() => {
        setModalOpen(false);
        setSubmitSuccess(false);
      }, 2200);
    } catch (err) {
      setModalError(err.message || 'Error submitting application');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCheckStatus = async () => {
    setStatusChecking(true);
    setStatusToast('');
    try {
      const res = await fetch('/api/status');
      const d = await res.json();
      if (d.status === 'accepted') {
        router.push('/status/accepted');
      } else if (d.status === 'rejected') {
        router.push('/status/404-rejected');
      } else {
        setStatusToast('Your proposal is still under thoughtful consideration. Good things take time!');
        setTimeout(() => setStatusToast(''), 4500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setStatusChecking(false);
    }
  };

  return (
    <div className="pb-44 pt-2 relative">
      {/* ── Originkit Corolla Gleam Iridescent Glass Paddle Ring Background ── */}
      <div className="fixed inset-0 -z-20 w-full h-full overflow-hidden pointer-events-auto">
        <CorollaGleam
          background="#040201"
          warm="#ea580c"
          cool="#f59e0b"
          count={27}
          scale={195}
          innerRadius={24}
          speed={40}
          hover={100}
          breathe={50}
          spin={8}
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
            position: 'absolute',
            inset: 0,
            width: '100vw',
            height: '100vh',
            minWidth: '100%',
            minHeight: '100%',
          }}
        />

        {/* Contrast vignette & legibility gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/20 to-black/60 pointer-events-none" />
      </div>

      {/* ── Scroll Progress & Section Navigation Dock ── */}
      <PortfolioNav />

      {/* ── Match Status Banners ── */}
      {visitor?.status === 'accepted' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm font-sans backdrop-blur-md shadow-lg shadow-emerald-500/10"
        >
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0" />
            <span>
              <strong>Match Accepted:</strong> You & Pruthviraj are officially matched!
            </span>
          </div>
          <Link
            href="/status/accepted"
            className="px-3.5 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-100 rounded-xl text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5 shrink-0"
          >
            <span>View Match Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>
      )}

      {visitor?.status === 'rejected' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-4 rounded-2xl bg-orange-500/15 border border-orange-500/30 text-orange-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm font-sans backdrop-blur-md shadow-lg shadow-orange-500/10"
        >
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-400 shrink-0" />
            <span>
              <strong>Application Concluded:</strong> You can review the status update and farewell note.
            </span>
          </div>
          <Link
            href="/status/404-rejected"
            className="px-3.5 py-1.5 bg-orange-500/20 hover:bg-orange-500/30 text-orange-100 rounded-xl text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5 shrink-0"
          >
            <span>View Status Log</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>
      )}

      {/* ── In-Flight Application Status Notification ── */}
      {visitor?.status === 'pending' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-4 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-orange-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm font-sans backdrop-blur-md shadow-lg shadow-orange-500/5"
        >
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-400 animate-ping shrink-0" />
            <span>
              <strong>Application Under Consideration:</strong> Your proposal has been transmitted to the host. Review in progress!
            </span>
          </div>
          <button
            onClick={handleCheckStatus}
            disabled={statusChecking}
            className="px-3.5 py-1.5 bg-orange-500/20 hover:bg-orange-500/30 text-orange-100 rounded-xl text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5 shrink-0"
          >
            {statusChecking ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <RefreshCw className="w-3.5 h-3.5" />
            )}
            <span>Check Decision</span>
          </button>
        </motion.div>
      )}

      {statusToast && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-3.5 max-w-xl mx-auto rounded-2xl bg-orange-500/15 border border-orange-500/30 text-orange-200 text-xs sm:text-sm flex items-center justify-center gap-2.5 backdrop-blur-md shadow-lg shadow-orange-500/10 text-center"
        >
          <Sparkles className="w-4 h-4 text-orange-400 shrink-0" />
          <span>{statusToast}</span>
        </motion.div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          SECTION 1: HERO (#hero)
          Personal Lore: Portrait, Headline, Bio & Quick Stats
      ───────────────────────────────────────────────────────────── */}
      <section id="hero" className="scroll-mt-24 text-center max-w-4xl mx-auto mb-28">
        <div className="relative inline-block mb-6">
          {/* Portrait Photo Frame with ambient glow */}
          <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-3xl p-1 bg-gradient-to-tr from-orange-500 via-amber-400 to-orange-600 shadow-2xl shadow-orange-500/35">
            <div className="w-full h-full rounded-[22px] bg-zinc-900 overflow-hidden relative border border-white/20">
              <img
                src="/images/profile/pruthviraj-avatar.jpg"
                alt="Pruthviraj"
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>
        </div>

        {/* Location & Archetype Pill */}
        <div className="block mb-5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel text-zinc-300 text-xs font-mono border border-orange-500/30 bg-orange-500/5 shadow-sm">
            <MapPin className="w-3.5 h-3.5 text-orange-400" />
            <span>Kristu Jayanti University • NCC Cadet & Professional Rifle Marksman • Developer</span>
          </div>
        </div>

        {/* Glass Box for Name & Bio */}
        <div className="max-w-3xl mx-auto mb-8 p-6 sm:p-8 rounded-3xl bg-black/50 backdrop-blur-2xl border border-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_12px_40px_rgba(0,0,0,0.6)]">
          {/* Main Name with Originkit Crystal Glow effect */}
          <div className="flex items-center justify-center mb-4 overflow-visible">
            <CrystalGlow
              text="PRUTHVIRAJ"
              fontSize={52}
              fontWeight={900}
              textColor="#FFFFFF"
              shadowColor="#ea580c"
              glareColor="rgba(255, 255, 255, 0.9)"
              glareSpeed={1.2}
            />
          </div>

          {/* Authentic Human Bio */}
          <p className="text-zinc-200 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-sans">
            Undergraduate at Kristu Jayanti University, disciplined NCC member, and professional rifle shooter with a genuine passion for coding, website development, and mathematics. Aspiring to serve in the Indian Armed Forces. When I am not trekking outdoor trails or exploring, I unwind with soulful emotional songs, cook comfort meals in the kitchen, and catch up on restful sleep. I believe being there for each other is the truest, most meaningful connection.
          </p>
        </div>

        {/* Quick Highlights Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 text-xs font-mono">
          <span className="px-3.5 py-1.5 rounded-full glass-panel text-orange-300 border border-orange-500/30 flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5" />
            <span>Discipline: NCC & Rifle Marksman</span>
          </span>
          <span className="px-3.5 py-1.5 rounded-full glass-panel text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
            <Code2 className="w-3.5 h-3.5" />
            <span>Craft: Code, Web & Mathematics</span>
          </span>
          <span className="px-3.5 py-1.5 rounded-full glass-panel text-orange-300 border border-orange-500/30 flex items-center gap-1.5">
            <Moon className="w-3.5 h-3.5" />
            <span>Vibe: Night Owl & Can Cook</span>
          </span>
          <span className="px-3.5 py-1.5 rounded-full glass-panel text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5" />
            <span>Belief: Being There For Each Other</span>
          </span>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 2: ACHIEVEMENTS & CRAFT (#achievements)
          3D Perspective Tilt Cards showcasing milestones
      ───────────────────────────────────────────────────────────── */}
      <section id="achievements" className="scroll-mt-24 max-w-5xl mx-auto mb-28">
        <div className="flex items-center gap-2.5 text-orange-400 font-semibold text-xs tracking-wider uppercase mb-2 font-mono">
          <Trophy className="w-4 h-4" />
          <span>Milestones & Discipline</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-bold text-white mb-3 tracking-tight">
          Craft, Wins & Dedication
        </h2>
        <p className="text-zinc-400 text-sm max-w-xl mb-8">
          The values I live by: deliberate practice, staying curious, and doing hard things with quiet consistency.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card3D depth={10} glowColor="rgba(249,115,22,0.2)">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0 text-orange-400">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1.5">
                  NCC Member & Professional Rifle Shooter
                </h3>
                <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed">
                  Trained in disciplined marksmanship, rigorous drills, and unwavering composure under pressure. Mastering breathing, stillness, and target precision with quiet confidence.
                </p>
                <div className="mt-3 flex gap-2">
                  <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-white/5 text-orange-300">
                    NCC Cadet
                  </span>
                  <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-white/5 text-zinc-400">
                    Rifle Marksman
                  </span>
                </div>
              </div>
            </div>
          </Card3D>

          <Card3D depth={10} glowColor="rgba(245,158,11,0.2)">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 text-amber-400">
                <Code2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1.5">
                  Coding, Web Development & Mathematics
                </h3>
                <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed">
                  Passionate about building responsive full-stack websites, clean user interfaces, and solving complex mathematical challenges with logical rigor and creativity.
                </p>
                <div className="mt-3 flex gap-2">
                  <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-white/5 text-amber-300">
                    Web Development
                  </span>
                  <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-white/5 text-zinc-400">
                    Mathematics
                  </span>
                </div>
              </div>
            </div>
          </Card3D>

          <Card3D depth={10} glowColor="rgba(245,158,11,0.18)">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 text-amber-400">
                <Utensils className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1.5">
                  Comfort Cooking & Kitchen Confidence
                </h3>
                <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed">
                  Yes, I can cook! I love heading to the kitchen to whip up warm, comforting dishes from scratch—because sharing a delicious meal is one of the best ways to connect.
                </p>
                <div className="mt-3 flex gap-2">
                  <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-white/5 text-amber-300">
                    Can Cook
                  </span>
                  <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-white/5 text-zinc-400">
                    Comfort Food
                  </span>
                </div>
              </div>
            </div>
          </Card3D>

          <Card3D depth={10} glowColor="rgba(16,185,129,0.18)">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-400">
                <Compass className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1.5">
                  Academic Journey at Kristu Jayanti
                </h3>
                <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed">
                  Undergraduate student at Kristu Jayanti University, balancing academic rigor in technology and math with cadet duties and outdoor exploration.
                </p>
                <div className="mt-3 flex gap-2">
                  <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-white/5 text-emerald-300">
                    Kristu Jayanti Univ
                  </span>
                  <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-white/5 text-zinc-400">
                    Student & Cadet
                  </span>
                </div>
              </div>
            </div>
          </Card3D>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 3: AMBITIONS & LIFE VISION (#ambitions)
          Where I am headed and what life looks like
      ───────────────────────────────────────────────────────────── */}
      <section id="ambitions" className="scroll-mt-24 max-w-5xl mx-auto mb-28">
        <div className="flex items-center gap-2.5 text-orange-400 font-semibold text-xs tracking-wider uppercase mb-2 font-mono">
          <Compass className="w-4 h-4" />
          <span>The Road Ahead</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-bold text-white mb-3 tracking-tight">
          Life Vision & Long-Term Ambitions
        </h2>
        <p className="text-zinc-400 text-sm max-w-xl mb-8">
          The future is shaped by clear intention. Here is the life I am building and what I look forward to sharing.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Card3D depth={12} glowColor="rgba(249,115,22,0.22)">
            <div className="h-full flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 mb-4">
                  <Shield className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  Commission in the Indian Armed Forces
                </h3>
                <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed">
                  My ultimate ambition: donning the uniform, taking on national duty with unwavering courage and honor, and leading with selflessness and integrity.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/5 text-[11px] font-mono text-orange-300">
                Ultimate Ambition // Armed Forces
              </div>
            </div>
          </Card3D>

          <Card3D depth={12} glowColor="rgba(249,115,22,0.22)">
            <div className="h-full flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 mb-4">
                  <Heart className="w-5 h-5 text-orange-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  Being There For Each Other
                </h3>
                <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed">
                  I believe that true connection is not about grand illusions—it is about consistently showing up, supporting each other's dreams, and being each other's calm refuge.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/5 text-[11px] font-mono text-orange-300">
                Core Philosophy // Meaningful Connection
              </div>
            </div>
          </Card3D>

          <Card3D depth={12} glowColor="rgba(251,146,60,0.22)">
            <div className="h-full flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 mb-4">
                  <Mountain className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  Trekking & Wilderness Exploration
                </h3>
                <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed">
                  Hiking off the beaten track, standing on rugged summits under sweeping skies, discovering untouched trails, and taking in the raw quiet of nature.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/5 text-[11px] font-mono text-orange-300">
                Adventure // Wild Trails & Summits
              </div>
            </div>
          </Card3D>

          <Card3D depth={12} glowColor="rgba(234,179,8,0.2)">
            <div className="h-full flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
                  <Moon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  Soulful Tunes, Night Owl Peace & Good Sleep
                </h3>
                <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed">
                  Night owl energy: getting immersed in emotional melodies that move the heart, cooking late-night snacks, and recharging with restorative, peaceful sleep to stay sharp.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/5 text-[11px] font-mono text-amber-300">
                Lifestyle // Music, Rest & Balance
              </div>
            </div>
          </Card3D>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 4: STRENGTHS & WEAKNESSES (#strengths)
          Honest Pros & Cons: Green Flags vs Yellow Flags
      ───────────────────────────────────────────────────────────── */}
      <section id="strengths" className="scroll-mt-24 max-w-5xl mx-auto mb-28">
        <div className="flex items-center gap-2.5 text-emerald-400 font-semibold text-xs tracking-wider uppercase mb-2 font-mono">
          <CheckCircle2 className="w-4 h-4" />
          <span>Radical Honesty</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-bold text-white mb-3 tracking-tight">
          Strengths & Candid Quirks
        </h2>
        <p className="text-zinc-400 text-sm max-w-xl mb-8">
          The honest truth upfront: what makes me a great partner, and the funny quirks you will have to tolerate.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Green Flags (The Pros) */}
          <Card3D depth={8} glowColor="rgba(16,185,129,0.15)">
            <div className="h-full flex flex-col">
              <div className="flex items-center gap-2.5 text-emerald-400 text-sm font-bold uppercase tracking-wider mb-4 pb-3 border-b border-white/10">
                <CheckCircle2 className="w-4 h-4" />
                <span>The Green Flags (Why It Works)</span>
              </div>
              <ul className="space-y-4 text-xs sm:text-sm text-zinc-300 flex-1">
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                  <div>
                    <strong className="text-white block font-medium">Disciplined & Grounded (NCC & Marksman)</strong>
                    Calm and composed under pressure. Carries strong integrity, loyalty, and quiet protective strength.
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                  <div>
                    <strong className="text-white block font-medium">Shows Up When It Counts</strong>
                    "Being there for each other" is my core philosophy. Never leaving you in doubt, always standing firmly by your side.
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                  <div>
                    <strong className="text-white block font-medium">Can Cook Comfort Meals</strong>
                    Yes, I can cook! You will never have to worry about dinner after a grueling day—warm food will be ready.
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                  <div>
                    <strong className="text-white block font-medium">Sharp Mind & Big Dreams</strong>
                    Passionate about code, math, and joining the Armed Forces. A partner who strives to grow and inspires you to do the same.
                  </div>
                </li>
              </ul>
            </div>
          </Card3D>

          {/* Yellow Flags (The Candid Quirks) */}
          <Card3D depth={8} glowColor="rgba(245,158,11,0.15)">
            <div className="h-full flex flex-col">
              <div className="flex items-center gap-2.5 text-amber-400 text-sm font-bold uppercase tracking-wider mb-4 pb-3 border-b border-white/10">
                <AlertCircle className="w-4 h-4" />
                <span>The Yellow Flags (Honest Quirks)</span>
              </div>
              <ul className="space-y-4 text-xs sm:text-sm text-zinc-300 flex-1">
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  </span>
                  <div>
                    <strong className="text-white block font-medium">Certified Night Owl</strong>
                    My peak focus, best code, and deepest philosophical musings happen well past midnight.
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  </span>
                  <div>
                    <strong className="text-white block font-medium">Emotional Song Immersion</strong>
                    I unwind with soulful, emotional songs on repeat. You will definitely receive links to songs with deep lyrics.
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  </span>
                  <div>
                    <strong className="text-white block font-medium">Stress-Relief Sleep Mode</strong>
                    When life gets hectic, my way of decompressing is catching up on solid, deep sleep. Do not disturb mode is real!
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  </span>
                  <div>
                    <strong className="text-white block font-medium">Marksman Attention to Detail</strong>
                    Rifle shooting and mathematics make me notice subtle details, body language, and small shifts others miss completely.
                  </div>
                </li>
              </ul>
            </div>
          </Card3D>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 5: HOBBIES & PASSIONS (#hobbies)
          What I Like To Do
      ───────────────────────────────────────────────────────────── */}
      <section id="hobbies" className="scroll-mt-24 max-w-5xl mx-auto mb-28">
        <div className="flex items-center gap-2.5 text-orange-400 font-semibold text-xs tracking-wider uppercase mb-2 font-mono">
          <Sparkles className="w-4 h-4" />
          <span>Passions & Downtime</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-bold text-white mb-3 tracking-tight">
          What I Like To Do
        </h2>
        <p className="text-zinc-400 text-sm max-w-xl mb-8">
          The activities, rituals, and micro-obsessions that keep my spark burning outside of work.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <Card3D depth={14} glowColor="rgba(249,115,22,0.22)">
            <div className="flex flex-col h-full">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 mb-4">
                <Mountain className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">
                Trekking & Exploring
              </h3>
              <p className="text-zinc-300 text-xs leading-relaxed flex-1">
                Taking on rugged outdoor trails, mountain passes, and scenic viewpoints. Finding quiet strength in nature.
              </p>
              <div className="mt-4 pt-3 border-t border-white/5 text-[11px] font-mono text-orange-300">
                Outdoor Adventure
              </div>
            </div>
          </Card3D>

          <Card3D depth={14} glowColor="rgba(251,146,60,0.22)">
            <div className="flex flex-col h-full">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
                <Music className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">
                Emotional Songs
              </h3>
              <p className="text-zinc-300 text-xs leading-relaxed flex-1">
                Unwinding with heartfelt songs and soulful melodies that evoke raw emotions and deep reflection.
              </p>
              <div className="mt-4 pt-3 border-t border-white/5 text-[11px] font-mono text-amber-300">
                Soulful Soundtrack
              </div>
            </div>
          </Card3D>

          <Card3D depth={14} glowColor="rgba(16,185,129,0.2)">
            <div className="flex flex-col h-full">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                <Utensils className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">
                Cooking Comfort Food
              </h3>
              <p className="text-zinc-300 text-xs leading-relaxed flex-1">
                Preparing hearty homemade recipes from scratch. Good meals bring people closer and brighten any mood.
              </p>
              <div className="mt-4 pt-3 border-t border-white/5 text-[11px] font-mono text-emerald-300">
                Kitchen Therapy
              </div>
            </div>
          </Card3D>

          <Card3D depth={14} glowColor="rgba(245,158,11,0.2)">
            <div className="flex flex-col h-full">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
                <Code2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">
                Code & Mathematics
              </h3>
              <p className="text-zinc-300 text-xs leading-relaxed flex-1">
                Building modern web platforms, experimenting with creative UI, and unraveling elegant math problems.
              </p>
              <div className="mt-4 pt-3 border-t border-white/5 text-[11px] font-mono text-amber-300">
                Curious Intellect
              </div>
            </div>
          </Card3D>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 6: THE MATCH PITCH & "I'M INTERESTED" CTA (#pitch)
          Value proposition & prominent proposal trigger
      ───────────────────────────────────────────────────────────── */}
      <section id="pitch" className="scroll-mt-24 max-w-4xl mx-auto text-center mb-24 relative z-20">
        <Card3D depth={0} glowColor="rgba(249,115,22,0.3)" variant="glass" className="p-8 sm:p-12">
          <div className="max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-300 text-xs font-mono mb-6">
              <Heart className="w-3.5 h-3.5 fill-orange-400 text-orange-400" />
              <span>The Bottom Line</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-6">
              Why Date Pruthviraj?
            </h2>

            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed mb-6 font-sans">
              Modern dating is too often crowded with superficial games, ghosting, and half-hearted effort. I built this space because I believe that being there for each other through thick and thin is the most meaningful connection two people can share.
            </p>

            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed mb-8 font-sans">
              With me, you get a disciplined NCC cadet and rifle marksman who values unwavering loyalty, an aspiring officer of the Armed Forces who protects your peace, a developer and night owl who will cook you dinner at midnight, and a partner who listens with genuine care.
            </p>

            {/* Glowing Prominent "I'm Interested" CTA Button */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-30">
              <button
                id="cta-interested"
                type="button"
                onClick={() => setModalOpen(true)}
                onPointerDown={(e) => {
                  setModalOpen(true);
                }}
                className="relative z-30 pointer-events-auto w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:via-amber-600 hover:to-orange-700 text-white font-bold text-base shadow-[0_0_35px_rgba(249,115,22,0.5)] hover:shadow-[0_0_50px_rgba(249,115,22,0.8)] transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-3 active:scale-[0.98]"
              >
                <Heart className="w-5 h-5 fill-white" />
                <span>I'm Interested</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('hero');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-6 py-4 rounded-2xl glass-panel border border-white/10 hover:border-white/20 text-zinc-300 hover:text-white text-sm font-semibold transition-all cursor-pointer relative z-30 pointer-events-auto"
              >
                Review Story Again
              </button>
            </div>
          </div>
        </Card3D>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          MATCH PROPOSAL MODAL DIALOG
          Allows applicant to confirm name, contact, pick date idea, and pitch
      ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (submitting) return;
                const hasUnsavedChanges = customPitch.trim() !== (visitor?.pitch || '') || (visitorName.trim() && visitorName.trim() !== (visitor?.name || '')) || (visitorContact.trim() && visitorContact.trim() !== (visitor?.contact || ''));
                if (hasUnsavedChanges && !confirm('Discard your proposal?')) return;
                setModalOpen(false);
              }}
              className="fixed inset-0 bg-black/75 backdrop-blur-md"
            />

            {/* Modal Dialog Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-lg rounded-3xl p-6 sm:p-8 border border-orange-400/30 bg-black/40 backdrop-blur-2xl shadow-[inset_0_1px_0_rgba(251,146,60,0.15),inset_0_-1px_0_rgba(251,146,60,0.08),0_16px_48px_rgba(0,0,0,0.6),0_0_80px_rgba(234,88,12,0.08)] z-10 max-h-[88vh] flex flex-col overflow-hidden"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => {
                  const hasUnsavedChanges = customPitch.trim() !== (visitor?.pitch || '') || (visitorName.trim() && visitorName.trim() !== (visitor?.name || '')) || (visitorContact.trim() && visitorContact.trim() !== (visitor?.contact || ''));
                  if (hasUnsavedChanges && !confirm('Discard your proposal?')) return;
                  setModalOpen(false);
                }}
                disabled={submitting}
                className="absolute top-5 right-5 p-2 rounded-xl text-orange-300/60 hover:text-orange-200 hover:bg-orange-500/10 transition-colors cursor-pointer z-20"
              >
                <X className="w-5 h-5" />
              </button>

              {submitSuccess ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 stroke-[3]" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Proposal Received!</h3>
                  <p className="text-zinc-300 text-sm max-w-sm mx-auto leading-relaxed">
                    Your proposal and first date vision have been safely delivered to Pruthviraj. If the vibe is right, you will hear back soon!
                  </p>
                </div>
              ) : (
                <form onSubmit={handleApply} className="flex flex-col flex-1 overflow-hidden">
                  <div className="overflow-y-auto pr-1 space-y-5 pb-4">
                    <div className="flex items-center gap-2.5 text-orange-400 text-xs font-mono tracking-wider uppercase mb-1">
                      <Heart className="w-3.5 h-3.5 fill-orange-400 text-orange-400" />
                      <span>Match Proposal</span>
                    </div>

                    <h3 className="text-2xl font-bold text-white tracking-tight">
                      Let's Make This Happen
                    </h3>
                    <p className="text-zinc-400 text-xs sm:text-sm">
                      Pick a date idea you would love, add a note, and let's see if sparks fly.
                    </p>

                    {modalError && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 rounded-xl bg-orange-500/15 border border-orange-500/30 text-orange-200 text-xs flex items-center gap-2"
                      >
                        <AlertCircle className="w-4 h-4 text-orange-400 shrink-0" />
                        <span>{modalError}</span>
                      </motion.div>
                    )}

                    {/* Name field */}
                    <div>
                      <label className="block text-xs font-medium text-orange-200 mb-1.5">
                        May I know your sweet name? <span className="text-orange-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={visitorName}
                        onChange={(e) => setVisitorName(e.target.value)}
                        placeholder="Your sweet name"
                        className="w-full px-4 py-3 rounded-xl bg-orange-950/20 border border-orange-400/20 text-white text-sm placeholder:text-zinc-500 focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-500/40 backdrop-blur-sm"
                      />
                    </div>

                    {/* Contact handle */}
                    <div>
                      <label className="block text-xs font-medium text-orange-200 mb-1.5">
                        How can we be in touch? <span className="text-orange-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={visitorContact}
                        onChange={(e) => setVisitorContact(e.target.value)}
                        placeholder="Instagram, phone, or WhatsApp handle"
                        className="w-full px-4 py-3 rounded-xl bg-orange-950/20 border border-orange-400/20 text-white text-sm placeholder:text-zinc-500 focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-500/40 backdrop-blur-sm"
                      />
                    </div>

                    {/* First Date Idea Selection */}
                    <div>
                      <label className="block text-xs font-medium text-orange-200 mb-2">
                        Choose Your Ideal First Date:
                      </label>
                      <div className="space-y-2">
                        {DATE_IDEAS.map((idea) => {
                          const Icon = idea.icon;
                          const isSelected = selectedDateIdea === idea.id;
                          return (
                            <div
                              key={idea.id}
                              onClick={() => setSelectedDateIdea(idea.id)}
                              className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 backdrop-blur-sm ${
                                isSelected
                                  ? 'bg-orange-500/15 border-orange-400/70 shadow-[inset_0_1px_0_rgba(251,146,60,0.2),0_4px_12px_rgba(234,88,12,0.15)]'
                                  : 'bg-orange-950/10 border-orange-400/15 hover:border-orange-400/35 hover:bg-orange-950/20'
                              }`}
                            >
                              <div
                                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                                  isSelected
                                    ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/30'
                                    : 'bg-white/10 text-zinc-400'
                                }`}
                              >
                                <Icon className="w-4 h-4" />
                              </div>
                              <div className="flex-1">
                                <div className="text-xs sm:text-sm font-semibold text-white">
                                  {idea.title}
                                </div>
                                <div className="text-[11px] text-zinc-400 mt-0.5 leading-snug">
                                  {idea.desc}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Custom Note / Pitch */}
                    <div>
                      <label className="block text-xs font-medium text-orange-200 mb-1.5">
                        A sweet message or your favorite little thing in life:
                      </label>
                      <textarea
                        rows={3}
                        value={customPitch}
                        onChange={(e) => setCustomPitch(e.target.value)}
                        placeholder="Tell me a book you loved, a hot take, or something that made you smile today..."
                        className="w-full px-4 py-3 rounded-xl bg-orange-950/20 border border-orange-400/20 text-white text-sm placeholder:text-zinc-500 focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-500/40 resize-none backdrop-blur-sm"
                      />
                    </div>
                  </div>

                  {/* Sticky Anchored Submit Footer */}
                  <div className="pt-3 border-t border-orange-400/20 bg-transparent shrink-0">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:via-amber-600 hover:to-orange-700 text-white font-bold text-sm shadow-lg shadow-orange-500/30 transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Transmitting Proposal...</span>
                        </>
                      ) : (
                        <>
                          <Heart className="w-4 h-4 fill-white" />
                          <span>Send My Proposal</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
