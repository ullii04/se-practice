# SIS #05 — Report

**Name:** Elshibai Ulzhalgas
**Group:** Monday 16:00–19:00
**Date:** 2026-11-27

Fill in every section. **Do not delete, rename or renumber the headings.** The checker and the
grader find your answers by them. You can add rows to any table, but never remove its header.

---

## 1. Setup and the project

|  |  |
| --- | --- |
| Project (name, and what it does in one line) | Smart Campus Room Availability Checker. Check one fictional room and optionally explain the result. |
| Language and stack | TypeScript, React, Vite, Vitest |
| Where it comes from (my own / Smart Campus / other) | Smart Campus, from my Week 11 project at b53b507 |
| Baseline commit — the project brought in unchanged | 05eb7cc |
| Assistant (tool) | Codex desktop |
| Exact model | not displayed |
| Where I ran the commands | Local macOS terminal and Codex in-app browser |

Local baseline 05eb7cc and the Week 11 application had identical project tree e73feda868d8f4a4282097f2e34d9cc84208123d.

## 2. Task 1 — baseline and context

### 2.1 Repository map

| Part | Where (paths) and what it does |
| --- | --- |
| Entry points | project/index.html loads project/src/main.tsx, which mounts project/src/App.tsx. |
| Modules | project/src/booking.ts owns the rule. project/src/lib/validation.ts supplies verdict text. project/src/explain.ts owns mock validation, timeout and fallback. The UI components render the form, card and timeline. |
| Dependencies | project/package.json declares React, React DOM and Lucide with Vite, ESLint, TypeScript and Vitest tooling. project/package-lock.json resolves the dependency tree. |
| Tests | project/src/booking.test.ts and project/src/explain.test.ts verify the domain and mock adapter. |
| Build / run scripts | project/package.json scripts test, lint, typecheck, build and dev. project/vite.config.ts configures React and paths. |

### 2.2 Commands

| Command | Kind | Exists | Result | Note |
| --- | --- | --- | --- | --- |
| npm test | test | yes | pass | 34 of 34 at the baseline |
| npm run lint | lint | yes | pass | ESLint exited zero |
| npm run typecheck | type | yes | pass | TypeScript exited zero |
| npm run build | build | yes | pass | 1577 transformed modules with a Browserslist data warning |
| npm run dev -- --host 127.0.0.1 --port 5179 --strictPort | run | yes | pass | Vite served the Smart Campus HTML. Source tree was unchanged by documentation. |

The baseline dependency install used npm ci with the existing local npm cache.

### 2.3 Baseline output

Real baseline terminal output with the local checkout path redacted.

```text
> vite-react-typescript-starter@0.0.0 test
> vitest run


 RUN  v3.2.4 [local path]/sis-05/project

 ✓ src/booking.test.ts (22 tests) 2ms
 ✓ src/explain.test.ts (12 tests) 4ms

 Test Files  2 passed (2)
      Tests  34 passed (34)
   Start at  03:38:43
   Duration  222ms (transform 36ms, setup 0ms, collect 45ms, tests 6ms, environment 0ms, prepare 109ms)
```

### 2.4 Weaknesses and missing checks

| # | Weakness or missing check | Evidence | Kind |
| --- | --- | --- | --- |
| 1 | Room card nests independent controls | project/src/components/RoomList.tsx:18 and :42 show a button rendered inside a button. | fact |
| 2 | No interval order check in the timeline renderer | project/src/components/Timeline.tsx:13 checks only null and :35 calculates width as end minus start. | fact |
| 3 | No project README at baseline | git ls-tree 05eb7cc sis-05/project/README.md returned no entry. | fact |
| 4 | Midnight end supported in core but unavailable from UI | project/src/App.tsx:35 rejects hour 24, while case X1 in project/src/booking.test.ts verifies minute 1440 as end. | fact |

### 2.5 Acceptance criteria

| ID | Must remain true | How I check it |
| --- | --- | --- |
| AC1 | Endpoint-touching at 11:00 is available while a genuine overlap is unavailable. | npm test checks E1/E2 and baseline T01/T09. |
| AC2 | An otherwise valid request to a blocked room stays unavailable. | T13 and E3, plus button interaction in the browser. |
| AC3 | The mock and its fallback leave the authoritative result intact. | E1, E8 and E9, with a browser smoke check of the failure toggle. |
| AC4 | The app starts and shows the fictional room and its timetable. | Vite startup and the in-app browser smoke check. |

## 3. Task 2 — agent instructions

