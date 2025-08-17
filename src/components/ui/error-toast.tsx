import { toast } from 'sonner';
import { parseError } from '@/utils/errors';

/**
 * Show error toast with proper categorization
 */
export const showErrorToast = (error: unknown, defaultMessage = 'An error occurred') => {
  const { message, category } = parseError(error);
  
  switch (category) {
    case 'PERMISSION':
      toast.error('Not Authorized', {
        description: message,
      });
      // Log permission denials as info, not errors
      console.info('Permission denied:', message);
      break;
    
    case 'VALIDATION':
      toast.error('Invalid Input', {
        description: message,
      });
      break;
    
    case 'NETWORK':
      toast.error('Connection Error', {
        description: 'Please check your internet connection and try again.',
      });
      break;
    
    default:
      toast.error('Error', {
        description: message || defaultMessage,
      });
      console.error('Unexpected error:', error);
  }
};