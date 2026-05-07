# CG Playwright -- File and Folder Structure

This map shows the intended project shape. Source files grow only from Excel
driven automation runs; `kb/` is tracked, while runtime reports and `.env` stay
local.

```mermaid
%%{init: {"theme": "base", "themeVariables": {"fontFamily": "Inter, Segoe UI, Arial", "fontSize": "14px", "primaryTextColor": "#172033", "lineColor": "#64748b"}}}%%
flowchart TB
    ROOT["cg-playwright-v2/<br/><b>project root</b>"]:::root

    subgraph ROOTFILES["Root configuration"]
        direction LR
        AG["AGENTS.md<br/>automation contract"]:::doc
        CFG["playwright.config.ts<br/>runner config"]:::config
        PKG["package.json<br/>dependencies + scripts"]:::config
        TS["tsconfig.json<br/>TypeScript paths"]:::config
        ENV[".env<br/>not committed"]:::secret
        GI[".gitignore<br/>local output rules"]:::config
    end

    subgraph SCRIPTS["scripts/"]
        direction LR
        SX["parse_excel.py<br/>Excel to JSON"]:::tool
        SK["key_derivation.py<br/>step to selector key"]:::tool
        SR["open-latest-report.js<br/>report helper"]:::tool
    end

    subgraph KB["kb/ - tracked knowledge base"]
        direction TB
        KB1["pages/<br/>UI reference"]:::kb
        KB2["rules/<br/>business + UI rules"]:::kb
        KB3["selectors/<br/>_index.md + module maps"]:::selector
        KB4["execution-reports/<br/>run markdown"]:::report
        KB5["personas/<br/>capability docs"]:::kb
        KB6["flows/<br/>workflow docs"]:::kb
        KB7["validations/<br/>field rules"]:::kb
    end

    subgraph DOCS["docs/diagrams/"]
        direction LR
        D1["01 automation workflow"]:::doc
        D2["02 project architecture"]:::doc
        D3["03 KB ecosystem"]:::doc
        D4["04 file structure"]:::doc
    end

    subgraph SRC["src/ - Playwright TypeScript"]
        direction TB
        subgraph CON["constants/"]
            C1["index.ts<br/>routes, tags, messages,<br/>timeouts, tcTag"]:::source
            C2["personas.ts<br/>active personas only"]:::source
        end

        subgraph DATA["data/factories/"]
            F1["module.factory.ts<br/>dynamic test data"]:::source
        end

        subgraph FIX["fixtures/"]
            X1["index.ts<br/>page object fixtures"]:::source
        end

        subgraph PAGES["pages/"]
            direction TB
            B1["common/BasePage.ts<br/>login, toast, modal,<br/>table, network helpers"]:::source
            M1["modules/{module-slug}/<br/>{ModuleName}Page.ts"]:::source
        end

        subgraph TESTS["tests/e2e/{module-slug}/"]
            T1["{module-slug}.spec.ts<br/>Excel TC IDs + persona groups"]:::source
        end

        subgraph TYPES["types/"]
            Y1["domain.types.ts<br/>module interfaces"]:::source
        end
    end

    subgraph REPORTS["reports/ - not committed"]
        direction LR
        R1["html/<br/>browser report"]:::report
        R2["junit/results.xml<br/>CI integration"]:::report
        R3["results.json<br/>machine output"]:::report
        R4["attachments/<br/>screenshots, videos, traces"]:::report
    end

    ROOT --> ROOTFILES
    ROOT --> SCRIPTS
    ROOT --> KB
    ROOT --> DOCS
    ROOT --> SRC
    ROOT --> REPORTS

    M1 --> X1 --> T1
    C1 --> B1
    C1 --> M1
    C2 --> T1
    F1 --> T1
    Y1 --> M1
    Y1 --> F1
    KB3 -. selectors feed .-> M1
    KB1 -. reference .-> M1
    KB2 -. rules .-> T1
    SX -. parsed_tests.json temp .-> T1

    classDef root fill:#0f172a,stroke:#0f172a,color:#ffffff,stroke-width:2px;
    classDef config fill:#e0f2fe,stroke:#0284c7,color:#0c4a6e,stroke-width:1.5px;
    classDef secret fill:#fef3c7,stroke:#d97706,color:#78350f,stroke-width:1.5px;
    classDef tool fill:#ede9fe,stroke:#7c3aed,color:#3b0764,stroke-width:1.5px;
    classDef kb fill:#ecfccb,stroke:#65a30d,color:#365314,stroke-width:1.5px;
    classDef selector fill:#dcfce7,stroke:#16a34a,color:#14532d,stroke-width:1.5px;
    classDef report fill:#f1f5f9,stroke:#64748b,color:#334155,stroke-width:1.5px;
    classDef doc fill:#f8fafc,stroke:#64748b,color:#334155,stroke-width:1.5px;
    classDef source fill:#fce7f3,stroke:#db2777,color:#831843,stroke-width:1.5px;
```
