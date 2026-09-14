
marks = ["abc", "", "xyz"]
valid_marks = []

for item in marks:
    try:
        score = float(item)

        if 0 <= score <= 100:
            valid_marks.append(score)

    except (ValueError, TypeError):
        pass

if len(valid_marks) == 0:
    print("No valid marks found.")

else:
    count = len(valid_marks)
    average = sum(valid_marks) / count
    highest = max(valid_marks)
    lowest = min(valid_marks)

    passing = 0

    for score in valid_marks:
        if score >= 50:
            passing += 1

    pass_rate = passing / count * 100

    print(f"Valid marks: {count}")
    print(f"Average: {average:.2f}")
    print(f"Highest: {highest:g}")
    print(f"Lowest: {lowest:g}")
    print(f"Pass rate: {pass_rate:.1f}%")