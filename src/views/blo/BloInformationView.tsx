import React, { useState } from 'react';
import {
  ShieldAlert,
  Search,
  Plus,
  Phone,
  Building,
  CheckCircle2,
  Clock,
  X,
  ExternalLink,
  MapPin
} from 'lucide-react';
import { MOCK_BLOS, MOCK_BOOTHS } from '../../data/mockData';
import { BLO } from '../../types';
import { useToast } from '../../components/common/Toast';

export const BloInformationView: React.FC = () => {
  const { showToast } = useToast();
  const [bloList, setBloList] = useState<BLO[]>(MOCK_BLOS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Add / Edit BLO Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formDesignation, setFormDesignation] = useState('Primary School Teacher');
  const [formDept, setFormDept] = useState('School Education Department');
  const [formBooth, setFormBooth] = useState(101);
  const [formPollingStation, setFormPollingStation] = useState('Navbharat High School, Room 1');

  const filteredBlos = bloList.filter((blo) => {
    const matchSearch =
      blo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blo.phone.includes(searchTerm) ||
      blo.boothNumber.toString().includes(searchTerm) ||
      blo.pollingStation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || blo.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleSaveBlo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formPhone) return;

    const newBlo: BLO = {
      id: `blo-${Date.now().toString().slice(-4)}`,
      name: formName,
      phone: formPhone,
      designation: formDesignation,
      department: formDept,
      boothNumber: formBooth,
      pollingStation: formPollingStation,
      constituency: '34 - Pune',
      status: 'ACTIVE',
      lastVerifiedDate: 'Today'
    };

    setBloList([newBlo, ...bloList]);
    setIsModalOpen(false);
    showToast(`BLO record for ${formName} (Booth #${formBooth}) registered.`, 'success');

    // Reset Form
    setFormName('');
    setFormPhone('');
  };

  const handleCall = (name: string, phone: string) => {
    showToast(`Click-to-Call triggered for Booth Level Officer ${name} (${phone})`, 'info');
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              ECI Field Officers
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              Government Appointees
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 mt-1">
            Booth Level Officer (BLO) Directory
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Official ECI designated teachers and revenue personnel managing voter additions, deletions, and polling stations.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add / Update BLO</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search BLO name, phone number, booth, or polling station..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500 focus:bg-white"
          />
        </div>

        <div className="w-full sm:w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:ring-2 focus:ring-brand-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active in Booth</option>
            <option value="ON_LEAVE">On Leave</option>
            <option value="REPLACED">Replaced</option>
          </select>
        </div>
      </div>

      {/* BLO Cards & Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Booth #</th>
                <th className="py-3 px-4">BLO Name & Designation</th>
                <th className="py-3 px-4">Govt Parent Department</th>
                <th className="py-3 px-4">Direct Phone</th>
                <th className="py-3 px-4">Polling Station Location</th>
                <th className="py-3 px-4">Verification</th>
                <th className="py-3 px-4 text-right">Contact Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredBlos.map((blo) => (
                <tr key={blo.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-brand-700">
                    Booth #{blo.boothNumber}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 block">{blo.name}</span>
                    <span className="text-[11px] text-slate-500">{blo.designation}</span>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-800">{blo.department}</td>
                  <td className="py-3 px-4 font-mono font-bold">{blo.phone}</td>
                  <td className="py-3 px-4 text-slate-600">{blo.pollingStation}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      blo.status === 'ACTIVE'
                        ? 'bg-emerald-100 text-emerald-800'
                        : blo.status === 'ON_LEAVE'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {blo.status}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Verified {blo.lastVerifiedDate}</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleCall(blo.name, blo.phone)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg text-xs transition-colors inline-flex items-center gap-1.5"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Call BLO</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add BLO Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full border border-slate-200 overflow-hidden p-6 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-base">Register Booth Level Officer</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBlo} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">BLO Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rameshwar P. Mane"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Direct Mobile Phone *</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 94XXX XXXXX"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Assigned Booth Number</label>
                  <select
                    value={formBooth}
                    onChange={(e) => setFormBooth(parseInt(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-brand-500"
                  >
                    {MOCK_BOOTHS.map((b) => (
                      <option key={b.boothNumber} value={b.boothNumber}>
                        Booth #{b.boothNumber}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Government Designation</label>
                  <input
                    type="text"
                    value={formDesignation}
                    onChange={(e) => setFormDesignation(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Parent Department</label>
                <input
                  type="text"
                  value={formDept}
                  onChange={(e) => setFormDept(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Polling Station Building Name</label>
                <input
                  type="text"
                  value={formPollingStation}
                  onChange={(e) => setFormPollingStation(e.target.value)}
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
                  Save BLO Information
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
