## Incident XX – Missing Error Cause in API Error Handling

- **Task:** T05 – Full-Stack Integration
- **Affected file:** `client/src/api/swipeApi.js`

### AI Suggestion

The AI suggested using a try-catch block to handle network errors and provide a user-friendly error message when the frontend could not connect to the backend.

### Observed Problem

Although all 84 frontend tests passed, ESLint reported a `preserve-caught-error` violation.

```text
There is no `cause` attached to the symptom error being thrown.
```

### Root Cause

The AI-generated code created a new Error object without preserving the original exception. This caused the original error information to be lost, making debugging more difficult.

### Fix Applied

I added the `cause` property to the new Error object to preserve the original exception.

**Before:**

```javascript
throw new Error('Unable to connect to the server');
```

**After:**

```javascript
throw new Error('Unable to connect to the server', {
  cause: error,
});
```

### Verification

- Before the fix: 84/84 tests passed, but ESLint reported one error.
- After the fix: [Insert actual lint, test, and build results.]

### Lesson Learned

Passing automated tests does not necessarily mean that the code satisfies all coding standards. AI-generated error handling should be reviewed carefully to ensure that original exceptions are preserved. Both automated testing and static code analysis are necessary to verify code quality.