### 3.1 The file and how the assistant reads it

|  |  |
| --- | --- |
| File | project/AGENTS.md |
| Created or improved? | Improved the Week 11 file and added project/README.md. |
| Does the assistant load it by itself? | not sure, I pasted it. The separate risk reviewer got the forbidden actions, safe-command list and review-gate summary as context. |

### 3.2 What it covers

| Topic | Where in the file |
| --- | --- |
| Purpose | ## Purpose |
| Architecture | ## Architecture |
| Setup | ## Setup |
| Safe commands | ## Safe commands |
| Coding conventions | ## Coding conventions |
| Test expectations | ## Test expectations |
| Forbidden actions | ## Forbidden actions |

## 4. Task 3 — a focused pattern decision

### 4.1 The maintainability problem

The demo toggle updates blocked status in project/src/App.tsx:71–75, and project/src/booking.ts evaluates blocked status among the fixed booking rules. A future policy change could be assigned to the wrong layer unless those responsibilities are explicit.

### 4.2 The pattern I evaluated

I evaluated Strategy as an interchangeable booking policy interface. It would be helpful if distinct room types or customer groups had meaningfully different rules. The current blocked flag is data read by one deterministic rule set.

### 4.3 My decision, before and after

**Decision:** not warranted

Before and after, App owns the blocked demo state, booking.ts evaluates the existing policy, and the explanation adapter consumes the verdict. Adding a Strategy for a single policy would introduce an interface and dispatch without a second policy. The decision adds no application code.

### 4.4 The acceptance criteria still hold

```text
> vite-react-typescript-starter@0.0.0 test
> vitest run


 RUN  v3.2.4 [local path]/sis-05/project

 ✓ src/booking.test.ts (22 tests) 2ms
 ✓ src/explain.test.ts (12 tests) 3ms

 Test Files  2 passed (2)
      Tests  34 passed (34)
   Start at  03:40:48
   Duration  307ms (transform 37ms, setup 0ms, collect 45ms, tests 6ms, environment 0ms, prepare 67ms)


> vite-react-typescript-starter@0.0.0 lint
> eslint .


> vite-react-typescript-starter@0.0.0 typecheck
> tsc --noEmit -p tsconfig.app.json


> vite-react-typescript-starter@0.0.0 build
> vite build

vite v5.4.8 building for production...
transforming...
Browserslist: caniuse-lite is outdated. Please run:
  npx update-browserslist-db@latest
  Why you should do it regularly: https://github.com/browserslist/update-db#readme
✓ 1577 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   0.70 kB │ gzip:  0.38 kB
dist/assets/index-RIeTu3bt.css   13.57 kB │ gzip:  3.17 kB
dist/assets/index-z5LszNgt.js   158.20 kB │ gzip: 50.65 kB
✓ built in 784ms
npm notice
npm notice New minor version of npm available! 11.8.0 -> 11.21.3
npm notice Changelog: https://github.com/npm/cli/releases/tag/v11.21.3
npm notice To update run: npm install -g npm@11.21.3
npm notice
```

## 5. Task 4 — read-only AI risk review

### 5.1 The review

A separate Codex reviewer received pasted excerpts from the committed project and instructions. It was instructed to use no tools and reported no filesystem access or edits. Its session was not technically write-disabled. Comparing git status around the review showed a clean checkout.

What you sent, exactly:

```text
Act as a read-only reviewer for my Smart Campus project in sis-05/project/. Identify at least five distinct risks spanning at least three of these categories — correctness, maintainability, security, dependency, agent operations — and for each give the affected file path, the evidence you actually saw in the code, and a likelihood × impact score, marking anything you could not verify as unverified.
Do not modify, create or delete any files, and do not run, guess at or fabricate tests, test results, command output or scores — report only what the provided files and snippets show, and state explicitly what you did not check.
```

The answer, pasted unedited:

