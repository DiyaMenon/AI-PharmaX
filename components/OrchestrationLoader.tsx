import React from 'react';
import { Logo } from './Logo';

export const OrchestrationLoader: React.FC<{ status: string }> = ({ status }) => {
  return (
    <div className="relative w-full max-w-2xl mx-auto h-96 flex items-center justify-center animate-fade-in">
      {/* Central Hub (Master Agent) */}
      <div className="absolute z-20 flex flex-col items-center">
        <div className="relative w-20 h-20 bg-pharma-950 rounded-full border border-pharma-accent/30 flex items-center justify-center shadow-[0_0_30px_rgba(56,189,248,0.2)]">
            <div className="absolute inset-0 rounded-full border border-pharma-accent/50 animate-ping opacity-20"></div>
            <Logo className="w-10 h-10 text-pharma-accent animate-pulse-slow" />
        </div>
        <div className="mt-4 text-center">
             <div className="text-xs font-bold text-pharma-accent uppercase tracking-widest mb-1">Master Agent</div>
             <div className="text-sm text-white font-mono">{status}</div>
        </div>
      </div>

      {/* Orbiting Worker Agents */}
      {[0, 1, 2, 3, 4].map((i) => {
         const angle = (i * 72) * (Math.PI / 180);
         const radius = 140;
         const x = Math.cos(angle) * radius; // positioning done via CSS mainly for simplicity, but calculate offsets
         const icons = ["🏥", "⚖️", "📊", "🚢", "🌐"];
         const labels = ["Clinical", "Patent", "Market", "Trade", "Web Intel"];
         
         return (
            <div 
                key={i}
                className="absolute w-12 h-12 rounded-full bg-pharma-900 border border-white/10 flex items-center justify-center text-xl shadow-lg z-10 animate-fade-in"
                style={{ 
                    transform: `translate(${x}px, ${Math.sin(angle) * radius}px)`,
                    animationDelay: `${i * 0.1}s` 
                }}
            >
                {/* Connecting Line */}
                <div 
                    className="absolute top-1/2 left-1/2 h-0.5 bg-gradient-to-r from-pharma-accent/50 to-transparent origin-left -z-10"
                    style={{ 
                        width: `${radius}px`, 
                        transform: `rotate(${i * 72 + 180}deg)`,
                        left: '50%',
                        top: '50%'
                    }}
                >
                    <div className="absolute top-0 right-0 w-2 h-2 rounded-full bg-pharma-accent animate-ping" style={{ animationDuration: '2s', animationDelay: `${i * 0.3}s` }}></div>
                </div>

                <span>{icons[i]}</span>
                
                <div className="absolute top-14 text-[9px] font-bold text-gray-400 uppercase tracking-wider text-center w-24 -ml-6">
                    {labels[i]}
                </div>
            </div>
         )
      })}

      {/* Background Pulse Rings */}
      <div className="absolute w-96 h-96 rounded-full border border-white/5 animate-pulse"></div>
      <div className="absolute w-[28rem] h-[28rem] rounded-full border border-white/5 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
    </div>
  );
};