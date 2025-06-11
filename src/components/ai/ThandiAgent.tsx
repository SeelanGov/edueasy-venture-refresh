
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Bot, HelpCircle, Send, Sparkles, User, Crown, Zap } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { getThandiCapabilities, SubscriptionTierName } from '@/types/SubscriptionTypes';
import { Link } from 'react-router-dom';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface ThandiAgentProps {}

export const ThandiAgent = ({}: ThandiAgentProps) => {
  const { user } = useAuth();
  const { userSubscription } = useSubscription();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi! I'm Thandi, your AI assistant. I'm here to help you with your university applications. How can I assist you today?",
      role: 'assistant',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Determine current tier and capabilities
  const currentTier = userSubscription?.tier?.name as SubscriptionTierName || SubscriptionTierName.STARTER;
  const thandiCapabilities = getThandiCapabilities(currentTier);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Simulate AI response based on tier
    setTimeout(() => {
      let response = '';
      
      if (thandiCapabilities.tier === 'basic') {
        response = `I understand you're asking about "${inputMessage}". As a Starter user, I can help with basic questions about applications and general guidance. For more detailed help, consider upgrading to Essential or Pro + AI!`;
      } else if (thandiCapabilities.tier === 'guidance') {
        response = `Great question about "${inputMessage}"! With your Essential plan, I can provide detailed guidance on applications, deadlines, and document management. Let me help you with that...`;
      } else {
        response = `Excellent question about "${inputMessage}"! With your Pro + AI plan, I can provide comprehensive career counseling and personalized recommendations. Let me create a detailed response for you...`;
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const getTierIcon = () => {
    switch (thandiCapabilities.tier) {
      case 'basic': return <HelpCircle className="h-4 w-4" />;
      case 'guidance': return <Zap className="h-4 w-4" />;
      case 'advanced': return <Crown className="h-4 w-4" />;
      default: return <HelpCircle className="h-4 w-4" />;
    }
  };

  const getTierColor = () => {
    switch (thandiCapabilities.tier) {
      case 'basic': return 'bg-gray-100 text-gray-700';
      case 'guidance': return 'bg-blue-100 text-blue-700';
      case 'advanced': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const quickActions = thandiCapabilities.features.slice(0, 4);

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
          Current capabilities: {thandiCapabilities.features.join(', ')}
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

        {thandiCapabilities.tier !== 'advanced' && (
          <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-800">
                  Want more from Thandi?
                </p>
                <p className="text-xs text-gray-600">
                  Upgrade for {thandiCapabilities.tier === 'basic' ? 'detailed guidance' : 'advanced career counseling'}
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
            {quickActions.map((action) => (
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
