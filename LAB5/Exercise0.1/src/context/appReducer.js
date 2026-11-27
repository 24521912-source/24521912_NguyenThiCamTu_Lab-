export const initialState = {
  theme: 'dark',
  activeTab: 'reels',
};

const validTabs = ['reels', 'overview'];

/**
 * Computes the next application state without side effects.
 *
 * Supported actions:
 * - TOGGLE_THEME
 * - SET_ACTIVE_TAB
 *
 * Unknown actions, invalid tab values and redundant tab
 * updates return the original state.
 */
export function appReducer(state, action) {
  switch (action.type) {
    case 'TOGGLE_THEME':
      return {
        ...state,
        theme: state.theme === 'dark'
          ? 'light'
          : 'dark',
      };

    case 'SET_ACTIVE_TAB':
      if (!validTabs.includes(action.payload)) {
        return state;
      }

      if (state.activeTab === action.payload) {
        return state;
      }

      return {
        ...state,
        activeTab: action.payload,
      };

    default:
      return state;
  }
}