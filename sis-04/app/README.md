# Smart Campus Room Availability Checker

The catalog uses fictional rooms and a fixed 09:00 clock. Select preferred equipment and enter headcount to see matching rooms. Pick a room, enter a time interval, and select **Check**. Changing rooms after a check reevaluates the same slot. Changing filters or times clears the old verdict.

Run the app from this directory with Node.js and npm.

```sh
npm install
npm run dev
```

Run the automated checks from the same directory.

```sh
npx vitest run
npm run typecheck
npm run lint
npm run build
```

The fixtures live in `src/rooms.ts`, availability in `src/booking.ts`, and filter rules in `src/filter.ts`. The React page and its components handle input and feedback.
