import React, { useState } from 'react';
import { AgentChart } from '../types';

export const AgentCharts: React.FC<{ charts: AgentChart[] }> = ({ charts }) => {
  if (!charts || charts.length === 0) return null;

  return (
    // Single column layout to prevent overlapping
    <div className="grid grid-cols-1 gap-8 mt-6">
      {charts.map((chart, idx) => (
        <ChartContainer key={idx} title={chart.title}>
          {chart.type === 'BAR' && <BarChart data={chart.data} />}
          {(chart.type === 'LINE' || chart.type === 'AREA') && <LineChart data={chart.data} isArea={true} />}
        </ChartContainer>
      ))}
      <style>{`
        @keyframes draw {
          from { stroke-dashoffset: 1; }
          to { stroke-dashoffset: 0; }
        }
        .animate-draw {
          animation: draw 2s ease-out forwards;
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up-delay {
          animation: fade-in-up 0.5s ease-out forwards;
        }
        @keyframes shimmer {
          100% { transform: translateX(100%) skewX(12deg); }
        }
      `}</style>
    </div>
  );
};

const ChartContainer: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  // Use a wrapper that allows overflow for tooltips, but clips the background
  <div className="relative flex flex-col h-80 p-6 group/container">
    
    {/* Background styling - absolute and clipped */}
    <div className="absolute inset-0 bg-pharma-900/40 border border-white/10 rounded-xl backdrop-blur-sm shadow-[inset_0_0_20px_rgba(0,0,0,0.2)] overflow-hidden transition-all duration-500 group-hover/container:border-pharma-accent/20">
       <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
    </div>
    
    <h5 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2 relative z-10">
      <span className="w-1.5 h-1.5 rounded-full bg-pharma-accent animate-pulse shadow-[0_0_10px_#38bdf8]"></span>
      {title}
    </h5>
    <div className="flex-1 w-full min-h-0 relative z-10">
      {children}
    </div>
  </div>
);

// --- Tooltip Component ---
interface TooltipProps {
  value: string | number;
  label: string;
  x: number;
  y: number;
  visible: boolean;
  align?: 'left' | 'center' | 'right';
}

