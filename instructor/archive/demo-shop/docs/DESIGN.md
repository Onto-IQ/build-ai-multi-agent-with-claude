# DESIGN — `POST /api/products`

Status: Stage 1 output — written for the user's review; Stage 2 treats this file as its sole spec.
Scope: new branches for the `/api/products` family in `server.js` — the create handler, plus the
`404` branch §6.2 requires. No existing line of `server.js` is edited.

## 1. Goal

Let a client create a product. Today `data/products.json` is loaded once at startup
(`server.js:15-17`) and the API is read-only, so there is no way to add an item without
editing the file and restarting.

## 2. Context this design is bound by

- Pure Node.js, **zero dependencies** (`server.js:2-3`). No validation library, no framework.
- Existing style: one `http.createServer` callback, sequential `if (path && method)` branches,
  each returning early via the `sendJson(res, status, body)` helper (`server.js:19-22`).
- Existing POST handler (`server.js:40-57`) shows the body-reading idiom this endpoint follows:
  accumulate `data` chunks, then act on `end`.
- **Placement:** insert the new branch after the GET-by-id branch (`server.js:33-38`) and before
  the `/api/cart/total` branch, so the `/api/products` family stays together.

## 3. Request

`POST /api/products` with `Content-Type: application/json`.

```json
{
  "name": "Claude Code Sticker Pack",
  "price": 150,
  "stock": 100
}
```

| Field | Type | Required |
|---|---|---|
| `name` | string | yes |
| `price` | number | yes |
| `stock` | integer | yes |

`id` is **server-assigned**. A client that sends `id` is rejected (rule V4) rather than
silently ignored, so a mistaken "update" call cannot half-succeed.

## 4. Response

### 4.1 Success — `201 Created`

The created product object, shaped exactly like the records already in `data/products.json`:

```json
{
  "id": 6,
  "name": "Claude Code Sticker Pack",
  "price": 150,
  "stock": 100
}
```

Plus header `Location: /api/products/6`.

Field order is `id, name, price, stock`. `price` is the numeric value as supplied — no
rounding, no currency formatting.

### 4.2 Error envelope — all failures

Every error this endpoint produces uses one shape:

```json
{
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "product failed validation",
    "details": [
      { "field": "name", "rule": "REQUIRED_NON_EMPTY_STRING" }
    ]
  }
}
```

- `code` — stable UPPER_SNAKE machine token (see §6). Clients branch on this, not on `message`.
- `message` — one human-readable sentence, English, lowercase, no trailing punctuation.
- `details` — always present; empty array (`[]`) when there is nothing field-specific.
- `details[]` entries have exactly two keys, `field` and `rule`, in that order. For a token that is
  about the whole body rather than one key (`FORBIDDEN_FIELD` for `id`, `UNKNOWN_FIELD`), `field`
  is the offending key's name.

> Deliberate divergence: the existing handlers return a flat `{ error: 'not found' }`
> (`server.js:36`, `server.js:61`). The flat shape cannot carry a code or per-field details,
> and those are required here. Only the new endpoint changes shape; the existing flat responses
> are left as they are (§2 placement rule).

## 5. Validation rules

All rules run before anything is mutated. Every failing rule is collected, not just the first,
so one round-trip tells the client what is wrong. The request is rejected only after the whole
pass. Order of `details` entries follows the order below (V1 → V5).

| # | Rule | Fails when |
|---|---|---|
| V1 | **Body is a JSON object.** | Raw body is not valid JSON, parses to `null`/array/scalar, or exceeds the size cap in §7. |
| V2 | **`name`** — string, trimmed, 1–120 chars after trim. | Missing, `typeof !== 'string'`, empty or whitespace-only, or longer than 120 chars. |
| V3 | **`price`** — positive finite number, ≤ 1,000,000. | Missing, not `typeof 'number'` (so `"150"` and `NaN` fail), not finite, `<= 0`, or `> 1000000`. |
| V4 | **`stock` integer ≥ 0 and `id` absent.** | `stock` missing, not `Number.isInteger`, `< 0`, or `> 1000000`; or `Object.prototype.hasOwnProperty.call(body, 'id')` is true. |
| V5 | **No unknown fields.** | Any key outside `name`, `price`, `stock`. Catches `priceRange`, `prize`, `qty` before they become silent data loss. |

