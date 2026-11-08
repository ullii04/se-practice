| Defect | Evidence | Root cause | Fix | Test |
|---|---|---|---|---|
| **Confirmed: endpoint contact is rejected, violating AC4.** | T01 requests `[660,720]` beside existing `[600,660]`; the supplied failure reports `false` instead of `true` at `src/booking.test.ts:29`. | `start <= b.end && end >= b.start` treats touching endpoints as overlap. For T01, both comparisons are true. | Use `start < b.end && end > b.start`. | With the supplied T01 fixture, expect `true`. Also test a request ending at an existing booking’s start; expect `true`. A genuine overlap must return `false`. |
| **Confirmed: successful checks mutate booking data, violating AC5.** | The provided function calls `bookings.push({ start, end })` before returning `true`. T01 currently exits before reaching this line. | An availability check also creates a booking. | Remove the `bookings.push(...)` statement. | Use a valid request with `bookings=[]`; expect `true` and the array to remain empty. |

**Hypothesis requiring clarification:** `start > now` rejects a request beginning exactly now. AC1 prohibits requests in the past but does not explicitly settle equality. If starting now is allowed, change this check to `start >= now` and add an equality regression test.

The supplied fixture provides a deterministic reproduction by inspection; I did not execute tests. AC6 cannot be assessed from the provided function and failure.