const CustomTooltip = ({ value, label, x, y, visible, align = 'center' }: TooltipProps) => {
  let translateX = '-translate-x-1/2';
  if (align === 'left') translateX = '-translate-x-[15%]'; // Anchor closer to left
  if (align === 'right') translateX = '-translate-x-[85%]'; // Anchor closer to right

  return (
    <div 
      className={`absolute pointer-events-none z-[100] transition-all duration-200 ease-out transform ${translateX} -translate-y-[120%] ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      <div className="bg-slate-800/95 backdrop-blur-md border border-pharma-accent/30 text-white text-xs rounded-lg shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] px-3 py-2 whitespace-nowrap min-w-[120px]">
        <div className="font-mono font-bold text-pharma-accent text-sm mb-0.5">{value}</div>
        <div className="text-gray-300 text-[10px] uppercase tracking-wide font-medium">{label}</div>
        
        {/* Arrow - Adjust position based on alignment */}
        <div 
            className={`absolute top-full w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-pharma-accent/30`}
            style={{ 
                left: align === 'left' ? '15%' : align === 'right' ? '85%' : '50%', 
                transform: 'translateX(-50%)' 
            }}
        ></div>
      </div>
    </div>
  );
};

// --- Chart Components ---

const BarChart: React.FC<{ data: { label: string; value: number }[] }> = ({ data }) => {
  const maxValue = Math.max(...data.map(d => d.value)) || 1;
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 flex items-end justify-between gap-4 relative px-2">
        {/* Y-Axis Guidelines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20 z-0">
           <div className="border-t border-white/20 w-full h-0"></div>
           <div className="border-t border-white/10 w-full h-0 border-dashed"></div>
           <div className="border-t border-white/10 w-full h-0 border-dashed"></div>
           <div className="border-t border-white/20 w-full h-0"></div>
        </div>

        {data.map((item, i) => {
          const height = (item.value / maxValue) * 100;
          const isHovered = hoveredIndex === i;
          const align = i === 0 ? 'left' : i === data.length - 1 ? 'right' : 'center';
          
          return (
            <div 
              key={i} 
              className="flex-1 flex flex-col justify-end h-full relative group/bar z-10"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <CustomTooltip 
                visible={isHovered} 
                value={item.value.toLocaleString()} 
                label={item.label} 
                x={50} 
                y={100 - height}
                align={align}
              />
              
              <div className="relative w-full flex flex-col justify-end" style={{ height: '100%' }}>
                <div 
                    className={`w-full bg-gradient-to-t from-pharma-accent/10 to-pharma-accent/40 border-t border-x border-pharma-accent/50 rounded-t transition-all duration-700 ease-out relative overflow-hidden ${isHovered ? 'brightness-125 bg-pharma-accent/60 shadow-[0_0_20px_rgba(56,189,248,0.3)]' : ''}`}
                    style={{ 
                        height: `${height}%`,
                        opacity: 0,
                        animation: `fade-in-up 1s ease-out forwards ${i * 100}ms`
                    }}
                >
                     {/* Glass shine effect */}
                     <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent skew-x-12 translate-x-[-100%] group-hover/bar:animate-[shimmer_1s_infinite]"></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* X-Axis Labels */}
      <div className="h-8 flex justify-between gap-4 px-2 mt-2">
         {data.map((item, i) => (
             <div key={i} className="flex-1 flex justify-center">
                 <span 
                    className={`text-[10px] text-gray-500 text-center leading-tight transition-colors duration-300 ${hoveredIndex === i ? 'text-white font-medium' : ''}`}
                    title={item.label}
                 >
                     {/* Truncate label if too long, showing full on hover/title */}
                     {item.label.length > 15 ? item.label.substring(0, 12) + '...' : item.label}
                 </span>
             </div>
         ))}
      </div>
    </div>
  );
};

const LineChart: React.FC<{ data: { label: string; value: number }[], isArea?: boolean }> = ({ data, isArea }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const values = data.map(d => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const padding = range * 0.2; 
  
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((d.value - min + padding/2) / (range + padding)) * 100;
    return { x, y, ...d };
  });

  const polylinePoints = points.map(p => `${p.x},${p.y}`).join(' ');
  const areaPoints = `0,100 ${polylinePoints} 100,100`;

  return (
    <div className="w-full h-full relative group flex flex-col">
      <div className="flex-1 relative w-full">
          
          {/* Layer 1: SVG Graphics (Clipped to prevent spillover) */}
          <div className="absolute inset-0 w-full h-full overflow-hidden rounded-md">
             <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                {/* Grid lines */}
                {[25, 50, 75].map(y => (
                    <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" strokeDasharray="2 2" />
                ))}

                {/* Area Fill */}
                {isArea && (
                  <polygon 
                    points={areaPoints} 
                    fill="url(#gradient)" 
                    opacity="0.2" 
                    className="animate-fade-in-up-delay"
                  />
                )}

                {/* Line */}
                <path 
                  d={`M${points.map(p => `${p.x},${p.y}`).join(' L')}`} 
                  fill="none" 
                  stroke="#38bdf8" 
                  strokeWidth="2" 
                  vectorEffect="non-scaling-stroke"
                  pathLength="1"
                  strokeDasharray="1"
                  strokeDashoffset="1"
                  className="drop-shadow-[0_0_8px_rgba(56,189,248,0.5)] animate-draw"
                />

                {/* Definitions */}
                <defs>
                  <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>
                </defs>
             </svg>
          </div>

          {/* Layer 2: Interactive Points (Visible, not clipped) */}
          <div className="absolute inset-0 w-full h-full pointer-events-none">
              <div className="relative w-full h-full">
                  {points.map((p, i) => {
                      const align = p.x < 10 ? 'left' : p.x > 90 ? 'right' : 'center';
                      return (
                        <div 
                            key={i}
                            className="absolute w-4 h-full -ml-2 hover:z-20 flex items-center justify-center group/point cursor-crosshair pointer-events-auto"
                            style={{ left: `${p.x}%`, top: 0 }}
                            onMouseEnter={() => setHoveredIndex(i)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            {/* Visual Dot on the line */}
                            <div 
                                className={`absolute w-3 h-3 rounded-full border-2 border-pharma-accent bg-pharma-900 transition-all duration-200 ${hoveredIndex === i ? 'scale-150 bg-white border-white shadow-[0_0_15px_rgba(255,255,255,0.8)]' : 'scale-0'}`}
                                style={{ top: `${p.y}%`, marginTop: '-6px' }}
                            ></div>
                            
                            {/* Always visible small dot */}
                            <div 
                                className="absolute w-1.5 h-1.5 rounded-full bg-white transition-all duration-200 delay-[1s] animate-fade-in-up-delay"
                                style={{ top: `${p.y}%`, marginTop: '-3px' }}
                            ></div>

                            <CustomTooltip 
                                visible={hoveredIndex === i} 
                                value={p.value.toLocaleString()} 
                                label={p.label} 
                                x={50} // Relative to the point container
                                y={p.y} 
                                align={align}
                            />
                        </div>
                    )})}
              </div>
          </div>
      </div>

      {/* X Axis Labels */}
      <div className="h-6 w-full flex justify-between text-[10px] text-gray-500 mt-2 px-0 relative z-20">
          {data.map((d, i) => (
              <span key={i} className="text-center w-8 -ml-4 flex justify-center">{d.label}</span>
          ))}
      </div>
    </div>
  );
};
