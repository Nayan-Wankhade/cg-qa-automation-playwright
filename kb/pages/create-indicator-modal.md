# Create Indicator — Modal Flow

**Surface:** Modal over Indicator Management

## Step 1 — Indicator Setup
- **Indicator Name** * (minimum 3 characters — see `validations/indicator-name-minimum.md`)
- **Description** (optional)
- **Configuration tiles:** Input | Roll-Up
- **Next** disabled until name (≥3 chars) + tile selected

## Step 2A — Input mode
Required: Data Type * | Reporting Frequency * | Geographic disaggregation * | Indicator Type *
Optional: Grouping (+ Add a new grouping) | Data Source | Methodology | Notes | Cumulative checkbox | KPI checkbox

## Step 2B — Roll-Up mode
- Data Type locked to Number
- Only Funder and Both can access this (see `rules/implementer-no-rollup.md`)
- Child indicators must be from confirmed Portfolio Members (Grantee/Investee/Member)
- Partner indicators excluded (see `rules/rollup-eligibility-by-connection-type.md`)
- Only summation aggregation

## Grouping management
- Select grouping from dropdown (e.g., Age) → card displayed
- Click same grouping again → deselects (card removed)
- "+ Add a new grouping" → create custom grouping inline
- Edit grouping values: add new values, delete existing values
- Delete entire grouping/group

## Notes

- Indicator Name < 3 characters shows error message.
- Implementer sees Create an Indicator → Step 1 → only Input tile available.
