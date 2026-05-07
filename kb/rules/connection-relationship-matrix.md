# Rule: Connection Relationship Type Matrix

**Applies to:** `flows/send-connection-request.md`, `pages/connection-and-request-modals.md`

## What the rule says

Available relationship types when connecting Profile A → Profile B depend
on both profiles' types.

### Partner (always available)
**Partner** is shown regardless of Profile A and Profile B types.
It is a peer relationship — neither side is "above" the other.

### Grantee / Investee (Portfolio Member relationships)
Shown when Profile A is **Portfolio** or **Org (Funder/Both)** AND
Profile B is **Project, Program, or Org (Implementer/Both)**.

These create a Funder→Grantee or Investor→Investee hierarchy.

### Funder / Investor (reverse of above)
Shown when Profile A is **Project/Program** OR **Org (Implementer/Both)** AND
Profile B is **Portfolio or Org (Funder/Both)**.

### Network (Org-to-Org only)
Shown **only** when **both** Profile A and Profile B are **Org**-type profiles
(any org type: Funder, Implementer, or Both).
Hidden when either A or B is Project, Program, or Portfolio.

### Member (Org-to-Org only)
Shown **only** when **both** Profile A and Profile B are **Org**-type profiles
(any org type: Funder, Implementer, or Both).
NOT shown when either A or B is Portfolio, Project, or Program.

## Matrix summary

| Profile A type | Profile B type | Available relationships |
|---|---|---|
| Any | Any | Partner |
| Portfolio / Org (Funder/Both) | Project / Program / Org (Impl/Both) | Partner, Grantee, Investee |
| Project / Program / Org (Impl/Both) | Portfolio / Org (Funder/Both) | Partner, Funder, Investor |
| Org (any) | Org (any) | Partner, Network, Member |
| Portfolio / Project / Program | Any | Partner (+ context-specific above; NOT Network, NOT Member) |

## Hints for test generation

- Generate one test per row in the matrix.
- Include negative tests: Member and Network NOT shown for Portfolio→Any or Project→Any.
- Already-connected profiles must be greyed-out with no relationship selector.
- Org (BOTH) type counts as both funder-side and implementer-side.