Notes:
- `null` is a failed `REQUIRED` check, never a type error — report `REQUIRED_*`.
- Booleans are not numbers: `price: true` fails V3.
- Extra whitespace in `name` is trimmed for the stored value (`" Hoodie "` → `"Hoodie"`);
  trimming happens once, in the validation pass, and the trimmed value is what gets stored.

## 6. Error codes

The three classes are kept strictly separate: **400 = the client sent something wrong,
500 = we failed on a valid request, 404 = the URL is not ours.** One cause, one status.

### 6.1 `400 Bad Request` — client errors

| `code` | Triggered by | `message` | `details` |
|---|---|---|---|
| `INVALID_JSON` | V1, body could not be parsed | `request body must be valid JSON` | `[]` |
| `BODY_TOO_LARGE` | V1, body exceeds §7 cap | `request body exceeds 8192 bytes` | `[]` |
| `VALIDATION_FAILED` | V2, V3, V4 or V5 | `product failed validation` | one entry per failing rule |

`VALIDATION_FAILED.message` is the fixed sentence above; per-field specifics live in `details`,
which is why one message can cover several simultaneous failures.

`details[].rule` tokens: `REQUIRED_NON_EMPTY_STRING`, `TYPE_STRING`, `LENGTH_TOO_LONG`,
`REQUIRED_NUMBER`, `TYPE_NUMBER`, `NUMBER_NOT_POSITIVE`, `NUMBER_TOO_LARGE`,
`REQUIRED_INTEGER`, `TYPE_INTEGER`, `INTEGER_NEGATIVE`, `INTEGER_TOO_LARGE`,
`FORBIDDEN_FIELD`, `UNKNOWN_FIELD`. A `VALIDATION_FAILED` response always has ≥1 detail entry.
`INTEGER_NEGATIVE` (not `_NOT_POSITIVE`) because `stock: 0` is legal.

### 6.2 `404 Not Found` — unknown URL

`404` means **no route matched**, and it is reserved for that. It never appears in response to a
well-formed `POST /api/products`. `POST /api/products/3` gets `404`, not `400` and not `405` —
the path `/api/products/3` has no POST route.

| `code` | Triggered by | `message` | `details` |
|---|---|---|---|
| `NOT_FOUND` | `POST /api/products/<something>` — a path in this family with no POST route | `no route for this method and path` | `[]` |

**How it is implemented, so this does not contradict §2:** the 404 comes from a **new branch**
this design adds — `url.pathname.startsWith('/api/products/') && req.method === 'POST'` →
`404 NOT_FOUND` — placed directly after the create branch. It is *not* produced by editing the
global catch-all. Consequence: a path outside this family (`/api/nope`) still falls through to the
existing `200 { hello: ... }` (`server.js:68`). That is pre-existing behaviour and stays.

Kept out of `400`: a URL we do not serve is not a malformed request body, and merging the two
would leave a client's retry logic unable to tell "fix your payload" from "fix your URL".

**Out of scope, recorded so the taxonomy is complete:** the sibling GET-by-id handler answers a
miss with `200 { error: 'not found' }` (`server.js:36`). `404` is the correct status there. Stage 2
must **not** change it — this design adds branches and touches no existing line. Flagged for
Stage 3 to note as a pre-existing defect.

### 6.3 `500 Internal Server Error` — our errors

| `code` | Triggered by | `message` | `details` |
|---|---|---|---|
| `INTERNAL_ERROR` | Any unexpected throw inside the handler after validation passed (e.g. `products.push` failing) | `internal error while creating product` | `[]` |

- The 500 body carries **no** error internals — no stack, no `err.message`, no field values.
- The real cause is written to the server log via `console.error` so it is still diagnosable.
- A 500 is only ever produced after validation passed, so a `500` guarantees the client's payload
  was acceptable. Nothing that looks like a client mistake may be reported as 500.
