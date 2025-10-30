import { useTheme } from '../utils/ThemeContext';
import './ThemeToggle.css';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <img
        src={theme === 'dark' ? '/icons/lightmode_icon.png' : '/icons/darkmode_icon.png'}
        alt={theme === 'dark' ? 'Light mode' : 'Dark mode'}
        className="theme-icon"
      />
    </button>
  );
};
