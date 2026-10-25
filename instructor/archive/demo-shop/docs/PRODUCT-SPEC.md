# PRODUCT-SPEC — demo-shop storefront (single source of truth)

Status: **v1.1** (Leader; amended with `docs/RESEARCH.md` findings — see §8 changelog).
All subagents — frontend, backend, writer, qa-reviewer — follow this
file exactly. Anything not specified here is out of scope for this build.
Companion: `docs/DESIGN.md` (already-implemented `POST /api/products` contract, still binding).

## 0. Hard constraints (every agent)

- **Zero dependencies.** Node built-ins only; no npm install, no framework, no CDN assets.
- **Do not break** the 3 cases in `scripts/quality-gate.js` (`GET /api/products` → 200
  with `items[]`; `POST /api/cart/total` bad JSON must not kill the process;
  `GET /api/products/999` → 404).
- **File ownership is exclusive** (parallel-safe):
  - backend → `server.js` only
  - frontend → `web/**` only
  - writer → `docs/COPY.md` only
  - qa-reviewer → read-only + runs the gate
- No edits to `data/products.json`, `scripts/quality-gate.js`, or this spec.
- Never surface `ADMIN_TOKEN` or any secret in `web/**`.

## 1. Pages (frontend deliverable, in `web/`)

| Route | File | Purpose |
|---|---|---|
| `/` | `web/index.html` | Home: hero, 4 featured products (first 4 of `/api/products`) |
| `/products` | `web/products.html` | Catalog: every product, price, stock badge, "View" + "Add to cart" |
| `/product/:id` | `web/product.html` | Detail for one id from `GET /api/products/:id`; 404 state if missing |
| `/cart` | `web/cart.html` | Cart from `localStorage` key `demo-shop.cart`; server-computed total |
| — | `web/app.js` | Shared: fetch helpers, cart store, `formatTHB`, nav render |
| — | `web/styles.css` | All styling, hand-written CSS |

Shared chrome on all 4 pages: `<title>` starting `Demo Shop`, and a
`<nav>` with exactly four links `/`, `/products`, `/product/1`, `/cart`.
Each page has a `data-page` attribute on `<body>` (`home|catalog|product|cart`) — hook for
`app.js` and for QA selectors. Cart page keeps a `<div id="cart-total">` whose text is
written **only** from the server `total`.

## 2. Data model

`Product = { id: number, name: string, price: number, stock: number }`
`price` is a **number of THB**. The server does *not* enforce integer prices on
`POST /api/products` (a fractional `199.5` passes validation), so `POST /api/cart/total`
can legitimately return a **fractional `total`**. The browser must never assume integers:
money is rendered by rounding **half-up to 0 decimals at render time only** (AC-8) — the
server value is never re-rounded or recomputed client-side.

`itemIds` is a **multiset**: there is no quantity field, so repeating an id N times is how
N units are expressed. The frontend cart store must therefore keep one entry per unit
(`[2,2,2]` = three of id 2), never a `{id: qty}` map it flattens wrongly.

Reference fixture: `data/products.mock.json` (12 items) is **copy/design reference only**.
The runtime server still serves the 5 items in `data/products.json`; nothing may assume 12.

## 3. API contract (server is the only source of truth)

| Method | Path | Request | Success | Failure |
|---|---|---|---|---|
| GET | `/api/products` | optional `?limit=N` | 200 `{count, items: Product[]}` | — |
| GET | `/api/products/:id` | — | 200 `Product` | 404 §4 envelope `NOT_FOUND` |
| POST | `/api/products` | `{name, price, stock}` | 201 `Product` + `Location` | §4 envelope (see DESIGN.md) |
| POST | `/api/cart/total` | `{itemIds: number[], discountPercent?: number}` | 200 `{total: number}` | 400/404 §4 envelope |
| GET | `/api/admin/stats` | `?token=` | 200 `{productCount, avgPrice}` | 200 `{error:'unauthorized'}` (unchanged) |
| GET | `/`, `/products`, `/product/:id`, `/cart` | — | 200 `text/html; charset=utf-8` | — |
| GET | `/styles.css`, `/app.js` | — | 200 + `Content-Type` per §5 | 404 plain |

## 4. Error envelope

`{ "error": { "code": "UPPER_SNAKE", "message": "human sentence", "details": [ { "field", "rule" } ] } }`
`details` always present, `[]` when nothing field-specific.

## 5. Backend deliverable (in `server.js`)

