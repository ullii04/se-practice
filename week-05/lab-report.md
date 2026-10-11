# Week 05 — Lab report

**Name:** Elshibai Ulzhalgas
**Group:** Monday 16:00-19:00
**Date:** 2026-10-11

Fill in every section. **Do not delete, rename or renumber the headings** — the checker and the
grader find your answers by them. Add rows to any table; never remove its header.

---

## 1. Setup

| | |
| --- | --- |
| Assistant (tool) | ChatGPT Work / Codex desktop |
| **Exact** model name | not displayed |
| Language and version | Python 3.9.6 (local); standard-library code compatible with Python 3.13 grading |
| Path | A |
| My Week 04 declaration for touching bookings | allowed |

My Week 04 submission.yml declares overlap_touching_bookings: allowed. This agrees with AC4; no change to that assumption is required. The earlier assignment's model name is not reused as evidence of this lab's model.

---

## 2. Task 1 — the plan

**Planning prompt sent in the separate implementation chat:**

```text
Propose a short implementation plan for can_book. List the checks in order and identify assumptions. Use Python 3 and the supplied rules. Do not write code yet. Suggest boundary cases that could expose an incorrect implementation.
```

**The assistant's plan, pasted unedited:**

```text
Implementation Plan for can_book()
1. Checks in Order
Validate time range (AC1):

Check 0 <= start < end <= 1440.
Check start > now.
Return False if either condition fails.
Check duration (AC2):

Calculate end - start.
Return False if duration exceeds 120 minutes.
Check room status (AC3):

Return False if blocked is True.
Check booking overlaps (AC4):

Loop through existing bookings.
Overlap occurs when start < existing_end and end > existing_start.
Return False if any overlap exists.
Touching endpoints are allowed.
Return decision (AC5):

Return True only if all checks pass.
Never modify existing or other inputs.
2. Assumptions
All times are integer minutes on the same date.
now is valid (0–1439).
blocked is a Boolean.
existing contains only valid, active bookings for the selected room.
Intervals include the start but exclude the end.
The function only checks availability; saving and confirmation happen elsewhere.
3. Boundary Test Cases
Test	Condition	Expected
1	start == now	False
2	start == now + 1 with all other checks passing	True
3	start == end	False
4	end == 1440 with all other checks passing	True
5	Duration = 120 minutes	True
6	Duration = 121 minutes	False
7	blocked == True	False
8	New booking starts exactly when an existing booking ends	True
9	New booking ends exactly when an existing booking starts	True
10	New booking overlaps an existing booking by 1 minute	False
11	existing is empty and all other checks pass	True
12	start < 0 or end > 1440	False
Key point: The implementation must reject invalid bookings, allow touching endpoints, and keep all inputs unchanged.
```

**What the plan invented or changed.** One row for every rule in the plan that is not in the
contract or in AC1–AC5, or that says something different from them. If you found none, write one
row saying which lines of the plan you checked against which AC.

| # | What the plan said | What the contract or the AC says | What I did |
| --- | --- | --- | --- |
| 1 | No invented rule found: range and future-start checks; duration check; blocked check; overlap loop; final Boolean decision with unchanged inputs. | These map respectively to AC1, AC2, AC3, AC4 and AC5. The assumptions repeat the contract. | Retain the plan. For boundary cases expecting True, ensure every other AC also holds; these examples are not unconditional permissions. |

**Boundary cases the assistant suggested that I kept as tests:**

- Planned for the suite: start equal to now and one minute after now; zero duration; end at 1440; durations 120 and 121; blocked room; touching on either side; one-minute overlap; empty existing; day-bound violations. Tests have not yet been implemented or run.

---

## 3. Task 2 — the first version (v1), read before it was run

v1 is saved as `code/original/booking_v1.py`, exactly as the assistant returned it: yes

**Implementation prompt sent in the same implementation chat:**

```text
Implement can_book in booking.py using the supplied contract and AC1-AC5. Keep the signature. Use only the standard library. Do not modify existing. Return the function and explain each condition. Keep the feature within the stated scope.
```

**AC map.** Prepared with AI assistance for reading before running v1. These are static assessments, not test results.

| # | Line in v1 | AC it implements | Correct as written? If not, why |
| --- | --- | --- | --- |
| 1 | Line 3: `if not (0 <= start < end <= 1440):` | AC1 | Yes, rejects invalid order and day bounds; end 1440 is allowed. |
| 2 | Line 6: `if start <= now:` | AC1 | Yes, start must be strictly later than now. |
| 3 | Line 10: `if end - start > 120:` | AC2 | Yes, 120 is allowed and 121 is rejected. |
| 4 | Line 14: `if blocked:` | AC3 | Yes, blocked is guaranteed Boolean by the contract. |
| 5 | Lines 18–20: `for existing_start, existing_end in existing:` and `if start < existing_end and end > existing_start:` | AC4 | Yes, both strict inequalities identify overlap; equality on either side permits touching. Every booking is considered unless an overlap already rejects the request. |
| 6 | Line 23: `return True`; earlier rejection branches use `return False` | AC5 | Yes, Boolean True is returned only after all checks pass. The function reads existing without sorting, appending, deleting or assigning its elements. |

