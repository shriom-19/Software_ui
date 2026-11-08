import React, { useState, useMemo } from 'react';
import {
  FileBarChart2,
  Download,
  Filter,
  Layers,
  FileSpreadsheet,
  PieChart,
  Calendar,
  CheckCircle2,
  Eye,
  Sparkles,
  ArrowRight,
  Database,
  Search,
  RefreshCw,
  Clock,
  AlertTriangle,
  XCircle,
  FileText,
  User,
  Users,
  Check,
  X,
  Play,
  RotateCcw,
  Trash2,
  Share2,
  ChevronRight,
  CheckSquare,
  Square,
  Settings,
  Sliders,
  Send,
  HelpCircle,
  BarChart3,
  Building2,
  Megaphone,
  Vote,
  Compass,
  ArrowUpDown
} from 'lucide-react';
import { useToast } from '../../components/common/Toast';
import {
  CURRENT_ELECTION_CONTEXT,
  MOCK_BOOTHS,
  MOCK_VOTERS,
  MOCK_USERS,
  MOCK_KARYAKARTAS,
  MOCK_CAMPAIGNS,
  MOCK_TICKETS,
  MOCK_UPDATE_REQUESTS
} from '../../data/mockData';

// Types
export type ReportCategory =
  | 'VOTER'
  | 'USER'
  | 'BOOTH'
  | 'CAMPAIGN'
  | 'SURVEY'
  | 'ISSUES'
  | 'VOTER_SLIPS'
  | 'ELECTION_ANALYTICS';

export interface PredefinedReportDef {
  id: string;
  title: string;
  category: ReportCategory;
  categoryLabel: string;
  desc: string;
  defaultDataSource: string;
  defaultScope: string;
  defaultFormat: 'PDF' | 'XLSX' | 'CSV';
  estimatedRecords: string;
  suggestedColumns: string[];
}

export interface GeneratedReportRecord {
  id: string;
  reportName: string;
  category: string;
  generatedBy: string;
  generatedOn: string;
  scope: string;
  filters: string;
  format: 'PDF' | 'XLSX' | 'CSV';
  records: number;
  fileSize: string;
  status: 'COMPLETED' | 'PROCESSING' | 'FAILED';
}

export interface SavedConfiguration {
  id: string;
  name: string;
  category: string;
  dataSource: string;
  scope: string;
  columns: string[];
  filtersSummary: string;
  format: 'PDF' | 'XLSX' | 'CSV';
  lastRun: string;
}

