# Changelog

## 2026-07-20

### UI polish

- Elevated the hero with a responsive visual hierarchy, guided-profile panel, gradients, and clear calls to action.
- Upgraded shared buttons, cards, and inputs with refined focus states, shadows, loading spinners, and responsive interaction feedback.
- Added polished loading, empty, success, and error states for the directory and eligibility experience.
- Refreshed recommendation and scheme cards with clearer benefit metadata, icons, action hierarchy, and mobile-friendly layouts.
- Improved the eligibility form’s profile header, checkbox controls, responsive spacing, and criteria-focused feedback messages.
- Added a reusable AI Eligibility Dashboard to scheme details, including a circular 0–100 score, confidence meter, breakdown, benefit and timing metrics, AI explanation, reasons, and recommended next steps.
- Extended eligibility responses with `eligibility_confidence` and `recommended_next_steps` while preserving every existing field.
- Added extensible AI Document Readiness data (`document_status` source metadata and `document_readiness`) plus Ready/Missing badges and tailored missing-document recommendations in the scheme details view.
- Added a branded, client-side Download PDF Report feature using jsPDF. Reports include the submitted profile, recommendations, scores, explanations, benefits, document readiness, application details, next steps, generation date, and BenefitBridge AI branding.
- Added graceful request-state UX: shared toast notifications, animated skeleton loaders, retry actions, empty states, API error messaging, and route/global/not-found error screens.

### Backend

- Added 16 schema-complete, clearly marked sample catalogue records across Agriculture, Healthcare, Women, Employment, Housing, Startup, Disability, and Senior Citizen categories; Education retains four existing records. Each sample includes benefits, eligibility, documents, AI guidance, next steps, and an official portal URL.
- Refactored FastAPI endpoints around a consistent `{ success, message, data }` JSON envelope, centralized exception handlers, and validated request/path/query inputs without changing any API URLs.
- Simplified scheme catalogue logic with shared safe loaders, matching, sorting, row generation, pagination, exports, and defensive malformed-data handling.
- Added request-model strictness and normalization, safe validation errors, and non-leaking unexpected-error responses.
- Added the missing `openpyxl` runtime dependency and backend startup documentation.
- Centralized data-root configuration and restricted legacy builder `filepath` values to JSON under `backend/data`.
- Added atomic JSON writes, basic JSON shape validation, and safer scheme ID matching.
- Validated scheme category consistency, update payloads, profile bounds, and pagination ranges.
- Reworked eligibility evaluation to aggregate all catalogue files and evaluate citizenship, occupation, education, course, disability, farmer, state, age, income, gender, and category requirements.
- Replaced fabricated alternating document statuses with user-supplied document readiness and made results reflect evaluated criteria.
- Registered the recommendation endpoint and added a health endpoint.
- Standardized missing-resource behavior to HTTP 404, validation failures to HTTP 422, and changed export endpoints to download CSV/XLSX responses without writing shared server files.
- Made CORS origins deployment-configurable through `CORS_ALLOW_ORIGINS`.

### Frontend

- Fixed all TypeScript and ESLint errors and changed the local API default to FastAPI's standard port 8000.
- Added input IDs, accessible labels, validation messages, number limits, loading/error feedback, and a visible zero-results state.
- Replaced unsafe nested button/link markup with valid links and rebuilt the scheme modal with dialog semantics, keyboard Escape close, focus placement, and backdrop close behavior.
- Connected primary calls to action and search entry points to usable routes; added the missing `/schemes`, `/compare`, and `/dashboard` pages.
- Added the footer to the shared layout and removed unsupported AI/scale claims from public content.
- Removed remote Google-font build dependency so offline production builds succeed.
- Corrected visible corrupted symbols in the rebuilt interactive UI.

### Verification

- `tsc --noEmit --incremental false` passes.
- ESLint passes.
- `next build` passes and prerenders `/`, `/eligibility`, `/schemes`, `/compare`, and `/dashboard`.
- FastAPI imports successfully; direct eligibility matching returns four matching records for a valid student profile, and CSV export generation succeeds.
