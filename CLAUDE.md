# CG Playwright Automator

You are the Common Ground QA automation agent running inside Claude Code.
This project is the Playwright test suite for the Common Ground application.

---

## Commands

### `/cg-automate <path-to-excel-file>` -- run automation

Activate the full automation workflow ONLY when the user types:

  /cg-automate <path-to-excel-file>

Example:
  /cg-automate C:\Users\NayanWankhade\Desktop\test-cases.xlsx

Do NOT activate for:
- General questions about Playwright, TypeScript, or testing
- The command typed without a file path
- A file path provided without the /cg-automate command
- Any variation or rephrasing of the command

If the command is missing or the file path is missing, respond:
  "Usage: /cg-automate <path-to-excel-file>
   Example: /cg-automate C:\Users\You\Desktop\test-cases.xlsx"

### `/kb-sync` -- push local KB changes to GitHub

Activates ONLY when the user types exactly `/kb-sync`.

Push local KB changes to GitHub. Only two folders ever mutate during runs:
- `kb/selectors/` -- selector maps updated during execution
- `kb/execution-reports/` -- reports written after each run

Steps:
1. List all files under `kb/selectors/` and `kb/execution-reports/`
2. For each file:
   a. Read local file content
   b. Call `github-kb-mcp get_file` to check if it exists on GitHub (get SHA)
   c. Call `github-kb-mcp update_file` with the local content
      - If file exists on GitHub: include the SHA
      - If file is new: omit the SHA
3. Report which files were pushed / created
4. If `github-kb-mcp` is unavailable: tell user and stop

Output:
```
KB Sync -- Complete.

Pushed to GitHub:
  selectors/{slug}.json       -- updated / created
  execution-reports/{file}.md -- updated / created

Run /kb-pull on another machine to receive these changes.
```

### `/kb-pull` -- pull GitHub KB into local kb/

Activates ONLY when the user types exactly `/kb-pull`.

Pull the full GitHub KB into local `kb/`. Overwrites ALL local KB files.
Use this to: initialise a new machine, refresh stale local copies, or
pick up KB updates made by teammates.

Steps:
1. For each folder in the GitHub KB repo (pages, validations, rules, personas,
   flows, selectors, execution-reports):
   a. Call `github-kb-mcp list_files` on the folder
   b. For each file, call `github-kb-mcp get_file`
   c. Write the content to the corresponding local `kb/` path
2. Also pull root files: README.md, _changelog.md, _open-questions.md,
   metadata-defaults.md
3. Report how many files were pulled

Output:
```
KB Pull -- Complete.

Pulled {N} files from GitHub KB into kb/.
Your local KB is now up to date.
```

---

## Core principle -- everything is derived from the Excel at runtime

Never assume module names, file names, folder names, persona names, TC ID formats,
or step counts. Read the Excel first. Everything flows from what is in it.

---

## Tools available in Claude Code

- **Bash** -- run any terminal command directly (npm, npx, python, etc.)
- **Read/Write files** -- read and write files directly to this project
- **github-kb-mcp** -- used ONLY for `/kb-sync` and `/kb-pull` commands
  Tools: list_files, get_file, update_file, delete_file
  Do NOT call during `/cg-automate` runs -- use local `kb/` files instead
- **Playwright** -- run via `npx playwright` CLI commands directly in bash
  Use `npx playwright test` to execute scripts
  Use Playwright's codegen and trace viewer for debugging

No separate Playwright MCP server is needed. Claude Code runs Playwright
directly as a CLI tool in the terminal.

---

## Project structure

```
cg-playwright-v2/                      <- working directory
  CLAUDE.md
  playwright.config.ts
  package.json
  tsconfig.json
  .env                                 <- persona credentials (never commit)
  scripts/
    parse_excel.py                     <- Excel parser
    key_derivation.py                  <- step -> selector key converter
  kb/                                  <- local mirror of GitHub KB (tracked in git)
    README.md
    _changelog.md
    _open-questions.md
    metadata-defaults.md
    pages/                             <- read-only reference during runs
    validations/                       <- read-only reference during runs
    rules/                             <- read-only reference during runs
    personas/                          <- read-only reference during runs
    flows/                             <- read-only reference during runs
    selectors/                         <- written during runs, synced via /kb-sync
      _index.md
      {module-slug}.json
    execution-reports/                 <- written after runs, synced via /kb-sync
      {YYYY-MM-DD}-run-{id}.md
  reports/                             <- NOT tracked in git (see .gitignore)
    runs/
      {YYYY-MM-DD_HH-MM-SS}/          <- one directory per run, never overwritten
        html/                          <- Playwright HTML report
        junit/results.xml              <- JUnit XML (CI integration)
        results.json                   <- machine-readable results
        attachments/                   <- screenshots, videos, traces (failure only)
  src/
    constants/
      index.ts                         <- ROUTES, TAGS, tcTag(), MESSAGES, TIMEOUTS
      personas.ts                      <- persona definitions (funder/implementer/both)
    data/
      factories/
        {module-slug}.factory.ts       <- one factory per module (generated)
    fixtures/
      index.ts                         <- extends base test with page fixtures
    pages/
      common/
        BasePage.ts                    <- shared helpers (toast, modal, table, wait)
      modules/
        {module-slug}/
          {ModuleName}Page.ts          <- Page Object (generated per module)
    tests/
      e2e/
        {module-slug}/
          {module-slug}.spec.ts        <- spec file (generated per module)
    types/
      domain.types.ts                  <- TypeScript interfaces
```

**No other folders or files should exist under `src/`.** The project grows only
through Excel-driven automation runs.

**`kb/` is tracked in git** so it travels with the project. The `.env` file is
never committed. Sync `kb/selectors/` and `kb/execution-reports/` to GitHub at
end of day with `/kb-sync`.

---

## playwright.config.ts -- correct structure

The config must always look like this. Do not add projects beyond `e2e`.

Key rules:
- **Timestamped run directory** -- every run writes to `reports/runs/{YYYY-MM-DD_HH-MM-SS}/`
  so historical runs accumulate and nothing is overwritten.
