# AI Usage Disclosure — Week 05

| Tool | Exact model / plan | Used for | Which files it touched |
| --- | --- | --- | --- |
| ChatGPT, separate implementation chat titled Booking Validation Function | not displayed (student confirmed) | Contract acknowledgement, plan, original function and static reviews | lab-report.md; code/original/booking_v1.py; initial code/booking.py |
| Codex / ChatGPT Work coordination chat | not displayed in supplied screenshots | Test generation, AC mapping, explanation, type-policy implementation, report assembly and local verification | code/test_booking.py; final code/booking.py; lab-report.md; AI_USAGE.md; submission.yml |

**The assistant wrote, or helped write, my tests in `code/`:** yes

The coordinating assistant generated all 29 tests. Expected results are mapped to AC1–AC5 in report section 4; six extra tests document my chosen non-integer-input policy. I ran the supplied tests and checker. Guided questions helped me understand touching endpoints and unchanged input. I initially overlooked input mutation and incorrectly answered one overlap example; after explanation I correctly identified a touching booking as allowed and changing existing as unacceptable. I am not claiming to have independently authored the tests.

**`code/original/` holds the assistant's first answer exactly as returned:** yes

The source was recopied from the implementation chat to restore line breaks lost in an earlier pasted message. It was saved and committed as 8a77e16 before the policy change. The original remains unchanged; only the working copy gained the type guard.

**Everything I submitted, I can explain and defend in class — including the overlap condition:** no — full independent explanation of every test has not been demonstrated. I have explained why touching bookings are allowed and why a negative start also violates the future-start requirement.

**Anything I accepted from the AI without fully understanding it:** I initially did not understand the one-minute overlap example or the need to inspect input mutation. The assistant explained these and checked my answers on touching bookings and unchanged data. I still need to review the exact comparisons, all test cases and the final English report before claiming full independent understanding.

Sections 9.2 and 9.3 translate my own Chinese decisions and explanation. Section 10 is the English revision I supplied after AI explanation and an AI-assisted draft based on my four Chinese points. Its AI assistance is disclosed; it is not claimed to have been written without assistance. The code review itself was static; executed test evidence is kept separately.

Signed: Elshibai Ulzhalgas
Date: 2026-10-11

## Model metadata and validator limitation

I confirmed that the implementation chat did not display a model name. Booking Validation Function is the chat title, not the model. submission.yml therefore records not displayed. The supplied validator requires a digit in the model field, so D6 fails on this honest value. I have not invented a model/version or modified the validator. This is a declaration-validator failure, not a check_booking.py failure; checker.known_fails remains [] because all 32 booking/report checks pass.

Estimated time spent: approximately 2 hours.
