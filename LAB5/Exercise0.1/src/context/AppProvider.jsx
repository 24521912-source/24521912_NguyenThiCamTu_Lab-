import { useEffect, useReducer } from 'react';

import {
  AppStateContext,
  AppDispatchContext,
} from './appContexts.js';

import {
  appReducer,
  initialState,
} from './appReducer.js';

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(
    appReducer,
    initialState,
  );

  useEffect(() => {
    document.documentElement.dataset.theme = state.theme;
  }, [state.theme]);

  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
}