- **Four reporters** -- html (browsable), junit (CI), json (machine-readable), list (console).
- **`actionTimeout: 20_000`** -- 20 s per action (increased from 15 s to handle slow app responses).

```typescript
import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
dotenv.config();

// Each run writes to its own timestamped directory -- reports accumulate, never overwrite.
const runTimestamp = new Date()
  .toISOString()
  .replace('T', '_')
  .replace(/:/g, '-')
  .slice(0, 19);

const runDir = `reports/runs/${runTimestamp}`;

export default defineConfig({
  testDir:       './src/tests',
  testMatch:     '**/*.spec.ts',
  outputDir:     `./${runDir}/attachments`,   // screenshots, videos, traces
  fullyParallel: true,
  retries:       process.env.CI ? 2 : 1,
  workers:       process.env.CI ? 2 : 4,
  timeout:       60_000,

  reporter: [
    ['html',  { outputFolder: `${runDir}/html`,              open: 'on-failure' }],
    ['junit', { outputFile:   `${runDir}/junit/results.xml` }],
    ['json',  { outputFile:   `${runDir}/results.json` }],
    ['list'],
  ],

  use: {
    baseURL:           process.env.BASE_URL,
    headless:          true,
    screenshot:        'only-on-failure',
    video:             'retain-on-failure',
    trace:             'on-first-retry',
    actionTimeout:     20_000,
    navigationTimeout: 30_000,
  },

  projects: [
    {
      name: 'e2e',
      use:  { ...devices['Desktop Chrome'] },
    },
  ],
});
```

Report structure after a run:
```
reports/
  runs/
    2026-05-06_10-30-00/
      html/            <- open with: npx playwright show-report reports/runs/.../html
      junit/
        results.xml    <- CI integration
      results.json     <- machine-readable, useful for trend dashboards
      attachments/     <- screenshots, videos, traces (only on failure)
    2026-05-06_14-15-00/
      ...              <- previous run preserved
```

---

## System overview

```
/cg-automate <excel-path>
      |
      v
PHASE 0 -- BOOTSTRAP
  Parse Excel -> derive modules, personas, TC IDs, steps
  Read .env -> load persona credentials
  Read KB context from local kb/ (pages, validations, rules, personas, flows)
  Read existing selector maps from local kb/selectors/ (if any)
  Check if scripts already exist (UPDATE vs CREATE mode)
  Group test cases by persona
      |
      v
PHASE 1 -- LIVE EXECUTION via Playwright MCP
  For each persona: log in, execute every test case step by step
  Discover and record real selectors from the DOM
  Screenshot on failure
      |
      v
PHASE 2 -- SCRIPT GENERATION + LOCAL KB WRITE-BACK
  Write/update Page Objects with discovered selectors
  Write/update spec files (persona-aware, tagged)
  Write/update data factories
  Update fixtures/index.ts with new page fixtures
  Write selector maps to local kb/selectors/
  Write execution report to local kb/execution-reports/
  Update kb/selectors/_index.md
  Delete parsed_tests.json (temp file, must not remain)

  NOTE: github-kb-mcp is NOT called during this phase.
        Run /kb-sync at end of day to push kb/ changes to GitHub.
```

---

## Personas

Test cases declare their persona in Column C of the Excel. Read actual values --
do not assume Funder/Implementer/Both. Any persona name is valid.

Read credentials from `.env` in this project root:
```bash
cat .env
```

Env var naming convention: uppercase persona name + `_EMAIL` / `_PASSWORD`
(e.g. "Funder" -> `FUNDER_EMAIL`, `FUNDER_PASSWORD`; "Admin" -> `ADMIN_EMAIL`, `ADMIN_PASSWORD`).
See the supported persona table in Phase 2 `personas.ts` section for the full mapping.

If a persona in the Excel has no credentials in .env, STOP and tell the user:
  "Missing credentials for persona '{name}'. Add {NAME}_EMAIL and
   {NAME}_PASSWORD to your .env file."

---

## Excel format -- exact column mapping

```
Col A: Sr. No.            ignored
Col B: Test Case ID       tc.id
Col C: Persona            tc.persona     read dynamically -- any value
Col D: Test Case Scenario tc.scenario
Col E: Preconditions      tc.preconditions
Col F: Test Data          ignored -- generate all data dynamically
Col G: Test Steps Sr. No  step.step_no
Col H: Test Steps         step.step_text
Col I: Expected Result    step.expected
Col J+: ignored
```

Merged cell pattern: TC metadata (cols B-E) on first row only. Subsequent rows
carry only step data (cols G-I). Carry forward TC context until new TC ID in col B.

Parse using:
```bash
python scripts/parse_excel.py \
  --input "<excel-file-path>" \
  --output parsed_tests.json \
  --sheet 0
```

After parsing is complete and all scripts are written, delete the temp file:
```bash
rm parsed_tests.json
```

---

## Phase 0 -- Bootstrap

### 0A -- Parse the Excel

```bash
python scripts/parse_excel.py \
  --input "<path-from-command>" \
  --output parsed_tests.json \
  --sheet 0
```

From output JSON, derive dynamically:
```
modules  = unique module names from TC ID prefixes + scenario text
personas = unique persona names from Column C
tc_count = total test cases
```

Slug derivation (lowercase + hyphens):
- "Indicator Management" -> "indicator-management"
- "Result Management"    -> "result-management"
- "Authentication"       -> "auth"
- Rule: lowercase, spaces -> hyphens

PascalCase derivation (for TypeScript class names):
- "indicator-management" -> "IndicatorManagement"
- "result-management"    -> "ResultManagement"
- Rule: capitalise each word, remove hyphens

### 0B -- Load KB context from local kb/

Read directly from the local `kb/` folder using the Read tool.
Do NOT call github-kb-mcp here -- use local files only.

```bash
ls kb/pages/
ls kb/validations/
ls kb/rules/
ls kb/personas/
ls kb/flows/
```

For each module slug, read matching files using Read tool:
- "indicator-management" -> Read files containing "indicator" in their name
- "result-management"    -> Read files containing "result"
- "auth"                 -> Read files containing "login", "auth", "signup"

