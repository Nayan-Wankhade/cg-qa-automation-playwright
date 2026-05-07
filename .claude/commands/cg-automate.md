Run the full CG Playwright automation workflow for the provided Excel file.

If no file path is provided in the arguments, respond:
  "Usage: /cg-automate <path-to-excel-file>
   Example: /cg-automate C:\Users\NayanWankhade\Desktop\test-cases.xlsx"
  Then stop.

Otherwise, execute the full /cg-automate workflow as defined in CLAUDE.md:

PHASE 0 — Bootstrap
1. Parse the Excel file using: python scripts/parse_excel.py --input "$input" --output parsed_tests.json --sheet 0
2. Read .env for persona credentials
3. Read local kb/ context (pages, validations, rules, personas, flows) for the modules found
4. Load existing selector maps from kb/selectors/{module-slug}.json (HYBRID mode) or note as missing (EXPLORE mode)
5. Check if src/pages/modules/{module-slug}/ and src/tests/e2e/{module-slug}/ exist — if so, ask user before updating
6. Group test cases by persona and report parsed summary

PHASE 1 — Live Execution
7. For each persona group: login, execute every test step via Playwright MCP browser tools
8. Track each selector interaction in memory: CONFIRMED / STALE / FAILED
9. On element not found: explore via browser_snapshot, try 3 candidates

REPAIR GATE (automatic)
10. If any STALE or FAILED selectors: enter repair mode
    - Navigate to the relevant page, take fresh snapshot, try new candidates
    - REPAIRED → confirmed working
    - UNRESOLVABLE → show to user, wait for: skip / investigate / manual override
11. Loop until zero broken selectors remain

WRITE GATE (user confirmation)
12. Show: confirmed ✅ / repaired ✅ / new ✅ / unresolvable ⚠️ counts
13. "Proceed to write scripts and update kb/selectors/? (yes / no)"
14. Wait for explicit "yes" before continuing

PHASE 2 — Script Generation + Local KB Write-back
15. Write/update Page Objects → src/pages/modules/{module-slug}/
16. Write/update Spec files   → src/tests/e2e/{module-slug}/
17. Write/update Factories    → src/data/factories/
18. Update fixtures, constants, personas, types as needed
19. Write kb/selectors/{module-slug}.json (confirmed + repaired + new selectors only)
20. Write kb/execution-reports/{date}-run-{id}.md
21. Update kb/selectors/_index.md
22. Delete parsed_tests.json

Print completion summary as defined in CLAUDE.md.
