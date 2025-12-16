
import React, { useState, useRef, useEffect } from 'react';
import { marked } from 'marked';
import { Logo } from './components/Logo';
import { AgentCard } from './components/AgentCard';
import { ReportView } from './components/ReportView';
import { DecisionMatrix } from './components/DecisionMatrix';
import { DiscoverySteps } from './components/DiscoverySteps';
import { OrchestrationLoader } from './components/OrchestrationLoader';
import { analyzeDrug } from './services/geminiService';
import { PharmaAnalysisResult, AgentStatus, DashboardTab, AgentType } from './types';

const TABS: { id: DashboardTab; label: string; icon: string }[] = [
  { id: 'overview', label: 'Overview', icon: '🚀' },
  { id: 'clinical', label: 'Clinical Data', icon: '🏥' },
  { id: 'patent', label: 'Patent & IP', icon: '⚖️' },
  { id: 'market', label: 'Market & Trade', icon: '📊' },
  { id: 'web', label: 'Web Intel', icon: '🌐' },
  { id: 'report', label: 'Final Report', icon: '📑' },
];

const HOMEPAGE_BENEFITS = [
  {
    title: "Accelerated Target Validation",
    description: "Reduce early-stage validation cycles by 60% through autonomous clinical data synthesis."
  },
  {
    title: "Integrated Risk Intelligence",
    description: "Simultaneously evaluate IP landscape, regulatory pathways, and market viability."
  },
  {
    title: "Data-Driven Decision Support",
    description: "Transform unstructured biomedical data into structured, board-ready strategic assets."
  }
];

