# SIS #03 — Report: Smart Campus Room Availability Checker
## 1. Setup and reuse
| Item | Value |
| --- | --- |
| Coding assistant (tool) | ChatGPT / Codex |
| Coding assistant model | GPT-6 |
| Bolt.new model | not displayed |
| Bolt project link | https://bolt.new/~/sb1-g3bmtzgh |
| Language | Python 3, React, TypeScript |
| Path | A |
| Python v1 from | week-05 |
| Web v1 from | week-06 |
## 2. Baseline — before any new AI exchange
### 2.1 Scope in my own words
**Scope:**
The goal is to check whether a student can book a room at a selected time. The system checks the time range, maximum duration, blocked status and conflicts with existing bookings. It returns a clear availability decision without changing existing booking data. The webpage should also explain invalid input and work on narrow screens.
The project does not need a login system, database, backend, payment system or permanent booking storage.
### 2.2 The acceptance criteria in my own words
| AC | In my own words |
| --- | --- |
| AC1 | The times must satisfy `0 <= start < end <= 1440`, and the start must be later than `now`. |
| AC2 | A booking cannot last more than 120 minutes. Exactly 120 minutes is allowed. |
| AC3 | If the room is blocked, the booking must be rejected. |
| AC4 | A new booking cannot overlap an existing booking, but touching endpoints are allowed. |
| AC5 | The result must be a clear Boolean in Python or Available/Unavailable on the page, without changing existing bookings. |
| AC6 | The page should show understandable feedback and remain usable on narrow screens. |
### 2.3 Likely failure points
| # | Failure point | AC | How I will check it |
| --- | --- | --- | --- |
| 1 | A booking starts exactly at the current time. | AC1 | Test `start == now` and expect rejection. |
| 2 | A booking lasts exactly 120 minutes. | AC2 | Check that the booking is allowed when all other conditions pass. |
| 3 | Two bookings touch at their endpoints. | AC4 | Check that touching does not count as overlap. |
| 4 | The room is blocked. | AC3 | Set `blocked=True` and expect rejection. |
### 2.4 The contract
| Parameter | Meaning | Type and allowed values |
| --- | --- | --- |
| `start` | New booking start | Integer minutes within the day |
| `end` | New booking end | Integer minutes, at most 1440 |
| `now` | Current time | Integer minutes from 0 to 1439 |
| `blocked` | Room blocked status | Boolean |
| `existing` | Existing bookings | List of start/end intervals |
| returns | Availability decision | Boolean |
The function signature is:
`can_book(start, end, now, blocked, existing)`
The function must not change the existing bookings or other input data. Intervals use a start-inclusive, end-exclusive convention.
### 2.5 Initial assumptions and manual checks
**Assumptions:**
1. All times are represented as integer minutes on the same day.
2. Existing booking intervals are valid.
3. Touching endpoints do not create a conflict.
4. Availability checking does not save or modify bookings.
**Planned manual checks:**
- A booking starting at `now` must be rejected.
- A booking lasting exactly 120 minutes can be accepted.
- A booking starting when an existing booking ends can be accepted.
- A booking lasting 121 minutes must be rejected.
- A blocked room must reject every request.
## 3. Python v1 review
| Branch in v1 (quoted) | AC | Satisfies it? | Why |
| --- | --- | --- | --- |
| `if not (0 <= start < end <= 1440):` | AC1 | Yes | Rejects invalid ranges and times outside the day. |
| `if start <= now:` | AC1 | Yes | Rejects bookings starting now or earlier. |
| `if end - start > 120:` | AC2 | Yes | Rejects bookings longer than 120 minutes. |
| `if blocked:` | AC3 | Yes | Rejects blocked rooms. |
| `for existing_start, existing_end in existing:` | AC4 | Yes | Checks all existing bookings. |
| `if start < existing_end and end > existing_start:` | AC4 | Yes | Detects overlaps while allowing touching endpoints. |
The original Python function already implements the main acceptance criteria correctly for inputs covered by the contract. The final version adds explicit type validation for invalid input types.
## 4. Prototype v1 in Bolt.new
**Prompt as sent:**
The exact original Bolt.new prompt was not preserved in the Week 06 records. The project export contains a generic `.bolt/prompt` configuration, but that file is not evidence of the actual message sent to Bolt.
The following is a reconstruction of the requirements, **not a verbatim historical prompt**:
> Build a room-booking availability checker using React and TypeScript. Check that the start time is in the future, the end time is later than the start, the duration is at most 120 minutes, the room is not blocked, and the requested time does not overlap an existing booking. Touching endpoints should be allowed. Show Available or Unavailable with clear feedback. Keep the layout usable on narrow screens. Do not add login, backend services, a database, network requests or persistent storage.
**What v1 does:**
The original Bolt prototype displayed a room-booking interface and availability feedback. However, it used the computer's current time and different existing bookings from the required test fixture. Because of this, I could not reproduce the exact SIS test conditions in the original version.
The original prototype was preserved in `web/original/`. The final version was copied separately to `web/final/`, allowing both versions to be compared.
**Generated files in the original Bolt export:**
| # | File (relative to web/original/) | Purpose |
| --- | --- | --- |
| 1 | `src/App.tsx` | Main room-booking interface |
| 2 | `src/components/RoomList.tsx` | Displays the available rooms |
| 3 | `src/components/ResultBanner.tsx` | Shows booking availability feedback |
| 4 | `src/lib/validation.ts` | Contains input validation logic |
## 5. Test cases — executed on both artifacts
Base conditions unless stated otherwise:
`now = 540`, `blocked = False`, `existing = [(600, 660)]`
| Case | Name | Input | Expected | Python v1 | Python final | Page v1 | Page final |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T1 | Touching | 660–720 | Available | True | True | Not testable | Available |
| T2 | Overlap | 630–690 | Unavailable | False | False | Not testable | Unavailable |
| T3 | Blocked | 660–720, blocked | Unavailable | False | False | Not testable | Unavailable |
| T4 | Exactly 120 min | 720–840 | Available | True | True | Not testable | Available |
| T5 | 121 min | 720–841 | Unavailable | False | False | Not testable | Unavailable |
| T6 | Starts now | 540–570 | Unavailable | False | False | Not testable | Unavailable |
| T7 | Reversed | 720–660 | Unavailable | False | False | Not testable | Unavailable |
| T8 | Ends at midnight | 1380–1440 | Available | True | True | Not testable | Not testable |
| T9 | Past midnight | 1380–1441 | Unavailable | False | False | Not testable | Not testable |
| T10 | Second booking | 720–780, existing (600–660), (700–760) | Unavailable | False | False | Not testable | Not testable |
| T11 | Same check twice | 660–720, twice | Available | True | True | Not testable | Available |
| T12 | Narrow screen | T1 at approximately 375px | Available | n/a | n/a | Not testable | Available |
The Python results were verified by the supplied checker. The final webpage results for the corresponding Week 06 scenarios were recorded in the earlier lab. The native time input cannot express `24:00`, and some SIS-specific webpage cases were not independently reproduced. These are reported as Not testable rather than invented passes.
## 6. Traceability
| AC | Implementation / file | Test input | Expected | v1 actual | Final actual |
| --- | --- | --- | --- | --- | --- |
| AC1 | `code/booking.py`, time validation | T6, T7, T9 | False | False | False |
| AC2 | `code/booking.py`, duration validation | T4, T5 | True, False | True, False | True, False |
| AC3 | `code/booking.py`, blocked check | T3 | False | False | False |
| AC4 | `code/booking.py`, overlap loop | T1, T2, T10 | True, False, False | True, False, False | True, False, False |
| AC5 | `code/booking.py`, Boolean result and no mutation | T11 | True | True | True |
| AC6 | `web/final/src/App.tsx`, result feedback and responsive layout | T12 | Available | Not testable | Available |
## 7. Issue log
| # | Issue | Reproduction / AC | Priority | Focused prompt / change | Retest |
| --- | --- | --- | --- | --- | --- |
| 1 | The original page used system time and different bookings. | T1 and AC1: required now=09:00 and existing booking 10:00–11:00 could not be reproduced in the original export; see evidence/issue-1.jpg. | High | Make the test fixture reproducible using now=09:00 and existing booking 10:00–11:00; keep all booking rules unchanged. | The recorded Week 06 final touching-booking scenario returned Available; other exact SIS cases were not all reproduced. |
| 2 | Native time input cannot represent 24:00. | T8 and AC1: end=1440 is valid in Python but cannot be entered as 24:00 in the page; see evidence/issue-2.jpg. | Medium | Review the native time-input boundary and document the end-of-day limitation without adding backend services or storage. | Still unresolved; T8 and T9 on the page remain Not testable. |


