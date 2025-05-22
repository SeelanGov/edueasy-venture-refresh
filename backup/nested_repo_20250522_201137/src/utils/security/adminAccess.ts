import { supabase } from '@/integrations/supabase/client';
import { logSecurityEvent } from './logging';

/**
 * Utility to verify if a user has admin privileges using the enhanced is_admin function
 */
export const verifyAdminAccess = async (userId: string | undefined): Promise<boolean> => {
  if (!userId) return false;
  
  try {
    // Use the enhanced is_admin function with better error handling
    const { data, error } = await supabase.rpc('is_admin', {
      user_uuid: userId
    });
    
    if (error) throw error;
    
    // Log successful admin check for audit trail
    if (data) {
      await logSecurityEvent(
        userId,
        'ADMIN_ACCESS_CHECK',
        { result: 'success' },
        true
      );
    }
    
    return !!data;
  } catch (error: unknown) {
    console.error("Error checking admin status:", error);
    
    // Log the error
    await logSecurityEvent(
      userId,
      'ADMIN_ACCESS_CHECK',
      { error: (typeof error === 'object' && error && 'message' in error) ? (error as { message: string }).message : String(error) },
      false
    );
    
    return false;
  }
};
