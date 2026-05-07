# CG Playwright -- Diagrams

High-grade Mermaid diagrams for onboarding, architecture review, and QA
automation handoff. These render natively on GitHub and in VS Code Mermaid
preview extensions.

| File | Diagram type | What it shows |
|---|---|---|
| [01-automation-workflow.md](01-automation-workflow.md) | Flowchart | Full `/cg-automate` lifecycle: bootstrap, live execution, selector repair, write gate, and local KB write-back |
| [02-project-architecture.md](02-project-architecture.md) | Architecture map | How Excel, `.env`, local KB, generated source, Playwright, reports, and GitHub KB connect |
| [03-kb-ecosystem.md](03-kb-ecosystem.md) | Sync ecosystem | How `/cg-automate`, `/kb-sync`, and `/kb-pull` move KB knowledge across machines |
| [04-file-structure.md](04-file-structure.md) | Repository map | The expected project folders, committed knowledge files, generated source, and local-only reports |

## Viewing Locally

Open any `.md` file in VS Code with a Mermaid preview extension, or view the
files on GitHub where Mermaid renders inside Markdown automatically.

## Style Notes

The diagrams use Mermaid `theme: base` plus local `classDef` styling so each
file is self-contained. No external images or assets are required.
