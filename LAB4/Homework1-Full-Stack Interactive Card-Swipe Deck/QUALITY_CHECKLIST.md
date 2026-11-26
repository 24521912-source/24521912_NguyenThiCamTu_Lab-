# Quality Assurance Checklist

## 1. Automated Testing

| Check | Expected | Actual | Status |
| --- | --- | --- | --- |
| Frontend tests | 99 passed | Pending | Pending |
| Backend tests | 23 passed | Pending | Pending |
| ESLint | 0 errors | Pending | Pending |
| Production build | Success | Pending | Pending |

## 2. Responsive Verification

- [ ] 320 x 568 viewport
- [ ] 375 x 667 viewport
- [ ] 430 x 932 viewport
- [ ] 768 x 1024 viewport
- [ ] 1280 x 720 viewport
- [ ] 1920 x 1080 viewport
- [ ] No horizontal overflow
- [ ] Profile cards remain readable
- [ ] Action controls remain usable

## 3. Accessibility Verification

- [ ] Keyboard navigation
- [ ] Visible keyboard focus
- [ ] Accessible button names
- [ ] Accessible scoring descriptions
- [ ] Keyboard shortcut annotations
- [ ] Live statistics announcements
- [ ] Error notifications
- [ ] Reduced motion preference
- [ ] Disabled actions handled correctly
- [ ] Adequate button target sizes

## 4. Functional Regression

- [ ] ArrowLeft performs PASS
- [ ] ArrowRight performs LIKE
- [ ] ArrowUp performs SUPER_LIKE
- [ ] Pointer gestures work correctly
- [ ] Short gestures are ignored
- [ ] Downward gestures are ignored
- [ ] LIFO undo works correctly
- [ ] Derived score remains consistent
- [ ] Exhausted deck is handled safely
- [ ] Restored profiles can be swiped again

## 5. Persistence Verification

- [ ] Profiles are retrieved from MongoDB
- [ ] Swipe actions are stored in MongoDB
- [ ] Undo removes the latest stored action
- [ ] Page reload restores history
- [ ] Page reload restores derived score
- [ ] Duplicate requests are prevented
- [ ] Database restart preserves data

## 6. Reliability Verification

- [ ] Initial server failure is handled
- [ ] Failed mutation preserves confirmed history
- [ ] Request timeout is handled
- [ ] Timed-out mutations are not retried automatically
- [ ] Synchronization recovers after reconnecting

## 7. Lighthouse Results

| Category | Desktop | Mobile |
| --- | --- | --- |
| Performance | Pending | Pending |
| Accessibility | Pending | Pending |
| Best Practices | Pending | Pending |
| SEO | Pending | Pending |

## 8. Known Limitations

- A fixed local demo session is used.
- Authentication is outside the assignment scope.
- Concurrent mutation guarantees across multiple
  clients are not provided.
- Profile illustrations are fictional SVG graphics.
- Request cancellation does not guarantee cancellation
  of a server-side database operation.


