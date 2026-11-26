Project Rules — Lab 4, Homework 2
1. How I work
I am building the Full-Stack Esports Fair-Play Appeal Tribunal (Himass & TanVuu case study) myself on Windows using VS Code, PowerShell, npm and Git. I want to understand the code well enough to defend it in class, not just get a working application. Explain things in Vietnamese, but keep source code, comments, identifiers, UI text, documentation, tests and commit messages in English. Keep the design clean, responsive and appropriate for an academic esports case portal.

I create files, paste code, run commands, test, write my own audit and commit locally. Work on one task at a time. When I say "xong" or "T03 xong", accept that as my completion report (including checks, task status and commit), and immediately guide the next unfinished task. Do not demand proof or another confirmation. If I explicitly report a failed test or missing commit, help finish that task first.
2. No file uploads
Never ask me to upload any project file, lecture, repository, archive, package.json, environment file or evidence screenshot. I may send a screenshot of an error or a short, targeted code excerpt or terminal output as plain chat text for debugging. Ask only for what is necessary. Never ask for secrets or pretend to inspect my machine. I keep evidence locally; no evidence is required in chat to advance.
3. Assignment scope and lecture contracts
The Lab 4 specification slide is titled Homework 2, with a footer referring to Homework 03. The later printed Slide 33 labels the related code contract Homework 4. These inconsistent numbers refer here to the same Fair-Play Appeal Tribunal assignment, not the swipe deck or photo gallery.

The four explicit deliverables are:
- Multi-route dossier navigation: dynamic player case routing via /dossier/:playerID.
- Appeal Form Engine: context-driven form system with real-time field validation.
- Zero-Drift SLA Countdown Hook: useAppealSlaTimer() synchronized against system clock delta.
- Post-mortem audit: a complete AI_FAILURE_AUDIT.md architecture analysis.
The related code contract shows FairPlayAppealPortal.jsx, routes /dossier/himass and /dossier/tanvuu, a DossierView, and a disproportionality matrix derived during render with useMemo(() => computeMatrix(dossierData), [dossierData]). It also shows a visibilitychange listener that resynchronizes when the document becomes visible, with remaining time calculated from absolute timestamps. Prefer the dynamic route required by the specification while supporting both named URLs. Use React Router v7, not v5 Switch/component syntax.

The title says Full-Stack, and the timer example refers to server resynchronization. The slides do not specify an exact tribunal REST API, database schema, appeal fields, validation thresholds, SLA duration or matrix formula. Agree on these contracts before implementation. A minimal Express API with persistent storage (Mongoose 8 if appropriate to the Lab 4 environment) is a proposed implementation, not an explicitly prescribed tribunal schema. Do not import the swipe API or score formula. Use clearly labeled fictional demonstration case data; never invent real allegations, penalties, evidence, or personal information about the named players. Do not add authentication, external services or deployment unless needed and agreed.

The submission-tree slide lists project-rules.md, TASK_DECOMPOSITION.md, AI_FAILURE_AUDIT.md and .env.example at repository root. In a shared lab repository, preserve other exercises and reconcile placement without overwriting their documents. The lecture describes a three-minute live defense and an AI audit worth 15% of the total lab grade.
4. Start with the repository
First give read-only PowerShell commands: Get-Location, Get-ChildItem -Name, git status -sb, git log -5 --oneline, git rev-parse --show-toplevel, node -v, and npm -v. Check whether this is a new homework folder or an existing project. Inspect only relevant package scripts and paths using targeted commands and short outputs if needed. Do not reset or reinitialize an existing repository. Do not assume dependencies, ports, database availability or file paths. Use the installed versions and existing conventions. If a new folder is needed, provide the exact quoted PowerShell command to create it safely.
5. Plan before feature code
The first authored project deliverable after inspection is TASK_DECOMPOSITION.md. Provide its full English content, with task IDs, objectives, prerequisites, affected paths, contracts, acceptance criteria, edge cases, test commands, status (TODO, IN PROGRESS, BLOCKED, DONE) and proposed Conventional Commit messages. Preserve prior history. Never invent commit hashes; the task's own hash cannot be embedded in that same commit. Git history is the authoritative record.

Suggested sequence (adapt to the actual repository before starting):
ID	Task	Suggested commit
T01	Repository setup, task decomposition, rules and architecture contracts	chore(hw2): initialize tribunal project and contracts
T02	React Router v7 layout, dynamic dossiers and derived matrix	feat(hw2): implement dossier navigation and derived matrix
T03	Context-driven appeal form and synchronous validation	feat(hw2): implement appeal form context and validation
T04	Absolute-deadline SLA hook and visibility resynchronization	feat(hw2): implement zero-drift appeal countdown
T05	Full-stack API, persistence and frontend integration	feat(hw2): integrate appeal persistence and server clock
T06	Accessibility, error handling and regression tests	fix(hw2): improve tribunal accessibility and reliability
T07	Documentation, audit review and live defense	docs(hw2): finalize tribunal documentation and defense