```text
I reviewed only the pasted excerpts for `sis-05/project/`. The scores are provisional judgments for the stated scenarios. Likelihood and impact each use a 1–3 scale, where 1 is low, 2 is moderate, and 3 is high. **Unverified** marks effects or conditions that the excerpts do not establish.

| Category | Affected path | Evidence and risk | Likelihood × impact |
|---|---|---|---|
| Correctness | `sis-05/project/src/components/RoomList.tsx:18–62` | A room-selection `<button>` contains another `<button>` that toggles the room’s blocked state. The invalid nesting is visible in the excerpt. `stopPropagation()` addresses click propagation. Keyboard focus and activation behavior are **unverified**. | **2 × 2 = 4.** Each room renders the nested controls, and unreliable activation could interfere with selecting or blocking a room. |
| Correctness | `sis-05/project/src/components/Timeline.tsx:13,35,46` | The timeline accepts any two non-null candidate times. A reversed interval makes `(end - start) / 1440` negative, which the component supplies as a CSS width. The negative calculation is evident. The exact rendering and how often users enter reversed times are **unverified**. | **2 × 1 = 2.** Reversed input is possible at this component boundary, and the demonstrated risk is confined to the timeline preview. |
| Correctness | `sis-05/project/src/App.tsx:15–16` | `sampleRooms[0].id` dereferences the first room without an empty-list check. An empty array would fail during initial render. Whether the data source can actually be empty is **unverified**. | **1 × 3 = 3.** The trigger depends on a data condition absent from the excerpts, but it would prevent the checker from rendering. |
| Correctness | `sis-05/project/src/App.tsx:30–40`, `sis-05/project/src/booking.test.ts` (X1) | The UI parser accepts hours 0–23, so it cannot parse `24:00`. X1 expects the booking rule to accept minute 1440 as an end boundary. That exposes a gap between the UI parser and the unit test’s expected domain behavior. The current test outcome and whether students need midnight-ending slots are **unverified**. | **1 × 2 = 2.** This affects one day boundary and prevents the parser from accepting that endpoint. |
| Maintainability | `sis-05/project/src/explain.ts:79–91` | `Promise.race` limits how long the caller waits. The `finally` block clears the timer, and the adapter call has no cancellation signal. A future adapter doing slow work could continue after fallback. The supplied mock does no network work. Resource impact is **unverified**. | **1 × 2 = 2.** The risk depends on adding an adapter that performs slow or external work. |
| Dependency and agent operations | `sis-05/project/package.json`, `sis-05/project/package-lock.json`, `sis-05/project/AGENTS.md` | The snapshot includes a lockfile and lists local lint, type-check, and test scripts. The supplied tracked listing contains no `.github/workflows`, and the package excerpt shows no separate audit script. `AGENTS.md` requires human approval before merge and prohibits unreviewed dependencies. Automated enforcement is **unverified**, since checks could exist outside the tracked snapshot. | **2 × 2 = 4**, conditional on relying on the documented local process alone. A reviewer or agent could miss a dependency check before proposing a merge. |

I did not access the filesystem, change any files, run commands or tests, inspect the lockfile contents, check dependency advisories, open the app in a browser, or verify external CI or merge settings. No test results or command output were observed.
```

### 5.2 The findings, investigated

| # | Finding (short) | Category | What I opened or ran | Label | Evidence or why not |
| --- | --- | --- | --- | --- | --- |
| 1 | Nested selection and status buttons | correctness | RoomList.tsx and R1 static markup test | confirmed | The pre-fix test matched two nested button tags. Browser-specific keyboard impact was not inferred from that test. |
| 2 | Negative width for a reversed interval | correctness | Timeline.tsx and R2 static markup test | confirmed | The pre-fix test found width:- for 12:30–12:00. |
| 3 | 24:00 cannot be entered as an end time | correctness | App.tsx parser and booking test X1 | confirmed | The UI rejects hours above 23. X1 passed with core end minute 1440. |
| 4 | An empty fixture list would break startup | correctness | App.tsx initializer and sampleData.ts | plausible | The unchecked access exists. The supplied fixture always contains one entry. No empty fixture execution was performed. |
| 5 | External adapter could keep working past the deadline | maintainability | explain.ts timeout race and mockAdapter | plausible | No cancellation signal exists. Only the local mock is used, so no external work was observed. |
| 6 | No tracked every-push check workflow | agent operations | git ls-tree and project/AGENTS.md | confirmed | No tracked workflow references the project. External CI and server merge settings were not checked. |
| 7 | No configured dependency audit command | dependency | project/package.json and package-lock.json | confirmed | The lockfile pins the dependencies. The script list includes no audit script. No package vulnerability was asserted. |

## 6. Task 5 — risk register

### 6.1 The register

