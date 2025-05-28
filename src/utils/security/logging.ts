import { supabase } from '@/integrations/supabase/client';
import { ErrorSeverity } from '@/utils/errorLogging';
import type { Json } from '@/integrations/supabase/types';

/**
 * Create a standardized logging helper for security-related events
 */
export const logSecurityEvent = async (
  userId: string | undefined,
  action: string,
  details: Json,
  success: boolean
) => {
  try {
    await supabase.from('system_error_logs').insert({
      message: `Security event: ${action} - ${success ? 'Success' : 'Failure'}`,
      category: 'SECURITY',
      severity: success ? ErrorSeverity.INFO : ErrorSeverity.WARNING,
      component: 'SecurityMonitor',
      action: action,
      user_id: userId,
      details: details,
    });
  } catch (error) {
    console.error('Failed to log security event:', error);
  }
};
