# TEAMS-REVIEW — Registry Insight (Workshop 1 Part B)

## agreement

- Runtime entry is `server.js`; flat table is `data/dataset.csv`; gate is `scripts/quality-gate.js`.
- Gate still fails on starter data (`bad-seq`, `bad-reg-date` and related checks in `data/README.md`).
- `/api/summary` CSV split and unguarded `JSON.parse` on `POST /api/notes` in `server.js` are real risks.

## disputed

- Severity of `GET /api/health` sample `sk-` leak vs notes crash: devil-advocate ranks notes higher for process death (`server.js` POST handler) than a demo health payload.
- “ทุกแถวใน CSV พังเท่ากัน” overstates — structure-scout notes only gated bad rows matter for Workshop 3 cleaning order.

## next sequential step

Design a cleaner for gated violations first, then fix `/api/summary` parse and `/api/notes` try/catch — do not parallelize clean + API edits until PRODUCT-SPEC / plan exists (Workshop 3).
