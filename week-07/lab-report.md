# Week 07 — Lab report

**Name:** Elshibai Ulzhalgas
**Group:** Monday 16:00-19:00
**Date:** 2026-11-02

Fill in every section. **Do not delete, rename or renumber the headings.** The checker and the
grader find your answers by them. You can add rows to any table, but never remove its header.

---

## 1. Setup

| | |
| --- | --- |
| Project I continue (`week-06` = my Week 06 Bolt project, `starter` = the provided starter) | week-06 |
| Bolt project link (or `not shared`, and why) | https://bolt.new/~/sb1-g3bmtzgh |
| Assistant that generated the tests (tool) | ChatGPT / Codex, fresh isolated assistant context |
| Exact model (with its version, or `not displayed`) | not displayed |
| Where I ran the tests (Bolt terminal / my computer / Codespace) | my computer, Node 24.13.1 |
| Vitest version (the `RUN  v…` line of a run) | 3.2.4 |
| Test command | npm test -- --reporter=verbose  660 is excluded from existing 600–660, so the intervals only touch. |

---

## 2. Task 1 — baseline and the booking function

**Before editing:** where did the booking decision live in the project you started from?

| | |
| --- | --- |
| File and function (or "inside the page component") | app/src/lib/validation.ts: checkAvailability |
| Its inputs | room, start, end, currentTime in numeric minutes |
| What it returned | object with Boolean available and optional reason |
| How the page used it | App.tsx handleCheck called it and stored the result for ResultBanner |

**What I changed to extract `canBook`.** Say which file it now lives in, what you moved, and why
the behaviour did not change. Also say which file of the page now calls it. 40 words or more.

<!-- Write below this line -->
The baseline is an unchanged copy of week-06:week-06/prototype/project from the local Week 06 branch, flattened into app/ so package.json is directly in app/. Baseline commit 5977d95 precedes extraction. The Boolean guards were moved in the same order to app/src/booking.ts, keeping the comparisons unchanged. App.tsx calls canBook directly; HH:MM parsing and human-readable rejection reasons remain at the interface boundary. Existing numerical behavior is preserved, including the unspecified reversed-existing-booking case. All report prose and case reasons in this revision are AI-assisted drafts, disclosed rather than claimed as independent student writing.

---

## 3. Task 2 — the test plan

Default fixture: `now = 540`, `blocked = false`, `bookings = [{ start: 600, end: 660 }]`, fresh
for every test. **The Expected column comes from AC1–AC4, never from the code.** Write the
**reason** for each expected result **before** you send the generation prompt.

| ID | Candidate / changed input | Expected | AC | Reason (in your words) |
| --- | --- | --- | --- | --- |
| T01 | 660–720 (touching after) | true | AC4 | 660 is excluded from existing 600–660, so the intervals only touch. |
| T02 | 540–570 (starts now) | false | AC1 | 540 equals now rather than being strictly later. |
| T03 | 720–720 (zero duration) | false | AC1 | Equal endpoints have no positive duration. |
| T04 | 750–720 (reversed) | false | AC1 | The end is earlier than the start. |
| T05 | 1380–1441 (past day end) | false | AC1 | 1441 is one minute beyond the allowed day end. |
| T06 | 720–840 (120 minutes) | true | AC2 | The duration is exactly 120, which does not exceed the maximum. |
| T07 | 720–841 (121 minutes) | false | AC2 | 121 minutes exceeds the maximum by one minute. |
| T08 | 570–600 (touching before) | true | AC4 | The request excludes 600, where the existing interval begins. |
| T09 | 630–690 (partial overlap) | false | AC4 | The shared 630–660 portion conflicts with an existing booking. |
| T10 | 570–690 (contains booking) | false | AC4 | The request contains the whole existing 600–660 interval. |
| T11 | 615–645 (inside booking) | false | AC4 | The whole request lies inside the existing booking. |
| T12 | 600–660 (identical interval) | false | AC4 | Identical intervals share all booked minutes. |
| T13 | 660–720, blocked = true | false | AC3 | Blocked status overrides an otherwise valid request. |
| T14 | 630–690, bookings = [] | true | AC4 | No existing interval remains to conflict with this request. |
| AC5 | an Available request — the bookings after the call equal the bookings before | true, data unchanged | AC5 | A successful check must not save or alter existing bookings. |
| X1 | 1380–1440 | true | AC1 | 1440 is allowed as an end, with a future 60-minute request and no conflict. |
| X2 | 720–780, bookings = [{start:600,end:660},{start:700,end:760}] | false | AC4 | The second entry overlaps 720–760 and must be checked too. |

