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
  SlidersHorizontal,
  RefreshCw,
  Users,
  UserCheck,
  Building2,
  Layers,
  MapPin,
  Phone,
  Calendar,
  Home,
  CheckCircle2,
  XCircle,
  Heart,
  HelpCircle as HelpHand,
  Gift,
  Plus,
  MoreVertical,
  Check
} from 'lucide-react';
import { Voter } from '../../types';
import { MOCK_VOTERS, MOCK_BOOTHS } from '../../data/mockData';
import { useToast } from '../../components/common/Toast';

interface TotalVotersViewProps {
  onSelectVoter: (voter: Voter) => void;
  onOpenVoterSlip: (voter: Voter) => void;
}

// Quick Filter Card Definition
interface QuickFilterCard {
  id: string;
  label: string;
  count: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
}

export const TotalVotersView: React.FC<TotalVotersViewProps> = ({
  onSelectVoter,
  onOpenVoterSlip
}) => {
  const { showToast } = useToast();

  // Active quick filter selection
  const [activeQuickFilter, setActiveQuickFilter] = useState<string>('total');

  // Search input state
  const [searchTerm, setSearchTerm] = useState('');

  // Toggle for Advanced Filters section (default expanded as in reference image)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(true);

  // Advanced Filter Form State matching the reference image inputs
  const [filters, setFilters] = useState({
    // Personal Details
    voterName: '',
    surname: '',
    gender: 'ALL',
    ageFrom: '',
    ageTo: '',
    dobMonth: 'ALL',
    // Location
    prabhaag: 'ALL',
    gan: 'ALL',
    electoralPart: 'ALL',
    boothNo: 'ALL',
    houseNo: '',
    address: '',
    // Contact & Status
    hasMobile: false,
    votingStatus: 'ALL', // ALL | VOTED | NON_VOTED
    visitStatus: 'ALL',  // ALL | VISITED | NOT_VISITED
    printedStatus: 'ALL', // ALL | PRINTED | NOT_PRINTED
    helped: 'ALL',       // ALL | YES | NO
    favorites: 'ALL',    // ALL | YES | NO
    deceased: 'ALL',     // ALL | YES | NO
    outside: 'ALL',      // ALL | YES | NO
    // Work / Category
    karyakarta: 'ALL',
    occupation: 'ALL',
    caste: 'ALL',
    qualification: 'ALL',
    scheme: 'ALL'
  });

  // Table selection & pagination
  const [selectedVoterIds, setSelectedVoterIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Add Voter Modal state
  const [showAddVoterModal, setShowAddVoterModal] = useState(false);
  const [newVoterForm, setNewVoterForm] = useState({
    fullName: '',
    relativeName: '',
    gender: 'MALE' as 'MALE' | 'FEMALE',
    age: '',
    epicNumber: '',
    mobile: '',
    boothNumber: '101',
    address: ''
  });

  // SMS Modal State
  const [showSmsModal, setShowSmsModal] = useState(false);
  const [smsMessage, setSmsMessage] = useState('Namaskar, please cast your vote for Adv. Vikram Patil in the upcoming elections at your assigned booth.');

  // Quick Filter Cards data matching the 24 cards in the screenshot
  const quickFilterCards: QuickFilterCard[] = [
    { id: 'total', label: 'Total Voters', count: '2,48,650', icon: Users, iconBg: 'bg-blue-50', iconColor: 'text-blue-600' },
    { id: 'male', label: 'Male', count: '1,27,560', icon: Users, iconBg: 'bg-indigo-50', iconColor: 'text-indigo-600' },
    { id: 'female', label: 'Female', count: '1,21,090', icon: Users, iconBg: 'bg-pink-50', iconColor: 'text-pink-600' },
    { id: 'alphabets', label: 'Name Alphabet', count: '26', icon: Tag, iconBg: 'bg-purple-50', iconColor: 'text-purple-600' },
    { id: 'prabhaag', label: 'Prabhaag', count: '12', icon: Building2, iconBg: 'bg-cyan-50', iconColor: 'text-cyan-600' },
    { id: 'gan', label: 'Gan', count: '8', icon: Layers, iconBg: 'bg-amber-50', iconColor: 'text-amber-600' },
    { id: 'parts', label: 'Electoral Part', count: '325', icon: Layers, iconBg: 'bg-blue-50', iconColor: 'text-blue-600' },
    { id: 'karyakarta', label: 'Karyakarta', count: '4,850', icon: UserCheck, iconBg: 'bg-purple-50', iconColor: 'text-purple-600' },
    { id: 'booth', label: 'Booth No', count: '2,045', icon: Building2, iconBg: 'bg-blue-50', iconColor: 'text-blue-600' },
    { id: 'mobile', label: 'Mobile', count: '1,86,430', icon: Phone, iconBg: 'bg-cyan-50', iconColor: 'text-cyan-600' },
    { id: 'dob', label: 'DOB / Month', count: '2,48,650', icon: Calendar, iconBg: 'bg-rose-50', iconColor: 'text-rose-600' },
    { id: 'surname', label: 'Surname', count: '89,540', icon: Users, iconBg: 'bg-indigo-50', iconColor: 'text-indigo-600' },
    { id: 'voted', label: 'Voted', count: '1,40,320', icon: CheckCircle2, iconBg: 'bg-blue-50', iconColor: 'text-blue-600' },
    { id: 'non_voted', label: 'Non Voted', count: '1,08,330', icon: XCircle, iconBg: 'bg-rose-50', iconColor: 'text-rose-600' },
    { id: 'visited', label: 'Visited', count: '72,450', icon: Eye, iconBg: 'bg-cyan-50', iconColor: 'text-cyan-600' },
    { id: 'favorites', label: 'Favorites', count: '12,680', icon: Heart, iconBg: 'bg-rose-50', iconColor: 'text-rose-600' },
    { id: 'helped', label: 'Helped', count: '6,240', icon: HelpHand, iconBg: 'bg-amber-50', iconColor: 'text-amber-600' },
    { id: 'address', label: 'Address', count: '2,48,650', icon: MapPin, iconBg: 'bg-cyan-50', iconColor: 'text-cyan-600' },
    { id: 'outside', label: 'Outside', count: '1,860', icon: Share2, iconBg: 'bg-amber-50', iconColor: 'text-amber-600' },
    { id: 'printed', label: 'Printed', count: '1,92,430', icon: Printer, iconBg: 'bg-purple-50', iconColor: 'text-purple-600' },
    { id: 'deceased', label: 'Deceased', count: '320', icon: AlertCircle, iconBg: 'bg-slate-100', iconColor: 'text-slate-600' },
    { id: 'house', label: 'House No', count: '2,48,650', icon: Home, iconBg: 'bg-amber-50', iconColor: 'text-amber-600' },
    { id: 'schemes', label: 'Schemes', count: '98,760', icon: Gift, iconBg: 'bg-blue-50', iconColor: 'text-blue-600' }
  ];

  // Filtering Logic combining Quick Filters + Search + Advanced Filters
  const filteredVoters = useMemo(() => {
    return MOCK_VOTERS.filter((v) => {
      // 1. Quick filter condition
      if (activeQuickFilter === 'male' && v.gender !== 'MALE') return false;
      if (activeQuickFilter === 'female' && v.gender !== 'FEMALE') return false;
      if (activeQuickFilter === 'mobile' && (!v.mobile || v.mobile.trim() === '')) return false;
      if (activeQuickFilter === 'voted' && !v.hasVoted) return false;
      if (activeQuickFilter === 'non_voted' && v.hasVoted) return false;
      if (activeQuickFilter === 'visited' && !v.isVisited) return false;
      if (activeQuickFilter === 'favorites' && !v.isFavorite) return false;
      if (activeQuickFilter === 'helped' && !v.isHelped) return false;
      if (activeQuickFilter === 'deceased' && !v.isDeceased) return false;
      if (activeQuickFilter === 'outside' && !v.isOutside) return false;
      if (activeQuickFilter === 'printed' && v.voterSlipStatus !== 'PRINTED' && v.voterSlipStatus !== 'DELIVERED') return false;
      if (activeQuickFilter === 'schemes' && (!v.schemeBeneficiary || v.schemeBeneficiary.length === 0)) return false;

      // 2. Search box condition (voter name, EPIC ID, booth number, phone)
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const matchName = v.fullName.toLowerCase().includes(query);
        const matchEpic = v.epicNumber.toLowerCase().includes(query);
        const matchMobile = v.mobile.includes(query);
        const matchBooth = v.boothNumber.toString().includes(query);
        const matchRelative = v.relativeName.toLowerCase().includes(query);
        if (!matchName && !matchEpic && !matchMobile && !matchBooth && !matchRelative) {
          return false;
        }
      }

      // 3. Advanced Filters
      if (filters.voterName.trim() !== '') {
        if (!v.fullName.toLowerCase().includes(filters.voterName.toLowerCase())) return false;
      }
      if (filters.surname.trim() !== '') {
        const parts = v.fullName.split(' ');
        const surname = parts[parts.length - 1];
        if (!surname.toLowerCase().includes(filters.surname.toLowerCase())) return false;
      }
      if (filters.gender !== 'ALL') {
        if (v.gender !== filters.gender) return false;
      }
      if (filters.ageFrom !== '') {
        if (v.age < parseInt(filters.ageFrom, 10)) return false;
      }
      if (filters.ageTo !== '') {
        if (v.age > parseInt(filters.ageTo, 10)) return false;
      }
      if (filters.dobMonth !== 'ALL') {
        const month = new Date(v.dob).getMonth() + 1;
        if (month.toString() !== filters.dobMonth) return false;
      }

      if (filters.prabhaag !== 'ALL') {
        if (!v.prabhaag.includes(filters.prabhaag)) return false;
      }
      if (filters.gan !== 'ALL') {
        if (v.gan !== filters.gan) return false;
      }
      if (filters.electoralPart !== 'ALL') {
        if (v.partNo.toString() !== filters.electoralPart) return false;
      }
      if (filters.boothNo !== 'ALL') {
        if (v.boothNumber.toString() !== filters.boothNo) return false;
      }
      if (filters.houseNo.trim() !== '') {
        if (!v.houseNo || !v.houseNo.toLowerCase().includes(filters.houseNo.toLowerCase())) return false;
      }
      if (filters.address.trim() !== '') {
        if (!v.address.toLowerCase().includes(filters.address.toLowerCase())) return false;
      }

      if (filters.hasMobile && (!v.mobile || v.mobile.trim() === '')) return false;

      if (filters.votingStatus === 'VOTED' && !v.hasVoted) return false;
      if (filters.votingStatus === 'NON_VOTED' && v.hasVoted) return false;

      if (filters.visitStatus === 'VISITED' && !v.isVisited) return false;
      if (filters.visitStatus === 'NOT_VISITED' && v.isVisited) return false;

      if (filters.printedStatus === 'PRINTED' && v.voterSlipStatus !== 'PRINTED' && v.voterSlipStatus !== 'DELIVERED') return false;
      if (filters.printedStatus === 'NOT_PRINTED' && (v.voterSlipStatus === 'PRINTED' || v.voterSlipStatus === 'DELIVERED')) return false;

      if (filters.helped === 'YES' && !v.isHelped) return false;
      if (filters.helped === 'NO' && v.isHelped) return false;

      if (filters.favorites === 'YES' && !v.isFavorite) return false;
      if (filters.favorites === 'NO' && v.isFavorite) return false;

      if (filters.deceased === 'YES' && !v.isDeceased) return false;
      if (filters.deceased === 'NO' && v.isDeceased) return false;

      if (filters.outside === 'YES' && !v.isOutside) return false;
      if (filters.outside === 'NO' && v.isOutside) return false;

      if (filters.karyakarta !== 'ALL') {
        if (v.karyakartaName !== filters.karyakarta) return false;
      }
      if (filters.occupation !== 'ALL') {
        if (!v.occupation.toLowerCase().includes(filters.occupation.toLowerCase())) return false;
      }
      if (filters.caste !== 'ALL') {
        if (!v.caste.toLowerCase().includes(filters.caste.toLowerCase())) return false;
      }
      if (filters.qualification !== 'ALL') {
        if (v.qualification !== filters.qualification) return false;
      }
      if (filters.scheme !== 'ALL') {
        if (!v.schemeBeneficiary || !v.schemeBeneficiary.some(s => s.toLowerCase().includes(filters.scheme.toLowerCase()))) return false;
      }

      return true;
    });
  }, [activeQuickFilter, searchTerm, filters]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredVoters.length / itemsPerPage) || 1;
  const paginatedVoters = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredVoters.slice(start, start + itemsPerPage);
  }, [filteredVoters, currentPage, itemsPerPage]);

  const activeAdvancedFilterCount = useMemo(() => {
    let count = 0;
    if (filters.voterName) count++;
    if (filters.surname) count++;
    if (filters.gender !== 'ALL') count++;
    if (filters.ageFrom) count++;
    if (filters.ageTo) count++;
    if (filters.dobMonth !== 'ALL') count++;
    if (filters.prabhaag !== 'ALL') count++;
    if (filters.gan !== 'ALL') count++;
    if (filters.electoralPart !== 'ALL') count++;
    if (filters.boothNo !== 'ALL') count++;
    if (filters.houseNo) count++;
    if (filters.address) count++;
    if (filters.hasMobile) count++;
    if (filters.votingStatus !== 'ALL') count++;
    if (filters.visitStatus !== 'ALL') count++;
    if (filters.printedStatus !== 'ALL') count++;
    if (filters.helped !== 'ALL') count++;
    if (filters.favorites !== 'ALL') count++;
    if (filters.deceased !== 'ALL') count++;
    if (filters.outside !== 'ALL') count++;
    if (filters.karyakarta !== 'ALL') count++;
    if (filters.occupation !== 'ALL') count++;
    if (filters.caste !== 'ALL') count++;
    if (filters.qualification !== 'ALL') count++;
    if (filters.scheme !== 'ALL') count++;
    return count;
  }, [filters]);

  const handleResetFilters = () => {
    setFilters({
      voterName: '',
      surname: '',
      gender: 'ALL',
      ageFrom: '',
      ageTo: '',
      dobMonth: 'ALL',
      prabhaag: 'ALL',
      gan: 'ALL',
      electoralPart: 'ALL',
      boothNo: 'ALL',
      houseNo: '',
      address: '',
      hasMobile: false,
      votingStatus: 'ALL',
      visitStatus: 'ALL',
      printedStatus: 'ALL',
      helped: 'ALL',
      favorites: 'ALL',
      deceased: 'ALL',
      outside: 'ALL',
      karyakarta: 'ALL',
      occupation: 'ALL',
      caste: 'ALL',
      qualification: 'ALL',
      scheme: 'ALL'
    });
    setSearchTerm('');
    setActiveQuickFilter('total');
    setCurrentPage(1);
    showToast('All voter filters have been reset.', 'info');
  };

  const handleApplyFilters = () => {
    setCurrentPage(1);
    showToast(`Filters applied. Showing ${filteredVoters.length} matching voters.`, 'success');
  };

  const handleRefresh = () => {
    showToast('Electoral roll synchronized with central database.', 'info');
  };

  // Selection handlers
  const toggleSelectAll = () => {
    if (selectedVoterIds.length === paginatedVoters.length && paginatedVoters.length > 0) {
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
    const listToExport = selectedVoterIds.length > 0
      ? filteredVoters.filter(v => selectedVoterIds.includes(v.id))
      : filteredVoters;

    const headers = ["ID", "Voter Name", "Relative Name", "Age", "Gender", "EPIC", "Mobile", "Booth No", "Karyakarta", "Address"];
    const rows = listToExport.map(v => [
      v.voterCode || v.id,
      `"${v.fullName}"`,
      `"${v.relativeName}"`,
      v.age,
      v.gender,
      v.epicNumber,
      v.mobile,
      `#${v.boothNumber}`,
      `"${v.karyakartaName || 'Vikas M. Patil'}"`,
      `"${v.address}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Total_Voters_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Exported ${listToExport.length} voters to CSV successfully.`, 'success');
  };

  // SMS Handler
  const handleSendSms = () => {
    const count = selectedVoterIds.length > 0 ? selectedVoterIds.length : filteredVoters.length;
    setShowSmsModal(false);
    showToast(`Campaign SMS broadcast queued for ${count} voters.`, 'success');
  };

  // Add Voter Submit
  const handleAddVoterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowAddVoterModal(false);
    showToast(`New elector ${newVoterForm.fullName} registered into Booth #${newVoterForm.boothNumber}.`, 'success');
  };

  return (
    <div className="space-y-4 pb-12 animate-fade-in text-slate-800">
      {/* 1. Header Bar with Breadcrumb and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-wider">
              Voter Intelligence
            </span>
            <span className="text-slate-400 text-xs">/</span>
            <span className="text-xs font-semibold text-slate-600">Total Voters</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
            Total Voters
          </h1>
          <p className="text-xs text-slate-500">
            View, search and filter voter records with quick filters and advanced conditions.
          </p>
        </div>

        {/* Top-Right Action Group */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Total Count Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50/80 border border-blue-100 rounded-xl text-xs font-bold text-blue-700">
            <Users className="w-3.5 h-3.5" />
            <span>2,48,650 Total Voters</span>
          </div>

          {/* Refresh Action */}
          <button
            onClick={handleRefresh}
            className="flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-xs border border-slate-200 transition-colors shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            <span>Refresh</span>
          </button>

          {/* Send SMS Action */}
          <button
            onClick={() => setShowSmsModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-xs border border-slate-200 transition-colors shadow-xs"
          >
            <Send className="w-3.5 h-3.5 text-blue-600" />
            <span>Send SMS</span>
          </button>

          {/* Export Dropdown / Button */}
          <div className="relative inline-block">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-xs border border-slate-200 transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
          </div>

          {/* Add Voter Button */}
          <button
            onClick={() => setShowAddVoterModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Voter</span>
          </button>
        </div>
      </div>

      {/* 2. Quick Filters Box (Grid of 24 Clickable Cards) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-5 h-5 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Filter className="w-3 h-3" />
          </div>
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Quick Filters</h2>
          <span className="text-[11px] text-slate-400 font-normal">
            Click any card to filter voters by common attributes.
          </span>
        </div>

        {/* 24 Cards Grid: 8 columns on large screens, responsive on mobile */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2.5">
          {quickFilterCards.map((card) => {
            const Icon = card.icon;
            const isSelected = activeQuickFilter === card.id;
            return (
              <button
                key={card.id}
                onClick={() => {
                  setActiveQuickFilter(card.id);
                  setCurrentPage(1);
                  showToast(`Filtered by ${card.label}.`, 'info');
                }}
                className={`flex items-start gap-2.5 p-2 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/40 shadow-xs ring-1 ring-blue-500/20'
                    : 'border-slate-100 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                }`}
              >
                <div className={`w-7 h-7 rounded-lg ${card.iconBg} ${card.iconColor} flex items-center justify-center shrink-0`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] text-slate-500 font-medium block truncate leading-tight">
                    {card.label}
                  </span>
                  <span className="text-xs font-black text-slate-900 block leading-tight font-mono mt-0.5">
                    {card.count}
                  </span>
                  <span className="text-[9px] font-semibold text-blue-600 block mt-0.5 leading-none">
                    Click to Filter
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Search Bar and Filter Controls Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        {/* Search Voters Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search voters by name, EPIC ID, booth number, phone..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-xs"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filters Count Pill */}
        <button
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs transition-colors"
        >
          <Filter className="w-3.5 h-3.5 text-blue-600" />
          <span>Filters:</span>
          <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 font-bold text-[10px] flex items-center justify-center">
            {activeAdvancedFilterCount}
          </span>
        </button>

        {/* Toggle Advanced Filters Button */}
        <button
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs transition-colors"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
          <span>Advanced Filters</span>
          <span className={`w-3.5 h-3.5 rounded-full border border-slate-300 inline-flex items-center justify-center transition-colors ${showAdvancedFilters ? 'bg-blue-600 border-blue-600 text-white' : ''}`}>
            {showAdvancedFilters && <Check className="w-2.5 h-2.5" />}
          </span>
        </button>
      </div>

      {/* 4. Advanced Filters Card (Collapsible) */}
      {showAdvancedFilters && (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-4 animate-fadeIn">
          {/* Header of Advanced Filters with Less Filters Toggle */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-orange-500" />
              <h3 className="text-xs font-bold text-slate-900">Advanced Filters</h3>
              <span className="text-[11px] text-slate-400 font-normal">
                Use multiple conditions to narrow down the voter list.
              </span>
            </div>
            <button
              onClick={() => setShowAdvancedFilters(false)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1"
            >
              <span>— Less Filters</span>
            </button>
          </div>

          {/* Filter Rows */}
          <div className="space-y-3.5 text-xs">
            {/* Row A: Personal Details */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-2.5 items-center">
              <span className="md:col-span-1 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                Personal Details
              </span>
              <div className="md:col-span-1">
                <input
                  type="text"
                  placeholder="Enter voter name"
                  value={filters.voterName}
                  onChange={(e) => setFilters({ ...filters, voterName: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-1">
                <input
                  type="text"
                  placeholder="Enter surname"
                  value={filters.surname}
                  onChange={(e) => setFilters({ ...filters, surname: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-1">
                <select
                  value={filters.gender}
                  onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="ALL">All Genders</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                </select>
              </div>
              <div className="md:col-span-1 flex items-center gap-1.5">
                <input
                  type="number"
                  placeholder="Min age"
                  value={filters.ageFrom}
                  onChange={(e) => setFilters({ ...filters, ageFrom: e.target.value })}
                  className="w-1/2 px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Max age"
                  value={filters.ageTo}
                  onChange={(e) => setFilters({ ...filters, ageTo: e.target.value })}
                  className="w-1/2 px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-1">
                <select
                  value={filters.dobMonth}
                  onChange={(e) => setFilters({ ...filters, dobMonth: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="ALL">All Months</option>
                  <option value="1">January</option>
                  <option value="2">February</option>
                  <option value="3">March</option>
                  <option value="4">April</option>
                  <option value="5">May</option>
                  <option value="6">June</option>
                  <option value="7">July</option>
                  <option value="8">August</option>
                  <option value="9">September</option>
                  <option value="10">October</option>
                  <option value="11">November</option>
                  <option value="12">December</option>
                </select>
              </div>
            </div>

            {/* Row B: Location */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-2.5 items-center">
              <span className="md:col-span-1 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                Location
              </span>
              <div className="md:col-span-1">
                <select
                  value={filters.prabhaag}
                  onChange={(e) => setFilters({ ...filters, prabhaag: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="ALL">All Prabhaag</option>
                  <option value="Prabhaag 12">Prabhaag 12</option>
                  <option value="Prabhaag 13">Prabhaag 13</option>
                  <option value="Prabhaag 14">Prabhaag 14</option>
                </select>
              </div>
              <div className="md:col-span-1">
                <select
                  value={filters.gan}
                  onChange={(e) => setFilters({ ...filters, gan: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="ALL">All Gan</option>
                  <option value="Gan 8">Gan 8</option>
                  <option value="Gan 4">Gan 4</option>
                  <option value="Gan 2">Gan 2</option>
                </select>
              </div>
              <div className="md:col-span-1">
                <select
                  value={filters.electoralPart}
                  onChange={(e) => setFilters({ ...filters, electoralPart: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="ALL">All Parts</option>
                  <option value="325">Part 325</option>
                  <option value="101">Part 101</option>
                  <option value="103">Part 103</option>
                  <option value="104">Part 104</option>
                </select>
              </div>
              <div className="md:col-span-1">
                <select
                  value={filters.boothNo}
                  onChange={(e) => setFilters({ ...filters, boothNo: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="ALL">All Booths</option>
                  <option value="101">Booth #101</option>
                  <option value="106">Booth #106</option>
                  <option value="107">Booth #107</option>
                  <option value="108">Booth #108</option>
                </select>
              </div>
              <div className="md:col-span-1 flex gap-1.5">
                <input
                  type="text"
                  placeholder="House no."
                  value={filters.houseNo}
                  onChange={(e) => setFilters({ ...filters, houseNo: e.target.value })}
                  className="w-1/2 px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Address / locality"
                  value={filters.address}
                  onChange={(e) => setFilters({ ...filters, address: e.target.value })}
                  className="w-1/2 px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Row C: Contact & Status */}
            <div className="grid grid-cols-1 md:grid-cols-8 gap-2 items-center">
              <span className="md:col-span-1 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                Contact & Status
              </span>
              <div className="md:col-span-1 flex items-center gap-1.5">
                <label className="flex items-center gap-1.5 text-xs font-medium text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.hasMobile}
                    onChange={(e) => setFilters({ ...filters, hasMobile: e.target.checked })}
                    className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Has Mobile</span>
                </label>
              </div>
              <div className="md:col-span-1">
                <select
                  value={filters.votingStatus}
                  onChange={(e) => setFilters({ ...filters, votingStatus: e.target.value })}
                  className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                >
                  <option value="ALL">Voting: All</option>
                  <option value="VOTED">Voted</option>
                  <option value="NON_VOTED">Non Voted</option>
                </select>
              </div>
              <div className="md:col-span-1">
                <select
                  value={filters.visitStatus}
                  onChange={(e) => setFilters({ ...filters, visitStatus: e.target.value })}
                  className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                >
                  <option value="ALL">Visit: All</option>
                  <option value="VISITED">Visited</option>
                  <option value="NOT_VISITED">Not Visited</option>
                </select>
              </div>
              <div className="md:col-span-1">
                <select
                  value={filters.printedStatus}
                  onChange={(e) => setFilters({ ...filters, printedStatus: e.target.value })}
                  className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                >
                  <option value="ALL">Printed: All</option>
                  <option value="PRINTED">Printed</option>
                  <option value="NOT_PRINTED">Not Printed</option>
                </select>
              </div>
              <div className="md:col-span-1">
                <select
                  value={filters.helped}
                  onChange={(e) => setFilters({ ...filters, helped: e.target.value })}
                  className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                >
                  <option value="ALL">Helped: All</option>
                  <option value="YES">Yes</option>
                  <option value="NO">No</option>
                </select>
              </div>
              <div className="md:col-span-1">
                <select
                  value={filters.favorites}
                  onChange={(e) => setFilters({ ...filters, favorites: e.target.value })}
                  className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                >
                  <option value="ALL">Favorites: All</option>
                  <option value="YES">Yes</option>
                  <option value="NO">No</option>
                </select>
              </div>
              <div className="md:col-span-1 flex gap-1">
                <select
                  value={filters.deceased}
                  onChange={(e) => setFilters({ ...filters, deceased: e.target.value })}
                  className="w-1/2 px-1.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px]"
                >
                  <option value="ALL">Deceased</option>
                  <option value="YES">Yes</option>
                  <option value="NO">No</option>
                </select>
                <select
                  value={filters.outside}
                  onChange={(e) => setFilters({ ...filters, outside: e.target.value })}
                  className="w-1/2 px-1.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px]"
                >
                  <option value="ALL">Outside</option>
                  <option value="YES">Yes</option>
                  <option value="NO">No</option>
                </select>
              </div>
            </div>

            {/* Row D: Work / Category */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-2.5 items-center">
              <span className="md:col-span-1 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                Work / Category
              </span>
              <div className="md:col-span-1">
                <select
                  value={filters.karyakarta}
                  onChange={(e) => setFilters({ ...filters, karyakarta: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="ALL">All Karyakartas</option>
                  <option value="Vikas M. Patil">Vikas M. Patil</option>
                  <option value="Ramesh M. More">Ramesh M. More</option>
                  <option value="Ganesh K. Kulkarni">Ganesh K. Kulkarni</option>
                  <option value="Pooja S. Jadhav">Pooja S. Jadhav</option>
                  <option value="Asha V. More">Asha V. More</option>
                </select>
              </div>
              <div className="md:col-span-1">
                <select
                  value={filters.occupation}
                  onChange={(e) => setFilters({ ...filters, occupation: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="ALL">All Occupations</option>
                  <option value="Business">Business</option>
                  <option value="Homemaker">Homemaker</option>
                  <option value="Student">Student</option>
                  <option value="Private Service">Private Service</option>
                  <option value="Teacher">Teacher</option>
                  <option value="Retired">Retired</option>
                </select>
              </div>
              <div className="md:col-span-1">
                <select
                  value={filters.caste}
                  onChange={(e) => setFilters({ ...filters, caste: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="ALL">All Castes</option>
                  <option value="Maratha">Maratha</option>
                  <option value="OBC">OBC</option>
                  <option value="Brahmin">Brahmin</option>
                  <option value="SC">SC</option>
                </select>
              </div>
              <div className="md:col-span-1">
                <select
                  value={filters.qualification}
                  onChange={(e) => setFilters({ ...filters, qualification: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="ALL">All Qualifications</option>
                  <option value="Graduate">Graduate</option>
                  <option value="Post Graduate">Post Graduate</option>
                  <option value="Undergraduate">Undergraduate</option>
                  <option value="Doctorate">Doctorate</option>
                </select>
              </div>
              <div className="md:col-span-1">
                <select
                  value={filters.scheme}
                  onChange={(e) => setFilters({ ...filters, scheme: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="ALL">All Government Schemes</option>
                  <option value="Ayushman">Ayushman Bharat</option>
                  <option value="Ladki Bahin">Majhi Ladki Bahin</option>
                  <option value="PM Awas">PM Awas Yojana</option>
                  <option value="Mudra">PM Mudra Loan</option>
                </select>
              </div>
            </div>
          </div>

          {/* Action Row: Reset and Apply Filters */}
          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
            <button
              onClick={handleResetFilters}
              className="px-4 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              Reset
            </button>
            <button
              onClick={handleApplyFilters}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors shadow-xs"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Apply Filters</span>
            </button>
          </div>
        </div>
      )}

      {/* 5. Voter Results Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Table Header Bar with Counts and Table Actions */}
        <div className="p-3.5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-orange-500" />
            <h3 className="text-xs font-black text-slate-900">
              Voters ({filteredVoters.length.toLocaleString()})
            </h3>
            <span className="text-[11px] text-slate-400">
              Showing {paginatedVoters.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{' '}
              {Math.min(currentPage * itemsPerPage, filteredVoters.length)} of {filteredVoters.length.toLocaleString()} voters
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              className="flex items-center gap-1 px-2.5 py-1 text-slate-600 hover:text-slate-900 text-xs font-semibold rounded-lg border border-slate-200 transition-colors"
            >
              <RefreshCw className="w-3 h-3 text-slate-400" />
              <span>Refresh</span>
            </button>
            <button
              onClick={() => setShowSmsModal(true)}
              className="flex items-center gap-1 px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold rounded-lg border border-amber-200 transition-colors"
            >
              <Send className="w-3 h-3 text-amber-600" />
              <span>Send SMS</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1 px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors"
            >
              <Download className="w-3 h-3 text-slate-300" />
              <span>Export</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3 w-8 text-center">
                  <input
                    type="checkbox"
                    checked={selectedVoterIds.length === paginatedVoters.length && paginatedVoters.length > 0}
                    onChange={toggleSelectAll}
                    className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="py-2.5 px-3 w-28">ID</th>
                <th className="py-2.5 px-3">Voter Name & Relative</th>
                <th className="py-2.5 px-3 w-16">Age</th>
                <th className="py-2.5 px-3 w-20">Gender</th>
                <th className="py-2.5 px-3 w-28">EPIC</th>
                <th className="py-2.5 px-3 w-32">Mobile</th>
                <th className="py-2.5 px-3 w-24">Booth No</th>
                <th className="py-2.5 px-3">Karyakarta</th>
                <th className="py-2.5 px-3 text-right w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {paginatedVoters.length > 0 ? (
                paginatedVoters.map((voter) => {
                  const isSelected = selectedVoterIds.includes(voter.id);
                  const voterId = voter.voterCode || voter.id;

                  return (
                    <tr
                      key={voter.id}
                      className={`hover:bg-blue-50/30 transition-colors ${isSelected ? 'bg-blue-50/40' : ''}`}
                    >
                      <td className="py-3 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectOne(voter.id)}
                          className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>

                      {/* ID with orange highlight like screenshot */}
                      <td className="py-3 px-3 font-mono text-[11px] font-bold text-orange-500">
                        {voterId}
                      </td>

                      {/* Voter Name & Relative */}
                      <td className="py-3 px-3">
                        <button
                          onClick={() => onSelectVoter(voter)}
                          className="font-bold text-slate-900 hover:text-blue-600 text-left block transition-colors"
                        >
                          {voter.fullName}
                        </button>
                        <span className="text-[11px] text-slate-500 block">
                          {voter.relationType === 'Father' ? 'S/o' : voter.relationType === 'Husband' ? 'W/o' : 'D/o'}{' '}
                          {voter.relativeName} • {voter.address.slice(0, 24)}...
                        </span>
                      </td>

                      {/* Age */}
                      <td className="py-3 px-3 text-slate-700 font-mono text-[11px]">
                        {voter.age}
                      </td>

                      {/* Gender Badge */}
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            voter.gender === 'MALE'
                              ? 'bg-blue-50 text-blue-600 border border-blue-200'
                              : 'bg-pink-50 text-pink-600 border border-pink-200'
                          }`}
                        >
                          {voter.gender === 'MALE' ? 'Male' : 'Female'}
                        </span>
                      </td>

                      {/* EPIC */}
                      <td className="py-3 px-3 font-mono text-[11px] font-semibold text-slate-800">
                        {voter.epicNumber}
                      </td>

                      {/* Mobile */}
                      <td className="py-3 px-3 font-mono text-[11px] text-slate-600">
                        {voter.mobile || '—'}
                      </td>

                      {/* Booth No */}
                      <td className="py-3 px-3">
                        <span className="font-mono text-xs font-bold text-slate-900">
                          #{voter.boothNumber}
                        </span>
                      </td>

                      {/* Karyakarta */}
                      <td className="py-3 px-3 text-slate-700 text-xs">
                        {voter.karyakartaName || 'Vikas M. Patil'}
                      </td>

                      {/* Action Button: View + three dots */}
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onSelectVoter(voter)}
                            className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors"
                            title="View Complete Voter Profile"
                          >
                            <Eye className="w-3 h-3 text-blue-600" />
                            <span>View</span>
                          </button>
                          <button
                            onClick={() => onOpenVoterSlip(voter)}
                            className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
                            title="More Actions / Print Slip"
                          >
                            <MoreVertical className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-500">
                    <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-semibold text-xs text-slate-700">No voters found matching criteria</p>
                    <p className="text-[11px] text-slate-400 mt-1">Try resetting filters or changing your search terms.</p>
                    <button
                      onClick={handleResetFilters}
                      className="mt-3 px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-xs font-bold hover:bg-blue-100"
                    >
                      Clear All Filters
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 6. Pagination Footer */}
        <div className="p-3 bg-slate-50/70 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            Showing {paginatedVoters.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{' '}
            {Math.min(currentPage * itemsPerPage, filteredVoters.length)} of {filteredVoters.length.toLocaleString()} entries
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-1 rounded border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-slate-600" />
            </button>

            {Array.from({ length: Math.min(3, totalPages) }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-7 h-7 rounded text-xs font-bold transition-all ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {page}
              </button>
            ))}

            {totalPages > 4 && <span className="px-1 text-slate-400">...</span>}

            {totalPages > 3 && (
              <button
                onClick={() => setCurrentPage(totalPages)}
                className={`w-7 h-7 rounded text-xs font-bold transition-all ${
                  currentPage === totalPages
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {totalPages.toLocaleString()}
              </button>
            )}

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1 rounded border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-slate-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Add Voter Modal */}
      {showAddVoterModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Register New Elector</h3>
                <p className="text-xs text-slate-500">Add verified voter information into the booth register.</p>
              </div>
              <button
                onClick={() => setShowAddVoterModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddVoterSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Narayan Joshi"
                  value={newVoterForm.fullName}
                  onChange={(e) => setNewVoterForm({ ...newVoterForm, fullName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Relative Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Father / Husband Name"
                    value={newVoterForm.relativeName}
                    onChange={(e) => setNewVoterForm({ ...newVoterForm, relativeName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Gender</label>
                  <select
                    value={newVoterForm.gender}
                    onChange={(e) => setNewVoterForm({ ...newVoterForm, gender: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Age</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 35"
                    value={newVoterForm.age}
                    onChange={(e) => setNewVoterForm({ ...newVoterForm, age: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">EPIC Number</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. WXE8921029"
                    value={newVoterForm.epicNumber}
                    onChange={(e) => setNewVoterForm({ ...newVoterForm, epicNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Mobile</label>
                  <input
                    type="text"
                    placeholder="+91 98220 00000"
                    value={newVoterForm.mobile}
                    onChange={(e) => setNewVoterForm({ ...newVoterForm, mobile: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Assigned Booth</label>
                  <select
                    value={newVoterForm.boothNumber}
                    onChange={(e) => setNewVoterForm({ ...newVoterForm, boothNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    {MOCK_BOOTHS.map(b => (
                      <option key={b.boothNumber} value={b.boothNumber.toString()}>
                        Booth #{b.boothNumber} ({b.locality.slice(0, 16)})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Residential Address</label>
                <textarea
                  rows={2}
                  placeholder="Plot/Flat no, Lane, Locality, Area"
                  value={newVoterForm.address}
                  onChange={(e) => setNewVoterForm({ ...newVoterForm, address: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddVoterModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-xs"
                >
                  Save Elector
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Send SMS Modal */}
      {showSmsModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-2xl space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Broadcast Campaign SMS</h3>
                <p className="text-xs text-slate-500">
                  Target: {selectedVoterIds.length > 0 ? `${selectedVoterIds.length} Selected Voters` : `${filteredVoters.length.toLocaleString()} Filtered Voters`}
                </p>
              </div>
              <button
                onClick={() => setShowSmsModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">SMS Template / Content</label>
                <textarea
                  rows={4}
                  value={smsMessage}
                  onChange={(e) => setSmsMessage(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
                <span className="text-[10px] text-slate-400 block mt-1">
                  Supports voter tags: {'{VoterName}'}, {'{BoothNo}'}, {'{PollingStation}'}
                </span>
              </div>

              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 flex items-center gap-2">
                <Send className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="text-[11px] text-blue-800">
                  Estimated delivery cost: ₹{( (selectedVoterIds.length > 0 ? selectedVoterIds.length : filteredVoters.length) * 0.12 ).toFixed(2)} via DLT SMS Gateway.
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setShowSmsModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendSms}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-xs"
                >
                  Broadcast SMS
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
