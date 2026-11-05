# 💘 Reverse Dating Web Application

A personalized, full-stack personal portfolio where visitors inspect your life lore, music taste, dealbreakers, and green flags, and submit an application to match.

- **Acceptance Flow:** If accepted, unlocks a VIP page with your Instagram, WhatsApp, Spotify playlist, and coffee scheduling link.
- **Rejection Flow:** If rejected, redirects to a humorous custom "Error 404: Love Not Found" screen complete with a mock dev debug trace.
- **Real-Time Notification:** Sends an instant Telegram alert straight to your phone whenever someone applies.
- **Admin Review Panel:** Protected `/admin` control room to view, accept, and reject applicants with one click.

---

## 🛠 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Database & ODM:** MongoDB via Mongoose (with connection pooling)
- **Styling:** Tailwind CSS (Dark aesthetic + glassmorphism + custom glowing mesh)
- **Animations:** Framer Motion + Canvas Confetti
- **Icons:** Lucide React
- **Webhooks:** Telegram Bot API

---

## 🚀 Quick Start Guide

### 1. Set Workspace & Enter Project Directory
```bash
cd "C:\Users\Pruthvuraj S\.gemini\antigravity\scratch\reverse-dating"
```

### 2. Configure Environment Variables
Open `.env.local` and configure your settings:
```ini
# MongoDB Connection URL (Local MongoDB or MongoDB Atlas)
MONGODB_URI=mongodb://localhost:27017/reverse_dating

# Telegram Instant Notifications
# 1. Message @BotFather on Telegram -> /newbot -> copy bot token
# 2. Message @userinfobot to get your Telegram user ID (chat_id)
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id_here

# Admin Review Panel Secret Key
ADMIN_SECRET=loveadmin123

# Profile / Unlocked Socials for Accepted Matches
NEXT_PUBLIC_OWNER_NAME=Alex
NEXT_PUBLIC_INSTAGRAM=https://instagram.com/your_handle
NEXT_PUBLIC_TWITTER=https://x.com/your_handle
NEXT_PUBLIC_SPOTIFY=https://open.spotify.com
NEXT_PUBLIC_WHATSAPP=https://wa.me/1234567890
NEXT_PUBLIC_CALENDLY=https://calendly.com
```
*(Note: If Telegram credentials are left blank during development, the application gracefully skips the webhook and logs application details directly to the console).*

### 3. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📂 Key File Map

| Path | Purpose |
| --- | --- |
| `models/Applicant.js` | Mongoose schema tracking applicant status (`viewing`, `pending`, `accepted`, `rejected`) |
| `lib/mongodb.js` | Cached Mongoose database connection helper for Next.js App Router |
| `lib/telegram.js` | Telegram Bot API notification utility sending instant match alerts |
| `app/login/page.jsx` | Visitor check-in and credentials onboarding |
| `app/dashboard/page.jsx` | Bento grid pitch deck, soundtrack player, and sticky "Apply to Match" CTA |
| `app/api/apply/route.js` | Match submission endpoint setting status to `pending` and firing Telegram alert |
| `app/api/auth/route.js` | Visitor registration and session check route |
| `app/api/admin/route.js` | Protected review actions (`accept`, `reject`, `reset`) |
| `app/admin/page.jsx` | Owner review panel with real-time stats and decision action buttons |
| `app/status/404-rejected/page.jsx` | Humorous custom 404 Love Not Found screen with diagnostic terminal |
| `app/status/accepted/page.jsx` | VIP unlocked card with confetti cannon and direct social media handles |
