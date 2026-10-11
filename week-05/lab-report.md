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

Base input: `now=540, blocked=False, existing=[(600, 660)]`; the table spells out each test's actual arguments. Expected values were derived from AC1–AC5 or the separately declared policy, before the policy implementation was changed. Tests were written with AI assistance, not independently by the student.

| # | Test name | Request (start, end) | What differs from the base input | Expected | AC | Result on v1 | Result on final |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `test_touching_end_is_allowed` | `(660, 720)` | `now=540; blocked=False; existing=[(600, 660)]` | True | AC4 / AC5 | PASS | PASS |
| 2 | `test_partial_overlap_is_rejected` | `(630, 690)` | `now=540; blocked=False; existing=[(600, 660)]` | False | AC4 / AC5 | PASS | PASS |
| 3 | `test_blocked_room_is_rejected` | `(660, 720)` | `now=540; blocked=True; existing=[(600, 660)]` | False | AC3 | PASS | PASS |
| 4 | `test_exactly_120_minutes_is_allowed` | `(720, 840)` | `now=540; blocked=False; existing=[(600, 660)]` | True | AC2 | PASS | PASS |
| 5 | `test_121_minutes_is_rejected` | `(720, 841)` | `now=540; blocked=False; existing=[(600, 660)]` | False | AC2 | PASS | PASS |
| 6 | `test_start_equal_to_now_is_rejected` | `(540, 570)` | `now=540; blocked=False; existing=[(600, 660)]` | False | AC1 | PASS | PASS |
| 7 | `test_zero_length_is_rejected` | `(720, 720)` | `now=540; blocked=False; existing=[]` | False | AC1 | PASS | PASS |
| 8 | `test_reversed_times_are_rejected` | `(750, 720)` | `now=540; blocked=False; existing=[]` | False | AC1 | PASS | PASS |
| 9 | `test_end_at_midnight_is_allowed` | `(1380, 1440)` | `now=540; blocked=False; existing=[]` | True | AC1 | PASS | PASS |
| 10 | `test_end_after_midnight_is_rejected` | `(1380, 1441)` | `now=540; blocked=False; existing=[]` | False | AC1 | PASS | PASS |
| 11 | `test_negative_start_is_rejected` | `(-1, 30)` | `now=0; blocked=False; existing=[]` | False | AC1 | PASS | PASS |
| 12 | `test_start_before_now_is_rejected` | `(539, 570)` | `now=540; blocked=False; existing=[]` | False | AC1 | PASS | PASS |
| 13 | `test_start_one_minute_after_now_is_allowed` | `(541, 570)` | `now=540; blocked=False; existing=[]` | True | AC1 | PASS | PASS |
| 14 | `test_empty_existing_is_allowed` | `(600, 660)` | `now=540; blocked=False; existing=[]` | True | AC4 / AC5 | PASS | PASS |
| 15 | `test_overlap_with_later_list_entry_is_rejected` | `(730, 760)` | `now=540; blocked=False; existing=[(600, 660), (720, 780)]` | False | AC4 / AC5 | PASS | PASS |
| 16 | `test_several_unsorted_nonoverlapping_bookings` | `(660, 720)` | `now=540; blocked=False; existing=[(780, 840), (600, 660), (720, 750)]` | True | AC4 / AC5 | PASS | PASS |
| 17 | `test_existing_unchanged_on_accept` | `(660, 720)` | `now=540; blocked=False; existing=[(780, 840), (600, 660)]; also assert list equality` | True | AC5 | PASS | PASS |
| 18 | `test_existing_unchanged_on_reject` | `(630, 690)` | `now=540; blocked=False; existing=[(780, 840), (600, 660)]; also assert list equality` | False | AC5 | PASS | PASS |
| 19 | `test_request_inside_existing_is_rejected` | `(615, 645)` | `now=540; blocked=False; existing=[(600, 660)]` | False | AC4 / AC5 | PASS | PASS |
| 20 | `test_request_contains_existing_is_rejected` | `(570, 690)` | `now=540; blocked=False; existing=[(600, 660)]` | False | AC4 / AC5 | PASS | PASS |
| 21 | `test_touching_start_is_allowed` | `(570, 600)` | `now=540; blocked=False; existing=[(600, 660)]` | True | AC4 / AC5 | PASS | PASS |
| 22 | `test_one_minute_overlap_is_rejected` | `(659, 719)` | `now=540; blocked=False; existing=[(600, 660)]` | False | AC4 / AC5 | PASS | PASS |
| 23 | `test_last_minute_of_day_is_allowed` | `(1439, 1440)` | `now=1438; blocked=False; existing=[]` | True | AC1 | PASS | PASS |
| 24 | `test_float_start_is_rejected_by_declared_policy` | `(600.5, 660)` | `now=540; blocked=False; existing=[]` | False | Declared policy (§9.2); outside AC1–AC5 | FAIL: True, expected False | PASS |
| 25 | `test_float_end_is_rejected_by_declared_policy` | `(600, 660.5)` | `now=540; blocked=False; existing=[]` | False | Declared policy (§9.2); outside AC1–AC5 | FAIL: True, expected False | PASS |
| 26 | `test_string_start_is_rejected_by_declared_policy` | `('600', 660)` | `now=540; blocked=False; existing=[]` | False | Declared policy (§9.2); outside AC1–AC5 | ERROR: TypeError | PASS |
| 27 | `test_string_end_is_rejected_by_declared_policy` | `(600, '660')` | `now=540; blocked=False; existing=[]` | False | Declared policy (§9.2); outside AC1–AC5 | ERROR: TypeError | PASS |
| 28 | `test_boolean_start_is_rejected_by_declared_policy` | `(True, 2)` | `now=0; blocked=False; existing=[]` | False | Declared policy (§9.2); outside AC1–AC5 | FAIL: True, expected False | PASS |
| 29 | `test_boolean_end_is_rejected_by_declared_policy` | `(1, True)` | `now=0; blocked=False; existing=[]` | False | Declared policy (§9.2); outside AC1–AC5 | PASS | PASS |

