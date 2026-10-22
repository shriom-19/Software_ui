import React, { useState } from 'react';
import {
  Building2,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  User,
  MessageSquare,
  ArrowRight,
  X,
  Send,
  Link,
  ShieldAlert,
  ChevronRight
} from 'lucide-react';
import { MOCK_TICKETS, MOCK_VOTERS } from '../../data/mockData';
import { OfficeTicket, Voter } from '../../types';
import { useToast } from '../../components/common/Toast';

export const OfficeIssuesView: React.FC = () => {
  const { showToast } = useToast();
  const [tickets, setTickets] = useState<OfficeTicket[]>(MOCK_TICKETS);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Selected Ticket Drawer
  const [selectedTicket, setSelectedTicket] = useState<OfficeTicket | null>(null);
  const [newComment, setNewComment] = useState('');

  // New Visitor & Ticket Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visitorName, setVisitorName] = useState('');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [visitorAddress, setVisitorAddress] = useState('');
  const [category, setCategory] = useState<OfficeTicket['category']>('Water Supply');
  const [priority, setPriority] = useState<OfficeTicket['priority']>('HIGH');
  const [assignedTo, setAssignedTo] = useState('Sachin Babar (Prabhaag Incharge)');
  const [description, setDescription] = useState('');

  // Voter Search in Visitor Modal
  const [voterSearchQuery, setVoterSearchQuery] = useState('');
  const [linkedVoter, setLinkedVoter] = useState<Voter | null>(null);

  const matchedVoters = voterSearchQuery.trim()
    ? MOCK_VOTERS.filter(
        (v) =>
          v.fullName.toLowerCase().includes(voterSearchQuery.toLowerCase()) ||
          v.epicNumber.toLowerCase().includes(voterSearchQuery.toLowerCase()) ||
          v.mobile.includes(voterSearchQuery)
      )
    : [];

  // Potential duplicate tickets detection
  const potentialDuplicates = (visitorName.trim().length >= 3 || visitorPhone.trim().length >= 7)
    ? tickets.filter(
        (t) =>
          (visitorName.trim().length >= 3 && t.visitorName.toLowerCase().includes(visitorName.trim().toLowerCase())) ||
          (visitorPhone.trim().length >= 7 && t.visitorPhone && t.visitorPhone.includes(visitorPhone.trim()))
      )
    : [];

  const filteredTickets = tickets.filter((t) => {
    const matchStatus = statusFilter === 'ALL' || t.status === statusFilter;
    const matchCategory = categoryFilter === 'ALL' || t.category === categoryFilter;
    const matchSearch =
      t.visitorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchCategory && matchSearch;
  });

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName || !description) return;

    const newTicket: OfficeTicket = {
      id: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      visitorName,
      visitorPhone,
      visitorAddress,
      isLinkedVoter: !!linkedVoter,
      voterEpic: linkedVoter ? linkedVoter.epicNumber : undefined,
      category,
      priority,
      status: 'OPEN',
      assignedTo,
      createdAt: 'Just now',
      updatedAt: 'Just now',
      description,
      comments: [
        {
          author: 'Office Desk Registration',
          text: linkedVoter
            ? `Visitor verified & linked to Voter ID ${linkedVoter.epicNumber} (Booth #${linkedVoter.boothNumber}).`
            : 'Unverified Citizen Visitor registered at reception desk.',
          timestamp: 'Just now'
        }
      ]
    };

    setTickets([newTicket, ...tickets]);
    showToast(`Ticket #${newTicket.id} created and routed to ${assignedTo}.`, 'success');
    setIsModalOpen(false);

    // Reset Form
    setVisitorName('');
    setVisitorPhone('');
    setVisitorAddress('');
    setDescription('');
    setLinkedVoter(null);
    setVoterSearchQuery('');
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !selectedTicket) return;

    const updated = {
      ...selectedTicket,
      comments: [
        ...selectedTicket.comments,
        {
          author: 'Candidate Office Desk',
          text: newComment,
          timestamp: 'Just now'
        }
      ]
    };

    setSelectedTicket(updated);
    setTickets((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    setNewComment('');
    showToast('Comment appended to grievance audit trail.', 'info');
  };

  const handleUpdateStatus = (newStatus: OfficeTicket['status']) => {
    if (!selectedTicket) return;
    const updated: OfficeTicket = {
      ...selectedTicket,
      status: newStatus,
      updatedAt: 'Just now',
      resolutionNote: newStatus === 'RESOLVED' ? 'Issue verified resolved on field inspection.' : selectedTicket.resolutionNote
    };
    setSelectedTicket(updated);
    setTickets((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    showToast(`Ticket #${updated.id} marked as ${newStatus}.`, 'success');
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Constituency Governance
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
              Citizen Grievances
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 mt-1">
            Office Desk & Public Issues
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Register visiting citizens, link them to the electoral roll, and monitor resolution workflows.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>+ Register Visitor / New Ticket</span>
        </button>
      </div>

      {/* Office Activity KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Today's Visitors</span>
          <p className="text-2xl font-black text-slate-900 mt-1">28</p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">19 Linked to Voter Roll</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Open Tickets</span>
          <p className="text-2xl font-black text-amber-600 mt-1">
            {tickets.filter(t => t.status === 'OPEN').length}
          </p>
          <p className="text-[11px] text-amber-600 font-semibold mt-1">Awaiting PMC department action</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">In Progress</span>
          <p className="text-2xl font-black text-blue-600 mt-1">
            {tickets.filter(t => t.status === 'IN_PROGRESS').length}
          </p>
          <p className="text-[11px] text-blue-600 font-semibold mt-1">Assigned to Ward Incharges</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Resolved Issues</span>
          <p className="text-2xl font-black text-emerald-600 mt-1">
            {tickets.filter(t => t.status === 'RESOLVED').length}
          </p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">89% Satisfaction Index</p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tickets by visitor name, ID, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500 focus:bg-white"
          />
        </div>

        <div className="w-full md:w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:ring-2 focus:ring-brand-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>

        <div className="w-full md:w-56">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:ring-2 focus:ring-brand-500"
          >
            <option value="ALL">All Categories</option>
            <option value="Water Supply">Water Supply</option>
            <option value="Roads & Infrastructure">Roads & Infrastructure</option>
            <option value="Pension">Pension</option>
            <option value="Electricity">Electricity</option>
          </select>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Ticket ID</th>
                <th className="py-3 px-4">Visitor & Voter Status</th>
                <th className="py-3 px-4">Category & Priority</th>
                <th className="py-3 px-4">Issue Description</th>
                <th className="py-3 px-4">Assigned Officer</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredTickets.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-brand-700">{t.id}</td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 block">{t.visitorName}</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                        t.isLinkedVoter
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {t.isLinkedVoter ? `Verified Voter (${t.voterEpic})` : 'Unverified Visitor'}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-800 block">{t.category}</span>
                    <span className={`px-1.5 py-0.2 rounded text-[9px] font-extrabold ${
                      t.priority === 'CRITICAL'
                        ? 'bg-rose-100 text-rose-800'
                        : t.priority === 'HIGH'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {t.priority}
                    </span>
                  </td>
                  <td className="py-3 px-4 max-w-xs">
                    <p className="text-slate-600 line-clamp-2">{t.description}</p>
                    <span className="text-[10px] text-slate-400 mt-1 block">Created: {t.createdAt}</span>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-800">{t.assignedTo}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      t.status === 'RESOLVED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : t.status === 'IN_PROGRESS'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedTicket(t)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-brand-50 text-slate-700 hover:text-brand-700 font-bold rounded-lg text-xs transition-colors"
                    >
                      Inspect Ticket
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Ticket Drawer / Side Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-xl h-full shadow-2xl flex flex-col border-l border-slate-200 animate-slide-left">
            <div className="p-4 px-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-brand-700 text-sm">{selectedTicket.id}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    selectedTicket.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {selectedTicket.status}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-base mt-1">{selectedTicket.category}</h3>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 p-6 overflow-y-auto space-y-6 text-xs">
              {/* Visitor Details Box */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">{selectedTicket.visitorName}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    selectedTicket.isLinkedVoter ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {selectedTicket.isLinkedVoter ? 'Verified Voter' : 'Unverified Citizen Visitor'}
                  </span>
                </div>
                <p className="text-slate-600"><strong>Contact:</strong> {selectedTicket.visitorPhone || 'Not provided'}</p>
                <p className="text-slate-600"><strong>Address:</strong> {selectedTicket.visitorAddress || 'Not provided'}</p>
                {selectedTicket.voterEpic && (
                  <p className="text-brand-700 font-mono font-bold">Linked Voter ID: {selectedTicket.voterEpic}</p>
                )}
              </div>

              {/* Status Update Actions */}
              <div>
                <label className="block font-bold text-slate-800 mb-2">Update Ticket Resolution Status</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleUpdateStatus('OPEN')}
                    className={`py-2 px-3 rounded-xl font-bold border transition-all ${
                      selectedTicket.status === 'OPEN'
                        ? 'bg-amber-500 text-white border-amber-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Mark Open
                  </button>
                  <button
                    onClick={() => handleUpdateStatus('IN_PROGRESS')}
                    className={`py-2 px-3 rounded-xl font-bold border transition-all ${
                      selectedTicket.status === 'IN_PROGRESS'
                        ? 'bg-blue-600 text-white border-blue-700'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    In Progress
                  </button>
                  <button
                    onClick={() => handleUpdateStatus('RESOLVED')}
                    className={`py-2 px-3 rounded-xl font-bold border transition-all ${
                      selectedTicket.status === 'RESOLVED'
                        ? 'bg-emerald-600 text-white border-emerald-700'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Resolved
                  </button>
                </div>
              </div>

              {/* Description */}
              <div>
                <span className="font-bold text-slate-800 block mb-1">Issue Grievance Details</span>
                <p className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 leading-relaxed">
                  {selectedTicket.description}
                </p>
              </div>

              {/* Resolution Note if resolved */}
              {selectedTicket.resolutionNote && (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900">
                  <span className="font-bold block mb-0.5">Resolution Verification Note:</span>
                  <p>{selectedTicket.resolutionNote}</p>
                </div>
              )}

              {/* Activity / Comments Audit Trail */}
              <div>
                <span className="font-bold text-slate-800 block mb-2">Internal Notes & Action History</span>
                <div className="space-y-2">
                  {selectedTicket.comments?.map((c, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="font-bold text-brand-700">{c.author}</span>
                        <span className="text-slate-400">{c.timestamp}</span>
                      </div>
                      <p className="text-slate-700 text-[11px]">{c.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Append Comment Footer */}
            <form onSubmit={handleAddComment} className="p-4 border-t border-slate-200 bg-slate-50 flex gap-2">
              <input
                type="text"
                placeholder="Add departmental coordination note or update..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500"
              />
              <button
                type="submit"
                disabled={!newComment.trim()}
                className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs transition-colors disabled:opacity-40"
              >
                Post Note
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Visitor Registration Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-xl max-w-lg w-full border border-slate-200 overflow-hidden p-6 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Register Citizen Visitor & Grievance</h3>
                <p className="text-xs text-slate-500">Log reception footfall and match with voter electoral roll.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-4 text-xs">
              {/* Match Voter Search Bar */}
              <div className="p-3 bg-brand-50/70 border border-brand-200 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-brand-900 flex items-center gap-1.5">
                    <Link className="w-3.5 h-3.5 text-brand-600" />
                    <span>Match with Voter Electoral Roll</span>
                  </span>
                  {linkedVoter && (
                    <button
                      type="button"
                      onClick={() => setLinkedVoter(null)}
                      className="text-[10px] text-rose-600 hover:underline font-bold"
                    >
                      Unlink
                    </button>
                  )}
                </div>

                {linkedVoter ? (
                  <div className="p-2 bg-white rounded-xl border border-brand-300 text-brand-950 font-medium">
                    <div className="flex justify-between">
                      <span className="font-bold">{linkedVoter.fullName}</span>
                      <span className="font-mono text-xs">{linkedVoter.epicNumber}</span>
                    </div>
                    <span className="text-[10px] text-slate-500">Booth #{linkedVoter.boothNumber} • {linkedVoter.address}</span>
                  </div>
                ) : (
                  <div>
                    <input
                      type="text"
                      placeholder="Type voter name or EPIC to auto-fill..."
                      value={voterSearchQuery}
                      onChange={(e) => setVoterSearchQuery(e.target.value)}
                      className="w-full p-2 bg-white border border-brand-200 rounded-xl focus:ring-2 focus:ring-brand-500"
                    />
                    {matchedVoters.length > 0 && (
                      <div className="mt-2 bg-white rounded-xl border border-brand-200 shadow-sm max-h-32 overflow-y-auto divide-y divide-slate-100">
                        {matchedVoters.map((mv) => (
                          <div
                            key={mv.id}
                            onClick={() => {
                              setLinkedVoter(mv);
                              setVisitorName(mv.fullName);
                              setVisitorPhone(mv.mobile);
                              setVisitorAddress(mv.address);
                              setVoterSearchQuery('');
                            }}
                            className="p-2 hover:bg-brand-50 cursor-pointer flex justify-between items-center"
                          >
                            <div>
                              <span className="font-bold text-slate-900 block">{mv.fullName}</span>
                              <span className="text-[10px] text-slate-500">{mv.address}</span>
                            </div>
                            <span className="font-mono text-[10px] font-bold text-brand-700">{mv.epicNumber}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Visitor Details */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Visitor Name *</label>
                  <input
                    type="text"
                    required
                    value={visitorName}
                    onChange={(e) => setVisitorName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mobile Phone</label>
                  <input
                    type="tel"
                    value={visitorPhone}
                    onChange={(e) => setVisitorPhone(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Address / Locality</label>
                <input
                  type="text"
                  value={visitorAddress}
                  onChange={(e) => setVisitorAddress(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500"
                />
              </div>

              {/* Duplicate ticket detection warning */}
              {potentialDuplicates.length > 0 && (
                <div className="p-3 bg-amber-50 border border-amber-300 rounded-2xl space-y-2 animate-fade-in">
                  <div className="flex items-center gap-1.5 text-amber-900 font-bold text-xs">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Potential Duplicate Grievance Detected ({potentialDuplicates.length})</span>
                  </div>
                  <p className="text-[11px] text-amber-800">
                    Existing tickets found for this citizen/contact. You may inspect the existing record or proceed to log a new ticket.
                  </p>
                  <div className="space-y-1.5 max-h-28 overflow-y-auto">
                    {potentialDuplicates.map(dp => (
                      <div key={dp.id} className="p-2 bg-white rounded-xl border border-amber-200 flex items-center justify-between text-[11px]">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-bold text-brand-700">{dp.id}</span>
                            <span className="font-bold text-slate-800">{dp.category}</span>
                            <span className="text-[9px] px-1.5 py-0.2 rounded font-bold bg-slate-100 text-slate-700">{dp.status}</span>
                          </div>
                          <p className="text-[10px] text-slate-500 truncate max-w-xs">{dp.description}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedTicket(dp);
                            setIsModalOpen(false);
                          }}
                          className="px-2 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold rounded-lg text-[10px] shrink-0"
                        >
                          Inspect
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Issue Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="Water Supply">Water Supply</option>
                    <option value="Electricity">Electricity</option>
                    <option value="Roads & Infrastructure">Roads & Infrastructure</option>
                    <option value="Sanitation">Sanitation</option>
                    <option value="Pension">Pension</option>
                    <option value="Ration & Civil Supplies">Ration & Civil Supplies</option>
                    <option value="Healthcare">Healthcare</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Priority Level</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="CRITICAL">Critical</option>
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Detailed Grievance Description *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe citizen demand, problem area, and action requested..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl transition-colors shadow-sm"
                >
                  Register & Assign Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
