# COPY — page copy for the demo-shop storefront (T5 / AC-7)

Status: **v1** (writer). Contract: `docs/PRODUCT-SPEC.md` v1.1 §1 (pages), §2 (data model),
§6 **AC-7** (this file) and **AC-8** (money format). Tone: concise developer-merch, warm,
not salesy. Audience: Thai dev-workshop attendees. English primary, short sentences,
translation-friendly.

## 0. How the frontend uses this file

- **Paste-in reference, not a data source.** Product names, prices and stock always render
  from the API at runtime. `web/**` must contain **no** hardcoded product text or price
  (AC-5) — the price strings below are written only so you can see which format to use.
- **Money format (AC-8):** `฿` immediately followed by whole baht with comma grouping,
  no decimals, `฿0` for a zero or missing value. Every price and every total goes through
  `formatTHB` at render time. The runtime fixture's five prices render as `฿390`, `฿150`,
  `฿250`, `฿990`, `฿210`.
- **Slot keys** are stable — drop text in, do not rename keys:
  `<page>.title`, `<page>.h1`, `<page>.body`, `<page>.cta`, `product.<id>`,
  `cart.empty`, `stock.out`.
- **Exactly one CTA label per page** (AC-7). Anything else clickable is a plain link or a
  row control, called out as such below.
- **Nothing invented:** no discounts, coupons or savings claims, no shipping or delivery
  promises, no returns/guarantees, no checkout, no ordering of any kind. There is no
  account, and no back-of-house screen is ever mentioned to a shopper.
- Stock wording stays evergreen ("small run", "almost gone") so a line cannot go stale when
  the demo server restarts or a product is added live.

---

## 1. Home — `/` (`web/index.html`, `data-page="home"`)

- **`<title>`:** `Demo Shop — Workshop Merch`
- **Hero / `h1`:** Things to carry to your next workshop.
- **Hero subline:** A small storefront, built in a day. Names, prices and stock come from
  the API — never typed into the page.
- **Body (`home.body`) — 133 words:**

  Pick something. Add it to the cart. Watch the total come back from the server. That is
  the whole app, and it is the whole point.

  Every item here came out of the build. A workbook for the people writing prompts.
  Stickers for the people labelling laptops. A poster for the people drawing boxes and
  arrows. A hoodie for the long compiles.

  Nothing here ships, bills, or tracks a parcel. This is a teaching demo: the catalog,
  one local server, no dependencies, no accounts. The catalog is real in the sense that
  matters — read the API and the page agrees.

  Add something from the featured row. Then open the cart and see the number the server
  wrote, not the one the browser guessed.

  Four featured items sit below. The catalog holds everything.

- **CTA (`home.cta`) — exactly one:** `See all products` → `/products`
- **Featured slots:** ids 1–4 (the first four the API returns). Use `product.1` …
  `product.4` in that order.

---

## 2. Catalog — `/products` (`web/products.html`, `data-page="catalog"`)

- **`<title>`:** `Demo Shop — Products`
- **Heading / `h1`:** The catalog.
- **Body (`products.body`) — 96 words:**

  Everything the server has, in the order it holds it. Names, prices and stock badges come
  from the API, so this list is the list the shop actually has.

  Read a card, not a paragraph. Prices show as whole baht. The stock badge is honest:
  enough, almost gone, or none.

  Add one item to the cart, or open it to read the full description. Adding again adds
  another unit — the cart keeps one entry per piece, so two mugs look like two mugs.

  No filter box, no search. A short list does not need one.

