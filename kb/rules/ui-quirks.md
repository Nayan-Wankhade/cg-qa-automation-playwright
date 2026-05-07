# UI Quirks and Known Issues

- **`#redwood-announcer` ARIA live region always present in DOM** --
  Redwood.js injects `<div role="alert" aria-atomic="true" aria-live="assertive" id="redwood-announcer"></div>`
  into every page. It always exists, always has `role="alert"`, and is always empty.
  A plain `[role="alert"]` selector will resolve to this element first (DOM order),
  causing `toContainText(...)` to fail with `Received string: ""`.
  **Rule for all toast selectors in BasePage and any Page Object:**
  Always use both guards together:
  1. `:not(#redwood-announcer)` -- exclude by ID
  2. `.filter({ hasText: /\S/ })` -- exclude any empty ARIA element regardless of ID
  The correct pattern (already implemented in `BasePage.expectSuccessToast` and
  `BasePage.expectErrorToast`) is:
  ```typescript
  .locator('[role="alert"]:not(#redwood-announcer), [data-testid="toast-success"]')
  .filter({ hasText: /\S/ })
  .first()
  ```
  Never simplify this back to `.locator('[role="alert"]').first()`.

- **Edit Profile on public profile → Dashboard** (not Profile Builder)
- **Download button on public profile → non-functional** (PostHog event only)
- **Borrow an Indicator → unimplemented** stub modal
- **Settings gear → non-functional** on Funder
- **Profile dropdown → ring toggle only** (single-profile users)
- **Avatar menu → Logout only**
- **Start Date → native picker only** (no typed input)
- **Time Period presets → don't auto-fill dates** in Add Result
- **Funder name inconsistency:** "Health Focused" vs "Health-Focused"
