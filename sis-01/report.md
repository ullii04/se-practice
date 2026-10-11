# SIS #01 — Software Engineering Fundamentals, With an AI in the Loop

**Topic:** 1.4 — Ethical responsibilities

## 1. Scenario

**Question:** What ethical responsibilities should developers consider when building a school grade system, especially privacy, accuracy and responsibility for errors?

**Users:** Teachers enter grades, and students check their grades.

**Problem:** Incorrect grades could cause students to lose scholarships, fail courses or face problems in their future careers.

**Constraints:** The development team has only two people, and it has two weeks to develop the system.

**Risk:** An incorrect grade might remain uncorrected and negatively affect a student.

**Assumptions:** This school, its grade system, the two-person team and the two-week deadline are fictional. The possible consequences are concerns to investigate, not verified claims about a real school. Students can report errors, and my initial view is that backend developers should handle them.

## 2. Analysis

(write here)

## 3. Review

(write here)

## 4. Conclusion

(write here)

## 5. Reflection

(write here)

## 6. References

- Association for Computing Machinery (ACM). (2018). ACM Code of Ethics and Professional Conduct. Section 1.6, Respect privacy. https://www.acm.org/code-of-ethics (accessed 2026-10-11; student's supplied reading notes).
- IEEE Computer Society and ACM. Software Engineering Code of Ethics and Professional Practice, Version 5.2. Clause 3.10. https://www.computer.org/education/code-of-ethics (accessed 2026-10-11; student's supplied reading notes).

## 7. Appendix A — Initial outline

1. Teachers and students should be able to access grades because teachers need to enter grades and students need to check them.
2. Incorrect grades could cause students to lose scholarships, fail courses or affect their future careers.
3. Students should report grade errors to avoid negative consequences.
4. With only two developers and two weeks, I would prioritize improving the system so that it stops producing incorrect grades.
5. I think backend developers should be responsible for handling system errors.

### Original student notes and translation disclosure

The five ideas below were written by the student in Chinese before Prompt A. Codex supplied guiding questions, translated the answers into English and formatted the scenario. The English outline above preserves the student's initial positions without treating them as verified conclusions.

- 老师和学生 老师要打分 学生要查分
- 会让学生失去奖学金或者挂科 或者影响后期的职业发展
- 应该上报错误 以免带来负面影响
- 优先把系统优化 不能再继续报错成绩
- 我觉得后端应该负责处理

Initial outline commit: `b1f710d`, pushed to `sis-01` before Prompt A. The student performed the commit and push; the conversation contains their successful terminal output.

## 8. Appendix B — AI exchanges

### B1 — Draft (Prompt A)

- **Tool:** Codex / ChatGPT Work desktop conversation
- **Model:** not displayed
- **Date:** 2026-10-10
- **Purpose:** contextual draft

**Prompt:**

~~~~text
Act as a software engineering tutor. Help me analyze topic 1.4 Ethical responsibilities: What ethical responsibilities should developers consider when building a school grade system, especially privacy, accuracy and responsibility for errors? for a first-year-level university assignment.

My scenario is a fictional school grade system where teachers enter grades and students check them. Incorrect grades could negatively affect students. The constraints are a team of only two developers and a two-week development deadline. The main risk is an incorrect grade remaining uncorrected and harming a student. The school, system, team size and deadline are fictional assumptions; possible consequences require verification. My initial ideas are 1. Teachers and students should be able to access grades because teachers need to enter grades and students need to check them. 2. Incorrect grades could cause students to lose scholarships, fail courses or affect their future careers. 3. Students should report grade errors to avoid negative consequences. 4. With only two developers and two weeks, I would prioritize improving the system so that it stops producing incorrect grades. 5. I think backend developers should be responsible for handling system errors. Draft a 400–500 word explanation using these details.

Separate facts from assumptions. Explain trade-offs and identify claims I should verify. Do not invent quotations, references or page numbers.
~~~~

