# Week 09 — Lab Report: canBook as a Tool

**Name:** Elshibai Ulzhalgas
**Student ID:** 24B031019
**GitHub:** ullii04

This report and definition were drafted by Codex at the student's request. The student must review and understand them before submission; no claim of independent student authorship is made.

## 1. Setup

| Item | Value |
| --- | --- |
| Assistant (frozen for Part 2) | Codex, three independent context-isolated agent chats |
| Exact model | not displayed |
| Three fresh chats for R1, R2, R3? | yes; fork_turns=none, one request per chat |
| Python version | Python 3.9.6 |

Branch week-09 was created from main (9f77545). The ZIP and both PDF pages were read. SETUP.md, including week-01/SETUP.md, is absent from the archive and all fetched repository branches. The five PR sections therefore use a disclosed provisional structure. No JavaScript was authored or run for this lab. Model calls are textual JSON proposals, not execution of a room service. The exact underlying model identifier is not exposed in this session, so it is recorded as not displayed.

## 2. Your tool definition — a reason for every constraint

```json
{
  "name": "check_room",
  "description": "Check whether a room is available for a requested interval without changing state. All times are whole minutes since midnight, in the inclusive range 0 to 1440. This tool does not save or create a booking. Supply the current time, blocked status, and all existing bookings; ask for missing information rather than guessing.",
  "inputSchema": {
    "type": "object",
    "properties": {
      "start": {
        "type": "integer",
        "minimum": 0,
        "maximum": 1440,
        "description": "Requested start in whole minutes since midnight."
      },
      "end": {
        "type": "integer",
        "minimum": 0,
        "maximum": 1440,
        "description": "Requested end in whole minutes since midnight."
      },
      "now": {
        "type": "integer",
        "minimum": 0,
        "maximum": 1440,
        "description": "Current time in whole minutes since midnight."
      },
      "blocked": {
        "type": "boolean",
        "description": "Whether the room is blocked."
      },
      "bookings": {
        "type": "array",
        "description": "All existing bookings; an empty list is allowed.",
        "items": {
          "type": "object",
          "properties": {
            "start": {
              "type": "integer",
              "minimum": 0,
              "maximum": 1440,
              "description": "Existing booking start in whole minutes since midnight."
            },
            "end": {
              "type": "integer",
              "minimum": 0,
              "maximum": 1440,
              "description": "Existing booking end in whole minutes since midnight."
            }
          },
          "required": [
            "start",
            "end"
          ],
          "additionalProperties": false
        }
      }
    },
    "required": [
      "start",
      "end",
      "now",
      "blocked",
      "bookings"
    ],
    "additionalProperties": false
  }
}
```

| Field | Constraint | What goes wrong without it |
| --- | --- | --- |
| root | type object | A scalar or list could be accepted as arguments. |
| root | exactly five properties and required start,end,now,blocked,bookings | Missing context could be silently guessed; names could drift. |
| root | additionalProperties false | Invented fields such as room would be silently accepted. |
| start,end,now | type integer | Clock strings, booleans, or fractional minutes are not whole-minute times. |
| start,end,now | minimum 0 | Negative values fall outside the day. |
| start,end,now | maximum 1440 inclusive | Values after 24:00 fall outside the interface; 1440 must remain valid. |
| blocked | type boolean | The string false can be mistaken for a truthy flag. |
| bookings | type array, no minItems | Bookings must be a list, and no existing bookings must be representable. |
| bookings items | type object | A positional pair cannot safely express named start and end fields. |
| bookings items | properties start,end and required both | Incomplete intervals cannot be compared for overlap. |
| bookings items | additionalProperties false | Extra nested metadata could be ignored or misinterpreted. |
| bookings start,end | type integer; minimum 0; maximum 1440 | Existing intervals need the same whole-minute units and day bounds. |
| description | minutes since midnight; 0 to 1440; no saving; missing information instruction | The model needs units, read-only scope, and instructions against guessing. |

Only the allowed schema keywords are used. No duration or blocked=false restriction is added: valid-shaped unavailable requests still reach canBook.

## 3. The twelve calls — first run and final run

The first run was on the untouched ZIP in work/week-09, before any fix: **6 PASS, 17 FAIL, 7 ERROR** overall. S01, S02, S11 passed and nine S cases failed. The S results were recorded in evidence/first-run-s.json before editing the schema. The original console output remains in the Codex chat; the evidence JSON is a transcription of verdicts, not a fabricated raw terminal log. The starter remains recoverable at checkpoint 52426ca.

