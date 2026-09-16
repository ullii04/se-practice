marks = [78, 92, 56, 23, 86]

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
    total = sum(valid_marks)
    average = total / len(valid_marks)

    highest = max(valid_marks)
    lowest = min(valid_marks)

    passed = 0

    for mark in valid_marks:
        if mark >= 50:
            passed += 1

    pass_rate = (passed / len(valid_marks)) * 100

    print(f"Valid marks: {len(valid_marks)}")
    print(f"Average: {average:.2f}")
    print(f"Highest: {highest:g}")
    print(f"Lowest: {lowest:g}")
    print(f"Pass rate: {pass_rate:.1f}%")