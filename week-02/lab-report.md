# Lab report — Practice #02: The Prompt Is an Engineering Input

**Name:** Elshibai Ulzhalgas  
**Group:** Monday 16:00-19:00  
**Date:** September 16, 2026

> Fill in every section. **Do not delete or renumber the headings** — the grading pass reads them
> by number. If something did not happen, write "did not happen" and why; an empty section and a
> fabricated one are graded the same way.

---

## 1. The frozen experiment

| | |
| --- | --- |
| AI assistant | ChatGPT |
| Exact model name | GPT-5.6 Sol |
| Implementation language | Python |
| Date of the runs | September 16, 2026 |

**Non-Python students only** — paste your substituted Prompt B text here, so the substitution can
be checked:

```text
n/a — used Python
```

**Confirmations:**

- Each prompt was sent in a **fresh chat**: yes
- No follow-up questions were asked before Part 7: yes
- Every output was saved **before** any editing: yes

---

## 2. Prompt A — minimal

**Prompt sent** (should be exactly one sentence):

```text
Write Python code to analyze student marks.
```

**Assumptions the AI made that I never gave it** — list them, one per line.

1. It assumed that the marks would be stored directly in a list inside the program.
2. It assumed that the passing mark should be 50.
3. It assumed that invalid values should be ignored instead of raising an error.

**Questions it should have asked and did not:**

1. What function name and signature should be used?
2. How should invalid input be handled?

**Is the function named `analyze_marks` with the required signature?** no — there was no function. The response was a standalone script.

**First impression before testing** (one sentence — you will compare this with section 6 later):

The code looked reasonable for calculating simple mark statistics, but I noticed that it did not provide the required function interface.

---

## 3. Prompt B — structured context

**Prompt sent** (paste it in full, including any substitutions):

```text
You are a Python developer. Implement analyze_marks(marks, pass_mark=50). Return
average, highest, lowest, and pass_rate in a dictionary. Accept marks from 0 to 100;
raise ValueError for an empty list, non-numeric values, or out-of-range values. Use
no external libraries. Return code plus a short explanation.
```

**What B fixed compared to A:**

1. It specified the exact `analyze_marks(marks, pass_mark=50)` function and the required return values.
2. It specified the validation rules and required `ValueError` instead of silently ignoring invalid input.

**What B still leaves open:**

1. It does not specify whether `pass_rate` should be rounded or returned as the full floating-point value.
2. It does not explicitly state whether decimal marks must be supported, although the range requirement does not exclude them.

---

## 4. Prompt C — examples and tests

**What I appended to Prompt B:**

```text
Example: analyze_marks([40, 60, 80], 50) -> average 60, highest 80,
lowest 40, pass_rate 66.67. Include tests for: one mark, decimals, custom
pass_mark, empty list, text value, and marks below 0 or above 100. State any
remaining assumptions before the code.
```

**Tests the AI wrote for itself** — 8 executable tests plus expected results/comments. They covered the worked example, one mark, decimal marks, a custom pass mark, an empty list, a text value, a value below 0, and a value above 100.

| Situation | Covered by the AI's tests? |
| --- | --- |
| one mark | yes |
| decimals | yes |
| custom pass_mark | yes |
| empty list | yes |
| text value | yes |
| below 0 / above 100 | yes |

**Do the AI's own tests pass against the AI's own code?** yes

**Do they agree with the harness in section 6?** yes — the harness also gave Prompt C 6 PASS, 0 FAIL, and 0 ERROR.

**Assumptions C stated explicitly before the code:**

- `marks` is expected to be a list of numeric values.
- Valid marks are from 0 to 100 inclusive.
- A student passes when the mark is greater than or equal to `pass_mark`.
- `pass_mark` is assumed to be numeric and between 0 and 100.
- `pass_rate` is returned as a percentage and rounded to two decimal places.

---

## 5. Prompt D — my combined prompt

**The complete prompt I wrote** (one message, sent to a fresh chat):

