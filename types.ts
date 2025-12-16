
export enum AgentStatus {
  IDLE = 'IDLE',
  WORKING = 'WORKING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

export enum AgentType {
  MASTER = 'MASTER',
  CLINICAL = 'CLINICAL',
  PATENT = 'PATENT',
  MARKET = 'MARKET',
  TRADE = 'TRADE',
  WEB = 'WEB',
  REPORT = 'REPORT'
}

export type DashboardTab = 'overview' | 'clinical' | 'patent' | 'market' | 'web' | 'report';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | 'UNKNOWN';
export type Outlook = 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE' | 'MIXED' | 'UNKNOWN';

export interface ChartDataPoint {
  name: string;
  value: number;
  label?: string; // Unit or suffix like '%' or 'USD'
  trend?: 'up' | 'down' | 'stable';
}

export type ChartType = 'BAR' | 'LINE' | 'AREA';

export interface ChartDataSeries {
  label: string;
  value: number;
}

export interface AgentChart {
  title: string;
  type: ChartType;
  data: ChartDataSeries[];
  xAxisLabel?: string;
  yAxisLabel?: string;
}

export interface WorkerAgentOutput {
  id: string;
  agentName: string;
  agentType: AgentType;
  description: string;
  findings: string; // Markdown supported (tables, lists)
  keyMetrics?: ChartDataPoint[]; // Structured data for visual cards
  charts?: AgentChart[]; // New field for detailed visualizations
  riskLevel?: RiskLevel;
  outlook?: Outlook;
  status: AgentStatus;
}

export interface FinalReportSection {
  title: string;
  content: string;
}

export interface InnovationReport {
  executiveSummary: string;
  sections: FinalReportSection[];
  recommendation: string;
}

export interface DecisionMetrics {
  clinicalReadiness: 'High' | 'Medium' | 'Low';
  patentRisk: 'Low' | 'Medium' | 'High';
  commercialScore: number; // 0-10
}

export interface PharmaAnalysisResult {
  taskDecomposition: {
    strategy: string;
    activatedAgents: string[];
  };
  decisionSupport: DecisionMetrics;
  agentOutputs: WorkerAgentOutput[];
  finalReport: InnovationReport;
}

export const INITIAL_AGENTS: WorkerAgentOutput[] = [
  {
    id: '1',
    agentName: 'Clinical Trials Agent',
    agentType: AgentType.CLINICAL,
    description: 'Scanning ClinicalTrials.gov and PubMed for ongoing studies and efficacy data.',
    findings: '',
    status: AgentStatus.IDLE
  },
  {
    id: '2',
    agentName: 'Patent Landscape Agent',
    agentType: AgentType.PATENT,
    description: 'Analyzing USPTO/EPO databases for IP exclusivity and expiry dates.',
    findings: '',
    status: AgentStatus.IDLE
  },
  {
    id: '3',
    agentName: 'IQVIA Market Insights Agent',
    agentType: AgentType.MARKET,
    description: 'Simulating market sizing and prescription volume analysis.',
    findings: '',
    status: AgentStatus.IDLE
  },
  {
    id: '4',
    agentName: 'EXIM Trade Trends Agent',
    agentType: AgentType.TRADE,
    description: 'Evaluating API sourcing, supply chain risks, and export/import volumes.',
    findings: '',
    status: AgentStatus.IDLE
  },
  {
    id: '5',
    agentName: 'Web Intelligence Agent',
    agentType: AgentType.WEB,
    description: 'Scraping latest news, competitor press releases, and forum discussions.',
    findings: '',
    status: AgentStatus.IDLE
  }
];
