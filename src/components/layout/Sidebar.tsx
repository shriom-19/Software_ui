import React, { useState } from 'react';
import {
  LayoutDashboard,
  CreditCard,
  Users,
  Filter,
  Vote,
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

interface SidebarItemProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  activeView: string;
  isCollapsed: boolean;
  onClick: () => void;
  badge?: React.ReactNode;
  pulseDot?: boolean;
}

const SidebarNavItem: React.FC<SidebarItemProps> = ({
  id,
  label,
  icon,
  activeView,
  isCollapsed,
  onClick,
  badge,
  pulseDot
}) => {
  const isActive = activeView === id;
  return (
    <div className="relative group">
      <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 py-2.5 rounded-xl text-xs font-semibold transition-all btn-tactile ${
          isCollapsed ? 'justify-center px-0' : 'px-3'
        } ${
          isActive
            ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30 border-l-4 border-blue-400 font-bold'
            : 'text-slate-300 hover:text-white hover:bg-slate-800/80 font-medium'
        }`}
        title={isCollapsed ? label : undefined}
      >
        <span className="shrink-0">{icon}</span>
        {!isCollapsed && (
          <div className="flex-1 flex items-center justify-between text-left truncate">
            <span className="truncate">{label}</span>
            {pulseDot && <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shrink-0"></span>}
            {badge}
          </div>
        )}
      </button>

      {/* Floating tooltip when sidebar is collapsed */}
      {isCollapsed && (
        <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-slate-900 border border-slate-700/80 text-white text-xs font-semibold rounded-lg shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all whitespace-nowrap z-50">
          {label}
        </div>
      )}
    </div>
  );
};

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
      className={`bg-slate-950 text-slate-300 flex flex-col h-screen sticky top-0 transition-all duration-300 z-40 select-none border-r border-slate-900 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-slate-900/80 bg-slate-950">
        {!isCollapsed ? (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 font-black text-sm tracking-wide">
              IN
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-white block leading-tight flex items-center gap-1.5">
                INDATA
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
              </span>
              <span className="text-[10px] font-bold bg-gradient-to-r from-amber-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent tracking-wider uppercase block">
                Candidate Portal
              </span>
            </div>
          </div>
        ) : (
          <div className="w-10 h-10 mx-auto rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white font-black shadow-lg shadow-indigo-500/20 text-sm">
            IN
          </div>
        )}

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors hidden md:block btn-tactile"
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
            <SidebarNavItem
              id="dashboard"
              label="War Room Dashboard"
              icon={<LayoutDashboard className="w-4 h-4 shrink-0 text-brand-400" />}
              activeView={activeView}
              isCollapsed={isCollapsed}
              onClick={() => setActiveView('dashboard')}
            />

            <SidebarNavItem
              id="map"
              label="Live Field Map"
              icon={<MapPin className="w-4 h-4 shrink-0 text-cyan-400" />}
              activeView={activeView}
              isCollapsed={isCollapsed}
              onClick={() => setActiveView('map')}
              pulseDot={true}
            />

            <SidebarNavItem
              id="office"
              label="Office & Issues"
              icon={<Building2 className="w-4 h-4 shrink-0 text-amber-400" />}
              activeView={activeView}
              isCollapsed={isCollapsed}
              onClick={() => setActiveView('office')}
              badge={
                openIssuesCount > 0 ? (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    {openIssuesCount}
                  </span>
                ) : undefined
              }
            />
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
            <SidebarNavItem
              id="voters"
              label="Total Voters"
              icon={<Vote className="w-4 h-4 shrink-0 text-cyan-400" />}
              activeView={activeView}
              isCollapsed={isCollapsed}
              onClick={() => setActiveView('voters')}
            />

            <SidebarNavItem
              id="phonebook"
              label="Phone Book"
              icon={<Contact className="w-4 h-4 shrink-0 text-purple-400" />}
              activeView={activeView}
              isCollapsed={isCollapsed}
              onClick={() => setActiveView('phonebook')}
            />

            <SidebarNavItem
              id="filters"
              label="Filters"
              icon={<Filter className="w-4 h-4 shrink-0 text-indigo-400" />}
              activeView={activeView}
              isCollapsed={isCollapsed}
              onClick={() => setActiveView('filters')}
            />
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
            <div className="relative group">
              <button
                onClick={() => {
                  if (isCollapsed) {
                    setIsCollapsed(false);
                  }
                  setIsUsersOpen(!isUsersOpen);
                }}
                className={`w-full flex items-center justify-between py-2.5 rounded-xl text-xs font-semibold transition-all btn-tactile ${
                  isCollapsed ? 'justify-center px-0' : 'px-3'
                } ${
                  activeView.startsWith('users')
                    ? 'text-white bg-slate-800 border-l-4 border-blue-400 font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80 font-medium'
                }`}
                title={isCollapsed ? "Users & Karyakarta" : undefined}
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

              {/* Floating tooltip when sidebar is collapsed */}
              {isCollapsed && (
                <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-slate-900 border border-slate-700/80 text-white text-xs font-semibold rounded-lg shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all whitespace-nowrap z-50">
                  Users & Karyakarta
                </div>
              )}

              {/* Sub-menu items */}
              {!isCollapsed && isUsersOpen && (
                <div className="pl-9 pr-2 py-1 space-y-1 border-l border-slate-800 ml-4 my-1">
                  <button
                    onClick={() => setActiveView('users-dashboard')}
                    className={`w-full text-left py-1.5 px-2 rounded-lg text-xs btn-tactile ${
                      activeView === 'users-dashboard' ? 'text-white font-bold bg-slate-800' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    User Dashboard
                  </button>
                  <button
                    onClick={() => setActiveView('users-all')}
                    className={`w-full text-left py-1.5 px-2 rounded-lg text-xs btn-tactile ${
                      activeView === 'users-all' ? 'text-white font-bold bg-slate-800' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    All Users
                  </button>
                  <button
                    onClick={() => setActiveView('users-add')}
                    className={`w-full text-left py-1.5 px-2 rounded-lg text-xs btn-tactile ${
                      activeView === 'users-add' ? 'text-white font-bold bg-slate-800' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    + Add User
                  </button>
                  <button
                    onClick={() => setActiveView('users-members')}
                    className={`w-full text-left py-1.5 px-2 rounded-lg text-xs btn-tactile ${
                      activeView === 'users-members' ? 'text-white font-bold bg-slate-800' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Members / Karyakartas
                  </button>
                  <button
                    onClick={() => setActiveView('users-requests')}
                    className={`w-full flex items-center justify-between py-1.5 px-2 rounded-lg text-xs btn-tactile ${
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

            <SidebarNavItem
              id="blo"
              label="BLO Information"
              icon={<ShieldAlert className="w-4 h-4 shrink-0 text-sky-400" />}
              activeView={activeView}
              isCollapsed={isCollapsed}
              onClick={() => setActiveView('blo')}
            />

            <SidebarNavItem
              id="audit"
              label="User Activities"
              icon={<Activity className="w-4 h-4 shrink-0 text-sky-400" />}
              activeView={activeView}
              isCollapsed={isCollapsed}
              onClick={() => setActiveView('audit')}
            />
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
            <SidebarNavItem
              id="campaigns"
              label="Campaign Control"
              icon={<Megaphone className="w-4 h-4 shrink-0 text-rose-400" />}
              activeView={activeView}
              isCollapsed={isCollapsed}
              onClick={() => setActiveView('campaigns')}
            />

            <SidebarNavItem
              id="subscription"
              label="Subscription Plans"
              icon={<CreditCard className="w-4 h-4 shrink-0 text-amber-400" />}
              activeView={activeView}
              isCollapsed={isCollapsed}
              onClick={() => setActiveView('subscription')}
            />
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
            <SidebarNavItem
              id="reports"
              label="Reports"
              icon={<FileBarChart2 className="w-4 h-4 shrink-0 text-violet-400" />}
              activeView={activeView}
              isCollapsed={isCollapsed}
              onClick={() => setActiveView('reports')}
            />

            <SidebarNavItem
              id="strategy"
              label="Previous Election & Strategy"
              icon={<History className="w-4 h-4 shrink-0 text-fuchsia-400" />}
              activeView={activeView}
              isCollapsed={isCollapsed}
              onClick={() => setActiveView('strategy')}
            />
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
            <SidebarNavItem
              id="settings"
              label="Profile & Party Settings"
              icon={<Settings className="w-4 h-4 shrink-0 text-slate-400" />}
              activeView={activeView}
              isCollapsed={isCollapsed}
              onClick={() => setActiveView('settings')}
            />

            <div className="relative group">
              <button
                onClick={onOpenLogout}
                className={`w-full flex items-center gap-3 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition-colors btn-tactile ${
                  isCollapsed ? 'justify-center px-0' : 'px-3'
                }`}
                title={isCollapsed ? "Logout" : undefined}
              >
                <LogOut className="w-4 h-4 shrink-0 text-rose-400" />
                {!isCollapsed && <span>Logout</span>}
              </button>
              {isCollapsed && (
                <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-rose-950 border border-rose-800 text-rose-200 text-xs font-semibold rounded-lg shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all whitespace-nowrap z-50">
                  Logout
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>

      {/* Footer User Info */}
      <div className={`p-3 border-t border-slate-900 bg-slate-950/60 ${isCollapsed ? 'flex justify-center' : 'flex items-center gap-3'}`}>
        <div className="relative">
          <div className="w-8 h-8 rounded-full bg-brand-700 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
            VP
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-950 absolute -bottom-0.5 -right-0.5"></span>
        </div>
        {!isCollapsed && (
          <div className="flex-1 truncate">
            <p className="text-xs font-bold text-white truncate">Adv. Vikram Patil</p>
            <p className="text-[10px] text-slate-400 truncate">Pune Constituency</p>
          </div>
        )}
      </div>
    </aside>
  );
};
