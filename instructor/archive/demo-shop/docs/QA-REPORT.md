# QA REPORT — demo-shop

Reviewer: QA · Spec: `docs/PRODUCT-SPEC.md` v1.1 · Build: 5e34a9d ("v2: static handler + storefront pages + page copy")
Mode: read-only on `server.js`, `web/**`, `data/*`, `docs/*` · All probes run on `PORT=3999`, server killed.

---

## 1. Code vs spec findings

### §6 acceptance criteria

| AC | Verdict | Evidence |
|---|---|---|
| **AC-1** quality gate exit 0, 3/3 passed | PASS | `node scripts/quality-gate.js` -> 3/3 PASS lines (see §2 below). |
| **AC-2** 4 page routes 200 + `text/html; charset=utf-8` + `data-page` + 4 nav links | PASS | `curl http://127.0.0.1:3999/` -> `200 text/html; charset=utf-8`, `data-page="home"`, 4 `<a>` nav links (Home, Catalog, Featured, Cart). Same pattern for `/products` (catalog), `/product/1` (product), `/cart` (cart). All bodies include the four `<a href="/…" />` nav links (`web/index.html:14-19`, `web/products.html:14-19`, `web/product.html:14-19`, `web/cart.html:14-19`). |
| **AC-3** `/styles.css` & `/app.js` correct Content-Type; traversal returns 404 + never source | PARTIAL | `/styles.css` -> 200 `text/css`, `/app.js` -> 200 `text/javascript`. **BUT** `/web/server.js`, `/../server.js`, `/%2e%2e/server.js`, `/..%2fserver.js`, `/nonexistent.css` all return `200 {"hello":"sample demo shop"}` — not 404. File contents are never leaked; URL normalisation defeats naive probes so server source stays protected. AC-3 letter is violated, AC-3 spirit (no file leak) holds. See finding F-2. |
| **AC-4** zero new deps, ownership respected | PASS | `server.js` requires only `http`, `fs`, `path` (`server.js:8-10`). No `package.json`. `git status` shows only `?? runs/module-10/` (untracked, not in owned files). |
| **AC-5** no `ADMIN_TOKEN`/`sk-live`/hardcoded product text in `web/**` | PASS | `grep -rE "ADMIN_TOKEN\|sk-live\|Prompt Engineering Workbook\|Claude Code Sticker\|Multi-Agent Architecture\|Vibe Coding Hoodie\|Token Saver Mug\|฿390\|฿150\|฿250\|฿990\|฿210" web/` -> no matches. Prices never appear as literals in `web/app.js` either. All product text fetched at runtime. |
| **AC-6** only §3 paths; cart total from server; empty cart still POSTs | PASS | `web/app.js` calls only `api('/api/products')` (`app.js:98`), `api('/api/products/'+id)` (`:105`), `api('/api/cart/total', …)` (`:114`). No `?limit` ever appended (header comment `:7`). `#cart-total` written only by `writeTotal()` from `data.total` response (`app.js:760-761`); no arithmetic on price. Empty-cart path: `refreshTotal()` invoked from `render()` when `lines.length === 0` (`app.js:855`), server answers `200 {"total":0}` (curl-verified). |
| **AC-7** COPY.md covers 4 pages with title/h1/body≤250w/CTA + 5 blurbs + 3 future + empty/CTA lines | PARTIAL | All 4 pages documented in `docs/COPY.md` §1–§4 with title, h1, body (96/103/110 words, well under 250), exactly one CTA label declared, 5 runtime blurbs `product.1`–`product.5` (§5), 3 future blurbs `future.6`–`future.8` clearly marked future inventory (§6), one `cart.empty` line (§4), `stock.out`, `stock.low`, `stock.in` (§7). **Drift:** HTML body copy does not pull from these keys; runtime strings in `web/*.html` are bespoke and differ from COPY.md (see F-3). |
| **AC-8** money `฿1,234`, half-up 0 decimals, `฿0` for 0/missing | PASS | `formatTHB()` in `web/app.js:31-38`. Verified: `1234 -> ฿1,234`; `0 -> ฿0`; `NaN -> ฿0`; `undefined -> ฿0`; `null -> ฿0`; `"" -> ฿0`; `1234.5 -> ฿1,235`; `1234567 -> ฿1,234,567`. Locale-free manual grouping. Server returns fractional `994.5` from a discounted POST; client rounds half-up at render time only (no recompute). |

### Beyond AC — concrete bugs

