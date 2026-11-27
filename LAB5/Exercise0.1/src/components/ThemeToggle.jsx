import { useAppState } from '../context/useAppState.js';

import {
  useAppDispatch,
} from '../context/useAppDispatch.js';

export default function ThemeToggle() {
  const { theme } = useAppState();
  const dispatch = useAppDispatch();

  const nextThemeLabel =
    theme === 'dark'
      ? 'Light mode'
      : 'Dark mode';

  function handleToggleTheme() {
    dispatch({
      type: 'TOGGLE_THEME',
    });
  }

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={handleToggleTheme}
    >
      {nextThemeLabel}
    </button>
  );
}