# Requirements: Reverse Dating Web Application

## v1 Core Requirements

### 1. Authentication & Registration (`AUTH`)
- **[AUTH-01]**: User registration/login collects:
  - Full Name (`string`, required)
  - Contact Channel Type (`dropdown`: Phone Number, Instagram, WhatsApp, Twitter/X, Telegram, Email)
  - Contact Channel Value (`string`, required)
  - Photo / Avatar (`string` URL or preset avatar selection)
  - Match Expectations (`textarea`, required, max 500 characters)
- **[AUTH-02]**: Persistent session management via HTTP cookies allowing returning users to be automatically recognized.
- **[AUTH-03]**: Clear session / Logout functionality that invalidates user cookies and redirects to the login screen.
- **[AUTH-04]**: Redirect logic: authenticated users are immediately redirected to the Main Portfolio page unless they have an existing decision (`accepted` ? `/status/accepted`, `rejected` ? `/status/404-rejected`).

### 2. Main Page: 3D Animated Portfolio (`PORT`)
- **[PORT-01]**: Polished responsive Header containing brand logo, section anchors, "My Application" profile trigger, and Logout action.
- **[PORT-02]**: Polished responsive Footer with personal branding, status pill, and copyright/social credits.
- **[PORT-03]**: 3D Scrolling Animation system utilizing Framer Motion / CSS 3D perspective to create dynamic depth, tilting cards, and parallax transitions as the user scrolls.
- **[PORT-04]**: Core Personal Showcase Content Sections:
  - **Hero**: Creator photo, name, headline tag, and quick stats.
  - **Achievements**: Academic, career, personal milestones, and notable projects.
  - **Ambitions**: Future vision, goals, and life aspirations.
  - **Strengths & Weaknesses**: Candid, self-aware, and humorous list of pros and cons.
  - **Hobbies & Interests**: What the creator enjoys doing (music, travel, books, tech, outdoor activities).
  - **Why Choose Me Pitch**: Summary pitch on why the creator is the ideal match.
- **[PORT-05]**: Sticky or end-of-page **"I'm Interested"** call-to-action button that initiates the application review process.

### 3. Interactive Applicant CRUD Functionalities (`CRUD`)
- **[CRUD-01] (Create)**: Ability to onboard and submit initial applicant profile data upon registration.
- **[CRUD-02] (Read)**: Ability to view saved applicant details and current application status at any time via an in-app Profile Modal / Drawer.
- **[CRUD-03] (Update)**: Ability for the applicant to modify their saved name, contact type, contact handle, photo, or match expectations.
- **[CRUD-04] (Delete)**: Ability for the applicant to withdraw/delete their application and clear their stored data from MongoDB.

### 4. Application Flow & Notifications (`APPLY`)
- **[APPLY-01]**: Clicking the **"I'm Interested"** button updates the applicant status to `pending` and timestamps `appliedAt`.
- **[APPLY-02]**: Fires an instant notification alert (via Telegram Bot webhook or in-app notification event) notifying the host of a new applicant with their details and expectations.
- **[APPLY-03]**: Displays a real-time pending indicator and feedback toast ("Application submitted! The host has been notified").

### 5. Host Admin Review Control Room (`ADMIN`)
- **[ADMIN-01]**: Protected `/admin` control interface secured by secret passkey.
- **[ADMIN-02]**: Live dashboard displaying all applicants, their photos, contact details, expectations, and current status (`viewing`, `pending`, `accepted`, `rejected`).
- **[ADMIN-03]**: Action controls allowing the host to **Accept** or **Reject** an applicant with a single click (with optional decision note).

### 6. Decision Pages (`RESULT`)
- **[RESULT-01] (Accepted)**:
  - Clean, minimal, elegant UI layout.
  - Celebratory visual feedback (confetti animation).
  - Unlocked contact panel displaying creator's direct phone number, Instagram, WhatsApp, Spotify playlist, and calendar/chat links.
- **[RESULT-02] (Rejected)**:
  - Clean, minimal, humorous UI layout.
  - Heading: **"Error 404: Love Not Found"**.
  - Gentle, lighthearted message with an option to withdraw data or return to home.

### 7. Backend & Database Architecture (`BACKEND`)
- **[BACKEND-01]**: Node.js runtime backend using Next.js App Router API route handlers.
- **[BACKEND-02]**: MongoDB database connection using Mongoose with cached connection pooling and strict schema validation.
- **[BACKEND-03]**: Robust error handling and JSON API responses for all endpoints (`/api/auth`, `/api/apply`, `/api/profile`, `/api/admin`, `/api/status`).

---

## Non-Functional Requirements
- **Performance**: Instant load times and smooth 60fps 3D scroll animations without frame drops.
- **Responsiveness**: Flawless visual presentation and navigation on both mobile smartphones and desktop screens.
- **Security**: Sensitive creator contact details remain encrypted or withheld on the server until the applicant's status is strictly validated as `accepted`.
