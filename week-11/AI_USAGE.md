# AI Usage Disclosure — Week 11

Course AI-use level D. The student remains responsible for reviewing and defending the submission.

| Tool | Exact model | Use |
| --- | --- | --- |
| Codex desktop, build session | not displayed | Migrated the project, drafted the contract, implemented and checked the adapter and UI, ran tests, applied the review fixes, collected screenshots, and prepared the report and declaration. |
| Codex desktop, implementation adviser | not displayed | Returned a file-by-file proposal in response to the deck prompt. The main session modified and implemented it. |
| Codex desktop, three fresh sessions | not displayed | Ran the same three JSON inputs after each candidate instruction. The instruction was a first-message simulation of a system instruction. |
| Codex desktop, separate review session | not displayed | Read the committed diff and context, returned six findings, and exported the transcript outside the repo. No project edit was made by the reviewer. |

The main session inspected and decided the changed files in §4.2, verified the findings, ran the real commands, and checked the browser. Independent student inspection of every file is unverified. The student supplied the English reflection verbatim. The reviewer used the default inherited model configuration and a separate conversation. The exact model identity was not displayed.

The reviewer operated under a read-only instruction against a frozen commit. Git status stayed clean. The tools were not technically write-disabled. Terminal output contains the original results and timing, with local absolute paths redacted. The app uses a mock, with no API key, token, provider SDK, or provider call in `app/src/`.
