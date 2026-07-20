# BenefitBridge AI — Engineering Audit

**Audit date:** 20 July 2026  
**Scope:** entire tracked project source, configuration, and bundled JSON data; no application files were changed.  
**Validation performed:** `tsc --noEmit --incremental false` (pass), ESLint (fail: 2 errors, 1 warning), import/API/data-flow review, and file-reference analysis. A clean FastAPI runtime could not be exercised because the workspace's virtual-environment interpreter is not executable in this environment; runtime findings below are traced from the code and manifests.

## Executive summary

The UI type-checks, but the project is not production-ready. Its main functional flow is a narrow education-only eligibility demo. The repository has broken lint gates, a deployment-blocking Python dependency omission, unsafe arbitrary-path builder APIs, incomplete routes/features advertised by the UI, and fabricated eligibility/document outputs that could mislead users. No TypeScript compiler errors or unresolved TypeScript imports were found.

## Critical issues

| ID | Finding | Evidence | Impact / priority |
| --- | --- | --- | --- |
| C1 | The backend cannot be installed reliably from `requirements.txt`. | `backend/app/services/scheme_service.py` imports `openpyxl.Workbook`, while `backend/requirements.txt` does not declare `openpyxl`. It only happens to exist in the local `venv`. | A clean deployment fails during application import with `ModuleNotFoundError: openpyxl`. **P0** |
| C2 | Builder endpoints allow client-controlled filesystem reads and writes. | `SchemeRequest.filepath` is passed unchanged to JSON load/save by `POST`/`PUT /builder/scheme/{id}`. `JSONWriter` opens that path directly. | An unauthenticated caller can attempt to read JSON from arbitrary readable paths, or overwrite/delete arbitrary writable JSON files. This is a severe data-integrity/security flaw. **P0** |
| C3 | Eligibility results are presented as personalized AI analysis but are fabricated. | `EligibilityService` alternates document `Ready`/`Missing` by index and returns a fixed score/confidence of 95 with every breakdown item matched. | Users can be given false document-readiness and eligibility information, a serious trust and potentially harm-inducing defect for benefits guidance. **P0** |

## Medium issues