**Before / after:** Issue 1 is shown by `evidence/before-1.png` and `evidence/after-1.png`. The first shows the original test setup; the second shows the recorded final touching-bookings result.
These screenshots support the comparison but do not replace a missing historical AI conversation.
## 8. Critique decisions
| # | Claim or recommendation reviewed | How I verified it | Decision | Reason |
| --- | --- | --- | --- | --- |
| 1 | The Python implementation satisfies AC1–AC5 for contract-valid inputs. | Reviewed every branch and ran the Python test suite. | Accept | The supplied checker and 29 unit tests passed. |
| 2 | Explicit type guards are necessary for every booking request. | Compared the original and final Python code and checked the stated contract. | Modify | Type guards are useful defensive validation, but non-integer inputs are outside the original contract. |
| 3 | The final webpage can fully represent every valid Python time boundary. | Reviewed the native time input and the documented 24:00 limitation. | Reject | The Python function allows an end time of 1440, but the webpage cannot enter 24:00. |
The Week 05 AI review reported no concrete AC1–AC5 violations in the final Python function. I accepted that conclusion for the documented contract, while separately recording the webpage's end-of-day limitation.
## 9. Coding-agent analysis
### 9.1 The loop
| Item | Description |
| --- | --- |
| User goal | Improve the room-booking prototype without adding features outside the assignment. |
| Model / plan | Review the contract, compare original and final code, identify reproducible problems and test required cases. |
| Tool call | Use Git to recover Week 05 and Week 06 exports, run Python unittest and the SIS checker, and inspect the React project. |
| Observation | All 29 Python tests passed. The original webpage could not reproduce the fixed-time fixture. The final export differed from the original. |
| Next step | Preserve evidence, document limitations, complete the report and rerun the checker. |
| Human review | I checked the acceptance criteria, reviewed test results and kept the original and final sources separate. |
### 9.2 Context, tools and permissions
| # | Item | Description | Observed or Assumed |
| --- | --- | --- | --- |
| 1 | Context | The assistant used the booking contract, acceptance criteria, Python code and earlier lab records. | Observed |
| 2 | Tools | Git, Python unittest, the SIS checker and local project files were used during the review. | Observed |
| 3 | Permissions | Changes should remain inside the SIS-03 branch, without touching external services or production data. | Assumed |


