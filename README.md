# Common Ground — Playwright Automation Suite

E2E and API test suite with three-persona coverage: Funder, Implementer, Both.

---

## Setup

```bash
npm install
npx playwright install chromium
cp .env.example .env
# Fill in credentials for all three personas in .env
```

---

## Run tests

```bash
# All tests
npm test

# E2E only
npm run test:e2e

# API only
npm run test:api

# By persona
npm run test:funder
npm run test:implementer
npm run test:both

# Headed (see the browser)
npm run test:headed

# Debug a specific test
npm run test:debug

# Open Playwright UI (recommended for local dev)
npm run test:ui
```

---

## View reports

```bash
npm run report       # opens HTML report
```

Reports saved to `reports/html/` and `reports/junit/results.xml`.

---

## Project structure

```
src/
├── tests/
│   ├── e2e/
│   │   ├── auth/                  Login tests for all 3 personas
│   │   ├── result-management/     CRUD + validation + permissions per persona
│   │   └── indicator-management/  CRUD + validation + permissions per persona
│   └── api/
│       ├── result-management/     REST contract tests per persona
│       └── indicator-management/  REST contract tests per persona
├── pages/
│   ├── common/BasePage.ts         Shared helpers (toast, modal, table, etc.)
│   ├── common/LoginPage.ts
│   ├── modules/result-management/
│   └── modules/indicator-management/
├── fixtures/
│   ├── index.ts                   Extended test object (pages + data + contexts)
│   └── auth.setup.ts              Logs in all 3 personas, saves storage state
├── data/factories/                Faker-based data generators (valid/edge/negative)
├── utils/ApiClient.ts             Typed HTTP client with per-persona auth
├── types/domain.types.ts
└── constants/
    ├── index.ts                   Routes, API paths, messages, tags, limits
    └── personas.ts                Funder / Implementer / Both — credentials + permissions
```

---

## Personas

Defined in `src/constants/personas.ts`.

| Persona | Tag | Can create/edit/delete | Can view reports |
|---|---|---|---|
| Funder | `@funder` | ✗ | ✓ |
| Implementer | `@implementer` | ✓ | ✗ |
| Both | `@both` | ✓ | ✓ |

Auth state is saved per persona in `src/fixtures/.auth/` (gitignored).
The `setup` project logs in all three personas once before the E2E suite runs.

---

## Adding a new persona

1. Add credentials to `.env`
2. Add the persona entry in `src/constants/personas.ts`
3. Add `loginAs` call in `src/fixtures/auth.setup.ts`
4. Use `test.use({ storageState: PERSONAS.newpersona.storageFile })` in specs

## Adding a new module

1. Add page object in `src/pages/modules/{module}/`
2. Add factory in `src/data/factories/{module}.factory.ts`
3. Add routes/constants to `src/constants/index.ts`
4. Write E2E spec in `src/tests/e2e/{module}/`
5. Write API spec in `src/tests/api/{module}/`