| ID | Finding | Evidence | Impact / priority |
| --- | --- | --- | --- |
| M1 | The configured frontend lint gate fails. | ESLint reports `no-explicit-any` at `EligibilityForm.tsx:51`, `react/no-unescaped-entities` at `AISearch.tsx:24`, and unused `reset` at `EligibilityForm.tsx:22`. | CI that runs `npm run lint` fails. **P1** |
| M2 | Data paths depend on the process working directory. | Routes and exports use relative paths such as `data/education.json` and `data/schemes_export.xlsx`. | Launching from the repository root or a process manager's working directory causes missing-data/file errors; exports can also target an unexpected directory. **P1** |
| M3 | The API only evaluates `data/education.json`; all eight category files are empty. | `eligibility_routes.py` hard-codes education; `agriculture`, `disability`, `employment`, `healthcare`, `housing`, `senior_citizen`, `startup`, and `women` JSON files each contain zero schemes. | The product cannot fulfil its cross-category discovery claims. **P1** |
| M4 | The navigation links point to pages that do not exist. | `Navbar.tsx` links to `/schemes`, `/compare`, and `/dashboard`; only `/` and `/eligibility` routes exist. | Three primary navigation actions produce 404 pages. **P1** |
| M5 | The prominent interaction controls do nothing. | Hero “Get Started”/“Learn More”, nav “Get Started”, featured-scheme “Learn More”, and AI search button have no route, submit handler, or `onClick`. | Key discovery/conversion flows are dead ends. **P1** |
| M6 | The advertised natural-language/AI search is not implemented. | `AISearch.tsx` holds local uncontrolled text only; there is no frontend API call or backend recommendation router. `recommendation_routes.py` and `recommendation_service.py` are empty and not included in `main.py`. | A flagship claimed MVP feature is absent. **P1** |
| M7 | Eligibility logic ignores significant stored eligibility constraints. | It checks only age, gender, income, category, and conditional state. It ignores citizenship, occupation, education level, class/course, disability, farmer, and `other_conditions`; the request model cannot carry most of them. | It produces false positive recommendations. **P1** |
| M8 | Unvalidated user profile values permit nonsensical requests. | `UserProfile` has unconstrained `int`/`str` fields; the form has no `min`, `max`, select options, inline validation, or visible errors. | Negative age/income and malformed profile data enter the matching logic; users receive weak feedback. **P1** |
| M9 | Create/update endpoints have inconsistent source and validation behavior. | Create accepts arbitrary `filepath` and validates via `Scheme`; update accepts arbitrary `filepath` but overwrites the entire object without Pydantic/business validation. All read/delete routes use only education data. | Data can be written outside the data set, malformed on update, then invisible to normal reads. **P1** |
| M10 | Public API error/status behavior is inconsistent. | Missing schemes return a `200` object with `success: false`; list endpoints return bare arrays; create returns a different object; declared `SchemeResponse` is unused. | Clients cannot depend on a stable contract or standard HTTP semantics. **P1** |
| M11 | No production CORS/configuration model exists. | Origins are limited to localhost, and API base URL defaults to port 9000 while FastAPI itself has no launch configuration (Uvicorn defaults to 8000). | A typical local launch causes Axios connection failure; deployed frontend origins are rejected without source/config changes. **P1** |
| M12 | `GET /builder/export/csv` and `/excel` create server files rather than returning downloads. | Export functions write fixed paths and return a JSON path string. | Requests mutate server storage, concurrent users overwrite each other's export, and the browser receives no file. **P1** |
| M13 | Pagination accepts invalid values. | `page` and `limit` have no bounds. Zero causes division by zero; negative values create misleading Python slices. | A request can cause 500 errors or invalid responses. **P1** |
| M14 | UI never displays the “No Eligible Schemes” state. | `EligibilityForm` renders `RecommendationList` only when `schemes.length > 0`, while its empty-state branch is inside that component. | A valid zero-result search silently shows nothing. **P1** |
| M15 | Multiple text strings are mojibake. | Examples include `âœ¨`, `âœ•`, `â‚¹`, and `ðŸ“‹` in `AISearch.tsx`, `SchemeDetailsModal.tsx`, `Hero.tsx`, backend descriptions, and data. | Visible user-facing currency, emoji, and close-mark text are corrupted. **P1** |

## Minor issues

| ID | Finding | Evidence | Impact / priority |
| --- | --- | --- | --- |
| N1 | The repo contains no TypeScript compiler errors and no missing TypeScript imports. | `tsc --noEmit --incremental false` exited 0; all `@/*` references resolve under `tsconfig.json`. | Good baseline, but it does not override the failing lint gate. **P2** |
| N2 | A button is nested inside an anchor in both recommendation views. | `RecommendationList.tsx` and `SchemeDetailsModal.tsx` render `<a><Button>…</Button></a>`. | Invalid nested interactive controls can cause accessibility/browser behavior problems. **P2** |
| N3 | The modal is inaccessible and fragile on small screens. | No dialog role/aria attributes, focus trap, Escape handling, focus restoration, or backdrop-close behavior. | Keyboard and assistive-technology users cannot reliably operate it. **P2** |
| N4 | Form labels are not programmatically associated with inputs. | `Input.tsx` renders a label without `htmlFor`, and inputs do not get a matching id. | Reduced accessibility and click-to-focus behavior. **P2** |
| N5 | Required backend package/module documentation is incomplete. | No backend README, run command, environment template, tests, or API documentation beyond FastAPI defaults. | Onboarding and reproducible deployment are weak. **P2** |
| N6 | `text_import.py` executes a side-effecting print at import time and is not used by the app. | It is never imported and only validates imports. | Dead utility code; unsuitable as a health check. **P2** |
| N7 | JSON operations are not atomic or concurrency-safe. | `JSONWriter.load` then `save` overwrites files with no lock, temp file, or error handling. | Concurrent builders can lose data; malformed JSON yields unhandled 500s. **P2** |
| N8 | Multiple service methods index required JSON keys directly. | For example `scheme["id"]`, `scheme["category"]`, and `scheme["state"]`. | One malformed record causes a 500 rather than a controlled validation/error response. **P2** |
| N9 | Scheme identifiers can be misassigned or duplicated. | IDs are generated from a category supplied separately from `scheme_data["category"]`; `re.match` is not end-anchored; operations are race-prone. | Category/prefix mismatch and collisions are possible. **P2** |
| N10 | Home content makes unsubstantiated claims. | UI claims 1,200+ schemes, 29 states, 95% accuracy, 1M+ citizens, and 24×7 AI while only four education records exist and there is no AI engine/analytics. | Product credibility and compliance risk. **P2** |

