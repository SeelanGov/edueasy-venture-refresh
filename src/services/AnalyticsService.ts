import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import type { Json, UserAnalytics, ApplicationAnalytics, RevenueAnalytics } from '@/types/supabase';

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

  private initializeAnalytics(): void {
    // Track page views automatically
    this.trackPageView();

    // Set up automatic session tracking
    this.trackSessionStart();
  }

  /**
   * Track a page view
   */
  public trackPageView(pageName?: string): void {
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
  public trackUserAction(actionName: string, properties: Record<string, unknown> = {}): void {
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
   * Track feature usage
   */
  public trackFeatureUsed(featureName: string, properties: Record<string, unknown> = {}): void {
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
   * Set user ID for tracking
   */
  public setUserId(userId: string): void {
    this.userId = userId;
  }

  /**
   * Track session start
   */
  private trackSessionStart(): void {
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
        properties: event.properties as Json,
        timestamp: event.timestamp.toISOString(),
        page_url: event.page_url,
        user_agent: event.user_agent,
        referrer: event.referrer,
      });

      if (error) {
        console.error('Failed to send analytics event:', error);
      }
    } catch (error) {
      console.error('Analytics error:', error);
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
        console.error('Failed to get user analytics:', error);
        return null;
      }

      return data ? {
        ...data,
        total_sessions: data.total_sessions ?? 0,
        total_page_views: data.total_page_views ?? 0,
        payments_completed: data.payments_completed ?? 0,
        applications_submitted: data.applications_submitted ?? 0,
        conversion_rate: data.conversion_rate ?? 0,
        features_used: data.features_used ?? [],
        first_seen: data.first_seen ?? '',
        last_active: data.last_active ?? ''
      } : null;
    } catch (error) {
      console.error('Error fetching user analytics:', error);
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
        console.error('Failed to get application analytics:', error);
        return null;
      }

      return data ? {
        ...data,
        total_applications: data.total_applications ?? 0,
        average_completion_time: data.average_completion_time ?? 0
      } : null;
    } catch (error) {
      console.error('Error fetching application analytics:', error);
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
        console.error('Failed to get revenue analytics:', error);
        return null;
      }

      return data ? {
        ...data,
        total_revenue: data.total_revenue ?? 0,
        average_order_value: data.average_order_value ?? 0,
        conversion_rate: data.conversion_rate ?? 0
      } : null;
    } catch (error) {
      console.error('Error fetching revenue analytics:', error);
      return null;
    }
  }
}

// Create singleton instance
export const analyticsService = new AnalyticsService();

// Export for use in components
export default analyticsService;