import React, { useState } from 'react';
import {
  History,
  Bot,
  BarChart3,
  TrendingUp,
  Lock,
  Unlock,
  Send,
  Sparkles,
  ArrowRight,
  Download,
  CheckCircle2,
  Table as TableIcon,
  Search,
  Filter,
  FileText,
  Sliders,
  Layers,
  ChevronRight,
  ChevronDown,
  Building2,
  MapPin,
  Users,
  Compass,
  AlertCircle,
  HelpCircle,
  Bookmark,
  Share2,
  PieChart as PieIcon,
  LineChart as LineIcon,
  RotateCcw,
  Paperclip,
  Check,
  X,
  Play,
  Database,
  Calendar,
  Eye,
  Award,
  Zap,
  Info,
  Maximize2,
  Minimize2,
  Plus,
  Trash2,
  FolderOpen
} from 'lucide-react';
import { MOCK_HISTORICAL_ELECTIONS, CURRENT_ELECTION_CONTEXT, MOCK_BOOTHS, MOCK_VOTERS, MOCK_KARYAKARTAS } from '../../data/mockData';
import { useToast } from '../../components/common/Toast';

// ONLY TWO MODES ALLOWED IN THIS MODULE
export type ActiveModuleMode = 'LANDING' | 'MANUAL' | 'STRATEGIC_AI';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  timestamp: string;
  text: string;
  isSimulatedDemo?: boolean;
  dataSource?: string;
  scope?: string;
  tableData?: {
    heading: string;
    columns: string[];
    rows: (string | number)[][];
  };
  metrics?: { label: string; value: string; change?: string; positive?: boolean }[];
  followUpActions?: string[];
}

