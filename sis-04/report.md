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
| Baseline commit | 5289fac |
| Language (ts or js) | ts |
| Vitest version | 3.2.4 |
| Where I ran the tests | Local macOS terminal via Codex |

### 1.1 Baseline run

The original baseline run was on local checkpoint 45bad0c. Its application tree is byte-identical to GitHub checkpoint 5289fac. Only the local absolute path in the output is redacted.

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

The four fictional rooms offer Projector, Whiteboard and Video conferencing. Attendees and equipment checkboxes narrow the list. With no matches, the page displays “No rooms match” with advice to relax the filters. Switching rooms after a check recomputes the result for the same slot. An attendee, equipment or time edit clears the prior result.

### 4.2 Demonstration

| Screenshot | What it shows |
| --- | --- |
| `evidence/filter-match.png` | 12 attendees with Projector and Whiteboard. Only Cedar Studio (12 seats) and Maple Hall (24 seats) match. |
| `evidence/filter-empty.png` | 50 attendees with the same equipment. No matches, an explanatory message, and no inherited result or timeline. |
| `evidence/switch-a.png` | 12 attendees with both items. Cedar Studio selected, 11:00–11:30 is Available after its 10:00–11:00 booking. |
| `evidence/switch-b.png` | Same filters and 11:00–11:30. Maple Hall selected, now Unavailable because its booking starts at 11:00. No second Check was needed. |
| `evidence/narrow.png` | 390 CSS px portrait. Maple selection, 11:00–11:30, and Unavailable feedback fit without horizontal scrolling. |

## 5. Refactoring (Task 3)

<!-- The diagrams are diagrams/before.puml and diagrams/after.puml (README section 8). -->

### 5.1 Module responsibilities after

The import diagrams in `diagrams/` were rendered successfully with local PlantUML. Dotted arrows in the final diagram indicate type-only imports.

| Module or component | Responsibility |
| --- | --- |
| `src/rooms.ts` | Typed catalog and fictional fixtures |
| `src/booking.ts` | Pure canBook predicate and checkRoom adapter for the selected room |
| `src/filter.ts` | Pure capacity and all-equipment filter |
| `src/App.tsx` | Owns controls and derives the visible decision from the current selection and checked slot |
| `src/components/` | Room filters, matching room cards, timeline, and result presentation |

### 5.2 Design decisions

| Decision | Alternative I did not take | Why |
| --- | --- | --- |
| Keep blocked matches visible and labeled | Exclude blocked rooms in the filter | F1–F2 concern capacity and equipment. F3 rules out availability; a visible blocked card explains why a qualifying room is unusable. |
| Derive feedback after Check instead of storing a bare verdict | Persist the previous result or clear it during every room change | F5 requires using the new room and same times; deriving the verdict avoids stale feedback. Time and filter changes reset the check. |
| Keep canBook as a single boolean authority | Repeat each predicate to construct detailed errors | AC1–AC5 remain covered by the existing API and tests. AC6 still provides a clear verdict, with a trade-off in reason specificity. |

### 5.3 Duplication removed

| Before (file / function, what was repeated) | After (where it lives now) |
| --- | --- |
| `App.tsx handleCheck` and `lib/validation.ts checkAvailability` both called canBook when the request was rejected | App calls checkRoom once, and checkRoom delegates to canBook. |
| `lib/validation.ts checkAvailability` repeated time, length, blocked and overlap rules from `booking.ts` | The old wrapper was removed. The decision remains in canBook. |

## 6. Automated tests (Task 4)

### 6.1 Test plan

| ID | Test title (as in the file) | Input → expected |
| --- | --- | --- |
| AC1 | T02 AC1: rejects a start equal to now | start equals 540 with now 540 → false |
| AC2 | T06 B1 AC2: accepts a duration of exactly 120 minutes | 720–840 → true |
| AC3 | T13 AC3: rejects an otherwise valid request when the room is blocked | otherwise valid blocked room → false |
| AC4 | T01 B3 AC4: accepts a request touching the existing booking end | 660 touches the existing end → true |
| AC5 | AC5: returns true without saving or changing booking data | available slot → bookings unchanged |
| F1 | F1 B5: includes the room with exactly enough seats | capacity 12 for 12 → included |
| F2 | F2: requires every selected equipment item | request Projector and Whiteboard → only room with both and enough seats |
| F3 | F3: rejects an otherwise free slot in a blocked room | blocked room with no overlapping booking → false |
| F4 | F4: returns an empty list when no room matches | 17 attendees, max 16 → empty |
| F5 | F5: the same slot can be free in one room and busy in another | 660–690 for free and busy rooms → true then false |
| B1 | T06 B1 AC2: accepts a duration of exactly 120 minutes | exactly 120 minutes → true |
| B2 | T07 B2: rejects a duration of 121 minutes | 121 minutes → false |
| B3 | T01 B3 AC4: accepts a request touching the existing booking end | request starts at 660, existing ends at 660 → true |
| B4 | T09 B4: rejects a partial overlap | 630–690 overlaps 600–660 → false |
| B5 | F1 B5: includes the room with exactly enough seats | 12 seats for 12 → included |
| B6 | B6: excludes the room with one seat too few | 11 seats for 12 → excluded |
| INT | INT: checks the selected room from the filtered catalog | filter at 13 attendees with Projector → busy only; its overlap → false |

