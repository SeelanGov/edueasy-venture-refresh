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
  
  // Function to process user message and generate Thandi's response
  const processUserMessage = useCallback(async (userMessage: string) => {
    if (!user?.id) return;
    
    // Generate Thandi's response based on the user message
    let thandiResponse = "";
    setIsLoading(true);
    
    // Get user data that might be relevant for contextual responses
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();
    
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
    
    // Process different types of queries
    const userMessageLower = userMessage.toLowerCase();
    
    // Document status queries
    if (userMessageLower.includes("document") || userMessageLower.includes("verification")) {
      if (applicationsData && applicationsData.length > 0) {
        const docsCount = applicationsData.flatMap(app => app.documents || []).length;
        
        if (docsCount > 0) {
          const pendingDocs = applicationsData.flatMap(app => 
            app.documents?.filter(doc => doc.verification_status === 'pending') || []
          );
          
          const approvedDocs = applicationsData.flatMap(app => 
            app.documents?.filter(doc => doc.verification_status === 'approved') || []
          );
          
          const rejectedDocs = applicationsData.flatMap(app => 
            app.documents?.filter(doc => doc.verification_status === 'rejected') || []
          );
          
          thandiResponse = `You have submitted ${docsCount} document${docsCount !== 1 ? 's' : ''}. `;
          
          if (pendingDocs.length > 0) {
            thandiResponse += `${pendingDocs.length} document${pendingDocs.length !== 1 ? 's are' : ' is'} pending verification. `;
          }
          
          if (approvedDocs.length > 0) {
            thandiResponse += `${approvedDocs.length} document${approvedDocs.length !== 1 ? 's have' : ' has'} been approved. `;
          }
          
          if (rejectedDocs.length > 0) {
            thandiResponse += `${rejectedDocs.length} document${rejectedDocs.length !== 1 ? 's have' : ' has'} been rejected. `;
          }
          
          thandiResponse += `You can check detailed status in the dashboard.`;
        } else {
          thandiResponse = "You haven't submitted any documents yet. You can upload supporting documents when you create a new application.";
        }
      } else {
        thandiResponse = "You don't have any applications yet. Start your application journey by clicking on 'New Application'.";
      }
    } 
    // Program selection queries
    else if (userMessageLower.includes("program") || userMessageLower.includes("course") || userMessageLower.includes("study")) {
      thandiResponse = "When selecting a program, consider your interests, strengths, and career goals. You can browse available programs in the 'Programs' section. Each program shows qualification requirements and other important details.";
      
      // Add more specific information if they have applications
      if (applicationsData && applicationsData.length > 0) {
        thandiResponse += " I see that you've already applied to: ";
        applicationsData.forEach((app, index) => {
          if (app.institutions && app.programs) {
            thandiResponse += `${app.institutions.name} for ${app.programs.name}`;
            if (index < applicationsData.length - 1) thandiResponse += ", ";
            else thandiResponse += ".";
          }
        });
      }
    }
    // Deadlines queries
    else if (userMessageLower.includes("deadline") || userMessageLower.includes("due date") || userMessageLower.includes("when")) {
      thandiResponse = "Application deadlines vary by institution and program. For most undergraduate programs, the deadline is around October for the following year's intake. Some institutions have rolling admissions or multiple intake periods. Check the specific program details for exact deadlines.";
    }
    // Financial aid queries
    else if (userMessageLower.includes("financial") || userMessageLower.includes("funding") || userMessageLower.includes("scholarship") || userMessageLower.includes("bursary")) {
      thandiResponse = "Financial aid options include bursaries, scholarships, and student loans. NSFAS is the national financial aid scheme for qualifying students. Each institution also offers their own scholarships based on academic merit or other criteria. Remember to apply for financial aid as early as possible as there are often separate deadlines.";
    }
    // Application process
    else if (userMessageLower.includes("apply") || userMessageLower.includes("application")) {
      thandiResponse = "To apply, start by clicking the 'New Application' button on your dashboard. You'll need to select an institution, choose a program, and upload supporting documents. Make sure your personal information and academic history are up to date before submitting.";
    }
    // General greeting
    else if (userMessageLower.includes("hello") || userMessageLower.includes("hi") || userMessageLower.includes("hey")) {
      thandiResponse = `Hello${userData?.full_name ? ' ' + userData.full_name : ''}! I'm Thandi, your application assistant. How can I help you with your educational journey today?`;
    }
    // Default response
    else {
      thandiResponse = "I'm here to help with your application process. You can ask me about document status, program selection, application deadlines, or financial aid options. If you need specific help with your application, please visit the dashboard.";
    }
    
    // Add the user's message to the database
    const { error: userMessageError } = await supabase
      .from("thandi_interactions")
      .insert([{
        user_id: user.id,
        message: DOMPurify.sanitize(userMessage),
        is_user: true
      }]);
    
    if (userMessageError) {
      console.error("Error saving user message:", userMessageError);
      toast.error("Failed to send your message. Please try again.");
    }
    
    // Add Thandi's response to the database
    const { error: thandiMessageError } = await supabase
      .from("thandi_interactions")
      .insert([{
        user_id: user.id,
        message: thandiResponse,
        is_user: false
      }]);
    
    if (thandiMessageError) {
      console.error("Error saving Thandi response:", thandiMessageError);
      toast.error("Failed to get a response. Please try again.");
    }
    
    setIsLoading(false);
    
    // Return the response
    return thandiResponse;
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
      // Process the message and get Thandi's response
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