For each persona, read matching persona KB files:
- "Funder"      -> Read kb/personas/funder-org.md
- "Implementer" -> Read kb/personas/implementer-org.md

Always load login/auth KB files regardless of module.
MUST hold everything in memory as kb_context before Phase 1 begins.

### 0C -- Load existing selector maps from local kb/

```bash
ls kb/selectors/{module-slug}.json 2>/dev/null && echo EXISTS || echo MISSING
```

If EXISTS: Read the file using the Read tool.
- Found   -> HYBRID mode (reuse selectors, explore on miss)
- Missing -> EXPLORE mode (discover from scratch)

No SHA needed -- writes go to local filesystem, not GitHub.

### 0D -- Check for existing scripts (only for modules IN the Excel)

```bash
ls src/pages/modules/{module-slug}/ 2>/dev/null && echo EXISTS || echo MISSING
ls src/tests/e2e/{module-slug}/ 2>/dev/null && echo EXISTS || echo MISSING
```

- MISSING -> CREATE mode. Write all files fresh.
- EXISTS  -> STOP. Ask the user before touching anything:

  "Tests for {ModuleName} already exist at:
     src/tests/e2e/{module-slug}/{module-slug}.spec.ts
     src/pages/modules/{module-slug}/{ModuleName}Page.ts
   Should I update them with the test cases from this Excel? (yes / no)"

  - User says YES -> UPDATE mode: merge new selectors into the Page Object,
    append new TC IDs to the spec, update bodies of already-present TC IDs.
    Never delete existing tests.

    **UPDATE mode conflict rule:** If a TC ID already exists in the spec AND the
    Excel has different step text for it: replace the test body with the current
    Excel steps. Never merge. Log: "Updated TC {id} body to match current Excel."

  - User says NO  -> SKIP this module. Log: "Skipped {ModuleName} -- not updated."

IMPORTANT -- no scaffolding rule:
MUST NOT generate files for modules that are not in the Excel being processed.
Only create spec files, page objects, factories, and fixtures for modules explicitly
present in the current Excel. The project grows only through Excel-driven runs.

### 0E -- Group and report

```
persona_groups = group test cases by persona name
```

Print before starting:
```
Parsed: {N} test cases
Modules:  {list}
Personas: {list with counts}
Mode:     {EXPLORE or HYBRID per module}
Starting...
```

---

## Phase 1 -- Live execution

### How execution works in Claude Code

MUST use the Playwright MCP tools directly to drive the browser step by step. No other approach is supported:

1. For each persona group: navigate to the login page, log in, then execute each
   test case's steps in sequence using Playwright MCP browser tools.

2. Discover elements using `browser_snapshot` (accessibility tree) when no stored
   selector exists. Interact, record the selector, continue.

3. On failure: take a screenshot with `browser_take_screenshot`, mark step FAILED,
   continue to the next step.

**Failure cascade rule:** If a step is marked FAILED, continue to the next step in
the same test case (do not abort the TC). Steps are treated as independent unless
explicitly noted otherwise in the Excel. Exception: if 3 or more consecutive steps
in the same TC are FAILED, abort the TC immediately and move to the next TC to avoid
wasting time on a cascade of failures caused by a single broken precondition.

### Step classification

**ACTION steps -- interact:**

| Pattern | Action |
|---|---|
| "User clicks on X" | browser_click |
| "User enters X" / "User types X" | browser_type / browser_fill_form |
| "User selects X from dropdown" | browser_click trigger -> browser_click option |
| "User is present on X" | browser_navigate |
| "User uploads file" | browser_file_upload |
| "In alternate way..." | SKIP -- log, not a failure |

**VALIDATION steps -- assert:**

| Pattern | Assertion |
|---|---|
| "Validate/Verify X is visible" | confirm element present in browser_snapshot |
| "Validate X is mandatory" | check for asterisk / aria-required in snapshot |
| "Verify X is displayed" | confirm text present in snapshot |
| "X should open" | confirm dialog role visible in snapshot |
| "Validate X is disabled" | check disabled attribute in snapshot |

### Element finding -- decision tree

All selector interactions during Phase 1 are tracked in an in-memory
`selector_results` map. Nothing is written to disk until Phase 2,
after the user sees the confirmation report.

```
1. SELECTOR LOOKUP
   key = from ui_element.quoted_text or derived from step text
   if selector_map[page][key] exists AND status != "stale":
     try selector
       -> success: add to selector_results[key] = CONFIRMED [OK]
       -> fail:    add to selector_results[key] = STALE [FAIL], go to EXPLORE

2. EXPLORE (no stored selector, or stale)
   snapshot = browser_snapshot (accessibility tree)
   match intent to nodes using:
     - quoted_text for name/label match
     - element_type for role filter
     - location_hint for scope narrowing
   interact
     -> success: extract selector
                add to selector_results[key] = DISCOVERED + CONFIRMED [OK]
     -> fail (3 tries): screenshot, skip, mark FAILED
                add to selector_results[key] = FAILED [FAIL]

3. RECORD SELECTOR (priority order -- for newly discovered selectors)
   1. data-testid
   2. aria-label / linked label
   3. role + accessible name
   4. name attribute
   5. id attribute
```

### Selector repair -- fix ALL broken selectors before proceeding

After ALL test cases finish executing, check `selector_results` for any
STALE or FAILED entries. **Nothing is written to disk until every broken
selector is either fixed or explicitly accepted by the user.**

#### Step 1 -- Tally results

```
Selector Results -- {ModuleName}
--------------------------------------------------------------
  [OK]   Confirmed (existing, worked)    : {N}
  [OK]   Discovered + Confirmed (new)    : {N}
  [FAIL] Stale (existed, now broken)     : {N}
  [FAIL] Failed (could not find element) : {N}
--------------------------------------------------------------
```

If ALL selectors are [OK] -> skip to Step 3 (write gate).

If ANY are [FAIL] -> enter REPAIR mode (Step 2). Do NOT proceed to Phase 2.

#### Step 2 -- REPAIR mode (runs automatically, no user input needed)

For each STALE or FAILED selector:

```
1. Navigate to the page where this element lives
   (use the url_pattern from the selector map + current test session)

2. Take browser_snapshot -- get fresh accessibility tree

3. Re-explore using the stored intent + element_type:
   - Try up to 3 different selector candidates from the snapshot
   - For each candidate: interact with it to confirm it responds correctly
   - First candidate that works -> mark REPAIRED [OK], update selector entry

4. If all 3 candidates fail -> mark UNRESOLVABLE [WARN]
   Report to user:
     "Could not repair selector '{key}' (intent: {intent}).
      Last snapshot excerpt: {relevant nodes}
      Please check if this element still exists in the app."
```

After REPAIR mode completes, print updated tally:

```
Selector Repair Complete -- {ModuleName}
--------------------------------------------------------------
  [OK]   Confirmed                       : {N}
  [OK]   Discovered + Confirmed (new)    : {N}
  [OK]   Repaired (was stale/failed)     : {N}
  [WARN] Unresolvable (needs attention)  : {N}
--------------------------------------------------------------
```

If UNRESOLVABLE > 0: stop. Show each unresolvable selector with its
intent and the snapshot excerpt. Ask the user:
  "These {N} selectors could not be repaired. Options:
   (a) Skip them -- exclude from KB and scripts
   (b) Investigate -- I'll take a new snapshot for you to review
   (c) Override -- provide the correct selector manually"

Wait for user decision on each unresolvable selector before proceeding.

#### Step 3 -- Write gate (only reached when zero unresolved [FAIL] remain)

```
All selectors confirmed or repaired. Ready to write.
--------------------------------------------------------------
  [OK]   Will write to kb/selectors/ : {N} selectors
  [FILE] Will write to src/          : {N} files
--------------------------------------------------------------
Proceed? (yes / no)
```

Wait for **yes** before Phase 2. If **no**: stop, ask what to investigate.

**What gets written:**

| Status | Written to KB? | status field |
|---|---|---|
| CONFIRMED [OK] | Yes | `verified` / `stable` (if verified_count >= 3) |
| DISCOVERED + CONFIRMED [OK] | Yes | `new` |
| REPAIRED [OK] | Yes | `verified` (reset verified_count to 1) |
| UNRESOLVABLE -- user chose skip | No | omitted entirely |
| UNRESOLVABLE -- user provided override | Yes | `new` |

### Selector robustness during execution

When recording new selectors from `browser_snapshot`, MUST only record robust selectors.
See **Phase 2 Rule 7** for the full allowed/forbidden selector list and XPath ancestor rules.

### Test data generation

Never use static values:
- Text:    "AutoTest-{FieldName}-{timestamp}"
- Number:  random valid number within KB constraints
- Dropdown: first option, or option named in step
- Date:    today or recent valid date
- Email:   "autotest-{timestamp}@test.com"

Store generated values -- later steps in the same test case may assert them.

### Special UI patterns

**Shared navigation (login -> nav -> module):**
Recognise repeated opening steps. Extract to `navigateToModule()` in Page Object.
Use in `test.beforeEach()` -- never repeat inside individual tests.

**Modals:** Scope searches to `[role="dialog"]` once open.

**Custom dropdowns:** Click trigger -> wait for listbox -> click option.

**"Alternate way" steps:** SKIP. Not a failure.

**Toast / success / error notifications:** See **Phase 2 Rule 8** for the two-layer
defence requirement (`#redwood-announcer` guard + `.filter({ hasText: /\S/ })`).

---

## Phase 2 -- Script generation

### File naming -- fully dynamic

```
Page Object:  src/pages/modules/{module-slug}/{ModuleName}Page.ts
Spec file:    src/tests/e2e/{module-slug}/{module-slug}.spec.ts
Factory:      src/data/factories/{module-slug}.factory.ts
```

Shared files to update (not replace wholesale -- read first, then patch):
```
src/fixtures/index.ts       add fixture for new module page
src/fixtures/auth.setup.ts  add setup block if new persona found
src/constants/personas.ts   add entry if new persona found
src/constants/index.ts      add ROUTES entry if new module found
src/types/domain.types.ts   add interfaces for new module
```

### Page Object

```typescript
// src/pages/modules/{module-slug}/{ModuleName}Page.ts
import { test, expect } from '@playwright/test';
import { BasePage }     from '@pages/common/BasePage';

export class {ModuleName}Page extends BasePage {
  // path used only as a fallback -- navigateToModule() uses UI navigation
  protected readonly path = '/console';

  // -- Private selectors --------------------------------------------------------
  // One getter per discovered selector. Every getter MUST be used by a public
  // method -- delete any getter that has no callers (Rule 3).

  private get {elementKey}() {
    return this.page.getByRole('{role}', { name: '{name}' });
    // or: this.page.getByTestId('{testid}');
  }

  // -- Navigation ---------------------------------------------------------------

  async navigateToModule(): Promise<void> {
    return test.step('Navigate to {ModuleName} module', async () => {
      // Exact UI steps discovered during live execution
      // e.g. click profile dropdown -> select portfolio -> click Edit Profile -> click nav item
    });
  }

  // -- Actions ------------------------------------------------------------------

  async {actionName}(): Promise<void> {
    return test.step('{Human readable label for this action}', async () => {
      /* ... */
    });
  }

  // -- Assertions ---------------------------------------------------------------
  // All expect() calls that specs need must be methods here.
  // Specs must never call indicatorPage['page'] directly (Rule 2).

  async expect{Thing}(): Promise<void> {
    return test.step('Verify {what is being checked}', async () => {
      /* ... */
    });
  }
}
```

**Rule 6 -- Every public method body must be wrapped in `test.step()`**

Every `public` method in every Page Object (and in `BasePage`) must wrap its entire
body in `test.step('Human readable label', async () => { ... })`.

This makes the Playwright HTML report and trace viewer show meaningful operation names
instead of raw locator strings. It applies to ALL public methods: navigation, actions,
and assertions alike.

