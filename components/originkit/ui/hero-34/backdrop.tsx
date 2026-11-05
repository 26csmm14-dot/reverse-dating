/* eslint-disable */
// Delivered by Originkit · stack: nextjs · styling: tailwind
"use client";

/**
 * The light overhead and the dotted field — Figma `Elements Wrapper`
 * (2410:6748 left, 2410:6756 right) and `Union` (2410:6764).
 *
 * Each wrapper is a rake of light coming in over the top corner, and Figma
 * builds it from the same seven pieces on both sides: one big soft blob, three
 * long narrow bars, and three hairline flares. The bars are the rays and they
 * are not washes — each is a 177 x 1253 rectangle with a 1.325px `#d78715`
 * border and a fill that runs from the same amber to nothing about four fifths
 * of the way down, then blurred. The border is what gives the ray its lit edge;
 * a plain gradient bar reads as fog instead.
 *
 * The two sides are mirrored but not symmetric — Figma rotates the left set
 * -43.6/-45.9/-48.5 degrees and the right +43.6/+45.9/+48.5, each bar sitting
 * a little further out and lower than the one before, which is what fans them.
 * Their centres are stated against the frame centre rather than its left edge,
 * so the rake holds its place when the section is wider than 1440.
 *
 * The third bar in each set carries no fill at all in Figma, only the border and
 * a blur — it is the faint outer edge of the rake, and filling it closes the gap
 * that separates it from the two behind.
 */

/** Figma's amber. */
const AMBER = "#d78715";

/** Ray fills — the stop where the bar fades out is the only thing that varies. */
const fill = (stop: number) =>
  `linear-gradient(to bottom, ${AMBER} 0%, rgba(215,135,21,0) ${stop}%)`;

/**
 * Centres are offsets from the frame centre, taken from each bar's flex-centred
 * box in Figma: box left plus half its width, less 720.
 */
const RAYS = [
  // Left rake.
  {
    id: "l1",
    x: -424,
    y: 62,
    rotate: -43.56,
    blur: 15.3,
    opacity: 15,
    stop: 80,
    lit: true,
  },
  {
    id: "l2",
    x: -504,
    y: 143,
    rotate: -45.93,
    blur: 27,
    opacity: 40,
    stop: 88,
    lit: true,
  },
  {
    id: "l3",
    x: -595,
    y: 222,
    rotate: -48.45,
    blur: 15.8,
    opacity: 15,
    stop: 0,
    lit: false,
  },
  // Right rake.
  {
    id: "r1",
    x: 386,
    y: 114,
    rotate: 43.56,
    blur: 15.3,
    opacity: 15,
    stop: 80,
    lit: true,
  },
  {
    id: "r2",
    x: 467,
    y: 195,
    rotate: 45.93,
    blur: 27,
    opacity: 40,
    stop: 88,
    lit: true,
  },
  {
    id: "r3",
    x: 557,
    y: 274,
    rotate: 48.45,
    blur: 15.8,
    opacity: 15,
    stop: 0,
    lit: false,
  },
];

/**
 * The hairline flares — Figma 2410:6753/6754/6755 and their right-hand twins.
 *
 * Each is a single stroked line under a blur, not a bar: `#d78715` fading out at
 * 79.6% of its length, `stdDeviation` 12.9, drawn at 0.8 inside a wrapper set to
 * 0.5, so 0.4 all told, additive. Two are 5.3px wide and 844.4 long, the third
 * 1.32px and 632.15 — the thin one is the glint that sits between the rakes.
 *
 * They were missing entirely, and they are most of the difference in brightness:
 * without them the rakes measured about half Figma's value along the crest.
 * `x` is an offset from the frame centre, as with the rays; the right-hand set
 * carries the same -38 / +52 shift off a pure mirror that the rays do.
 */
