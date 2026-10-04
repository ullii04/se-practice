# Week 04 — Lab report: Modeling the System with UML

> The single worksheet for this lab. Fill in every section. **Do not delete, rename or renumber
> the headings** — the checker and the grader find your work by them. Replace every `<...>`
> placeholder; a row that still contains `<...>` counts as empty.

---

## 1. Setup

| Field | Value |
| --- | --- |
| Name | Elshibai Ulzhalgas |
| Group | Monday 14:00-19:00 |
| AI assistant | ChatGPT |
| Exact model | GPT-5.6 Sol |
| Renderer | PlantUML web server |
| Behaviour diagram | sequence |
| Stories used | the reference set from README §3 |

---

## 2. Prompts as sent

Paste every prompt **exactly as you sent it**, in the order you sent it, one code block each. The
AI's first replies are saved as files in `models/original/` — do not paste them here.

### 2.1 Task 1 — use-case prompt

```text
Using the supplied scenario and approved stories, generate PlantUML for a use-case diagram. Include Student and Administrator outside a named system boundary. Model their goals, show justified associations, and list assumptions. Use include or extend only with a clear reason.
```

### 2.2 Task 2 — class prompt

```text
Create a UML domain class diagram in PlantUML for Smart Campus. Start with Student, Room, and Booking. Add attributes, appropriate operations, and association multiplicities. Add other classes only when requirements justify them. Explain each relationship and list assumptions. Avoid unjustified inheritance or composition.
```

### 2.3 Task 3 — behaviour prompt (3A sequence or 3B activity)

```text
Generate PlantUML for Book room. Use Student, BookingService, and BookingRepository lifelines. Validate the supplied rules, then attempt the reservation. Show a successful confirmation and an unavailable-room alternative using alt. Label messages and replies. Explain new design components and all assumptions.
```

### 2.4 Focused correction prompts (if you sent any)

```text
none
```

### 2.5 Critique prompt

```text
Compare my diagrams with the requirements. Identify missing rules, inconsistent names, and unjustified elements. Cite each issue and propose a specific correction.
```

---

## 3. Task 1 — use-case review

**Assumptions the AI listed:**

- Bookings whose time boundaries only touch do not overlap.
- Blocking a room prevents new bookings; the scenario does not specify what happens to existing bookings.
- Booking confirmation was modeled as an included system action because R4 requires confirmation after every successful booking.
- No payments, equipment, recurring bookings, waiting lists, registration, or notifications other than booking confirmation are modeled.

At least **two** findings. A finding names the element, the problem and the rule or story that
proves it is a problem.

| # | Element | Problem | Rule or story | Fix |
| --- | --- | --- | --- | --- |
| 1 | Send Booking Confirmation | The AI modeled confirmation as a separate use case, although it is a required system action after a successful booking rather than a separate actor goal. | R4 / US-01 | Removed the separate Send Booking Confirmation use case and represented R4 as a note on Book Room. |
| 2 | Block Room | The scenario does not specify what happens to existing bookings when a room is blocked. | R3 / US-04 | Declared the assumption explicitly: existing bookings remain unchanged when a room is blocked. |

---

## 4. Task 2 — class diagram review

### 4.1 Relationships, read both ways

One row per association in your **revised** class diagram.

| Association | Read left → right | Read right → left | Multiplicities |
| --- | --- | --- | --- |
| Student — Booking | One Student makes 0..* Bookings. | Each Booking belongs to exactly 1 Student. | 1 / 0..* |
| Room — Booking | One Room has 0..* Bookings. | Each Booking is for exactly 1 Room. | 1 / 0..* |

### 4.2 Constraints the multiplicities cannot show

- R2: A note on Booking states that active bookings for the same Room must not overlap.
- R1: A note on Booking states that startTime must be in the future and duration must be greater than 0 and at most 2 hours.
- R3: A note on Room states that a blocked Room cannot accept a new Booking.
- R4: A note on Booking states that a successful booking produces a confirmation.

### 4.3 Assumptions

- A1: Existing bookings remain unchanged when a Room is blocked.
- A2: Bookings whose time boundaries only touch do not overlap.
- A3: Booking.status distinguishes active and cancelled bookings so that R2 applies to active bookings.

### 4.4 Findings

