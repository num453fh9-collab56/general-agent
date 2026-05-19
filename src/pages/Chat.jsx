import { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Trash2, Plus, Download, User, Bot, Menu, X, ChevronLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { v4 as uuidv4 } from 'uuid';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

const Chat = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef(null);

  const createNewConversation = useCallback(() => {
    const newId = uuidv4();
    const newConv = {
      id: newId,
      title: 'New Conversation',
      messages: [],
      timestamp: Date.now(),
    };
    setConversations(prev => [newConv, ...prev]);
    setActiveId(newId);
  }, []);

  // Initialize conversations from local storage
  useEffect(() => {
    const saved = localStorage.getItem(`conversations_${user?.id}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      setConversations(parsed);
      if (parsed.length > 0) setActiveId(parsed[0].id);
    } else {
      createNewConversation();
    }
  }, [user, createNewConversation]);

  // Save conversations to local storage
  useEffect(() => {
    if (user?.id && conversations.length > 0) {
      localStorage.setItem(`conversations_${user.id}`, JSON.stringify(conversations));
    }
  }, [conversations, user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [conversations, activeId]);

  const deleteConversation = (id, e) => {
    e.stopPropagation();
    const updated = conversations.filter(c => c.id !== id);
    setConversations(updated);
    if (activeId === id) {
      setActiveId(updated[0]?.id || null);
    }
    if (updated.length === 0) createNewConversation();
  };

  const exportChat = (id) => {
    const conv = conversations.find(c => c.id === id);
    if (!conv) return;
    const content = conv.messages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-export-${id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    const updatedConversations = conversations.map(c => {
      if (c.id === activeId) {
        const newMessages = [...c.messages, userMessage];
        return {
          ...c,
          messages: newMessages,
          title: c.messages.length === 0 ? currentInput.substring(0, 30) : c.title
        };
      }
      return c;
    });

    setConversations(updatedConversations);

    try {
      console.log('Sending request to Groq API...');
      const apiKey = import.meta.env.VITE_GROQ_API_KEY;
      console.log('API Key exists:', !!apiKey);

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: updatedConversations.find(c => c.id === activeId).messages
        })
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.error?.message || `HTTP error! status: ${response.status}`);
      }

      const botMessage = {
        role: 'assistant',
        content: data.choices[0].message.content
      };

      setConversations(prev => prev.map(c =>
        c.id === activeId ? { ...c, messages: [...c.messages, botMessage] } : c
      ));
    } catch (error) {
      console.error('Groq API Error:', error);
      const errorMessage = { role: 'assistant', content: `Sorry, I encountered an error: ${error.message}` };
      setConversations(prev => prev.map(c =>
        c.id === activeId ? { ...c, messages: [...c.messages, errorMessage] } : c
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const activeConv = conversations.find(c => c.id === activeId);

  return (
    <div className="flex h-screen pt-16 bg-white dark:bg-gray-900 overflow-hidden text-zinc-900 dark:text-zinc-100">
      {/* Sidebar */}
      <div className={`fixed inset-y-16 left-0 z-40 w-72 bg-gray-50 dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 transition-transform duration-300 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}>
        <div className="flex flex-col h-full p-4">
          <button
            onClick={createNewConversation}
            className="flex items-center gap-2 w-full p-3 mb-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all"
          >
            <Plus size={20} />
            New Chat
          </button>

          <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar">
            {conversations.map(conv => (
              <div
                key={conv.id}
                onClick={() => setActiveId(conv.id)}
                className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${activeId === conv.id ? 'bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <Bot size={18} className={activeId === conv.id ? 'text-indigo-600' : 'text-gray-400'} />
                  <span className="text-sm font-medium truncate">{conv.title}</span>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={(e) => { e.stopPropagation(); exportChat(conv.id); }} className="p-1 hover:text-indigo-600">
                    <Download size={14} />
                  </button>
                  <button onClick={(e) => deleteConversation(conv.id, e)} className="p-1 hover:text-red-600">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute top-4 left-4 z-30 p-2 md:hidden bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
          {activeConv?.messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-3xl flex items-center justify-center text-indigo-600 mb-6">
                <Bot size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-2">How can I help you today?</h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-sm">
                Ask me anything. I'm powered by Groq and ready to assist you with coding, writing, or brainstorming.
              </p>
            </div>
          ) : (
            activeConv?.messages.map((msg, i) => (
              <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-800 dark:text-indigo-400'}`}>
                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div className={`p-4 rounded-2xl ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-gray-100 dark:bg-gray-800 rounded-tl-none'}`}>
                    <div
                      className="prose dark:prose-invert max-w-none text-sm leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(marked(msg.content)) }}
                    />
                  </div>
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                <Bot size={16} className="text-indigo-600 animate-pulse" />
              </div>
              <div className="flex gap-1 items-center px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-none">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
          <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Send a message..."
              className="w-full pl-6 pr-14 py-4 bg-gray-100 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 dark:text-white transition-all shadow-inner"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-all"
            >
              <Send size={20} />
            </button>
          </form>
          <p className="text-center text-[10px] text-gray-400 mt-3">
            GroqAI can make mistakes. Check important info.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Chat;
