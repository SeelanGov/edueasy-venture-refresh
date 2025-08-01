import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Crown, HelpCircle, Send, Sparkles, User, Zap } from '@/components/ui/icons';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { supabase } from '@/integrations/supabase/client';
import { getThandiCapabilities, SubscriptionTierName } from '@/types/SubscriptionTypes';
import { useState } from 'react';
import { Link } from 'react-router-dom';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

/**
 * ThandiAgent
 * @description Function
 */
export const ThandiAgent = (): JSX.Element => {
  const { user } = useAuth();
  const subscriptionData = useSubscription();
  const userSubscription = subscriptionData?.currentSubscription;
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content:
        "Hi! I'm Thandi, your AI assistant. I'm here to help you with your university applications. How can I assist you today?",
      role: 'assistant',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Determine current tier and capabilities
  const currentTier =
    (userSubscription?.tier?.name as SubscriptionTierName) || SubscriptionTierName.STARTER;
  const thandiCapabilities = getThandiCapabilities(currentTier);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !user) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    try {
      // Get current session for auth token
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session?.access_token) {
        throw new Error('Please log in to use Thandi AI');
      }

      // Try calling the edge function first
      const edgeResponse = await fetch(
        `https://pensvamtfjtpsaoeflex.supabase.co/functions/v1/thandi-openai`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: currentInput }),
        },
      );

      let responseText = '';

      if (edgeResponse.status === 429) {
        // Rate limit exceeded - try fallback to direct OpenAI call
        const fallbackApiKey = import.meta.env.VITE_OPENAI_API_KEY_FALLBACK;

        if (fallbackApiKey) {
          const fallbackResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${fallbackApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'gpt-3.5-turbo',
              messages: [
                {
                  role: 'system',
                  content:
                    'You are Thandi, a helpful AI assistant for EduEasy, specializing in South African university applications. You help students with application guidance, document requirements, and general education advice. Keep responses concise and helpful.',
                },
                {
                  role: 'user',
                  content: currentInput,
                },
              ],
              temperature: 0.7,
              max_tokens: 500,
            }),
          });

          if (fallbackResponse.ok) {
            const fallbackData = await fallbackResponse.json();
            responseText = fallbackData.choices[0].message.content;

            toast({
              title: 'Rate Limit Reached',
              description: "You've reached your daily limit. Using fallback AI for this response.",
              variant: 'destructive',
            });
          } else {
            throw new Error('Fallback AI also unavailable');
          }
        } else {
          toast({
            title: 'Daily Limit Reached',
            description:
              "You've used all 5 daily queries. Please try again tomorrow or upgrade your plan.",
            variant: 'destructive',
          });
          responseText =
            "I'm sorry, but you've reached your daily limit of 5 questions. Please try again tomorrow or consider upgrading to a premium plan for unlimited access.";
        }
      } else if (edgeResponse.ok) {
        // Success from edge function
        const data = await edgeResponse.json();
        responseText = data.content;

        if (data.queries_remaining !== undefined) {
          if (data.queries_remaining <= 1) {
            toast({
              title: 'Almost at daily limit',
              description: `Only ${data.queries_remaining} queries remaining today.`,
            });
          }
        }
      } else {
        // Other error from edge function
        const errorData = await edgeResponse.json();
        throw new Error(errorData.message || 'Failed to get response from AI');
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: responseText,
        role: 'assistant',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: unknown) {
      console.error('Error calling Thandi AI:', error);

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `Sorry, I'm having trouble responding right now. ${(error as Error)?.message || 'Please try again later.'}`,
        role: 'assistant',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);

        toast({
          title: 'Error',
          description: (error as Error).message || 'Failed to get AI response',
          variant: 'destructive',
        });
    } finally {
      setIsLoading(false);
    }
  };

  const getTierIcon = (): JSX.Element => {
    switch (subscriptionData?.currentSubscription?.tier?.name || 'basic') {
      case 'basic':
        return <HelpCircle className="h-4 w-4" />;
      case 'guidance':
        return <Zap className="h-4 w-4" />;
      case 'advanced':
        return <Crown className="h-4 w-4" />;
      default:
        return <HelpCircle className="h-4 w-4" />;
    }
  };

  const getTierColor = (): string => {
    switch (subscriptionData?.currentSubscription?.tier?.name || 'basic') {
      case 'basic':
        return 'bg-gray-100 text-gray-700';
      case 'guidance':
        return 'bg-blue-100 text-blue-700';
      case 'advanced':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const quickActions = thandiCapabilities?.features?.slice(0, 4) || [];

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-cap-teal" />
          Thandi AI Assistant
          <Badge variant="outline" className={`ml-auto ${getTierColor()}`}>
            {getTierIcon()}
            {currentTier}
          </Badge>
        </CardTitle>

        <div className="text-xs text-gray-600">
          Current capabilities: {thandiCapabilities?.features?.join(', ') || 'Basic features'}
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-cap-teal flex items-center justify-center">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                </div>
              )}

              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === 'user' ? 'bg-cap-teal text-white' : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-xs mt-1 opacity-70">{message.timestamp.toLocaleTimeString()}</p>
              </div>

              {message.role === 'user' && (
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                    <User className="h-4 w-4 text-gray-600" />
                  </div>
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-cap-teal flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" />
                </div>
              </div>
              <div className="bg-gray-100 rounded-lg p-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: '0.1s' }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: '0.2s' }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>

        <Separator className="mb-4" />

        {(subscriptionData?.currentSubscription?.tier?.name || 'basic') !== 'advanced' && (
          <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-800">Want more from Thandi?</p>
                <p className="text-xs text-gray-600">
                  Upgrade for{' '}
                  {(subscriptionData?.currentSubscription?.tier?.name || 'basic') === 'basic'
                    ? 'detailed guidance'
                    : 'advanced career counseling'}
                </p>
              </div>
              <Link to="/pricing">
                <Button size="sm" variant="outline" className="text-xs">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Upgrade
                </Button>
              </Link>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action: string) => (
              <Button
                key={action}
                variant="outline"
                size="sm"
                onClick={() => setInputMessage(action)}
                className="text-xs"
              >
                <HelpCircle className="h-3 w-3 mr-1" />
                {action}
              </Button>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask me anything about your application..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              size="sm"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
