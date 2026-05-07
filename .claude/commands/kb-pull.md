Pull the full GitHub KB into local `kb/`. Overwrites ALL local KB files.
Use this to: initialise a new machine, refresh stale local copies, or pick up KB updates made by teammates.

Steps:
1. For each folder in the GitHub KB repo — pages, validations, rules, personas, flows, selectors, execution-reports:
   a. Call `github-kb-mcp list_files` on the folder
   b. For each file returned, call `github-kb-mcp get_file`
   c. Write the content to the corresponding local `kb/{folder}/{filename}` path using the Write tool
2. Also pull root files: README.md, _changelog.md, _open-questions.md, metadata-defaults.md
3. Count total files pulled and report

Output format when done:
```
KB Pull — Complete.

Pulled {N} files from GitHub KB into kb/.
Your local KB is now up to date.
```

If `github-kb-mcp` is unavailable: tell user "github-kb-mcp is not connected. Check claude_desktop_config.json." and stop.
