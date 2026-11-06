'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Heart,
  User,
  Phone,
  Instagram,
  MessageCircle,
  Twitter,
  Send,
  Mail,
  Camera,
  Sparkles,
  ArrowRight,
  Loader2,
  ShieldAlert,
  Check,
  Link as LinkIcon,
  UploadCloud,
  X,
  Image as ImageIcon,
} from 'lucide-react';
import GlimmerVale from '@/components/originkit/ui/glimmer-vale';
import { validateCredentials } from '@/lib/validation';

const CONTACT_CHANNELS = [
  { id: 'phone', label: 'Phone', icon: Phone, placeholder: 'Your digits so I can hear your voice' },
  { id: 'instagram', label: 'Instagram', icon: Instagram, placeholder: 'Your IG handle so I can slide into your DMs' },
  { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle, placeholder: 'WhatsApp number for late-night chats' },
  { id: 'twitter', label: 'Twitter / X', icon: Twitter, placeholder: 'Your @handle so I can like your tweets' },
  { id: 'telegram', label: 'Telegram', icon: Send, placeholder: 'Your @telegram for sweet secret messages' },
  { id: 'email', label: 'Email', icon: Mail, placeholder: 'Your email for modern love letters' },
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
  { code: 'ES', name: 'Spain', dial: '+34', placeholder: '612 345 678' },
  { code: 'IT', name: 'Italy', dial: '+39', placeholder: '312 3456789' },
];

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    contactType: 'instagram',
    contact: '',
    photo: '',
    expectations: '',
  });

  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [photoPreview, setPhotoPreview] = useState('');
  const [isSkipped, setIsSkipped] = useState(false);
  const [isExpectationsSkipped, setIsExpectationsSkipped] = useState(false);
  const [useUrlMode, setUseUrlMode] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const currentChannel = CONTACT_CHANNELS.find((c) => c.id === formData.contactType) || CONTACT_CHANNELS[1];
  const ChannelIcon = currentChannel.icon;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleNameChange = (e) => {
    // Only letters, spaces, hyphens, and apostrophes allowed
    const val = e.target.value.replace(/[^a-zA-Z\s'.-]/g, '');
    setFormData((prev) => ({ ...prev, name: val }));
    if (error) setError('');
  };

  const handlePhoneChange = (e) => {
    // Only digits allowed
    let digits = e.target.value.replace(/\D/g, '');
    if (selectedCountry.code === 'IN' || selectedCountry.code === 'US' || selectedCountry.code === 'CA') {
      if (digits.length > 10) digits = digits.slice(0, 10);
    } else if (digits.length > 15) {
      digits = digits.slice(0, 15);
    }
    setPhoneNumber(digits);
    setFormData((prev) => ({
      ...prev,
      contact: digits ? `${selectedCountry.dial} ${digits}` : '',
    }));
    if (error) setError('');
  };

  const handleContactChange = (e) => {
    let val = e.target.value.trim();
    if (formData.contactType === 'instagram') {
      // Letters, numbers, dots, and underscores only; strip leading @
      val = val.replace(/^@+/, '').replace(/[^a-zA-Z0-9._]/g, '').slice(0, 30);
    } else if (formData.contactType === 'twitter') {
      // Letters, numbers, and underscores only; strip leading @; max 15 chars
      val = val.replace(/^@+/, '').replace(/[^a-zA-Z0-9_]/g, '').slice(0, 15);
    } else if (formData.contactType === 'telegram') {
      // Alphanumeric and underscores; strip leading @; max 32 chars
      val = val.replace(/^@+/, '').replace(/[^a-zA-Z0-9_]/g, '').slice(0, 32);
    } else if (formData.contactType === 'email') {
      val = val.toLowerCase().replace(/\s/g, '');
    }
    setFormData((prev) => ({ ...prev, contact: val }));
    if (error) setError('');
  };

  const isNumberChannel = (typeId) => typeId === 'phone' || typeId === 'whatsapp';

  const handleChannelSelect = (typeId) => {
    setFormData((prev) => {
      let updatedContact = prev.contact;
      if (isNumberChannel(typeId)) {
        updatedContact = phoneNumber ? `${selectedCountry.dial} ${phoneNumber.trim()}` : '';
      } else if (isNumberChannel(prev.contactType)) {
        updatedContact = '';
      }
      return { ...prev, contactType: typeId, contact: updatedContact };
    });
    if (error) setError('');
  };

  // Image Upload Handling (auto-resizes and optimizes for instant transmission)
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file (PNG, JPG, WebP).');
      return;
    }

    try {
      // Create reader & compress to optimal avatar dimensions (max 1000px, 85% JPEG)
      const dataUrl = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.onload = () => {
            let width = img.width;
            let height = img.height;
            const maxDim = 1000;
            if (width > maxDim || height > maxDim) {
              if (width > height) {
                height = Math.round((height * maxDim) / width);
                width = maxDim;
              } else {
                width = Math.round((width * maxDim) / height);
                height = maxDim;
              }
            }
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', 0.85));
          };
          img.onerror = () => resolve(event.target.result);
          img.src = event.target.result;
        };
        reader.onerror = () => resolve('');
        reader.readAsDataURL(file);
      });

      if (dataUrl) {
        setPhotoPreview(dataUrl);
        setIsSkipped(false);
        setFormData((prev) => ({ ...prev, photo: dataUrl }));
        setError('');
      }
    } catch (err) {
      console.warn('Image processing fallback:', err);
    }
  };

  const handleSkipPhoto = () => {
    setIsSkipped(true);
    setPhotoPreview('');
    setUrlInput('');
    setFormData((prev) => ({ ...prev, photo: 'default-avatar' }));
  };

  const handleClearPhoto = () => {
    setIsSkipped(false);
    setPhotoPreview('');
    setUrlInput('');
    setFormData((prev) => ({ ...prev, photo: '' }));
  };

  const handleUrlSubmit = (e) => {
    const val = e.target.value;
    setUrlInput(val);
    if (val.trim()) {
      setPhotoPreview(val.trim());
      setIsSkipped(false);
      setFormData((prev) => ({ ...prev, photo: val.trim() }));
    }
  };

  const handleSkipExpectations = () => {
    setIsExpectationsSkipped(true);
    setFormData((prev) => ({ ...prev, expectations: 'Skipped — Open to exploring the vibe organically' }));
    if (error) setError('');
  };

  const handleClearExpectationsSkip = () => {
    setIsExpectationsSkipped(false);
    setFormData((prev) => ({ ...prev, expectations: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalExpectations = isExpectationsSkipped
      ? 'Skipped — Open to exploring the vibe organically'
      : formData.expectations.trim();

    // Strict credential format validation
    const validation = validateCredentials({
      name: formData.name,
      contactType: formData.contactType,
      contact: formData.contact,
      expectations: finalExpectations,
      countryCode: selectedCountry.code,
    });

    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        name: formData.name.trim(),
        contactType: formData.contactType,
        contact: formData.contact.trim(),
        photo: isSkipped || !formData.photo ? 'default-avatar' : formData.photo,
        expectations: finalExpectations,
        countryCode: selectedCountry.code,
      };

      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to authenticate');
      }

      if (typeof window !== 'undefined' && data.applicant?.id) {
        localStorage.setItem('applicant_id', data.applicant.id);
        localStorage.setItem('applicant_status', data.applicant.status || 'viewing');
      }

      const { status } = data.applicant;
      if (status === 'accepted') {
        router.push('/status/accepted');
      } else if (status === 'rejected') {
        router.push('/status/404-rejected');
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center py-10 px-4">
      {/* ── Originkit Glimmer Vale Background ── */}
      <div className="fixed inset-0 -z-10 w-full h-full overflow-hidden pointer-events-auto">
        <GlimmerVale
          speed={45}
          sparkle={75}
          density={68}
          skyTop="#1f2347"
          skyHorizon="#4f4874"
          advanced={{ hover: 120, sway: 75, bob: 10 }}
          style={{ minWidth: '100%', minHeight: '100%', width: '100%', height: '100%' }}
        />
        {/* Soft liquid ambient overlay with vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/60 pointer-events-none" />
      </div>

      {/* ── Liquid Aesthetic Login Card ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-lg relative rounded-[32px] p-8 sm:p-10 border border-white/20 shadow-[0_20px_60px_-15px_rgba(236,72,153,0.3)] bg-black/40 backdrop-blur-2xl overflow-hidden before:absolute before:inset-0 before:rounded-[32px] before:p-[1px] before:bg-gradient-to-b before:from-white/30 before:via-pink-500/20 before:to-purple-500/30 before:-z-10"
      >
        {/* Liquid Prismatic Ambient Reflections */}
        <div className="absolute -top-24 -left-24 w-56 h-56 rounded-full bg-pink-500/20 blur-3xl pointer-events-none animate-pulse-slow" />
        <div className="absolute -bottom-24 -right-24 w-56 h-56 rounded-full bg-purple-500/25 blur-3xl pointer-events-none animate-pulse-slow" />

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5 backdrop-blur-md"
          >
            <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 relative">
          {/* May I know your sweet name? */}
          <div>
            <label className="block text-xs font-semibold tracking-wide text-pink-200/90 mb-1.5">
              May I know your sweet name? <span className="text-pink-400">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-pink-300/70 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleNameChange}
                placeholder="Tell me what to call you, cutie"
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/[0.05] border border-white/10 text-white text-sm placeholder:text-zinc-500 focus:outline-none focus:border-pink-400/80 focus:ring-2 focus:ring-pink-500/20 backdrop-blur-md transition-all"
              />
            </div>
          </div>

          {/* How can we be in touch? */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold tracking-wide text-pink-200/90">
                How can we be in touch? <span className="text-pink-400">*</span>
              </label>
              <span className="text-[11px] text-pink-300 font-medium">
                {currentChannel.label}
              </span>
            </div>

            {/* Small & Simple Channel Logos Row */}
            <div className="flex items-center gap-1.5 mb-2.5">
              {CONTACT_CHANNELS.map((ch) => {
                const Icon = ch.icon;
                const active = formData.contactType === ch.id;
                return (
                  <button
                    key={ch.id}
                    type="button"
                    title={ch.label}
                    onClick={() => handleChannelSelect(ch.id)}
                    className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                      active
                        ? 'bg-pink-500/20 border border-pink-400 text-pink-300 shadow-sm shadow-pink-500/30 scale-105'
                        : 'bg-white/[0.04] border border-white/10 text-zinc-400 hover:text-white hover:bg-white/[0.08]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </button>
                );
              })}
            </div>

            {/* Input with Channel Icon OR Small Country Dropdown for Phone & WhatsApp */}
            {isNumberChannel(formData.contactType) ? (
              <div className="flex rounded-2xl bg-white/[0.05] border border-white/10 focus-within:border-pink-400/80 focus-within:ring-2 focus-within:ring-pink-500/20 backdrop-blur-md overflow-hidden transition-all">
                {/* Small Country Selector Dropdown */}
                <select
                  value={selectedCountry.code}
                  onChange={(e) => {
                    const country = COUNTRIES.find((c) => c.code === e.target.value) || COUNTRIES[0];
                    setSelectedCountry(country);
                    setFormData((prev) => ({
                      ...prev,
                      contact: phoneNumber ? `${country.dial} ${phoneNumber.trim()}` : '',
                    }));
                  }}
                  className="px-2 py-2.5 bg-white/[0.06] border-r border-white/10 text-white text-[11px] font-mono focus:outline-none cursor-pointer shrink-0 max-w-[85px]"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code} className="bg-zinc-900 text-white py-1">
                      {c.code} {c.dial}
                    </option>
                  ))}
                </select>

                {/* Mobile / WhatsApp Number Input */}
                <div className="relative flex-1">
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    placeholder={
                      formData.contactType === 'whatsapp'
                        ? `WhatsApp (${selectedCountry.placeholder})`
                        : selectedCountry.placeholder
                    }
                    className="w-full px-3.5 py-3 bg-transparent text-white text-sm placeholder:text-zinc-500 focus:outline-none"
                  />
                </div>
              </div>
            ) : (
              <div className="relative">
                <ChannelIcon className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="contact"
                  required
                  value={formData.contact}
                  onChange={handleContactChange}
                  placeholder={currentChannel.placeholder}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/[0.05] border border-white/10 text-white text-sm placeholder:text-zinc-500 focus:outline-none focus:border-pink-400/80 focus:ring-2 focus:ring-pink-500/20 backdrop-blur-md transition-all"
                />
              </div>
            )}

            {/* Dynamic Format Hint */}
            <p className="text-[10px] text-zinc-400/90 mt-1.5 pl-1">
              {isNumberChannel(formData.contactType)
                ? selectedCountry.code === 'IN'
                  ? 'Real 10-digit number so my messages reach only you (starting with 6-9)'
                  : 'Real 7-15 digits so I do not accidentally text the wrong person'
                : formData.contactType === 'instagram'
                ? 'Your actual handle without @ so I can follow your stories'
                : formData.contactType === 'twitter'
                ? 'Your real Twitter handle without @ so I can heart your tweets'
                : formData.contactType === 'email'
                ? 'Your real email so my love notes do not bounce'
                : 'Your Telegram username or phone so we can text safely'}
            </p>
          </div>

          {/* ── Photo Upload Box OR Skip Option ── */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold tracking-wide text-pink-200/90 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-pink-400" />
                <span>A photo of your lovely face?</span>
              </label>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setUseUrlMode(!useUrlMode)}
                  className="text-[11px] text-zinc-400 hover:text-pink-300 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <LinkIcon className="w-3 h-3" />
                  <span>{useUrlMode ? 'Upload File' : 'Paste Link'}</span>
                </button>

                {!isSkipped && (
                  <button
                    type="button"
                    onClick={handleSkipPhoto}
                    className="text-[11px] text-pink-400 hover:text-pink-300 bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/20 px-2.5 py-0.5 rounded-full transition-all cursor-pointer font-medium"
                  >
                    Skip
                  </button>
                )}
              </div>
            </div>

            {/* Case A: Photo is Skipped */}
            {isSkipped ? (
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-500/20 to-pink-500/20 border border-white/10 flex items-center justify-center text-zinc-300">
                    <User className="w-5 h-5 text-pink-300" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">Photo Skipped</p>
                    <p className="text-[10px] text-zinc-400">Too shy? Your charm already speaks for itself</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleClearPhoto}
                  className="text-xs text-pink-400 hover:text-pink-300 font-semibold px-3 py-1.5 rounded-xl bg-pink-500/10 border border-pink-500/20 hover:bg-pink-500/20 transition-all cursor-pointer"
                >
                  Upload Instead
                </button>
              </div>
            ) : photoPreview ? (
              /* Case B: Photo is Uploaded / Selected */
              <div className="p-3 rounded-2xl bg-white/[0.04] border border-pink-500/30 flex items-center justify-between backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden border border-pink-400/50 shadow-md shadow-pink-500/20 shrink-0">
                    <img src={photoPreview} alt="Attached Preview" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-400" /> Looking gorgeous!
                    </p>
                    <p className="text-[10px] text-zinc-400">Ready to steal my heart</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <label className="text-xs font-medium text-zinc-300 hover:text-white px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 transition-all cursor-pointer">
                    Change
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                  <button
                    type="button"
                    onClick={handleClearPhoto}
                    className="p-1.5 rounded-xl text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Remove"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : useUrlMode ? (
              /* Case C: Paste URL Mode */
              <div className="relative">
                <Camera className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  placeholder="Paste a direct image link (e.g. https://.../photo.jpg)"
                  value={urlInput}
                  onChange={handleUrlSubmit}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/[0.05] border border-white/10 text-white text-xs placeholder:text-zinc-500 focus:outline-none focus:border-pink-400 backdrop-blur-md transition-colors"
                />
              </div>
            ) : (
              /* Case D: Standard Upload Box */
              <label className="relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-dashed border-white/15 hover:border-pink-400/60 bg-white/[0.02] hover:bg-white/[0.05] transition-all cursor-pointer group backdrop-blur-md">
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform shadow-sm">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <p className="text-xs font-medium text-white group-hover:text-pink-300 transition-colors">
                  Upload a picture of you
                </p>
                <p className="text-[10px] text-zinc-400/80 mt-0.5">JPG, PNG, WEBP up to 5MB</p>
              </label>
            )}
          </div>

          {/* What Are You Expecting From Me (Date / Relationship) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold tracking-wide text-pink-200/90">
                What are you expecting from me? {!isExpectationsSkipped && <span className="text-pink-400">*</span>}
              </label>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-pink-300/90 font-medium hidden sm:inline">Dates and connection</span>
                {!isExpectationsSkipped && (
                  <button
                    type="button"
                    onClick={handleSkipExpectations}
                    className="text-[11px] text-pink-400 hover:text-pink-300 bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/20 px-2.5 py-0.5 rounded-full transition-all cursor-pointer font-medium"
                  >
                    Skip
                  </button>
                )}
              </div>
            </div>

            {isExpectationsSkipped ? (
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center text-pink-300">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">Expectations Skipped</p>
                    <p className="text-[10px] text-zinc-400">Letting destiny and pure chemistry work their magic</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleClearExpectationsSkip}
                  className="text-xs text-pink-400 hover:text-pink-300 font-semibold px-3 py-1.5 rounded-xl bg-pink-500/10 border border-pink-500/20 hover:bg-pink-500/20 transition-all cursor-pointer"
                >
                  Write Instead
                </button>
              </div>
            ) : (
              <>
                <textarea
                  name="expectations"
                  required={!isExpectationsSkipped}
                  rows={3}
                  value={formData.expectations}
                  onChange={handleChange}
                  placeholder="Tell me your ideal first date, how you like to be pampered, your communication vibe, or what makes your heart flutter..."
                  className="w-full px-4 py-3 rounded-2xl bg-white/[0.05] border border-white/10 text-white text-sm placeholder:text-zinc-500 focus:outline-none focus:border-pink-400/80 focus:ring-2 focus:ring-pink-500/20 backdrop-blur-md transition-all resize-none"
                />
                <div className="flex justify-between items-center text-[10px] text-zinc-400/80 mt-1 pl-1">
                  <span>Promise I will read every single word carefully.</span>
                  <span>{formData.expectations.length}/1000</span>
                </div>
              </>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl font-semibold text-white bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 active:scale-[0.99] shadow-[0_0_25px_rgba(236,72,153,0.35)] flex items-center justify-center gap-2 text-sm disabled:opacity-60 transition-all cursor-pointer border border-white/20 mt-6"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Checking if destiny agrees...</span>
              </>
            ) : (
              <>
                <span>WANNA DATE U</span>
                <Heart className="w-4 h-4 fill-white" />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
