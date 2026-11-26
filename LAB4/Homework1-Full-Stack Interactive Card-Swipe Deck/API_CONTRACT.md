
# API and State Contract

## 1. Overview

The application displays a queue of fictional profiles.
Users can swipe through profiles, undo their latest action,
and view a score calculated from their swipe history.

The frontend uses React, while the backend uses Express
and Mongoose 8 with MongoDB.

## 2. Swipe Actions

| Direction | Keyboard | Action | Score |
| --- | --- | --- | --- |
| Left | ArrowLeft | PASS | -5 |
| Right | ArrowRight | LIKE | +10 |
| Up | ArrowUp | SUPER_LIKE | -5 |
| Undo | Backspace | Remove last action | Reverse previous score |

The scoring formula follows the lecture example.
LIKE adds 10 points, while every other swipe action
subtracts 5 points.

## 3. Pointer Events

- Record the starting coordinates on pointer down.
- Calculate displacement on pointer up.
- Require movement greater than 50 pixels.
- Use the dominant axis to determine the direction.
- Support left, right, and upward gestures.
- Ignore downward and equally diagonal gestures.
- Ignore short or cancelled gestures.
- Provide action buttons as alternatives to gestures.
- Provide a dedicated undo button.

The vertical gesture and diagonal handling rules are
project design decisions.

## 4. Profile Data Model

| Field | Type | Description |
| --- | --- | --- |
| id | String | Stable profile identifier |
| name | String | Fictional display name |
| age | Number | Adult age |
| bio | String | Short profile description |
| avatar | String | Local avatar reference |

All demo profiles use fictional information.

## 5. Swipe Data Model

| Field | Type | Description |
| --- | --- | --- |
| id | String | Unique action identifier |
| sessionId | String | Demo session identifier |
| profileId | String | Associated profile identifier |
| action | String | PASS, LIKE, or SUPER_LIKE |
| createdAt | Date | Action creation timestamp |

Each profile can appear only once in the active swipe
history of a session.

History must maintain a deterministic order.

## 6. API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | /api/health | Check server availability |
| GET | /api/profiles | Retrieve profile data |
| POST | /api/swipe | Save a swipe action |
| GET | /api/swipe/history/:sessionId | Retrieve swipe history |
| DELETE | /api/swipe/history/:sessionId/last | Undo the latest swipe |

The history and undo endpoints extend the lecture examples
to maintain consistent state after page reloads.

## 7. Create Swipe Request

Endpoint: POST /api/swipe

Example request body:

    {
      "sessionId": "local-demo-session",
      "profileId": "profile-id",
      "action": "LIKE"
    }

A successful request returns HTTP 201 and the saved action.

## 8. HTTP Status Codes

| Status | Meaning |
| --- | --- |
| 200 | Successful read or undo |
| 201 | Swipe action created |
| 400 | Invalid request |
| 404 | Profile or undo target not found |
| 409 | Duplicate action or conflicting operation |
| 500 | Unexpected server error |

Error responses contain a consistent message field.

## 9. Queue and History

- Profiles are displayed in a consistent order.
- A successful swipe removes a profile from the active queue.
- Swipe history records actions from oldest to newest.
- Remaining profiles are derived from profiles and history.
- A profile cannot be swiped twice without undoing its action.
- An exhausted queue displays an empty state.

## 10. LIFO Undo

Undo follows the Last In, First Out principle.

- Remove only the latest swipe action.
- Restore its associated profile to the queue.
- Recalculate the score from the updated history.
- Do nothing when the history is empty.
- Persist undo operations in the database.

## 11. Derived Score

The score is calculated directly from swipe history.

- LIKE contributes 10 points.
- PASS contributes -5 points.
- SUPER_LIKE contributes -5 points.
- Empty history produces a score of zero.

The score is not maintained as independent React state
or stored as a separate database field.

## 12. Persistence and Session Policy

- Use a fixed local demo session.
- Store swipe actions in MongoDB.
- Restore swipe history after page reload.
- Derive the remaining queue from persisted history.
- Serialize swipe and undo requests on the client.
- Prevent duplicate active swipe actions.
- Confirm successful mutations before updating the UI.
- Display recoverable errors when requests fail.
- Reload history when the result of a request is uncertain.

Authentication and multi-user account management are
outside the scope of this assignment.

## 13. Environment Configuration

Backend environment variables:

- PORT
- CLIENT_ORIGIN
- MONGODB_URI

Frontend environment variable:

- VITE_API_BASE_URL

Environment files must not be committed to Git.
Example environment files contain only local development
values or placeholders.

## 14. Design Decisions

The lecture requires keyboard and pointer event handling,
LIFO undo, asymmetric derived scoring, and persistence
using Express and Mongoose 8.

The following are additional project design decisions:

- Profile and swipe schemas
- Vertical pointer gesture handling
- Fixed demo session
- Fictional profile data
- History retrieval endpoint
- Persistent undo endpoint
- Duplicate prevention
- Request serialization
- Reload and error recovery
