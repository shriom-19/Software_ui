import React, { useState, useMemo } from 'react';
import {
  Users,
  Vote,
  MapPin,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  PhoneCall,
  Megaphone,
  ArrowRight,
  RefreshCw,
  Printer,
  ShieldAlert,
  UserCheck,
  Building2,
  Calendar,
  Layers,
  FileText,
  Activity,
  Check,
  ChevronRight,
  Info,
  Award,
  ShieldCheck,
  PieChart,
  Radio,
  BarChart2,
  Search,
  SlidersHorizontal,
  ChevronDown,
  Eye,
  FileSpreadsheet,
  AlertCircle,
  HelpCircle,
  MessageSquare,
  Smartphone,
  CheckSquare,
  Filter,
  UserPlus,
  Send,
  Share2,
  Database,
  CheckCircle,
  XCircle,
  Target,
  UserCheck2,
  Users2
} from 'lucide-react';
import {
  CURRENT_ELECTION_CONTEXT,
  MOCK_BOOTHS,
  MOCK_KARYAKARTAS,
  MOCK_TICKETS,
  MOCK_DASHBOARD_TASKS,
  MOCK_MONITORING_EVENTS,
  MOCK_ATTENTION_ALERTS,
  MOCK_ORGANISATION_MEMBERS,
  MOCK_CASTE_CATEGORIES,
  MOCK_CASTE_DISTRIBUTION,
  MOCK_CONSTITUENCIES,
  DashboardTask
} from '../../data/mockData';
import { useToast } from '../../components/common/Toast';

interface WarRoomDashboardViewProps {
  onNavigateToView: (view: string) => void;
}

