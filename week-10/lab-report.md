# Week 10 — Lab report

**Name:** Elshibai Ulzhalgas
**Group:** Monday 16:00-19:00
**Date:** 2026-11-19

Fill in every section. **Do not delete, rename or renumber the headings.** The checker and the
grader find your answers by them. You can add rows to any table, but never remove its header.

---

## 1. Setup

|   |   |
| --- | --- |
| Assistant I reviewed with (tool) | Codex desktop |
| Exact model | not displayed |
| Where the assistant read the project | Codex desktop, from a frozen copy of the checkpoint |
| Starting point | week-08 |
| Baseline commit | 147b021 on GitHub, f0a704d local |
| Where I ran the tests | Local macOS terminal via Codex |
| Vitest version | 3.2.4 |

## 2. Task 1 — the baseline

### 2.1 The project's commands

| Command | Exists | Result | Note |
| --- | --- | --- | --- |
| `npx vitest run` | yes | pass | 21 tests passed |
| `npm test` | yes | pass | 21 tests passed |
| `npm run test:unit` | no | missing | npm reported Missing script: "test:unit" |
| `npm run build` | yes | pass | Build succeeded with a Browserslist data warning |
| `npm run lint` | yes | pass | Exit code 0 |

The initial offline install missed the Vitest tarball. The retry used the existing Week 08 npm cache and succeeded with the tracked lockfile unchanged.

### 2.2 The baseline test run

Real baseline output from a clean export of the baseline checkpoint. The original baseline run also passed 21 tests, but its log was overwritten by an earlier process. Only the local checkout path below is redacted.

```text
 RUN  v3.2.4 [local path]/baseline-run

 ✓ src/booking.test.ts (21 tests) 2ms

 Test Files  1 passed (1)
      Tests  21 passed (21)
   Start at  23:52:52
   Duration  196ms (transform 17ms, setup 0ms, collect 15ms, tests 2ms, environment 0ms, prepare 36ms)

npm notice
npm notice New minor version of npm available! 11.8.0 -> 11.21.3
npm notice Changelog: https://github.com/npm/cli/releases/tag/v11.21.3
npm notice To update run: npm install -g npm@11.21.3
npm notice
```

### 2.3 The agent reads the playbook

```text
Read the root AGENTS.md before making changes. Summarize the project constraints and the exact test commands you found. Do not edit anything yet. If you cannot read AGENTS.md, tell me, and I will paste its content. Do not claim that AGENTS.md was automatically loaded.
```

```text
I read the root `AGENTS.md` directly and cross-checked its commands against `package.json`. I made no edits and ran no tests.

The project is a React and TypeScript room-availability checker built with Vite. The booking rule is `canBook` in `src/booking.ts`, the page is in `src/App.tsx`, and the unit tests are in `src/booking.test.ts`.

- Reject requests whose start is at or after the end, requests in the past, and requests longer than 120 minutes.
- Reject blocked rooms and overlapping bookings. Touching an existing booking at either endpoint counts as an overlap.
- Return Available or Unavailable without changing booking data.
- `AGENTS.md` asks for real room names and timetable data from the KBTU portal. It permits project edits and necessary packages, mentions Supabase and a login page if persistence is needed, and directs a page-load check and `npx netlify deploy --prod` after a successful build. The current request authorizes reading only.

**Test commands**

- `AGENTS.md` documents `npm run test:unit`.
- `package.json` defines `"test": "vitest run"`, so the configured command is `npm test` (also runnable as `npm run test`). It defines no `test:unit` script.

The other commands documented in `AGENTS.md` are `npm install`, `npm run dev`, and `npm run build`.
```
 
<!-- Write below this line -->
The real timetable instruction, the optional login/database and the production deployment conflict with the Week 10 scope. The endpoint clause contradicts AC4 and existing tests T01 and T08. AC6 is absent and the exact test command in the supplied playbook has no matching script in package.json.

## 3. Tasks 2–3 — the read-only review and the challenge

### 3.1 The review prompt and the answer

<!-- Write below this line -->
A separate Codex desktop reviewer inspected an exported copy of checkpoint f0a704d under a read-only task instruction. The Codex CLI read-only sandbox could not initialize on this host. The desktop reviewer had tool access, so its write capability was not technically disabled. It did not write files. A recursive comparison against the checkpoint confirmed the exported files stayed unchanged.

What you sent, exactly:

```text
Act as a cautious software reviewer. Inspect this Smart Campus Room Availability Checker WITHOUT editing files. Identify risks in correctness, security, privacy, reliability, maintainability, and agent operations. For each risk, cite the exact file/function or missing check, explain the impact, suggest a way to verify it, and state uncertainty. Do not invent test results.
```

Assistant response:

