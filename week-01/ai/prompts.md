# Rocket Prompt Log

## 1. Original Prompt

Build a small program that processes a list of student marks and prints:
average, highest, lowest, and pass rate.

## 2. Rocket Clarifying Questions

### Question 1
How should student marks be entered into the app?

My answer:
Type marks manually (Enter marks one by one or as a comma-separated list)

### Question 2
Who is this tool for?

My answer:
Personal / solo use (Just me — running quick calculations on any set of marks)

## 3. Rocket Enhanced Prompt

A personal student marks calculator web app where you type in a list of marks and instantly get a summary showing the average, highest score, lowest score, and pass rate. Clean, minimal interface — enter marks, hit calculate, and see all four results clearly displayed.

Building with Next.js and TypeScript.

## 4. What Rocket Added

Rocket added several things that were not included in my original prompt:

- A web application interface
- Next.js and TypeScript
- A configurable pass threshold slider
- Color-coded mark chips
- A grade distribution bar chart
- Copy-to-clipboard results export
- Live calculations

## 5. Test Results

### Case A
Input: `85, 23, 45, 90, 92`

Rocket output:
- Valid marks: 5
- Average: 67.0
- Highest: 92
- Lowest: 23
- Pass rate: 60.0%

Result: Partly matched. The calculations were correct, but the average was displayed with only one decimal place instead of the required two decimal places.

### Case B
Input: `88, 47, -5, 101, abc, 73, 50, , 100`

Rocket output:
- Valid marks: 5
- Average: 71.6
- Highest: 100
- Lowest: 47
- Pass rate: 80.0%

Result: Partly matched. Invalid values were ignored correctly, but the average was displayed as 71.6 instead of 71.60.

### Case C
Input: `10, 20, 30`

Rocket output:
- Valid marks: 3
- Average: 20.0
- Highest: 30
- Lowest: 10
- Pass rate: 0.0%

Result: Partly matched because the average did not use exactly two decimal places.

### Case D
Input: `abc, , xyz`

Rocket output:
`No valid marks found. Enter numbers between 0 and 100.`

Result: Matched. The app showed a clear message and did not crash.

## 6. Follow-up Prompt

The average mark should always be displayed with exactly two decimal places, for example 67.00 and 71.60. Please fix this without changing the other calculations.

## 7. Result of the Fix

Rocket changed the Class Average display to always show exactly two decimal places.

I tested Case A again:

Input: `85, 23, 45, 90, 92`

Output:
- Average: 67.00
- Highest: 92
- Lowest: 23
- Pass rate: 60.0%
- Total marks: 5

Result: Fixed. The average now matches the required format and the other calculations still work correctly.