| Case | First run | Final run | What you changed |
| --- | --- | --- | --- |
| S01 | PASS | PASS | None; valid object still accepted. |
| S02 | PASS | PASS | None; empty bookings still accepted. |
| S03 | FAIL | PASS | Integer type for end rejects clock strings. |
| S04 | FAIL | PASS | All five fields are required. |
| S05 | FAIL | PASS | additionalProperties false rejects room. |
| S06 | FAIL | PASS | minimum 0 rejects negative start. |
| S07 | FAIL | PASS | maximum 1440 rejects end 1500. |
| S08 | FAIL | PASS | Nested required includes end. |
| S09 | FAIL | PASS | Boolean type rejects string false. |
| S10 | FAIL | PASS | Integer type rejects fractional minutes. |
| S11 | PASS | PASS | None; inclusive maximum permits 1440. |
| S12 | FAIL | PASS | Nested object type rejects pairs. |

## 4. Function calling — what the model wrote

Each request used a separate agent chat with no inherited conversation. The README prompt was sent with the complete tool definition (JSON whitespace compacted only), and exactly one unchanged request. The following are the full final replies, saved without edits or a trailing newline in calls/. No retries were requested. Orchestration metadata is not part of the reply.

### R1

```text
{"name":"check_room","arguments":{"start":600,"end":660,"now":540,"blocked":false,"bookings":[{"start":660,"end":720}]}}
```

Matches: 9:00=540, 10:00=600, 11:00=660, 12:00=720, blocked=false. F3 compares those values. The booking starts at the requested end, so AC4 permits touching; canBook should say Available.

### R2

```text
{"name":"check_room","arguments":{"start":840,"end":990,"now":810,"blocked":true,"bookings":[]}}
```

Matches: 13:30=810, 14:00=840, 16:30=990, blocked=true, bookings=[]. F6 compares those values. The model correctly called despite maintenance. A 150-minute duration violates AC2 and blocked=true violates AC3, so canBook should say Unavailable. The request and model agree.

### R3

```text
What exact start and end times do you want tomorrow, what is the current time, is the room blocked, and what are all its existing bookings for tomorrow?
```

The model asked instead of guessing. Exact start/end, current time, blocked state, and existing bookings were missing. “Afternoon” has no fixed boundary and “couple” is not enough to select a start. Tomorrow also requires date context outside this same-day interface: the client must establish the intended day and an appropriate current-time policy before calling. No values were invented. The question gathers the required arguments, although the date/now limitation still needs client handling.

## 5. What the schema cannot check

AC1: the schema enforces integer types and individual bounds 0–1440, but cannot compare start < end or start > now with the permitted keywords. It also cannot establish whether user-supplied now is truthful.

AC2: end - start <= 120 requires arithmetic between fields, which these keywords cannot express.

AC3: a boolean validates the blocked flag's shape, but canBook must return Unavailable when it is true. Rejecting true in the schema would prevent valid queries about blocked rooms.

AC4: overlap requires comparing the requested interval with every booking; touching endpoints must remain allowed. Array/object validation alone cannot decide that.

AC5: an input schema cannot guarantee absence of writes; implementation and client permissions must ensure checking does not save anything.

AC6: page feedback is a UI behavior, outside input validation. No actual canBook implementation was run this week; the outcomes above are reasoned from the supplied ACs.

## 6. Permissions — allow, ask or block

| # | Action | Decision (allow / ask / block) | Reason (the risk, in one sentence or more) |
| --- | --- | --- | --- |
| A1 | call check_room with supplied times | allow | A complete validated read-only query is within the user's request; missing arguments require clarification. |
| A2 | read week-08/app/src/booking.ts | allow | Reading relevant source helps understand behavior without modifying it or exporting secrets. |
| A3 | raise the 120-minute limit to 180 | ask | A booking request does not authorize changing AC2 for every future user; obtain explicit policy-change approval. |
| A4 | run npm test in week-08/app | allow | Run the known local test script after inspecting package.json; unfamiliar install hooks or external side effects require separate review. |
| A5 | git reset --hard | ask | It can erase unrelated tracked work as well as the agent's edits; show the diff and checkpoint first. |
| A6 | commit on week-09 | allow | A reviewed scoped local commit preserves recoverable history on the authorized lab branch; exclude unrelated files and secrets. |
| A7 | git push to main | block | Publishing directly to main bypasses the required open PR review and risks changing the shared baseline. |
| A8 | send .env to an online MCP server | block | This exports credentials to an untrusted destination; configuration does not justify disclosing secrets. |

