# Rule: Rollup Eligibility by Connection Type

**Applies to:** `flows/create-rollup-indicator.md`

## What the rule says

Only **Portfolio Member** indicators are eligible for rollup aggregation.

| Connection relationship | Eligible for rollup? |
|---|---|
| Grantee | ✅ Yes |
| Investee | ✅ Yes |
| Member | ✅ Yes |
| **Partner** | ❌ No — explicitly excluded |

## Who can create rollups

| Role | Can configure rollup? |
|---|---|
| Funder | ✅ (aggregates Grantee indicators) |
| Investor | ✅ (aggregates Investee indicators) |
| Network | ✅ (aggregates Member indicators) |
| Grantee / Investee / Member | ❌ Cannot rollup against their Funder/Investor/Network |

## Notes

- Partner indicators never appear in rollup source selection even when both
  Partner and Portfolio Member connections exist.
- Only profiles with a valid affiliation record are available as rollup sources.
