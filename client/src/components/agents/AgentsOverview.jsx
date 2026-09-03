import React, { useState, useEffect } from 'react';
import { useOS } from '../../context/OSContext.jsx';
import { agentsService } from '../../services/agents.service.js';
import { Badge } from '../common/Badge.jsx';
import { 
  Cpu, 
  Bot, 
  Code2, 
  Calendar, 
  GraduationCap, 
  CheckSquare, 
  FileText, 
  ArrowRight, 
  Wrench, 
  Clock, 
  Activity 
} from 'lucide-react';

export const AgentsOverview = () => {
  const { openApp } = useOS();
  const [agents, setAgents] = useState([]);
  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(true);

  const agentIcons = {
    GENERAL: Bot,
    CODING: Code2,
    PLANNER: Calendar,
    STUDY: GraduationCap,
    TASK: CheckSquare,
    NOTES: FileText,
  };

  const agentColors = {
    GENERAL: 'text-cyan-400 border-cyan-500/20 bg-cyan-500/5',
    CODING: 'text-blue-400 border-blue-500/20 bg-blue-500/5',
    PLANNER: 'text-purple-400 border-purple-500/20 bg-purple-500/5',
    STUDY: 'text-rose-400 border-rose-500/20 bg-rose-500/5',
    TASK: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5',
    NOTES: 'text-amber-400 border-amber-500/20 bg-amber-500/5',
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [agentsData, runsData] = await Promise.all([
          agentsService.getAgents(),
          agentsService.getAgentRuns(),
        ]);
        setAgents(agentsData || []);
        setRuns(runsData || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto h-[calc(100vh-3.5rem)] flex flex-col overflow-y-auto">
      {/* Header */}
      <div className="pb-6 border-b border-white/10">
        <h1 className="text-2xl font-bold flex items-center gap-2.5 text-white">
          <Cpu className="text-purple-400" />
          <span>Multi-Agent Architecture</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          NEXUS employs an intelligent Supervisor Agent to classify intent and route each query to specialized AI experts.
        </p>
      </div>

      {/* Agents Grid */}
      <div className="my-6">
        <h2 className="text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
          <span>Active Specialist Agents</span>
          <Badge variant="purple" size="xs">
            {agents.length} Online
          </Badge>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map((agent) => {
            const Icon = agentIcons[agent.name] || Bot;
            const style = agentColors[agent.name] || agentColors.GENERAL;

            return (
              <div
                key={agent.name}
                className="glass-panel rounded-2xl p-5 border border-white/10 flex flex-col justify-between hover:border-white/20 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2.5 rounded-xl border ${style}`}>
                      <Icon size={20} />
                    </div>
                    <Badge variant="cyan" size="xs">
                      {agent.name}
                    </Badge>
                  </div>

                  <h3 className="text-sm font-semibold text-white mb-1.5">{agent.displayName}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">{agent.description}</p>

                  {/* Registered Tools */}
                  {agent.tools && agent.tools.length > 0 && (
                    <div className="pt-2 border-t border-white/5 mb-4">
                      <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-1.5 flex items-center gap-1">
                        <Wrench size={10} />
                        Connected Tools ({agent.tools.length}):
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {agent.tools.map((t, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-900 border border-white/5 text-slate-300"
                          >
                            {t}()
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => openApp('chat', `Ask ${agent.displayName}: `)}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-semibold text-slate-200 group-hover:text-cyan-300 border border-white/5 transition"
                >
                  <span>Interact in Chat</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Execution Runs */}
      <div className="mt-4 pb-8">
        <h2 className="text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
          <Activity size={15} className="text-cyan-400" />
          <span>Recent Multi-Agent Execution Runs</span>
        </h2>

        {runs.length === 0 ? (
          <div className="glass-panel rounded-2xl p-6 text-center text-xs text-slate-500 border border-white/5">
            No agent execution history recorded yet. Interact with NEXUS to see real-time pipeline traces.
          </div>
        ) : (
          <div className="glass-panel rounded-2xl border border-white/10 divide-y divide-white/5 overflow-hidden">
            {runs.slice(0, 8).map((run) => (
              <div key={run._id} className="p-3.5 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <Badge variant="cyan" size="xs">
                    {run.agent}
                  </Badge>
                  <div>
                    <p className="text-slate-200 font-medium text-[11px]">{run.intent || 'User Query Processed'}</p>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(run.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {run.toolsUsed && run.toolsUsed.length > 0 && (
                    <Badge variant="emerald" size="xs">
                      {run.toolsUsed.map((t) => t.toolName).join(', ')}
                    </Badge>
                  )}
                  <span className="flex items-center gap-1 font-mono text-[11px] text-slate-400">
                    <Clock size={11} />
                    {run.durationMs || 0}ms
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
