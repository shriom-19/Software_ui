import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Sparkles,
  Bell,
  User as UserIcon,
  ChevronDown,
  LogOut,
  Settings,
  HelpCircle,
  MapPin,
  Check,
  CheckCircle2,
  Clock,
  Shield,
  Layers,
  ArrowRight,
  X
} from 'lucide-react';
import { CURRENT_ELECTION_CONTEXT, MOCK_VOTERS, MOCK_BOOTHS, MOCK_USERS, MOCK_TICKETS } from '../../data/mockData';

interface HeaderProps {
  activeView: string;
  setActiveView: (view: string) => void;
  onOpenAI: () => void;
  isAiLocked: boolean;
  onOpenLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  setActiveView,
  onOpenAI,
  isAiLocked,
  onOpenLogout
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showGeoDropdown, setShowGeoDropdown] = useState(false);
  const [selectedGeo, setSelectedGeo] = useState(CURRENT_ELECTION_CONTEXT.constituency);

  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Sample system notifications
  const [notifications, setNotifications] = useState([
    {
      id: 'n-1',
      title: 'Voter Slip Delivery Milestone',
      desc: 'Booth #101 has achieved 92% voter slip delivery threshold.',
      time: '12m ago',
      unread: true,
      type: 'success'
    },
    {
      id: 'n-2',
      title: 'New Citizen Grievance Logged',
      desc: 'Ticket #TKT-9210: Low water pressure in Dahanukar Colony.',
      time: '45m ago',
      unread: true,
      type: 'warning'
    },
    {
      id: 'n-3',
      title: 'Karyakarta Update Request',
      desc: 'Ganesh Patil submitted mobile number update.',
      time: '2h ago',
      unread: false,
      type: 'info'
    }
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  // Global search filtering across multiple entities
  const searchResults = searchQuery.trim() ? [
    ...MOCK_VOTERS.filter(v =>
      v.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.epicNumber.toLowerCase().includes(searchQuery.toLowerCase())
    ).map(v => ({
      type: 'Voter',
      title: v.fullName,
      subtitle: `EPIC: ${v.epicNumber} • Booth #${v.boothNumber}`,
      view: 'central-profile',
      id: v.id
    })),
    ...MOCK_BOOTHS.filter(b =>
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.boothNumber.toString().includes(searchQuery)
    ).map(b => ({
      type: 'Booth',
      title: `Booth #${b.boothNumber}: ${b.name}`,
      subtitle: `${b.locality} • ${b.totalVoters} Voters`,
      view: 'dashboard',
      id: b.boothNumber.toString()
    })),
    ...MOCK_USERS.filter(u =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.role.toLowerCase().includes(searchQuery.toLowerCase())
    ).map(u => ({
      type: 'User / Karyakarta',
      title: u.name,
      subtitle: `${u.role.replace('_', ' ')} • ${u.phone}`,
      view: 'users-all',
      id: u.id
    })),
    ...MOCK_TICKETS.filter(t =>
      t.visitorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase())
    ).map(t => ({
      type: 'Office Issue',
      title: `${t.id}: ${t.category}`,
      subtitle: `By ${t.visitorName} • Status: ${t.status}`,
      view: 'office',
      id: t.id
    }))
  ] : [];

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Left: Election Geography Context Dropdown */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <button
            onClick={() => setShowGeoDropdown(!showGeoDropdown)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-800 transition-colors"
          >
            <MapPin className="w-3.5 h-3.5 text-brand-600" />
            <span className="truncate max-w-[210px]">{selectedGeo}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showGeoDropdown && (
            <div className="absolute left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50 animate-scale-up">
              <div className="px-2 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Select Active Constituency
              </div>
              <button
                onClick={() => { setSelectedGeo("34 - Pune Parliamentary Constituency"); setShowGeoDropdown(false); }}
                className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-brand-50 hover:text-brand-700 font-medium flex items-center justify-between"
              >
                <span>34 - Pune (Lok Sabha)</span>
                {selectedGeo.includes("Pune") && <Check className="w-3.5 h-3.5 text-brand-600" />}
              </button>
              <button
                onClick={() => { setSelectedGeo("214 - Kothrud Assembly Segment"); setShowGeoDropdown(false); }}
                className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-brand-50 hover:text-brand-700 font-medium flex items-center justify-between"
              >
                <span>214 - Kothrud (Vidhan Sabha)</span>
                {selectedGeo.includes("Kothrud") && <Check className="w-3.5 h-3.5 text-brand-600" />}
              </button>
              <button
                onClick={() => { setSelectedGeo("215 - Shivajinagar Assembly Segment"); setShowGeoDropdown(false); }}
                className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-brand-50 hover:text-brand-700 font-medium flex items-center justify-between"
              >
                <span>215 - Shivajinagar (Vidhan Sabha)</span>
                {selectedGeo.includes("Shivajinagar") && <Check className="w-3.5 h-3.5 text-brand-600" />}
              </button>
            </div>
          )}
        </div>

        {/* Live sync pill */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>War Room Live</span>
        </div>
      </div>

      {/* Center: Global Search Bar */}
      <div ref={searchRef} className="flex-1 max-w-lg mx-6 relative">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Global search: voter name, EPIC ID, booth, phone, ticket..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchResults(true);
            }}
            onFocus={() => setShowSearchResults(true)}
            className="w-full pl-10 pr-8 py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-xs text-slate-800 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => { setSearchQuery(''); setShowSearchResults(false); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Global Search Results Dropdown */}
        {showSearchResults && searchQuery.trim() && (
          <div className="absolute left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-slate-200 max-h-96 overflow-y-auto z-50 p-2 animate-scale-up">
            <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex justify-between">
              <span>Matching Records ({searchResults.length})</span>
              <span>Press ESC to dismiss</span>
            </div>

            {searchResults.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-500">
                No matching records found for "{searchQuery}".
              </div>
            ) : (
              searchResults.map((res, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setActiveView(res.view);
                    setShowSearchResults(false);
                    setSearchQuery('');
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 flex items-center justify-between group transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 uppercase">
                        {res.type}
                      </span>
                      <span className="text-xs font-semibold text-slate-800 group-hover:text-brand-600">
                        {res.title}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{res.subtitle}</p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-brand-600 transition-colors" />
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* Right Controls: AI Mode, Notification Bell, User Menu */}
      <div className="flex items-center gap-3">
        {/* AI Mode Entry Point */}
        <button
          onClick={onOpenAI}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold shadow-xs transition-all ${
            isAiLocked
              ? 'bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100'
              : 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white hover:opacity-95'
          }`}
          title="Open Global AI Election Intelligence"
        >
          <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
          <span className="hidden sm:inline">AI Mode</span>
          {isAiLocked && (
            <span className="text-[10px] px-1.5 py-0.2 bg-amber-200 text-amber-800 rounded font-bold uppercase">
              Pro
            </span>
          )}
        </button>

        {/* Notifications Bell */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors relative"
            title="System Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-scale-up">
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <span className="font-bold text-xs text-slate-800">Notifications ({unreadCount} new)</span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-[11px] text-brand-600 hover:underline font-semibold"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.map((n) => (
                  <div key={n.id} className={`p-3 text-xs hover:bg-slate-50 transition-colors ${n.unread ? 'bg-brand-50/20' : ''}`}>
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="font-semibold text-slate-800">{n.title}</h4>
                      <span className="text-[10px] text-slate-400 shrink-0">{n.time}</span>
                    </div>
                    <p className="text-slate-500 text-[11px] mt-1">{n.desc}</p>
                  </div>
                ))}
              </div>
              <div className="p-2 border-t border-slate-100 text-center bg-slate-50">
                <button
                  onClick={() => { setActiveView('audit'); setShowNotifications(false); }}
                  className="text-xs text-brand-600 hover:underline font-medium"
                >
                  View full activity log
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-brand-700 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              VP
            </div>
            <div className="hidden md:block text-left">
              <span className="text-xs font-bold text-slate-800 block leading-tight">
                Adv. Vikram Patil
              </span>
              <span className="text-[10px] text-slate-500 font-medium block leading-tight">
                Candidate Admin
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-scale-up">
              <div className="px-3 py-2 border-b border-slate-100 mb-1">
                <p className="text-xs font-bold text-slate-800">{CURRENT_ELECTION_CONTEXT.candidateName}</p>
                <p className="text-[11px] text-brand-600 font-medium">{CURRENT_ELECTION_CONTEXT.partyName}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Role: Candidate Super Admin</p>
              </div>

              <button
                onClick={() => { setActiveView('settings'); setShowProfileMenu(false); }}
                className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-slate-50 text-slate-700 flex items-center gap-2 font-medium"
              >
                <Settings className="w-3.5 h-3.5 text-slate-400" />
                <span>Profile & Party Settings</span>
              </button>

              <button
                onClick={() => { setActiveView('subscription'); setShowProfileMenu(false); }}
                className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-slate-50 text-slate-700 flex items-center gap-2 font-medium"
              >
                <Layers className="w-3.5 h-3.5 text-slate-400" />
                <span>Subscription & Billing</span>
              </button>

              <div className="my-1 border-t border-slate-100"></div>

              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  onOpenLogout();
                }}
                className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-rose-50 text-rose-600 flex items-center gap-2 font-semibold"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-500" />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
