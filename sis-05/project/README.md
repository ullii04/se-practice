# Smart Campus room availability demo

This React and TypeScript project checks one fictional room at a fixed 09:00 clock. The optional explanation uses a local mock. No external service or credential is required.

Use Node.js 24 and npm. From this directory, install the committed dependency set and start Vite.

```sh
npm ci
npm run dev
```

Open the local address printed by Vite. Enter 11:00–12:00 and choose Check. The demo booking ends at 11:00, so the request is available. Choose Explain availability to view the mock explanation. The failure checkbox exercises the local fallback.

```sh
npm test
npm run lint
npm run typecheck
npm run build
```