- **CTA (`products.cta`) — exactly one:** `Add to cart` (the card's primary action)
- **Row control, not a CTA:** `View` — the per-card link to `/product/:id`, required by
  §1. Render it as a quiet text link so `Add to cart` stays the one visible CTA.

---

## 3. Product detail — `/product/:id` (`web/product.html`, `data-page="product"`)

- **`<title>`:** `Demo Shop — {name}` (from the API). Pre-load and fallback:
  `Demo Shop — Product`.
- **Heading / `h1`:** `{name}` (from the API — this page owns no product name in copy).
- **Body (`product.body`) — 103 words:**

  One product, described plainly. The name, the price and the stock line belong to the API
  for this id; the description is the only sentence here written by hand.

  Add to cart puts one unit in. Click again for another — there is no quantity box, the
  cart is a list of units.

  Prices show as whole baht. What you see is the server's number, rounded once at render
  time and never again.

  Nothing here promises a delivery date, a refund, or a size that runs true. It is a demo,
  and it behaves like one: honest about stock, silent about everything else.

- **CTA (`product.cta`) — exactly one:** `Add to cart`
- **Not-found state (`product.notfound`) — page-local copy, never the API's `error.message`:**
  `We don't have that one. It may have been added in a run that already ended.`
  plus a plain link back to the catalog.
- **Price line label:** `Price` **Stock line label:** `In stock` / `Almost gone` / `Sold out`
  (see §7).

---

## 4. Cart — `/cart` (`web/cart.html`, `data-page="cart"`)

- **`<title>`:** `Demo Shop — Cart`
- **Heading / `h1`:** Your cart.
- **Body (`cart.body`) — 110 words:**

  Your cart is a list of units, one line per piece. The total is not added up in the
  browser. The page sends the list to the server and prints what comes back, rounded to
  whole baht at render time.

  So the number you see is the server's number. An empty cart is still asked and still
  answered: `฿0`, with a zero and a symbol, never a blank cell.

  Nothing here checks you out. No payment step, no address form, no confirmation email.
  Read the total as the answer to one question: what would this cost?

  The cart lives in this browser only. Clear site data and it is gone.

- **CTA (`cart.cta`) — exactly one:** `Continue shopping` → `/products`
- **Total row label (`cart.total`):** `Total` — text of `#cart-total` is written only from
  the server response.
- **Empty-state line (`cart.empty`) — the one required line:**
  `Your cart is empty. Add something from the catalog and the total will show up here.`
- **Removed confirmation (`cart.removed`):** `Removed from your cart.`

---

## 5. Product blurbs — runtime fixture, ids 1–5 (`data/products.json`)

Live in this build. Each names the product exactly as the API returns it, and states its
price in the AC-8 format. ≤30 words each. Home features ids 1–4; id 5 is catalog and
detail only.

| Key | Product (API name) | Blurb |
|---|---|---|
| `product.1` | Prompt Engineering Workbook — `฿390` | Thirty prompts to test, one note page each. Write the instruction, run it, keep what works. Bring it to the workshop and leave with edits. |
| `product.2` | Claude Code Sticker Pack — `฿150` | Ten vinyl stickers for a laptop, a monitor, or a helmet. Peel, stick, explain your setup to whoever asks first. |
| `product.3` | Multi-Agent Architecture Poster — `฿250` | One wall, one pattern: a lead, its workers, and the tool calls between them. Boxes and arrows, drawn clean enough to read across the room. |
| `product.4` | Vibe Coding Hoodie — `฿990` | Heavy fleece, a pocket wide enough for a tablet, and a hood that survives an air-conditioned room. Small run. Wear it when the model has the plan. |
| `product.5` | Token Saver Mug — `฿210` | Thick ceramic, slow coffee, long compiles. The joke is printed inside the rim, so it stays between you and the mug. |

---

## 6. FUTURE INVENTORY — not live in this build

**Do not render these anywhere.** ids 6–12 exist only in the reference file
`data/products.mock.json`; the runtime server serves five products, and nothing may assume
twelve. Copy below is brand voice for a catalog that does not exist yet. Keep out of
`web/**` entirely — AC-5 forbids product text that the API cannot return.

| Key | Product (reference name) | Blurb |
|---|---|---|
| `future.6` | Agent Team Enamel Pin Set — `฿320` | Three enamel pins: a lead, a worker, a reviewer. For a strap, a case, or the badge holder you already lost once. |
| `future.7` | Context Window Hardcover Notebook — `฿260` | Dot grid, numbered pages, a ribbon that survives a backpack. Write the prompt before you type it. |
| `future.8` | Subagent Orchestrator T-Shirt — `฿890` | Black cotton, one line across the chest: dispatch, wait, merge. Plain enough for a workshop, specific enough for the room to notice. |

---

## 7. Stock-out line and utility strings

The two lines AC-7 names, plus the short functional strings the frontend would otherwise
invent under pressure. **None of these are page CTAs** — each page keeps exactly one (§1–§4).

| Key | Line | Where |
|---|---|---|
| `stock.out` — **the stock-out line** | `Sold out — you can read this one, but not add it.` | Detail page + catalog card when `stock` is `0`; `Add to cart` disabled |
| `stock.low` | `Almost gone` | Stock badge (`≤ 10`) |
| `stock.in` | `In stock` | Stock badge |
| `cart.empty` | `Your cart is empty. Add something from the catalog and the total will show up here.` | `/cart`, no units |
| `state.loading` | `Loading…` | Any page, request in flight |
| `state.offline` | `Can't reach the shop. Start the server, then try again.` | Any page, failed fetch |
| `state.listEmpty` | `The catalog is empty right now.` | `/products` and `/` when the API returns `count: 0` |
| `state.idInvalid` | `That's not a product id.` | `/product/:id` with an obviously invalid id — no request sent |
| `noscript` | `This demo needs JavaScript on. It reads every product from the API.` | `<noscript>`, all pages |
| `footer.demo` | `Demo data. Products added in a session are gone when the server restarts.` | Footer, all pages |

---

## 8. AC-7 self-check

- 4 of 4 pages: `/`, `/products`, `/product/:id`, `/cart` — each with a `<title>` starting
  `Demo Shop`, a hero/heading, body copy under 250 words, and exactly one CTA label.
- 5 blurbs keyed `product.1`–`product.5`, matching `data/products.json` names and prices in
  `฿` AC-8 form, each ≤30 words.
- 3 optional blurbs `future.6`–`future.8` drawn from `data/products.mock.json` under a
  heading marked "FUTURE INVENTORY — not live in this build".
- One cart empty-state line, one stock-out line.
- No discount, shipping, delivery, return or guarantee claims. No checkout implied. No
  mention of any back-of-house endpoint, token, or screen.