const FLARES = [
  { id: "fl1", x: -691, y: 68, width: 5.3, length: 844.4 },
  { id: "fl2", x: -488, y: -76, width: 5.3, length: 844.4 },
  { id: "fl3", x: -552, y: 36, width: 1.32, length: 632.15 },
  { id: "fr1", x: 653, y: 120, width: 5.3, length: 844.4 },
  { id: "fr2", x: 450, y: -24, width: 5.3, length: 844.4 },
  { id: "fr3", x: 514, y: 88, width: 1.32, length: 632.15 },
];

/** Both the flares and the rays fade out at the same point along their length. */
const FLARE_FILL =
  "linear-gradient(to bottom, #d78715 0%, rgba(215,135,21,0) 79.62%)";

/**
 * The soft blob behind each rake — Figma 2410:6749 / 6757.
 *
 * A flat `#d78715` ellipse, 816.45 x 887.58, under a 132.5 sigma blur at half
 * opacity, turned -45 degrees with the rake. It is stated as the shape Figma
 * draws rather than as a radial-gradient standing in for it: a gradient fitted
 * by eye put too much of its mass in the core and left the tail short, and this
 * blob is what warms the whole corner the rays come in over, so the tail is the
 * part that matters. It blends normally — only the rays and flares are additive.
 */
const BLOBS = [
  { id: "bl", x: -1026, y: -396 },
  { id: "br", x: 989, y: -344 },
];

/**
 * The phone and tablet rake — Figma's own `Elements Wrapper` for those frames
 * (2410:6614), which is a different rig from the desktop one above rather than
 * the same rig scaled.
 *
 * Desktop hangs two rakes off the top corners at 45 degrees, each ray 177 x 1253.
 * These frames have one rake, near the middle, tilted about 27 degrees, and its
 * rays are 51 x 448 — a seventh of the area. Every number below is Figma's, read
 * off that wrapper: the ray opacities are 0.09 / 0.24 / 0.09 against desktop's
 * 0.15 / 0.40 / 0.15, the blur is 8.1 / 14.2 / 8.3 against 15.3 / 27 / 15.8, and
 * the blob is 237 x 318 at 0.30 against 816 x 888 at 0.50. Carrying the desktop
 * set down was the bug: every piece of it is anchored 400 to 1030px off centre,
 * so on a 402 frame the whole rig sits outside the viewport and the top of the
 * section was left with nothing but the tint band.
 *
 * Positions are centres, in Figma's 744 frame, scaled through `--u`. The frames
 * state one composition and the phone is a little over half its width, so the
 * rake scales with the viewport rather than holding pixels that would slide it
 * off the side. Sizes, offsets and blur radii all take the same factor, which is
 * what keeps it the same picture at 402 as at 744.
 */
const RAKE_BLOBS = [
  {
    id: "pb-r",
    x: 434.34,
    y: -24.55,
    width: 237.14,
    height: 317.534,
    rotate: 27.27,
    blur: 69.83,
    flip: false,
  },
  {
    id: "pb-l",
    x: -34.48,
    y: -29.41,
    width: 266.297,
    height: 320.586,
    rotate: 152.73,
    blur: 78.42,
    flip: true,
  },
];

