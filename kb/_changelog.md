# KB Changelog

Auto-written updates appended here when users approve changes.

---

<!-- Entries appended below. Most recent at the bottom. -->

## 2026-04-27
- [SKILL] Replaced bash_tool curl GitHub access with github-kb-mcp local MCP server.
  All KB reads now use `github-kb-mcp → get_file`, all writes use `github-kb-mcp → update_file`.
  MCP server running at: /Users/nayan/Desktop/Common Ground/github-mcp-server/server.js
  Removed [TEST] placeholder entry from previous write test.
- [SKILL] Removed KB files from Claude Project context. GitHub via github-kb-mcp is now the
  sole source of truth for all KB reads. Added explicit warning in SKILL.md to never look for
  KB files in Project context.
- [SKILL] Fixed 3 issues:
  1. render_to_excel.py rebuilt — now produces 21-column (A-U) format matching
     TC_Connection_and_Request_Management template exactly (Persona col C, API details col I,
     yellow J/K/L execution cols, orange M review col, fix versions col U).
  2. Test case titles now use "Verify that..." format instead of "Happy path —" / "Negative —".
  3. Figma URL extraction fixed — now scans custom Jira fields (customfield_*) for "Figma File"
     field used in Vera Solutions Jira, plus node-id dash/colon format handling.

## 2026-04-28
- [RES-527] Updated `validations/profile-prompt-image.md`: added Image Cropper details (Crop
  your Image heading, fixed 16:9 ratio, Cancel / Save Cropped Image / X buttons), expanded
  supported formats list (JPG, JPEG, PNG, GIF, WebP), recommended/minimum resolution
  (1920×1080 / 1280×720), uploaded-image X-icon delete behaviour, and noted divergence from
  Figma tracked under bug RES-886. Source: RES-527 AC + Figma file
  NR4IJirEvpqzDIDzAoA6nh + ticket comment thread (Karishma D'Mello, Nayan Wankhade,
  2026-01-23 → 2026-01-27).
- [RES-527] Updated `pages/profile-prompts.md`: added image-cropping summary, placement rule
  (below Narrative, above Multimedia for V2), Untitled Section visibility rule (shown in
  builder, hidden on Impact Profile), and Known Bugs section listing RES-886 and RES-896.
  Source: RES-527 ticket comment thread.

## 2026-05-05
- [RES-816] Fixed `rules/connection-relationship-matrix.md`: corrected Network and Member rules.
  Previously stated Network shows when "A is any type AND B is Org" — this was wrong.
  Correct rule (confirmed by AC + Ankur/Karishma/Shreya comment thread, 2026-03-24 to 2026-03-25):
  Network and Member both require **both A and B to be Org-type profiles**.
  Also updated Funder/Investor rule to include Org (Implementer/Both) as a valid A-side profile.
  Source: RES-816 AC + comment thread.

## 2026-05-06
- [LOCAL-KB] Migrated to local-first KB architecture. All reads/writes during /cg-automate
  runs now use local kb/ folder. GitHub sync happens only on explicit /kb-sync command.
