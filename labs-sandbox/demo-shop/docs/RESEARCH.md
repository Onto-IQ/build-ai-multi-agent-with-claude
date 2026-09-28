# RESEARCH — handoff to backend / frontend / writer (T1)

Scope of this note: what `server.js` **actually does** today (line refs are to the current
file, 204 lines), what `PRODUCT-SPEC.md` v1 gets wrong or leaves open, and what a 5-page
demo storefront needs to look credible under §0's zero-dependency rule.

Reference data produced by this task: `data/products.mock.json` (12 items — ids 1–5 are
copies of `data/products.json`, ids 6–12 are new). It is **copy/frontend reference only**;
the server still reads `data/products.json` (5 items) and nothing may change that.
**Consequence for the writer and frontend: never assume more than 5 products exist at
runtime, and never key copy on ids 6–12.**

---

## 1. Endpoint-by-endpoint: spec vs code

### 1.1 `GET /api/products` — `server.js:86-90`

```js
const limit = Number(url.searchParams.get('limit') || products.length);   // :87
const items = products.slice(0, limit);                                    // :88
```

Verified behaviour of the `limit` param (all of these return **200**, never 400):

| Query | `Number(...)` | `slice(0, ·)` result |
|---|---|---|
| *(absent)* or `?limit=` | `5` (falsy-string fallback on `:87`) | all 5 |
| `?limit=2` | `2` | 2 |
| `?limit=999` | `999` | all 5 (slice clamps) |
| `?limit=abc` / `?limit=NaN` | `NaN` | **`[]`** — `count: 0` |
| `?limit=-1` | `-1` | **4** — negative end means "drop last N". Silently wrong, not empty |
| `?limit=0` | `0` (`'0'` is a truthy *string*, so `||` does **not** rescue it) | `[]` |
| `?limit=2.7` | `2.7` | 2 — truncated |
| `?limit=2&limit=3` | first value → `2` | 2 |

- **Spec defect (S1):** §7 lists only the NaN case. `?limit=-1` is worse — it returns a
  *plausible-looking short list* with no error. §3's failure column says "—", which is
  correct (there is no failure mode) but misleading: bad input is never rejected.
- **Recommended resolution (do not fix the server — §5 forbids touching `/api/*`):**
  spec should instruct the frontend to **never send `?limit`**. Home page slices the full
  list in JS (`items.slice(0, 4)`). This removes the whole class of bug from the demo and
  keeps the gate green. If the Leader wants the param to survive in the spec, document the
  table above verbatim.
- Order is file order; `POST /api/products` appends (`:133`), so "first 4" = ids 1–4 and is
  stable across restarts. Safe for the home page.
- Response is `{count, items}` with `count === items.length`. 200 only.

### 1.2 `GET /api/products/:id` — `server.js:92-97`

```js
if (url.pathname.startsWith('/api/products/') && req.method === 'GET') {   // :92
  const id = Number(url.pathname.split('/').pop());                        // :93
  ...
  if (!item) return sendJson(res, 404, errorBody('NOT_FOUND', `no product with id ${id}`, []));  // :95
```

- Hit → 200 with the **bare object** `{id,name,price,stock}`, no wrapper. Matches §3. ✓
- Miss → 404 + full §4 envelope with `details: []`. **This means DESIGN.md §6.2's note
  ("sibling GET-by-id answers with 200 `{error:'not found'}`", citing `server.js:36`) is
  stale, and §7 doesn't list it as a live defect either.** Gate case-3 passes *because* of
  line 95. **S2: strike that claim from the spec.**