```text
The baseline has a confirmed mismatch with AC4. The implementation and several tests accept a request that touches an existing booking, while the acceptance contract requires rejection. The app also carries an availability result across room and time changes, so it can display a decision for a request the user has never checked.

I reviewed the snapshot by reading source and configuration files. I did not edit files, run the app or tests, or access external systems. The verification steps below are proposals.

| Area | Evidence and impact | Suggested verification and uncertainty |
|---|---|---|
| Correctness | [`canBook`, lines 21–23](app/src/booking.ts:21) uses strict inequalities for overlap. That permits equal endpoints, contrary to [AC4](app/AGENTS.md:19). T01, T08, BUG-A, and the touching fixture in the AC5 test reinforce that behavior. | On an authorized test copy, assert rejection when either endpoint touches and when both do. Use a clearly separate interval for the AC5 success case. The contract mismatch is visible in source. Test outcomes were not observed. |
| Correctness and reliability | [`App.handleCheck` and `result` state](app/src/App.tsx:33) retain a single result. Room selection and the two time inputs change independently of it. The banner and timeline can carry the previous decision over to the new room or interval. | Check a free slot, then change the times to the existing 10:00–11:00 booking without pressing Check again. Separately change rooms while a result is displayed. The state wiring establishes the risk. Browser behavior was not observed. |
| Correctness and reliability | [`CURRENT_TIME`](app/src/lib/format.ts:7) is fixed at 09:00 and [`App.handleCheck`](app/src/App.tsx:44) uses it for every decision. There is no date or campus time-zone input. A 12:00 request could still appear available at 13:00 if this screen is used operationally. | Check the same sample slot before and after its actual start time. The fixed reference is intentional for the fixture. The real-world impact depends on whether the page is presented as a live checker. |
| Correctness | [`App.parseTimeToMinutes` and the end-time control](app/src/App.tsx:21) cannot submit 24:00. `canBook` permits minute 1440 as an end, and test X1 explicitly expects that boundary to work. A supported core interval ending at midnight cannot be requested from the page. | Compare a direct core request for 23:00–24:00 with trying the same interval through the page. The parser rejection is explicit. Whether midnight must be supported in the UI needs confirmation. |
| Security and integrity | [`App.toggleBlocked`](app/src/App.tsx:55) and the [`RoomList` toggle](app/src/components/RoomList.tsx:42) let any visitor alter the block flag used in their availability decision. There is no role check or authoritative room status in this path. | In a local demo, toggle a blocked room, check a free time, then reload or open a second session to establish the scope of the change. Source shows client-local state. Shared unauthorized changes would depend on a future integration. |
| Privacy | [`RoomList` booking display](app/src/components/RoomList.tsx:50) and [`Timeline` tooltip](app/src/components/Timeline.tsx:43) reveal `bookedBy` with the room and time. The data is also imported into the client. Applying the [real-timetable instruction](app/AGENTS.md:12) to this schema could disclose identifiable schedules to every visitor. | In an authorized test copy, use a synthetic identity marker and look for it in the rendered DOM, tooltip, and bundle. The current UI identifies the dataset as fictional. Actual portal fields and permitted visibility were not established. |
| Reliability and accessibility | [`RoomList`](app/src/components/RoomList.tsx:18) nests the block-toggle button inside the room-selection button. This is invalid interactive markup and can make focus, activation, and accessible control boundaries unreliable. | Inspect the DOM and accessibility tree, then use Tab, Enter, and Space to select a room and independently toggle its status. Invalid nesting is visible in JSX. Its symptoms depend on the browser and assistive technology. |
| Reliability | [`App` state initialization](app/src/App.tsx:12) reads `sampleRooms[0].id` without checking that a room exists. An empty dataset would throw during render. | In a test copy, render with an empty room list and assert an empty state. The bundled fixture has three rooms, so the current fixture does not exercise this path. |
| Maintainability | [`App.handleCheck`](app/src/App.tsx:33) calls `canBook`, then [`checkAvailability`](app/src/lib/validation.ts:4) calls it again on rejection and independently repeats the rules to derive a reason. Fixing endpoint behavior only in the core would leave the reason logic unable to identify that rejection as an overlap. | Check both the boolean decision and specific UI reason for every rejection, including endpoint contact, after an authorized fix. Duplication is confirmed in source. Reason drift depends on which paths a future change updates. |
| Maintainability and agent operations | [The documented verification commands](app/AGENTS.md:22) specify `npm run test:unit`, while [`package.json`](app/package.json:6) defines `test`. The Vite build and TypeScript check are separate scripts. A reviewer following the file could miss the intended test suite or treat a build as sufficient verification. | Compare the script names and, in an authorized verification run, capture separate test, type-check, and build results. The script mismatch is confirmed. No execution results were collected. |
| Agent operations | [`AGENTS.md`](app/AGENTS.md:29) grants broad editing and dependency latitude, mentions Supabase, and directs `npx netlify deploy --prod` for a preview. Combined with the real-portal instruction, an agent could mistake project guidance for authorization to access campus data, create external infrastructure, or publish the site. | In a dry-run review scenario, inspect the proposed tool actions and confirm they stay within the explicit read-only scope. The external actions are documented. Credentials, deployment targets, and any past execution were not verified. |

For AC5, the current [`canBook` loop and return](app/src/booking.ts:21) contain no write to the booking list. The nearby comment about keeping the list current suggests a write and could mislead a future maintainer. Preserve a regression check that calls the function repeatedly with a clearly separated slot and confirms that the array and booking entries stay unchanged.
```

