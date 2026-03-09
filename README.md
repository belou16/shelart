# Shelart - Text to Oil Painting AI

**Tagline:** Your words. Masterpiece canvas.

Turn a short text prompt into realistic oil-style artwork using the free Hugging Face inference API.

## Quick Start

```bash
npm install
npm run dev
```

Open: `http://localhost:5173`

## 60-Second Local Setup

1. Clone the repo.
2. Create `.env` from `.env.example`.
3. Add your free Hugging Face key:

```env
VITE_HUGGINGFACE_API_KEY=hf_your_free_api_key_here
```

4. Run:

```bash
npm install && npm run dev
```

## Features

- Single input flow: `Describe your painting` -> `Generate`
- Fullscreen artwork stage with zoom/pan
- Quick actions: `Download HD`, `New Artwork`, `Gallery`
- Local history of last 12 creations (localStorage + IndexedDB blobs)
- Loading skeleton and generation state
- Mobile swipe navigation left/right between artworks
- Gallery with search + masonry-style 3 columns + progressive loading
- Apple-inspired dark UI with gold accent and glass cards
- Installable PWA manifest

The app calls a local backend route (`/api/generate`) so your key stays server-side.

## Free AI Integration

- Provider: Hugging Face Inference API (free tier)
- Model: `black-forest-labs/FLUX.1-schnell`
- Prompt template used:

```text
ultra realistic oil painting of [USER_TEXT], masterpiece, 8k, professional artist,
canvas texture, thick brush strokes, dramatic lighting.
negative prompt: blurry, lowres, text, watermark
```

## 100% Free Stack

- Frontend: React 18 + Vite + Tailwind CSS + Framer Motion
- AI: Hugging Face FLUX.1-schnell (free tier)
- Icons: Lucide React
- Storage: localStorage + IndexedDB
- Hosting: Vercel/Netlify free plans

No payments. No subscriptions.

## Deploy in 30 Seconds (Vercel)

1. Fork this repo.
2. Import project in Vercel.
3. Add env var in Vercel project settings:
	- `VITE_HUGGINGFACE_API_KEY`
	- Optional alias: `HUGGINGFACE_API_KEY`
4. Click Deploy.

Done. Example target domain: `shelart.vercel.app`

`vercel.json` is included for Vite framework detection.

## Mobile Screenshots

- Hero: `docs/screenshots/mobile-hero.svg`
- Result View: `docs/screenshots/mobile-result.svg`
- Gallery: `docs/screenshots/mobile-gallery.svg`

## Domain + Brand

- Product: Shelart
- Domain idea: `shelart.app`
- Favicon: golden brush stroke on black (`public/favicon.svg`)

## Scripts

- `npm run dev` - Start dev server
- `npm run build` - Production build
- `npm run preview` - Preview production build