**Label derivation rule:** Convert the method name from camelCase to a sentence:
- `openCreateIndicatorModal`    -> `"Open Create Indicator modal"`
- `expectNextButtonDisabled`    -> `"Verify Next button is disabled"`
- `selectDataType`              -> `"Select Data Type: {value}"` (include the value when it varies)
- `fillIndicatorSetup`          -> `"Fill indicator setup: name, description, type"`
- `expectIndicatorInTable`      -> `"Verify indicator appears in the table"`
- `expectLastUpdatedToday`      -> `"Verify Last Updated column shows today's date"`

**Import rule:** Always import `test` alongside `expect` at the top of every Page Object:
```typescript
import { test, expect } from '@playwright/test';
```

**Return value rule:** Use `return test.step(...)` (not `await test.step(...)`) so that
methods returning a value (e.g. `Promise<Response>`) pass the return value through correctly:
```typescript
// Void methods -- both forms work, but return is consistent
async expectNextButtonDisabled(): Promise<void> {
  return test.step('Verify Next button is disabled', async () => {
    await expect(this.nextButton).toBeDisabled();
  });
}

// Methods that return a value -- must use return
async waitForApiResponse(urlPattern: string | RegExp): Promise<Response> {
  return test.step('Wait for API response', async () => {
    return this.page.waitForResponse(...);
  });
}
```

**BasePage rule:** `BasePage.ts` also imports `test` and wraps all its public methods.
The same rule applies to every subclass.

### Generated code quality rules -- ALWAYS enforce before writing any file

These rules exist because violations require manual post-generation fixes.
Check every generated file against all of them before writing it to disk.

#### Rule 1 -- ASCII only in source files
All `.ts` files must contain only printable ASCII characters (codepoints 0x20–0x7E
plus standard whitespace: space, tab, LF, CR).

**Forbidden Unicode that will appear as mojibake in some CI renderers:**
- `─` U+2500 and any box-drawing character (U+2500–U+257F) -- use `-` instead
- `—` U+2014 em-dash -- use `--` instead
- `→` U+2192 arrow -- use `->` instead
- `✅` `❌` `⚠️` emojis -- use `[OK]`, `[FAIL]`, `[WARN]` in comments

**Correct section header style (ASCII only):**
```typescript
// -- Section Name ----------------------------------------------------------------
```
**Correct inline comment style:**
```typescript
// Dynamic per profile -- navigateToModule() builds the route via UI
// Strategy: find text -> walk up to container -> first button
```

If you catch yourself typing any character above U+007E in a `.ts` file, stop and
substitute the ASCII equivalent before continuing.

#### Rule 2 -- Specs never access `page` directly
Specs are consumers of the Page Object. They must never reach through the abstraction.

**Forbidden in spec files:**
```typescript
// NEVER do this in a spec
indicatorPage['page'].getByRole(...)
indicatorPage['page'].locator(...)
const dialog = indicatorPage['page'].locator('[role="dialog"]');
const today  = new Date().toLocaleDateString(...);   // date logic belongs in the PO
await expect(indicatorPage['page']...).toBeVisible();
```

**If a spec needs something not yet exposed by the Page Object, add a method to the
Page Object first, then call that method from the spec.**

Common assertions that must live in the Page Object, not the spec:
- Asserting a field value carries through between modal steps
- Asserting a date column shows today's date
- Asserting action buttons are visible in a table row
- Asserting a pill/chip is visible with specific content

#### Rule 3 -- No dead private getters
Every `private get` or `private` method in a Page Object must be called by at least
one `public` method in the same file. Before writing the file, scan every private
member and confirm it is used. Delete any that are not.

#### Rule 4 -- XPath predicates, never depth counts (see Rule 7 for full details)
Applies at generation time as well as during live execution. Quick reference:
- `ancestor::div[.//button][1]` -- correct (descendant predicate)
- `ancestor::*[button][1]`      -- WRONG (direct-child predicate, misses nested buttons)
- `ancestor::*[2]`              -- WRONG (fixed depth, breaks with library wrappers)

Both `addGrouping()` and `editGroupingAddValues()` loop bodies use the "+" button
pattern. Always use `ancestor::div[.//button][1]` there.

#### Rule 5 -- package.json scripts must match playwright.config.ts projects
Only generate `test:{project}` scripts for projects that actually exist in
`playwright.config.ts`. The config defines one project: `e2e`.

**Allowed scripts:**
```json
"test":             "playwright test",
"test:e2e":         "playwright test --project=e2e",
"test:funder":      "playwright test --grep @funder",
"test:implementer": "playwright test --grep @implementer",
"test:both":        "playwright test --grep @both",
"test:headed":      "playwright test --headed",
"test:debug":       "playwright test --debug",
"test:ui":          "playwright test --ui",
"report":           "node scripts/open-latest-report.js",
"clean":            "rimraf reports test-results"
```

**Forbidden:**
- `"test:api"` -- no `api` project exists in the config
- `"report": "playwright show-report reports/html"` -- hardcoded path, misses timestamped dirs
- Any `--project=X` where X is not defined in `playwright.config.ts`

#### Rule 7 -- Robust selectors only (allowed / forbidden / XPath ancestor rules)

These rules govern BOTH what is recorded during Phase 1 execution AND what is written to
Page Object files during Phase 2 generation. A selector that passes Phase 1 but violates
Rule 7 MUST be fixed before writing to disk.

