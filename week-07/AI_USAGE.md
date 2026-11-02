# AI Usage Disclosure — Week 07

| Tool | Exact model / plan | Used for | Which files it touched |
| --- | --- | --- | --- |
| ChatGPT / Codex, fresh isolated assistant context | not displayed | Generated the first suite using the deck prompt and supplied case table | suites/first/booking.test.ts, initial app/src/booking.test.ts |
| ChatGPT / Codex, same isolated context | not displayed | Reviewed actual first-run output and improved assertions and boundaries | app/src/booking.test.ts |
| ChatGPT / Codex, main assistant | not displayed | Extracted canBook, drafted case reasons and report tables, executed runs and mutants, performed browser UI checks and assembled evidence | app/src/booking.ts, app/src/App.tsx, app/src/lib/validation.ts, app/package.json and lockfile, lab-report.md, evidence/, submission.yml, AI_USAGE.md |

The first suite was saved exactly as generated and committed before review/run. Its SHA-256 is 3e14cd33e6e018941c07eddf8963d599c6d24ca41dfed764dcc71ede7a33ffde. The original implementation comparisons were preserved during extraction. All experiments were actually run; every pasted run is unedited terminal output. The first suite had no failing expectations. Improvements were assertion visibility and two additional AC1 boundaries, not invented failure repairs.

Case reasons, X1/X2, review decisions and comparison prose were AI-assisted. They do not meet a claim of independent student authorship. The student supplied the substantive reflections in chat; section 10 is an assistant translation and organization of those reflections, with technical wording corrections. An English translation of the source statements is preserved in evidence/student-reflection-source.md. It is not represented as unassisted English writing. The assistant performed the five browser checks, not the student. This is disclosed because the worksheet requests personal reasoning and manual checks.

I used an assistant to extract canBook: yes. The conditions were copied in order from Week 06 checkAvailability. The page calls canBook directly; parsing and feedback stay at the interface boundary. No implementation fixes were required by the first or final suites.

First suite unedited: yes. Terminal outputs from real runs, unedited: yes. Mutants restored: yes. AI use disclosed: yes.

Student understanding and personal sign-off require the student's own review; the assistant does not sign for them.
Student: Elshibai Ulzhalgas
Date: 2026-11-02