**Response:**

~~~~text
The fictional school grade system raises three ethical issues: privacy, accuracy and responsibility for errors. Teachers enter grades, while students check their results. The two-person team and two-week deadline are scenario assumptions, not facts about an actual school. Developers should consider how their choices could affect students, especially when an incorrect grade remains uncorrected.

Privacy requires more precise access rules than simply allowing teachers and students to access grades. I recommend that students see only their own results and teachers edit only grades for their assigned classes. This would support their different tasks while limiting unnecessary access. The team should also avoid collecting information unrelated to grading. These are proposed safeguards, not claims about a particular legal requirement. Applicable school policies and privacy obligations need verification before deployment.

Accuracy should take priority over optional features. However, “optimizing the system” is too vague to guide development, and promising that it will stop producing incorrect grades is unrealistic. For this scenario, the team should first agree with teachers on calculation rules, rounding and treatment of missing marks. It should then test representative cases and boundaries, such as scores near a passing threshold. Input validation can reject values outside an allowed range, but it cannot establish whether a teacher entered the correct mark for the correct student. That distinction is a technical claim worth verifying.

An incorrect result could contribute to a lost scholarship, an apparent course failure or later difficulties. However, these outcomes depend on institutional rules and how grades are used. They should remain possible harms rather than certain consequences. Claims about scholarship eligibility or career effects need evidence from relevant policies or research. Without that evidence, the report should explain the immediate risk of a student receiving an inaccurate result.

Students should have a clear way to report suspected errors, but they should not carry the whole burden of finding them. I propose a correction process in which a teacher checks the academic record and a developer investigates any software defect. A record of changes could help explain what was corrected and why, although access and retention would need limits to protect privacy.

Backend developers therefore have an important role, but assigning them all responsibility would overlook other causes of error. Teachers may enter incorrect data, and school staff must decide academic rules and approve disputed results. The team should agree on these responsibilities before release.

With only two weeks, I recommend a limited initial release focused on access restrictions, calculation checks and correction reporting. Extra visual features can wait. This trades breadth for attention to essential safeguards, but a small feature set does not guarantee safety. Before wider use, the school should review test evidence, unresolved problems and who will maintain the system. Professional guidance on privacy, avoiding harm and responsibility should be checked to evaluate these recommendations.
~~~~

### B2 — Critique (Prompt B)

- **Tool:** Codex / ChatGPT Work desktop conversation
- **Model:** not displayed
- **Date:** 2026-10-10
- **Purpose:** critical review of the draft

**Prompt:**

