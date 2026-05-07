# Connections and Requests

**URL:** `/console/{profileId}/connections-management`
**Accessible to:** All personas

## What this page is for

Manage portfolio members (connections) and report requests.

## Two tabs: Connections | Invitations

### Connections tab — My Connections panel
- **+ Add Connection** button
- **Bulk Upload** button
- Connection cards: Logo | Name | Location | Connection Type | Status pill | Drill-down arrow
- Status pills: **Pending** (yellow), **Connected** (green), **Declined** (red)

### Connections tab — Request Management panel
- **+ Create a Request** button
- Table: Portfolio Member | Request Details | Request Schedule | Last Updated | Status | Actions
- Request statuses: **Pending**, **Up to Date**, **Overdue**

### Invitations tab
- Lists incoming connection requests for the current profile
- Each invitation card shows: requester profile details, **Accept** button, **Decline** button
- Empty state: "No invitations" message when no pending requests
- After Accept: request disappears from Invitations, appears in Connections as Connected
- After Decline: confirmation modal appears first

## Connection status pills

| Status | Pill color | Meaning |
|---|---|---|
| Pending | Yellow | Request sent, awaiting response |
| Connected | Green | Accepted by recipient |
| Declined | Red | Rejected by recipient |

See `rules/connection-status-states.md` for full lifecycle.

## Notes

- Already-connected profiles appear **greyed-out** in search with "Connected" indicator.
- After decline, sender **can** re-send a new request (see `rules/resend-after-decline.md`).
- Pending connections excluded from Create a Request dropdown.
