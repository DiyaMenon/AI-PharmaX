import React from 'react';
import { DecisionMetrics } from '../types';

export const DecisionMatrix: React.FC<{ metrics: DecisionMetrics }> = ({ metrics }) => {
  const getClinicalColor = (status: string) => {
    switch (status) {
      case 'High': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'Medium': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      default: return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
    }
  };

  const getPatentColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'; // Low risk is good
      case 'Medium': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      default: return 'text-rose-400 bg-rose-400/10 border-rose-400/20'; // High risk is bad
    }
  };

  const commercialPercentage = Math.min(Math.max(metrics.commercialScore * 10, 0), 100);
  const commercialColor = metrics.commercialScore >= 7 ? 'bg-emerald-400' : metrics.commercialScore >= 4 ? 'bg-amber-400' : 'bg-rose-400';

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up-delay">
      
      {/* Clinical Readiness */}
      <div className="bg-pharma-900/60 backdrop-blur-sm border border-white/10 rounded-xl p-5 shadow-lg relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full"></div>
        <h4 className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-3">Clinical Readiness</h4>
        <div className="flex items-center gap-3">
           <div className={`w-3 h-3 rounded-full shadow-[0_0_10px_currentColor] ${getClinicalColor(metrics.clinicalReadiness).split(' ')[0]}`}></div>
           <span className={`text-2xl font-bold ${getClinicalColor(metrics.clinicalReadiness).split(' ')[0]}`}>{metrics.clinicalReadiness}</span>
        </div>
        <div className="mt-2 text-xs text-gray-500">
           Probability of repurposing success based on trial maturity.
        </div>
      </div>

      {/* Patent Risk */}
      <div className="bg-pharma-900/60 backdrop-blur-sm border border-white/10 rounded-xl p-5 shadow-lg relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full"></div>
        <h4 className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-3">Patent Risk</h4>
        <div className="flex items-center gap-3">
           <div className={`px-3 py-1 rounded border text-sm font-bold uppercase ${getPatentColor(metrics.patentRisk)}`}>
              {metrics.patentRisk}
           </div>
        </div>
        <div className="mt-3 text-xs text-gray-500">
           IP freedom-to-operate and exclusivity barriers.
        </div>
      </div>

      {/* Commercial Score */}
      <div className="bg-pharma-900/60 backdrop-blur-sm border border-white/10 rounded-xl p-5 shadow-lg relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full"></div>
        <div className="flex justify-between items-center mb-2">
            <h4 className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Commercial Attractiveness</h4>
            <span className="text-xl font-bold text-white font-mono">{metrics.commercialScore}<span className="text-gray-500 text-sm">/10</span></span>
        </div>
        
        <div className="h-2 w-full bg-gray-700/50 rounded-full overflow-hidden">
            <div 
                className={`h-full ${commercialColor} shadow-[0_0_15px_currentColor] transition-all duration-1000 ease-out`} 
                style={{ width: `${commercialPercentage}%` }}
            ></div>
        </div>
        
        <div className="mt-3 text-xs text-gray-500 flex justify-between">
           <span>Market Potential</span>
           <span className={metrics.commercialScore >= 7 ? 'text-emerald-400' : 'text-gray-400'}>
              {metrics.commercialScore >= 7 ? 'High Opportunity' : 'Moderate'}
           </span>
        </div>
      </div>

    </div>
  );
};