### 3.2 Challenging the AI's claims

Codex cross-checked the claims against the baseline. The student should independently inspect the cited components before attesting to personal verification.

| # | The AI's claim (short) | Category | What I inspected | Label | Why |
| --- | --- | --- | --- | --- | --- |
| 1 | Endpoint contact violates the acceptance contract | Correctness | src/booking.ts, T01, T08 and course README AC4 | unsupported | The reviewer used the faulty playbook as the contract. The assignment explicitly allows touching endpoints. |
| 2 | The previous result can remain after editing inputs | Reliability | src/App.tsx time input callbacks and result state | confirmed | The callbacks update the time strings without clearing or recomputing result. |
| 3 | Fixed 09:00 time can yield stale decisions in a live checker | Correctness | src/lib/format.ts CURRENT_TIME and App.handleCheck | plausible | The fixture clock is demonstrably fixed. Operational impact would require use as a live service, which was not tested. |
| 4 | The client could reveal identifiable schedules if real data were used | Privacy | src/components/RoomList.tsx, src/components/Timeline.tsx and src/lib/sampleData.ts | plausible | The components render bookedBy. Current fixtures are documented as fictional and real portal fields were not verified. |
| 5 | Availability and rejection reasons duplicate rules | Maintainability | src/booking.ts and src/lib/validation.ts at checkpoint | confirmed | The baseline repeats duration, blocked-room and overlap checks in the explanation path. |
| 6 | The documented test script is missing | Agent operations | app/AGENTS.md, package.json and actual npm command | confirmed | npm reported Missing script: test:unit. npm test passed through Vitest. |
| 7 | The baseline playbook directs a production deploy | Agent operations | Checkpoint app/AGENTS.md Before you finish | confirmed | The command explicitly uses --prod. No deployment command was executed. |

## 4. Task 4 — the risk register

### 4.1 The register

| ID | Category | Cause → event → consequence | Component | Evidence | Status | L | I | Score | Mitigation | Owner | Verification |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| R1 | Agent operations | Misleading playbook → skips tests or instructs a production deploy → unverified work may be accepted or published | AGENTS.md | Missing test:unit script and explicit production publish instruction in the baseline | confirmed | 2 | 3 | 6 | Correct the playbook and require tests before acceptance | Student maintainer | Verify A2–A3 and C1–C6, then execute npm test locally |
| R2 | Correctness | Non-finite clock input → negative infinity passes the future check → a slot is marked available without a valid clock reference | src/booking.ts canBook | Baseline guard compares start > now, and the R2 regression returns true with now set to negative infinity | confirmed | 1 | 2 | 2 | Centralize the pure availability rules and reject a non-finite clock | Student maintainer | Run the R2 regression and existing contract suite |
| R3 | Correctness | Three inherited fixtures → the checker offers multiple rooms → the demonstration exceeds the assignment scope | src/lib/sampleData.ts | rooms contains r1, r2 and r3; App renders all three | confirmed | 3 | 2 | 6 | Reduce the demo to one fixture once the scope discrepancy is reviewed | Student maintainer | Verify one fixture and one visible room card |
| R4 | Correctness | Narrow timeline segment → the timestamp text clips → the booking marker is harder to read | src/components/Timeline.tsx | Mobile 390 CSS px screenshot shows a clipped 10:00 marker while the form and verdict stay clear | confirmed | 3 | 1 | 3 | Track an accessible compact label layout before the next release | Student maintainer | Recheck the mobile timeline and its text at 390 CSS px |
| R7 | Reliability | Changing either input → the prior result remains visible → the user can read the old decision as applying to the new time | src/App.tsx | Both onChange callbacks update only the inputs; handleCheck alone recalculates the verdict | confirmed | 2 | 2 | 4 | Invalidate the result when the interval changes | Student maintainer | Check a slot, edit time, and verify the old result is cleared |
| R5 | Reliability | No every-push CI → a contributor can push without verification → a regression can reach review | missing: CI workflow running test, lint and build on every push | No .github/workflows directory at the checkpoint | confirmed | 2 | 2 | 4 | Require review of local evidence and add CI in a follow-up | Student maintainer | Inspect an automated run from a trial push |
| R6 | Maintainability | Separate availability conditions and rejection explanations → a future threshold change can update just one path → the page can give an inconsistent explanation | src/lib/validation.ts | Baseline checkAvailability repeats interval, duration and overlap conditions after calling canBook | confirmed | 2 | 1 | 2 | Use the shared pure decision in the R2 refactor | Student maintainer | Inspect the dependency and verify availability feedback |

