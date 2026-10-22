import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Download,
  Printer,
  ChevronDown,
  CheckSquare,
  Square,
  ChevronLeft,
  ChevronRight,
  Eye,
  Tag,
  Share2,
  FileSpreadsheet,
  HelpCircle,
  X,
  Send,
  AlertCircle,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  SlidersHorizontal
} from 'lucide-react';
import { Voter } from '../../types';
import { MOCK_VOTERS, MOCK_BOOTHS } from '../../data/mockData';
import { useToast } from '../../components/common/Toast';

interface TotalVotersViewProps {
  onSelectVoter: (voter: Voter) => void;
  onOpenVoterSlip: (voter: Voter) => void;
}

export const TotalVotersView: React.FC<TotalVotersViewProps> = ({
  onSelectVoter,
  onOpenVoterSlip
}) => {
  const { showToast } = useToast();

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooth, setSelectedBooth] = useState<string>('ALL');
  const [selectedGender, setSelectedGender] = useState<string>('ALL');
  const [selectedLeaning, setSelectedLeaning] = useState<string>('ALL');
  const [selectedSlipStatus, setSelectedSlipStatus] = useState<string>('ALL');
  const [selectedAgeBracket, setSelectedAgeBracket] = useState<string>('ALL');
  const [selectedCaste, setSelectedCaste] = useState<string>('ALL');
  const [selectedScheme, setSelectedScheme] = useState<string>('ALL');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Sorting state
  const [sortField, setSortField] = useState<string>('epicNumber');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Table selection & pagination
  const [selectedVoterIds, setSelectedVoterIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  // Enquiry Modal state
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [enquiryForm, setEnquiryForm] = useState({
    purpose: 'Targeted Demographics Extraction',
    boothRange: 'Booths 101-108',
    specificCriteria: 'Senior citizens (>60) with family head mapping',
    contactNumber: '+91 98220 99000'
  });

  // Filtered & Sorted Voters
  const filteredVoters = useMemo(() => {
    let result = MOCK_VOTERS.filter((v) => {
      const matchSearch =
        v.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.epicNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.mobile.includes(searchTerm);

      const matchBooth = selectedBooth === 'ALL' || v.boothNumber.toString() === selectedBooth;
      const matchGender = selectedGender === 'ALL' || v.gender === selectedGender;
      const matchLeaning = selectedLeaning === 'ALL' || v.politicalLeaning === selectedLeaning;
      const matchSlip = selectedSlipStatus === 'ALL' || v.voterSlipStatus === selectedSlipStatus;

      // Age bracket filter
      let matchAge = true;
      if (selectedAgeBracket === '18-25') matchAge = v.age >= 18 && v.age <= 25;
      else if (selectedAgeBracket === '26-40') matchAge = v.age >= 26 && v.age <= 40;
      else if (selectedAgeBracket === '41-60') matchAge = v.age >= 41 && v.age <= 60;
      else if (selectedAgeBracket === '60+') matchAge = v.age > 60;

      // Caste filter
      const matchCaste = selectedCaste === 'ALL' || (v.caste && v.caste.toLowerCase().includes(selectedCaste.toLowerCase()));

      // Scheme filter
      const matchScheme = selectedScheme === 'ALL' || (v.schemeBeneficiary && v.schemeBeneficiary.some(s => s.toLowerCase().includes(selectedScheme.toLowerCase())));

      return matchSearch && matchBooth && matchGender && matchLeaning && matchSlip && matchAge && matchCaste && matchScheme;
    });

    // Sort results
    result.sort((a, b) => {
      let aVal = (a as any)[sortField];
      let bVal = (b as any)[sortField];
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [searchTerm, selectedBooth, selectedGender, selectedLeaning, selectedSlipStatus, selectedAgeBracket, selectedCaste, selectedScheme, sortField, sortDirection]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Pagination slice
  const totalPages = Math.ceil(filteredVoters.length / itemsPerPage) || 1;
  const paginatedVoters = filteredVoters.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const toggleSelectAll = () => {
    if (selectedVoterIds.length === paginatedVoters.length) {
      setSelectedVoterIds([]);
    } else {
      setSelectedVoterIds(paginatedVoters.map((v) => v.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedVoterIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Export CSV Handler
  const handleExportCSV = () => {
    const headers = ["EPIC", "Full Name", "Relation", "Gender", "Age", "Booth", "Serial", "Mobile", "Leaning", "Voter Slip"];
    const rows = filteredVoters.map(v => [
      v.epicNumber,
      `"${v.fullName}"`,
      `"${v.relativeName}"`,
      v.gender,
      v.age,
      v.boothNumber,
      v.serialNo,
      v.mobile,
      v.politicalLeaning,
      v.voterSlipStatus
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Indata_Voters_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Successfully exported ${filteredVoters.length} voter records to CSV.`, 'success');
  };

  const handleEnquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowEnquiryModal(false);
    showToast('Voter Data Customization Enquiry submitted to Super Admin desk.', 'success');
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Electoral Board
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-brand-700 border border-brand-200">
              ECI Formatted Roll
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 mt-1">
            Total Voters Master Directory
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Searchable, verified electoral roll with political leaning, slip distribution, and household relationships.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Customized Voter Data Enquiry */}
          <button
            onClick={() => setShowEnquiryModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5 text-brand-600" />
            <span>Custom Data Enquiry</span>
          </button>

          {/* Export CSV Button */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV ({filteredVoters.length})</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        {/* Row 1: Primary Search & Quick Filters */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
          {/* Search Input */}
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by voter name, EPIC, or mobile..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500 focus:bg-white"
            />
          </div>

          {/* Booth Selector */}
          <div>
            <select
              value={selectedBooth}
              onChange={(e) => {
                setSelectedBooth(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:ring-2 focus:ring-brand-500"
            >
              <option value="ALL">All Polling Booths</option>
              {MOCK_BOOTHS.map((b) => (
                <option key={b.boothNumber} value={b.boothNumber.toString()}>
                  Booth #{b.boothNumber} ({b.locality.slice(0, 16)}...)
                </option>
              ))}
            </select>
          </div>

          {/* Leaning Filter */}
          <div>
            <select
              value={selectedLeaning}
              onChange={(e) => {
                setSelectedLeaning(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:ring-2 focus:ring-brand-500"
            >
              <option value="ALL">All Leanings</option>
              <option value="STRONG_SUPPORTER">Strong Supporter</option>
              <option value="LEANING_SUPPORTER">Leaning Supporter</option>
              <option value="NEUTRAL">Neutral / Swing</option>
              <option value="LEANING_OPPOSITION">Leaning Opposition</option>
            </select>
          </div>

          {/* Slip Status Filter */}
          <div>
            <select
              value={selectedSlipStatus}
              onChange={(e) => {
                setSelectedSlipStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:ring-2 focus:ring-brand-500"
            >
              <option value="ALL">All Slip Statuses</option>
              <option value="DELIVERED">Delivered</option>
              <option value="PRINTED">Printed</option>
              <option value="GENERATED">Generated</option>
              <option value="NOT_GENERATED">Not Generated</option>
            </select>
          </div>

          {/* Toggle Advanced Filters Button */}
          <div>
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`w-full py-2 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-colors ${
                showAdvancedFilters || selectedGender !== 'ALL' || selectedAgeBracket !== 'ALL' || selectedCaste !== 'ALL' || selectedScheme !== 'ALL'
                  ? 'bg-brand-50 border-brand-300 text-brand-700'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>More Filters {(selectedGender !== 'ALL' || selectedAgeBracket !== 'ALL' || selectedCaste !== 'ALL' || selectedScheme !== 'ALL') ? '(Active)' : ''}</span>
            </button>
          </div>
        </div>

        {/* Row 2: Advanced Demographic Filters (Collapsible / Toggleable) */}
        {showAdvancedFilters && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-slate-100 animate-fade-in text-xs">
            {/* Gender Filter */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">Gender</label>
              <select
                value={selectedGender}
                onChange={(e) => { setSelectedGender(e.target.value); setCurrentPage(1); }}
                className="w-full py-2 px-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:ring-2 focus:ring-brand-500"
              >
                <option value="ALL">All Genders</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other / Third Gender</option>
              </select>
            </div>

            {/* Age Bracket */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">Age Bracket</label>
              <select
                value={selectedAgeBracket}
                onChange={(e) => { setSelectedAgeBracket(e.target.value); setCurrentPage(1); }}
                className="w-full py-2 px-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:ring-2 focus:ring-brand-500"
              >
                <option value="ALL">All Age Groups</option>
                <option value="18-25">18 - 25 Yrs (Youth First-Time)</option>
                <option value="26-40">26 - 40 Yrs (Working Core)</option>
                <option value="41-60">41 - 60 Yrs (Mature / Heads)</option>
                <option value="60+">60+ Yrs (Senior Citizens)</option>
              </select>
            </div>

            {/* Caste / Community */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">Caste / Community</label>
              <select
                value={selectedCaste}
                onChange={(e) => { setSelectedCaste(e.target.value); setCurrentPage(1); }}
                className="w-full py-2 px-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:ring-2 focus:ring-brand-500"
              >
                <option value="ALL">All Caste Groups</option>
                <option value="Maratha">Maratha</option>
                <option value="Brahmin">Brahmin</option>
                <option value="OBC">OBC (Mali, Vanjari, Dhangar)</option>
                <option value="SC">SC (Neo-Buddhist / Matang)</option>
                <option value="Muslim">Muslim</option>
                <option value="Jain">Jain / Marwari</option>
              </select>
            </div>

            {/* Welfare Scheme */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">Beneficiary Scheme</label>
              <select
                value={selectedScheme}
                onChange={(e) => { setSelectedScheme(e.target.value); setCurrentPage(1); }}
                className="w-full py-2 px-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:ring-2 focus:ring-brand-500"
              >
                <option value="ALL">All Schemes</option>
                <option value="Ladki Bahin">Majhi Ladki Bahin</option>
                <option value="Jan Arogya">Jan Arogya Yojana</option>
                <option value="PM Awas">PM Awas Yojana</option>
                <option value="Sanjay Gandhi">Sanjay Gandhi Niradhar</option>
              </select>
            </div>
          </div>
        )}

        {/* Bulk Action Bar (when rows are selected) */}
        {selectedVoterIds.length > 0 && (
          <div className="p-2.5 bg-brand-50 border border-brand-200 rounded-xl flex items-center justify-between text-xs animate-slide-in">
            <span className="font-semibold text-brand-900">
              {selectedVoterIds.length} voter(s) selected
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  showToast(`Batch queued: ${selectedVoterIds.length} voter slips generated for printing.`, 'info');
                }}
                className="px-3 py-1 bg-white hover:bg-brand-100 text-brand-700 font-bold rounded-lg border border-brand-300 transition-colors flex items-center gap-1"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Batch Print Slips</span>
              </button>
              <button
                onClick={() => setSelectedVoterIds([])}
                className="px-2 py-1 text-slate-500 hover:text-slate-800 font-medium"
              >
                Clear Selection
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Voters Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px] select-none">
                <th className="py-3 px-3 w-8">
                  <button onClick={toggleSelectAll} className="p-0.5 text-slate-400 hover:text-slate-700">
                    {selectedVoterIds.length === paginatedVoters.length && paginatedVoters.length > 0 ? (
                      <CheckSquare className="w-4 h-4 text-brand-600" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th
                  onClick={() => handleSort('epicNumber')}
                  className="py-3 px-3 cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>EPIC / Part-Sr</span>
                    {sortField === 'epicNumber' ? (
                      sortDirection === 'asc' ? <ArrowUp className="w-3 h-3 text-brand-600" /> : <ArrowDown className="w-3 h-3 text-brand-600" />
                    ) : (
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    )}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('fullName')}
                  className="py-3 px-3 cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Voter Name & Relation</span>
                    {sortField === 'fullName' ? (
                      sortDirection === 'asc' ? <ArrowUp className="w-3 h-3 text-brand-600" /> : <ArrowDown className="w-3 h-3 text-brand-600" />
                    ) : (
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    )}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('age')}
                  className="py-3 px-3 cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Age / Gender</span>
                    {sortField === 'age' ? (
                      sortDirection === 'asc' ? <ArrowUp className="w-3 h-3 text-brand-600" /> : <ArrowDown className="w-3 h-3 text-brand-600" />
                    ) : (
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    )}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('boothNumber')}
                  className="py-3 px-3 cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Booth # & Station</span>
                    {sortField === 'boothNumber' ? (
                      sortDirection === 'asc' ? <ArrowUp className="w-3 h-3 text-brand-600" /> : <ArrowDown className="w-3 h-3 text-brand-600" />
                    ) : (
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    )}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('politicalLeaning')}
                  className="py-3 px-3 cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Political Leaning</span>
                    {sortField === 'politicalLeaning' ? (
                      sortDirection === 'asc' ? <ArrowUp className="w-3 h-3 text-brand-600" /> : <ArrowDown className="w-3 h-3 text-brand-600" />
                    ) : (
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    )}
                  </div>
                </th>
                <th className="py-3 px-3">Caste & Schemes</th>
                <th
                  onClick={() => handleSort('voterSlipStatus')}
                  className="py-3 px-3 cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Slip Status</span>
                    {sortField === 'voterSlipStatus' ? (
                      sortDirection === 'asc' ? <ArrowUp className="w-3 h-3 text-brand-600" /> : <ArrowDown className="w-3 h-3 text-brand-600" />
                    ) : (
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    )}
                  </div>
                </th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {paginatedVoters.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400 text-xs">
                    No voters match the selected filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedVoters.map((v) => {
                  const isSelected = selectedVoterIds.includes(v.id);
                  return (
                    <tr
                      key={v.id}
                      className={`hover:bg-slate-50 transition-colors ${isSelected ? 'bg-brand-50/30' : ''}`}
                    >
                      <td className="py-3 px-3">
                        <button onClick={() => toggleSelectOne(v.id)} className="p-0.5 text-slate-400 hover:text-slate-700">
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-brand-600" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                      <td className="py-3 px-3 font-mono">
                        <span className="font-bold text-brand-700 block">{v.epicNumber}</span>
                        <span className="text-[10px] text-slate-400">Part {v.partNo} • Sr {v.serialNo}</span>
                      </td>
                      <td className="py-3 px-3">
                        <button
                          onClick={() => onSelectVoter(v)}
                          className="font-bold text-slate-900 hover:text-brand-600 text-left block"
                        >
                          {v.fullName}
                        </button>
                        <span className="text-[11px] text-slate-500">
                          {v.relationType}: {v.relativeName}
                        </span>
                        {v.isInfluencer && (
                          <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded text-[9px] font-bold bg-purple-100 text-purple-700">
                            Key Influencer
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-semibold text-slate-800">{v.age} Yrs</span>
                        <span className="text-[11px] text-slate-400 block">{v.gender}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-bold text-slate-800">Booth #{v.boothNumber}</span>
                        <span className="text-[11px] text-slate-500 block truncate max-w-[160px]">
                          {v.pollingStation}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          v.politicalLeaning === 'STRONG_SUPPORTER'
                            ? 'bg-emerald-100 text-emerald-800'
                            : v.politicalLeaning === 'LEANING_SUPPORTER'
                            ? 'bg-teal-100 text-teal-800'
                            : v.politicalLeaning === 'NEUTRAL'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {v.politicalLeaning.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-xs font-medium text-slate-800 block">{v.caste}</span>
                        <span className="text-[10px] text-slate-500">
                          {v.schemeBeneficiary && v.schemeBeneficiary.length > 0
                            ? v.schemeBeneficiary[0]
                            : 'No central scheme'}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          v.voterSlipStatus === 'DELIVERED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : v.voterSlipStatus === 'PRINTED'
                            ? 'bg-blue-100 text-blue-800'
                            : v.voterSlipStatus === 'GENERATED'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {v.voterSlipStatus.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onOpenVoterSlip(v)}
                            className="p-1.5 text-slate-500 hover:text-brand-600 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Generate / Print Voter Slip"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onSelectVoter(v)}
                            className="p-1.5 text-slate-500 hover:text-brand-600 hover:bg-slate-100 rounded-lg transition-colors"
                            title="View Central Voter 360 Profile"
                          >
                            <Eye className="w-4 h-4" />
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

        {/* Pagination Bar */}
        <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 bg-slate-50">
          <div className="flex items-center gap-3">
            <span>
              Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
              {Math.min(currentPage * itemsPerPage, filteredVoters.length)} of {filteredVoters.length} voters
            </span>
            <div className="flex items-center gap-1.5 pl-3 border-l border-slate-200">
              <span>Per page:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="py-1 px-2 rounded-lg bg-white border border-slate-200 font-semibold text-slate-700"
              >
                <option value={8}>8</option>
                <option value={15}>15</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="px-2 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 font-semibold"
            >
              First
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-semibold text-slate-700 px-1">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="px-2 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 font-semibold"
            >
              Last
            </button>
          </div>
        </div>
      </div>

      {/* Customized Voter Data Enquiry Modal */}
      {showEnquiryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full border border-slate-200 overflow-hidden p-6 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Custom Voter Data Enquiry</h3>
                <p className="text-xs text-slate-500">Request specialized roll extraction or custom demographic clustering.</p>
              </div>
              <button
                onClick={() => setShowEnquiryModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEnquirySubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Enquiry Purpose</label>
                <input
                  type="text"
                  required
                  value={enquiryForm.purpose}
                  onChange={(e) => setEnquiryForm({ ...enquiryForm, purpose: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Booth Range / Localities</label>
                <input
                  type="text"
                  required
                  value={enquiryForm.boothRange}
                  onChange={(e) => setEnquiryForm({ ...enquiryForm, boothRange: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Specific Demographic Criteria</label>
                <textarea
                  rows={3}
                  required
                  value={enquiryForm.specificCriteria}
                  onChange={(e) => setEnquiryForm({ ...enquiryForm, specificCriteria: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-[11px] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                <span>
                  Per election compliance guidelines, voter creation or direct editing is restricted. Custom data is delivered as analytical reports.
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEnquiryModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl transition-colors shadow-sm"
                >
                  Submit Enquiry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
