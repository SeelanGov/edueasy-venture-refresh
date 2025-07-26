import * as React from 'react';

interface FocusTrapProps {
  children: React.ReactNode;
  active?: boolean;
  className?: string;
}

/**
 * FocusTrap
 * @description Function
 */
export function FocusTrap({ children, active = true, className }: FocusTrapProps): void {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [focusableElements, setFocusableElements] = React.useState<HTMLElement[]>([]);

  // Get all focusable elements when the component mounts or changes
  React.useEffect(() => {
    if (!active || !containerRef.current) return;

    const elements = containerRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );

    setFocusableElements(Array.from(elements));
  }, [children, active]);

  // Handle tab key to keep focus trapped
  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (!active || focusableElements.length === 0) return;

      if (e.key === 'Tab') {
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        // If shift+tab and on first element, go to last element
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
          return;
        }
        // If tab and on last element, go to first element
        else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
          return;
        }
      }
    },
    [active, focusableElements],
  );

  // Focus the first element when trap becomes active
  React.useEffect(() => {
    if (active && focusableElements.length > 0) {
      // Store previous focus
      const previousFocus = document.activeElement as HTMLElement;

      // Focus first element
      focusableElements[0].focus();

      // Return focus when component unmounts
      return () => {
        if (previousFocus) previousFocus.focus();
      };
    }
    // Ensure all code paths return a value
    return undefined;
  }, [active, focusableElements]);

  return (
    <div ref={containerRef} onKeyDown={handleKeyDown} className={className}>
      {children}
    </div>
  );
}

export default FocusTrap;
