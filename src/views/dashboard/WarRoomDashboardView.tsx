import React, { useState } from 'react';
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
  BarChart2
} from 'lucide-react';
import { CURRENT_ELECTION_CONTEXT, MOCK_BOOTHS, MOCK_KARYAKARTAS, MOCK_TICKETS } from '../../data/mockData';
import { useToast } from '../../components/common/Toast';

interface WarRoomDashboardViewProps {
  onNavigateToView: (view: string) => void;
}

export const WarRoomDashboardView: React.FC<WarRoomDashboardViewProps> = ({ onNavigateToView }) => {
  const { showToast } = useToast();
  const [lastRefreshed, setLastRefreshed] = useState('Just now');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('Today');

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastRefreshed('Just now');
      showToast('War room metrics synchronized with field telemetry.', 'info');
    }, 600);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Top Banner / Breadcrumb & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Central War Room Command
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
              Sample Demo Dataset
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 mt-1">
            {CURRENT_ELECTION_CONTEXT.electionName}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Candidate: <strong className="text-slate-700">{CURRENT_ELECTION_CONTEXT.candidateName}</strong> • {CURRENT_ELECTION_CONTEXT.constituency}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Timeframe Filter */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600">
            {['Today', 'This Week', 'Full Campaign'].map((tf) => (
              <button
                key={tf}
                onClick={() => setSelectedTimeframe(tf)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  selectedTimeframe === tf ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
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
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
            title="Refresh Field Telemetry"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-brand-600' : ''}`} />
            <span>{isRefreshing ? 'Syncing...' : 'Refresh'}</span>
          </button>

          <span className="text-[11px] text-slate-400 hidden xl:inline">
            Updated: {lastRefreshed}
          </span>
        </div>
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

      {/* Primary KPI Metric Cards (8 core cards for full election coverage) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {/* Total Voters */}
        <div
          onClick={() => onNavigateToView('voters')}
          className="bg-white p-3.5 rounded-2xl border border-slate-200 hover:border-brand-300 hover:shadow-md cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Voters</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Vote className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-lg font-black text-slate-900">21.54 L</p>
          <div className="flex items-center gap-1 mt-1 text-[10px] text-emerald-600 font-semibold truncate">
            <TrendingUp className="w-3 h-3 shrink-0" />
            <span>ECI Verified</span>
          </div>
        </div>

        {/* Polling Booths */}
        <div
          onClick={() => onNavigateToView('dashboard')}
          className="bg-white p-3.5 rounded-2xl border border-slate-200 hover:border-brand-300 hover:shadow-md cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Booths</span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <MapPin className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-lg font-black text-slate-900">2,045</p>
          <div className="text-[10px] text-slate-500 font-medium truncate mt-1">
            <span>8 Wards Active</span>
          </div>
        </div>

        {/* Party Cadre / Members */}
        <div
          onClick={() => onNavigateToView('users-members')}
          className="bg-white p-3.5 rounded-2xl border border-slate-200 hover:border-brand-300 hover:shadow-md cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Party Members</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Award className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-lg font-black text-slate-900">34,200</p>
          <div className="flex items-center gap-1 mt-1 text-[10px] text-indigo-600 font-semibold truncate">
            <span>Primary Cadre</span>
          </div>
        </div>

        {/* Active Karyakartas */}
        <div
          onClick={() => onNavigateToView('users-members')}
          className="bg-white p-3.5 rounded-2xl border border-slate-200 hover:border-brand-300 hover:shadow-md cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Karyakartas</span>
            <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-lg font-black text-slate-900">4,850</p>
          <div className="flex items-center gap-1 mt-1 text-[10px] text-emerald-600 font-semibold truncate">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
            <span>3,120 On Field</span>
          </div>
        </div>

        {/* BLO Officers */}
        <div
          onClick={() => onNavigateToView('blo')}
          className="bg-white p-3.5 rounded-2xl border border-slate-200 hover:border-brand-300 hover:shadow-md cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ECI BLOs</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ShieldAlert className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-lg font-black text-slate-900">2,045</p>
          <div className="flex items-center gap-1 mt-1 text-[10px] text-emerald-600 font-semibold truncate">
            <span>98.4% Verified</span>
          </div>
        </div>

        {/* Survey Coverage */}
        <div
          onClick={() => onNavigateToView('voters')}
          className="bg-white p-3.5 rounded-2xl border border-slate-200 hover:border-brand-300 hover:shadow-md cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Coverage</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-lg font-black text-slate-900">78.2%</p>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: '78.2%' }}></div>
          </div>
        </div>

        {/* Slips Distributed */}
        <div
          onClick={() => onNavigateToView('voters')}
          className="bg-white p-3.5 rounded-2xl border border-slate-200 hover:border-brand-300 hover:shadow-md cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Slips Deliv.</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Printer className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-lg font-black text-slate-900">84.6%</p>
          <div className="flex items-center gap-1 mt-1 text-[10px] text-indigo-600 font-semibold truncate">
            <span>18.2 L Handed</span>
          </div>
        </div>

        {/* Open Public Issues */}
        <div
          onClick={() => onNavigateToView('office')}
          className="bg-white p-3.5 rounded-2xl border border-slate-200 hover:border-brand-300 hover:shadow-md cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Open Issues</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Building2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-lg font-black text-slate-900">42</p>
          <div className="flex items-center gap-1 mt-1 text-[10px] text-emerald-600 font-semibold truncate">
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
                <MapPin className="w-4 h-4 text-emerald-600" />
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
              <path d="M 50 180 Q 150 40 280 120 T 550 80" fill="none" stroke="#94a3b8" strokeWidth="6" strokeLinecap="round" />
              <path d="M 80 80 Q 200 220 380 90 T 580 190" fill="none" stroke="#cbd5e1" strokeWidth="4" strokeDasharray="6,6" />
              {/* Booth Polygons */}
              <polygon points="120,40 220,60 190,140 100,110" fill="rgba(37,99,235,0.08)" stroke="#3b82f6" strokeWidth="1.5" />
              <polygon points="230,70 340,50 360,150 250,160" fill="rgba(16,185,129,0.08)" stroke="#10b981" strokeWidth="1.5" />
              <polygon points="370,60 520,70 490,180 380,160" fill="rgba(245,158,11,0.08)" stroke="#f59e0b" strokeWidth="1.5" />
            </svg>

            {/* Simulated Live Karyakarta Markers */}
            <div className="absolute top-1/4 left-1/4 flex flex-col items-center">
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100 animate-ping"></span>
              <span className="mt-1 px-1.5 py-0.5 rounded bg-white text-[9px] font-bold text-slate-800 shadow-sm border border-slate-200">
                Pooja J. (Booth 101)
              </span>
            </div>

            <div className="absolute top-1/2 left-1/2 flex flex-col items-center">
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100 animate-ping"></span>
              <span className="mt-1 px-1.5 py-0.5 rounded bg-white text-[9px] font-bold text-slate-800 shadow-sm border border-slate-200">
                Ganesh P. (Booth 102)
              </span>
            </div>

            <div className="absolute bottom-1/4 right-1/4 flex flex-col items-center">
              <span className="w-3.5 h-3.5 rounded-full bg-amber-500 ring-4 ring-amber-100 animate-pulse"></span>
              <span className="mt-1 px-1.5 py-0.5 rounded bg-white text-[9px] font-bold text-slate-800 shadow-sm border border-slate-200">
                Vikas M. (Booth 104)
              </span>
            </div>

            <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-200 shadow-xs flex items-center gap-3 text-[10px]">
              <span className="flex items-center gap-1 font-semibold text-slate-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Active Karyakarta
              </span>
              <span className="flex items-center gap-1 font-semibold text-slate-700">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span> Swing Zone
              </span>
            </div>
          </div>
        </div>

        {/* Bot Intelligence & Demographic Highlights */}
        <div className="bg-gradient-to-br from-brand-900 via-brand-800 to-indigo-950 rounded-2xl p-6 text-white shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-400 text-slate-900 flex items-center justify-center font-bold">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                  Indata AI Bot Insights
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white font-medium">
                Live Model
              </span>
            </div>

            <h4 className="text-sm font-bold text-white mb-2">
              Key Opportunity: Ladki Bahin Yojana Sentiment Lift
            </h4>
            <p className="text-xs text-brand-100 leading-relaxed">
              Survey data indicates an 18.4% favorable sentiment swing among women voters in Wards 12 & 13 following direct benefit disbursements. Recommending dedicated women karyakarta squads for Booth 103 and 105.
            </p>

            <div className="mt-4 p-3 rounded-xl bg-white/10 border border-white/10 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-brand-200">Projected Pune Turnout:</span>
                <span className="font-bold text-amber-300">68.4% (Target: 72%)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-brand-200">Strong Supporter Base:</span>
                <span className="font-bold text-emerald-300">46.8% (+4.2%)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-brand-200">Undecided Swing Voters:</span>
                <span className="font-bold text-amber-300">18.5%</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigateToView('strategy')}
            className="mt-4 w-full py-2.5 px-4 bg-white hover:bg-slate-100 text-brand-900 font-bold rounded-xl text-xs transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <span>Open Strategy Bot Analytics</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Row 3: Booth Intelligence & Readiness Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Booth Intelligence & Readiness Matrix</h3>
            <p className="text-xs text-slate-500">
              Live status, grade ratings, BLO verification, and karyakarta staffing per polling station.
            </p>
          </div>
          <button
            onClick={() => onNavigateToView('voters')}
            className="text-xs text-brand-600 hover:text-brand-700 font-semibold flex items-center gap-1"
          >
            <span>Filter Total Voters by Booth</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold border-y border-slate-200 uppercase tracking-wider text-[11px]">
                <th className="py-3 px-3">Booth #</th>
                <th className="py-3 px-3">Polling Station Name & Locality</th>
                <th className="py-3 px-3">Voters</th>
                <th className="py-3 px-3">Grade</th>
                <th className="py-3 px-3">BLO Incharge</th>
                <th className="py-3 px-3">Karyakartas</th>
                <th className="py-3 px-3">Slip Delivery</th>
                <th className="py-3 px-3">Projected Turnout</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {MOCK_BOOTHS.map((b) => (
                <tr key={b.boothNumber} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-brand-700">
                    #{b.boothNumber}
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-semibold text-slate-900 block">{b.name}</span>
                    <span className="text-[11px] text-slate-500">{b.locality}</span>
                  </td>
                  <td className="py-3 px-3 font-semibold">{b.totalVoters.toLocaleString()}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded font-extrabold text-[10px] ${
                      b.grade === 'A'
                        ? 'bg-emerald-100 text-emerald-800'
                        : b.grade === 'B'
                        ? 'bg-blue-100 text-blue-800'
                        : b.grade === 'C'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
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
                            b.slipsDeliveredPercent >= 80 ? 'bg-emerald-500' : 'bg-amber-500'
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

      {/* Row 4: Campaign Outreach & Public Grievance Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Campaign Delivery Metrics */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Campaign Communication Channels</h3>
              <p className="text-xs text-slate-500">Live delivery throughput across automated voter broadcasts.</p>
            </div>
            <button
              onClick={() => onNavigateToView('campaigns')}
              className="text-xs font-semibold text-brand-600 hover:text-brand-700"
            >
              Manage Campaigns
            </button>
          </div>

          <div className="space-y-3.5">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-slate-700">WhatsApp Voter Slip Broadcast</span>
                <span className="font-bold text-slate-900">96% Delivered (4,320 / 4,500)</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '96%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-slate-700">Youth First-Time Voter SMS</span>
                <span className="font-bold text-slate-900">97% Delivered (7,950 / 8,200)</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full" style={{ width: '97%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-slate-700">AI Voice Outreach Calls</span>
                <span className="font-bold text-slate-900">87% Connected (10,450 / 12,000)</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-purple-500 h-full rounded-full" style={{ width: '87%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Public Demands & Office Grievances */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Top Public Demands & Office Tickets</h3>
              <p className="text-xs text-slate-500">Constituency grievances logged via Candidate Office Helpdesk.</p>
            </div>
            <button
              onClick={() => onNavigateToView('office')}
              className="text-xs font-semibold text-brand-600 hover:text-brand-700"
            >
              Open Ticket Desk
            </button>
          </div>

          <div className="space-y-3">
            {MOCK_TICKETS.slice(0, 3).map((t) => (
              <div key={t.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-brand-700">{t.id}</span>
                    <span className="font-bold text-slate-800">{t.category}</span>
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                      t.priority === 'CRITICAL' ? 'bg-rose-100 text-rose-700' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {t.priority}
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px] mt-1 line-clamp-1">{t.description}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                  t.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {t.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 5: Voter Intelligence & Demographic Visualizations */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <PieChart className="w-4 h-4 text-brand-600" />
              <h3 className="font-bold text-slate-900 text-sm">Voter Intelligence & Demographic Distribution</h3>
            </div>
            <p className="text-xs text-slate-500">
              Constituency voter segmentation across age cohorts, gender ratio, and social clusters.
            </p>
          </div>
          <button
            onClick={() => onNavigateToView('voters')}
            className="text-xs text-brand-600 hover:text-brand-700 font-semibold flex items-center gap-1"
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
                  <div className="bg-brand-500 h-full rounded-full" style={{ width: '18.5%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-0.5 text-[11px]">
                  <span className="font-medium text-slate-700">26 - 40 Yrs (Working Core)</span>
                  <span className="font-bold text-slate-900">8.23 L (38.2%)</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-teal-500 h-full rounded-full" style={{ width: '38.2%' }}></div>
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
                <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
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
                { name: 'Maratha Community', pct: '22.4%', color: 'bg-emerald-500' },
                { name: 'OBC Clusters (Mali, Vanjari, Dhangar)', pct: '14.5%', color: 'bg-teal-500' },
                { name: 'Brahmin Demographic', pct: '10.4%', color: 'bg-blue-500' },
                { name: 'SC (Neo-Buddhist & Matang)', pct: '9.2%', color: 'bg-purple-500' },
                { name: 'Muslim Community', pct: '6.6%', color: 'bg-indigo-500' },
                { name: 'Other Mixed Classifications', pct: '36.9%', color: 'bg-slate-400' }
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

      {/* Row 6: Data Quality Indicators & Electoral Roll Integrity */}
      <div className="bg-slate-900 text-slate-200 rounded-2xl p-5 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h3 className="font-bold text-white text-sm">Data Quality & Electoral Roll Integrity Metrics</h3>
            </div>
            <p className="text-xs text-slate-400">
              Audit status of voter contacts, photo rolls, geospatial coordinates, and duplicate indices.
            </p>
          </div>
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
            Roll Health: 96.2% Optimal
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="p-3 bg-white/5 rounded-xl border border-white/10">
            <span className="text-slate-400 text-[11px] block">Mobile Contact Seeding:</span>
            <span className="text-lg font-black text-white mt-0.5 block">89.4%</span>
            <div className="w-full bg-white/10 h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div className="bg-emerald-400 h-full rounded-full" style={{ width: '89.4%' }}></div>
            </div>
            <span className="text-[10px] text-emerald-400 mt-1 block">19.25 L reachable phones</span>
          </div>

          <div className="p-3 bg-white/5 rounded-xl border border-white/10">
            <span className="text-slate-400 text-[11px] block">ECI Photo Roll Clarity:</span>
            <span className="text-lg font-black text-white mt-0.5 block">98.1%</span>
            <div className="w-full bg-white/10 h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div className="bg-blue-400 h-full rounded-full" style={{ width: '98.1%' }}></div>
            </div>
            <span className="text-[10px] text-blue-400 mt-1 block">High-resolution ECI portraits</span>
          </div>

          <div className="p-3 bg-white/5 rounded-xl border border-white/10">
            <span className="text-slate-400 text-[11px] block">Geotagged Address Accuracy:</span>
            <span className="text-lg font-black text-white mt-0.5 block">94.7%</span>
            <div className="w-full bg-white/10 h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div className="bg-indigo-400 h-full rounded-full" style={{ width: '94.7%' }}></div>
            </div>
            <span className="text-[10px] text-indigo-400 mt-1 block">Matched to Prabhaag boundary</span>
          </div>

          <div className="p-3 bg-white/5 rounded-xl border border-white/10">
            <span className="text-slate-400 text-[11px] block">Duplicate Detection Index:</span>
            <span className="text-lg font-black text-white mt-0.5 block">0.3% (Low Risk)</span>
            <div className="w-full bg-white/10 h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div className="bg-emerald-400 h-full rounded-full" style={{ width: '99.7%' }}></div>
            </div>
            <span className="text-[10px] text-emerald-400 mt-1 block">Cross-booth deduplicated</span>
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
                    <td className="py-2.5 px-3 font-mono font-bold text-emerald-600">{k.voterSlipsDelivered}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        k.isOnline ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
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
                <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
                <h3 className="font-bold text-slate-900 text-sm">Live War Room Activity Stream</h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
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
                        act.type === 'SURVEY' ? 'bg-emerald-100 text-emerald-800' :
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
