# Lab report — Practice #03, Requirements Engineering with AI

Fill in every section. **Do not delete or renumber the headings** — the README points at them and a
missing heading reads as a missing section.

Name:Elshibai Ulzhalgas
Student ID:24B031019
GitHub username:ullii04

---

## 1. Setup

| | |
| --- | --- |
| AI assistant (tool) | |
| Exact model name and version | |
| Date of the session | |
| Diagram renderer used | |

One tool and one model for all three prompts. If you switched, say why here — it changes what your
findings mean.

---

## 2. Original AI output — user stories (Part 1)

Paste the **unedited** response to Prompt 1. Do not tidy it. If it is long, paste all of it anyway;
this is the baseline everything else is measured against.

Here is a clean version that stays strictly within the supplied scenario.

### Actor Goals

**Student goals:** view room availability, book an available room, cancel their own booking, and receive confirmation after booking or cancellation.

**Administrator goals:** block or unblock rooms when necessary and review room usage over a period.

### User Stories

| ID | User Story | Priority | Assumption |
|---|---|---|---|
| US-01 | **As a Student, I want to view room availability, so that I can find a free room and suitable time for study.** | High | Room availability information is current. |
| US-02 | **As a Student, I want to book a free room for a time slot, so that I can reserve a place for individual or group study.** | High | The booking starts in the future, lasts no more than two hours, does not overlap another booking, and the room is not blocked. |
| US-03 | **As a Student, I want to cancel a booking I made, so that the room becomes available when I no longer need it.** | High | A student can cancel only their own booking. |
| US-04 | **As a Student, I want to receive confirmation after I book a room, so that I know my reservation was successfully created.** | Medium | Confirmation is provided by the system as part of UC-06. |
| US-05 | **As a Student, I want to receive confirmation after I cancel a booking, so that I know my reservation was successfully cancelled.** | Medium | Confirmation is provided by the system as part of UC-06. |
| US-06 | **As an Administrator, I want to block a room, so that students cannot book it while it is unavailable for use.** | High | A blocked room cannot be booked, according to R4. |
| US-07 | **As an Administrator, I want to unblock a room, so that students can book it again when it is available for use.** | High | Unblocking makes the room available for future bookings, subject to existing reservations. |
| US-08 | **As an Administrator, I want to review room usage over a period, so that I can understand how the study rooms are being used.** | Medium | Usage information is based on booking records for the selected period. |

This gives you **exactly 8 user stories**, uses only the **two specified actors**, and covers all **six supplied system functions** without adding authentication, payments, QR codes, notifications, or other out-of-scope features.

---

## 3. Story review (Part 2)

| Story (as generated) | What I did | Why | Final ID |
| --- | --- | --- | --- |
| US-01 | Kept unchanged | It uses the Student actor and directly matches UC-01 View availability. It stays within the scenario. | US-01 |
| US-02 | Kept the story, revised the assumption | The story directly matches UC-02 Book room, but the generated assumption combined all four business rules. I simplified the assumption to keep it focused. | US-02 |
| US-03 | Kept unchanged | It directly matches UC-03 Cancel booking and correctly states that the student cancels a booking they made. | US-03 |
| US-04 | Merged with US-05 | Both stories describe confirmation behavior from the same use case, UC-06. Keeping them separate was repetitive. | US-04 |
| US-05 | Merged into US-04 | Booking and cancellation confirmations are both part of UC-06 Send confirmation, so one story can cover both outcomes. | US-04 |
| US-06 | Merged with US-07 | Blocking and unblocking are two parts of the same use case, UC-04 Block or unblock room. | US-05 |
| US-07 | Merged into US-06 | It was closely related to US-06 and both belong to UC-04, so I combined them into one Administrator story. | US-05 |
| US-08 | Kept and renumbered | It directly matches UC-05 Review usage and stays within the Administrator's responsibilities. | US-06 |

**Did the assistant invent anything outside the scenario?** No. I checked all eight generated stories against the explicit out-of-scope list. None of them introduced payments, fines, check-in or QR codes, maintenance requests, extra notifications, authentication, waiting lists, screens, databases, or servers.

**How many stories did you end with, and why that number?** I ended with 6 stories. The original output had 8, but US-04 and US-05 were merged because both represent UC-06 Send confirmation, and US-06 and US-07 were merged because both represent UC-04 Block or unblock room. Six stories are enough to represent the six fixed use cases without unnecessary duplication.


## 4. Original AI output — acceptance criteria (Part 3)