The six-case run passed its own suite but missed M2, M3, M7, M8, M9 and M10. All six were caught together when the suite grew to 22 tests; none was observed to survive longer than the others. The last-minute edge case increased the suite to 23; the declared-policy cases increased it to 29.

The negative-start test does not isolate one AC1 bound: a negative start also violates start > now, since now is nonnegative. This redundancy is explained in section 9.3. The Boolean-end test also fails a numeric ordering condition in v1, so its passing result alone does not establish type checking. Boolean-start and other policy tests distinguish the new behavior. Policy tests are not used as evidence of compliance for inputs outside the contract.

---

## 5. Task 4 — debugging with evidence

One row per defect you found — in v1, in a later version, or in your own tests. If v1 passed
everything, the row is the **new edge case you added**, with expected and actual equal, and the
cause column says why no change was needed.

| # | Input (the full call) | Expected | Actual | Cause (quote the line) | Fix | Who proposed the fix |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `can_book(600.5, 660, 540, False, [])` | False under my new policy | True on v1 | v1 line 3 compares numeric values without checking types. | Add a type guard to the working copy only. | Student chose the policy; coordinating assistant proposed the guard. |
| 2 | `can_book(600, 660.5, 540, False, [])` | False under my new policy | True on v1 | v1 line 3 accepts a float end numerically. | Same guard. | Same as row 1. |
| 3 | `can_book("600", 660, 540, False, [])` | False under my new policy | TypeError on v1 | v1 line 3 attempts an integer/string comparison. | Same guard, before comparisons. | Same as row 1. |
| 4 | `can_book(600, "660", 540, False, [])` | False under my new policy | TypeError on v1 | v1 line 3 attempts an integer/string comparison. | Same guard, before comparisons. | Same as row 1. |
| 5 | `can_book(True, 2, 0, False, [])` | False under my new policy | True on v1 | v1 line 3 does not distinguish Boolean from integer inputs. | Require exact int type for start and end. | Same as row 1. |
| 6 | `can_book(1439, 1440, 1438, False, [])` | True | True on v1 | v1 line 3 permits end 1440; line 6 permits start after now. | No fix: the added last-minute edge case passes. | Added with AI assistance after the original 22 tests passed. |

**The debug prompt I sent, and the assistant's answer** (leave the block empty if you did not use it):

```text
```

---

## 6. Task 5 — the critique

**The exact final review prompt and code sent:**

~~~~text
Review this implementation of can_book against the contract and AC1-AC5 only. List at most five concrete issues. For each one, quote the line and name the acceptance criterion or contract line it concerns. Do not rewrite the function.