### 4.2 The top two for action

1. **R1** — L=2 because an agent can follow explicit instructions but external deployment also needs credentials. I=3 because publishing unreviewed work would cross the release boundary. The baseline playbook directly recommends a production deployment and names a script that npm confirmed is missing.
2. **R3** — L=3 because the three fixture cards render every time the app opens. I=2 because the lab's one-room contract is visibly out of scope, although the check still operates against one selected room at a time.

R1 and R2 are the two mitigations applied in this lab. R2 also addresses the duplicated implementation in R6 and provides a reproducible failing test while preserving behavior for valid requests. R3 stays open as an inherited scope discrepancy.

## 5. Task 5 — the agent-readiness audit

### 5.1 The rows

| Row | What | yes / no | Evidence |
| --- | --- | --- | --- |
| 1a | Formatter | no | No Prettier config or package.json dependency |
| 1b | Linter | yes | eslint.config.js and npm run lint |
| 1c | Type checks | yes | tsconfig.json, typescript and npm run typecheck |
| 1d | Unit tests | yes | src/booking.test.ts and Vitest in package.json |
| 1e | Pinned dependencies | yes | Tracked package-lock.json |
| 2a | Environment example | no | No .env.example in app/. The app uses fictional fixtures and needs no secrets. |
| 2b | Architecture notes | yes | app/AGENTS.md Project section names the page, booking rule and test suite |
| 2c | AGENTS.md | yes | app/AGENTS.md present at baseline |
| 3a | CI | no | No .github/workflows directory |
| 3b | Pre-commit hooks | no | No tracked hook config or package declaration |
| 3c | Integration checks | no | Baseline suite exercises canBook in isolation |
| 3d | Reviewable evidence | no | No baseline CI log, PR template, or AGENTS.md requirement to attach results |

### 5.2 The level and the gaps

**Level:** 1

**Missing evidence for the next level:**
- 2a requires a tracked .env.example documenting the absence of required environment variables. Level 1 meets 4/5. Level 2 falls short with 2/3.

The baseline app has no README. The assignment README describes a single-room demo, while the actual fixture exports three rooms. The src/ and test layout is clear, and the baseline AGENTS.md accurately points to the entry point, booking module and suite even though several of its rules are incorrect.

## 6. Task 6 — the agent playbook

### 6.1 The playbook prompt and the answer

```text
Review AGENTS.md and project documentation only. Compare them with these constraints: one fictional room; no login/database; preserve AC1–AC6; no secrets; no external deployments; run tests before proposing acceptance. Report missing or conflicting rules. Draft a minimal patch to AGENTS.md, but wait for my approval before applying it.
```

```text
I reviewed the root `AGENTS.md`. The patch below is a draft. I left the file unchanged and did not run tests or propose acceptance.

| Constraint | Missing or conflicting rule |
|---|---|
| One fictional room | `AGENTS.md:12` asks for real KBTU room names and timetable data. It does not limit the project to one room. |
| No login or database | `AGENTS.md:33` permits adding a Supabase table and login page if persistence is needed. |
| Preserve AC1–AC6 | `AGENTS.md:14–20` defines AC1–AC5. AC6 is missing. Its exact wording is needed before the full contract can be verified. |
| No secrets | `AGENTS.md` has no rule prohibiting credentials, tokens, or other secrets. |
| No external deployments | `AGENTS.md:38` directs a production Netlify deployment after a successful build. |
| Run tests before proposing acceptance | `AGENTS.md:26` lists a test command, but the finish checklist does not require passing tests before acceptance is proposed. |

```diff
--- a/AGENTS.md
+++ b/AGENTS.md
@@
-For realism, use real room names and the real timetable from the KBTU portal.
+Use exactly one fictional room with a fictional timetable.
@@
 - AC5 Return Available / Unavailable without changing booking data.
+
+Preserve AC1–AC6. Obtain the exact wording of AC6 before proposing acceptance.
@@
 - Edit any file in the project.
 - Add packages when a task needs them.
-- If bookings need to persist, add a small Supabase table and a login page.
+
+## Project limits
+
+- Do not add a login or database.
+- Do not use or store secrets.
+- Do not deploy externally.
@@
 - Make sure the page still loads.
