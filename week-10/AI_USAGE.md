# AI Usage Disclosure — Week 10

Course AI-use level D. The student remains responsible for inspecting the evidence and defending the submission.

| Tool | Exact model / plan | Used for | Which files it touched |
| --- | --- | --- | --- |
| Codex desktop main session | not displayed | Copied the Week 08 checkpoint, drafted the playbook change and refactor, wrote the failing regression, ran verification, operated the browser, drafted report and declaration | `app/AGENTS.md`, `app/src/booking.ts`, `app/src/lib/validation.ts`, `app/src/App.tsx`, `app/src/booking.test.ts`, `evidence/`, `lab-report.md`, `AI_USAGE.md`, `submission.yml` |
| Codex desktop review subagent | not displayed | Answered the course prompts against an exported baseline snapshot, then exported the transcripts outside the repo | No project or snapshot file changes |
| Codex CLI | not displayed | Attempted a technically enforced read-only review | Initialization failed. No review or project file changes came from this attempt. |

- **Read-only review.** The desktop review was instructed to read the snapshot only and did not edit files. The snapshot was compared against a clean checkpoint export. Its write capability was not technically disabled. The standalone CLI could not initialize.
- **Review chronology.** The separate reviewer answered the exact prompts on the frozen checkpoint after the main session had proposed and applied the approved changes. The read-only review therefore covered baseline files, but took place later than the recommended lab order.
- **Finding verification.** Codex checked the claims against baseline files and actual local commands. The report does not attest that the student independently opened every cited file.
- **Diff approvals.** The student explicitly approved the playbook and R2 code diffs in Codex before they were applied. Codex added and verified the regression test. No independent student review of every changed file is claimed.
- **Terminal output.** Real Vitest output. The local absolute checkout paths were replaced with placeholders. For the separate review transcript, the snapshot path prefix in link destinations was replaced with `app/`. Results, timings, test names and response wording are retained.
- **UI evidence.** Codex operated the browser at desktop and phone widths and captured the results. A physical phone and other browser engines were not used.
- **Release decision.** The student supplied the CONDITIONAL decision and conclusion in section 10. Codex transcribed the conclusion without rewriting it. The AI has not attested that the student can defend the scores or signed on the student's behalf.
