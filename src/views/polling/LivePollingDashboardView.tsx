import React, { useState, useMemo } from 'react';
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
  UserCheck
} from 'lucide-react';
import { useLivePollingStore, BoothLivePollingStats } from '../../services/livePollingStore';
import { CURRENT_ELECTION_CONTEXT, MOCK_VOTERS } from '../../data/mockData';
import { Voter } from '../../types';
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
    resetAllPollingData
  } = useLivePollingStore();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedBoothForChart, setSelectedBoothForChart] = useState<string>('CONSTITUENCY');
  const [activeInspectorBooth, setActiveInspectorBooth] = useState<BoothLivePollingStats | null>(null);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);

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

  // Notification configuration state
  const [notificationInterval, setNotificationInterval] = useState('30');
  const [notifyMilestones, setNotifyMilestones] = useState(true);
  const [selectedAudience, setSelectedAudience] = useState<'ALL' | 'CANDIDATE' | 'COORDINATORS' | 'AGENTS'>('ALL');

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
        // Search term (booth #, station name, locality)
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          const matchBoothNo = b.boothNumber.toString().includes(q);
          const matchName = b.name.toLowerCase().includes(q);
          const matchLocality = b.locality.toLowerCase().includes(q);
          if (!matchBoothNo && !matchName && !matchLocality) return false;
        }

        // Grade Filter
        if (gradeFilter !== 'ALL' && b.grade !== gradeFilter) return false;

        // Total Voter Count Filter
        if (voterCountFilter === 'UNDER_1000' && b.totalVoters >= 1000) return false;
        if (voterCountFilter === '1000_1300' && (b.totalVoters < 1000 || b.totalVoters > 1300)) return false;
        if (voterCountFilter === 'OVER_1300' && b.totalVoters <= 1300) return false;

        // Turnout Range Filter
        if (turnoutRangeFilter === 'UNDER_50' && b.liveTurnoutPercent >= 50) return false;
        if (turnoutRangeFilter === '50_70' && (b.liveTurnoutPercent < 50 || b.liveTurnoutPercent > 70)) return false;
        if (turnoutRangeFilter === 'OVER_70' && b.liveTurnoutPercent <= 70) return false;

        // Slip Delivery Filter
        if (slipDeliveryFilter === 'UNDER_60' && b.slipsDeliveredPercent >= 60) return false;
        if (slipDeliveryFilter === '60_80' && (b.slipsDeliveredPercent < 60 || b.slipsDeliveredPercent > 80)) return false;
        if (slipDeliveryFilter === 'OVER_80' && b.slipsDeliveredPercent <= 80) return false;

        // Karyakarta Count Filter
        if (karyakartaFilter === '1_3' && (b.karyakartaCount < 1 || b.karyakartaCount > 3)) return false;
        if (karyakartaFilter === '4_5' && (b.karyakartaCount < 4 || b.karyakartaCount > 5)) return false;
        if (karyakartaFilter === 'OVER_5' && b.karyakartaCount <= 5) return false;

        // BLO Filter
        if (bloSearch !== 'ALL' && b.bloName !== bloSearch) return false;

        return true;
      })
      .sort((a, b) => {
        const aVal = a[sortField];
        const bVal = b[sortField];
        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        }
        if (Number(aVal) < Number(bVal)) return sortAsc ? -1 : 1;
        if (Number(aVal) > Number(bVal)) return sortAsc ? 1 : -1;
        return 0;
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

  // Active filter count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (searchTerm) count++;
    if (gradeFilter !== 'ALL') count++;
    if (voterCountFilter !== 'ALL') count++;
    if (turnoutRangeFilter !== 'ALL') count++;
    if (slipDeliveryFilter !== 'ALL') count++;
    if (karyakartaFilter !== 'ALL') count++;
    if (bloSearch !== 'ALL') count++;
    return count;
  }, [searchTerm, gradeFilter, voterCountFilter, turnoutRangeFilter, slipDeliveryFilter, karyakartaFilter, bloSearch]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setGradeFilter('ALL');
    setVoterCountFilter('ALL');
    setTurnoutRangeFilter('ALL');
    setSlipDeliveryFilter('ALL');
    setKaryakartaFilter('ALL');
    setBloSearch('ALL');
    setCurrentPage(1);
    showToast('All booth filters reset.', 'info');
  };

  // Pagination
  const totalPages = Math.ceil(filteredBooths.length / itemsPerPage) || 1;
  const paginatedBooths = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredBooths.slice(start, start + itemsPerPage);
  }, [filteredBooths, currentPage, itemsPerPage]);

  // Chart data source based on selector (Constituency vs Individual Booth)
  const activeChartData = useMemo(() => {
    if (selectedBoothForChart === 'CONSTITUENCY') {
      return constituencyHourlyProgress;
    }
    const b = boothLiveStats.find((booth) => booth.boothNumber.toString() === selectedBoothForChart);
    return b ? b.hourlyProgress : constituencyHourlyProgress;
  }, [selectedBoothForChart, constituencyHourlyProgress, boothLiveStats]);

  // Selected booth details for Inspector Modal
  const inspectorVotersList = useMemo(() => {
    if (!activeInspectorBooth) return [];
    return MOCK_VOTERS.filter((v) => v.boothNumber === activeInspectorBooth.boothNumber).filter((v) => {
      const rec = votingRecords[v.id];
      const hasVoted = rec ? rec.hasVoted : (v.hasVoted ?? false);

      if (inspectorVoterFilter === 'VOTED' && !hasVoted) return false;
      if (inspectorVoterFilter === 'NOT_VOTED' && hasVoted) return false;

      if (inspectorVoterSearch.trim()) {
        const q = inspectorVoterSearch.toLowerCase();
        return (
          v.fullName.toLowerCase().includes(q) ||
          v.epicNumber.toLowerCase().includes(q) ||
          v.serialNo.toString().includes(q) ||
          (v.mobile && v.mobile.includes(q))
        );
      }
      return true;
    });
  }, [activeInspectorBooth, votingRecords, inspectorVoterFilter, inspectorVoterSearch]);

  return (
    <div className="space-y-6 pb-20 animate-fade-in text-slate-800 dark:text-slate-100">
      {/* 1. Header Bar with Constituency Context & Primary Actions */}
      <div className="bg-white dark:bg-[#111C30] p-5 rounded-2xl border border-slate-200 dark:border-[#273750] shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full uppercase tracking-wider border border-emerald-200 dark:border-emerald-800">
              Live Polling Command
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              34 - Pune Parliamentary Constituency (General)
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>Live Polling & Turnout Intelligence</span>
            <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
              ECI Sync Active
            </span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time polling station turnout, time-wise voting progression, BLO reporting verification, and booth-level elector turnout status.
          </p>
        </div>

        {/* Header Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsNotificationModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors shadow-xs btn-tactile"
            title="Configure Polling Notifications & Broadcasts"
          >
            <Bell className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Notification Settings</span>
          </button>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors shadow-xs btn-tactile"
            title="Refresh ECI & Cadre Telemetry"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-600' : 'text-slate-500'}`} />
            <span>{isRefreshing ? 'Syncing...' : 'Refresh'}</span>
          </button>

          <button
            onClick={() => {
              resetAllPollingData();
              showToast('Demo polling records re-synchronized to initial baseline.', 'info');
            }}
            className="flex items-center gap-1 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-semibold transition-colors btn-tactile"
            title="Reset simulation overrides"
          >
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

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
          <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 block mt-1">
            {(100 - summary.overallVotingPercentage).toFixed(1)}% Yet to Vote
          </span>
        </div>

        {/* Card 4: Overall Voting Percentage */}
        <div className="bg-white dark:bg-[#111C30] p-4 rounded-2xl border border-purple-200/80 dark:border-purple-900/40 shadow-xs interactive-card">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold text-purple-800 dark:text-purple-400 uppercase tracking-wider">
              Voting %
            </span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-xl font-black font-tabular text-purple-900 dark:text-purple-300">
            {summary.overallVotingPercentage}%
          </p>
          <span className="text-[9px] text-slate-500 dark:text-slate-400 block mt-1 truncate" title="(Total Votes Cast / Total Voters) × 100">
            Formula: (Cast / Reg) × 100
          </span>
        </div>

        {/* Card 5: Total Polling Booths */}
        <div className="bg-white dark:bg-[#111C30] p-4 rounded-2xl border border-indigo-200/80 dark:border-indigo-900/40 shadow-xs interactive-card">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Booths
            </span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <MapPin className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-xl font-black font-tabular text-slate-900 dark:text-white">
            {summary.totalPollingBooths}
          </p>
          <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 block mt-1">
            Active Stations
          </span>
        </div>

        {/* Card 6: Booths Reporting */}
        <div className="bg-white dark:bg-[#111C30] p-4 rounded-2xl border border-cyan-200/80 dark:border-cyan-900/40 shadow-xs interactive-card">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold text-cyan-800 dark:text-cyan-400 uppercase tracking-wider">
              Reporting
            </span>
            <div className="w-7 h-7 rounded-lg bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
              <Activity className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-xl font-black font-tabular text-cyan-900 dark:text-cyan-300">
            {summary.boothsReporting} / {summary.totalPollingBooths}
          </p>
          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 block mt-1">
            100% On-Ground Coverage
          </span>
        </div>

        {/* Card 7: Verified Voting Percentage */}
        <div className="bg-white dark:bg-[#111C30] p-4 rounded-2xl border border-teal-200/80 dark:border-teal-900/40 shadow-xs interactive-card col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold text-teal-800 dark:text-teal-400 uppercase tracking-wider">
              Verified %
            </span>
            <div className="w-7 h-7 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-xl font-black font-tabular text-teal-900 dark:text-teal-300">
            {summary.verifiedVotingPercentage}%
          </p>
          <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 block mt-1">
            ECI & BLO Cross-Audit
          </span>
        </div>
      </div>

      {/* 3. Section 3: Time-wise Voting Progress Chart & Interval Growth */}
      <div className="bg-white dark:bg-[#111C30] p-5 rounded-2xl border border-slate-200 dark:border-[#273750] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Time-wise Voting Progression Curve
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Live hourly voting updates, turnout growth, and surge intervals throughout polling day (07:00 AM to 06:00 PM).
            </p>
          </div>

          {/* Scope Selector: Entire Constituency vs Individual Booth */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">View Progress For:</label>
            <select
              value={selectedBoothForChart}
              onChange={(e) => setSelectedBoothForChart(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="CONSTITUENCY">Entire Constituency (Consolidated)</option>
              {boothLiveStats.map((b) => (
                <option key={b.boothNumber} value={b.boothNumber.toString()}>
                  Booth #{b.boothNumber} – {b.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* SVG Curve Chart */}
        <div className="bg-slate-50/60 dark:bg-[#0c1424] rounded-xl p-4 border border-slate-100 dark:border-[#1d2b42] relative">
          <div className="h-60 w-full relative flex flex-col justify-between">
            {/* Horizontal Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
              {[80, 60, 40, 20, 0].map((val) => (
                <div key={val} className="border-b border-dashed border-slate-300 dark:border-slate-700 w-full flex items-center justify-between text-[10px] text-slate-400 font-mono pr-2">
                  <span>{val}%</span>
                </div>
              ))}
            </div>

            {/* SVG Interactive Area & Path Curve */}
            <div className="relative h-full w-full pt-2 pb-6 px-4">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 700 200" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="livePollingGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Closed Area fill */}
                <path
                  d={`M 0,${200 - (activeChartData[0]?.percentage || 0) * 2} ${activeChartData
                    .map((pt, i) => `L ${(i / (activeChartData.length - 1)) * 700},${200 - pt.percentage * 2}`)
                    .join(' ')} L 700,200 L 0,200 Z`}
                  fill="url(#livePollingGradient)"
                />

                {/* Primary Spline Stroke Line */}
                <path
                  d={`M 0,${200 - (activeChartData[0]?.percentage || 0) * 2} ${activeChartData
                    .map((pt, i) => `L ${(i / (activeChartData.length - 1)) * 700},${200 - pt.percentage * 2}`)
                    .join(' ')}`}
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Data Points */}
                {activeChartData.map((pt, i) => {
                  const x = (i / (activeChartData.length - 1)) * 700;
                  const y = 200 - pt.percentage * 2;
                  return (
                    <g key={pt.time} className="cursor-pointer group">
                      <circle cx={x} cy={y} r="5" fill="#ffffff" stroke="#2563eb" strokeWidth="3" />
                      <circle cx={x} cy={y} r="8" fill="#2563eb" opacity="0.15" className="group-hover:opacity-40 transition-opacity" />
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Time Checkpoint Interval Badges Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 pt-2 border-t border-slate-200 dark:border-slate-800 mt-2">
            {activeChartData.map((slot) => (
              <div
                key={slot.time}
                className="p-2 bg-white dark:bg-[#111C30] rounded-xl border border-slate-200/80 dark:border-slate-800 text-center shadow-xs"
              >
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block font-mono">
                  {slot.time}
                </span>
                <span className="text-sm font-black font-tabular text-blue-600 dark:text-blue-400 block mt-0.5">
                  {slot.percentage}%
                </span>
                <div className="flex items-center justify-center gap-1 text-[10px] text-slate-600 dark:text-slate-300 font-tabular font-medium mt-0.5">
                  <span>{slot.votes.toLocaleString()} votes</span>
                </div>
                {slot.deltaVotes > 0 && (
                  <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 block mt-0.5">
                    +{slot.deltaVotes.toLocaleString()} surge (+{slot.deltaPercentage}%)
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Section 4: Booth Intelligence & Readiness Matrix (Main Table) */}
      <div className="bg-white dark:bg-[#111C30] rounded-2xl border border-slate-200 dark:border-[#273750] p-5 shadow-xs space-y-4">
        {/* Table Header & Multi-Attribute Filters Bar */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Booth Intelligence & Polling Station Readiness Matrix
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  {filteredBooths.length} Polling Booths Listed
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Complete polling booth matrix with verified BLO assignments, Karyakarta deployment, slip delivery, and real-time votes cast.
              </p>
            </div>

            {activeFiltersCount > 0 && (
              <button
                onClick={handleResetFilters}
                className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 shrink-0"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Reset {activeFiltersCount} Filters</span>
              </button>
            )}
          </div>

          {/* Filter Controls Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
            {/* 1. Global Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search booth #, school, locality..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* 2. Grade Filter */}
            <div>
              <select
                value={gradeFilter}
                onChange={(e) => {
                  setGradeFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none"
              >
                <option value="ALL">All Grades (A, B, C, D)</option>
                <option value="A">Grade A (High Support)</option>
                <option value="B">Grade B (Moderate)</option>
                <option value="C">Grade C (Swing Focus)</option>
                <option value="D">Grade D (Vulnerable)</option>
              </select>
            </div>

            {/* 3. Voter Count Filter */}
            <div>
              <select
                value={voterCountFilter}
                onChange={(e) => {
                  setVoterCountFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none"
              >
                <option value="ALL">All Voter Counts</option>
                <option value="UNDER_1000">&lt; 1,000 Voters</option>
                <option value="1000_1300">1,000 – 1,300 Voters</option>
                <option value="OVER_1300">&gt; 1,300 Voters</option>
              </select>
            </div>

            {/* 4. Turnout Filter */}
            <div>
              <select
                value={turnoutRangeFilter}
                onChange={(e) => {
                  setTurnoutRangeFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none"
              >
                <option value="ALL">All Turnout Ranges</option>
                <option value="UNDER_50">&lt; 50% Turnout</option>
                <option value="50_70">50% – 70% Turnout</option>
                <option value="OVER_70">&gt; 70% Turnout</option>
              </select>
            </div>

            {/* 5. Slip Delivery Filter */}
            <div>
              <select
                value={slipDeliveryFilter}
                onChange={(e) => {
                  setSlipDeliveryFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none"
              >
                <option value="ALL">All Slip Delivery %</option>
                <option value="UNDER_60">&lt; 60% Delivered</option>
                <option value="60_80">60% – 80% Delivered</option>
                <option value="OVER_80">&gt; 80% Delivered</option>
              </select>
            </div>

            {/* 6. BLO Filter */}
            <div>
              <select
                value={bloSearch}
                onChange={(e) => {
                  setBloSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none"
              >
                <option value="ALL">All BLO Incharges</option>
                {bloOptions.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Booth Matrix Table with Strict Required Columns */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/90 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-bold border-y border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[10px]">
                {/* 1. Booth Number */}
                <th
                  onClick={() => {
                    setSortField('boothNumber');
                    setSortAsc(!sortAsc);
                  }}
                  className="py-3 px-3 w-20 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap"
                >
                  Booth #
                </th>

                {/* 2. Polling Station */}
                <th
                  onClick={() => {
                    setSortField('name');
                    setSortAsc(!sortAsc);
                  }}
                  className="py-3 px-3 min-w-[200px] cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Polling Station
                </th>

                {/* 3. Locality */}
                <th className="py-3 px-3 min-w-[130px]">Locality</th>

                {/* 4. Total Voters */}
                <th
                  onClick={() => {
                    setSortField('totalVoters');
                    setSortAsc(!sortAsc);
                  }}
                  className="py-3 px-3 w-24 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap"
                >
                  Total Voters
                </th>

                {/* 5. BLO Incharge */}
                <th className="py-3 px-3 min-w-[160px]">BLO Incharge</th>

                {/* 6. Karyakartas */}
                <th className="py-3 px-3 w-24 whitespace-nowrap">Karyakartas</th>

                {/* 7. Slip Delivery */}
                <th
                  onClick={() => {
                    setSortField('slipsDeliveredPercent');
                    setSortAsc(!sortAsc);
                  }}
                  className="py-3 px-3 w-32 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap"
                >
                  Slip Delivery
                </th>

                {/* 8. Projected Turnout */}
                <th
                  onClick={() => {
                    setSortField('projectedTurnoutPercent');
                    setSortAsc(!sortAsc);
                  }}
                  className="py-3 px-3 w-28 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap"
                >
                  Projected Turnout
                </th>

                {/* 9. Actual Votes Cast */}
                <th
                  onClick={() => {
                    setSortField('actualVotesCast');
                    setSortAsc(!sortAsc);
                  }}
                  className="py-3 px-3 w-28 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap text-emerald-700 dark:text-emerald-400"
                >
                  Votes Cast
                </th>

                {/* 10. Remaining Voters */}
                <th
                  onClick={() => {
                    setSortField('remainingVoters');
                    setSortAsc(!sortAsc);
                  }}
                  className="py-3 px-3 w-28 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap text-amber-700 dark:text-amber-400"
                >
                  Remaining
                </th>

                {/* 11. Live Turnout */}
                <th
                  onClick={() => {
                    setSortField('liveTurnoutPercent');
                    setSortAsc(!sortAsc);
                  }}
                  className="py-3 px-3 w-28 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap"
                >
                  Live Turnout
                </th>

                {/* 12. Previous Update */}
                <th className="py-3 px-3 w-24 whitespace-nowrap">Previous Update</th>

                {/* 13. Actions */}
                <th className="py-3 px-3 text-right w-28 whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-slate-700 dark:text-slate-200">
              {paginatedBooths.length === 0 ? (
                <tr>
                  <td colSpan={13} className="py-8 text-center text-slate-400">
                    No polling booths match the selected criteria.
                  </td>
                </tr>
              ) : (
                paginatedBooths.map((b) => (
                  <tr
                    key={b.boothNumber}
                    className="hover:bg-blue-50/40 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    {/* 1. Booth Number */}
                    <td className="py-3 px-3 font-mono font-tabular font-bold text-blue-700 dark:text-blue-400 whitespace-nowrap">
                      #{b.boothNumber}
                    </td>

                    {/* 2. Polling Station */}
                    <td className="py-3 px-3">
                      <span className="font-semibold text-slate-900 dark:text-white block leading-snug">
                        {b.name}
                      </span>
                    </td>

                    {/* 3. Locality */}
                    <td className="py-3 px-3">
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">{b.locality}</span>
                    </td>

                    {/* 4. Total Voters */}
                    <td className="py-3 px-3 font-semibold font-tabular text-slate-800 dark:text-slate-200 whitespace-nowrap">
                      {b.totalVoters.toLocaleString()}
                    </td>

                    {/* 5. BLO Incharge */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="font-medium text-slate-800 dark:text-slate-200 block text-xs">
                        {b.bloName}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                        {b.bloPhone}
                      </span>
                    </td>

                    {/* 6. Karyakartas */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 font-semibold text-slate-800 dark:text-slate-200 font-tabular">
                        <Users className="w-3 h-3 text-slate-400" />
                        <span>{b.karyakartaCount} Assigned</span>
                      </span>
                    </td>

                    {/* 7. Slip Delivery */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <div className="w-16 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-blue-600 h-full rounded-full"
                            style={{ width: `${b.slipsDeliveredPercent}%` }}
                          />
                        </div>
                        <span className="font-bold font-tabular text-[11px] text-slate-800 dark:text-slate-200">
                          {b.slipsDeliveredPercent}%
                        </span>
                      </div>
                    </td>

                    {/* 8. Projected Turnout */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="font-bold font-tabular text-slate-700 dark:text-slate-300">
                        {b.projectedTurnoutPercent}%
                      </span>
                    </td>

                    {/* 9. Actual Votes Cast */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="font-black font-tabular text-emerald-700 dark:text-emerald-400">
                        {b.actualVotesCast.toLocaleString()}
                      </span>
                    </td>

                    {/* 10. Remaining Voters */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="font-bold font-tabular text-amber-700 dark:text-amber-400">
                        {b.remainingVoters.toLocaleString()}
                      </span>
                    </td>

                    {/* 11. Live Turnout */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-black font-tabular text-xs bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        {b.liveTurnoutPercent}%
                      </span>
                    </td>

                    {/* 12. Previous Update */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="text-[11px] font-tabular text-slate-500 dark:text-slate-400">
                        {b.previousTurnoutPercent}%
                      </span>
                    </td>

                    {/* 13. Actions */}
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => {
                          setActiveInspectorBooth(b);
                          setInspectorVoterSearch('');
                          setInspectorVoterFilter('ALL');
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-[11px] transition-colors shadow-xs btn-tactile"
                        title="Inspect Roll & Record Voting Status"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Inspect Roll</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination & Summary Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span>
              Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
              {Math.min(currentPage * itemsPerPage, filteredBooths.length)} of {filteredBooths.length} Booths
            </span>
            <span>•</span>
            <div className="flex items-center gap-1">
              <span>Per page:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-1.5 py-0.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-xs"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 font-tabular font-bold text-slate-700 dark:text-slate-300">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 disabled:opacity-40 transition-colors"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 5. Section 6: Booth Detail View / Inspect Roll Modal Drawer */}
      {activeInspectorBooth && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-xs flex justify-end animate-fade-in">
          <div className="h-full bg-white dark:bg-[#0D1526] w-full max-w-2xl shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 animate-slide-in">
            {/* Drawer Header */}
            <div className="p-4 bg-slate-50 dark:bg-[#111C30] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800">
                    Booth #{activeInspectorBooth.boothNumber}
                  </span>
                  <h3 className="font-black text-sm text-slate-900 dark:text-white truncate max-w-sm">
                    {activeInspectorBooth.name}
                  </h3>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {activeInspectorBooth.locality} • Station Incharge: {activeInspectorBooth.bloName} ({activeInspectorBooth.bloPhone})
                </p>
              </div>

              <button
                onClick={() => setActiveInspectorBooth(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body Scroll */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5 scrollbar-thin">
              {/* Quick Summary Metric Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#17243A] border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Registered</span>
                  <span className="text-base font-black font-tabular text-slate-900 dark:text-white">
                    {activeInspectorBooth.totalVoters.toLocaleString()}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                  <span className="text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-400 block">Votes Cast</span>
                  <span className="text-base font-black font-tabular text-emerald-700 dark:text-emerald-300">
                    {activeInspectorBooth.actualVotesCast.toLocaleString()}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
                  <span className="text-[10px] uppercase font-bold text-amber-800 dark:text-amber-400 block">Remaining</span>
                  <span className="text-base font-black font-tabular text-amber-700 dark:text-amber-300">
                    {activeInspectorBooth.remainingVoters.toLocaleString()}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800">
                  <span className="text-[10px] uppercase font-bold text-blue-800 dark:text-blue-400 block">Live Turnout</span>
                  <span className="text-base font-black font-tabular text-blue-700 dark:text-blue-300">
                    {activeInspectorBooth.liveTurnoutPercent}%
                  </span>
                </div>
              </div>

              {/* Gender & Demographic Breakdown */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#111C30] border border-slate-200 dark:border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Demographic Voting Distribution (Booth Level)
                </h4>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 bg-white dark:bg-[#17243A] rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] font-bold text-slate-400 block">Male Cast</span>
                    <span className="font-black font-tabular text-blue-600 dark:text-blue-400">
                      {activeInspectorBooth.maleVoted.toLocaleString()}
                    </span>
                  </div>
                  <div className="p-2 bg-white dark:bg-[#17243A] rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] font-bold text-slate-400 block">Female Cast</span>
                    <span className="font-black font-tabular text-pink-600 dark:text-pink-400">
                      {activeInspectorBooth.femaleVoted.toLocaleString()}
                    </span>
                  </div>
                  <div className="p-2 bg-white dark:bg-[#17243A] rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] font-bold text-slate-400 block">Other Cast</span>
                    <span className="font-black font-tabular text-purple-600 dark:text-purple-400">
                      {activeInspectorBooth.otherVoted.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Booth Electors Roll & Voted Toggle List */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-blue-600" />
                    <span>Electoral Roll & Voting Status Recording</span>
                  </h4>
                  <div className="flex items-center gap-1">
                    {(['ALL', 'VOTED', 'NOT_VOTED'] as const).map((filterType) => (
                      <button
                        key={filterType}
                        onClick={() => setInspectorVoterFilter(filterType)}
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                          inspectorVoterFilter === filterType
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {filterType === 'ALL' ? 'All' : filterType === 'VOTED' ? 'Voted' : 'Not Voted'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Voter search inside booth */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search electors in Booth #{activeInspectorBooth.boothNumber}..."
                    value={inspectorVoterSearch}
                    onChange={(e) => setInspectorVoterSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs placeholder:text-slate-400 focus:outline-none"
                  />
                </div>

                {/* Electors List */}
                <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-80 overflow-y-auto border border-slate-200 dark:border-slate-800 rounded-xl">
                  {inspectorVotersList.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400">
                      No matching voters in this booth roll filter.
                    </div>
                  ) : (
                    inspectorVotersList.map((voter) => {
                      const rec = votingRecords[voter.id];
                      const isVoted = rec ? rec.hasVoted : (voter.hasVoted ?? false);

                      return (
                        <div
                          key={voter.id}
                          className="p-3 flex items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-tabular text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-1.5 py-0.2 rounded">
                                #{voter.serialNo}
                              </span>
                              <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                                {voter.fullName}
                              </span>
                              {voter.hindiName && (
                                <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">
                                  ({voter.hindiName})
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500 dark:text-slate-400 flex-wrap">
                              <span className="font-mono">{voter.epicNumber}</span>
                              <span>•</span>
                              <span>{voter.age} Yrs / {voter.gender}</span>
                              {rec && isVoted && (
                                <>
                                  <span>•</span>
                                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                                    Voted at {rec.votingTime}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {/* Toggle Voting Status Button */}
                            <button
                              onClick={() => {
                                toggleVoterVotingStatus(voter.id);
                                showToast(
                                  `${voter.fullName} marked as ${!isVoted ? 'VOTED' : 'NOT VOTED'}. Turnout updated.`,
                                  !isVoted ? 'success' : 'info'
                                );
                              }}
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all btn-tactile ${
                                isVoted
                                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200 dark:border-slate-700'
                              }`}
                            >
                              {isVoted ? (
                                <span className="flex items-center gap-1">
                                  <Check className="w-3 h-3 stroke-[3]" /> Voted
                                </span>
                              ) : (
                                <span>Mark Voted</span>
                              )}
                            </button>

                            {/* View Profile Button */}
                            <button
                              onClick={() => {
                                if (onSelectVoter) {
                                  onSelectVoter(voter);
                                  onNavigateToView('central-profile');
                                }
                              }}
                              className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                              title="Open Central Voter Profile"
                            >
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-3 bg-slate-50 dark:bg-[#111C30] border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Authorized Field Worker Updates • Encrypted ECI Transmission
              </span>
              <button
                onClick={() => setActiveInspectorBooth(null)}
                className="px-4 py-1.5 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-700 transition-colors btn-tactile"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Section 8: Live Polling Notification Modal */}
      {isNotificationModalOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-[#111C30] rounded-3xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Live Polling Notification Broadcast Engine
                </h3>
              </div>
              <button
                onClick={() => setIsNotificationModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Broadcasting Interval
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['15', '30', '60'].map((mins) => (
                    <button
                      key={mins}
                      onClick={() => setNotificationInterval(mins)}
                      className={`py-2 rounded-xl font-bold border transition-all ${
                        notificationInterval === mins
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      Every {mins} Minutes
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Recipient Cadre & Role Target
                </label>
                <select
                  value={selectedAudience}
                  onChange={(e) => setSelectedAudience(e.target.value as any)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200"
                >
                  <option value="ALL">All Roles (Candidate + Coordinators + Booth Agents)</option>
                  <option value="CANDIDATE">Candidate Super Admin (Consolidated Reports Only)</option>
                  <option value="COORDINATORS">Prabhaag & Cluster Coordinators (Cluster Booths)</option>
                  <option value="AGENTS">Booth Adhyaksh & Field Agents (Own Station Only)</option>
                </select>
              </div>

              <div className="p-3 bg-blue-50/60 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-900/60 space-y-1">
                <span className="font-bold text-blue-900 dark:text-blue-300 block">
                  Automated Turnout Milestone Alerts
                </span>
                <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                  Automatically triggers WhatsApp & SMS flash alerts when any booth crosses 50%, 65%, or 75% turnout thresholds.
                </p>
              </div>

              {/* Broadcast Sample Feed */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-3 bg-slate-50 dark:bg-slate-900 space-y-2">
                <span className="font-bold text-[11px] text-slate-500 uppercase tracking-wider block">
                  Recent Broadcast Log
                </span>
                <div className="space-y-1.5 font-mono text-[11px]">
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                    <span>17:00 PM: 18.2 L Votes reported (84.6% Turnout)</span>
                    <span className="text-emerald-600 font-bold">SENT (148 Agents)</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                    <span>15:00 PM: Milestone reached in Booth #101 (70%)</span>
                    <span className="text-emerald-600 font-bold">DELIVERED</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setIsNotificationModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-xl"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setIsNotificationModalOpen(false);
                  showToast('Notification schedule & broadcast parameters updated.', 'success');
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs btn-tactile"
              >
                Save Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
