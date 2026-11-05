# Phase 1 Plan: Database Model & Authentication Flow with CRUD

## Goal
Implement the foundational data model, authentication flow, and complete applicant CRUD operations (registration with contact selector, photo, expectations, session cookies, viewing profile, editing profile, deleting application, and logging out) using Node.js and MongoDB.

---

## Requirements Mapped
- `AUTH-01`: User registration/login with Name, Contact Channel Type selector, Contact Handle, Photo/Avatar, and Match Expectations.
- `AUTH-02`: Persistent session cookies (`applicant_id`).
- `AUTH-03`: Logout functionality clearing cookies.
- `AUTH-04`: Status-based post-auth redirect routing.
- `CRUD-01`: Create applicant record during onboarding.
- `CRUD-02`: Read/view saved applicant details.
- `CRUD-03`: Update/edit saved profile details and match expectations.
- `CRUD-04`: Delete/withdraw applicant profile and reset data.
- `BACKEND-01`: Node.js Next.js App Router route handlers.
- `BACKEND-02`: MongoDB via Mongoose with schema validation and fallback handling.
- `BACKEND-03`: Standardized JSON API responses and error handling.

---

## Execution Waves

### Wave 1: Data Model, Storage Driver & CRUD APIs
*Dependencies: None*

- [ ] **Task 1: Update Mongoose Model Schema**
  - **File**: `models/Applicant.js`
  - Add `contactType` (`enum: ['phone', 'instagram', 'whatsapp', 'twitter', 'telegram', 'email']`, default `'instagram'`).
  - Add `photo` (string URL or avatar ID, default preset).
  - Add `expectations` (string, max 1000 characters).
  - Preserve existing fields: `name`, `contact`, `pitch`, `status`, `appliedAt`, `decidedAt`, `decisionNote`.

- [ ] **Task 2: Extend Database Service in `lib/db.js`**
  - **File**: `lib/db.js`
  - Implement `delete(id)` method for both MongoDB and JSON fallback store.
  - Ensure `update(id, updates)` supports all new fields (`contactType`, `photo`, `expectations`).

- [ ] **Task 3: Refactor Authentication Route (`app/api/auth/route.js`)**
  - **File**: `app/api/auth/route.js`
  - In `POST`: Validate `name`, `contactType`, `contact`, `photo`, `expectations`. Save or update document and set `applicant_id` cookie.
  - In `GET`: Return active authenticated applicant object with all fields.
  - In `DELETE`: Clear `applicant_id` cookie to perform session logout.

- [ ] **Task 4: Create Profile CRUD Route (`app/api/profile/route.js`)**
  - **File**: `app/api/profile/route.js`
  - `GET`: Return current logged-in applicant details.
  - `PUT`: Validate and update profile fields (`name`, `contactType`, `contact`, `photo`, `expectations`).
  - `DELETE`: Delete applicant from MongoDB and clear session cookie.

---

### Wave 2: Frontend Registration & Profile Management UI
*Dependencies: Wave 1*

- [ ] **Task 5: Refactor Login & Registration Page**
  - **File**: `app/login/page.jsx`
  - Add Contact Type Selector dropdown (Phone, Instagram, WhatsApp, Twitter/X, Telegram, Email) with matching icons.
  - Add Dynamic Contact Input with adaptive placeholder based on selected channel.
  - Add Avatar / Photo Selector (grid of modern illustrated avatars + custom image URL option).
  - Add Match Expectations textarea with helper prompt ("What are your green flags and expectations from our match?").
  - Handle form submission, loading state, error alerts, and redirect routing.

- [ ] **Task 6: Create Interactive Profile Drawer / Modal Component**
  - **File**: `components/ProfileModal.jsx`
  - Build slide-over or modal dialog with:
    - Current applicant photo/avatar preview.
    - View mode: Name, contact badge, expectations, application status indicator.
    - Edit mode: Interactive form allowing live modification of name, contact type, handle, avatar, and expectations with Save & Cancel buttons.
    - Danger zone: "Withdraw Application / Delete Profile" button with confirmation prompt.
    - "Log Out" action button that calls `DELETE /api/auth` and redirects to `/login`.

- [ ] **Task 7: Automated Phase 1 Verification Test**
  - **File**: `scripts/test-phase1-crud.js`
  - Node.js test script verifying:
    1. Registration with contactType, photo, and expectations.
    2. Session retrieval via `GET /api/auth`.
    3. Profile update via `PUT /api/profile`.
    4. Profile deletion via `DELETE /api/profile`.
    5. Logout via `DELETE /api/auth`.

---

## Verification & Acceptance Criteria
1. **Registration Test**: A new user can register by entering Name, selecting Contact Type (e.g., Phone or Instagram), entering their handle/number, picking an avatar, and typing match expectations.
2. **Session Persistence**: Refreshing the page keeps the user authenticated.
3. **View Saved Details**: The user can open the profile modal and see their submitted info.
4. **Update Saved Details**: Editing any field in the profile modal updates the database immediately.
5. **Delete / Withdraw**: Clicking delete removes the record from the database, clears the cookie, and redirects to login.
6. **Logout**: Clicking logout clears the session cookie and returns the user to the login screen.
