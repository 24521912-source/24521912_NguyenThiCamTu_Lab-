import { useAppState } from '../context/useAppState.js';

import {
  useAppDispatch,
} from '../context/useAppDispatch.js';

const tabs = [
  {
    id: 'reels',
    label: 'Reels',
  },
  {
    id: 'overview',
    label: 'Overview',
  },
];

export default function TabNavigation() {
  const { activeTab } = useAppState();
  const dispatch = useAppDispatch();

  function handleTabChange(tabId) {
    dispatch({
      type: 'SET_ACTIVE_TAB',
      payload: tabId,
    });
  }

  return (
    <nav
      className="tab-navigation"
      aria-label="Application navigation"
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className="tab-button"
          aria-pressed={activeTab === tab.id}
          onClick={() => handleTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}