import { useEffect, useRef, useState } from 'react';

import { SWIPE_ACTIONS } from '../state/SwipeState.jsx';
import { resolveSwipeAction } from '../state/SwipeGestures.js';

const keyboardActions = {
  ArrowLeft: SWIPE_ACTIONS.PASS,
  ArrowRight: SWIPE_ACTIONS.LIKE,
  ArrowUp: SWIPE_ACTIONS.SUPER_LIKE,
};

function isEditableTarget(target) {
  if (!(target instanceof Element)) {
    return false;
  }

  return (
    target.isContentEditable ||
    Boolean(
      target.closest(
        'input, textarea, select, [contenteditable="true"], [contenteditable=""], [contenteditable="plaintext-only"]',
      ),
    )
  );
}

export default function SwipeListeners({
  profileId,
  onSwipe,
  onUndo,
  children,
}) {
  const pointerStart = useRef(null);

  const [offset, setOffset] = useState({
    x: 0,
    y: 0,
  });

  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    function handleKeyDown(event) {
      if (
        event.defaultPrevented ||
        event.isComposing ||
        event.ctrlKey ||
        event.altKey ||
        event.metaKey ||
        event.shiftKey ||
        isEditableTarget(event.target)
      ) {
        return;
      }

      const action = keyboardActions[event.key];

      if (!action && event.key !== 'Backspace') {
        return;
      }

      if (
        !profileId &&
        event.key !== 'Backspace'
      ) {
        return;
      }

      event.preventDefault();

      if (event.repeat || pointerStart.current) {
        return;
      }

      if (event.key === 'Backspace') {
        onUndo();
        return;
      }

      onSwipe(action, profileId);
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener(
        'keydown',
        handleKeyDown,
      );
    };
  }, [profileId, onSwipe, onUndo]);

  function resetPointer() {
    pointerStart.current = null;

    setOffset({
      x: 0,
      y: 0,
    });

    setDragging(false);
  }

  function handlePointerDown(event) {
    if (
      !profileId ||
      event.isPrimary === false ||
      event.button !== 0 ||
      pointerStart.current
    ) {
      return;
    }

    pointerStart.current = {
      pointerId: event.pointerId,
      profileId,
      x: event.clientX,
      y: event.clientY,
    };

    setDragging(true);

    event.currentTarget.setPointerCapture?.(
      event.pointerId,
    );
  }

  function handlePointerMove(event) {
    const start = pointerStart.current;

    if (!start || start.pointerId !== event.pointerId) {
      return;
    }

    if (start.profileId !== profileId) {
      resetPointer();
      return;
    }

    setOffset({
      x: event.clientX - start.x,
      y: event.clientY - start.y,
    });
  }

  function handlePointerUp(event) {
    const start = pointerStart.current;

    if (!start || start.pointerId !== event.pointerId) {
      return;
    }

    const action = resolveSwipeAction(
      event.clientX - start.x,
      event.clientY - start.y,
    );

    resetPointer();

    if (
      event.currentTarget.hasPointerCapture?.(
        event.pointerId,
      )
    ) {
      event.currentTarget.releasePointerCapture(
        event.pointerId,
      );
    }

    if (
      action &&
      start.profileId === profileId
    ) {
      onSwipe(action, start.profileId);
    }
  }

  function handlePointerCancel(event) {
    const start = pointerStart.current;

    if (start?.pointerId === event.pointerId) {
      resetPointer();
    }
  }

  const previewAction = resolveSwipeAction(
    offset.x,
    offset.y,
  );

  const previewLabels = {
    [SWIPE_ACTIONS.PASS]: 'PASS',
    [SWIPE_ACTIONS.LIKE]: 'LIKE',
    [SWIPE_ACTIONS.SUPER_LIKE]: 'SUPER LIKE',
  };

  const rotation = Math.max(
    -15,
    Math.min(15, offset.x / 15),
  );

  const transform =
    dragging && profileId
      ? `translate(${offset.x}px, ${offset.y}px) rotate(${rotation}deg)`
      : undefined;

  return (
    <div
      className={`swipe-surface ${
        dragging && profileId ? 'is-dragging' : ''
      }`}
      data-testid="swipe-surface"
      aria-disabled={!profileId}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onLostPointerCapture={handlePointerCancel}
      onDragStart={(event) => event.preventDefault()}
    >
      <div
        className="swipe-motion"
        style={{ transform }}
      >
        {children}

        {dragging && profileId && previewAction && (
          <span
            className={`swipe-preview preview-${previewAction.toLowerCase()}`}
            aria-hidden="true"
          >
            {previewLabels[previewAction]}
          </span>
        )}
      </div>
    </div>
  );
}