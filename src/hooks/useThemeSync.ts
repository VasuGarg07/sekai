// hooks/useThemeSync.ts
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/reduxHooks';
import { initializeTheme } from '../store/slices/themeSlice';

export const useThemeSync = () => {
  const dispatch = useAppDispatch();
  const currentTheme = useAppSelector((state) => state.theme.currentTheme);

  // Initialize theme on app start
  useEffect(() => {
    dispatch(initializeTheme());
  }, [dispatch]);

  // Apply theme changes to DOM whenever theme changes
  useEffect(() => {
    // Remove all existing theme classes
    document.documentElement.className = document.documentElement.className
      .replace(/theme-\w+/g, '');

    // Add new theme class
    document.documentElement.classList.add(`theme-${currentTheme}`);
  }, [currentTheme]);
};