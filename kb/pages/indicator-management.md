# Indicator Management

**URL:** `/console/{profileId}/indicator-management`
**Accessible to:** Funder (verified), Implementer (verified via TCs), Both

## What's on the page

- **Page header:** "Indicator Management"
- **Page subheader:** "Create an indicator or borrow one from the Indicator Bank."
- **+ Add Indicator** dropdown: Create an Indicator | Borrow an Indicator (stub)

### Indicators table
Columns: Indicator Name (+ KPI pill + ⓘ icon) | Type | Source | Data Type | Last Updated | Actions (✏️ 🗑️)

### ⓘ Info popover
Shows: Name + Type pill, DESCRIPTION, DATA SOURCE, METHODOLOGY.
Notes intentionally hidden.

## Edit indicator (✏️)

Opens same modal as creation, pre-filled. Edit behavior depends on
whether results exist — see `rules/indicator-edit-restrictions.md`.

## Delete indicator (🗑️)

Deletes the indicator. Works even when results exist (verified via TCs).
Confirmation prompt behavior: see `_open-questions.md` Q10.

## Persona differences

- **Funder:** Can create Input + Roll-Up indicators.
- **Implementer:** Can create Input only. Roll-Up creation NOT available
  (see `rules/implementer-no-rollup.md`).
- **Both:** Can create Input + Roll-Up.

## Notes

- "HAS RESULTS" note appears on grouping cards when editing an indicator
  that has results (see `rules/indicator-edit-restrictions.md`).