### 9.3 Checkpoint and dependability
**Safety checkpoint:** Before accepting a change, I check whether it stays within the booking requirements, avoids unnecessary features, preserves the original versions and keeps the test suite green. I also review the changed files before committing them to Git.
**Reliability, security, responsibility:** Automated tests help detect incorrect behavior, but they do not prove that every interface scenario works. I compare results with the acceptance criteria and use screenshots as supporting evidence. I avoid adding unnecessary network access, storage, authentication or dependencies. I also separate actual observations from assumptions. If a historical prompt or test result was not saved, I disclose that instead of creating false evidence.
## 10. Reflection
AI-assisted coding and vibe coding helped me in different ways. For Python, I used a clear contract and tested each rule separately. This made it easier to understand why the function accepted or rejected a booking. With Bolt.new, I could get a working webpage faster, but I had less control over the first version and its test conditions.
One reliability risk was incorrect time validation, especially when a booking starts exactly at the current time. An availability and usability risk was the webpage's inability to enter 24:00. A security risk would be adding unnecessary backend access or storage to a simple checker.
I learned that AI suggestions still need human review. For example, I did not treat the final webpage as fully supporting every Python boundary because the 24:00 limitation remained. I also checked tool permissions, reviewed changes and ran tests instead of trusting generated code automatically.
Next time, I would save every prompt, response and screenshot immediately. I would also test the interface against the contract earlier, without adding features outside the assignment.
## 11. Appendix A — AI exchanges
### B1
- **Tool:** ChatGPT Work / Codex desktop
- **Model:** not displayed
- **Date:** 2026-10-11
- **Stage:** Plan
- **Source:** week-05
**Prompt:**
```text
Propose a short implementation plan for can_book. List the checks in order and identify assumptions. Use Python 3 and the supplied rules. Do not write code yet. Suggest boundary cases that could expose an incorrect implementation.
```
**Response:**
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
1. start == now: False
2. start == now + 1 with all other checks passing: True
3. start == end: False
4. end == 1440 with all other checks passing: True
5. Duration = 120 minutes: True
6. Duration = 121 minutes: False
7. blocked == True: False
8. New booking starts exactly when an existing booking ends: True
9. New booking ends exactly when an existing booking starts: True
10. New booking overlaps an existing booking by 1 minute: False
11. existing is empty and all other checks pass: True
12. start < 0 or end > 1440: False
Key point: The implementation must reject invalid bookings, allow touching endpoints, and keep all inputs unchanged.
```
### B2
- **Tool:** ChatGPT Work / Codex desktop
- **Model:** not displayed
- **Date:** 2026-10-11
- **Stage:** Generate
- **Source:** week-05
**Prompt:**
```text
Implement can_book in booking.py using the supplied contract and AC1-AC5. Keep the signature. Use only the standard library. Do not modify existing. Return the function and explain each condition. Keep the feature within the stated scope.
```
**Response:**
```python
def can_book(start, end, now, blocked, existing):
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
Explanation accompanying the generated function:
```text
1. AC1 — Valid time: Ensures start and end are within 0–1440, start < end, and start > now.
2. AC2 — Duration: Rejects bookings longer than 120 minutes. Exactly 120 minutes is allowed.
3. AC3 — Blocked room: Returns False when the room is blocked.
4. AC4 — Overlap: Rejects bookings that overlap existing reservations. Touching endpoints are allowed because intervals are [start, end).
5. AC5 — Final decision: Returns True only when all conditions pass.
Scope: The function checks one selected room and returns a Boolean. It does not save bookings, generate confirmations, or modify existing.
This implementation uses no imports or external libraries and stays within the supplied requirements.
```
### B3
- **Tool:** ChatGPT Work / Codex desktop
- **Model:** not displayed
- **Date:** 2026-10-11
- **Stage:** Critique
- **Source:** week-05
**Prompt:**
```text
Review this implementation of can_book against the contract and AC1-AC5 only. List at most five concrete issues. For each one, quote the line and name the acceptance criterion or contract line it concerns. Do not rewrite the function.
```
The original Week 05 exchange also included the implementation being reviewed.
**Response:**
```text
Code Review: can_book()
Result: PASS — No concrete violations found.
Contract — Integer times:
if type(start) is not int or type(end) is not int:
PASS
AC1 — Valid time range: PASS
AC1 — Future start: PASS
AC2 — Maximum duration: PASS
AC3 — Room not blocked: PASS
AC4 — No overlap: PASS
AC5 — Final decision: PASS
Contract — Inputs unchanged: PASS
Findings: 0 concrete issues identified.
One observation: type guard introduces an explicit policy for non-integer inputs. Contract specifies integer times but does not define behavior for other types. Returning False for non-integer inputs is not a violation.
Conclusion: implementation satisfies AC1–AC5 for all inputs covered by contract. No changes required.
Review type: Static code review. No tests executed.
```
### B4
- **Tool:** ChatGPT / Codex
- **Model:** not displayed
- **Date:** 2026-10-16
- **Stage:** Repair
- **Source:** week-06
**Prompt:**
```text
The exact historical repair prompt was not preserved in the available Week 06 records. The recorded repair concerned the booking rule that must reject a start time equal to the current time, together with a TypeScript timeline typing problem.
```
**Response:**
```text
The complete historical AI response was not preserved.
The Week 06 report records two changes:
1. The future-start comparison was corrected from start < currentTime to start <= currentTime.
2. A timeline typing problem was corrected so the React project could pass its type check.
The recorded final T6 test rejected a booking starting exactly at now. The final Week 06 test evidence also recorded the remaining scenarios. This is a summary of documented work, not a fabricated verbatim AI response.
```
## 12. Appendix B — Test output
### 12.1 Your suite
The suite was rerun locally on 2026-10-24:
```bash
python3 -m unittest discover -s code -p "test_booking.py" -v
```
Complete output (elapsed time depends on the environment):
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

