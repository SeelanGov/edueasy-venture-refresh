import logger from '@/utils/logger';
import { supabase } from '@/integrations/supabase/client';

/**
 * Utility to check if a record belongs to the current user using the new belongs_to_user function
 */

/**
 * recordBelongsToUser
 * @description Function
 */
export const recordBelongsToUser = async (
  tableName: string,
  recordId: string,
  userId: string | undefined,
): Promise<boolean> => {
  if (!userId || !recordId) return false;

  try {
    const { data, error } = await supabase.rpc('belongs_to_user', {
      table_name: tableName,
      record_id: recordId,
    });

    if (error) throw error;
    return !!data;
  } catch (error) {
    logger.error(`Error checking record ownership for ${tableName}:`, error);
    return false;
  }
};
