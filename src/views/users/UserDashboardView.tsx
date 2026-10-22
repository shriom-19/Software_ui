import React from 'react';
import { Users, UserCheck, Clock, ShieldCheck, UserPlus, ArrowRight, Activity, CheckCircle2 } from 'lucide-react';
import { MOCK_USERS, MOCK_KARYAKARTAS, MOCK_UPDATE_REQUESTS } from '../../data/mockData';

interface UserDashboardViewProps {
  onNavigateToView: (view: string) => void;
}

export const UserDashboardView: React.FC<UserDashboardViewProps> = ({ onNavigateToView }) => {
  const pendingRequests = MOCK_UPDATE_REQUESTS.filter(r => r.status === 'PENDING').length;
  const pendingKaryakartas = MOCK_KARYAKARTAS.filter(k => k.status === 'PENDING').length;

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Workforce Intelligence
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
              Grassroots Cadre
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 mt-1">
            Users & Karyakarta Command
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Operational oversight across election war room staff, prabhaag coordinators, and field karyakartas.
          </p>
        </div>

        <button
          onClick={() => onNavigateToView('users-add')}
          className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs transition-colors shadow-xs"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ Add New User</span>
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          onClick={() => onNavigateToView('users-all')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-brand-300 hover:shadow-md cursor-pointer transition-all"
        >
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Users</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{MOCK_USERS.length}</p>
          <p className="text-[11px] text-slate-500 mt-1">Admins, in-charges & operators</p>
        </div>

        <div
          onClick={() => onNavigateToView('users-members')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-brand-300 hover:shadow-md cursor-pointer transition-all"
        >
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Field Karyakartas</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{MOCK_KARYAKARTAS.length}</p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">
            {MOCK_KARYAKARTAS.filter(k => k.isOnline).length} Active on Field now
          </p>
        </div>

        <div
          onClick={() => onNavigateToView('users-requests')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-brand-300 hover:shadow-md cursor-pointer transition-all"
        >
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Update Requests</span>
          <p className="text-2xl font-black text-amber-600 mt-1">{pendingRequests}</p>
          <p className="text-[11px] text-amber-600 font-semibold mt-1">Requires approval</p>
        </div>

        <div
          onClick={() => onNavigateToView('users-members')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-brand-300 hover:shadow-md cursor-pointer transition-all"
        >
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Pending Onboarding</span>
          <p className="text-2xl font-black text-purple-600 mt-1">{pendingKaryakartas}</p>
          <p className="text-[11px] text-purple-600 font-semibold mt-1">Awaiting registration clearance</p>
        </div>
      </div>

      {/* Role Breakdown & Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <h3 className="font-bold text-slate-900 text-sm mb-3">Role Distribution & Permissions</h3>
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <div>
                <span className="font-bold text-slate-900 block">Candidate Super Admin</span>
                <span className="text-slate-500 text-[11px]">Full platform sovereignty and export clearance</span>
              </div>
              <span className="font-bold text-brand-700 bg-brand-50 px-2 py-1 rounded">1 User</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <div>
                <span className="font-bold text-slate-900 block">War Room Head</span>
                <span className="text-slate-500 text-[11px]">Dashboard, campaign dispatch, and strategy bot access</span>
              </div>
              <span className="font-bold text-brand-700 bg-brand-50 px-2 py-1 rounded">1 User</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <div>
                <span className="font-bold text-slate-900 block">Prabhaag Incharges</span>
                <span className="text-slate-500 text-[11px]">Prabhaag ward coordination and ticket resolution</span>
              </div>
              <span className="font-bold text-brand-700 bg-brand-50 px-2 py-1 rounded">1 User</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <div>
                <span className="font-bold text-slate-900 block">Booth Karyakartas</span>
                <span className="text-slate-500 text-[11px]">Door-to-door survey, voter slips, and ground mobilization</span>
              </div>
              <span className="font-bold text-brand-700 bg-brand-50 px-2 py-1 rounded">6 Assigned</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm mb-2">Workforce Management Shortcuts</h3>
            <p className="text-xs text-slate-500 mb-4">Quick links to core team workflows.</p>

            <div className="space-y-2">
              <button
                onClick={() => onNavigateToView('users-members')}
                className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-brand-300 hover:bg-brand-50/30 flex items-center justify-between text-xs transition-colors"
              >
                <div>
                  <span className="font-bold text-slate-900 block">Review Karyakarta Roster</span>
                  <span className="text-slate-500 text-[11px]">Approve new signups & survey progress metrics</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => onNavigateToView('users-requests')}
                className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-brand-300 hover:bg-brand-50/30 flex items-center justify-between text-xs transition-colors"
              >
                <div>
                  <span className="font-bold text-slate-900 block">Inspect Profile Update Requests</span>
                  <span className="text-slate-500 text-[11px]">Side-by-side verification of phone, booth changes</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => onNavigateToView('users-add')}
                className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-brand-300 hover:bg-brand-50/30 flex items-center justify-between text-xs transition-colors"
              >
                <div>
                  <span className="font-bold text-slate-900 block">Provision New User Account</span>
                  <span className="text-slate-500 text-[11px]">Assign booth range and module permissions</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
