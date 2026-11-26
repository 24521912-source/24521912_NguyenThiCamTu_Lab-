## Incident — Vitest Worker Memory Allocation Failure

- Task: T03 — Appeal Form Context and Validation
- Classification: Test infrastructure configuration

### AI Suggestion

- Initial configuration: Default Vitest worker pool.
- Missing consideration: [Local resource limitations and worker execution behavior.]

### Observed Failure

- Individual validation tests: 22/22 passed.
- Individual appeal form tests: 13/13 passed.
- Full regression test: 23 tests passed with 2 unhandled errors.

Error messages:

- FATAL ERROR: Zone Allocation failed - process out of memory
- Worker exited unexpectedly with exit code 134.

### Root Cause Analysis

- Confirmed issue: Vitest worker processes failed during memory allocation.
- Suspected cause: [Memory pressure associated with the fork-based worker pool.]
- Exact system-level cause: Not fully confirmed.

### Troubleshooting Attempts

1. Limited Vitest to one worker and disabled file parallelism.
   - Result: 43 tests passed with 1 unhandled error.
   - Status: Partially effective.

2. Changed the worker pool from forks to threads.
   - Result: 124/124 client tests passed with 0 unhandled errors (re-verified 2026-11-26 with the current threads configuration).
   - Status: Resolved.

### Applied Fix

Updated vite.config.js:

- pool: 'threads'
- maxWorkers: 1
- fileParallelism: false
- isolate: true

### Verification

- Regression tests: client 11 files, 124/124 passed; server 1 file, 20/20 passed (re-run 2026-11-26 with the single-worker thread pool, no memory allocation failure)
- ESLint: 0 errors, 0 warnings
- Production build: succeeded (46 modules, JS 283.80 kB, gzip 89.45 kB)

### Lesson Learned

[Explain what I learned about worker pools, memory allocation,
and adapting AI-generated configurations to my local environment.]

### Prevention

[Describe how I will configure and verify test runners
in future projects.]

### Evidence

- Terminal output: [Local evidence reference, if available]
- Git commit: `65999f4` feat(hw2): implement appeal form context and validation (introduces `pool: 'threads'` in `client/vite.config.js`)