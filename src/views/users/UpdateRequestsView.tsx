import React, { useState } from 'react';
import { Clock, CheckCircle2, XCircle, ArrowRight, UserCheck, AlertCircle } from 'lucide-react';
import { MOCK_UPDATE_REQUESTS } from '../../data/mockData';
import { UpdateRequest } from '../../types';
import { useToast } from '../../components/common/Toast';

export const UpdateRequestsView: React.FC = () => {
  const { showToast } = useToast();
  const [requests, setRequests] = useState<UpdateRequest[]>(MOCK_UPDATE_REQUESTS);

  const handleApprove = (id: string, name: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'APPROVED' } : r))
    );
    showToast(`Approved update request for ${name}. Proposed changes committed to profile.`, 'success');
  };

  const handleReject = (id: string, name: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'REJECTED' } : r))
    );
    showToast(`Rejected update request for ${name}.`, 'error');
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Profile Governance
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
              Side-by-Side Review
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 mt-1">
            Karyakarta Profile Update Requests
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Compare existing system data against proposed field adjustments before authorizing changes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold">
            {requests.filter(r => r.status === 'PENDING').length} Pending Review
          </span>
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {requests.map((req) => (
          <div
            key={req.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs transition-all hover:border-slate-300"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-800 flex items-center justify-center font-bold text-xs">
                  {req.karyakartaName.split(' ').map(n => n[0]).slice(0, 2).join('')}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{req.karyakartaName}</h3>
                  <p className="text-[11px] text-slate-400">Request ID: {req.id} • Submitted: {req.requestedAt}</p>
                </div>
              </div>

              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase self-start sm:self-center ${
                req.status === 'PENDING'
                  ? 'bg-amber-100 text-amber-800'
                  : req.status === 'APPROVED'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-rose-100 text-rose-800'
              }`}>
                {req.status}
              </span>
            </div>

            <div className="mb-3">
              <span className="text-xs font-bold text-brand-800 bg-brand-50 px-2.5 py-1 rounded-lg">
                Field Targeted: {req.field}
              </span>
              <p className="text-xs text-slate-600 mt-2">
                <strong>Stated Justification:</strong> {req.reason}
              </p>
            </div>

            {/* Side-by-side comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block mb-1">
                  Existing Recorded Data
                </span>
                <p className="font-mono text-slate-800 font-bold text-sm bg-white p-2.5 rounded-lg border border-slate-200">
                  {req.currentValue}
                </p>
              </div>

              <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 text-xs">
                <span className="text-emerald-700 font-bold uppercase tracking-wider text-[10px] block mb-1">
                  Proposed Updated Data
                </span>
                <p className="font-mono text-emerald-950 font-bold text-sm bg-white p-2.5 rounded-lg border border-emerald-300">
                  {req.proposedValue}
                </p>
              </div>
            </div>

            {/* Action buttons */}
            {req.status === 'PENDING' && (
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  onClick={() => handleReject(req.id, req.karyakartaName)}
                  className="px-4 py-2 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 font-bold rounded-xl text-xs transition-colors"
                >
                  Reject Change
                </button>
                <button
                  onClick={() => handleApprove(req.id, req.karyakartaName)}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors shadow-xs"
                >
                  Approve & Commit Update
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
