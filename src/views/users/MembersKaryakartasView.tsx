import React, { useState } from 'react';
import {
  Users,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Phone,
  MapPin,
  TrendingUp,
  Printer,
  Shield,
  Filter
} from 'lucide-react';
import { MOCK_KARYAKARTAS } from '../../data/mockData';
import { Karyakarta } from '../../types';
import { useToast } from '../../components/common/Toast';

export const MembersKaryakartasView: React.FC = () => {
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [karyakartasList, setKaryakartasList] = useState<Karyakarta[]>(MOCK_KARYAKARTAS);

  const filteredKaryakartas = karyakartasList.filter((k) => {
    const matchSearch =
      k.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      k.phone.includes(searchTerm) ||
      k.prabhaag.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || k.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleApprove = (id: string, name: string) => {
    setKaryakartasList((prev) =>
      prev.map((k) => (k.id === id ? { ...k, status: 'APPROVED' } : k))
    );
    showToast(`Karyakarta ${name} approved and granted mobile app access.`, 'success');
  };

  const handleReject = (id: string, name: string) => {
    setKaryakartasList((prev) =>
      prev.map((k) => (k.id === id ? { ...k, status: 'REJECTED' } : k))
    );
    showToast(`Registration request for ${name} rejected.`, 'error');
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Field Cadre Directory
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Grassroots Mobilizers
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 mt-1">
            Members & Karyakartas Roster
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor ground surveys completed, voter slips delivered, and approve new karyakarta signups.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-xl bg-slate-100 text-xs font-semibold text-slate-700">
            Total Cadre: {karyakartasList.length}
          </span>
          <span className="px-3 py-1 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold">
            Pending Approval: {karyakartasList.filter(k => k.status === 'PENDING').length}
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search karyakarta name, phone, or ward..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500 focus:bg-white"
          />
        </div>

        <div className="w-full sm:w-52">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:ring-2 focus:ring-brand-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="APPROVED">Approved Active</option>
            <option value="PENDING">Pending Verification</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Karyakarta Name</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Prabhaag & Assigned Booth</th>
                <th className="py-3 px-4">Surveys Done</th>
                <th className="py-3 px-4">Slips Delivered</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Approval Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredKaryakartas.map((k) => (
                <tr key={k.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs shrink-0">
                        {k.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block">{k.name}</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className={`w-2 h-2 rounded-full ${k.isOnline ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                          <span className="text-[10px] text-slate-400">{k.isOnline ? 'Online on Field' : 'Offline'}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono font-medium">{k.phone}</td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 block">Booth #{k.assignedBooth}</span>
                    <span className="text-[11px] text-slate-500">{k.prabhaag}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5 font-bold text-slate-800">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{k.surveysCompleted}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5 font-bold text-slate-800">
                      <Printer className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{k.voterSlipsDelivered}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      k.status === 'APPROVED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : k.status === 'PENDING'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {k.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {k.status === 'PENDING' ? (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleApprove(k.id, k.name)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition-colors shadow-xs"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(k.id, k.name)}
                          className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-lg text-xs transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-medium">Verified Cadre</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