- `Number()` coercion is the real surface here. The path segment is parsed as a JS
  Number-literal, not as a decimal id:
  - `/api/products/abc`, `/api/products/1/extra` (`.pop()` → `'extra'`), `/api/products/`
    (`.pop()` → `''` → `0`) → all **404**, with messages `no product with id NaN`,
    `... id NaN`, `... id 0`.
  - **`/api/products/5.0` → id 5 (200). `/api/products/+5` → 5. `/api/products/ 5 ` → 5.**
  - **Exponential and hex are live: `/api/products/1e1` → id 10, `/api/products/0x11` →
    id 17.** With the 12-item mock in play (never in the real fixture) `1e1` is a genuine
    hit. Flag as curiosity, not a bug to fix.
- **S3 (spec must state):** the frontend must parse `:id` itself with
  `Number.parseInt(segment, 10)` + `Number.isInteger(id) && id > 0`, and must **not**
  render the server's `error.message` verbatim on the product page — `"no product with id
  NaN"` is not demo copy. Use a page-local 404 state; the envelope is for logging only.

### 1.3 `POST /api/products` — `server.js:99-145`

Conforms to DESIGN.md. Verified: 201 + `Location: /api/products/<newId>` (`:134-137`),
`BODY_TOO_LARGE` 400 at `:105-108` with the `responded` guard (`:103`, `:111`),
`INVALID_JSON` for unparseable **and** for `null`/array/scalar (`:114-122`),
`VALIDATION_FAILED` collecting every rule (`:124-127`), id = max+1 (`:131`), push is
in-memory (`:133`), guarded 500 (`:139-142`).

Two things §3/§2 get wrong:

- **S4 — `price` is not required to be an integer.** V3 (`:49-57`) only checks
  `typeof === 'number'`, `> 0`, `≤ 1e6`. `{"price": 199.5}` is accepted and stored, while
  §2 asserts "integer THB, satang-free, no decimals anywhere". Since §5 forbids touching
  the validator, the spec must choose: (a) weaken §2 to "integer *by convention*",
  downstream rounds; or (b) keep §2 and put the burden on `formatTHB`/backend rounding.
  Recommendation: **(a) + round at render time**, and say so in §2.
- **S5 — no `name` uniqueness, and `name` is trimmed before storage** (`:130`). DESIGN.md
  §8 documents both; §3's table does not. Also `POST /api/products/` (trailing slash) falls
  to `:147-149` → 404 `NOT_FOUND`, not 201.
- **S6 — this endpoint is the only one with a body-size cap.** See 1.4.
- **S7 — a client aborting mid-upload has no `req.on('error')` listener** on either POST
  handler. An `IncomingMessage` error with no listener surfaces as `uncaughtException` and
  can take the process down — which is exactly what gate case-2 is guarding against, but
  the gate only sends a short complete body so it never exercises this. Record in §7 as a
  known limitation; **do not** let backend "fix" it under §5's "no touched `/api/*` line".

### 1.4 `POST /api/cart/total` — `server.js:151-187`

The most under-specified endpoint in the contract, and the one frontend depends on most.

- **No quantity field exists.** `itemIds` is a flat `number[]` and the loop (`:172-178`)
  adds one unit per **array element**, so `[4,4,4]` = 3 hoodies and `[4]` = 1.
  **S8: §3 must state the repetition convention explicitly**, or the frontend will invent
  `[{id, qty}]` and get 400/404. Cart store shape recommendation: keep a `qty` per line for
  display, and **expand to repeated ids on the wire** (`ids.push(...Array(qty).fill(id))`).
- Unknown id → **404 on the first miss** (`:174-176`), aborting the whole total. This is
  the *stale cart* case (§1.5 below): one dead id breaks the entire cart page.
- `itemIds: []` → **200 `{total: 0}`**. Not an error. Relevant to AC-6 / §1's
  "`#cart-total` written only from the server total": the frontend should **always call**,
  even with an empty cart, so the div is never stale and never client-computed.
  **S9: make that an explicit instruction**, otherwise two plausible readings of the spec
  give two different implementations.
- Not an array → 400 `VALIDATION_FAILED` / `TYPE_ARRAY` (`:164-168`). Missing body,
  `null`, array-as-body, `[]`-body → 400 `INVALID_JSON` (`:155-163`).
