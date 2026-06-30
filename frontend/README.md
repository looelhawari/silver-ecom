# Fidda Silver — Storefront (Next.js)

The customer-facing storefront for the Fidda Silver e-commerce platform. Part of a
modular monolith — see the root [README](../README.md) and [ARCHITECTURE](../ARCHITECTURE.md).

- Next.js 16 (App Router, RSC) · React 19 · TypeScript
- Tailwind CSS v4 · shadcn/Radix · Motion · Lucide
- TanStack Query · Zustand · React Hook Form + Zod · Sonner
- next-intl (EN/AR, RTL-ready)

> ⚠️ This Next.js build has **non-standard conventions** (see [AGENTS.md](AGENTS.md)).
> Read `node_modules/next/dist/docs/` before adding framework-level code.

## Getting started

```bash
cp .env.example .env.local      # point NEXT_PUBLIC_API_URL at the Laravel API
npm install                     # already vendored in this repo
npm run dev                     # http://localhost:3000
```

The backend API must be running (default `http://localhost:8000/api/v1`).

## Configuration (white-label)

Branding is config-driven and mirrors the backend's `config/white_label.php`:

| File | Controls |
|------|----------|
| `src/config/storeConfig.ts` | Name, slogan, currency, contact, hero |
| `src/config/themeConfig.ts` | Theme presets (`silver-luxury` active) |
| `src/config/navigationConfig.ts` | Header nav + category strip |
| `src/config/footerConfig.ts` | Footer sections |
| `src/config/seoConfig.ts` | Title, description, keywords, OG image |
| `src/config/featureFlags.ts` | Optional features (wishlist, custom orders…) |
| `src/app/globals.css` | CSS variables for the active theme |
| `src/messages/{en,ar}.json` | i18n strings |

## Structure

```
src/
├── app/                # App Router (layout, page, globals.css)
├── components/         # layout/, storefront/, providers/, ui/
├── config/             # white-label configuration
├── i18n/               # locale routing (en/ar + directions)
├── lib/                # api.ts (typed fetch), utils
├── messages/           # i18n catalogs
├── stores/             # Zustand stores
└── types/              # shared TypeScript types
```

## Scripts
- `npm run dev` — dev server
- `npm run build` — production build
- `npm run start` — serve the build
- `npm run lint` — ESLint
