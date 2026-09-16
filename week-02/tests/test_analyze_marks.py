import sys
import importlib.util

if len(sys.argv) != 2:
    print("Usage: python tests/test_analyze_marks.py code/prompt_x.py")
    sys.exit(1)

path = sys.argv[1]

try:
    spec = importlib.util.spec_from_file_location("solution", path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
except Exception as e:
    print(f"ERROR loading {path}: {type(e).__name__}: {e}")
    sys.exit(1)

if not hasattr(module, "analyze_marks"):
    print(f"Testing: {path}")
    print("ERROR: analyze_marks function is missing")
    print("Totals: 0 PASS · 0 FAIL · 6 ERROR")
    sys.exit(0)

func = module.analyze_marks

tests = [
    ([40, 60, 80], 50,
     {"average": 60, "highest": 80, "lowest": 40, "pass_rate": 66.67}),
    ([100], 50,
     {"average": 100, "highest": 100, "lowest": 100, "pass_rate": 100}),
    ([49.5, 50], 50,
     {"average": 49.75, "highest": 50, "lowest": 49.5, "pass_rate": 50}),
]

error_tests = [
    ([], 50),
    ([40, "60"], 50),
    ([-1, 50, 101], 50),
]

passed = 0
failed = 0
errors = 0

print(f"Testing: {path}")

for i, (marks, pass_mark, expected) in enumerate(tests, 1):
    try:
        result = func(marks, pass_mark)

        correct = (
            isinstance(result, dict)
            and all(key in result for key in expected)
            and all(
                abs(result[key] - expected[key]) <= 0.01
                for key in expected
            )
        )

        if correct:
            print(f"Case {i}: PASS — {result}")
            passed += 1
        else:
            print(f"Case {i}: FAIL — returned {result}")
            failed += 1

    except Exception as e:
        print(f"Case {i}: ERROR — {type(e).__name__}: {e}")
        errors += 1


for i, (marks, pass_mark) in enumerate(error_tests, 4):
    try:
        result = func(marks, pass_mark)
        print(f"Case {i}: FAIL — returned {result}, expected ValueError")
        failed += 1

    except ValueError as e:
        print(f"Case {i}: PASS — ValueError: {e}")
        passed += 1

    except Exception as e:
        print(f"Case {i}: ERROR — {type(e).__name__}: {e}")
        errors += 1


print(f"Totals: {passed} PASS · {failed} FAIL · {errors} ERROR")