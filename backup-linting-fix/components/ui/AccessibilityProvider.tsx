import type { ReactNode } from 'react';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface AccessibilityContextType {
  // High contrast mode
  highContrast: boolean;
  toggleHighContrast: () => void;

  // Reduced motion
  reducedMotion: boolean;
  toggleReducedMotion: () => void;

  // Font size
  fontSize: 'small' | 'medium' | 'large';
  setFontSize: (size: 'small' | 'medium' | 'large') => void;

  // Focus indicators
  showFocusIndicators: boolean;
  toggleFocusIndicators: () => void;

  // Screen reader announcements
  announceToScreenReader: (message: string) => void;

  // Keyboard navigation
  enableKeyboardNavigation: boolean;
  toggleKeyboardNavigation: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

interface AccessibilityProviderProps {
  children: ReactNode;
}

/**
 * AccessibilityProvider
 * @description Function
 */
export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children }) => {
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [showFocusIndicators, setShowFocusIndicators] = useState(true);
  const [enableKeyboardNavigation, setEnableKeyboardNavigation] = useState(true);

  // Load accessibility preferences from localStorage
  useEffect(() => {
    const savedHighContrast = localStorage.getItem('accessibility-high-contrast') === 'true';
    const savedReducedMotion = localStorage.getItem('accessibility-reduced-motion') === 'true';
    const savedFontSize =
      (localStorage.getItem('accessibility-font-size') as 'small' | 'medium' | 'large') || 'medium';
    const savedFocusIndicators = localStorage.getItem('accessibility-focus-indicators') !== 'false';
    const savedKeyboardNavigation =
      localStorage.getItem('accessibility-keyboard-navigation') !== 'false';

    setHighContrast(savedHighContrast);
    setReducedMotion(savedReducedMotion);
    setFontSize(savedFontSize);
    setShowFocusIndicators(savedFocusIndicators);
    setEnableKeyboardNavigation(savedKeyboardNavigation);
  }, []);

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem('accessibility-high-contrast', highContrast.toString());
  }, [highContrast]);

  useEffect(() => {
    localStorage.setItem('accessibility-reduced-motion', reducedMotion.toString());
  }, [reducedMotion]);

  useEffect(() => {
    localStorage.setItem('accessibility-font-size', fontSize);
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem('accessibility-focus-indicators', showFocusIndicators.toString());
  }, [showFocusIndicators]);

  useEffect(() => {
    localStorage.setItem('accessibility-keyboard-navigation', enableKeyboardNavigation.toString());
  }, [enableKeyboardNavigation]);

  // Apply accessibility styles to document
  useEffect(() => {
    const root = document.documentElement;

    // High contrast mode
    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Reduced motion
    if (reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }

    // Font size
    root.classList.remove('font-size-small', 'font-size-medium', 'font-size-large');
    root.classList.add(`font-size-${fontSize}`);

    // Focus indicators
    if (showFocusIndicators) {
      root.classList.add('show-focus-indicators');
    } else {
      root.classList.remove('show-focus-indicators');
    }

    // Keyboard navigation
    if (enableKeyboardNavigation) {
      root.classList.add('keyboard-navigation');
    } else {
      root.classList.remove('keyboard-navigation');
    }
  }, [highContrast, reducedMotion, fontSize, showFocusIndicators, enableKeyboardNavigation]);

  const toggleHighContrast = () => setHighContrast(!highContrast);
  const toggleReducedMotion = () => setReducedMotion(!reducedMotion);
  const toggleFocusIndicators = () => setShowFocusIndicators(!showFocusIndicators);
  const toggleKeyboardNavigation = () => setEnableKeyboardNavigation(!enableKeyboardNavigation);

  const announceToScreenReader = (message: string) => {
    // Create a live region for screen reader announcements
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;

    document.body.appendChild(announcement);

    // Remove the announcement after a short delay
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

  const value: AccessibilityContextType = {
    highContrast,
    toggleHighContrast,
    reducedMotion,
    toggleReducedMotion,
    fontSize,
    setFontSize,
    showFocusIndicators,
    toggleFocusIndicators,
    announceToScreenReader,
    enableKeyboardNavigation,
    toggleKeyboardNavigation,
  };

  return <AccessibilityContext.Provider value={value}>{children}</AccessibilityContext.Provider>;
};

/**
 * useAccessibility
 * @description Function
 */
export const useAccessibility = (): AccessibilityContextType => {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};
