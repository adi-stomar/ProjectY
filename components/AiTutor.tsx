'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MathRenderer } from './MathRenderer';
import { Send, Image as ImageIcon, X, Sparkles, HelpCircle, Zap, Loader2, Plus, MessageSquare, Trash2, History } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text?: string;
  image?: string;
  timestamp: Date | string;
}

interface ChatSession {
  id: string;
  updated_at: string;
  messages_json: Message[];
}

export const AiTutor: React.FC = () => {
  const defaultWelcomeMsg: Message = {
    id: 'welcome',
    sender: 'bot',
    text: "👋 **Hello! I am your AI JEE Tutor.**\n\nAsk me any doubt in Physics, Chemistry, or Mathematics. You can type, **upload a photo** of your question, or press `Ctrl + V` to paste a screenshot!",
    timestamp: new Date().toISOString(),
  };

  const [messages, setMessages] = useState<Message[]>([defaultWelcomeMsg]);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'solution' | 'socratic' | 'shortcut'>('solution');
  const [attachedImageBase64, setAttachedImageBase64] = useState<string | null>(null);
  const [attachedImageMime, setAttachedImageMime] = useState<string | null>(null);
  const [attachedPreview, setAttachedPreview] = useState<string | null>(null);

  const [user, setUser] = useState<any>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  // Load User & Sessions
  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        fetchSessions(user.id);
      }
    };
    init();
  }, [supabase]);

  const fetchSessions = async (userId: string) => {
    const { data, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });
      
    if (!error && data) {
      setSessions(data);
    }
  };

  const handleNewChat = () => {
    setMessages([defaultWelcomeMsg]);
    setActiveSessionId(null);
    setInput('');
    removeImage();
  };

  const loadSession = (session: ChatSession) => {
    setActiveSessionId(session.id);
    setMessages(session.messages_json);
  };

  const handleDeleteSession = async (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    
    // Optimistic UI update
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    if (activeSessionId === sessionId) {
      handleNewChat();
    }

    try {
      const { error } = await supabase
        .from('chat_sessions')
        .delete()
        .eq('id', sessionId);

      if (error) {
        console.error('Failed to delete chat session:', error);
        if (user) fetchSessions(user.id);
      }
    } catch (err) {
      console.error('Error deleting chat session:', err);
      if (user) fetchSessions(user.id);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Handle Ctrl+V paste
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile();
          if (blob) processFile(blob);
          break;
        }
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setAttachedPreview(dataUrl);
      setAttachedImageMime(file.type || 'image/jpeg');
      setAttachedImageBase64(dataUrl.split(',')[1]);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setAttachedImageBase64(null);
    setAttachedImageMime(null);
    setAttachedPreview(null);
  };

  const updateSessionInDb = async (newMessages: Message[], sessionId: string | null) => {
    if (!user) return sessionId;
    
    if (!sessionId) {
      // Create new session
      const { data, error } = await supabase
        .from('chat_sessions')
        .insert({ user_id: user.id, messages_json: newMessages })
        .select()
        .single();
      
      if (!error && data) {
        fetchSessions(user.id);
        return data.id;
      }
    } else {
      // Update existing session
      const { error } = await supabase
        .from('chat_sessions')
        .update({ messages_json: newMessages, updated_at: new Date().toISOString() })
        .eq('id', sessionId);
      
      if (!error) fetchSessions(user.id);
    }
    return sessionId;
  };

  const handleSend = async () => {
    if (!input.trim() && !attachedImageBase64) return;

    const currentInput = input;
    const currentImgBase64 = attachedImageBase64;
    const currentImgMime = attachedImageMime;
    const currentPreview = attachedPreview;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: currentInput,
      image: currentPreview || undefined,
      timestamp: new Date().toISOString(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    
    // Optimistic DB save
    const newSessionId = await updateSessionInDb(newMessages, activeSessionId);
    if (newSessionId && !activeSessionId) setActiveSessionId(newSessionId);

    setInput('');
    removeImage();
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: currentInput,
          imageBase64: currentImgBase64,
          imageMime: currentImgMime,
          mode,
        }),
      });

      const data = await res.json();
      
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: data.error ? `🚨 **Error:** ${data.error}` : data.answer,
        timestamp: new Date().toISOString(),
      };
      
      const updatedMessages = [...newMessages, botMsg];
      setMessages(updatedMessages);
      await updateSessionInDb(updatedMessages, newSessionId || activeSessionId);

    } catch (err: any) {
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: `🚨 **Connection Error:** Could not connect to AI server.`,
        timestamp: new Date().toISOString(),
      };
      const updatedMessages = [...newMessages, botMsg];
      setMessages(updatedMessages);
      await updateSessionInDb(updatedMessages, newSessionId || activeSessionId);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full bg-transparent overflow-hidden w-full">
      
      {/* Mobile backdrop */}
      {showMobileSidebar && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 md:hidden"
          onClick={() => setShowMobileSidebar(false)}
        />
      )}

      {/* Sidebar for Chat History - Blue Theme */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-blue-950 via-slate-900 to-slate-950 text-slate-200 border-r border-blue-900/60 flex flex-col transition-transform duration-300 md:static md:w-64 md:translate-x-0 shrink-0 h-full ${
        showMobileSidebar ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'
      }`}>
        <div className="p-3.5 border-b border-blue-900/60 flex items-center gap-2 bg-blue-950/50">
          <button
            onClick={() => {
              handleNewChat();
              setShowMobileSidebar(false);
            }}
            className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-md shadow-blue-600/30 transition text-sm border border-blue-400/30"
          >
            <Plus className="w-4 h-4" /> New Chat
          </button>
          <button 
            onClick={() => setShowMobileSidebar(false)}
            className="md:hidden p-2 text-blue-300 hover:text-white rounded-lg hover:bg-blue-900/60 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          <div className="px-2 py-1.5 text-[11px] font-bold text-blue-300/70 uppercase tracking-wider">
            Previous Chats
          </div>
          {sessions.length === 0 ? (
            <div className="px-2 py-4 text-sm text-blue-300/50 text-center">No previous chats</div>
          ) : (
            sessions.map((s) => {
              // Get the first user message text to use as title
              const firstUserMsg = s.messages_json.find(m => m.sender === 'user');
              const title = firstUserMsg?.text ? firstUserMsg.text.slice(0, 30) : 'Image Doubt...';
              
              return (
                <div
                  key={s.id}
                  onClick={() => {
                    loadSession(s);
                    setShowMobileSidebar(false);
                  }}
                  className={`group w-full text-left px-3 py-2 rounded-xl text-sm flex items-center justify-between transition cursor-pointer ${
                    activeSessionId === s.id 
                      ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30 ring-1 ring-blue-400/40' 
                      : 'text-blue-100/80 hover:bg-blue-900/40 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate min-w-0 pr-1">
                    <MessageSquare className="w-4 h-4 shrink-0 opacity-80 text-blue-300" />
                    <span className="truncate">{title}</span>
                  </div>
                  <button
                    onClick={(e) => handleDeleteSession(e, s.id)}
                    title="Delete Chat"
                    className="opacity-70 md:opacity-0 md:group-hover:opacity-100 p-1.5 hover:text-rose-300 hover:bg-rose-500/20 rounded-lg transition text-blue-300/60 shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0 h-full">
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] md:max-w-[75%] rounded-2xl p-4 shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-br-sm'
                    : 'bg-white/95 text-slate-800 rounded-bl-sm border border-slate-200/90 backdrop-blur-xs'
                }`}
              >
                {msg.image && (
                  <img
                    src={msg.image}
                    alt="Question"
                    className="max-h-64 rounded-lg mb-3 object-contain bg-white/20 p-1"
                  />
                )}
                {msg.text && (
                  <MathRenderer
                    content={msg.text}
                    className={msg.sender === 'user' ? 'text-white' : 'text-slate-800'}
                  />
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-white/95 text-slate-600 rounded-2xl rounded-bl-sm p-4 border border-slate-200/90 shadow-sm flex items-center gap-2 backdrop-blur-xs">
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                <span className="text-sm font-medium">Analyzing question & deriving solution...</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Image Preview Bar */}
        {attachedPreview && (
          <div className="px-4 py-2 bg-blue-50/90 border-t border-blue-100 flex items-center gap-3 backdrop-blur-xs">
            <img src={attachedPreview} alt="Preview" className="h-12 w-12 object-cover rounded-lg border border-blue-200" />
            <div className="text-xs text-blue-800 font-medium">Image attached (Ready to analyze)</div>
            <button
              onClick={removeImage}
              className="ml-auto p-1 text-slate-400 hover:text-red-500 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Input Field - Blue Theme */}
        <div className="p-3 md:p-4 border-t border-blue-200/80 bg-blue-50/70 backdrop-blur-md">
          <div className="flex flex-col bg-white p-2.5 md:p-3.5 rounded-2xl border-2 border-blue-200 focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-500/15 shadow-md shadow-blue-900/5 transition">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Type your doubt or paste screenshot (Ctrl+V)..."
              rows={1}
              className="w-full bg-transparent border-none outline-none resize-none text-sm text-slate-800 placeholder:text-slate-400 min-h-[40px] max-h-32 mb-2"
            />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) processFile(file);
                  }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition flex items-center justify-center"
                  title="Attach question image"
                >
                  <ImageIcon className="w-4 h-4" />
                </button>

                <div className="w-px h-4 bg-blue-200 mx-1"></div>

                {/* Mode Switchers */}
                <button
                  onClick={() => setMode('solution')}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition text-xs font-semibold ${
                    mode === 'solution' ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30' : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Solution</span>
                </button>
                <button
                  onClick={() => setMode('socratic')}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition text-xs font-semibold ${
                    mode === 'socratic' ? 'bg-purple-600 text-white shadow-sm shadow-purple-600/30' : 'text-slate-600 hover:text-purple-600 hover:bg-purple-50'
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Hint</span>
                </button>
                <button
                  onClick={() => setMode('shortcut')}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition text-xs font-semibold ${
                    mode === 'shortcut' ? 'bg-amber-600 text-white shadow-sm shadow-amber-600/30' : 'text-slate-600 hover:text-amber-600 hover:bg-amber-50'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" /> <span className="hidden sm:inline">30s Trick</span>
                </button>

                <div className="w-px h-4 bg-blue-200 mx-1 md:hidden"></div>
                
                {/* Mobile History button */}
                <button
                  onClick={() => setShowMobileSidebar(true)}
                  className="md:hidden flex items-center gap-1 px-2.5 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 hover:text-blue-900 hover:bg-blue-100 rounded-lg text-xs font-semibold shadow-xs transition"
                  title="View previous chats"
                >
                  <History className="w-3.5 h-3.5" /> <span className="hidden sm:inline">History</span>
                </button>

                {/* Mobile New Chat button inside input bar */}
                <button
                  onClick={handleNewChat}
                  className="md:hidden flex items-center gap-1 px-2.5 py-1.5 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-xs font-semibold shadow-xs transition"
                  title="Start a new chat session"
                >
                  <Plus className="w-3.5 h-3.5" /> <span className="hidden sm:inline">New Chat</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleSend}
                disabled={(!input.trim() && !attachedImageBase64) || loading}
                className={`p-2.5 rounded-xl text-white font-medium transition shrink-0 ${
                  (!input.trim() && !attachedImageBase64) || loading
                    ? 'bg-blue-300/60 text-white/70 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/30'
                }`}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