X1 and X2 are **your own two cases**: a boundary or a state that T01–T14 do not reach. Fill all
five columns.

---

## 4. Task 3 — the generation prompt and the first suite

**The prompt exactly as I sent it.** Use the deck's prompt with `[our test framework]` replaced by
`Vitest`, followed by the case table from section 3:

```text
Generate tests for the existing booking function using Vitest. Use AC1–AC6 and the reviewed case table below.

Import the real function used by the page. Keep its code unchanged. Use fixed time and fresh fixtures. Assert exact decisions and unchanged booking data.

Return the test file, run command, and AC mapping. Flag unclear requirements. We will run the tests ourselves.

AC1: accept only 0 <= start < end <= 1440 and start > now. AC2: reject duration >120. AC3: reject blocked rooms. AC4: reject overlaps, allow touching endpoints. AC5: Boolean decision without changing bookings. AC6: usable responsive page and clear validation (manual UI).
Default fixture now=540, blocked=false, bookings=[{start:600,end:660}]. Each test gets fresh data.
Reviewed case table (AI-assisted draft, not represented as independently student-authored):
T01 660-720 true AC4: 660 is excluded from existing 600-660, so they only touch.
T02 540-570 false AC1: start equals now, not later.
T03 720-720 false AC1: equal endpoints have no positive duration.
T04 750-720 false AC1: end is earlier than start.
T05 1380-1441 false AC1: end exceeds day boundary 1440.
T06 720-840 true AC2: exactly 120 does not exceed maximum.
T07 720-841 false AC2: 121 exceeds maximum by one minute.
T08 570-600 true AC4: request excludes 600, existing begins there.
T09 630-690 false AC4: shared 630-660 portion overlaps.
T10 570-690 false AC4: entire existing booking is inside request.
T11 615-645 false AC4: entire request lies inside existing booking.
T12 600-660 false AC4: identical intervals share all booked minutes.
T13 660-720 blocked=true false AC3: blocked overrides otherwise valid request.
T14 630-690 bookings=[] true AC4: no existing interval conflicts.
AC5 available request 660-720 true and unchanged data AC5: successful checking must not save or alter bookings.
X1 1380-1440 true AC1: 1440 is allowed as end, duration 60, future and no overlap.
X2 720-780 bookings=[{start:600,end:660},{start:700,end:760}] false AC4: second list entry overlaps 720-760 and must be checked.

Existing app/src/booking.ts:
export interface Booking { start: number; end: number }
export interface BookingRequest { start: number; end: number; now: number; blocked: boolean; bookings: Booking[]; }
export function canBook({ start, end, now, blocked, bookings }: BookingRequest): boolean {
 if (start < 0 || end > 1440) return false;
 if (start >= end) return false;
 if (start <= now) return false;
 if (end - start > 120) return false;
 if (blocked) return false;
 if (bookings.some((b) => start < b.end && end > b.start)) return false;
 return true;
}

Use one separately named test per case, no test.each. Return the complete file in a TypeScript fenced block, then run command and mapping in plain text. Do not run tests or edit production code.

```

**The assistant's answer: run command, AC mapping and any unclear requirements it flagged,
pasted unedited.** Its test file goes to `suites/first/` and is not pasted here:

```text
Run from app/: npx vitest run src/booking.test.ts

AC1: T02–T05, X1.
AC2: T06–T07.
AC3: T13.
AC4: T01, T08–T12, T14, X2.
AC5: dedicated AC5 test; every test also checks Boolean output and unchanged booking data.
AC6: manual UI checks required; outside this function suite.

Unclear requirements: behavior for NaN, Infinity, fractional minutes, and malformed existing bookings is unspecified. The reviewed cases also omit an isolated negative-start check and acceptance of start=0 with now<0. The supplied excerpt does not independently establish that the page imports this function.

Tests were not run; production code was not edited.

```

The first suite was saved to `suites/first/` **before** I changed anything in it: yes

---

## 5. Task 4 — review of the first suite

Review it **before** you run it. Look at the imports, the expected values, isolation, duplicates
and skipped tests. Make one row per decision. At least **two** rows, and each one names the kind of
weakness (the deck's table: *no exception occurred* · *expected = current output* · *only valid
requests* · *mocked booking function*, or your own) and the AC that decides it.

