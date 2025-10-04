
import React, { useState, useRef, useEffect } from 'react';
import { getSecurityAdvice } from '../services/geminiService';
import type { ChatMessage } from '../types';
import { CloseIcon } from './icons/CloseIcon';
import { SendIcon } from './icons/SendIcon';

interface SecurityAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SecurityAssistant: React.FC<SecurityAssistantProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '0', role: 'system', text: "Hello! I'm ShieldBot. How can I help you stay secure online today?" },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const modelResponse = await getSecurityAdvice(newMessages);
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: modelResponse,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'system',
        text: 'Sorry, I encountered an error. Please try again.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-2xl h-[80vh] bg-slate-200 dark:bg-slate-800 rounded-2xl shadow-2xl flex flex-col">
        <header className="flex items-center justify-between p-4 border-b border-slate-300 dark:border-slate-700">
          <h3 className="text-xl font-bold">Security Assistant</h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-300 dark:hover:bg-slate-700">
            <CloseIcon />
          </button>
        </header>
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-prose p-3 rounded-lg ${
                    msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-300 dark:bg-slate-700'
                  } ${msg.role === 'system' ? 'bg-transparent dark:bg-transparent text-center w-full text-sm italic' : ''}`}
                >
                  <p className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\* (.*?)(?=\n\* |\n\n|$)/g, '<li>$1</li>').replace(/<\/li>(\n)?/g, '</li>').replace(/<li>/g, '<li class=\"list-disc ml-5\">')}}/>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                  <div className="p-3 rounded-lg bg-slate-300 dark:bg-slate-700">
                      <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 rounded-full bg-slate-500 animate-pulse"></div>
                          <div className="w-2 h-2 rounded-full bg-slate-500 animate-pulse [animation-delay:0.2s]"></div>
                          <div className="w-2 h-2 rounded-full bg-slate-500 animate-pulse [animation-delay:0.4s]"></div>
                      </div>
                  </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
        <form onSubmit={handleSubmit} className="p-4 border-t border-slate-300 dark:border-slate-700">
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about online security..."
              className="w-full bg-slate-100 dark:bg-slate-900 rounded-lg py-2 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-blue-600 text-white disabled:bg-slate-400 dark:disabled:bg-slate-600 hover:bg-blue-700 transition-colors"
            >
              <SendIcon />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