**Anything in v1 that no AC asks for** (extra validation, a buffer between bookings, logging,
saving the booking, a different return type):

- None found on inspection for contract-valid inputs. Non-integer behavior is not specified and remains to be investigated and declared in section 9.2.
- Pre-run prediction: no failure expected for inputs covered by AC1–AC5. This prediction is not evidence of passing tests; no code has been run at this stage.

**The assistant's explanation, preserved from the supplied response:**

1. **AC1 — Valid time:** Ensures `start` and `end` are within 0–1440, `start < end`, and `start > now`.
2. **AC2 — Duration:** Rejects bookings longer than 120 minutes. Exactly 120 minutes is allowed.
3. **AC3 — Blocked room:** Returns `False` when the room is blocked.
4. **AC4 — Overlap:** Rejects bookings that overlap existing reservations. Touching endpoints are allowed because intervals are `[start, end)`.
5. **AC5 — Final decision:** Returns `True` only when all conditions pass.

**Scope:** The function checks one selected room and returns a Boolean. It does not save bookings, generate confirmations, or modify `existing`.

This implementation uses no imports or external libraries and stays within the supplied requirements.

The first pasted copy in the coordination chat lost line breaks. The student recopied the original code with its line breaks and indentation before it was saved. The function was not reformatted or repaired by the coordinating assistant.

---

## 4. Task 3 — my tests

Base input for every row unless the row says otherwise: `now=540, blocked=False, existing=[(600, 660)]`.

| # | Test name | Request (start, end) | What differs from the base input | Expected | AC | Result on v1 | Result on final |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | | | | | | | |
| 2 | | | | | | | |
| 3 | | | | | | | |
| 4 | | | | | | | |
| 5 | | | | | | | |
| 6 | | | | | | | |
| 7 | | | | | | | |
| 8 | | | | | | | |
| 9 | | | | | | | |
| 10 | | | | | | | |
| 11 | | | | | | | |

---

## 5. Task 4 — debugging with evidence

One row per defect you found — in v1, in a later version, or in your own tests. If v1 passed
everything, the row is the **new edge case you added**, with expected and actual equal, and the
cause column says why no change was needed.

| # | Input (the full call) | Expected | Actual | Cause (quote the line) | Fix | Who proposed the fix |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | | | | | | |

**The debug prompt I sent, and the assistant's answer** (leave the block empty if you did not use it):

```text
```

---

## 6. Task 5 — the critique

**The assistant's critique, pasted unedited:**

```text
(paste here)
```

| # | Suggestion | accept / reject | Reason — cite the AC or the contract line | Suite after the change |
| --- | --- | --- | --- | --- |
| 1 | | accept / reject | | |
| 2 | | accept / reject | | |

---

## 7. Change log — v1 to final

| # | What changed (the line, before → after) | Why | Evidence: the test or check that moved |
| --- | --- | --- | --- |
| 1 | | | |

---

## 8. Evidence — real output

### 8.1 My suite, final run

Paste the **complete** terminal output. For Python: everything `python -m unittest -v` printed.

```text
(paste here)
```

### 8.2 The checker, final run

Paste the **complete** output of `python tests/check_booking.py`. Paste it **last**: if you edit
this file afterwards, run the checker again and paste again.

```text
(paste here)
```

### 8.3 Path B only — three faults I planted myself

Break your own function on purpose, one line at a time, run your suite, restore the line.

| # | Line I changed (before → after) | AC it breaks | Test that failed |
| --- | --- | --- | --- |
| 1 | | | |
| 2 | | | |
| 3 | | | |

The three failing runs (Path A students leave this block empty):

```text
```

---

## 9. What still fails, and what the contract does not say

### 9.1 Checks I am keeping as FAIL or ERROR

The same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| | |

### 9.2 Outside the contract

The contract says times are integers. It does not say what `can_book` does when one is not —
`600.5`, or the string `"600"`. What does **your** function do, and why is that the right call?

-

### 9.3 A bound that never decides

One of the bounds written in AC1 can never be the *only* reason a request is rejected. Which one,
and why?

-

---

## 10. Conclusion (120–180 words)

<!-- Answer all three, in your own words, without the assistant:
     (a) Explain the overlap condition in your final code — why those two comparisons, and why
         they let touching bookings through.
     (b) Which fault did your tests miss the longest, and what did the missing test have in common
         with the ones you already had?
     (c) What did you have to decide that neither the contract nor the assistant decided for you?
     Worthless: "the AI made a mistake and I fixed it."
     Worth everything: "F7 failed on can_book(570, 600, ...): v1 compared with <= on the start
     side, so a booking that ends exactly when another begins was rejected." -->

<!-- Write your conclusion below this line -->
