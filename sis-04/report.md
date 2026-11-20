# SIS #04 — Report: Evolving the Smart Campus Room Availability Checker

<!-- The ONLY file you write prose in. Keep every numbered heading (## 1. … ## 10.), every
     ### sub-heading and every **Label:** word — the checker finds your answers by them.
     Replace every "(write here)" and "(paste here)". Delete these <!-- --> comments if you like. -->

## 1. Setup and starting point

| Item | Value |
| --- | --- |
| Assistant (tool) | Codex desktop |
| Assistant model | not displayed |
| Starting point | week-08 |
| Baseline commit | 45bad0c |
| Language (ts or js) | ts |
| Vitest version | 3.2.4 |
| Where I ran the tests | Local macOS terminal via Codex |

### 1.1 Baseline run

Real baseline output; only the local absolute path is redacted.

```text
 RUN  v3.2.4 [local path]/sis-04/app

 ✓ src/booking.test.ts (21 tests) 2ms

 Test Files  1 passed (1)
      Tests  21 passed (21)
   Start at  02:06:06
   Duration  213ms (transform 26ms, setup 0ms, collect 16ms, tests 2ms, environment 0ms, prepare 55ms)
```

## 2. Context for the assistant

### 2.1 Repository map

```text
src/App.tsx — selection, time form and result state
src/booking.ts — pure canBook predicate
src/booking.test.ts — 21 Week 08 tests
src/lib/validation.ts — rejection messages with duplicated rules
src/lib/sampleData.ts, src/lib/types.ts — baseline fixtures and data shapes
src/lib/format.ts — fixed clock and time labels
src/components/RoomList.tsx, Timeline.tsx, ResultBanner.tsx — rendering
```

### 2.2 The context message as sent

```text
Read-only planning request for Smart Campus SIS 04. Repository map: src/App.tsx owns input parsing, selected room, prior result and renders RoomList, Timeline, ResultBanner. src/booking.ts exports pure canBook and src/booking.test.ts has the Week 08 suite. src/lib/validation.ts wraps canBook and repeats rejection rules. src/lib/sampleData.ts and types.ts hold fixtures/types, format.ts holds the fixed clock. AC1 reject start ≥ end and past; AC2 max 120 minutes; AC3 reject blocked; AC4 reject overlap, allow touching; AC5 no mutation; AC6 clear responsive feedback. F1 capacity >= attendees, F2 all equipment required, F3 blocked never available, F4 explicit no-match state, F5 changing selection refreshes using that room's bookings. Four fictional rooms, fixed clock, no login, payment, network, storage or database. Required rooms.ts, filter.ts, booking.ts, separate UI. Identify three maintainability risks with file references and outline a small incremental plan. Please give analysis and a plan only, no code or file writes.
```

## 3. Codebase analysis (Task 1)

### 3.1 Maintainability risks

| # | Risk | Where (file / function) | Evidence | Priority |
| --- | --- | --- | --- | --- |
| 1 | Rule drift | src/lib/validation.ts checkAvailability and src/booking.ts canBook | Both explicitly enforce 120 minutes, blocked rooms, and overlap. App also calls canBook before calling checkAvailability. | High |
| 2 | Result detached from selection | src/App.tsx handleCheck and room selection callbacks | result is stored separately while room selection only sets selectedRoomId. Editing times also leaves prior feedback visible. | High |
| 3 | Fragile interactive room card | src/components/RoomList.tsx | The room-selection button contains a second button that mutates the blocked flag. The catalog should expose a stable fictional blocked state and one control per card. | Medium |
| 4 | Incomplete catalog data contract | src/lib/sampleData.ts, src/lib/types.ts | The baseline contains three rooms. The Room type has no equipment field. | Medium |

### 3.2 Improvement plan — before editing

1. Keep the 21 contract tests and tag their existing boundary assertions. Add focused filter and room-selection cases against test-local fixtures.
2. Add rooms.ts, pure filterRooms and checkRoom. Verify capacity equality, strict equipment subset and selected-room behavior.
3. Wire the catalog and filters into the existing UI. After an explicit check, room switching should refresh the result at the same times; time edits and filter changes clear the result.
4. Remove duplicate rule checks, retain clear feedback, update component diagrams and verify both desktop and mobile.

### 3.3 One AI suggestion I rejected or modified

| Suggestion (as the assistant made it) | Decision | Why — with the AC, F-rule, test or file behind it |
| --- | --- | --- |
| implement the capacity, required equipment, and blocked-room predicates in pure filter.ts | Modified | F1 and F2 describe catalog filters. A blocked room remains visible and labeled, while F3 and AC3 are enforced in checkRoom via canBook. |

## 4. Feature extension (Task 2)

### 4.1 What I added

<!-- Short: the catalog (how many rooms, which equipment), how the filter is chosen on the page,
     what the empty state says, what happens to an old result when the room changes. -->

(write here)

### 4.2 Demonstration

<!-- One row per screenshot in evidence/. Say what is on it: the filter values, the rooms shown,
     the room selected, the times entered and the result. -->

| Screenshot | What it shows |
| --- | --- |
| `evidence/filter-match.png` | (write here) |
| `evidence/filter-empty.png` | (write here) |
| `evidence/switch-a.png` | (write here) |
| `evidence/switch-b.png` | (write here) |
| `evidence/narrow.png` | (write here) |

## 5. Refactoring (Task 3)

<!-- The diagrams are diagrams/before.puml and diagrams/after.puml (README section 8). -->

### 5.1 Module responsibilities after

| Module or component | Responsibility |
| --- | --- |
| `src/rooms.ts` | (write here) |
| `src/booking.ts` | (write here) |
| `src/filter.ts` | (write here) |
| (write here) | (write here) |

### 5.2 Design decisions

<!-- At least two. The alternative is what you could have done instead (often what the assistant
     proposed). The why names an AC, an F-rule, a test or a risk from 3.1. -->

| Decision | Alternative I did not take | Why |
| --- | --- | --- |
| (write here) | (write here) | (write here) |
| (write here) | (write here) | (write here) |

### 5.3 Duplication removed

<!-- One row per duplicated location that is gone. Count what you can point at, nothing else. -->

| Before (file / function, what was repeated) | After (where it lives now) |
| --- | --- |
| (write here) | (write here) |

## 6. Automated tests (Task 4)

### 6.1 Test plan

<!-- One row per required ID. A test may carry several IDs in its title,
     e.g. test('T06 B1 AC2: exactly 120 minutes is available', …) covers B1 and AC2. -->

| ID | Test title (as in the file) | Input → expected |
| --- | --- | --- |
| AC1 | (write here) | (write here) |
| AC2 | (write here) | (write here) |
| AC3 | (write here) | (write here) |
| AC4 | (write here) | (write here) |
| AC5 | (write here) | (write here) |
| F1 | (write here) | (write here) |
| F2 | (write here) | (write here) |
| F3 | (write here) | (write here) |
| F4 | (write here) | (write here) |
| F5 | (write here) | (write here) |
| B1 | (write here) | (write here) |
| B2 | (write here) | (write here) |
| B3 | (write here) | (write here) |
| B4 | (write here) | (write here) |
| B5 | (write here) | (write here) |
| B6 | (write here) | (write here) |
| INT | (write here) | (write here) |

### 6.2 Commands

<!-- The commands exactly as you typed them, from app/. -->

```text
(paste here)
```

### 6.3 Final run

<!-- The REAL output of the full run on your final code. Every test passes, and the number of
     tests equals what your test files hold (R2). -->

```text
(paste here)
```

## 7. Quality evaluation (Task 5)

<!-- Original = your baseline commit. Final = what you submit. "How I obtained it" says how you
     measured, so someone else could repeat it: "1.1 and 6.3 runs", "counted in 5.3",
     "git ls-files app/src". Do not invent a metric. Tests: write passed/total, e.g. 19/19. -->

| Measure | Original | Final | How I obtained it |
| --- | --- | --- | --- |
| Automated tests passed / total | (write here) | (write here) | (write here) |
| Duplicated logic locations removed | (write here) | (write here) | (write here) |
| Code structure: modules and their responsibilities | (write here) | (write here) | (write here) |
| Remaining limitation | (write here) | (write here) | (write here) |

## 8. AI evidence appendix

<!-- At least three exchanges, one ### 8.N block each: the analysis (Task 1), the plan, and at
     least one implementation, refactoring or test exchange. Copy the block for more.
     The prompt as you sent it; the output may be cut to the part you used, with "[…]" where
     you cut. Verified by: the test, run, file or check that confirmed it — not "it looked right". -->

### 8.1 Exchange 1

**Tool and model:** (write here)
**Date:** (write here)
**Purpose:** (write here)

**Prompt:**

```text
(paste here)
```

**Output used:**

```text
(paste here)
```

**Problems found:** (write here)
**Changes made:** (write here)
**Verified by:** (write here)

### 8.2 Exchange 2

**Tool and model:** (write here)
**Date:** (write here)
**Purpose:** (write here)

**Prompt:**

```text
(paste here)
```

**Output used:**

```text
(paste here)
```

**Problems found:** (write here)
**Changes made:** (write here)
**Verified by:** (write here)

### 8.3 Exchange 3

**Tool and model:** (write here)
**Date:** (write here)
**Purpose:** (write here)

**Prompt:**

```text
(paste here)
```

**Output used:**

```text
(paste here)
```

**Problems found:** (write here)
**Changes made:** (write here)
**Verified by:** (write here)

## 9. Checker results and known fails

<!-- Every check still FAIL or ERROR in your last run of python tests/check_sis.py, and why.
     The same IDs go in submission.yml known_fails. None left? Write: none. -->

| Check | Why it still fails |
| --- | --- |
| (write here) | (write here) |

## 10. AI reflection (Task 6)

<!-- 200–300 words, your own words, no assistant. Answer all five:
     What context did you provide the AI assistant? Which generated suggestions were useful or
     incorrect? What did you personally verify? How did tests influence your engineering
     decisions? What would you improve next? -->

(write here)