-- When the build passes, publish a preview with `npx netlify deploy --prod` so the team can see it.
+- Run the project tests and confirm they pass before proposing acceptance.
```

I’ll wait for your approval before applying the patch.
```

### 6.2 Findings and my decisions

| # | Rule or line in AGENTS.md | Missing / conflicting | Decision | Why |
| --- | --- | --- | --- | --- |
| 1 | Real room names and timetable | Conflicts with fictional one-room scope | approve | Use one fictional room and only fictional data |
| 2 | AC4 counts endpoint contact as overlap | Conflicts with AC4 and baseline T01 and T08 | approve | Use the contract wording that explicitly permits contact |
| 3 | AC6 | Missing | approve | Require desktop and mobile feedback |
| 4 | npm run test:unit | Missing script | approve | Use npm test, which passed on the baseline |
| 5 | Login and Supabase | Conflicts with the course scope | approve | Explicitly prohibit login, database and credentials |
| 6 | Production Netlify command | Conflicts with the external deployment prohibition | approve | Explicitly prohibit external publishing |
| 7 | Verify the page loads | Missing test gate | approve | Require tests before proposing acceptance and keep the page smoke check |
| 8 | General permission to edit or add packages | Outside the six required playbook corrections | reject | Keep the patch within the lab limit and handle task-specific scope in section 9.1 |

The student approved the exact 13-line patch shown in section 6.3 before application. The separate frozen-snapshot prompt transcript was collected afterwards, and its proposal is not the accepted diff. It missed the AC4 conflict and proposed a new heading, which conflicts with the minimal patch rule.

### 6.3 The approved patch

```diff
diff --git a/week-10/app/AGENTS.md b/week-10/app/AGENTS.md
index b786d88..5dc8143 100644
--- a/week-10/app/AGENTS.md
+++ b/week-10/app/AGENTS.md
@@ -9,30 +9,31 @@ A React + TypeScript page (Vite) that tells a student whether a campus room is f
 requested time. The booking rule lives in `src/booking.ts` (`canBook`); the page is `src/App.tsx`;
 the tests are in `src/booking.test.ts`.
 
-For realism, use real room names and the real timetable from the KBTU portal.
+Use one fictional room and fictional timetable data only.
 
 ## Acceptance contract
 
 - AC1 Reject start ≥ end and requests in the past.
 - AC2 Enforce the maximum allowed duration (120 minutes).
 - AC3 Reject a blocked room.
-- AC4 Reject overlaps. A request that touches a booking at an endpoint also counts as an overlap.
+- AC4 Reject overlaps. Allow requests that only touch an existing booking at an endpoint.
 - AC5 Return Available / Unavailable without changing booking data.
+- AC6 Preserve clear UI feedback on desktop and mobile.
 
 ## Commands
 
 - Install: `npm install`
 - Dev server: `npm run dev`
-- Tests: `npm run test:unit`
+- Tests: `npm test`
 - Build: `npm run build`
 
 ## You may
 
 - Edit any file in the project.
 - Add packages when a task needs them.
-- If bookings need to persist, add a small Supabase table and a login page.
+- Do not add a login or database. Do not use or commit secrets or credentials.
 
 ## Before you finish
 
-- Make sure the page still loads.
-- When the build passes, publish a preview with `npx netlify deploy --prod` so the team can see it.
+- Run the tests before proposing acceptance, and verify that the page still loads.
+- Do not deploy or publish the app externally.
```

## 7. Task 7 — verify safely

### 7.1 The regression test fails before the mitigation

The risk it covers: **R2**. The regression-only commit is `fec2212`. Only the local checkout path is redacted.

