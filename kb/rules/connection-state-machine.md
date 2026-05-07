# Rule: Connection State Machine (Complete)

**Applies to:** All connection-related pages and flows

## States

| State | Pill | Color | Terminal? |
|---|---|---|---|
| Pending | "Pending" | Yellow | No |
| Connected | "Connected" | Green | No |
| Declined | "Declined" | Red | Yes (but re-send allowed) |

## Transitions

| From | To | Triggered by |
|---|---|---|
| Pending | Connected | Recipient clicks Accept |
| Pending | Declined | Recipient clicks Decline |
| Declined | Pending | Sender re-sends new request |

## Side effects

- Accept → feed notification to both parties
- Accept → unlocks dependent features (requests, rollups)
- Decline → feed notification to both parties
- Decline → requester sees red Declined pill
- Re-send → creates fresh Pending request

## Gating rules

- Pending connections: excluded from Create a Request, Roll-Up indicator search
- Only Connected relationships count as Portfolio Members