These are proposed tasks, not lecturer-issued task IDs. T04 can use an injected clock/deadline contract for deterministic tests before T05 connects the actual server. Never pretend a mocked server is real integration.
6. Technical standards
Routing and derived matrix
Use a shared layout and dynamic route with useParams; support direct links, refresh, navigation and an explicit unknown-player boundary. Use stable identifiers and semantic markup. Keep dossier data separate from presentation. Document matrix inputs, formula, units, missing values and zero denominators before coding; compute from source data during render (useMemo as appropriate), not via an effect that stores redundant state. Do not present the demo matrix as an official adjudication.
Appeal form
Use React Context and a focused custom hook to share form values and actions. Compute validation synchronously from current values, without useEffect validation waterfalls. Agree on fields, required rules, cross-field constraints and submission payload. Use accessible labels, useId where appropriate, aria-invalid and aria-describedby; show actionable errors. Prevent invalid and duplicate submissions, preserve input on network failure, and show success only after a real server acknowledgment. Define how drafts behave when switching dossiers. Server validation must not rely on client validation.
SLA countdown
Use an absolute deadline in milliseconds and a current-clock function. Compute remaining time as max(0, deadline - now), never by subtracting one second from previous state. If server time is available, document offset estimation and network latency limitations. A tick triggers recalculation, not elapsed-time accumulation. Resynchronize on visibilitychange when visible; clean up timers/listeners on unmount and dependency changes. Handle expired, invalid and changed deadlines, background tabs, clock changes and stale asynchronous resync responses. Use deterministic fake-clock tests including a large time jump. Explain that zero drift means no accumulated tick drift, not perfect clock accuracy or guaranteed browser scheduling.
Full-stack contract
Before coding, agree on endpoint paths, methods, JSON shapes, stable IDs, timestamps, error statuses, storage and server time semantics. Suggested endpoints are GET /api/dossiers/:playerID and POST /api/dossiers/:playerID/appeals, with a documented clock response or endpoint; these are proposals, not slide requirements. Validate identifiers and payloads, handle non-2xx responses, loading/empty/error states, cancellation and stale requests. Use Express JSON parsing, appropriate CORS, async/await and safe error responses. If using Mongoose 8, use modern promise APIs, no deprecated connection flags or callback methods. Keep credentials in environment variables, provide a secret-free .env.example and ignore .env. Use demo data only with clear labeling. Verify real persistence after reload/restart if implemented.
7. How to guide each task
For the current task only, explain the objective and prerequisites, list exact files, give ready-to-paste PowerShell commands to create every new folder/file and open it in VS Code, then provide complete contents of every new or changed source file. Use safe existence checks so existing files are not truncated. No ellipses, missing imports, placeholder executable paths or giant scripts that silently write all code. I paste code manually. Provide complete replacement files for fixes too, preserving unrelated behavior and my audit entries. For my personally authored audit, provide only a blank template or targeted questions, never replacement prose.

Use contract-first development: specify expected behavior, write focused tests, implement, refactor and verify. Give exact commands for verified npm scripts and expected outputs clearly labeled as expectations. Explain manual browser checks and relevant edge cases. Give the exact task-status update and Git commands at the end. Stop until I report completion; then move directly to the next task.
8. Verification
Test both dossier URLs, direct reload, unknown IDs, navigation and matrix calculations (including missing/zero data). Test real-time form validation, cross-field rules, invalid and valid submissions, duplicate clicks, switching dossiers, and failure recovery. Test timer initialization, expiry, long clock jumps, hidden-tab return, changed deadlines and cleanup under React Strict Mode. Test API validation, server downtime, non-2xx responses and persistence if applicable. Check keyboard access, visible focus, accessible labels, contrast, responsive layouts and browser console. Run actual lint, test and production build scripts. Save useful screenshots locally. Do not claim PASS, WCAG compliance, Lighthouse scores, persistence, or successful commits without actual user confirmation. A generic completion report is enough to advance, but does not establish specific numerical results.
9. My AI_FAILURE_AUDIT.md
I write this file myself in English. After every resolved troubleshooting incident, remind me to decide whether it belongs in the audit. Explain the verified cause and distinguish AI-generated mistakes from my own typing, environment problems, legacy code and unclear requirements. Do not label an issue an AI failure without evidence. Do not fabricate incidents or write polished first-person entries for me.

Give me targeted questions and a blank outline when needed:
- Incident title, task and date:
- AI suggestion or instruction:
- Observed failure and local evidence:
- Verified root cause and classification:
- Manual investigation and fix:
- Tests rerun and actual results:
- Architectural lesson and prevention:
- Evidence path or actual commit reference, if known:
Pay attention to outdated Router APIs, effect validation loops, stale requests, interval drift, missing cleanup, inaccessible controls and hallucinated backend methods. These are risks to check, not incidents to invent. Ask me to save my own entry locally before the task commit when appropriate. Never ask me to upload the audit.
10. Git discipline
Every completed task must have a meaningful Git commit, including its TASK_DECOMPOSITION.md status update. Provide exact per-file git add commands with quoted paths as needed, git status -sb, git diff --check, relevant git diff, git diff --cached, a specific English Conventional Commit, git log -1 --oneline and final status. Do not stage unrelated files, node_modules, dist, .env or secrets. Do not use git add . blindly, empty commits, reset, amend, force-push or destructive cleanup. Commit locally by default; push only if I request it and the remote and branch are verified. If I report an incomplete commit, help resolve it before moving on.
11. Definition of done and defense
The project is complete when dynamic dossiers, derived matrix, context validation, absolute-clock SLA timer, full-stack integration as agreed, error handling and reproducible tests work; documentation and Git history reflect reality; and my own audit is complete. Prepare a concise Vietnamese three-minute defense covering architecture, local/context/persistent state choices, route parameters, derived state, validation, clock delta versus interval counting, visibility resync, cleanup, API contracts and a live injected-bug exercise. Do not claim that the project is complete merely because code has been generated.