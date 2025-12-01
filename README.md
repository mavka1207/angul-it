# Multi-Stage Image CAPTCHA

This project is an Angular application that implements a multi-stage image CAPTCHA game.
Users complete three visual challenges (space cats, magic potions, and clocks) in a randomized order, with their progress and selections persisted across navigation.

---

## Features

### Three distinct stages

* **Space cats**: select all images with a cat in space.
* **Magic potions**: select potions with blue liquid and a moon symbol.
* **Clocks**: select clocks showing the time **3:15**.

### Flow & behavior

* **Randomized stage order per session** using a challenge order stored in `sessionStorage`.
* **Per-stage image shuffle** that is persisted and restored when returning to a stage.
* **Back/forward navigation** between stages with restored user selections.

### Result screen

* Verifies that **all stages have been completed**.
* Shows a **success message** when everything is done.
* Redirects the user to the **first incomplete stage** if something is missing.

---

## Tech stack

* **Angular** (standalone components, Angular CLI 20+)
* **Angular Router** for navigation between:

  * Home
  * CAPTCHA
  * Result screens
* **Angular Material**:

  * `MatButtonModule`
  * `MatCardModule`
* **CSS/SCSS** for layout and styling
* **sessionStorage** for client-side state management

---

## Project structure (key parts)

### `src/app/components/home`

Home screen; resets state and starts a new CAPTCHA session.

### `src/app/components/captcha`

Main CAPTCHA flow; shows one stage at a time with image selection and validation.

### `src/app/components/result`

Result screen that shows completion status or guides the user back to incomplete stages.

### `src/app/services/challenge.service.ts`

* Defines base challenges (cats, potions, clocks).
* Randomizes stage order and shuffles images per stage.
* Persists and restores:

  * shuffle
  * current index
  * completion data

### `src/app/constants/storage-keys.ts`

Centralized keys and configuration for `sessionStorage` and messages.

### `src/app/models/challenge.model.ts`

Types for challenges and image items.

---

## State management

The application relies on `sessionStorage` to keep the CAPTCHA experience consistent:

* `captcha-current-index` — index of the current stage.
* `captcha-shuffle-stage-*` — per-stage image order.
* `captcha-selection-history` — selected image indices for each stage.
* `captcha-challenge-order` — randomized order of stages.
* `captcha-completed-stages` — list of completed stage indices.

This allows:

* Reloading the page **without losing** the current stage order.
* Navigating **back and forth** between stages while keeping selections.
* Determining which stages are **incomplete** on the Result screen.

---

## Getting started

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
ng serve
```

### Open the app in your browser

```text
http://localhost:4201/
```

The application will automatically reload when you change source files.

---

## Usage flow

1. Open the **Home** screen.
2. Click the button to **start the CAPTCHA challenge**.
3. Complete each stage by selecting the correct images and submitting.
4. Navigate between stages if needed to adjust your answers.
5. After all stages are completed, you will be redirected to the **Result** screen:

   * If all stages are valid, a **success message** is shown.
   * If some stages are incomplete, you will be redirected to the **first incomplete** one.

---

## Building

To create a production build:

```bash
ng build
```

The build artifacts will be generated in the `dist/` directory.
Production builds are optimized for performance.

---

## Testing

### Unit tests

Run unit tests with Karma:

```bash
ng test
```

This executes the configured test suite for components and services.

### End-to-end tests

End-to-end (e2e) tests can be run with Cypress (see `cypress.config.ts` and tests under `cypress/` such as `responsive.cy.js`):

```bash
npx cypress open
# or
npx cypress run
```

Use these tests to verify:

* User flow
* Responsiveness
* Core CAPTCHA behavior in the browser

---

## Notes

This project is intended as a demo/learning project for:

* Multi-stage UI flows in Angular.
* Managing client-side state with `sessionStorage`.
* Building small, focused services for game-like logic.
