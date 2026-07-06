# Bible Study Arcade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static, mobile-first Bible Study Arcade hub with three playable Bible learning games and links to the existing Apostles Quest and New Testament Trail games.

**Architecture:** Keep the experience static and dependency-free under `public/apps/bible-study/`. Put reusable quiz/session behavior in a small engine module, content in a separate data module, and DOM rendering in an app module so future Bible games can reuse the same loop without becoming another large single-file app.

**Tech Stack:** Static HTML, CSS, browser ES modules, Node validator scripts, Vite public asset copying, Cloudflare Pages Direct Upload.

---

### Task 1: Validation Gate

**Files:**
- Create: `tests/validate-bible-study-arcade.mjs`
- Modify: `package.json`

- [ ] **Step 1: Write the failing validator**

Validate that `/public/apps/bible-study/` exists, the page links its CSS and module script, the data exports three playable packs, every challenge has a reference, short explanation, concept, difficulty, and useful wrong-answer notes, and the app avoids account, notification, and guilt-loop language.

- [ ] **Step 2: Run validator to verify it fails**

Run: `node tests/validate-bible-study-arcade.mjs`

Expected: failure because `public/apps/bible-study/index.html` does not exist yet.

### Task 2: Shared Static Game Modules

**Files:**
- Create: `public/apps/bible-study/bible-data.mjs`
- Create: `public/apps/bible-study/quiz-engine.mjs`

- [ ] **Step 1: Add data module**

Export existing-game launch cards and the first three new content packs: `who-said-it`, `match-the-miracle`, and `pauls-journey-map`.

- [ ] **Step 2: Add quiz engine**

Export deterministic helpers for shuffling, round creation, answer checking, progress, and session restart. The engine owns game state; the renderer only displays it.

### Task 3: Arcade UI

**Files:**
- Create: `public/apps/bible-study/index.html`
- Create: `public/apps/bible-study/styles.css`
- Create: `public/apps/bible-study/app.mjs`

- [ ] **Step 1: Build the page shell**

Create a mobile-first app screen with game selector, play panel, answer buttons, feedback, reference/explanation display, route progress for Paul, and quick links to Apostles Quest and New Testament Trail.

- [ ] **Step 2: Wire rendering**

Use the shared engine to render one challenge at a time, handle answers, advance rounds, restart rounds, and switch games without reloading.

### Task 4: Site Wiring

**Files:**
- Modify: `src/App.jsx`
- Modify: `public/_headers`
- Modify: `tests/validate-headers.mjs`
- Modify: `README.md`
- Modify: `docs/MR_COM_PROJECT.md`
- Modify: `scripts/release-mrcom.ps1`
- Modify: `package.json`

- [ ] **Step 1: Add homepage launch card**

Add Bible Study Arcade as the first app card, linking to `/apps/bible-study/`.

- [ ] **Step 2: Add cache headers and release checks**

Add `/apps/bible-study/*` to `_headers`, header validation, docs, and release live-check routes.

### Task 5: Verification

**Files:**
- All modified files

- [ ] **Step 1: Run focused validator**

Run: `node tests/validate-bible-study-arcade.mjs`

Expected: pass.

- [ ] **Step 2: Run full project check**

Run: `npm run check`

Expected: pass.

- [ ] **Step 3: Run production build**

Run: `npm run build`

Expected: pass. Existing broad-site chunk warning is acceptable if unchanged.