Selected stories:
US-02
As a Student, I want to book a free room for a time slot, so that I can reserve a place for individual or group study.
US-03
As a Student, I want to cancel a booking I made, so that the room becomes available when I no longer need it.
US-05
As an Administrator, I want to block or unblock a room, so that I can control whether the room is available for booking.


Yes — these three selected stories are clear and consistent with your Smart Campus — Study Room Booking system.
ID	Actor	User Story
US-02	Student	As a Student, I want to book a free room for a time slot, so that I can reserve a place for individual or group study.
US-03	Student	As a Student, I want to cancel a booking I made, so that the room becomes available when I no longer need it.
US-05	Administrator	As an Administrator, I want to block or unblock a room, so that I can control whether the room is available for booking.


These are also good choices because they cover the main system actions: create a booking → cancel a booking → administratively control room availability.
If your next assignment step is to write acceptance criteria / scenarios for these 3 stories, send me the requirement and I can continue directly from US-02, US-03, and US-05.

For each selected story, write 3 to 5 acceptance criteria in Given, When, Then form. Include successful behavior, validation, and an error or alternative case. Apply these rules: bookings must be in the future, maximum duration is two hours, rooms cannot overlap, and blocked rooms cannot be booked. List assumptions before the criteria.



下面这版可以直接放进作业里。我控制在比较自然的学生写作水平，同时确保包含 successful behavior、validation、error/alternative case，并应用 R1–R4。
Assumptions
- The student is logged into the system.
- The administrator is logged in and has permission to block or unblock rooms.
- Room availability and booking information are up to date.
- The system knows the current date and time.
- A booking can only be made for an available and unblocked room.
- A student can cancel only a booking they made.

US-02 — Book Room
User Story:
As a Student, I want to book a free room for a time slot, so that I can reserve a place for individual or group study.
AC-01 — Successful booking
Given the room is available and not blocked, and the selected time is in the future
When the student books the room for a time slot of two hours or less
Then the booking is created successfully and the selected time slot becomes unavailable.
AC-02 — Booking must be in the future
Given the student selects a time slot that starts in the past or at the current time
When the student tries to book the room
Then the system rejects the booking and shows an error message.
AC-03 — Maximum booking duration
Given the student selects an available room
When the student tries to book it for more than two hours
Then the system rejects the booking and informs the student that the maximum duration is two hours.
AC-04 — Overlapping booking
Given the room already has a booking during the selected time
When the student tries to book an overlapping time slot
Then the system rejects the booking and informs the student that the room is not available.
AC-05 — Blocked room
Given the room is blocked by an administrator
When the student tries to book the room
Then the system rejects the booking and informs the student that the room is unavailable.

US-03 — Cancel Booking
User Story:
As a Student, I want to cancel a booking I made, so that the room becomes available when I no longer need it.
AC-01 — Successful cancellation
Given the student has an existing booking that they made
When the student cancels the booking
Then the booking is removed and the time slot becomes available again.
AC-02 — Cannot cancel another student's booking
Given a booking was made by another student
When the student tries to cancel that booking
Then the system rejects the request and does not change the booking.
AC-03 — Booking does not exist
Given the booking has already been cancelled or does not exist
When the student tries to cancel it
Then the system shows an error message and makes no changes.
AC-04 — Room is blocked after cancellation
Given the student has a valid booking and the administrator has blocked the room
When the student cancels the booking
Then the booking is removed, but the room remains unavailable for new bookings while it is blocked.

US-05 — Block or Unblock Room
User Story:
As an Administrator, I want to block or unblock a room, so that I can control whether the room is available for booking.
AC-01 — Successfully block a room
Given the administrator selects an unblocked room
When the administrator blocks the room
Then the room status changes to blocked and students cannot create new bookings for it.
AC-02 — Booking a blocked room
Given a room is blocked
When a student tries to book the room
Then the system rejects the booking and informs the student that the room is unavailable.
AC-03 — Successfully unblock a room
Given the room is currently blocked
When the administrator unblocks the room
Then the room becomes available for booking again, subject to existing bookings.
AC-04 — Existing bookings after unblocking
Given the room has an existing booking for a future time slot
When the administrator unblocks the room
Then the existing booking remains and students cannot create another booking that overlaps with it.
AC-05 — Unauthorized user
Given a student does not have administrator permissions
When the student tries to block or unblock a room
Then the system rejects the request and the room status remains unchanged.

这里最重要的是 US-02 已经完整覆盖老师给的四条 business rules：future、≤2 hours、no overlap、blocked room cannot be booked。US-03 和 US-05 则重点测试各自功能，同时和这些规则保持一致。

ChatGPT 可能会出错。请核查重要信息。

---

## 5. Criteria review (Part 3)