## Unused or incomplete files

The following zero-byte TypeScript components are not imported anywhere and have no implementation:

- `frontend/components/scheme/ActionPlanSection.tsx`
- `frontend/components/scheme/AIDashboard.tsx`
- `frontend/components/scheme/ApplicationSection.tsx`
- `frontend/components/scheme/BenefitCard.tsx`
- `frontend/components/scheme/DocumentSection.tsx`
- `frontend/components/scheme/EligibilitySection.tsx`
- `frontend/components/scheme/SchemeHeader.tsx`
- `frontend/components/sections/Footer.tsx`

Other unused/incomplete artifacts:

- `backend/app/config.py` and `backend/app/data_loader.py` are empty and unused.
- `backend/app/routes/recommendation_routes.py` and `backend/app/services/recommendation_service.py` are empty; the router is not registered.
- `backend/app/models/response_models.py` is not used by any route.
- `backend/text_import.py` is an unused import smoke-test script.
- Default `frontend/public/*.svg` assets are unused by the UI.
- `frontend/ts_config.json` is redundant/confusing beside the actual `tsconfig.json` (it contains only `{}`).

## Interface and API contract review

The one active frontend call, `POST /eligibility/check`, has matching request field names and the frontend's `EligibilityResponse` generally matches the fields currently synthesized by `EligibilityService`. It is nevertheless an incomplete contract: `EligibilityCriteria` treats several backend-required fields as optional, and it cannot describe whether citizenship/occupation/etc. were evaluated.

The builder API has no frontend caller. Its `SchemeRequest` uses `filepath`, `category`, and arbitrary `scheme_data`, whereas `SchemeResponse` is unused and CRUD responses differ by endpoint. There is no OpenAPI-derived frontend client or shared schema, so drift is already likely.

## Missing production-MVP capabilities

1. Implement actual scheme catalogue ingestion/verification, coverage across categories/states, provenance, last-verified governance, and a correction/reporting path.
2. Implement and validate the complete eligibility profile and explain each decision truthfully; do not infer document possession without user input.
3. Build the advertised schemes browser, scheme detail routes, comparison, dashboard/saved items, and natural-language search—or remove their navigation and claims.
4. Replace exposed builder/file APIs with authenticated, authorized admin APIs backed by a database/object store; restrict file locations and use transactions.
5. Add authentication, authorization (including admin roles), rate limiting, audit logs, abuse monitoring, privacy notice/consent, data retention, and secure secrets/environment configuration.
6. Add stable API versioning, request/response schemas, standard errors/status codes, download streaming for exports, and pagination/filter validation.
7. Add automated unit, API-contract, integration, accessibility, and end-to-end tests; require type-check/lint/test/build in CI.
8. Add production readiness: health/readiness endpoints, structured logging, exception handling, metrics, deployment config, CORS environment allow-list, and dependency vulnerability/update management.
9. Complete responsive/mobile navigation, empty/loading/error states, accessible dialogs/forms, and externally safe URL handling.

## Recommended remediation order

1. **Before any deployment:** add and pin `openpyxl`; eliminate arbitrary `filepath` access; move all data paths to a configured application root; implement error handling and request bounds.
2. **Before user testing:** correct the eligibility model and remove fabricated signals/claims; restore text encoding; fix lint errors; make zero-result/error UI visible.
3. **Before MVP launch:** implement or remove every advertised route/feature, populate verified data, establish authentication/admin controls, and define one versioned API contract.
4. **For operational quality:** migrate mutable JSON storage to a transactional database, add tests/CI/observability, and harden accessibility and responsive UX.