| # | Element | Problem | Rule or story | Fix |
| --- | --- | --- | --- | --- |
| 1 | Administrator — Room `manages` association | The AI added a many-to-many structural relationship even though the requirements only say that administrators can block or unblock rooms; they do not assign rooms to particular administrators. | US-04 / scenario | Removed the unsupported Administrator — Room association while keeping Administrator and its required operations. |

## 5. Task 3 — behaviour diagram review

**Option chosen and why:** 3A sequence — I chose a sequence diagram because it clearly shows the order of validation, repository checks, booking creation, and the alternative failure path.

**Design components added beyond the domain model:** `BookingService` — coordinates validation and the booking process. `BookingRepository` — checks room availability and stores a successful booking. These are design components required by the sequence-diagram task and are not domain classes.

| # | Element | Problem | Rule or story | Fix |
| --- | --- | --- | --- | --- |
| 1 | Failure branch | The original sequence could allow a create/save operation to appear in an unavailable-room branch. | R2 / R3 / US-01 | Moved booking creation so that it occurs only in the successful branch after all validation and availability checks pass. |

---

## 6. AI critique

Run the critique prompt once, on all your revised diagrams together. At least **three** rows. A
critique is another claim to evaluate, not a verdict: reject what is wrong and say why.

| # | Issue the AI raised | Element it cited | Verdict | Why |
| --- | --- | --- | --- | --- |
| 1 | The AI claimed that the rule identifiers were wrong and that overlap should be R3 and blocked-room validation should be R4. | Class and Sequence diagrams | reject | The approved Week 04 reference set defines R1 as future start and valid duration, R2 as no overlap, R3 as blocked room cannot accept a new booking, and R4 as successful booking produces a confirmation. The revised diagrams already use these identifiers consistently. |
| 2 | The AI claimed that the use-case diagram should contain exactly six functions including Send Confirmation and should combine Block and Unblock Room. | Use-case diagram | reject | The approved Week 04 reference stories define six actor-goal stories: Book Room, View Room Availability, Cancel Own Booking, Block Room, Unblock Room, and Review Room Usage. Confirmation is required by R4 after successful booking rather than being a separate actor goal in the revised model. |
| 3 | BookingService and BookingRepository are technical components not present in the domain model. | Sequence diagram | reject | Task 3A explicitly requires the Student, BookingService, and BookingRepository lifelines. They are therefore justified design components for the sequence diagram and are documented in the behaviour review. |
| 4 | studentId appears in createBooking even though it was not supplied in the initial bookRoom message. | Sequence diagram | accept | The sequence should make the source of studentId explicit. It can be treated as the authenticated Student identity, or the initial request can explicitly provide it. |

---

## 7. Consistency table

One row for each of **R1–R4**, then one row for **every use case in your revised use-case
diagram**, spelled exactly as in the diagram, with the story ID it traces to.

| Requirement / story | Use case | Classes | Behaviour element |
| --- | --- | --- | --- |
| R1 | Book Room | Booking.startTime, Booking.endTime | `validateFutureStart()` and `validateDuration()`; invalid request returns `bookingRejected(R1)` |
| R2 | Book Room | Room, Booking; R2 note on Booking | `hasOverlappingActiveBooking()`; overlap returns `bookingRejected(R2)` |
| R3 | Book Room | Room.blocked, Booking | `isRoomBlocked()`; blocked room returns `bookingRejected(R3)` |
| R4 | Book Room | Booking | `bookingConfirmation` after successful `createBooking()` |
| US-01 | Book Room | Student, Room, Booking | `bookRoom()` and successful booking flow |
| US-02 | View Room Availability | Student, Room | Not shown in Book Room sequence |
| US-03 | Cancel Own Booking | Student, Booking | Not shown in Book Room sequence |
| US-04 | Block Room | Administrator, Room | Not shown in Book Room sequence |
| US-05 | Unblock Room | Administrator, Room | Not shown in Book Room sequence |
| US-06 | Review Room Usage | Administrator, Room | Not shown in Book Room sequence |

---

## 8. Change log

At least **three** rows, and at least one for each required diagram (use case, class, your
behaviour diagram). "Before" is what the AI produced; "After" is what you submitted.

