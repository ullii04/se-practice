# Week 08 — Lab report

**Name:** Elshibai Ulzhalgas
**Group:** Monday 16:00-19:00
**Date:** 2026-11-08

Fill in every section. **Do not delete, rename or renumber the headings.** The checker and the
grader find your answers by them. You can add rows to any table, but never remove its header.

---

## 1. Setup

| | |
| --- | --- |
| Assistant I debugged with (tool) | Codex desktop |
| Exact model (with its version, or `not displayed`) | not displayed |
| Where the skill was installed (ChatGPT / Claude web / Claude Code / prompt-only simulation) | prompt-only simulation planned; not installed |
| Where I ran the tests (Bolt terminal / my computer / Codespace) | my computer: Codex terminal, macOS, Node 24.13.1 |
| Vitest version (the `RUN  v…` line of a run) | 3.2.4 |
| Language of my booking module (`ts` or `js`) — the file I copied from `buggy/` | ts |

---

## 2. Task 1 — baseline, buggy code, failing tests

### 2.1 My Week 07 suite on my own code

The **real** output of your Week 07 suite, run in `week-08/app/` **before** you replace
anything. It should be green. If it is not, say why under the block.

```text

 RUN  v3.2.4 /Users/elshibaiulzhalgas/Documents/Codex/2026-11-07/referenced-chatgpt-conversation-this-is-an/work/repo/week-08/app

 ✓ src/booking.test.ts (19 tests) 2ms

 Test Files  1 passed (1)
      Tests  19 passed (19)
   Start at  10:23:45
   Duration  273ms (transform 17ms, setup 0ms, collect 15ms, tests 2ms, environment 0ms, prepare 30ms)

npm notice
npm notice New minor version of npm available! 11.8.0 -> 11.21.2
npm notice Changelog: https://github.com/npm/cli/releases/tag/v11.21.2
npm notice To update run: npm install -g npm@11.21.2
npm notice
```

### 2.2 The same suite on the provided canBook

You copied the whole `canBook` function from `buggy/booking.ts` (or `.js`) over yours and changed
nothing else. This is the real output:

```text

 RUN  v3.2.4 /Users/elshibaiulzhalgas/Documents/Codex/2026-11-07/referenced-chatgpt-conversation-this-is-an/work/repo/week-08/app

 ❯ src/booking.test.ts (19 tests | 6 failed) 6ms
   × canBook > T01: accepts a request touching the existing booking end 3ms
     → expected false to be true // Object.is equality
   ✓ canBook > T02: rejects a start equal to now 0ms
   ✓ canBook > T03: rejects equal start and end 0ms
   ✓ canBook > T04: rejects an end earlier than the start 0ms
   ✓ canBook > T05: rejects an end beyond minute 1440 0ms
   × canBook > T06: accepts a duration of exactly 120 minutes 1ms
     → expected [ { start: 600, end: 660 }, …(1) ] to strictly equal [ { start: 600, end: 660 } ]
   ✓ canBook > T07: rejects a duration of 121 minutes 0ms
   × canBook > T08: accepts a request touching the existing booking start 0ms
     → expected false to be true // Object.is equality
   ✓ canBook > T09: rejects a partial overlap 0ms
   ✓ canBook > T10: rejects a request containing the existing booking 0ms
   ✓ canBook > T11: rejects a request contained in the existing booking 0ms
   ✓ canBook > T12: rejects an identical booking interval 0ms
   ✓ canBook > T13: rejects an otherwise valid request when the room is blocked 0ms
   × canBook > T14: accepts a request when the bookings list is empty 0ms
     → expected [ { start: 630, end: 690 } ] to strictly equal []
   × canBook > AC5: returns true without saving or changing booking data 0ms
     → expected false to be true // Object.is equality
   × canBook > X1: accepts minute 1440 as the end boundary 0ms
     → expected [ { start: 600, end: 660 }, …(1) ] to strictly equal [ { start: 600, end: 660 } ]
   ✓ canBook > X2: rejects an overlap with the second booking in the list 0ms
   ✓ canBook > N1: rejects a negative start independently of the future rule 0ms
   ✓ canBook > N2: rejects a start before now without booking conflicts 0ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 6 ⎯⎯⎯⎯⎯⎯⎯

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

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/6]⎯

 FAIL  src/booking.test.ts > canBook > T06: accepts a duration of exactly 120 minutes
AssertionError: expected [ { start: 600, end: 660 }, …(1) ] to strictly equal [ { start: 600, end: 660 } ]

- Expected
+ Received

  [
    {
      "end": 660,
      "start": 600,
    },
+   {
+     "end": 840,
+     "start": 720,
+   },
  ]

 ❯ expectUnchangedDecision src/booking.test.ts:23:28
     21|   const result = canBook(request);
     22| 
     23|   expect(request.bookings).toStrictEqual(before);
       |                            ^
     24|   return result;
     25| }
 ❯ src/booking.test.ts:49:12

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/6]⎯

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

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/6]⎯

 FAIL  src/booking.test.ts > canBook > T14: accepts a request when the bookings list is empty
AssertionError: expected [ { start: 630, end: 690 } ] to strictly equal []

- Expected
+ Received

- []
+ [
+   {
+     "end": 690,
+     "start": 630,
+   },
+ ]

 ❯ expectUnchangedDecision src/booking.test.ts:23:28
     21|   const result = canBook(request);
     22| 
     23|   expect(request.bookings).toStrictEqual(before);
       |                            ^
     24|   return result;
     25| }
 ❯ src/booking.test.ts:81:12

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/6]⎯

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

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/6]⎯

 FAIL  src/booking.test.ts > canBook > X1: accepts minute 1440 as the end boundary
AssertionError: expected [ { start: 600, end: 660 }, …(1) ] to strictly equal [ { start: 600, end: 660 } ]

- Expected
+ Received

  [
    {
      "end": 660,
      "start": 600,
    },
+   {
+     "end": 1440,
+     "start": 1380,
+   },
  ]

 ❯ expectUnchangedDecision src/booking.test.ts:23:28
     21|   const result = canBook(request);
     22| 
     23|   expect(request.bookings).toStrictEqual(before);
       |                            ^
     24|   return result;
     25| }
 ❯ src/booking.test.ts:93:12

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[6/6]⎯


 Test Files  1 failed (1)
      Tests  6 failed | 13 passed (19)
   Start at  10:24:35
   Duration  186ms (transform 19ms, setup 0ms, collect 15ms, tests 6ms, environment 0ms, prepare 36ms)
```

