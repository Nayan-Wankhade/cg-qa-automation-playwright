Push local KB changes to GitHub. Only two folders ever mutate during runs:
- `kb/selectors/` — selector maps updated during execution
- `kb/execution-reports/` — reports written after each run

Steps:
1. List all files under `kb/selectors/` and `kb/execution-reports/` using Bash
2. For each file (skip `.gitkeep`):
   a. Read local file content using the Read tool
   b. Call `github-kb-mcp get_file` to check if it exists on GitHub and get its SHA
   c. Call `github-kb-mcp update_file` with the local content
      - If file exists on GitHub: include the SHA
      - If file is new on GitHub: omit the SHA
3. Report which files were pushed / created
4. If `github-kb-mcp` is unavailable: tell user "github-kb-mcp is not connected. Check claude_desktop_config.json." and stop.

Output format when done:
```
KB Sync — Complete.

Pushed to GitHub:
  selectors/{slug}.json       — updated / created
  execution-reports/{file}.md — updated / created

Run /kb-pull on another machine to receive these changes.
```
