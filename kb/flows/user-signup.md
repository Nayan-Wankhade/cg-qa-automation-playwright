# Flow: User Sign Up

**Performed by:** New users (unauthenticated)
**Starts on:** Login page
**Ends on:** Feed page (after org creation/join)

## Steps

1. User opens Common Ground URL → lands on login page ("Welcome Back!")
2. User clicks **"Sign Up"** hyperlink below Login button.
3. Navigates to "Welcome to CommonGround!" / "Create Account" page.
4. User enters **Work Email** and **Password** (both required).
5. **Sign Up** button enables once both fields have values.
6. User clicks **Sign Up**.
7. Confirmation message: user must verify email.
8. User opens email inbox, clicks verification link.
9. User returns to login page and logs in with credentials.
10. First-time login: sees org selection screen (Create / Join).
11. User proceeds to create or join an organization.
12. After completion → lands on blank Feed page.

## What can go wrong

- Invalid email format → validation error
- Weak password → validation error
- Email already registered → error message
- Email not verified → login blocked with "Please verify your email"

## Related validations

- `validations/signup-form-validations.md`
