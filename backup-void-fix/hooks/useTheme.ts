import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

/**
 * useTheme
 * @description Function
 */
export function useTheme(): void {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    // Check for saved theme preference in localStorage
    const savedTheme = localStorage.getItem('theme');

    // Check for system preference if no saved preference
    if (!savedTheme) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    return savedTheme === 'dark';
  });

  // Update theme when isDarkMode changes
  useEffect(() => {
    // Save theme preference to localStorage
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');

    // Add or remove the 'dark' class on the document element
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent): void => {
      // Only update if user hasn't explicitly set a preference
      if (!localStorage.getItem('theme')) {
        setIsDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  const toggleTheme = (): void => {
    setIsDarkMode((prev) => !prev);
  };

  const setTheme = (theme: Theme): void => {
    setIsDarkMode(theme === 'dark');
  };

  return {
    isDarkMode,
    toggleTheme,
    setTheme,
    theme: isDarkMode ? 'dark' : ('light' as Theme),
  };
}
