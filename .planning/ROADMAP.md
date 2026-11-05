# Roadmap: Reverse Dating Web Application

## Overview
This roadmap organizes the development of the Reverse Dating Web Application into 4 sequential phases, executing end-to-end from foundational database schemas and authentication to the 3D animated portfolio, application submission workflows, and minimal outcome pages.

```
Phase 1: DB & Auth with CRUD " Phase 2: 3D Portfolio Experience " Phase 3: Interest & Admin Review " Phase 4: Decision Pages & Polish
```

---

### Phase 1: Database Model & Authentication Flow with CRUD [COMPLETED]
- **Status**: Completed & Verified (Build passing, 23/23 tests passed)
- **Goal**: Establish the MongoDB Mongoose schema supporting contact type selection, photo, and match expectations; implement authentication (login/registration), session cookies, and complete applicant CRUD endpoints (view, update, delete profile) plus logout.
- **Requirements Covered**: `AUTH-01`, `AUTH-02`, `AUTH-03`, `AUTH-04`, `CRUD-01`, `CRUD-02`, `CRUD-03`, `CRUD-04`, `BACKEND-01`, `BACKEND-02`, `BACKEND-03`
- **Key Deliverables**:
  - `models/Applicant.js`: Updated Mongoose schema with `contactType`, `contact`, `photoUrl`, `expectations`, and timestamps.
  - `app/api/auth/route.js`: POST (register/login), GET (current session check), DELETE (logout).
  - `app/api/profile/route.js`: GET (view saved details), PUT (update details), DELETE (delete application).
  - `app/login/page.jsx`: Polished registration & login UI with contact channel selector, photo selector/URL, and expectations textarea.
  - `components/ProfileModal.jsx`: Modal allowing in-place profile viewing, editing, deleting, and logout.
  - `components/Navbar.jsx`: Live header connecting active session to ProfileModal.
- **Success Criteria**: User can register with all required fields, see validation errors, log out, view saved details, update details, and delete their profile.

---

### Phase 2: 3D Animated Portfolio Experience & Interactive Header/Footer [COMPLETED]
- **Status**: Completed & Verified (Build passing, 36/36 tests passed)
- **Goal**: Build the main portfolio page showcasing the creator's identity with 3D scrolling animations, comprehensive personal lore, working header with profile drawer/logout, footer, and the end-of-page "I'm Interested" CTA.
- **Requirements Covered**: `PORT-01`, `PORT-02`, `PORT-03`, `PORT-04`, `PORT-05`
- **Key Deliverables**:
  - Responsive Navigation Header with branding, anchor shortcuts, "View My Application" trigger, and Logout button.
  - Interactive Profile Drawer/Modal allowing the applicant to view and edit their submitted details in-place.
  - 3D Scrolling Animation Engine using Framer Motion with perspective transforms, parallax cards, and scroll progress tracking.
  - Personal Showcase Sections:
    1. Hero: Photo, name, tagline, intro stats.
    2. Achievements: Career, academics, and personal milestones.
    3. Ambitions: Next big goals and dreams.
    4. Strengths & Weaknesses: Honest, humorous pros & cons.
    5. Hobbies & Passions: "What I like to do" (music, books, outdoor adventures, tech).
    6. Value Pitch: Why choose me as your match.
  - Sticky / End-of-Portfolio **"I'm Interested"** CTA button.
  - Responsive Footer with status indicators and copyright.
- **Success Criteria**: Main page renders smoothly with 3D perspective animations on scroll; header and footer work; profile drawer displays saved details; "I'm Interested" button is prominently placed at the end.

---

### Phase 3: "I'm Interested" Application Submission & Host Admin Review Room
- **Goal**: Implement the application submission handler, instant host notification (Telegram webhook / alert system), and the protected admin review dashboard where the host can inspect applicants and Accept or Reject with one click.
- **Requirements Covered**: `APPLY-01`, `APPLY-02`, `APPLY-03`, `ADMIN-01`, `ADMIN-02`, `ADMIN-03`
- **Key Deliverables**:
  - `app/api/apply/route.js`: Endpoint updating applicant status to `pending`, recording timestamp, and firing host notification.
  - `lib/telegram.js`: Instant webhook utility formatting applicant summary (name, contact type, expectations, photo).
  - `app/admin/page.jsx`: Protected host control room displaying live applicant grid, stats, and one-click Accept/Reject decision buttons.
  - `app/api/admin/route.js`: Decision API handling accept/reject updates and optional decision notes.
- **Success Criteria**: Clicking "I'm Interested" triggers notification, updates status to pending, and displays real-time confirmation; admin can login, view applicants, and make decisions.

---

### Phase 4: Minimal Accepted & "Error 404: Love Not Found" Decision Pages & Polish
- **Goal**: Deliver the clean, minimal decision pages (Accepted page with unlocked socials, Rejected page with "Error 404: Love Not Found"), configure route protection guards, and conduct end-to-end verification.
- **Requirements Covered**: `RESULT-01`, `RESULT-02`, `AUTH-04`
- **Key Deliverables**:
  - `app/status/accepted/page.jsx`: Clean, minimal, celebratory page revealing creator's direct phone number, Instagram, WhatsApp, Spotify playlist, and social channels.
  - `app/status/404-rejected/page.jsx`: Clean, minimal page with heading "Error 404: Love Not Found", lighthearted message, and reset/exit action.
  - Session routing middleware / client hooks ensuring users are redirected directly to their decision page if already decided.
  - Cross-device responsiveness check and performance audit.
- **Success Criteria**: Accepted applicant sees clean unlocked contacts; rejected applicant lands on clean "Error 404: Love Not Found" screen; navigation and security guards prevent unauthorized access.
