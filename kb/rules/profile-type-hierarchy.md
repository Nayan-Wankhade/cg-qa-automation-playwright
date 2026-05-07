# Rule: Profile Type Hierarchy

**Applies to:** Connection management, request management

## Hierarchy

```
Org Level (Funder / Implementer / Both)
  └── Portfolio (Funder / Both only)
  └── Program (Implementer / Both only)
  └── Project (Implementer / Both only)
```

## Connection direction

Connections can be initiated from any profile type to any other.
The available relationship types depend on both profiles' types
(see `rules/connection-relationship-matrix.md`).

## Notes

- Profile type determines what appears in Feed panels (Portfolios vs Projects).
- Profile type also determines connection relationship options.
