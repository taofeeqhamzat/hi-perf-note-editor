# High-Performance Treatment Note Editor

This is a small ghost project inspired by Cliniko (Red Guava). The goal is to show how I’d approach a **high‑performance, resilient treatment note editor** in a React/Next.js context.

## Problem

Treatment notes are long, sensitive, and frequently edited. In a typical SPA, it’s easy to end up with:

- Typing lag on large notes
- Fragile state management across components
- Drafts being lost on refresh or tab crash

For practitioners, this translates into stress and wasted time.

## Approach

This editor focuses on three user-facing guarantees:

1. **Instant typing** – typing should remain responsive even for multi‑thousand‑word notes.
2. **Safe drafts** – drafts are saved in the background and restored after reload/crash.
3. **Clear status** – a subtle “last saved” indicator builds trust that work isn’t lost.

Under the hood, the implementation uses:

- React + Next.js (App Router, TypeScript)
- Local persistence (e.g. IndexedDB via `idb-keyval`) for draft recovery
- State patterns that avoid unnecessary re‑renders on every keystroke
- Vitest + React Testing Library for behaviour and cleanup

<!-- *(Update this list to match the exact stack you ended up using.)* -->

## Running the Project

```bash
# install dependencies
npm install

# run dev server
npm run dev

# run tests
npm test
```

Then visit `http://localhost:3000` (or the dev URL) to interact with the editor.

## What I’d Extend Next

If this were going into a real Cliniko codebase, next steps would include:

- Integrating with existing auth and treatment note APIs
- Adding basic “snippet” / template insertion for common note patterns
- Hardening performance with real production data sizes
- Expanding the test suite for edge cases and regression coverage
