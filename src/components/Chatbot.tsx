'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Send, MessageCircle, Loader2, Briefcase, Code, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  suggestions?: string[];
}

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Chatbot({ isOpen, onClose }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi there! 👋 I'm Ronit's AI assistant. I can help you learn about his geospatial expertise, software engineering skills, projects, and professional background. What would you like to know?",
      isBot: true,
      timestamp: new Date(),
      // No suggestions for initial message
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const quickActions = [
    {
      icon: Briefcase,
      text: "Tell me about Ronit's current role",
      message: "What is Ronit's current role and company?",
    },
    {
      icon: Code,
      text: 'What technologies does he use?',
      message: 'What technologies and tools does Ronit work with?',
    },
    {
      icon: MapPin,
      text: 'Show me his projects',
      message: 'What notable projects has Ronit worked on?',
    },
  ];

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      // Use scrollTop instead of scrollIntoView to prevent page scroll
      const container = messagesEndRef.current.parentElement;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }
  };

  // Only scroll when user sends a message or when chat opens, not when bot responds
  useEffect(() => {
    if (isOpen && messages.length === 1) {
      // Only scroll on initial open
      scrollToBottom();
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputMessage.trim();
    if (!textToSend || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: textToSend,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setShowQuickActions(false); // Hide quick actions after first message

    // Scroll to bottom when user sends a message
    setTimeout(() => scrollToBottom(), 100);

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: textToSend }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 429) {
          throw new Error('Too many requests. Please wait a moment before trying again.');
        }
        throw new Error(errorData.error || 'Failed to get response');
      }

      const data = await response.json();

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response || data.error,
        isBot: true,
        timestamp: new Date(),
        suggestions: data.suggestions,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text:
          error instanceof Error
            ? error.message
            : "Sorry, I'm having trouble responding right now. Please try again in a moment!",
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="bg-white dark:bg-darkBg border-2 border-black dark:border-white shadow-light dark:shadow-dark rounded-lg flex flex-col animate-in slide-in-from-bottom-4 duration-300 h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b-2 border-black dark:border-white bg-purple-300 rounded-t-base">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-black" />
          <h3 className="font-heading text-lg text-black font-bold">Ask Ronit AI</h3>
        </div>
        <Button variant="neutral" size="icon" onClick={onClose} className="w-8 h-8">
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 overscroll-contain">
        {messages.map((message, index) => (
          <div key={message.id}>
            <div className={cn('flex', message.isBot ? 'justify-start' : 'justify-end')}>
              <div
                className={cn(
                  'max-w-[80%] p-3 border-2 border-black dark:border-white rounded-base animate-in slide-in-from-bottom-2 duration-300',
                  message.isBot
                    ? 'bg-white dark:bg-secondaryBlack text-black dark:text-darkText shadow-light dark:shadow-dark'
                    : 'bg-purple-300 text-black shadow-light dark:shadow-dark',
                )}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                <span className="text-xs opacity-60 mt-1 block">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>

            {/* Suggestion Buttons for Bot Messages */}
            {message.isBot &&
              message.suggestions &&
              message.suggestions.length > 0 &&
              index === messages.length - 1 &&
              index > 0 && (
                <div className="mt-3 space-y-2 animate-in fade-in duration-500 delay-300">
                  <p className="text-xs opacity-70 mb-2">💡 You might also want to ask:</p>
                  <div className="flex flex-wrap gap-2">
                    {message.suggestions.map((suggestion, suggestionIndex) => (
                      <button
                        key={suggestionIndex}
                        onClick={() => handleSendMessage(suggestion)}
                        disabled={isLoading}
                        className="text-xs px-3 py-2 bg-white dark:bg-secondaryBlack border-2 border-black dark:border-white rounded-base hover:bg-purple-300 hover:shadow-light dark:hover:shadow-dark transition-all duration-200 disabled:opacity-50 text-left"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
          </div>
        ))}

        {/* Quick Action Buttons */}
        {showQuickActions && messages.length === 1 && (
          <div className="space-y-2 animate-in fade-in duration-500 delay-300">
            <p className="text-xs text-center opacity-70 mb-3">Quick questions you can ask:</p>
            <div className="grid grid-cols-1 gap-2">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleSendMessage(action.message)}
                  disabled={isLoading}
                  className="flex items-center gap-2 p-2 text-left text-sm bg-white dark:bg-secondaryBlack border-2 border-black dark:border-white rounded-base hover:bg-purple-300 hover:shadow-light dark:hover:shadow-dark transition-all duration-200 disabled:opacity-50"
                >
                  <action.icon className="w-4 h-4 flex-shrink-0 text-black dark:text-darkText" />
                  <span className="text-xs">{action.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-secondaryBlack text-black dark:text-darkText p-3 border-2 border-black dark:border-white rounded-base shadow-light dark:shadow-dark animate-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Thinking...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t-2 border-black dark:border-white">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me about Ronit..."
            disabled={isLoading}
            className="flex-1 p-3 border-2 border-black dark:border-white rounded-base bg-white dark:bg-secondaryBlack text-black dark:text-darkText focus:outline-none focus:ring-2 focus:ring-purple-300 disabled:opacity-50"
          />
          <Button
            onClick={() => handleSendMessage()}
            disabled={!inputMessage.trim() || isLoading}
            size="icon"
            className="w-12 h-12 bg-purple-300 hover:bg-purple-400 border-2 border-black dark:border-white"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
