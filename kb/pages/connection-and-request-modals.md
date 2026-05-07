# Connection & Request Modals

## Add Connection — multi-step modal

**Step 1 — Search:** 1-char minimum, returns Portfolio/Project/Program/Org profiles
**Step 2 — Select:** click result tile
**Step 3 — Assign Relationship:** tile selector — options depend on Profile A + B types
  (see `rules/connection-relationship-matrix.md`)
**Step 4 — Confirmation:** "{Name} is your {Relationship}" + **Send Connection Request**
**Step 5 — Toast:** "Connection request sent successfully"

Already-connected profiles appear **greyed-out** with "Connected" indicator — cannot be selected.

## Create a Request modal

Fields: Select Portfolio Member * (confirmed only) | Select Indicators * | Assign Narrative Template (opt) | Due Date * | Repeat Frequency *

Portfolio Member dropdown filters by connection type:
- Funder sees: Grantees only
- Investor sees: Investees only
- Network sees: Members only
Partners are **never** listed.

See `rules/create-request-gating.md`.

## Borrow an Indicator — stub modal

Unimplemented placeholder. Save permanently disabled.
