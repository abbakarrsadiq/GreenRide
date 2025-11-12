import { useThemeStore } from '../store/useThemeStore';
import { getColors } from '../constants/colors';

export const useTheme = () => {
  const { isDarkMode, toggleTheme, setTheme } = useThemeStore();
  const colors = getColors(isDarkMode);

  return {
    isDarkMode,
    toggleTheme,
    setTheme,
    colors,
  };
};
