/* eslint-disable */
// Delivered by Originkit · stack: nextjs · styling: tailwind
"use client";

import { Backdrop, DotField } from "@/components/originkit/ui/hero-34/backdrop";
import { LineField } from "@/components/originkit/ui/hero-34/line-field";
import { Navbar } from "@/components/originkit/ui/hero-34/navbar";

function asset(file: string) {
  return `/originkit/hero-34/${file}`;
}

/**
 * Figma frames:
 * - Mobile  2410:6613 — 402 x 874
 * - iPad    2410:6684 — 744 x 1068  (`ipad:`)
 * - Desktop 2410:6747 — 1440 x 868  (`desktop-sm:`)
 *
 * One centred column — badge, headline, sub, two buttons — over a fan of amber
 * lines sweeping up from the bottom edge, with two shafts of light raking in
 * from the top corners.
 *
 * The fan is a backdrop layer rather than a block in the column, because Figma
 * runs it behind the copy at every frame — a 1440x920 plate over the whole
 * desktop frame, an 897x573 one hanging off both edges of the phone. It is
 * anchored to the bottom so a taller viewport opens sky above the copy instead
 * of pushing the crest off the fold.
 *
 * Height follows the house floor rule. `<main>` takes `min-h-dvh` so the rakes
 * and the dot field reach the bottom of any screen, and the band under it takes
 * the surplus rather than stopping at the frame: Figma's height — the frame less
 * the nav above it (60 / 64 / 80), so 814 / 1004 / 788 — is where a frame-sized
 * window lands, not a ceiling. The fan is the section's floor and has to reach
 * the bottom edge; held at 788 it left a quarter-screen of bare page under the
 * crest on an ordinary laptop.
 *
 * The column hangs off the nav rather than the band centre: Figma's gap under
 * the bar is 281 / 163 / 56, written as `mt`, and the row is `flex justify-center`
 * so the stack is centred horizontally without `items-center` on a column.
 *
 * From `desktop-sm` up both rows — the bar and the copy — sit on the shared 1142
 * `SHELL` below, so they hold one measure while the backdrop stays full-bleed.
 */

/**
 * Desktop content shell. Figma insets the desktop rows by 54px on a 1440 frame,
 * which is 1332 of content and keeps widening past it; from `desktop-sm` up the
 * rows take a 1142 measure and centre in whatever is left. The inset is the
 * shell's from that breakpoint on, so the frames' own 16 / 48 padding is zeroed
 * rather than added to the gutter the cap already opens — at 1280, the narrowest
 * width this applies to, the cap alone leaves 69px a side.
 *
 * Only the rows take it. The fan, the rakes and the dot field stay full-bleed
 * behind them: they are atmosphere sized from the section, and capping them
 * would pull the crest in from the screen edges the composition sweeps out to.
 */
const SHELL = "mx-auto desktop-sm:max-w-[1142px] desktop-sm:px-0";

/** Both buttons share their box; only the fill and the trailing chip differ. */
const BUTTON =
  "inline-flex h-[48px] shrink-0 cursor-pointer touch-manipulation items-center justify-center font-manrope text-[14px] leading-[1.5] font-semibold tracking-[-0.03em] whitespace-nowrap text-white transition-[opacity,transform] duration-200 ease-out [-webkit-tap-highlight-color:transparent] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-[0.97] motion-reduce:active:scale-100 hover:opacity-90";

