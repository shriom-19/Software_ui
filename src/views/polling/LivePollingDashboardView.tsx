import React, { useState, useMemo, useEffect } from 'react';
import {
  Vote,
  Users,
  CheckCircle2,
  Clock,
  MapPin,
  TrendingUp,
  AlertCircle,
  Search,
  Filter,
  ArrowRight,
  Eye,
  RefreshCw,
  Bell,
  SlidersHorizontal,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Phone,
  Printer,
  ShieldCheck,
  Check,
  X,
  XCircle,
  Activity,
  Layers,
  Building2,
  Calendar,
  Radio,
  FileSpreadsheet,
  Download,
  Send,
  UserCheck,
  History,
  Mail,
  Smartphone,
  Lock,
  FileText,
  CheckSquare,
  Square,
  Settings,
  AlertTriangle,
  Info
} from 'lucide-react';
import {
  useLivePollingStore,
  BoothLivePollingStats,
  LifecycleMode,
  NotificationFrequency,
  HistoricalElection
} from '../../services/livePollingStore';
import { CURRENT_ELECTION_CONTEXT, MOCK_VOTERS, MOCK_USERS } from '../../data/mockData';
import { Voter, User } from '../../types';
import { useToast } from '../../components/common/Toast';

interface LivePollingDashboardViewProps {
  onNavigateToView: (view: string) => void;
  onSelectVoter?: (voter: Voter) => void;
}

