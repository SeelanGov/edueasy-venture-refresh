import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import DOMPurify from "dompurify";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

interface ChatMessage {
  id: string;
  message: string;
  is_user: boolean;
  created_at: string;
  confidence_score?: number;
  low_confidence?: boolean;
}

export const useThandiChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const { user } = useAuth();
  const [page, setPage] = useState(0);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const PAGE_SIZE = 20;
  
  // Function to fetch chat history with pagination
  const fetchChatHistory = useCallback(async (pageNumber = 0) => {
    if (!user?.id) return;
    
    try {
      setIsLoading(true);
      const from = pageNumber * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      
      const { data, error, count } = await supabase
        .from("thandi_interactions")
        .select("*", { count: 'exact' })
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .range(from, to);
      
      if (error) throw error;
      
      // Determine if there are more messages to load
      if (count !== null) {
        setHasMoreMessages(count > (pageNumber + 1) * PAGE_SIZE);
      }
      
      if (data && data.length > 0) {
        // If it's the first page, set the messages
        // Otherwise, append to existing messages
        if (pageNumber === 0) {
          setMessages(data.reverse());
        } else {
          setMessages(prevMessages => [...data.reverse(), ...prevMessages]);
        }
      } else if (pageNumber === 0) {
        // Send a welcome message if no chat history exists
        const welcomeMessage = {
          id: uuidv4(),
          message: "Hi there! I'm Thandi, your application assistant. How can I help you today?",
          is_user: false,
          created_at: new Date().toISOString(),
        };
        
        // Save welcome message to database
        const { error } = await supabase
          .from("thandi_interactions")
          .insert([{
            user_id: user.id,
            message: welcomeMessage.message,
            is_user: false,
            response_type: 'rule'
          }]);
        
        if (error) throw error;
        
        setMessages([welcomeMessage]);
      }
    } catch (error) {
      console.error("Error fetching chat history:", error);
      toast.error("Failed to load chat history. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);
  
  // Load more messages function
  const loadMoreMessages = useCallback(() => {
    if (hasMoreMessages && !isLoading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchChatHistory(nextPage);
    }
  }, [hasMoreMessages, isLoading, page, fetchChatHistory]);
  
  // Function to process user message and generate Thandi's response using OpenAI
  const processUserMessage = useCallback(async (userMessage: string) => {
    if (!user?.id) return null;
    
    setIsLoading(true);
    
    try {
      // Get user data that might be relevant for contextual responses
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();
      
      if (userError) throw userError;
      
      // Get applications data
      const { data: applicationsData, error: applicationsError } = await supabase
        .from("applications")
        .select(`
          *,
          documents (*),
          institutions:institution_id (name),
          programs:program_id (name)
        `)
        .eq("user_id", user.id);
      
      if (applicationsError) throw applicationsError;
      
      // Get the last few messages for context
      const { data: recentMessages } = await supabase
        .from("thandi_interactions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10);
      
      const chatHistory = recentMessages ? recentMessages.reverse() : [];
      
      // Call the OpenAI-powered edge function
      const response = await supabase.functions.invoke('thandi-openai', {
        body: {
          userId: user.id,
          userMessage,
          chatHistory,
          userData,
          applicationsData
        }
      });
      
      if (response.error) {
        throw new Error(`Edge function error: ${response.error.message}`);
      }
      
      return response.data.response;
      
    } catch (error) {
      console.error("Error processing message with OpenAI:", error);
      
      // Fallback to simple rule-based responses
      const userMessageLower = userMessage.toLowerCase();
      
      // Document status queries
      if (userMessageLower.includes("document") || userMessageLower.includes("verification")) {
        return "I'm having trouble connecting to my AI system right now. For document status, please check your dashboard where you can view all your submitted documents and their verification status.";
      } 
      // Program selection queries
      else if (userMessageLower.includes("program") || userMessageLower.includes("course") || userMessageLower.includes("study")) {
        return "I'm having trouble connecting to my AI system right now. For program selection, consider your interests and career goals. You can browse available programs in the 'Programs' section of this platform.";
      }
      // Default response
      else {
        return "I apologize, but I'm experiencing some technical difficulties at the moment. Please try again later or check the dashboard for the information you need.";
      }
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);
  
  // Debounced send message function
  const [isSending, setIsSending] = useState(false);
  const sendMessage = useCallback(async (message: string) => {
    if (!user?.id || isSending) return;
    
    // Sanitize user input
    const sanitizedMessage = DOMPurify.sanitize(message);
    
    // Prevent duplicate messages
    setIsSending(true);
    
    // Add user message to local state immediately for better UX
    const userMessageObj = {
      id: uuidv4(),
      message: sanitizedMessage,
      is_user: true,
      created_at: new Date().toISOString(),
    };
    
    setMessages((prev) => [...prev, userMessageObj]);
    
    try {
      // Process the message with OpenAI and get Thandi's response
      const thandiResponse = await processUserMessage(sanitizedMessage);
      
      if (thandiResponse) {
        const thandiMessageObj = {
          id: uuidv4(),
          message: thandiResponse,
          is_user: false,
          created_at: new Date().toISOString(),
        };
        
        setMessages((prev) => [...prev, thandiMessageObj]);
      }
      
      // Reset the hasNewMessage flag when the user sends a new message
      setHasNewMessage(false);
    } catch (error) {
      console.error("Error processing message:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSending(false);
    }
  }, [user?.id, processUserMessage, isSending]);
  
  // Subscribe to Supabase realtime for new messages
  useEffect(() => {
    if (!user?.id) return;
    
    // Fetch initial chat history
    fetchChatHistory(0);
    
    // Set up realtime subscription
    const channel = supabase
      .channel('thandi-chat')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'thandi_interactions',
        filter: `user_id=eq.${user.id}`
      }, payload => {
        // Only update if this is a new message not from the current session
        const newMessage = payload.new as ChatMessage;
        
        setMessages(current => {
          // Check if we already have this message in our local state
          const messageExists = current.some(msg => 
            msg.message === newMessage.message && 
            msg.is_user === newMessage.is_user &&
            // check if messages were created within 1 second of each other
            Math.abs(new Date(msg.created_at).getTime() - new Date(newMessage.created_at).getTime()) < 1000
          );
          
          if (messageExists) {
            return current;
          } else {
            // Play notification sound for new messages
            const audio = new Audio("/notification.mp3");
            audio.volume = 0.5;
            audio.play().catch(e => console.log("Audio play prevented:", e));
            
            setHasNewMessage(true);
            return [...current, newMessage];
          }
        });
      })
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
    isSending
  };
};