### 12.2 Path B only — three faults you planted
| # | Line you broke | AC | Test that failed |
| --- | --- | --- | --- |
| 1 | Not applicable — Path A | — | — |
| 2 | Not applicable — Path A | — | — |
| 3 | Not applicable — Path A | — | — |
## 13. Remaining limitations and known fails
| Check ID or limitation | Why it stays | What I would do next |
| --- | --- | --- |
| X4 — Original Bolt prompt | The verbatim historical prompt was not preserved. | Save prompts and responses during future development. |
| Repair exchange transcript | The full historical AI prompt and response were not preserved. | Use the available Week 06 code and test evidence; do not invent the transcript. |
| 24:00 time input | The webpage cannot express an end time of 1440 using the current native time input. | Add a carefully tested end-of-day input option in a future in-scope revision. |
| C4 — SIS-specific web cases | Page final T10 was not independently run with the two-booking fixture; its result remains Not testable. T8 and T9 also remain Not testable because of the time-input boundary. | Run and document those scenarios separately. |
| Original export scope warning | `web/original/package.json:14` declares `@supabase/supabase-js`. This dependency triggers the scope warning; a dependency declaration alone does not prove backend execution. The final package omits it. | Preserve the original export for comparison. |


The current repair leaves both original exports and all existing screenshots unchanged. Their provenance before this repair cannot be independently certified; the corresponding submission honesty fields are conservatively marked no. This does not assert that they were edited. Web results remain the previously recorded observations; no new browser runs are claimed.
