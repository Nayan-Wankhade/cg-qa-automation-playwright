# CG Playwright -- KB Ecosystem

The local `kb/` folder is the automation memory. `/cg-automate` writes selector
maps and run reports locally; `/kb-sync` and `/kb-pull` move that knowledge
between machines through GitHub.

```mermaid
%%{init: {"theme": "base", "themeVariables": {"fontFamily": "Inter, Segoe UI, Arial", "fontSize": "14px", "primaryTextColor": "#172033", "lineColor": "#64748b"}}}%%
flowchart LR
    subgraph RUN["/cg-automate"]
        direction TB
        R1["Phase 2 write-back"]:::process
        R2["selectors/module.json<br/>confirmed, repaired,<br/>new selectors only"]:::selector
        R3["execution-reports/date-run.md<br/>run summary, failures,<br/>written scripts"]:::report
        R1 --> R2
        R1 --> R3
    end

    subgraph LOCAL["Local KB - tracked in git"]
        direction TB
        L1["selectors/<br/>module maps + _index.md"]:::selector
        L2["execution-reports/<br/>run history"]:::report
        L3["reference folders<br/>pages, rules, personas,<br/>flows, validations"]:::reference
    end

    subgraph SYNC["/kb-sync"]
        direction TB
        S1["Read local selectors<br/>and execution reports"]:::process
        S2["get_file<br/>detect existing SHA"]:::mcp
        S3["update_file<br/>update existing or<br/>create new file"]:::mcp
    end

    subgraph GITHUB["GitHub KB Repository"]
        direction TB
        G1["selectors/"]:::remote
        G2["execution-reports/"]:::remote
        G3["reference folders"]:::remote
        G4["root docs<br/>README, changelog,<br/>open questions"]:::remote
    end

    subgraph PULL["/kb-pull"]
        direction TB
        P1["list_files<br/>for every KB folder"]:::mcp
        P2["get_file<br/>download content"]:::mcp
        P3["overwrite local kb/<br/>full refresh"]:::process
    end

    subgraph TEAM["Other Machines"]
        direction TB
        T1["New teammate<br/>or stale machine"]:::person
        T2["Runs /kb-pull<br/>gets latest KB state"]:::person
    end

    R2 --> L1
    R3 --> L2
    L1 --> S1
    L2 --> S1
    S1 --> S2 --> S3
    S3 --> G1
    S3 --> G2

    G1 --> P1
    G2 --> P1
    G3 --> P1
    G4 --> P1
    P1 --> P2 --> P3
    P3 --> L1
    P3 --> L2
    P3 --> L3

    T1 --> T2 --> P1
    G1 -. "latest selectors" .-> T2
    G2 -. "run history" .-> T2
    G3 -. "reference docs" .-> T2

    classDef process fill:#e0f2fe,stroke:#0284c7,color:#0c4a6e,stroke-width:1.5px;
    classDef selector fill:#dcfce7,stroke:#16a34a,color:#14532d,stroke-width:1.5px;
    classDef report fill:#f1f5f9,stroke:#64748b,color:#334155,stroke-width:1.5px;
    classDef reference fill:#ecfccb,stroke:#65a30d,color:#365314,stroke-width:1.5px;
    classDef mcp fill:#ede9fe,stroke:#7c3aed,color:#3b0764,stroke-width:1.5px;
    classDef remote fill:#0f172a,stroke:#0f172a,color:#ffffff,stroke-width:2px;
    classDef person fill:#fff7ed,stroke:#ea580c,color:#7c2d12,stroke-width:1.5px;
```