const RAKE_RAYS = [
  // Right rake (2410:6614).
  {
    id: "pr1",
    x: 285.02,
    y: 200.61,
    width: 51.41,
    height: 448.431,
    rotate: 25.5,
    skew: -0.78,
    blur: 8.065,
    edge: 0.698,
    opacity: 0.09,
    stop: 80,
    lit: true,
    flip: false,
  },
  {
    id: "pr2",
    x: 314.4,
    y: 215.75,
    width: 51.404,
    height: 448.462,
    rotate: 28.42,
    skew: 0.51,
    blur: 14.245,
    edge: 0.698,
    opacity: 0.24,
    stop: 88,
    lit: true,
    flip: false,
  },
  {
    id: "pr3",
    x: 346.71,
    y: 229.32,
    width: 51.462,
    height: 448.18,
    rotate: 31.52,
    skew: 1.87,
    blur: 8.345,
    edge: 0.698,
    opacity: 0.09,
    stop: 0,
    lit: false,
    flip: false,
  },
  // Left rake (2410:6623) — mirrored on Y, so its angles read as 180 less.
  {
    id: "pl1",
    x: 119.25,
    y: 196.39,
    width: 57.725,
    height: 452.759,
    rotate: 154.32,
    skew: 0.49,
    blur: 9.057,
    edge: 0.784,
    opacity: 0.09,
    stop: 80,
    lit: true,
    flip: true,
  },
  {
    id: "pl2",
    x: 86.27,
    y: 213.39,
    width: 57.722,
    height: 452.78,
    rotate: 151.7,
    skew: -0.32,
    blur: 15.997,
    edge: 0.784,
    opacity: 0.24,
    stop: 88,
    lit: true,
    flip: true,
  },
  {
    id: "pl3",
    x: 50.1,
    y: 228.91,
    width: 57.758,
    height: 452.581,
    rotate: 148.91,
    skew: -1.18,
    blur: 9.371,
    edge: 0.784,
    opacity: 0.09,
    stop: 0,
    lit: false,
    flip: true,
  },
];

const RAKE_FLARES = [
  {
    id: "pf1",
    x: 365.18,
    y: 167.39,
    width: 2.793,
    length: 302.086,
    rotate: 27.27,
    blur: 6.799,
    flip: false,
  },
  {
    id: "pf2",
    x: 295.04,
    y: 148.12,
    width: 2.793,
    length: 302.086,
    rotate: 27.27,
    blur: 6.799,
    flip: false,
  },
  {
    id: "pf3",
    x: 321.59,
    y: 175.29,
    width: 0.698,
    length: 226.154,
    rotate: 27.27,
    blur: 6.799,
    flip: false,
  },
  {
    id: "pf4",
    x: 32.69,
    y: 165.76,
    width: 3.137,
    length: 304.99,
    rotate: 152.73,
    blur: 7.635,
    flip: true,
  },
  {
    id: "pf5",
    x: 110.67,
    y: 142.61,
    width: 3.137,
    length: 304.99,
    rotate: 152.73,
    blur: 7.635,
    flip: true,
  },
  {
    id: "pf6",
    x: 80.22,
    y: 171.92,
    width: 0.784,
    length: 228.328,
    rotate: 152.73,
    blur: 7.635,
    flip: true,
  },
];

/** Figma's 402 frame as the unit, so one factor carries the whole rake. */
const u = (n: number) => `calc(${n} * var(--u))`;

/** Mirrors come after the rotation, matching the order CSS applies them. */
const rake = (rotate: number, flip: boolean, skew = 0) =>
  `translate(-50%, -50%) rotate(${rotate}deg)${flip ? " scaleY(-1)" : ""}${
    skew ? ` skewX(${skew}deg)` : ""
  }`;

/**
 * The dot field and the light inside it — Figma's `texture` mask group
 * (2410:6771 desktop, 2410:6638 phone and tablet).
 *
 * Figma masks `Ellipse 21848` — a 1907x910 plate of #E7B773 at 52%, so much
 * larger than any frame that it is perfectly flat across one — with `twins`, a
 * 2084px PNG of a plain square lattice: 12px dots on a 52px pitch. The ellipse
 * never appears as a wash. Sampling the render proves it: between the dots the
 * page stays #020202, and every lit dot reads rgb(121,96,61), which is #E7B773
 * at 52% over black, source-over, dead constant from the top edge all the way
 * down to the mask's own bottom. So the glow in the middle of the section is
 * not a gradient at all — it is this field, and it was missing because the
 * field shipped at a sixth of its brightness.
 *
 * `Union` (2410:6764) draws the same lattice again as six strips of geometry,
 * but it contributes nothing measurable on top of the texture, so one layer
 * says both.
 *
 * The tile is written at source scale — a 52-unit box holding a 12-unit dot —
 * and pitched with `background-size`, because the pitch is the only thing that
 * moves between frames: Figma sizes the mask 753px wide on phone and tablet and
 * 1476px on desktop, which lands the same lattice at 5.68px and 11.13px.
 *
 * The alpha is 0.72 and Figma's is 0.52 — a deliberate departure, asked for. In
 * Figma the field sits on flat art; here it sits under a live fan that now paints
 * over it, so every dot the fan crosses is lost rather than merely washed out and
 * the field reads thinner than the same number would give a static plate. 0.72
 * takes a lit dot from rgb(121,96,61) to rgb(168,134,85) on the open ground,
 * which is where the field does its work.
 */
