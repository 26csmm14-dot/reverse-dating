'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart, User, ShieldCheck, LogOut, Sparkles } from 'lucide-react';
import ProfileModal from './ProfileModal';

export default function Navbar() {
  const pathname = usePathname();
  const [applicant, setApplicant] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const loadSession = async () => {
    try {
      const res = await fetch('/api/auth');
      const data = await res.json();
      if (data.authenticated && data.applicant) {
        setApplicant(data.applicant);
      } else {
        setApplicant(null);
      }
    } catch (err) {
      console.error('Navbar session check error:', err);
    }
  };

  useEffect(() => {
    loadSession();
    if (typeof window !== 'undefined' && window.location.search.includes('profile=true')) {
      setIsProfileOpen(true);
    }
  }, [pathname]);

  const handleProfileUpdated = (updated) => {
    setApplicant(updated);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-cardBorder">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-500 via-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg shadow-orange-500/25 group-hover:scale-105 transition-transform">
              <Heart className="w-5 h-5 text-white fill-white/20" />
            </div>
            <div>
              <span className="font-extrabold tracking-tight text-base bg-gradient-to-r from-orange-400 via-amber-300 to-orange-400 bg-clip-text text-transparent">
                WANNA DATE U
              </span>
            </div>
          </Link>

          {/* Top Corner User Login / Profile Pill */}
          {pathname !== '/login' && (
            <div className="flex items-center">
              {applicant ? (
                <button
                  type="button"
                  onClick={() => setIsProfileOpen(true)}
                  title="View / Edit Profile"
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-xs font-medium text-orange-200 transition-all cursor-pointer shadow-sm hover:border-orange-400/60"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white shrink-0 shadow-sm shadow-orange-500/30">
                    <User className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="max-w-[110px] sm:max-w-[150px] truncate font-sans text-xs font-semibold text-orange-100">
                    {applicant.name}
                  </span>
                </button>
              ) : (
                <Link
                  href="/login"
                  title="Log In / Introduce Yourself"
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-xs font-medium text-orange-200 transition-all cursor-pointer shadow-sm hover:border-orange-400/60"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white shrink-0 shadow-sm shadow-orange-500/30">
                    <User className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="font-sans text-xs font-semibold text-orange-100">
                    Log In
                  </span>
                </Link>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Profile Management Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        applicant={applicant}
        onProfileUpdated={handleProfileUpdated}
      />
    </>
  );
}