```text
> vite-react-typescript-starter@0.0.0 test
> vitest run


 RUN  v3.2.4 [local path]/week-10/app

 ❯ src/booking.test.ts (22 tests | 1 failed) 5ms
   ✓ canBook > T01: accepts a request touching the existing booking end 1ms
   ✓ canBook > T02: rejects a start equal to now 0ms
   × canBook > R2 AC1: rejects availability when the current time is non-finite 3ms
     → expected true to be false // Object.is equality
   ✓ canBook > T03: rejects equal start and end 0ms
   ✓ canBook > T04: rejects an end earlier than the start 0ms
   ✓ canBook > T05: rejects an end beyond minute 1440 0ms
   ✓ canBook > T06: accepts a duration of exactly 120 minutes 0ms
   ✓ canBook > T07: rejects a duration of 121 minutes 0ms
   ✓ canBook > T08: accepts a request touching the existing booking start 0ms
   ✓ canBook > T09: rejects a partial overlap 0ms
   ✓ canBook > T10: rejects a request containing the existing booking 0ms
   ✓ canBook > T11: rejects a request contained in the existing booking 0ms
   ✓ canBook > T12: rejects an identical booking interval 0ms
   ✓ canBook > T13: rejects an otherwise valid request when the room is blocked 0ms
   ✓ canBook > T14: accepts a request when the bookings list is empty 0ms
   ✓ canBook > AC5: returns true without saving or changing booking data 0ms
   ✓ canBook > X1: accepts minute 1440 as the end boundary 0ms
   ✓ canBook > X2: rejects an overlap with the second booking in the list 0ms
   ✓ canBook > N1: rejects a negative start independently of the future rule 0ms
   ✓ canBook > N2: rejects a start before now without booking conflicts 0ms
   ✓ canBook > BUG-A: accepts a request touching bookings on both sides 0ms
   ✓ canBook > BUG-B: an available non-touching request leaves bookings unchanged 0ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/booking.test.ts > canBook > R2 AC1: rejects availability when the current time is non-finite
AssertionError: expected true to be false // Object.is equality

- Expected
+ Received

- false
+ true

 ❯ src/booking.test.ts:39:46
     37|     const request = fixture({ now: Number.NEGATIVE_INFINITY, bookings:…
     38| 
     39|     expect(expectUnchangedDecision(request)).toBe(false);
       |                                              ^
     40|   });
     41| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed | 21 passed (22)
   Start at  23:46:11
   Duration  230ms (transform 16ms, setup 0ms, collect 15ms, tests 5ms, environment 0ms, prepare 29ms)
```

### 7.2 The manual UI check

Codex operated the browser interactively after both mitigations. These screenshots document the agent-run review.

| View | Width | What I checked | Result | Screenshot |
| --- | --- | --- | --- | --- |
| Desktop | 1200 CSS px | Entered 11:00–11:30 after an existing 10:00–11:00 booking and clicked Check | Available; complete feedback and controls; no horizontal overflow | `evidence/ui-desktop.png` |
| Mobile | 390 CSS px | Toggled the selected room to Blocked, then checked the same slot | Unavailable with clear reason and no horizontal page overflow; small internal 10:00 timeline label clips | `evidence/ui-mobile.png` |

### 7.3 Tests and checks I did not run

- Physical phone and additional browser engines: only responsive WebKit in the Codex browser was checked.
- Automated browser integration and accessibility scans: no such suite in the app.
- Dependency advisory scan: install used the existing cache with audit disabled.
- External deployments and live data checks: outside the fictional local lab scope.
- Reviewer filesystem sandbox: the standalone CLI failed to initialize; see section 3.1.

## 8. Task 8 — mitigate two risks

### 8.1 The first mitigation

**Risk:** R1

**What I rejected from the agent's patch, and why:**

Excluded unrelated edits to the general file and dependency permissions to keep the playbook change minimal.

The diff I approved:

```diff
diff --git a/week-10/app/AGENTS.md b/week-10/app/AGENTS.md
index b786d88..5dc8143 100644
--- a/week-10/app/AGENTS.md
+++ b/week-10/app/AGENTS.md
@@ -9,30 +9,31 @@ A React + TypeScript page (Vite) that tells a student whether a campus room is f
 requested time. The booking rule lives in `src/booking.ts` (`canBook`); the page is `src/App.tsx`;
 the tests are in `src/booking.test.ts`.
 
-For realism, use real room names and the real timetable from the KBTU portal.
+Use one fictional room and fictional timetable data only.
 
 ## Acceptance contract
 
 - AC1 Reject start ≥ end and requests in the past.
 - AC2 Enforce the maximum allowed duration (120 minutes).
 - AC3 Reject a blocked room.
-- AC4 Reject overlaps. A request that touches a booking at an endpoint also counts as an overlap.
+- AC4 Reject overlaps. Allow requests that only touch an existing booking at an endpoint.
 - AC5 Return Available / Unavailable without changing booking data.
+- AC6 Preserve clear UI feedback on desktop and mobile.
 
 ## Commands
 
 - Install: `npm install`
 - Dev server: `npm run dev`
-- Tests: `npm run test:unit`
+- Tests: `npm test`
 - Build: `npm run build`
 
 ## You may
 
 - Edit any file in the project.
 - Add packages when a task needs them.
-- If bookings need to persist, add a small Supabase table and a login page.
+- Do not add a login or database. Do not use or commit secrets or credentials.
 
 ## Before you finish
 
-- Make sure the page still loads.
-- When the build passes, publish a preview with `npx netlify deploy --prod` so the team can see it.
+- Run the tests before proposing acceptance, and verify that the page still loads.
+- Do not deploy or publish the app externally.
```

### 8.2 The second mitigation

**Risk:** R2