- **No size cap and no `responded` guard here** (`:153` accumulates unbounded). DESIGN.md
  §7's 8192-byte rule is only implemented for `/api/products`. Spec should note the asymmetry.
- **`discountPercent` is coerced, not validated** (`:179`): `Number(body.discountPercent)`.

  | Sent | Effective |
  |---|---|
  | absent / `null` / `0` / `"abc"` / `{}` | skipped (NaN or 0) |
  | `"15"` (string) | **15% applied** |
  | `true` | **`Number(true) === 1` → 1% applied** |
  | `-50` | clamped to 0 |
  | `500` | clamped to 100 → `total: 0` |

  Clamp ordering at `:181` (`min(100, max(0, x))`) is actually **correct**; §7's "trusts
  clamp ordering" is only true in the sense that *coercion happens before validation*, so
  `"15"` and `true` both silently discount. §3 should say `discountPercent` is
  "number-or-numeric-string, clamped to 0–100, otherwise ignored".
- **S10 — `total` is a float, and the spec's AC-8 assumes it isn't.** `210 - 15% = 178.5`;
  `12` items with a 12.5% discount produce more. No rounding happens anywhere server-side.
  Decide the owner now: **round in the presentation layer** (`formatTHB`), and have §8 of
  the spec say "server `total` may be fractional; `formatTHB` rounds half-up to whole THB".
- **Response has no breakdown** — only `{total}`. Any "you saved ฿X" or "subtotal /
  discount / total" line is impossible without arithmetic. AC-6 forbids browser-side price
  math. **S11 — sanctioned workaround: call the endpoint twice**, once with the discount
  and once without, and render the difference. Both numbers stay server-computed. Put this
  in §3 if the copy wants a savings line; otherwise tell the writer to drop it.
- `GET /api/cart/total` is not a route → falls through to the hello catch-all (`:198`) with
  **200**, not 405.

### 1.5 `GET /api/admin/stats` — `server.js:189-196`

- Bad/absent token → **200 `{error:'unauthorized'}`** (`:191`) — a flat string, **not** the
  §4 envelope. **S12: §4's "`details` always present" is not universal** (nor does the hello
  catch-all conform). Scope §4 to `/api/products*` + `/api/cart/total` and stop calling it
  the contract for all failures.
- `avgPrice` = `sum / length` (`:194`) → unrounded float. With the shipped fixture it is
  exactly `398` (1990/5); in general expect `398.00000000000006`-style output.
- **§7 says "`avgPrice` → `NaN` on empty catalog" — on the wire it is `null`, not `NaN`**,
  because `JSON.stringify(NaN) === 'null'` (`:21`). Anyone probing this with `curl` sees
  `null` and reports the gate note as wrong. Fix the wording in §7.
- Token is in a query string, so it lands in any access log; `ADMIN_TOKEN` is hardcoded at
  `:13`. Frontend must **never call this endpoint** — nothing in §1 needs it.

### 1.6 Page + asset routes — **nothing exists**

There is no static handler: `/`, `/products`, `/cart`, `/styles.css`, `/app.js`, and even
`/favicon.ico` all currently return **200 `application/json` `{hello:...}`** (`:198`).
So AC-2 and AC-3 are structurally impossible before T3 lands, and **the frontend cannot
smoke-test in a browser until the backend handler exists.** Sequence note for the Leader:
T3 and T4 are parallel-safe on files but not on integration; if T4 finishes first it can
only verify by opening files with a second static server or by deferring browser checks.

---

## 2. Feature notes for a credible 5-page demo

The constraint set (no frameworks, no CDN, **no binary image assets**, no npm) is what
decides what "looks real". Placeholder art must be generated, not fetched.

### MUST

1. **Four templates + two shared files**, exactly as §1: `index.html`, `products.html`,
   `product.html`, `cart.html`, `app.js`, `styles.css`.
