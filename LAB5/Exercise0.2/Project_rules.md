Project Rules — Lab 5, Exercise 0.2
1. How I work
I am completing Zero-Effect Pagination & Container Queries myself on Windows with VS Code, PowerShell, npm and Git. Explain each step in Vietnamese, but keep code, comments, identifiers, UI text, tests, documentation and commit messages in English. I want to understand the implementation well enough to defend it in class. Keep the UI clean and responsive.

Work on one task at a time. I create files, paste code, run tests, write my own audit and commit locally. When I say “xong” or “T03 xong”, accept my completion report and move directly to the next unfinished task without asking for proof. If I explicitly mention a failed check or missing commit, resolve it first.
2. No file uploads
Never ask me to upload files, repositories, lecture slides, package.json, archives or evidence screenshots. I may share error screenshots, short targeted code excerpts or terminal output as chat text. Ask only for necessary debugging details. Do not pretend to inspect my machine or request secrets. Evidence stays locally.
3. Assignment scope
Lab 5 PDF page 8 specifies Exercise 0.2: Zero-Effect Pagination & Container Queries, applying Lab 4's zero-effect principle to legacy React 8 (pagination) and React 7 (responsive layout).
- Initialize array state with useState([]) if local state is needed, never an empty string.
- Compute totalPages, startIdx and visibleItems from source data during render. Never store sliced data in a secondary effect or redundant state.
- Implement src/components/EvidenceGrid.jsx with props clips, page, and pageSize = 6.
- Use Math.ceil(clips.length / pageSize) || 1 for total pages, (page - 1) * pageSize for the starting index, and clips.slice(startIdx, startIdx + pageSize) for the displayed items, after normalizing invalid inputs at the appropriate boundary.
- Render each item through an EvidenceCard with key={clip._id}, not its array index.
- Replace rigid 800px containers with flexible layouts, 100dvh, CSS container queries and at least 44×44px interaction targets.
Page 9 requires integrating this grid with Exercise 0.1's AppProvider in Sprint 1. Page 22 provides the later Sprint 1 code contract: filter and slice during render, optionally using useMemo, with stable _id keys. Preserve a reusable grid interface; do not implement the entire sprint in this exercise. The lecture does not explicitly require copying an existing Lab 4 project. Prefer a separate Lab5/Exercise0.2 folder unless instructor-provided legacy code is available or the existing repository dictates otherwise. Do not modify Exercise 0.1. No backend, video playback, authentication, WebMCP or deployment is required here. Use clearly fictional local demonstration clips, not invented real evidence.
4. Inspect the repository first
Start with read-only PowerShell commands: Get-Location, Get-ChildItem -Name, git status -sb, git log -5 --oneline, git rev-parse --show-toplevel, node -v, npm -v. Check relevant installed versions and scripts through targeted commands. Use React 19 and compatible Vite, ESLint, Vitest and React Testing Library versions where appropriate; do not blindly install latest packages or force peer dependency resolution. Preserve existing lab folders and Git history. Do not initialize a nested repository if one already exists. Provide exact quoted folder creation commands if necessary.
5. Task decomposition
Before feature implementation, provide the complete English TASK_DECOMPOSITION.md, including task IDs, prerequisites, affected files, contracts, acceptance criteria, edge cases, test commands, status and suggested commits. Use TODO, IN PROGRESS, BLOCKED and DONE. These IDs are a proposed working plan, not official lecturer IDs.
ID	Task	Suggested commit
T01	Project setup, rules and task plan	chore(ex0.2): initialize project and task plan
T02	Pure derived pagination and unit tests	feat(ex0.2): implement zero-effect pagination
T03	EvidenceGrid, EvidenceCard and pagination controls	feat(ex0.2): implement evidence grid and navigation
T04	Responsive container queries and accessibility	feat(ex0.2): implement responsive accessible layout
T05	Edge cases and regression tests	test(ex0.2): verify pagination and responsive behavior
T06	README, audit review and live defense	docs(ex0.2): finalize documentation and defense checklist


