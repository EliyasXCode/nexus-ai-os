import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Cpu, 
  CheckCircle2, 
  Layers, 
  ArrowRight, 
  Wrench,
  Sparkles,
  Clock
} from 'lucide-react';
import { Badge } from '../common/Badge.jsx';

export const AgentActivityTimeline = ({ activity = [], toolsUsed = [], durationMs, agent, reason }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!activity || activity.length === 0) return null;

  return (
    <div className="mt-2 rounded-xl border border-white/[0.08] bg-slate-950/40 backdrop-blur-md overflow-hidden transition-all">
      {/* Header bar */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-3.5 py-2 flex items-center justify-between text-xs text-slate-300 hover:bg-white/[0.04] transition"
      >
        <div className="flex items-center gap-2">
          <Cpu size={14} className="text-cyan-400" />
          <span className="font-semibold text-slate-200">Agent Activity Pipeline</span>
          <Badge variant="cyan" size="xs">
            {agent}
          </Badge>
          {toolsUsed.length > 0 && (
            <Badge variant="emerald" size="xs">
              {toolsUsed.length} {toolsUsed.length === 1 ? 'Tool' : 'Tools'}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2 text-slate-400">
          {durationMs && (
            <span className="flex items-center gap-1 font-mono text-[11px] text-slate-500">
              <Clock size={11} />
              {durationMs}ms
            </span>
          )}
          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </div>
      </button>

      {/* Expandable Step Timeline */}
      {isExpanded && (
        <div className="px-4 py-3 border-t border-white/[0.06] bg-black/20 text-xs space-y-2.5">
          {reason && (
            <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[11px]">
              <span className="font-semibold">Routing Rationale:</span> {reason}
            </div>
          )}

          <div className="space-y-2 pl-2 border-l border-white/10 ml-2">
            {activity.map((item, idx) => {
              const isTool = item.step.includes('TOOL');
              const isSelected = item.step.includes('SELECTED');
              const isComplete = item.step.includes('COMPLETE');

              return (
                <div key={idx} className="relative flex items-start gap-2.5 -ml-[13px]">
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 ${
                      isTool
                        ? 'bg-amber-500 text-black'
                        : isSelected
                        ? 'bg-cyan-500 text-black'
                        : isComplete
                        ? 'bg-emerald-500 text-black'
                        : 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-200 font-medium leading-none mb-0.5">
                      {item.detail}
                    </p>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {item.step}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tools Result View */}
          {toolsUsed && toolsUsed.length > 0 && (
            <div className="pt-2 border-t border-white/10">
              <p className="text-[11px] font-semibold text-slate-400 mb-1.5 flex items-center gap-1.5">
                <Wrench size={12} className="text-emerald-400" />
                Executed Tools:
              </p>
              <div className="space-y-1.5">
                {toolsUsed.map((t, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-lg bg-slate-900/80 border border-white/5 font-mono text-[11px]"
                  >
                    <span className="text-emerald-400 font-bold">{t.toolName}</span>
                    <pre className="text-slate-400 text-[10px] mt-1 overflow-x-auto whitespace-pre-wrap">
                      {JSON.stringify(t.result, null, 2)}
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
