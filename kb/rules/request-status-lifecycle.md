# Rule: Request Status Lifecycle

**Applies to:** `pages/results-and-narrative-management.md`

## States

| Status | Condition |
|---|---|
| **Pending** | Request sent, awaiting response/publish |
| **Up to Date** | Request accepted / narrative changes published |
| **Overdue** | Due date passed without action |

## Transitions

- Pending → Up to Date: Portfolio Member publishes results/narrative
- Pending → Overdue: Due date passes without action