```text
You are a Python developer. Implement analyze_marks(marks, pass_mark=50).

Requirements:

- Return one dictionary with exactly these keys: average, highest, lowest, and pass_rate.
- Marks must be numeric values from 0 to 100 inclusive.
- A mark passes when it is greater than or equal to pass_mark.
- Raise ValueError for an empty list, any non-numeric mark, or any mark outside 0 to 100.
- Support integer and decimal marks.
- Calculate pass_rate as a percentage.
- Numerical results must be accurate within 0.01; pass_rate may be rounded to two decimal places.
- Use no external libraries.
- Do not print results or include executable test code in the implementation.

The function must correctly handle these cases:
analyze_marks([40, 60, 80], 50) -> average 60, highest 80, lowest 40, pass_rate 66.67
analyze_marks([100], 50) -> average 100, highest 100, lowest 100, pass_rate 100
analyze_marks([49.5, 50], 50) -> average 49.75, highest 50, lowest 49.5, pass_rate 50
analyze_marks([], 50) -> raise ValueError
analyze_marks([40, "60"], 50) -> raise ValueError
analyze_marks([-1, 50, 101], 50) -> raise ValueError

State any remaining assumptions briefly, then return the Python implementation and a short explanation.
```

**What I deliberately added that A, B and C did not have:**

1. I required the returned dictionary to contain exactly the four required keys.
2. I explicitly required support for integer and decimal marks and numerical accuracy within 0.01.
3. I required the implementation not to print results or include executable test code.

**The ambiguity I found in the specification, and how I resolved it inside Prompt D:**

The main ambiguity I found was the representation of `pass_rate`. Prompt B returned `66.66666666666666` for case 1, while Prompt C returned `66.67`. Both passed because the harness accepts numerical results within 0.01. In Prompt D, I resolved this by explicitly saying that `pass_rate` may be rounded to two decimal places.

---

## 6. Test results — the evidence

Six cases × four prompts. Verdicts are **PASS**, **FAIL** or **ERROR** only.

| # | Call | Required | A | B | C | D |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `analyze_marks([40, 60, 80], 50)` | avg 60 · high 80 · low 40 · rate 66.67 | ERROR | PASS | PASS | PASS |
| 2 | `analyze_marks([100], 50)` | avg 100 · high 100 · low 100 · rate 100 | ERROR | PASS | PASS | PASS |
| 3 | `analyze_marks([49.5, 50], 50)` | avg 49.75 · high 50 · low 49.5 · rate 50 | ERROR | PASS | PASS | PASS |
| 4 | `analyze_marks([], 50)` | raises ValueError | ERROR | PASS | PASS | PASS |
| 5 | `analyze_marks([40, "60"], 50)` | raises ValueError | ERROR | PASS | PASS | PASS |
| 6 | `analyze_marks([-1, 50, 101], 50)` | raises ValueError | ERROR | PASS | PASS | PASS |
| | **Totals** | | 0/6 | 6/6 | 6/6 | 6/6 |

**For every FAIL and ERROR above, one line: what was returned or raised instead.**

| Prompt | Case | What actually happened |
| --- | --- | --- |
| A | 1–6 | The required `analyze_marks` function was missing. The harness therefore classified all six cases as ERROR. |

### Pasted terminal output — all four runs

**Prompt A**

```text
Valid marks: 5
Average: 67.00
Highest: 92
Lowest: 23
Pass rate: 80.0%
Testing: week-02/code/prompt_a.py
ERROR: analyze_marks function is missing
Totals: 0 PASS · 0 FAIL · 6 ERROR
```

**Prompt B**

```text
Testing: week-02/code/prompt_b.py
Case 1: PASS — {'average': 60.0, 'highest': 80, 'lowest': 40, 'pass_rate': 66.66666666666666}
Case 2: PASS — {'average': 100.0, 'highest': 100, 'lowest': 100, 'pass_rate': 100.0}
Case 3: PASS — {'average': 49.75, 'highest': 50, 'lowest': 49.5, 'pass_rate': 50.0}
Case 4: PASS — ValueError: Marks list cannot be empty.
Case 5: PASS — ValueError: All marks must be numeric.
Case 6: PASS — ValueError: Marks must be between 0 and 100.
Totals: 6 PASS · 0 FAIL · 0 ERROR
```

**Prompt C**

