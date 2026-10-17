# Week 06 — Lab report

**Name:** Elshibai Ulzhalgas
**Group:** Monday 16:00–19:00
**Date:** 16 October 2026

---

## 1. Setup

| | |
| --- | --- |
| Tool | Bolt.new |
| Exact model (as Bolt shows it, or `not displayed`) | not displayed |
| Bolt project link (or `not shared`, and why) | https://bolt.new/~/sb1-g3bmtzgh |
| Browser and version | Google Chrome; exact version was not recorded |
| If you could not use Bolt.new: the tool you used instead, and why | Not applicable. Bolt.new was used to generate and improve the prototype. |

---

## 2. Task 1 — define before generating

**Two predictions, written BEFORE you send the first prompt.**

| # | What I expect to go wrong | AC it concerns | Was I right? (after Task 3) |
| --- | --- | --- | --- |
| 1 | The generated prototype may use the computer's current time instead of the supplied current time. This could make time-based testing difficult. | AC1 | Confirmed from source and rerun: v1 uses the system clock; final uses fixed 09:00. |
| 2 | The generated prototype may contain unnecessary functionality and complicated code outside the required scope. | AC5 and project scope | The original package declared an unused Supabase dependency; no running backend or network call was found. Prediction timing cannot be independently verified. |

**The initial prompt exactly as I sent it** — the deck's prompt with AC1–AC6 pasted in place of `[paste AC1–AC6]`, nothing else changed:

```text
The exact initial Bolt prompt was not preserved in the available
terminal history. The original project export was preserved in
original/project/, including its .bolt directory.

The requirements used for the prototype were:

AC1: A booking must have a valid time range and start after the
supplied current time. The time values must be within one day,
with an end time of at most 1440 minutes.

AC2: A booking must not be longer than 120 minutes.

AC3: A blocked room must be unavailable.

AC4: A booking must not overlap an existing booking.
Bookings that only touch at their boundaries are allowed.

AC5: Checking availability must not change existing booking data.

AC6: The interface must explain invalid input and remain usable
on a narrow screen.

This is a requirements summary, not a verbatim copy of the
original Bolt prompt.
```

---

## 3. Task 2 — prototype v1

v1 export saved in `original/` and screenshot saved as `evidence/v1.png` **before** any cleanup prompt: **yes**

**Bolt's list of the files/components it created, pasted unedited:**

```text
The original exported project contains these application files:

src/App.tsx
src/components/ResultBanner.tsx
src/components/RoomList.tsx
src/components/Timeline.tsx
src/index.css
src/lib/format.ts
src/lib/sampleData.ts
src/lib/types.ts
src/lib/validation.ts
src/main.tsx

The project also contains configuration files for Vite,
TypeScript, Tailwind CSS, ESLint, and package management.

This list was obtained from the original project export.
Bolt's exact response listing the components was not available
in the saved terminal history.
```

**What v1 does — one line per thing that works, or visibly does not:**

- The original prototype provides a study-room availability interface.
- It includes a room list and booking-related information.
- It has components for displaying a timeline and an availability result.
- It contains validation logic for booking requests.
- It uses React and TypeScript.
- It includes sample data for testing the interface.
- The original package declared an unused Supabase dependency outside the required scope.
- The original project was preserved separately before cleanup.
- The first version lacked the required test fixture and did not accept a supplied current time.

**Repair prompt** (only if the first build did not run — the deck allows one, then the result is v1). Leave empty if you did not need it:

```text
```

---

## 4. Task 3 — the nine cases

Base for every case unless the row says otherwise: **current time 09:00**, room **not blocked**, the room's **only booking 10:00–11:00**.

Retested locally on 16 October 2026 using the preserved exports, through the Codex in-app browser. Raw rendered outputs are in `evidence/v1-results.json` and `evidence/final-results.json`. These are retrospective tests, not recovered historical runs. v1 has no supplied-time control and no room with only the required 10:00–11:00 booking, so the exact base scenario cannot be established. Each requested interval was nevertheless entered: v1 displayed Unavailable for all nine; T7 explained reversed times, while the other attempts reported that the start must be after the system time (header 17:31). These outputs cannot be counted as acceptance-case matches. T9 was also attempted at narrow width.

