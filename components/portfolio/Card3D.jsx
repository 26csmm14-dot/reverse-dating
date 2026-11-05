'use client';

import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion';

/**
 * Card3D
 * Cinematic 3D perspective tilt card powered by Framer Motion spring physics.
 * Features dynamic specular sheen, depth translation, and responsive glass styling.
 */
export default function Card3D({
  children,
  className = '',
  depth = 12, // Maximum tilt rotation in degrees
  glowColor = 'rgba(249, 115, 22, 0.18)',
  borderGlow = 'rgba(251, 146, 60, 0.35)',
  variant = 'solid', // 'solid' for information cards, 'glass' for pitch
  onClick,
}) {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  // Raw mouse coordinates relative to card center (-0.5 to 0.5)
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for rotation
  const springConfig = { damping: 20, stiffness: 200, mass: 0.5 };
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);

  // Map mouse coordinate to 3D rotation angles
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [depth, -depth]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-depth, depth]);

  // Specular sheen position
  const sheenX = useTransform(smoothX, [-0.5, 0.5], ['0%', '100%']);
  const sheenY = useTransform(smoothY, [-0.5, 0.5], ['0%', '100%']);
  const dynamicSheen = useMotionTemplate`radial-gradient(circle 350px at ${sheenX} ${sheenY}, ${glowColor}, transparent 80%)`;

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Normalize between -0.5 and 0.5
    const normX = mouseX / rect.width - 0.5;
    const normY = mouseY / rect.height - 0.5;

    x.set(normX);
    y.set(normY);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  const isGlass = variant === 'glass';

  return (
    <div
      style={{ perspective: 1200 }}
      className="relative w-full h-full"
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        style={{
          rotateX: depth > 0 ? rotateX : 0,
          rotateY: depth > 0 ? rotateY : 0,
          transformStyle: depth > 0 ? 'preserve-3d' : 'flat',
        }}
        whileHover={depth > 0 ? { scale: 1.02 } : undefined}
        transition={{ scale: { duration: 0.2, ease: 'easeOut' } }}
        className={`relative rounded-3xl p-6 sm:p-8 transition-colors duration-300 group ${
          isGlass
            ? 'border border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-2xl'
            : 'border border-orange-500/30 bg-gradient-to-br from-[#2a1306] via-[#1a0b04] to-[#100602] shadow-[inset_0_1px_0_rgba(251,146,60,0.25),0_12px_32px_rgba(0,0,0,0.85)] hover:border-orange-400/60'
        } ${onClick ? 'cursor-pointer' : ''} ${className}`}
      >
        {/* Dynamic Specular Sheen on Hover */}
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-3xl transition-opacity duration-500 z-0"
          style={{
            opacity: isHovered ? 1 : 0,
            background: dynamicSheen,
          }}
        />

        {/* Ambient Corner Ambient Glow */}
        <div
          className="absolute -top-20 -right-20 w-44 h-44 rounded-full blur-3xl pointer-events-none transition-opacity duration-500 z-0"
          style={{
            backgroundColor: isHovered ? borderGlow : 'transparent',
            opacity: isHovered ? 0.35 : 0,
          }}
        />

        {/* Inner Content with slight 3D translation */}
        <div
          style={{
            transform: depth > 0 && isHovered ? 'translateZ(24px)' : undefined,
            transformStyle: depth > 0 ? 'preserve-3d' : undefined,
            transition: 'transform 0.25s ease-out',
          }}
          className="relative z-10 w-full h-full"
        >
          {children}
        </div>
      </motion.div>
    </div>
  );
}