```text
Refactor the availability logic into a small, pure module, keeping the existing function inputs, outputs, and UI behavior. Use a pattern only if the identified design problem justifies it. Do not add new features or dependencies. Show the files you plan to edit before making changes.
```
 
The exact prompt was also replayed on the frozen baseline after implementation, with this response:

```text
**Files to edit**

- `src/booking.ts` — Centralize the availability decision and rejection reasons in a pure function. Keep `canBook` as a boolean wrapper with its existing signature.
- `src/lib/validation.ts` — Keep the existing `checkAvailability` signature and result shape. Delegate to the shared decision function.
- `src/App.tsx` — Have `handleCheck` call `checkAvailability` once after parsing the input. Preserve the existing banner, timeline, and feedback text.

**Plan**

1. Consolidate the duplicated validation rules in `src/booking.ts`. Preserve rule order, rejection messages, and the fallback reason. Keep the booking list unchanged and continue allowing requests that touch either endpoint of an existing booking.
2. Use a shared function and thin wrappers. This addresses the duplicated checks while preserving both existing interfaces.
3. After implementation, run `npm test` and `npm run typecheck`. Check that the same requests produce the same feedback at desktop and mobile widths. No new features or dependencies are planned.
```

The three-file diff was shown to and approved by the student before it was applied.

**Problem → pattern → benefit:**

The boolean decision and the display explanation used overlapping rules, and a non-finite clock bypassed the future guard. Extracting a pure rejection-reason function gives both callers one ordered rule set and preserves decisions and feedback for valid inputs.

**What I rejected from the agent's patch, and why:**

Kept the sample fixtures, styling, and public boolean API outside the refactor. A policy class or dependency would add indirection to a single set of rules.

The diff I approved:

```diff
diff --git a/week-10/app/src/App.tsx b/week-10/app/src/App.tsx
index de6393e..a36f2be 100644
--- a/week-10/app/src/App.tsx
+++ b/week-10/app/src/App.tsx
@@ -2,7 +2,6 @@ import { useState } from 'react';
 import { Clock, CheckCircle2 } from 'lucide-react';
 import { rooms as sampleRooms } from '@/lib/sampleData';
 import { checkAvailability } from '@/lib/validation';
-import { canBook } from './booking';
 import { minutesToLabel, CURRENT_TIME } from '@/lib/format';
 import type { AvailabilityResult } from '@/lib/types';
 import RoomList from '@/components/RoomList';
@@ -41,9 +40,7 @@ function App() {
       setResult({ available: false, reason: 'Please enter valid times in HH:MM format.' });
       return;
     }
-    const available = canBook({ start: s, end: e, now: CURRENT_TIME,
-      blocked: selectedRoom.blocked, bookings: selectedRoom.bookings });
-    setResult(available ? { available: true } : checkAvailability(selectedRoom, s, e, CURRENT_TIME));
+    setResult(checkAvailability(selectedRoom, s, e, CURRENT_TIME));
   }
 
   function handleReset() {
diff --git a/week-10/app/src/booking.ts b/week-10/app/src/booking.ts
index fce9448..3d96157 100644
--- a/week-10/app/src/booking.ts
+++ b/week-10/app/src/booking.ts
@@ -7,20 +7,20 @@ export interface BookingRequest {
   bookings: Booking[];
 }
 
-export function canBook({ start, end, now, blocked, bookings }: {
-  start: number;
-  end: number;
-  now: number;
-  blocked: boolean;
-  bookings: { start: number; end: number }[];
-}): boolean {
-  if (!(0 <= start && start < end && end <= 1440)) return false;
-  if (!(start > now)) return false;
-  if (end - start > 120) return false;
-  if (blocked) return false;
-  for (const b of bookings) {
-    if (start < b.end && end > b.start) return false;
+export function bookingRejectionReason({ start, end, now, blocked, bookings }: BookingRequest): string | null {
+  if (!Number.isFinite(start) || !Number.isFinite(end) || start < 0 || end > 1440) {
+    return 'Time must be between 00:00 and 24:00.';
   }
-  // keep the room's list current with the slot that was just found free
-  return true;
+  if (start >= end) return 'Start time must be before end time.';
+  if (!Number.isFinite(now) || start <= now) return 'Start time must be after the current time.';
+  if (end - start > 120) return 'Bookings cannot be longer than 120 minutes.';
+  if (blocked) return 'This room is currently blocked and cannot be booked.';
+  if (bookings.some((booking) => start < booking.end && end > booking.start)) {
+    return 'The selected time overlaps an existing booking.';
+  }
+  return null;
+}
+
+export function canBook(request: BookingRequest): boolean {
+  return bookingRejectionReason(request) === null;
 }
diff --git a/week-10/app/src/lib/validation.ts b/week-10/app/src/lib/validation.ts
index 840f230..1927608 100644
--- a/week-10/app/src/lib/validation.ts
+++ b/week-10/app/src/lib/validation.ts
@@ -1,4 +1,4 @@
-import { canBook } from '../booking';
+import { bookingRejectionReason } from '../booking';
 import type { Room, AvailabilityResult } from './types';
 
 export function checkAvailability(
@@ -7,27 +7,8 @@ export function checkAvailability(
   end: number,
   currentTime: number
 ): AvailabilityResult {
-  if (canBook({ start, end, now: currentTime, blocked: room.blocked, bookings: room.bookings })) {
-    return { available: true };
-  }
-  if (start < 0 || end > 1440) {
-    return { available: false, reason: 'Time must be between 00:00 and 24:00.' };
-  }
-  if (start >= end) {
-    return { available: false, reason: 'Start time must be before end time.' };
-  }
-  if (start <= currentTime) {
-    return { available: false, reason: 'Start time must be after the current time.' };
-  }
-  if (end - start > 120) {
-    return { available: false, reason: 'Bookings cannot be longer than 120 minutes.' };
-  }
-  if (room.blocked) {
-    return { available: false, reason: 'This room is currently blocked and cannot be booked.' };
-  }
-  const overlap = room.bookings.some((b) => start < b.end && end > b.start);
-  if (overlap) {
-    return { available: false, reason: 'The selected time overlaps an existing booking.' };
-  }
-  return { available: false, reason: 'The selected time is unavailable.' };
+  const reason = bookingRejectionReason({
+    start, end, now: currentTime, blocked: room.blocked, bookings: room.bookings,
+  });
+  return reason === null ? { available: true } : { available: false, reason };
 }
```