| # | Test or part of the suite | What is weak or wrong | Decision: accept / revise / reject | AC or reason |
| --- | --- | --- | --- | --- |
| 1 | T01–T14, real import and fixture helper | No incorrect expected values, mocked booking function, skipped tests or shared mutable fixture found. | accept | AC1–AC4 expected decisions match the reviewed table, independent of current output. |
| 2 | expectDecision helper and AC5 test | Exact Boolean assertions and preservation checks are hidden inside a helper; individual cases lack literal assertions. | revise | Make .toBe(true/false) and the Available AC5 before/after comparison explicit in each relevant test. |
| 3 | Boundary coverage | No isolated negative-start or one-minute-before-now case. | revise | AC1: add tests that reject negative start with now=-10 and reject start=539 at now=540. |

---

## 6. Task 5 — running, diagnosing, improving

### 6.1 The first run

The untouched first suite was run after its review. No test failed.
```text

> vite-react-typescript-starter@0.0.0 test
> vitest run --reporter=verbose


 RUN  v3.2.4 /Users/elshibaiulzhalgas/se-practice/week-07/app

 ✓ src/booking.test.ts > canBook > T01: accepts a request touching the existing booking end 1ms
 ✓ src/booking.test.ts > canBook > T02: rejects a start equal to now 0ms
 ✓ src/booking.test.ts > canBook > T03: rejects equal start and end 0ms
 ✓ src/booking.test.ts > canBook > T04: rejects an end earlier than the start 0ms
 ✓ src/booking.test.ts > canBook > T05: rejects an end beyond minute 1440 0ms
 ✓ src/booking.test.ts > canBook > T06: accepts a duration of exactly 120 minutes 0ms
 ✓ src/booking.test.ts > canBook > T07: rejects a duration of 121 minutes 0ms
 ✓ src/booking.test.ts > canBook > T08: accepts a request touching the existing booking start 0ms
 ✓ src/booking.test.ts > canBook > T09: rejects a partial overlap 0ms
 ✓ src/booking.test.ts > canBook > T10: rejects a request containing the existing booking 0ms
 ✓ src/booking.test.ts > canBook > T11: rejects a request contained in the existing booking 0ms
 ✓ src/booking.test.ts > canBook > T12: rejects an identical booking interval 0ms
 ✓ src/booking.test.ts > canBook > T13: rejects an otherwise valid request when the room is blocked 0ms
 ✓ src/booking.test.ts > canBook > T14: accepts a request when the bookings list is empty 0ms
 ✓ src/booking.test.ts > canBook > AC5: returns true without saving or changing booking data 0ms
 ✓ src/booking.test.ts > canBook > X1: accepts minute 1440 as the end boundary 0ms
 ✓ src/booking.test.ts > canBook > X2: rejects an overlap with the second booking in the list 0ms

 Test Files  1 passed (1)
      Tests  17 passed (17)
   Start at  03:29:40
   Duration  283ms (transform 16ms, setup 0ms, collect 14ms, tests 2ms, environment 0ms, prepare 29ms)

npm notice
npm notice New minor version of npm available! 11.8.0 -> 11.21.1
npm notice Changelog: https://github.com/npm/cli/releases/tag/v11.21.1
npm notice To update run: npm install -g npm@11.21.1
npm notice
```

| Failing test | Observed failure | First check | Test repair or implementation fix? | Action taken |
| --- | --- | --- | --- | --- |
| none | 17 passed; no assertion failures | Inputs, expected values and import reviewed against AC1–AC5 | No implementation fix | Improve assertion visibility and add two missing independent AC1 boundaries. |

Environment setup note: the first npm installation attempt could not write the protected home cache. Retrying with a temporary cache succeeded. This was dependency setup, not a failing test or a code defect.

### 6.2 The improvement prompt

