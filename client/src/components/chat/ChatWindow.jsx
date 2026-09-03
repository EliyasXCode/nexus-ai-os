import React, { useState, useEffect, useRef } from 'react';
import { useOS } from '../../context/OSContext.jsx';
import { chatService } from '../../services/chat.service.js';
import { MessageBubble } from './MessageBubble.jsx';
import { PromptSuggestions } from './PromptSuggestions.jsx';
import { NexusCoreOrb } from '../common/NexusCoreOrb.jsx';
import { 
  Send, 
  Paperclip, 
  Mic, 
  MicOff, 
  Trash2, 
  Edit2, 
  Plus, 
  X, 
  RefreshCw,
  Cpu,
  Sparkles,
  ChevronRight,
  MessageSquare
} from 'lucide-react';

export const ChatWindow = () => {
  const { setSystemStatus, setActiveAgentName, pendingPrompt, clearPendingPrompt } = useOS();

  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedAgent, setSelectedAgent] = useState('AUTO');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('NEXUS is thinking...');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Multimodal Image state
  const [attachedImage, setAttachedImage] = useState(null); // { data: base64, mimeType, preview }
  const fileInputRef = useRef(null);

  // Voice recognition state
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Load conversation list on mount
  useEffect(() => {
    loadConversations();
  }, []);

  // Handle pending prompt passed from Dashboard or Command Palette
  useEffect(() => {
    if (pendingPrompt) {
      handleSendMessage(pendingPrompt);
      clearPendingPrompt();
    }
  }, [pendingPrompt]);

  // Setup browser SpeechRecognition API
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const loadConversations = async () => {
    try {
      const list = await chatService.getConversations();
      setConversations(list);
    } catch (err) {
      console.error('Failed to load conversations:', err);
    }
  };

  const loadConversation = async (id) => {
    try {
      setActiveConversationId(id);
      const conv = await chatService.getConversationById(id);
      setMessages(conv.messages || []);
      if (conv.selectedAgent) {
        setSelectedAgent(conv.selectedAgent);
      }
    } catch (err) {
      console.error('Failed to load conversation details:', err);
    }
  };

  const handleNewChat = () => {
    setActiveConversationId(null);
    setMessages([]);
    setInputMessage('');
    setAttachedImage(null);
  };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (PNG, JPEG, WEBP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image file size must be less than 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const base64Data = uploadEvent.target.result.split(',')[1];
      setAttachedImage({
        data: base64Data,
        mimeType: file.type,
        preview: uploadEvent.target.result,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSendMessage = async (customPrompt = null) => {
    const promptToSend = (customPrompt || inputMessage).trim();
    if (!promptToSend && !attachedImage) return;

    // Optimistically append user message
    const userMsg = {
      role: 'user',
      content: promptToSend,
      image: attachedImage ? attachedImage.mimeType : null,
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    const imagePayload = attachedImage ? { data: attachedImage.data, mimeType: attachedImage.mimeType } : null;
    setAttachedImage(null);

    setIsLoading(true);
    setSystemStatus('thinking');
    setLoadingStatus('Supervisor analyzing intent...');

    try {
      const res = await chatService.sendMessage({
        message: promptToSend,
        conversationId: activeConversationId,
        selectedAgent: selectedAgent,
        image: imagePayload,
      });

      // Update active conversation ID if it was created
      if (!activeConversationId && res.conversationId) {
        setActiveConversationId(res.conversationId);
        loadConversations();
      }

      // Update status indicator
      if (res.agent) {
        setActiveAgentName(`${res.agent} Agent`);
      }

      // Append assistant message
      const assistantMsg = {
        role: 'assistant',
        content: res.response,
        agent: res.agent,
        confidence: res.confidence,
        reason: res.reason,
        toolCalls: res.toolsUsed,
        agentActivity: res.agentActivity,
        durationMs: res.durationMs,
        createdAt: new Date(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `⚠️ **NEXUS Notification**: ${err.message}`,
          createdAt: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
      setSystemStatus('idle');
    }
  };

  const handleDeleteConversation = async (e, id) => {
    e.stopPropagation();
    if (confirm('Delete this conversation from your history?')) {
      await chatService.deleteConversation(id);
      if (activeConversationId === id) {
        handleNewChat();
      }
      loadConversations();
    }
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem)] md:h-[calc(100vh-3.5rem)] overflow-hidden">
      {/* Left Conversations Sidebar */}
      <div
        className={`glass-panel border-r border-white/10 w-64 md:w-72 flex flex-col shrink-0 transition-all duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-16'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-3 border-b border-white/10 flex items-center justify-between">
          <button
            onClick={handleNewChat}
            className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition"
          >
            <Plus size={15} />
            <span>New Chat</span>
          </button>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {conversations.map((conv) => (
            <div
              key={conv._id}
              onClick={() => loadConversation(conv._id)}
              className={`group flex items-center justify-between p-2.5 rounded-xl cursor-pointer text-xs transition ${
                activeConversationId === conv._id
                  ? 'bg-white/10 text-white font-medium shadow-sm'
                  : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <MessageSquare size={13} className="shrink-0 text-slate-500 group-hover:text-cyan-400" />
                <span className="truncate">{conv.title}</span>
              </div>
              <button
                onClick={(e) => handleDeleteConversation(e, conv._id)}
                className="opacity-0 group-hover:opacity-100 p-1 hover:text-rose-400 transition"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}

          {conversations.length === 0 && (
            <p className="text-[11px] text-slate-500 text-center py-6">No previous conversations.</p>
          )}
        </div>
      </div>

      {/* Main Chat Viewport */}
      <div className="flex-1 flex flex-col h-full bg-slate-950/30 relative">
        {/* Top Chat Bar: Specialist Agent Selector */}
        <div className="h-12 border-b border-white/[0.08] px-4 flex items-center justify-between bg-slate-950/50 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Agent Routing:</span>
            <select
              value={selectedAgent}
              onChange={(e) => setSelectedAgent(e.target.value)}
              className="bg-slate-900 border border-white/10 text-xs text-cyan-300 rounded-lg px-2.5 py-1 focus:outline-none focus:border-cyan-500"
            >
              <option value="AUTO">⚡ Autonomous (Supervisor Routed)</option>
              <option value="CODING">💻 Coding Specialist</option>
              <option value="TASK">✅ Task & Action Agent</option>
              <option value="NOTES">📝 Notes & Knowledge Agent</option>
              <option value="PLANNER">🗓️ Planner & Roadmap Agent</option>
              <option value="STUDY">📚 Study & Interview Hub</option>
              <option value="GENERAL">🤖 NEXUS Central Assistant</option>
            </select>
          </div>

          <div className="text-[11px] text-slate-400 hidden sm:block">
            Powered by Google Gemini 3.5 Flash
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-4 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-xl mx-auto py-12">
              <NexusCoreOrb size="lg" state="idle" className="mb-5" />
              <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-300 to-indigo-400 bg-clip-text text-transparent">
                NEXUS AI Operating System
              </h2>
              <p className="text-xs text-slate-400 mt-2 mb-6">
                Your intelligent workspace powered by multi-agent coordination and official Gemini tool calling.
              </p>
              <PromptSuggestions onSelectPrompt={(p) => handleSendMessage(p)} />
            </div>
          ) : (
            messages.map((msg, idx) => <MessageBubble key={idx} message={msg} />)
          )}

          {/* Loading Animation Bubble */}
          {isLoading && (
            <div className="flex gap-3 my-4">
              <NexusCoreOrb size="sm" state="thinking" className="mt-1 shrink-0" />
              <div className="glass-panel rounded-2xl rounded-tl-sm p-4 border border-cyan-500/20 text-xs text-cyan-300 flex items-center gap-3">
                <RefreshCw size={15} className="animate-spin text-cyan-400" />
                <span className="font-mono">{loadingStatus}</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Attached Image Preview Bar */}
        {attachedImage && (
          <div className="px-6 py-2 bg-slate-900/80 border-t border-white/10 flex items-center gap-3">
            <img
              src={attachedImage.preview}
              alt="Attached preview"
              className="w-12 h-12 object-cover rounded-lg border border-cyan-500/40"
            />
            <div className="flex-1 text-xs">
              <p className="text-slate-200 font-medium">Image attached for Gemini reasoning</p>
              <p className="text-slate-400 text-[10px] font-mono">{attachedImage.mimeType}</p>
            </div>
            <button
              onClick={() => setAttachedImage(null)}
              className="p-1 rounded-lg text-slate-400 hover:text-rose-400"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Input Box Footer */}
        <div className="p-4 border-t border-white/10 bg-slate-950/70 backdrop-blur-xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="max-w-4xl mx-auto relative flex items-center gap-2 glass-panel rounded-2xl px-4 py-2 border border-white/10 focus-within:border-cyan-500/50 shadow-2xl transition"
          >
            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageSelect}
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
            />

            {/* Attach Image Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-xl text-slate-400 hover:text-cyan-300 hover:bg-white/5 transition"
              title="Upload image for Gemini multimodal analysis"
            >
              <Paperclip size={18} />
            </button>

            {/* Voice Input Button */}
            <button
              type="button"
              onClick={toggleVoiceInput}
              className={`p-2 rounded-xl transition ${
                isListening
                  ? 'bg-rose-500/20 text-rose-400 animate-pulse'
                  : 'text-slate-400 hover:text-cyan-300 hover:bg-white/5'
              }`}
              title="Speak to NEXUS (Free Browser Speech-to-Text)"
            >
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
            </button>

            {/* Main Text Input */}
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={isListening ? 'Listening to your voice...' : 'Ask NEXUS anything (tasks, code, notes, plans)...'}
              disabled={isLoading}
              className="flex-1 bg-transparent text-sm text-slate-100 placeholder-slate-400 focus:outline-none px-2"
            />

            {/* Clear button if text */}
            {inputMessage && (
              <button
                type="button"
                onClick={() => setInputMessage('')}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200"
              >
                <X size={15} />
              </button>
            )}

            {/* Send Button */}
            <button
              type="submit"
              disabled={isLoading || (!inputMessage.trim() && !attachedImage)}
              className="p-2.5 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white font-semibold shadow-lg hover:opacity-90 disabled:opacity-40 transition"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
