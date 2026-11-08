The failure comes from inclusive overlap comparisons:

```ts
if (start <= b.end && end >= b.start) return false;
```

For T01, `start === b.end === 660`, so the function incorrectly rejects bookings that touch at an endpoint, violating AC4.

There is also a separate AC5 violation: `bookings.push(...)` changes booking data when checking availability.

Minimal patch:

```diff
-    if (start <= b.end && end >= b.start) return false;
+    if (start < b.end && end > b.start) return false;
   }
-  // keep the room's list current with the slot that was just found free
-  bookings.push({ start, end });
   return true;
```

Regression tests should verify:

- Existing `[600, 660]`, request `[660, 720]`: `true`.
- Existing `[720, 780]`, request `[660, 720]`: `true`.
- Existing `[600, 661]`, request `[660, 720]`: `false`.
- Booking data remains deeply unchanged after both accepted and rejected checks.

Use `now=540` and `blocked=false` for these cases. No tests were run.
