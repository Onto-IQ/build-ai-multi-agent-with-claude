---
name: release-checklist
description: "Use before releasing the Sales Insight app"
---

# Release checklist

Run these checks in order before saying the Sales Insight app is ready to release. Report each one as PASS or FAIL with its evidence. If any check fails, the release is not ready.

1. **Server boots.** Start `node server.js` and confirm it starts listening without throwing. Record the startup output.
2. **`/api/health` must not contain `sk-`.** While the server is running, request `/api/health` and check whether the response body contains the substring `sk-`. Report only whether it was found. Never print, copy, or quote the value itself.
3. **Server is stopped before the gate.** Stop the server you started and confirm that its process has exited and the port is free, so the gate does not hit a stale instance.
4. **Quality gate result is recorded.** Run `node scripts/quality-gate.js` and record the real exit code with a short summary of its output. Never assume the result or round it to a pass.