~~~~text
Review the draft below against my chosen question and scenario. Identify inaccuracies, missing reasoning, vague claims and unsupported assumptions.
For each concern, explain why it matters and how I could check it. Include a counterexample or alternative interpretation. Do not rewrite the answer yet.
Question: What ethical responsibilities should developers consider when building a school grade system, especially privacy, accuracy and responsibility for errors? Scenario: A fictional school grade system where teachers enter grades and students check them. Incorrect grades could negatively affect students. The constraints are a team of only two developers and a two-week development deadline. The main risk is an incorrect grade remaining uncorrected and harming a student. The school, system, team size and deadline are fictional assumptions; possible consequences require verification. Draft: [The fictional school grade system raises three ethical issues: privacy, accuracy and responsibility for errors. Teachers enter grades, while students check their results. The two-person team and two-week deadline are scenario assumptions, not facts about an actual school. Developers should consider how their choices could affect students, especially when an incorrect grade remains uncorrected.
Privacy requires more precise access rules than simply allowing teachers and students to access grades. I recommend that students see only their own results and teachers edit only grades for their assigned classes. This would support their different tasks while limiting unnecessary access. The team should also avoid collecting information unrelated to grading. These are proposed safeguards, not claims about a particular legal requirement. Applicable school policies and privacy obligations need verification before deployment.
Accuracy should take priority over optional features. However, “optimizing the system” is too vague to guide development, and promising that it will stop producing incorrect grades is unrealistic. For this scenario, the team should first agree with teachers on calculation rules, rounding and treatment of missing marks. It should then test representative cases and boundaries, such as scores near a passing threshold. Input validation can reject values outside an allowed range, but it cannot establish whether a teacher entered the correct mark for the correct student. That distinction is a technical claim worth verifying.
An incorrect result could contribute to a lost scholarship, an apparent course failure or later difficulties. However, these outcomes depend on institutional rules and how grades are used. They should remain possible harms rather than certain consequences. Claims about scholarship eligibility or career effects need evidence from relevant policies or research. Without that evidence, the report should explain the immediate risk of a student receiving an inaccurate result.
Students should have a clear way to report suspected errors, but they should not carry the whole burden of finding them. I propose a correction process in which a teacher checks the academic record and a developer investigates any software defect. A record of changes could help explain what was corrected and why, although access and retention would need limits to protect privacy.
Backend developers therefore have an important role, but assigning them all responsibility would overlook other causes of error. Teachers may enter incorrect data, and school staff must decide academic rules and approve disputed results. The team should agree on these responsibilities before release.
With only two weeks, I recommend a limited initial release focused on access restrictions, calculation checks and correction reporting. Extra visual features can wait. This trades breadth for attention to essential safeguards, but a small feature set does not guarantee safety. Before wider use, the school should review test evidence, unresolved problems and who will maintain the system. Professional guidance on privacy, avoiding harm and responsibility should be checked to evaluate these recommendations.].
~~~~

**Response:**

~~~~text
1. **Access rules need clearer boundaries.**  
The draft recommends that students see only their own grades and teachers edit grades for assigned classes. This is a reasonable proposal, but it leaves exceptional access and approval powers unspecified. This matters because correcting a disputed grade may require someone outside the assigned class. Check the proposed permissions with the people responsible for academic records, then test both permitted and prohibited actions. Counterexample: a replacement teacher may legitimately need temporary access. Any such role is an additional scenario assumption, not an established requirement.

2. **The statement about input validation is too absolute.**  
The draft says validation “cannot establish whether a teacher entered the correct mark for the correct student.” Simple range checks cannot do this, but the wording could imply that all validation is equally limited. This matters when choosing safeguards. Check what information is available and distinguish format or range checks from comparison with an authoritative record. Counterexample: comparing an entry against an approved assessment record could detect a mismatch, although the reference record itself might contain an error.

3. **The testing proposal lacks a clear basis for release.**  
Representative cases and boundary tests are useful proposals, but the draft does not explain who confirms expected results or what failures would prevent release. This matters because developers could implement an incorrectly understood grading rule consistently. Check the fictional requirements with a designated academic decision-maker and prepare independently calculated expected results. Counterexample: every test could pass while using the wrong rounding rule. Passing tests should therefore support a limited claim about checked behavior, not guarantee accuracy.

4. **Error reporting needs ownership and follow-through.**  
The draft proposes a reporting channel but does not explain who receives reports, tracks them or tells students the outcome. This matters because an accessible reporting button alone does not ensure correction. Check the proposed workflow by walking through one disputed-grade example, from submission to resolution. Counterexample: a student reports an error promptly, but nobody reviews it before an academic decision. Any response deadline should be explicitly proposed and checked for feasibility, rather than invented as school policy.

5. **Shared responsibility could leave final accountability unclear.**  
The draft correctly challenges the idea that backend developers should handle every problem, but distributing tasks does not identify who coordinates an unresolved incident. This matters when teachers and developers disagree about whether the cause is data, policy or software. Check a simple responsibility list covering investigation, approval, communication and closure. Counterexample: a correct backend calculation may display incorrectly because of a frontend defect. A named coordinator could organize the response without personally performing every task.

