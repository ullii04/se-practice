# AI Usage Disclosure — Week 09

| Tool | Exact model / plan | Used for | Which files it touched |
| --- | --- | --- | --- |
| Codex | not displayed | Part 2 — three fresh context-isolated chats; one unchanged README request each | calls/r1.json, calls/r2.json, calls/r3.txt |
| Codex | not displayed | Read instructions/PDF, author schema and report, explain constraints, run checks, organize commits and PR | tool/check_room.json, lab-report.md, AI_USAGE.md, submission.yml, evidence/ |

**I wrote `tool/check_room.json` myself:** no. Codex wrote the complete definition. It was checked against the provided twelve fixed calls and the allowed-keyword checks. The student must review its constraints; automated passing does not establish student understanding.

**I used an AI to explain a JSON Schema keyword or a check:** yes. Codex explained type, required, bounds, additionalProperties, nested items, and the distinction between shape and AC1–AC6 semantics in the report.

**Every reply in calls/ and in lab-report.md section 4 is exactly what the model returned:** yes. Each saved final reply is copied unchanged; no retries or corrections. Fresh chats were agent sessions with fork_turns=none, not three turns in this parent chat. The model identifier was not displayed.

**Every terminal output in lab-report.md was pasted from a real run, unedited:** yes. Section 8 is inserted directly from captured stdout. Section 3 and evidence/first-run-s.json record verdicts from the genuine first run rather than claiming to be raw stdout.

**Anything I accepted from the AI without fully understanding it:** Student understanding has not been verified. The whole schema, report including conclusion, permission decisions, and declaration were AI-drafted and need student review before submission. No independent authorship or student signature is asserted.

Signed: Codex (AI preparer on behalf of Elshibai Ulzhalgas; student review and signature pending)
Date: 2026-11-15