| # | Case | What you set up and request | Expected | AC | Result on v1 | Result on final | Final screenshot |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T1 | Touching | 11:00–12:00 | Available | AC4 | Not testable | Available | final-T1.jpg |
| T2 | Overlap | 10:30–11:30 | Unavailable | AC4 | Not testable | Unavailable | final-T2.jpg |
| T3 | Blocked | 11:00–12:00, room blocked | Unavailable | AC3 | Not testable | Unavailable | final-T3.jpg |
| T4 | Exactly 2 hours | 12:00–14:00 | Available | AC2 | Not testable | Available | final-T4.jpg |
| T5 | Over 2 hours | 12:00–14:01 | Unavailable | AC2 | Not testable | Unavailable | final-T5.jpg |
| T6 | Starts now | 09:00–09:30 (current time 09:00) | Unavailable | AC1 | Not testable | Unavailable | final-T6.jpg |
| T7 | Reversed times | 12:00–11:00, and the page says why | Unavailable | AC1, AC6 | Not testable | Unavailable | final-T7.jpg |
| T8 | Same check twice | T1, then T1 again without reloading | Available | AC5 | Not testable | Available | final-T8.jpg |
| T9 | Narrow screen | T1 at about 375 px wide | Available | AC6 | Not testable | Available | final-T9.jpg |

Final T1–T9 were rerun with the required fixture and matched all expected results. T8 was checked twice without reload; both outputs are recorded. T9 was captured at an observed CSS width of 375 px with no horizontal overflow. All final screenshots were replaced by fresh, unedited captures. T6 initially returned Available; the final validation comparison was corrected and T6 then returned Unavailable with an explanation.

---

## 5. Issue log — cleanup targets

| # | Issue | Evidence: steps → expected → observed | Priority | Decision |
| --- | --- | --- | --- | --- |
| 1 | v1 cannot establish the specified test baseline | Select each room: expected supplied 09:00 and one 10:00–11:00 booking (AC1, AC4); observed system clock 17:31 and different bookings, with no controls to change them. See `evidence/issue-1.jpg`. | High | Fix |
| 2 | End-of-day input cannot express 24:00 | Enter 23:00 then attempt 24:00 in the end field: AC1 permits end=1440; native time input does not retain 24:00 (attempt left 23:00). Parser also rejects hour 24. See `evidence/issue-2.jpg`. | Medium | Defer |

Issue 2 is a documented AC1/AC6 limitation in both exports. The final keeps the existing HH:MM control and explicitly declares 24:00 not expressible. No screenshots were fabricated from source text.

---

## 6. Task 4 — cleanup with focused prompts

**Functional fix prompt, as sent, and Bolt's answer:**

```text
The exact functional-fix prompt and Bolt's full response were
not preserved in the available terminal history.

The functional requirements used during cleanup were:

- Check the requested booking time against the supplied current time.
- Reject invalid time ranges.
- Reject bookings longer than 120 minutes.
- Reject blocked rooms.
- Reject overlapping bookings.
- Allow bookings that touch an existing booking boundary.
- Do not change booking data when checking availability.
- Show an understandable result to the user.

The original and final source files are available for comparison.
This summary is not presented as a verbatim Bolt exchange.
```

**Cleanup prompt, as sent, and Bolt's answer:**

```text
The exact cleanup prompt and Bolt's full response were
not preserved in the available terminal history.

The cleanup goals were:

- Keep the prototype inside the assignment scope.
- Remove unnecessary functionality.
- Keep the interface simple and understandable.
- Preserve the required availability-checking behavior.
- Avoid unnecessary backend, database, or login functionality.
- Keep the project suitable for local demonstration.

The final project was exported to prototype/project/.
The original project remained unchanged in original/project/.

This is a summary of the cleanup goals, not a verbatim
record of the Bolt conversation.
```

**Decisions based on actual source comparison and this recovery session.** Historical Bolt suggestions cannot be verified; the entries below do not claim to quote them.

| # | What changed or was considered | accept / reject | Reason — cite the AC or the scope | Retest: which cases, result |
| --- | --- | --- | --- | --- |
| 1 | Fixed 09:00 fixture, common bookings and block toggle already present in final export | accept | AC1, AC3 and AC4 need reproducible inputs. | T1–T9 rerun; expected outcomes. |
| 2 | Remove unused Supabase dependency (visible in export diff) | accept | Scope excludes a backend; no backend execution is alleged. | P3 passes. |
| 3 | Codex changes start < currentTime to start <= currentTime | accept | AC1 requires strictly after now. | T6 reproduced Available before fix, Unavailable after; all nine rerun. |
| 4 | Codex explicitly types timeline blocks as booked or candidate | accept | Code-quality fix preserves AC5/AC6; existing typecheck failed. | Typecheck passes after correction. |

