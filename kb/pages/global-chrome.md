# Global Chrome (Top Nav + Sidebar)

**URL:** Present on all `/console/*` pages
**Accessible to:** All logged-in users

## Top navigation bar

See `pages/header.md` for full header documentation.

Key behavior: **Home / Logo → Feed page** (not Console Dashboard).

## Left sidebar sections

### ANALYZE YOUR IMPACT DATA
- Dashboard
- Analytics and Saved Charts

### MANAGE YOUR PROFILE
- Connections and Requests
- Indicator Management
- Results Management

### BUILD & SHARE YOUR IMPACT PROFILE
- Profile Builder
- Sharing Settings

Above sections: **Profile Completeness donut** (percentage).

## Sidebar behavior by persona

**Funder:** All sections visible. Settings gear non-functional.
**Implementer:** Same sidebar structure. Verified via test cases.
**Both:** Same sidebar structure.

## URL patterns

| Page | Pattern |
|---|---|
| Console Dashboard | `/console/{profileId}/dashboard` |
| Profile Builder | `/console/{profileId}/profile-builder` |
| Connections | `/console/{profileId}/connections-management` |
| Indicators | `/console/{profileId}/indicator-management` |
| Results | `/console/{profileId}/results-management` |
| Narratives tab | `?tab=narratives` |
| Indicator drill-down | `?indicatorId={uuid}&tab=indicatorResult` |
| Public Profile | `/profile-view/{profileId}` |
| Feed | `/feed/{profileId}` |