2. **Absolute asset URLs** — `<link rel="stylesheet" href="/styles.css">`,
   `<script src="/app.js" defer></script>`. On `/product/1` a relative `styles.css`
   resolves to `/product/styles.css`. **S13: state this in §5**; it is the single most
   likely cause of an unstyled page 4 that still returns 200 HTML and passes AC-2.
3. **`<meta charset="utf-8">` first byte of `<head>`**, and files saved **UTF-8 without
   BOM**. AC-8's `฿` is U+0E3F; a wrong encoding renders `à¸¿` or `?`, and a Windows BOM
   renders `ï»¿` before `<!DOCTYPE` and can push the doc into quirks mode. Writing these
   files on win32 through a shell heredoc is where this actually goes wrong.
4. **Generated product art**: CSS-only placeholder derived from the name (initials tile,
   deterministic hue from `id`, or an inline `data:image/svg+xml` built in JS). Zero bytes
   of binary assets, zero CDN, and it reads as designed rather than broken.
   `web/**` may not contain product data (AC-5) — so initials must come from the API
   response at runtime, never baked into CSS.
5. **A `fetch` helper that checks `res.ok`.** `fetch` does **not** reject on 404/500; the
   default `r.json()` path will happily hand the caller `{error:{...}}` shaped like a
   product and the page renders `฿undefined`. One helper, three outcomes (ok / 404 /
   network), used by every page.
6. **Per-page empty / loading / error / not-found states.** Catalog empty, cart empty,
   detail 404, and "server unreachable" are the four screens a live demo always hits.
7. **Stock badge with three tiers** — in stock / low stock (`≤ 10`, e.g. mock id 10 with
   stock 8) / sold out (`0`, Add disabled). Badge text from `stock`, threshold in JS.
8. **`formatTHB`, deterministic and locale-free** — see §3.1 below.
9. **`data-page` on `<body>`** (`home|catalog|product|cart`) and exactly four `<nav>` links.
   A cart-count badge must live **inside** the existing `/cart` `<a>` — a second
   `/cart`-ish anchor can break the "exactly four links" check (AC-2).
10. **Single-writer rule for `#cart-total`** — only the POST response writes it, on every
    path including empty cart.
11. **Copy slots that match `docs/COPY.md` keys**, so the writer's output drops in without
    renaming ids.

### NICE (pick only what T4's budget allows)

- Skeleton rows while fetching (CSS shimmer) instead of a bare "Loading…".
- Quantity stepper in cart, using the repetition convention of §1.4.
- One **demo discount select** (0 / 10 / 15 %) — it is the only visible proof that the
  server computes money, and it justifies `POST /api/cart/total` existing. Use the
  double-call trick (S11) for a savings line.
- Client-side sort/filter over the *already-fetched* list (sort by price is not price
  arithmetic — safe under AC-6). No server search endpoint exists; do not fake one with a
  new `/api/*` path (AC-6 forbids it).
- Toast/inline confirmation on "Add to cart" plus a nav cart-count update.
- `<noscript>` line explaining the demo needs JS; a footer "demo data, in-memory, resets on
  restart" pre-empts the confusion POST-created products cause.
- a11y basics: visible focus ring, `aria-live="polite"` on the cart total and count,
  `<label>`ed select, `prefers-reduced-motion` guard, contrast-checked badges.
- Prev/next product links on the detail page (`id ± 1`, hidden at the ends) — cheap depth.
- `<link rel="icon" href="data:,">` to silence the `/favicon.ico` probe that otherwise
  logs a JSON hello.

### OUT-OF-SCOPE (call it out so nobody spends a turn on it)

- SPA router / History API pushState rewriting / any client framework, build step, or
  bundler — §0.
- Real images, icon fonts, webfonts from any CDN — §0. **Google Fonts is out.** Use a
  system stack with Thai-capable fallbacks (`'Leelawadee UI', 'Noto Sans Thai', …`).