const DOTS = `url("data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="52" height="52"><circle cx="6" cy="6" r="6" fill="rgba(231,183,115,0.72)"/></svg>',
)}")`;

/**
 * The same lattice as an alpha mask rather than as ink — an opaque dot on a
 * transparent tile. Phone and tablet need it this way round because there the
 * light inside the field is shaped, so the dots have to take their colour from
 * a layer underneath instead of carrying it themselves.
 */
const LATTICE = `url("data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="52" height="52"><circle cx="6" cy="6" r="6" fill="#000"/></svg>',
)}")`;

/**
 * The light inside the phone and tablet field — Figma's three shapes under the
 * `texture` mask (2410:6642, 6640, 6641), which the desktop node does not have.
 *
 * Desktop masks one 1907x910 plate, so much wider than the frame that it is flat
 * across it, and a flat tile says the same thing. Phone and tablet do not work
 * that way: their plate is a 927x1098 ellipse inside a 753x856 texture, so it
 * falls off inside the frame rather than outside it, and two small `#D9D9D9`
 * ellipses sit on top of it on `overlay`. Those two are the soft shafts the
 * frames read as — they were the missing piece, because a flat tile has nowhere
 * to put them.
 *
 * Stated in percentages of the field rather than in Figma's 753x856 pixels. The
 * frames put the composition at one size and the phone is half that; holding the
 * pixels would slide the whole arrangement off to the right on a 402 frame,
 * where the field is 402 wide and the plate's centre alone sits at 337.
 *
 * The blur is what sets each stop. Sigma 14.1 against the plate's 464px radius
 * is 3% — near enough a hard edge, so it holds full strength to 94%. Against the
 * highlights' 87px it is 16%, which is most of the shape, so those run as a
 * smooth falloff from the middle out.
 */
const FIELD_GLOW = [
  `radial-gradient(ellipse 11.61% 11.61% at 69.19% 53.22%, rgba(255,255,255,0.34) 0%, rgba(255,255,255,0.18) 45%, rgba(255,255,255,0) 100%)`,
  `radial-gradient(ellipse 11.61% 11.61% at 48.39% 70.4%, rgba(255,255,255,0.34) 0%, rgba(255,255,255,0.18) 45%, rgba(255,255,255,0) 100%)`,
  `radial-gradient(ellipse 61.57% 64.16% at 44.72% 34.02%, rgba(231,183,115,0.72) 0%, rgba(231,183,115,0.72) 94%, rgba(231,183,115,0) 100%)`,
].join(", ");

/**
 * Figma holds the field at full strength for its whole height and then cuts it
 * off square at the bottom of the mask box, where its flattened fan hides the
 * seam. Ours is a live canvas whose crest moves with the viewport, so a hard
 * edge would land somewhere different at every height.
 *
 * So the fade runs through the field rather than sitting at its foot: full
 * strength over the top third, then a long ramp that is half gone by three
 * quarters and clear at the bottom. That trough is what lets the raised alpha
 * read as a field up top without piling dots into the fan lower down, where the
 * lines are dense and the two patterns beat against each other.
 */