6. **The two-week release recommendation is not yet justified.**  
A limited feature set may be sensible, but the draft provides no estimate showing that its safeguards fit the available time. Check a small task breakdown and identify essential conditions for release. Counterexample: access restrictions might still fail at the deadline, making even a limited live release inappropriate. A demonstration using fictional data, or postponement, is an alternative worth considering. Also, “visual features” should not automatically include clear error messages or readable grade displays, which may affect correct use.

7. **Ethical recommendations still need authoritative support.**  
The draft distinguishes possible harms from verified outcomes, which is appropriate. However, its privacy and responsibility recommendations remain unsupported by sources. This matters because the assignment requires two factual claims to be checked. Open relevant professional guidance and identify precisely what it supports. Counterexample: a code’s instruction to protect privacy supports an ethical duty but does not prove that one particular access design satisfies local law. Keep scholarship and career consequences conditional unless relevant evidence is available.
~~~~

### B3 — Revision (Prompt C)

- **Tool:** Codex / ChatGPT Work desktop conversation
- **Model:** not displayed
- **Date:** 2026-10-11
- **Purpose:** revision using my decisions and verified evidence

**Prompt:**

~~~~text
Revise the draft using my review decisions and source notes below. Keep the answer relevant to my scenario and preserve uncertainty where evidence is limited.

My decisions: I accept criticisms 1–6. Access rules need exceptional-access boundaries; the statement about input validation is too absolute; testing needs agreed expected results and release conditions; error reporting needs ownership and follow-through; shared responsibility needs a coordinator; and the two-week release plan lacks evidence of feasibility. I partly accept criticism 7: ethical reasoning can be discussed without references, but factual claims about professional codes need supporting evidence and local legal compliance still needs checking. Verified evidence: The student supplied notes after being asked to open and read the following sources. ACM, Code of Ethics and Professional Conduct, section 1.6, Respect privacy, https://www.acm.org/code-of-ethics, accessed 2026-10-11: the student's summary says professionals should use personal information for legitimate purposes, protect it from unauthorized access, collect only necessary data, and allow correction of inaccurate personal information. Treat this as a paraphrase, not a verbatim quotation. It supports privacy safeguards and data minimization, but does not establish a particular school's legal obligations or prove our access design sufficient. IEEE-CS/ACM, Software Engineering Code of Ethics and Professional Practice, clause 3.10, https://www.computer.org/education/code-of-ethics, accessed 2026-10-11: the student supplied the wording requiring adequate testing, debugging and review of software and related documents. This supports checking grading calculations and reviewing requirements, but does not prescribe our exact tests, prove that two weeks is sufficient or guarantee error-free software. The assistant's attempts to fetch the full source pages were blocked; these source notes come from the student's supplied reading. Draft: The fictional school grade system raises three ethical issues: privacy, accuracy and responsibility for errors. Teachers enter grades, while students check their results. The two-person team and two-week deadline are scenario assumptions, not facts about an actual school. Developers should consider how their choices could affect students, especially when an incorrect grade remains uncorrected.

Privacy requires more precise access rules than simply allowing teachers and students to access grades. I recommend that students see only their own results and teachers edit only grades for their assigned classes. This would support their different tasks while limiting unnecessary access. The team should also avoid collecting information unrelated to grading. These are proposed safeguards, not claims about a particular legal requirement. Applicable school policies and privacy obligations need verification before deployment.

Accuracy should take priority over optional features. However, “optimizing the system” is too vague to guide development, and promising that it will stop producing incorrect grades is unrealistic. For this scenario, the team should first agree with teachers on calculation rules, rounding and treatment of missing marks. It should then test representative cases and boundaries, such as scores near a passing threshold. Input validation can reject values outside an allowed range, but it cannot establish whether a teacher entered the correct mark for the correct student. That distinction is a technical claim worth verifying.

An incorrect result could contribute to a lost scholarship, an apparent course failure or later difficulties. However, these outcomes depend on institutional rules and how grades are used. They should remain possible harms rather than certain consequences. Claims about scholarship eligibility or career effects need evidence from relevant policies or research. Without that evidence, the report should explain the immediate risk of a student receiving an inaccurate result.