```python
def can_book(start, end, now, blocked, existing):
    # Declared policy for inputs outside the integer-time contract.
    if type(start) is not int or type(end) is not int:
        return False

    # AC1: Validate time range and future start
    if not (0 <= start < end <= 1440):
        return False

    if start <= now:
        return False

    # AC2: Maximum booking duration is 120 minutes
    if end - start > 120:
        return False

    # AC3: Room must not be blocked
    if blocked:
        return False

    # AC4: Check for overlapping bookings
    for existing_start, existing_end in existing:
        if start < existing_end and end > existing_start:
            return False

    # AC5: All conditions are satisfied
    return True
```
~~~~

**The assistant's critique, pasted unedited:**

~~~~text
## Code Review: `can_book()`

**Result: PASS — No concrete violations found.**

| CriterionCode reviewedResult |                                                      |      |
| ---------------------------- | ---------------------------------------------------- | ---- |
| Contract — Integer times     | `if type(start) is not int or type(end) is not int:` | PASS |
| AC1 — Valid time range       | `if not (0 <= start < end <= 1440):`                 | PASS |
| AC1 — Future start           | `if start <= now:`                                   | PASS |
| AC2 — Maximum duration       | `if end - start > 120:`                              | PASS |
| AC3 — Room not blocked       | `if blocked:`                                        | PASS |
| AC4 — No overlap             | `if start < existing_end and end > existing_start:`  | PASS |
| AC5 — Final decision         | `return True`                                        | PASS |
| Contract — Inputs unchanged  | No input mutation                                    | PASS |

### Findings

**0 concrete issues identified.**

One observation:

`if type(start) is not int or type(end) is not int:`

This introduces an explicit policy for non-integer inputs. The contract specifies integer times but does not define behavior for other types. Therefore, returning `False` for non-integer inputs is not a violation.

### Conclusion

The implementation satisfies **AC1–AC5** for all inputs covered by the supplied contract.

No changes are required.

*Review type: Static code review. No tests executed.
~~~~

The review reported zero defects and one policy observation. The following AI-assisted assessment separates its conclusions for traceability; it does not invent additional criticism. An earlier review concerned v1. A second ambiguous response referred to an earlier implementation, so the student resent the exact prompt with the complete final code before obtaining the review above.

| # | Suggestion | accept / reject | Reason — cite the AC or the contract line | Suite after the change |
| --- | --- | --- | --- | --- |
| 1 | No concrete violation of AC1–AC5; no further change required. | accept | Range, future start, duration, blocking and overlap map to AC1–AC4; Boolean decisions and no mutation map to AC5. Actual tests, rather than the review alone, support this assessment. | No review-driven change; 29 tests pass. |
| 2 | The explicit non-integer return-False policy is outside the supplied integer-time contract and is not a violation. | accept | The contract does not specify non-integer behavior. The student selected return False, including Boolean inputs, and section 9.2 declares that choice. | The policy change was tested before this final review; all 29 tests pass. |
| 3 | Inputs are unchanged. | accept | AC5 requires existing to remain unchanged. Tests compare its content and order before and after both acceptance and rejection. | Unchanged-input tests pass. |

---

## 7. Change log — v1 to final

| # | What changed (the line, before → after) | Why | Evidence: the test or check that moved |
| --- | --- | --- | --- |
| 1 | Working code: before the original AC1 check, add `if type(start) is not int or type(end) is not int: return False`. Original booking_v1.py remains unchanged. | Student chose deterministic rejection of non-integer request times, including Boolean values, rather than leaving behavior unspecified. This is a declared extension outside the integer-input contract, not an AC defect in v1. | Three policy assertion failures and two TypeErrors on v1 became passing tests; the Boolean-end test already passed on v1. All 29 final tests pass. |
| 2 | Expand six table tests to 22 boundary and unchanged-input tests. | Initial tests missed day/order limits, later-list conflicts, containment and input mutation. | M2, M3, M7, M8, M9 and M10 changed from FAIL to PASS. |
| 3 | Add `test_last_minute_of_day_is_allowed` after the 22-test run. | Required additional edge case after v1 passed every F check. | `can_book(1439, 1440, 1438, False, [])` returned True as expected; no implementation fix was needed. |

---

## 8. Evidence — real output

### 8.1 My suite, final run

Student's complete terminal output, Python 3.9.6, final 29-test suite:

