import logger from '@/utils/logger';
import { supabase } from '@/integrations/supabase/client';

// Analytics event types
export type AnalyticsEventType =
  | 'page_view'
  | 'user_action'
  | 'application_submitted'
  | 'payment_completed'
  | 'error_occurred'
  | 'feature_used'
  | 'conversion'
  | 'engagement';

// Analytics event interface
export interface AnalyticsEvent {
  id?: string;
  event_type: AnalyticsEventType;
  event_name: string;
  user_id?: string;
  session_id: string;
  properties: Record<string, unknown>;
  timestamp: Date;
  page_url: string;
  user_agent: string;
  ip_address?: string;
  referrer?: string;
}

// User analytics interface
export interface UserAnalytics {
  user_id: string;
  total_sessions: number;
  total_page_views: number;
  last_active: Date;
  first_seen: Date;
  applications_submitted: number;
  payments_completed: number;
  features_used: string[];
  conversion_rate: number;
}

// Application analytics interface
export interface ApplicationAnalytics {
  total_applications: number;
  applications_by_status: Record<string, number>;
  applications_by_program: Record<string, number>;
  average_completion_time: number;
  conversion_funnel: {
    started: number;
    in_progress: number;
    completed: number;
    submitted: number;
  };
  top_programs: Array<{
    program_name: string;
    applications: number;
    success_rate: number;
  }>;
}

// Revenue analytics interface
export interface RevenueAnalytics {
  total_revenue: number;
  revenue_by_month: Record<string, number>;
  revenue_by_tier: Record<string, number>;
  average_order_value: number;
  conversion_rate: number;
  top_revenue_sources: Array<{
    source: string;
    revenue: number;
    transactions: number;
  }>;
}

class AnalyticsService {
  private sessionId: string;
  private userId?: string;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.initializeAnalytics();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeAnalytics() {
    // Track page views automatically
    this.trackPageView();

    // Set up automatic session tracking
    this.trackSessionStart();
  }

  /**
   * Track a page view
   */
  public trackPageView(pageName?: string) {
    const event: AnalyticsEvent = {
      event_type: 'page_view',
      event_name: pageName || window.location.pathname,
      session_id: this.sessionId,
      properties: {
        page_title: document.title,
        page_path: window.location.pathname,
        page_search: window.location.search,
        page_hash: window.location.hash,
      },
      timestamp: new Date(),
      page_url: window.location.href,
      user_agent: navigator.userAgent,
      referrer: document.referrer,
    };

    this.sendEvent(event);
  }

  /**
   * Track user actions
   */
  public trackUserAction(actionName: string, properties: Record<string, unknown> = {}) {
    const event: AnalyticsEvent = {
      event_type: 'user_action',
      event_name: actionName,
      user_id: this.userId,
      session_id: this.sessionId,
      properties,
      timestamp: new Date(),
      page_url: window.location.href,
      user_agent: navigator.userAgent,
    };

    this.sendEvent(event);
  }

  /**
   * Track application submission
   */
  public trackApplicationSubmitted(applicationData: {
    program_name: string;
    application_id: string;
    completion_time: number;
    documents_uploaded: number;
  }) {
    const event: AnalyticsEvent = {
      event_type: 'application_submitted',
      event_name: 'application_submitted',
      user_id: this.userId,
      session_id: this.sessionId,
      properties: applicationData,
      timestamp: new Date(),
      page_url: window.location.href,
      user_agent: navigator.userAgent,
    };

    this.sendEvent(event);
  }

  /**
   * Track payment completion
   */
  public trackPaymentCompleted(paymentData: {
    amount: number;
    currency: string;
    payment_method: string;
    tier_name: string;
    transaction_id: string;
  }) {
    const event: AnalyticsEvent = {
      event_type: 'payment_completed',
      event_name: 'payment_completed',
      user_id: this.userId,
      session_id: this.sessionId,
      properties: paymentData,
      timestamp: new Date(),
      page_url: window.location.href,
      user_agent: navigator.userAgent,
    };

    this.sendEvent(event);
  }

  /**
   * Track errors
   */
  public trackError(errorData: {
    error_message: string;
    error_stack?: string;
    component_name?: string;
    user_action?: string;
  }) {
    const event: AnalyticsEvent = {
      event_type: 'error_occurred',
      event_name: 'error_occurred',
      user_id: this.userId,
      session_id: this.sessionId,
      properties: errorData,
      timestamp: new Date(),
      page_url: window.location.href,
      user_agent: navigator.userAgent,
    };

    this.sendEvent(event);
  }

