import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { agentsService } from '../../services/agents.service.js';
import { 
  Code2, 
  Play, 
  Bug, 
  Sparkles, 
  CheckCheck, 
  Copy, 
  Check, 
  FileCode, 
  Zap, 
  FileText 
} from 'lucide-react';

export const CodeWorkspace = () => {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(`// Welcome to NEXUS Code Assistant
function authenticateUser(email, password) {
  if (!email || !password) {
    return { success: false, error: "Missing required fields" };
  }
  // TODO: Validate user credentials with MongoDB
  return { success: true, token: "jwt_token_example" };
}`);
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeAction, setActiveAction] = useState('explain');
  const [copied, setCopied] = useState(false);

  const actions = [
    { id: 'explain', label: 'Explain Code', icon: FileText, color: 'hover:border-cyan-500/50' },
    { id: 'bugs', label: 'Find Bugs', icon: Bug, color: 'hover:border-rose-500/50' },
    { id: 'improve', label: 'Improve Code', icon: Sparkles, color: 'hover:border-indigo-500/50' },
    { id: 'comments', label: 'Add Comments', icon: FileCode, color: 'hover:border-amber-500/50' },
    { id: 'optimize', label: 'Optimize', icon: Zap, color: 'hover:border-emerald-500/50' },
    { id: 'tests', label: 'Generate Tests', icon: CheckCheck, color: 'hover:border-purple-500/50' },
  ];

  const handleRunAction = async (actionId) => {
    setActiveAction(actionId);
    setIsLoading(true);
    try {
      const res = await agentsService.analyzeCode({
        code,
        language,
        action: actionId,
      });
      setOutput(res);
    } catch (err) {
      setOutput(`⚠️ **Code Analysis Error**: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyOutput = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto h-[calc(100vh-3.5rem)] flex flex-col">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2.5 text-white">
            <Code2 className="text-blue-400" />
            <span>NEXUS Code Assistant</span>
          </h1>
          <p className="text-xs text-slate-400">
            Powered by Coding Specialist Agent. Analyze, debug, refactor, and write tests for your code.
          </p>
        </div>

        {/* Language selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Language:</span>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-slate-900 border border-white/10 text-xs text-cyan-300 rounded-xl px-3 py-1.5 focus:outline-none focus:border-cyan-500"
          >
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="sql">SQL</option>
            <option value="html">HTML</option>
            <option value="css">CSS</option>
          </select>
        </div>
      </div>

      {/* Action Buttons Toolbar */}
      <div className="flex flex-wrap items-center gap-2 my-3">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.id}
              onClick={() => handleRunAction(act.id)}
              disabled={isLoading}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition ${
                activeAction === act.id
                  ? 'bg-blue-500/20 text-blue-300 border-blue-500/40 shadow-sm'
                  : 'bg-slate-900/80 text-slate-300 border-white/10 hover:bg-white/[0.05]'
              }`}
            >
              <Icon size={13} />
              <span>{act.label}</span>
            </button>
          );
        })}
      </div>

      {/* Split Pane: Code Editor on Left, AI Output on Right */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0 overflow-hidden">
        {/* Left: Code Input Pane */}
        <div className="glass-panel rounded-2xl border border-white/10 flex flex-col overflow-hidden">
          <div className="px-4 py-2 bg-slate-900/80 border-b border-white/5 flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Editor ({language})</span>
            <span>Input Code</span>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Paste or write code here..."
            className="flex-1 p-4 bg-transparent text-xs font-mono text-cyan-200 placeholder-slate-600 resize-none focus:outline-none overflow-y-auto leading-relaxed"
            spellCheck={false}
          />
        </div>

        {/* Right: AI Output Pane */}
        <div className="glass-panel rounded-2xl border border-white/10 flex flex-col overflow-hidden">
          <div className="px-4 py-2 bg-slate-900/80 border-b border-white/5 flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Sparkles size={13} className="text-blue-400" />
              Coding Agent Analysis
            </span>
            {output && (
              <button
                onClick={handleCopyOutput}
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition"
              >
                {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            )}
          </div>

          <div className="flex-1 p-4 overflow-y-auto text-xs">
            {isLoading ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <Sparkles size={28} className="text-blue-400 animate-spin mb-3" />
                <p className="text-xs text-blue-300 font-medium">Coding Agent analyzing snippet...</p>
                <p className="text-[11px] text-slate-500 mt-1">Applying AST inspection and best practices</p>
              </div>
            ) : output ? (
              <div className="markdown-body">
                <ReactMarkdown>{output}</ReactMarkdown>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-500">
                <Code2 size={36} className="text-slate-600 mb-2" />
                <p className="text-xs text-slate-400">Select an action above to analyze or refactor this code</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
