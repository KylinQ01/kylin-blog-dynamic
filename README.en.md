# Kylin Blog 🦄

**[简体中文](README.md)** | **[English](README.en.md)** | **[日本語](README.ja.md)** | **[한국어](README.ko.md)**

A dynamic blog with a fresh Japanese-inspired look — a full-stack Next.js implementation with a teal color scheme, glassmorphism cards, and a unified front end and admin panel.

## ✨ Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 16 (App Router) + React 19 |
| Backend | Next.js Route Handlers (API) |
| Database | SQLite + Prisma 7 + better-sqlite3 |
| Auth | JWT (httpOnly Cookie) |
| Styling | Tailwind CSS 4 + custom design system (CSS variables) |
| Language | TypeScript |

## 📦 Features

### Frontend
- **Home**: pinned posts, latest posts, and an aggregated activity feed
- **Post system**: list / detail / category / tag / archive, with pinning, password protection, and view counts
- **Moments**: publish and display short thoughts
- **Guestbook**: visitor comments (no sign-up required)
- **Friend links**: application-based friend link showcase
- **Albums**: organized by album, with cover images and image browsing
- **Profile**: About, sponsor, Bangumi anime tracking, music player, Type, and more
- **Widgets**: weather card (30-minute module-level cache that cuts external API requests)
- **Fresh Japanese-inspired design**: teal ambient glow background, card hover glow, gradient active navigation, and light/dark themes

### Admin Panel (`/admin`)
- JWT login authentication (httpOnly Cookie, expires in 1 hour)
- Dashboard: overview statistics
- Content management: create, read, update, and delete posts / moments / friend links / albums / comments
- Site settings: site name, subtitle, and description saved online (`data/settings.json`, 5-second cache)
- Image upload: runtime uploads served through the `/uploads/[filename]` route

## 🚀 Quick Start

```bash
# 1. Install dependencies (the native better-sqlite3 module needs a binary that matches your platform)
npm install

# 2. Initialize the database and generate the Prisma Client
npx prisma migrate dev --name init
npm run seed        # Optional: seed sample data

# 3. Configure environment variables
# Copy .env.example to .env and fill in DATABASE_URL and JWT_SECRET

# 4. Start the development server
npm run dev
```

Visit http://localhost:3000; the admin panel is at http://localhost:3000/admin.

## 📁 Directory Structure

```
src/
├── app/                 # App Router pages and API
│   ├── (public)/        # Public-facing pages
│   ├── admin/           # Admin panel (login + dashboard)
│   ├── api/             # REST API (posts/moments/friend links/albums/comments/settings/auth)
│   └── uploads/         # Runtime upload file serving
├── components/          # Components (layout, widgets, admin)
└── lib/                 # Utility libraries (prisma, auth, settings)
prisma/
├── schema.prisma        # Data models (User/Post/Moment/Friend/...)
└── seed.ts              # Sample data
data/settings.json       # Site settings (generated at runtime)
```

## 🔑 Environment Variables

| Variable | Description |
| --- | --- |
| `DATABASE_URL` | SQLite database connection (`file:./dev.db`) |
| `JWT_SECRET` | JWT signing secret |

## 🛠️ Production Deployment

```bash
npm run build
npm start        # Production mode, defaults to http://localhost:3000
```

> Note: production mode (`next start`) does not serve files added to `public/` at runtime; this project falls back to the dynamic `/uploads/[filename]` route.

## 📜 License

MIT License

---

*Kylin Blog — a fresh little corner for recording and sharing.*
