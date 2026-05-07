# Validation: Indicator Name Minimum Length

**Applies to:** Create Indicator modal (Step 1)

## What the rule says

Indicator Name must be **at least 3 characters**. Entering fewer than
3 characters displays an error message.

## Examples that should fail

| Input | Expected |
|---|---|
| "AB" (2 chars) | Error message displayed |
| "A" (1 char) | Error message displayed |
| "" (empty) | Next button disabled |

## Notes

- Verified for both Funder and Implementer personas.
- Exact error message text not captured — verify during next exploration.
