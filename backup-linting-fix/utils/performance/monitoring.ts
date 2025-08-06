/**
 * Performance monitoring utilities
 * Provides tools for measuring and tracking application performance
 */

export interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, PerformanceMetric[]> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  /**
   * Start timing a performance measurement
   * @param name - Name of the measurement
   */
  startTimer(name: string) {
    if (typeof performance !== 'undefined') {
      performance.mark(`${name}-start`);
    }
  }

  /**
   * End timing and record the measurement
   * @param name - Name of the measurement
   * @returns Duration in milliseconds
   */
  endTimer(name: string): number {
    if (typeof performance !== 'undefined') {
      performance.mark(`${name}-end`);
      performance.measure(name, `${name}-start`, `${name}-end`);

      const measure = performance.getEntriesByName(name)[0];
      const duration = measure.duration;

      // Store metric
      if (!this.metrics.has(name)) {
        this.metrics.set(name, []);
      }

      const metric: PerformanceMetric = {
        name,
        value: duration,
        timestamp: Date.now(),
      };

      this.metrics.get(name)!.push(metric);

      return duration;
    }
    return 0;
  }

  /**
   * Get all metrics for a specific measurement
   * @param name - Name of the measurement
   * @returns Array of performance metrics
   */
  getMetrics(name: string): PerformanceMetric[] {
    return this.metrics.get(name) || [];
  }

  /**
   * Get average duration for a measurement
   * @param name - Name of the measurement
   * @returns Average duration in milliseconds
   */
  getAverageMetric(name: string): number {
    const metrics = this.getMetrics(name);
    if (metrics.length === 0) return 0;
    return metrics.reduce((sum, metric) => sum + metric.value, 0) / metrics.length;
  }

  /**
   * Clear all metrics
   */
  clearMetrics() {
    this.metrics.clear();
  }
}

/**
 * Monitor Core Web Vitals
 */
export const monitorWebVitals = () => {
  if (typeof window !== 'undefined') {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        console.log(`Web Vital: ${entry.name} = ${entry.value}`);
      }
    });

    observer.observe({
      entryTypes: ['navigation', 'paint', 'largest-contentful-paint'],
    });
  }
};

/**
 * Monitor route load performance
 * @param routeName - Name of the route
 * @returns Function to call when route load is complete
 */
export const monitorRouteLoad = (routeName: string): (() => void) => {
  const monitor = PerformanceMonitor.getInstance();
  monitor.startTimer(`route-load-${routeName}`);

  return () => {
    const duration = monitor.endTimer(`route-load-${routeName}`);
    console.log(`Route ${routeName} loaded in ${duration.toFixed(2)}ms`);
  };
};

/**
 * Monitor API call performance
 * @param endpoint - API endpoint name
 * @returns Function to call when API call is complete
 */
export const monitorAPICall = (endpoint: string): (() => void) => {
  const monitor = PerformanceMonitor.getInstance();
  monitor.startTimer(`api-${endpoint}`);

  return () => {
    const duration = monitor.endTimer(`api-${endpoint}`);
    console.log(`API ${endpoint} completed in ${duration.toFixed(2)}ms`);
  };
};