Prompt as sent (the inline output is explicitly a summary excerpt; the complete untouched run is in 6.1):
```text
Review this test suite against AC1–AC6 and our case table. Identify incorrect expectations, weak assertions, duplicated cases, and missing boundaries.

For each proposed change, explain the requirement and the defect it could detect. Improve the tests without changing correct expectations to match buggy behavior.

Use the actual failure output below. Separate test repairs from implementation fixes.

Actual first run (summary excerpt; no failures):
 RUN  v3.2.4 /Users/elshibaiulzhalgas/se-practice/week-07/app
 Test Files  1 passed (1)
      Tests  17 passed (17)
Full unedited output: /private/tmp/week07-first-run.txt

The current test suite is your preserved generated suite at /Users/elshibaiulzhalgas/se-practice/week-07/suites/first/booking.test.ts. The reviewed case table is in lab-report.md section 3. Review decisions made before first run: accept correct plan decisions and real import; revise exact .toBe(expected) helper into explicit .toBe(true/false) inside each T test, put explicit before/after booking comparison inside the Available AC5 test; add isolated AC1 negative-start and start-before-now tests.

Make these improvements in /Users/elshibaiulzhalgas/se-practice/week-07/app/src/booking.test.ts ONLY. Keep first suite unchanged and production booking.ts unchanged. Use 19 separately named tests total: T01-T14, AC5, X1, X2, N1 negative start -1 to30 now=-10 with empty bookings (false from lower day bound), N2 start539 end570 now540 with empty bookings (false from future rule). Fresh fixtures, exact assertions. Save this exact received prompt as work/week07-improvement-prompt.txt and your complete review response as work/week07-improvement-answer.txt under /Users/elshibaiulzhalgas/Documents/Codex/2026-10-24/referenced-chatgpt-conversation-this-is-an/. Do not run tests. Return requirement/defect rationale and what did/did not change.
```
Assistant response, unedited:
```text
Updated only the active test suite to 19 separately named tests. The original run output records 17 passing tests and no failures; there is no failure-driven implementation fix to make. I did not run the revised tests.

Review and test improvements:
- All original expected decisions are correct under AC1–AC4. The real import, fixed now values, and fresh fixtures remain.
- Each case now contains an explicit .toBe(true) or .toBe(false). The previous .toBe(expected) was already exact, so this is a visibility improvement rather than a repair of a weak truthiness assertion. Exact Boolean assertions detect returning 1, 0, strings, or undefined.
- The Available AC5 test now visibly snapshots booking values before calling canBook and compares them afterward. This detects insertion, deletion, reordering, or changed booking fields. Booking comparisons remain in the other cases through a helper.
- N1 (-1–30, now=-10, empty bookings) enforces AC1's lower day boundary independently of the future rule. It detects a missing negative-start guard.
- N2 (539–570, now=540, empty bookings) enforces AC1's strictly future start independently of overlap. It detects accepting past starts, such as checking equality alone.
- T01 and AC5 share the same available request deliberately: T01 exercises touching endpoints, while AC5 makes non-mutation explicit. Neither was removed.
- Existing boundary and state coverage remains: starts-now T02; equal/reversed endpoints T03–T04; end 1441/1440 T05/X1; duration 120/121 T06–T07; touching endpoints T01/T08; overlap forms T09–T12; blocked room T13; empty bookings T14; second booking conflict X2.

The section 3 table's Expected and AC columns match the original tests, but its Reason cells are shifted: T01 contains T02's reason, continuing through T14 containing AC5's reason, with AC5 blank. This is a report defect, not a reason to change test expectations. The table was left unchanged as requested.

Remaining coverage limits: accepting start=0 would require now<0 and remains untested within the specified 19 cases. Non-finite/fractional inputs and malformed existing bookings lack explicit requirements. AC6 remains a manual responsive-page and validation check; this function suite cannot establish it.

Implementation fixes: none. Production booking.ts and the preserved first suite were left unchanged. Only app/src/booking.test.ts was improved; the requested prompt and review response were saved in work/.
```
The reported shifted Reason cells were corrected using the pre-generation rationale from the prompt; no Expected values were changed.

### 6.3 The final run

