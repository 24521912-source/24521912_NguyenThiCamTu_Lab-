# AI Failure Audit — Lab 5, Exercise 0.1

## Incident 01 — Vite Native Binding Failure

**Task:** T01 — Repository Setup and Governance

**Date:** November 27, 2026

### 1. AI-Generated Suggestion

The AI suggested installing Vite and the testing libraries without specifying their versions.

```powershell
npm install -D vite @vitejs/plugin-react vitest jsdom
```

This resulted in Vite 8.4.0 being installed.

### 2. Observed Failure

Both the test and build commands failed with the following error:

```text
Error: Cannot find native binding.
```

The AI initially suggested reinstalling optional dependencies and manually installing the Windows native binding. However, neither solution resolved the problem.

### 3. Root Cause Analysis

After checking the native binding directly, the following error appeared:

```text
Error: An Application Control policy has blocked this file.
```

The native binding was already installed, but Windows prevented Node.js from loading it. The problem was therefore related to the development environment rather than the React source code.

### 4. Manual Correction

The proposed solution was to switch from Vite 8 to Vite 7, which uses Rollup instead of Rolldown, while keeping React 19 unchanged.

```powershell
npm uninstall @rolldown/binding-win32-x64-msvc
npm install -D --save-exact vite@7 @vitejs/plugin-react@5 vitest@4
```

### 5. Verification Results

- Rolldown was no longer present in the dependency tree.
- Vite 7.3.8 was installed.
- A new peer dependency conflict was detected.
- Final test result: [Actual result]
- Final build result: [Actual result]

### 6. Lesson Learned

Using the latest package versions does not always guarantee compatibility with the local development environment. Error messages should be investigated carefully before reinstalling dependencies or changing configurations.

---

## Incident 02 — Vitest and Jest DOM Version Conflict

**Task:** T01 — Repository Setup and Governance

**Date:** November 27, 2026

### 1. AI-Generated Suggestion

The AI suggested downgrading Vitest to version 4 without checking the compatibility of the existing Jest DOM package.

```powershell
npm install -D --save-exact vite@7 @vitejs/plugin-react@5 vitest@4
```

### 2. Observed Failure

After installing the packages, the dependency inspection command reported:

```text
npm error code ELSPROBLEMS
npm error invalid: vitest@4.1.12
```

### 3. Root Cause Analysis

The installed `@testing-library/jest-dom@8.0.0` package required Vitest version 5.

However, the AI's suggested command installed Vitest 4.1.12 without adjusting the Jest DOM version. This created a peer dependency conflict.

### 4. Manual Correction

The proposed correction was to install a compatible version of Jest DOM.

```powershell
npm install -D --save-exact @testing-library/jest-dom@7
```

The dependency tree and application checks should then be verified again.

### 5. Verification Results

- Dependency inspection: [Actual result]
- Automated tests: [Actual result]
- ESLint: [Actual result]
- Production build: [Actual result]

### 6. Lesson Learned

Changing the version of one package can affect other packages in the project. Peer dependencies should be checked before upgrading or downgrading libraries.

The `npm ls` command is useful for detecting dependency conflicts that may not immediately appear during installation.
