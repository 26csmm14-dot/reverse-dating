'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { validateCredentials } from '@/lib/validation';
import {
  X,
  User,
  Phone,
  Instagram,
  MessageCircle,
  Twitter,
  Send,
  Mail,
  Camera,
  Edit3,
  Trash2,
  LogOut,
  Save,
  CheckCircle2,
  Clock,
  Heart,
  XCircle,
  Loader2,
  ShieldAlert,
  UploadCloud,
  Check,
} from 'lucide-react';

const CONTACT_CHANNELS = [
  { id: 'phone', label: 'Phone Number', icon: Phone, placeholder: 'Mobile Number' },
  { id: 'instagram', label: 'Instagram', icon: Instagram, placeholder: '@your_instagram' },
  { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle, placeholder: '+1 234 567 8900' },
  { id: 'twitter', label: 'Twitter / X', icon: Twitter, placeholder: '@your_handle' },
  { id: 'telegram', label: 'Telegram', icon: Send, placeholder: '@your_telegram' },
  { id: 'email', label: 'Email Address', icon: Mail, placeholder: 'you@example.com' },
];

const COUNTRIES = [
  { code: 'IN', name: 'India', dial: '+91', placeholder: '98765 43210' },
  { code: 'US', name: 'United States', dial: '+1', placeholder: '(555) 234-5678' },
  { code: 'GB', name: 'United Kingdom', dial: '+44', placeholder: '7911 123456' },
  { code: 'CA', name: 'Canada', dial: '+1', placeholder: '(555) 234-5678' },
  { code: 'AU', name: 'Australia', dial: '+61', placeholder: '412 345 678' },
  { code: 'AE', name: 'UAE', dial: '+971', placeholder: '50 123 4567' },
  { code: 'SG', name: 'Singapore', dial: '+65', placeholder: '8123 4567' },
  { code: 'DE', name: 'Germany', dial: '+49', placeholder: '151 23456789' },
  { code: 'FR', name: 'France', dial: '+33', placeholder: '6 12 34 56 78' },
  { code: 'JP', name: 'Japan', dial: '+81', placeholder: '90 1234 5678' },
  { code: 'BR', name: 'Brazil', dial: '+55', placeholder: '11 91234-5678' },
  { code: 'ZA', name: 'South Africa', dial: '+27', placeholder: '71 123 4567' },
  { code: 'NZ', name: 'New Zealand', dial: '+64', placeholder: '21 123 4567' },
];

