import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { NexusCoreOrb } from '../common/NexusCoreOrb.jsx';
import { AgentActivityTimeline } from './AgentActivityTimeline.jsx';
import { Copy, Check, User, Bot } from 'lucide-react';

export const MessageBubble = ({ message }) => {
  const isUser = message.role === 'user';
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopyCode = (codeText) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className={`flex gap-3 my-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {/* Assistant Avatar */}
      {!isUser && (
        <div className="shrink-0 mt-1">
          <NexusCoreOrb size="sm" state={message.agentActivity?.length ? 'agent' : 'idle'} />
        </div>
      )}

      {/* Bubble Container */}
      <div
        className={`max-w-[85%] md:max-w-[75%] rounded-2xl p-4 text-sm ${
          isUser
            ? 'bg-gradient-to-r from-cyan-600/20 to-indigo-600/30 border border-cyan-500/30 text-slate-100 rounded-tr-sm shadow-md'
            : 'glass-panel border border-white/10 text-slate-200 rounded-tl-sm shadow-lg'
        }`}
      >
        {/* User image if uploaded */}
        {message.image && (
          <div className="mb-2 p-1 bg-black/40 rounded-lg inline-block border border-white/10">
            <span className="text-[11px] text-cyan-300 font-mono">📎 Image Attached ({message.image})</span>
          </div>
        )}

        {/* Message Content */}
        {isUser ? (
          <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
        ) : (
          <div className="markdown-body">
            <ReactMarkdown
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  const codeString = String(children).replace(/\n$/, '');

                  return !inline ? (
                    <div className="relative group my-3 rounded-xl overflow-hidden border border-white/10 bg-slate-950/90">
                      <div className="flex items-center justify-between px-3.5 py-1.5 bg-slate-900/90 border-b border-white/5 text-xs text-slate-400 font-mono">
                        <span>{match ? match[1] : 'code'}</span>
                        <button
                          onClick={() => handleCopyCode(codeString)}
                          className="flex items-center gap-1 text-[11px] hover:text-white transition px-2 py-0.5 rounded bg-white/5 hover:bg-white/10"
                        >
                          {copiedCode ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                          <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                      <pre className="p-3.5 overflow-x-auto text-xs font-mono text-cyan-200">
                        <code className={className} {...props}>
                          {children}
                        </code>
                      </pre>
                    </div>
                  ) : (
                    <code className="bg-slate-800/80 px-1.5 py-0.5 rounded text-cyan-300 font-mono text-xs" {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}

        {/* Multi-Agent Activity Panel (on Assistant messages) */}
        {!isUser && message.agentActivity && message.agentActivity.length > 0 && (
          <AgentActivityTimeline
            activity={message.agentActivity}
            toolsUsed={message.toolCalls}
            durationMs={message.durationMs}
            agent={message.agent}
            reason={message.reason}
          />
        )}
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="shrink-0 mt-1 w-7 h-7 rounded-lg bg-slate-800 border border-white/10 flex items-center justify-center text-xs font-bold text-slate-300">
          <User size={14} />
        </div>
      )}
    </div>
  );
};