const DOT_MASK =
  "linear-gradient(to bottom, #000 0%, #000 34%, rgba(0,0,0,0.62) 58%, rgba(0,0,0,0.28) 78%, transparent 100%)";

export const Backdrop = () => (
  <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
    {/*
      One rake per breakpoint. Neither wrapper carries a `z-index`, so both stay
      in the same painting group as the tint band below them and the
      `plus-lighter` pieces keep blending against the page rather than against a
      stacking context of their own.
    */}
    <div className="absolute inset-0 [--u:calc(min(100vw,744px)/402)] desktop-sm:hidden">
      {RAKE_BLOBS.map(({ id, x, y, width, height, rotate, blur, flip }) => (
        <span
          key={id}
          className="absolute rounded-[50%] bg-[#d78715] opacity-30"
          style={{
            left: u(x),
            top: u(y),
            width: u(width),
            height: u(height),
            filter: `blur(${u(blur)})`,
            transform: rake(rotate, flip),
          }}
        />
      ))}

      {RAKE_FLARES.map(({ id, x, y, width, length, rotate, blur, flip }) => (
        <span
          key={id}
          className="absolute opacity-30 mix-blend-plus-lighter"
          style={{
            left: u(x),
            top: u(y),
            width: u(width),
            height: u(length),
            backgroundImage: FLARE_FILL,
            filter: `blur(${u(blur)})`,
            transform: rake(rotate, flip),
          }}
        />
      ))}

      {RAKE_RAYS.map((ray) => (
        <span
          key={ray.id}
          className={`absolute border-solid border-[#d78715] ${ray.lit ? "mix-blend-plus-lighter" : ""}`}
          style={{
            left: u(ray.x),
            top: u(ray.y),
            width: u(ray.width),
            height: u(ray.height),
            borderWidth: u(ray.edge),
            opacity: ray.opacity,
            filter: `blur(${u(ray.blur)})`,
            transform: rake(ray.rotate, ray.flip, ray.skew),
            backgroundImage: ray.stop ? fill(ray.stop) : undefined,
          }}
        />
      ))}
    </div>

    <div className="absolute inset-0 hidden desktop-sm:block">
      {BLOBS.map(({ id, x, y }) => (
        <span
          key={id}
          className="absolute h-[887.58px] w-[816.45px] rounded-[50%] bg-[#d78715] opacity-50 blur-[132.5px]"
          style={{
            left: `calc(50% + ${x}px)`,
            top: y,
            transform: "translate(-50%, -50%) rotate(-45deg)",
          }}
        />
      ))}

      {FLARES.map(({ id, x, y, width, length }) => (
        <span
          key={id}
          className="absolute mix-blend-plus-lighter"
          style={{
            left: `calc(50% + ${x}px)`,
            top: y,
            width,
            height: length,
            transform: "translate(-50%, -50%) rotate(-45deg)",
            backgroundImage: FLARE_FILL,
            filter: "blur(12.9px)",
            opacity: 0.4,
          }}
        />
      ))}

      {RAYS.map(({ id, x, y, rotate, blur, opacity, stop, lit }) => (
        <span
          key={id}
          className={`absolute h-[1253px] w-[177px] border-solid border-[#d78715] ${lit ? "mix-blend-plus-lighter" : ""}`}
          style={{
            left: `calc(50% + ${x}px)`,
            top: y,
            borderWidth: "1.325px",
            transform: `translate(-50%, -50%) rotate(${rotate}deg)`,
            filter: `blur(${blur}px)`,
            opacity: opacity / 100,
            /* The outer bar of each rake is border-only in Figma. */
            backgroundImage: stop ? fill(stop) : undefined,
          }}
        />
      ))}
    </div>

    {/*
      The tint band — Figma `Union` (2410:6764), and not what its name suggests.
      It is one 1440x553 rectangle, not the six strips of dots the node tree
      makes it look like: `#da9028` solid along its top edge fading to nothing at
      its foot, at 0.62 on `mix-blend-mode: color`.

      `color` takes hue and saturation from this layer and luminosity from what
      is under it, so the band changes no brightness at all — it pulls the rakes,
      the flares and the page under them to one amber, which is why the top of
      the frame reads warm even where no ray reaches. Nothing else here does
      that, and without it the upper band stayed the raw colour of each source.

      It sits above both rakes and below the dot field, which is Figma's own
      order. Its 553 is measured from the frame top like the rakes are, so it
      stays put as the section grows.
    */}
    <span
      className="absolute inset-x-0 h-[553px] mix-blend-color"
      style={{
        top: -168,
        opacity: 0.62,
        backgroundImage:
          "linear-gradient(to bottom, #da9028 0%, rgba(218,144,40,0) 100%)",
      }}
    />
  </div>
);

