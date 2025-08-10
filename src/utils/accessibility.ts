import type * as React  from 'react';


/**
 * Accessibility utilities for WCAG compliance and screen reader support
 */

// ARIA roles and attributes

/**
 * ARIA_ROLES
 * @description Function
 */
export const ARIA_ROLES = {
  BUTTON: 'button',
  LINK: 'link',
  TAB: 'tab',
  TABPANEL: 'tabpanel',
  TABLIST: 'tablist',
  MENU: 'menu',
  MENUITEM: 'menuitem',
  DIALOG: 'dialog',
  ALERT: 'alert',
  ALERTDIALOG: 'alertdialog',
  BANNER: 'banner',
  MAIN: 'main',
  NAVIGATION: 'navigation',
  COMPLEMENTARY: 'complementary',
  CONTENTINFO: 'contentinfo',
  FORM: 'form',
  SEARCH: 'search',
  ARTICLE: 'article',
  SECTION: 'section',
  HEADING: 'heading',
  LIST: 'list',
  LISTITEM: 'listitem',
  TABLE: 'table',
  ROW: 'row',
  CELL: 'cell',
  COLUMNHEADER: 'columnheader',
  ROWHEADER: 'rowheader',
  PROGRESSBAR: 'progressbar',
  SLIDER: 'slider',
  SPINBUTTON: 'spinbutton',
  CHECKBOX: 'checkbox',
  RADIO: 'radio',
  TEXTBOX: 'textbox',
  COMBOBOX: 'combobox',
  LISTBOX: 'listbox',
  OPTION: 'option',
  SWITCH: 'switch',
  TOOLBAR: 'toolbar',
  TOOLTIP: 'tooltip',
  STATUS: 'status',
  LOG: 'log',
  MARQUEE: 'marquee',
  TIMER: 'timer',
  APPLICATION: 'application',
  DOCUMENT: 'document',
  PRESENTATION: 'presentation',
  NONE: 'none',
} as const;

// ARIA states and properties

/**
 * ARIA_STATES
 * @description Function
 */
export const ARIA_STATES = {
  EXPANDED: 'aria-expanded',
  SELECTED: 'aria-selected',
  CHECKED: 'aria-checked',
  PRESSED: 'aria-pressed',
  HIDDEN: 'aria-hidden',
  DISABLED: 'aria-disabled',
  REQUIRED: 'aria-required',
  INVALID: 'aria-invalid',
  READONLY: 'aria-readonly',
  MULTILINE: 'aria-multiline',
  ORIENTATION: 'aria-orientation',
  SORT: 'aria-sort',
  LEVEL: 'aria-level',
  POSINSET: 'aria-posinset',
  SETSIZE: 'aria-setsize',
  VALUEMIN: 'aria-valuemin',
  VALUEMAX: 'aria-valuemax',
  VALUENOW: 'aria-valuenow',
  VALUETEXT: 'aria-valuetext',
  LABELLEDBY: 'aria-labelledby',
  DESCRIBEDBY: 'aria-describedby',
  CONTROLS: 'aria-controls',
  OWNED: 'aria-owns',
  ACTIVE: 'aria-activedescendant',
  DROPEFFECT: 'aria-dropeffect',
  GRABBED: 'aria-grabbed',
  AUTCOMPLETE: 'aria-autocomplete',
  HASPOPUP: 'aria-haspopup',
  LIVE: 'aria-live',
  ATOMIC: 'aria-atomic',
  RELEVANT: 'aria-relevant',
  BUSY: 'aria-busy',
  CURRENT: 'aria-current',
  PLACEHOLDER: 'aria-placeholder',
  COLCOUNT: 'aria-colcount',
  COLINDEX: 'aria-colindex',
  COLSPAN: 'aria-colspan',
  ROWCOUNT: 'aria-rowcount',
  ROWINDEX: 'aria-rowindex',
  ROWSPAN: 'aria-rowspan',
} as const;

// Keyboard navigation utilities

/**
 * KEYBOARD_KEYS
 * @description Function
 */
export const KEYBOARD_KEYS = {
  ENTER: 'Enter',
  SPACE: ' ',
  ESCAPE: 'Escape',
  TAB: 'Tab',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  HOME: 'Home',
  END: 'End',
  PAGE_UP: 'PageUp',
  PAGE_DOWN: 'PageDown',
  BACKSPACE: 'Backspace',
  DELETE: 'Delete',
} as const;

/**
 * Generate unique ID for ARIA relationships
 */

/**
 * generateId
 * @description Function
 */
export const generateId = (prefix: string = 'id'): string => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Create ARIA label for form fields
 */

/**
 * createFieldLabel
 * @description Function
 */
export const createFieldLabel = (
  label: string,
  required: boolean = false,
  description?: string,
): string => {
  let ariaLabel = label;
  if (required) {
    ariaLabel += ' (required)';
  }
  if (description) {
    ariaLabel += `, ${description}`;
  }
  return ariaLabel;
};

/**
 * Create ARIA description for form fields
 */

/**
 * createFieldDescription
 * @description Function
 */
export const createFieldDescription = (
  description: string,
  error?: string,
  hint?: string,
): string => {
  const parts = [description];
  if (error) parts.push(`Error: ${error}`);
  if (hint) parts.push(`Hint: ${hint}`);
  return parts.join('. ');
};

/**
 * Handle keyboard navigation for lists
 */

/**
 * handleListKeyboardNavigation
 * @description Function
 */