```text
test_121_minutes_is_rejected (test_booking.BookingTests) ... ok
test_blocked_room_is_rejected (test_booking.BookingTests) ... ok
test_boolean_end_is_rejected_by_declared_policy (test_booking.BookingTests) ... ok
test_boolean_start_is_rejected_by_declared_policy (test_booking.BookingTests) ... ok
test_empty_existing_is_allowed (test_booking.BookingTests) ... ok
test_end_after_midnight_is_rejected (test_booking.BookingTests) ... ok
test_end_at_midnight_is_allowed (test_booking.BookingTests) ... ok
test_exactly_120_minutes_is_allowed (test_booking.BookingTests) ... ok
test_existing_unchanged_on_accept (test_booking.BookingTests) ... ok
test_existing_unchanged_on_reject (test_booking.BookingTests) ... ok
test_float_end_is_rejected_by_declared_policy (test_booking.BookingTests) ... ok
test_float_start_is_rejected_by_declared_policy (test_booking.BookingTests) ... ok
test_last_minute_of_day_is_allowed (test_booking.BookingTests) ... ok
test_negative_start_is_rejected (test_booking.BookingTests) ... ok
test_one_minute_overlap_is_rejected (test_booking.BookingTests) ... ok
test_overlap_with_later_list_entry_is_rejected (test_booking.BookingTests) ... ok
test_partial_overlap_is_rejected (test_booking.BookingTests) ... ok
test_request_contains_existing_is_rejected (test_booking.BookingTests) ... ok
test_request_inside_existing_is_rejected (test_booking.BookingTests) ... ok
test_reversed_times_are_rejected (test_booking.BookingTests) ... ok
test_several_unsorted_nonoverlapping_bookings (test_booking.BookingTests) ... ok
test_start_before_now_is_rejected (test_booking.BookingTests) ... ok
test_start_equal_to_now_is_rejected (test_booking.BookingTests) ... ok
test_start_one_minute_after_now_is_allowed (test_booking.BookingTests) ... ok
test_string_end_is_rejected_by_declared_policy (test_booking.BookingTests) ... ok
test_string_start_is_rejected_by_declared_policy (test_booking.BookingTests) ... ok
test_touching_end_is_allowed (test_booking.BookingTests) ... ok
test_touching_start_is_allowed (test_booking.BookingTests) ... ok
test_zero_length_is_rejected (test_booking.BookingTests) ... ok

----------------------------------------------------------------------
Ran 29 tests in 0.000s

OK
```

### 8.2 The checker, final run

The coordinating assistant ran the unchanged supplied checker on a workspace copy of the files. Full output follows. The student will also run it on the repository before submission.

```text
Week 05 - can_book: the function, your tests, the evidence   (Path A)

PASS   F1   the six cases from the task table           6 of 6 cases
PASS   F2   AC1 time order and day bounds               5 of 5 cases
PASS   F3   AC1 the start is in the future              5 of 5 cases
PASS   F4   AC2 at most 120 minutes                     3 of 3 cases
PASS   F5   AC3 a blocked room accepts nothing          2 of 2 cases
PASS   F6   AC4 every kind of overlap is rejected       5 of 5 cases
PASS   F7   AC4 touching endpoints are allowed          3 of 3 cases
PASS   F8   AC4 every existing booking is checked       4 of 4 cases
PASS   F9   AC5 the result is a real Boolean            3 of 3 cases
PASS   F10  AC5 the inputs are left unchanged           2 of 2 cases
PASS   O1   the assistant's first version is kept       v1 kept (23 lines)
PASS   S1   your suite has at least 11 tests            29 tests
PASS   S2   your suite is green on your own code        29 tests, OK
PASS   M1   your tests catch a fault in AC1             caught by test_start_equal_to_now_is_rejected
PASS   M2   your tests catch a fault in AC1             caught by test_end_after_midnight_is_rejected
PASS   M3   your tests catch a fault in AC1             caught by test_boolean_end_is_rejected_by_declared_policy, test_zero_length_is_rejected
PASS   M4   your tests catch a fault in AC2             caught by test_exactly_120_minutes_is_allowed
PASS   M5   your tests catch a fault in AC3             caught by test_blocked_room_is_rejected
PASS   M6   your tests catch a fault in AC4             caught by test_existing_unchanged_on_accept, test_several_unsorted_nonoverlapping_bookings, test_touching_end_is_allowed and 1 more
PASS   M7   your tests catch a fault in AC4             caught by test_existing_unchanged_on_reject, test_overlap_with_later_list_entry_is_rejected
PASS   M8   your tests catch a fault in AC4             caught by test_request_contains_existing_is_rejected
PASS   M9   your tests catch a fault in AC5             caught by test_existing_unchanged_on_accept
PASS   M10  your tests catch a fault in AC5             caught by test_existing_unchanged_on_accept, test_existing_unchanged_on_reject
PASS   L1   report 1: tool, model and language          tool, model and language recorded
PASS   L2   report 2: the plan, and what you corrected  plan pasted, 1 row(s) on what you corrected or verified
PASS   L3   report 3: v1 mapped to AC1-AC4              6 conditions mapped, AC1-AC4 all present
PASS   L4   report 4: at least 11 of your tests listed  29 tests listed
PASS   L5   report 5: debugging evidence                6 row(s) of input / expected / actual
PASS   L6   report 6: the critique, each point judged   critique pasted, 3 points judged
PASS   L7   report 7: change log                        3 change-log row(s)
PASS   L8   report 8.1: real output of your suite       suite output pasted
PASS   L9   report 10: conclusion of 120-180 words      156 words
------------------------------------------------------------------------------
v1 (code/original/booking_v1.py): passes F1 F2 F3 F4 F5 F6 F7 F8 F9 F10 - fails nothing - identical to your final: no
Not counted for M - these fail on a can_book that follows the contract exactly, so they
test what the contract leaves open or contradict an AC: test_boolean_start_is_rejected_by_declared_policy, test_float_end_is_rejected_by_declared_policy, test_float_start_is_rejected_by_declared_policy, test_string_end_is_rejected_by_declared_policy, test_string_start_is_rejected_by_declared_policy
SUMMARY pass=32 fail=0 error=0   (32 checks)
Behaviour and shape are clean. This says nothing about the quality of your review.
```

