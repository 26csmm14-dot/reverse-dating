# Phase 2 Plan: 3D Animated Portfolio Experience & Interactive Header/Footer

## Goal
Build the main portfolio experience (`/dashboard`) showcasing the host's background, achievements, ambitions, strengths, weaknesses, hobbies ("what I like to do"), and why they make a great match, utilizing 3D perspective scroll animations, an interactive navigation header with section anchors, profile drawer access, footer, and the prominent end-of-page **"I'm Interested"** CTA.

---

## Requirements Mapped
- `PORT-01`: Responsive Header with brand logo (`wanna date u`), section anchors, profile modal trigger, and Logout action.
- `PORT-02`: Responsive Footer with personal branding, status pill, and copyright/social credits.
- `PORT-03`: 3D Scrolling Animation system utilizing Framer Motion and CSS 3D perspective to create dynamic depth, tilting cards, and parallax transitions.
- `PORT-04`: Core Personal Showcase Content Sections:
  1. **Hero**: Creator photo, name, headline tag, quick stats, charming self-introduction.
  2. **Achievements**: Academic, career, personal milestones, and notable projects.
  3. **Ambitions**: Future vision, goals, and life aspirations.
  4. **Strengths & Weaknesses**: Candid, self-aware, and humorous list of pros and cons.
  5. **Hobbies & Interests**: What the creator enjoys doing (music, travel, books, tech, outdoor activities).
  6. **Why Choose Me Pitch**: Summary pitch on why the creator is the ideal match.
- `PORT-05`: Sticky / End-of-page **"I'm Interested"** call-to-action button that initiates the application review process.

---

## Execution Waves

### Wave 1: 3D Perspective Card Component & Navigation Helpers
*Dependencies: None*

- [x] **Task 1: Create 3D Perspective Tilt Card Component**
  - **File**: `components/portfolio/Card3D.jsx`
  - Implement dynamic 3D mouse tilt using spring-physics (`rotateX`, `rotateY`, `transform-style: preserve-3d`).
  - Add frosted glass reflections, border gradient glow, and smooth easing.

- [x] **Task 2: Build Floating Section Navigation & Scroll Progress Bar**
  - **File**: `components/portfolio/PortfolioNav.jsx`
  - Fixed top progress bar reflecting scroll percentage with a liquid rose/pink gradient.
  - Floating pill dock with section anchors (`#hero`, `#achievements`, `#ambitions`, `#strengths`, `#hobbies`, `#pitch`).
  - Active section highlight based on scroll position.

---

### Wave 2: Full Personal Lore Sections in `app/dashboard/page.jsx`
*Dependencies: Wave 1*

- [x] **Task 3: Refactor Hero Section in `app/dashboard/page.jsx`**
  - **File**: `app/dashboard/page.jsx`
  - Replace anime/science placeholder with real host presentation:
    - High-craft portrait card with ambient glow.
    - Name, tagline, and quick stats (location, personality archetype, coffee order, weekend vibe).
    - Status pill ("Single & looking for genuine connection").

- [x] **Task 4: Build Achievements & Ambitions 3D Sections**
  - **File**: `app/dashboard/page.jsx`
  - Achievements grid: Technical creations, fitness/life achievements, leadership milestones.
  - Ambitions grid: Personal dreams, bucket-list travel, culinary aspirations, long-term visions.

- [x] **Task 5: Build Strengths & Weaknesses ("The Honest Pros & Cons")**
  - **File**: `app/dashboard/page.jsx`
  - Side-by-side or tabbed cards:
    - Green Flags (Strengths): Attentive listener, emotionally grounded, spontaneous planner, great cook.
    - Yellow Flags (Weaknesses): Perfectionist about design details, buys too many books, needs morning silence before caffeine.

- [x] **Task 6: Build Hobbies & Passions ("What I Like To Do")**
  - **File**: `app/dashboard/page.jsx`
  - Interactive hobby cards: Music & Vinyl, Trail Hiking & Cycling, Books & Philosophy, Specialty Coffee & Cooking.
  - Interactive chips and quick favorites.

- [x] **Task 7: Build Match Pitch & "I'm Interested" CTA Flow**
  - **File**: `app/dashboard/page.jsx`
  - "Why Choose Me" value pitch card explaining what dating the host is truly like.
  - Prominent, glowing **"I'm Interested"** CTA button at the end of the scroll.
  - Modal dialog confirming application submission with date idea selector.

---

### Wave 3: Footer, Test Automation & Verification
*Dependencies: Wave 2*

- [x] **Task 8: Polish Responsive Footer**
  - **File**: `app/layout.jsx` / `components/Footer.jsx`
  - Add back-to-top button, current year, and active match status indicator.

- [x] **Task 9: Automated Phase 2 Integration Test**
  - **File**: `scripts/test-phase2-portfolio.js`
  - Automated assertions verifying:
    1. Presence of all 6 lore sections (`#hero`, `#achievements`, `#ambitions`, `#strengths`, `#hobbies`, `#pitch`).
    2. 3D perspective animations (`perspective`, `useScroll`, `useTransform`).
    3. Navigation anchors and header integration.
    4. "I'm Interested" CTA button and submission handler.
    5. Clean text free of broken placeholder slop.

- [x] **Task 10: Production Build & Runtime Verification**
  - Run `npm run build` to verify clean compilation.
  - Run `test-phase2-portfolio.js` to ensure 100% test pass rate.

---

## Verification & Acceptance Criteria
1. **Visual 3D Scroll**: Scrolling down `/dashboard` exhibits noticeable 3D perspective depth, card tilt, and smooth parallax.
2. **All 6 Lore Sections Present**: Hero, Achievements, Ambitions, Strengths & Weaknesses, Hobbies, and Match Pitch render complete, authentic content.
3. **Working Navigation & Anchors**: Clicking any anchor smoothly jumps to the corresponding section; scroll progress bar updates.
4. **Profile Access & Session**: Header displays the logged-in applicant name and opens `ProfileModal.jsx`.
5. **CTA Operable**: The end-of-page "I'm Interested" button opens the match proposal dialog and submits to `/api/apply`.
6. **Zero Emojis & "wanna date u" Branding**: Follows the user's styling rules (no emojis, branded as "wanna date u").
