import { useContext } from 'react';

import { AppDispatchContext } from './appContexts.js';

export function useAppDispatch() {
  const dispatch = useContext(AppDispatchContext);

  if (dispatch === null) {
    throw new Error(
      'useAppDispatch must be used within AppProvider.',
    );
  }

  return dispatch;
}