import {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  getProfiles,
  getHistory,
  saveSwipe,
  deleteLastSwipe,
} from '../api/swipeApi.js';

import {
  SWIPE_ACTIONS,
  appendSwipe,
  getRemainingProfiles,
  undoLastSwipe,
} from '../state/SwipeState.jsx';

const initialState = {
  profiles: [],
  history: [],
  phase: 'loading',
  error: '',
};

export default function usePersistentDeck() {
  const [state, setState] = useState(initialState);
  const [revision, setRevision] = useState(0);

  const mutationLock = useRef(false);

  useEffect(() => {
    const controller = new AbortController();

    Promise.all([
      getProfiles(controller.signal),
      getHistory(controller.signal),
    ])
      .then(([profiles, history]) => {
        if (controller.signal.aborted) {
          return;
        }

        setState({
          profiles,
          history,
          phase: 'ready',
          error: '',
        });
      })
      .catch((error) => {
        if (controller.signal.aborted) {
          return;
        }

        setState((previous) => ({
          ...previous,
          phase: 'error',
          error: error.message,
        }));
      });

    return () => {
      controller.abort();
    };
  }, [revision]);

  async function handleSwipe(action, profileId) {
    if (
      mutationLock.current ||
      state.phase !== 'ready' ||
      !Object.values(SWIPE_ACTIONS).includes(action)
    ) {
      return;
    }

    const currentProfile = getRemainingProfiles(
      state.profiles,
      state.history,
    )[0];

    if (
      !currentProfile ||
      currentProfile.id !== profileId
    ) {
      return;
    }

    mutationLock.current = true;

    setState((previous) => ({
      ...previous,
      phase: 'saving',
      error: '',
    }));

    try {
      const entry = await saveSwipe(
        profileId,
        action,
      );

      const nextHistory = appendSwipe(
        state.profiles,
        state.history,
        entry,
      );

      if (nextHistory === state.history) {
        throw new Error('Unexpected swipe history');
      }

      setState((previous) => ({
        ...previous,
        history: nextHistory,
        phase: 'ready',
        error: '',
      }));
    } catch (error) {
      setState((previous) => ({
        ...previous,
        phase: 'error',
        error: error.message,
      }));
    } finally {
      mutationLock.current = false;
    }
  }

  async function handleUndo() {
    if (
      mutationLock.current ||
      state.phase !== 'ready' ||
      state.history.length === 0
    ) {
      return;
    }

    const latestAction = state.history.at(-1);

    mutationLock.current = true;

    setState((previous) => ({
      ...previous,
      phase: 'saving',
      error: '',
    }));

    try {
      await deleteLastSwipe(latestAction.id);

      setState((previous) => ({
        ...previous,
        history: undoLastSwipe(previous.history),
        phase: 'ready',
        error: '',
      }));
    } catch (error) {
      setState((previous) => ({
        ...previous,
        phase: 'error',
        error: error.message,
      }));
    } finally {
      mutationLock.current = false;
    }
  }

  function reloadDeck() {
    if (
      mutationLock.current ||
      state.phase !== 'error'
    ) {
      return;
    }

    setState((previous) => ({
      ...previous,
      phase: 'loading',
      error: '',
    }));

    setRevision((previous) => previous + 1);
  }

  return {
    profiles: state.profiles,
    history: state.history,
    phase: state.phase,
    error: state.error,
    handleSwipe,
    handleUndo,
    reloadDeck,
  };
}