### 6.2 Commands

```text
NO_COLOR=1 npx vitest run
NO_COLOR=1 npm test
npm run typecheck
npm run lint
npm run build
npm run dev -- --host 127.0.0.1 --port 5175
```

The first filter run failed because the module did not exist. The first checkRoom run failed four cases because checkRoom was unimplemented. The next full runs passed 25/25 and 29/29.

### 6.3 Final run

Real terminal output with the checkout path redacted.

```text
 RUN  v3.2.4 [local path]/sis-04/app

 ✓ src/filter.test.ts (4 tests) 2ms
 ✓ src/catalog.test.ts (4 tests) 1ms
 ✓ src/booking.test.ts (21 tests) 2ms

 Test Files  3 passed (3)
      Tests  29 passed (29)
   Start at  02:10:05
   Duration  312ms (transform 49ms, setup 0ms, collect 65ms, tests 5ms, environment 0ms, prepare 107ms)
```

## 7. Quality evaluation (Task 5)

| Measure | Original | Final | How I obtained it |
| --- | --- | --- | --- |
| Automated tests passed / total | 21/21 | 29/29 | Vitest runs in 1.1 and 6.3. |
| Duplicated logic locations removed | 0 removed at baseline | 2 removed | Counted the two distinct call/rule sites in 5.3 against the diff. |
| Code structure: modules and responsibilities | 13 tracked source files including tests/styles; app, old fixtures, canBook and duplicate validation wrapper | 15 tracked source files including tests/styles; rooms, booking, filter and UI with separate fixtures and rules | git ls-tree -r --name-only 45bad0c app/src and git ls-files app/src from sis-04/. Cross-checked import diagrams. |
| Remaining limitation | The baseline parser rejects end time 24:00 while canBook supports minute 1440 | The parser still rejects 24:00 as an input even though X1 protects minute 1440 in the domain. Slot rejection uses general guidance. | Compared App.parseTimeToMinutes before and after, verified X1, and inspected the Maple browser feedback. |

## 8. AI evidence appendix

<!-- At least three exchanges, one ### 8.N block each: the analysis (Task 1), the plan, and at
     least one implementation, refactoring or test exchange. Copy the block for more.
     The prompt as you sent it; the output may be cut to the part you used, with "[…]" where
     you cut. Verified by: the test, run, file or check that confirmed it — not "it looked right". -->

### 8.1 Exchange 1

**Tool and model:** Codex desktop review subagent, not displayed
**Date:** 2026-11-20
**Purpose:** Analyze the baseline

**Prompt:**

```text
Read-only planning request for Smart Campus SIS 04. Repository map: src/App.tsx owns input parsing, selected room, prior result and renders RoomList, Timeline, ResultBanner. src/booking.ts exports pure canBook and src/booking.test.ts has the Week 08 suite. src/lib/validation.ts wraps canBook and repeats rejection rules. src/lib/sampleData.ts and types.ts hold fixtures/types, format.ts holds the fixed clock. AC1 reject start ≥ end and past; AC2 max 120 minutes; AC3 reject blocked; AC4 reject overlap, allow touching; AC5 no mutation; AC6 clear responsive feedback. F1 capacity >= attendees, F2 all equipment required, F3 blocked never available, F4 explicit no-match state, F5 changing selection refreshes using that room's bookings. Four fictional rooms, fixed clock, no login, payment, network, storage or database. Required rooms.ts, filter.ts, booking.ts, separate UI. Identify three maintainability risks with file references and outline a small incremental plan. Please give analysis and a plan only, no code or file writes.
```

**Output used:**

```text
1. Booking rules can drift between the decision and the feedback. `src/App.tsx:44` calls `canBook`, then delegates rejected requests to `src/lib/validation.ts:10`, which calls it again and repeats the rules. Use one pure decision function in `booking.ts` and keep the existing `canBook` boolean API for Week 08. Map rejection reasons to display text at the UI boundary.
2. The displayed result can describe the previous room. `src/App.tsx:17` stores availability independently of room and time, while `src/App.tsx:85` changes only the selection. Derive the checked result and timeline from the same effective room and current time inputs. Clear the result when no eligible room remains.
3. The fixtures and room type cannot express the filter requirements. `src/lib/types.ts:1` lacks equipment, and `src/lib/sampleData.ts:3` defines three rooms with identical booking windows. Put four typed fictional fixtures with distinct schedules in `rooms.ts` and implement the capacity, required equipment, and blocked-room predicates in pure `filter.ts`.

Start by running the Week 08 suite. Centralize the booking rules and rerun it, preserving the fixed clock, strict future-start requirement, 120-minute boundary, touching intervals, and input immutability. Then add the fixtures and filter, and verify exact-capacity, multiple-equipment, and blocked-room cases. Finally, wire the separate UI components and verify no-match recovery, a room switch that changes a free slot to an overlap, and clear feedback on mobile and desktop.
```

