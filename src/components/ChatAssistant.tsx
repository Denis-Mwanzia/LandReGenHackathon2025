import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, X } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
};

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm Kitui AI, your reforestation assistant. I can help you with tree species recommendations, planting techniques, soil analysis, and project planning for Kitui County. What would you like to know?",
      sender: 'assistant',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      if (!import.meta.env.VITE_GEMINI_API_KEY) {
        throw new Error('Gemini API key not configured');
      }

      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

      const prompt = `
        You are Kitui AI, a specialized assistant for reforestation and land restoration in Kitui County, Kenya. 
        
        Your expertise includes:
        - Native tree species suitable for arid and semi-arid regions
        - Soil types and conditions in Kitui County
        - Drought-resistant planting techniques
        - Water conservation strategies
        - Community-based reforestation approaches
        - Climate adaptation for smallholder farmers
        
        Context about Kitui County:
        - Semi-arid climate with 400-800mm annual rainfall
        - Common soil types: red sandy loam, clay loam, sandy clay
        - Common tree species: Acacia tortilis, Melia volkensii, Terminalia brownii, Azadirachta indica
        - Main challenges: drought, soil erosion, deforestation, overgrazing
        
        Respond to the user's question in a helpful, knowledgeable, and encouraging tone. 
        Keep responses concise but informative (2-3 paragraphs max).
        Focus on practical, actionable advice for local communities.
        
        User question: ${userMessage.text}
      `;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'assistant',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error generating response:', error);

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I'm having trouble connecting right now. Please try again later or check if you have a stable internet connection. For immediate help, you can also check the AI Recommendations section for tree species suggestions.",
        sender: 'assistant',
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
      sendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-3 sm:p-4 rounded-full shadow-xl hover:from-emerald-700 hover:to-teal-700 transition-all transform hover:scale-105 touch-manipulation"
          title="Open Kitui AI Chat Assistant"
        >
          <Bot size={20} className="sm:w-6 sm:h-6" />
        </button>
        <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center">
          AI
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-80 sm:w-96 h-[500px] sm:h-[600px] bg-white rounded-xl shadow-2xl border border-slate-200 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-4 rounded-t-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bot size={24} />
          <div>
            <h3 className="font-bold">Ask Kitui AI</h3>
            <p className="text-xs text-emerald-100">
              Your reforestation assistant
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-emerald-100 hover:text-white transition-colors"
          title="Close Chat Assistant"
        >
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${
              message.sender === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-emerald-600 text-white'
              }`}
            >
              {message.sender === 'user' ? (
                <User size={16} />
              ) : (
                <Bot size={16} />
              )}
            </div>
            <div
              className={`max-w-[80%] ${
                message.sender === 'user' ? 'text-right' : ''
              }`}
            >
              <div
                className={`p-3 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-800'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
              </div>
              <div className="text-xs text-slate-500 mt-1">
                {formatTime(message.timestamp)}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center">
              <Bot size={16} />
            </div>
            <div className="bg-slate-100 p-3 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                  style={{ animationDelay: '0.1s' }}
                ></div>
                <div
                  className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                  style={{ animationDelay: '0.2s' }}
                ></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about tree species, planting techniques, soil conditions..."
            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={!inputText.trim() || isLoading}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-2 rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            title="Send Message"
          >
            <Send size={16} />
          </button>
        </div>
        <div className="text-xs text-slate-500 mt-2">
          Try asking: "Which species thrives in Mutitu with clay soil?" or "How
          to improve survival rates in dry conditions?"
        </div>
      </div>
    </div>
  );
}