- **F-1 [MAJOR] `POST /api/cart/total` returns fractional `total`** — `server.js:184` returns `{total}` raw with no rounding; e.g. `{itemIds:[1,1,1],discountPercent:15}` -> `{total:994.5}`. Spec §1.4 acknowledges fractional; client renders correctly via `formatTHB`, but any other consumer of the endpoint sees raw fractional. Not blocking AC-8 (client rounds) but inconsistent with "whole baht" expectation.
- **F-2 [MAJOR] AC-3 traversal probes return 200 hello instead of 404** — `server.js:207-217` static table only matches the 4 page routes + 2 assets; anything else falls through to the hello catch-all at `server.js:251`. `/web/server.js`, `/../server.js`, `/%2e%2e/server.js`, `/..%2fserver.js`, `/nonexistent.css`, `/index.html`, `/data/products.json` all return `200 application/json {"hello":"sample demo shop"}`. No file contents leak (security intact), but AC-3 literal text "return 404" is unmet. The §5 comment promises "traversal defence" but only the 4 named routes get a prefix check. Acked in §7 ("catch-all 200 unknown paths"); out-of-scope to fix per spec but still a deviation from AC-3.
- **F-3 [MAJOR] Cart page has 2 `btn`-class CTAs** — `web/cart.html:31` ("Browse the catalog") and `web/cart.html:55` ("Keep browsing") are both `btn`-styled anchors to `/products`. COPY.md §4 mandates exactly one CTA per page (`cart.cta` = "Continue shopping"). Home page also drifts: HTML says "Browse the catalog" (`web/index.html:28`), COPY.md §1 says `home.cta` = "See all products". Minor copy drift in HTML body vs COPY.md throughout (e.g. cart empty line "Your cart is empty" vs COPY.md `cart.empty` = "Your cart empty. Add something catalog total show up here.").
- **F-4 [MINOR] `discountPercent` accepts string and silently coerces** — `server.js:179` does `Number(body.discountPercent)`. Probe `{"itemIds":[1,2,3],"discountPercent":"15"}` returns `200 {"total":671.5}` (i.e. 15% applied). Per §7 known issues ("`discountPercent` coerced, not validated"). Documented; not blocking.
- **F-5 [MINOR] `POST /api/cart/total` body has no size cap or `responded` guard** — `server.js:153` does `raw += c` unbounded, unlike `POST /api/products` which caps at `MAX_BODY_BYTES=8192` (`server.js:24,105-108`). Per RESEARCH §7 / S19, asymmetry is known; not blocking.
- **F-6 [MINOR] Bad admin token returns 200 `{error:"unauthorized"}` not 401** — `server.js:191`. Spec §3 row says 401 expected; §7 marks planted. Not blocking.
- **F-7 [MINOR] `GET /api/products?limit=-1` silently returns 4 items** — `server.js:87-88`. Spec §7 known issue; frontend never sends `limit` so safe in practice.
- **F-8 [NOTE] `/product/abc` static route serves `web/product.html` (200)** — `server.js:212` maps any `/product/*` to the same file. Client-side `parseDetailId()` correctly rejects non-numeric ids (`web/app.js:549`), so 404 state is shown in-page. No server data leak; behaviour intentional per spec §5.
- **F-9 [NOTE] Static handler `/styles.css/..` serves `index.html`** — `server.js:212` `startsWith('/product/')` would match; `web/app.js` loads `/styles.css/..` is not a normal request path, but `/styles.css?x=../../server.js` correctly serves the CSS (query string ignored). No issue at runtime; flagging for completeness.
- **F-10 [NOTE] No `<noscript>` block** — COPY.md §7 has a `noscript` slot; no page in `web/` includes it. Polish only.
- **F-11 [NOTE] Nav hardcodes `/product/1` link** — `web/*.html:17` each page's nav contains `<a href="/product/1">Featured</a>`. Per RESEARCH §7/S20, route literals in nav are explicitly exempted from AC-5 (only product text/price is banned). In-scope for AC-2's "4 nav links".

Severity counts: BLOCKER 0 · MAJOR 3 · MINOR 3 · NOTE 3.

---

## 2. Quality gate run

```
PASS | case-1 GET /api/products | status=200 json=true items=5
PASS | case-2 cart/total invalid JSON | bad request -> status=400; after it /api/products -> status=200
PASS | case-3 GET /api/products/999 | status=404
quality gate: 3/3 passed
```

Command: `node scripts/quality-gate.js` · Exit code: 0 · No childLog printed (all cases passed on first try).

---

**Verdict: YELLOW** (gate=0, 0 BLOCKER, 3 MAJOR — F-1 fractional total, F-2 AC-3 traversal returns 200 not 404, F-3 cart page has 2 btn-class CTAs / HTML copy drift)