export const ReportsView: React.FC = () => {
  const { showToast } = useToast();

  // Active top-level mode
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'BUILDER' | 'AI' | 'HISTORY' | 'SAVED'>('DASHBOARD');

  // Selected Category filter on Dashboard
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<ReportCategory | 'ALL'>('ALL');

  // Predefined reports list
  const predefinedReports: PredefinedReportDef[] = [
    // 1. Voter Reports
    {
      id: 'rep-vot-01',
      title: 'Complete Electoral Roll Dossier',
      category: 'VOTER',
      categoryLabel: 'Voter Reports',
      desc: 'Master electoral ledger containing verified names, relatives, house numbers, EPIC numbers, and age clusters.',
      defaultDataSource: 'Voters Database',
      defaultScope: 'Entire Constituency (215 - Kasba Peth)',
      defaultFormat: 'XLSX',
      estimatedRecords: '2,48,650',
      suggestedColumns: ['fullName', 'relativeName', 'epicNumber', 'age', 'gender', 'boothNumber', 'address']
    },
    {
      id: 'rep-vot-02',
      title: 'Booth-wise Voter Distribution & Turnout Audit',
      category: 'VOTER',
      categoryLabel: 'Voter Reports',
      desc: 'Voter counts, gender balance ratios, and historical turnout projections segmented across each polling station.',
      defaultDataSource: 'Voters Database',
      defaultScope: 'All 2,045 Polling Booths',
      defaultFormat: 'PDF',
      estimatedRecords: '2,045',
      suggestedColumns: ['boothNumber', 'pollingStation', 'totalVoters', 'maleRatio', 'projectedTurnout']
    },
    {
      id: 'rep-vot-03',
      title: 'Voter Classification & Cadre Alignment Report',
      category: 'VOTER',
      categoryLabel: 'Voter Reports',
      desc: 'Core supporters, fence sitters, leaning opponents, and local community influencers identified by karyakartas.',
      defaultDataSource: 'Voters Database',
      defaultScope: 'Field Cadre Tracked Voters',
      defaultFormat: 'XLSX',
      estimatedRecords: '42,120',
      suggestedColumns: ['fullName', 'politicalLeaning', 'isInfluencer', 'boothNumber', 'karyakartaName']
    },
    {
      id: 'rep-vot-04',
      title: 'Mobile Number Availability & WhatsApp Reachability',
      category: 'VOTER',
      categoryLabel: 'Voter Reports',
      desc: 'Voter records with validated 10-digit mobile numbers for direct WhatsApp broadcasts and SMS outreach.',
      defaultDataSource: 'Voters Database',
      defaultScope: 'Verified Mobile Voters',
      defaultFormat: 'CSV',
      estimatedRecords: '1,86,430',
      suggestedColumns: ['fullName', 'epicNumber', 'mobile', 'boothNumber', 'isVisited']
    },

    // 2. User & Karyakarta Reports
    {
      id: 'rep-usr-01',
      title: 'Field Worker Deployment & Performance Dossier',
      category: 'USER',
      categoryLabel: 'User & Karyakarta Reports',
      desc: 'Booth-wise Karyakarta assignments, surveys completed, door visits executed, and voter slips delivered.',
      defaultDataSource: 'Karyakarta / Workforce',
      defaultScope: 'Active Field Cadre',
      defaultFormat: 'PDF',
      estimatedRecords: '4,850',
      suggestedColumns: ['name', 'phone', 'assignedBooth', 'surveysCompleted', 'voterSlipsDelivered', 'status']
    },
    {
      id: 'rep-usr-02',
      title: 'Voter Update Request Governance & Moderation Log',
      category: 'USER',
      categoryLabel: 'User & Karyakarta Reports',
      desc: 'Audit trail of field worker update requests with approvals, rejections, and timestamped justifications.',
      defaultDataSource: 'Karyakarta Update Requests',
      defaultScope: 'All Submission Queues',
      defaultFormat: 'XLSX',
      estimatedRecords: '892',
      suggestedColumns: ['id', 'voterName', 'karyakartaName', 'status', 'reviewedBy', 'requestedAt']
    },

    // 3. Booth & Constituency Reports
    {
      id: 'rep-bth-01',
      title: 'Booth Readiness & Polling Station Vulnerability Index',
      category: 'BOOTH',
      categoryLabel: 'Booth & Constituency',
      desc: 'Vulnerability rating, BLO contact status, agent appointment, and infrastructure readiness for polling day.',
      defaultDataSource: 'Polling Booths',
      defaultScope: 'Critical & Normal Booths',
      defaultFormat: 'PDF',
      estimatedRecords: '272',
      suggestedColumns: ['boothNumber', 'stationName', 'vulnerability', 'bloName', 'readinessPercent']
    },

    // 4. Campaign Reports
    {
      id: 'rep-cmp-01',
      title: 'Multi-Channel Campaign Delivery & Engagement Audit',
      category: 'CAMPAIGN',
      categoryLabel: 'Campaign Reports',
      desc: 'WhatsApp, SMS, and Voice blast analytics, read receipts, audio duration, and failed delivery breakdowns.',
      defaultDataSource: 'Campaigns Engine',
      defaultScope: 'All Completed Campaigns',
      defaultFormat: 'PDF',
      estimatedRecords: '18',
      suggestedColumns: ['title', 'channel', 'targetAudience', 'deliveryRate', 'engagementRate', 'spentBudget']
    },

    // 5. Survey & Field Operation Reports
    {
      id: 'rep-srv-01',
      title: 'Door-to-Door Voter Survey Progress & Coverage',
      category: 'SURVEY',
      categoryLabel: 'Survey & Field Ops',
      desc: 'Household visits, pending survey quotas, and local priority issues reported during ground drives.',
      defaultDataSource: 'Surveys & Field Ops',
      defaultScope: 'Constituency Doorstep Drives',
      defaultFormat: 'XLSX',
      estimatedRecords: '72,450',
      suggestedColumns: ['householdId', 'boothNumber', 'surveyorName', 'issuesReported', 'surveyDate']
    },

    // 6. Issues & Public Demands Reports
    {
      id: 'rep-iss-01',
      title: 'Public Demands & Civic Grievance Resolution Ledger',
      category: 'ISSUES',
      categoryLabel: 'Issues & Public Demands',
      desc: 'Categorized constituent grievances (Water, Roads, Electricity, Schemes) with resolution velocity.',
      defaultDataSource: 'Grievance / Office Issues',
      defaultScope: 'All Registered Complaints',
      defaultFormat: 'XLSX',
      estimatedRecords: '42',
      suggestedColumns: ['ticketId', 'category', 'prabhaag', 'status', 'priority', 'assignedTo']
    },

    // 7. Voter Slip Reports
    {
      id: 'rep-slp-01',
      title: 'Voter Information Slip Distribution & Delivery Audit',
      category: 'VOTER_SLIPS',
      categoryLabel: 'Voter Slip Reports',
      desc: 'Slip generation status, physical delivery confirmations, digital QR downloads, and pending batches.',
      defaultDataSource: 'Voter Slips Registry',
      defaultScope: 'All Electoral Parts',
      defaultFormat: 'PDF',
      estimatedRecords: '1,92,430',
      suggestedColumns: ['epicNumber', 'voterName', 'boothNumber', 'slipStatus', 'deliveryMode']
    },

    // 8. Election & Analytics Reports
    {
      id: 'rep-elc-01',
      title: 'Historical Margin & Turnout Comparative Strategy Dossier',
      category: 'ELECTION_ANALYTICS',
      categoryLabel: 'Election & Analytics',
      desc: 'Assembly vs Parliamentary historical trend comparison across 2014, 2019, and 2024 projections.',
      defaultDataSource: 'Historical Election Intelligence',
      defaultScope: 'Kasba Peth & Pune PC',
      defaultFormat: 'PDF',
      estimatedRecords: '8 Wards',
      suggestedColumns: ['wardName', '2019Turnout', '2024Target', 'winningMargin', 'swingFactor']
    }
  ];

  // Report History Records
  const [historyRecords, setHistoryRecords] = useState<GeneratedReportRecord[]>([
    {
      id: 'GEN-2024-0419',
      reportName: 'Booth-wise Voter Distribution & Turnout Audit',
      category: 'Voter Reports',
      generatedBy: 'Anand Shinde (Candidate Admin)',
      generatedOn: '2024-04-18 04:30 PM',
      scope: 'Booths #101 - #108',
      filters: 'Gender: All, Age: All, Turnout > 50%',
      format: 'PDF',
      records: 2045,
      fileSize: '4.2 MB',
      status: 'COMPLETED'
    },
    {
      id: 'GEN-2024-0418',
      reportName: 'Mobile Number Availability & WhatsApp Reachability',
      category: 'Voter Reports',
      generatedBy: 'War Room Head (Rahul V.)',
      generatedOn: '2024-04-18 11:15 AM',
      scope: 'Prabhaag 12 - Kothrud West',
      filters: 'Has Mobile = Yes, Verified = True',
      format: 'CSV',
      records: 186430,
      fileSize: '12.8 MB',
      status: 'COMPLETED'
    },
    {
      id: 'GEN-2024-0417',
      reportName: 'Field Worker Deployment & Performance Dossier',
      category: 'User & Karyakarta Reports',
      generatedBy: 'Anand Shinde (Candidate Admin)',
      generatedOn: '2024-04-17 06:10 PM',
      scope: 'Active Field Cadre',
      filters: 'Status = APPROVED, Booths Assigned',
      format: 'PDF',
      records: 4850,
      fileSize: '2.1 MB',
      status: 'COMPLETED'
    },
    {
      id: 'GEN-2024-0416',
      reportName: 'Voter Information Slip Distribution & Delivery Audit',
      category: 'Voter Slip Reports',
      generatedBy: 'Data Operator (Suresh K.)',
      generatedOn: '2024-04-16 02:45 PM',
      scope: 'Constituency Kasba Peth',
      filters: 'Delivered = True',
      format: 'XLSX',
      records: 192430,
      fileSize: '18.4 MB',
      status: 'COMPLETED'
    },
    {
      id: 'GEN-2024-0415',
      reportName: 'Public Demands & Civic Grievance Resolution Ledger',
      category: 'Issues & Public Demands',
      generatedBy: 'War Room Head (Rahul V.)',
      generatedOn: '2024-04-15 10:00 AM',
      scope: 'Ward 12 Grievance Desk',
      filters: 'Category: Water & Drainage',
      format: 'PDF',
      records: 42,
      fileSize: '1.4 MB',
      status: 'COMPLETED'
    }
  ]);

  // Saved configurations
  const [savedConfigs, setSavedConfigs] = useState<SavedConfiguration[]>([
    {
      id: 'cfg-01',
      name: 'Daily Booth-wise Turnout Projection',
      category: 'Voter Reports',
      dataSource: 'Voters Database',
      scope: 'All Booths (#101 to #108)',
      columns: ['boothNumber', 'pollingStation', 'totalVoters', 'projectedTurnout'],
      filtersSummary: 'Active Voters, Age 18-90, Local Residents',
      format: 'PDF',
      lastRun: '2024-04-18'
    },
    {
      id: 'cfg-02',
      name: 'Weekly Karyakarta Slip Distribution Progress',
      category: 'User & Karyakarta Reports',
      dataSource: 'Karyakarta / Workforce',
      scope: 'All Active Karyakartas',
      columns: ['name', 'phone', 'assignedBooth', 'voterSlipsDelivered'],
      filtersSummary: 'Status = APPROVED',
      format: 'XLSX',
      lastRun: '2024-04-17'
    },
    {
      id: 'cfg-03',
      name: 'Monthly Civic Grievance Escalation Dossier',
      category: 'Issues & Public Demands',
      dataSource: 'Grievance / Office Issues',
      scope: 'Entire Constituency',
      columns: ['ticketId', 'category', 'prabhaag', 'status', 'priority'],
      filtersSummary: 'Priority = HIGH / URGENT',
      format: 'PDF',
      lastRun: '2024-04-15'
    }
  ]);

  // -------------------------------------------------------------
  // CUSTOM REPORT BUILDER STATE
  // -------------------------------------------------------------
  const [builderStep, setBuilderStep] = useState<number>(1);
  const [builderSource, setBuilderSource] = useState<string>('Voters');
  const [builderScopeType, setBuilderScopeType] = useState<string>('CONSTITUENCY');
  const [builderSelectedBooth, setBuilderSelectedBooth] = useState<string>('ALL');
  const [builderSelectedWorker, setBuilderSelectedWorker] = useState<string>('ALL');
  const [builderSelectedCampaign, setBuilderSelectedCampaign] = useState<string>('ALL');
  const [builderReportName, setBuilderReportName] = useState<string>('Custom Voter Intelligence Report');
  const [builderReportFormat, setBuilderReportFormat] = useState<'PDF' | 'XLSX' | 'CSV'>('PDF');
  const [builderIncludeSummary, setBuilderIncludeSummary] = useState<boolean>(true);
  const [builderIncludeCharts, setBuilderIncludeCharts] = useState<boolean>(true);

  // Field selector state
  const availableFieldsMap: Record<string, { id: string; label: string; defaultChecked: boolean }[]> = {
    Voters: [
      { id: 'fullName', label: 'Voter Full Name', defaultChecked: true },
      { id: 'relativeName', label: 'Relative / Father Name', defaultChecked: true },
      { id: 'epicNumber', label: 'EPIC Number', defaultChecked: true },
      { id: 'gender', label: 'Gender', defaultChecked: true },
      { id: 'age', label: 'Age', defaultChecked: true },
      { id: 'mobile', label: 'Mobile Number', defaultChecked: true },
      { id: 'address', label: 'Residential Address', defaultChecked: true },
      { id: 'boothNumber', label: 'Booth Number', defaultChecked: true },
      { id: 'pollingStation', label: 'Polling Station', defaultChecked: true },
      { id: 'caste', label: 'Caste Community', defaultChecked: false },
      { id: 'occupation', label: 'Occupation', defaultChecked: false },
      { id: 'karyakartaName', label: 'Assigned Karyakarta', defaultChecked: true },
      { id: 'politicalLeaning', label: 'Political Stance', defaultChecked: false },
      { id: 'isInfluencer', label: 'Key Influencer Flag', defaultChecked: false },
      { id: 'hasVoted', label: 'Voting Status', defaultChecked: false },
      { id: 'isVisited', label: 'Doorstep Visit Flag', defaultChecked: true }
    ],
    Users: [
      { id: 'id', label: 'User ID', defaultChecked: true },
      { id: 'name', label: 'Full Name', defaultChecked: true },
      { id: 'phone', label: 'Phone Number', defaultChecked: true },
      { id: 'role', label: 'Assigned Role', defaultChecked: true },
      { id: 'status', label: 'Account Status', defaultChecked: true },
      { id: 'prabhaag', label: 'Prabhaag / Ward', defaultChecked: true },
      { id: 'assignedBooths', label: 'Assigned Booths', defaultChecked: true },
      { id: 'lastActive', label: 'Last Active Timestamp', defaultChecked: true }
    ],
    Karyakarta: [
      { id: 'name', label: 'Karyakarta Name', defaultChecked: true },
      { id: 'phone', label: 'Contact Phone', defaultChecked: true },
      { id: 'assignedBooth', label: 'Assigned Booth No', defaultChecked: true },
      { id: 'surveysCompleted', label: 'Surveys Completed', defaultChecked: true },
      { id: 'voterSlipsDelivered', label: 'Slips Delivered', defaultChecked: true },
      { id: 'status', label: 'Verification Status', defaultChecked: true },
      { id: 'joinedDate', label: 'Joined Date', defaultChecked: false },
      { id: 'isOnline', label: 'Current Field Connectivity', defaultChecked: true }
    ],
    Booths: [
      { id: 'boothNumber', label: 'Booth Number', defaultChecked: true },
      { id: 'stationName', label: 'Polling Station Location', defaultChecked: true },
      { id: 'totalVoters', label: 'Total Registered Voters', defaultChecked: true },
      { id: 'maleVoters', label: 'Male Count', defaultChecked: true },
      { id: 'femaleVoters', label: 'Female Count', defaultChecked: true },
      { id: 'vulnerabilityLevel', label: 'ECI Vulnerability Rating', defaultChecked: true },
      { id: 'karyakartaCount', label: 'Assigned Cadre Count', defaultChecked: true },
      { id: 'readinessScore', label: 'Readiness Percentage', defaultChecked: true }
    ],
    Campaign: [
      { id: 'title', label: 'Campaign Title', defaultChecked: true },
      { id: 'type', label: 'Channel Type', defaultChecked: true },
      { id: 'audience', label: 'Target Audience Size', defaultChecked: true },
      { id: 'sentCount', label: 'Total Dispatched', defaultChecked: true },
      { id: 'deliveredCount', label: 'Successfully Delivered', defaultChecked: true },
      { id: 'openRate', label: 'Engagement Rate', defaultChecked: true },
      { id: 'status', label: 'Campaign Status', defaultChecked: true },
      { id: 'date', label: 'Launch Date', defaultChecked: true }
    ],
    Issues: [
      { id: 'id', label: 'Grievance ID', defaultChecked: true },
      { id: 'title', label: 'Issue Title', defaultChecked: true },
      { id: 'category', label: 'Department / Category', defaultChecked: true },
      { id: 'prabhaag', label: 'Prabhaag / Ward', defaultChecked: true },
      { id: 'status', label: 'Resolution Status', defaultChecked: true },
      { id: 'priority', label: 'Priority Level', defaultChecked: true },
      { id: 'assignedWorker', label: 'Assigned Karyakarta', defaultChecked: true },
      { id: 'reportedDate', label: 'Date Reported', defaultChecked: true }
    ]
  };

  const [selectedFields, setSelectedFields] = useState<string[]>(
    availableFieldsMap['Voters'].filter(f => f.defaultChecked).map(f => f.id)
  );

  // Switch source in builder resets fields
  const handleBuilderSourceChange = (newSource: string) => {
    setBuilderSource(newSource);
    const defaults = availableFieldsMap[newSource] || availableFieldsMap['Voters'];
    setSelectedFields(defaults.filter(f => f.defaultChecked).map(f => f.id));
    setBuilderReportName(`Custom ${newSource} Analysis Dossier`);
  };

  // Toggle field selection
  const handleToggleField = (fieldId: string) => {
    setSelectedFields(prev =>
      prev.includes(fieldId) ? prev.filter(item => item !== fieldId) : [...prev, fieldId]
    );
  };

  const handleSelectAllFields = () => {
    const all = (availableFieldsMap[builderSource] || availableFieldsMap['Voters']).map(f => f.id);
    setSelectedFields(all);
  };

  const handleDeselectAllFields = () => {
    setSelectedFields([]);
  };

  // Preview & Generation State
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationProgress, setGenerationProgress] = useState<number>(0);
  const [generatedSuccessResult, setGeneratedSuccessResult] = useState<GeneratedReportRecord | null>(null);

  // Trigger Report Generation
  const handleExecuteGeneration = (name: string, format: 'PDF' | 'XLSX' | 'CSV', recordsCount: number, cat: string) => {
    setIsPreviewModalOpen(false);
    setIsGenerating(true);
    setGenerationProgress(10);

    const step1 = setTimeout(() => setGenerationProgress(35), 400);
    const step2 = setTimeout(() => setGenerationProgress(70), 900);
    const step3 = setTimeout(() => {
      setGenerationProgress(100);
      setIsGenerating(false);

      const newRecord: GeneratedReportRecord = {
        id: `GEN-2024-${Math.floor(1000 + Math.random() * 9000)}`,
        reportName: name,
        category: cat,
        generatedBy: 'Anand Shinde (Candidate Admin)',
        generatedOn: new Date().toLocaleString(),
        scope: builderScopeType === 'BOOTH' ? `Booth #${builderSelectedBooth}` : 'Entire Candidate Profile Scope',
        filters: `Format: ${format}, Columns: ${selectedFields.length}`,
        format: format,
        records: recordsCount,
        fileSize: format === 'PDF' ? '3.8 MB' : format === 'XLSX' ? '5.4 MB' : '1.9 MB',
        status: 'COMPLETED'
      };

      setHistoryRecords(prev => [newRecord, ...prev]);
      setGeneratedSuccessResult(newRecord);
      showToast(`Successfully generated "${name}" in ${format} format.`, 'success');
    }, 1500);
  };

  // -------------------------------------------------------------
  // AI REPORT GENERATOR STATE
  // -------------------------------------------------------------
  const [aiPromptInput, setAiPromptInput] = useState<string>('');
  const [isAiProcessing, setIsAiProcessing] = useState<boolean>(false);
  const [aiGeneratedPlan, setAiGeneratedPlan] = useState<{
    prompt: string;
    dataSource: string;
    scope: string;
    appliedFilters: string[];
    suggestedColumns: string[];
    estimatedRecords: number;
    recommendedFormat: 'PDF' | 'XLSX' | 'CSV';
    summaryNarrative: string;
  } | null>(null);

  const sampleAiPrompts = [
    'Generate a complete voter turnout and vulnerability report for Booth 101 to 108.',
    'List all field workers who completed over 150 doorstep surveys this month.',
    'Show all pending voter update requests submitted in the last 30 days.',
    'Generate a WhatsApp and SMS campaign delivery comparison dossier.',
    'Compare voter demographics and gender balance across all 8 assembly wards.',
    'Generate physical voter slip distribution checklist for Booth #105.'
  ];

  const handleRunAiReport = (promptText?: string) => {
    const text = promptText || aiPromptInput;
    if (!text.trim()) {
      showToast('Please enter a natural language report instruction.', 'error');
      return;
    }

    setIsAiProcessing(true);
    setAiGeneratedPlan(null);

    setTimeout(() => {
      setIsAiProcessing(false);
      let detectedSource = 'Voters Database';
      let detectedScope = 'Kasba Peth Constituency';
      let estRecords = 248650;
      let recFormat: 'PDF' | 'XLSX' | 'CSV' = 'PDF';
      let cols = ['fullName', 'epicNumber', 'age', 'gender', 'boothNumber', 'mobile'];
      let filters = ['Authorized Access: Candidate Admin', 'Status: Active Roll'];
      let narrative =
        'AI interpreted your request and identified the primary voter database as the authoritative data source. Cross-referenced booth boundaries and generated voter demographic breakdown.';

      if (text.toLowerCase().includes('karyakarta') || text.toLowerCase().includes('worker')) {
        detectedSource = 'Workforce & Karyakarta';
        detectedScope = 'Active Field Cadre';
        estRecords = 4850;
        recFormat = 'XLSX';
        cols = ['name', 'phone', 'assignedBooth', 'surveysCompleted', 'voterSlipsDelivered'];
        filters.push('Surveys Completed > 150');
        narrative =
          'AI filtered the workforce performance registry. Isolated karyakartas matching the threshold criteria across all assigned prabhaags.';
      } else if (text.toLowerCase().includes('campaign')) {
        detectedSource = 'Campaign Outreach Engine';
        detectedScope = 'Multi-channel blasts';
        estRecords = 18;
        recFormat = 'PDF';
        cols = ['title', 'type', 'sentCount', 'deliveredCount', 'openRate'];
        filters.push('Channels: WhatsApp, SMS, Voice');
        narrative =
          'AI consolidated multi-channel campaign analytics into an executive comparative brief with read rates and delivery ratios.';
      } else if (text.toLowerCase().includes('update request')) {
        detectedSource = 'Karyakarta Update Requests';
        detectedScope = 'Last 30 Days Submissions';
        estRecords = 892;
        recFormat = 'XLSX';
        cols = ['id', 'voterName', 'karyakartaName', 'status', 'requestedAt'];
        filters.push('Status: PENDING', 'Date >= Last 30 Days');
        narrative =
          'AI isolated unmoderated voter field updates awaiting Candidate Admin verification with change diff previews.';
      }

      setAiGeneratedPlan({
        prompt: text,
        dataSource: detectedSource,
        scope: detectedScope,
        appliedFilters: filters,
        suggestedColumns: cols,
        estimatedRecords: estRecords,
        recommendedFormat: recFormat,
        summaryNarrative: narrative
      });
      showToast('AI synthesized custom report schema.', 'success');
    }, 1200);
  };

  // Filtered predefined reports based on category selection
  const filteredPredefined = useMemo(() => {
    if (selectedCategoryFilter === 'ALL') return predefinedReports;
    return predefinedReports.filter(r => r.category === selectedCategoryFilter);
  }, [selectedCategoryFilter]);

  return (
    <div className="space-y-6 pb-16 animate-fade-in text-slate-800 dark:text-slate-100">
      {/* 1. Header with Breadcrumbs & Action Buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Analytics & Intelligence
            </span>
            <span className="text-slate-300 dark:text-slate-700">/</span>
            <span className="text-xs font-bold text-violet-600 dark:text-violet-400">
              Report Generation & Data Export Centre
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800/60 ml-1">
              Soft Copy Exports
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Data Export Centre & Custom Reports
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-3xl leading-relaxed">
            Generate, customize, preview, and download authenticated PDF, Excel, and CSV dossiers across all electoral, field cadre, voter slip, and campaign databases.
          </p>
        </div>

        {/* Global Navigation Tabs */}
        <div className="flex flex-wrap items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300">
          <button
            onClick={() => setActiveTab('DASHBOARD')}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'DASHBOARD'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileBarChart2 className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('BUILDER');
              setBuilderStep(1);
            }}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'BUILDER'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Custom Builder</span>
          </button>

          <button
            onClick={() => setActiveTab('AI')}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'AI'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span>AI Report</span>
          </button>

          <button
            onClick={() => setActiveTab('HISTORY')}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'HISTORY'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Export History ({historyRecords.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('SAVED')}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'SAVED'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Saved Presets ({savedConfigs.length})</span>
          </button>
        </div>
      </div>

      {/* 2. Top Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Reports
            </span>
            <div className="w-8 h-8 rounded-xl bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">1,248</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Across 8 Core Modules</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Generated Today
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-2">24</div>
          <div className="text-[11px] text-blue-600/80 dark:text-blue-400/80 mt-1">Ready for Download</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
              Scheduled Reports
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-2">6</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Nightly & Weekly Runs</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Recent Archives
            </span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">48</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">In 30-Day Retention</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
              Failed Jobs
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-2">0</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">All Queues Operational</div>
        </div>
      </div>

      {/* =========================================================================
          VIEW 1: DASHBOARD & PREDEFINED CATALOG
      ========================================================================= */}
      {activeTab === 'DASHBOARD' && (
        <div className="space-y-6 animate-fade-in">
          {/* Quick Action Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm border border-blue-800/40">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-white border border-white/30">
                  Quick Generation
                </span>
                <span className="text-xs text-blue-200">
                  Select a predefined template or configure custom variables
                </span>
              </div>
              <h2 className="text-lg font-black tracking-tight">
                Export Executive Dossiers or Raw Datasets
              </h2>
              <p className="text-xs text-blue-200/90 max-w-2xl mt-0.5">
                Every exported file includes digital verification hashes, role-based boundary verification, and comprehensive audit timestamps.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => {
                  setActiveTab('BUILDER');
                  setBuilderStep(1);
                }}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 shadow-sm transition"
              >
                <Sliders className="w-4 h-4 text-blue-600" />
                Custom Report Builder
              </button>
              <button
                onClick={() => setActiveTab('AI')}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-sm transition border border-purple-400/40"
              >
                <Sparkles className="w-4 h-4" />
                AI Prompt Export
              </button>
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'ALL', label: 'All Categories (8)' },
              { id: 'VOTER', label: '1. Voter Reports' },
              { id: 'USER', label: '2. User & Karyakarta' },
              { id: 'BOOTH', label: '3. Booth & Constituency' },
              { id: 'CAMPAIGN', label: '4. Campaign Reports' },
              { id: 'SURVEY', label: '5. Survey & Field Ops' },
              { id: 'ISSUES', label: '6. Issues & Demands' },
              { id: 'VOTER_SLIPS', label: '7. Voter Slip Reports' },
              { id: 'ELECTION_ANALYTICS', label: '8. Election & Analytics' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryFilter(cat.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  selectedCategoryFilter === cat.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Predefined Reports Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPredefined.map(rep => (
              <div
                key={rep.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs hover:border-blue-400 dark:hover:border-blue-600 transition flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {rep.categoryLabel}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                        rep.defaultFormat === 'PDF'
                          ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                          : rep.defaultFormat === 'XLSX'
                          ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                          : 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                      }`}
                    >
                      {rep.defaultFormat}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {rep.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {rep.desc}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Scope</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300 truncate block">
                        {rep.defaultScope}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Est. Volume</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300 truncate block">
                        {rep.estimatedRecords} Records
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      setBuilderSource(
                        rep.category === 'USER'
                          ? 'Karyakarta'
                          : rep.category === 'BOOTH'
                          ? 'Booths'
                          : rep.category === 'CAMPAIGN'
                          ? 'Campaign'
                          : rep.category === 'ISSUES'
                          ? 'Issues'
                          : 'Voters'
                      );
                      setBuilderReportName(rep.title);
                      setBuilderReportFormat(rep.defaultFormat);
                      setActiveTab('BUILDER');
                      setBuilderStep(2);
                    }}
                    className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    Customize Scope
                  </button>

                  <button
                    onClick={() => {
                      setBuilderReportName(rep.title);
                      setBuilderReportFormat(rep.defaultFormat);
                      setIsPreviewModalOpen(true);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xs transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Preview & Export
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 2: CUSTOM REPORT BUILDER (GUIDED 6-STEP WORKFLOW)
      ========================================================================= */}
      {activeTab === 'BUILDER' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6 animate-fade-in">
          {/* Builder Step Progress Bar */}
          <div className="border-b border-slate-100 dark:border-slate-800 pb-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  Step {builderStep} of 6
                </span>
                <h2 className="text-lg font-black text-slate-900 dark:text-white">
                  Custom Report Builder
                </h2>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                Drafting: <span className="font-bold text-slate-900 dark:text-white">{builderReportName}</span>
              </div>
            </div>

            {/* Stepper Dots */}
            <div className="grid grid-cols-6 gap-2">
              {[
                { step: 1, label: '1. Source' },
                { step: 2, label: '2. Scope' },
                { step: 3, label: '3. Data Fields' },
                { step: 4, label: '4. Filters' },
                { step: 5, label: '5. Formatting' },
                { step: 6, label: '6. Review & Export' }
              ].map(s => (
                <button
                  key={s.step}
                  onClick={() => setBuilderStep(s.step)}
                  className={`text-left p-2 rounded-xl transition ${
                    builderStep === s.step
                      ? 'bg-blue-50 dark:bg-blue-950/60 border border-blue-300 dark:border-blue-700 font-bold text-blue-700 dark:text-blue-300'
                      : builderStep > s.step
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium'
                      : 'text-slate-400 dark:text-slate-500'
                  }`}
                >
                  <div className="text-[10px] uppercase font-bold">Step {s.step}</div>
                  <div className="text-xs truncate">{s.label.replace(/^\d+\.\s*/, '')}</div>
                </button>
              ))}
            </div>
          </div>

          {/* STEP 1: Select Data Source */}
          {builderStep === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Select Primary Data Source
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Choose the underlying module repository. Only authorized candidate records will be queryable.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2">
                {[
                  { id: 'Voters', label: 'Voters Database', count: '2,48,650 Electors', desc: 'Roll lists, demographics, mobile numbers, relatives, and voting flags.' },
                  { id: 'Karyakarta', label: 'Karyakarta & Workforce', count: '4,850 Cadre', desc: 'Doorstep visits, survey counts, slip delivery, and live field status.' },
                  { id: 'Booths', label: 'Polling Booths', count: '2,045 Booths', desc: 'Station metadata, vulnerability indexes, BLO details, and turnout history.' },
                  { id: 'Campaign', label: 'Campaigns & Broadcasts', count: '18 Broadcasts', desc: 'WhatsApp, SMS, IVR audio blasts, open rates, and budget logs.' },
                  { id: 'Issues', label: 'Civic Grievances & Demands', count: '42 Tickets', desc: 'Constituent complaints, departmental tags, and resolution timeline.' },
                  { id: 'Users', label: 'System User Accounts', count: '14 Active Staff', desc: 'Candidate admin, war room analysts, booth adhyaksh, and role permissions.' }
                ].map(src => (
                  <div
                    key={src.id}
                    onClick={() => handleBuilderSourceChange(src.id)}
                    className={`cursor-pointer p-4 rounded-2xl border transition-all ${
                      builderSource === src.id
                        ? 'bg-blue-50/70 dark:bg-blue-950/50 border-blue-400 dark:border-blue-600 ring-2 ring-blue-500/20'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">{src.label}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 font-bold text-slate-600 dark:text-slate-300">
                        {src.count}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                      {src.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Select Report Scope */}
          {builderStep === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Define Geographic & Entity Scope
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Isolate records to a specific constituency, booth, Karyakarta, or campaign.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {[
                  { id: 'CONSTITUENCY', label: 'Entire Candidate Profile', desc: '215 - Kasba Peth (All 8 Wards, 2,045 Booths)' },
                  { id: 'BOOTH', label: 'Specific Polling Booth', desc: 'Isolate data to a single booth or cluster' },
                  { id: 'WORKER', label: 'Specific Karyakarta / User', desc: 'Generate dedicated individual activity dossier' }
                ].map(sc => (
                  <div
                    key={sc.id}
                    onClick={() => setBuilderScopeType(sc.id)}
                    className={`cursor-pointer p-4 rounded-2xl border transition-all ${
                      builderScopeType === sc.id
                        ? 'bg-blue-50/70 dark:bg-blue-950/50 border-blue-400 dark:border-blue-600 ring-2 ring-blue-500/20'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-sm font-bold text-slate-900 dark:text-white">{sc.label}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{sc.desc}</div>
                  </div>
                ))}
              </div>

              {/* Conditional Sub-selectors */}
              {builderScopeType === 'BOOTH' && (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 max-w-md">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Select Target Polling Booth
                  </label>
                  <select
                    value={builderSelectedBooth}
                    onChange={e => setBuilderSelectedBooth(e.target.value)}
                    className="w-full p-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                  >
                    <option value="ALL">All Booths in Ward</option>
                    <option value="101">Booth #101 - Navbharat High School, Room 1 (1,140 Voters)</option>
                    <option value="102">Booth #102 - Ganesh Krupa Bldg, Room 2 (980 Voters)</option>
                    <option value="103">Booth #103 - Swapnanagari Primary Hall (1,220 Voters)</option>
                    <option value="104">Booth #104 - Karve Nagar Samaj Mandir (1,050 Voters)</option>
                    <option value="105">Booth #105 - Prabhat Road Gymkhana (890 Voters)</option>
                  </select>
                </div>
              )}

              {builderScopeType === 'WORKER' && (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 max-w-md">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Select Karyakarta / Field Worker
                  </label>
                  <select
                    value={builderSelectedWorker}
                    onChange={e => setBuilderSelectedWorker(e.target.value)}
                    className="w-full p-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                  >
                    <option value="ALL">All Field Workers</option>
                    {MOCK_KARYAKARTAS.map(k => (
                      <option key={k.id} value={k.name}>
                        {k.name} (Booth #{k.assignedBooth} • {k.phone})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Select Data Fields */}
          {builderStep === 3 && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Select Columns & Data Attributes ({selectedFields.length} Selected)
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Check the data points you want to include in the exported report table.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSelectAllFields}
                    className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300"
                  >
                    Select All
                  </button>
                  <button
                    onClick={handleDeselectAllFields}
                    className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300"
                  >
                    Deselect All
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 pt-2">
                {(availableFieldsMap[builderSource] || availableFieldsMap['Voters']).map(f => {
                  const isChecked = selectedFields.includes(f.id);
                  return (
                    <div
                      key={f.id}
                      onClick={() => handleToggleField(f.id)}
                      className={`cursor-pointer p-3 rounded-xl border flex items-center justify-between transition ${
                        isChecked
                          ? 'bg-blue-50/70 dark:bg-blue-950/50 border-blue-300 dark:border-blue-700 text-blue-900 dark:text-blue-200 font-bold'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-xs">{f.label}</span>
                      {isChecked ? (
                        <CheckSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: Advanced Dynamic Filters */}
          {builderStep === 4 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Apply Query Conditions & Filters
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Filter output by age range, gender, verification status, and communication availability.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                    Gender Filter
                  </label>
                  <select className="w-full p-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700">
                    <option>All Genders</option>
                    <option>Male Electors Only</option>
                    <option>Female Electors Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                    Age Bracket
                  </label>
                  <select className="w-full p-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700">
                    <option>All Ages (18 - 100+)</option>
                    <option>Youth (18 - 29)</option>
                    <option>Middle Age (30 - 59)</option>
                    <option>Senior Citizens (60+)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                    Mobile Number Status
                  </label>
                  <select className="w-full p-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700">
                    <option>All Records</option>
                    <option>Has Valid Mobile (+91)</option>
                    <option>Missing Mobile Number</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                    Doorstep Visit Status
                  </label>
                  <select className="w-full p-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700">
                    <option>All Records</option>
                    <option>Visited by Karyakarta</option>
                    <option>Not Visited Yet</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Report Formatting & Options */}
          {builderStep === 5 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Report Title & Output Configuration
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Specify naming, executive visual summaries, and export formats.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Report Dossier Title
                  </label>
                  <input
                    type="text"
                    value={builderReportName}
                    onChange={e => setBuilderReportName(e.target.value)}
                    className="w-full p-2.5 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Export File Format
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'PDF', label: 'PDF Document', desc: 'Formatted dossier' },
                      { id: 'XLSX', label: 'Excel (XLSX)', desc: 'Multi-sheet workbook' },
                      { id: 'CSV', label: 'Raw CSV', desc: 'Fast data pipeline' }
                    ].map(f => (
                      <div
                        key={f.id}
                        onClick={() => setBuilderReportFormat(f.id as any)}
                        className={`cursor-pointer p-2.5 rounded-xl border text-center transition ${
                          builderReportFormat === f.id
                            ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-700 dark:text-blue-300 font-bold'
                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <div className="text-xs font-bold">{f.label}</div>
                        <div className="text-[10px] text-slate-400">{f.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Toggles */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-wrap gap-6 text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={builderIncludeSummary}
                    onChange={e => setBuilderIncludeSummary(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    Include Executive Summary Page & KPI Cards
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={builderIncludeCharts}
                    onChange={e => setBuilderIncludeCharts(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    Embed Visual Charts & Demographic Pie Breakdowns
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* STEP 6: Review & Final Preview */}
          {builderStep === 6 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Step 6: Review Configuration & Generate Dossier
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Confirm parameters before executing server-side file assembly.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Report Title</span>
                  <span className="font-bold text-slate-900 dark:text-white">{builderReportName}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Data Source</span>
                  <span className="font-bold text-slate-900 dark:text-white">{builderSource}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Columns Count</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedFields.length} Columns</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Export Format</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">{builderReportFormat}</span>
                </div>
              </div>

              {/* Sample Preview Table */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                <div className="p-3 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    Live Sample Record Preview (First 4 rows)
                  </span>
                  <span className="text-[11px] text-slate-400">Total estimated records: ~1,240</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-100/70 dark:bg-slate-800/80 text-[10px] uppercase font-bold text-slate-500">
                        {selectedFields.slice(0, 6).map(fid => (
                          <th key={fid} className="py-2 px-3">
                            {fid}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                      {MOCK_VOTERS.slice(0, 4).map((v, i) => (
                        <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                          {selectedFields.slice(0, 6).map(fid => (
                            <td key={fid} className="py-2.5 px-3 truncate max-w-[150px]">
                              {String((v as any)[fid] || '—')}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Stepper Navigation Buttons */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <button
              disabled={builderStep === 1}
              onClick={() => setBuilderStep(prev => Math.max(1, prev - 1))}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none"
            >
              Previous Step
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setSavedConfigs(prev => [
                    {
                      id: `cfg-${Date.now()}`,
                      name: builderReportName,
                      category: builderSource,
                      dataSource: builderSource,
                      scope: builderScopeType,
                      columns: selectedFields,
                      filtersSummary: `${selectedFields.length} cols, Format ${builderReportFormat}`,
                      format: builderReportFormat,
                      lastRun: 'Just now'
                    },
                    ...prev
                  ]);
                  showToast(`Saved configuration "${builderReportName}" as preset template.`, 'success');
                }}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Save Configuration Preset
              </button>

              {builderStep < 6 ? (
                <button
                  onClick={() => setBuilderStep(prev => Math.min(6, prev + 1))}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xs transition"
                >
                  <span>Continue to Step {builderStep + 1}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() =>
                    handleExecuteGeneration(builderReportName, builderReportFormat, 1240, builderSource)
                  }
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md transition"
                >
                  <Download className="w-4 h-4" />
                  Generate & Download {builderReportFormat}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 3: AI NATURAL LANGUAGE REPORT GENERATOR
      ========================================================================= */}
      {activeTab === 'AI' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6 animate-fade-in">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                Natural Language Query
              </span>
              <span className="text-xs text-slate-500">ChatGPT-style Prompt Interface</span>
            </div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              AI Natural Language Report Generator
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 max-w-2xl">
              Describe your required analytical or operational report in plain language. The AI agent will identify authorized repositories, apply appropriate filters, and construct the download package.
            </p>
          </div>

          {/* Prompt Input Box */}
          <div className="space-y-3">
            <div className="relative">
              <textarea
                rows={3}
                value={aiPromptInput}
                onChange={e => setAiPromptInput(e.target.value)}
                placeholder="e.g. Generate a complete voter report for Booth 101 to 108 with mobile reachability and caste breakdown..."
                className="w-full p-3.5 pr-28 rounded-2xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 leading-relaxed"
              />
              <button
                disabled={isAiProcessing || !aiPromptInput.trim()}
                onClick={() => handleRunAiReport()}
                className="absolute right-3 bottom-3 flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-40 transition shadow-sm"
              >
                {isAiProcessing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Execute</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Prompt Pills */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Click Suggested Prompt Examples:
              </span>
              <div className="flex flex-wrap gap-2">
                {sampleAiPrompts.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setAiPromptInput(p);
                      handleRunAiReport(p);
                    }}
                    className="text-left px-3 py-1.5 rounded-xl text-xs bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60 hover:bg-purple-100 dark:hover:bg-purple-900/40 transition font-medium"
                  >
                    "{p}"
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* AI Plan Output Card */}
          {aiGeneratedPlan && (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-50/70 to-blue-50/40 dark:from-purple-950/40 dark:to-blue-950/30 border border-purple-200 dark:border-purple-800/80 space-y-4 animate-fade-in">
              <div className="flex items-center justify-between border-b border-purple-100 dark:border-purple-800/60 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">
                    AI Report Synthesis Plan
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300">
                  Ready for Generation
                </span>
              </div>

              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {aiGeneratedPlan.summaryNarrative}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-purple-100 dark:border-purple-900">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Data Source</span>
                  <span className="font-bold text-slate-900 dark:text-white">{aiGeneratedPlan.dataSource}</span>
                </div>
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-purple-100 dark:border-purple-900">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Report Scope</span>
                  <span className="font-bold text-slate-900 dark:text-white">{aiGeneratedPlan.scope}</span>
                </div>
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-purple-100 dark:border-purple-900">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Est. Records</span>
                  <span className="font-bold text-slate-900 dark:text-white">{aiGeneratedPlan.estimatedRecords.toLocaleString()}</span>
                </div>
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-purple-100 dark:border-purple-900">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Rec. Format</span>
                  <span className="font-bold text-purple-600 dark:text-purple-400">{aiGeneratedPlan.recommendedFormat}</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => {
                    setBuilderReportName(`AI Generated: ${aiGeneratedPlan.prompt.slice(0, 40)}...`);
                    setBuilderReportFormat(aiGeneratedPlan.recommendedFormat);
                    setIsPreviewModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100"
                >
                  Preview Data Table
                </button>
                <button
                  onClick={() =>
                    handleExecuteGeneration(
                      `AI: ${aiGeneratedPlan.prompt.slice(0, 40)}`,
                      aiGeneratedPlan.recommendedFormat,
                      aiGeneratedPlan.estimatedRecords,
                      aiGeneratedPlan.dataSource
                    )
                  }
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-sm transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  Generate & Download Now
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          VIEW 4: EXPORT HISTORY AUDIT TABLE
      ========================================================================= */}
      {activeTab === 'HISTORY' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Generated Report History & Audit Log
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Every exported file retained for 30 days under authorized candidate governance policy.
              </p>
            </div>
            <button
              onClick={() => showToast('Refreshed export queue.', 'info')}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh Log
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <th className="py-2.5 px-3">Report Name</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Generated By</th>
                  <th className="py-2.5 px-3">Scope & Filters</th>
                  <th className="py-2.5 px-3 text-center">Format</th>
                  <th className="py-2.5 px-3 text-center">Records</th>
                  <th className="py-2.5 px-3">Generated On</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {historyRecords.map(rec => (
                  <tr key={rec.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900 dark:text-white">{rec.reportName}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{rec.id} • {rec.fileSize}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                      {rec.category}
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                      {rec.generatedBy}
                    </td>
                    <td className="py-3 px-3 max-w-xs truncate text-slate-500 dark:text-slate-400 text-[11px]">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{rec.scope}</span>
                      <span className="block text-[10px] truncate">{rec.filters}</span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold ${
                          rec.format === 'PDF'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : rec.format === 'XLSX'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {rec.format}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-slate-900 dark:text-white">
                      {rec.records.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-slate-500 dark:text-slate-400 text-[11px] whitespace-nowrap">
                      {rec.generatedOn}
                    </td>
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => showToast(`Downloading cached file for ${rec.reportName} (${rec.format})`, 'success')}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xs"
                        >
                          <Download className="w-3 h-3" />
                          Download
                        </button>
                        <button
                          onClick={() => handleExecuteGeneration(rec.reportName, rec.format, rec.records, rec.category)}
                          title="Regenerate with current data"
                          className="p-1 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 5: SAVED CONFIGURATIONS PRESETS
      ========================================================================= */}
      {activeTab === 'SAVED' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Saved Report Configurations
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Saved templates retain your selected data sources, columns, filters, and formats for one-click re-runs.
              </p>
            </div>
            <button
              onClick={() => {
                setActiveTab('BUILDER');
                setBuilderStep(1);
              }}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700"
            >
              + Create New Preset
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedConfigs.map(cfg => (
              <div
                key={cfg.id}
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {cfg.category}
                    </span>
                    <span className="font-mono text-[10px] font-bold text-blue-600 dark:text-blue-400">
                      {cfg.format}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{cfg.name}</h3>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Scope: <span className="font-semibold text-slate-700 dark:text-slate-300">{cfg.scope}</span>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Columns: {cfg.columns.length} Fields Configured
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      setSavedConfigs(prev => prev.filter(c => c.id !== cfg.id));
                      showToast(`Removed preset "${cfg.name}".`, 'info');
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleExecuteGeneration(cfg.name, cfg.format, 1200, cfg.category)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <Play className="w-3 h-3" />
                    Run Report Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          REPORT PREVIEW SCREEN MODAL (Section 6)
      ========================================================================= */}
      {isPreviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/60 dark:bg-slate-900">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                    Report Preview
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                    {builderReportFormat}
                  </span>
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                  {builderReportName}
                </h3>
              </div>
              <button
                onClick={() => setIsPreviewModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* Scope & Filter Metadata Banner */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Candidate Profile</span>
                  <span className="font-bold text-slate-900 dark:text-white">Anand Shinde (215 - Kasba Peth)</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Report Scope</span>
                  <span className="font-bold text-slate-900 dark:text-white">{builderScopeType === 'BOOTH' ? `Booth #${builderSelectedBooth}` : 'Entire Constituency'}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Records</span>
                  <span className="font-bold text-slate-900 dark:text-white">2,045 Records</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Generation Engine</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">INDATA Core DB v2.4</span>
                </div>
              </div>

              {/* Sample Tabular Data Preview */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Sample Tabular Data Grid
                </h4>
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-100 dark:bg-slate-800 text-[10px] uppercase font-bold text-slate-600 dark:text-slate-300">
                        <th className="py-2.5 px-3">EPIC ID</th>
                        <th className="py-2.5 px-3">Voter Full Name</th>
                        <th className="py-2.5 px-3">Relative Name</th>
                        <th className="py-2.5 px-3">Age / Gender</th>
                        <th className="py-2.5 px-3">Booth</th>
                        <th className="py-2.5 px-3">Mobile Reachable</th>
                        <th className="py-2.5 px-3">Karyakarta</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                      {MOCK_VOTERS.slice(0, 5).map(v => (
                        <tr key={v.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                          <td className="py-2.5 px-3 font-mono font-bold text-blue-600 dark:text-blue-400">
                            {v.epicNumber}
                          </td>
                          <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">
                            {v.fullName}
                          </td>
                          <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">
                            {v.relativeName}
                          </td>
                          <td className="py-2.5 px-3">
                            {v.age} Yrs • {v.gender}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-semibold text-[11px]">
                              #{v.boothNumber}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300 font-mono">
                            {v.mobile}
                          </td>
                          <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">
                            {v.karyakartaName || 'Vikas Patil'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-between gap-3">
              <button
                onClick={() => setIsPreviewModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
              >
                Back to Configuration
              </button>

              <button
                onClick={() =>
                  handleExecuteGeneration(builderReportName, builderReportFormat, 2045, builderSource)
                }
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition"
              >
                <Download className="w-4 h-4" />
                Generate & Download File
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          PROGRESS / PROCESSING OVERLAY (Section 7)
      ========================================================================= */}
      {isGenerating && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-center space-y-4">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <RefreshCw className="w-6 h-6 animate-spin" />
            </div>

            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Compiling Report Dossier...
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {generationProgress < 30
                  ? 'Connecting to ECI & Candidate Roll Data Stores...'
                  : generationProgress < 75
                  ? 'Filtering and aggregating records across booths...'
                  : 'Formatting soft copy layout and signing checksums...'}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 h-full transition-all duration-300"
                style={{ width: `${generationProgress}%` }}
              ></div>
            </div>

            <div className="text-[11px] font-bold text-slate-400">
              {generationProgress}% Complete
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SUCCESS DOWNLOAD DIALOG (Section 7)
      ========================================================================= */}
      {generatedSuccessResult && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 text-center">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                Generation Completed
              </span>
              <h3 className="text-base font-black text-slate-900 dark:text-white mt-1">
                {generatedSuccessResult.reportName}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Ready for download in {generatedSuccessResult.format} format.
              </p>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-xs grid grid-cols-3 gap-2">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Records</span>
                <span className="font-bold text-slate-900 dark:text-white">{generatedSuccessResult.records.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">File Size</span>
                <span className="font-bold text-slate-900 dark:text-white">{generatedSuccessResult.fileSize}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Format</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">{generatedSuccessResult.format}</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setGeneratedSuccessResult(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Close
              </button>
              <button
                onClick={() => {
                  showToast(`Downloading ${generatedSuccessResult.reportName} (${generatedSuccessResult.format})...`, 'success');
                  setGeneratedSuccessResult(null);
                }}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md transition"
              >
                <Download className="w-4 h-4" />
                Download Soft Copy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