**Problems found:** The proposed filter would exclude blocked rooms.
**Changes made:** Retained blocked matches as a design choice and delegated F3 to booking.
**Verified by:** Read sampleData, validation and App at the baseline, then confirmed the F3 test.

### 8.2 Exchange 2

**Tool and model:** Codex desktop review subagent, not displayed
**Date:** 2026-11-20
**Purpose:** Review incremental plan

**Prompt:**

```text
Review the proposed SIS 04 plan without editing: preserve and tag existing Week 08 tests, add failing F1/F2/F4 tests then filter/catalog, add failing F3/F5/INT tests then checkRoom, wire the React UI and consolidate duplicated rules last. Keep blocked rooms labeled in the filtered results so F3 can be directly demonstrated. After a valid check, selecting another room recomputes for the same slot. Changing filter/time clears the old check. What sequencing or edge case would you change? No code.
```

**Output used:**

```text
Consolidate the booking rules when introducing `checkRoom`, before wiring React. Keep `canBook` as a boolean wrapper around the shared decision so the Week 08 tests continue to guard the same rules the UI uses.

Test F3 at the booking layer with an otherwise free slot in a blocked room. Test F5 through the UI by checking a free slot, then selecting another matching room where that same slot overlaps. Verify both the timeline and result refresh.

Label the list “Matching rooms” if it includes blocked rooms. Distinguish zero matches from a list where every match is blocked. Also cover a filter change that removes the selected room, including recovery from zero matches, and verify that editing either time or filters clears the prior check before a later room switch.
```

**Problems found:** A new boolean wrapper would move the source of the core predicate; specific rejection copy would require another result API.
**Changes made:** Kept the existing canBook API and predicates. Checked filter recovery and same-slot room switching in the browser.
**Verified by:** Verified 21 baseline tests, 29 final tests, no-match recovery and switch-a/switch-b.

### 8.3 Exchange 3

**Tool and model:** Codex desktop review subagent, not displayed
**Date:** 2026-11-20
**Purpose:** Review test and UI edge cases

**Prompt:**

```text
Review only this proposed implementation and test design for SIS 04. Keep canBook unchanged as the single boolean authority. checkRoom looks up one room then calls canBook with its blocked flag and bookings. For rejected valid input, use honest generic UI guidance instead of repeating all booking predicates. F5 and INT call real functions with a fixed catalog and same slot; browser evidence exercises actual room switching. Identify a concrete missing test or UI edge case. Do not edit project files.
```

**Output used:**

```text
Add a browser regression for a filter change after a successful check. Remove the selected room, reach zero matches, then relax the filter. Verify the old success and timeline disappear, and that the recovered selection stays unchecked until the user presses Check. The room-switch evidence covers a different transition.

Add a focused `checkRoom` test for an unknown room ID. Expect an unavailable result. For a blocked room, keep its blocked label visible alongside the generic feedback so the user can understand the rejection without duplicating booking rules.
```

**Problems found:** Model tests alone do not catch stale UI feedback after filter changes.
**Changes made:** Added unknown-ID coverage and exercised recovery in the browser.
**Verified by:** Catalog suite and browser check confirmed no old result appears after relaxing the filters.

## 9. Checker results and known fails

| Check | Why it still fails |
| --- | --- |
| None | No checker FAIL or ERROR retained. |

The implementation treats blocked-room visibility as a design choice. F3 requires that blocking prevents availability and allows either visible or hidden blocked rooms.

## 10. AI reflection (Task 6)

r this SIS‑04 task, I provided the AI with explicit background including requirements AC1‑AC6, feature rules F1‑F5, required module file names, and constraints: fictional‑only room data, no external databases, and I must keep existing booking logic unchanged. I also shared my baseline repository map so the assistant understood existing function interfaces before generating code.
One AI suggestion was to fully remove blocked rooms inside filterRooms. This idea sounded convenient, but I rejected it. According to requirement F3, blocked rooms should stay in the catalog and get marked instead of being filtered out completely. I manually cross‑checked this rule against the handout, then wrote unit tests to validate the correct behaviour. My test suite grew from 21 to 29 passing total cases.
I personally verified several runtime behaviours. I confirmed Cedar room shows available for 11:00‑11:30, while switching to Maple correctly shows unavailable for that exact same time slot. On a 390 px mobile viewport, I checked that user feedback messages remain fully visible without visual clipping. Every AI‑proposed logic change was validated by running corresponding unit tests; test failures directly told me when AI output violated project rules.
For future improvements, next I will add more edge‑case test inputs for mixed‑equipment filter queries. I also plan to refactor repeated UI status‑label rendering logic to reduce code duplication, without modifying core filtering and booking business logic.
