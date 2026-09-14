# Week 01 — Manual vs AI: Comparison

**Name:** Elshibai Ulzhalgas
**Group:** Monday 16：00-19:00
**Date:** September 12, 2026

---

## 1. Facts

| | Manual (Part 1) | Rocket (Part 2) |
| --- | --- | --- |
| Language / stack used | Python | Next.js and TypeScript |
| Time to first version that ran | 16 min | 20 min |
| Time to all 4 test cases passing | 26 min | About 25 min, after fixing output format |
| Number of attempts / prompts needed | Several test runs | Initial prompt + clarification answers + 1 fix prompt |
| Lines of code you actually wrote | 36 lines | 0 lines of generated app code |
| Did it handle invalid marks (case B)? | Yes | Yes |
| Did it handle an empty list (case D)? | Yes | Yes |
| Did it use the ≥ 50 pass threshold? | Yes | Yes |
| Output format matches the spec? | Yes | Not initially; yes after the fix |
| Can you explain every line of it? | Yes | Not every line of the generated code |

## 2. Test results

| Case | Input | Manual output | Rocket output | Spec says | Match? |
| --- | --- | --- | --- | --- | --- |
| A | `85, 23, 45, 90, 92` | avg 67.00 · high 92 · low 23 · pass 60.0% | avg 67.0 · high 92 · low 23 · pass 60.0% | avg 67.00 · high 92 · low 23 · pass 60.0% | Partly, then yes after fix |
| B | `88, 47, -5, 101, abc, 73, 50, , 100` | avg 71.60 · high 100 · low 47 · pass 80.0% | avg 71.6 · high 100 · low 47 · pass 80.0% | avg 71.60 · high 100 · low 47 · pass 80.0% | Partly, then yes after fix |
| C | `10, 20, 30` | avg 20.00 · high 30 · low 10 · pass 0.0% | avg 20.0 · high 30 · low 10 · pass 0.0% | avg 20.00 · high 30 · low 10 · pass 0.0% | Partly, then yes after fix |
| D | `abc, , xyz` | No valid marks found. | No valid marks found. Enter numbers between 0 and 100. | clear message, no crash | Yes |

## 3. What the AI added that I never asked for

- Rocket chose Next.js and TypeScript and created a complete web interface.
- It added a configurable pass threshold, color-coded results, a grade distribution chart, copy-to-clipboard export, and live calculations.

## 4. What the AI got wrong or silently skipped

- The first version displayed the average with one decimal place, for example `67.0`, while the specification required exactly two decimals: `67.00`.
- The application added several features that were not part of my original request, which made the solution more complex than my manual Python program.

## 5. The defect I asked Rocket to fix

**Prompt I used:**

The average mark should always be displayed with exactly two decimal places, for example 67.00 and 71.60. Please fix this without changing the other calculations.

**Result:** Fixed. I tested Case A again and the average changed from `67.0` to `67.00`. The highest, lowest and pass rate remained correct.

**What this tells me:** AI can fix a specific problem quickly when the requirement is clear, but I still need to test the result instead of assuming the fix is correct.

---

## 6. Reflection (200–300 words)

The manual and AI approaches were very different. My manual Python program was simple and focused only on the requirements. It took me about 16 minutes to get the first version running and about 26 minutes in total to make sure all four test cases worked. The difficult part was handling invalid input without crashing and checking the output format carefully.

Rocket automated much more of the development process. From a short prompt, it created a complete web application using Next.js and TypeScript. It also created a user interface and added features such as a configurable pass threshold, a grade distribution chart, and live calculations. This saved time because I did not need to design or code the web interface myself. However, many of these features were not requested.

The generated application looked more professional than my console program, but looking correct was not the same as meeting the specification. For example, Rocket initially displayed the average as 67.0 instead of the required 67.00. I had to test the application with the provided cases, notice the problem, and send another prompt to fix it.

I would be more comfortable putting my name on the manual program because I understand every part of it. I could also use the Rocket version after carefully testing it. This experiment showed me that a software engineer is still responsible for requirements, testing, correctness, security, maintainability, and understanding what an AI-generated system actually does.