### 2.3 One failing test per bug

Add the two regression tests from README Part 1, step 5: one named `BUG-A` and one named `BUG-B`.
Run them **on the buggy code**. Both must fail here. That is the evidence that each test can see
its bug.

```text
(paste here)
```

---

## 3. Defect log

One row per defect. At least **BUG-A and BUG-B**. "Suspected cause" is your hypothesis
**before** you ask any assistant: the line and why.

| Defect | Test ID | Input | Expected | Actual | Suspected cause (line and why) |
| --- | --- | --- | --- | --- | --- |
| BUG-A | T01 / T08 / AC5 | start=660, end=720, now=540, blocked=false, bookings=[600-660] | true | false | app/src/booking.ts:23 uses <= and >=, so equality is rejected; hypothesis recorded by Codex before independent diagnosis, not student-authored. |
| BUG-B | T06 / T14 / X1 | 720-840, now=540, blocked=false, bookings=[600-660] | true and unchanged array | array gains 720-840 | app/src/booking.ts:26 pushes a free interval into the caller array; T06 reaches this line without touching. Hypothesis recorded by Codex. |

---

## 4. Tasks 2–3 — the skill

**The checks from the deck, before you zip it.** Answer each one yes / no:

| Check | yes / no |
| --- | --- |
| The file is plain UTF-8 text, named exactly `SKILL.md` (not `SKILL.md.txt`) | yes / no |
| The first and the closing YAML delimiter are exactly three hyphens: `---` | yes / no |
| `name` is lowercase with hyphens, and `description` says WHEN to use it | yes / no |
| I read the whole file once: no passwords, API keys or private student data | yes / no |

**The contents of `skills/bug-detector.zip`.** Paste the listing (Windows: open the ZIP and copy
the paths; macOS/Linux: `unzip -l skills/bug-detector.zip`):

```text
(paste here)
```

**Installation.** Where you uploaded it, what the upload said, and whether a new chat showed the
skill as enabled. If upload was not available, write `prompt-only simulation` and say why.
Screenshot of the result: `evidence/install.png`.

<!-- Write below this line -->

---

## 5. Task 4 — without the skill

A **fresh chat, with no skill enabled**. Paste exactly what you sent: the deck's question, then
the same input you will use in section 6 (AC1–AC6, the failing test output, the code of
`canBook`):

```text
(paste here)
```

**The assistant's answer, pasted unedited:**

```text
(paste here)
```

---

## 6. Task 5 — with the skill

**Another fresh chat, with `bug-detector` enabled.** Send exactly the same input as in section 5.
Only the question changes, to the deck's skill question:

```text
(paste here)
```

**The assistant's answer, pasted unedited:**

```text
(paste here)
```

Did the environment show that the skill was invoked? yes / no / not shown

---

## 7. Comparison — judged against the actual code

Do not assume the skill did better. Judge both answers against the code and against what your
tests showed. Write a short verdict in each cell, and give a reason where they differ.

| Criterion | No skill | With skill |
| --- | --- | --- |
| Correct root cause | | |
| Reproducible test | | |
| Minimal proposed patch | | |
| Unsupported claims | | |
| Clarity of explanation | | |

**Which bugs did each answer find?** (BUG-A, BUG-B, both, neither)

-

---

## 8. Task 6 — repair and regression

Review the proposed patch yourself, then make **one minimal change per bug**, one commit each.
Rerun the test that was failing, then the full suite.

### 8.1 The BUG-A patch

The change as a diff (`git diff`, or the old and the new line), then the real run:

```text
(paste here)
```

### 8.2 The BUG-B patch and the final run

The change as a diff, then the real output of the **full** suite. Every test must pass.

```text
(paste here)
```

---

## 9. What still fails, and what AI-assisted debugging cannot do

### 9.1 Checks I am keeping as FAIL or ERROR

Use the same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| | |

### 9.2 One limitation of AI-assisted debugging

<!-- Use something that actually happened in sections 5-8. 20 words or more. -->
-

---

## 10. Conclusion (80–150 words)

<!-- Answer both, in your own words, without the assistant (3-5 sentences, as the deck asks):
     (a) Did the skill help? Show it with one row of section 7.
     (b) What did your tests actually prove - and what did they not?
     Worthless: "The skill made the AI much better at debugging."
     Worth everything: "Both answers found BUG-A from the T01 failure. Only the skill answer
     separated BUG-B as a hypothesis instead of a fact, because step 4 told it to. BUG-B was only
     visible after the BUG-A patch: the AC5 test had been failing for the wrong reason." -->

<!-- Write your conclusion below this line -->
