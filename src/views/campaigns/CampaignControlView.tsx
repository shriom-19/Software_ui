import React, { useState, useMemo } from 'react';
import {
  Megaphone,
  Plus,
  MessageSquare,
  PhoneCall,
  Mail,
  Send,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Play,
  Pause,
  RotateCcw,
  Users,
  ChevronRight,
  ChevronLeft,
  X,
  CreditCard,
  Sparkles,
  Eye,
  FileText,
  Check,
  Layers,
  ShieldCheck,
  AlertCircle,
  BarChart2,
  Phone,
  UserCheck,
  Search,
  Filter,
  DollarSign,
  Download,
  Settings,
  HelpCircle,
  Volume2,
  Headphones,
  CheckSquare,
  Square,
  RefreshCw,
  Repeat,
  Cake,
  Gift,
  Radio,
  FileSpreadsheet
} from 'lucide-react';
import { MOCK_CAMPAIGNS, MOCK_BOOTHS, MOCK_VOTERS } from '../../data/mockData';
import { Campaign, Voter } from '../../types';
import { useToast } from '../../components/common/Toast';

// Channel Types
export type ChannelMode = 'WHATSAPP' | 'SMS' | 'AI_VOICE';

export interface CampaignTemplate {
  id: string;
  name: string;
  category: 'Birthday' | 'Festival' | 'Announcement' | 'Invitation' | 'Reminder' | 'Follow-up' | 'Election Communication' | 'Custom';
  channel: ChannelMode;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
  content: string;
  variables: string[];
}

export interface IncomingResponse {
  id: string;
  voterName: string;
  mobile: string;
  campaign: string;
  channel: ChannelMode;
  messageReceived: string;
  receivedDate: string;
  responseStatus: 'NEW' | 'ACTIONED' | 'ARCHIVED';
  callDuration?: string;
  summary?: string;
}

export interface AutomationRule {
  id: string;
  name: string;
  campaignType: string;
  channel: ChannelMode;
  trigger: string;
  audience: string;
  lastExecution: string;
  nextExecution: string;
  status: 'ACTIVE' | 'DISABLED';
  sentToday: number;
  failedCount: number;
  skippedCount: number;
  templateSnippet: string;
}

