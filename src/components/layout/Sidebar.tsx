import React, { useState } from 'react';
import {
  LayoutDashboard,
  CreditCard,
  Users,
  Filter,
  Vote,
  UserCheck,
  Contact,
  FileBarChart2,
  Building2,
  Megaphone,
  History,
  ShieldAlert,
  Activity,
  MapPin,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Award
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  onOpenLogout: () => void;
  pendingRequestsCount?: number;
  openIssuesCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  setActiveView,
  isCollapsed,
  setIsCollapsed,
  onOpenLogout,
  pendingRequestsCount = 3,
  openIssuesCount = 2
}) => {
  // Users sub-menu accordion state
  const [isUsersOpen, setIsUsersOpen] = useState(
    activeView.startsWith('users')
  );

  return (
    <aside
      className={`bg-slate-900 text-slate-300 flex flex-col h-screen sticky top-0 transition-all duration-300 z-40 select-none ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800 bg-slate-950/60">
        {!isCollapsed ? (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md font-extrabold text-lg">
              IN
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-white block leading-tight">
                INDATA
              </span>
              <span className="text-[10px] font-semibold text-brand-400 tracking-wider uppercase block">
                Candidate Admin
              </span>
            </div>
          </div>
        ) : (
          <div className="w-10 h-10 mx-auto rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white font-extrabold shadow-md">
            IN
          </div>
        )}

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors hidden md:block"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin">
        {/* Core Operations Group */}
        <div>
          {!isCollapsed && (
            <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Core Operations
            </p>
          )}
          <nav className="space-y-1">
            <button
              onClick={() => setActiveView('dashboard')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeView === 'dashboard'
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
              title="War Room Dashboard"
            >
              <LayoutDashboard className="w-4 h-4 shrink-0 text-brand-400" />
              {!isCollapsed && <span>War Room Dashboard</span>}
            </button>

            <button
              onClick={() => setActiveView('map')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeView === 'map'
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
              title="Live Field Map"
            >
              <MapPin className="w-4 h-4 shrink-0 text-emerald-400" />
              {!isCollapsed && (
                <div className="flex-1 flex items-center justify-between">
                  <span>Live Field Map</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                </div>
              )}
            </button>

            <button
              onClick={() => setActiveView('office')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeView === 'office'
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
              title="Office & Issues"
            >
              <Building2 className="w-4 h-4 shrink-0 text-amber-400" />
              {!isCollapsed && (
                <div className="flex-1 flex items-center justify-between">
                  <span>Office & Issues</span>
                  {openIssuesCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      {openIssuesCount}
                    </span>
                  )}
                </div>
              )}
            </button>
          </nav>
        </div>

        {/* Voter Intelligence Group */}
        <div>
          {!isCollapsed && (
            <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Voter Intelligence
            </p>
          )}
          <nav className="space-y-1">
            <button
              onClick={() => setActiveView('voters')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeView === 'voters'
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
              title="Total Voters"
            >
              <Vote className="w-4 h-4 shrink-0 text-cyan-400" />
              {!isCollapsed && <span>Total Voters</span>}
            </button>

            <button
              onClick={() => setActiveView('central-profile')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeView === 'central-profile'
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
              title="Central Voter Profile"
            >
              <UserCheck className="w-4 h-4 shrink-0 text-blue-400" />
              {!isCollapsed && <span>Central Voter Profile</span>}
            </button>

            <button
              onClick={() => setActiveView('phonebook')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeView === 'phonebook'
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
              title="Phone Book"
            >
              <Contact className="w-4 h-4 shrink-0 text-purple-400" />
              {!isCollapsed && <span>Phone Book</span>}
            </button>

            <button
              onClick={() => setActiveView('filters')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeView === 'filters'
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
              title="Filters"
            >
              <Filter className="w-4 h-4 shrink-0 text-indigo-400" />
              {!isCollapsed && <span>Filters</span>}
            </button>
          </nav>
        </div>

        {/* Workforce & Field Group */}
        <div>
          {!isCollapsed && (
            <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Workforce & Team
            </p>
          )}
          <nav className="space-y-1">
            {/* Users Accordion */}
            <div>
              <button
                onClick={() => {
                  if (isCollapsed) {
                    setIsCollapsed(false);
                  }
                  setIsUsersOpen(!isUsersOpen);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeView.startsWith('users')
                    ? 'text-white bg-slate-800'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
                title="Users & Karyakarta"
              >
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 shrink-0 text-teal-400" />
                  {!isCollapsed && <span>Users</span>}
                </div>
                {!isCollapsed && (
                  <div className="flex items-center gap-1.5">
                    {pendingRequestsCount > 0 && (
                      <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                    )}
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isUsersOpen ? 'rotate-180' : ''}`} />
                  </div>
                )}
              </button>

              {/* Sub-menu items */}
              {!isCollapsed && isUsersOpen && (
                <div className="pl-9 pr-2 py-1 space-y-1 border-l border-slate-800 ml-4 my-1">
                  <button
                    onClick={() => setActiveView('users-dashboard')}
                    className={`w-full text-left py-1.5 px-2 rounded-lg text-xs ${
                      activeView === 'users-dashboard' ? 'text-white font-bold bg-slate-800' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    User Dashboard
                  </button>
                  <button
                    onClick={() => setActiveView('users-all')}
                    className={`w-full text-left py-1.5 px-2 rounded-lg text-xs ${
                      activeView === 'users-all' ? 'text-white font-bold bg-slate-800' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    All Users
                  </button>
                  <button
                    onClick={() => setActiveView('users-add')}
                    className={`w-full text-left py-1.5 px-2 rounded-lg text-xs ${
                      activeView === 'users-add' ? 'text-white font-bold bg-slate-800' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    + Add User
                  </button>
                  <button
                    onClick={() => setActiveView('users-members')}
                    className={`w-full text-left py-1.5 px-2 rounded-lg text-xs ${
                      activeView === 'users-members' ? 'text-white font-bold bg-slate-800' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Members / Karyakartas
                  </button>
                  <button
                    onClick={() => setActiveView('users-requests')}
                    className={`w-full flex items-center justify-between py-1.5 px-2 rounded-lg text-xs ${
                      activeView === 'users-requests' ? 'text-white font-bold bg-slate-800' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>Update Requests</span>
                    {pendingRequestsCount > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        {pendingRequestsCount}
                      </span>
                    )}
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => setActiveView('blo')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeView === 'blo'
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
              title="BLO Information"
            >
              <ShieldAlert className="w-4 h-4 shrink-0 text-emerald-400" />
              {!isCollapsed && <span>BLO Information</span>}
            </button>

            <button
              onClick={() => setActiveView('audit')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeView === 'audit'
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
              title="User Activities"
            >
              <Activity className="w-4 h-4 shrink-0 text-sky-400" />
              {!isCollapsed && <span>User Activities</span>}
            </button>
          </nav>
        </div>

        {/* Campaign & Outreach Group */}
        <div>
          {!isCollapsed && (
            <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Campaign & Plans
            </p>
          )}
          <nav className="space-y-1">
            <button
              onClick={() => setActiveView('campaigns')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeView === 'campaigns'
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
              title="Campaign Control"
            >
              <Megaphone className="w-4 h-4 shrink-0 text-rose-400" />
              {!isCollapsed && <span>Campaign Control</span>}
            </button>

            <button
              onClick={() => setActiveView('subscription')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeView === 'subscription'
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
              title="Subscription Plans"
            >
              <CreditCard className="w-4 h-4 shrink-0 text-amber-400" />
              {!isCollapsed && <span>Subscription Plans</span>}
            </button>
          </nav>
        </div>

        {/* Analytics & Strategy Group */}
        <div>
          {!isCollapsed && (
            <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Analytics & Strategy
            </p>
          )}
          <nav className="space-y-1">
            <button
              onClick={() => setActiveView('reports')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeView === 'reports'
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
              title="Reports"
            >
              <FileBarChart2 className="w-4 h-4 shrink-0 text-violet-400" />
              {!isCollapsed && <span>Reports</span>}
            </button>

            <button
              onClick={() => setActiveView('strategy')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeView === 'strategy'
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
              title="Previous Election & Strategy"
            >
              <History className="w-4 h-4 shrink-0 text-fuchsia-400" />
              {!isCollapsed && <span>Previous Election & Strategy</span>}
            </button>
          </nav>
        </div>

        {/* Administration Group */}
        <div>
          {!isCollapsed && (
            <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Administration
            </p>
          )}
          <nav className="space-y-1">
            <button
              onClick={() => setActiveView('settings')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeView === 'settings'
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
              title="Profile & Party Settings"
            >
              <Settings className="w-4 h-4 shrink-0 text-slate-400" />
              {!isCollapsed && <span>Profile & Party Settings</span>}
            </button>

            <button
              onClick={onOpenLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4 shrink-0 text-rose-400" />
              {!isCollapsed && <span>Logout</span>}
            </button>
          </nav>
        </div>
      </div>

      {/* Footer User Info */}
      {!isCollapsed && (
        <div className="p-3 border-t border-slate-800 bg-slate-950/40 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-brand-700 text-white flex items-center justify-center font-bold text-xs shrink-0">
            VP
          </div>
          <div className="flex-1 truncate">
            <p className="text-xs font-bold text-white truncate">Adv. Vikram Patil</p>
            <p className="text-[10px] text-slate-400 truncate">Pune Constituency</p>
          </div>
        </div>
      )}
    </aside>
  );
};
