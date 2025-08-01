import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface FeedbackSystemProps {
  messageId: string;
  onFeedbackSubmit?: (feedback: 'helpful' | 'unhelpful') => void;
}

/**
 * FeedbackSystem
 * @description Function
 */
export const FeedbackSystem = ({ messageId, onFeedbackSubmit }: FeedbackSystemProps): JSX.Element => {
  const [feedback, setFeedback] = useState<'helpful' | 'unhelpful' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const handleFeedback = async (type: 'helpful' | 'unhelpful') => {
    if (isSubmitting || !user?.id) return;

    setIsSubmitting(true);

    try {
      // Store feedback in the database using the correct table name
      // that exists in the Database (checking via Typescript types)
      await supabase.from('thandi_message_feedback').insert({
        message_id: messageId,
        user_id: user.id,
        feedback_type: type,
      });

      setFeedback(type);
      if (onFeedbackSubmit) onFeedbackSubmit(type);
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center gap-2 mt-2">
      <span className="text-xs text-gray-500">Was this response helpful?</span>
      <Button
        variant="outline"
        size="sm"
        className={`p-1 h-8 w-8 ${feedback === 'helpful' ? 'bg-green-100 text-green-600 border-green-200' : ''}`}
        disabled={feedback !== null || isSubmitting}
        onClick={() => handleFeedback('helpful')}
      >
        <ThumbsUp className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        className={`p-1 h-8 w-8 ${feedback === 'unhelpful' ? 'bg-red-100 text-red-600 border-red-200' : ''}`}
        disabled={feedback !== null || isSubmitting}
        onClick={() => handleFeedback('unhelpful')}
      >
        <ThumbsDown className="h-4 w-4" />
      </Button>
    </div>
  );
};
