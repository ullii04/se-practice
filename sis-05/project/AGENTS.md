# Smart Campus project instructions

## Purpose

Maintain the one-room fictional availability demo. Preserve the deterministic verdict and keep the mock explanation separate.

## Architecture

- `src/main.tsx` mounts `src/App.tsx`, which owns form and demo room state.
- `src/booking.ts` decides availability. `src/lib/validation.ts` adapts the result for the UI.
- `src/explain.ts` validates explanation inputs and outputs, runs the local mock, and provides the fallback.
- `src/components/` renders controls, bookings, timeline, verdict and explanation. `src/lib/sampleData.ts` holds the fixture.

## Setup

Use Node.js 24 and npm. Run `npm ci` from this directory, then `npm run dev` and open the loopback URL printed by Vite.

## Safe commands

- Install the lockfile dependencies with `npm ci`.
- Run tests with `npm test`.
- Check lint with `npm run lint` and types with `npm run typecheck`.
- Build locally with `npm run build`.
- Start the local demo with `npm run dev`.

## Coding conventions

Use typed, pure booking rules and explicit UI state. Keep changes focused and preserve the 120-minute maximum, endpoint-touching behavior, and unchanged fixtures during checks. Use fictional data and the local mock.

## Test expectations

Run tests, lint, type checking and build before requesting review. For a bug fix, add a focused regression and retain the existing suite. Attach the diff and verification results. Obtain human approval before merging.

## Forbidden actions

- Never commit secrets, credentials, or personal data.
- Do not deploy to production or publish the demo externally.
- Do not run destructive commands or rewrite Git history.
- Do not change dependencies or the lockfile without human review.