After restoring all three mutants, the complete final suite was run again:
```text

> vite-react-typescript-starter@0.0.0 test
> vitest run --reporter=verbose


 RUN  v3.2.4 /Users/elshibaiulzhalgas/se-practice/week-07/app

 ✓ src/booking.test.ts > canBook > T01: accepts a request touching the existing booking end 1ms
 ✓ src/booking.test.ts > canBook > T02: rejects a start equal to now 0ms
 ✓ src/booking.test.ts > canBook > T03: rejects equal start and end 0ms
 ✓ src/booking.test.ts > canBook > T04: rejects an end earlier than the start 0ms
 ✓ src/booking.test.ts > canBook > T05: rejects an end beyond minute 1440 0ms
 ✓ src/booking.test.ts > canBook > T06: accepts a duration of exactly 120 minutes 0ms
 ✓ src/booking.test.ts > canBook > T07: rejects a duration of 121 minutes 0ms
 ✓ src/booking.test.ts > canBook > T08: accepts a request touching the existing booking start 0ms
 ✓ src/booking.test.ts > canBook > T09: rejects a partial overlap 0ms
 ✓ src/booking.test.ts > canBook > T10: rejects a request containing the existing booking 0ms
 ✓ src/booking.test.ts > canBook > T11: rejects a request contained in the existing booking 0ms
 ✓ src/booking.test.ts > canBook > T12: rejects an identical booking interval 0ms
 ✓ src/booking.test.ts > canBook > T13: rejects an otherwise valid request when the room is blocked 0ms
 ✓ src/booking.test.ts > canBook > T14: accepts a request when the bookings list is empty 0ms
 ✓ src/booking.test.ts > canBook > AC5: returns true without saving or changing booking data 0ms
 ✓ src/booking.test.ts > canBook > X1: accepts minute 1440 as the end boundary 0ms
 ✓ src/booking.test.ts > canBook > X2: rejects an overlap with the second booking in the list 0ms
 ✓ src/booking.test.ts > canBook > N1: rejects a negative start independently of the future rule 0ms
 ✓ src/booking.test.ts > canBook > N2: rejects a start before now without booking conflicts 0ms

 Test Files  1 passed (1)
      Tests  19 passed (19)
   Start at  03:39:07
   Duration  282ms (transform 20ms, setup 0ms, collect 15ms, tests 2ms, environment 0ms, prepare 33ms)

npm notice
npm notice New minor version of npm available! 11.8.0 -> 11.21.1
npm notice Changelog: https://github.com/npm/cli/releases/tag/v11.21.1
npm notice To update run: npm install -g npm@11.21.1
npm notice
```
TypeScript checking and the production build also passed. The build reports an outdated Browserslist database warning; this does not affect the observed unit-test outcomes.

## 7. Task 6 — deliberate defects

Tests were unchanged across all mutant runs. Each trial began from the correct source; the source was restored immediately after the run and in a finally block.

| Trial | Intentional change | Detected / Survived | Failing test ID(s) | If it survived: why, and what you added |
| --- | --- | --- | --- | --- |
| M1 | Reject duration >= 120 instead of > 120 | Detected | T06 | Not applicable; assertion failure, no survivor. |
| M2 | Treat touching endpoints as an overlap | Detected | T01, T08, AC5 | Not applicable; assertion failures, no survivor. |
| M3 | Remove the blocked-room rejection | Detected | T13 | Not applicable; assertion failure, no survivor. |

**M1**
```text

> vite-react-typescript-starter@0.0.0 test
> vitest run --reporter=verbose


 RUN  v3.2.4 /Users/elshibaiulzhalgas/se-practice/week-07/app

 ✓ src/booking.test.ts > canBook > T01: accepts a request touching the existing booking end 1ms
 ✓ src/booking.test.ts > canBook > T02: rejects a start equal to now 0ms
 ✓ src/booking.test.ts > canBook > T03: rejects equal start and end 0ms
 ✓ src/booking.test.ts > canBook > T04: rejects an end earlier than the start 0ms
 ✓ src/booking.test.ts > canBook > T05: rejects an end beyond minute 1440 0ms
 × src/booking.test.ts > canBook > T06: accepts a duration of exactly 120 minutes 2ms
   → expected false to be true // Object.is equality
 ✓ src/booking.test.ts > canBook > T07: rejects a duration of 121 minutes 0ms
 ✓ src/booking.test.ts > canBook > T08: accepts a request touching the existing booking start 0ms
 ✓ src/booking.test.ts > canBook > T09: rejects a partial overlap 0ms
 ✓ src/booking.test.ts > canBook > T10: rejects a request containing the existing booking 0ms
 ✓ src/booking.test.ts > canBook > T11: rejects a request contained in the existing booking 0ms
 ✓ src/booking.test.ts > canBook > T12: rejects an identical booking interval 0ms
 ✓ src/booking.test.ts > canBook > T13: rejects an otherwise valid request when the room is blocked 0ms
 ✓ src/booking.test.ts > canBook > T14: accepts a request when the bookings list is empty 0ms
 ✓ src/booking.test.ts > canBook > AC5: returns true without saving or changing booking data 0ms
 ✓ src/booking.test.ts > canBook > X1: accepts minute 1440 as the end boundary 0ms
 ✓ src/booking.test.ts > canBook > X2: rejects an overlap with the second booking in the list 0ms
 ✓ src/booking.test.ts > canBook > N1: rejects a negative start independently of the future rule 0ms
 ✓ src/booking.test.ts > canBook > N2: rejects a start before now without booking conflicts 0ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/booking.test.ts > canBook > T06: accepts a duration of exactly 120 minutes
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:49:72
     47| 
     48|   it('T06: accepts a duration of exactly 120 minutes', () => {
     49|     expect(expectUnchangedDecision(fixture({ start: 720, end: 840 })))…
       |                                                                        ^
     50|   });
     51| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed | 18 passed (19)
   Start at  03:33:48
   Duration  254ms (transform 16ms, setup 0ms, collect 15ms, tests 5ms, environment 0ms, prepare 31ms)

npm notice
npm notice New minor version of npm available! 11.8.0 -> 11.21.1
npm notice Changelog: https://github.com/npm/cli/releases/tag/v11.21.1
npm notice To update run: npm install -g npm@11.21.1
npm notice
```