/**
 * The dot field, painted after the fan rather than inside the backdrop.
 *
 * Figma composites the texture source-over above everything, but Figma's fan is
 * a flat plate; ours is a live canvas, and a dot sitting on a lit line is a
 * clash the static art never has — the two ambers beat against each other and
 * the field reads as speckle over the fan.
 *
 * The fix is order, not blending. No blend mode helps here: the dot cream
 * `#e7b773` is brighter than the gold line in all three channels, so `lighten`
 * resolves to the line's own colour and measured a six-level change at most,
 * while `darken` would erase the field against the near-black ground. What the
 * dots actually do to a line is desaturate it — 0.52 of cream over gold lands
 * near rgb(225,164,79) — and the only way to stop that is to keep them out from
 * under it.
 *
 * So the field paints *before* the fan and the fan draws on transparency over
 * it. Dots survive in the gaps between lines, where the page is what shows, and
 * disappear beneath every lit line. That is also Figma's own reading: its plate
 * is opaque art and its texture stops at 628, just above where the fan gets
 * bright, so the two barely meet there either.
 *
 * Two elements, because the two node trees genuinely differ rather than
 * re-pitching. Desktop's light is one plate wider than its frame, so the tile
 * can carry the colour itself and the lattice is ink. Phone and tablet shape the
 * light inside the field, so there the lattice is the mask and `FIELD_GLOW`
 * underneath supplies the colour — same dots, opposite way round.
 */
const FIELD =
  "pointer-events-none absolute inset-x-0 top-0 opacity-54 [background-size:5.68px_5.68px]";

export const DotField = () => (
  <>
    <div
      aria-hidden
      className={`${FIELD} h-[97.9%] [--u:calc(min(100vw,744px)/402)] ipad:h-[80.1%] desktop-sm:hidden`}
      style={{
        backgroundImage: FIELD_GLOW,
        /*
         * The glow is drawn in the texture's own 753 x 856 box pinned to the
         * top-left, not stretched to the section. Figma hangs that box off the
         * frame origin and lets it run off a 402 frame, so its right-hand
         * highlight is cropped — stretching it instead would pull both
         * highlights inward and move the plate's centre off the frame.
         */
        backgroundSize: `${u(753)} ${u(856)}`,
        backgroundPosition: "left top",
        backgroundRepeat: "no-repeat",
        maskImage: `${LATTICE}, ${DOT_MASK}`,
        maskSize: "5.68px 5.68px, 100% 100%",
        maskComposite: "intersect",
        WebkitMaskImage: `${LATTICE}, ${DOT_MASK}`,
        WebkitMaskSize: "5.68px 5.68px, 100% 100%",
        WebkitMaskComposite: "source-in",
      }}
    />

    <div
      aria-hidden
      className={`${FIELD} hidden h-[72.4%] desktop-sm:block desktop-sm:[background-size:11.13px_11.13px]`}
      style={{
        backgroundImage: DOTS,
        maskImage: DOT_MASK,
        WebkitMaskImage: DOT_MASK,
      }}
    />
  </>
);
