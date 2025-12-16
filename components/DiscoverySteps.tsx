
import React from 'react';

interface DiscoveryStepsProps {
  currentStep: number; // 0 = Idle, 1 = Input, 2 = Orchestration, 3 = Analysis, 4 = Synthesis, 5 = Complete
}

const STEPS = [
  { id: 1, label: 'Molecule Input', icon: '💊' },
  { id: 2, label: 'Agent Orchestration', icon: '🤖' },
  { id: 3, label: 'Multi-Domain Analysis', icon: '⚡' },
  { id: 4, label: 'Data Synthesis', icon: '📊' },
  { id: 5, label: 'Strategic Report', icon: '📑' },
];

export const DiscoverySteps: React.FC<DiscoveryStepsProps> = ({ currentStep }) => {
  return (
    // Added pb-14 to reserve space for the absolute positioned labels below the icons
    <div className="w-full max-w-5xl mx-auto mb-8 px-4 animate-fade-in pb-14">
      <div className="relative flex items-center justify-between">
        
        {/* Background Line */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-white/5 rounded-full z-0"></div>
        
        {/* Active Progress Line */}
        <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-pharma-accent to-blue-600 rounded-full z-0 transition-all duration-1000 ease-in-out"
            style={{ width: `${Math.max(0, (currentStep - 1) / (STEPS.length - 1) * 100)}%` }}
        ></div>

        {STEPS.map((step, idx) => {
          const isActive = currentStep >= step.id;
          const isCurrent = currentStep === step.id;
          
          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center group">
              {/* Step Circle */}
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                  isActive 
                    ? 'bg-pharma-900 border-pharma-accent text-pharma-accent shadow-[0_0_15px_rgba(56,189,248,0.4)]' 
                    : 'bg-pharma-950 border-white/10 text-gray-600'
                } ${isCurrent ? 'scale-110 ring-4 ring-pharma-accent/20' : ''}`}
              >
                <span className="text-lg">{step.icon}</span>
              </div>
              
              {/* Label - Absolute positioning requires parent padding to not overlap next elements */}
              <div className={`absolute top-14 whitespace-nowrap text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${
                isActive ? 'text-pharma-accent' : 'text-gray-600'
              } ${isCurrent ? 'opacity-100 translate-y-0' : 'opacity-70 group-hover:opacity-100'}`}>
                {step.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
