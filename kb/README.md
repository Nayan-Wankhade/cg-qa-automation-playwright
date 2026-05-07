# Common Ground — QA Knowledge Base

Source of truth for how the Common Ground application behaves.

**Host:** `thankful-sea-05063b903.2.azurestaticapps.net`

**Coverage:** Funder Org (verified via live exploration), Implementer Org
and Both Org (documented from test case analysis). 12 feature areas:
User Sign Up, Feed Screen, Header, Console Navigation, Profile Builder,
Profile Prompts, Connections & Requests, Indicator Management, Results
Management, Analytics, Impact Profile, Sharing Settings.

**Sources:** Live app exploration (Funder persona) + 726 test cases
across 12 Excel files.

---

## Folder structure

| Folder | Question it answers |
|---|---|
| `pages/` | "What does this screen have on it?" |
| `flows/` | "What steps does a user take to accomplish X?" |
| `rules/` | "What business logic governs this behavior?" |
| `validations/` | "What input is accepted or rejected?" |
| `personas/` | "What does this user type see and can do?" |

Root files: `_changelog.md` (auto-update audit trail),
`_open-questions.md` (unverified items), `metadata-defaults.md`
(Excel column O–U defaults).

---

## Local KB — sync instructions

This folder is the **local mirror** of the GitHub KB repo (`cg-qa-knowledge-base`).

- During `/cg-automate` runs: all reads and writes go to this local folder only.
- To push local changes to GitHub: run `/kb-sync` (end-of-day sync).
- To pull latest from GitHub: run `/kb-pull` (overrides local with remote).

Only `selectors/` and `execution-reports/` are written during runs.
`pages/`, `validations/`, `rules/`, `personas/`, `flows/` are read-only reference.

---

_Test push — 2026-04-26_
