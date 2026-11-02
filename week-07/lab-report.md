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
The baseline is an unchanged copy of week-06:week-06/prototype/project from the local Week 06 branch, flattened into app/ so package.json is directly in app/. Baseline commit 8792ee2 precedes extraction. The Boolean guards were moved in the same order to app/src/booking.ts, keeping the comparisons unchanged. App.tsx calls canBook directly; HH:MM parsing and human-readable rejection reasons remain at the interface boundary. Existing numerical behavior is preserved, including the unspecified reversed-existing-booking case. All report prose and case reasons in this revision are AI-assisted drafts, disclosed rather than claimed as independent student writing.

---

## 3. Task 2 — the test plan

Default fixture: `now = 540`, `blocked = false`, `bookings = [{ start: 600, end: 660 }]`, fresh
for every test. **The Expected column comes from AC1–AC4, never from the code.** Write the
**reason** for each expected result **before** you send the generation prompt.

| ID | Candidate / changed input | Expected | AC | Reason (in your words) |
| --- | --- | --- | --- | --- |
| T01 | 660–720 (touching after) | true | AC4 |  540 equals now rather than being strictly later. |
| T02 | 540–570 (starts now) | false | AC1 |  Equal endpoints have no positive duration. |
| T03 | 720–720 (zero duration) | false | AC1 |  The end is earlier than the start. |
| T04 | 750–720 (reversed) | false | AC1 |  1441 is one minute beyond the allowed day end. |
| T05 | 1380–1441 (past day end) | false | AC1 |  The duration is exactly 120, which does not exceed the maximum. |
| T06 | 720–840 (120 minutes) | true | AC2 |  121 minutes exceeds the maximum by one minute. |
| T07 | 720–841 (121 minutes) | false | AC2 |  The request excludes 600, where the existing interval begins. |
| T08 | 570–600 (touching before) | true | AC4 |  The shared 630–660 portion conflicts with an existing booking. |
| T09 | 630–690 (partial overlap) | false | AC4 |  The request contains the whole existing 600–660 interval. |
| T10 | 570–690 (contains booking) | false | AC4 |  The whole request lies inside the existing booking. |
| T11 | 615–645 (inside booking) | false | AC4 |  Identical intervals share all booked minutes. |
| T12 | 600–660 (identical interval) | false | AC4 |  Blocked status overrides an otherwise valid request. |
| T13 | 660–720, blocked = true | false | AC3 |  No existing interval remains to conflict with this request. |
| T14 | 630–690, bookings = [] | true | AC4 |  A successful check must not save or alter an existing booking. |
| AC5 | an Available request — the bookings after the call equal the bookings before | true, data unchanged | AC5 | |
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

The **real** terminal output of the first run of the first suite, pasted unedited. Include the
`RUN  v…` line and the `Tests` summary line. A build message or the assistant saying "tests pass"
is not a run.

```text
(paste here)
```

**Each failure, diagnosed** (the deck's table: import/runner error · assertion mismatch · result
changing per run · no tests discovered). Write `none` in the first row if nothing failed.

| Failing test | Observed failure | First check | Test repair or implementation fix? | Action taken |
| --- | --- | --- | --- | --- |
| | | | | |

### 6.2 The improvement prompt

The deck's improvement prompt exactly as sent, followed by the actual output from 6.1. Then
paste the assistant's answer, unedited:

```text
(paste here)
```

### 6.3 The final run

The **real** output of the final suite (`booking.test.*` beside your module), after every
change and after restoring the correct code from section 7. Every test must pass. If a real defect
is still open, leave its test failing and explain it in 9.1.

```text
(paste here)
```

---

## 7. Task 6 — deliberate defects

You need a reviewed, passing suite first. Then introduce **one** defect at a time in your booking
module, leave the tests unchanged, run, record, and **restore** the code. A syntax or import
error does not count as detection.

| Trial | Intentional change | Detected / Survived | Failing test ID(s) | If it survived: why, and what you added |
| --- | --- | --- | --- | --- |
| M1 | Reject duration >= 120 instead of > 120 | Detected / Survived | | |
| M2 | Treat touching endpoints as an overlap | Detected / Survived | | |
| M3 | Remove the blocked-room rejection | Detected / Survived | | |

**The run of each mutant, pasted unedited.** Paste the `Tests` summary line and the failing test
names at least:

```text
(paste here)
```

All three changes reverted, and the full suite run again (section 6.3): yes / no

---

## 8. Task 7 — manual UI checks

Use `now = 09:00` and an existing `10:00–11:00` booking. Do them in the page in a browser. Save a
screenshot of each as `evidence/ui-1.png` … `evidence/ui-5.png`. Take **ui-4 at phone width**
(about 375 px, portrait).

| # | Action | Expected observation | AC | What I observed | Pass / Fail / Not testable |
| --- | --- | --- | --- | --- | --- |
| U1 | Check 11:00–12:00, unblocked | Available, with the fixed sample booking | AC5 | | Pass / Fail / Not testable |
| U2 | Enable blocked, then check again | Unavailable replaces the earlier result | AC3, AC5 | | Pass / Fail / Not testable |
| U3 | Clear a required input and submit | Understandable validation feedback | AC6 | | Pass / Fail / Not testable |
| U4 | Use a narrow (phone) width | Controls and result remain usable | AC6 | | Pass / Fail / Not testable |
| U5 | Repeat the checks on the same data | Existing bookings remain unchanged | AC5 | | Pass / Fail / Not testable |

---

## 9. Comparison and what still fails

### 9.1 Checks I am keeping as FAIL or ERROR

Use the same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| | |

### 9.2 Original and improved suites

| Measure | First suite | Improved suite |
| --- | --- | --- |
| Executed / passed / failed | | |
| Requirements with meaningful tests (AC IDs and gaps) | | |
| Selected mutants detected | | |
| Accepted / revised / rejected tests | | |
| Remaining limitations | | |

### 9.3 What no AC decides

Call your function with `bookings = [{ start: 700, end: 650 }]` (a reversed existing booking)
and a request of 660–720. What does it return? Does any AC say what it should return? (This is
the value you declare in `submission.yml` under `assumptions.invalid_existing_booking`.)

-

---

## 10. Conclusion (120–180 words)

<!-- Answer all three in your own words, without the assistant:
     (a) Which mistake in the FIRST suite would have let a wrong canBook pass, and how did you find it?
     (b) What does your final green run prove, and what does it NOT prove? Use a mutant or a UI check.
     (c) One testing limitation that remains.
     Worthless: "The AI wrote good tests and they all passed."
     Worth everything: "The first suite expected T06 (exactly 120 minutes) to be rejected. That
     contradicts AC2, and it failed on a correct canBook. If I had changed the code to make it
     pass, M1 would have become the real behaviour." -->

<!-- Write your conclusion below this line -->
