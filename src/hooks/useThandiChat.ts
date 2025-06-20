import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import DOMPurify from 'dompurify';
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage } from '@/types/ChatMessage';

export const useThandiChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const { user } = useAuth();
  const [page, setPage] = useState(0);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const PAGE_SIZE = 20;

  // Function to fetch chat history with pagination
  const fetchChatHistory = useCallback(
    async (pageNumber = 0) => {
      if (!user?.id) return;

      try {
        setIsLoading(true);
        const from = pageNumber * PAGE_SIZE;
        const to = from + PAGE_SIZE - 1;

        const { data, error, count } = await supabase
          .from('thandi_interactions')
          .select('*', { count: 'exact' })
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .range(from, to);

        if (error) throw error;

        // Determine if there are more messages to load
        if (count !== null) {
          setHasMoreMessages(count > (pageNumber + 1) * PAGE_SIZE);
        }

        if (data && data.length > 0) {
          // Convert database records to ChatMessage type, handling null values
          const mappedMessages: ChatMessage[] = data.map(item => ({
            id: item.id,
            user_id: item.user_id,
            message: item.message,
            is_user: item.is_user,
            created_at: item.created_at,
            intent_id: item.intent_id || undefined,
            confidence_score: item.confidence_score || undefined,
            low_confidence: item.low_confidence || undefined,
            response_type: item.response_type || undefined,
          }));

          // If it's the first page, set the messages
          // Otherwise, append to existing messages
          if (pageNumber === 0) {
            setMessages(mappedMessages.reverse());
          } else {
            setMessages((prevMessages) => [...mappedMessages.reverse(), ...prevMessages]);
          }
        } else if (pageNumber === 0) {
          // Send a welcome message if no chat history exists
          const welcomeMessage: ChatMessage = {
            id: uuidv4(),
            user_id: user.id,
            message: "Hi there! I'm Thandi, your application assistant. How can I help you today?",
            is_user: false,
            created_at: new Date().toISOString(),
          };

          // Save welcome message to database
          const { error } = await supabase.from('thandi_interactions').insert([
            {
              user_id: user.id,
              message: welcomeMessage.message,
              is_user: false,
              response_type: 'rule',
            },
          ]);

          if (error) throw error;

          setMessages([welcomeMessage]);
        }
      } catch (error) {
        console.error('Error fetching chat history:', error);
        toast.error('Failed to load chat history. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    [user?.id]
  );

  // Load more messages function
  const loadMoreMessages = useCallback(() => {
    if (hasMoreMessages && !isLoading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchChatHistory(nextPage);
    }
  }, [hasMoreMessages, isLoading, page, fetchChatHistory]);

  // Function to submit feedback for a message
  const submitFeedback = async (messageId: string, feedbackType: 'helpful' | 'unhelpful') => {
    if (!user) return;

    try {
      // Store feedback in the database using the correct table name
      await supabase.from('thandi_message_feedback').insert({
        message_id: messageId,
        user_id: user.id,
        feedback_type: feedbackType,
      });

      // You could also add analytics tracking here
      console.log(`Feedback submitted: ${feedbackType} for message ${messageId}`);

      return true;
    } catch (error) {
      console.error('Error submitting feedback:', error);
      return false;
    }
  };

  // Function to process user message and generate Thandi's response using OpenAI
  const processUserMessage = useCallback(
    async (userMessage: string) => {
      if (!user?.id) return null;

      setIsLoading(true);

      try {
        // Get user data that might be relevant for contextual responses
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();

        if (userError) throw userError;

        // Get applications data
        const { data: applicationsData, error: applicationsError } = await supabase
          .from('applications')
          .select(
            `
          *,
          documents (*),
          institutions:institution_id (name),
          programs:program_id (name)
        `
          )
          .eq('user_id', user.id);

        if (applicationsError) throw applicationsError;

        // Get the last few messages for context
        const { data: recentMessages } = await supabase
          .from('thandi_interactions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10);

        const chatHistory = recentMessages ? recentMessages.reverse() : [];

        // Call the OpenAI-powered edge function
        const response = await supabase.functions.invoke('thandi-openai', {
          body: {
            userId: user.id,
            userMessage,
            chatHistory,
            userData,
            applicationsData,
          },
        });

        if (response.error) {
          throw new Error(`Edge function error: ${response.error.message}`);
        }

        return response.data.response;
      } catch (error) {
        console.error('Error processing message with OpenAI:', error);

        // Fallback to simple rule-based responses
        const userMessageLower = userMessage.toLowerCase();

        // Document status queries
        if (userMessageLower.includes('document') || userMessageLower.includes('verification')) {
          return "I'm having trouble connecting to my AI system right now. For document status, please check your dashboard where you can view all your submitted documents and their verification status.";
        }
        // Program selection queries
        else if (
          userMessageLower.includes('program') ||
          userMessageLower.includes('course') ||
          userMessageLower.includes('study')
        ) {
          return "I'm having trouble connecting to my AI system right now. For program selection, consider your interests and career goals. You can browse available programs in the 'Programs' section of this platform.";
        }
        // Default response
        else {
          return "I apologize, but I'm experiencing some technical difficulties at the moment. Please try again later or check the dashboard for the information you need.";
        }
      } finally {
        setIsLoading(false);
      }
    },
    [user?.id]
  );

  // Debounced send message function
  const [isSending, setIsSending] = useState(false);
  const sendMessage = useCallback(
    async (message: string) => {
      if (!user?.id || isSending) return;

      // Sanitize user input
      const sanitizedMessage = DOMPurify.sanitize(message);

      // Prevent duplicate messages
      setIsSending(true);

      // Add user message to local state immediately for better UX
      const userMessageObj: ChatMessage = {
        id: uuidv4(),
        user_id: user.id,
        message: sanitizedMessage,
        is_user: true,
        created_at: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMessageObj]);

      try {
        // Process the message with OpenAI and get Thandi's response
        const thandiResponse = await processUserMessage(sanitizedMessage);

        if (thandiResponse) {
          const thandiMessageObj: ChatMessage = {
            id: uuidv4(),
            user_id: user.id,
            message: thandiResponse,
            is_user: false,
            created_at: new Date().toISOString(),
          };

          setMessages((prev) => [...prev, thandiMessageObj]);
        }

        // Reset the hasNewMessage flag when the user sends a new message
        setHasNewMessage(false);
      } catch (error) {
        console.error('Error processing message:', error);
        toast.error('Something went wrong. Please try again.');
      } finally {
        setIsSending(false);
      }
    },
    [user?.id, processUserMessage, isSending]
  );

  // Subscribe to Supabase realtime for new messages
  useEffect(() => {
    if (!user?.id) return;

    // Fetch initial chat history
    fetchChatHistory(0);

    // Set up realtime subscription
    const channel = supabase
      .channel('thandi-chat')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'thandi_interactions',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          // Only update if this is a new message not from the current session
          const newMessage = payload.new as any;

          // Convert to ChatMessage type
          const mappedMessage: ChatMessage = {
            id: newMessage.id,
            user_id: newMessage.user_id,
            message: newMessage.message,
            is_user: newMessage.is_user,
            created_at: newMessage.created_at,
            intent_id: newMessage.intent_id || undefined,
            confidence_score: newMessage.confidence_score || undefined,
            low_confidence: newMessage.low_confidence || undefined,
            response_type: newMessage.response_type || undefined,
          };

          setMessages((current) => {
            // Check if we already have this message in our local state
            const messageExists = current.some(
              (msg) =>
                msg.message === mappedMessage.message &&
                msg.is_user === mappedMessage.is_user &&
                // check if messages were created within 1 second of each other
                Math.abs(
                  new Date(msg.created_at).getTime() - new Date(mappedMessage.created_at).getTime()
                ) < 1000
            );

            if (messageExists) {
              return current;
            } else {
              // Play notification sound for new messages
              const audio = new Audio('/notification.mp3');
              audio.volume = 0.5;
              audio.play().catch((e) => console.log('Audio play prevented:', e));

              setHasNewMessage(true);
              return [...current, mappedMessage];
            }
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, fetchChatHistory]);

  return {
    messages,
    isLoading,
    sendMessage,
    inputValue,
    setInputValue,
    hasNewMessage,
    setHasNewMessage,
    loadMoreMessages,
    hasMoreMessages,
    isSending,
    submitFeedback,
  };
};
