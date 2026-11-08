# AI Usage Disclosure — Week 08

AI-use Level D. This submission is AI-assisted and does not claim unaided student authorship.

| Tool | Exact model / plan | Used for | Which files it touched |
| --- | --- | --- | --- |
| Codex desktop isolated plain_diagnosis context | not displayed; inherited default, no model override | Task 4 plain diagnosis; read only shared input | none; response preserved verbatim in evidence/plain-answer.md |
| Codex desktop isolated skill_diagnosis context | not displayed; inherited default, no model override | Task 5 prompt-only bug-detector simulation | none; response preserved verbatim in evidence/skill-answer.md |
| Codex desktop coordinator | not displayed | repository setup, tests, automated skill transcription, ZIP, one-line patches, report organization, comparisons, declaration and PR | app/src/booking.ts, app/src/booking.test.ts, skills/, lab-report.md, AI_USAGE.md, submission.yml, evidence/ |
| Codex read-only reviewer context | not displayed | verify baseline identity, history order, minimal patches and evidence consistency | none |

**skills/bug-detector/SKILL.md was typed by me from the deck, not generated:** no. Codex transcribed the exact fixed deck text through file automation. No literal manual typing is claimed.

**I applied the patches myself after review:** no. Codex changed the strict overlap comparisons in one line and deleted bookings.push in one line, in separate commits after failing regressions. The student subsequently supplied a reflection explaining these changes and their actual test results; it is preserved unchanged in evidence/student-conclusion-source.txt and §10.

**I used another assistant as well:** yes, isolated Codex diagnosis and review contexts as listed above, not an external ChatGPT/Claude installation. Skill mode was prompt-only. Exact model identity was not displayed and could not be independently verified. No installed-skill invocation is claimed.

**Every terminal output in lab-report.md came from a real run, unedited:** yes. Complete terminal runs are also stored in evidence/. The common diagnosis input contains an explicitly labeled exact T01 excerpt, not the full suite output; its SHA-256 is recorded. The responses are preserved verbatim. Invocation wrappers differ to load the procedure only in the skill context; the question and shared input are saved separately from those wrappers.

**I can explain the fixes without the assistant:** the student's supplied §10 correctly explains both lines. No unseen oral defense or independent testing is claimed.

**Anything accepted without fully understanding:** not independently verified by Codex; the student remains responsible for defending the work. No signature or blanket originality declaration was generated. Student-authored §10 is distinguished from Codex-authored report sections.

**Evidence and limitations:** no synthetic screenshots or invented interactions. E1 screenshot is unavailable because computer-use refused access to the Codex app. No installation was attempted or claimed. Manual hypotheses, skill transcription and manual patches required by the deck were not performed by the student; their automation is disclosed even though the static checker cannot assess it. SETUP.md was unavailable, so exact PR section names could not be followed.

Student: Elshibai Ulzhalgas (24B031019), Monday 16:00-19:00
Date: 2026-11-08
