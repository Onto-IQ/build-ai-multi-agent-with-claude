# QA Report — POST /api/notes and /api/health

## Finding 1 (High): invalid JSON kills the server

- `server.js` — `JSON.parse(raw)` runs without try/catch inside the `end` callback, so a body that is not JSON throws and takes the whole process down.
- Reproduced: `POST /api/notes` with body `not-json` -> connection reset, `/api/health` refuses afterwards.
- Required fix: wrap the parse in try/catch and answer `400 { error: 'INVALID_JSON' }`; guard against a JSON body that is not an object (same 400).
- Evidence after fix: `POST /api/notes` with `not-json` -> `400`, server keeps answering; gate case `bad-json-does-not-crash` PASS.

## Finding 2 (High): /api/health leaks a fake credential

- `server.js` — `/api/health` returns `sampleToken` (`sk-sample-not-a-real-key`) to anyone who asks.
- Reproduced: `GET /api/health` -> body contains `sk-sample-not-a-real-key`.
- Required fix: return `{ ok: true }` only — no token of any shape in the response.
- Evidence after fix: `GET /api/health` -> `{"ok":true}` with no `sk-` substring; gate case `health-no-secrets` PASS.

## Finding 3 (Medium): notes are neither validated nor persisted

- `server.js` — `POST /api/notes` accepts any JSON object (even `{}`) and keeps notes in an in-memory array; there is no `GET /api/notes` and a restart loses everything.
- Reproduced: `POST /api/notes` with `{ "nope": 1 }` -> `201` (note saved as empty string); a saved note disappears after killing and restarting the server.
- Required fix: reject a body without non-empty `text` with `400 { error: 'INVALID_TEXT' }`; store notes in `data/notes.json`; add `GET /api/notes` returning `{ notes: [...] }` so the data survives a restart.
- Evidence after fix: `{ "nope": 1 }` -> `400`; a posted note is still returned by `GET /api/notes` after a full server restart; gate cases `notes-validation` and `notes-persists` PASS.
