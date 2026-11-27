import { useContext } from 'react';

import { AppStateContext } from './appContexts.js';

export function useAppState() {
  const state = useContext(AppStateContext);

  if (state === null) {
    throw new Error(
      'useAppState must be used within AppProvider.',
    );
  }

  return state;
}