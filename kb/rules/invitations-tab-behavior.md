# Rule: Invitations Tab Behavior

**Applies to:** `pages/connections-and-requests.md`

## What the rule says

- Invitations tab shows incoming connection requests for the current profile.
- Each invitation card has **Accept** and **Decline** buttons.
- Accept → profile moves to Connections tab with Connected status.
- Decline → confirmation modal → profile removed from Invitations.
- Declining sends a feed notification + sets Declined status on requester side.
- Empty state shown when no pending invitations exist.

## Notes

- Independent requests are independent: accepting request from Profile A
  does not affect a separate Pending request from Profile C.