- Checkout, payment, addresses, order confirmation, email.
- Persistence of any kind: no writing `data/products.json`, no DB, no cookie sessions.
  `localStorage` is the only store and it is client-side by design.
- Auth/login, an admin UI for `/api/admin/stats`, or anything that would put a token in
  `web/**` (§0).
- Server-rendered templates, `.ejs`/`.pug`, query params for product filtering, SSE/WebSocket.
- New endpoints or new verbs on existing ones (AC-6 restricts `app.js` to §3 paths; §5
  restricts backend to the static handler).
- i18n / language switcher, dark-mode toggle, tests beyond `quality-gate.js`, favicons as
  files, service worker/PWA.
- Wishlist, reviews, coupons, shipping estimate — all need endpoints that don't exist.

---

## 3. Risks & edge cases the frontend must handle

### 3.1 Price formatting (AC-8)

- Target string is exactly `฿1,234`: prefix `฿` (U+0E3F, **no space**), comma grouping,
  **no decimals**.
- `Intl.NumberFormat` is a JS built-in, not a dependency, so it is §0-legal — but its
  output is ICU/locale dependent (`th-TH` may fall back to `en` on a small-icu Node, and
  QA's Node is not your dev box). The deterministic choice is manual grouping:
  `฿` + `String(Math.round(Math.abs(n))).replace(/\B(?=(\d{3})+(?!\d))/g, ',')`.
  **Recommend the spec name this function body as the reference so AC-8 is checkable by
  grep rather than by opinion.**
- Guard the non-numbers: `null`/`undefined`/`NaN`/`''` from a failed fetch must never
  render `฿NaN`. Decide the fallback (`฿0` or `—`) and state it — QA will probe it.
- Round **half-up on the integer THB**, and round once, at render — not per line item, or
  the sum of rounded lines won't equal the rounded total and the cart will look buggy
  against `#cart-total`.
- Negatives: a discount ≥ 100 clamps to 100 → `total: 0` (never negative — verify the
  sign handling anyway).

### 3.2 Cart / storage

- **Empty cart**: show the empty state *and* still call `POST /api/cart/total` with `[]`
  (returns `200 {total:0}`) so `#cart-total` obeys the single-writer rule.
- **localStorage corruption**: anything other than a non-empty array of `{id:number,
  qty:number≥1}` must be discarded, not thrown on. Wrap `JSON.parse` in `try/catch`, then
  *validate shape*, then filter to numbers. A stored `qty: 1.5` silently inflates the
  repetition list.
- **Stale stock / stale ids**: the server never decrements `stock` on add-to-cart, and
  anything created via `POST /api/products` vanishes on restart (`:133`, DESIGN.md §8).
  A `[7, 99]` cart where 99 was a POSTed item means the **whole** total 404s (`:174-176`).
  Required behaviour: on 404, **prune the reported id and retry once**, then tell the user
  an item was removed. Cap `qty` at the freshly-`GET` stock on every page load. Never
  cache a price in `localStorage` — prices come from the API or the server total only
  (AC-5, AC-6).
- **Cross-tab drift**: `storage` event listener is a one-liner and prevents "my cart lost
  the mug".
- Multi-add de-dup must still round-trip through the repetition convention.

### 3.3 Product id paths

- `/product/abc`, `/product/`, `/product/0`, `/product/-3`, `/product/999999` → the client
  parses and shows a **not-found state without calling the API** for the obviously invalid
  forms, and treats a 404 envelope as the same state for the valid ones.
- Use `parseInt(segment, 10)` — `Number('1e1')` gives you 10 and `Number('5.0')` gives 5;
  neither is what a URL should mean (`:93` does use `Number`, so the *server* will happily
  answer `/api/products/1e1`. Don't mirror that leniency in the router.)
- Never render `error.message` from the API in the page body (S3).

### 3.4 Transport & lifecycle

- **Server not running / request fails** → `fetch` rejects. Every page needs a retry
  affordance; a blank catalogue with no message is the worst-looking failure a demo can
  have.
- **404 on an API path is not an exception** (see MUST-5). Same for the hello catch-all: if
  T3 hasn't landed, `GET /products` returns JSON 200 and the page will "load" with garbage.
  Detect it (assert `content-type` starts with `application/json` before `.json()`).
- **Race on quick navigation**: an in-flight `GET /api/products/1` resolving after the user
  clicked through to `/product/2` will overwrite the detail page. Guard with a request
  token / `AbortController`.
- `?limit` must simply never be sent (S1).

### 3.5 Backend-only static-handler risks (for T3)

- **Trailing slash**: `/products/` joins to `web/products` → `fs.readFile` on a directory
  → **EISDIR → 500**. Normalize trailing slash (or map it to the same file) and prove the
  404 path is reachable.
- **Percent-encoded traversal**: `url.pathname` is still percent-encoded (`%2e%2e%2f`), so
  it won't match a filesystem path — but a handler that decodes before joining is exposed.
  Probe set for QA: `/../server.js`, `/%2e%2e/server.js`, `/..%2fserver.js`,
  `/styles.css?x=../../server.js`, `/./../server.js`, and an absolute Windows path
  (`/D:/windows/win.ini`) for the `path.join` + `startsWith(webDir)` check.
- **AC-3's probe is weaker than it looks**: `new URL('/../server.js', base)` **normalizes
  to `/server.js` before the handler sees it**, so the naive probe tests the catch-all, not
  the traversal guard. **S14: tell QA what "pass" means** — any response that is not the
  server source, with 404 preferred — and add the encoded probes above.
- **Method**: restrict static serving to `GET`. `HEAD` (what `curl -I` sends) currently
  reaches the hello catch-all and answers 200 JSON; §5 is silent on HEAD, so decide it
  rather than let the branch order change by accident.
- **Non-string URL / empty pathname**: always non-empty for `new URL`, but `pathname`
  `'/'` must map to `index.html` explicitly — a `path.join(dir, '/')`-style bug yields the
  directory, hence EISDIR again.
- Keep the placement §5 demands (`:86-196` `/api/*` branches untouched, static block before
  `:198`) or gate cases 1–3 start failing on ordering alone.

---

## 4. Copy brief for `docs/COPY.md` (AC-7)

- The runtime fixture has **exactly 5 products, ids 1–5** — write blurbs for those five
  only, keyed by id; `data/products.mock.json` ids 6–12 are *tone reference* (what the
  brand sounds like if the catalog grows), never to be quoted as if live.
- Prices available to copy: 150 / 210 / 250 / 390 / 990 THB. Do not put prices in the copy
  file at all — AC-5 forbids hardcoded product data in `web/**`, and a price in copy drifts
  from the API on the first POST demo. Write around money ("under ฿500"-style claims are
  still claims; avoid them).
- Stock facts available: 12 hoodies, 25 workbooks, 40 posters, 60 mugs, 100 sticker packs.
  "Only 12 left" is true for id 4 today; prefer evergreen phrasing ("small run") so the
  line can't go stale.
- Needs, per page: `<title>` starting `Demo Shop`, hero/heading, ≤250-word body, 4 blurbs
  per page (from the 5), cart empty state, one CTA. Plus the small functional strings the
  frontend will otherwise invent badly: loading, error/no-connection, not-found, sold-out,
  removed-from-cart, add-to-cart confirmation.
- **S15: AC-7's "4 product blurbs keyed by existing ids 1–5" is ambiguous** — 4 of the 5,
  or the home page's 4 featured slots? Ask the Leader to reword to "blurbs for ids 1–5
  (one per product), of which ids 1–4 are featured on `/`".
- Voice: developer-in-joke but legible to a non-dev; English primary (the fixture names are
  English), a Thai CTA line is a nice credibility touch given THB pricing — the frontend
  must keep UTF-8 discipline (§3.1/MUST-3) for it.

---

## 5. Spec-defect roll-up (Leader: fold into v1.1)

| # | Where | Defect / ambiguity | Suggested resolution |
|---|---|---|---|
| S1 | §3, §7 | `?limit=-1` returns a plausible short list (not just the NaN case); bad input is never 400 | Frontend never sends `limit`; document the table |
| S2 | §7 / DESIGN §6.2 | Claim that GET-by-id returns 200 flat `{error:'not found'}` is stale — `server.js:95` is 404 + envelope | Delete the claim; it's what makes gate case-3 pass |
| S3 | §1, §4 | Nothing says the UI must not echo API `error.message` ("no product with id NaN") | Add a not-found-copy rule; envelope is log-only |
| S4 | §2 | "integer THB" is unenforced — `POST` accepts `199.5` (`:49-57`) | Weaken to convention + round at render |
| S8 | §3 | `itemIds` has no quantity; only repetition encodes N units | State the convention, give the cart store shape |
| S9 | §1, §6 | "`#cart-total` server-only" vs empty cart: must the call happen? | Always call with `[]` (200 `{total:0}`) |
| S10 | AC-8 | Server returns fractional `total` (`:179-184`) | AC-8 becomes "`formatTHB` renders whole THB"; round half-up once |
| S11 | §3 | `{total}` has no breakdown → no legal "you saved ฿X" | Sanction the double-call, or drop savings copy |
| S12 | §4 | Envelope is not universal: admin unauthorized, hello catch-all, non-GET verbs | Scope §4 to the `/api/products*` + `/api/cart/total` family |
| S13 | §5 | Relative-asset trap on `/product/:id` | Mandate absolute `/styles.css`, `/app.js` |
| S14 | AC-3 | `new URL` normalizes `/../server.js` → `/server.js`, so the probe tests the wrong thing | Define pass = "not server source"; add encoded probes |
| S15 | AC-7 | "4 blurbs keyed by ids 1–5" — 4 or 5? | "blurbs for ids 1–5; ids 1–4 featured" |
| S16 | §7 | `avgPrice` empty-catalog case is JSON `null`, not `NaN` (`:21`) | Reword §7 |
| S17 | §7 | `discountPercent` coercion (`"15"`, `true` → 1%) is the real clamp issue; clamp order itself is fine | Reword to "coerces before clamping" |
| S18 | §5 | Trailing slash → EISDIR → 500; `HEAD` undecided | Specify both |
| S19 | §7 | `req.on('error')` absent on both POST handlers → abort mid-upload can crash; cap exists only for `/api/products` | Record as known limitation; forbid a "fix" under §5 |
| S20 | §0/AC-5 vs AC-2 | Nav hardcodes `/product/1` while AC-5 bans hardcoded product data | Exempt nav route literals; ban product *text/prices* |
| S21 | §1 | "5-page" vs "all 4 pages" / AC-2's 4 routes (assets aren't pages) | Standardize: 4 routes, 4 templates, 2 assets |
| S22 | §1, §5 | No static handler exists yet (`:198` answers everything), so T4 cannot browser-test before T3 | Note the integration order; keep the file-ownership split |

---

## 6. Mock data notes (`data/products.mock.json`)

- ids 1–5 are byte-copied from `data/products.json` (same key order, same 2-space +
  `{ "id": … }` inline style) so a diff of the first 6 lines is clean.
- New items stay in the existing theme (prompting / agents / tooling in-jokes, apparel +
  desk + drink), integer THB in 120–2500, and deliberately include one low-stock luxury
  item (id 10, stock 8) and one mid-price drink (id 12) to exercise badge tiers and a
  price-curve. Range used: 260–1690.
- The server does **not** read this file. It is for the writer's tone and the frontend's
  design-time screenshots only.
