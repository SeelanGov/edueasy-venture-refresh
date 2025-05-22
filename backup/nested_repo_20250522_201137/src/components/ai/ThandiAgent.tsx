
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, X, MessageCircle, Send, ChevronDown, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { useTheme } from "@/hooks/useTheme";
import { useThandiChat } from "@/hooks/useThandiChat";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

export const ThandiAgent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const isMobile = useIsMobile();
  const { 
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
  } = useThandiChat();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Handle scroll events to show/hide the scroll to top button
  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop } = chatContainerRef.current;
      setShowScrollTop(scrollTop > 300);
    }
  };

  // Scroll to the bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current && isOpen) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  // Reset hasNewMessage when opening the chat
  useEffect(() => {
    if (isOpen) {
      setHasNewMessage(false);
    }
  }, [isOpen, setHasNewMessage]);

  // We don't want to open Thandi until we have a user
  if (!user) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isSending) {
      sendMessage(inputValue);
      setInputValue("");
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };
  
  const scrollToTop = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  // Function to load more messages when scrolling to top
  const handleScrollToTop = () => {
    if (chatContainerRef.current) {
      const { scrollTop } = chatContainerRef.current;
      if (scrollTop === 0 && hasMoreMessages) {
        loadMoreMessages();
      }
    }
  };

  // Render quick reply buttons
  const renderQuickReplies = () => {
    const quickReplies = [
      "What's the status of my documents?",
      "How do I choose a program?",
      "When are the application deadlines?",
      "What financial aid options are available?"
    ];

    return (
      <div className="grid grid-cols-1 gap-2 w-full max-w-xs mb-4">
        {quickReplies.map((reply, index) => (
          <Button 
            key={index}
            variant="outline" 
            size="sm" 
            className="text-xs justify-start" 
            onClick={() => {
              sendMessage(reply);
              setInputValue("");
            }}
          >
            {reply}
          </Button>
        ))}
      </div>
    );
  };

  // Determine if we should use the Sheet component on mobile
  if (isMobile) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetContent side="bottom" className="h-[85vh] p-0">
            <SheetHeader className={`p-3 flex justify-between items-center border-b ${
              isDarkMode ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-cap-teal text-white"
            }`}>
              <div className="flex items-center">
                <Avatar className="h-8 w-8 mr-2 bg-white text-cap-teal">
                  <Bot className="h-4 w-4" />
                </Avatar>
                <SheetTitle className="text-white">
                  <h3 className="font-medium text-sm">Thandi</h3>
                  <p className="text-xs opacity-70">Application Assistant</p>
                </SheetTitle>
              </div>
            </SheetHeader>
            
            <div className="h-full flex flex-col">
              {/* Chat messages */}
              <div className="flex-1 p-4 overflow-y-auto" ref={chatContainerRef} onScroll={handleScroll}>
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-4">
                    <Bot className="h-12 w-12 mb-3 text-cap-teal" />
                    <h3 className="font-medium mb-2">Welcome to Thandi</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                      I'm your application assistant. You can ask me anything about your application or financial aid.
                    </p>
                    {renderQuickReplies()}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {hasMoreMessages && (
                      <div className="flex justify-center">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={loadMoreMessages}
                          disabled={isLoading}
                          className="text-xs"
                        >
                          {isLoading ? "Loading..." : "Load earlier messages"}
                        </Button>
                      </div>
                    )}
                    
                    {messages.map((message, index) => (
                      <div
                        key={message.id || index}
                        className={`flex ${message.is_user ? "justify-end" : "justify-start"}`}
                      >
                        {!message.is_user && (
                          <Avatar className="h-8 w-8 mr-2 bg-cap-teal/10 text-cap-teal hidden sm:flex">
                            <Bot className="h-4 w-4" />
                          </Avatar>
                        )}
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.is_user
                              ? isDarkMode 
                                ? "bg-blue-700 text-white" 
                                : "bg-blue-500 text-white"
                              : isDarkMode 
                                ? "bg-gray-700 text-white" 
                                : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                          <div className="text-xs opacity-60 text-right mt-1">
                            {new Date(message.created_at).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <Avatar className="h-8 w-8 mr-2 bg-cap-teal/10 text-cap-teal hidden sm:flex">
                          <Bot className="h-4 w-4" />
                        </Avatar>
                        <div className={`max-w-[80%] rounded-lg p-3 ${
                          isDarkMode ? "bg-gray-700" : "bg-gray-100"
                        }`}>
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0s" }}></div>
                            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                )}
                
                {showScrollTop && (
                  <Button 
                    className="fixed bottom-20 right-4 rounded-full h-10 w-10 bg-cap-teal hover:bg-cap-teal/90 text-white"
                    onClick={scrollToTop}
                  >
                    <ArrowUp className="h-5 w-5" />
                  </Button>
                )}
              </div>

              {/* Chat input */}
              <form onSubmit={handleSubmit} className="p-3 border-t flex items-center gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask Thandi a question..."
                  className="flex-1"
                  autoFocus
                  disabled={isSending}
                />
                <Button type="submit" size="icon" disabled={isSending || !inputValue.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </SheetContent>
        </Sheet>

        {/* Chat toggle button */}
        <Button
          onClick={toggleChat}
          size="lg"
          className={`rounded-full h-14 w-14 shadow-lg flex items-center justify-center ${
            isDarkMode ? "bg-cap-teal hover:bg-cap-teal/90" : "bg-cap-teal text-white hover:bg-cap-teal/90"
          }`}
        >
          <MessageCircle className="h-6 w-6" />
          {hasNewMessage && (
            <Badge className="absolute -top-1 -right-1 bg-red-500 h-5 w-5 p-0 flex items-center justify-center">
              <span className="sr-only">New message</span>
              <span>•</span>
            </Badge>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`mb-2 w-80 sm:w-96 rounded-lg shadow-lg overflow-hidden ${
              isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
            }`}
            style={{ height: "500px" }}
          >
            {/* Chat header */}
            <div className={`p-3 flex justify-between items-center border-b ${
              isDarkMode ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-cap-teal text-white"
            }`}>
              <div className="flex items-center">
                <Avatar className="h-8 w-8 mr-2 bg-white text-cap-teal">
                  <Bot className="h-4 w-4" />
                </Avatar>
                <div>
                  <h3 className="font-medium text-sm">Thandi</h3>
                  <p className="text-xs opacity-70">Application Assistant</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={toggleChat} className="text-current">
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Chat messages */}
            <div 
              className="h-[400px] p-4 overflow-y-auto" 
              ref={chatContainerRef} 
              onScroll={() => {
                handleScroll();
                handleScrollToTop();
              }}
            >
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-4">
                  <Bot className="h-12 w-12 mb-3 text-cap-teal" />
                  <h3 className="font-medium mb-2">Welcome to Thandi</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                    I'm your application assistant. You can ask me anything about your application or financial aid.
                  </p>
                  {renderQuickReplies()}
                </div>
              ) : (
                <div className="space-y-4">
                  {hasMoreMessages && (
                    <div className="flex justify-center">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={loadMoreMessages}
                        disabled={isLoading}
                        className="text-xs"
                      >
                        {isLoading ? "Loading..." : "Load earlier messages"}
                      </Button>
                    </div>
                  )}
                  
                  {messages.map((message, index) => (
                    <div
                      key={message.id || index}
                      className={`flex ${message.is_user ? "justify-end" : "justify-start"}`}
                    >
                      {!message.is_user && (
                        <Avatar className="h-8 w-8 mr-2 bg-cap-teal/10 text-cap-teal hidden sm:flex">
                          <Bot className="h-4 w-4" />
                        </Avatar>
                      )}
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.is_user
                            ? isDarkMode 
                              ? "bg-blue-700 text-white" 
                              : "bg-blue-500 text-white"
                            : isDarkMode 
                              ? "bg-gray-700 text-white" 
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                        <div className="text-xs opacity-60 text-right mt-1">
                          {new Date(message.created_at).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <Avatar className="h-8 w-8 mr-2 bg-cap-teal/10 text-cap-teal hidden sm:flex">
                        <Bot className="h-4 w-4" />
                      </Avatar>
                      <div className={`max-w-[80%] rounded-lg p-3 ${
                        isDarkMode ? "bg-gray-700" : "bg-gray-100"
                      }`}>
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0s" }}></div>
                          <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                          <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
              
              {showScrollTop && (
                <Button 
                  className="fixed bottom-20 right-4 rounded-full h-10 w-10 bg-cap-teal hover:bg-cap-teal/90 text-white"
                  onClick={scrollToTop}
                >
                  <ArrowUp className="h-5 w-5" />
                </Button>
              )}
            </div>

            {/* Chat input */}
            <form onSubmit={handleSubmit} className="p-3 border-t flex items-center gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask Thandi a question..."
                className="flex-1"
                autoFocus
                disabled={isSending}
              />
              <Button type="submit" size="icon" disabled={isSending || !inputValue.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat toggle button */}
      <Button
        onClick={toggleChat}
        size="lg"
        className={`rounded-full h-14 w-14 shadow-lg flex items-center justify-center ${
          isDarkMode ? "bg-cap-teal hover:bg-cap-teal/90" : "bg-cap-teal text-white hover:bg-cap-teal/90"
        }`}
      >
        {isOpen ? (
          <ChevronDown className="h-6 w-6" />
        ) : (
          <>
            <MessageCircle className="h-6 w-6" />
            {hasNewMessage && (
              <Badge className="absolute -top-1 -right-1 bg-red-500 h-5 w-5 p-0 flex items-center justify-center">
                <span className="sr-only">New message</span>
                <span>•</span>
              </Badge>
            )}
          </>
        )}
      </Button>
    </div>
  );
};
