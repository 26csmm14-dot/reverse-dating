# Project: Reverse Dating Web Application

## Overview
The **Reverse Dating Web Application** turns conventional dating dynamics on their head. Rather than swiping on hundreds of profiles, prospective matches register their details, are redirected to a high-impact, 3D animated personal portfolio showcasing the creator's identity, achievements, ambitions, strengths, weaknesses, and passions, and conclude with an **"I'm Interested"** application button.

When an applicant declares interest:
1. The creator receives an immediate notification.
2. The creator reviews the applicant's profile and chooses to **Accept** or **Reject**.
3. **If Accepted**: The applicant is redirected to a clean, minimal unlocked contact page revealing personal contact numbers and social media handles.
4. **If Rejected**: The applicant is redirected to a clean, minimal, humorous custom screen stating **"Error 404: Love Not Found"**.

The application is built on a full-stack Node.js (Next.js App Router) architecture backed by MongoDB, featuring interactive CRUD functionalities (registration, viewing details, updating details, deleting/withdrawing, and logging out).

---

## Target Audience & Personas
- **Prospective Matches / Applicants**: Individuals seeking a thoughtful, curated connection who browse the creator's portfolio and submit an application.
- **Creator / Host (Owner)**: The subject of the portfolio who receives notifications and manages incoming applications via an administrative review dashboard.

---

## Core Value Proposition
- **High-Impact Portfolio Presentation**: Immersive 3D scrolling animations presenting a comprehensive personal pitch deck (photo, achievements, ambitions, strengths & weaknesses, hobbies).
- **Gamified Match Flow**: An engaging, playful mechanism ("I'm Interested" ? Host Approval ? Secret Unlocked or Error 404).
- **Full Working Functionality**: Complete applicant lifecycle including authentication, profile management (view, update, delete), session control, and real-time review.
- **Data Integrity & Persistence**: Robust MongoDB storage for applicant profiles, contact channels, expectations, and review statuses.

---

## Tech Stack & Architecture

- **Frontend & Routing**: Next.js 14 (App Router) + React
- **Styling & Aesthetics**: Tailwind CSS with custom glassmorphism, glowing ambient lighting, and clean minimal accents
- **3D Scrolling & Motion**: Framer Motion (3D perspective transforms, scroll depth, stagger effects) + Canvas Confetti
- **Backend & APIs**: Node.js runtime via Next.js Route Handlers (`app/api/`)
- **Database & ODM**: MongoDB with Mongoose connection caching and schema validation
- **Notifications**: Instant alerts via webhook (Telegram Bot API) + in-app admin review dashboard
- **Icons**: Lucide React

---

## Scope Boundaries

### In Scope (v1 MVP)
1. **Authentication & Registration**:
   - Collects Name, Contact Type Selector (`Phone Number`, `Instagram`, `WhatsApp`, `Twitter/X`, `Telegram`, `Email`), Contact Value, Photo/Avatar, and Match Expectations textarea.
   - Session management with cookie persistence and logout capability.
2. **Main Portfolio Page**:
   - Well-designed responsive Header (branding, nav anchors, profile viewer modal trigger, logout button).
   - Well-designed Footer with credits, status indicator, and quick links.
   - 3D scrolling animation sections: Hero photo & bio, Achievements, Ambitions, Strengths, Weaknesses, Hobbies ("What I like to do"), and Value Pitch ("Why select me").
   - Primary **"I'm Interested"** CTA button at the bottom of the page.
3. **Interactive CRUD Capabilities**:
   - **Create**: Register applicant details & expectations upon onboarding.
   - **Read**: View saved profile details and application status via a dedicated slide-out drawer or modal.
   - **Update**: Edit contact details, photo, and match expectations at any time.
   - **Delete**: Withdraw/delete application and clear saved data.
   - **Logout**: Invalidate session and return to login screen.
4. **Notification & Admin Review Flow**:
   - Webhook trigger (Telegram notification with applicant card) + Admin panel (`/admin`).
   - Host actions: Accept or Reject with optional feedback note.
5. **Decision Screens (Clean & Minimal)**:
   - **Accepted Page**: Minimal, elegant unlocked showcase displaying direct phone number, Instagram, WhatsApp, Spotify, and social media handles.
   - **Rejected Page**: Clean, minimal page rendering **"Error 404: Love Not Found"** with a graceful/humorous message and option to clear data or exit.

### Out of Scope (Deferred to v2)
- Multi-user matching (swiping between arbitrary pairs; this is strictly reverse dating for the host).
- Real-time in-app chat socket server (contact is handed off to direct socials upon acceptance).
- Paid subscription / microtransactions.

---

## Key Conventions & Guidelines
- **Responsive Design**: Ensure smooth 3D animations and layout stability across mobile (375px+), tablet, and desktop viewports.
- **Minimal Aesthetics**: Decision pages must remain clean, intentional, and clutter-free as requested.
- **Error Handling**: Graceful degradation if database or notification webhooks encounter network delays.
