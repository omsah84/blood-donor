'use client';
import React, { useState, useEffect, useRef } from 'react';
import { FaComments, FaRobot, FaUser, FaTimes } from 'react-icons/fa';
import axios from 'axios';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'bot', text: 'Hi! How can I help you today?' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const toggleChat = () => setIsOpen(!isOpen);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, loading, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);

    const messageToSend = input;
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post('http://127.0.0.1:5000/chatbot', {
        message: messageToSend,
      });

      const botText = response?.data?.response ?? 'No response from server.';
      const botReply: Message = { sender: 'bot', text: botText };

      setMessages(prev => [...prev, botReply]);
    } catch (error) {
      console.error('API Error:', error);
      setMessages(prev => [
        ...prev,
        { sender: 'bot', text: 'Oops! Something went wrong with the server.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen ? (
        <button
          onClick={toggleChat}
          className="bg-white text-black p-4 rounded-full shadow-lg hover:bg-gray-200 transition"
        >
          <FaComments size={24} />
        </button>
      ) : (
        <div className="w-80 h-[500px] bg-white rounded-lg shadow-xl flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center bg-black text-white p-4 rounded-t-lg">
            <span className="font-bold">ChatBot</span>
            <button onClick={toggleChat}>
              <FaTimes />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`flex items-end space-x-2 ${
                    msg.sender === 'user' ? 'flex-row-reverse' : ''
                  }`}
                >
                  <div className="bg-white p-1 rounded-full shadow">
                    {msg.sender === 'bot' ? (
                      <FaRobot className="text-gray-600" />
                    ) : (
                      <FaUser className="text-black" />
                    )}
                  </div>
                  <div
                    className={`px-3 py-2 rounded-lg text-sm ${
                      msg.sender === 'user'
                        ? 'bg-black text-white'
                        : 'bg-gray-200 text-black'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="flex items-end space-x-2">
                  <div className="bg-white p-1 rounded-full shadow">
                    <FaRobot className="text-gray-600" />
                  </div>
                  <div className="px-3 py-2 rounded-lg text-sm bg-gray-200 text-black animate-pulse">
                    Typing...
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-300 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none"
              placeholder="Type your message..."
            />
            <button
              onClick={handleSend}
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
              disabled={loading}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
