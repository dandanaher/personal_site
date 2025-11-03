import { useTheme } from '../utils/ThemeContext';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className="fixed top-4 right-4 z-[1000] flex h-10 w-10 md:top-8 md:right-8 md:h-12 md:w-12 items-center justify-center rounded-full border border-[rgba(157,205,180,0.3)] bg-[rgba(157,205,180,0.15)] shadow-[0_4px_12px_rgba(157,205,180,0.2),inset_0_1px_1px_rgba(255,255,255,0.3)] backdrop-blur-lg transition-all duration-300 hover:scale-110 hover:border-[rgba(157,205,180,0.5)] hover:bg-[rgba(157,205,180,0.25)] hover:shadow-[0_6px_20px_rgba(157,205,180,0.3),inset_0_1px_1px_rgba(255,255,255,0.4)] active:scale-95"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <img
        src="/icons/lightmode_icon.png"
        alt="Light mode"
        className={`absolute h-3/5 w-3/5 object-contain [filter:drop-shadow(0_1px_2px_rgba(0,0,0,0.2))] transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] ${theme === 'light' ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}
      />
      <img
        src="/icons/darkmode_icon.png"
        alt="Dark mode"
        className={`absolute h-3/5 w-3/5 object-contain [filter:drop-shadow(0_1px_2px_rgba(0,0,0,0.2))] transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] ${theme === 'dark' ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}
      />
    </button>
  );
};