function App() {
  const [query, setQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<PharmaAnalysisResult | null>(null);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [isDownloading, setIsDownloading] = useState(false);
  const [workflowStep, setWorkflowStep] = useState(0); // 0: Idle, 1: Input, etc.
  
  // Ref for auto-scrolling to results
  const resultsRef = useRef<HTMLDivElement>(null);
  // Ref for the report container
  const reportContainerRef = useRef<HTMLDivElement>(null);

  const resetApp = () => {
    setResult(null);
    setQuery('');
    setIsAnalyzing(false);
    setLoadingStep('');
    setWorkflowStep(0);
    setActiveTab('overview');
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsAnalyzing(true);
    setResult(null);
    setLoadingStep('Initializing Master Agent...');
    setWorkflowStep(2); // Start orchestration
    setActiveTab('overview');

    try {
      const stepTimer = setInterval(() => {
         setLoadingStep(prev => {
             if (prev.includes('Master')) {
                 setWorkflowStep(2);
                 return 'Decomposing Tasks...';
             }
             if (prev.includes('Decomposing')) {
                 setWorkflowStep(3);
                 return 'Dispatching Worker Agents...';
             }
             if (prev.includes('Dispatching')) {
                 setWorkflowStep(3);
                 return 'Gathering Clinical Data...';
             }
             if (prev.includes('Gathering')) {
                 setWorkflowStep(4);
                 return 'Synthesizing Market Intelligence...';
             }
             setWorkflowStep(5);
             return 'Finalizing Report...';
         });
      }, 2500);

      const data = await analyzeDrug(query);
      
      clearInterval(stepTimer);
      setResult(data);
      setIsAnalyzing(false);
      setWorkflowStep(5); // Complete
      
      // Scroll to results after a short delay for render
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);

    } catch (error) {
      console.error(error);
      setIsAnalyzing(false);
      setWorkflowStep(0); // Reset on error
      setLoadingStep('Error encountered. Please try again.');
    }
  };

  const handleDownloadPDF = async () => {
    if (!reportContainerRef.current) return;
    
    setIsDownloading(true);
    const element = reportContainerRef.current;
    
    const opt = {
      margin: [10, 10, 10, 10], // top, left, bottom, right
      filename: `AI-PharmaX_Report_${new Date().toISOString().split('T')[0]}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
      // @ts-ignore
      const html2pdf = window.html2pdf;
      if (typeof html2pdf !== 'function') {
        throw new Error('html2pdf library not loaded');
      }
      await html2pdf().set(opt).from(element).save();
    } catch (e) {
      console.error("PDF generation failed", e);
      alert("Failed to generate PDF. Please use the browser print option.");
    } finally {
      setIsDownloading(false);
    }
  };

  const getActiveAgents = () => {
    if (!result) return [];
    
    switch (activeTab) {
      case 'clinical':
        return result.agentOutputs.filter(a => a.agentType === AgentType.CLINICAL);
      case 'patent':
        return result.agentOutputs.filter(a => a.agentType === AgentType.PATENT);
      case 'market':
        return result.agentOutputs.filter(a => a.agentType === AgentType.MARKET || a.agentType === AgentType.TRADE);
      case 'web':
        return result.agentOutputs.filter(a => a.agentType === AgentType.WEB);
      default:
        return result.agentOutputs; // Overview shows summary or select few? 
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden text-slate-200 selection:bg-pharma-accent selection:text-white">
      {/* Background Elements */}
      <div className="fixed inset-0 bg-grid-pattern pointer-events-none z-0"></div>
      
      {/* Navigation / Header */}
      <nav className="fixed w-full border-b border-white/5 bg-pharma-950/80 backdrop-blur-xl z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div 
              onClick={resetApp}
              className="flex items-center gap-4 cursor-pointer group"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-pharma-accent/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <Logo className="relative w-10 h-10 drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight group-hover:text-pharma-accent transition-colors duration-300">AI-PharmaX</h1>
                <p className="text-[10px] text-pharma-accent font-medium tracking-widest uppercase opacity-80">Enterprise R&D System</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-xs font-mono text-gray-400">System Online</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        
        {/* Search / Input Section */}
        <div className={`transition-all duration-1000 ease-in-out transform ${result ? 'mb-12 opacity-100 scale-100' : 'min-h-[60vh] flex flex-col justify-center'}`}>
          <div className="max-w-4xl mx-auto text-center">
            
            {/* Title Section - Only visible on Homepage */}
            {!result && !isAnalyzing && (
                <div className="animate-fade-in-up mb-16">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pharma-accent/10 border border-pharma-accent/20 text-pharma-accent text-sm font-medium mb-8">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                    </span>
                    Agentic Reasoning Engine v2.4
                  </div>
                  <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6 leading-tight">
                    Drug Repurposing <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-pharma-accent to-blue-500">Intelligence Dashboard</span>
                  </h2>
                </div>
            )}

            {/* Workflow Visualizer (Static or Active) */}
            <div className={`transition-all duration-700 mb-10 ${result || isAnalyzing ? 'opacity-100 translate-y-0' : 'opacity-80 hover:opacity-100'}`}>
                <DiscoverySteps currentStep={isAnalyzing || result ? workflowStep : 1} />
            </div>

            {/* Search Input */}
            <form onSubmit={handleSearch} className={`relative group max-w-2xl mx-auto w-full transition-all duration-500 ${result ? 'scale-90' : ''}`}>
              <div className="absolute -inset-1 bg-gradient-to-r from-pharma-accent via-blue-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-60 transition duration-1000"></div>
              <div className="relative flex items-center bg-pharma-900/90 backdrop-blur-xl rounded-xl border border-white/10 p-2 shadow-2xl">
                <div className="pl-4 text-gray-400">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Analyze molecule (e.g., 'Metformin for Anti-Aging')"
                  className="w-full bg-transparent text-white placeholder-gray-500 border-none rounded-lg py-4 px-4 text-lg focus:outline-none focus:ring-0"
                  disabled={isAnalyzing}
                />
                <button
                  type="submit"
                  disabled={isAnalyzing || !query.trim()}
                  className="bg-pharma-accent hover:bg-sky-400 text-white font-semibold py-3 px-8 rounded-lg transition-all shadow-lg shadow-pharma-accent/20 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {isAnalyzing ? 'Analyzing...' : 'Launch Agents'}
                </button>
              </div>
            </form>

            {/* Benefits Section - Only visible on Homepage */}
            {!result && !isAnalyzing && (
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 text-left animate-fade-in-up-delay">
                  {HOMEPAGE_BENEFITS.map((benefit, idx) => (
                    <div 
                      key={idx} 
                      className="group bg-white/5 border border-white/5 p-6 rounded-xl hover:bg-white/10 transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="mb-4 w-10 h-1 bg-gradient-to-r from-pharma-accent to-transparent rounded-full group-hover:w-full transition-all duration-500"></div>
                      <h3 className="text-lg font-bold text-white mb-2 font-serif">{benefit.title}</h3>
                      <p className="text-sm text-gray-400 leading-relaxed">{benefit.description}</p>
                    </div>
                  ))}
               </div>
            )}

          </div>
        </div>

        {/* Loading State - Agent Orchestration */}
        {isAnalyzing && (
          <div className="mt-8 mb-20">
             <OrchestrationLoader status={loadingStep} />
          </div>
        )}

        {/* Dashboard Results */}
        {result && (
          <div ref={resultsRef} className="animate-fade-in pb-20">
            
            {/* Tab Navigation */}
            <div className="sticky top-20 z-40 bg-pharma-950/80 backdrop-blur-md border-b border-white/5 mb-8 -mx-4 px-4 md:-mx-8 md:px-8">
                <div className="flex overflow-x-auto gap-2 py-4 no-scrollbar max-w-7xl mx-auto">
                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap border ${
                                activeTab === tab.id 
                                ? 'bg-pharma-accent text-pharma-950 border-pharma-accent shadow-[0_0_20px_rgba(56,189,248,0.3)]' 
                                : 'bg-white/5 text-gray-400 border-white/5 hover:bg-white/10 hover:text-white'
                            }`}
                        >
                            <span>{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Overview Tab Content (Summary + Decomposition) */}
            {activeTab === 'overview' && (
                <div className="space-y-8 animate-fade-in-up">
                    <section className="glass-panel rounded-2xl p-1 bg-gradient-to-b from-white/10 to-transparent">
                        <div className="bg-pharma-950/80 rounded-xl p-8 backdrop-blur-sm">
                            <div className="flex flex-col md:flex-row items-start gap-8">
                                <div className="hidden md:flex flex-col items-center gap-3">
                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-pharma-accent/20 to-blue-600/20 flex items-center justify-center border border-pharma-accent/30 shadow-[0_0_30px_rgba(56,189,248,0.15)]">
                                    <Logo className="w-8 h-8 text-pharma-accent" />
                                </div>
                                <div className="h-full w-px bg-gradient-to-b from-pharma-accent/30 to-transparent min-h-[100px]"></div>
                                </div>
                                
                                <div className="flex-1">
                                    <div className="flex flex-col xl:flex-row gap-6 items-start">
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-xs font-bold text-pharma-accent uppercase tracking-[0.2em] mb-2">Master Agent Strategy</h3>
                                            <h2 className="text-2xl font-bold text-white mb-6">Task Decomposition Analysis</h2>
                                            <div 
                                                className="prose prose-invert prose-lg max-w-none text-gray-300 bg-black/20 p-6 rounded-xl border border-white/5 prose-p:leading-relaxed prose-p:font-light"
                                                dangerouslySetInnerHTML={{ __html: marked.parse(result.taskDecomposition.strategy) as string }}
                                            />
                                        </div>
                                        
                                        {/* Active Agents Side Panel - No overlapping */}
                                        <div className="w-full xl:w-72 flex-shrink-0">
                                            <div className="bg-pharma-900/40 rounded-xl border border-white/10 p-5 backdrop-blur-md">
                                                <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-white/5 pb-2">
                                                    Active Worker Agents
                                                </h4>
                                                <div className="space-y-2.5">
                                                    {result.taskDecomposition.activatedAgents.map((agent, i) => (
                                                        <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/5 border border-white/5 text-xs text-gray-200 transition-all hover:bg-white/10 hover:border-pharma-accent/20 hover:translate-x-1">
                                                            <div className="relative flex-shrink-0">
                                                                <span className="w-2 h-2 rounded-full bg-emerald-400 block shadow-[0_0_8px_rgba(16,185,129,0.4)]"></span>
                                                                <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75"></span>
                                                            </div>
                                                            <span className="font-medium truncate">{agent}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Risk & Opportunity Scoring View */}
                    <section>
                       <div className="flex items-center gap-3 mb-4">
                          <h3 className="text-sm font-bold text-pharma-accent uppercase tracking-widest">Decision Support Matrix</h3>
                          <div className="h-px bg-white/10 flex-1"></div>
                       </div>
                       <DecisionMatrix metrics={result.decisionSupport} />
                    </section>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Quick Stats or Cards for Overview could go here */}
                         {result.agentOutputs.slice(0, 3).map((agent) => (
                             <AgentCard key={agent.id} agent={agent} />
                         ))}
                    </div>
                </div>
            )}

            {/* Agent Specific Tabs */}
            {(activeTab === 'clinical' || activeTab === 'patent' || activeTab === 'market' || activeTab === 'web') && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in-up">
                     {getActiveAgents().length > 0 ? (
                        getActiveAgents().map((agent) => (
                            <AgentCard key={agent.id} agent={agent} />
                        ))
                     ) : (
                         <div className="col-span-full text-center py-20 text-gray-500">
                             No agents active for this category.
                         </div>
                     )}
                </div>
            )}

            {/* Report Tab */}
            {activeTab === 'report' && (
                <div className="animate-fade-in-up">
                    <div className="flex justify-end mb-4">
                        <button 
                            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm font-medium disabled:opacity-50"
                            onClick={handleDownloadPDF}
                            disabled={isDownloading}
                        >
                            {isDownloading ? (
                                <>
                                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  Generating PDF...
                                </>
                            ) : (
                                <>
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                  Download PDF
                                </>
                            )}
                        </button>
                    </div>
                    <div ref={reportContainerRef}>
                       <ReportView report={result.finalReport} agents={result.agentOutputs} />
                    </div>
                </div>
            )}

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-pharma-950/50 backdrop-blur-lg mt-auto py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-600 text-xs font-mono">
            AI-PharmaX Enterprise System | Secure Enclave | v2.4.0
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
