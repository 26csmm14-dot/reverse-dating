# Phase 2: 3D Animated Portfolio Experience & Interactive Header/Footer - Research

## Executive Summary
Phase 2 builds the core emotional center of the **wanna date u** application: the 3D Animated Personal Portfolio (`/dashboard`). The applicant has already checked in with their name, contact handle, photo, and expectations. Now they journey through a high-craft 3D scrolling portfolio detailing the host's background, achievements, ambitions, strengths, weaknesses, hobbies ("what I like to do"), and why they make a great match, culminating in the end-of-page **"I'm Interested"** CTA.

---

## 1. 3D Perspective & Scroll Animation Architecture

### 1.1 Framer Motion 3D Perspective Setup
To achieve 60fps cinematic 3D perspective scroll effects without heavy WebGL bloat:
- **Perspective Viewport Container**:
  ```css
  perspective: 1200px;
  transform-style: preserve-3d;
  ```
- **Framer Motion Hooks**:
  - `useScroll({ target: containerRef, offset: ['start start', 'end end'] })` tracking global page scroll progress.
  - `useTransform` generating smooth dynamic interpolations:
    - `rotateX` tilt (e.g. `[15, 0, -10]deg` as sections enter and leave viewport).
    - `scale` depth transitions (e.g. `[0.92, 1, 0.96]`).
    - `opacity` fades (e.g. `[0, 1, 1, 0]`).
    - Parallax floating layer offsets (`y: [-30, 30]px`).
- **Scroll Progress Indicator**:
  - Ultra-thin liquid gradient scroll bar fixed at the top of the viewport (`h-1 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 scaleX`).

### 1.2 Interactive Card Tilt (Cursor Parallax)
Individual feature cards (Achievements, Ambitions, Strengths, Hobbies) use subtle 3D mouse hover physics:
- Mouse position tracking on card bounding rectangle.
- 3D perspective rotation (`rotateY: (mouseX / width - 0.5) * 12deg`, `rotateX: -(mouseY / height - 0.5) * 12deg`).
- Liquid glass reflection sheen that shifts as the cursor hovers.

---

## 2. Personal Showcase Content Architecture (`PORT-04`)

The portfolio is structured into 6 sequential sections designed to pass the "vibe check" with authentic human charm, zero corporate buzzwords, and zero AI slop:

### Section 1: Hero ("The Introduction")
- Host Photo: Clean, high-resolution portrait container with frosted glass border.
- Name & Tagline: "Creative Technologist, Problem Solver & Lifelong Curious Soul".
- Quick Stats Pill Row:
  - Height / Location / Vibe ("Coffee & Deep Talks").
  - Current Obsession ("Building high-craft web apps & discovering indie music").
- Status Badge: Active & Open to genuine connections.

### Section 2: Achievements ("The Journey So Far")
- Highlights combining technical craftsmanship and real-life milestones:
  - Full-stack developer shipping scalable web apps and aesthetic UI experiences.
  - Built autonomous AI agents & resilient distributed backend systems.
  - Marathon/fitness or personal discipline milestones.
  - Passion projects created out of pure curiosity.

### Section 3: Ambitions ("Where I'm Headed")
- Life and career trajectory:
  - Building products that bring joy and authentic human connection.
  - Traveling to hidden architectural gems and mountain retreats.
  - Mastering culinary arts (cooking memorable Sunday dinners).
  - Building a life filled with laughter, adventure, and mutual growth.

### Section 4: Strengths & Weaknesses ("The Honest Pros & Cons")
- **Green Flags (Strengths)**:
  - Emotional intelligence & attentive listening (remembers the tiny details).
  - Calm under pressure, great sense of humor, spontaneous road-tripper.
  - Fantastic communication; direct, honest, and warm.
- **Yellow Flags (Candid Weaknesses)**:
  - Will spend 45 minutes fine-tuning UI animations and spacing.
  - Drinks iced espresso regardless of the season.
  - Needs 10 minutes of silence in the morning before full consciousness activates.

### Section 5: Hobbies & Passions ("What I Like To Do")
- Interactive multi-category showcase:
  - **Music & Sound**: Indie pop, lo-fi beats, synthwave, vinyl record collecting.
  - **Outdoor & Active**: Hiking trails, cycling around sunset, spontaneous city walks.
  - **Books & Ideas**: Philosophy, speculative fiction, design theory, storytelling.
  - **Food & Cafes**: Pour-over coffee hunting, tasting street food, artisan ramen.

### Section 6: Why Choose Me Pitch ("The Match Thesis")
- A candid, warm, self-aware pitch on what dating the creator looks like:
  - Spontaneous weekend plans and thoughtful dates.
  - Someone who genuinely cheers for your dreams and builds you up.
  - Warmth, loyalty, banter, and emotional safety.

---

## 3. Navigation Header, Anchor Links & Footer (`PORT-01`, `PORT-02`)

### 3.1 Header Navigation
- Brand wordmark: **wanna date u** with link to top.
- Anchor Links: Quick jump shortcuts to `#achievements`, `#ambitions`, `#strengths`, `#hobbies`, `#pitch`.
- Profile Badge: Displays active applicant name, opening the interactive `ProfileModal.jsx`.
- Logout Action: In-place session termination redirecting cleanly to `/login`.

### 3.2 Responsive Footer
- Brand imprint: "wanna date u • curated personal portfolio".
- Back to top shortcut with smooth scroll.
- Active system status indicator (`Ready for genuine connection`).

---

## 4. End-of-Portfolio "I'm Interested" CTA (`PORT-05`)

- Positioned prominently at the bottom of the page following the Value Pitch.
- Sticky floating dock on mobile when scrolled past the hero.
- Clicking **"I'm Interested"**:
  - If applicant is logged in: opens proposal review dialog with their saved expectations and first date ideas, confirming submission.
  - Updates applicant status to `pending` and sets `appliedAt` timestamp.
  - Displays instant celebratory feedback toast.

---

## 5. Verification Strategy
1. **Automated Integration Test (`scripts/test-phase2-portfolio.js`)**:
   - Verify `app/dashboard/page.jsx` contains all 6 core sections (`#hero`, `#achievements`, `#ambitions`, `#strengths`, `#hobbies`, `#pitch`).
   - Verify Framer Motion 3D scroll transforms and perspective hooks (`useScroll`, `useTransform`, `perspective`).
   - Verify Header navigation anchors and ProfileModal trigger.
   - Verify End-of-portfolio "I'm Interested" CTA button and handler.
2. **Next.js Production Build**:
   - `npm run build` exits 0 with no hydration mismatches or compilation errors.
