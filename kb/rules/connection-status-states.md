# Rule: Connection Status States

**Applies to:** `pages/connections-and-requests.md`

## States

| State | Pill | Color | Meaning |
|---|---|---|---|
| **Pending** | "Pending" | Yellow | Request sent, awaiting response |
| **Connected** | "Connected" | Green | Accepted by recipient |
| **Declined** | "Declined" | Red | Rejected by recipient |

## Transitions

- Pending → Connected (recipient accepts on Invitations tab)
- Pending → Declined (recipient declines on Invitations tab)
- Declined → Pending (sender re-sends; see `rules/resend-after-decline.md`)

## Visibility

- **Sender:** Sees Pending/Connected/Declined in My Connections
- **Recipient:** Sees incoming requests on Invitations tab; after
  accept/decline, sees result in Connections tab

## Hints for test generation

- Verify pill color + text for each state.
- Verify state change triggers on both sender and recipient sides.
