# Acceptance criteria — three selected stories

Assumptions first, then the criteria. Each block names the story it belongs to. 3 to 5 criteria per
story, every one in Given / When / Then form, and every set covers a validation or error case — not
three happy paths.

---

## Assumptions

- **Overlap:** a booking that ends exactly when another begins is allowed under R3, because the bookings touch at the boundary but their time periods do not overlap.
- **Duration:** a booking of exactly two hours is allowed under R2, because "at most two hours" includes exactly two hours.
- A student can cancel only a booking they made.

---

## US-02 — Book Room

### AC-01
- **Given** the room is available and not blocked, and the selected start time is in the future
- **When** the student books the room for a time slot of two hours or less
- **Then** the booking is created successfully and the selected time slot becomes unavailable.

### AC-02
- **Given** the selected time slot starts in the past or at the current time
- **When** the student tries to book the room
- **Then** the booking is rejected.

### AC-03
- **Given** an available and unblocked room is selected
- **When** the student requests a booking lasting exactly two hours
- **Then** the booking is allowed, provided the other booking rules are satisfied.

### AC-04
- **Given** the room already has an existing booking
- **When** the student requests a time slot that overlaps the existing booking
- **Then** the booking is rejected; a booking starting exactly when the existing booking ends is allowed.

### AC-05
- **Given** the room is blocked
- **When** the student tries to book the room
- **Then** the booking is rejected.

---

## US-03 — Cancel Booking

### AC-06
- **Given** the student has an existing booking that they made
- **When** the student cancels the booking
- **Then** the booking is removed and the time slot becomes available again if the room is not blocked.

### AC-07
- **Given** a booking was made by another student
- **When** the student tries to cancel that booking
- **Then** the cancellation is rejected and the booking remains unchanged.

### AC-08
- **Given** the booking has already been cancelled or does not exist
- **When** the student tries to cancel it
- **Then** the cancellation is rejected and no booking is changed.

---

## US-05 — Block or Unblock Room

### AC-09
- **Given** the administrator selects an unblocked room
- **When** the administrator blocks the room
- **Then** the room becomes blocked and students cannot create new bookings for it.

### AC-10
- **Given** the room is currently blocked
- **When** the administrator unblocks the room
- **Then** the room becomes available for booking again, subject to existing bookings.

### AC-11
- **Given** an unblocked room has an existing future booking
- **When** a student requests another booking that overlaps the existing booking
- **Then** the new booking is rejected.