export const SectionHero = () => (
  <main className="animate-hero-reveal relative isolate flex min-h-dvh w-full flex-col overflow-hidden bg-[#020202]">
    {/* The fan hangs off both edges — Figma's plate is 2.2x the phone frame's
        width — so it is sized from the section rather than capped with it.

        Height comes from `inset-y-0`, not `h-full`. The section sets only a
        `min-height`, so its used height is `auto` as far as percentage
        resolution goes and `h-full` collapses the box to zero — which takes the
        canvas with it and leaves the fan invisible. */}
    <Backdrop />
    <DotField />

    <Navbar className={SHELL} />

    {/* The fan and the copy are one band, because they are composed against each
        other — the headline sits just above the crest. Sized separately they
        come apart: on a 4K screen at 100% the column stops at its floor near the
        top while the fan, taking the whole viewport, drops its crest a thousand
        pixels below it.

        The band sits directly under the nav — not `mt-auto` — so the copy's
        `mt` (281 / 163 / 56) is the gap under the bar Figma draws, rather than
        that gap plus whatever surplus a tall viewport opens above a
        bottom-pinned band. The surplus goes below the copy instead, into the fan.

        `flex-1` rather than a stated height, because the height is a floor. On a
        frame-sized window `<main>`'s `min-h-dvh` less the nav is exactly Figma's
        814 / 1004 / 788, so the design's number is what the band gets; on a taller
        one it takes the surplus instead of leaving it to the page. Stated as a
        height it stopped at 788 and a 1114px-tall window showed a quarter screen
        of bare black under the crest — the fan is the section's floor, so it has
        to reach the bottom edge. It follows the band through `inset-y-0` and
        stretches with it, which walks the crest a little further below the copy
        on a tall screen; the fan ending mid-page reads far worse than the drift.

        No `min-height` to go with it: a flex item's is already `auto`, so the band
        cannot be shorter than the copy column. A window shorter than the frame
        overflows through `<main>` rather than cropping the stack.

        The fan carries `-z-10`. Its canvas is opaque and none of these layers
        set a z-index — they stacked by source order, with the fan first. Inside
        the band it now comes last and would paint over the rakes and dots it is
        supposed to sit under. Stating the layer beats relying on tag order. */}
    <div className="relative w-full flex-1">
      <LineField className="-z-10 inset-x-[-60%] inset-y-0 ipad:inset-x-[-20%] desktop-sm:inset-x-0" />

      <div
        className={`relative z-10 mt-[218px] flex justify-center px-[24px] ipad:mt-[163px] ipad:px-[48px] desktop-sm:mt-[56px] ${SHELL}`}
      >
        <div className="flex flex-col">
          <p className="relative inline-flex shrink-0 items-center gap-[6px] self-center rounded-[100px] border border-solid border-[#4d3819] bg-[rgba(133,93,32,0.1)] py-[6px] pr-[14px] pl-[8px] font-manrope text-[14px] leading-[1.5] text-white/80 capitalize shadow-[inset_0px_0px_4px_0px_rgba(59,43,19,0.4)] backdrop-blur-[10px]">
            <img
              src={asset("icon-ai.svg")}
              alt=""
              aria-hidden
              className="block size-[18px] max-w-none"
            />
            AI Workflow Intelligence
          </p>

          {/*
        Tracking is Figma's -1.44 / -2.56px at 36 and 64px, which is -0.04em at
        both — one ratio rather than two numbers that only agree by accident.
        The break after "for" is the column width doing it at every frame.
      */}
          <h1 className="mx-auto mt-[16px] max-w-[356px] text-center font-instrument-serif text-[36px] leading-[1.12] tracking-[-0.04em] text-white ipad:mt-[24px] ipad:max-w-[560px] ipad:text-[52px] desktop-sm:max-w-[671px] desktop-sm:text-[64px]">
            The Operating System for Autonomous Work.
          </h1>

          <p className="mx-auto mt-[16px] max-w-[253px] text-center font-manrope text-[12px] leading-[1.5] text-white capitalize ipad:mt-[20px] ipad:max-w-[471px] ipad:text-[16px]">
            Connect your apps, orchestrate intelligent agents, and automate
            complex operations with enterprise-grade reliability
          </p>

          <div className="mt-[28px] flex items-center justify-center gap-[20px] self-center ipad:mt-[36px]">
            <button
              type="button"
              className={`gap-[8px] rounded-[10px] bg-[#d78715] px-[18px] ${BUTTON}`}
            >
              Start Building
              {/*
            The trailing chip is a white plate with its own bevel — a top sheen
            and a dark bottom rim inside a three-layer drop shadow. The rim sits
            on an overlay span so it rides above the gradient, not under it.
          */}
              <span
                aria-hidden
                className="relative flex size-[28px] shrink-0 items-center justify-center rounded-[7px] bg-white shadow-[0px_5px_5px_0px_rgba(0,0,0,0.2),0px_3px_3px_0px_rgba(0,0,0,0.3),0px_1px_1px_0px_rgba(0,0,0,0.5)]"
              >
                <span className="absolute inset-0 rounded-[7px] bg-linear-to-b from-white/30 to-black/20" />
                <img
                  src={asset("icon-arrow.svg")}
                  alt=""
                  className="relative block size-6 max-w-none"
                />
                <span className="absolute inset-0 rounded-[inherit] shadow-[inset_0px_3px_3px_0px_rgba(255,255,255,0.25),inset_0px_1px_1px_0px_rgba(255,255,255,0.5)]" />
              </span>
            </button>

            <button
              type="button"
              className={`rounded-[16px] bg-[#27231e] px-[24px] shadow-[inset_0px_1px_0px_0px_rgba(255,255,255,0.2)] ${BUTTON}`}
            >
              Book a Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>
);