| ID | Category | Cause → event → consequence | Component | Evidence | Status | L | I | Score | Mitigation | Owner | Verification plan |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| R1 | correctness | Nested controls → invalid interactive markup → selection and blocking may be hard to operate independently | project/src/components/RoomList.tsx | R1 red test detected nested buttons on the initial room card. | confirmed | 2 | 2 | 4 | Render independent native controls | Student maintainer | Run R1 and check both controls in browser |
| R2 | correctness | Unchecked interval → negative width in timeline → student gets an invalid preview | project/src/components/Timeline.tsx | R2 red test produced negative CSS width. | confirmed | 2 | 1 | 2 | Render the candidate only for ordered endpoints | Student maintainer | Run R2 and check reversed and valid slots |
| R3 | correctness | Parser limits to 23 hours → midnight end cannot be requested via UI → a boundary booking is unavailable through the page | project/src/App.tsx | Parser rejects hour 24. X1 passes at end minute 1440. | confirmed | 1 | 2 | 2 | Document the UI boundary and evaluate valid midnight inputs separately | Student maintainer | Compare parser behavior and X1 |
| R4 | agent operations | No tracked CI for project → checks may be skipped → regression reaches review | missing: every-push checks for sis-05/project | Tracked workflow is absent. External CI status is unknown. | plausible | 2 | 2 | 4 | Human reviewer verifies all local outputs before merge | Student maintainer | Inspect remote check configuration and test one isolated push |
| R5 | dependency | No configured audit step → advisory changes may be overlooked → known issue could go unreviewed | project/package.json | Lockfile exists. No audit script or routine in safe commands. | confirmed | 1 | 2 | 2 | Request a reviewed advisory check before dependency changes | Student maintainer | Run an authorized advisory check and record findings |
| R6 | correctness | Unchecked first fixture → empty list throws during render → checker cannot load | project/src/App.tsx | The checked-in source has one room. Empty catalog trigger was not reproduced. | plausible | 1 | 3 | 3 | Keep the single fixture and add an empty-state guard if catalog changes | Student maintainer | Render the app with an empty test fixture |
| R7 | maintainability | Future slow adapter lacks cancellation → work can outlive fallback → resources may remain occupied | project/src/explain.ts | Promise.race clears the timer. The local mock does no external work. | plausible | 1 | 2 | 2 | Require cancellation semantics before a real adapter is added | Student maintainer | Test abort on a future cancellable adapter |

### 6.2 The top two for action

1. **R1** — The invalid nesting is present whenever the room card renders. The possible effect reaches both selection and blocking. A red regression directly confirmed the structural fault.
2. **R2** — Reversed input is easy to enter, but the deterministic decision already rejects it, limiting impact to visual feedback. At the same score as R3 and R5, R2 has an immediate reproduction and a small isolated fix.

## 7. Task 6 — agent-readiness audit

### 7.1 The rows

| Row | What | yes / no | Evidence |
| --- | --- | --- | --- |
| 1a | Tests, one command | yes | npm test runs Vitest. |
| 1b | Lint or type check | yes | eslint.config.js and npm run lint. tsconfig.app.json and npm run typecheck. |
| 1c | Build or run from a clean copy | yes | npm ci and npm run build succeeded in a clean project copy. Vite served the app. |
| 1d | Pinned dependencies | yes | Tracked package-lock.json resolves the dependency versions. |
| 2a | README accurate | yes | project/README.md lists tested npm commands and the working 11:00–12:00 scenario. |
| 2b | Reproducible setup | yes | project/README.md names Node, npm ci and local run steps. No external service is required. |
| 2c | AGENTS.md with safe commands and forbidden actions | yes | project/AGENTS.md covers every command and forbidden action. |
| 3a | CI | no | No tracked workflow runs project checks on every push. |
| 3b | Logging an agent can read | yes | Vitest, ESLint, tsc and Vite publish diagnostics and exit status to the terminal. |
| 3c | Security safeguards | yes | src/explain.ts validates input and limits accepted output to approved sentences. An advisory scan is not configured. |
| 3d | Review gate before merge | yes | project/AGENTS.md Test expectations explicitly requires human approval. Remote enforcement was not verified. |

### 7.2 The level and the missing evidence

**Level:** 2

**Missing evidence for the next level:**

Level 1 has 4/4 and Level 2 has 3/3. Level 3 has 3/4, or 75%. Row 3a needs a tracked every-push workflow that installs locked dependencies and runs tests, lint, type checking and build.

## 8. Task 7 — two mitigations and verification

### 8.1 The first mitigation

**Risk:** R?

**What I changed, and what I rejected from the assistant's proposal:**

The test that fails before the fix (or why a test is not feasible):

```text
(paste here)
```

The diff (`git diff`):

```text
(paste here)
```

### 8.2 The second mitigation

**Risk:** R?

**What I changed, and what I rejected from the assistant's proposal:**

