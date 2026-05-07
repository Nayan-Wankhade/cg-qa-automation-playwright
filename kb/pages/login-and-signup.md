# Login and Sign Up Pages

**URL:** `/` (login), `/signup` (sign up)
**Accessible to:** Unauthenticated users

## What this page is for

Entry point for authentication — login for existing users, sign up for new users.

## Login page

- **Title:** "Welcome Back!"
- **Fields:** Work Email, Password (both required)
- **Login** button — disabled until both fields populated
- **"Sign Up"** hyperlink below Login button → navigates to sign up page
- **"Forgot Password"** hyperlink below Login button

### Login errors
- Invalid credentials: "Invalid email or password. Please try again."

## Sign Up page

- **Title:** "Welcome to CommonGround!"
- **Sub-title:** "Create Account"
- **Fields:** Work Email, Password (both required)
- **Sign Up** button — disabled until both fields populated
- After sign up: email verification required before login is allowed
- Unverified users who attempt login see: "Please verify your email"

## Forgot Password flow

- **Title:** "Forgot your password?"
- User enters registered email
- Receives password reset link via email
- Reset page validates: mismatched passwords show error, reusing old password shows error

## What happens after first login (new user)

After first-time login, user sees two options:
- **"Create a New Organization"** radio button
- **"Join an Existing Organization"** radio button

See `flows/create-organization.md` and `flows/join-organization.md`.

## Notes

- Login button follows the global save-button-disable pattern (see `validations/save-button-disable-pattern.md`).
- Email verification is mandatory — unverified accounts cannot log in.
