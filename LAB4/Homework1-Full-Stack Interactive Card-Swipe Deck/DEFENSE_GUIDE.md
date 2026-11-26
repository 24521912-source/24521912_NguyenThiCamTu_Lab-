# Assignment Defense Guide

## 1. Project Introduction

Almost Love is a full-stack interactive card-swipe
application built with React, Express, Mongoose,
and MongoDB.

The project demonstrates event handling, immutable
state management, derived scoring, LIFO undo, and
persistent data storage.

## 2. Main Requirements

### Dual Event Listeners

The application supports keyboard events and pointer
events.

Both input methods trigger the same swipe logic.

Keyboard listeners are registered with useEffect()
and removed during effect cleanup.

Pointer events use pointer identifiers and movement
coordinates to recognize valid gestures.

### LIFO Undo Stack

The swipe history behaves like a stack.

New actions are appended to the end of the history.

Undo removes the latest action first.

The frontend uses slice(0, -1) to preserve immutability.

### Asymmetric Derived Score

LIKE contributes ten points.

PASS and SUPER_LIKE contribute negative five points.

The score is calculated from history using reduce().

A separate score state is unnecessary.

### Database Persistence

The backend retrieves profiles through Mongoose.

Swipe actions are saved in MongoDB.

The frontend reloads persisted history when the page
is refreshed.

## 3. Important Source Files

| File | Responsibility |
| --- | --- |
| App.jsx | Application composition and rendering |
| ProfileCard.jsx | Profile card presentation |
| SwipeDeck.jsx | Swipe and undo controls |
| SwipeListeners.jsx | Keyboard and pointer events |
| SwipeState.jsx | Pure state management functions |
| SwipeGestures.js | Gesture direction detection |
| swipeApi.js | HTTP requests and timeout handling |
| usePersistentDeck.js | Server synchronization |
| server/src/app.js | Express application |
| server/src/index.js | Server and database startup |
| Profile.js | Profile schema |
| Swipe.js | Swipe schema and unique index |
| profileRoutes.js | Profile retrieval endpoint |
| swipeRoutes.js | Swipe history and undo endpoints |
| database.js | MongoDB connection management |

## 4. Defense Questions

### Why use a derived score?

The score depends entirely on swipe history.

Calculating it directly prevents inconsistencies
between the stored history and a separate score state.

### Why use slice() instead of pop()?

pop() modifies the original array.

slice() returns a new array and preserves React
state immutability.

### Why use useRef for pointer coordinates?

Pointer coordinates must remain available between
events without triggering unnecessary renders.

useRef stores these values across renders.

### Why use useState for the card offset?

The visual position of the card must update when
the pointer moves.

Updating state triggers a render.

### Why remove keyboard listeners?

Cleanup prevents duplicate event listeners and
unnecessary listeners after component unmounting.

### What is pointer capture?

Pointer capture allows an element to continue
receiving pointer events when the pointer moves
outside its original boundaries.

### How is a valid swipe determined?

The movement must exceed 50 pixels.

The dominant axis determines the direction.

Downward, short, cancelled, and equally diagonal
gestures are ignored.

### How are duplicate swipes prevented?

The frontend validates the current profile and
blocks overlapping mutation requests.

The backend uses a unique compound index on
sessionId and profileId.

### Why use a request lock?

React state updates are not immediately reflected
inside the currently executing event handler.

A ref-based lock blocks additional requests before
the next render occurs.

### Why wait for backend confirmation?

Waiting for confirmation prevents the frontend from
displaying a successful action that may not have
been saved in the database.

### What happens when the network fails?

The last confirmed history is preserved.

The application enters an error state and requires
a reload before accepting further actions.

### Why not automatically retry failed mutations?

The server may have completed the operation even
if the frontend did not receive the response.

Reloading history helps resolve this uncertainty.

### Why use Mongoose?

Mongoose provides schema definitions, validation,
query methods, and integration with MongoDB.

### Why use lean()?

lean() returns plain JavaScript objects instead
of full Mongoose documents.

This is appropriate for read-only API responses.

### Why use async/await?

It makes asynchronous database and HTTP operations
easier to read and manage.

### What is a compound index?

A compound index combines multiple fields.

A unique compound index prevents duplicate values
for the indexed field combination.

### How does persistence work after refresh?

The frontend requests profiles and stored history.

The remaining queue and score are reconstructed
from the retrieved history.

### Why use Docker Compose?

Docker Compose provides a reproducible local
database environment.

A named volume preserves MongoDB data across
container restarts.

### Why are test databases separated?

Test databases prevent automated tests from
modifying demonstration data.

### Why can tests pass when the UI is broken?

DOM-based tests primarily verify behavior and
structure.

Visual layout must also be checked in a browser.

## 5. Demonstration Sequence

1. Start MongoDB.
2. Start the backend.
3. Start the frontend.
4. Show the initial profile deck.
5. Perform a right keyboard swipe.
6. Perform a left pointer swipe.
7. Perform an upward swipe.
8. Explain the derived score.
9. Undo the latest action.
10. Refresh the page.
11. Verify that history remains available.
12. Show stored data in MongoDB.
13. Show automated test results.
14. Explain an actual AI-related failure and its fix.

## 6. Known Limitations

The application is designed for a local demonstration
session.

Authentication and multi-client transaction guarantees
are outside the project scope.
