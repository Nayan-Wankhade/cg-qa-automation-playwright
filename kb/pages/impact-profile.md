# Impact Profile (Public View with Indicators)

**URL:** `/profile-view/{profileId}` (enhanced view)
**Accessible to:** Profile owners + public viewers

## What this page is for

The comprehensive public-facing profile showing the organization's impact
data, including indicators, chart visualizations, portfolio members, and
profile prompt sections.

## How users get here

- Console Dashboard → **"View my Impact Profile"** card
- Feed → profile card click
- Direct URL share

## What's on the page

### Fixed left panel
- **Section Names** as navigation links
- Clicking a section name scrolls to that section

### Main content sections (scrollable)
- **Profile header** — name, logo, description, location
- **Share** button + **Download** button + **Edit Profile** button
- **Indicators section** — indicators grouped by category:
  Operational / Financial / Reach / Depth
  - Each indicator has a **dropdown** to select it
  - **Grouping selector** — choose data grouping
  - **Chart type selector** — switch visualization type
  - **Date range selector** — filter by period
  - **Download button** for indicator data
  - **Legends** displayed for selected chart
- **Portfolio Members section** — lists connected profiles by relationship:
  - Funder sees: Grantees, Investees (if Investor role)
  - Network sees: Members
- **Profile Prompts sections** — custom content sections with rich text and images

## Persona-specific behavior

**Funder:** Can change grouping, chart type, date range for indicators.
Sees Grantees under Portfolio Members.

**Implementer:** Same visualization capabilities. Sees own tracked indicators.

**Both:** Union of both views.

## Notes

- Impact Profile is distinct from the simple Public Profile View documented
  in the exploration session — it includes indicator visualizations and
  portfolio member listings that the basic view does not.
- "View More" button appears on profile prompt descriptions exceeding
  300 characters.
