# Phase 1: Database Model & Authentication Flow with CRUD - Research

## Executive Summary
Phase 1 establishes the complete identity, authentication, and CRUD data lifecycle for the Reverse Dating Web Application. Prospective matches must be able to register with rich details (name, chosen contact type, contact handle/number, photo/avatar, and their specific expectations for the match). Once logged in, the user has full control to view their saved profile details, update any information, delete/withdraw their application, or log out.

---

## 1. Domain & Data Architecture Research

### 1.1 MongoDB / Mongoose Schema Design
The `Applicant` model must store all incoming information safely while providing indexes for fast lookups.

Key fields required:
- `name`: String, required, trimmed, max 80 chars.
- `contactType`: String, enum: `['phone', 'instagram', 'whatsapp', 'twitter', 'telegram', 'email']`, default: `'instagram'`.
- `contact`: String, required, trimmed, case-normalized.
- `photo`: String, required, stores either a preset avatar identifier (e.g. `avatar-1`, `avatar-2`) or an image URL / data URI.
- `expectations`: String, required, text box capturing what they expect from the match (max 1000 chars).
- `status`: String, enum: `['viewing', 'pending', 'accepted', 'rejected']`, default `'viewing'`.
- `appliedAt`, `decidedAt`, `decisionNote`: Timestamps and host metadata.

### 1.2 Dual Storage Resilience (`lib/db.js`)
To ensure reliable local development even when a MongoDB daemon is not actively running, `lib/db.js` uses an intelligent dual-driver:
1. Primary: Mongoose connected to MongoDB (`MONGODB_URI`).
2. Fallback: Local JSON persistence (`data/applicants.json`) with an identical asynchronous interface.
Both drivers must support the full CRUD suite:
- `create(data)`
- `findByContact(contact)`
- `findById(id)`
- `update(id, updates)`
- `delete(id)` (to be added for full CRUD support)
- `listAll()`

---

## 2. API & Next.js App Router Architecture

### 2.1 Route Endpoints
1. `POST /api/auth`
   - Handles Registration / Login.
   - Validates `name`, `contactType`, `contact`, `photo`, and `expectations`.
   - Creates or updates applicant document.
   - Sets HTTP cookie `applicant_id`.
   - Returns applicant payload and redirect hint (`/dashboard`, `/status/accepted`, `/status/404-rejected`).

2. `GET /api/auth`
   - Verifies session from cookie.
   - Returns current user's profile and status.

3. `DELETE /api/auth` (Logout)
   - Clears `applicant_id` cookie by setting `maxAge: 0`.
   - Returns `{ success: true, message: 'Logged out successfully' }`.

4. `GET /api/profile`
   - Retrieves full saved details for the logged-in applicant.

5. `PUT /api/profile`
   - Updates `name`, `contactType`, `contact`, `photo`, or `expectations`.
   - Updates document in MongoDB/fallback.

6. `DELETE /api/profile`
   - Deletes applicant record from database.
   - Clears session cookie.
   - Returns confirmation and redirects to `/login`.

---

## 3. UI/UX & Component Patterns

### 3.1 Registration & Login Experience (`app/login/page.jsx`)
- Sleek glassmorphism container with dark theme and ambient glow.
- Input fields:
  - **Full Name**: Clear text input with user icon.
  - **Contact Channel Selector**: Clean dropdown allowing selection between:
    - Phone Number
    - Instagram (`@username`)
    - WhatsApp
    - Twitter/X (`@handle`)
    - Telegram (`@username`)
    - Email Address
  - **Contact Input**: Dynamic placeholder based on selected channel (e.g., `+1 (555) 019-2834` vs `@instagram_handle`).
  - **Photo / Avatar Picker**:
    - Quick-select aesthetic illustrated avatar chips.
    - Toggle to enter custom image URL.
  - **Match Expectations Textbox**: Multi-line textarea encouraging thoughtful answers with character counter.
  - Submit button with smooth hover physics and loading spinner.

### 3.2 In-App Profile Management (`components/ProfileModal.jsx`)
- Slide-over or modal dialog triggered from the header.
- Displays:
  - Current photo/avatar.
  - Name, Contact type & handle.
  - Current expectations.
  - Application Status Badge (`Browsing Portfolio`, `Under Review`, `Accepted`, `Error 404`).
- Interactive Controls:
  - **Edit Details**: Toggles editable form fields with Save and Cancel.
  - **Withdraw / Delete Application**: Danger-button with confirmation modal.
  - **Log Out**: Instantly terminates session.

---

## 4. Verification Strategy
- Schema integrity check: verify `models/Applicant.js` validates contactType enum and expectations.
- API testing: verify `POST /api/auth`, `GET /api/auth`, `DELETE /api/auth`, `PUT /api/profile`, and `DELETE /api/profile`.
- UI walkthrough: test registration, check cookie creation, open profile modal, edit expectations, save changes, and verify persistence.
