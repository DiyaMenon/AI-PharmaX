import React from 'react';
import { marked } from 'marked';
import { WorkerAgentOutput, AgentStatus, AgentType, RiskLevel, Outlook } from '../types';
import { AgentCharts } from './AgentCharts';

interface AgentCardProps {
  agent: WorkerAgentOutput;
  delay?: number;
}

const getAgentIcon = (type: AgentType) => {
  switch (type) {
    case AgentType.CLINICAL: return "🏥";
    case AgentType.PATENT: return "⚖️";
    case AgentType.MARKET: return "📊";
    case AgentType.TRADE: return "🚢";
    case AgentType.WEB: return "🌐";
    default: return "🤖";
  }
};

const getAgentColor = (type: AgentType) => {
  switch (type) {
    case AgentType.CLINICAL: return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
    case AgentType.PATENT: return "text-amber-400 bg-amber-400/10 border-amber-400/20";
    case AgentType.MARKET: return "text-blue-400 bg-blue-400/10 border-blue-400/20";
    case AgentType.TRADE: return "text-purple-400 bg-purple-400/10 border-purple-400/20";
    case AgentType.WEB: return "text-rose-400 bg-rose-400/10 border-rose-400/20";
    default: return "text-gray-400 bg-gray-400/10 border-gray-400/20";
  }
}

const getRiskBadge = (level?: RiskLevel) => {
  if (!level || level === 'UNKNOWN') return null;
  const colors = {
    LOW: 'bg-green-500/20 text-green-400 border-green-500/30',
    MEDIUM: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    HIGH: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    CRITICAL: 'bg-red-500/20 text-red-400 border-red-500/30',
  };
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${colors[level] || colors.LOW}`}>
      Risk: {level}
    </span>
  );
};

const getOutlookBadge = (outlook?: Outlook) => {
  if (!outlook || outlook === 'UNKNOWN') return null;
  const colors = {
    POSITIVE: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    NEUTRAL: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    NEGATIVE: 'bg-red-500/20 text-red-400 border-red-500/30',
    MIXED: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  };
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${colors[outlook] || colors.NEUTRAL}`}>
      Outlook: {outlook}
    </span>
  );
};

export const AgentCard: React.FC<AgentCardProps> = ({ agent }) => {
  const isComplete = agent.status === AgentStatus.COMPLETED;
  const colorClasses = getAgentColor(agent.agentType);

  // Parse markdown securely
  const getMarkdown = (text: string) => {
    try {
      return marked.parse(text);
    } catch (e) {
      return text;
    }
  };

  return (
    <div className={`group flex flex-col h-full relative glass-card rounded-xl p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] ${isComplete ? 'opacity-100' : 'opacity-60'}`}>
      
      {/* Decorative gradient blob */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors duration-700 pointer-events-none"></div>

      <div className="relative z-10 flex flex-col h-full">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center space-x-4 min-w-0">
            {/* Icon with Tooltip */}
            <div className={`group/icon relative w-12 h-12 rounded-lg flex-shrink-0 flex items-center justify-center text-2xl border backdrop-blur-md cursor-help ${colorClasses}`}>
              {getAgentIcon(agent.agentType)}
              
              {/* Tooltip */}
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 w-64 p-3 bg-pharma-900/95 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl text-xs text-gray-200 font-medium normal-case tracking-normal opacity-0 invisible group-hover/icon:opacity-100 group-hover/icon:visible transition-all duration-200 z-[60] pointer-events-none transform origin-bottom scale-95 group-hover/icon:scale-100">
                <p className="leading-relaxed">{agent.description}</p>
                {/* Arrow */}
                <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-pharma-900/95"></div>
              </div>
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h3 className="text-lg font-bold text-white group-hover:text-pharma-accent transition-colors truncate">{agent.agentName}</h3>
                {isComplete && (
                   <div className="flex gap-2 flex-shrink-0">
                      {getRiskBadge(agent.riskLevel)}
                      {getOutlookBadge(agent.outlook)}
                   </div>
                )}
              </div>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-medium mt-1 max-w-full truncate">{agent.description}</p>
            </div>
          </div>
          <div className="flex-shrink-0 ml-2">
            {!isComplete && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 animate-pulse">
                PROCESSING...
              </span>
            )}
          </div>
        </div>

        {/* Visual Metrics Grid (Summary Cards) */}
        {agent.keyMetrics && agent.keyMetrics.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
            {agent.keyMetrics.map((metric, idx) => {
              // Determine if we should show a progress bar for percentages
              const isPercentage = metric.label?.includes('%') || (metric.value <= 100 && metric.name.toLowerCase().includes('probability'));
              return (
                <div key={idx} className="bg-black/40 p-3 rounded-lg border border-white/5 relative overflow-hidden group/metric">
                   {isPercentage && (
                     <div className="absolute bottom-0 left-0 h-1 bg-pharma-accent/30 w-full">
                        <div className="h-full bg-pharma-accent transition-all duration-1000" style={{ width: `${Math.min(metric.value, 100)}%` }}></div>
                     </div>
                   )}
                   <div className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold mb-1 truncate flex justify-between">
                     <span className="truncate mr-1">{metric.name}</span>
                     {metric.trend === 'up' && <span className="text-green-400 flex-shrink-0">↑</span>}
                     {metric.trend === 'down' && <span className="text-red-400 flex-shrink-0">↓</span>}
                   </div>
                   <div className="flex items-baseline gap-1">
                     <span className="text-xl font-mono font-medium text-white tracking-tight">{metric.value.toLocaleString()}</span>
                     {metric.label && <span className="text-[10px] text-gray-400 font-mono truncate">{metric.label}</span>}
                   </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Data Visualizations (Charts) */}
        {agent.charts && agent.charts.length > 0 && (
          <div className="mb-6 animate-fade-in">
             <AgentCharts charts={agent.charts} />
          </div>
        )}

        {/* Findings Content (Markdown & Tables) */}
        <div className="flex-grow bg-white/5 rounded-lg p-4 border border-white/5 flex flex-col min-w-0 overflow-hidden">
            <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 border-b border-white/5 pb-2 flex-shrink-0">Analysis Findings</h4>
            <div 
            className="prose prose-sm prose-invert max-w-none text-gray-300 leading-relaxed font-light overflow-x-auto custom-scrollbar
                prose-headings:text-pharma-accent prose-headings:font-bold prose-headings:tracking-wide prose-headings:mt-4 prose-headings:mb-2
                prose-h3:text-sm prose-h3:uppercase
                prose-h4:text-xs prose-h4:uppercase prose-h4:text-white
                prose-strong:text-white prose-strong:font-semibold
                prose-ul:my-2 prose-ul:list-disc prose-ul:pl-4
                prose-li:my-0.5 prose-li:text-gray-300
                prose-table:w-full prose-table:text-xs prose-table:my-2
                prose-th:bg-white/10 prose-th:p-2 prose-th:text-left prose-th:text-white prose-th:font-semibold prose-th:border-b prose-th:border-white/10 prose-th:whitespace-nowrap
                prose-td:p-2 prose-td:border-b prose-td:border-white/5 prose-td:align-top prose-tr:hover:bg-white/5"
            dangerouslySetInnerHTML={{ __html: getMarkdown(agent.findings) as string }} 
            />
        </div>
      </div>
    </div>
  );
};
