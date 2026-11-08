import React, { useState, useMemo } from 'react';
import {
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  UserCheck,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Check,
  X,
  FileText,
  User,
  MapPin,
  Phone,
  ShieldAlert,
  Calendar,
  Layers,
  ChevronRight,
  Database,
  ArrowUpDown,
  Download,
  AlertCircle
} from 'lucide-react';
import { MOCK_UPDATE_REQUESTS, MOCK_KARYAKARTAS } from '../../data/mockData';
import { UpdateRequest, UpdateFieldChange } from '../../types';
import { useToast } from '../../components/common/Toast';

export const UpdateRequestsView: React.FC = () => {
  const { showToast } = useToast();
  const [requests, setRequests] = useState<UpdateRequest[]>(MOCK_UPDATE_REQUESTS);
  const [activeTab, setActiveTab] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'SYNC_FAILED'>('ALL');
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWorker, setSelectedWorker] = useState<string>('ALL');
  const [selectedBooth, setSelectedBooth] = useState<string>('ALL');
  const [selectedFieldType, setSelectedFieldType] = useState<string>('ALL');
  const [dateFilter, setDateFilter] = useState<string>('ALL');

  // Selection & Bulk state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkRejectModalOpen, setIsBulkRejectModalOpen] = useState(false);
  const [bulkRejectionReason, setBulkRejectionReason] = useState('');
  const [isBulkApproveModalOpen, setIsBulkApproveModalOpen] = useState(false);

  // Single review drawer state
  const [reviewingRequest, setReviewingRequest] = useState<UpdateRequest | null>(null);
  const [singleRejectModalOpen, setSingleRejectModalOpen] = useState(false);
  const [singleRejectionReason, setSingleRejectionReason] = useState('');

  // Statistics calculation
  const stats = useMemo(() => {
    const total = requests.length;
    const pending = requests.filter(r => r.status === 'PENDING').length;
    const approved = requests.filter(r => r.status === 'APPROVED').length;
    const rejected = requests.filter(r => r.status === 'REJECTED').length;
    const failed = requests.filter(r => r.status === 'SYNC_FAILED').length;
    return { total, pending, approved, rejected, failed };
  }, [requests]);

  // Field Worker Summary calculation
  const workerSummaries = useMemo(() => {
    // Unique karyakartas from requests or MOCK_KARYAKARTAS
    const workerMap = new Map<string, {
      id: string;
      name: string;
      phone: string;
      assignedBooth: number;
      total: number;
      pending: number;
      approved: number;
      rejected: number;
      failed: number;
      lastDate: string;
    }>();

    // Seed with known Karyakartas
    MOCK_KARYAKARTAS.forEach(k => {
      workerMap.set(k.name, {
        id: k.id,
        name: k.name,
        phone: k.phone,
        assignedBooth: k.assignedBooth,
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
        failed: 0,
        lastDate: '—'
      });
    });

    // Accumulate requests
    requests.forEach(r => {
      let item = workerMap.get(r.karyakartaName);
      if (!item) {
        item = {
          id: r.karyakartaId,
          name: r.karyakartaName,
          phone: r.karyakartaPhone || '—',
          assignedBooth: r.boothNumber || 101,
          total: 0,
          pending: 0,
          approved: 0,
          rejected: 0,
          failed: 0,
          lastDate: r.requestedAt
        };
        workerMap.set(r.karyakartaName, item);
      }
      item.total += 1;
      if (r.status === 'PENDING') item.pending += 1;
      else if (r.status === 'APPROVED') item.approved += 1;
      else if (r.status === 'REJECTED') item.rejected += 1;
      else if (r.status === 'SYNC_FAILED') item.failed += 1;

      if (r.requestedAt > item.lastDate || item.lastDate === '—') {
        item.lastDate = r.requestedAt;
      }
    });

    return Array.from(workerMap.values()).filter(w => w.total > 0);
  }, [requests]);

  // Filtered requests
  const filteredRequests = useMemo(() => {
    return requests.filter(req => {
      // Tab filter
      if (activeTab !== 'ALL' && req.status !== activeTab) return false;

      // Karyakarta filter
      if (selectedWorker !== 'ALL' && req.karyakartaName !== selectedWorker) return false;

      // Booth filter
      if (selectedBooth !== 'ALL' && req.boothNumber !== Number(selectedBooth)) return false;

      // Field type filter
      if (selectedFieldType !== 'ALL') {
        const matchesField = req.updatedFields?.some(f => f.field.toLowerCase().includes(selectedFieldType.toLowerCase()) || f.label.toLowerCase().includes(selectedFieldType.toLowerCase()));
        if (!matchesField && !req.field?.toLowerCase().includes(selectedFieldType.toLowerCase())) {
          return false;
        }
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = req.voterName?.toLowerCase().includes(q);
        const matchesEpic = req.epicNumber?.toLowerCase().includes(q);
        const matchesId = req.id.toLowerCase().includes(q);
        const matchesWorker = req.karyakartaName.toLowerCase().includes(q);
        const matchesLocality = req.locality?.toLowerCase().includes(q);
        if (!matchesName && !matchesEpic && !matchesId && !matchesWorker && !matchesLocality) {
          return false;
        }
      }

      return true;
    });
  }, [requests, activeTab, selectedWorker, selectedBooth, selectedFieldType, searchQuery]);

  // Single Approve
  const handleApprove = (id: string, voterName?: string) => {
    setRequests(prev =>
      prev.map(r =>
        r.id === id
          ? {
              ...r,
              status: 'APPROVED',
              reviewedBy: 'Anand Shinde (Admin)',
              reviewedAt: new Date().toLocaleString()
            }
          : r
      )
    );
    if (reviewingRequest?.id === id) {
      setReviewingRequest(null);
    }
    showToast(`Approved update for ${voterName || 'voter'}. Synchronized into primary voter registry.`, 'success');
  };

  // Single Reject
  const handleRejectConfirm = () => {
    if (!reviewingRequest) return;
    if (!singleRejectionReason.trim()) {
      showToast('Please provide a reason for rejection.', 'error');
      return;
    }

    setRequests(prev =>
      prev.map(r =>
        r.id === reviewingRequest.id
          ? {
              ...r,
              status: 'REJECTED',
              rejectionReason: singleRejectionReason.trim(),
              reviewedBy: 'Anand Shinde (Admin)',
              reviewedAt: new Date().toLocaleString()
            }
          : r
      )
    );
    showToast(`Rejected update request ${reviewingRequest.id}.`, 'info');
    setSingleRejectModalOpen(false);
    setSingleRejectionReason('');
    setReviewingRequest(null);
  };

  // Retry Sync
  const handleRetrySync = (id: string) => {
    setRequests(prev =>
      prev.map(r =>
        r.id === id
          ? {
              ...r,
              status: 'APPROVED',
              reviewedBy: 'Anand Shinde (Admin - Auto Synced)',
              reviewedAt: new Date().toLocaleString(),
              syncError: undefined
            }
          : r
      )
    );
    showToast(`Sync successfully re-established for request ${id}. Main roll committed.`, 'success');
  };

  // Bulk Selection Toggles
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredRequests.map(r => r.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => (prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]));
  };

  // Bulk Approve
  const handleBulkApproveConfirm = () => {
    setRequests(prev =>
      prev.map(r =>
        selectedIds.includes(r.id)
          ? {
              ...r,
              status: 'APPROVED',
              reviewedBy: 'Anand Shinde (Admin - Bulk)',
              reviewedAt: new Date().toLocaleString()
            }
          : r
      )
    );
    showToast(`Bulk approved ${selectedIds.length} update requests into voter database.`, 'success');
    setSelectedIds([]);
    setIsBulkApproveModalOpen(false);
  };

  // Bulk Reject
  const handleBulkRejectConfirm = () => {
    if (!bulkRejectionReason.trim()) {
      showToast('Please enter a rejection reason for selected requests.', 'error');
      return;
    }
    setRequests(prev =>
      prev.map(r =>
        selectedIds.includes(r.id)
          ? {
              ...r,
              status: 'REJECTED',
              rejectionReason: bulkRejectionReason.trim(),
              reviewedBy: 'Anand Shinde (Admin - Bulk)',
              reviewedAt: new Date().toLocaleString()
            }
          : r
      )
    );
    showToast(`Bulk rejected ${selectedIds.length} update requests.`, 'info');
    setSelectedIds([]);
    setBulkRejectionReason('');
    setIsBulkRejectModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-16 animate-fade-in text-slate-800 dark:text-slate-100">
      {/* 1. Header with Breadcrumb & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Users & Field Operations
            </span>
            <span className="text-slate-300 dark:text-slate-700">/</span>
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
              Voter Update Requests
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60 ml-1">
              Pre-Commit Moderation
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Voter Update Requests & Field Verification
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-3xl leading-relaxed">
            Review changes collected on-ground by Karyakartas. Verified updates synchronize directly into the primary voter roll without disrupting electoral baseline integrity.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              setRequests(MOCK_UPDATE_REQUESTS);
              setSelectedIds([]);
              showToast('Refreshed latest incoming voter update queue.', 'info');
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh Queue
          </button>
          <button
            onClick={() => showToast('Exporting update audit ledger to Excel...', 'info')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition"
          >
            <Download className="w-3.5 h-3.5" />
            Export Audit Log
          </button>
        </div>
      </div>

      {/* 2. KPI Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Total Requests */}
        <div
          onClick={() => setActiveTab('ALL')}
          className={`cursor-pointer p-4 rounded-2xl border transition-all ${
            activeTab === 'ALL'
              ? 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-300 dark:border-blue-700 shadow-xs ring-1 ring-blue-400/30'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Requests
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            {stats.total.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
            <span>From 5 Field Workers</span>
          </div>
        </div>

        {/* Pending Review */}
        <div
          onClick={() => setActiveTab('PENDING')}
          className={`cursor-pointer p-4 rounded-2xl border transition-all ${
            activeTab === 'PENDING'
              ? 'bg-amber-50/70 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 shadow-xs ring-1 ring-amber-400/30'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
              Pending Review
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-2">
            {stats.pending}
          </div>
          <div className="text-[11px] text-amber-700/80 dark:text-amber-400/80 mt-1 flex items-center gap-1">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            <span>Awaiting Admin Action</span>
          </div>
        </div>

        {/* Approved */}
        <div
          onClick={() => setActiveTab('APPROVED')}
          className={`cursor-pointer p-4 rounded-2xl border transition-all ${
            activeTab === 'APPROVED'
              ? 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-400 dark:border-blue-600 shadow-xs ring-1 ring-blue-500/30'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">
              Approved
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-blue-700 dark:text-blue-300 mt-2">
            {stats.approved}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            <span>Committed to Voter Roll</span>
          </div>
        </div>

        {/* Rejected */}
        <div
          onClick={() => setActiveTab('REJECTED')}
          className={`cursor-pointer p-4 rounded-2xl border transition-all ${
            activeTab === 'REJECTED'
              ? 'bg-rose-50/70 dark:bg-rose-950/40 border-rose-300 dark:border-rose-700 shadow-xs ring-1 ring-rose-400/30'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400">
              Rejected
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-2">
            {stats.rejected}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            <span>Audited & Discarded</span>
          </div>
        </div>

        {/* Sync Failed */}
        <div
          onClick={() => setActiveTab('SYNC_FAILED')}
          className={`cursor-pointer p-4 rounded-2xl border col-span-2 sm:col-span-1 transition-all ${
            activeTab === 'SYNC_FAILED'
              ? 'bg-rose-100/70 dark:bg-rose-950/60 border-rose-400 dark:border-rose-600 shadow-xs ring-1 ring-rose-500/30'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-800 dark:text-rose-300">
              Failed to Sync
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-700 dark:text-rose-300 mt-2">
            {stats.failed}
          </div>
          <div className="text-[11px] text-rose-700 dark:text-rose-400 mt-1 flex items-center gap-1 font-semibold">
            <span>Needs Re-attempt</span>
          </div>
        </div>
      </div>

      {/* 3. Field Worker-Wise Submission Volume Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Field Worker Activity & Submission Volume
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Live submission breakdown by Karyakartas. Click "Filter Requests" to isolate submissions from a single worker.
            </p>
          </div>
          {selectedWorker !== 'ALL' && (
            <button
              onClick={() => setSelectedWorker('ALL')}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              Clear Worker Filter ({selectedWorker})
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <th className="py-2.5 px-3">Field Worker</th>
                <th className="py-2.5 px-3">User ID</th>
                <th className="py-2.5 px-3">Assigned Booth</th>
                <th className="py-2.5 px-3 text-center">Total Submitted</th>
                <th className="py-2.5 px-3 text-center">Pending</th>
                <th className="py-2.5 px-3 text-center">Approved</th>
                <th className="py-2.5 px-3 text-center">Rejected</th>
                <th className="py-2.5 px-3">Last Submission</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {workerSummaries.map(worker => {
                const isSelected = selectedWorker === worker.name;
                return (
                  <tr
                    key={worker.id}
                    className={`transition-colors ${
                      isSelected
                        ? 'bg-blue-50/70 dark:bg-blue-950/40'
                        : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold flex items-center justify-center text-xs">
                          {worker.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">{worker.name}</div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400">{worker.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                      {worker.id}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[11px]">
                        Booth #{worker.assignedBooth}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-slate-900 dark:text-white">
                      {worker.total}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 font-bold border border-amber-200 dark:border-amber-800/60 text-[10px]">
                        {worker.pending}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800/60 text-[10px]">
                        {worker.approved}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 font-bold border border-rose-200 dark:border-rose-800/60 text-[10px]">
                        {worker.rejected}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-500 dark:text-slate-400 text-[11px]">
                      {worker.lastDate}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => setSelectedWorker(isSelected ? 'ALL' : worker.name)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-300'
                        }`}
                      >
                        {isSelected ? 'Viewing' : 'View Updates'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Filter Toolbar & Status Tabs */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs space-y-4">
        {/* Status Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'ALL', label: 'All Requests', count: stats.total },
              { id: 'PENDING', label: 'Pending Review', count: stats.pending, alert: stats.pending > 0 },
              { id: 'APPROVED', label: 'Approved', count: stats.approved },
              { id: 'REJECTED', label: 'Rejected', count: stats.rejected },
              { id: 'SYNC_FAILED', label: 'Sync Failed', count: stats.failed, alert: stats.failed > 0 }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800/70 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    activeTab === tab.id
                      ? 'bg-white/20 text-white'
                      : tab.alert
                      ? 'bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-300'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Showing <span className="font-bold text-slate-900 dark:text-white">{filteredRequests.length}</span> of {requests.length} requests
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Input */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by voter name, EPIC ID, request ID, phone, locality..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Worker Filter */}
          <div>
            <select
              value={selectedWorker}
              onChange={e => setSelectedWorker(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
            >
              <option value="ALL">All Field Workers</option>
              {workerSummaries.map(w => (
                <option key={w.id} value={w.name}>
                  {w.name} ({w.total} reqs)
                </option>
              ))}
            </select>
          </div>

          {/* Booth Filter */}
          <div>
            <select
              value={selectedBooth}
              onChange={e => setSelectedBooth(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
            >
              <option value="ALL">All Booths</option>
              <option value="101">Booth #101 (Navbharat School)</option>
              <option value="102">Booth #102 (Ganesh Krupa)</option>
              <option value="103">Booth #103 (Swapnanagari)</option>
              <option value="104">Booth #104 (Karve Nagar)</option>
              <option value="105">Booth #105 (Prabhat Road)</option>
              <option value="106">Booth #106 (Erandwane Gaothan)</option>
              <option value="107">Booth #107 (Shiv Plaza)</option>
              <option value="108">Booth #108 (Deccan)</option>
            </select>
          </div>

          {/* Field Type Filter */}
          <div>
            <select
              value={selectedFieldType}
              onChange={e => setSelectedFieldType(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
            >
              <option value="ALL">All Update Types</option>
              <option value="mobile">Mobile Number</option>
              <option value="address">Address / House No</option>
              <option value="outside">Relocated / Outside</option>
              <option value="deceased">Deceased Marker</option>
              <option value="influence">Influencer Tagging</option>
              <option value="scheme">Government Scheme</option>
              <option value="age">Age / DOB</option>
            </select>
          </div>
        </div>

        {/* Bulk Action Bar (When 1+ rows selected) */}
        {selectedIds.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 animate-fade-in">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                {selectedIds.length}
              </span>
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                Update Requests Selected
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                (Choose a bulk action to process simultaneously)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsBulkApproveModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xs transition"
              >
                <Check className="w-3.5 h-3.5" />
                Bulk Accept ({selectedIds.length})
              </button>
              <button
                onClick={() => setIsBulkRejectModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 border border-rose-200 dark:border-rose-800 transition"
              >
                <X className="w-3.5 h-3.5" />
                Bulk Reject ({selectedIds.length})
              </button>
              <button
                onClick={() => setSelectedIds([])}
                className="px-2.5 py-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 font-semibold"
              >
                Deselect All
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 5. Update Requests Master Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <th className="py-3 px-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={filteredRequests.length > 0 && selectedIds.length === filteredRequests.length}
                    onChange={handleSelectAll}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="py-3 px-3">Req ID</th>
                <th className="py-3 px-3">Voter Name & EPIC</th>
                <th className="py-3 px-3">Booth</th>
                <th className="py-3 px-3">Field Worker</th>
                <th className="py-3 px-3">Proposed Field Changes</th>
                <th className="py-3 px-3">Requested At</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="font-semibold text-sm">No update requests match the selected filters.</p>
                    <p className="text-xs text-slate-500 mt-0.5">Try clearing the worker, booth or search criteria.</p>
                  </td>
                </tr>
              ) : (
                filteredRequests.map(req => {
                  const isChecked = selectedIds.includes(req.id);
                  return (
                    <tr
                      key={req.id}
                      className={`transition-colors ${
                        isChecked
                          ? 'bg-blue-50/50 dark:bg-blue-950/30'
                          : 'hover:bg-slate-50/70 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleSelect(req.id)}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>

                      {/* Request ID */}
                      <td className="py-3 px-3 font-mono text-[11px] font-bold text-slate-600 dark:text-slate-300">
                        {req.id}
                        {req.hasConflict && (
                          <div className="flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-400 font-sans font-bold mt-0.5">
                            <AlertCircle className="w-3 h-3" />
                            Conflict
                          </div>
                        )}
                      </td>

                      {/* Voter Details */}
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900 dark:text-white text-xs">
                          {req.voterName || 'Unnamed Voter'}
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
                          <span>{req.epicNumber || 'EPIC N/A'}</span>
                          {req.locality && (
                            <>
                              <span>•</span>
                              <span className="font-sans text-[10px] truncate max-w-[150px]">{req.locality}</span>
                            </>
                          )}
                        </div>
                      </td>

                      {/* Booth */}
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-semibold">
                          #{req.boothNumber || 101}
                        </span>
                      </td>

                      {/* Field Worker */}
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-900 dark:text-white text-xs">
                          {req.karyakartaName}
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">
                          {req.karyakartaId}
                        </div>
                      </td>

                      {/* Proposed Changes Preview */}
                      <td className="py-3 px-3 max-w-xs">
                        <div className="flex flex-wrap gap-1">
                          {req.updatedFields && req.updatedFields.length > 0 ? (
                            req.updatedFields.map((f, i) => (
                              <span
                                key={i}
                                className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                  f.isNew
                                    ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                                    : 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                                }`}
                              >
                                {f.label}: {f.newValue}
                              </span>
                            ))
                          ) : (
                            <span className="text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                              {req.field}: {req.proposedValue}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Requested At */}
                      <td className="py-3 px-3 text-slate-500 dark:text-slate-400 text-[11px] whitespace-nowrap">
                        {req.requestedAt}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        {req.status === 'PENDING' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60">
                            <Clock className="w-3 h-3" />
                            Pending Review
                          </span>
                        )}
                        {req.status === 'APPROVED' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60">
                            <CheckCircle2 className="w-3 h-3" />
                            Approved & Synced
                          </span>
                        )}
                        {req.status === 'REJECTED' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60">
                            <XCircle className="w-3 h-3" />
                            Rejected
                          </span>
                        )}
                        {req.status === 'SYNC_FAILED' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
                            <AlertTriangle className="w-3 h-3" />
                            Sync Failed
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {req.status === 'PENDING' ? (
                            <>
                              <button
                                onClick={() => handleApprove(req.id, req.voterName)}
                                title="Accept Update"
                                className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 hover:bg-blue-600 hover:text-white border border-blue-200 dark:border-blue-800 transition"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  setReviewingRequest(req);
                                  setSingleRejectModalOpen(true);
                                }}
                                title="Reject Update"
                                className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 hover:bg-rose-600 hover:text-white border border-rose-200 dark:border-rose-800 transition"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </>
                          ) : req.status === 'SYNC_FAILED' ? (
                            <button
                              onClick={() => handleRetrySync(req.id)}
                              className="px-2 py-1 rounded-lg text-[10px] font-bold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 border border-rose-300 transition"
                            >
                              Retry Sync
                            </button>
                          ) : null}

                          <button
                            onClick={() => setReviewingRequest(req)}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                          >
                            <Eye className="w-3 h-3" />
                            Review
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. Side-by-Side Review Drawer / Modal */}
      {reviewingRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-2xl h-full bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-slide-left">
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                    {reviewingRequest.id}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      reviewingRequest.status === 'PENDING'
                        ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-amber-200'
                        : reviewingRequest.status === 'APPROVED'
                        ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200'
                        : reviewingRequest.status === 'REJECTED'
                        ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 border border-rose-200'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {reviewingRequest.status}
                  </span>
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                  Side-by-Side Voter Diff Review
                </h3>
              </div>
              <button
                onClick={() => setReviewingRequest(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Conflict Alert Banner if applicable */}
            {reviewingRequest.hasConflict && (
              <div className="p-4 bg-amber-50 dark:bg-amber-950/60 border-b border-amber-200 dark:border-amber-800/60 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-amber-800 dark:text-amber-300">
                    Conflict / Duplicate Submission Detected
                  </h4>
                  <p className="text-xs text-amber-700 dark:text-amber-400/90 mt-0.5">
                    {reviewingRequest.conflictNote ||
                      'Another field worker previously submitted updates for this voter. Please verify conflicting field values carefully before committing.'}
                  </p>
                </div>
              </div>
            )}

            {/* Drawer Body Scrollable */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* Voter & Field Worker Identity Block */}
              <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Target Voter Record
                  </span>
                  <div className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">
                    {reviewingRequest.voterName || 'Unnamed Voter'}
                  </div>
                  <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
                    EPIC: {reviewingRequest.epicNumber || 'N/A'} • Booth #{reviewingRequest.boothNumber || 101}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    {reviewingRequest.locality}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Submitted By Field Worker
                  </span>
                  <div className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">
                    {reviewingRequest.karyakartaName}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    ID: {reviewingRequest.karyakartaId} • {reviewingRequest.karyakartaPhone || '+91 98224 44001'}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    Submitted: {reviewingRequest.requestedAt}
                  </div>
                </div>
              </div>

              {/* Side-by-Side Comparison */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Field-Level Differences
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    Unchanged fields omitted from view
                  </span>
                </div>

                <div className="space-y-3">
                  {reviewingRequest.updatedFields && reviewingRequest.updatedFields.length > 0 ? (
                    reviewingRequest.updatedFields.map((field, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden"
                      >
                        <div className="bg-slate-100 dark:bg-slate-800 px-3.5 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center justify-between">
                          <span>{field.label}</span>
                          {field.isNew && (
                            <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                              NEW ENTRY
                            </span>
                          )}
                        </div>
                        <div className="grid grid-cols-2 text-xs divide-x divide-slate-200 dark:divide-slate-800">
                          {/* Column A: Existing Data */}
                          <div className="p-3 bg-slate-50/50 dark:bg-slate-900/60">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                              Current in Primary Roll
                            </span>
                            <div className="font-medium text-slate-600 dark:text-slate-300 line-through decoration-slate-400">
                              {field.oldValue || '— None —'}
                            </div>
                          </div>

                          {/* Column B: Proposed Data */}
                          <div className="p-3 bg-blue-50/40 dark:bg-blue-950/30">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block mb-1">
                              Proposed by Worker
                            </span>
                            <div className="font-bold text-blue-950 dark:text-blue-200">
                              {field.newValue}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                      <div className="bg-slate-100 dark:bg-slate-800 px-3.5 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200">
                        {reviewingRequest.field}
                      </div>
                      <div className="grid grid-cols-2 text-xs divide-x divide-slate-200 dark:divide-slate-800">
                        <div className="p-3 bg-slate-50/50 dark:bg-slate-900/60">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                            Current Value
                          </span>
                          <div className="font-medium text-slate-600 dark:text-slate-300">
                            {reviewingRequest.currentValue}
                          </div>
                        </div>
                        <div className="p-3 bg-blue-50/40 dark:bg-blue-950/30">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block mb-1">
                            Proposed Value
                          </span>
                          <div className="font-bold text-blue-950 dark:text-blue-200">
                            {reviewingRequest.proposedValue}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Justification & Verification Notes */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Karyakarta Verification Justification
                </span>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  "{reviewingRequest.reason}"
                </p>
              </div>

              {/* Audit / Review Log if completed */}
              {reviewingRequest.reviewedBy && (
                <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 block mb-1">
                    Audit Review History
                  </span>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    <span className="font-bold">Reviewed By:</span> {reviewingRequest.reviewedBy} on {reviewingRequest.reviewedAt}
                  </div>
                  {reviewingRequest.rejectionReason && (
                    <div className="text-xs text-rose-700 dark:text-rose-400 mt-1">
                      <span className="font-bold">Rejection Reason:</span> {reviewingRequest.rejectionReason}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-between gap-3">
              <button
                onClick={() => setReviewingRequest(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
              >
                Close Drawer
              </button>

              {reviewingRequest.status === 'PENDING' ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSingleRejectModalOpen(true)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 border border-rose-200 dark:border-rose-800 transition"
                  >
                    <X className="w-4 h-4" />
                    Reject Update
                  </button>
                  <button
                    onClick={() => handleApprove(reviewingRequest.id, reviewingRequest.voterName)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition"
                  >
                    <Check className="w-4 h-4" />
                    Accept & Commit into DB
                  </button>
                </div>
              ) : reviewingRequest.status === 'SYNC_FAILED' ? (
                <button
                  onClick={() => handleRetrySync(reviewingRequest.id)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition"
                >
                  Retry Database Synchronization
                </button>
              ) : (
                <span className="text-xs text-slate-500 font-semibold">
                  Record already archived as {reviewingRequest.status}.
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 7. Single Rejection Reason Modal */}
      {singleRejectModalOpen && reviewingRequest && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <XCircle className="w-5 h-5 text-rose-600" />
                Reject Voter Update Request
              </h3>
              <button
                onClick={() => setSingleRejectModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              Provide a clear reason for rejecting the update for{' '}
              <span className="font-bold text-slate-900 dark:text-white">{reviewingRequest.voterName}</span>. This explanation will be logged and returned to Karyakarta{' '}
              <span className="font-bold text-slate-900 dark:text-white">{reviewingRequest.karyakartaName}</span>.
            </p>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Rejection Reason
              </label>
              <textarea
                rows={3}
                value={singleRejectionReason}
                onChange={e => setSingleRejectionReason(e.target.value)}
                placeholder="e.g., Unverifiable Aadhaar document, phone number did not connect, or booth boundary mismatch requires ECI Form 8..."
                className="w-full p-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSingleRejectModalOpen(false)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectConfirm}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. Bulk Approve Confirmation Modal */}
      {isBulkApproveModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-600" />
                Confirm Bulk Authorization
              </h3>
              <button
                onClick={() => setIsBulkApproveModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900 text-xs text-slate-700 dark:text-slate-300 space-y-1.5">
              <p className="font-bold text-slate-900 dark:text-white">
                You are about to approve {selectedIds.length} update requests.
              </p>
              <p>
                All proposed changes will be synchronized into the primary candidate voter roll immediately. The original roll history will be backed up in the system audit log.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsBulkApproveModalOpen(false)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkApproveConfirm}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition"
              >
                Approve & Sync {selectedIds.length} Requests
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 9. Bulk Reject Modal */}
      {isBulkRejectModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <XCircle className="w-5 h-5 text-rose-600" />
                Bulk Reject {selectedIds.length} Requests
              </h3>
              <button
                onClick={() => setIsBulkRejectModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              Enter a shared reason for rejecting the {selectedIds.length} selected requests. Each respective Karyakarta will receive this feedback in their mobile sync queue.
            </p>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Shared Rejection Reason
              </label>
              <textarea
                rows={3}
                value={bulkRejectionReason}
                onChange={e => setBulkRejectionReason(e.target.value)}
                placeholder="e.g., Bulk batch rejected due to incomplete doorstep validation documents."
                className="w-full p-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsBulkRejectModalOpen(false)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkRejectConfirm}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition"
              >
                Confirm Bulk Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