| # | Diagram | Before (AI's original) | After (your revision) | Reason |
| --- | --- | --- | --- | --- |
| 1 | Use case | `Send Booking Confirmation` was modeled as a separate use case with an include relationship from `Book Room`. | Removed the separate confirmation use case and represented successful confirmation as R4 on `Book Room`. | Confirmation is required after a successful booking by R4, but it is not a separate actor goal in the approved reference stories. |
| 2 | Class | The AI added an `Administrator — Room` many-to-many `manages` association. | Removed the unsupported association while keeping Administrator and its block/unblock operations. | The approved stories require administrators to block and unblock rooms but do not define a persistent structural relationship assigning rooms to administrators. |
| 3 | Sequence | The original `alt` combined all failures under `room unavailable or request invalid`. | Added explicit alternatives for invalid time/duration, blocked room, and overlapping active booking. | R1, R2 and R3 must be visible and distinguishable, and no booking may be created on a failure path. |
| 4 | Sequence | `studentId` appeared in `createBooking()` without being supplied in the initial request. | Changed the initial message to `bookRoom(studentId, roomId, startTime, endTime)`. | Makes the source of `studentId` explicit and keeps message parameters consistent. |

---

## 9. Checker output

```text
Week 04 structural check - shape only, never quality

UC1  PASS  Student and Administrator declared
UC2  PASS  named system boundary: "Smart Campus Study Room Booking System"
UC3  PASS  all actors declared outside the boundary
UC4  PASS  all scenario goals present (6 use cases)
UC5  PASS  no actor is associated with a confirmation use case
UC6  PASS  actor responsibilities match the scenario
UC7  PASS  use cases are goals, not screens or components
UC8  PASS  every include / extend / generalization carries a ' why: comment (or there are none)
UC9  PASS  revised diagram differs from the AI's original
CL1  PASS  Student, Room and Booking present
CL2  PASS  Booking is associated with Student and with Room
CL3  PASS  every association has multiplicities at both ends
CL4  PASS  1 student / 1 room per booking, 0..* bookings per student and per room
CL5  PASS  every inheritance / composition / aggregation carries a ' why: comment (or there are none)
CL6  PASS  only domain concepts in the class diagram
CL7  PASS  attributes needed by R1-R3 are present
CL8  PASS  a note states R2 (no overlapping active bookings)
SQ1  PASS  Student, BookingService and BookingRepository lifelines present
SQ2  PASS  alt block with a guard on every branch (2 branches)
SQ3  PASS  validation happens before creation
SQ4  PASS  nothing is saved on a failure branch
SQ5  PASS  every message is labelled
SQ6  PASS  R1 (time range) is visible - checked or stated as a precondition
SQ7  PASS  R3 (blocked room) is visible
FI1  PASS  the AI's original output is kept for every diagram
FI2  PASS  a rendered image for every diagram
LR1  PASS  §1 setup filled (tool and model recorded)
LR2  PASS  4 prompts pasted in §2
LR3  PASS  2 use-case findings in §3
LR4  PASS  §4 relationships read both ways, 3 assumption(s) declared
LR5  PASS  1 behaviour-diagram findings in §5
LR6  PASS  4 critique issues with a verdict
LR7  PASS  4 change-log rows covering all three diagrams
CS1  PASS  6 approved stories
CS2  PASS  §7 traces R1-R4 into the diagrams
CS3  PASS  every use case traces to an approved story
CS4  PASS  every lifeline is a domain class or an explained design component

SUMMARY pass=37 fail=0 error=0
A FAIL you report and explain in lab-report.md §9 costs you nothing. One you hide costs the criterion.
```

**FAILs I am keeping, and why:** none

---

## 10. Conclusion (120–180 words)

The AI got the use-case diagram most wrong. It introduced Send Booking Confirmation as a separate use case and connected it to Book Room with an include relationship. In the approved Week 04 stories, confirmation is R4 behaviour after a successful booking, not a separate actor goal, so I removed that use case and kept R4 as part of Book Room. The class diagram also contained an unsupported many-to-many Administrator–Room manages association, which I removed because no approved story defines this persistent relationship. In the sequence diagram, I separated the validation failures for invalid time or duration, a blocked room, and an overlapping active booking so that R1, R2, and R3 are clearly visible. The AI critique also identified that studentId was used in createBooking without being supplied in the initial request, so I corrected the first message. This exercise showed that AI-generated UML still needs careful review against requirements and business rules.