These are proposed permissions for the hypothetical agent. This task separately authorizes publishing the week-09 branch and opening its PR.

## 7. Checkpoint

Real checkpoint: **52426ca**, `Week 09: preserve original starter as agent checkpoint`, the published counterpart of local checkpoint 80205cf, which was created before the schema and report edits on week-09. GitHub publication recreated the commit metadata because terminal push credentials were unavailable; the starter tree is identical. Inspect it with `git log --oneline`.

The exact return command, run from the repository root, is `git reset --hard 52426ca`. It moves the current branch back, resets the index, and discards tracked working-tree changes since that checkpoint. Later commits cease to be on the branch (recoverable via reflog for a time). It does not generally remove untracked files; untracked paths obstructing tracked files can be overwritten. Save work first and ask before running it. This command was documented, not executed.

## 8. Checker output

```text
PASS  D1    tool/check_room.json exists and is valid JSON
PASS  D2    has name, description and inputSchema
PASS  D3    name is exactly "check_room"
PASS  D4    description: 25+ words, says minutes, 1440, and that it does not save
PASS  D5    inputSchema: an object with exactly the five fields, all required
PASS  D6    inputSchema uses only the keywords listed in README section 5
PASS  S01   the R1 call, valid -> accept
PASS  S02   no existing bookings: bookings = [] -> accept
PASS  S03   end as a string: "11:00" -> refuse
PASS  S04   now missing -> refuse
PASS  S05   an extra field: "room": "204" -> refuse
PASS  S06   start below the day: -30 -> refuse
PASS  S07   end beyond the day: 1500 -> refuse
PASS  S08   a booking with no end: {start: 660} -> refuse
PASS  S09   blocked as a string: "false" -> refuse
PASS  S10   start not a whole minute: 600.5 -> refuse
PASS  S11   end at the end of the day: 1440 -> accept
PASS  S12   a booking as a pair: [660, 720] -> refuse
PASS  F1    calls/r1.json: a call to check_room
PASS  F2    calls/r1.json: arguments valid against your schema
PASS  F3    calls/r1.json: arguments equal the expected ones (README section 5, Part 2)
PASS  F4    calls/r2.json: a call to check_room
PASS  F5    calls/r2.json: arguments valid against your schema
PASS  F6    calls/r2.json: arguments equal the expected ones (README section 5, Part 2)
PASS  F7    calls/r3: exactly one of r3.json (it called) or r3.txt (it asked), not empty
PASS  L1    section 5 names at least two acceptance criteria (AC1-AC6) the schema cannot check
PASS  L2    section 6: A1-A8 each have allow / ask / block and a reason of 5+ words
PASS  L3    section 7 names the checkpoint commit (a SHA)
PASS  L4    section 10: a conclusion of 80-150 words
PASS  L5    AI_USAGE.md filled in (a tool row, and signed)

SUMMARY: 30 PASS · 0 FAIL · 0 ERROR  (of 30 checks)
Paste this whole output into lab-report.md section 8, and these three numbers into submission.yml.
```

## 9. What still fails

None of D1–D6, S01–S12, F1–F7, L1–L5 still fails: 30 PASS, 0 FAIL, 0 ERROR. The intermediate L5 formatting failure is disclosed in evidence/chat-provenance.md. Non-checker limitations remain: SETUP.md was not available, its exact five PR headings cannot be verified, and student review/signature is pending.

## 10. Conclusion (80–150 words)

The starter accepted nine malformed calls because its schema did not constrain the arguments. Adding integer types caught S03 and S10, while required fields and object structure caught missing or misshapen bookings. R2 showed why validation must stop at shape: 840 to 990 is a valid interval representation even though its duration and maintenance flag make the room unavailable. R3 demonstrated a separate model responsibility: asking for missing information instead of manufacturing a convenient afternoon. Permissions form another boundary. A1 can check availability without saving, but A3 changes the booking policy and needs approval, while A8 would expose credentials and must be blocked. A real checkpoint makes edits recoverable, but reset still needs care because it can erase tracked work. These findings were AI-drafted and require student review.