Students should have a clear way to report suspected errors, but they should not carry the whole burden of finding them. I propose a correction process in which a teacher checks the academic record and a developer investigates any software defect. A record of changes could help explain what was corrected and why, although access and retention would need limits to protect privacy.

Backend developers therefore have an important role, but assigning them all responsibility would overlook other causes of error. Teachers may enter incorrect data, and school staff must decide academic rules and approve disputed results. The team should agree on these responsibilities before release.

With only two weeks, I recommend a limited initial release focused on access restrictions, calculation checks and correction reporting. Extra visual features can wait. This trades breadth for attention to essential safeguards, but a small feature set does not guarantee safety. Before wider use, the school should review test evidence, unresolved problems and who will maintain the system. Professional guidance on privacy, avoiding harm and responsibility should be checked to evaluate these recommendations.

Show what you changed and why. Use only the sources I supplied. Flag remaining gaps instead of inventing details.
~~~~

**Response:**

~~~~text
The fictional school grade system raises ethical questions about privacy, accuracy and accountability. Teachers enter grades, and students check their results. The two-person team and two-week deadline are assumptions. The main concern is that an incorrect grade might remain uncorrected and harm a student. Scholarship loss and career effects remain possible consequences requiring evidence about institutional decisions.

Privacy protections should match each user’s responsibilities. I recommend that students access their own results and teachers edit grades for assigned classes. Exceptional access, such as access for a replacement teacher, should require explicit authorization and expire when no longer needed. These are proposed design choices, not established school requirements. The student’s notes on ACM section 1.6 support limiting personal-data collection and protecting against unauthorized access. They do not prove that this permission scheme satisfies local law. Ethical reasoning can begin without references, while claims about a professional code require accurate attribution. [ACM Code of Ethics, §1.6](https://www.acm.org/code-of-ethics).

Accuracy requires more than a promise to “optimize” the system. Teachers and developers should agree on calculation, rounding and missing-mark rules. Simple range checks can identify out-of-range entries; comparison with an approved record could reveal other discrepancies, although that record might itself be wrong. This distinction is a reasoned qualification, not a technical finding established by the supplied ethics sources.

For testing, a designated academic reviewer should approve grading rules and independently calculated expected results. Developers should check calculations, access restrictions and the correction process. The student’s notes on clause 3.10 support adequate testing, debugging and review, but do not prescribe these particular tests or guarantee error-free software. I propose blocking live release if essential access checks or agreed grading cases fail. Passing those checks would establish only the behavior examined. [IEEE-CS/ACM Software Engineering Code, §3.10](https://www.computer.org/education/code-of-ethics).

Error reporting should connect to a defined response process. A proposed school coordinator would receive and track reports, arrange investigation and communicate outcomes. Teachers would confirm academic records and approve grade corrections; developers would investigate software defects, including frontend and backend problems. This distributes work while naming someone to coordinate unresolved cases. Response targets need agreement with the school rather than an invented deadline.

With two developers and two weeks, feasibility remains uncertain. The team should estimate essential tasks before promising a live release. Decorative features can wait, but readable results and clear error messages should remain priorities. If essential safeguards cannot be completed and checked, I recommend a demonstration using fictional data and postponing live use. That limits immediate usefulness but avoids treating a deadline as evidence of readiness.

Changes and reasons:

1. Added authorized, temporary exceptional access to address criticism 1 without assuming unrestricted access.
2. Replaced the absolute validation claim with a distinction between range checks and record comparison, addressing criticism 2.
3. Added approved expected results and proposed release conditions, addressing criticism 3 and applying the testing guidance.
4. Connected reporting to tracking, investigation and communication, addressing criticism 4.
5. Named a proposed coordinator and included frontend defects, addressing criticism 5 without assigning every error to backend developers.
6. Made release conditional on estimates and essential checks, with a fictional-data demonstration as an alternative, addressing criticism 6.
7. Preserved the student’s partial disagreement with criticism 7: ethical discussion does not always require citations, but factual attribution and legal conclusions require evidence.

Remaining gaps include local privacy obligations, school grading and appeal policies, staffing availability, source-record reliability and the feasibility of the two-week schedule. The supplied sources support professional duties, not these unresolved details. Source descriptions above rely on the student’s reading notes; the assistant could not independently retrieve the full pages.
~~~~

## 9. Appendix C — Evidence tables

### Verification table

| AI claim | Source and locator | Evidence found | Decision |
| --- | --- | --- | --- |
| “The team should also avoid collecting information unrelated to grading.” (Prompt A) | ACM, Code of Ethics and Professional Conduct, section 1.6, https://www.acm.org/code-of-ethics; accessed 2026-10-11. | My source notes describe collecting only necessary personal data and protecting it against unauthorized access. This supports the recommendation as an application of a professional ethical duty; it does not prove legal compliance or prescribe our exact access scheme. | keep |
| “It should then test representative cases and boundaries, such as scores near a passing threshold.” (Prompt A) | IEEE-CS/ACM, Software Engineering Code of Ethics and Professional Practice, clause 3.10, https://www.computer.org/education/code-of-ethics; accessed 2026-10-11. | The clause calls for adequate testing, debugging and review. It supports the general testing duty. Boundary cases are our proposed application, not a method specifically required by this clause, and passing them cannot establish universal correctness. | qualify |

The first source note was supplied as a summary and is not represented as a verbatim quotation. The student's notes are the basis of these checks; the assistant's attempted retrieval of both full pages was blocked. These rows verify the professional guidance behind recommendations, not empirical proof that the proposed system is effective. The least-privilege terminology in my reflection is my interpretation of privacy safeguards, not a direct quotation or a claim that ACM section 1.6 uses that term.

### Change log

| AI wording / suggestion | Your final version | Reason for change |
| --- | --- | --- |
| Prompt A: “I recommend that students see only their own results and teachers edit only grades for their assigned classes.” | Keep those task-based rules and explicitly authorize temporary access for replacement teachers, limited to the relevant class and ended when the role ends. | I selected temporary access as a priority after criticism 1. It addresses a fictional exception while applying the privacy duty in verification row 1. |
| Prompt A: “I propose a correction process in which a teacher checks the academic record and a developer investigates any software defect.” | Use a complete workflow with a named coordinator, assigned investigators, student feedback and follow-up deadlines agreed with the school. | I selected owners and follow-up as a priority: a report button alone cannot resolve the scenario's risk of uncorrected grades. Deadlines are proposals, not invented school policy. |
| Prompt A: “Backend developers therefore have an important role, but assigning them all responsibility would overlook other causes of error.” | Retain shared responsibility, identify frontend and backend investigations separately and give a coordinator responsibility for tracking the outcome. | My reflection explicitly revises my initial backend-only view in response to criticism 5. |

### Process and authorship notes

The student supplied the initial five ideas in Chinese, accepted criticisms 1–6, partly accepted criticism 7, supplied reading notes, selected two final priorities and wrote the English reflection material. The assistant translated and organized the outline, generated the three recorded responses, assembled the final report around the student's decisions and checked its format. The reflection preserves the student's sentences, with question labels omitted and punctuation normalized. The student must review the assembled final text before submission.

Prompt B above retains the brackets around the full draft exactly as sent. An earlier attempt containing an unfilled placeholder received only a request to resend; it was not used as the critique. Prompt C is copied from the student's actual pasted attachment. Dates follow the local date context supplied in the conversation: A and B on 2026-10-10, C on 2026-10-11. No exact model was visible in the supplied interface screenshots, so the model is recorded as `not displayed`. No claim is made that the assistant independently opened the source pages successfully.