export const WarRoomDashboardView: React.FC<WarRoomDashboardViewProps> = ({ onNavigateToView }) => {
  const { showToast } = useToast();
  const [lastRefreshed, setLastRefreshed] = useState('Just now');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('Today');

  // Multi-Constituency and Vidhan Sabha AC Selector State
  const [selectedConstituencyId, setSelectedConstituencyId] = useState<string>('pc-34');
  const [selectedAssemblySegmentCode, setSelectedAssemblySegmentCode] = useState<string>('ALL');

  // Filter Drawer State
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [filterGender, setFilterGender] = useState<string>('ALL');
  const [filterCaste, setFilterCaste] = useState<string>('ALL');
  const [filterMemberStatus, setFilterMemberStatus] = useState<string>('ALL');
  const [filterArea, setFilterArea] = useState<string>('ALL');
  const [filterBoothNumber, setFilterBoothNumber] = useState<string>('ALL');

  // Top Booths Search & Filter state
  const [topBoothSearch, setTopBoothSearch] = useState('');
  const [topBoothAreaFilter, setTopBoothAreaFilter] = useState('ALL');

  // Booth table state
  const [boothSearch, setBoothSearch] = useState('');
  const [selectedGradeFilter, setSelectedGradeFilter] = useState('ALL');
  const [boothSortField, setBoothSortField] = useState<'boothNumber' | 'totalVoters' | 'slipsDeliveredPercent' | 'projectedTurnoutPercent'>('boothNumber');
  const [boothSortAsc, setBoothSortAsc] = useState(true);

  // Live monitoring tab state (Section 13: 4 visible activity categories)
  const [activeMonitoringTab, setActiveMonitoringTab] = useState<'booth' | 'worker' | 'survey' | 'field'>('booth');

  // Task filter state (Section 11)
  const [taskFilterStatus, setTaskFilterStatus] = useState<string>('ALL');

  // Severity filter state (Section 14)
  const [alertSeverityFilter, setAlertSeverityFilter] = useState<string>('ALL');

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastRefreshed('Just now');
      showToast('War room command center telemetry resynchronized.', 'info');
    }, 600);
  };

  const handleResetFilters = () => {
    setFilterGender('ALL');
    setFilterCaste('ALL');
    setFilterMemberStatus('ALL');
    setFilterArea('ALL');
    setFilterBoothNumber('ALL');
    setSelectedAssemblySegmentCode('ALL');
    showToast('Dashboard filters reset to constituency default.', 'info');
  };

  const activeFilterCount = [
    filterGender !== 'ALL',
    filterCaste !== 'ALL',
    filterMemberStatus !== 'ALL',
    filterArea !== 'ALL',
    filterBoothNumber !== 'ALL',
    selectedAssemblySegmentCode !== 'ALL'
  ].filter(Boolean).length;

  const currentConstituency = useMemo(() => {
    return MOCK_CONSTITUENCIES.find(c => c.id === selectedConstituencyId) || MOCK_CONSTITUENCIES[0];
  }, [selectedConstituencyId]);

  // Top Booths Ranked descending by total voters
  const rankedTopBooths = useMemo(() => {
    return [...MOCK_BOOTHS]
      .filter((b) => {
        const matchSearch =
          b.name.toLowerCase().includes(topBoothSearch.toLowerCase()) ||
          b.locality.toLowerCase().includes(topBoothSearch.toLowerCase()) ||
          b.boothNumber.toString().includes(topBoothSearch);
        const matchArea = topBoothAreaFilter === 'ALL' || b.prabhaag.toLowerCase().includes(topBoothAreaFilter.toLowerCase());
        const matchAc = selectedAssemblySegmentCode === 'ALL' ||
          (selectedAssemblySegmentCode === '214' && b.locality.includes('Kothrud')) ||
          (selectedAssemblySegmentCode === '215' && (b.locality.includes('Shivajinagar') || b.locality.includes('Deccan') || b.locality.includes('FC Road')));
        return matchSearch && matchArea && matchAc;
      })
      .sort((a, b) => b.totalVoters - a.totalVoters);
  }, [topBoothSearch, topBoothAreaFilter, selectedAssemblySegmentCode]);

  // Filtered & Sorted Booths
  const filteredBooths = useMemo(() => {
    return MOCK_BOOTHS.filter((b) => {
      const matchSearch =
        b.name.toLowerCase().includes(boothSearch.toLowerCase()) ||
        b.locality.toLowerCase().includes(boothSearch.toLowerCase()) ||
        b.boothNumber.toString().includes(boothSearch);
      const matchGrade = selectedGradeFilter === 'ALL' || b.grade === selectedGradeFilter;
      return matchSearch && matchGrade;
    }).sort((a, b) => {
      const aVal = a[boothSortField];
      const bVal = b[boothSortField];
      if (aVal < bVal) return boothSortAsc ? -1 : 1;
      if (aVal > bVal) return boothSortAsc ? 1 : -1;
      return 0;
    });
  }, [boothSearch, selectedGradeFilter, boothSortField, boothSortAsc]);

  // Filtered Tasks
  const filteredTasks = useMemo(() => {
    if (taskFilterStatus === 'ALL') return MOCK_DASHBOARD_TASKS;
    return MOCK_DASHBOARD_TASKS.filter(t => t.status === taskFilterStatus);
  }, [taskFilterStatus]);

  // Filtered Alerts
  const filteredAlerts = useMemo(() => {
    if (alertSeverityFilter === 'ALL') return MOCK_ATTENTION_ALERTS;
    return MOCK_ATTENTION_ALERTS.filter(a => a.severity === alertSeverityFilter);
  }, [alertSeverityFilter]);

  return (
    <div className="space-y-6 pb-16 animate-fade-in">
      {/* Top Banner / Breadcrumb & Controls with Vidhan Sabha AC and Filters */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-premium-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Central War Room Command
              </span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                Verified Official Roll
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-[11px] text-slate-400 font-mono">
                Updated: {lastRefreshed}
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 mt-1 tracking-tight">
              {CURRENT_ELECTION_CONTEXT.electionName}
            </h1>
            <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 flex-wrap">
              <span>Candidate: <strong className="text-slate-800 font-semibold">{CURRENT_ELECTION_CONTEXT.candidateName}</strong> ({CURRENT_ELECTION_CONTEXT.partyName})</span>
              <span>•</span>
              <span className="text-blue-700 font-semibold">User: Adv. Vikram Patil (Candidate Super Admin)</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Top-Right Parliamentary Constituency Selector */}
            <div className="relative">
              <select
                value={selectedConstituencyId}
                onChange={(e) => {
                  setSelectedConstituencyId(e.target.value);
                  setSelectedAssemblySegmentCode('ALL');
                  showToast(`Switched active parliamentary constituency context.`, 'info');
                }}
                className="pl-3 pr-8 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer appearance-none shadow-xs"
              >
                {MOCK_CONSTITUENCIES.map(pc => (
                  <option key={pc.id} value={pc.id}>{pc.name}</option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Vidhan Sabha AC Selector */}
            <div className="relative">
              <select
                value={selectedAssemblySegmentCode}
                onChange={(e) => {
                  setSelectedAssemblySegmentCode(e.target.value);
                  showToast(e.target.value === 'ALL' ? 'Displaying all Assembly Segments.' : `Filtered to ${e.target.value} Assembly Segment.`, 'info');
                }}
                className="pl-3 pr-8 py-2 bg-blue-50/80 hover:bg-blue-100/80 border border-blue-200 rounded-xl text-xs font-bold text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer appearance-none shadow-xs"
              >
                {currentConstituency.assemblySegments.map(ac => (
                  <option key={ac.id} value={ac.code}>{ac.name}</option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-blue-600 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Dedicated Filters Button */}
            <button
              onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all shadow-xs ${
                activeFilterCount > 0
                  ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-white text-blue-700 text-[10px] font-black flex items-center justify-center ml-0.5">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Timeframe Filter */}
            <div className="flex items-center bg-slate-100/80 border border-slate-200/60 p-1 rounded-xl text-xs font-semibold text-slate-600">
              {['Today', 'This Week', 'Full Campaign'].map((tf) => (
                <button
                  key={tf}
                  onClick={() => setSelectedTimeframe(tf)}
                  className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                    selectedTimeframe === tf ? 'bg-white text-slate-900 font-bold shadow-premium-xs' : 'hover:text-slate-900'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold rounded-xl text-xs shadow-premium-xs transition-all"
              title="Refresh Field Telemetry"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-600' : 'text-slate-500'}`} />
              <span>{isRefreshing ? 'Syncing...' : 'Refresh'}</span>
            </button>

            {/* Register Elector Action */}
            <button
              onClick={() => onNavigateToView('voters')}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl text-xs shadow-sm transition-all"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Register Elector</span>
            </button>
          </div>
        </div>

        {/* Expandable Global Filters Panel */}
        {isFilterDrawerOpen && (
          <div className="p-4 bg-slate-50/90 rounded-xl border border-slate-200 text-xs space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
                Active War Room Scope Filters
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleResetFilters}
                  className="text-[11px] text-slate-500 hover:text-slate-800 font-semibold underline"
                >
                  Reset Filters
                </button>
                <button
                  onClick={() => setIsFilterDrawerOpen(false)}
                  className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs"
                >
                  Apply Filters
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {/* Gender Filter */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Gender</label>
                <select
                  value={filterGender}
                  onChange={(e) => setFilterGender(e.target.value)}
                  className="w-full p-2 bg-white rounded-lg border border-slate-200 text-xs font-semibold text-slate-700"
                >
                  <option value="ALL">All Genders</option>
                  <option value="MALE">Male (51.4%)</option>
                  <option value="FEMALE">Female (48.5%)</option>
                </select>
              </div>

              {/* Caste Category Filter */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Caste Category</label>
                <select
                  value={filterCaste}
                  onChange={(e) => setFilterCaste(e.target.value)}
                  className="w-full p-2 bg-white rounded-lg border border-slate-200 text-xs font-semibold text-slate-700"
                >
                  <option value="ALL">All Categories</option>
                  <option value="GEN">General / Open</option>
                  <option value="OBC">OBC</option>
                  <option value="SC">SC</option>
                  <option value="MIN">Religious Minorities</option>
                  <option value="NT">ST / NT</option>
                </select>
              </div>

              {/* Member Status Filter */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Member Status</label>
                <select
                  value={filterMemberStatus}
                  onChange={(e) => setFilterMemberStatus(e.target.value)}
                  className="w-full p-2 bg-white rounded-lg border border-slate-200 text-xs font-semibold text-slate-700"
                >
                  <option value="ALL">All Member Types</option>
                  <option value="ACTIVE">Active Cadre</option>
                  <option value="NEW">Newly Registered</option>
                  <option value="INACTIVE">Standby / Inactive</option>
                </select>
              </div>

              {/* Area / Prabhaag Filter */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Area / Ward</label>
                <select
                  value={filterArea}
                  onChange={(e) => setFilterArea(e.target.value)}
                  className="w-full p-2 bg-white rounded-lg border border-slate-200 text-xs font-semibold text-slate-700"
                >
                  <option value="ALL">All Wards</option>
                  <option value="kothrud">Prabhaag 12 - Kothrud West</option>
                  <option value="erandwane">Prabhaag 13 - Erandwane</option>
                  <option value="shivajinagar">Prabhaag 14 - Shivajinagar</option>
                </select>
              </div>

              {/* Specific Booth Range */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Booth Number</label>
                <select
                  value={filterBoothNumber}
                  onChange={(e) => setFilterBoothNumber(e.target.value)}
                  className="w-full p-2 bg-white rounded-lg border border-slate-200 text-xs font-semibold text-slate-700"
                >
                  <option value="ALL">All 2,045 Booths</option>
                  {MOCK_BOOTHS.map(b => (
                    <option key={b.boothNumber} value={b.boothNumber.toString()}>
                      Booth #{b.boothNumber} ({b.locality})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Critical Attention & Alerts Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-amber-900">
              3 High-Priority Swing Booths Require Slip Distribution Surge
            </h4>
            <p className="text-xs text-amber-700 mt-0.5">
              Booth #103 (Paud Phata) & Booth #108 (Deccan) are currently under 50% voter slip distribution threshold.
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigateToView('map')}
          className="whitespace-nowrap px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs transition-colors shadow-xs flex items-center gap-1.5"
        >
          <span>Dispatch on Live Map</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Primary KPI Metric Cards (Explicitly highlighting Total Voters, Total Members, Total Booths, BLO Officers + existing operational KPIs) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {/* 1. Total Voters - Explicit VoterX Metric */}
        <div
          onClick={() => onNavigateToView('voters')}
          className="bg-white p-3.5 rounded-2xl border border-blue-200/70 shadow-premium-xs hover:border-blue-400 hover:shadow-premium-md cursor-pointer transition-all group relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
          <div className="flex items-center justify-between mb-1.5 mt-0.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Voters</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Vote className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-lg font-black text-slate-900">21.54 L</p>
          <div className="flex items-center gap-1 mt-1 text-[10px] text-blue-600 font-semibold truncate">
            <CheckCircle className="w-3 h-3 shrink-0" />
            <span>ECI Verified</span>
          </div>
        </div>

        {/* 2. Total Members - Explicit VoterX Metric */}
        <div
          onClick={() => onNavigateToView('users-members')}
          className="bg-white p-3.5 rounded-2xl border border-indigo-200/70 shadow-premium-xs hover:border-indigo-400 hover:shadow-premium-md cursor-pointer transition-all group relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-blue-600"></div>
          <div className="flex items-center justify-between mb-1.5 mt-0.5">
            <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">Total Members</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Award className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-lg font-black text-slate-900">34,200</p>
          <div className="flex items-center gap-1 mt-1 text-[10px] text-indigo-600 font-semibold truncate">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></span>
            <span>28,450 Active Members</span>
          </div>
        </div>

        {/* 3. Total Booths - Explicit VoterX Metric */}
        <div
          onClick={() => onNavigateToView('dashboard')}
          className="bg-white p-3.5 rounded-2xl border border-purple-200/70 shadow-premium-xs hover:border-purple-400 hover:shadow-premium-md cursor-pointer transition-all group relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-fuchsia-600"></div>
          <div className="flex items-center justify-between mb-1.5 mt-0.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Booths</span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <MapPin className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-lg font-black text-slate-900">2,045</p>
          <div className="text-[10px] text-purple-600 font-semibold truncate mt-1">
            <span>2,038 Active Stations</span>
          </div>
        </div>

        {/* 4. BLO Officers - Explicit VoterX Metric */}
        <div
          onClick={() => onNavigateToView('blo')}
          className="bg-white p-3.5 rounded-2xl border border-sky-200/70 shadow-premium-xs hover:border-sky-400 hover:shadow-premium-md cursor-pointer transition-all group relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-400 to-blue-500"></div>
          <div className="flex items-center justify-between mb-1.5 mt-0.5">
            <span className="text-[10px] font-bold text-sky-700 uppercase tracking-wider">BLO Officers</span>
            <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ShieldAlert className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-lg font-black text-slate-900">2,045</p>
          <div className="flex items-center gap-1 mt-1 text-[10px] text-sky-700 font-semibold truncate">
            <span>98.4% Verified Assigned</span>
          </div>
        </div>

        {/* 5. Karyakartas */}
        <div
          onClick={() => onNavigateToView('users-members')}
          className="bg-white p-3.5 rounded-2xl border border-cyan-200/70 shadow-premium-xs hover:border-cyan-400 hover:shadow-premium-md cursor-pointer transition-all group relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-teal-500"></div>
          <div className="flex items-center justify-between mb-1.5 mt-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Karyakartas</span>
            <div className="w-7 h-7 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-lg font-black text-slate-900">4,850</p>
          <div className="flex items-center gap-1 mt-1 text-[10px] text-cyan-700 font-semibold truncate">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 shrink-0"></span>
            <span>3,120 On Field</span>
          </div>
        </div>

        {/* 6. Overall Coverage */}
        <div
          onClick={() => onNavigateToView('voters')}
          className="bg-white p-3.5 rounded-2xl border border-amber-200/70 shadow-premium-xs hover:border-amber-400 hover:shadow-premium-md cursor-pointer transition-all group relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500"></div>
          <div className="flex items-center justify-between mb-1.5 mt-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Coverage</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-lg font-black text-slate-900">78.2%</p>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full" style={{ width: '78.2%' }}></div>
          </div>
        </div>

        {/* 7. Voter Slips Delivered */}
        <div
          onClick={() => onNavigateToView('voters')}
          className="bg-white p-3.5 rounded-2xl border border-violet-200/70 shadow-premium-xs hover:border-violet-400 hover:shadow-premium-md cursor-pointer transition-all group relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 to-purple-600"></div>
          <div className="flex items-center justify-between mb-1.5 mt-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Slips Deliv.</span>
            <div className="w-7 h-7 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Printer className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-lg font-black text-slate-900">84.6%</p>
          <div className="flex items-center gap-1 mt-1 text-[10px] text-violet-600 font-semibold truncate">
            <span>18.2 L Handed</span>
          </div>
        </div>

        {/* 8. Open Issues */}
        <div
          onClick={() => onNavigateToView('office')}
          className="bg-white p-3.5 rounded-2xl border border-rose-200/70 shadow-premium-xs hover:border-rose-400 hover:shadow-premium-md cursor-pointer transition-all group relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 to-pink-500"></div>
          <div className="flex items-center justify-between mb-1.5 mt-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Open Issues</span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Building2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-lg font-black text-slate-900">42</p>
          <div className="flex items-center gap-1 mt-1 text-[10px] text-rose-600 font-semibold truncate">
            <span>89% Resolved</span>
          </div>
        </div>
      </div>

      {/* Row 2: Live Field Map Mini-Widget & Bot Intelligence Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Compact Live Field Map Preview */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-600" />
                <h3 className="font-bold text-slate-900 text-sm">Live Field Operations Preview</h3>
              </div>
              <p className="text-xs text-slate-500">
                Visualizing active Karyakarta survey tracks across Kothrud, Erandwane, and Shivajinagar.
              </p>
            </div>
            <button
              onClick={() => onNavigateToView('map')}
              className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-lg transition-colors"
            >
              <span>Expand Interactive Full Map</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Interactive Mini Map SVG Container */}
          <div className="w-full h-64 bg-slate-100 rounded-xl border border-slate-200 relative overflow-hidden flex items-center justify-center">
            {/* Visual Grid Mock Pattern */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#2563eb_1px,transparent_1px)] [background-size:16px_16px]"></div>

            {/* Stylized Map Contours */}
            <svg className="w-full h-full absolute inset-0 text-slate-300" viewBox="0 0 600 240">
              <path d="M 50 180 Q 150 40 280 120 T 550 80" fill="none" stroke="#60a5fa" strokeWidth="5" strokeLinecap="round" opacity="0.6" />
              <path d="M 80 80 Q 200 220 380 90 T 580 190" fill="none" stroke="#c084fc" strokeWidth="4" strokeDasharray="6,6" opacity="0.6" />
              {/* Booth Polygons with distinctive rich tinting */}
              <polygon points="120,40 220,60 190,140 100,110" fill="rgba(59,130,246,0.15)" stroke="#3b82f6" strokeWidth="2" />
              <polygon points="230,70 340,50 360,150 250,160" fill="rgba(6,182,212,0.15)" stroke="#06b6d4" strokeWidth="2" />
              <polygon points="370,60 520,70 490,180 380,160" fill="rgba(245,158,11,0.15)" stroke="#f59e0b" strokeWidth="2" />
            </svg>

            {/* Simulated Live Karyakarta Markers */}
            <div className="absolute top-1/4 left-1/4 flex flex-col items-center">
              <span className="w-3.5 h-3.5 rounded-full bg-blue-600 ring-4 ring-blue-200 animate-ping"></span>
              <span className="mt-1 px-2 py-0.5 rounded-md bg-white text-[9px] font-bold text-blue-900 shadow-md border border-blue-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Pooja J. (Booth 101)
              </span>
            </div>

            <div className="absolute top-1/2 left-1/2 flex flex-col items-center">
              <span className="w-3.5 h-3.5 rounded-full bg-purple-600 ring-4 ring-purple-200 animate-ping"></span>
              <span className="mt-1 px-2 py-0.5 rounded-md bg-white text-[9px] font-bold text-purple-900 shadow-md border border-purple-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span> Ganesh P. (Booth 102)
              </span>
            </div>

            <div className="absolute bottom-1/4 right-1/4 flex flex-col items-center">
              <span className="w-3.5 h-3.5 rounded-full bg-amber-500 ring-4 ring-amber-200 animate-pulse"></span>
              <span className="mt-1 px-2 py-0.5 rounded-md bg-white text-[9px] font-bold text-amber-900 shadow-md border border-amber-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Vikas M. (Booth 104)
              </span>
            </div>

            <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 shadow-md flex items-center gap-3 text-[10px]">
              <span className="flex items-center gap-1.5 font-bold text-blue-700">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 ring-2 ring-blue-100"></span> Active Karyakarta
              </span>
              <span className="flex items-center gap-1.5 font-bold text-purple-700">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-600 ring-2 ring-purple-100"></span> Field Squad
              </span>
              <span className="flex items-center gap-1.5 font-bold text-amber-700">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-amber-100"></span> Swing Zone
              </span>
            </div>
          </div>
        </div>

        {/* Bot Intelligence & Demographic Highlights */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-premium-md flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-brand-500/10 to-indigo-500/10 blur-2xl pointer-events-none"></div>
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">
                  Indata AI Strategic Intelligence
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-medium">
                Live Insights
              </span>
            </div>

            <h4 className="text-sm font-bold text-white mb-2 leading-snug">
              Key Opportunity: Ladki Bahin Yojana Sentiment Lift
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Survey data indicates an 18.4% favorable sentiment swing among women voters in Wards 12 & 13 following direct benefit disbursements. Recommending dedicated women karyakarta squads for Booth 103 and 105.
            </p>

            <div className="mt-4 p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Projected Pune Turnout:</span>
                <span className="font-bold text-amber-300 font-mono">68.4% (Target: 72%)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Strong Supporter Base:</span>
                <span className="font-bold text-brand-300 font-mono">46.8% (+4.2%)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Undecided Swing Voters:</span>
                <span className="font-bold text-amber-300 font-mono">18.5%</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigateToView('strategy')}
            className="mt-4 w-full py-2.5 px-4 bg-white hover:bg-slate-100 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-premium-sm flex items-center justify-center gap-2"
          >
            <span>Open Strategy Bot Analytics</span>
            <ChevronRight className="w-4 h-4 text-slate-600" />
          </button>
        </div>
      </div>

      {/* Row 2B: Organisation & Member Intelligence (VoterX Integration) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card A: Organisation Score */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-brand-600" />
                <h3 className="font-bold text-slate-900 text-sm">Organisation Score</h3>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-50 text-brand-700 border border-brand-200">
                ECI Roll Match: High
              </span>
            </div>

            {/* Circular Progress & Metrics */}
            <div className="flex items-center gap-5 my-2">
              <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  {/* Background Circle */}
                  <path
                    className="text-slate-100"
                    strokeWidth="3.6"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Progress Circle (82%) */}
                  <path
                    className="text-blue-600 transition-all duration-1000 ease-out"
                    strokeDasharray="82, 100"
                    strokeWidth="3.6"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-xl font-black text-slate-900 tracking-tight">82%</span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Health</span>
                </div>
              </div>

              <div className="flex-1 space-y-2.5">
                <div>
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="text-slate-500 font-medium">Booth Coverage</span>
                    <span className="font-bold text-slate-900">99.6%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-brand-600 h-2 rounded-full" style={{ width: '99.6%' }} />
                  </div>
                  <span className="text-[10px] text-slate-400">2,038 / 2,045 booths active</span>
                </div>

                <div className="pt-1 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="text-xs text-slate-600">Booths w/o Data:</span>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedGradeFilter('D');
                      showToast('Filtered Booth Matrix to inspect 7 booths missing voter data.', 'info');
                    }}
                    className="px-2 py-0.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-md font-bold text-[11px] transition-colors"
                  >
                    7 Booths
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              onClick={() => onNavigateToView('voters')}
              className="w-full py-2.5 px-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Add / Import Voters</span>
            </button>
          </div>
        </div>

        {/* Card B: Gender Distribution */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-600" />
                <h3 className="font-bold text-slate-900 text-sm">Gender Distribution</h3>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">21,54,320 total</span>
            </div>

            {/* Donut Chart & Legends */}
            <div className="flex items-center gap-5 my-2">
              <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  {/* Female Segment (48.5% ~ dash 48.5, space 51.5) */}
                  <path
                    className="text-purple-500"
                    strokeDasharray="48.5, 51.5"
                    strokeDashoffset="0"
                    strokeWidth="4"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Male Segment (51.4% ~ dash 51.4, space 48.6, offset -48.5) */}
                  <path
                    className="text-blue-600"
                    strokeDasharray="51.4, 48.6"
                    strokeDashoffset="-48.5"
                    strokeWidth="4"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-xs font-black text-slate-900">100%</span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase">Classified</span>
                </div>
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between p-2 rounded-lg bg-blue-50/60 border border-blue-100">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0" />
                    <span className="text-xs font-semibold text-slate-700">Male</span>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-slate-900 font-mono">11,07,320</div>
                    <div className="text-[10px] text-blue-600 font-bold">51.4%</div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-purple-50/60 border border-purple-100">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shrink-0" />
                    <span className="text-xs font-semibold text-slate-700">Female</span>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-slate-900 font-mono">10,45,280</div>
                    <div className="text-[10px] text-purple-600 font-bold">48.5%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Third Gender / Others:</span>
            <span className="font-bold text-slate-700 font-mono">1,720 (0.1%)</span>
          </div>
        </div>

        {/* Card C: Member Summary */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users2 className="w-4 h-4 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-sm">Member Summary</h3>
              </div>
              <button
                onClick={() => onNavigateToView('members')}
                className="text-[11px] font-bold text-brand-600 hover:text-brand-700 transition-colors"
              >
                View Roster →
              </button>
            </div>

            {MOCK_ORGANISATION_MEMBERS && MOCK_ORGANISATION_MEMBERS.length > 0 ? (
              <div className="space-y-2.5">
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Members</span>
                    <span className="text-lg font-black text-slate-900 font-mono">34,200</span>
                    <span className="text-[10px] text-blue-600 font-semibold block mt-0.5">Across all booths</span>
                  </div>

                  <div className="p-2.5 bg-blue-50/70 rounded-xl border border-blue-100">
                    <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider block">Active Members</span>
                    <span className="text-lg font-black text-blue-900 font-mono">28,450</span>
                    <span className="text-[10px] text-blue-700 font-semibold block mt-0.5">83.2% active</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 bg-amber-50/60 rounded-xl border border-amber-100">
                    <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block">Standby / Inactive</span>
                    <span className="text-sm font-bold text-amber-900 font-mono">4,120</span>
                    <span className="text-[10px] text-amber-700 block">Needs activation</span>
                  </div>

                  <div className="p-2 bg-purple-50/60 rounded-xl border border-purple-100">
                    <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider block">Newly Enrolled</span>
                    <span className="text-sm font-bold text-purple-900 font-mono">+1,630</span>
                    <span className="text-[10px] text-purple-700 block">Past 14 days</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-600">No member records enrolled yet</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Enroll karyakartas and booth committee members.</p>
              </div>
            )}
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Cadre Readiness Rate:</span>
            <span className="font-bold text-blue-700 font-mono">83.2% Verified</span>
          </div>
        </div>
      </div>

      {/* Row 2C: Caste Intelligence (VoterX Integration) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Panel 1: Broad Caste Categories */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Caste Categories</h3>
                <p className="text-[11px] text-slate-500">Broad social classifications across 21.54 L electorate</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
              6 Categories
            </span>
          </div>

          <div className="space-y-3">
            {MOCK_CASTE_CATEGORIES.map((cat) => (
              <div key={cat.code} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: cat.color }} />
                    <span className="font-semibold text-slate-800">{cat.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500 font-mono text-[11px]">{cat.voterCount.toLocaleString()}</span>
                    <span className="font-bold text-slate-900 font-mono w-12 text-right">{cat.percentage}%</span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Primary Demographic: <strong className="text-slate-800">General + OBC (62.1%)</strong></span>
            <button
              onClick={() => onNavigateToView('voters')}
              className="text-brand-600 font-bold hover:text-brand-700"
            >
              Filter Roll by Caste →
            </button>
          </div>
        </div>

        {/* Panel 2: Caste Distribution (Specific Communities) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <PieChart className="w-4 h-4 text-purple-600" />
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Caste Distribution</h3>
                <p className="text-[11px] text-slate-500">Specific community clusters & demographic density</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
              Community Breakdown
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5">
            {MOCK_CASTE_DISTRIBUTION.map((item) => (
              <div key={item.casteName} className="p-2 rounded-lg bg-slate-50/70 border border-slate-100">
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="font-bold text-slate-800 truncate">{item.casteName}</span>
                  </div>
                  <span className="font-bold text-slate-900 font-mono text-[10px]">{item.percentage}%</span>
                </div>
                <div className="w-full bg-slate-200/60 rounded-full h-1.5 overflow-hidden mb-1">
                  <div
                    className="h-1.5 rounded-full"
                    style={{ width: `${Math.min(100, item.percentage * 3.5)}%`, backgroundColor: item.color }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span className="truncate max-w-[130px]">{item.category}</span>
                  <span className="font-mono">{item.voterCount.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Aggregated from verified booth surveys and electoral records</span>
            <span className="font-bold text-purple-700 font-mono">10 Key Segments</span>
          </div>
        </div>
      </div>

      {/* Row 3: Booth Intelligence & Readiness Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-purple-600" />
              <h3 className="font-bold text-slate-900 text-sm">Booth Intelligence & Readiness Matrix</h3>
            </div>
            <p className="text-xs text-slate-500">
              Live status, grade ratings, BLO verification, karyakarta staffing, and slip delivery per polling station.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {/* Search Booth */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter booth, locality, #..."
                value={boothSearch}
                onChange={(e) => setBoothSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-slate-50 hover:bg-slate-100 focus:bg-white text-xs text-slate-800 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Grade Filter */}
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs font-semibold">
              {['ALL', 'A', 'B', 'C', 'D'].map((gr) => (
                <button
                  key={gr}
                  onClick={() => setSelectedGradeFilter(gr)}
                  className={`px-2 py-1 rounded-md text-[11px] ${
                    selectedGradeFilter === gr ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {gr === 'ALL' ? 'All' : `Grade ${gr}`}
                </button>
              ))}
            </div>

            <button
              onClick={() => onNavigateToView('voters')}
              className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 bg-blue-50 px-2.5 py-1.5 rounded-lg"
            >
              <span>Filter Total Voters</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold border-y border-slate-200 uppercase tracking-wider text-[11px]">
                <th
                  onClick={() => { setBoothSortField('boothNumber'); setBoothSortAsc(!boothSortAsc); }}
                  className="py-3 px-3 cursor-pointer hover:bg-slate-100"
                >
                  Booth #
                </th>
                <th className="py-3 px-3">Polling Station Name & Locality</th>
                <th
                  onClick={() => { setBoothSortField('totalVoters'); setBoothSortAsc(!boothSortAsc); }}
                  className="py-3 px-3 cursor-pointer hover:bg-slate-100"
                >
                  Voters
                </th>
                <th className="py-3 px-3">Grade</th>
                <th className="py-3 px-3">BLO Incharge</th>
                <th className="py-3 px-3">Karyakartas</th>
                <th
                  onClick={() => { setBoothSortField('slipsDeliveredPercent'); setBoothSortAsc(!boothSortAsc); }}
                  className="py-3 px-3 cursor-pointer hover:bg-slate-100"
                >
                  Slip Delivery
                </th>
                <th
                  onClick={() => { setBoothSortField('projectedTurnoutPercent'); setBoothSortAsc(!boothSortAsc); }}
                  className="py-3 px-3 cursor-pointer hover:bg-slate-100"
                >
                  Projected Turnout
                </th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredBooths.map((b) => (
                <tr key={b.boothNumber} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-blue-700">
                    #{b.boothNumber}
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-semibold text-slate-900 block">{b.name}</span>
                    <span className="text-[11px] text-slate-500">{b.locality}</span>
                  </td>
                  <td className="py-3 px-3 font-semibold">{b.totalVoters.toLocaleString()}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2.5 py-1 rounded-lg font-black text-[10px] tracking-wide inline-flex items-center gap-1 shadow-xs ${
                      b.grade === 'A'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : b.grade === 'B'
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        : b.grade === 'C'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      Grade {b.grade} {b.isSwing && '• Swing'}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-medium text-slate-800 block">{b.bloName}</span>
                    <span className="text-[11px] text-slate-500">{b.bloPhone}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-semibold text-slate-800">{b.karyakartaCount} Assigned</span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            b.slipsDeliveredPercent >= 80 ? 'bg-gradient-to-r from-blue-500 to-indigo-600' : 'bg-gradient-to-r from-amber-400 to-orange-500'
                          }`}
                          style={{ width: `${b.slipsDeliveredPercent}%` }}
                        />
                      </div>
                      <span className="font-bold text-[11px]">{b.slipsDeliveredPercent}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-bold text-slate-800">{b.projectedTurnoutPercent}%</span>
                    <span className="text-[10px] text-slate-400 block">Last: {b.lastTurnoutPercent}%</span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => onNavigateToView('voters')}
                      className="px-2.5 py-1 text-[11px] font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-lg transition-colors"
                    >
                      Inspect Roll
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Row 3B: Top Booths by Voter Count (Ranked Polling Stations) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              <h3 className="font-bold text-slate-900 text-sm">Top Booths by Total Voter Count</h3>
            </div>
            <p className="text-xs text-slate-500">
              Ranked descending order of registered voters to focus high-density mobilizations and voter slip delivery.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search Top Booth */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search ranked booths..."
                value={topBoothSearch}
                onChange={(e) => setTopBoothSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500 w-44"
              />
            </div>

            {/* Area Filter */}
            <select
              value={topBoothAreaFilter}
              onChange={(e) => setTopBoothAreaFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              <option value="ALL">All Prabhaags</option>
              <option value="Prabhaag 12">Prabhaag 12</option>
              <option value="Prabhaag 14">Prabhaag 14</option>
              <option value="Prabhaag 16">Prabhaag 16</option>
            </select>

            <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1.5 rounded-lg border border-slate-200">
              Showing {rankedTopBooths.length} Ranked Booths
            </span>
          </div>
        </div>

        {/* Ranked Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3 w-16 text-center">Rank</th>
                <th className="py-2.5 px-3">Polling Location & Building</th>
                <th className="py-2.5 px-3">Booth Number</th>
                <th className="py-2.5 px-3">Area / Prabhaag</th>
                <th className="py-2.5 px-3 text-right">Total Voters</th>
                <th className="py-2.5 px-3 text-right">Coverage & Slips</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {rankedTopBooths.slice(0, 8).map((b, idx) => {
                const rank = idx + 1;
                return (
                  <tr key={b.boothNumber} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-flex items-center justify-center w-6 h-6 rounded-full font-black text-xs font-mono shadow-xs ${
                          rank === 1
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : rank === 2
                            ? 'bg-slate-200 text-slate-800 border border-slate-300'
                            : rank === 3
                            ? 'bg-orange-100 text-orange-900 border border-orange-300'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        #{rank}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-slate-900 block">{b.name}</span>
                      <span className="text-[11px] text-slate-500">{b.locality}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200 font-mono text-[11px]">
                        Booth #{b.boothNumber}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      <span>{b.prabhaag}</span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="font-black text-slate-900 font-mono text-sm">
                        {b.totalVoters.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-slate-400 block font-normal">registered</span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="font-bold text-blue-700 font-mono">
                        {b.slipsDeliveredPercent}%
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        {Math.round((b.totalVoters * b.slipsDeliveredPercent) / 100).toLocaleString()} slips
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => onNavigateToView('voters')}
                        className="px-2.5 py-1 text-[11px] font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-lg transition-colors"
                      >
                        Inspect Roll
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Row 4: Campaign Outreach & Public Grievance Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Campaign Delivery Metrics */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Megaphone className="w-4 h-4 text-cyan-600" />
                  <h3 className="font-bold text-slate-900 text-sm">Campaign Communication Channels</h3>
                </div>
                <p className="text-xs text-slate-500">Live delivery throughput across automated voter broadcasts.</p>
              </div>
              <button
                onClick={() => onNavigateToView('campaigns')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg"
              >
                Manage Campaigns →
              </button>
            </div>

            <div className="space-y-3.5">
              <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
                    WhatsApp Voter Slip Broadcast
                  </span>
                  <span className="font-bold text-cyan-700 font-mono">96% Delivered (4,320 / 4,500)</span>
                </div>
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full rounded-full" style={{ width: '96%' }}></div>
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-500 pt-0.5">
                  <span>Delivered: <strong className="text-slate-700">4,320</strong></span>
                  <span>Failed: <strong className="text-rose-600">180 (4%)</strong></span>
                  <span>Responses: <strong className="text-cyan-700">614 (14.2%)</strong></span>
                </div>
              </div>

              <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    Youth First-Time Voter SMS
                  </span>
                  <span className="font-bold text-blue-700 font-mono">97% Delivered (7,950 / 8,200)</span>
                </div>
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-400 to-indigo-600 h-full rounded-full" style={{ width: '97%' }}></div>
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-500 pt-0.5">
                  <span>Delivered: <strong className="text-slate-700">7,950</strong></span>
                  <span>Failed: <strong className="text-rose-600">250 (3%)</strong></span>
                  <span>Click-through: <strong className="text-blue-700">1,550 (19.5%)</strong></span>
                </div>
              </div>

              <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                    AI Voice Outreach Calls
                  </span>
                  <span className="font-bold text-purple-700 font-mono">87% Connected (10,450 / 12,000)</span>
                </div>
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-500 to-fuchsia-600 h-full rounded-full" style={{ width: '87%' }}></div>
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-500 pt-0.5">
                  <span>Connected: <strong className="text-slate-700">10,450</strong></span>
                  <span>Failed: <strong className="text-rose-600">1,550 (13%)</strong></span>
                  <span>Avg Duration: <strong className="text-purple-700">48 sec</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Public Demands & Office Grievances */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-amber-600" />
                  <h3 className="font-bold text-slate-900 text-sm">Top Public Demands & Office Tickets</h3>
                </div>
                <p className="text-xs text-slate-500">Constituency grievances logged via Candidate Office Helpdesk.</p>
              </div>
              <button
                onClick={() => onNavigateToView('office')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg"
              >
                Open Ticket Desk →
              </button>
            </div>

            {/* Quick Summary Pill Stats */}
            <div className="grid grid-cols-4 gap-2 mb-3 text-center">
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Total</span>
                <span className="text-sm font-black text-slate-900 mt-0.5 block">42</span>
              </div>
              <div className="p-2 rounded-xl bg-amber-50 border border-amber-200">
                <span className="text-[10px] font-bold text-amber-700 uppercase block">Open</span>
                <span className="text-sm font-black text-amber-900 mt-0.5 block">14</span>
              </div>
              <div className="p-2 rounded-xl bg-blue-50 border border-blue-200">
                <span className="text-[10px] font-bold text-blue-700 uppercase block">In Progress</span>
                <span className="text-sm font-black text-blue-900 mt-0.5 block">18</span>
              </div>
              <div className="p-2 rounded-xl bg-indigo-50 border border-indigo-200">
                <span className="text-[10px] font-bold text-indigo-700 uppercase block">Resolved</span>
                <span className="text-sm font-black text-indigo-900 mt-0.5 block">10</span>
              </div>
            </div>

            <div className="space-y-2.5">
              {MOCK_TICKETS.slice(0, 3).map((t) => (
                <div key={t.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-blue-700">{t.id}</span>
                      <span className="font-bold text-slate-800">{t.category}</span>
                      <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                        t.priority === 'CRITICAL' ? 'bg-rose-100 text-rose-700' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {t.priority}
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px] mt-1 line-clamp-1">{t.description}</p>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">Visitor: {t.visitorName} • Assigned: {t.assignedTo}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                    t.status === 'RESOLVED' ? 'bg-indigo-100 text-indigo-800' :
                    t.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {t.status.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row 5: Voter Intelligence & Demographic Visualizations */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <PieChart className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-slate-900 text-sm">Voter Intelligence & Demographic Distribution</h3>
            </div>
            <p className="text-xs text-slate-500">
              Constituency voter segmentation across age cohorts, gender ratio, and social clusters.
            </p>
          </div>
          <button
            onClick={() => onNavigateToView('voters')}
            className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
          >
            <span>Explore Full Board</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Age Cohorts */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">Age Demographics</span>
              <span className="text-[10px] font-semibold text-slate-400">Total: 21.54 L</span>
            </div>
            <div className="space-y-2 text-xs">
              <div>
                <div className="flex justify-between mb-0.5 text-[11px]">
                  <span className="font-medium text-slate-700">18 - 25 Yrs (Youth First-Time)</span>
                  <span className="font-bold text-slate-900">3.98 L (18.5%)</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: '18.5%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-0.5 text-[11px]">
                  <span className="font-medium text-slate-700">26 - 40 Yrs (Working Core)</span>
                  <span className="font-bold text-slate-900">8.23 L (38.2%)</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-cyan-500 h-full rounded-full" style={{ width: '38.2%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-0.5 text-[11px]">
                  <span className="font-medium text-slate-700">41 - 60 Yrs (Family Heads)</span>
                  <span className="font-bold text-slate-900">5.84 L (27.1%)</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full rounded-full" style={{ width: '27.1%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-0.5 text-[11px]">
                  <span className="font-medium text-slate-700">60+ Yrs (Senior Citizens)</span>
                  <span className="font-bold text-slate-900">3.49 L (16.2%)</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: '16.2%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Gender Ratio */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-800">Gender Ratio & Turnout Inclination</span>
                <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  944 F/1000 M
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-center">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Male Voters</span>
                  <span className="text-lg font-black text-slate-900 mt-0.5 block">11.07 L</span>
                  <span className="text-[10px] font-semibold text-blue-600">51.4% (67% Projected Turnout)</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-center">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Female Voters</span>
                  <span className="text-lg font-black text-slate-900 mt-0.5 block">10.45 L</span>
                  <span className="text-[10px] font-semibold text-rose-600">48.5% (71% Projected Turnout)</span>
                </div>
              </div>
            </div>
            <div className="p-2.5 bg-rose-50 rounded-xl border border-rose-200 text-rose-900 text-[11px]">
              <span className="font-bold block mb-0.5">Women Mobilization Signal:</span>
              <span>Ladki Bahin scheme recipients in Wards 12 & 13 show 74% strong turnout intent.</span>
            </div>
          </div>

          {/* Social & Community Classification */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">Social & Demographic Clusters</span>
              <span className="text-[10px] font-semibold text-slate-400">Sample Model</span>
            </div>
            <div className="space-y-2 text-xs">
              {[
                { name: 'Maratha Community', pct: '22.4%', color: 'bg-blue-500' },
                { name: 'OBC Clusters (Mali, Vanjari, Dhangar)', pct: '14.5%', color: 'bg-cyan-500' },
                { name: 'Brahmin Demographic', pct: '10.4%', color: 'bg-indigo-500' },
                { name: 'SC (Neo-Buddhist & Matang)', pct: '9.2%', color: 'bg-purple-500' },
                { name: 'Muslim Community', pct: '6.6%', color: 'bg-violet-500' },
                { name: 'Other Mixed Classifications', pct: '36.9%', color: 'bg-amber-400' }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${item.color}`}></span>
                    <span className="font-medium text-slate-700">{item.name}</span>
                  </div>
                  <span className="font-bold text-slate-900">{item.pct}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 09: Voter Classification & Intelligence                            */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-indigo-600" />
              <h3 className="font-bold text-slate-900 text-sm">Voter Classification & Political Leaning Intelligence</h3>
            </div>
            <p className="text-xs text-slate-500">
              Electoral sentiment segmentation derived from verified field surveys and household interactions.
            </p>
          </div>
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase">
            16.82 L Sampled (78.2% Surveyed)
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
          <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200 text-center">
            <span className="text-[10px] font-bold text-blue-700 uppercase block">Supporters</span>
            <span className="text-lg font-black text-blue-900 mt-0.5 block">7.87 L</span>
            <span className="text-[10px] font-semibold text-blue-600">46.8% of surveyed</span>
          </div>

          <div className="p-3 bg-cyan-50/70 rounded-xl border border-cyan-200 text-center">
            <span className="text-[10px] font-bold text-cyan-700 uppercase block">Leaning Favorable</span>
            <span className="text-lg font-black text-cyan-900 mt-0.5 block">2.35 L</span>
            <span className="text-[10px] font-semibold text-cyan-600">14.0% favorable</span>
          </div>

          <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 text-center">
            <span className="text-[10px] font-bold text-amber-700 uppercase block">Neutral</span>
            <span className="text-lg font-black text-amber-900 mt-0.5 block">2.69 L</span>
            <span className="text-[10px] font-semibold text-amber-600">16.0% neutral</span>
          </div>

          <div className="p-3 bg-purple-50/70 rounded-xl border border-purple-200 text-center">
            <span className="text-[10px] font-bold text-purple-700 uppercase block">Undecided / Swing</span>
            <span className="text-lg font-black text-purple-900 mt-0.5 block">3.11 L</span>
            <span className="text-[10px] font-semibold text-purple-600">18.5% core swing</span>
          </div>

          <div className="p-3 bg-rose-50/70 rounded-xl border border-rose-200 text-center">
            <span className="text-[10px] font-bold text-rose-700 uppercase block">Opposition</span>
            <span className="text-lg font-black text-rose-900 mt-0.5 block">0.80 L</span>
            <span className="text-[10px] font-semibold text-rose-600">4.7% committed</span>
          </div>

          <div className="p-3 bg-slate-100 rounded-xl border border-slate-200 text-center">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">Unclassified</span>
            <span className="text-lg font-black text-slate-800 mt-0.5 block">4.72 L</span>
            <span className="text-[10px] font-semibold text-slate-500">Uncontacted roll</span>
          </div>
        </div>

        {/* Stacked Sentiment Distribution Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-slate-600">
            <span>Constituency Field Leaning Balance</span>
            <span className="font-mono font-bold text-slate-800">60.8% Net Favorable vs 4.7% Opposition</span>
          </div>
          <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-200">
            <div className="bg-blue-600 h-full" style={{ width: '46.8%' }} title="Supporter (46.8%)"></div>
            <div className="bg-cyan-500 h-full" style={{ width: '14.0%' }} title="Leaning Favorable (14.0%)"></div>
            <div className="bg-amber-400 h-full" style={{ width: '16.0%' }} title="Neutral (16.0%)"></div>
            <div className="bg-purple-500 h-full" style={{ width: '18.5%' }} title="Undecided (18.5%)"></div>
            <div className="bg-rose-500 h-full" style={{ width: '4.7%' }} title="Opposition (4.7%)"></div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 10: Field Operations & Workforce Intelligence                      */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-600" />
              <h3 className="font-bold text-slate-900 text-sm">Field Operations & Workforce Intelligence</h3>
            </div>
            <p className="text-xs text-slate-500">
              Field mobilization performance, active deployment ratios, and booth-level worker distribution.
            </p>
          </div>
          <button
            onClick={() => onNavigateToView('users-members')}
            className="text-xs text-blue-600 hover:text-blue-700 font-semibold bg-blue-50 px-2.5 py-1 rounded-lg"
          >
            Manage All 4,850 Cadre →
          </button>
        </div>

        {/* Metric Cards Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-5">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Cadre</span>
            <span className="text-lg font-black text-slate-900 mt-0.5 block">4,850</span>
            <span className="text-[10px] text-slate-500">Registered Karyakartas</span>
          </div>
          <div className="p-3 bg-cyan-50 rounded-xl border border-cyan-200 text-center">
            <span className="text-[10px] font-bold text-cyan-700 uppercase block">Active on Field</span>
            <span className="text-lg font-black text-cyan-900 mt-0.5 block">3,120</span>
            <span className="text-[10px] text-cyan-700">64.3% Real-time deployed</span>
          </div>
          <div className="p-3 bg-slate-100 rounded-xl border border-slate-200 text-center">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">Inactive / Standby</span>
            <span className="text-lg font-black text-slate-700 mt-0.5 block">1,730</span>
            <span className="text-[10px] text-slate-500">Available for reserve</span>
          </div>
          <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-center">
            <span className="text-[10px] font-bold text-blue-700 uppercase block">Surveys Done</span>
            <span className="text-lg font-black text-blue-900 mt-0.5 block">16.82 L</span>
            <span className="text-[10px] text-blue-700">78.2% Completion</span>
          </div>
          <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-200 text-center">
            <span className="text-[10px] font-bold text-indigo-700 uppercase block">Assigned Booths</span>
            <span className="text-lg font-black text-indigo-900 mt-0.5 block">2,038</span>
            <span className="text-[10px] text-indigo-700">99.6% Booth coverage</span>
          </div>
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-center">
            <span className="text-[10px] font-bold text-amber-700 uppercase block">Unassigned Booths</span>
            <span className="text-lg font-black text-amber-900 mt-0.5 block">7</span>
            <span className="text-[10px] text-amber-700">Requires table agents</span>
          </div>
        </div>

        {/* Top Mobilizers Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold border-y border-slate-200 uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-3">Karyakarta Name</th>
                <th className="py-2.5 px-3">Prabhaag & Assigned Booth</th>
                <th className="py-2.5 px-3">Surveys Completed</th>
                <th className="py-2.5 px-3">Voter Slips Handed</th>
                <th className="py-2.5 px-3">Field Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {MOCK_KARYAKARTAS.slice(0, 5).map((k) => (
                <tr key={k.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-slate-900">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px]">
                        {k.name.slice(0, 2)}
                      </div>
                      <span>{k.name}</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="font-bold text-slate-800">Booth #{k.assignedBooth}</span>
                    <span className="text-[10px] text-slate-400 block truncate max-w-[160px]">{k.prabhaag}</span>
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-blue-700">{k.surveysCompleted}</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-indigo-600">{k.voterSlipsDelivered}</td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      k.isOnline ? 'bg-cyan-50 text-cyan-800 border border-cyan-200' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {k.isOnline ? 'Active on Field' : 'Offline'}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={() => onNavigateToView('map')}
                      className="px-2.5 py-1 text-[11px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                    >
                      Locate GPS
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 11: Task Management                                                */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-slate-900 text-sm">War Room Task Management</h3>
            </div>
            <p className="text-xs text-slate-500">
              Operational directives assigned to booth adhyaksh, karyakartas, and war room coordinators.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs font-semibold">
            {['ALL', 'OVERDUE', 'IN_PROGRESS', 'PENDING', 'COMPLETED'].map((st) => (
              <button
                key={st}
                onClick={() => setTaskFilterStatus(st)}
                className={`px-2.5 py-1 rounded-md text-[11px] transition-all ${
                  taskFilterStatus === st ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Task Summary Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 mb-4">
          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Tasks</span>
            <span className="text-base font-black text-slate-900 mt-0.5 block">{MOCK_DASHBOARD_TASKS.length}</span>
          </div>
          <div className="p-2.5 bg-blue-50 rounded-xl border border-blue-200 text-center">
            <span className="text-[10px] font-bold text-blue-700 uppercase block">Assigned</span>
            <span className="text-base font-black text-blue-900 mt-0.5 block">6</span>
          </div>
          <div className="p-2.5 bg-cyan-50 rounded-xl border border-cyan-200 text-center">
            <span className="text-[10px] font-bold text-cyan-700 uppercase block">In Progress</span>
            <span className="text-base font-black text-cyan-900 mt-0.5 block">3</span>
          </div>
          <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-center">
            <span className="text-[10px] font-bold text-amber-700 uppercase block">Pending</span>
            <span className="text-base font-black text-amber-900 mt-0.5 block">1</span>
          </div>
          <div className="p-2.5 bg-rose-50 rounded-xl border border-rose-200 text-center">
            <span className="text-[10px] font-bold text-rose-700 uppercase block">Overdue</span>
            <span className="text-base font-black text-rose-900 mt-0.5 block">1</span>
          </div>
          <div className="p-2.5 bg-indigo-50 rounded-xl border border-indigo-200 text-center">
            <span className="text-[10px] font-bold text-indigo-700 uppercase block">Completed</span>
            <span className="text-base font-black text-indigo-900 mt-0.5 block">1</span>
          </div>
        </div>

        {/* Task Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold border-y border-slate-200 uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-3">Task ID & Directive</th>
                <th className="py-2.5 px-3">Assigned Person & Role</th>
                <th className="py-2.5 px-3">Booth</th>
                <th className="py-2.5 px-3">Priority</th>
                <th className="py-2.5 px-3">Deadline</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredTasks.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-2.5 px-3">
                    <span className="font-mono font-bold text-blue-700 mr-2">{t.id}</span>
                    <span className="font-semibold text-slate-900">{t.title}</span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="font-bold text-slate-800 block">{t.assignedTo}</span>
                    <span className="text-[10px] text-slate-400">{t.assignedRole}</span>
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-slate-800">Booth #{t.boothNumber}</td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                      t.priority === 'CRITICAL' ? 'bg-rose-100 text-rose-800' :
                      t.priority === 'HIGH' ? 'bg-amber-100 text-amber-800' :
                      t.priority === 'MEDIUM' ? 'bg-blue-100 text-blue-800' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {t.priority}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">{t.deadline}</td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      t.status === 'COMPLETED' ? 'bg-indigo-100 text-indigo-800' :
                      t.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                      t.status === 'OVERDUE' ? 'bg-rose-100 text-rose-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {t.status.replace('_', ' ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 12 & 13: Live War Room Monitoring & Live Monitoring Activity Tabs */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SECTION 12: Live War Room Monitoring Status Bar (5/12) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-blue-600 animate-pulse" />
                <h3 className="font-bold text-slate-900 text-sm">Live War Room Monitoring</h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-bold">
                Real-Time Sync
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Live telemetry aggregated from active Android terminals, web kiosks, and field dispatchers.
            </p>

            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Active Polling Stations</span>
                    <span className="text-[10px] text-slate-400">2,038 of 2,045 operational</span>
                  </div>
                </div>
                <span className="text-sm font-black text-blue-700 font-mono">99.6%</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Active Field Mobilizers</span>
                    <span className="text-[10px] text-slate-400">GPS pinging within 15 mins</span>
                  </div>
                </div>
                <span className="text-sm font-black text-cyan-800 font-mono">3,120</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Critical Flagged Issues</span>
                    <span className="text-[10px] text-slate-400">Action required by coordinators</span>
                  </div>
                </div>
                <span className="text-sm font-black text-amber-800 font-mono">4</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Last Global Telemetry Sync</span>
                    <span className="text-[10px] text-slate-400">ECI server connection verified</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-indigo-800 font-mono">Just now</span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 13: Live Monitoring Activity Tabs (7/12) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-purple-600" />
                  <h3 className="font-bold text-slate-900 text-sm">Live Monitoring Activity Feed</h3>
                </div>
                <p className="text-xs text-slate-500">
                  Real-time event streams across booths, worker movements, survey logs, and field dispatches.
                </p>
              </div>

              {/* 4 Visible Activity Categories Tabs */}
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs font-semibold">
                {[
                  { key: 'booth', label: 'Booth Activity' },
                  { key: 'worker', label: 'Worker Activity' },
                  { key: 'survey', label: 'Survey Activity' },
                  { key: 'field', label: 'Field Updates' }
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveMonitoringTab(tab.key as any)}
                    className={`px-2.5 py-1 rounded-md text-[11px] transition-all ${
                      activeMonitoringTab === tab.key ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Event List Container */}
            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1 text-xs">
              {MOCK_MONITORING_EVENTS[activeMonitoringTab].map((ev) => (
                <div key={ev.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start justify-between gap-3 hover:bg-slate-100/60 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-1.5 py-0.2 rounded font-black text-[9px] uppercase ${
                        ev.status === 'NORMAL' || ev.status === 'ACTIVE' || ev.status === 'CONFIRMED' || ev.status === 'SYNCED'
                          ? 'bg-blue-100 text-blue-800'
                          : ev.status === 'ALERT' || ev.status === 'ESCALATED'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {ev.status}
                      </span>
                      <h4 className="font-bold text-slate-900 text-xs">{ev.title}</h4>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                      <span>Location: <strong className="text-slate-700">{ev.location}</strong></span>
                      <span>•</span>
                      <span>By: <strong className="text-slate-700">{ev.user}</strong></span>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0 font-mono">{ev.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 14: Alerts & Attention Required                                   */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <h3 className="font-bold text-slate-900 text-sm">Alerts & Attention Required</h3>
            </div>
            <p className="text-xs text-slate-500">
              Actionable operational bottlenecks, lagging booth coverage, and overdue assignments requiring intervention.
            </p>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs font-semibold">
            {['ALL', 'CRITICAL', 'HIGH', 'WARNING'].map((sev) => (
              <button
                key={sev}
                onClick={() => setAlertSeverityFilter(sev)}
                className={`px-2.5 py-1 rounded-md text-[11px] ${
                  alertSeverityFilter === sev ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {sev === 'ALL' ? 'All Alerts' : sev}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filteredAlerts.map((al) => (
            <div
              key={al.id}
              className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-colors ${
                al.severity === 'CRITICAL'
                  ? 'bg-rose-50/60 border-rose-200'
                  : al.severity === 'HIGH'
                  ? 'bg-amber-50/60 border-amber-200'
                  : 'bg-blue-50/60 border-blue-200'
              }`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                    al.severity === 'CRITICAL' ? 'bg-rose-600 text-white' :
                    al.severity === 'HIGH' ? 'bg-amber-500 text-white' :
                    'bg-blue-600 text-white'
                  }`}>
                    {al.severity}
                  </span>
                  <span className="text-xs font-bold text-slate-500 uppercase">{al.category}</span>
                  <span className="text-[11px] text-slate-400 font-mono">• {al.timestamp}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 mt-1">{al.title}</h4>
                <p className="text-[11px] text-slate-600 mt-0.5">{al.description}</p>
                <span className="text-[10px] font-semibold text-slate-500 mt-1 block">
                  Affected Area: <strong className="text-slate-700">{al.affectedArea}</strong>
                </span>
              </div>
              <button
                onClick={() => onNavigateToView(al.actionView)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap shadow-xs flex items-center gap-1 transition-colors ${
                  al.severity === 'CRITICAL'
                    ? 'bg-rose-600 hover:bg-rose-700 text-white'
                    : al.severity === 'HIGH'
                    ? 'bg-amber-600 hover:bg-amber-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                <span>{al.actionLabel}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Row 6: Data Quality Indicators & Electoral Roll Integrity */}
      <div className="bg-slate-900 text-slate-200 rounded-2xl p-5 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <h3 className="font-bold text-white text-sm">Data Quality & Electoral Roll Integrity Metrics</h3>
            </div>
            <p className="text-xs text-slate-400">
              Audit status of voter contacts, photo rolls, geospatial coordinates, and duplicate indices.
            </p>
          </div>
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase">
            Roll Health: 96.2% Optimal
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="p-3 bg-white/5 rounded-xl border border-white/10">
            <span className="text-slate-400 text-[11px] block">Mobile Contact Seeding:</span>
            <span className="text-lg font-black text-white mt-0.5 block">89.4%</span>
            <div className="w-full bg-white/10 h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div className="bg-blue-400 h-full rounded-full" style={{ width: '89.4%' }}></div>
            </div>
            <span className="text-[10px] text-blue-300 mt-1 block">19.25 L reachable phones</span>
          </div>

          <div className="p-3 bg-white/5 rounded-xl border border-white/10">
            <span className="text-slate-400 text-[11px] block">ECI Photo Roll Clarity:</span>
            <span className="text-lg font-black text-white mt-0.5 block">98.1%</span>
            <div className="w-full bg-white/10 h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div className="bg-cyan-400 h-full rounded-full" style={{ width: '98.1%' }}></div>
            </div>
            <span className="text-[10px] text-cyan-300 mt-1 block">High-resolution ECI portraits</span>
          </div>

          <div className="p-3 bg-white/5 rounded-xl border border-white/10">
            <span className="text-slate-400 text-[11px] block">Geotagged Address Accuracy:</span>
            <span className="text-lg font-black text-white mt-0.5 block">94.7%</span>
            <div className="w-full bg-white/10 h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div className="bg-indigo-400 h-full rounded-full" style={{ width: '94.7%' }}></div>
            </div>
            <span className="text-[10px] text-indigo-300 mt-1 block">Matched to Prabhaag boundary</span>
          </div>

          <div className="p-3 bg-white/5 rounded-xl border border-white/10">
            <span className="text-slate-400 text-[11px] block">Duplicate Detection Index:</span>
            <span className="text-lg font-black text-white mt-0.5 block">0.3% (Low Risk)</span>
            <div className="w-full bg-white/10 h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div className="bg-sky-400 h-full rounded-full" style={{ width: '99.7%' }}></div>
            </div>
            <span className="text-[10px] text-sky-300 mt-1 block">Cross-booth deduplicated</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 16: Recent Activity Feed                                          */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-slate-900 text-sm">Recent Activity Feed</h3>
            </div>
            <p className="text-xs text-slate-500">
              Chronological operational log across voter registrations, surveys, tasks, and grievances.
            </p>
          </div>
          <button
            onClick={() => onNavigateToView('audit')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg"
          >
            View Full Audit Trail →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { time: '2m ago', actor: 'Pooja Jadhav', event: 'Delivered 8 voter information slips', location: 'Booth 101 Navbharat High School', type: 'SLIP' },
            { time: '7m ago', actor: 'Office Reception', event: 'Registered grievance #TKT-9210 (Water Supply)', location: 'Dahanukar Colony Lane 3', type: 'OFFICE' },
            { time: '14m ago', actor: 'Ganesh Patil', event: 'Logged new household survey (Supporter classified)', location: 'Booth 102 Kothrud Depot', type: 'SURVEY' },
            { time: '28m ago', actor: 'Broadcast Server', event: 'WhatsApp Campaign CMP-01 reached 96% delivery threshold', location: 'Ward 12 Broadcast Node', type: 'CAMPAIGN' },
            { time: '42m ago', actor: 'Sanjay Kulkarni (BLO)', event: 'ECI electoral roll amendment verified (14 additions)', location: 'Booth 101 Electoral Table', type: 'BLO' },
            { time: '55m ago', actor: 'Amit Deshmukh', event: 'Reassigned 2 standby karyakartas to Paud Phata swing sector', location: 'Booth 103 Desk', type: 'CADRE' }
          ].map((act, i) => (
            <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className={`px-1.5 py-0.2 rounded font-black text-[9px] ${
                    act.type === 'SLIP' ? 'bg-indigo-100 text-indigo-800' :
                    act.type === 'OFFICE' ? 'bg-amber-100 text-amber-800' :
                    act.type === 'SURVEY' ? 'bg-blue-100 text-blue-800' :
                    act.type === 'CAMPAIGN' ? 'bg-cyan-100 text-cyan-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {act.type}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{act.time}</span>
                </div>
                <h4 className="font-bold text-slate-900 text-xs mt-1">{act.actor}</h4>
                <p className="text-slate-600 text-[11px] mt-0.5">{act.event}</p>
              </div>
              <span className="text-[10px] text-slate-400 mt-2 block font-medium truncate">
                {act.location}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 17: Voter Slip Generation & Distribution                           */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Printer className="w-4 h-4 text-violet-600" />
              <h3 className="font-bold text-slate-900 text-sm">Voter Slip Generation & Distribution Analytics</h3>
            </div>
            <p className="text-xs text-slate-500">
              Constituency-wide throughput of printed, digital WhatsApp slips, and door-to-door handovers.
            </p>
          </div>
          <button
            onClick={() => onNavigateToView('voters')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg"
          >
            Launch Slip Batch Generator →
          </button>
        </div>

        {/* 6 Key Distribution Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-5">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Slips Needed</span>
            <span className="text-lg font-black text-slate-900 mt-0.5 block">21.54 L</span>
            <span className="text-[10px] text-slate-500">100% Electors</span>
          </div>
          <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-center">
            <span className="text-[10px] font-bold text-blue-700 uppercase block">Slips Generated</span>
            <span className="text-lg font-black text-blue-900 mt-0.5 block">19.82 L</span>
            <span className="text-[10px] text-blue-700">92.0% Prepared</span>
          </div>
          <div className="p-3 bg-violet-50 rounded-xl border border-violet-200 text-center">
            <span className="text-[10px] font-bold text-violet-700 uppercase block">Delivered to Electors</span>
            <span className="text-lg font-black text-violet-900 mt-0.5 block">18.23 L</span>
            <span className="text-[10px] text-violet-700">84.6% Handed Over</span>
          </div>
          <div className="p-3 bg-cyan-50 rounded-xl border border-cyan-200 text-center">
            <span className="text-[10px] font-bold text-cyan-700 uppercase block">Digital WhatsApp Slips</span>
            <span className="text-lg font-black text-cyan-900 mt-0.5 block">12.45 L</span>
            <span className="text-[10px] text-cyan-700">Delivered on mobile</span>
          </div>
          <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-200 text-center">
            <span className="text-[10px] font-bold text-indigo-700 uppercase block">Thermal Printed Slips</span>
            <span className="text-lg font-black text-indigo-900 mt-0.5 block">5.78 L</span>
            <span className="text-[10px] text-indigo-700">Field printer dispatched</span>
          </div>
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-center">
            <span className="text-[10px] font-bold text-amber-700 uppercase block">Pending Slips</span>
            <span className="text-lg font-black text-amber-900 mt-0.5 block">3.31 L</span>
            <span className="text-[10px] text-amber-700">Target for remaining days</span>
          </div>
        </div>

        {/* Booth-Wise Distribution Progress Bars */}
        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
            <span>Booth-Wise Slip Distribution Performance Sample</span>
            <span className="text-slate-400 font-normal text-[11px]">Showing representative sample of polling stations</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            {MOCK_BOOTHS.slice(0, 3).map((b) => (
              <div key={b.boothNumber} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-slate-800">Booth #{b.boothNumber}: {b.locality}</span>
                  <span className="font-mono font-bold text-blue-700">{b.slipsDeliveredPercent}%</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      b.slipsDeliveredPercent >= 80 ? 'bg-gradient-to-r from-blue-500 to-indigo-600' : 'bg-gradient-to-r from-amber-400 to-orange-500'
                    }`}
                    style={{ width: `${b.slipsDeliveredPercent}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>{Math.round(b.totalVoters * (b.slipsDeliveredPercent / 100))} delivered</span>
                  <span>{b.totalVoters - Math.round(b.totalVoters * (b.slipsDeliveredPercent / 100))} remaining</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 7: Workforce Performance & Live War Room Activity Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Workforce Performance Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-brand-600" />
                <h3 className="font-bold text-slate-900 text-sm">Workforce Assignments & Field Cadre Performance</h3>
              </div>
              <p className="text-xs text-slate-500">
                Top karyakarta mobilizers ranked by door-to-door surveys and voter slips handed over.
              </p>
            </div>
            <button
              onClick={() => onNavigateToView('users-members')}
              className="text-xs text-brand-600 hover:text-brand-700 font-semibold"
            >
              All 4,850 Cadre
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-bold border-y border-slate-200 uppercase tracking-wider text-[11px]">
                  <th className="py-2.5 px-3">Karyakarta</th>
                  <th className="py-2.5 px-3">Prabhaag & Booth</th>
                  <th className="py-2.5 px-3">Surveys</th>
                  <th className="py-2.5 px-3">Slips Handed</th>
                  <th className="py-2.5 px-3">Field Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {MOCK_KARYAKARTAS.slice(0, 5).map((k) => (
                  <tr key={k.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-slate-900">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px]">
                          {k.name.slice(0, 2)}
                        </div>
                        <span>{k.name}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="font-bold text-slate-800">Booth #{k.assignedBooth}</span>
                      <span className="text-[10px] text-slate-400 block truncate max-w-[140px]">{k.prabhaag}</span>
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-brand-700">{k.surveysCompleted}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-indigo-600">{k.voterSlipsDelivered}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        k.isOnline ? 'bg-brand-50 text-brand-700 border border-brand-200' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {k.isOnline ? 'Active on Field' : 'Offline'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => onNavigateToView('map')}
                        className="px-2.5 py-1 text-[11px] font-bold text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-lg transition-colors"
                      >
                        Locate GPS
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live War Room Field Activity Stream */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-brand-600 animate-pulse" />
                <h3 className="font-bold text-slate-900 text-sm">Live War Room Activity Stream</h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200 font-bold">
                Live Feed
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Real-time audit log of surveys, slip distributions, and field grievance escalations.
            </p>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1 text-xs">
              {[
                { time: '2m ago', actor: 'Pooja Jadhav', event: 'Delivered 8 voter information slips', booth: 'Booth 101', type: 'SLIP' },
                { time: '7m ago', actor: 'Office Reception', event: 'Registered grievance #TKT-9210 (Water Supply)', booth: 'Kothrud', type: 'OFFICE' },
                { time: '14m ago', actor: 'Ganesh Patil', event: 'Logged new household survey (Supporter classified)', booth: 'Booth 102', type: 'SURVEY' },
                { time: '28m ago', actor: 'Broadcast Server', event: 'WhatsApp Campaign CMP-01 reached 96% delivery threshold', booth: 'Ward 12', type: 'CAMPAIGN' },
                { time: '42m ago', actor: 'Sanjay Kulkarni (BLO)', event: 'ECI electoral roll amendment verified', booth: 'Booth 101', type: 'BLO' }
              ].map((act, i) => (
                <div key={i} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className={`px-1.5 py-0.2 rounded font-black text-[9px] ${
                        act.type === 'SLIP' ? 'bg-indigo-100 text-indigo-800' :
                        act.type === 'OFFICE' ? 'bg-amber-100 text-amber-800' :
                        act.type === 'SURVEY' ? 'bg-brand-100 text-brand-800' :
                        act.type === 'CAMPAIGN' ? 'bg-rose-100 text-rose-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {act.type}
                      </span>
                      <span className="font-bold text-slate-800 text-[11px]">{act.actor}</span>
                    </div>
                    <p className="text-slate-600 text-[11px] mt-0.5">{act.event}</p>
                    <span className="text-[10px] text-slate-400 font-medium">{act.booth}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0 font-mono">{act.time}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigateToView('audit')}
            className="w-full mt-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors text-center"
          >
            View Complete Activity Audit Log
          </button>
        </div>
      </div>
    </div>
  );
};
