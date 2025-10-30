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
        src="/icons/lightmode_icon.png"
        alt="Light mode"
        className={`theme-icon ${theme === 'dark' ? 'theme-icon-active' : 'theme-icon-inactive'}`}
      />
      <img
        src="/icons/darkmode_icon.png"
        alt="Dark mode"
        className={`theme-icon ${theme === 'light' ? 'theme-icon-active' : 'theme-icon-inactive'}`}
      />
    </button>
  );
};
