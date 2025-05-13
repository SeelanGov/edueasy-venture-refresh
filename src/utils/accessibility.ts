
/**
 * Announces a message to screen readers using the aria-live region
 * @param message Message to announce
 * @param priority Priority of announcement (polite or assertive)
 */
export function announceToScreenReader(message: string, priority: "polite" | "assertive" = "polite") {
  if (typeof document === "undefined") return;
  
  const announcer = document.getElementById("sr-announcer");
  
  if (announcer) {
    // Use existing announcer
    const regionToUse = priority === "assertive" 
      ? announcer.querySelector('[aria-live="assertive"]') 
      : announcer.querySelector('[aria-live="polite"]');
    
    if (regionToUse) {
      regionToUse.textContent = message;
    }
  } else {
    // Create announcer if it doesn't exist
    const newAnnouncer = document.createElement("div");
    newAnnouncer.id = "sr-announcer";
    newAnnouncer.style.position = "absolute";
    newAnnouncer.style.width = "1px";
    newAnnouncer.style.height = "1px";
    newAnnouncer.style.padding = "0";
    newAnnouncer.style.overflow = "hidden";
    newAnnouncer.style.clip = "rect(0, 0, 0, 0)";
    newAnnouncer.style.whiteSpace = "nowrap";
    newAnnouncer.style.border = "0";
    
    const politeRegion = document.createElement("div");
    politeRegion.setAttribute("aria-live", "polite");
    politeRegion.setAttribute("aria-atomic", "true");
    
    const assertiveRegion = document.createElement("div");
    assertiveRegion.setAttribute("aria-live", "assertive");
    assertiveRegion.setAttribute("aria-atomic", "true");
    
    newAnnouncer.appendChild(politeRegion);
    newAnnouncer.appendChild(assertiveRegion);
    document.body.appendChild(newAnnouncer);
    
    // Announce the message
    const regionToUse = priority === "assertive" ? assertiveRegion : politeRegion;
    regionToUse.textContent = message;
  }
}

/**
 * Creates a unique ID for ARIA attributes
 * @param prefix Optional prefix for the ID
 * @returns A unique ID string
 */
export function useAriaId(prefix: string = "aria"): string {
  const [id] = React.useState(() => `${prefix}-${Math.random().toString(36).substring(2, 9)}`);
  return id;
}

/**
 * Utility hook to manage focus within a component
 * @returns Object with focus management methods
 */
export function useFocusManagement() {
  const firstFocusableRef = React.useRef<HTMLElement | null>(null);
  const lastFocusableRef = React.useRef<HTMLElement | null>(null);

  const setFirstFocusableElement = React.useCallback((el: HTMLElement | null) => {
    firstFocusableRef.current = el;
  }, []);

  const setLastFocusableElement = React.useCallback((el: HTMLElement | null) => {
    lastFocusableRef.current = el;
  }, []);

  const focusFirst = React.useCallback(() => {
    firstFocusableRef.current?.focus();
  }, []);

  const focusLast = React.useCallback(() => {
    lastFocusableRef.current?.focus();
  }, []);

  return {
    setFirstFocusableElement,
    setLastFocusableElement,
    focusFirst,
    focusLast,
    firstFocusableRef,
    lastFocusableRef,
  };
}