  /**
   * Track feature usage
   */
  public trackFeatureUsed(featureName: string, properties: Record<string, unknown> = {}) {
    const event: AnalyticsEvent = {
      event_type: 'feature_used',
      event_name: featureName,
      user_id: this.userId,
      session_id: this.sessionId,
      properties,
      timestamp: new Date(),
      page_url: window.location.href,
      user_agent: navigator.userAgent,
    };

    this.sendEvent(event);
  }

  /**
   * Track conversions
   */
  public trackConversion(conversionData: {
    conversion_type: string;
    value?: number;
    currency?: string;
    properties?: Record<string, unknown>;
  }) {
    const event: AnalyticsEvent = {
      event_type: 'conversion',
      event_name: conversionData.conversion_type,
      user_id: this.userId,
      session_id: this.sessionId,
      properties: conversionData,
      timestamp: new Date(),
      page_url: window.location.href,
      user_agent: navigator.userAgent,
    };

    this.sendEvent(event);
  }

  /**
   * Track engagement metrics
   */
  public trackEngagement(engagementData: {
    engagement_type: string;
    duration?: number;
    interactions?: number;
    properties?: Record<string, unknown>;
  }) {
    const event: AnalyticsEvent = {
      event_type: 'engagement',
      event_name: engagementData.engagement_type,
      user_id: this.userId,
      session_id: this.sessionId,
      properties: engagementData,
      timestamp: new Date(),
      page_url: window.location.href,
      user_agent: navigator.userAgent,
    };

    this.sendEvent(event);
  }

  /**
   * Set user ID for tracking
   */
  public setUserId(userId: string) {
    this.userId = userId;
  }

  /**
   * Track session start
   */
  private trackSessionStart() {
    this.trackUserAction('session_started', {
      session_id: this.sessionId,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Send event to analytics backend
   */
  private async sendEvent(event: AnalyticsEvent): Promise<void> {
    try {
      // Store in Supabase analytics table
      const { error } = await supabase.from('analytics_events').insert({
        event_type: event.event_type,
        event_name: event.event_name,
        user_id: event.user_id,
        session_id: event.session_id,
        properties: event.properties,
        timestamp: event.timestamp.toISOString(),
        page_url: event.page_url,
        user_agent: event.user_agent,
        referrer: event.referrer,
      });

      if (error) {
        logger.error('Failed to send analytics event:', error);
      }
    } catch (error) {
      logger.error('Analytics error:', error);
    }
  }

  /**
   * Get user analytics
   */
  public async getUserAnalytics(userId: string): Promise<UserAnalytics | null> {
    try {
      const { data, error } = await supabase
        .from('user_analytics')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        logger.error('Failed to get user analytics:', error);
        return null;
      }

      return data;
    } catch (error) {
      logger.error('Error fetching user analytics:', error);
      return null;
    }
  }

  /**
   * Get application analytics
   */
  public async getApplicationAnalytics(): Promise<ApplicationAnalytics | null> {
    try {
      const { data, error } = await supabase.from('application_analytics').select('*').single();

      if (error) {
        logger.error('Failed to get application analytics:', error);
        return null;
      }

      return data;
    } catch (error) {
      logger.error('Error fetching application analytics:', error);
      return null;
    }
  }

  /**
   * Get revenue analytics
   */
  public async getRevenueAnalytics(): Promise<RevenueAnalytics | null> {
    try {
      const { data, error } = await supabase.from('revenue_analytics').select('*').single();

      if (error) {
        logger.error('Failed to get revenue analytics:', error);
        return null;
      }

      return data;
    } catch (error) {
      logger.error('Error fetching revenue analytics:', error);
      return null;
    }
  }

  /**
   * Generate analytics report
   */
  public async generateReport(
    reportType: 'user' | 'application' | 'revenue',
    filters?: Record<string, unknown>,
  ): Promise<unknown> {
    try {
      const { data, error } = await supabase.rpc('generate_analytics_report', {
        report_type: reportType,
        filters: filters || {},
      });

      if (error) {
        logger.error('Failed to generate analytics report:', error);
        return null;
      }

      return data;
    } catch (error) {
      logger.error('Error generating analytics report:', error);
      return null;
    }
  }
}

// Create singleton instance

/**
 * analyticsService
 * @description Function
 */
export const analyticsService = new AnalyticsService();

// Export for use in components
export default analyticsService;