Add a **static handler**, placed **after** all `/api/*` branches and **before** the
existing `hello` catch-all, that maps the 4 page routes + 2 assets to files in `web/`.
- HTML → `Content-Type: text/html; charset=utf-8`; `.css` → `text/css`; `.js` →
  `text/javascript`; unknown extension under a page route → 404.
- Resolve against `path.join(__dirname, 'web', ...)`. **Reject `..`** and any resolved
  path escaping `web/` (404) — no path traversal.
- Read files with `fs.readFile` (async) and 500-log on error; never throw out of the handler.
- `/product/:id` serves the same `web/product.html` for any id (id parsed client-side).
- Everything else stays byte-identical: no touched `/api/*` line, no reordering.

**URL shape you must expect** (research-verified): `new URL()` normalises the request path,
so a browser/curl probe for `GET /../server.js` arrives as `/server.js` — traversal mostly
defends itself. Two consequences for the handler:
1. Do not rely on normalisation. Still check the resolved path prefix, because a raw
   `%2e%2e%2f` or a hand-built request can arrive un-normalised.
2. `/nonexistent.css` and `/api/nope` must keep falling through exactly as §3 says —
   `/api/nope` still reaches the `hello` catch-all (unchanged behaviour, do not "fix").

**Frontend note:** until T3 lands there is **no static handler**, so `web/**` cannot be
opened in a browser by the frontend agent. Build against §3 with absolute asset paths
(`/styles.css`, `/app.js`) and verify by reading your own files + `node -c` style syntax
checks, not by curl. QA does the live browser-level checks after T3.

## 6. Acceptance criteria

- **AC-1** `node scripts/quality-gate.js` → exit 0, `quality gate: 3/3 passed`.
- **AC-2** The 4 page routes return 200 + `text/html; charset=utf-8`, each `<body>` carrying
  its `data-page`, and each containing all four nav links.
- **AC-3** `/styles.css` and `/app.js` return 200 with correct `Content-Type`; `GET /web/server.js`
  and any request whose resolved path escapes `web/` return 404 and never file contents.
- **AC-4** Zero new dependencies; `git diff --stat` shows changes only in the owned files.
- **AC-5** `web/**` contains no `ADMIN_TOKEN` / `sk-live` string and no hardcoded product
  data — all product text comes from the API.
- **AC-6** `web/app.js` calls only §3 paths; cart total comes from `POST /api/cart/total`
  (no browser-side price arithmetic). With an empty cart, still call the endpoint with
  `itemIds: []` and render the server's `0` — the server is the single writer of totals.
- **AC-7** `docs/COPY.md` covers all 4 pages: title, hero/heading, body copy ≤250 words per
  page, **5 product blurbs keyed by id 1–5** (the runtime fixture) plus **3 optional blurbs
  for ids 6–8 drawn from `data/products.mock.json`** clearly marked as future inventory,
  a cart empty-state line, and one CTA per page.
- **AC-8** Money renders `฿1,234`: thousands separator, **half-up rounded to 0 decimals at
  render time**, no decimals shown, `฿0` (not `฿`, not `NaN`) for a zero or missing value.

## 7. Known issues for QA to flag (do not fix unless blocking)

Planted/legacy, **out of scope this build**: hardcoded `ADMIN_TOKEN` in `server.js`; bad
admin token answered with 200 not 401; `?limit=abc` → `NaN` → `slice(0, NaN)` → silently
empty list; `?limit=-1` → `slice(0, -1)` → a *plausible-looking short list* (worse than an
error — the frontend must therefore **never send `limit`**); `avgPrice` is `null` on an
empty catalog (division by zero is guarded, not NaN); non-integer `price` accepted;
in-memory `POST /api/products` lost on restart; catch-all 200 for unknown paths.
`docs/DESIGN.md` §6.2/§7 is **stale** on one point: it says GET-by-id answers a miss with
`200 {error:'not found'}`, but `server.js:95` already returns `404` + envelope (which is
why gate case-3 passes). Trust the code, not that paragraph.

## 8. Changelog

- **v1** Leader: initial contract (pages, API, acceptance criteria).
- **v1.1** Leader, from `docs/RESEARCH.md`: fractional-price render rule (AC-8); `itemIds`
  multiset/quantity semantics; empty-cart calls the server; frontend must not send `limit`;
  AC-3 traversal probe replaced with a normalisation-proof version; AC-7 blurbs disambiguated
  (5 runtime + 3 marked future); explicit note that no static handler exists before T3 so
  frontend cannot browser-test; DESIGN.md §6.2 staleness recorded.