```text
{'average': 60.0, 'highest': 80, 'lowest': 40, 'pass_rate': 66.67}
{'average': 75.0, 'highest': 75, 'lowest': 75, 'pass_rate': 100.0}
{'average': 62.0, 'highest': 80.0, 'lowest': 45.5, 'pass_rate': 66.67}
{'average': 70.0, 'highest': 80, 'lowest': 60, 'pass_rate': 33.33}
Marks list cannot be empty.
All marks must be numeric.
Marks must be between 0 and 100.
Marks must be between 0 and 100.
Testing: week-02/code/prompt_c.py
Case 1: PASS — {'average': 60.0, 'highest': 80, 'lowest': 40, 'pass_rate': 66.67}
Case 2: PASS — {'average': 100.0, 'highest': 100, 'lowest': 100, 'pass_rate': 100.0}
Case 3: PASS — {'average': 49.75, 'highest': 50, 'lowest': 49.5, 'pass_rate': 50.0}
Case 4: PASS — ValueError: Marks list cannot be empty.
Case 5: PASS — ValueError: All marks must be numeric.
Case 6: PASS — ValueError: Marks must be between 0 and 100.
Totals: 6 PASS · 0 FAIL · 0 ERROR
```

**Prompt D**

```text
Testing: week-02/code/prompt_d.py
Case 1: PASS — {'average': 60.0, 'highest': 80, 'lowest': 40, 'pass_rate': 66.67}
Case 2: PASS — {'average': 100.0, 'highest': 100, 'lowest': 100, 'pass_rate': 100.0}
Case 3: PASS — {'average': 49.75, 'highest': 50, 'lowest': 49.5, 'pass_rate': 50.0}
Case 4: PASS — ValueError: Marks list cannot be empty
Case 5: PASS — ValueError: All marks must be numeric
Case 6: PASS — ValueError: Marks must be between 0 and 100
Totals: 6 PASS · 0 FAIL · 0 ERROR
```

---

## 7. Scoring

0–2 per criterion, using the rubric in `README.md` Part 7.

| Criterion | A | B | C | D |
| --- | ---: | ---: | ---: | ---: |
| Correctness (cases passed) | 0 | 2 | 2 | 2 |
| Requirement coverage | 0 | 2 | 2 | 2 |
| Verifiability (tests) | 0 | 1 | 2 | 2 |
| Assumptions stated | 0 | 1 | 2 | 2 |
| Noise (2 = none) | 2 | 2 | 1 | 2 |
| **Total / 10** | **2** | **8** | **9** | **10** |

**Prompt length, in words:** A 7 · B approximately 50 · C approximately 90 · D approximately 170

**Words added per point gained** — B over A, C over B, D over C. One line on what that ratio says:

The largest useful improvement came from A to B: a relatively small amount of structured specification changed the result from 0/6 to 6/6. C added useful verification but no additional harness passes, while D mainly removed ambiguity and unnecessary executable output rather than increasing the six-case pass count.

---

## 8. Conclusion — 150–200 words

```text
Prompt D scored best in my evaluation, and it is the prompt I would use for a similar task at work because it produced a clean implementation while making the expected behavior explicit. However, the biggest improvement in correctness actually happened from Prompt A to Prompt B. Prompt A did not define analyze_marks at all, so the harness reported 0 PASS and 6 ERROR. Adding the exact function signature, required dictionary values, validation rules, and ValueError behavior in Prompt B changed all six cases to PASS. For example, case 5 correctly raised ValueError for [40, "60"] instead of accepting or ignoring the text value.

Prompt C also passed 6/6, but its executable self-tests created extra terminal output when the harness imported the file. Those tests were useful for verification, but including them inside the implementation was unnecessary noise. Prompt D kept the useful requirements while removing executable test code.

The main ambiguity I found was pass_rate rounding. Prompt B returned 66.66666666666666 in case 1, while C returned 66.67, and both passed. I resolved this in D by allowing pass_rate to be rounded to two decimal places.
```

**Word count:** 182

---

## 9. Two questions for the debrief

Written before class, answered in class.

1. If two prompts both pass every required test, how should we decide whether the extra prompt detail is useful engineering information or unnecessary noise?
2. Should numerical formatting and rounding rules always be specified in a prompt when the tests already use a numerical tolerance?