| Criterion (as generated) | Problem | What I changed it to | Final ID |
| --- | --- | --- | --- |
| US-02 AC-01 | It did not clearly test whether exactly two hours is allowed. | I clarified that a booking of exactly two hours is allowed. | AC-01 |
| US-02 AC-02 | It included an error message, which is not required by the scenario. | I kept only the rule that a booking starting in the past or at the current time is rejected. | AC-02 |
| US-02 AC-03 | It tested more than two hours but did not test the exact two-hour boundary. | I added the exact two-hour boundary as an allowed case. | AC-03 |
| US-02 AC-04 | It did not test whether touching bookings count as overlapping. | I clarified that a booking may start exactly when another booking ends. | AC-04 |
| US-05 AC-05 | It introduced administrator permissions, while authentication and permissions are outside the supplied scenario. | I removed this criterion. | Removed |

**The two open questions.** Write your decision and the reason. Either answer is accepted.
| Question | My decision | Why |
| --- | --- | --- |
| A booking ending exactly when another begins — overlap under R3? | allowed | The bookings touch at the boundary but their time periods do not overlap. |
| Is exactly two hours allowed under R2? | allowed | R2 says the maximum duration is two hours, so exactly two hours is allowed. |

**Which invalid or boundary case did the assistant leave out?**

The assistant left out two explicit boundary cases: a booking lasting exactly two hours and a booking starting exactly when another booking ends.

## 6. Original AI output — use-case diagram (Part 4)

@startuml
left to right direction

actor Student
actor Administrator

rectangle "Smart Campus — Study Room Booking" {
    usecase "View availability" as UC01
    usecase "Book room" as UC02
    usecase "Cancel booking" as UC03
    usecase "Block or unblock room" as UC04
    usecase "Review usage" as UC05
    usecase "Send confirmation" as UC06
}

Student --> UC01
Student --> UC02
Student --> UC03

Administrator --> UC04
Administrator --> UC05

UC02 ..> UC06 : <<include>>
UC03 ..> UC06 : <<include>>

@enduml

Rendered diagram (image, or a link):

---

## 7. Diagram review (Part 4)

| Element | Problem | What I changed |
| --- | --- | --- |
| UC-01 View availability | No problem. Student is the actor that triggers this use case. | Kept unchanged. |
| UC-02 Book room | No problem. Student triggers the booking. | Kept unchanged. |
| UC-03 Cancel booking | No problem. Student triggers cancellation of their booking. | Kept unchanged. |
| UC-04 Block or unblock room | No problem. Administrator is responsible for controlling room availability. | Kept unchanged. |
| UC-05 Review usage | No problem. Administrator is the actor that reviews room usage. | Kept unchanged. |
| UC-06 Send confirmation | No actor should directly trigger this use case. The generated diagram correctly models it as included by booking and cancellation. | Kept unchanged. |

**Associations.** None. The assistant did not draw any unjustified actor–use-case associations. Student is connected only to UC-01, UC-02 and UC-03, while Administrator is connected only to UC-04 and UC-05. UC-06 is triggered through UC-02 and UC-03 rather than directly by an actor.

**Did any screen, database or internal component appear as a use case or an actor?** No. The diagram contains only the two specified actors and the six specified use cases.

## 8. Traceability (Part 5)

Summarise what the table in `requirements/traceability.md` shows:

- Use cases with **no story** behind them:
- Stories with **no use case** they belong to:
- Criteria that test **no rule** from section 1:

**What does the largest gap tell you about the generated requirements?**

---

## 9. Checker runs

Paste the **real terminal output** of both runs. A table with nothing behind it does not count.

```
$ python tests/check_requirements.py
(paste)
```

```
$ python tests/validate_submission.py
(paste)
```

| | PASS | FAIL | ERROR |
| --- | --- | --- | --- |
| `check_requirements.py` | | | |

Commit these numbers were produced at (`git rev-parse --short HEAD`):

**Every FAIL, one line each: what it is and what you decided to do about it.** A FAIL you report and
explain costs you nothing.

**Did you run the checks by hand instead of with Python?** Say so here — it costs nothing, but it
has to be said.

---

## 10. Conclusion (150–200 words)

Answer all three:

1. Which part of the generated requirements was most wrong, and how would you have caught it without
   a checker?
2. What did the assistant get right that would have taken you noticeably longer by hand?
3. You are handing these requirements to someone who will implement them, and you will not be in the
   room. Which single one would you rewrite first, and why?

Be specific. "The AI was useful" is worth nothing; "UC-06 had no story behind it until I wrote
US-07, and the checker is what told me" is worth everything.
