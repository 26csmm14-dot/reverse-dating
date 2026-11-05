/* eslint-disable */
// Delivered by Originkit · stack: nextjs · styling: tailwind
"use client";

import InteractiveLines from "@/components/originkit/ui/hero-34/reactive-lines";

/**
 * The amber line field — Figma `image 3083583` (2410:6622 / 6776), live rather
 * than the flattened render it bakes.
 *
 * Figma places it as a 1440x920 plate over the whole desktop frame on
 * `mix-blend-screen`, and as an 897x573 plate hanging off both edges of the
 * phone one. Both are the same thing: the fan sweeps up from the bottom and its
 * crest is what the copy sits above. The component draws itself into an opaque
 * canvas, so the page colour goes in as `backgroundColor` rather than the plate
 * being screened over it — same result, one layer fewer.
 *
 * `fade` is on because Figma's plate darkens toward its corners, which is the
 * component's own radial falloff rather than a separate wash.
 *
 * Mobile (2410:6622) paints the plate at 30% — the fan is atmosphere behind the
 * copy rather than a lit crest. Tablet and desktop drop that dim and run full
 * strength, so the opacity is gated off at `ipad:` rather than scaled.
 */
export const LineField = ({ className = "" }: { className?: string }) => (
  <div
    aria-hidden
    className={`pointer-events-none absolute opacity-30 ipad:opacity-100 ${className}`}
  >
    <InteractiveLines
      backgroundColor="#020202"
      lineColor="#D78715"
      lineWidth={3.5}
      minLines={80}
      maxLines={37}
      fade
      transparent
      fadeIntensity={25}
    />
  </div>
);