No new Bolt cleanup prompts were sent during this recovery session. The historical number is unknown. Neither their wording nor replies can be reconstructed from the exports. The `.bolt/prompt` file contains generic template styling instructions, not the student's conversation.

---

## 7. Change log — v1 to final

| # | Issue | Decision | Change (file or component) | Result after retest |
| --- | --- | --- | --- | --- |
| 1 | Required baseline missing | Accept existing cleanup | `src/lib/format.ts`, `sampleData.ts`, `App.tsx`, `RoomList.tsx`: fixed 09:00, single booking per room and blocked toggle. | T1–T9 matched after the separate T6 repair. |
| 2 | Unused backend dependency | Accept existing cleanup | `package.json` and lockfile remove Supabase; v1 source retained unchanged. | P3 passes; no network or storage found. |
| 3 | Start equal to now incorrectly accepted | Fix by Codex in recovery | `src/lib/validation.ts`: use <= for current-time rejection. | Real T6 red/green browser test; all nine match. |
| 4 | Timeline array inferred as booked-only | Fix by Codex in recovery | `src/components/Timeline.tsx`: explicit union type for booked and candidate blocks. | Typecheck, lint and production build verified. |

Rows 1–2 are observable export differences; the historical Bolt exchanges and per-prompt retests are unavailable. Rows 3–4 were made in this session, not attributed to Bolt.

---

## 8. One generated component, in my own words

**File:** `src/lib/validation.ts`

I selected this file because it is related to the most important function of the prototype: deciding whether a study room is available.

The validation logic checks a booking request against several rules. First, the requested time must be valid. The start time must be earlier than the end time, and the booking must start after the supplied current time.

Next, the requested duration must not be longer than two hours. The room must also be available for booking and must not be blocked.

Another important rule is checking for overlapping bookings. For example, if a room is already booked from 10:00 to 11:00, a request from 10:30 to 11:30 must be rejected. However, a request starting at 11:00 is allowed because the bookings only touch at the boundary.

I think this component is important because the interface can look correct while the validation logic still gives wrong results. Testing different time ranges helps us check whether the application follows the acceptance criteria.

---

## 9. What still fails, and what the criteria do not say

### 9.1 Checks I am keeping as FAIL or ERROR

Latest checker: 25 PASS, 2 FAIL, 0 ERROR. The checker checks report structure, not actual application behavior. Runtime tests are separately recorded above.

| Check | Why it stays |
| --- | --- |
| L2 | Original prompt as actually sent is unavailable; the retained requirements summary is not a transcript. |
| L6 | Historical cleanup prompts and full Bolt replies are unavailable. No invented exchange was added. |

Additional submission limitations: Bolt's original component-list reply is missing despite L3's structural PASS. Prediction timing and historical per-prompt retests cannot be verified. `counts.cleanup_prompts` is 0 verified in this recovery session because the historical count is unknown; declaration check D12 therefore remains FAIL rather than inventing a positive count. The student's ability to explain the component without AI has not been assessed and is conservatively marked no. Existing v1 screenshot capture timing cannot be independently verified. Original export source files were not edited in this session.

### 9.2 The end of the day

AC1 allows end=1440 (24:00), but the final uses native time inputs and its parser rejects hours above 23. The 23:00–24:00 request is therefore not expressible. I retain this limitation for the small prototype and declare `not-expressible`; it is not full support of AC1's end-of-day boundary. A future focused fix would add a specific end-of-day option.

### 9.3 Which "now"?

v1 calls `getCurrentMinutes()` from the system clock when checking, and memoizes the header time at mount. It has no supplied-time input. The preserved final uses `CURRENT_TIME = 540`, a fixed fictional 09:00, consistently for display and validation. This supports the required demonstration but is not a live current-time service. T6 is now rejected with <=, so equal-to-now is unavailable.

---

## 10. Conclusion (120–180 words)

This lab showed me why a convincing interface is not enough to prove that an AI-generated application meets its requirements. The preserved first version used the computer clock and different sample bookings, so the prescribed test baseline could not be supplied through its interface. I recorded that limitation instead of treating coincidentally matching decisions as successful tests.

The final export provided a fixed demonstration time and consistent bookings. During retrospective testing, the starts-now case still returned Available. Changing the comparison to reject equality corrected that boundary, and all nine final cases were rerun. Repeating the same request also confirmed that checking availability did not create a booking.

The remaining weaknesses are evidence and input coverage. Exact historical Bolt prompts and replies were not preserved, and the time control cannot express 24:00. I have disclosed those gaps. In future, I would save each conversation and test result immediately, rather than reconstructing the development record from exported code afterward.