export const CampaignControlView: React.FC = () => {
  const { showToast } = useToast();

  // Top Level Workspace Hierarchy
  // OVERVIEW = Main Campaign Dashboard
  // WHATSAPP / SMS / AI_VOICE = Dedicated Workspaces
  // BILLING = Common Recharge & Billing
  const [activeWorkspace, setActiveWorkspace] = useState<'OVERVIEW' | 'WHATSAPP' | 'SMS' | 'AI_VOICE' | 'BILLING'>('OVERVIEW');
  
  // Sub-navigation inside each channel workspace
  const [channelSubTab, setChannelSubTab] = useState<'DASHBOARD' | 'LIVE' | 'CREATE' | 'INDIVIDUAL' | 'AUTOMATED' | 'TEMPLATES' | 'STATS' | 'RESPONSES'>('DASHBOARD');

  // Campaigns State
  const [campaigns, setCampaigns] = useState<Campaign[]>(MOCK_CAMPAIGNS);
  const [selectedCampaignForDetail, setSelectedCampaignForDetail] = useState<Campaign | null>(null);
  const [detailModalTab, setDetailModalTab] = useState<'OVERVIEW' | 'AUDIENCE' | 'CONTENT' | 'PERFORMANCE' | 'RESPONSES' | 'BILLING'>('OVERVIEW');

  // Balances
  const [walletCredits, setWalletCredits] = useState({
    whatsapp: 48250,
    sms: 92400,
    voice: 31800,
    totalBalanceInr: 18450
  });

  // Table Filters on Overview
  const [overviewChannelFilter, setOverviewChannelFilter] = useState<string>('ALL');
  const [overviewStatusFilter, setOverviewStatusFilter] = useState<string>('ALL');
  const [overviewSearchQuery, setOverviewSearchQuery] = useState<string>('');

  // -------------------------------------------------------------
  // RECHARGE & BILLING MODAL STATE
  // -------------------------------------------------------------
  const [isRechargeModalOpen, setIsRechargeModalOpen] = useState(false);
  const [selectedRechargeChannel, setSelectedRechargeChannel] = useState<'WHATSAPP' | 'SMS' | 'AI_VOICE' | 'COMBO'>('WHATSAPP');
  const [billingSubTab, setBillingSubTab] = useState<'OVERVIEW' | 'INDIVIDUAL' | 'COMBO' | 'TRANSACTIONS' | 'CHARGES' | 'INVOICES'>('OVERVIEW');

  // -------------------------------------------------------------
  // CREATE CAMPAIGN GUIDED WIZARD STATE (7-step workflow)
  // -------------------------------------------------------------
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState<number>(1);
  const [wizardMode, setWizardMode] = useState<'BULK' | 'INDIVIDUAL'>('BULK');
  const [wizardChannel, setWizardChannel] = useState<ChannelMode>('WHATSAPP');
  const [wizardCategory, setWizardCategory] = useState<string>('Election Day Reminder');
  const [wizardCampaignName, setWizardCampaignName] = useState<string>('Polling Day Turnout Push');
  const [wizardAudienceScope, setWizardAudienceScope] = useState<string>('CONSTITUENCY');
  const [wizardSelectedBooths, setWizardSelectedBooths] = useState<number[]>([101, 102, 103]);
  const [wizardContent, setWizardContent] = useState<string>(
    'Namaskar {Voter Name} ji! Here is your official voter slip for Booth #{Booth Number}. Vote for change and development on Election Day!'
  );
  const [wizardScheduleOption, setWizardScheduleOption] = useState<'NOW' | 'LATER' | 'DRAFT'>('NOW');
  const [wizardScheduleTime, setWizardScheduleTime] = useState<string>('2024-04-20 09:30 AM');
  const [wizardLanguage, setWizardLanguage] = useState<string>('Marathi (Pune)');
  const [wizardAiVoice, setWizardAiVoice] = useState<string>('Candidate Voice Clone HD');

  // -------------------------------------------------------------
  // INDIVIDUAL 1-TO-1 COMMUNICATION STATE
  // -------------------------------------------------------------
  const [individualSearchVoter, setIndividualSearchVoter] = useState<string>('');
  const [selectedIndividualVoter, setSelectedIndividualVoter] = useState<Voter>(MOCK_VOTERS[0]);
  const [individualChannel, setIndividualChannel] = useState<ChannelMode>('WHATSAPP');
  const [individualMessageText, setIndividualMessageText] = useState<string>(
    'Namaskar {Voter Name} ji, this is a direct message from Adv. Vikram Patil election office. Polling station: Booth #{Booth Number}. Reply for any assistance.'
  );

  // -------------------------------------------------------------
  // TEMPLATES REPOSITORY
  // -------------------------------------------------------------
  const [templates, setTemplates] = useState<CampaignTemplate[]>([
    {
      id: 'tpl-wa-01',
      name: 'Voter Information Slip with QR & Map Link',
      category: 'Election Communication',
      channel: 'WHATSAPP',
      status: 'APPROVED',
      content: 'Namaskar {Voter Name} ji, your voting booth is {Booth Number} at {Polling Station}. Tap here to download digital voter slip.',
      variables: ['{Voter Name}', '{Booth Number}', '{Polling Station}']
    },
    {
      id: 'tpl-wa-02',
      name: 'Official Birthday Greetings & Good Health Wishes',
      category: 'Birthday',
      channel: 'WHATSAPP',
      status: 'APPROVED',
      content: 'Happy Birthday, {Voter Name} ji! Wishing you health, peace and happiness ahead. Warm regards, Adv. Vikram Patil & Family.',
      variables: ['{Voter Name}']
    },
    {
      id: 'tpl-sms-01',
      name: 'Election Day Morning Turnout Push',
      category: 'Reminder',
      channel: 'SMS',
      status: 'APPROVED',
      content: 'Voting has begun! Cast your vote at Booth #{Booth Number}. Free transport helpline: 1800-INDATA.',
      variables: ['{Booth Number}']
    },
    {
      id: 'tpl-voice-01',
      name: 'Candidate Audio Broadcast - Healthcare & Metro',
      category: 'Announcement',
      channel: 'AI_VOICE',
      status: 'APPROVED',
      content: 'Namaskar, mi Adv. Vikram Patil bolat ahe. Kasba Peth chya sarvangin vikasasathi aple aashirwad dya.',
      variables: ['{Candidate Name}']
    }
  ]);

  // -------------------------------------------------------------
  // INCOMING RESPONSES & CALL LOGS
  // -------------------------------------------------------------
  const [incomingResponses, setIncomingResponses] = useState<IncomingResponse[]>([
    {
      id: 'resp-01',
      voterName: 'Rajesh Kumar Verma',
      mobile: '+91 98221 44001',
      campaign: 'Voter Slip Broadcast - Booths 101 to 105',
      channel: 'WHATSAPP',
      messageReceived: 'Got the slip. Please confirm if wheelchair transport is available at booth 101 for my father.',
      receivedDate: '2024-04-18 10:45 AM',
      responseStatus: 'NEW'
    },
    {
      id: 'resp-02',
      voterName: 'Pooja Santosh Deshmukh',
      mobile: '+91 97654 32110',
      campaign: 'Shiv Jayanti Greetings Broadcast',
      channel: 'WHATSAPP',
      messageReceived: 'Thank you Vikram ji! Our whole colony is supporting you.',
      receivedDate: '2024-02-19 11:20 AM',
      responseStatus: 'ACTIONED'
    },
    {
      id: 'resp-03',
      voterName: 'Surendra Mohan Joshi',
      mobile: '+91 98221 00998',
      campaign: 'Candidate Audio Message by Adv. Vikram Patil',
      channel: 'AI_VOICE',
      messageReceived: 'Key Pressed: 1 (Requested Call Back)',
      receivedDate: '2024-04-18 09:12 AM',
      responseStatus: 'NEW',
      callDuration: '48s',
      summary: 'Senior citizen confirmed support. Wants wheelchair van pickup at 9:30 AM.'
    }
  ]);

  // -------------------------------------------------------------
  // AUTOMATED CAMPAIGNS STATE
  // -------------------------------------------------------------
  const [automations, setAutomations] = useState<AutomationRule[]>([
    {
      id: 'auto-01',
      name: 'Daily Morning Birthday Wishes Engine',
      campaignType: 'Birthday Messages',
      channel: 'WHATSAPP',
      trigger: 'Everyday at 08:00 AM (Matches Voter DOB)',
      audience: 'All Registered Voters with Birthdays Today',
      lastExecution: 'Today, 08:00 AM (48 Sent, 0 Failed)',
      nextExecution: 'Tomorrow, 08:00 AM',
      status: 'ACTIVE',
      sentToday: 48,
      failedCount: 0,
      skippedCount: 3,
      templateSnippet: 'Happy Birthday {Voter Name} ji! Wishing you happiness and prosperity...'
    },
    {
      id: 'auto-02',
      name: 'Doorstep Survey Follow-up & Thank-You Blast',
      campaignType: 'Follow-up Message',
      channel: 'SMS',
      trigger: 'Triggered 2 hours after Karyakarta marks "Visited"',
      audience: 'Households with Completed Doorstep Survey',
      lastExecution: 'Yesterday, 07:45 PM (142 Sent)',
      nextExecution: 'Realtime Trigger on Field App Sync',
      status: 'ACTIVE',
      sentToday: 82,
      failedCount: 2,
      skippedCount: 1,
      templateSnippet: 'Thank you for speaking with our booth karyakarta today. Your priorities are noted!'
    },
    {
      id: 'auto-03',
      name: 'Senior Citizen Polling Assistance Reminder',
      campaignType: 'Volunteer / Worker Communication',
      channel: 'AI_VOICE',
      trigger: '1 Day Prior to Polling at 04:00 PM',
      audience: 'Age 65+ with Wheelchair Assistance Flag',
      lastExecution: 'Pending Schedule',
      nextExecution: '2024-04-21 04:00 PM',
      status: 'ACTIVE',
      sentToday: 0,
      failedCount: 0,
      skippedCount: 0,
      templateSnippet: 'Namaskar! Your election day transport van has been booked for Booth 101...'
    }
  ]);

  // Summary Metrics calculations
  const stats = useMemo(() => {
    const total = campaigns.length;
    const active = campaigns.filter(c => c.status === 'RUNNING').length;
    const scheduled = campaigns.filter(c => c.status === 'SCHEDULED').length;
    const completed = campaigns.filter(c => c.status === 'COMPLETED').length;
    const totalSent = campaigns.reduce((acc, c) => acc + (c.deliveredCount || 0) + (c.failedCount || 0), 0);
    const totalDelivered = campaigns.reduce((acc, c) => acc + (c.deliveredCount || 0), 0);
    const totalFailed = campaigns.reduce((acc, c) => acc + (c.failedCount || 0), 0);
    return { total, active, scheduled, completed, totalSent, totalDelivered, totalFailed };
  }, [campaigns]);

  // Channel specific stats
  const channelStats = useMemo(() => {
    const getStats = (ch: ChannelMode) => {
      const filtered = campaigns.filter(c => c.channel === ch);
      const active = filtered.filter(c => c.status === 'RUNNING').length;
      const sent = filtered.reduce((acc, c) => acc + (c.recipientCount || 0), 0);
      const delivered = filtered.reduce((acc, c) => acc + (c.deliveredCount || 0), 0);
      const read = filtered.reduce((acc, c) => acc + (c.readCount || 0), 0);
      const failed = filtered.reduce((acc, c) => acc + (c.failedCount || 0), 0);
      const answered = filtered.reduce((acc, c) => acc + (c.answeredCount || 0), 0);
      return { active, sent, delivered, read, failed, answered };
    };

    return {
      whatsapp: getStats('WHATSAPP'),
      sms: getStats('SMS'),
      voice: getStats('AI_VOICE')
    };
  }, [campaigns]);

  // Filtered campaigns for Overview table
  const filteredOverviewCampaigns = useMemo(() => {
    return campaigns.filter(c => {
      if (overviewChannelFilter !== 'ALL' && c.channel !== overviewChannelFilter) return false;
      if (overviewStatusFilter !== 'ALL' && c.status !== overviewStatusFilter) return false;
      if (overviewSearchQuery.trim()) {
        const q = overviewSearchQuery.toLowerCase();
        return (
          c.name.toLowerCase().includes(q) ||
          c.targetAudience.toLowerCase().includes(q) ||
          c.channel.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [campaigns, overviewChannelFilter, overviewStatusFilter, overviewSearchQuery]);

  // Toggle Campaign status
  const handleToggleCampaignStatus = (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'RUNNING' ? 'PAUSED' : 'RUNNING';
    setCampaigns(prev =>
      prev.map(c => (c.id === id ? { ...c, status: nextStatus as any } : c))
    );
    showToast(`Campaign ${nextStatus === 'RUNNING' ? 'resumed' : 'paused'} successfully.`, 'info');
  };

  // Launch New Campaign Wizard Submission
  const handleLaunchCampaign = () => {
    const newCamp: Campaign = {
      id: `cmp-0${campaigns.length + 1}`,
      name: wizardCampaignName || `${wizardChannel} Campaign - ${wizardCategory}`,
      channel: wizardChannel,
      campaignType: wizardCategory,
      targetAudience:
        wizardAudienceScope === 'BOOTH'
          ? `Booths ${wizardSelectedBooths.join(', ')} (Verified Contacts)`
          : 'Constituency All Verified Contacts',
      recipientCount: wizardAudienceScope === 'BOOTH' ? wizardSelectedBooths.length * 1140 : 24865,
      deliveredCount: wizardScheduleOption === 'NOW' ? Math.floor(wizardSelectedBooths.length * 1050) : 0,
      readCount: wizardScheduleOption === 'NOW' ? Math.floor(wizardSelectedBooths.length * 850) : 0,
      failedCount: 0,
      status: wizardScheduleOption === 'NOW' ? 'RUNNING' : wizardScheduleOption === 'LATER' ? 'SCHEDULED' : 'DRAFT',
      scheduledTime: wizardScheduleOption === 'NOW' ? new Date().toLocaleString() : wizardScheduleTime,
      createdDate: new Date().toISOString().split('T')[0],
      messageTemplate: wizardContent,
      estimatedCostCredits: wizardSelectedBooths.length * 1140,
      booths: wizardSelectedBooths
    };

    setCampaigns(prev => [newCamp, ...prev]);
    setIsWizardOpen(false);
    setWizardStep(1);
    showToast(
      `Campaign "${newCamp.name}" ${
        wizardScheduleOption === 'NOW' ? 'launched live' : 'scheduled'
      } across provider network!`,
      'success'
    );
  };

  // Dispatch 1-to-1 Individual Message
  const handleSendIndividual = () => {
    if (!selectedIndividualVoter) return;
    const personalized = individualMessageText
      .replace('{Voter Name}', selectedIndividualVoter.fullName)
      .replace('{Booth Number}', String(selectedIndividualVoter.boothNumber))
      .replace('{Polling Station}', selectedIndividualVoter.pollingStation || 'Navbharat High School');

    showToast(`Direct ${individualChannel} dispatched to ${selectedIndividualVoter.fullName} (${selectedIndividualVoter.mobile}). Recorded in Central Voter Profile timeline.`, 'success');
  };

  return (
    <div className="space-y-6 pb-16 animate-fade-in text-slate-800 dark:text-slate-100">
      {/* 1. Header with Breadcrumb & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Outreach & Communication
            </span>
            <span className="text-slate-300 dark:text-slate-700">/</span>
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
              Campaign Control Centre
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 ml-1">
              215 - Kasba Peth
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Multi-Channel Communication Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-3xl leading-relaxed">
            Execute and monitor WhatsApp blasts, SMS broadcasts, AI Voice outbound calls, and automated trigger sequences with end-to-end delivery verification.
          </p>
        </div>

        {/* Balance & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
            <CreditCard className="w-4 h-4 text-amber-500" />
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block leading-tight">Total Balance</span>
              <span className="font-bold text-slate-900 dark:text-white">₹{walletCredits.totalBalanceInr.toLocaleString()} (Credits)</span>
            </div>
          </div>

          <button
            onClick={() => setIsRechargeModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition"
          >
            <DollarSign className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            Recharge Credits
          </button>

          <button
            onClick={() => {
              setIsWizardOpen(true);
              setWizardStep(1);
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            Generate Campaign
          </button>
        </div>
      </div>

      {/* 2. Top-Level Workspace Navigation Hierarchy (Section 11) */}
      <div className="flex flex-wrap items-center bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs font-bold shadow-xs gap-1">
        <button
          onClick={() => setActiveWorkspace('OVERVIEW')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
            activeWorkspace === 'OVERVIEW'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <BarChart2 className="w-4 h-4" />
          <span>Campaign Dashboard</span>
        </button>

        <button
          onClick={() => {
            setActiveWorkspace('WHATSAPP');
            setChannelSubTab('DASHBOARD');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
            activeWorkspace === 'WHATSAPP'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>WhatsApp Workspace</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            {walletCredits.whatsapp.toLocaleString()}
          </span>
        </button>

        <button
          onClick={() => {
            setActiveWorkspace('SMS');
            setChannelSubTab('DASHBOARD');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
            activeWorkspace === 'SMS'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>SMS Workspace</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            {walletCredits.sms.toLocaleString()}
          </span>
        </button>

        <button
          onClick={() => {
            setActiveWorkspace('AI_VOICE');
            setChannelSubTab('DASHBOARD');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
            activeWorkspace === 'AI_VOICE'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Headphones className="w-4 h-4 text-purple-400" />
          <span>AI Voice Call Workspace</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300">
            {walletCredits.voice.toLocaleString()}
          </span>
        </button>

        <button
          onClick={() => setActiveWorkspace('BILLING')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
            activeWorkspace === 'BILLING'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <CreditCard className="w-4 h-4 text-amber-500" />
          <span>Recharge & Billing</span>
        </button>
      </div>

      {/* =========================================================================
          WORKSPACE 1: MAIN CAMPAIGN OVERVIEW DASHBOARD
      ========================================================================= */}
      {activeWorkspace === 'OVERVIEW' && (
        <div className="space-y-6 animate-fade-in">
          {/* Summary KPI Cards (Section 1) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Total Campaigns</span>
              <div className="text-xl font-black text-slate-900 dark:text-white mt-1">{stats.total}</div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block">Active Live</span>
              <div className="text-xl font-black text-blue-600 mt-1">{stats.active}</div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 block">Scheduled</span>
              <div className="text-xl font-black text-purple-600 mt-1">{stats.scheduled}</div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block">Completed</span>
              <div className="text-xl font-black text-blue-700 mt-1">{stats.completed}</div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Total Sent</span>
              <div className="text-xl font-black text-slate-900 dark:text-white mt-1">{stats.totalSent.toLocaleString()}</div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block">Calls Made</span>
              <div className="text-xl font-black text-blue-600 mt-1">{channelStats.voice.sent.toLocaleString()}</div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 block">Failed Comms</span>
              <div className="text-xl font-black text-rose-600 mt-1">{stats.totalFailed}</div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 block">Avail Credits</span>
              <div className="text-xl font-black text-amber-600 mt-1">1.72L</div>
            </div>
          </div>

          {/* Three Channel Overview Cards (Section 1) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* WhatsApp Card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">WhatsApp Business API</h3>
                      <span className="text-[10px] text-blue-600 font-bold">Meta Cloud Verified</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                    {walletCredits.whatsapp.toLocaleString()} Credits
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center text-xs py-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl my-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Sent</span>
                    <span className="font-bold text-slate-900 dark:text-white">{channelStats.whatsapp.sent.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-blue-600 block">Delivered</span>
                    <span className="font-bold text-blue-600">{channelStats.whatsapp.delivered.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-blue-700 block">Read</span>
                    <span className="font-bold text-blue-700">{channelStats.whatsapp.read.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-rose-600 block">Failed</span>
                    <span className="font-bold text-rose-600">{channelStats.whatsapp.failed}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setActiveWorkspace('WHATSAPP');
                  setChannelSubTab('DASHBOARD');
                }}
                className="w-full mt-2 py-2 rounded-xl text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/40 border border-blue-200 dark:border-blue-800/60 transition flex items-center justify-center gap-1.5"
              >
                <span>Open WhatsApp Dashboard</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* SMS Card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">DLT Transactional SMS</h3>
                      <span className="text-[10px] text-blue-600 font-bold">TRAI DLT Registered Header</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                    {walletCredits.sms.toLocaleString()} Credits
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center text-xs py-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl my-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Sent</span>
                    <span className="font-bold text-slate-900 dark:text-white">{channelStats.sms.sent.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-blue-600 block">Delivered</span>
                    <span className="font-bold text-blue-600">{channelStats.sms.delivered.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Segments</span>
                    <span className="font-bold text-slate-900 dark:text-white">1.0 avg</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-rose-600 block">Failed</span>
                    <span className="font-bold text-rose-600">{channelStats.sms.failed}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setActiveWorkspace('SMS');
                  setChannelSubTab('DASHBOARD');
                }}
                className="w-full mt-2 py-2 rounded-xl text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/40 border border-blue-200 dark:border-blue-800/60 transition flex items-center justify-center gap-1.5"
              >
                <span>Open SMS Dashboard</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* AI Voice Calls Card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                      <Headphones className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">AI Voice Outbound Engine</h3>
                      <span className="text-[10px] text-purple-600 font-bold">Marathi Cloned Speech</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                    {walletCredits.voice.toLocaleString()} Credits
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center text-xs py-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl my-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Calls Made</span>
                    <span className="font-bold text-slate-900 dark:text-white">{channelStats.voice.sent.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-purple-600 block">Answered</span>
                    <span className="font-bold text-purple-600">{channelStats.voice.answered.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Avg Dur.</span>
                    <span className="font-bold text-slate-900 dark:text-white">40s</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-rose-600 block">Failed</span>
                    <span className="font-bold text-rose-600">{channelStats.voice.failed}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setActiveWorkspace('AI_VOICE');
                  setChannelSubTab('DASHBOARD');
                }}
                className="w-full mt-2 py-2 rounded-xl text-xs font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/50 hover:bg-purple-100 dark:hover:bg-purple-900/40 border border-purple-200 dark:border-purple-800/60 transition flex items-center justify-center gap-1.5"
              >
                <span>Open AI Voice Dashboard</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Unified Campaign Activity Table (Section 1) */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Megaphone className="w-4 h-4 text-blue-600" />
                  Recent Multi-Channel Broadcast Activity
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Real-time broadcast execution pipeline across WhatsApp, SMS, and Outbound Voice Agents.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  placeholder="Search campaign name or audience..."
                  value={overviewSearchQuery}
                  onChange={e => setOverviewSearchQuery(e.target.value)}
                  className="px-3 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />

                <select
                  value={overviewChannelFilter}
                  onChange={e => setOverviewChannelFilter(e.target.value)}
                  className="px-2.5 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold"
                >
                  <option value="ALL">All Channels</option>
                  <option value="WHATSAPP">WhatsApp</option>
                  <option value="SMS">SMS</option>
                  <option value="AI_VOICE">AI Voice</option>
                </select>

                <select
                  value={overviewStatusFilter}
                  onChange={e => setOverviewStatusFilter(e.target.value)}
                  className="px-2.5 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="RUNNING">Running</option>
                  <option value="SCHEDULED">Scheduled</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="PAUSED">Paused</option>
                  <option value="DRAFT">Draft</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    <th className="py-2.5 px-3">Campaign Name</th>
                    <th className="py-2.5 px-3">Channel</th>
                    <th className="py-2.5 px-3">Campaign Type</th>
                    <th className="py-2.5 px-3">Audience & Reach</th>
                    <th className="py-2.5 px-3">Scheduled / Sent Date</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {filteredOverviewCampaigns.map(camp => (
                    <tr
                      key={camp.id}
                      onClick={() => {
                        setSelectedCampaignForDetail(camp);
                        setDetailModalTab('OVERVIEW');
                      }}
                      className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 transition"
                    >
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900 dark:text-white">{camp.name}</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{camp.id}</div>
                      </td>

                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold ${
                            camp.channel === 'WHATSAPP'
                              ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                              : camp.channel === 'SMS'
                              ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                              : 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                          }`}
                        >
                          {camp.channel}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-slate-700 dark:text-slate-300">
                        {camp.campaignType || 'General Announcement'}
                      </td>

                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-900 dark:text-white truncate max-w-xs">{camp.targetAudience}</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">
                          {camp.recipientCount.toLocaleString()} Contacts
                        </div>
                      </td>

                      <td className="py-3 px-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        {camp.scheduledTime}
                      </td>

                      <td className="py-3 px-3 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            camp.status === 'RUNNING'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : camp.status === 'COMPLETED'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : camp.status === 'SCHEDULED'
                              ? 'bg-purple-50 text-purple-700 border border-purple-200'
                              : camp.status === 'PAUSED'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {camp.status}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-right whitespace-nowrap" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          {camp.status === 'RUNNING' || camp.status === 'PAUSED' ? (
                            <button
                              onClick={() => handleToggleCampaignStatus(camp.id, camp.status)}
                              className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                              title={camp.status === 'RUNNING' ? 'Pause Campaign' : 'Resume Campaign'}
                            >
                              {camp.status === 'RUNNING' ? <Pause className="w-3.5 h-3.5 text-amber-600" /> : <Play className="w-3.5 h-3.5 text-blue-600" />}
                            </button>
                          ) : null}

                          <button
                            onClick={() => {
                              setSelectedCampaignForDetail(camp);
                              setDetailModalTab('OVERVIEW');
                            }}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                          >
                            Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          WORKSPACE 2, 3, 4: DEDICATED CHANNEL WORKSPACES (WHATSAPP, SMS, AI VOICE)
      ========================================================================= */}
      {(activeWorkspace === 'WHATSAPP' || activeWorkspace === 'SMS' || activeWorkspace === 'AI_VOICE') && (
        <div className="space-y-6 animate-fade-in">
          {/* Sub-tab navigation inside Channel Workspace */}
          <div className="flex flex-wrap items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300">
            {[
              { id: 'DASHBOARD', label: 'Dashboard' },
              { id: 'LIVE', label: 'Live Campaigns' },
              { id: 'CREATE', label: 'Create Campaign' },
              { id: 'INDIVIDUAL', label: 'Individual Comms' },
              { id: 'AUTOMATED', label: 'Automated Campaigns' },
              { id: 'TEMPLATES', label: activeWorkspace === 'AI_VOICE' ? 'Script Library' : 'Template Library' },
              { id: 'STATS', label: 'Statistics & Analytics' },
              { id: 'RESPONSES', label: activeWorkspace === 'AI_VOICE' ? 'Call History' : 'Responses' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setChannelSubTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg transition ${
                  channelSubTab === tab.id
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* CHANNEL SUB-TAB 1: CHANNEL DASHBOARD */}
          {channelSubTab === 'DASHBOARD' && (
            <div className="space-y-5 animate-fade-in">
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Available Credits</span>
                  <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">
                    {activeWorkspace === 'WHATSAPP'
                      ? walletCredits.whatsapp.toLocaleString()
                      : activeWorkspace === 'SMS'
                      ? walletCredits.sms.toLocaleString()
                      : walletCredits.voice.toLocaleString()}
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Active Campaigns</span>
                  <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                    {campaigns.filter(c => c.channel === activeWorkspace && c.status === 'RUNNING').length}
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block">Delivered Messages</span>
                  <div className="text-2xl font-black text-blue-600 mt-1">
                    {campaigns
                      .filter(c => c.channel === activeWorkspace)
                      .reduce((acc, c) => acc + (c.deliveredCount || 0), 0)
                      .toLocaleString()}
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 block">Read / Engaged</span>
                  <div className="text-2xl font-black text-purple-600 mt-1">
                    {campaigns
                      .filter(c => c.channel === activeWorkspace)
                      .reduce((acc, c) => acc + (c.readCount || 0), 0)
                      .toLocaleString()}
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 block">Failed / Undelivered</span>
                  <div className="text-2xl font-black text-rose-600 mt-1">
                    {campaigns
                      .filter(c => c.channel === activeWorkspace)
                      .reduce((acc, c) => acc + (c.failedCount || 0), 0)}
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 block">Active Automations</span>
                  <div className="text-2xl font-black text-amber-600 mt-1">
                    {automations.filter(a => a.channel === activeWorkspace && a.status === 'ACTIVE').length}
                  </div>
                </div>
              </div>

              {/* Action Banner inside Channel Workspace */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm border border-blue-800/40">
                <div>
                  <h3 className="text-base font-black">
                    Launch New {activeWorkspace === 'WHATSAPP' ? 'WhatsApp Broadcast' : activeWorkspace === 'SMS' ? 'DLT SMS Campaign' : 'AI Voice Outbound Blast'}
                  </h3>
                  <p className="text-xs text-blue-200/90 max-w-xl mt-0.5">
                    Target verified voters across booths with pre-approved templates and automated variable substitution.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setWizardChannel(activeWorkspace as ChannelMode);
                      setIsWizardOpen(true);
                      setWizardStep(1);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 shadow-sm"
                  >
                    + Create {activeWorkspace} Campaign
                  </button>
                  <button
                    onClick={() => setChannelSubTab('INDIVIDUAL')}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-blue-700/80 hover:bg-blue-600 border border-blue-400/40"
                  >
                    1-on-1 Individual Send
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* CHANNEL SUB-TAB 2: LIVE CAMPAIGNS */}
          {channelSubTab === 'LIVE' && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4 animate-fade-in">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Live & Scheduled {activeWorkspace} Broadcasts
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold uppercase text-slate-500">
                      <th className="py-2.5 px-3">Campaign</th>
                      <th className="py-2.5 px-3">Audience</th>
                      <th className="py-2.5 px-3">Delivered / Sent</th>
                      <th className="py-2.5 px-3">Progress Rate</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                    {campaigns
                      .filter(c => c.channel === activeWorkspace)
                      .map(c => {
                        const progress = c.recipientCount > 0 ? Math.round((c.deliveredCount / c.recipientCount) * 100) : 0;
                        return (
                          <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                            <td className="py-3 px-3">
                              <div className="font-bold text-slate-900 dark:text-white">{c.name}</div>
                              <div className="text-[10px] text-slate-500">{c.scheduledTime}</div>
                            </td>
                            <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                              {c.targetAudience}
                            </td>
                            <td className="py-3 px-3 font-mono font-bold">
                              {c.deliveredCount.toLocaleString()} / {c.recipientCount.toLocaleString()}
                            </td>
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-2">
                                <div className="w-20 bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                                  <div className="bg-blue-600 h-full" style={{ width: `${progress}%` }}></div>
                                </div>
                                <span className="text-[10px] font-bold text-slate-500">{progress}%</span>
                              </div>
                            </td>
                            <td className="py-3 px-3">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                                {c.status}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-right">
                              <button
                                onClick={() => handleToggleCampaignStatus(c.id, c.status)}
                                className="px-2.5 py-1 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200"
                              >
                                {c.status === 'RUNNING' ? 'Pause' : 'Resume'}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* CHANNEL SUB-TAB 3: CREATE CAMPAIGN WIZARD EMBED */}
          {channelSubTab === 'CREATE' && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4 animate-fade-in text-center py-12">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Plus className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Launch Guided {activeWorkspace} Campaign
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                Step-by-step wizard to select campaign category, target voter booths, configure approved message variables, and verify provider delivery costs.
              </p>
              <button
                onClick={() => {
                  setWizardChannel(activeWorkspace as ChannelMode);
                  setIsWizardOpen(true);
                  setWizardStep(1);
                }}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm"
              >
                Open Campaign Creation Wizard
              </button>
            </div>
          )}

          {/* CHANNEL SUB-TAB 4: INDIVIDUAL 1-TO-1 COMMUNICATION (Section 6) */}
          {channelSubTab === 'INDIVIDUAL' && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-5 animate-fade-in">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-blue-600" />
                  Individual 1-on-1 Voter Communication ({activeWorkspace})
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Direct dispatch to a single voter. Sent communications are recorded against the voter's Central Voter Profile timeline.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Voter Search & Identity */}
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Search & Select Target Voter
                  </label>
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Type voter name, EPIC ID, or mobile number..."
                      value={individualSearchVoter}
                      onChange={e => setIndividualSearchVoter(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                    />
                  </div>

                  {/* Voter Quick List */}
                  <div className="space-y-1.5 max-h-56 overflow-y-auto">
                    {MOCK_VOTERS.map(v => (
                      <div
                        key={v.id}
                        onClick={() => setSelectedIndividualVoter(v)}
                        className={`cursor-pointer p-3 rounded-xl border flex items-center justify-between text-xs transition ${
                          selectedIndividualVoter?.id === v.id
                            ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-400 font-bold text-blue-900 dark:text-blue-200'
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                        }`}
                      >
                        <div>
                          <div>{v.fullName}</div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            {v.epicNumber} • {v.mobile} • Booth #{v.boothNumber}
                          </div>
                        </div>
                        {selectedIndividualVoter?.id === v.id && <Check className="w-4 h-4 text-blue-600" />}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Message / Script Composer */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Message Content & Personalization
                    </label>
                    <span className="text-[10px] text-slate-400">Available: {'{Voter Name}'}, {'{Booth Number}'}</span>
                  </div>

                  <textarea
                    rows={5}
                    value={individualMessageText}
                    onChange={e => setIndividualMessageText(e.target.value)}
                    className="w-full p-3 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />

                  {/* Live Rendered Preview */}
                  <div className="p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-xs">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                      Live Personalized Preview:
                    </span>
                    <p className="font-medium text-slate-800 dark:text-slate-200">
                      {individualMessageText
                        .replace('{Voter Name}', selectedIndividualVoter?.fullName || 'Voter')
                        .replace('{Booth Number}', String(selectedIndividualVoter?.boothNumber || '101'))}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-slate-500">
                      Charge: 1 Credit (₹0.15)
                    </span>
                    <button
                      onClick={handleSendIndividual}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Send to {selectedIndividualVoter?.fullName}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CHANNEL SUB-TAB 5: AUTOMATED CAMPAIGNS (Section 7) */}
          {channelSubTab === 'AUTOMATED' && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Repeat className="w-4 h-4 text-purple-600" />
                    Automated Event & Date-Based Triggers ({activeWorkspace})
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Continuous automated campaigns that fire without manual audience selection (Birthday Wishes, Survey Follow-ups, Festival Reminders).
                  </p>
                </div>

                <button
                  onClick={() => showToast('Configuring new automation rule...', 'info')}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700"
                >
                  + Add Automation Rule
                </button>
              </div>

              <div className="space-y-3">
                {automations
                  .filter(a => a.channel === activeWorkspace)
                  .map(auto => (
                    <div
                      key={auto.id}
                      className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900 dark:text-white">{auto.name}</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                            {auto.campaignType}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Trigger: <span className="font-semibold text-slate-700 dark:text-slate-300">{auto.trigger}</span> • Audience: {auto.audience}
                        </p>
                        <div className="text-[11px] text-slate-400 font-mono">
                          Template: "{auto.templateSnippet}"
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right text-xs">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Sent Today</span>
                          <span className="font-bold text-blue-600">{auto.sentToday} voters</span>
                        </div>

                        <button
                          onClick={() => {
                            setAutomations(prev =>
                              prev.map(a =>
                                a.id === auto.id
                                  ? { ...a, status: a.status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE' }
                                  : a
                              )
                            );
                            showToast(`Automation rule ${auto.status === 'ACTIVE' ? 'disabled' : 'enabled'}.`, 'info');
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                            auto.status === 'ACTIVE'
                              ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                              : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}
                        >
                          {auto.status}
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* CHANNEL SUB-TAB 6: TEMPLATE / SCRIPT LIBRARY (Section 3, 4, 5) */}
          {channelSubTab === 'TEMPLATES' && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    {activeWorkspace === 'AI_VOICE' ? 'Voice Script Repository' : 'Message Template Library'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Meta Business API / DLT TRAI approved message structures with verified variable schemas.
                  </p>
                </div>
                <button
                  onClick={() => showToast('Opening provider template submission modal...', 'info')}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700"
                >
                  + Submit New Template
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates
                  .filter(t => t.channel === activeWorkspace)
                  .map(tpl => (
                    <div
                      key={tpl.id}
                      className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between shadow-xs"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            {tpl.category}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                            {tpl.status}
                          </span>
                        </div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">{tpl.name}</h4>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl leading-relaxed">
                          "{tpl.content}"
                        </p>
                      </div>

                      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                        <span>Variables: {tpl.variables.join(', ')}</span>
                        <button
                          onClick={() => {
                            setWizardContent(tpl.content);
                            setIsWizardOpen(true);
                            setWizardStep(4);
                          }}
                          className="font-bold text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          Use in Campaign
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* CHANNEL SUB-TAB 7: STATISTICS & ANALYTICS (Section 8) */}
          {channelSubTab === 'STATS' && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4 animate-fade-in">
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Channel Delivery & Response Velocity Analytics
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Detailed delivery receipts, read timestamps, and DND failure reasons reported directly by telco gateways.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Delivery Success Rate</span>
                  <div className="text-2xl font-black text-blue-600 mt-1">96.8%</div>
                  <span className="text-[11px] text-slate-500 mt-0.5 block">High gateway throughput</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Engagement / Read Rate</span>
                  <div className="text-2xl font-black text-purple-600 mt-1">88.2%</div>
                  <span className="text-[11px] text-slate-500 mt-0.5 block">Read within 4 hours</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Failure / DND Bounces</span>
                  <div className="text-2xl font-black text-rose-600 mt-1">3.2%</div>
                  <span className="text-[11px] text-slate-500 mt-0.5 block">Out of network or barred</span>
                </div>
              </div>
            </div>
          )}

          {/* CHANNEL SUB-TAB 8: RESPONSES / CALL HISTORY (Section 3, 5) */}
          {channelSubTab === 'RESPONSES' && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4 animate-fade-in">
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Incoming Voter Feedback & Interactive Responses
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold uppercase text-slate-500">
                      <th className="py-2.5 px-3">Voter Name</th>
                      <th className="py-2.5 px-3">Mobile</th>
                      <th className="py-2.5 px-3">Associated Campaign</th>
                      <th className="py-2.5 px-3">Response Received</th>
                      <th className="py-2.5 px-3">Timestamp</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                    {incomingResponses
                      .filter(r => r.channel === activeWorkspace)
                      .map(resp => (
                        <tr key={resp.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                          <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                            {resp.voterName}
                          </td>
                          <td className="py-3 px-3 font-mono">{resp.mobile}</td>
                          <td className="py-3 px-3 text-slate-600 dark:text-slate-300">{resp.campaign}</td>
                          <td className="py-3 px-3 text-slate-800 dark:text-slate-200 font-medium max-w-xs">
                            "{resp.messageReceived}"
                          </td>
                          <td className="py-3 px-3 text-slate-500 whitespace-nowrap">{resp.receivedDate}</td>
                          <td className="py-3 px-3 text-right">
                            <button
                              onClick={() => showToast(`Opened Central Voter Profile for ${resp.voterName}.`, 'info')}
                              className="px-2.5 py-1 rounded-lg text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              View Profile
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          WORKSPACE 5: RECHARGE & BILLING (Section 9)
      ========================================================================= */}
      {activeWorkspace === 'BILLING' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6 animate-fade-in">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                Communication Credits, Billing & Invoice Ledger
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Centralized balance management across WhatsApp Meta Business API, DLT SMS, and AI Outbound Speech.
              </p>
            </div>
            <button
              onClick={() => setIsRechargeModalOpen(true)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm"
            >
              + Recharge Wallet
            </button>
          </div>

          {/* Balances Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 block">WhatsApp Balance</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{walletCredits.whatsapp.toLocaleString()}</div>
              <span className="text-[11px] text-slate-500 block mt-0.5">₹0.65 / utility conversation</span>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 block">DLT SMS Balance</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{walletCredits.sms.toLocaleString()}</div>
              <span className="text-[11px] text-slate-500 block mt-0.5">₹0.15 / 160-char segment</span>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300 block">AI Voice Call Balance</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{walletCredits.voice.toLocaleString()}</div>
              <span className="text-[11px] text-slate-500 block mt-0.5">₹0.85 / connected minute</span>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300 block">Total Wallet Reserve</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">₹{walletCredits.totalBalanceInr.toLocaleString()}</div>
              <span className="text-[11px] text-slate-500 block mt-0.5">Direct GST Tax Invoice</span>
            </div>
          </div>

          {/* Pricing Packs Grid */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
              Available Channel Recharge Bundles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-bold text-blue-600">WhatsApp High-Volume Pack</div>
                  <div className="text-xl font-black text-slate-900 dark:text-white mt-1">₹15,000</div>
                  <p className="text-xs text-slate-500 mt-1">25,000 Meta Business Utility Messages with full QR & media support.</p>
                </div>
                <button
                  onClick={() => {
                    setWalletCredits(prev => ({ ...prev, whatsapp: prev.whatsapp + 25000 }));
                    showToast('Recharge successful. 25,000 WhatsApp credits added.', 'success');
                  }}
                  className="mt-4 w-full py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700"
                >
                  Recharge WhatsApp
                </button>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-bold text-blue-600">DLT SMS Blast Pack</div>
                  <div className="text-xl font-black text-slate-900 dark:text-white mt-1">₹10,000</div>
                  <p className="text-xs text-slate-500 mt-1">70,000 160-character promotional/transactional SMS credits.</p>
                </div>
                <button
                  onClick={() => {
                    setWalletCredits(prev => ({ ...prev, sms: prev.sms + 70000 }));
                    showToast('Recharge successful. 70,000 SMS credits added.', 'success');
                  }}
                  className="mt-4 w-full py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700"
                >
                  Recharge SMS
                </button>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-bold text-purple-600">Combo Triple-Power Pack</div>
                  <div className="text-xl font-black text-slate-900 dark:text-white mt-1">₹35,000</div>
                  <p className="text-xs text-slate-500 mt-1">50,000 WhatsApp + 50,000 SMS + 15,000 AI Voice Outbound Minutes.</p>
                </div>
                <button
                  onClick={() => {
                    setWalletCredits(prev => ({
                      ...prev,
                      whatsapp: prev.whatsapp + 50000,
                      sms: prev.sms + 50000,
                      voice: prev.voice + 15000
                    }));
                    showToast('Triple Pack Activated! WhatsApp, SMS, and Voice balances topped up.', 'success');
                  }}
                  className="mt-4 w-full py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700"
                >
                  Activate Combo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          GUIDED CREATE CAMPAIGN WIZARD MODAL (Section 2 - 7 Steps)
      ========================================================================= */}
      {isWizardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
            {/* Wizard Header */}
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-900">
              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                  Step {wizardStep} of 7 • Guided Campaign Engine
                </span>
                <h3 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                  {wizardStep === 1 && 'Step 1: Select Communication Mode'}
                  {wizardStep === 2 && 'Step 2: Select Communication Channel'}
                  {wizardStep === 3 && 'Step 3: Select Campaign Type & Goal'}
                  {wizardStep === 4 && 'Step 4: Select Target Voter Audience'}
                  {wizardStep === 5 && 'Step 5: Configure Message Content & Script'}
                  {wizardStep === 6 && 'Step 6: Schedule Execution Time'}
                  {wizardStep === 7 && 'Step 7: Final Cost Audit & Launch Confirmation'}
                </h3>
              </div>
              <button
                onClick={() => setIsWizardOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Wizard Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* STEP 1: Bulk vs Individual */}
              {wizardStep === 1 && (
                <div className="space-y-4">
                  <p className="text-xs text-slate-500">Choose whether to reach voters in bulk batches or send a dedicated personalized communication.</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div
                      onClick={() => setWizardMode('BULK')}
                      className={`cursor-pointer p-5 rounded-2xl border transition ${
                        wizardMode === 'BULK'
                          ? 'bg-blue-50/70 dark:bg-blue-950/60 border-blue-500 ring-2 ring-blue-500/20'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                      }`}
                    >
                      <Users className="w-6 h-6 text-blue-600 mb-2" />
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">A. Bulk Campaign</h4>
                      <p className="text-xs text-slate-500 mt-1">Broadcast to thousands of verified electors, entire booths, or segmented lists.</p>
                    </div>

                    <div
                      onClick={() => setWizardMode('INDIVIDUAL')}
                      className={`cursor-pointer p-5 rounded-2xl border transition ${
                        wizardMode === 'INDIVIDUAL'
                          ? 'bg-blue-50/70 dark:bg-blue-950/60 border-blue-500 ring-2 ring-blue-500/20'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                      }`}
                    >
                      <UserCheck className="w-6 h-6 text-purple-600 mb-2" />
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">B. Individual Communication</h4>
                      <p className="text-xs text-slate-500 mt-1">Send a 1-to-1 message or audio call to a single voter with CRM history tracking.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Channel Selection */}
              {wizardStep === 2 && (
                <div className="space-y-4">
                  <p className="text-xs text-slate-500">Select an approved carrier pipeline. Balances are deducted automatically per recipient.</p>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { id: 'WHATSAPP', label: 'WhatsApp API', desc: 'Rich media, cards, buttons', bal: walletCredits.whatsapp },
                      { id: 'SMS', label: 'DLT SMS Broadcast', desc: '160-char text alerts', bal: walletCredits.sms },
                      { id: 'AI_VOICE', label: 'AI Voice Call Agent', desc: 'Cloned Marathi speech calls', bal: walletCredits.voice }
                    ].map(ch => (
                      <div
                        key={ch.id}
                        onClick={() => setWizardChannel(ch.id as ChannelMode)}
                        className={`cursor-pointer p-4 rounded-2xl border transition ${
                          wizardChannel === ch.id
                            ? 'bg-blue-50/70 dark:bg-blue-950/60 border-blue-500 ring-2 ring-blue-500/20'
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                        }`}
                      >
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">{ch.label}</h4>
                        <p className="text-xs text-slate-500 mt-1">{ch.desc}</p>
                        <div className="mt-3 text-[11px] font-mono font-bold text-blue-600">
                          {ch.bal.toLocaleString()} credits available
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 3: Campaign Type Selection */}
              {wizardStep === 3 && (
                <div className="space-y-4">
                  <p className="text-xs text-slate-500">Categorize your campaign to select matching DLT/Meta approved templates.</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-64 overflow-y-auto">
                    {[
                      'Election Day Reminder',
                      'Voter Slip Sharing',
                      'Polling Booth Information',
                      'Birthday Messages',
                      'Festival / Holiday Greetings',
                      'General Announcement',
                      'Event Invitation',
                      'Volunteer / Worker Communication',
                      'Survey Invitation',
                      'Feedback Request'
                    ].map(type => (
                      <div
                        key={type}
                        onClick={() => setWizardCategory(type)}
                        className={`cursor-pointer p-3 rounded-xl border text-xs transition ${
                          wizardCategory === type
                            ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 font-bold text-blue-900 dark:text-blue-200'
                            : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                        }`}
                      >
                        {type}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 4: Audience Selection */}
              {wizardStep === 4 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div
                      onClick={() => setWizardAudienceScope('CONSTITUENCY')}
                      className={`cursor-pointer p-3.5 rounded-xl border text-xs ${
                        wizardAudienceScope === 'CONSTITUENCY' ? 'bg-blue-50 border-blue-500 font-bold' : 'border-slate-200'
                      }`}
                    >
                      All Verified Contacts in Constituency (24,865 voters)
                    </div>
                    <div
                      onClick={() => setWizardAudienceScope('BOOTH')}
                      className={`cursor-pointer p-3.5 rounded-xl border text-xs ${
                        wizardAudienceScope === 'BOOTH' ? 'bg-blue-50 border-blue-500 font-bold' : 'border-slate-200'
                      }`}
                    >
                      Specific Polling Booths (Select 1 or more)
                    </div>
                  </div>

                  {wizardAudienceScope === 'BOOTH' && (
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-slate-700">Choose Polling Booths:</span>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        {[101, 102, 103, 104, 105, 106, 107, 108].map(b => {
                          const isSel = wizardSelectedBooths.includes(b);
                          return (
                            <div
                              key={b}
                              onClick={() => {
                                setWizardSelectedBooths(prev =>
                                  prev.includes(b) ? prev.filter(x => x !== b) : [...prev, b]
                                );
                              }}
                              className={`cursor-pointer p-2.5 rounded-xl border flex items-center justify-between ${
                                isSel ? 'bg-blue-50 border-blue-500 font-bold text-blue-900' : 'border-slate-200'
                              }`}
                            >
                              <span>Booth #{b} (Navbharat)</span>
                              {isSel ? <CheckSquare className="w-3.5 h-3.5 text-blue-600" /> : <Square className="w-3.5 h-3.5 text-slate-400" />}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="p-3 bg-blue-50/50 dark:bg-blue-950/40 rounded-xl border border-blue-200 text-xs flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white">Eligible Contacts: </span>
                      <span>{wizardAudienceScope === 'BOOTH' ? wizardSelectedBooths.length * 1140 : 24865} voters with verified mobile numbers</span>
                    </div>
                    <span className="text-[10px] text-slate-500">Excluded: 142 (No phone)</span>
                  </div>
                </div>
              )}

              {/* STEP 5: Content Configuration */}
              {wizardStep === 5 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Message Content / Script
                    </label>
                    <textarea
                      rows={4}
                      value={wizardContent}
                      onChange={e => setWizardContent(e.target.value)}
                      className="w-full p-3 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>

                  {wizardChannel === 'AI_VOICE' && (
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block font-bold mb-1">AI Voice Model</label>
                        <select
                          value={wizardAiVoice}
                          onChange={e => setWizardAiVoice(e.target.value)}
                          className="w-full p-2 rounded-xl border bg-slate-50 dark:bg-slate-800"
                        >
                          <option>Candidate Voice Clone HD (Marathi)</option>
                          <option>Professional Marathi Female Voice Agent</option>
                          <option>Friendly Karyakarta Male Voice</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold mb-1">Speech Language</label>
                        <select
                          value={wizardLanguage}
                          onChange={e => setWizardLanguage(e.target.value)}
                          className="w-full p-2 rounded-xl border bg-slate-50 dark:bg-slate-800"
                        >
                          <option>Marathi (Pune dialect)</option>
                          <option>Hindi (Formal)</option>
                          <option>English</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 6: Schedule or Send */}
              {wizardStep === 6 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'NOW', label: 'Send Immediately', desc: 'Dispatches upon confirmation' },
                      { id: 'LATER', label: 'Schedule Execution', desc: 'Pick exact date & time' },
                      { id: 'DRAFT', label: 'Save as Draft', desc: 'Review later before launch' }
                    ].map(opt => (
                      <div
                        key={opt.id}
                        onClick={() => setWizardScheduleOption(opt.id as any)}
                        className={`cursor-pointer p-4 rounded-xl border text-center ${
                          wizardScheduleOption === opt.id ? 'bg-blue-50 border-blue-500 font-bold text-blue-900' : 'border-slate-200'
                        }`}
                      >
                        <div className="text-xs font-bold">{opt.label}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{opt.desc}</div>
                      </div>
                    ))}
                  </div>

                  {wizardScheduleOption === 'LATER' && (
                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 max-w-sm">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Select Scheduled Execution Date & Time
                      </label>
                      <input
                        type="text"
                        value={wizardScheduleTime}
                        onChange={e => setWizardScheduleTime(e.target.value)}
                        className="w-full p-2 rounded-xl text-xs border"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* STEP 7: Final Audit Confirmation */}
              {wizardStep === 7 && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Channel</span>
                      <span className="font-bold text-slate-900 dark:text-white">{wizardChannel}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Campaign Type</span>
                      <span className="font-bold text-slate-900 dark:text-white">{wizardCategory}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Eligible Contacts</span>
                      <span className="font-bold text-blue-600">
                        {wizardAudienceScope === 'BOOTH' ? wizardSelectedBooths.length * 1140 : 24865} voters
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Est. Cost</span>
                      <span className="font-bold text-amber-600">
                        {wizardAudienceScope === 'BOOTH' ? wizardSelectedBooths.length * 1140 : 24865} credits
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border text-xs">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Message Preview:</span>
                    <p className="font-medium text-slate-800 dark:text-slate-200">"{wizardContent}"</p>
                  </div>
                </div>
              )}
            </div>

            {/* Wizard Navigation Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-between">
              <button
                disabled={wizardStep === 1}
                onClick={() => setWizardStep(prev => Math.max(1, prev - 1))}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 disabled:opacity-30"
              >
                Back
              </button>

              {wizardStep < 7 ? (
                <button
                  onClick={() => setWizardStep(prev => Math.min(7, prev + 1))}
                  className="flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700"
                >
                  <span>Continue</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleLaunchCampaign}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md"
                >
                  <Send className="w-4 h-4" />
                  Confirm & Launch Campaign
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          CAMPAIGN DETAILS MODAL (Section 10 - Unified View)
      ========================================================================= */}
      {selectedCampaignForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-900">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-blue-600">{selectedCampaignForDetail.id}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                    {selectedCampaignForDetail.status}
                  </span>
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                  {selectedCampaignForDetail.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedCampaignForDetail(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex items-center gap-2 px-5 pt-3 border-b border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400">
              {['OVERVIEW', 'AUDIENCE', 'CONTENT', 'PERFORMANCE', 'RESPONSES', 'BILLING'].map(t => (
                <button
                  key={t}
                  onClick={() => setDetailModalTab(t as any)}
                  className={`pb-2.5 transition ${
                    detailModalTab === t ? 'text-blue-600 border-b-2 border-blue-600 font-extrabold' : 'hover:text-slate-900'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
              {detailModalTab === 'OVERVIEW' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Channel</span>
                      <span className="font-bold text-slate-900 dark:text-white">{selectedCampaignForDetail.channel}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Recipients</span>
                      <span className="font-bold text-slate-900 dark:text-white">{selectedCampaignForDetail.recipientCount.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Delivered</span>
                      <span className="font-bold text-blue-600">{selectedCampaignForDetail.deliveredCount.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Credits Spent</span>
                      <span className="font-bold text-amber-600">{selectedCampaignForDetail.estimatedCostCredits.toLocaleString()}</span>
                    </div>
                  </div>
                  <div>
                    <span className="font-bold block mb-1">Target Audience Scope:</span>
                    <p className="text-slate-600 dark:text-slate-300">{selectedCampaignForDetail.targetAudience}</p>
                  </div>
                </div>
              )}

              {detailModalTab === 'CONTENT' && (
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border space-y-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Approved Message Template / Script:</span>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                    "{selectedCampaignForDetail.messageTemplate}"
                  </p>
                </div>
              )}

              {detailModalTab === 'PERFORMANCE' && (
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-4 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200">
                    <span className="text-[10px] uppercase font-bold text-blue-700 block">Delivery Rate</span>
                    <div className="text-2xl font-black text-blue-700 mt-1">
                      {Math.round((selectedCampaignForDetail.deliveredCount / selectedCampaignForDetail.recipientCount) * 100)}%
                    </div>
                  </div>
                  <div className="p-4 bg-purple-50 dark:bg-purple-950/40 rounded-xl border border-purple-200">
                    <span className="text-[10px] uppercase font-bold text-purple-700 block">Read Rate</span>
                    <div className="text-2xl font-black text-purple-700 mt-1">
                      {Math.round((selectedCampaignForDetail.readCount / selectedCampaignForDetail.recipientCount) * 100)}%
                    </div>
                  </div>
                  <div className="p-4 bg-rose-50 dark:bg-rose-950/40 rounded-xl border border-rose-200">
                    <span className="text-[10px] uppercase font-bold text-rose-700 block">Failed / Barred</span>
                    <div className="text-2xl font-black text-rose-700 mt-1">
                      {selectedCampaignForDetail.failedCount || 0}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-end">
              <button
                onClick={() => setSelectedCampaignForDetail(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          RECHARGE CREDITS MODAL
      ========================================================================= */}
      {isRechargeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-blue-600" />
                Recharge Campaign Credits
              </h3>
              <button onClick={() => setIsRechargeModalOpen(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              Select credit bundle to top up your unified communication balance. Instant activation on UPI or netbanking.
            </p>

            <div className="space-y-2">
              {[
                { label: '50,000 WhatsApp Credits', price: '₹32,500' },
                { label: '1,00,000 DLT SMS Credits', price: '₹15,000' },
                { label: '20,000 AI Voice Outbound Minutes', price: '₹17,000' }
              ].map((pack, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setWalletCredits(prev => ({ ...prev, totalBalanceInr: prev.totalBalanceInr + 10000 }));
                    setIsRechargeModalOpen(false);
                    showToast(`Added ${pack.label} to wallet balance.`, 'success');
                  }}
                  className="cursor-pointer p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-400 flex items-center justify-between text-xs transition"
                >
                  <span className="font-bold text-slate-900 dark:text-white">{pack.label}</span>
                  <span className="font-bold text-blue-600">{pack.price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
