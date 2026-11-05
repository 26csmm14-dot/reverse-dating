/* eslint-disable */
// Delivered by Originkit · stack: nextjs · styling: tailwind
"use client";

function asset(file: string) {
  return `/originkit/hero-34/${file}`;
}

/**
 * Top nav — Figma 2410:6676 (mobile), 2410:6668 (tablet), 2410:6802 (desktop).
 *
 * Logo against a hamburger below 1280; above it the full row — six links, two of
 * them carrying a caret, then Log in and Sign up. The bar is 60 / 64 / 80 tall
 * and its content is inset 16 / 48 below `desktop-sm`. From there up the inset is
 * the caller's: the hero passes its content shell in, so the bar and the copy
 * column share one measure rather than each carrying its own desktop padding.
 *
 * Sign up carries Figma's top eclipse (2410:6832) — a blurred white ellipse
 * parked above the lip and clipped by the button, so only the lower half of the
 * glow reads inside the amber fill.
 */

/** Two of the six open a menu, so they carry Figma's caret (2410:6813/6818). */
const NAV_LINKS = [
  { label: "Platform", caret: false },
  { label: "Products", caret: true },
  { label: "Resources", caret: true },
  { label: "Pricing", caret: false },
  { label: "FAQ", caret: false },
  { label: "Contact Us", caret: false },
];

/** Shared pressable / focus stack — the house Button contract on a dark bar. */
const CONTROL =
  "cursor-pointer touch-manipulation [-webkit-tap-highlight-color:transparent] transition-[opacity,transform] duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-[0.97] motion-reduce:active:scale-100 hover:opacity-80";

/**
 * Figma Ellipse 2059 — white disc at 50% under an 8px blur, hung at top:-16 so
 * overflow clips it into the top-edge highlight. The inset percentages are the
 * filter's own bleed (stdDeviation 8 on a 28px box).
 */
const SignUpEclipse = () => (
  <span
    aria-hidden
    className="pointer-events-none absolute top-[-16px] right-px left-px h-[28px]"
  >
    <img
      src={asset("button-eclipse.svg")}
      alt=""
      className="absolute inset-[-57.14%_-19.05%] block size-full max-w-none"
    />
  </span>
);

export const Navbar = ({ className = "" }: { className?: string }) => (
  <nav
    aria-label="Primary"
    className={`relative z-20 flex h-[60px] w-full shrink-0 items-center justify-between px-[16px] ipad:h-[64px] ipad:px-[48px] desktop-sm:h-[80px] ${className}`}
  >
    <a
      href="#"
      aria-label="Ozone home"
      className={`flex shrink-0 items-center gap-[12px] ${CONTROL}`}
    >
      <img
        src={asset("logo-mark.svg")}
        alt=""
        aria-hidden
        className="block size-7 max-w-none ipad:size-8"
      />
      <span className="font-sans text-[20px] leading-[normal] font-bold tracking-[-0.01em] text-white">
        OZONE
      </span>
    </a>

    <ul className="hidden items-center gap-[36px] desktop-sm:flex">
      {NAV_LINKS.map(({ label, caret }) => (
        <li key={label}>
          <a
            href="#"
            className={`relative flex items-center gap-[4px] font-outfit text-[16px] leading-[1.5] tracking-[-0.02em] whitespace-nowrap text-white ${CONTROL}`}
          >
            {/* The target grows off an absolute inset — `min-h-11` in flow would
                take the 80px bar to 88 and push the badge down with it. */}
            <span aria-hidden className="absolute inset-x-0 -inset-y-3" />
            {label}
            {caret && (
              <img
                src={asset("icon-caret.svg")}
                alt=""
                aria-hidden
                className="block size-5 max-w-none"
              />
            )}
          </a>
        </li>
      ))}
    </ul>

    <div className="hidden shrink-0 items-center gap-[16px] desktop-sm:flex">
      <button
        type="button"
        className={`inline-flex h-[40px] items-center rounded-[16px] bg-[#27231e] px-[24px] py-[6px] font-outfit text-[16px] leading-[1.5] font-medium tracking-[-0.02em] whitespace-nowrap text-[#b0b0b0] shadow-[inset_0px_1px_0px_0px_rgba(255,255,255,0.2)] ${CONTROL}`}
      >
        Log in
      </button>
      <button
        type="button"
        className={`relative inline-flex h-[40px] items-center justify-center overflow-clip rounded-[10px] bg-[#d78715] px-[18px] font-outfit text-[16px] leading-[1.5] font-medium tracking-[-0.02em] whitespace-nowrap text-white ${CONTROL}`}
      >
        <SignUpEclipse />
        Sign up
      </button>
    </div>

    <button
      type="button"
      aria-label="Open menu"
      className={`relative size-6 shrink-0 ipad:size-8 desktop-sm:hidden ${CONTROL}`}
    >
      <span aria-hidden className="absolute -inset-2.5" />
      <span
        aria-hidden
        className="absolute inset-x-0 top-[6px] block h-[1.5px] bg-white"
      />
      <span
        aria-hidden
        className="absolute inset-x-0 top-1/2 block h-[1.5px] -translate-y-1/2 bg-white"
      />
      <span
        aria-hidden
        className="absolute inset-x-0 bottom-[6px] block h-[1.5px] bg-white"
      />
    </button>
  </nav>
);