**M2**
```text

> vite-react-typescript-starter@0.0.0 test
> vitest run --reporter=verbose


 RUN  v3.2.4 /Users/elshibaiulzhalgas/se-practice/week-07/app

 × src/booking.test.ts > canBook > T01: accepts a request touching the existing booking end 3ms
   → expected false to be true // Object.is equality
 ✓ src/booking.test.ts > canBook > T02: rejects a start equal to now 0ms
 ✓ src/booking.test.ts > canBook > T03: rejects equal start and end 0ms
 ✓ src/booking.test.ts > canBook > T04: rejects an end earlier than the start 0ms
 ✓ src/booking.test.ts > canBook > T05: rejects an end beyond minute 1440 0ms
 ✓ src/booking.test.ts > canBook > T06: accepts a duration of exactly 120 minutes 0ms
 ✓ src/booking.test.ts > canBook > T07: rejects a duration of 121 minutes 0ms
 × src/booking.test.ts > canBook > T08: accepts a request touching the existing booking start 0ms
   → expected false to be true // Object.is equality
 ✓ src/booking.test.ts > canBook > T09: rejects a partial overlap 0ms
 ✓ src/booking.test.ts > canBook > T10: rejects a request containing the existing booking 0ms
 ✓ src/booking.test.ts > canBook > T11: rejects a request contained in the existing booking 0ms
 ✓ src/booking.test.ts > canBook > T12: rejects an identical booking interval 0ms
 ✓ src/booking.test.ts > canBook > T13: rejects an otherwise valid request when the room is blocked 0ms
 ✓ src/booking.test.ts > canBook > T14: accepts a request when the bookings list is empty 0ms
 × src/booking.test.ts > canBook > AC5: returns true without saving or changing booking data 0ms
   → expected false to be true // Object.is equality
 ✓ src/booking.test.ts > canBook > X1: accepts minute 1440 as the end boundary 0ms
 ✓ src/booking.test.ts > canBook > X2: rejects an overlap with the second booking in the list 0ms
 ✓ src/booking.test.ts > canBook > N1: rejects a negative start independently of the future rule 0ms
 ✓ src/booking.test.ts > canBook > N2: rejects a start before now without booking conflicts 0ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 3 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/booking.test.ts > canBook > T01: accepts a request touching the existing booking end
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:29:72
     27| describe('canBook', () => {
     28|   it('T01: accepts a request touching the existing booking end', () =>…
     29|     expect(expectUnchangedDecision(fixture({ start: 660, end: 720 })))…
       |                                                                        ^
     30|   });
     31| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/3]⎯

 FAIL  src/booking.test.ts > canBook > T08: accepts a request touching the existing booking start
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:57:72
     55| 
     56|   it('T08: accepts a request touching the existing booking start', () …
     57|     expect(expectUnchangedDecision(fixture({ start: 570, end: 600 })))…
       |                                                                        ^
     58|   });
     59| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/3]⎯

 FAIL  src/booking.test.ts > canBook > AC5: returns true without saving or changing booking data
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:88:30
     86|     const before = request.bookings.map((booking) => ({ ...booking }));
     87| 
     88|     expect(canBook(request)).toBe(true);
       |                              ^
     89|     expect(request.bookings).toStrictEqual(before);
     90|   });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/3]⎯


 Test Files  1 failed (1)
      Tests  3 failed | 16 passed (19)
   Start at  03:33:49
   Duration  175ms (transform 15ms, setup 0ms, collect 14ms, tests 5ms, environment 0ms, prepare 39ms)

npm notice
npm notice New minor version of npm available! 11.8.0 -> 11.21.1
npm notice Changelog: https://github.com/npm/cli/releases/tag/v11.21.1
npm notice To update run: npm install -g npm@11.21.1
npm notice
```

