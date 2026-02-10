import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, RotateCcw, Send, ThumbsUp, ThumbsDown, Bot, BotMessageSquare } from 'lucide-react';
import chatbotService from '../../services/chatbotService';
import toast from 'react-hot-toast';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      id: Date.now(),
      text: "👋 Welcome to SafeLanka Emergency Assistant! I can help you with:\n\n• Current alerts in your area\n• Safety information\n• Evacuation guidance\n• Emergency resources\n\nHow can I assist you today?", 
      sender: 'bot' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  
  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { 
      id: Date.now(),
      text: input, 
      sender: 'user' 
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const result = await chatbotService.sendMessage(userMsg.text);
      
      if (result.success) {
        const botMsg = { 
          id: Date.now() + 1,
          text: result.data.reply, 
          sender: 'bot',
          metadata: result.data.metadata 
        };
        setMessages(prev => [...prev, botMsg]);
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      const errorMsg = { 
        id: Date.now() + 1,
        text: "⚠️ I'm having trouble connecting right now. Please try again in a moment.", 
        sender: 'bot',
        error: true
      };
      setMessages(prev => [...prev, errorMsg]);
      toast.error('Failed to send message');
    } finally {
      setIsTyping(false);
    }
  };

  const handleReset = async () => {
    setMessages([
      { 
        id: Date.now(),
        text: "👋 Chat reset! How can I help you?", 
        sender: 'bot' 
      }
    ]);
  };


  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-110 md:w-96 h-150 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100 transition-all duration-300 ease-in-out">
          {/* Header */}
          <div className="p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full">
                <Bot size={24} className="text-teal-600" />
              </div>
              <div>
                <span className="font-bold text-xl block">SafeLanka Bot</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={handleReset}
                className="hover:bg-white/20 p-2 text-teal-600 rounded-lg transition-colors"
                title="Reset chat"
              >
                <RotateCcw size={18} />
              </button>
              <button 
                onClick={() => setIsOpen(false)} 
                className="hover:bg-white/20 p-2 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                {msg.sender === 'bot' && (
                  <div className="w-9 h-9 bg-teal-500 rounded-full flex items-center justify-center text-white text-xs font-semibold shrink-0">
                    <Bot size={20} className="text-white" />
                  </div>
                )}
                <div className="flex flex-col gap-1 max-w-[85%]">
                  <div 
                    className={`p-3 rounded-2xl shadow-sm text-sm whitespace-pre-line ${
                      msg.sender === 'user' 
                        ? 'bg-teal-500 text-white rounded-tr-none' 
                        : msg.error
                        ? 'bg-red-50 text-red-700 rounded-tl-none border border-red-200'
                        : 'bg-white text-gray-700 rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                    {msg.metadata && (
                      <div className="mt-2 pt-2 border-t border-gray-200 text-xs text-gray-500">
                        ✓ Checked {msg.metadata.alertsChecked} alerts
                        {msg.metadata.criticalCount > 0 && (
                          <span className="ml-2 text-red-600 font-semibold">
                            • {msg.metadata.criticalCount} Critical
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  
                </div>
                {msg.sender === 'user' && (
                  <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-white text-xs font-semibold shrink-0">
                    U
                  </div>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-2">
                <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                  AI
                </div>
                <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-4 bg-white">
            <div className="relative flex items-center">
              <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about alerts, safety..." 
                className="w-2xl bg-gray-100 border-none rounded-full py-3 px-5 pr-12 text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                disabled={isTyping}
              />
              <button 
                type="submit"
                disabled={!input.trim() || isTyping}
                className="absolute right-2 p-2 text-gray-800 hover:bg-teal-50 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={18} />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${
          isOpen ? 'bg-gray-800' : 'bg-linear-to-br from-teal-500 to-teal-600'
        } p-4 rounded-full text-white shadow-xl hover:scale-110 transition-all duration-200 active:scale-95 relative`}
      >
        {isOpen ? <X size={28} /> : <Bot size={32} />}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
        )}
      </button>
    </div>
  );
};

export default Chatbot;