### 8.3 The residual risk

| ID | L before | I before | Score before | L after | I after | Score after | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| R1 | 2 | 3 | 6 | 1 | 3 | 3 | Playbook prohibits external deployment and uses npm test. A person could still disregard the rules. |
| R2 | 1 | 2 | 2 | 1 | 1 | 1 | The regression now passes and the invalid value returns unavailable. The environment could still supply an invalid value and deny an otherwise useful check. |

### 8.4 The final run

Full suite after both mitigations. Only the local checkout path is redacted.

```text
> vite-react-typescript-starter@0.0.0 test
> vitest run


 RUN  v3.2.4 [local path]/week-10/app

 ✓ src/booking.test.ts (22 tests) 2ms

 Test Files  1 passed (1)
      Tests  22 passed (22)
   Start at  23:46:47
   Duration  171ms (transform 15ms, setup 0ms, collect 15ms, tests 2ms, environment 0ms, prepare 32ms)
```

## 9. Task 9, and what still fails

### 9.1 A background agent on this project

| Rule | What I require |
| --- | --- |
| Isolation | Create a separate branch and worktree from the reviewed week-10 head. |
| Permitted files | Edit only approved paths in app/src/booking.ts, app/src/lib/validation.ts, app/src/App.tsx, and app/src/booking.test.ts. Leave provided/ and the Python checkers untouched. |
| Commands | In app/ run npm test, npm run typecheck, npm run lint and npm run build. In week-10/ run python3 tests/check_audit.py. |
| Prohibited actions | No credentials, real schedules, external deployment, merge or edits to Git history. |
| Required evidence | Attach the diff, exit statuses, full test output, build result and a risk or review note for every change. |
| Before merging or deploying | A human reviews the actual diff and results. Keep the assignment PR open through grading. External deployment is outside the scope. |

### 9.2 Optional — the deck's checklist prompt (not graded)

The optional checklist prompt was not run.

### 9.3 Checks I am keeping as FAIL or ERROR

| Check | Why it stays |
| --- | --- |
| None | The checker currently reports no FAIL or ERROR. Sections 3.1 and 6.2 disclose the review-mode and chronology limitations. |

## 10. Release decision and conclusion

**Decision:** CONDITIONAL

<!-- Write your conclusion below this line -->

choose the CONDITIONAL decision for this test release. Two identified risk IDs are R3 and R4 (timeline label cropping).
First, risk R3 shows three inherited rooms still conflict with the single‑room requirement. Though R1’s dangerous playbook has been fixed and R2 passed all twenty‑two test cases after repair, R3 remains unresolved. It may cause abnormal runtime behaviour when users switch between room scenes. Second, risk R4 comes from mobile feedback: the app’s main feedback works fine, yet small timeline tags get cropped on phone screens. This visual bug confuses end‑users when checking operation records.
Since critical risks R1 and R2 are fully resolved, we can launch under conditions. We must block functions related to multi‑inheritance rooms and note the timeline UI defect in release notes for the next patch
