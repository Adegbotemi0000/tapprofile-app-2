# TapProfile

NFC/QR-based digital business card platform — tap or scan to share a profile instantly.

**Tech Stack:** Next.js 16 (App Router) · React 19 · Tailwind CSS v4 · Framer Motion · `qrcode`

**Last Updated:** 2026-08-30

## ✅ Completed
- Landing page (`app/page.js`)
- Dashboard UI (`app/dashboard/page.js`, 771 lines)
- Public profile page (`app/profile/[username]/page.js`, 673 lines)
- Profile setup flow (`app/profile-setup/page.js`, 1674 lines — the largest page in the app)
- Username claim flow (`app/username/page.js`, 1196 lines)
- Sign in / Sign up / Verify pages (UI only)
- Share page and a `TapDemo` component (simulated NFC tap interaction) plus a `ProfileCard` component
- Dark/light mode toggle on auth pages

## 🚧 In Progress
- Nothing appears actively mid-edit — this folder is a backup snapshot (`Tap profile Backup/`), last real commit was "Remove node_modules and .next from tracking"

## 📋 Next Steps
- Wire up a real backend: no database, auth provider, or API route was found anywhere in the app — every page (sign in, sign up, verify, dashboard, profile setup, username claim) runs on local React state only, so nothing persists or is actually functional end-to-end yet
- Add real authentication (sign in/sign up/verify currently have no auth logic behind the forms)
- Connect a data layer to actually save and serve profiles at `/profile/[username]`
- Replace the default `create-next-app` README with real project docs
- Decide whether this backup folder is the canonical copy or if there's a newer version elsewhere (folder name suggests it may not be)

## 🐛 Known Issues
- No backend/persistence layer of any kind (`grep` for Supabase/Firebase/Prisma/MongoDB/API routes returned nothing)
- No git remote configured — can't push
- Default Next.js placeholder assets (`file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg`) still in `public/`, unused
- `AGENTS.md` / `CLAUDE.md` present but not reviewed for currency in this pass

## 🔗 Links
- GitHub: _not yet connected_
- Deployed: _not deployed_
- Notion: https://app.notion.com/p/3cc2f05193ac81388074d332d238c2bf
- Repo path: C:\Users\xc\Desktop\Tap profile Backup\tapprofile