### 8.3 Path B only — three faults I planted myself

Not applicable: Python, Path A; the supplied mutation checks are used instead.

| # | Line I changed (before → after) | AC it breaks | Test that failed |
| --- | --- | --- | --- |
| N/A | Path A: no manual planted faults | N/A | M1–M10 run by the supplied checker |

The three failing runs (Path A students leave this block empty):

```text
```

---

## 9. What still fails, and what the contract does not say

### 9.1 Checks I am keeping as FAIL or ERROR

Final checker result: pass=32, fail=0, error=0. Earlier six-case run: pass=19, fail=13, error=0. The 22-test run: pass=26, fail=6, error=0; the remaining six were unfinished report sections.

| Check | Why it stays |
| --- | --- |
| none | All 32 final checker checks pass; no FAIL or ERROR is retained. |

### 9.2 Outside the contract

The student chose an additional policy: non-integer start or end returns False, including Python Boolean values. There is no implicit conversion. The student explained in Chinese: “预约时间不能是小数，非整数直接判定无效。” The English explanation is AI-assisted: requests must use integer minute values; the final guard rejects other types before comparison. The supplied guarantees for now, blocked and existing remain assumptions, not newly validated inputs.

Observed on v1: `can_book(600.5, 660, 540, False, [])` returned True and `can_book('600', 660, 540, False, [])` raised TypeError. After the new rule, both return False. This change does not prove v1 violated AC1–AC5: those criteria assumed integer inputs. Five policy tests fail on the checker's reference implementation and therefore do not count toward mutation detection; they are retained to document the chosen extra behavior. The Boolean-end case also happens to be rejected by the reference implementation because of ordering, and its mutation result must not be mistaken for evidence about the out-of-contract type policy.

### 9.3 A bound that never decides

The lower bound `0 <= start` cannot be the only reason to reject a request. The student explained: “now 不会小于 0，如果 start 是负数，这个开始时间肯定早于 now，直接违反预约必须晚于当前时间的要求。” Translation: now cannot be negative. A negative start is therefore earlier than now and already violates the requirement that the booking start later than the current time.

---

<!-- Authorship disclosure: The student supplied the current English conclusion after AI explanation and an AI-assisted English draft based on their Chinese points. This is not claimed as writing completed without AI assistance. -->
## 10. Conclusion (120–180 words)

Two bookings that touch are fine, because the first one finishes exactly when the second starts, so they never use the room at the same time. What I missed at first was checking whether existing actually changed. The return value alone is not enough — the function could give the right answer while still quietly altering the original bookings, which is why the tests compare the list before and after each call. My first six tests were too thin and missed several faults, like modified input; the bigger suite caught them. I also added my own rule for times that are not integers: return False instead of accepting fractions or converting strings. This is behaviour the contract never defines, so it is an extra choice I made and declared. The main lesson I take away is to think about edge cases and validation, and to check not just the decision but the data that is left behind.