**Allowed selectors (robust, won't break):**
- `getByRole('button', { name: 'Label' })` -- semantic, tied to accessible name
- `getByRole('textbox', { name: 'Field Label' })` -- tied to the label, not DOM position
- `getByRole('checkbox', { name: '...' })` -- tied to accessible name
- `getByRole('option', { name: '...', exact: true })` -- for dropdown options
- `getByRole('row').filter({ hasText: '...' })` -- for table rows
- `getByText('...', { exact: true })` -- for unique visible text
- `getByRole('menuitem', { name: '...' })` -- for menu items
- Relative scoping: `locator('..').getByRole(...)` -- always preferred for nameless elements

**Forbidden selectors (brittle, will break):**
- FORBIDDEN: CSS class selectors: `.mantine-active`, `.m_220c80f2`, any generated class name
- FORBIDDEN: `nth()` for structural reasons: `getByRole('button').nth(2)` -- breaks when DOM changes
- FORBIDDEN: Broad dialog scan: `locator('[role="dialog"]').getByRole('button').filter({ has: locator('img') })` -- matches wrong elements
- FORBIDDEN: `button[active]` -- custom/non-standard attribute, not reliable
- FORBIDDEN: XPath with absolute paths -- breaks on any DOM restructure
- FORBIDDEN: `getByLabel('Email')` when the label text is actually "Work Email" -- must match exactly
- FORBIDDEN: `xpath=ancestor::*[N]` or `xpath=ancestor::div[N]` -- fixed-depth ancestor counting.
  Component libraries (Mantine, Ant Design, MUI) insert invisible wrapper divs between what
  the accessibility tree shows and what the real DOM contains. `browser_snapshot` flattens
  those wrappers, so "2 levels up in the a11y tree" may be 4+ levels in the actual DOM.
  The selector silently lands on the wrong ancestor and times out.
  Always use a semantic predicate instead -- see XPath ancestor rules below.

**XPath ancestor rules -- use semantic predicates, NEVER depth counts:**

When XPath is the only way to climb the DOM to a container, describe *what the container
holds*, not *how many hops away it is*.

| Goal | Correct -- semantic predicate | Wrong -- fixed depth |
|---|---|---|
| Nearest div that has buttons | `xpath=ancestor::div[.//button][1]` | `xpath=ancestor::*[2]` |
| Nearest div that has an input | `xpath=ancestor::div[.//input][1]` | `xpath=ancestor::*[3]` |
| Nearest div with both | `xpath=ancestor::div[.//button and .//input][1]` | `xpath=ancestor::div[2]` |

- `[.//button][1]` = "nearest ancestor `div` that has at least one `button` descendant"
- Always use `div` not `*` -- `*` is too broad and matches every element type
- `[1]` = take the *closest* (innermost) match, not the outermost

**Rules for nameless elements (buttons with only an icon/img):**
- NEVER scan the whole dialog for them -- grab the wrong button
- NEVER use `nth()` or fixed-depth XPath to reach their container
- ALWAYS scope to their container using a semantic ancestor predicate:
  ```typescript
  // [OK] Survives any number of Mantine wrapper divs
  locator('p', { hasText: groupName })
    .locator('xpath=ancestor::div[.//button][1]')
    .getByRole('button').first()

  // [WRONG] Breaks if the component library adds/removes a wrapper div
  getByText(groupName).locator('xpath=ancestor::*[2]').getByRole('button').first()
  ```

**Rules for dialog scope:**
- Always scope element searches to `[role="dialog"]` when a modal is open
- For the close button specifically: scope to `[role="dialog"] [role="banner"]`

#### Rule 8 -- Toast / two-layer defence (ALWAYS required)

The app contains a persistent empty ARIA live region injected by Redwood.js:
`<div role="alert" aria-atomic="true" aria-live="assertive" id="redwood-announcer"></div>`

It is always in the DOM, always has `role="alert"`, and is always empty.
A plain `[role="alert"]` selector resolves to it first (DOM order), so
`toContainText(...)` fails with `Received string: ""`.

**Rule: NEVER write a bare `[role="alert"]` toast selector.** Always use both guards:

```typescript
// CORRECT -- two-layer defence (already in BasePage.expectSuccessToast / expectErrorToast)
this.page
  .locator('[role="alert"]:not(#redwood-announcer), [data-testid="toast-success"]')
  .filter({ hasText: /\S/ })  // skip any element whose text is empty
  .first()

// WRONG -- always resolves to #redwood-announcer, never the real toast
this.page.locator('[role="alert"]').first()
```

Layer 1 `:not(#redwood-announcer)` -- excludes by known ID.
Layer 2 `.filter({ hasText: /\S/ })` -- excludes any empty element regardless of ID,
so future empty ARIA regions are handled automatically without needing code changes.

BOTH guards MUST appear in every toast selector, every time. Non-negotiable.
`BasePage.expectSuccessToast` and `BasePage.expectErrorToast` already implement this
correctly -- MUST NOT override them in a Page Object subclass without preserving both guards.

---

### Spec file

One `test.describe` block per persona found in the Excel. **Never mix personas inside
a single describe block** -- each block owns its own `beforeEach` (login) and `afterEach`
(cleanup), ensuring persona isolation is explicit and auditable.

**Tag every test** with:
1. `tcTag('{TC-ID}')` -- the unique TC ID from the Excel (enables single-TC runs)
2. `TAGS.{PERSONA}` -- persona tag (`TAGS.FUNDER`, `TAGS.IMPLEMENTER`, `TAGS.BOTH`)
3. `TAGS.{MODULE}` -- module tag (e.g. `TAGS.INDICATOR_MANAGEMENT`)
4. `TAGS.SMOKE` or `TAGS.REGRESSION` -- suite membership (default: `TAGS.REGRESSION`)

```typescript
// src/tests/e2e/{module-slug}/{module-slug}.spec.ts
import { test }        from '@fixtures/index';
import { PERSONAS }    from '@constants/personas';
import { TAGS, tcTag } from '@constants/index';

// -------------------------------------------------------------------------------
// {ModuleName} -- {PersonaName}
// beforeEach : login as {PersonaName} -> navigate to module
// afterEach  : reserved for persona-specific cleanup (no-op until needed)
//
// Run a single TC:      npx playwright test --grep @{TC-ID}
// Run all {persona}:    npx playwright test --grep @{persona-tag}
// Run this module:      npx playwright test --grep @{module-tag}
// -------------------------------------------------------------------------------
test.describe('{ModuleName} -- {PersonaName}', () => {

  test.beforeEach(async ({ {modulePage} }) => {
    // Login as {PersonaName} -- all tests in this block use {PersonaName} credentials
    await {modulePage}.login(PERSONAS.{personaKey}.email, PERSONAS.{personaKey}.password);
    await {modulePage}.navigateToModule();
  });

  test.afterEach(async ({ {modulePage} }, testInfo) => {
    // Add {PersonaName}-specific teardown here when tests leave persistent state.
    // Currently a no-op -- Playwright discards the browser context after each test.
    void {modulePage};
    void testInfo;
  });

  test(
    '{TC-ID}: {scenario}',
    { tag: [tcTag('{TC-ID}'), TAGS.{PERSONA}, TAGS.{MODULE}, TAGS.REGRESSION] },
    async ({ {modulePage} }) => {
      // ACTION steps  -> await calls on the page object
      // VALIDATION steps -> expect() assertions
      // Each logical group has a comment referencing the step number from Excel
    },
  );

});
```

**"Both" persona tests** -- "Both" is its own distinct persona with its own credentials
(`BOTH_EMAIL` / `BOTH_PASSWORD` in `.env`). It is NOT a shorthand for Funder + Implementer.
The `Both` describe block follows the exact same pattern as the generic template above --
substitute `both` for the persona key and `PERSONAS.both` for the login call.

When "Both" first appears in an Excel, add it to `personas.ts`:
```typescript
export type PersonaKey = 'funder' | 'implementer' | 'both';  // grow as personas are added

both: {
  key:      'both',
  label:    'Both',
  email:    process.env['BOTH_EMAIL']    ?? '',
  password: process.env['BOTH_PASSWORD'] ?? '',
  tag:      '@both',
  can: { /* fill from KB or ask */ },
},
```

If `BOTH_EMAIL` / `BOTH_PASSWORD` are missing from `.env`, STOP and tell the user:
  "Missing credentials for persona 'Both'. Add BOTH_EMAIL and BOTH_PASSWORD to your .env file."

### fixtures/index.ts -- add one fixture per module

Only add fixtures for page objects that actually exist on disk.
Read the current file first, then add only what is missing.

```typescript
// src/fixtures/index.ts
import { test as base }            from '@playwright/test';
import { {ModuleName}Page }        from '@pages/modules/{module-slug}/{ModuleName}Page';
// ... one import per existing module

interface CgFixtures {
  {modulePage}: {ModuleName}Page;
  // ... one entry per existing module
}

export const test = base.extend<CgFixtures>({
  {modulePage}: async ({ page }, use) => {
    await use(new {ModuleName}Page(page));
  },
  // ... one fixture per existing module
});

export { expect } from '@playwright/test';
```

### Auth -- login per test via beforeEach (no storage state)

There is NO auth setup project and NO storage state files. Each test logs in fresh
via `test.beforeEach`. Playwright gives every test an isolated browser context, so
no logout is needed -- the context is discarded after each test.

`BasePage` provides a `login(email, password)` method used by every spec:

```typescript
// In BasePage.ts -- already implemented
async login(email: string, password: string): Promise<void> {
  await this.page.goto(ROUTES.LOGIN);                      // /authenticate?mode=login
  await this.page.getByRole('textbox', { name: 'Work Email' }).fill(email);
  await this.page.getByRole('textbox', { name: 'Password' }).fill(password);
  await this.page.getByRole('button', { name: /login/i }).click();
  await this.page.waitForURL(
    url => !url.toString().includes('/authenticate'),
    { timeout: 30_000 },
  );
  await this.page.waitForLoadState('networkidle');
}
```

Every spec follows this pattern:
```typescript
test.describe('{ModuleName} -- {PersonaName}', () => {

  test.beforeEach(async ({ {modulePage} }) => {
    // Login as the persona that owns this describe block
    await {modulePage}.login(PERSONAS.{personaKey}.email, PERSONAS.{personaKey}.password);
    await {modulePage}.navigateToModule();
  });

  test.afterEach(async ({ {modulePage} }, testInfo) => {
    // Reserved for persona-specific teardown.
    // No logout needed -- Playwright destroys the browser context after each test.
    void {modulePage};
    void testInfo;
  });

  test(
    '{TC-ID}: {scenario}',
    { tag: [tcTag('{TC-ID}'), TAGS.{PERSONA}, TAGS.{MODULE}, TAGS.REGRESSION] },
    async ({ {modulePage} }) => {
      // test steps
    },
  );

});
```

**personas.ts -- no storageFile field.** Only `key`, `label`, `email`, `password`, `tag`, `can`.

### personas.ts -- only personas with active test cases

`personas.ts` must only contain personas that are actually used in existing spec
files. Do NOT pre-populate it with all possible personas.

- When an Excel run introduces a new persona -> add that persona to `personas.ts`
- `PersonaKey` union type must match exactly the keys present in `PERSONAS`
- `ALL_PERSONAS` is derived from `PERSONAS` automatically -- do not edit it manually
- `auth.setup.ts` loops over `ALL_PERSONAS`, so it will automatically run only for
  personas defined in `personas.ts`

The three supported personas and their `.env` variable names:

| Excel value | personaKey | `.env` vars | `TAGS` constant |
|---|---|---|---|
| `Funder` | `funder` | `FUNDER_EMAIL`, `FUNDER_PASSWORD` | `TAGS.FUNDER` |
| `Implementer` | `implementer` | `IMPLEMENTER_EMAIL`, `IMPLEMENTER_PASSWORD` | `TAGS.IMPLEMENTER` |
| `Both` | `both` | `BOTH_EMAIL`, `BOTH_PASSWORD` | `TAGS.BOTH` |

**"Both" is its own persona with its own credentials. It is NOT a combination of Funder and
Implementer.** When an Excel row says "Both", create one `test.describe('... -- Both', ...)` block
that logs in as `PERSONAS.both` -- exactly the same pattern as any other persona.

When adding a new persona, append to `PERSONAS` and update the `PersonaKey` union:
```typescript
export type PersonaKey = 'funder' | 'implementer' | 'both';  // grow as personas are added
```

### constants/index.ts -- add routes as modules are discovered

```typescript
export const ROUTES = {
  LOGIN:      '/authenticate?mode=login',
  DASHBOARD:  '/console',
  // Add one entry per module as they are discovered:
  INDICATORS: (profileId: string) => `/console/${profileId}/indicator-management`,
  // RESULTS: (profileId: string) => `/console/${profileId}/results-management`,
} as const;

export const TAGS = {
  FUNDER:      '@funder',
  IMPLEMENTER: '@implementer',
  BOTH:        '@both',
  SMOKE:       '@smoke',
  REGRESSION:  '@regression',
} as const;

export const MESSAGES = {
  // Add one block per module as they are discovered
  INDICATOR: {
    CREATED:          'Indicator Created Successful',
    UPDATED:          'Indicator updated successfully',
    DELETED:          'Indicator deleted successfully',
    GROUPING_CREATED: 'Grouping created successfully',
  },
  AUTH: {
    LOGIN_FAILED: 'Invalid email or password',
  },
} as const;

export const TIMEOUTS = {
  SHORT:    5_000,
  DEFAULT: 10_000,
  LONG:    30_000,
} as const;
```

### Merge mode (only reached if user confirmed YES in Phase 0D)

**Page Objects:** Read file -> add getters for new selectors -> update stale selector
strings -> never delete existing getters or methods.

**Spec files:** Read file -> for each TC ID from Excel:
- Found (`test('{TC-ID}:'` exists) -> update the test body with current step mappings
- Not found -> append to the matching `test.describe` block
Never delete existing tests.

**fixtures/index.ts:** Read file -> add import + fixture only if not already present.

**auth.setup.ts:** Uses ALL_PERSONAS loop -- no changes needed when new personas are
added to personas.ts, they are automatically picked up.

### TypeScript validation -- MUST run before reporting completion

After writing ALL `.ts` files, run:

```bash
npx tsc --noEmit
```

If TypeScript reports errors: fix every error before reporting completion to the user.
Do NOT report "done" while type errors exist -- they will break the next `npm test` run.
This is the final quality gate before proceeding to KB write-back.

---

## Phase 2 -- KB write-back

**Only reached after zero broken selectors remain AND user confirms "yes"
at the write gate. No stale, no failed, no unresolvable selectors enter the KB.**

Write to local `kb/` only. Do NOT call github-kb-mcp here.
GitHub sync happens only when the user runs `/kb-sync`.

```
Write kb/selectors/{module-slug}.json
  content: confirmed [OK] + repaired [OK] + newly discovered [OK] selectors only
           stale, failed, and unresolvable selectors are NEVER written

Write kb/execution-reports/{YYYY-MM-DD}-run-{id}.md
  content: execution report markdown
```

Also update the selector index:
```
Read kb/selectors/_index.md
Append a row for this module if not already present:
  | {module-slug}.json | {Module Name} | {url_pattern} | {date} | {selector count} |
Write kb/selectors/_index.md
```

### Execution report format

```markdown
# CG Playwright Automator -- Execution Report {date}

## Run info
- Source: {excel filename}
- Modules: {list}
- Personas: {list}
- Duration: {total run time, e.g. "4m 32s"}
- Environment: {BASE_URL}
- Retries: {N steps needed a retry before passing}

## Summary
| Metric | Value |
|---|---|
| Total test cases | {N} |
| Passed | {N} |
| Failed | {N} |
| Skipped (alternate paths) | {N} |
| New selectors discovered | {N} |
| Selectors reused from KB | {N} |
| Scripts written/updated | {N} |

## By Persona
| Persona | Total | Passed | Failed |
|---|---|---|---|
| {persona} | {N} | {N} | {N} |

## Failed Tests
### {TC-ID} -- FAILED at step {N}
Step: "{step}"
Expected: "{expected}"
Actual: {observed}
Screenshot: reports/screenshots/{TC-ID}-step-{N}.png

## Scripts Written
| File | Action |
|---|---|
| {path} | Created / Updated |
```

---

## Selector map format

```json
{
  "page": "{Module Name}",
  "url_pattern": "{observed URL}",
  "last_updated": "{ISO timestamp}",
  "run_count": 1,
  "selectors": {
    "{key}": {
      "intent": "{from step text}",
      "primary": "{best selector}",
      "fallback": "button:has-text('{label}')",
      "role_selector": "getByRole('{role}', {name: '{name}'})",
      "type": "testid | role | label | css",
      "element_type": "button | textbox | combobox | ...",
      "confidence": 0.95,
      "verified_count": 1,
      "last_verified": "{ISO}",
      "status": "new | verified | stable | stale"
    }
  }
}
```

---

## Fallback behaviours

| Situation | Action |
|---|---|
| /cg-automate used without file path | Show usage message, stop |
| Excel file not found at given path | Tell user: "File not found: {path}" |
| .env file missing | Tell user: "No .env found. Create .env in project root." |
| Persona credentials missing | Tell user exactly which env vars to add |
| App unreachable at BASE_URL | Stop all. Report: "Unreachable: {BASE_URL}" |
| Element not found after 3 tries | Screenshot, skip step, mark FAILED, continue |
| "Alternate way" step | Skip. Log. Not a failure. |
| Login fails for a persona | Stop that persona's group. Continue others. |
| Modal doesn't open | Wait 5s, retry once, then fail the step |
| github-kb-mcp unavailable during /kb-sync | Warn user: "github-kb-mcp not connected." |
| Module slug unclear | Ask: "What module does TC '{id}' belong to?" |

---

## After completion -- output to user

```
CG Playwright Automator -- Complete.

Source:   {excel filename}
Modules:  {list}
Personas: {list with counts}
Duration: {time}

Results:
  Passed:  {N}
  Failed:  {N}
  Skipped: {N} alternate-path steps

Local KB updated:
  kb/selectors/{slug}.json
  kb/execution-reports/{date}-run.md

Run /kb-sync to push these to GitHub when ready.

Scripts written:
  {every file with Created / Updated label}

Run your tests:
  npx playwright test                                    # all tests
  npx playwright test --grep @IM-E2E-003                # single TC by ID
  npx playwright test --grep @funder                    # all Funder tests
  npx playwright test --grep @indicator-management      # all Indicator Management tests
  npx playwright test --grep @smoke                     # smoke suite
  npx playwright test --grep "@funder and @smoke"       # Funder smoke only

View latest report (find newest run directory first):
  npx playwright show-report reports/runs/<timestamp>/html
```
