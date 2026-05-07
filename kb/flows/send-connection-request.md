# Flow: Send a Connection Request

**Performed by:** All personas
**Starts on:** Connections and Requests page
**Ends on:** Same page (new Pending row)

## Steps

1. Click **+ Add Connection**.
2. Search for target profile (1-char minimum).
3. Select a result tile.
4. **Assign Connection Relationship** — tiles shown depend on Profile A + B types
   (see `rules/connection-relationship-matrix.md`).
5. Click relationship tile.
6. Confirmation: "{Name} is your {Relationship}".
7. Click **Send Connection Request**.
8. Toast: "Connection request sent successfully"
9. New card appears with yellow **Pending** pill.

## What can go wrong

- Target already connected → greyed-out in search, non-selectable
- No relationship type selected → Send button disabled

## Notes

- Sender sees own Pending request in My Connections.
- Already-connected profiles have "Connected" indicator and are non-interactive.
