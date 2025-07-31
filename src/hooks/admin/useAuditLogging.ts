import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logSecurityEvent } from '@/utils/security/logging';

export interface AuditLogEntry {
  id: string;
  user_id: string | null;
  action: string;
  component: string;
  message: string;
  details: Record<string, unknown>;
  occurred_at: string;
  category: string;
  severity: string;
}

export interface AdminAction {
  action: string;
  target_type: 'document' | 'user' | 'system';
  target_id: string;
  details: Record<string, unknown>;
  reason?: string;
}

/**
 * useAuditLogging
 * @description Function
 */
export function useAuditLogging() {
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(false);

  // Log admin action with enhanced tracking
  const logAdminAction = async (adminAction: AdminAction) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Create detailed audit entry
      const auditEntry = {
        message: `Admin action: ${adminAction.action} on ${adminAction.target_type}`,
        category: 'ADMIN_ACTION',
        severity: 'INFO',
        component: 'AdminPanel',
        action: adminAction.action,
        user_id: user.id,
        details: {
          target_type: adminAction.target_type,
          target_id: adminAction.target_id,
          admin_id: user.id,
          timestamp: new Date().toISOString(),
          reason: adminAction.reason,
          ...adminAction.details,
        },
      };

      // Insert into system_error_logs table for audit trail
      const { error } = await supabase.from('system_error_logs').insert(auditEntry);

      if (error) throw error;

      // Also log as security event
      await logSecurityEvent(user.id, adminAction.action, auditEntry.details, true);

      console.log('Admin action logged:', adminAction);
    } catch (error) {
      console.error('Failed to log admin action:', error);
      throw error;
    }
  };

  // Fetch audit logs for a specific target
  const fetchAuditLogs = async (targetId?: string, targetType?: string) => {
    setLoading(true);
    try {
      let query = supabase
        .from('system_error_logs')
        .select('*')
        .eq('category', 'ADMIN_ACTION')
        .order('occurred_at', { ascending: false });

      if (targetId && targetType) {
        query = query.contains('details', { target_id: targetId, target_type: targetType });
      }

      const { data, error } = await query.limit(100);
      if (error) throw error;

      setAuditLogs(data as AuditLogEntry[]);
    } catch (error) {
      console.error('Failed to fetch audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch recent admin activity
  const fetchRecentActivity = async (limit = 50) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('system_error_logs')
        .select('*')
        .eq('category', 'ADMIN_ACTION')
        .order('occurred_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      setAuditLogs(data as AuditLogEntry[]);
    } catch (error) {
      console.error('Failed to fetch recent activity:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    auditLogs,
    loading,
    logAdminAction,
    fetchAuditLogs,
    fetchRecentActivity,
  };
}