export const LivePollingDashboardView: React.FC<LivePollingDashboardViewProps> = ({
  onNavigateToView,
  onSelectVoter
}) => {
  const { showToast } = useToast();
  const {
    boothLiveStats,
    summary,
    constituencyHourlyProgress,
    votingRecords,
    toggleVoterVotingStatus,
    resetAllPollingData,
    notificationSettings,
    updateNotificationSettings,
    notificationLogs,
    addNotificationLog,
    lifecycleInfo,
    setLifecycleMode,
    historicalElections,
    getHistoricalElectionById
  } = useLivePollingStore();

  // -----------------------------------------------------------
  // Top Level Navigation Tabs:
  // Live Dashboard | Notification Settings | Election History
  // -----------------------------------------------------------
  const [activeTab, setActiveTab] = useState<'live' | 'notifications' | 'history'>(() => {
    return lifecycleInfo.status === 'EXPIRED' ? 'history' : 'live';
  });

  // Automatically adjust default view if election expires
  useEffect(() => {
    if (lifecycleInfo.status === 'EXPIRED' && activeTab === 'live') {
      // Allow remaining on live view if user explicitly clicks, but default to history
    }
  }, [lifecycleInfo.status]);

  // Selected Historical Election for Detail View
  const [selectedHistoricalElectionId, setSelectedHistoricalElectionId] = useState<string | null>(null);

  // -----------------------------------------------------------
  // Live Dashboard State
  // -----------------------------------------------------------
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedBoothForChart, setSelectedBoothForChart] = useState<string>('CONSTITUENCY');
  const [activeInspectorBooth, setActiveInspectorBooth] = useState<BoothLivePollingStats | null>(null);

  // Table Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [gradeFilter, setGradeFilter] = useState<string>('ALL');
  const [voterCountFilter, setVoterCountFilter] = useState<string>('ALL');
  const [turnoutRangeFilter, setTurnoutRangeFilter] = useState<string>('ALL');
  const [slipDeliveryFilter, setSlipDeliveryFilter] = useState<string>('ALL');
  const [karyakartaFilter, setKaryakartaFilter] = useState<string>('ALL');
  const [bloSearch, setBloSearch] = useState<string>('ALL');

  // Table Sorting & Pagination
  const [sortField, setSortField] = useState<keyof BoothLivePollingStats>('boothNumber');
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  // Inspector Voter Tab Filter
  const [inspectorVoterFilter, setInspectorVoterFilter] = useState<'ALL' | 'VOTED' | 'NOT_VOTED'>('ALL');
  const [inspectorVoterSearch, setInspectorVoterSearch] = useState('');

  // -----------------------------------------------------------
  // Local Notification Form State (Synced with Store)
  // -----------------------------------------------------------
  const [notifInAppEnabled, setNotifInAppEnabled] = useState(notificationSettings.inAppEnabled);
  const [notifInAppFreq, setNotifInAppFreq] = useState<NotificationFrequency>(notificationSettings.inAppFrequency);
  const [notifInAppRecipients, setNotifInAppRecipients] = useState<string[]>(notificationSettings.inAppRecipients);

  const [notifEmailEnabled, setNotifEmailEnabled] = useState(notificationSettings.emailEnabled);
  const [notifEmailFreq, setNotifEmailFreq] = useState<NotificationFrequency>(notificationSettings.emailFrequency);
  const [notifEmailRecipients, setNotifEmailRecipients] = useState<string[]>(notificationSettings.emailRecipients);

  const [notifCategories, setNotifCategories] = useState(notificationSettings.categories);

  useEffect(() => {
    setNotifInAppEnabled(notificationSettings.inAppEnabled);
    setNotifInAppFreq(notificationSettings.inAppFrequency);
    setNotifInAppRecipients(notificationSettings.inAppRecipients);
    setNotifEmailEnabled(notificationSettings.emailEnabled);
    setNotifEmailFreq(notificationSettings.emailFrequency);
    setNotifEmailRecipients(notificationSettings.emailRecipients);
    setNotifCategories(notificationSettings.categories);
  }, [notificationSettings]);

  const handleSaveNotificationSettings = () => {
    updateNotificationSettings({
      inAppEnabled: notifInAppEnabled,
      inAppFrequency: notifInAppFreq,
      inAppRecipients: notifInAppRecipients,
      emailEnabled: notifEmailEnabled,
      emailFrequency: notifEmailFreq,
      emailRecipients: notifEmailRecipients,
      categories: notifCategories
    });
    showToast('Notification settings successfully updated & applied for live polling period.', 'success');
  };

  const handleSendTestNotification = () => {
    addNotificationLog({
      category: 'Overall Turnout',
      channel: notifInAppEnabled && notifEmailEnabled ? 'BOTH' : notifInAppEnabled ? 'IN_APP' : 'EMAIL',
      recipientCount: Math.max(1, notifInAppRecipients.length),
      title: 'Manual Turnout Pulse Test: ' + summary.overallVotingPercentage + '%',
      message: `Verified broadcast sent: ${summary.totalVotesCast.toLocaleString()} votes cast across 8 polling stations.`
    });
    showToast('Test notification broadcast dispatched to configured recipients.', 'info');
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      showToast('Live Polling records & ECI telemetry refreshed successfully.', 'success');
    }, 600);
  };

  // Distinct BLO options for filter
  const bloOptions = useMemo(() => {
    const set = new Set<string>();
    boothLiveStats.forEach((b) => set.add(b.bloName));
    return Array.from(set);
  }, [boothLiveStats]);

  // Filtered & Sorted Booths
  const filteredBooths = useMemo(() => {
    return boothLiveStats
      .filter((b) => {
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          const matchBoothNo = b.boothNumber.toString().includes(q);
          const matchName = b.name.toLowerCase().includes(q);
          const matchLocality = b.locality.toLowerCase().includes(q);
          if (!matchBoothNo && !matchName && !matchLocality) return false;
        }

        if (gradeFilter !== 'ALL' && b.grade !== gradeFilter) return false;

        if (voterCountFilter === 'UNDER_1000' && b.totalVoters >= 1000) return false;
        if (voterCountFilter === '1000_1300' && (b.totalVoters < 1000 || b.totalVoters > 1300)) return false;
        if (voterCountFilter === 'OVER_1300' && b.totalVoters <= 1300) return false;

        if (turnoutRangeFilter === 'UNDER_50' && b.liveTurnoutPercent >= 50) return false;
        if (turnoutRangeFilter === '50_70' && (b.liveTurnoutPercent < 50 || b.liveTurnoutPercent > 70)) return false;
        if (turnoutRangeFilter === 'OVER_70' && b.liveTurnoutPercent <= 70) return false;

        if (slipDeliveryFilter === 'UNDER_70' && b.slipsDeliveredPercent >= 70) return false;
        if (slipDeliveryFilter === '70_89' && (b.slipsDeliveredPercent < 70 || b.slipsDeliveredPercent > 89)) return false;
        if (slipDeliveryFilter === 'OVER_90' && b.slipsDeliveredPercent < 90) return false;

        if (karyakartaFilter === 'UNDER_3' && b.karyakartaCount >= 3) return false;
        if (karyakartaFilter === '3_4' && (b.karyakartaCount < 3 || b.karyakartaCount > 4)) return false;
        if (karyakartaFilter === 'OVER_4' && b.karyakartaCount <= 4) return false;

        if (bloSearch !== 'ALL' && b.bloName !== bloSearch) return false;

        return true;
      })
      .sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];
        if (typeof valA === 'string') {
          return sortAsc ? (valA as string).localeCompare(valB as string) : (valB as string).localeCompare(valA as string);
        }
        return sortAsc ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
      });
  }, [
    boothLiveStats,
    searchTerm,
    gradeFilter,
    voterCountFilter,
    turnoutRangeFilter,
    slipDeliveryFilter,
    karyakartaFilter,
    bloSearch,
    sortField,
    sortAsc
  ]);

  const totalPages = Math.ceil(filteredBooths.length / itemsPerPage) || 1;
  const paginatedBooths = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredBooths.slice(start, start + itemsPerPage);
  }, [filteredBooths, currentPage, itemsPerPage]);

  // Hourly curve data for chart
  const activeHourlyProgress = useMemo(() => {
    if (selectedBoothForChart === 'CONSTITUENCY') {
      return constituencyHourlyProgress;
    }
    const boothNo = parseInt(selectedBoothForChart, 10);
    const targetBooth = boothLiveStats.find((b) => b.boothNumber === boothNo);
    return targetBooth?.hourlyProgress || constituencyHourlyProgress;
  }, [selectedBoothForChart, constituencyHourlyProgress, boothLiveStats]);

  // Voters for Inspector Drawer
  const inspectorVoters = useMemo(() => {
    if (!activeInspectorBooth) return [];
    return MOCK_VOTERS.filter((voter) => {
      const record = votingRecords[voter.id];
      const hasVoted = record ? record.hasVoted : (voter.hasVoted ?? false);

      if (voter.boothNumber !== activeInspectorBooth.boothNumber) return false;

      if (inspectorVoterFilter === 'VOTED' && !hasVoted) return false;
      if (inspectorVoterFilter === 'NOT_VOTED' && hasVoted) return false;

      if (inspectorVoterSearch.trim()) {
        const q = inspectorVoterSearch.toLowerCase();
        const matchName = voter.fullName.toLowerCase().includes(q);
        const matchEpic = voter.epicNumber.toLowerCase().includes(q);
        const matchMobile = (voter.mobile || '').includes(q);
        if (!matchName && !matchEpic && !matchMobile) return false;
      }

      return true;
    });
  }, [activeInspectorBooth, votingRecords, inspectorVoterFilter, inspectorVoterSearch]);

  // Selected Historical Election Object
  const selectedHistoricalElection = useMemo(() => {
    if (!selectedHistoricalElectionId) return null;
    return getHistoricalElectionById(selectedHistoricalElectionId) || null;
  }, [selectedHistoricalElectionId, historicalElections, getHistoricalElectionById]);

  return (
    <div className="space-y-6 pb-20 animate-fade-in text-slate-800 dark:text-slate-100">
      {/* ------------------------------------------------------- */}
      {/* 1. Header Bar with Constituency Context & Lifecycle Info */}
      {/* ------------------------------------------------------- */}
      <div className="bg-white dark:bg-[#111C30] p-5 rounded-2xl border border-slate-200 dark:border-[#273750] shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              {lifecycleInfo.status === 'ACTIVE' ? (
                <>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-emerald-200 dark:border-emerald-800">
                    Live Polling Active (2-Day Window)
                  </span>
                </>
              ) : lifecycleInfo.status === 'EXPIRED' ? (
                <>
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
                  <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-slate-200 dark:border-slate-700">
                    Polling Window Expired • Archived to History
                  </span>
                </>
              ) : (
                <>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-amber-200 dark:border-amber-800">
                    Upcoming Scheduled Election
                  </span>
                </>
              )}
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                34 - Pune Parliamentary Constituency
              </span>
            </div>

            <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2 flex-wrap">
              <span>Live Polling & Turnout Intelligence</span>
              {lifecycleInfo.status === 'ACTIVE' ? (
                <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                  ECI Cadre Sync Active
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  Read-Only Archive
                </span>
              )}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Real-time polling station turnout, time-wise voting progression, BLO reporting verification, and post-poll historical archives.
            </p>
          </div>

          {/* Quick Header Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors shadow-xs btn-tactile"
              title="Refresh ECI & Cadre Telemetry"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-600' : 'text-slate-500'}`} />
              <span>{isRefreshing ? 'Syncing...' : 'Sync'}</span>
            </button>

            <button
              onClick={() => {
                resetAllPollingData();
                showToast('Polling simulation data re-synchronized to initial baseline.', 'info');
              }}
              className="flex items-center gap-1 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-semibold transition-colors btn-tactile"
              title="Reset simulation overrides"
            >
              <span>Reset Demo</span>
            </button>
          </div>
        </div>

        {/* ----------------------------------------------------- */}
        {/* Availability Period & 2-Day Countdown Bar */}
        {/* ----------------------------------------------------- */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/70 dark:bg-slate-900/40 p-3 rounded-xl">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <div>
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block uppercase tracking-wider">
                  Election Date & Availability Period
                </span>
                <span className="text-xs font-bold text-slate-900 dark:text-slate-200">
                  {lifecycleInfo.availabilityPeriod}
                </span>
              </div>
            </div>

            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>

            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <div>
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block uppercase tracking-wider">
                  Live Polling Window Countdown
                </span>
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                  {lifecycleInfo.remainingTimeFormatted} ({lifecycleInfo.dayLabel})
                </span>
              </div>
            </div>
          </div>

          {/* Lifecycle Mode Simulator Selector (Requirement 2 & 5) */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Lifecycle State:</span>
            <select
              value={lifecycleInfo.lifecycleMode}
              onChange={(e) => {
                const newMode = e.target.value as LifecycleMode;
                setLifecycleMode(newMode);
                if (newMode === 'EXPIRED') {
                  setActiveTab('history');
                  showToast('48-hour live polling period concluded. Automatically transitioned to Election History.', 'info');
                } else if (newMode === 'UPCOMING') {
                  showToast('Upcoming scheduled election state activated.', 'info');
                } else {
                  setActiveTab('live');
                  showToast(`Live Polling window activated (${newMode === 'ACTIVE_DAY1' ? 'Day 1' : 'Day 2'}).`, 'success');
                }
              }}
              className="text-xs font-bold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-2xs"
            >
              <option value="ACTIVE_DAY1">Active: Day 1 (28h left)</option>
              <option value="ACTIVE_DAY2">Active: Day 2 (4h left)</option>
              <option value="EXPIRED">Expired: &gt; 48h (Auto-History)</option>
              <option value="UPCOMING">Upcoming (Polls in 2 Days)</option>
            </select>
          </div>
        </div>

        {/* ----------------------------------------------------- */}
        {/* Navigation Tabs: Live Dashboard | Notification Settings | Election History */}
        {/* ----------------------------------------------------- */}
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 overflow-x-auto scrollbar-none">
          <button
            onClick={() => {
              setActiveTab('live');
              setSelectedHistoricalElectionId(null);
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap btn-tactile ${
              activeTab === 'live'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Vote className="w-4 h-4" />
            <span>Live Dashboard</span>
            {lifecycleInfo.status === 'ACTIVE' && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            )}
          </button>

          <button
            onClick={() => {
              setActiveTab('notifications');
              setSelectedHistoricalElectionId(null);
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap btn-tactile ${
              activeTab === 'notifications'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Notification Settings</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200 font-mono">
              In-App & Email
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab('history');
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap btn-tactile ${
              activeTab === 'history'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Election History</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-mono">
              {historicalElections.length} Records
            </span>
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------- */}
      {/* TAB 1: LIVE DASHBOARD VIEW */}
      {/* ------------------------------------------------------- */}
      {activeTab === 'live' && (
        <>
          {/* If Election is EXPIRED: Show Decommissioned Banner */}
          {lifecycleInfo.status === 'EXPIRED' ? (
            <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 rounded-2xl p-6 text-center space-y-4 shadow-xs">
              <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 flex items-center justify-center mx-auto">
                <Lock className="w-6 h-6" />
              </div>
              <div className="max-w-xl mx-auto">
                <h3 className="text-lg font-bold text-amber-900 dark:text-amber-200">
                  Live Polling Period Concluded (48-Hour Availability Window Expired)
                </h3>
                <p className="text-xs text-amber-700 dark:text-amber-400 mt-1.5 leading-relaxed">
                  As per Election Commission guidelines and system policy, the live polling module is only active for 2 days during election day and post-poll wrap up. Live notifications have halted and all recorded turnout telemetry has been securely archived.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-center gap-3">
                <button
                  onClick={() => {
                    setActiveTab('history');
                    setSelectedHistoricalElectionId('hist-2024-ls');
                  }}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs btn-tactile"
                >
                  <History className="w-4 h-4" />
                  <span>Open 2024 Final Returns in Election History</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : lifecycleInfo.status === 'UPCOMING' ? (
            <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/80 rounded-2xl p-6 text-center space-y-4 shadow-xs">
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 flex items-center justify-center mx-auto">
                <Clock className="w-6 h-6" />
              </div>
              <div className="max-w-xl mx-auto">
                <h3 className="text-lg font-bold text-blue-900 dark:text-blue-200">
                  Upcoming Lok Sabha General Election Scheduled
                </h3>
                <p className="text-xs text-blue-700 dark:text-blue-400 mt-1.5 leading-relaxed">
                  The Live Polling Command Center will automatically activate on <strong>19 Nov 2024 at 07:00 AM</strong> for a maximum period of 2 days (48 hours). In the meantime, you can configure your notification dispatch settings or review benchmark turnout in Election History.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-center gap-3 flex-wrap">
                <button
                  onClick={() => setActiveTab('notifications')}
                  className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs btn-tactile"
                >
                  <Bell className="w-4 h-4 text-blue-600" />
                  <span>Configure Notification Settings</span>
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs btn-tactile"
                >
                  <History className="w-4 h-4" />
                  <span>Review Historical Elections</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* 2. Top Summary Cards (Section 2) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                {/* Card 1: Total Registered Voters */}
                <div className="bg-white dark:bg-[#111C30] p-4 rounded-2xl border border-blue-200/80 dark:border-blue-900/40 shadow-xs interactive-card">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Total Registered
                    </span>
                    <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                      <Users className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <p className="text-xl font-black font-tabular text-slate-900 dark:text-white">
                    {summary.totalRegisteredVoters.toLocaleString()}
                  </p>
                  <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 block mt-1">
                    100% Electoral Roll
                  </span>
                </div>

                {/* Card 2: Total Votes Cast */}
                <div className="bg-white dark:bg-[#111C30] p-4 rounded-2xl border border-emerald-200/80 dark:border-emerald-900/40 shadow-xs interactive-card">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">
                      Votes Cast
                    </span>
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                      <Vote className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <p className="text-xl font-black font-tabular text-emerald-900 dark:text-emerald-300">
                    {summary.totalVotesCast.toLocaleString()}
                  </p>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 block mt-1">
                    {summary.overallVotingPercentage}% Cast so far
                  </span>
                </div>

                {/* Card 3: Total Pending Voters */}
                <div className="bg-white dark:bg-[#111C30] p-4 rounded-2xl border border-amber-200/80 dark:border-amber-900/40 shadow-xs interactive-card">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider">
                      Pending Voters
                    </span>
                    <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                      <Clock className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <p className="text-xl font-black font-tabular text-amber-900 dark:text-amber-300">
                    {summary.totalPendingVoters.toLocaleString()}
                  </p>
                  <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 block mt-1">
                    {(100 - summary.overallVotingPercentage).toFixed(1)}% Yet to Vote
                  </span>
                </div>

                {/* Card 4: Overall Voting Percentage */}
                <div className="bg-white dark:bg-[#111C30] p-4 rounded-2xl border border-indigo-200/80 dark:border-indigo-900/40 shadow-xs interactive-card">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold text-indigo-800 dark:text-indigo-400 uppercase tracking-wider">
                      Voting %
                    </span>
                    <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                      <TrendingUp className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <p className="text-xl font-black font-tabular text-indigo-900 dark:text-indigo-300">
                    {summary.overallVotingPercentage}%
                  </p>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono block mt-1 truncate" title="Formula: (Votes Cast / Total Voters) * 100">
                    (Cast / Total) × 100
                  </span>
                </div>

                {/* Card 5: Total Polling Booths */}
                <div className="bg-white dark:bg-[#111C30] p-4 rounded-2xl border border-slate-200 dark:border-[#273750] shadow-xs interactive-card">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Total Booths
                    </span>
                    <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center">
                      <Building2 className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <p className="text-xl font-black font-tabular text-slate-900 dark:text-white">
                    {summary.totalPollingBooths}
                  </p>
                  <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 block mt-1">
                    Constituency Matrix
                  </span>
                </div>

                {/* Card 6: Booths Reporting */}
                <div className="bg-white dark:bg-[#111C30] p-4 rounded-2xl border border-teal-200/80 dark:border-teal-900/40 shadow-xs interactive-card">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold text-teal-800 dark:text-teal-400 uppercase tracking-wider">
                      Booths Live
                    </span>
                    <div className="w-7 h-7 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                      <Radio className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <p className="text-xl font-black font-tabular text-teal-900 dark:text-teal-300">
                    {summary.boothsReporting} / {summary.totalPollingBooths}
                  </p>
                  <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 block mt-1">
                    100% Online
                  </span>
                </div>

                {/* Card 7: Verified Voting Percentage */}
                <div className="bg-white dark:bg-[#111C30] p-4 rounded-2xl border border-purple-200/80 dark:border-purple-900/40 shadow-xs interactive-card">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold text-purple-800 dark:text-purple-400 uppercase tracking-wider">
                      Verified Turnout
                    </span>
                    <div className="w-7 h-7 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                      <ShieldCheck className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <p className="text-xl font-black font-tabular text-purple-900 dark:text-purple-300">
                    {summary.verifiedVotingPercentage}%
                  </p>
                  <span className="text-[10px] font-semibold text-purple-600 dark:text-purple-400 block mt-1">
                    ECI Serial Audited
                  </span>
                </div>
              </div>

              {/* 3. Time-wise Voting Progression Graph (Section 3) */}
              <div className="bg-white dark:bg-[#111C30] p-5 rounded-2xl border border-slate-200 dark:border-[#273750] shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                        Time-wise Voting Progression & Turnout Velocity
                      </h3>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                        ECI Checkpoints
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Cumulative turnout curve across standard reporting checkpoints with incremental surge velocity.
                    </p>
                  </div>

                  {/* Booth Selector Dropdown for Chart */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Perspective:</span>
                    <select
                      value={selectedBoothForChart}
                      onChange={(e) => setSelectedBoothForChart(e.target.value)}
                      className="text-xs font-semibold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-xl px-3 py-1.5 focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                      <option value="CONSTITUENCY">Entire Constituency (Consolidated)</option>
                      {boothLiveStats.map((b) => (
                        <option key={b.boothNumber} value={b.boothNumber.toString()}>
                          Booth #{b.boothNumber} - {b.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* SVG Progression Curve */}
                <div className="w-full overflow-x-auto">
                  <div className="min-w-[640px] pt-4 pb-2">
                    <svg viewBox="0 0 700 170" className="w-full h-44 overflow-visible">
                      <defs>
                        <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.35" />
                          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.00" />
                        </linearGradient>
                      </defs>

                      {/* Horizontal Grid lines */}
                      {[0, 25, 50, 75, 100].map((pct) => {
                        const y = 140 - (pct / 100) * 115;
                        return (
                          <g key={pct}>
                            <line x1="50" y1={y} x2="680" y2={y} stroke="currentColor" className="text-slate-100 dark:text-slate-800/80" strokeDasharray="3 3" />
                            <text x="42" y={y + 3} textAnchor="end" className="text-[9px] fill-slate-400 font-mono">
                              {pct}%
                            </text>
                          </g>
                        );
                      })}

                      {/* Area and Line Path */}
                      {(() => {
                        const points = activeHourlyProgress.map((slot, index) => {
                          const x = 70 + index * 95;
                          const y = 140 - (Math.min(100, slot.percentage) / 100) * 115;
                          return { x, y, slot };
                        });

                        const pathD = points.reduce((acc, curr, idx) => {
                          return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
                        }, '');

                        const areaD = `${pathD} L ${points[points.length - 1].x} 140 L ${points[0].x} 140 Z`;

                        return (
                          <>
                            <path d={areaD} fill="url(#curveGradient)" />
                            <path d={pathD} fill="none" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            {points.map((p, idx) => (
                              <g key={idx} className="group cursor-pointer">
                                <circle cx={p.x} cy={p.y} r="4.5" className="fill-white stroke-blue-600 stroke-2 group-hover:r-6 transition-all" />
                                <text x={p.x} y={p.y - 10} textAnchor="middle" className="text-[10px] font-bold fill-blue-700 dark:fill-blue-400 font-mono">
                                  {p.slot.percentage}%
                                </text>
                                <text x={p.x} y="156" textAnchor="middle" className="text-[9px] font-semibold fill-slate-500 font-mono">
                                  {p.slot.time}
                                </text>
                              </g>
                            ))}
                          </>
                        );
                      })()}
                    </svg>
                  </div>
                </div>

                {/* Surge Delta Pills Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  {activeHourlyProgress.map((slot, idx) => (
                    <div key={idx} className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80">
                      <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium">
                        <span>{slot.time}</span>
                        <span className="font-bold text-slate-900 dark:text-white font-mono">{slot.percentage}%</span>
                      </div>
                      <div className="mt-1 flex items-center justify-between">
                        <span className="text-[9px] text-slate-400 font-tabular">{slot.votes.toLocaleString()} votes</span>
                        {slot.deltaPercentage > 0 && (
                          <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1 py-0.2 rounded font-mono">
                            +{slot.deltaPercentage}%
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Booth Intelligence Table & Advanced Filters (Section 4) */}
              <div className="bg-white dark:bg-[#111C30] rounded-2xl border border-slate-200 dark:border-[#273750] shadow-xs overflow-hidden">
                {/* Table Header & Multi-Filter Control Strip */}
                <div className="p-5 border-b border-slate-200 dark:border-slate-800 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                        <span>Polling Station Turnout Intelligence Table</span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {filteredBooths.length} Stations Found
                        </span>
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Complete 13-metric audit including BLO phone, karyakartas, slip delivery, projected vs live turnout, and elector inspection.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setGradeFilter('ALL');
                        setVoterCountFilter('ALL');
                        setTurnoutRangeFilter('ALL');
                        setSlipDeliveryFilter('ALL');
                        setKaryakartaFilter('ALL');
                        setBloSearch('ALL');
                      }}
                      className="self-start sm:self-auto text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold flex items-center gap-1"
                    >
                      <span>Reset Filters</span>
                    </button>
                  </div>

                  {/* Filter Controls Bar */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                    {/* Search Input */}
                    <div className="relative">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        placeholder="Search booth #, station, locality..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Grade Filter */}
                    <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-900 p-0.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                      {['ALL', 'A', 'B', 'C', 'D'].map((gr) => (
                        <button
                          key={gr}
                          onClick={() => setGradeFilter(gr)}
                          className={`flex-1 py-1 rounded-lg text-[11px] font-bold transition-all ${
                            gradeFilter === gr
                              ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-2xs'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                          }`}
                        >
                          {gr === 'ALL' ? 'All' : `Grade ${gr}`}
                        </button>
                      ))}
                    </div>

                    {/* Turnout Range Filter */}
                    <select
                      value={turnoutRangeFilter}
                      onChange={(e) => setTurnoutRangeFilter(e.target.value)}
                      className="text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-slate-700 dark:text-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                      <option value="ALL">Turnout: All Ranges</option>
                      <option value="UNDER_50">&lt; 50% (Lagging)</option>
                      <option value="50_70">50% - 70% (Average)</option>
                      <option value="OVER_70">&gt; 70% (High Density)</option>
                    </select>

                    {/* BLO Select Filter */}
                    <select
                      value={bloSearch}
                      onChange={(e) => setBloSearch(e.target.value)}
                      className="text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-slate-700 dark:text-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                      <option value="ALL">All Assigned BLO Officers</option>
                      {bloOptions.map((blo) => (
                        <option key={blo} value={blo}>
                          {blo}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Table Data */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[11px]">
                        <th
                          onClick={() => {
                            setSortField('boothNumber');
                            setSortAsc(!sortAsc);
                          }}
                          className="py-3 px-4 w-20 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          Booth #
                        </th>
                        <th className="py-3 px-4 min-w-[220px]">Polling Station & Locality</th>
                        <th
                          onClick={() => {
                            setSortField('totalVoters');
                            setSortAsc(!sortAsc);
                          }}
                          className="py-3 px-4 w-24 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          Total
                        </th>
                        <th className="py-3 px-4 min-w-[170px]">BLO Incharge</th>
                        <th className="py-3 px-4 w-28">Karyakartas</th>
                        <th
                          onClick={() => {
                            setSortField('slipsDeliveredPercent');
                            setSortAsc(!sortAsc);
                          }}
                          className="py-3 px-4 w-32 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          Slip Delivery
                        </th>
                        <th className="py-3 px-4 w-28">Projected</th>
                        <th className="py-3 px-4 w-28">Votes Cast</th>
                        <th className="py-3 px-4 w-24">Remaining</th>
                        <th
                          onClick={() => {
                            setSortField('liveTurnoutPercent');
                            setSortAsc(!sortAsc);
                          }}
                          className="py-3 px-4 w-32 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          Live Turnout
                        </th>
                        <th className="py-3 px-4 w-28">Last Update</th>
                        <th className="py-3 px-4 text-right w-28">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                      {paginatedBooths.map((b) => (
                        <tr key={b.boothNumber} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-blue-700 dark:text-blue-400 whitespace-nowrap">
                            #{b.boothNumber}
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-semibold text-slate-900 dark:text-white block leading-snug">{b.name}</span>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">{b.locality}</span>
                          </td>
                          <td className="py-3 px-4 font-semibold font-tabular text-slate-800 dark:text-slate-200">
                            {b.totalVoters.toLocaleString()}
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-medium text-slate-900 dark:text-slate-200 block leading-snug">{b.bloName}</span>
                            <span className="text-[11px] text-slate-500 font-mono block mt-0.5">{b.bloPhone}</span>
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap font-medium">
                            <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-semibold text-[11px]">
                              {b.karyakartaCount} Cadre
                            </span>
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${
                                    b.slipsDeliveredPercent >= 80 ? 'bg-blue-600' : 'bg-amber-500'
                                  }`}
                                  style={{ width: `${b.slipsDeliveredPercent}%` }}
                                />
                              </div>
                              <span className="font-bold font-mono text-[11px] text-slate-800 dark:text-slate-200">
                                {b.slipsDeliveredPercent}%
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <span className="font-semibold text-slate-800 dark:text-slate-200">{b.projectedTurnoutPercent}%</span>
                            <span className="text-[10px] text-slate-400 block font-mono">Last: {b.previousTurnoutPercent}%</span>
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <span className="font-bold text-emerald-700 dark:text-emerald-400 font-tabular">
                              {b.actualVotesCast.toLocaleString()}
                            </span>
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <span className="font-semibold text-amber-700 dark:text-amber-400 font-tabular">
                              {b.remainingVoters.toLocaleString()}
                            </span>
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <span
                                className={`px-2 py-0.5 rounded-md text-xs font-black font-tabular ${
                                  b.liveTurnoutPercent >= 60
                                    ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                                    : b.liveTurnoutPercent >= 45
                                    ? 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                                    : 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                                }`}
                              >
                                {b.liveTurnoutPercent}%
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap text-slate-400 text-[11px] font-mono">
                            {b.lastUpdated}
                          </td>
                          <td className="py-3 px-4 text-right whitespace-nowrap">
                            <button
                              onClick={() => {
                                setActiveInspectorBooth(b);
                                setInspectorVoterFilter('ALL');
                                setInspectorVoterSearch('');
                              }}
                              className="px-2.5 py-1.5 text-[11px] font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 rounded-lg transition-colors btn-tactile inline-flex items-center gap-1 shadow-2xs"
                            >
                              <Eye className="w-3 h-3" />
                              <span>Inspect Roll</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                  <span>
                    Showing {paginatedBooths.length} of {filteredBooths.length} Polling Stations
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}

      {/* ------------------------------------------------------- */}
      {/* TAB 2: NOTIFICATION SETTINGS VIEW (Requirement 1 & 5) */}
      {/* ------------------------------------------------------- */}
      {activeTab === 'notifications' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#111C30] p-6 rounded-2xl border border-slate-200 dark:border-[#273750] shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span>Live Polling Notification & Broadcast Dispatch Control</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Configure real-time automated turnout alerts, channel intervals, recipient targeting, and critical milestone triggers during the live polling window.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSendTestNotification}
                  className="px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl transition-colors btn-tactile inline-flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5 text-blue-600" />
                  <span>Send Test Broadcast</span>
                </button>
                <button
                  onClick={handleSaveNotificationSettings}
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors btn-tactile inline-flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Notification Settings</span>
                </button>
              </div>
            </div>

            {/* Channels Grid: In-App & Email Independent Configurations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              {/* Channel A: In-App Notification Engine */}
              <div className="bg-slate-50/70 dark:bg-slate-900/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300 flex items-center justify-center">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">In-App Push Alerts</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">Mobile & Web dashboard live notifications</p>
                    </div>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifInAppEnabled}
                      onChange={(e) => setNotifInAppEnabled(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {/* Frequency Selector */}
                <div className="pt-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                    Dispatch Frequency (Every X Interval)
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {(['15m', '30m', '60m', '2h'] as NotificationFrequency[]).map((freq) => (
                      <button
                        key={freq}
                        type="button"
                        onClick={() => setNotifInAppFreq(freq)}
                        className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                          notifInAppFreq === freq
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400'
                        }`}
                      >
                        {freq === '15m' ? '15 Min' : freq === '30m' ? '30 Min' : freq === '60m' ? '60 Min' : '2 Hours'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* In-App Authorized Recipients Selector */}
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Authorized In-App Recipients ({notifInAppRecipients.length} Selected)
                    </label>
                    <div className="flex gap-2 text-[11px]">
                      <button
                        type="button"
                        onClick={() => setNotifInAppRecipients(MOCK_USERS.map((u) => u.id))}
                        className="text-blue-600 hover:underline font-semibold"
                      >
                        Select All
                      </button>
                      <span className="text-slate-300">|</span>
                      <button
                        type="button"
                        onClick={() => setNotifInAppRecipients([])}
                        className="text-slate-500 hover:underline"
                      >
                        Clear
                      </button>
                    </div>
                  </div>

                  <div className="max-h-48 overflow-y-auto space-y-1.5 p-2 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700">
                    {MOCK_USERS.map((user) => {
                      const isChecked = notifInAppRecipients.includes(user.id);
                      return (
                        <div
                          key={user.id}
                          onClick={() => {
                            if (isChecked) {
                              setNotifInAppRecipients(notifInAppRecipients.filter((id) => id !== user.id));
                            } else {
                              setNotifInAppRecipients([...notifInAppRecipients, user.id]);
                            }
                          }}
                          className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                            isChecked ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200' : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {isChecked ? (
                              <CheckSquare className="w-4 h-4 text-blue-600" />
                            ) : (
                              <Square className="w-4 h-4 text-slate-400" />
                            )}
                            <div>
                              <span className="font-semibold text-xs block">{user.name}</span>
                              <span className="text-[10px] text-slate-500 block">{user.phone}</span>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 uppercase">
                            {user.role.replace('_', ' ')}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Channel B: Email Notification Engine */}
              <div className="bg-slate-50/70 dark:bg-slate-900/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-900/60 text-purple-600 dark:text-purple-300 flex items-center justify-center">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">Email Broadcast Digests</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">Formal ECI reconciliation summaries & PDF attachments</p>
                    </div>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifEmailEnabled}
                      onChange={(e) => setNotifEmailEnabled(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-purple-600"></div>
                  </label>
                </div>

                {/* Email Frequency Selector */}
                <div className="pt-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                    Email Digest Frequency
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {(['15m', '30m', '60m', '2h'] as NotificationFrequency[]).map((freq) => (
                      <button
                        key={freq}
                        type="button"
                        onClick={() => setNotifEmailFreq(freq)}
                        className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                          notifEmailFreq === freq
                            ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-purple-400'
                        }`}
                      >
                        {freq === '15m' ? '15 Min' : freq === '30m' ? '30 Min' : freq === '60m' ? '60 Min' : '2 Hours'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Email Authorized Recipients Selector */}
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Authorized Email Recipients ({notifEmailRecipients.length} Selected)
                    </label>
                    <div className="flex gap-2 text-[11px]">
                      <button
                        type="button"
                        onClick={() => setNotifEmailRecipients(MOCK_USERS.map((u) => u.id))}
                        className="text-purple-600 hover:underline font-semibold"
                      >
                        Select All
                      </button>
                      <span className="text-slate-300">|</span>
                      <button
                        type="button"
                        onClick={() => setNotifEmailRecipients([])}
                        className="text-slate-500 hover:underline"
                      >
                        Clear
                      </button>
                    </div>
                  </div>

                  <div className="max-h-48 overflow-y-auto space-y-1.5 p-2 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700">
                    {MOCK_USERS.map((user) => {
                      const isChecked = notifEmailRecipients.includes(user.id);
                      return (
                        <div
                          key={user.id}
                          onClick={() => {
                            if (isChecked) {
                              setNotifEmailRecipients(notifEmailRecipients.filter((id) => id !== user.id));
                            } else {
                              setNotifEmailRecipients([...notifEmailRecipients, user.id]);
                            }
                          }}
                          className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                            isChecked ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200' : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {isChecked ? (
                              <CheckSquare className="w-4 h-4 text-purple-600" />
                            ) : (
                              <Square className="w-4 h-4 text-slate-400" />
                            )}
                            <div>
                              <span className="font-semibold text-xs block">{user.name}</span>
                              <span className="text-[10px] text-slate-500 block">{user.email}</span>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 uppercase">
                            {user.role.replace('_', ' ')}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Notification Categories Grid */}
            <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
                Notification Trigger Categories
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  {
                    key: 'overallTurnout' as const,
                    title: 'Overall Turnout Milestones',
                    desc: 'Alert when constituency crosses 40%, 50%, 60%, and 70% benchmarks.'
                  },
                  {
                    key: 'boothUpdates' as const,
                    title: 'Booth-wise Turnout Updates',
                    desc: 'Instant updates on rapid surges or abnormal reporting delays.'
                  },
                  {
                    key: 'lowTurnoutAlerts' as const,
                    title: 'Low-Turnout Warning Alerts',
                    desc: 'Immediate mobilization ping for stations lagging below 40% turnout.'
                  },
                  {
                    key: 'importantAlerts' as const,
                    title: 'Important Polling Station Alerts',
                    desc: 'EVM machine replacements, heavy queue bottlenecks, or BLO dispatches.'
                  },
                  {
                    key: 'finalReports' as const,
                    title: 'Final Form 20 Consolidated Reports',
                    desc: 'Automated post-poll executive PDF report delivery at poll closure.'
                  }
                ].map((cat) => (
                  <div
                    key={cat.key}
                    onClick={() => {
                      setNotifCategories({
                        ...notifCategories,
                        [cat.key]: !notifCategories[cat.key]
                      });
                    }}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      notifCategories[cat.key]
                        ? 'bg-blue-50/60 dark:bg-blue-950/40 border-blue-300 dark:border-blue-800'
                        : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {notifCategories[cat.key] ? (
                        <CheckCircle2 className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400" />
                      )}
                      <span className="font-bold text-xs text-slate-900 dark:text-white">{cat.title}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 ml-6">{cat.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Live Broadcast History Table */}
          <div className="bg-white dark:bg-[#111C30] p-6 rounded-2xl border border-slate-200 dark:border-[#273750] shadow-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Live Broadcast Telemetry & Delivery Log
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Audit log of all live dispatches sent to candidates and polling agents during this election cycle.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[11px]">
                    <th className="py-2.5 px-3">Timestamp</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Channel</th>
                    <th className="py-2.5 px-3">Recipients</th>
                    <th className="py-2.5 px-3">Broadcast Message</th>
                    <th className="py-2.5 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {notificationLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                      <td className="py-2.5 px-3 font-mono font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                        {log.timestamp}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                          {log.category}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-slate-600 dark:text-slate-300">
                        {log.channel === 'BOTH' ? 'In-App & Email' : log.channel === 'IN_APP' ? 'In-App Push' : 'Email'}
                      </td>
                      <td className="py-2.5 px-3 font-tabular font-semibold">
                        {log.recipientCount} Authorized Users
                      </td>
                      <td className="py-2.5 px-3 max-w-md">
                        <span className="font-bold text-slate-900 dark:text-white block">{log.title}</span>
                        <span className="text-[11px] text-slate-500 block truncate">{log.message}</span>
                      </td>
                      <td className="py-2.5 px-3 text-right whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-md font-bold text-[10px] bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 inline-flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          <span>Delivered</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------- */}
      {/* TAB 3: ELECTION HISTORY VIEW (Requirements 4 & 5) */}
      {/* ------------------------------------------------------- */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          {/* Detail View for a Specific Historical Election */}
          {selectedHistoricalElection ? (
            <div className="space-y-6">
              {/* Back Bar & Read-Only Notice */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#111C30] p-4 rounded-2xl border border-slate-200 dark:border-[#273750] shadow-xs">
                <button
                  onClick={() => setSelectedHistoricalElectionId(null)}
                  className="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-colors self-start sm:self-auto btn-tactile"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back to Historical Elections List</span>
                </button>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 inline-flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Archived Record (Read-Only)</span>
                  </span>
                </div>
              </div>

              {/* Historical Election Header Banner */}
              <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 rounded-2xl shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-300">
                      {selectedHistoricalElection.electionType}
                    </span>
                    <h2 className="text-2xl font-black mt-1 tracking-tight">
                      {selectedHistoricalElection.name}
                    </h2>
                    <p className="text-xs text-blue-200 mt-1 flex items-center gap-2">
                      <span>Polling Date: {selectedHistoricalElection.date}</span>
                      <span>•</span>
                      <span>{selectedHistoricalElection.completedAt}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10 text-right">
                      <span className="text-[10px] uppercase font-bold text-blue-200 block">Final Turnout</span>
                      <span className="text-2xl font-black text-emerald-400 font-tabular">
                        {selectedHistoricalElection.finalTurnoutPercent}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Historical KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white dark:bg-[#111C30] p-4 rounded-2xl border border-slate-200 dark:border-[#273750] shadow-xs">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Registered Electors</span>
                  <p className="text-xl font-black font-tabular text-slate-900 dark:text-white mt-1">
                    {selectedHistoricalElection.totalVoters.toLocaleString()}
                  </p>
                  <span className="text-[10px] text-slate-500 font-medium">100% Roll Size</span>
                </div>

                <div className="bg-white dark:bg-[#111C30] p-4 rounded-2xl border border-slate-200 dark:border-[#273750] shadow-xs">
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Total Votes Cast</span>
                  <p className="text-xl font-black font-tabular text-emerald-700 dark:text-emerald-400 mt-1">
                    {selectedHistoricalElection.totalVotesCast.toLocaleString()}
                  </p>
                  <span className="text-[10px] text-emerald-600 font-medium">Certified Form 20 Total</span>
                </div>

                <div className="bg-white dark:bg-[#111C30] p-4 rounded-2xl border border-slate-200 dark:border-[#273750] shadow-xs">
                  <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Remaining Uncast</span>
                  <p className="text-xl font-black font-tabular text-amber-700 dark:text-amber-400 mt-1">
                    {(selectedHistoricalElection.totalVoters - selectedHistoricalElection.totalVotesCast).toLocaleString()}
                  </p>
                  <span className="text-[10px] text-amber-600 font-medium">
                    {(100 - selectedHistoricalElection.finalTurnoutPercent).toFixed(1)}% Abstention Rate
                  </span>
                </div>

                <div className="bg-white dark:bg-[#111C30] p-4 rounded-2xl border border-slate-200 dark:border-[#273750] shadow-xs">
                  <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Previous Turnout Comparison</span>
                  <p className="text-xl font-black font-tabular text-indigo-700 dark:text-indigo-400 mt-1">
                    {selectedHistoricalElection.previousTurnoutPercent ? `${selectedHistoricalElection.previousTurnoutPercent}%` : 'N/A'}
                  </p>
                  <span className="text-[10px] text-indigo-600 font-semibold">
                    {selectedHistoricalElection.previousTurnoutPercent
                      ? `${(selectedHistoricalElection.finalTurnoutPercent - selectedHistoricalElection.previousTurnoutPercent).toFixed(1)}% Net Variance`
                      : 'Baseline Election'}
                  </span>
                </div>
              </div>

              {/* Historical Time-wise Progression */}
              <div className="bg-white dark:bg-[#111C30] p-5 rounded-2xl border border-slate-200 dark:border-[#273750] shadow-xs">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  <span>Historical Checkpoint Voting Curve</span>
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  ECI certified progression throughout the 07:00 AM to 06:00 PM polling window.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                  {selectedHistoricalElection.hourlyProgress.map((slot, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] font-bold text-slate-500 block">{slot.time}</span>
                      <span className="text-sm font-black text-slate-900 dark:text-white font-mono mt-0.5 block">
                        {slot.percentage}%
                      </span>
                      <span className="text-[10px] text-slate-500 font-tabular block mt-1">
                        {slot.votes.toLocaleString()} votes
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Historical Booth-wise Turnout Table */}
              <div className="bg-white dark:bg-[#111C30] rounded-2xl border border-slate-200 dark:border-[#273750] shadow-xs overflow-hidden">
                <div className="p-4 border-b border-slate-200 dark:border-slate-800">
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                    Booth-wise Certified Turnout Breakdown
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Official voting totals and swing comparison for all polling stations.
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[11px]">
                        <th className="py-2.5 px-3 w-20">Booth #</th>
                        <th className="py-2.5 px-3 min-w-[200px]">Polling Station & Locality</th>
                        <th className="py-2.5 px-3 w-24">Voters</th>
                        <th className="py-2.5 px-3 w-28">Votes Cast</th>
                        <th className="py-2.5 px-3 w-28">Remaining</th>
                        <th className="py-2.5 px-3 w-28">Final Turnout</th>
                        <th className="py-2.5 px-3 w-28">Last Election</th>
                        <th className="py-2.5 px-3 w-20 text-center">Grade</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                      {selectedHistoricalElection.boothStats.map((b) => (
                        <tr key={b.boothNumber} className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                          <td className="py-2.5 px-3 font-mono font-bold text-blue-700 dark:text-blue-400">
                            #{b.boothNumber}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="font-semibold text-slate-900 dark:text-white block">{b.name}</span>
                            <span className="text-[11px] text-slate-500 block">{b.locality}</span>
                          </td>
                          <td className="py-2.5 px-3 font-semibold font-tabular">
                            {b.totalVoters.toLocaleString()}
                          </td>
                          <td className="py-2.5 px-3 font-bold text-emerald-700 dark:text-emerald-400 font-tabular">
                            {b.actualVotesCast.toLocaleString()}
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-amber-700 dark:text-amber-400 font-tabular">
                            {b.remainingVoters.toLocaleString()}
                          </td>
                          <td className="py-2.5 px-3 font-black text-slate-900 dark:text-white font-tabular">
                            {b.finalTurnoutPercent}%
                          </td>
                          <td className="py-2.5 px-3 text-slate-500 font-tabular">
                            {b.previousTurnoutPercent}%
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span className="px-2 py-0.5 rounded-md font-bold text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                              Grade {b.grade}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Historical Reports & Export Options */}
              <div className="bg-white dark:bg-[#111C30] p-5 rounded-2xl border border-slate-200 dark:border-[#273750] shadow-xs">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>Available Certified Historical Reports & Export Files</span>
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  Candidates can review and download certified election returns in PDF and Excel formats.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {selectedHistoricalElection.reports.map((rep, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              rep.type === 'PDF'
                                ? 'bg-red-50 text-red-700 border border-red-200'
                                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            }`}
                          >
                            {rep.type}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">{rep.size}</span>
                        </div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-xs">{rep.title}</h4>
                        <p className="text-[11px] text-slate-500 mt-1">{rep.description}</p>
                      </div>

                      <button
                        onClick={() => {
                          showToast(`Downloading certified document: ${rep.filename}`, 'success');
                        }}
                        className="mt-4 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-colors btn-tactile shadow-2xs"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download {rep.type}</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Historical Elections List View */
            <div className="space-y-6">
              <div className="bg-white dark:bg-[#111C30] p-6 rounded-2xl border border-slate-200 dark:border-[#273750] shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                      <History className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      <span>Past Election Archives & Historical Turnout Benchmarks</span>
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Certified historical election records, official Form 20 vote tallies, and past cadre telemetry preserved in read-only status.
                    </p>
                  </div>
                  <div className="text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl font-semibold">
                    {historicalElections.length} Completed Elections Available
                  </div>
                </div>

                {/* Historical Election Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                  {historicalElections.map((elec) => (
                    <div
                      key={elec.id}
                      className="bg-slate-50/70 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between hover:border-blue-300 dark:hover:border-blue-700 transition-all shadow-xs interactive-card"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                            {elec.date}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 inline-flex items-center gap-1">
                            <Lock className="w-2.5 h-2.5" />
                            <span>Archived</span>
                          </span>
                        </div>

                        <h3 className="font-black text-slate-900 dark:text-white text-base leading-snug">
                          {elec.name}
                        </h3>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                          {elec.electionType}
                        </p>

                        <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-200/70 dark:border-slate-800">
                          <div>
                            <span className="text-[10px] text-slate-400 font-semibold uppercase block">Final Turnout</span>
                            <span className="text-lg font-black text-emerald-600 dark:text-emerald-400 font-tabular">
                              {elec.finalTurnoutPercent}%
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 font-semibold uppercase block">Votes Cast</span>
                            <span className="text-sm font-bold text-slate-800 dark:text-slate-200 font-tabular">
                              {elec.totalVotesCast.toLocaleString()}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 font-semibold uppercase block">Total Voters</span>
                            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 font-tabular">
                              {elec.totalVoters.toLocaleString()}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 font-semibold uppercase block">Total Stations</span>
                            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 font-tabular">
                              {elec.totalBooths} Booths
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 pt-3 border-t border-slate-200/70 dark:border-slate-800 flex items-center justify-between">
                        <span className="text-[11px] text-slate-400 font-mono">
                          {elec.reports.length} Reports Ready
                        </span>
                        <button
                          onClick={() => setSelectedHistoricalElectionId(elec.id)}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1 shadow-xs btn-tactile"
                        >
                          <span>View Details</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------- */}
      {/* 6. Booth Detail & Voter Roll Drawer (Section 6) */}
      {/* ------------------------------------------------------- */}
      {activeInspectorBooth && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-2xl bg-white dark:bg-[#111C30] h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 animate-slide-left">
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between bg-slate-50 dark:bg-slate-900/80">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-bold text-xs font-mono">
                    Booth #{activeInspectorBooth.boothNumber}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[11px]">
                    Grade {activeInspectorBooth.grade}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                  {activeInspectorBooth.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>{activeInspectorBooth.locality}</span>
                </p>
              </div>

              <button
                onClick={() => setActiveInspectorBooth(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Metrics Strip inside Drawer */}
            <div className="grid grid-cols-4 gap-2 p-4 bg-slate-100/70 dark:bg-slate-900/40 border-b border-slate-200 dark:border-slate-800 text-center">
              <div className="bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
                <span className="text-[10px] text-slate-500 block uppercase font-bold">Total Roll</span>
                <span className="text-sm font-black text-slate-900 dark:text-white font-tabular">
                  {activeInspectorBooth.totalVoters.toLocaleString()}
                </span>
              </div>
              <div className="bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
                <span className="text-[10px] text-emerald-600 block uppercase font-bold">Votes Cast</span>
                <span className="text-sm font-black text-emerald-700 dark:text-emerald-400 font-tabular">
                  {activeInspectorBooth.actualVotesCast.toLocaleString()}
                </span>
              </div>
              <div className="bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
                <span className="text-[10px] text-amber-600 block uppercase font-bold">Remaining</span>
                <span className="text-sm font-black text-amber-700 dark:text-amber-400 font-tabular">
                  {activeInspectorBooth.remainingVoters.toLocaleString()}
                </span>
              </div>
              <div className="bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
                <span className="text-[10px] text-blue-600 block uppercase font-bold">Turnout</span>
                <span className="text-sm font-black text-blue-700 dark:text-blue-400 font-tabular">
                  {activeInspectorBooth.liveTurnoutPercent}%
                </span>
              </div>
            </div>

            {/* Voter Roll Search & Filter Tabs */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-2">
              <div className="relative flex-1 w-full">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search voter by name, EPIC, mobile..."
                  value={inspectorVoterSearch}
                  onChange={(e) => setInspectorVoterSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl"
                />
              </div>

              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl text-xs w-full sm:w-auto">
                <button
                  onClick={() => setInspectorVoterFilter('ALL')}
                  className={`flex-1 sm:flex-none px-3 py-1 rounded-lg text-[11px] font-bold ${
                    inspectorVoterFilter === 'ALL'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  All ({activeInspectorBooth.totalVoters})
                </button>
                <button
                  onClick={() => setInspectorVoterFilter('VOTED')}
                  className={`flex-1 sm:flex-none px-3 py-1 rounded-lg text-[11px] font-bold ${
                    inspectorVoterFilter === 'VOTED'
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'text-emerald-700 dark:text-emerald-400'
                  }`}
                >
                  Voted
                </button>
                <button
                  onClick={() => setInspectorVoterFilter('NOT_VOTED')}
                  className={`flex-1 sm:flex-none px-3 py-1 rounded-lg text-[11px] font-bold ${
                    inspectorVoterFilter === 'NOT_VOTED'
                      ? 'bg-amber-600 text-white shadow-2xs'
                      : 'text-amber-700 dark:text-amber-400'
                  }`}
                >
                  Pending
                </button>
              </div>
            </div>

            {/* Voter List Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {inspectorVoters.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <Users className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p className="text-xs">No electors match the selected filter.</p>
                </div>
              ) : (
                inspectorVoters.map((voter) => {
                  const record = votingRecords[voter.id];
                  const hasVoted = record ? record.hasVoted : (voter.hasVoted ?? false);

                  return (
                    <div
                      key={voter.id}
                      className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 flex items-center justify-between gap-3 hover:border-blue-300 transition-colors"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-900 dark:text-white">{voter.fullName}</span>
                          <span className="text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                            {voter.epicNumber}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                          <span>Age: {voter.age}</span>
                          <span>•</span>
                          <span>{voter.gender}</span>
                          <span>•</span>
                          <span>{voter.mobile || 'No Mobile'}</span>
                        </div>
                        {hasVoted && record && (
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold block mt-1">
                            Voted at {record.votingTime} (Reported by {record.updatedBy})
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {onSelectVoter && (
                          <button
                            onClick={() => {
                              onSelectVoter(voter);
                              onNavigateToView('central-profile');
                            }}
                            className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                            title="Open Central Voter Profile"
                          >
                            <UserCheck className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          onClick={() => {
                            toggleVoterVotingStatus(voter.id);
                            showToast(
                              hasVoted
                                ? `Marked ${voter.fullName} as NOT VOTED.`
                                : `Marked ${voter.fullName} as VOTED. Turnout updated.`,
                              'success'
                            );
                          }}
                          disabled={lifecycleInfo.status === 'EXPIRED'}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all btn-tactile ${
                            hasVoted
                              ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 hover:bg-emerald-100'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-600 hover:text-white'
                          } ${lifecycleInfo.status === 'EXPIRED' ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {hasVoted ? 'Voted ✓' : 'Mark as Voted'}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                BLO: <strong>{activeInspectorBooth.bloName}</strong> ({activeInspectorBooth.bloPhone})
              </span>
              <button
                onClick={() => setActiveInspectorBooth(null)}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
