import React, { useState } from 'react';
import { Search, UserPlus, Filter, Shield, Phone, Mail, Edit3, Trash2, CheckCircle, XCircle, X, Check, Save, User as UserIcon, Lock, Key, Layers, MapPin } from 'lucide-react';
import { MOCK_USERS, MOCK_BOOTHS } from '../../data/mockData';
import { User, Role } from '../../types';
import { useToast } from '../../components/common/Toast';

interface AllUsersViewProps {
  onNavigateToAddUser: () => void;
  onSelectUser: (user: User) => void;
}

export const AllUsersView: React.FC<AllUsersViewProps> = ({
  onNavigateToAddUser,
  onSelectUser
}) => {
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [usersList, setUsersList] = useState<User[]>(MOCK_USERS);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const filteredUsers = usersList.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.phone.includes(searchTerm);
    const matchRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const toggleUserStatus = (id: string) => {
    setUsersList((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const newStatus = u.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
          showToast(`User ${u.name} status updated to ${newStatus}`, 'info');
          return { ...u, status: newStatus as any };
        }
        return u;
      })
    );
  };

  const handleSaveUserEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setUsersList((prev) => prev.map((u) => (u.id === editingUser.id ? editingUser : u)));
    showToast(`User settings for ${editingUser.name} saved successfully.`, 'success');
    setEditingUser(null);
  };

  const userStats = {
    total: usersList.length,
    admins: usersList.filter(u => u.role === 'CANDIDATE_ADMIN').length,
    incharges: usersList.filter(u => u.role === 'PRABHAAG_INCHARGE').length,
    karyakartas: usersList.filter(u => u.role === 'KARYAKARTA').length,
    operators: usersList.filter(u => u.role === 'DATA_OPERATOR').length
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              System Administration
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-brand-700 border border-brand-200">
              Access Governance
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 mt-1">
            All Portal Users
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage administrative credentials, role hierarchies, assigned booths, and module rights.
          </p>
        </div>

        <button
          onClick={onNavigateToAddUser}
          className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs transition-colors shadow-xs"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ Add New User</span>
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 text-xs">
          <span className="text-slate-400 font-bold uppercase text-[10px] block">Total Users</span>
          <span className="text-xl font-black text-slate-900 mt-0.5 block">{userStats.total}</span>
          <span className="text-[10px] text-brand-600 font-semibold">Active Directory</span>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 text-xs">
          <span className="text-slate-400 font-bold uppercase text-[10px] block">Candidate Admins</span>
          <span className="text-xl font-black text-slate-900 mt-0.5 block">{userStats.admins}</span>
          <span className="text-[10px] text-indigo-600 font-semibold">Full Privileges</span>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 text-xs">
          <span className="text-slate-400 font-bold uppercase text-[10px] block">Prabhaag Incharges</span>
          <span className="text-xl font-black text-slate-900 mt-0.5 block">{userStats.incharges}</span>
          <span className="text-[10px] text-teal-600 font-semibold">Ward Supervisors</span>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 text-xs">
          <span className="text-slate-400 font-bold uppercase text-[10px] block">Karyakartas</span>
          <span className="text-xl font-black text-slate-900 mt-0.5 block">{userStats.karyakartas}</span>
          <span className="text-[10px] text-emerald-600 font-semibold">Field Operators</span>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 text-xs">
          <span className="text-slate-400 font-bold uppercase text-[10px] block">Data Operators</span>
          <span className="text-xl font-black text-slate-900 mt-0.5 block">{userStats.operators}</span>
          <span className="text-[10px] text-amber-600 font-semibold">Roll Viewers</span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email, or mobile..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500 focus:bg-white"
          />
        </div>

        <div className="w-full sm:w-60">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:ring-2 focus:ring-brand-500"
          >
            <option value="ALL">All Roles</option>
            <option value="CANDIDATE_ADMIN">Candidate Admin</option>
            <option value="WAR_ROOM_HEAD">War Room Head</option>
            <option value="PRABHAAG_INCHARGE">Prabhaag Incharge</option>
            <option value="KARYAKARTA">Karyakarta</option>
            <option value="DATA_OPERATOR">Data Operator</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Role & Jurisdiction</th>
                <th className="py-3 px-4">Assigned Booths</th>
                <th className="py-3 px-4">Permissions</th>
                <th className="py-3 px-4">Data Import</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                        {u.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block">{u.name}</span>
                        <span className="text-[11px] text-slate-500 font-mono">{u.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-brand-700 block">{u.role.replace('_', ' ')}</span>
                    <span className="text-[11px] text-slate-500">{u.prabhaag || 'All Constituencies'}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-mono font-medium text-slate-800">
                      {u.assignedBooths?.length ? `${u.assignedBooths.length} Booths (${u.assignedBooths.slice(0, 3).join(', ')}${u.assignedBooths.length > 3 ? '...' : ''})` : 'None'}
                    </span>
                    {u.voterSerialRange && (
                      <span className="text-[10px] text-slate-400 block">Sr: {u.voterSerialRange}</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold">
                      {u.modulePermissions.includes('ALL') ? 'All Modules (Unrestricted)' : `${u.modulePermissions.length} Modules`}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      u.canImportData ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {u.canImportData ? 'Allowed' : 'Restricted'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => toggleUserStatus(u.id)}
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-colors ${
                        u.status === 'ACTIVE'
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                      }`}
                    >
                      {u.status}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => {
                        setEditingUser({ ...u });
                        onSelectUser(u);
                      }}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-brand-50 text-slate-700 hover:text-brand-700 rounded-lg text-xs font-semibold transition-colors"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Profile & Edit Drawer Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-lg h-full shadow-2xl flex flex-col border-l border-slate-200 animate-slide-left">
            <div className="p-4 px-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-700 text-white flex items-center justify-center font-bold text-sm">
                  {editingUser.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{editingUser.name}</h3>
                  <span className="text-xs text-brand-600 font-semibold">{editingUser.role.replace('_', ' ')}</span>
                </div>
              </div>
              <button
                onClick={() => setEditingUser(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUserEdit} className="flex-1 p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={editingUser.name}
                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mobile Phone</label>
                  <input
                    type="tel"
                    required
                    value={editingUser.phone}
                    onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Assigned Role</label>
                  <select
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="CANDIDATE_ADMIN">Candidate Admin</option>
                    <option value="WAR_ROOM_HEAD">War Room Head</option>
                    <option value="PRABHAAG_INCHARGE">Prabhaag Incharge</option>
                    <option value="KARYAKARTA">Karyakarta</option>
                    <option value="DATA_OPERATOR">Data Operator</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Account Status</label>
                  <select
                    value={editingUser.status}
                    onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Prabhaag / Ward Jurisdiction</label>
                <input
                  type="text"
                  value={editingUser.prabhaag || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, prabhaag: e.target.value })}
                  placeholder="e.g. Prabhaag 12 - Kothrud West"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assigned Polling Booth Numbers (comma-separated)</label>
                <input
                  type="text"
                  value={editingUser.assignedBooths?.join(', ') || ''}
                  onChange={(e) => {
                    const booths = e.target.value.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
                    setEditingUser({ ...editingUser, assignedBooths: booths });
                  }}
                  placeholder="101, 102"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Voter Roll Serial Range</label>
                <input
                  type="text"
                  value={editingUser.voterSerialRange || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, voterSerialRange: e.target.value })}
                  placeholder="e.g. 1 to 500"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="pt-2 border-t border-slate-100">
                <label className="block font-semibold text-slate-700 mb-2">Data Import Policy</label>
                <label className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingUser.canImportData}
                    onChange={(e) => setEditingUser({ ...editingUser, canImportData: e.target.checked })}
                    className="rounded text-brand-600 focus:ring-brand-500"
                  />
                  <span className="font-medium text-slate-800">Allow Voter & Contact CSV Import Access</span>
                </label>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500 space-y-1">
                <p>User ID: <span className="font-mono text-slate-700">{editingUser.id}</span></p>
                <p>Last Active: {editingUser.lastActive || 'Today'}</p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl transition-colors shadow-sm flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
