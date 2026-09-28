# TASKS — dependency-ordered (final state)

| # | Task | Owner | Depends on | Status |
|---|---|---|---|---|
| T0 | PRODUCT-SPEC.md + task list | Leader | — | Completed |
| T1 | Research: mock product data + feature notes | research | T0 | Completed |
| T2 | Feed T1 summary into spec (v1.1) | Leader | T1 | Completed |
| T3 | Backend: static handler in server.js | backend | T2 | Completed |
| T4 | Frontend: web/ pages + app.js + styles.css | frontend | T2 | Completed |
| T5 | Copy: docs/COPY.md | writer | T2 | Completed |
| T6 | QA: review vs spec + run quality-gate.js | qa-reviewer | T3,T4,T5 | Completed |
| T7 | Fix blocking findings, re-run gate | Leader/backend | T6 | Completed |
| T8 | Final report + commits | Leader | T7 | Completed |
