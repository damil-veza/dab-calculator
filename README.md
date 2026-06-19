# Agency Valuation Calculator

A web-based Agency Valuation Calculator built on the Lang Method. Gives agency owners a credible enterprise value estimate in under three minutes, shows what is helping and hurting value, and routes them into the DAB ecosystem.

## Tech Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS 4**
- **Prisma + SQLite** (MVP database; swap to PostgreSQL for production)
- **Framer Motion** (live multiple ticker)

## Getting Started

```bash
npm install
npm run db:push
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Run Golden Test Case

```bash
npm test
```

Golden case 1 (Agency X from the spec) must reproduce exactly:
- Matrix: 7.0x
- Final multiple: 3.25x
- Current EV: $1.95M
- Potential: 7.25x / $4.35M
- Gap: $2.40M

## Project Structure

```
src/
├── app/                  # Pages and API routes
├── components/           # UI, calculator flow, results
├── config/valuation.json # Algorithm config (admin-editable at launch)
└── lib/valuation/        # Calculation engine
```

## MVP Scope

**Included:**
- Config-driven valuation algorithm (v3)
- Three-stage flow: Hook → Diagnostic → Reveal gate
- Live multiple ticker during diagnostic
- Full results page: value range, gap, matrix, heatmap, waterfall, recommendations
- SQLite persistence with shareable results URLs (90-day expiry)
- Brand styling per DAB style guide

**Deferred (Phase 4+):**
- Admin panel
- PDF email delivery
- CRM/ESP webhooks
- Slack notifications
- SMS delivery
- Analytics events

## Environment

Copy `.env` and set:

```
DATABASE_URL="file:./dev.db"
```

## Disclaimer

Educational estimate only. Not a formal business valuation, appraisal, or offer.
