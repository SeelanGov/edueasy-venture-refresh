
// Visual diffing configuration for Chromatic/Percy integration
export const VISUAL_DIFF_CONFIG = {
  // Component stories to test for visual regressions
  criticalComponents: [
    'Button',
    'StatusBadge', 
    'Card',
    'PageLayout',
    'AdminDashboard',
    'Dashboard',
    'ApplicationForm',
    'Login',
    'Register',
  ],
  
  // Viewports to test responsive behavior
  viewports: [
    { name: 'mobile', width: 375, height: 667 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1280, height: 1024 },
    { name: 'wide', width: 1920, height: 1080 },
  ],
  
  // Test scenarios for each component
  scenarios: {
    Button: ['default', 'primary', 'secondary', 'outline', 'destructive', 'ghost', 'disabled'],
    StatusBadge: ['success', 'error', 'warning', 'info', 'pending'],
    Card: ['default', 'with-header', 'with-footer', 'interactive'],
    PageLayout: ['with-title', 'with-subtitle', 'with-gradient', 'without-gradient'],
  },
  
  // Threshold for acceptable visual differences (percentage)
  threshold: 0.02, // 2% difference allowed
  
  // Ignore regions (e.g., timestamps, dynamic content)
  ignoreRegions: [
    '[data-testid="timestamp"]',
    '[data-testid="dynamic-content"]',
    '.loading-spinner',
  ],
};

export const generateVisualDiffReport = (results: any[]): {
  passed: number;
  failed: number;
  total: number;
  failedTests: string[];
} => {
  const failed = results.filter(r => !r.passed);
  
  return {
    passed: results.length - failed.length,
    failed: failed.length,
    total: results.length,
    failedTests: failed.map(r => r.name),
  };
};
