# Profile Builder

**URL:** `/console/{profileId}/profile-builder`
**Accessible to:** All personas for their own profiles

## What this page is for

Multi-tab editor for constructing the public profile.

## How users get here

- Left sidebar → **Profile Builder**
- Feed → "**+**" button under Your Portfolios/Projects panel → creates new profile
- Feed → "**+ Add a Profile**" in header Profile dropdown → creates new profile

## Five tabs

### Tab 1 — Profile Details
Required fields: Profile Image/Logo *, Profile Name *, Description *,
Profile Category * (6 items), Country * (165 countries), Start Date *
(native date picker only)
Optional: Website

### Tab 2 — Themes / Populations / SDGs
Multi-select: Themes (226), Populations Served (135), SDGs (17)

### Tab 3 — Profile Prompts
Add Prompt modal with Section Title, rich-text Description, Image ≤2MB.
See `pages/profile-prompts.md` for full CRUD.

### Tab 4 — Multimedia (disabled until Tab 1 saved)
### Tab 5 — Files (disabled until Tab 1 saved)

Buttons per tab: **Cancel** / **Save and Next** (or **Save** on last tab)

## Profile creation from Feed

When creating a new profile via Feed's "+" button:
- Navigates to Profile Builder
- After filling details and clicking **NEXT** then **SAVE** (or just **SAVE**),
  new profile appears in the respective Feed panel
- New profile is visible when clicking "Impact Profile" option

## Notes

- Start Date: native date picker only — does NOT accept typed text.
- Profile completeness stuck at ~65% without Profile Image/Logo.