**M3**
```text

> vite-react-typescript-starter@0.0.0 test
> vitest run --reporter=verbose


 RUN  v3.2.4 /Users/elshibaiulzhalgas/se-practice/week-07/app

 ✓ src/booking.test.ts > canBook > T01: accepts a request touching the existing booking end 1ms
 ✓ src/booking.test.ts > canBook > T02: rejects a start equal to now 0ms
 ✓ src/booking.test.ts > canBook > T03: rejects equal start and end 0ms
 ✓ src/booking.test.ts > canBook > T04: rejects an end earlier than the start 0ms
 ✓ src/booking.test.ts > canBook > T05: rejects an end beyond minute 1440 0ms
 ✓ src/booking.test.ts > canBook > T06: accepts a duration of exactly 120 minutes 0ms
 ✓ src/booking.test.ts > canBook > T07: rejects a duration of 121 minutes 0ms
 ✓ src/booking.test.ts > canBook > T08: accepts a request touching the existing booking start 0ms
 ✓ src/booking.test.ts > canBook > T09: rejects a partial overlap 0ms
 ✓ src/booking.test.ts > canBook > T10: rejects a request containing the existing booking 0ms
 ✓ src/booking.test.ts > canBook > T11: rejects a request contained in the existing booking 0ms
 ✓ src/booking.test.ts > canBook > T12: rejects an identical booking interval 0ms
 × src/booking.test.ts > canBook > T13: rejects an otherwise valid request when the room is blocked 2ms
   → expected true to be false // Object.is equality
 ✓ src/booking.test.ts > canBook > T14: accepts a request when the bookings list is empty 0ms
 ✓ src/booking.test.ts > canBook > AC5: returns true without saving or changing booking data 0ms
 ✓ src/booking.test.ts > canBook > X1: accepts minute 1440 as the end boundary 0ms
 ✓ src/booking.test.ts > canBook > X2: rejects an overlap with the second booking in the list 0ms
 ✓ src/booking.test.ts > canBook > N1: rejects a negative start independently of the future rule 0ms
 ✓ src/booking.test.ts > canBook > N2: rejects a start before now without booking conflicts 0ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/booking.test.ts > canBook > T13: rejects an otherwise valid request when the room is blocked
AssertionError: expected true to be false // Object.is equality

- Expected
+ Received

- false
+ true

 ❯ src/booking.test.ts:77:87
     75| 
     76|   it('T13: rejects an otherwise valid request when the room is blocked…
     77|     expect(expectUnchangedDecision(fixture({ start: 660, end: 720, blo…
       |                                                                                       ^
     78|   });
     79| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed | 18 passed (19)
   Start at  03:33:49
   Duration  182ms (transform 14ms, setup 0ms, collect 13ms, tests 4ms, environment 0ms, prepare 23ms)

npm notice
npm notice New minor version of npm available! 11.8.0 -> 11.21.1
npm notice Changelog: https://github.com/npm/cli/releases/tag/v11.21.1
npm notice To update run: npm install -g npm@11.21.1
npm notice
```

All three changes reverted, and the full suite run again (section 6.3): yes

The preserved first suite was subsequently tried separately against the same three mutants: all three were detected by assertion failures. Full outputs are saved in evidence/first-M1-run.txt, first-M2-run.txt and first-M3-run.txt. Its test file remains unchanged. The final suite and correct module were restored and rerun afterward.

## 8. Task 7 — manual UI checks

These checks were performed by the assistant through real browser controls on the local page, with now=09:00 and the original 10:00–11:00 sample booking. They are not claimed as student-performed manual checks.

