# Feed Screen (Your Feed)

**URL:** `/feed/{profileId}`
**Accessible to:** All logged-in users

## What this page is for

The true landing page after login. Shows activity feed posts, profile panels,
and portfolio/project navigation. This is the **home page** of the
application (not the Console Dashboard, which is profile-scoped).

## How users get here

- After login → lands here automatically
- Top nav → **Home** or **Common Ground logo**

## What's on the page

### Main content area (left)
- **Activity feed** — posts displayed newest to oldest
- Each post shows: timestamp (e.g., "3 days ago"), content, Comment icon
- **"Filter by"** dropdown above the feed — filter by categories
- **"Last 30 days"** dropdown — time range filter

### Right panels (vary by persona)

**Funder:**
- **"Your Profile"** panel — member card with profile name, image, cover image
- **"Your Portfolios"** panel — list of portfolios + "**+**" button to add new

**Implementer:**
- **"Your Profile"** panel — same structure
- **"Your Projects"** panel — list of projects + "**+**" button to add new

**Both (Funder + Implementer):**
- **"Your Profile"** panel
- **"Your Portfolios"** panel + "**+**" button
- **"Suggested Profiles to Follow"** section

### Header area
- **Profile dropdown** — shows list of profiles with "**+ Add a Profile**"
  button → navigates to Profile Builder for new profile creation

## Where users can go from here

- Click a Portfolio/Project card → Console Dashboard for that profile
- Click "**+**" button under panels → Profile Builder for new profile
- Click "**+ Add a Profile**" in header dropdown → Profile Builder
- Click any feed post → post detail
- Top nav Home / Logo → stays here

## Notes

- Clicking a portfolio card navigates to that profile's Console Dashboard.
- The right-side panels differ by org type — see `rules/feed-panels-by-persona.md`.
- This is distinct from Console Dashboard; Feed is org-level, Dashboard is profile-level.