- On 500 the product is **not** added. The push happens inside the guarded block; if anything
  throws before it completes, `products` is unchanged.

## 7. Body size cap

Raw body is capped at **8192 bytes**, counted on the accumulated string's byte length
(`Buffer.byteLength(raw, 'utf8')`), not on chunk count. The accumulator is a growing string
(`server.js:42`), so without a cap a client could stream indefinitely into memory.

**The cap must also suppress the later `end` handler.** If `data` exceeds the cap, respond
`400 BODY_TOO_LARGE` immediately, set a `responded` flag, and return. The `end` listener still
fires afterwards (the client finishes sending), so it must check that flag and do nothing —
otherwise `sendJson` writes headers a second time and Node throws
`ERR_HTTP_HEADERS_SENT`, turning a clean 400 into a crashed request. The same guard applies to the
`INVALID_JSON` path.

## 8. Behavioural decisions

- **`id` assignment:** `products.reduce((max, p) => (p.id > max ? p.id : max), 0) + 1` — the
  current max, not the array length, so a future delete cannot recycle an id. Written as a reduce
  rather than `Math.max(...ids)` because spreading an empty array yields `-Infinity`, which would
  make the first id `-Infinity`; `reduce` with an initial `0` gives id `1` on an empty list.
- **Persistence:** **in-memory only.** The new product is pushed onto the `products` array and is
  visible to `GET /api/products` and `GET /api/products/:id` for the life of the process.
  `data/products.json` is **not** written; the record is lost on restart. Writing the file is a
  separate feature and is excluded (§10).
- **No uniqueness check on `name`.** Two products may share a name — `"Token Saver Mug"` twice is
  valid, they get distinct ids. Rejecting duplicates is a search/dedup feature, not validation
  (§10). This is why the §9 example creating a name that already exists at `id: 5` must still
  return `201`.
- **`Content-Type` is not enforced.** `POST /api/cart/total` (`server.js:40`) does not check it
  either, so requiring it here would split the API's convention for no validation gain. A body
  sent as `text/plain` is parsed as JSON and judged on its content alone.
- **Concurrency:** Node runs this handler on one thread with no await points, so two requests
  cannot interleave between reading the max id and pushing. No lock, no transaction.
- **Auth:** none, matching `POST /api/cart/total` (`server.js:40`). `ADMIN_TOKEN` (`server.js:13`)
  is not consulted. Adding auth to create is excluded (§10).
- **Method fallthrough:** a non-POST, non-GET method on `/api/products` (e.g. `DELETE`) is left to
  the existing catch-all (`server.js:68`). `405` is not introduced — it is not in the §6 taxonomy.

## 9. Verification

Stage 2 runs these against `node server.js` and records the actual status line for each.

```bash
# 201
curl -i -X POST localhost:3000/api/products -H 'Content-Type: application/json' \
  -d '{"name":"Token Saver Mug","price":210,"stock":60}'

# 400 VALIDATION_FAILED — three rules fail at once, all three reported
curl -i -X POST localhost:3000/api/products -H 'Content-Type: application/json' \
  -d '{"name":"","price":"210","stock":-1}'

# 400 INVALID_JSON
curl -i -X POST localhost:3000/api/products -H 'Content-Type: application/json' -d '{oops'

# 400 VALIDATION_FAILED / FORBIDDEN_FIELD
curl -i -X POST localhost:3000/api/products -H 'Content-Type: application/json' \
  -d '{"id":99,"name":"X","price":1,"stock":1}'

# 404 — no POST route on this path
curl -i -X POST localhost:3000/api/products/3 -H 'Content-Type: application/json' -d '{}'

# 200 — the created item is now listed
curl -s localhost:3000/api/products | head -c 400
```

Expected product of the first call: a `201` with `id: 6`, then `count: 6` from the last call.

## 10. Non-goals

Explicitly not part of this change: `PUT`/`PATCH`/`DELETE`, persisting to `data/products.json`,
authentication, pagination of the collection, tests-as-a-file, and any edit to an existing
handler or its status codes (including `server.js:36`).