Adapt paths to actual repository structure. Each task must leave a working, testable project and receive its own commit. Do not invent commit hashes.
6. Technical contracts
Keep source clips separate from derived visible items. Use a controlled page prop in EvidenceGrid and let its parent own the page and source data. A pure helper may normalize page and page size and compute the slice; keep the lecture's default page size of six. Define behavior for empty arrays (one logical page, no cards), partial last pages, exact multiples, invalid page values and non-positive or non-integer page sizes. Clamp the effective page when the data shrinks; do not call a setter during render or synchronize derived state through an effect. Ensure pagination controls use the same effective page as the grid. If page size is configurable, document reset/clamping behavior. Do not mutate input data or use array indices as keys. Use unique stable _id values in demo data.

Use semantic HTML, accessible button names, disabled boundary controls, visible keyboard focus, meaningful empty state and an accessible current-page indicator. Set a named or unnamed container-type: inline-size ancestor and use @container rules on descendants so the layout responds to container width, not just viewport width. Use flexible grid columns, wrapping controls and min-height: 100dvh where appropriate, with no horizontal overflow. Ensure interactive controls are at least 44×44 CSS pixels. A media query may supplement but not replace container queries. Keep dependencies minimal.
7. How to guide each task
For the current task only, state the objective and prerequisites, list exact paths, provide safe ready-to-paste PowerShell commands to create every new folder/file and open it in VS Code, then provide complete contents of every changed or new file. Avoid truncating existing files; no ellipses, incomplete imports or scripts that silently write all implementation code. I paste manually. Provide full replacement files for fixes while preserving unrelated functionality and audit entries. For my audit, provide only templates, questions and factual guidance, not invented first-person entries.

Use contract-first development: describe behavior, provide focused tests and implementation, explain key code, give actual npm commands and expected results clearly labeled as expectations. Include manual browser checks, task status updates and exact Git commands. Stop after the current task; when I report completion, proceed directly.
8. Verification
Test empty lists, 1 item, exactly 6, 7, 12 and 13 items; first/last page, next/previous boundaries, invalid page/pageSize, data shrink, stable IDs, and source array immutability. Verify default six items per page and correct last-page slices. Use unit tests for pure logic and React Testing Library for UI behavior. Check that no effect stores derived pagination data. Run actual lint, test and production build scripts. Check narrow and wide container widths, including two containers at the same viewport width if useful, 44×44px targets, keyboard navigation, focus, no overflow and browser console. Do not claim that jsdom proves real CSS layout or that Lighthouse proves full WCAG compliance. Record actual results only; save screenshots locally if useful. Do not demand proof in chat.
9. My AI_FAILURE_AUDIT.md
I write the audit myself in English. After each resolved error, explain the verified cause and fix, distinguish AI-generated defects from environment issues, my typing mistakes and legacy defects, and remind me to decide whether it belongs in the audit. Never invent incidents or classify an error as AI failure without evidence. Provide targeted questions and a blank template when helpful:
- Incident title, task and date:
- AI suggestion or instruction:
- Observed failure and local evidence:
- Verified root cause and classification:
- Manual investigation and exact fix:
- Tests rerun and actual results:
- Lesson and prevention:
- Local evidence path or known commit reference:
Watch for redundant effects, wrong page boundaries, unstable keys, invalid initial state, incompatible test dependencies and container queries attached to the wrong element. These are risks, not actual incidents. Ask me to save my own entry locally before committing when appropriate. Never request an upload.
10. Git discipline
Every completed task must include a meaningful English Conventional Commit and its task status update. Provide exact quoted per-file git add commands, git status -sb, git diff --check, relevant diffs, git diff --cached, git commit -m, git log -1 --oneline and final status. Never stage unrelated exercises, node_modules, dist, .env or secrets. Do not blindly use git add ., reset, amend, force-push or destructive cleanup. Commit locally by default; push only when requested and after verifying remote and branch. Do not advance if I explicitly report a missing commit.
11. Definition of done and defense
Complete when the grid and controls work with six-item default pagination, all derived values are calculated during render, stable keys are used, container queries respond to actual container width, controls meet the stated size requirement, tests and build are reproducible, and documentation, audit and Git history reflect actual work. Provide a concise Vietnamese three-minute defense on source versus derived state, why secondary effects cause redundant renders, pagination formulas, stable keys, container versus media queries, edge cases and a live bug-fix exercise. Explain how the grid can later integrate with Exercise 0.1 without implementing Sprint 1 now. Never claim completion solely because code was generated.