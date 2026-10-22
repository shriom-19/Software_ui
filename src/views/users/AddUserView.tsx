import React, { useState } from 'react';
import { ArrowLeft, UserPlus, Shield, Check, AlertCircle } from 'lucide-react';
import { Role } from '../../types';
import { MOCK_BOOTHS } from '../../data/mockData';
import { useToast } from '../../components/common/Toast';

interface AddUserViewProps {
  onBack: () => void;
  onUserAdded: () => void;
}

export const AddUserView: React.FC<AddUserViewProps> = ({ onBack, onUserAdded }) => {
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    loginPassword: 'Password@2024',
    role: 'KARYAKARTA' as Role,
    prabhaag: 'Prabhaag 12 - Kothrud West',
    assignedBooths: [101] as number[],
    voterSerialRange: '1 to 250',
    modulePermissions: ['VOTER_SEARCH', 'SURVEY', 'SLIP_DISTRIBUTION'] as string[],
    canImportData: false
  });

  const availableModules = [
    { id: 'DASHBOARD', name: 'War Room Dashboard' },
    { id: 'VOTER_SEARCH', name: 'Total Voters & Search' },
    { id: 'SURVEY', name: 'Field Survey Entry' },
    { id: 'SLIP_DISTRIBUTION', name: 'Voter Slip Delivery & Print' },
    { id: 'OFFICE', name: 'Office Grievance & Visitors' },
    { id: 'CAMPAIGN', name: 'Campaign Control & Broadcast' },
    { id: 'REPORTS', name: 'Analytical Reports Export' },
    { id: 'LIVE_MAP', name: 'Live Field Map' }
  ];

  const handleBoothToggle = (boothNo: number) => {
    setFormData((prev) => ({
      ...prev,
      assignedBooths: prev.assignedBooths.includes(boothNo)
        ? prev.assignedBooths.filter((b) => b !== boothNo)
        : [...prev.assignedBooths, boothNo]
    }));
  };

  const handleModuleToggle = (modId: string) => {
    setFormData((prev) => ({
      ...prev,
      modulePermissions: prev.modulePermissions.includes(modId)
        ? prev.modulePermissions.filter((m) => m !== modId)
        : [...prev.modulePermissions, modId]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      showToast('Please fill in required fields (Name and Phone).', 'error');
      return;
    }

    showToast(`User ${formData.name} successfully registered with ${formData.role} role.`, 'success');
    onUserAdded();
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Users</span>
        </button>

        <span className="text-xs font-semibold text-slate-400">
          User Account Provisioning
        </span>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="bg-gradient-to-r from-slate-900 via-brand-900 to-indigo-950 p-6 text-white">
          <h1 className="text-xl font-black">Provision New Portal User</h1>
          <p className="text-xs text-brand-200 mt-1">
            Assign credentials, jurisdiction, booth boundaries, and security permissions.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 text-xs">
          {/* Section 1: Basic Information */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              1. Personal & Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Shankar Jadhav"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mobile Phone (WhatsApp) *</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98XXX XXXXX"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="user@indata-election.in"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Role & Jurisdiction */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              2. Role & Organizational Jurisdiction
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assigned Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as Role })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-brand-500"
                >
                  <option value="KARYAKARTA">Karyakarta (Field Mobilizer)</option>
                  <option value="BOOTH_ADHYAKSH">Booth Adhyaksh (Booth Chief)</option>
                  <option value="PRABHAAG_INCHARGE">Prabhaag Incharge (Ward Coordinator)</option>
                  <option value="WAR_ROOM_HEAD">War Room Head</option>
                  <option value="DATA_OPERATOR">Data Operator</option>
                  <option value="CANDIDATE_ADMIN">Candidate Admin</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assigned Prabhaag / Ward</label>
                <input
                  type="text"
                  value={formData.prabhaag}
                  onChange={(e) => setFormData({ ...formData, prabhaag: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            {/* Booth Allotment */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Allot Polling Booths (Click to toggle)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {MOCK_BOOTHS.map((b) => {
                  const isChecked = formData.assignedBooths.includes(b.boothNumber);
                  return (
                    <div
                      key={b.boothNumber}
                      onClick={() => handleBoothToggle(b.boothNumber)}
                      className={`p-2.5 rounded-xl border text-center cursor-pointer transition-all ${
                        isChecked
                          ? 'bg-brand-50 border-brand-500 text-brand-900 font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span>Booth #{b.boothNumber}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Voter Serial Number Range */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Assigned Voter Serial Number Range (for Door-to-Door Slip Distribution)
              </label>
              <input
                type="text"
                placeholder="e.g. 1 to 250 or Part 101: 50-150"
                value={formData.voterSerialRange}
                onChange={(e) => setFormData({ ...formData, voterSerialRange: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          {/* Section 3: Module Permissions & Data Access */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              3. Module Rights & Security Policies
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {availableModules.map((mod) => (
                <label key={mod.id} className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.modulePermissions.includes(mod.id)}
                    onChange={() => handleModuleToggle(mod.id)}
                    className="rounded text-brand-600 focus:ring-brand-500"
                  />
                  <span className="font-medium text-slate-700">{mod.name}</span>
                </label>
              ))}
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-amber-50/50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.canImportData}
                  onChange={(e) => setFormData({ ...formData, canImportData: e.target.checked })}
                  className="rounded text-brand-600 focus:ring-brand-500"
                />
                <div>
                  <span className="font-bold text-slate-900 block">Grant Electoral Roll Data Import Access</span>
                  <span className="text-slate-500 text-[11px]">
                    Allows uploading voter CSVs or modifying electoral boundary definitions. Keep disabled for field karyakartas.
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onBack}
              className="px-5 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-md transition-colors"
            >
              Create User Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
