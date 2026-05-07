# Metadata Defaults — Excel columns O–U

| Col | Header | Default |
|---|---|---|
| O | Issue Link Type | `relates to` |
| P | Link To Issue | Jira ticket ID |
| Q | Label | See mapping below |
| R | Component | Matches Label without `E2E_` prefix |
| S | Is Automated? | Blank |
| T | Assignee | QA engineer |
| U | Fix versions | Ticket fixVersion |

## Label mapping

| Area | Label (Q) | Component (R) |
|---|---|---|
| User Sign Up | `E2E_User_Sign_Up` | `User Sign Up` |
| Feed Screen | `E2E_Feed_Screen` | `Feed Screen` |
| Header | `E2E_Header` | `Header` |
| Console Navigation | `E2E_Console_Navigation` | `Console Navigation` |
| Profile Builder | `E2E_Profile_Builder` | `Profile Builder` |
| Profile Prompts | `E2E_ProfilePrompt` | `ProfilePrompt` |
| Connections | `E2E_Connection_Management` | `Connection Management` |
| Indicators | `E2E_Indicator_Management` | `Indicator Management` |
| Results & Narratives | `E2E_Result_Management` | `Result Management` |
| Analytics | `E2E_Analytics` | `Analytics` |
| Impact Profile | `E2E_Impact_Profile` | `Impact Profile` |
