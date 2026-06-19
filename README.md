# Agency Valuation Calculator

A web-based Agency Valuation Calculator built on the Lang Method. Gives agency owners a credible enterprise value estimate in under three minutes, shows what is helping and hurting value, and routes them into the DAB ecosystem.

## Tech Stack

- **Next.js 15** (App Router) — frontend + API routes on Vercel
- **TypeScript**
- **Tailwind CSS 4**
- **Prisma + PostgreSQL (Neon)** — submissions database
- **Framer Motion** (live multiple ticker)

## Deploy to Vercel + Neon

### 1. Create a Neon database (free)

1. Go to [neon.tech](https://neon.tech) and sign up.
2. Create a project (e.g. `dab-calculator`).
3. Copy both connection strings from the dashboard:
   - **Pooled** → use as `DATABASE_URL`
   - **Direct** → use as `DIRECT_URL`

### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub.
2. Click **Add New → Project**.
3. Import `damil-veza/dab-calculator`.
4. Under **Environment Variables**, add:

   | Name | Value |
   |------|-------|
   | `DATABASE_URL` | Neon **pooled** connection string |
   | `DIRECT_URL` | Neon **direct** connection string |

5. Click **Deploy**.

Vercel runs `vercel-build`, which applies Prisma migrations and builds Next.js. Your API (`/api/submit`) and results pages run as serverless functions on the same deployment.

### 3. Verify

1. Open your Vercel URL (e.g. `https://dab-calculator.vercel.app`).
2. Complete the calculator flow.
3. Confirm you land on a `/results/[token]` page (database write succeeded).

## Local development

```bash
cp .env.example .env
# Paste your Neon connection strings into .env

npm install
npm run db:migrate
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Run golden test case

```bash
npm test
```

Golden case 1 (Agency X from the spec) must reproduce exactly:
- Matrix: 7.0x
- Final multiple: 3.25x
- Current EV: $1.95M
- Potential: 7.25x / $4.35M
- Gap: $2.40M

## Project structure

```
src/
├── app/                    # Pages and API routes
├── components/             # UI, calculator flow, results
├── config/valuation.config.ts
└── lib/valuation/          # Calculation engine
prisma/
└── migrations/             # Database schema
```

## MVP scope

**Included:**
- Config-driven valuation algorithm (v3)
- Three-stage flow: Hook → Diagnostic → Reveal gate
- Live multiple ticker during diagnostic
- Full results page: value range, gap, matrix, heatmap, waterfall, recommendations
- PostgreSQL persistence with shareable results URLs (90-day expiry)
- Brand styling per DAB style guide

**Deferred (Phase 4+):**
- Admin panel
- PDF email delivery
- CRM/ESP webhooks
- Slack notifications
- SMS delivery
- Analytics events

## Disclaimer

Educational estimate only. Not a formal business valuation, appraisal, or offer.
