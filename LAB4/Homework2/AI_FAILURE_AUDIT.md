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
   - Result: [Enter the actual test results.]
   - Status: Resolved.

### Applied Fix

Updated vite.config.js:

- pool: 'threads'
- maxWorkers: 1
- fileParallelism: false
- isolate: true

### Verification

- Regression tests: [Actual results]
- ESLint: [Actual results]
- Production build: [Actual results]

### Lesson Learned

[Explain what I learned about worker pools, memory allocation,
and adapting AI-generated configurations to my local environment.]

### Prevention

[Describe how I will configure and verify test runners
in future projects.]

### Evidence

- Terminal output: [Local evidence reference, if available]
- Git commit: [Actual commit reference, if available]