export const PreviousElectionView: React.FC = () => {
  const { showToast } = useToast();

  // Subscription Gate: Simulated toggle for testing
  const [isSubscriptionLocked, setIsSubscriptionLocked] = useState(false);

  // EXACTLY TWO MODES + Landing Screen
  const [activeMode, setActiveMode] = useState<ActiveModuleMode>('LANDING');

  // Selected Election for Historical Querying
  const [selectedElectionIndex, setSelectedElectionIndex] = useState<number>(0);
  const currentElection = MOCK_HISTORICAL_ELECTIONS[selectedElectionIndex];

  // =========================================================================
  // 1. MANUAL MODE STATE (Power BI Style Analytics Studio)
  // =========================================================================
  // Left Panel: Available Datasets
  const [selectedDatasetGroup, setSelectedDatasetGroup] = useState<
    'VOTERS' | 'HISTORICAL_ELECTIONS' | 'BOOTHS' | 'FIELD_OPS' | 'STRATEGY'
  >('HISTORICAL_ELECTIONS');

  // Top Configuration: Analysis Builder
  const [builderMetric, setBuilderMetric] = useState<string>('Vote Share (%)');
  const [builderDimension, setBuilderDimension] = useState<string>('By Booth');
  const [builderElectionYear, setBuilderElectionYear] = useState<string>('2019 Lok Sabha');
  const [builderChartType, setBuilderChartType] = useState<'BAR' | 'H_BAR' | 'LINE' | 'PIE' | 'TABLE' | 'KPI'>('BAR');

  // Dashboard Canvas: Multiple Interactive Widget Panels
  const [canvasPanels, setCanvasPanels] = useState<
    {
      id: string;
      title: string;
      dataset: string;
      type: 'BAR' | 'H_BAR' | 'LINE' | 'PIE' | 'TABLE' | 'KPI';
      metric: string;
      dimension: string;
      recordsCount: number;
    }[]
  >([
    {
      id: 'p-1',
      title: 'Historical Party Vote Share Comparison (2014 vs 2019)',
      dataset: 'Historical Elections',
      type: 'BAR',
      metric: 'Vote Share (%)',
      dimension: 'By Election Year',
      recordsCount: 1035654
    },
    {
      id: 'p-2',
      title: 'Booth Turnout Projection & Vulnerability Index',
      dataset: 'Booth Records',
      type: 'H_BAR',
      metric: 'Turnout Rate (%)',
      dimension: 'By Booth (#101 to #108)',
      recordsCount: 2045
    },
    {
      id: 'p-3',
      title: 'Voter Age Bracket Demographics Breakdown',
      dataset: 'Current Voter Database',
      type: 'PIE',
      metric: 'Elector Count',
      dimension: 'Age Bracket (18-25, 26-35, 36-50, 50+)',
      recordsCount: 248650
    }
  ]);

  // Saved Dashboards
  const [savedDashboards, setSavedDashboards] = useState([
    { id: 'sb-1', name: 'Constituency Historical Overview', panels: 3, date: '18-Apr-2024' },
    { id: 'sb-2', name: 'Booth Vulnerability & Swing Assessment', panels: 2, date: '16-Apr-2024' },
    { id: 'sb-3', name: 'Voter Demographic & Cadre Alignment', panels: 4, date: '12-Apr-2024' }
  ]);

  // =========================================================================
  // 2. STRATEGIC AI MODE STATE (ChatGPT-Style Dedicated Workspace)
  // =========================================================================
  const [aiConversations, setAiConversations] = useState<{ id: string; title: string; category: string; dateGroup: string }[]>([
    { id: 'c-01', title: 'Previous Election Comparison (2014 vs 2019)', category: 'Comparison', dateGroup: 'Today' },
    { id: 'c-02', title: 'Booth 101 to 108 Turnout Swing Analysis', category: 'Booth Intelligence', dateGroup: 'Today' },
    { id: 'c-03', title: 'Previous Campaign Strategy & Field Outcomes', category: 'Strategy Review', dateGroup: 'Yesterday' },
    { id: 'c-04', title: 'Overall Constituency Analysis & Operational Gaps', category: 'Planning', dateGroup: 'Previous 7 Days' },
    { id: 'c-05', title: 'Voter Age & Gender Demographic Breakdown', category: 'Demographics', dateGroup: 'Previous 30 Days' }
  ]);
  const [activeChatId, setActiveChatId] = useState<string>('c-01');

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'demo-welcome',
      sender: 'bot',
      timestamp: '10:00 AM',
      isSimulatedDemo: true,
      dataSource: 'ECI Official Kasba Peth Archives (2014 & 2019)',
      scope: '215 - Kasba Peth Assembly Segment',
      text: 'Namaskar! I am your Strategic AI Election Intelligence Assistant. I can analyze booth swing factors, historical party margins from 2009-2019, review documented campaign strategies, evaluate voter demographic distributions, and suggest evidence-based operational priorities.',
      metrics: [
        { label: 'Total Historical Votes Polled', value: '10,35,654' },
        { label: 'Winning Margin Lead', value: '+3,24,618', positive: true },
        { label: 'Constituency Turnout', value: '49.8%' }
      ],
      tableData: {
        heading: 'Illustrative Historical Election Comparison (2014 vs 2019)',
        columns: ['Metric', '2014 Lok Sabha', '2019 Lok Sabha', 'Net Delta'],
        rows: [
          ['Total Recorded Votes', '9,94,210', '10,35,654', '+41,444'],
          ['BJP Votes Polled', '5,69,825', '6,32,835', '+63,010 (+11.1%)'],
          ['INC Votes Polled', '2,54,056', '3,08,217', '+54,161 (+21.3%)'],
          ['Winning Candidate Vote Share', '57.3%', '61.1%', '+3.8%'],
          ['Runner-Up Vote Share', '25.5%', '29.8%', '+4.3%']
        ]
      },
      followUpActions: [
        'Analyze Booth 101 to 108 Swings',
        'Compare Party Vote Shares',
        'Review 2019 Campaign Strategies',
        'Generate Structured Strategy Brief'
      ]
    }
  ]);

  const [aiInput, setAiInput] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [thinkingStep, setThinkingStep] = useState('');

  // Handle Strategic AI Query Dispatch
  const handleSendAi = (text: string) => {
    if (!text.trim() || isSubscriptionLocked) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text
    };

    setChatMessages(prev => [...prev, userMsg]);
    setAiInput('');
    setIsAiThinking(true);
    setThinkingStep('Retrieving authorized election records & demographic matrices...');

    setTimeout(() => setThinkingStep('Cross-referencing historical booth swings and party trends...'), 400);

    setTimeout(() => {
      setIsAiThinking(false);
      const lower = text.toLowerCase();
      let reply: ChatMessage;

      if (lower.includes('booth') || lower.includes('swing')) {
        reply = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isSimulatedDemo: true,
          dataSource: 'ECI Official Booth Level Roll Archives (2019)',
          scope: 'Booths 101 to 108 (Kasba Peth)',
          text: 'Here is the comparative booth performance analysis. Booths 101 and 103 showed positive swing (+4% to +5%), while Booth 102 saw a 3% consolidation drop.',
          metrics: [
            { label: 'Booths Analyzed', value: '8 Booths' },
            { label: 'Highest Lead Booth', value: 'Booth #101 (+5.2%)', positive: true },
            { label: 'Swing Opportunity', value: 'Booth #102 (-3.1%)', positive: false }
          ],
          tableData: {
            heading: 'Booth Performance Comparison Table',
            columns: ['Booth No', 'Polling Station', '2014 Vote Share', '2019 Vote Share', 'Net Shift'],
            rows: [
              ['Booth #101', 'Navbharat High School, Room 1', '42.1%', '47.3%', '+5.2%'],
              ['Booth #102', 'Ganesh Krupa Bldg, Room 2', '51.4%', '48.3%', '-3.1%'],
              ['Booth #103', 'Swapnanagari Primary Hall', '39.0%', '43.2%', '+4.2%'],
              ['Booth #104', 'Karve Nagar Samaj Mandir', '46.0%', '46.1%', '+0.1%']
            ]
          },
          followUpActions: [
            'Inspect Booth #101 Demographics',
            'View Historical Turnout Trend',
            'Download PDF Dossier'
          ]
        };
      } else if (lower.includes('strategy') || lower.includes('plan')) {
        reply = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isSimulatedDemo: true,
          dataSource: 'Candidate Strategic Archives & Field Surveys',
          scope: 'Prabhaag 12 - Kothrud West',
          text: 'Reviewing documented historical strategies: Morning voter slip distribution and proactive wheelchair assistance for senior citizens correlated with 8.4% higher turnout in residential society pockets.',
          tableData: {
            heading: 'Historical Strategy Impact Assessment',
            columns: ['Strategy Initiative', 'Target Segment', 'Recorded Execution', 'Measured Turnout Impact'],
            rows: [
              ['Early Morning Slip Shuttles', 'Societies in Erandwane', '92% Slips Delivered', '+6.2% Early Turnout'],
              ['Basti Water Grievance Drive', 'Paud Phata Slum Clusters', '34 Civic Complaints Fixed', '+4.8% Local Sentiment'],
              ['WhatsApp Audio Broadcast', 'Women Beneficiaries', '15,000 Voice Blasts', '+3.1% Ladki Bahin Engagement']
            ]
          },
          followUpActions: ['Open Strategy Documents', 'Export Operational Priorities', 'Compare Other Wards']
        };
      } else {
        reply = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isSimulatedDemo: true,
          dataSource: 'Authorized Election & Demographic Repository',
          scope: '215 - Kasba Peth',
          text: `Based on your request "${text}", our strategic election intelligence engine synthesised relevant historical margins, turnout patterns, and voter classifications across the constituency.`,
          metrics: [
            { label: 'Electorate Scope', value: '2,48,650' },
            { label: 'Turnout Target 2024', value: '62.0%' },
            { label: 'Historical Baseline', value: '49.8%' }
          ],
          followUpActions: ['Compare 2014 vs 2019', 'Show Booth Breakdown', 'Generate Analysis']
        };
      }

      setChatMessages(prev => [...prev, reply]);
    }, 900);
  };

  // -------------------------------------------------------------
  // SUBSCRIPTION LOCKED SCREEN (Section 9)
  // -------------------------------------------------------------
  if (isSubscriptionLocked) {
    return (
      <div className="space-y-6 pb-16 animate-fade-in text-slate-800 dark:text-slate-100">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 text-center max-w-2xl mx-auto shadow-sm space-y-5 my-8">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300">
              Module Locked • Subscription Required
            </span>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-2">
              Previous Election & Strategy
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              Previous Election & Strategy is not included in your current subscription. Upgrade your candidate profile to unlock both <strong>Manual Mode</strong> (Power BI Analytics) and <strong>Strategic AI Mode</strong> (Conversational Election Intelligence).
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-left p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-blue-600" />
              <span>Manual Mode (Data Studio)</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-purple-600" />
              <span>Strategic AI Mode Assistant</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-blue-600" />
              <span>Historical Booth Analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-purple-600" />
              <span>Documented Strategy Records</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setIsSubscriptionLocked(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 border hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Demo Unlock (Test View)
            </button>
            <button
              onClick={() => showToast('Navigating to Subscription Plans module...', 'info')}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm"
            >
              View Eligible Plans & Upgrade
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16 animate-fade-in text-slate-800 dark:text-slate-100">
      {/* 1. Header with Candidate Context & Subscription Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Analytics & Strategy
            </span>
            <span className="text-slate-300 dark:text-slate-700">/</span>
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
              Previous Election & Strategy
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 ml-1">
              Active Tier
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Previous Election & Strategy
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Candidate: <span className="font-bold text-slate-800 dark:text-slate-200">Anand Shinde</span> • Constituency: <span className="font-bold text-blue-600 dark:text-blue-400">215 - Kasba Peth</span> • Data Updated: 18-Apr-2024
          </p>
        </div>

        {/* Mode Switcher / Home CTA */}
        <div className="flex items-center gap-2">
          {activeMode !== 'LANDING' && (
            <button
              onClick={() => setActiveMode('LANDING')}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Module Home</span>
            </button>
          )}

          <button
            onClick={() => setIsSubscriptionLocked(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700"
            title="Simulate locked subscription state"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Lock Test</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          MODULE LANDING PAGE (Section 2)
          Shows exactly TWO primary mode cards + Data Availability Overview
      ========================================================================= */}
      {activeMode === 'LANDING' && (
        <div className="space-y-6 animate-fade-in">
          {/* Two Primary Mode Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Mode 1: Manual Mode Card */}
            <div
              onClick={() => setActiveMode('MANUAL')}
              className="cursor-pointer p-6 rounded-3xl bg-gradient-to-br from-blue-900 via-slate-900 to-slate-950 text-white shadow-md border border-blue-500/30 hover:border-blue-400 transition flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 text-blue-300 flex items-center justify-center border border-white/20">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-200 border border-blue-400/30">
                    Mode 1 • Power BI Visual Workspace
                  </span>
                </div>

                <h2 className="text-xl font-black tracking-tight">Manual Mode – Election Analytics</h2>
                <p className="text-xs text-blue-200/90 mt-1 leading-relaxed">
                  "Explore all available historical election data, voter information, booth records and other authorized datasets. Build your own dashboards, charts, comparisons and reports."
                </p>

                <div className="grid grid-cols-2 gap-2 mt-4 text-[11px] font-semibold text-blue-100">
                  <div className="flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-blue-400" />
                    <span>Complete Data Explorer</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-blue-400" />
                    <span>Interactive Dashboards</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <LineIcon className="w-3.5 h-3.5 text-blue-400" />
                    <span>Custom Charts & Graphs</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <History className="w-3.5 h-3.5 text-blue-400" />
                    <span>Historical Election Comparisons</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-blue-400" />
                    <span>Booth & Locality Analysis</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Download className="w-3.5 h-3.5 text-blue-400" />
                    <span>Custom Reports & Exports</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs font-bold text-blue-300 group-hover:text-white transition">
                  Open Manual Mode
                </span>
                <ChevronRight className="w-4 h-4 text-blue-300 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Mode 2: Strategic AI Mode Card */}
            <div
              onClick={() => setActiveMode('STRATEGIC_AI')}
              className="cursor-pointer p-6 rounded-3xl bg-gradient-to-br from-purple-900 via-indigo-950 to-slate-900 text-white shadow-md border border-purple-500/30 hover:border-purple-400 transition flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 text-purple-300 flex items-center justify-center border border-white/20">
                    <Bot className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-200 border border-purple-400/30">
                    Mode 2 • Dedicated AI Assistant
                  </span>
                </div>

                <h2 className="text-xl font-black tracking-tight">Strategic AI – Election Intelligence Assistant</h2>
                <p className="text-xs text-purple-200/90 mt-1 leading-relaxed">
                  "Explore your constituency's historical election performance through a dedicated AI assistant. Ask questions, understand previous election outcomes, review documented strategies and receive evidence-based analytical insights."
                </p>

                <div className="grid grid-cols-2 gap-2 mt-4 text-[11px] font-semibold text-purple-100">
                  <div className="flex items-center gap-1.5">
                    <History className="w-3.5 h-3.5 text-purple-400" />
                    <span>Historical Election Analysis</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-purple-400" />
                    <span>Previous Strategy Analysis</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-purple-400" />
                    <span>Booth Performance Insights</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
                    <span>Election Trend Analysis</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Download className="w-3.5 h-3.5 text-purple-400" />
                    <span>AI-Generated Analytical Reports</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-purple-400" />
                    <span>Strategic Planning Support</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs font-bold text-purple-300 group-hover:text-white transition">
                  Open Strategic AI
                </span>
                <ChevronRight className="w-4 h-4 text-purple-300 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* Data Availability Overview (Section 2) */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Authorized Data Availability Overview
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Historical Elections</span>
                <div className="text-lg font-black text-slate-900 dark:text-white mt-0.5">3 Available</div>
                <span className="text-[10px] text-slate-500">2009, 2014, 2019</span>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] uppercase font-bold text-blue-600 block">Historical Booths</span>
                <div className="text-lg font-black text-blue-600 mt-0.5">2,045 Records</div>
                <span className="text-[10px] text-slate-500">With Turnout Matrix</span>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] uppercase font-bold text-purple-600 block">Current Voter Records</span>
                <div className="text-lg font-black text-purple-600 mt-0.5">2,48,650 Roll</div>
                <span className="text-[10px] text-slate-500">Kasba Peth Baseline</span>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Candidate & Parties</span>
                <div className="text-lg font-black text-slate-900 dark:text-white mt-0.5">42 Candidates</div>
                <span className="text-[10px] text-slate-500">8 Recognized Parties</span>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] uppercase font-bold text-amber-600 block">Strategy Documents</span>
                <div className="text-lg font-black text-amber-600 mt-0.5">3 Dossiers</div>
                <span className="text-[10px] text-slate-500">Documented Outcomes</span>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] uppercase font-bold text-blue-600 block">Field Ops & Cadre</span>
                <div className="text-lg font-black text-blue-600 mt-0.5">4,850 Workers</div>
                <span className="text-[10px] text-slate-500">Survey History</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODE 1: MANUAL MODE — COMPLETE DATA ANALYTICS WORKSPACE (Section 3)
          Contains: Left Data Explorer + Top Analysis Builder + Dashboard Canvas
      ========================================================================= */}
      {activeMode === 'MANUAL' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col md:flex-row h-[82vh] animate-fade-in">
          {/* A. Data Explorer – Left Collapsible Panel (280px) (Section 3.3) */}
          <div className="w-full md:w-72 bg-slate-50 dark:bg-slate-950/70 border-r border-slate-200 dark:border-slate-800 p-4 flex flex-col justify-between shrink-0 overflow-y-auto scrollbar-thin">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900 dark:text-white">
                  <Database className="w-4 h-4 text-blue-600" />
                  <span>Available Data Explorer</span>
                </div>
                <span className="text-[10px] text-slate-400">5 Repositories</span>
              </div>

              {/* Logical Dataset Groups */}
              <div className="space-y-2">
                {[
                  {
                    id: 'HISTORICAL_ELECTIONS',
                    title: 'Historical Election Database',
                    desc: '2009, 2014, 2019 Results, Margins, Votes Polled & Turnouts'
                  },
                  {
                    id: 'VOTERS',
                    title: 'Current Voter Database',
                    desc: '2,48,650 Electors, Age, Gender, Caste, Occupation, Visited'
                  },
                  {
                    id: 'BOOTHS',
                    title: 'Booth & Geographic Data',
                    desc: '2,045 Polling Booths, Stations, Polygons & Vulnerability'
                  },
                  {
                    id: 'FIELD_OPS',
                    title: 'User & Field Operations',
                    desc: '4,850 Karyakartas, Survey Activity, Slip Deliveries'
                  },
                  {
                    id: 'STRATEGY',
                    title: 'Campaign & Strategy Records',
                    desc: 'Archived Strategies, Padayatra Logs & Outcome Evidence'
                  }
                ].map(ds => (
                  <div
                    key={ds.id}
                    onClick={() => setSelectedDatasetGroup(ds.id as any)}
                    className={`cursor-pointer p-3 rounded-xl border text-xs transition ${
                      selectedDatasetGroup === ds.id
                        ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-400 font-bold text-blue-900 dark:text-blue-200'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="font-bold">{ds.title}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">{ds.desc}</div>
                  </div>
                ))}
              </div>

              {/* Saved Dashboards Quick Reopen (Section 3.6) */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Saved Dashboards
                </span>
                {savedDashboards.map(s => (
                  <div
                    key={s.id}
                    onClick={() => showToast(`Restored "${s.name}" with latest permitted records.`, 'success')}
                    className="cursor-pointer p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs flex items-center justify-between hover:border-blue-400"
                  >
                    <span className="truncate font-medium">{s.name}</span>
                    <span className="text-[9px] text-slate-400 shrink-0">{s.panels} panels</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-2.5 bg-blue-50/60 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-900 text-[10px] text-blue-900 dark:text-blue-200">
              <span className="font-bold block">Power BI Mode Active</span>
              <span>All datasets bound to 215 - Kasba Peth scope.</span>
            </div>
          </div>

          {/* B & C. Main Area: Top Analysis Builder + Interactive Dashboard Canvas */}
          <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-slate-900">
            {/* Top Analysis Builder Configuration Bar (Section 3.4) */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div>
                  <h3 className="font-black text-slate-900 dark:text-white">
                    Manual Analysis Builder
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    Source: <span className="font-bold text-blue-600">{selectedDatasetGroup}</span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const newPanel = {
                        id: `p-${Date.now()}`,
                        title: `${builderMetric} ${builderDimension} (${selectedDatasetGroup})`,
                        dataset: selectedDatasetGroup,
                        type: builderChartType,
                        metric: builderMetric,
                        dimension: builderDimension,
                        recordsCount: 2045
                      };
                      setCanvasPanels(prev => [newPanel, ...prev]);
                      showToast(`Added "${newPanel.title}" to Dashboard Canvas.`, 'success');
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Panel to Canvas</span>
                  </button>

                  <button
                    onClick={() => showToast('Exporting complete dashboard as formatted PDF report...', 'info')}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export Dashboard</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Builder Dropdowns */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Target Metric</label>
                  <select
                    value={builderMetric}
                    onChange={e => setBuilderMetric(e.target.value)}
                    className="w-full p-2 rounded-xl border bg-white dark:bg-slate-900 font-semibold"
                  >
                    <option>Vote Share (%)</option>
                    <option>Total Votes Polled</option>
                    <option>Winning Margin</option>
                    <option>Turnout Rate (%)</option>
                    <option>Voter Demographics Count</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Dimension Grouping</label>
                  <select
                    value={builderDimension}
                    onChange={e => setBuilderDimension(e.target.value)}
                    className="w-full p-2 rounded-xl border bg-white dark:bg-slate-900 font-semibold"
                  >
                    <option>By Booth (#101 to #108)</option>
                    <option>By Assembly Ward</option>
                    <option>By Political Party</option>
                    <option>By Election Year</option>
                    <option>By Age Bracket</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Historical Scope</label>
                  <select
                    value={builderElectionYear}
                    onChange={e => setBuilderElectionYear(e.target.value)}
                    className="w-full p-2 rounded-xl border bg-white dark:bg-slate-900 font-semibold"
                  >
                    <option>2019 Lok Sabha (General Polls)</option>
                    <option>2014 Lok Sabha (General Polls)</option>
                    <option>2009 Lok Sabha (General Polls)</option>
                    <option>Multi-Year Cross Comparison</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Visualization Format</label>
                  <div className="flex items-center gap-1">
                    {[
                      { id: 'BAR', label: 'Bar' },
                      { id: 'H_BAR', label: 'Horiz' },
                      { id: 'PIE', label: 'Pie' },
                      { id: 'LINE', label: 'Trend' },
                      { id: 'TABLE', label: 'Table' }
                    ].map(fmt => (
                      <button
                        key={fmt.id}
                        onClick={() => setBuilderChartType(fmt.id as any)}
                        className={`flex-1 py-1 rounded-lg text-[10px] font-bold border transition ${
                          builderChartType === fmt.id
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {fmt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Dashboard Canvas (Section 3.5) */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Dashboard Canvas ({canvasPanels.length} Active Panels)</span>
                <span>Click panel controls to switch chart types, drill down, or export.</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {canvasPanels.map(panel => (
                  <div
                    key={panel.id}
                    className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {panel.dataset}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => showToast(`Exporting ${panel.title} as image...`, 'info')}
                            className="p-1 text-slate-400 hover:text-blue-600"
                            title="Export"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setCanvasPanels(prev => prev.filter(p => p.id !== panel.id))}
                            className="p-1 text-slate-400 hover:text-rose-600"
                            title="Remove Panel"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <h4 className="font-bold text-xs text-slate-900 dark:text-white mb-1">{panel.title}</h4>
                      <p className="text-[10px] text-slate-400 mb-3">{panel.metric} • {panel.dimension}</p>

                      {/* Mock Chart Render */}
                      <div className="space-y-2 py-2">
                        {[
                          { label: 'BJP (Girish Bapat)', val: 61.1, text: '61.1% (6.32L votes)', color: 'bg-blue-600' },
                          { label: 'INC (Mohan Joshi)', val: 29.8, text: '29.8% (3.08L votes)', color: 'bg-blue-400' },
                          { label: 'VBA (Anil Jadhav)', val: 6.2, text: '6.2% (64k votes)', color: 'bg-purple-600' }
                        ].map((row, idx) => (
                          <div key={idx} className="space-y-0.5 text-[11px]">
                            <div className="flex justify-between">
                              <span className="font-medium text-slate-700 dark:text-slate-300">{row.label}</span>
                              <span className="font-bold">{row.text}</span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                              <div className={`${row.color} h-full`} style={{ width: `${row.val}%` }}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                      <span>{panel.recordsCount.toLocaleString()} Records Analyzed</span>
                      <button
                        onClick={() => showToast(`Opened drill-down table for ${panel.title}`, 'info')}
                        className="font-bold text-blue-600 hover:underline"
                      >
                        Drill Down
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODE 2: STRATEGIC AI MODE — DEDICATED ELECTION INTELLIGENCE (Section 4 & 5)
          Full-page ChatGPT-style interface (Sidebar + Chat Area + Composer)
      ========================================================================= */}
      {activeMode === 'STRATEGIC_AI' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col md:flex-row h-[82vh] animate-fade-in">
          {/* A. Left Sidebar – Conversation History (270px) (Section 4.2) */}
          <div className="w-full md:w-68 bg-slate-50 dark:bg-slate-950/70 border-r border-slate-200 dark:border-slate-800 p-4 flex flex-col justify-between shrink-0">
            <div className="space-y-3">
              <button
                onClick={() => {
                  setChatMessages([]);
                  showToast('Started fresh strategic AI inquiry.', 'info');
                }}
                className="w-full py-2 px-3 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-xs flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>New Strategy Inquiry</span>
              </button>

              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider px-1">
                Strategy Conversation History
              </div>

              <div className="space-y-1 overflow-y-auto max-h-[52vh] scrollbar-thin">
                {aiConversations.map(c => (
                  <div
                    key={c.id}
                    onClick={() => setActiveChatId(c.id)}
                    className={`cursor-pointer p-2 rounded-xl text-xs transition ${
                      activeChatId === c.id
                        ? 'bg-purple-100 dark:bg-purple-950/60 font-bold text-purple-900 dark:text-purple-200 border border-purple-200 dark:border-purple-800'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="truncate">{c.title}</div>
                    <div className="text-[9px] text-slate-400 flex items-center justify-between mt-0.5">
                      <span>{c.category}</span>
                      <span>{c.dateGroup}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Scope & Context Card */}
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-[10px] space-y-1">
              <div className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Database className="w-3 h-3 text-purple-600" />
                <span>Strategy AI Context</span>
              </div>
              <p className="text-slate-500 leading-tight">
                Authorized: Kasba Peth | 2009-2019 Polls | Current Voter Roll | Past Strategy Records
              </p>
            </div>
          </div>

          {/* B. Main Chat Area & Composer */}
          <div className="flex-1 flex flex-col justify-between overflow-hidden bg-white dark:bg-slate-900">
            {/* Top Chat Header */}
            <div className="p-3.5 px-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Bot className="w-4 h-4 text-purple-600" />
                  Strategic AI – Election Intelligence Assistant
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200">
                  Illustrative Demo Data Active
                </span>
              </div>
              <span className="text-[11px] text-slate-400">Context: Authorized Kasba Peth Repositories</span>
            </div>

            {/* Message Thread Scrollable */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {chatMessages.length === 0 ? (
                /* Welcome Screen with Grouped Suggested Prompts (Section 4.3) */
                <div className="max-w-2xl mx-auto py-8 text-center space-y-5">
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-slate-900 dark:text-white">
                      "Your Election Intelligence Assistant"
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl mx-auto">
                      Explore historical election records, understand booth performance, compare candidates and parties, and review previous campaign strategies. Ask a question and receive clear, data-supported analysis.
                    </p>
                  </div>

                  {/* 5 Topic Suggested Prompts */}
                  <div className="grid grid-cols-2 gap-2 text-left">
                    {[
                      { cat: 'Historical Comparison', q: 'Compare the previous two elections in my constituency.' },
                      { cat: 'Booth Performance', q: 'Show me the major historical changes across booths.' },
                      { cat: 'Strategy Intelligence', q: 'What strategies and campaign activities were documented in the previous election?' },
                      { cat: 'Constituency Overview', q: 'Prepare an overall historical analysis for my constituency.' },
                      { cat: 'Voter Demographics', q: 'Show voter distribution by age and gender across booths.' },
                      { cat: 'Candidate Comparison', q: 'Compare candidate vote totals and victory margins.' }
                    ].map((s, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleSendAi(s.q)}
                        className="cursor-pointer p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-purple-400 bg-slate-50 dark:bg-slate-800/40 transition"
                      >
                        <span className="text-[9px] uppercase font-bold text-purple-600 block">{s.cat}</span>
                        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">"{s.q}"</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                chatMessages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} space-y-1.5`}
                  >
                    <div
                      className={`max-w-2xl p-4 rounded-2xl text-xs leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-blue-600 text-white rounded-br-xs'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-bl-xs border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {/* Demo Data Disclaimer (Section 7) */}
                      {msg.isSimulatedDemo && (
                        <div className="text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/60 px-2 py-0.5 rounded-md mb-2 flex items-center gap-1">
                          <Info className="w-3 h-3" />
                          <span>Illustrative Demo Data – Not Actual Election Results</span>
                        </div>
                      )}

                      <p className="font-medium">{msg.text}</p>

                      {/* Summary Metrics Cards */}
                      {msg.metrics && (
                        <div className="grid grid-cols-3 gap-2 my-3">
                          {msg.metrics.map((m, i) => (
                            <div key={i} className="p-2 bg-white dark:bg-slate-900 rounded-xl border text-center">
                              <span className="text-[9px] uppercase font-bold text-slate-400 block">{m.label}</span>
                              <span className="font-bold text-xs text-slate-900 dark:text-white">{m.value}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Rich Comparison Table */}
                      {msg.tableData && (
                        <div className="my-3 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-900">
                          <div className="p-2 px-3 bg-slate-100 dark:bg-slate-800 font-bold text-[10px] uppercase text-slate-600 dark:text-slate-300">
                            {msg.tableData.heading}
                          </div>
                          <div className="overflow-x-auto">
                            <table className="w-full text-left text-[11px]">
                              <thead>
                                <tr className="border-b border-slate-200 dark:border-slate-700 text-[10px] text-slate-400">
                                  {msg.tableData.columns.map((col, idx) => (
                                    <th key={idx} className="py-1.5 px-2.5">
                                      {col}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {msg.tableData.rows.map((row, rIdx) => (
                                  <tr key={rIdx}>
                                    {row.map((cell, cIdx) => (
                                      <td key={cIdx} className="py-1.5 px-2.5 font-medium">
                                        {cell}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {/* Contextual Follow-Up Buttons */}
                      {msg.followUpActions && (
                        <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-700 flex flex-wrap gap-1.5">
                          {msg.followUpActions.map((act, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleSendAi(act)}
                              className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 hover:bg-purple-100"
                            >
                              {act}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 px-1">{msg.timestamp}</span>
                  </div>
                ))
              )}

              {/* AI Thinking Step Indicator */}
              {isAiThinking && (
                <div className="flex items-center gap-2 text-xs text-purple-600 font-medium animate-pulse">
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>{thinkingStep}</span>
                </div>
              )}
            </div>

            {/* Bottom Message Composer (Section 4.2) */}
            <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900">
              <div className="relative flex items-center">
                <textarea
                  rows={2}
                  value={aiInput}
                  onChange={e => setAiInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendAi(aiInput);
                    }
                  }}
                  placeholder="Ask Strategic AI about historical election margins, booth swings, voter demographics, or past campaign strategies... (Shift+Enter for newline)"
                  className="w-full p-3 pr-28 rounded-2xl text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  disabled={!aiInput.trim() || isAiThinking}
                  onClick={() => handleSendAi(aiInput)}
                  className="absolute right-3 px-4 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-40 transition shadow-sm flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Ask AI</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