export default function ProfileModal({ isOpen, onClose, applicant, onProfileUpdated }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [formData, setFormData] = useState({
    name: applicant?.name || '',
    contactType: applicant?.contactType || 'instagram',
    contact: applicant?.contact || '',
    photo: applicant?.photo || 'default-avatar',
    expectations: applicant?.expectations || '',
  });

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const currentChannel = CONTACT_CHANNELS.find((c) => c.id === formData.contactType) || CONTACT_CHANNELS[1];

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setError('');
    setSuccessMsg('');
    if (!isEditing && applicant) {
      setFormData({
        name: applicant.name || '',
        contactType: applicant.contactType || 'instagram',
        contact: applicant.contact || '',
        photo: applicant.photo || 'default-avatar',
        expectations: applicant.expectations || '',
      });
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({ ...prev, photo: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const validation = validateCredentials({
      name: formData.name,
      contactType: formData.contactType,
      contact: formData.contact,
      expectations: formData.expectations,
      countryCode: selectedCountry.code,
    });

    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    setSaving(true);
    setError('');
    setSuccessMsg('');

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, countryCode: selectedCountry.code }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update profile');
      }

      setSuccessMsg('Profile updated successfully!');
      setIsEditing(false);
      if (onProfileUpdated) onProfileUpdated(data.applicant);
    } catch (err) {
      setError(err.message || 'Something went wrong while saving.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    setError('');

    try {
      await fetch('/api/profile', { method: 'DELETE' });
    } catch (err) {
      console.error('Delete request error:', err);
    } finally {
      // Clear cookie immediately across path and domain
      document.cookie = 'applicant_id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0;';
      if (typeof window !== 'undefined') {
        try {
          localStorage.clear();
          sessionStorage.clear();
        } catch (e) {}
        onClose();
        window.location.href = '/login';
      }
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch('/api/auth', { method: 'DELETE' });
    } catch (err) {
      console.error('Logout request error:', err);
    } finally {
      // Clear cookie immediately across path and domain
      document.cookie = 'applicant_id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0;';
      if (typeof window !== 'undefined') {
        try {
          localStorage.clear();
          sessionStorage.clear();
        } catch (e) {}
        onClose();
        window.location.href = '/login';
      }
    }
  };

  const renderStatusBadge = (status) => {
    switch (status) {
      case 'accepted':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Heart className="w-3.5 h-3.5" /> Matched & Accepted
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-400 border border-rose-500/30">
            <XCircle className="w-3.5 h-3.5" /> Error 404: Not Found
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Clock className="w-3.5 h-3.5" /> Under Host Review
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" /> Browsing Portfolio
          </span>
        );
    }
  };

  const photoVal = isEditing ? formData.photo : applicant?.photo;
  const isImagePhoto = photoVal && (photoVal.startsWith('data:image') || photoVal.startsWith('http'));

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-black/40 backdrop-blur-2xl border border-orange-400/30 shadow-[inset_0_1px_0_rgba(251,146,60,0.15),inset_0_-1px_0_rgba(251,146,60,0.08),0_16px_48px_rgba(0,0,0,0.6),0_0_80px_rgba(234,88,12,0.08)] relative max-h-[90vh] overflow-y-auto"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-orange-300/60 hover:text-orange-200 hover:bg-orange-500/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 p-[1px] shadow-lg shadow-orange-500/30 shrink-0 overflow-hidden">
              <div className="w-full h-full rounded-2xl bg-black/40 flex items-center justify-center overflow-hidden">
                {isImagePhoto ? (
                  <img src={photoVal} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-7 h-7 text-orange-300" />
                )}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <span>Your Match Profile</span>
              </h3>
              <p className="text-xs text-zinc-400">View and update what you shared with me</p>
            </div>
          </div>

          {/* Alerts */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {!isEditing ? (
            /* VIEW MODE */
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-orange-950/15 border border-orange-400/15 backdrop-blur-sm space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Date Status</span>
                  {renderStatusBadge(applicant?.status || 'viewing')}
                </div>

                <div className="border-t border-orange-400/10 pt-3">
                  <span className="text-xs text-orange-300 uppercase tracking-wider font-semibold block mb-1">
                    May I Know Your Sweet Name
                  </span>
                  <p className="text-sm font-medium text-white">{applicant?.name || 'Not provided'}</p>
                </div>

                <div className="border-t border-orange-400/10 pt-3">
                  <span className="text-xs text-orange-300 uppercase tracking-wider font-semibold block mb-1">
                    How Can We Be In Touch ({applicant?.contactType || 'instagram'})
                  </span>
                  <p className="text-sm font-medium text-orange-200 font-mono">{applicant?.contact || 'Not provided'}</p>
                </div>

                <div className="border-t border-orange-400/10 pt-3">
                  <span className="text-xs text-orange-300 uppercase tracking-wider font-semibold block mb-1">
                    What You're Hoping For (Dates and connection)
                  </span>
                  <p className="text-xs text-zinc-300 whitespace-pre-wrap leading-relaxed">
                    {applicant?.expectations || 'No expectations provided yet.'}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={handleEditToggle}
                  className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:via-amber-600 hover:to-orange-700 transition-all flex items-center justify-center gap-2 text-sm cursor-pointer shadow-lg shadow-orange-500/25 active:scale-[0.99]"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit My Details</span>
                </button>

                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="py-2.5 px-3 rounded-xl text-xs font-semibold text-zinc-200 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{loggingOut ? 'Logging out...' : 'Log Out'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setConfirmDelete(true)}
                    className="py-2.5 px-3 rounded-xl text-xs font-semibold text-rose-300 hover:text-rose-200 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Withdraw Data</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* EDIT MODE */
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-orange-200 mb-1">
                  May I know your sweet name? <span className="text-orange-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Tell me what to call you, cutie"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-orange-950/20 border border-orange-400/20 text-white text-sm focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-500/40 backdrop-blur-sm"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-orange-200">
                    How can we be in touch? <span className="text-orange-400">*</span>
                  </label>
                  <span className="text-[11px] text-orange-300 font-medium">{currentChannel.label}</span>
                </div>
                <div className="flex items-center gap-1.5 mb-2">
                  {CONTACT_CHANNELS.map((ch) => {
                    const Icon = ch.icon;
                    const active = formData.contactType === ch.id;
                    return (
                      <button
                        key={ch.id}
                        type="button"
                        title={ch.label}
                        onClick={() => setFormData({ ...formData, contactType: ch.id })}
                        className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                          active
                            ? 'bg-orange-500/20 border border-orange-400 text-orange-300 shadow-sm shadow-orange-500/20'
                            : 'bg-white/[0.04] border border-white/10 text-zinc-400 hover:text-white'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </button>
                    );
                  })}
                </div>
                {formData.contactType === 'phone' || formData.contactType === 'whatsapp' ? (
                  <div className="flex rounded-xl bg-orange-950/20 border border-orange-400/20 overflow-hidden focus-within:border-orange-400 backdrop-blur-sm">
                    <select
                      value={selectedCountry.code}
                      onChange={(e) => {
                        const country = COUNTRIES.find((c) => c.code === e.target.value) || COUNTRIES[0];
                        setSelectedCountry(country);
                        const stripped = formData.contact.replace(/^\+\d+\s*/, '');
                        setFormData({
                          ...formData,
                          contact: stripped ? `${country.dial} ${stripped}` : country.dial + ' ',
                        });
                      }}
                      className="px-2 py-2 bg-orange-950/40 border-r border-orange-400/20 text-white text-[11px] font-mono focus:outline-none max-w-[75px]"
                    >
                      {COUNTRIES.map((c) => (
                        <option key={c.code} value={c.code} className="bg-zinc-900 text-white">
                          {c.code} {c.dial}
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      required
                      value={formData.contact}
                      onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                      placeholder={formData.contactType === 'whatsapp' ? 'WhatsApp number' : 'Mobile number'}
                      className="w-full px-3.5 py-2.5 bg-transparent text-white text-sm focus:outline-none"
                    />
                  </div>
                ) : (
                  <input
                    type="text"
                    required
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    placeholder={currentChannel.placeholder}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-orange-950/20 border border-orange-400/20 text-white text-sm focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-500/40 backdrop-blur-sm"
                  />
                )}
              </div>

              {/* Photo Upload in Edit Mode */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Update Photo</label>
                <div className="flex items-center gap-3">
                  <label className="flex-1 py-2 px-3 rounded-xl border border-dashed border-orange-400/30 hover:border-orange-400/60 bg-orange-950/10 flex items-center justify-center gap-2 text-xs text-zinc-300 hover:text-white cursor-pointer transition-all">
                    <UploadCloud className="w-4 h-4 text-orange-400" />
                    <span>Upload New Photo</span>
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                  </label>
                  {formData.photo && formData.photo !== 'default-avatar' && (
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, photo: 'default-avatar' }))}
                      className="text-xs text-zinc-400 hover:text-rose-400 px-2 py-1 rounded-lg border border-white/10 hover:border-rose-500/30"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-orange-200 mb-1">
                  What are you expecting from me? (Dates and connection)
                </label>
                <textarea
                  rows={3}
                  value={formData.expectations}
                  onChange={(e) => setFormData({ ...formData, expectations: e.target.value })}
                  placeholder="Share what you desire from our date or relationship..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-orange-950/20 border border-orange-400/20 text-white text-sm focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-500/40 backdrop-blur-sm resize-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleEditToggle}
                  className="flex-1 py-2.5 rounded-xl text-xs font-medium text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:via-amber-600 hover:to-orange-700 transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-orange-500/30 cursor-pointer"
                >
                  {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  <span>{saving ? 'Saving...' : 'Save My Details'}</span>
                </button>
              </div>
            </form>
          )}

          {/* Delete Confirmation Modal Overlay */}
          {confirmDelete && (
            <div className="absolute inset-0 bg-black/90 backdrop-blur-xl rounded-3xl p-6 flex flex-col justify-center items-center text-center z-20 border border-orange-500/20">
              <Trash2 className="w-12 h-12 text-rose-500 mb-3" />
              <h4 className="text-lg font-bold text-white mb-2">Withdraw Application?</h4>
              <p className="text-xs text-zinc-400 mb-6 max-w-xs">
                This will permanently delete your applicant profile and expectations from the database.
              </p>
              <div className="flex gap-3 w-full max-w-xs">
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-medium text-zinc-400 bg-white/10 hover:bg-white/20 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 transition-colors flex items-center justify-center gap-1"
                >
                  {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                  <span>{deleting ? 'Deleting...' : 'Yes, Withdraw'}</span>
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