| # | Action | Expected observation | AC | What I observed | Pass / Fail / Not testable |
| --- | --- | --- | --- | --- | --- |
| U1 | Check 11:00–12:00, unblocked | Available, with the fixed sample booking | AC5 | Available and the existing 10:00–11:00 booking remained visible. | Pass |
| U2 | Enable blocked, then check again | Unavailable replaces the earlier result | AC3, AC5 | The previous Available result was replaced by Unavailable with a blocked-room explanation. | Pass |
| U3 | Clear required inputs and submit | Understandable validation feedback | AC6 | Reset cleared inputs; Check showed Unavailable and Please enter valid times in HH:MM format. | Pass |
| U4 | Use a narrow phone width | Controls and result remain usable | AC6 | At measured innerWidth=375, inputs, Check, Reset and result were visible after scrolling, without horizontal overflow. | Pass |
| U5 | Repeat checks on the same data | Existing bookings remain unchanged | AC5 | Checked 12:00–13:00 twice; Available remained and all three original booking labels were unchanged. | Pass |

Evidence ui-1.jpg through ui-5.jpg is unedited browser capture. The browser tool's full-page capture had scaling/clipping artifacts at narrow width, so ui-4 uses a native viewport capture after scrolling to the controls and result. A viewport override of 450 produced measured CSS innerWidth=375 because of browser zoom. The page's scrollWidth also measured 375 and every control's right edge was within that width. No visual layout fix was needed. The browser override was reset afterward.

## 9. Comparison and what still fails

### 9.1 Checks I am keeping as FAIL or ERROR

| Check | Why it stays |
| --- | --- |
| none | No checker FAIL or ERROR remains after final validation. |

Authorship limitation: case rationales, X1/X2 and review/comparison prose were AI-assisted rather than independently authored by the student. They are disclosed in AI_USAGE.md and require student review. Section 10 translates and organizes the student’s own reflections supplied in chat; technical wording clarifies that the automated tests run in Node, and that rejecting equality is the planted defect. Passing the shape checker does not establish personal understanding.

### 9.2 Original and improved suites

| Measure | First suite | Improved suite |
| --- | --- | --- |
| Executed / passed / failed | 17 / 17 / 0 | 19 / 19 / 0 after mutant restoration |
| Requirements with meaningful tests (AC IDs and gaps) | AC1–AC5; AC6 needs browser checks; missing independent negative-start and past-start cases | AC1–AC5 plus N1/N2 independent boundaries; AC6 checked separately in browser |
| Selected mutants detected | M1, M2, M3: 3/3 detected in separate first-suite trials; raw outputs in evidence/first-M1-run.txt through first-M3-run.txt | M1, M2, M3: 3/3 detected by assertion failures |
| Accepted / revised / rejected tests | Correct expectations and real import accepted; helper visibility and missing boundaries revised; none rejected as incorrect | All 17 original expected results retained; assertions made explicit; two tests added |
| Remaining limitations | Helper hides literal decisions from a simple reader; limited boundaries and malformed-input policy | No proof for every input or browser; finite/fractional types unspecified; reversed existing bookings not validated |

The comparison concerns these specific suites and trials, not a claim that either suite proves universal correctness.

### 9.3 What no AC decides

A real direct call returned true for start=660, end=720, now=540, blocked=false and bookings=[{start:700,end:650}]. The overlap condition is false because 660 < 650 is false. The function therefore accepts the request. This behavior was inherited unchanged from Week 06; it was not deliberately added during extraction. AC1 validates the candidate interval; no AC specifies the policy for an invalid existing interval. The declaration uses returns-true. A future contract should explicitly choose whether malformed stored intervals are rejected, ignored or treated as errors.

This analysis is AI-assisted and should be reviewed by the student before defending it.

## 10. Conclusion (120–180 words)

A green run only shows that the cases checked did not fail; it cannot prove that unchecked situations are correct. The first suite had no incorrect expected values, but its helper hid the individual decisions. That made review harder: a reader had to look elsewhere for each expectation, and a later helper change could affect many tests. Explicit assertions make the scenarios easier to audit.

T06 detected the deliberate change that rejected exactly 120 minutes. AC2 rejects bookings longer than 120 minutes, so equality must remain valid. Ordinary requests could pass despite that comparison mistake; a boundary case exposed it.

The restored final run passed nineteen unit tests. These tests support the selected rules and data-preservation checks, but do not prove all browser layouts or invalid-input behavior. Browser engines, versions and resolutions vary, while malformed inputs have many possible forms. Representative samples and the five observed UI checks provide useful evidence, not exhaustive proof.