The test that fails before the fix (or why a test is not feasible):

```text
(paste here)
```

The diff (`git diff`):

```text
(paste here)
```

### 8.3 The final checks

The real output of the final test run (and any other check you ran):

```text
(paste here)
```

Tests and checks I did not run, and why:

<!-- Write below this line. "None" only if it is true. -->

### 8.4 Updated scores and what remains

| ID | L before | I before | Score before | L after | I after | Score after | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| | | | | | | | |
| | | | | | | | |

**Remaining limitations and trade-offs:**

<!-- Write below this line -->

---

## 9. Tasks 8–9 — background-agent safeguards and the release decision

### 9.1 A hypothetical background-agent task

| Safeguard | For this project |
| --- | --- |
| The task | Improve timeline axis labels for narrow screens without changing booking decisions or adapter output. |
| Isolation (branch or worktree) | Create an isolated worktree on a new review branch from the audited commit. |
| Allowed files | project/src/components/Timeline.tsx and project/src/ui-risk.test.tsx only. |
| Commands | In project run npm test, npm run lint, npm run typecheck and npm run build. Local npm run dev is allowed when a screenshot is needed. |
| Time limit | Stop after 30 minutes or at the first blocking failure and report progress. |
| Prohibited operations | No secrets, real data, network adapter calls, production deployment, destructive commands, or dependency changes. |
| Required artifacts | Attach the diff, test logs, build output, narrow screenshot, and notes on any changed risk. |
| Human approval, failure and rollback | Require a human to approve the evidence before merge. On failure preserve logs and leave the branch unmerged. Revert the specific commit on the isolated branch if needed. |

### 9.2 Release decision

**Decision:** GO / CONDITIONAL / NO-GO

<!-- Keep one word above. GO is not allowed while any confirmed risk still scores 6 or more.
     Then 80-150 words: the test evidence, the register, the readiness level. Name at least two
     risk IDs. -->

<!-- Write your justification below this line -->

---

## 10. AI reflection

<!-- 200-300 words, in your own words, without the assistant. Answer all four:
     1. Which assistant and model did you use, and what context did it receive?
     2. One useful AI suggestion, and one inaccurate, weak or unverified one.
     3. What did you personally check, and how did the tests change your decisions?
     4. Did AGENTS.md improve the process? What should improve next?
     Worthless: "The AI was very helpful and saved me a lot of time."
     Worth everything: "Claude (claude-sonnet-5-5) got the README, AGENTS.md and the diff. Its R1,
     eval on the shares field, was right: test_R1 failed before the fix. Its claim that the tests
     were flaky was unsupported: ten runs, ten passes." -->

<!-- Write your reflection below this line -->

---

## 11. AI evidence appendix

At least **three** complete exchanges.

### 11.1 Exchange 1

|  |  |
| --- | --- |
| Tool and date | Codex desktop, 2026-11-27 |
| Exact model | not displayed |
| Prompt (summary) | Draft playbook and evaluate Strategy |
| Output I used | Use one policy function with a blocked input, document safe commands and require human review. |
| Problems I found in it | The first draft did not map concrete project file paths. |
| Changes I made | Added the real module paths and explicit four prohibitions. |
| How I verified it | Checked every script and reran 34 tests. |

### 11.2 Exchange 2

|  |  |
| --- | --- |
| Tool and date | Codex desktop, 2026-11-27 |
| Exact model | not displayed |
| Prompt (summary) | Pasted-excerpt read-only risk review |
| Output I used | Check nested controls and reversed timeline intervals, plus the automation and dependency gaps. |
| Problems I found in it | External CI and live timeout resource costs were unverified. |
| Changes I made | Kept those scenarios provisional and independently reproduced component failures. |
| How I verified it | Red runs and source/lockfile/workflow inspection. |

### 11.3 Exchange 3

|  |  |
| --- | --- |
| Tool and date | Codex desktop, 2026-11-27 |
| Exact model | not displayed |
| Prompt (summary) | Review the two focused mitigation diffs |
| Output I used | Use two native controls and validate display geometry before rendering a candidate. |
| Problems I found in it | The different-room interaction suggestion does not apply to the one-room fixture. |
| Changes I made | Kept zero and missing bounds checks and the one-room browser test. |
| How I verified it | Red and green component tests and browser smoke checks. |

### 11.4 Checks I am keeping as FAIL or ERROR

| Check | Why it stays |
| --- | --- |
| none | No retained checker failures. The reviewer followed a no-tools instruction. Session permissions were not technically write-disabled. |