export const handleListKeyboardNavigation = (
  event: React.KeyboardEvent,
  currentIndex: number,
  totalItems: number,
  onIndexChange: (index: number) => void,
  onSelect?: (index: number) => void,
): void => {
  switch (event.key) {
    case KEYBOARD_KEYS.ARROW_DOWN:
      event.preventDefault();
      onIndexChange(Math.min(currentIndex + 1, totalItems - 1));
      break;
    case KEYBOARD_KEYS.ARROW_UP:
      event.preventDefault();
      onIndexChange(Math.max(currentIndex - 1, 0));
      break;
    case KEYBOARD_KEYS.HOME:
      event.preventDefault();
      onIndexChange(0);
      break;
    case KEYBOARD_KEYS.END:
      event.preventDefault();
      onIndexChange(totalItems - 1);
      break;
    case KEYBOARD_KEYS.ENTER:
    case KEYBOARD_KEYS.SPACE:
      event.preventDefault();
      onSelect?.(currentIndex);
      break;
  }
};

/**
 * Handle keyboard navigation for tabs
 */

/**
 * handleTabKeyboardNavigation
 * @description Function
 */
export const handleTabKeyboardNavigation = (
  event: React.KeyboardEvent,
  currentIndex: number,
  totalTabs: number,
  onIndexChange: (index: number) => void,
  onSelect?: (index: number) => void,
): void => {
  switch (event.key) {
    case KEYBOARD_KEYS.ARROW_LEFT:
      event.preventDefault();
      onIndexChange(currentIndex === 0 ? totalTabs - 1 : currentIndex - 1);
      break;
    case KEYBOARD_KEYS.ARROW_RIGHT:
      event.preventDefault();
      onIndexChange(currentIndex === totalTabs - 1 ? 0 : currentIndex + 1);
      break;
    case KEYBOARD_KEYS.HOME:
      event.preventDefault();
      onIndexChange(0);
      break;
    case KEYBOARD_KEYS.END:
      event.preventDefault();
      onIndexChange(totalTabs - 1);
      break;
    case KEYBOARD_KEYS.ENTER:
    case KEYBOARD_KEYS.SPACE:
      event.preventDefault();
      onSelect?.(currentIndex);
      break;
  }
};

/**
 * Validate color contrast ratio
 */

/**
 * validateColorContrast
 * @description Function
 */
export const validateColorContrast = (
  foregroundColor: string,
  backgroundColor: string,
): { ratio: number; passes: boolean; level: 'AA' | 'AAA' | 'FAIL' } => {
  // Convert colors to luminance
  const getLuminance = (color: string): number => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;

    const [rs, gs, bs] = [r, g, b].map((c) => {
      if (c <= 0.03928) {
        return c / 12.92;
      }
      return Math.pow((c + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const l1 = getLuminance(foregroundColor);
  const l2 = getLuminance(backgroundColor);

  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);

  return {
    ratio,
    passes: ratio >= 4.5,
    level: ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : 'FAIL',
  };
};

/**
 * Focus management utilities
 */

/**
 * focusManagement
 * @description Function
 */
export const focusManagement = {
  /**
   * Trap focus within a container
   */
  trapFocus: (container: HTMLElement): (() => void) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === KEYBOARD_KEYS.TAB) {
        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);

    // Return cleanup function
    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  },

  /**
   * Focus first focusable element in container
   */
  focusFirst: (container: HTMLElement): void => {
    const focusableElement = container.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    ) as HTMLElement;

    if (focusableElement) {
      focusableElement.focus();
    }
  },

  /**
   * Focus last focusable element in container
   */
  focusLast: (container: HTMLElement): void => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );

    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    if (lastElement) {
      lastElement.focus();
    }
  },
};

/**
 * Screen reader utilities
 */

/**
 * screenReader
 * @description Function
 */
export const screenReader = {
  /**
   * Announce message to screen readers
   */
  announce: (message: string, priority: 'polite' | 'assertive' = 'polite'): void => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;

    document.body.appendChild(announcement);

    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  },

  /**
   * Hide element from screen readers
   */
  hide: (element: HTMLElement): void => {
    element.setAttribute('aria-hidden', 'true');
  },

  /**
   * Show element to screen readers
   */
  show: (element: HTMLElement): void => {
    element.removeAttribute('aria-hidden');
  },
};

/**
 * WCAG compliance utilities
 */

/**
 * wcag
 * @description Function
 */
export const wcag = {
  /**
   * Check if element meets WCAG AA contrast requirements
   */
  meetsContrastAA: (foregroundColor: string, backgroundColor: string): boolean => {
    const { ratio } = validateColorContrast(foregroundColor, backgroundColor);
    return ratio >= 4.5;
  },

  /**
   * Check if element meets WCAG AAA contrast requirements
   */
  meetsContrastAAA: (foregroundColor: string, backgroundColor: string): boolean => {
    const { ratio } = validateColorContrast(foregroundColor, backgroundColor);
    return ratio >= 7;
  },

  /**
   * Generate accessible name for element
   */
  generateAccessibleName: (label?: string, ariaLabel?: string, ariaLabelledBy?: string): string => {
    if (ariaLabel) return ariaLabel;
    if (label) return label;
    if (ariaLabelledBy) {
      const labelledElement = document.getElementById(ariaLabelledBy);
      return labelledElement?.textContent || '';
    }
    return '';
  },
};
