import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Search,
  Filter,
  Download,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Eye,
  Tag,
  Share2,
  X,
  Send,
  AlertCircle,
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
  Gift,
  Plus,
  Check,
  Copy,
  RotateCcw,
  Mail,
  Hash,
  ShieldCheck,
  Info
} from 'lucide-react';
import { Voter } from '../../types';
import { MOCK_VOTERS, MOCK_BOOTHS } from '../../data/mockData';
import { useToast } from '../../components/common/Toast';
import {
  useCommunityGroups,
  COMMUNITY_GROUP_CATEGORIES,
  COMMUNITY_FILTER_OPTIONS
} from '../../services/communityGroupStore';

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

// Searchable Multi-Select Dropdown for Community / Stakeholder Groups
interface CommunityMultiSelectDropdownProps {
  selectedGroups: string[];
  onToggleGroup: (id: string) => void;
  onClearAll: () => void;
  onSelectAll: () => void;
  align?: 'left' | 'right' | 'full';
}

const OPTION_DETAILS: Record<string, { dot: string; subtitle: string }> = {
  'Agriculture': {
    dot: 'bg-emerald-500',
    subtitle: "Farmers, Krishi Vikas Sangh, irrigation & farm worker associations"
  },
  'Sugar Industry': {
    dot: 'bg-amber-500',
    subtitle: "Sugar mill staff, cane grower societies & seasonal factory personnel"
  },
  'Childcare & Community Services': {
    dot: 'bg-pink-500',
    subtitle: "Anganwadi sevikas, helpers, Balwadi teachers & community health volunteers"
  },
  'Village Community': {
    dot: 'bg-blue-500',
    subtitle: "Gram Sabha active community elders, youth mandals & village forums"
  },
  'Local Organisations': {
    dot: 'bg-purple-500',
    subtitle: "Vyapar mandals, trader guilds, market associations & RWA committees"
  },
  'Cooperatives': {
    dot: 'bg-indigo-500',
    subtitle: "Patsanstha credit societies, milk dairies & housing cooperative members"
  },
  'Self-Help Groups': {
    dot: 'bg-teal-500',
    subtitle: "Mahila Bachat Gat members, women micro-enterprise & cluster networks"
  },
  'Other': {
    dot: 'bg-slate-500',
    subtitle: "Special interest civic forums, transport unions & voluntary collectives"
  },
  'NOT_ASSOCIATED': {
    dot: 'bg-slate-400',
    subtitle: "Explicitly audited and confirmed not associated with any group"
  },
  'NOT_DISCLOSED': {
    dot: 'bg-slate-400',
    subtitle: "Information pending collection or voluntarily withheld"
  }
};

const CommunityMultiSelectDropdown: React.FC<CommunityMultiSelectDropdownProps> = ({
  selectedGroups,
  onToggleGroup,
  onClearAll,
  onSelectAll,
  align = 'left'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return COMMUNITY_FILTER_OPTIONS;
    const q = searchQuery.toLowerCase().trim();
    return COMMUNITY_FILTER_OPTIONS.filter(
      opt => opt.label.toLowerCase().includes(q) || opt.shortLabel.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  return (
    <div className={`relative ${isOpen ? 'z-50' : 'z-10'}`} ref={dropdownRef}>
      {/* Dropdown Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-left hover:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 transition-colors shadow-2xs"
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <Users className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
          {selectedGroups.length === 0 ? (
            <span className="text-slate-400 truncate">
              Select community / stakeholder groups...
            </span>
          ) : (
            <div className="flex items-center gap-1.5 flex-wrap truncate">
              <span className="px-2 py-0.5 rounded-md bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-bold text-[11px] shrink-0">
                {selectedGroups.length} Selected
              </span>
              <span className="text-slate-700 dark:text-slate-300 font-medium truncate text-xs">
                {selectedGroups.map(id => {
                  const opt = COMMUNITY_FILTER_OPTIONS.find(o => o.id === id);
                  return opt?.shortLabel || id;
                }).join(', ')}
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {selectedGroups.length > 0 && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                onClearAll();
              }}
              className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md text-slate-400 hover:text-red-500 cursor-pointer"
              title="Clear all selected groups"
            >
              <X className="w-3 h-3" />
            </span>
          )}
          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {/* Dropdown Popover */}
      {isOpen && (
        <div
          className={`absolute top-full mt-1.5 z-[100] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl p-3.5 space-y-3 animate-fade-in ${
            align === 'right'
              ? 'right-0 w-[340px] sm:w-[460px] max-w-[calc(100vw-2rem)]'
              : align === 'full'
              ? 'left-0 right-0 w-full'
              : 'left-0 w-full sm:w-[480px] max-w-[calc(100vw-2rem)]'
          }`}
        >
          {/* Search Input & Quick Controls */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search community groups..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-7 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500"
                autoFocus
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={onSelectAll}
              className="px-2.5 py-1 text-[11px] font-bold text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950/60 rounded-lg transition-colors shrink-0"
              title="Select all 10 community groups"
            >
              Select All
            </button>
            <button
              type="button"
              onClick={onClearAll}
              className="px-2 py-1 text-[11px] font-bold text-slate-500 hover:text-red-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors shrink-0"
              title="Clear selection"
            >
              Clear
            </button>
          </div>

          {/* Options List */}
          <div className="max-h-64 overflow-y-auto space-y-1 pr-1 divide-y divide-slate-100 dark:divide-slate-800/80">
            {filteredOptions.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400">
                No matching community groups found.
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = selectedGroups.includes(opt.id);
                const details = OPTION_DETAILS[opt.id];
                return (
                  <div
                    key={opt.id}
                    onClick={() => onToggleGroup(opt.id)}
                    className={`pt-1.5 first:pt-0 flex items-start justify-between gap-3 p-2 rounded-xl text-xs cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-teal-50/80 dark:bg-teal-950/40 text-teal-950 dark:text-teal-100 font-medium'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-start gap-2.5 min-w-0 flex-1">
                      {/* Checkbox */}
                      <div
                        className={`w-4 h-4 mt-0.5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-teal-600 border-teal-600 text-white'
                            : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[2.5]" />}
                      </div>

                      {/* Dot & Text */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full shrink-0 ${details?.dot || 'bg-slate-400'}`} />
                          <span className="font-semibold text-xs truncate">
                            {opt.label}
                          </span>
                        </div>
                        {details?.subtitle && (
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed line-clamp-1">
                            {details.subtitle}
                          </p>
                        )}
                      </div>
                    </div>

                    {isSelected && (
                      <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 shrink-0 mt-0.5">
                        Selected
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer with summary and Done button */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              <span className="font-bold text-slate-700 dark:text-slate-200">{selectedGroups.length}</span> of {COMMUNITY_FILTER_OPTIONS.length} groups selected
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold shrink-0 shadow-xs transition-colors"
            >
              Done
            </button>
          </div>

          {/* Selected chips row inside popover */}
          {selectedGroups.length > 0 && (
            <div className="flex items-center gap-1 flex-wrap max-h-16 overflow-y-auto pt-1">
              {selectedGroups.map(id => {
                const opt = COMMUNITY_FILTER_OPTIONS.find(o => o.id === id);
                return (
                  <span
                    key={id}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 text-[10px] font-bold"
                  >
                    <span>{opt?.shortLabel || id}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleGroup(id);
                      }}
                      className="hover:text-red-500 ml-0.5"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </span>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const TotalVotersView: React.FC<TotalVotersViewProps> = ({
  onSelectVoter,
  onOpenVoterSlip
}) => {
  const { showToast } = useToast();

  // Centralized Community Group Store
  const { getAllocationsForElector, getElectorStatus } = useCommunityGroups();

  // Active quick filter selection
  const [activeQuickFilter, setActiveQuickFilter] = useState<string>('total');

  // Global Search input state (searches name, Hindi name, EPIC ID, contact, booth, serial no, etc.)
  const [searchTerm, setSearchTerm] = useState('');

  // Toggle for Filter Panel section
  const [showFilterPanel, setShowFilterPanel] = useState(true);

  // Filter State matching the 5 requested categories
  const [filters, setFilters] = useState({
    // Category 1: Record Status
    deceased: 'ALL',      // 'ALL' | 'YES' | 'NO'
    hasMobile: 'ALL',     // 'ALL' | 'YES' | 'NO'
    hasEmail: 'ALL',      // 'ALL' | 'YES' | 'NO'
    hasNewAddress: 'ALL', // 'ALL' | 'YES' | 'NO'

    // Category 2: Personal Information
    gender: 'ALL',        // 'ALL' | 'MALE' | 'FEMALE' | 'OTHER'
    ageMin: '',
    ageMax: '',
    agePreset: 'ALL',     // 'ALL' | '18-25' | '26-40' | '41-60' | '60+'

    // Category 3: Name Filters
    voterName: '',

    // Category 4: Location & Identity
    constituencyNo: 'ALL',
    boothNo: 'ALL',
    serialNo: '',
    houseNumber: '',
    epicNumber: '',
    boothStation: 'ALL',
    ward: 'ALL',

    // Category 5: Community / Stakeholder Groups
    communityGroups: [] as string[],
  });

  // Filter Panel view mode: Full 5 Categories vs Commonly Used (Less Filters)
  const [filterViewMode, setFilterViewMode] = useState<'ADVANCED' | 'LESS'>('ADVANCED');

  // Collapsible category state for the 5 categories
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({
    recordStatus: false,
    personalInfo: false,
    nameFilters: false,
    locationIdentity: false,
    communityRecords: false
  });

  const toggleCategoryCollapse = (catKey: string) => {
    setCollapsedCategories(prev => ({ ...prev, [catKey]: !prev[catKey] }));
  };

  const expandAllCategories = () => {
    setCollapsedCategories({
      recordStatus: false,
      personalInfo: false,
      nameFilters: false,
      locationIdentity: false,
      communityRecords: false
    });
  };

  const collapseAllCategories = () => {
    setCollapsedCategories({
      recordStatus: true,
      personalInfo: true,
      nameFilters: true,
      locationIdentity: true,
      communityRecords: true
    });
  };

  // Toggle Community Group Filter
  const toggleCommunityGroupFilter = (id: string) => {
    setFilters(prev => {
      const exists = prev.communityGroups.includes(id);
      const updated = exists
        ? prev.communityGroups.filter(item => item !== id)
        : [...prev.communityGroups, id];
      return { ...prev, communityGroups: updated };
    });
    setCurrentPage(1);
  };

  const selectAllCommunityGroups = () => {
    setFilters(prev => ({
      ...prev,
      communityGroups: COMMUNITY_FILTER_OPTIONS.map(opt => opt.id)
    }));
    setCurrentPage(1);
  };

  const clearAllCommunityGroups = () => {
    setFilters(prev => ({ ...prev, communityGroups: [] }));
    setCurrentPage(1);
  };

  // Table selection & pagination
  const [selectedVoterIds, setSelectedVoterIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  // Add Voter Modal state
  const [showAddVoterModal, setShowAddVoterModal] = useState(false);
  const [newVoterForm, setNewVoterForm] = useState({
    fullName: '',
    hindiName: '',
    relativeName: '',
    relativeHindiName: '',
    relationType: 'Father' as 'Father' | 'Husband' | 'Mother' | 'Other',
    gender: 'MALE' as 'MALE' | 'FEMALE' | 'OTHER',
    age: '',
    epicNumber: '',
    mobile: '',
    constituencyNo: '215',
    boothNumber: '101',
    ward: 'Ward 12 (Kasba Peth)',
    pollingStation: 'PMC School No. 12, Kasba Peth',
    address: ''
  });

  // SMS Modal State
  const [showSmsModal, setShowSmsModal] = useState(false);
  const [smsMessage, setSmsMessage] = useState(
    'Namaskar, please cast your vote for Adv. Vikram Patil in the upcoming elections at your assigned booth.'
  );

  // Quick Filter Cards data matching application overview
  const quickFilterCards: QuickFilterCard[] = [
    { id: 'total', label: 'Total Voters', count: '2,48,650', icon: Users, iconBg: 'bg-blue-50 dark:bg-blue-950/50', iconColor: 'text-blue-600 dark:text-blue-400' },
    { id: 'male', label: 'Male', count: '1,27,560', icon: Users, iconBg: 'bg-indigo-50 dark:bg-indigo-950/50', iconColor: 'text-indigo-600 dark:text-indigo-400' },
    { id: 'female', label: 'Female', count: '1,21,090', icon: Users, iconBg: 'bg-pink-50 dark:bg-pink-950/50', iconColor: 'text-pink-600 dark:text-pink-400' },
    { id: 'alphabets', label: 'Name Alphabet', count: '26', icon: Tag, iconBg: 'bg-purple-50 dark:bg-purple-950/50', iconColor: 'text-purple-600 dark:text-purple-400' },
    { id: 'prabhaag', label: 'Prabhaag', count: '12', icon: Building2, iconBg: 'bg-cyan-50 dark:bg-cyan-950/50', iconColor: 'text-cyan-600 dark:text-cyan-400' },
    { id: 'gan', label: 'Gan', count: '8', icon: Layers, iconBg: 'bg-amber-50 dark:bg-amber-950/50', iconColor: 'text-amber-600 dark:text-amber-400' },
    { id: 'parts', label: 'Electoral Part', count: '325', icon: Layers, iconBg: 'bg-blue-50 dark:bg-blue-950/50', iconColor: 'text-blue-600 dark:text-blue-400' },
    { id: 'karyakarta', label: 'Karyakarta', count: '4,850', icon: UserCheck, iconBg: 'bg-purple-50 dark:bg-purple-950/50', iconColor: 'text-purple-600 dark:text-purple-400' },
    { id: 'booth', label: 'Booth No', count: '2,045', icon: Building2, iconBg: 'bg-blue-50 dark:bg-blue-950/50', iconColor: 'text-blue-600 dark:text-blue-400' },
    { id: 'mobile', label: 'Mobile', count: '1,86,430', icon: Phone, iconBg: 'bg-cyan-50 dark:bg-cyan-950/50', iconColor: 'text-cyan-600 dark:text-cyan-400' },
    { id: 'dob', label: 'DOB / Month', count: '2,48,650', icon: Calendar, iconBg: 'bg-rose-50 dark:bg-rose-950/50', iconColor: 'text-rose-600 dark:text-rose-400' },
    { id: 'surname', label: 'Surname', count: '89,540', icon: Users, iconBg: 'bg-indigo-50 dark:bg-indigo-950/50', iconColor: 'text-indigo-600 dark:text-indigo-400' },
    { id: 'voted', label: 'Voted', count: '1,40,320', icon: CheckCircle2, iconBg: 'bg-blue-50 dark:bg-blue-950/50', iconColor: 'text-blue-600 dark:text-blue-400' },
    { id: 'non_voted', label: 'Non Voted', count: '1,08,330', icon: XCircle, iconBg: 'bg-rose-50 dark:bg-rose-950/50', iconColor: 'text-rose-600 dark:text-rose-400' },
    { id: 'visited', label: 'Visited', count: '72,450', icon: Eye, iconBg: 'bg-cyan-50 dark:bg-cyan-950/50', iconColor: 'text-cyan-600 dark:text-cyan-400' },
    { id: 'favorites', label: 'Favorites', count: '12,680', icon: Heart, iconBg: 'bg-rose-50 dark:bg-rose-950/50', iconColor: 'text-rose-600 dark:text-rose-400' },
    { id: 'helped', label: 'Helped', count: '6,240', icon: Heart, iconBg: 'bg-amber-50 dark:bg-amber-950/50', iconColor: 'text-amber-600 dark:text-amber-400' },
    { id: 'address', label: 'Address', count: '2,48,650', icon: MapPin, iconBg: 'bg-cyan-50 dark:bg-cyan-950/50', iconColor: 'text-cyan-600 dark:text-cyan-400' },
    { id: 'outside', label: 'Outside', count: '1,860', icon: Share2, iconBg: 'bg-amber-50 dark:bg-amber-950/50', iconColor: 'text-amber-600 dark:text-amber-400' },
    { id: 'printed', label: 'Printed', count: '1,92,430', icon: CheckCircle2, iconBg: 'bg-purple-50 dark:bg-purple-950/50', iconColor: 'text-purple-600 dark:text-purple-400' },
    { id: 'deceased', label: 'Deceased', count: '320', icon: AlertCircle, iconBg: 'bg-slate-100 dark:bg-slate-800', iconColor: 'text-slate-600 dark:text-slate-400' },
    { id: 'house', label: 'House No', count: '2,48,650', icon: Home, iconBg: 'bg-amber-50 dark:bg-amber-950/50', iconColor: 'text-amber-600 dark:text-amber-400' },
    { id: 'schemes', label: 'Schemes', count: '98,760', icon: Gift, iconBg: 'bg-blue-50 dark:bg-blue-950/50', iconColor: 'text-blue-600 dark:text-blue-400' }
  ];

  // Distinct Filter Option Lists derived from data
  const constituencyOptions = useMemo(() => {
    const list = new Set<string>();
    MOCK_VOTERS.forEach(v => {
      const c = (v.constituencyNo || (v.assemblySegment ? v.assemblySegment.split(' - ')[0] : '')).toString().trim();
      if (c) list.add(c);
    });
    return Array.from(list);
  }, []);

  const boothOptions = useMemo(() => {
    const list = new Set<number>();
    MOCK_VOTERS.forEach(v => {
      if (v.boothNumber) list.add(v.boothNumber);
    });
    MOCK_BOOTHS.forEach(b => {
      if (b.boothNumber) list.add(b.boothNumber);
    });
    return Array.from(list).sort((a, b) => a - b);
  }, []);

  const stationOptions = useMemo(() => {
    const list = new Set<string>();
    MOCK_VOTERS.forEach(v => {
      if (v.pollingStation) list.add(v.pollingStation);
    });
    MOCK_BOOTHS.forEach(b => {
      if (b.name) list.add(b.name);
    });
    return Array.from(list).sort();
  }, []);

  const wardOptions = useMemo(() => {
    const list = new Set<string>();
    MOCK_VOTERS.forEach(v => {
      if (v.ward) list.add(v.ward);
      else if (v.prabhaag) list.add(v.prabhaag);
    });
    return Array.from(list).sort();
  }, []);

  // Filtering Logic combining Quick Filters + Global Search + All 5 Advanced Filter Categories
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

      // 2. Global Search Field (searches across elector name, Hindi name, relative name, EPIC ID, contact number, booth number, serial number, etc.)
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase().trim();
        const matchName = v.fullName?.toLowerCase().includes(query);
        const matchHindi = v.hindiName?.toLowerCase().includes(query);
        const matchRelative = v.relativeName?.toLowerCase().includes(query);
        const matchRelativeHindi = v.relativeHindiName?.toLowerCase().includes(query);
        const matchEpic = v.epicNumber?.toLowerCase().includes(query);
        const matchMobile = v.mobile?.replace(/\s+/g, '').includes(query.replace(/\s+/g, ''));
        const matchBooth = v.boothNumber?.toString().includes(query);
        const matchSerial = v.serialNo?.toString().includes(query);
        const matchConst = (v.constituencyNo?.toString() || '').includes(query) || v.assemblySegment?.toLowerCase().includes(query);
        const matchStation = v.pollingStation?.toLowerCase().includes(query);
        const matchWard = (v.ward || v.prabhaag || '').toLowerCase().includes(query);
        const matchHouse = (v.houseNo || v.address || '').toLowerCase().includes(query);

        if (
          !matchName &&
          !matchHindi &&
          !matchRelative &&
          !matchRelativeHindi &&
          !matchEpic &&
          !matchMobile &&
          !matchBooth &&
          !matchSerial &&
          !matchConst &&
          !matchStation &&
          !matchWard &&
          !matchHouse
        ) {
          return false;
        }
      }

      // 3. Category 1: Record Status Filters (Deceased, Has Mobile, Has Email, Has New Address)
      if (filters.deceased === 'YES' && !v.isDeceased) return false;
      if (filters.deceased === 'NO' && v.isDeceased) return false;

      if (filters.hasMobile === 'YES' && (!v.mobile || v.mobile.trim() === '')) return false;
      if (filters.hasMobile === 'NO' && v.mobile && v.mobile.trim() !== '') return false;

      if (filters.hasEmail === 'YES' && (!v.email || v.email.trim() === '')) return false;
      if (filters.hasEmail === 'NO' && v.email && v.email.trim() !== '') return false;

      if (filters.hasNewAddress === 'YES' && (!v.newAddress || v.newAddress.trim() === '')) return false;
      if (filters.hasNewAddress === 'NO' && v.newAddress && v.newAddress.trim() !== '') return false;

      // 4. Category 2: Personal Information (Gender, Min Age, Max Age, Age Preset)
      if (filters.gender !== 'ALL') {
        if (v.gender !== filters.gender) return false;
      }

      if (filters.ageMin !== '') {
        const minAge = parseInt(filters.ageMin, 10);
        if (!isNaN(minAge) && v.age < minAge) return false;
      }

      if (filters.ageMax !== '') {
        const maxAge = parseInt(filters.ageMax, 10);
        if (!isNaN(maxAge) && v.age > maxAge) return false;
      }

      if (filters.agePreset !== 'ALL') {
        if (filters.agePreset === '18-25' && (v.age < 18 || v.age > 25)) return false;
        if (filters.agePreset === '26-40' && (v.age < 26 || v.age > 40)) return false;
        if (filters.agePreset === '41-60' && (v.age < 41 || v.age > 60)) return false;
        if (filters.agePreset === '60+' && v.age < 60) return false;
      }

      // 5. Category 3: Name Filters (English / Hindi name, relative name)
      if (filters.voterName.trim() !== '') {
        const qName = filters.voterName.toLowerCase().trim();
        const matchesEnglish = v.fullName?.toLowerCase().includes(qName);
        const matchesHindi = v.hindiName?.toLowerCase().includes(qName);
        const matchesRelative = v.relativeName?.toLowerCase().includes(qName);
        const matchesRelativeHindi = v.relativeHindiName?.toLowerCase().includes(qName);
        if (!matchesEnglish && !matchesHindi && !matchesRelative && !matchesRelativeHindi) return false;
      }

      // 6. Category 4: Location & Identity
      if (filters.constituencyNo !== 'ALL') {
        const cNo = (v.constituencyNo || (v.assemblySegment ? v.assemblySegment.split(' - ')[0] : '')).toString();
        if (cNo !== filters.constituencyNo) return false;
      }

      if (filters.boothNo !== 'ALL') {
        if (v.boothNumber.toString() !== filters.boothNo) return false;
      }

      if (filters.serialNo.trim() !== '') {
        if (!v.serialNo.toString().includes(filters.serialNo.trim())) return false;
      }

      if (filters.houseNumber.trim() !== '') {
        const qHouse = filters.houseNumber.toLowerCase().trim();
        const matchHouseNo = v.houseNo?.toLowerCase().includes(qHouse);
        const matchAddress = v.address?.toLowerCase().includes(qHouse);
        if (!matchHouseNo && !matchAddress) return false;
      }

      if (filters.epicNumber.trim() !== '') {
        if (!v.epicNumber.toLowerCase().includes(filters.epicNumber.toLowerCase().trim())) return false;
      }

      if (filters.boothStation !== 'ALL') {
        if (v.pollingStation !== filters.boothStation) return false;
      }

      if (filters.ward !== 'ALL') {
        const vWard = v.ward || v.prabhaag || '';
        if (vWard !== filters.ward) return false;
      }

      // 7. Category 5: Community / Stakeholder Group Multi-Select Filter
      if (filters.communityGroups.length > 0) {
        const electorId = v.id || v.voterCode;
        const electorAllocations = getAllocationsForElector(electorId);
        const electorStatus = getElectorStatus(electorId);

        const matches = filters.communityGroups.some(cgId => {
          if (cgId === 'NOT_ASSOCIATED') {
            return electorStatus === 'NOT_ASSOCIATED';
          }
          if (cgId === 'NOT_DISCLOSED') {
            return electorStatus === 'NOT_DISCLOSED';
          }
          return electorAllocations.some(a => a.category === cgId);
        });

        if (!matches) return false;
      }

      return true;
    });
  }, [activeQuickFilter, searchTerm, filters, getAllocationsForElector, getElectorStatus]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredVoters.length / itemsPerPage) || 1;
  const paginatedVoters = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredVoters.slice(start, start + itemsPerPage);
  }, [filteredVoters, currentPage, itemsPerPage]);

  // Active Filter Chips Calculation
  const activeFilterChips = useMemo(() => {
    const chips: {
      id: string;
      category: string;
      label: string;
      value: string;
      onClear: () => void;
    }[] = [];

    // Global Search
    if (searchTerm.trim() !== '') {
      chips.push({
        id: 'globalSearch',
        category: 'Search',
        label: 'Global Search',
        value: `"${searchTerm}"`,
        onClear: () => setSearchTerm('')
      });
    }

    // Category 1: Record Status
    if (filters.deceased !== 'ALL') {
      chips.push({
        id: 'deceased',
        category: 'Record Status',
        label: 'Deceased',
        value: filters.deceased === 'YES' ? 'Yes (Deceased)' : 'No (Active/Alive)',
        onClear: () => setFilters(prev => ({ ...prev, deceased: 'ALL' }))
      });
    }
    if (filters.hasMobile !== 'ALL') {
      chips.push({
        id: 'hasMobile',
        category: 'Record Status',
        label: 'Has Mobile',
        value: filters.hasMobile === 'YES' ? 'Yes (Phone Available)' : 'No (No Phone)',
        onClear: () => setFilters(prev => ({ ...prev, hasMobile: 'ALL' }))
      });
    }
    if (filters.hasEmail !== 'ALL') {
      chips.push({
        id: 'hasEmail',
        category: 'Record Status',
        label: 'Has Email',
        value: filters.hasEmail === 'YES' ? 'Yes (Has Email)' : 'No (No Email)',
        onClear: () => setFilters(prev => ({ ...prev, hasEmail: 'ALL' }))
      });
    }
    if (filters.hasNewAddress !== 'ALL') {
      chips.push({
        id: 'hasNewAddress',
        category: 'Record Status',
        label: 'Has New Address',
        value: filters.hasNewAddress === 'YES' ? 'Yes (New Address)' : 'No (Standard)',
        onClear: () => setFilters(prev => ({ ...prev, hasNewAddress: 'ALL' }))
      });
    }

    // Category 2: Personal Information
    if (filters.gender !== 'ALL') {
      chips.push({
        id: 'gender',
        category: 'Personal Info',
        label: 'Gender',
        value: filters.gender === 'MALE' ? 'Male' : filters.gender === 'FEMALE' ? 'Female' : 'Other',
        onClear: () => setFilters(prev => ({ ...prev, gender: 'ALL' }))
      });
    }
    if (filters.ageMin !== '') {
      chips.push({
        id: 'ageMin',
        category: 'Personal Info',
        label: 'Min Age',
        value: `>= ${filters.ageMin} yrs`,
        onClear: () => setFilters(prev => ({ ...prev, ageMin: '' }))
      });
    }
    if (filters.ageMax !== '') {
      chips.push({
        id: 'ageMax',
        category: 'Personal Info',
        label: 'Max Age',
        value: `<= ${filters.ageMax} yrs`,
        onClear: () => setFilters(prev => ({ ...prev, ageMax: '' }))
      });
    }
    if (filters.agePreset !== 'ALL') {
      chips.push({
        id: 'agePreset',
        category: 'Personal Info',
        label: 'Age Group',
        value: filters.agePreset,
        onClear: () => setFilters(prev => ({ ...prev, agePreset: 'ALL' }))
      });
    }

    // Category 3: Name Filters
    if (filters.voterName.trim() !== '') {
      chips.push({
        id: 'voterName',
        category: 'Name',
        label: 'Voter Name',
        value: `"${filters.voterName}"`,
        onClear: () => setFilters(prev => ({ ...prev, voterName: '' }))
      });
    }

    // Category 4: Location & Identity
    if (filters.constituencyNo !== 'ALL') {
      chips.push({
        id: 'constituencyNo',
        category: 'Location',
        label: 'Constituency',
        value: `#${filters.constituencyNo}`,
        onClear: () => setFilters(prev => ({ ...prev, constituencyNo: 'ALL' }))
      });
    }
    if (filters.boothNo !== 'ALL') {
      chips.push({
        id: 'boothNo',
        category: 'Location',
        label: 'Booth',
        value: `#${filters.boothNo}`,
        onClear: () => setFilters(prev => ({ ...prev, boothNo: 'ALL' }))
      });
    }
    if (filters.serialNo.trim() !== '') {
      chips.push({
        id: 'serialNo',
        category: 'Location',
        label: 'Sr. No.',
        value: filters.serialNo,
        onClear: () => setFilters(prev => ({ ...prev, serialNo: '' }))
      });
    }
    if (filters.houseNumber.trim() !== '') {
      chips.push({
        id: 'houseNumber',
        category: 'Location',
        label: 'House No.',
        value: `"${filters.houseNumber}"`,
        onClear: () => setFilters(prev => ({ ...prev, houseNumber: '' }))
      });
    }
    if (filters.epicNumber.trim() !== '') {
      chips.push({
        id: 'epicNumber',
        category: 'Identity',
        label: 'EPIC ID',
        value: filters.epicNumber.toUpperCase(),
        onClear: () => setFilters(prev => ({ ...prev, epicNumber: '' }))
      });
    }
    if (filters.boothStation !== 'ALL') {
      chips.push({
        id: 'boothStation',
        category: 'Location',
        label: 'Station',
        value: filters.boothStation,
        onClear: () => setFilters(prev => ({ ...prev, boothStation: 'ALL' }))
      });
    }
    if (filters.ward !== 'ALL') {
      chips.push({
        id: 'ward',
        category: 'Location',
        label: 'Ward',
        value: filters.ward,
        onClear: () => setFilters(prev => ({ ...prev, ward: 'ALL' }))
      });
    }

    // Category 5: Community / Stakeholder Groups
    filters.communityGroups.forEach(cgId => {
      const opt = COMMUNITY_FILTER_OPTIONS.find(o => o.id === cgId);
      chips.push({
        id: `comm_${cgId}`,
        category: 'Community / Stakeholder Groups',
        label: 'Group',
        value: opt?.shortLabel || opt?.label || cgId,
        onClear: () => toggleCommunityGroupFilter(cgId)
      });
    });

    return chips;
  }, [filters, searchTerm]);

  const activeStructuredFilterCount = activeFilterChips.length;

  // Category-specific active counts for accordion badges
  const recordStatusActiveCount = useMemo(() => {
    let c = 0;
    if (filters.deceased !== 'ALL') c++;
    if (filters.hasMobile !== 'ALL') c++;
    if (filters.hasEmail !== 'ALL') c++;
    if (filters.hasNewAddress !== 'ALL') c++;
    return c;
  }, [filters.deceased, filters.hasMobile, filters.hasEmail, filters.hasNewAddress]);

  const personalInfoActiveCount = useMemo(() => {
    let c = 0;
    if (filters.gender !== 'ALL') c++;
    if (filters.ageMin !== '') c++;
    if (filters.ageMax !== '') c++;
    if (filters.agePreset !== 'ALL') c++;
    return c;
  }, [filters.gender, filters.ageMin, filters.ageMax, filters.agePreset]);

  const nameFiltersActiveCount = useMemo(() => {
    return filters.voterName.trim() ? 1 : 0;
  }, [filters.voterName]);

  const locationIdentityActiveCount = useMemo(() => {
    let c = 0;
    if (filters.constituencyNo !== 'ALL') c++;
    if (filters.boothNo !== 'ALL') c++;
    if (filters.serialNo.trim()) c++;
    if (filters.houseNumber.trim()) c++;
    if (filters.epicNumber.trim()) c++;
    if (filters.boothStation !== 'ALL') c++;
    if (filters.ward !== 'ALL') c++;
    return c;
  }, [filters.constituencyNo, filters.boothNo, filters.serialNo, filters.houseNumber, filters.epicNumber, filters.boothStation, filters.ward]);

  const communityRecordsActiveCount = filters.communityGroups.length;

  const isAgeRangeInvalid = Boolean(
    filters.ageMin && filters.ageMax && parseInt(filters.ageMin, 10) > parseInt(filters.ageMax, 10)
  );

  const handleResetFilters = () => {
    setFilters({
      deceased: 'ALL',
      hasMobile: 'ALL',
      hasEmail: 'ALL',
      hasNewAddress: 'ALL',
      gender: 'ALL',
      ageMin: '',
      ageMax: '',
      agePreset: 'ALL',
      voterName: '',
      constituencyNo: 'ALL',
      boothNo: 'ALL',
      serialNo: '',
      houseNumber: '',
      epicNumber: '',
      boothStation: 'ALL',
      ward: 'ALL',
      communityGroups: []
    });
    setSearchTerm('');
    setActiveQuickFilter('total');
    setCurrentPage(1);
    showToast('All voter filters and search queries have been reset.', 'info');
  };

  const handleApplyFilters = () => {
    setCurrentPage(1);
    showToast(`Filters applied. Showing ${filteredVoters.length} matching electors.`, 'success');
  };

  const handleRefresh = () => {
    showToast('Electoral roll synchronized with central server.', 'info');
  };

  // Copy EPIC ID helper
  const handleCopyEpic = (epic: string) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(epic);
      showToast(`EPIC ID ${epic} copied to clipboard!`, 'info');
    }
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

  // Export CSV Handler matching updated columns
  const handleExportCSV = () => {
    const listToExport = selectedVoterIds.length > 0
      ? filteredVoters.filter(v => selectedVoterIds.includes(v.id))
      : filteredVoters;

    const headers = [
      "Constituency No",
      "Booth No",
      "Sr No",
      "Elector Name",
      "Hindi Name",
      "Relative Name",
      "Relative Hindi Name",
      "EPIC ID",
      "Age",
      "Sex",
      "Deceased",
      "Has Mobile",
      "Has Email",
      "Has New Address",
      "House No",
      "Booth Station",
      "Ward",
      "Community Groups",
      "Contact"
    ];

    const rows = listToExport.map(v => {
      const eAllocs = getAllocationsForElector(v.id || v.voterCode);
      const eSt = getElectorStatus(v.id || v.voterCode);
      const commStr = eAllocs.length > 0
        ? eAllocs.map(a => `${a.category}: ${a.groupName} (${a.verificationStatus})`).join('; ')
        : (eSt === 'NOT_ASSOCIATED' ? 'Not Associated' : eSt === 'NOT_DISCLOSED' ? 'Not Disclosed' : 'None');

      return [
        `"${v.constituencyNo || '215'}"`,
        v.boothNumber,
        v.serialNo,
        `"${v.fullName}"`,
        `"${v.hindiName || ''}"`,
        `"${v.relativeName}"`,
        `"${v.relativeHindiName || ''}"`,
        `"${v.epicNumber}"`,
        v.age,
        v.gender,
        v.isDeceased ? '"Yes"' : '"No"',
        v.mobile && v.mobile.trim() !== '' ? '"Yes"' : '"No"',
        v.email && v.email.trim() !== '' ? '"Yes"' : '"No"',
        v.newAddress && v.newAddress.trim() !== '' ? '"Yes"' : '"No"',
        `"${v.houseNo || ''}"`,
        `"${v.pollingStation}"`,
        `"${v.ward || v.prabhaag || ''}"`,
        `"${commStr}"`,
        `"${v.mobile || ''}"`
      ];
    });

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
    <div className="space-y-4 pb-12 animate-fade-in text-slate-800 dark:text-slate-100">
      {/* 1. Header Bar with Breadcrumb and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded uppercase tracking-wider border border-blue-200 dark:border-blue-900/40">
              Voter Intelligence
            </span>
            <span className="text-slate-400 text-xs">/</span>
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Total Voters</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Total Voters
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Electoral roll records with multi-attribute filtering, polling station locators, and unified profiles.
          </p>
        </div>

        {/* Top-Right Action Group */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Total Count Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50/80 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900/60 rounded-xl text-xs font-bold text-blue-700 dark:text-blue-400 shadow-xs">
            <Users className="w-3.5 h-3.5" />
            <span>2,48,650 Total Voters</span>
          </div>

          {/* Refresh Action */}
          <button
            onClick={handleRefresh}
            className="flex items-center gap-1 px-3 py-1.5 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold rounded-xl text-xs border border-slate-200 dark:border-slate-800 transition-colors shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span>Refresh</span>
          </button>

          {/* Send SMS Action */}
          <button
            onClick={() => setShowSmsModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold rounded-xl text-xs border border-slate-200 dark:border-slate-800 transition-colors shadow-xs"
          >
            <Send className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Send SMS</span>
          </button>

          {/* Export Button */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1 px-3 py-1.5 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold rounded-xl text-xs border border-slate-200 dark:border-slate-800 transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span>Export CSV</span>
          </button>

          {/* Add Voter Button */}
          <button
            onClick={() => setShowAddVoterModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold rounded-xl text-xs transition-all shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Voter</span>
          </button>
        </div>
      </div>

      {/* 2. Quick Filters Box (Grid of 23 Clickable Cards) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Filter className="w-3 h-3" />
            </div>
            <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Quick Filters</h2>
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              Click any card to instantly segment voters.
            </span>
          </div>
          {activeQuickFilter !== 'total' && (
            <button
              onClick={() => {
                setActiveQuickFilter('total');
                setCurrentPage(1);
              }}
              className="text-[11px] text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Quick Filter</span>
            </button>
          )}
        </div>

        {/* 23 Cards Grid */}
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
                    ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 shadow-xs ring-1 ring-blue-500/20'
                    : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/60 dark:hover:bg-slate-800/40'
                }`}
              >
                <div className={`w-7 h-7 rounded-lg ${card.iconBg} ${card.iconColor} flex items-center justify-center shrink-0`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block truncate leading-tight">
                    {card.label}
                  </span>
                  <span className="text-xs font-black text-slate-900 dark:text-white block leading-tight font-mono mt-0.5">
                    {card.count}
                  </span>
                  <span className="text-[9px] font-semibold text-blue-600 dark:text-blue-400 block mt-0.5 leading-none">
                    {isSelected ? 'Active' : 'Click to Filter'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Global Search Bar and Filter Controls Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        {/* Global Search Field */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Global Search: Elector Name, Hindi Name, EPIC ID, Contact, Booth No., or Sr. No..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-9 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-xs text-slate-900 dark:text-slate-100"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* View Mode Switcher: Advanced Filters vs Less Filters */}
        <div className="inline-flex rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-0.5 text-xs shadow-xs shrink-0">
          <button
            type="button"
            onClick={() => {
              setFilterViewMode('ADVANCED');
              if (!showFilterPanel) setShowFilterPanel(true);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              showFilterPanel && filterViewMode === 'ADVANCED'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Advanced Filters</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setFilterViewMode('LESS');
              if (!showFilterPanel) setShowFilterPanel(true);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              showFilterPanel && filterViewMode === 'LESS'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Less Filters</span>
          </button>
        </div>

        {/* Active Filters Count Pill & Toggle Panel Button */}
        <button
          onClick={() => setShowFilterPanel(!showFilterPanel)}
          className={`flex items-center gap-1.5 px-3.5 py-2 border rounded-xl text-xs font-semibold shadow-xs transition-colors shrink-0 ${
            showFilterPanel
              ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-900/60 text-blue-700 dark:text-blue-300'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>{showFilterPanel ? 'Collapse Filters' : 'Expand Filters'}</span>
          <span className="w-4 h-4 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center">
            {activeStructuredFilterCount}
          </span>
        </button>
      </div>

      {/* 4. Complete Advanced Filters Panel */}
      {showFilterPanel && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs space-y-4 animate-fade-in">
          {/* Header of Filters Panel */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <SlidersHorizontal className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    {filterViewMode === 'ADVANCED' ? 'Advanced Voter Filters (5 Categories)' : 'Commonly Used Filters (Less Filters)'}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900/40">
                    {activeStructuredFilterCount} Active
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {filterViewMode === 'ADVANCED'
                    ? 'Record Status, Demographics, Name, Electoral Roll Location & Identity, and Community Stakeholder Groups.'
                    : 'Displaying only commonly used filters for rapid verification.'}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Expand / Collapse All when in Advanced Mode */}
              {filterViewMode === 'ADVANCED' && (
                <div className="flex items-center gap-1 mr-1">
                  <button
                    type="button"
                    onClick={expandAllCategories}
                    className="px-2 py-1 text-[11px] font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    Expand All
                  </button>
                  <span className="text-slate-300 dark:text-slate-700 text-xs">|</span>
                  <button
                    type="button"
                    onClick={collapseAllCategories}
                    className="px-2 py-1 text-[11px] font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    Collapse All
                  </button>
                </div>
              )}

              {/* Reset All Filters */}
              <button
                type="button"
                onClick={handleResetFilters}
                className="flex items-center gap-1 px-2.5 py-1 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <RotateCcw className="w-3 h-3 text-slate-400" />
                <span>Reset All</span>
              </button>

              {/* Apply Filters */}
              <button
                type="button"
                onClick={handleApplyFilters}
                className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors"
              >
                <Check className="w-3 h-3" />
                <span>Apply Filters ({filteredVoters.length})</span>
              </button>
            </div>
          </div>

          {/* Active Filter Chips Bar */}
          {activeFilterChips.length > 0 && (
            <div className="pt-1 pb-2 border-b border-slate-100 dark:border-slate-800/80 flex items-center gap-1.5 flex-wrap text-xs">
              <span className="text-[11px] font-bold text-slate-400 mr-1">
                Active Filter Chips ({activeFilterChips.length}):
              </span>

              {activeFilterChips.map((chip) => (
                <span
                  key={chip.id}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-[11px] font-medium shadow-2xs"
                >
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{chip.category}:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{chip.label}</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">{chip.value}</span>
                  <button
                    type="button"
                    onClick={chip.onClear}
                    className="p-0.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-400 hover:text-red-500 transition-colors ml-0.5"
                    title={`Clear ${chip.label}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

              <button
                type="button"
                onClick={handleResetFilters}
                className="text-[11px] font-bold text-red-600 dark:text-red-400 hover:underline px-2 py-0.5 ml-1"
              >
                Clear All ({activeFilterChips.length})
              </button>
            </div>
          )}

          {/* MODE 1: ADVANCED FILTERS (All 5 Collapsible Categories) */}
          {filterViewMode === 'ADVANCED' ? (
            <div className="space-y-3.5 text-xs">
              {/* CATEGORY 1: Record Status */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-50/40 dark:bg-slate-900/40">
                <button
                  type="button"
                  onClick={() => toggleCategoryCollapse('recordStatus')}
                  className="w-full flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      1. Record Status Filters
                    </span>
                    <span className="text-[10px] text-slate-400 hidden sm:inline">
                      (Deceased verification, contact availability & address shifts)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {recordStatusActiveCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                        {recordStatusActiveCount} active
                      </span>
                    )}
                    {collapsedCategories.recordStatus ? (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </button>

                {!collapsedCategories.recordStatus && (
                  <div className="p-3.5 border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 animate-fade-in">
                    {/* Deceased */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                          Deceased Status
                        </label>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {filters.deceased === 'ALL' ? 'All Records' : filters.deceased === 'YES' ? 'Deceased Only' : 'Active Only'}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-1 p-1 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-center text-xs">
                        {(['ALL', 'YES', 'NO'] as const).map((val) => (
                          <button
                            key={val}
                            type="button"
                            onClick={() => {
                              setFilters(prev => ({ ...prev, deceased: val }));
                              setCurrentPage(1);
                            }}
                            className={`py-1 rounded-md text-xs font-semibold transition-all ${
                              filters.deceased === val
                                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 font-bold shadow-2xs'
                                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                            }`}
                          >
                            {val === 'ALL' ? 'All' : val === 'YES' ? 'Yes' : 'No'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Has Mobile */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                          Has Mobile
                        </label>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {filters.hasMobile === 'ALL' ? 'All Records' : filters.hasMobile === 'YES' ? 'With Phone' : 'No Phone'}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-1 p-1 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-center text-xs">
                        {(['ALL', 'YES', 'NO'] as const).map((val) => (
                          <button
                            key={val}
                            type="button"
                            onClick={() => {
                              setFilters(prev => ({ ...prev, hasMobile: val }));
                              setCurrentPage(1);
                            }}
                            className={`py-1 rounded-md text-xs font-semibold transition-all ${
                              filters.hasMobile === val
                                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 font-bold shadow-2xs'
                                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                            }`}
                          >
                            {val === 'ALL' ? 'All' : val === 'YES' ? 'Yes' : 'No'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Has Email */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                          Has Email
                        </label>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {filters.hasEmail === 'ALL' ? 'All Records' : filters.hasEmail === 'YES' ? 'With Email' : 'No Email'}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-1 p-1 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-center text-xs">
                        {(['ALL', 'YES', 'NO'] as const).map((val) => (
                          <button
                            key={val}
                            type="button"
                            onClick={() => {
                              setFilters(prev => ({ ...prev, hasEmail: val }));
                              setCurrentPage(1);
                            }}
                            className={`py-1 rounded-md text-xs font-semibold transition-all ${
                              filters.hasEmail === val
                                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 font-bold shadow-2xs'
                                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                            }`}
                          >
                            {val === 'ALL' ? 'All' : val === 'YES' ? 'Yes' : 'No'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Has New Address */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                          Has New Address
                        </label>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {filters.hasNewAddress === 'ALL' ? 'All Records' : filters.hasNewAddress === 'YES' ? 'Shifted' : 'Standard'}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-1 p-1 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-center text-xs">
                        {(['ALL', 'YES', 'NO'] as const).map((val) => (
                          <button
                            key={val}
                            type="button"
                            onClick={() => {
                              setFilters(prev => ({ ...prev, hasNewAddress: val }));
                              setCurrentPage(1);
                            }}
                            className={`py-1 rounded-md text-xs font-semibold transition-all ${
                              filters.hasNewAddress === val
                                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 font-bold shadow-2xs'
                                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                            }`}
                          >
                            {val === 'ALL' ? 'All' : val === 'YES' ? 'Yes' : 'No'}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* CATEGORY 2: Personal Information */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-50/40 dark:bg-slate-900/40">
                <button
                  type="button"
                  onClick={() => toggleCategoryCollapse('personalInfo')}
                  className="w-full flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      2. Personal Information
                    </span>
                    <span className="text-[10px] text-slate-400 hidden sm:inline">
                      (Gender selection, numeric age bounds & age presets)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {personalInfoActiveCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                        {personalInfoActiveCount} active
                      </span>
                    )}
                    {collapsedCategories.personalInfo ? (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </button>

                {!collapsedCategories.personalInfo && (
                  <div className="p-3.5 border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 space-y-3 animate-fade-in">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {/* Gender */}
                      <div>
                        <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                          Gender
                        </label>
                        <select
                          value={filters.gender}
                          onChange={(e) => {
                            setFilters({ ...filters, gender: e.target.value });
                            setCurrentPage(1);
                          }}
                          className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="ALL">All Genders</option>
                          <option value="MALE">Male</option>
                          <option value="FEMALE">Female</option>
                          <option value="OTHER">Other / As Recorded</option>
                        </select>
                      </div>

                      {/* Age Range Inputs */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                            Age Range (Years)
                          </label>
                          {isAgeRangeInvalid && (
                            <span className="text-[10px] font-bold text-rose-500">
                              Min age exceeds max age
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            min="0"
                            max="120"
                            placeholder="Min Age (e.g. 18)"
                            value={filters.ageMin}
                            onChange={(e) => {
                              setFilters({ ...filters, ageMin: e.target.value });
                              setCurrentPage(1);
                            }}
                            className={`w-1/2 px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800/80 border rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-1 ${
                              isAgeRangeInvalid
                                ? 'border-rose-400 focus:ring-rose-500'
                                : 'border-slate-200 dark:border-slate-700 focus:ring-blue-500'
                            }`}
                          />
                          <span className="text-slate-400 text-xs font-bold">-</span>
                          <input
                            type="number"
                            min="0"
                            max="120"
                            placeholder="Max Age (e.g. 100)"
                            value={filters.ageMax}
                            onChange={(e) => {
                              setFilters({ ...filters, ageMax: e.target.value });
                              setCurrentPage(1);
                            }}
                            className={`w-1/2 px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800/80 border rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-1 ${
                              isAgeRangeInvalid
                                ? 'border-rose-400 focus:ring-rose-500'
                                : 'border-slate-200 dark:border-slate-700 focus:ring-blue-500'
                            }`}
                          />
                        </div>
                      </div>

                      {/* Age Group Quick Presets */}
                      <div>
                        <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                          Age Group Preset
                        </label>
                        <select
                          value={filters.agePreset}
                          onChange={(e) => {
                            setFilters({ ...filters, agePreset: e.target.value });
                            setCurrentPage(1);
                          }}
                          className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="ALL">All Age Groups</option>
                          <option value="18-25">18 - 25 yrs (Youth)</option>
                          <option value="26-40">26 - 40 yrs (Working)</option>
                          <option value="41-60">41 - 60 yrs (Middle Age)</option>
                          <option value="60+">60+ yrs (Senior Citizen)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* CATEGORY 3: Name Filters */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-50/40 dark:bg-slate-900/40">
                <button
                  type="button"
                  onClick={() => toggleCategoryCollapse('nameFilters')}
                  className="w-full flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Tag className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      3. Name Filters
                    </span>
                    <span className="text-[10px] text-slate-400 hidden sm:inline">
                      (Search voter name in English or Hindi, partial matching & case-insensitive)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {nameFiltersActiveCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                        {nameFiltersActiveCount} active
                      </span>
                    )}
                    {collapsedCategories.nameFilters ? (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </button>

                {!collapsedCategories.nameFilters && (
                  <div className="p-3.5 border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 animate-fade-in">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Search Voter Name (English or Hindi / Marathi)
                      </label>
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="Search voter name..."
                          value={filters.voterName}
                          onChange={(e) => {
                            setFilters({ ...filters, voterName: e.target.value });
                            setCurrentPage(1);
                          }}
                          className="w-full pl-9 pr-8 py-1.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-slate-400"
                        />
                        {filters.voterName && (
                          <button
                            type="button"
                            onClick={() => {
                              setFilters({ ...filters, voterName: '' });
                              setCurrentPage(1);
                            }}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        Matches against elector full name, Hindi name (e.g. राजेश), relative name, or relative Hindi name with partial substring support.
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* CATEGORY 4: Location & Identity */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-50/40 dark:bg-slate-900/40">
                <button
                  type="button"
                  onClick={() => toggleCategoryCollapse('locationIdentity')}
                  className="w-full flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      4. Location & Identity
                    </span>
                    <span className="text-[10px] text-slate-400 hidden sm:inline">
                      (Constituency, Booth, Sr. No., House No., EPIC ID, Polling Station, Ward)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {locationIdentityActiveCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                        {locationIdentityActiveCount} active
                      </span>
                    )}
                    {collapsedCategories.locationIdentity ? (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </button>

                {!collapsedCategories.locationIdentity && (
                  <div className="p-3.5 border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 space-y-3 animate-fade-in">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
                      {/* Constituency Number */}
                      <div>
                        <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                          Constituency Number
                        </label>
                        <select
                          value={filters.constituencyNo}
                          onChange={(e) => {
                            setFilters({ ...filters, constituencyNo: e.target.value });
                            setCurrentPage(1);
                          }}
                          className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="ALL">All Constituencies</option>
                          {constituencyOptions.map(c => (
                            <option key={c} value={c}>Constituency #{c}</option>
                          ))}
                        </select>
                      </div>

                      {/* Booth Number */}
                      <div>
                        <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                          Booth Number
                        </label>
                        <select
                          value={filters.boothNo}
                          onChange={(e) => {
                            setFilters({ ...filters, boothNo: e.target.value });
                            setCurrentPage(1);
                          }}
                          className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="ALL">All Booths</option>
                          {boothOptions.map(b => (
                            <option key={b} value={b.toString()}>Booth #{b}</option>
                          ))}
                        </select>
                      </div>

                      {/* Serial Number */}
                      <div>
                        <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                          Serial Number (Sr. No.)
                        </label>
                        <input
                          type="number"
                          placeholder="e.g. 1, 42, 105"
                          value={filters.serialNo}
                          onChange={(e) => {
                            setFilters({ ...filters, serialNo: e.target.value });
                            setCurrentPage(1);
                          }}
                          className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>

                      {/* House Number */}
                      <div>
                        <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                          House Number
                        </label>
                        <input
                          type="text"
                          placeholder="Enter house number..."
                          value={filters.houseNumber}
                          onChange={(e) => {
                            setFilters({ ...filters, houseNumber: e.target.value });
                            setCurrentPage(1);
                          }}
                          className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                      {/* EPIC Number */}
                      <div>
                        <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                          EPIC Number
                        </label>
                        <input
                          type="text"
                          placeholder="Enter EPIC number..."
                          value={filters.epicNumber}
                          onChange={(e) => {
                            setFilters({ ...filters, epicNumber: e.target.value });
                            setCurrentPage(1);
                          }}
                          className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 uppercase font-mono"
                        />
                      </div>

                      {/* Booth Station */}
                      <div>
                        <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                          Booth Station
                        </label>
                        <select
                          value={filters.boothStation}
                          onChange={(e) => {
                            setFilters({ ...filters, boothStation: e.target.value });
                            setCurrentPage(1);
                          }}
                          className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 truncate"
                        >
                          <option value="ALL">All Polling Stations</option>
                          {stationOptions.map(st => (
                            <option key={st} value={st}>{st}</option>
                          ))}
                        </select>
                      </div>

                      {/* Ward */}
                      <div>
                        <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                          Ward
                        </label>
                        <select
                          value={filters.ward}
                          onChange={(e) => {
                            setFilters({ ...filters, ward: e.target.value });
                            setCurrentPage(1);
                          }}
                          className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 truncate"
                        >
                          <option value="ALL">All Wards</option>
                          {wardOptions.map(w => (
                            <option key={w} value={w}>{w}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* CATEGORY 5: Community / Stakeholder Groups */}
              <div className={`border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/40 dark:bg-slate-900/40 transition-all ${
                collapsedCategories.communityRecords ? 'overflow-hidden' : 'overflow-visible'
              }`}>
                <button
                  type="button"
                  onClick={() => toggleCategoryCollapse('communityRecords')}
                  className={`w-full flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors ${
                    collapsedCategories.communityRecords ? 'rounded-xl' : 'rounded-t-xl'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      5. Community / Stakeholder Groups
                    </span>
                    <span className="text-[10px] text-slate-400 hidden sm:inline">
                      (Searchable Multi-Select Dropdown for Farmers, Sugar Workers, Anganwadi, SHGs & Co-ops)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {communityRecordsActiveCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300">
                        {communityRecordsActiveCount} active
                      </span>
                    )}
                    {collapsedCategories.communityRecords ? (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </button>

                {!collapsedCategories.communityRecords && (
                  <div className="p-3.5 border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 space-y-3 animate-fade-in overflow-visible rounded-b-xl">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Community / Stakeholder Groups
                      </label>
                      <CommunityMultiSelectDropdown
                        selectedGroups={filters.communityGroups}
                        onToggleGroup={toggleCommunityGroupFilter}
                        onClearAll={clearAllCommunityGroups}
                        onSelectAll={selectAllCommunityGroups}
                        align="full"
                      />
                    </div>

                    {/* Privacy & Non-Inference Safeguards Notice */}
                    <div className="flex items-start gap-2 p-2.5 rounded-xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200/80 dark:border-teal-900/50 text-[11px] text-teal-800 dark:text-teal-300">
                      <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">Privacy & Compliance Safeguard: </span>
                        <span>
                          Community group records are sourced strictly from voluntary disclosure in the Elector Central Profile or verified field audits. Group affiliations are never inferred from caste, religion, name, or address.
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* MODE 2: LESS FILTERS (Commonly Used Filters Single Grid) */
            <div className="p-3.5 bg-slate-50/50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3 text-xs animate-fade-in overflow-visible">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
                {/* 1. Voter Name */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Voter Name (Eng / Hindi)
                  </label>
                  <input
                    type="text"
                    placeholder="Search voter name..."
                    value={filters.voterName}
                    onChange={(e) => {
                      setFilters({ ...filters, voterName: e.target.value });
                      setCurrentPage(1);
                    }}
                    className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* 2. Constituency No. */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Constituency No.
                  </label>
                  <select
                    value={filters.constituencyNo}
                    onChange={(e) => {
                      setFilters({ ...filters, constituencyNo: e.target.value });
                      setCurrentPage(1);
                    }}
                    className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="ALL">All Constituencies</option>
                    {constituencyOptions.map(c => (
                      <option key={c} value={c}>Constituency #{c}</option>
                    ))}
                  </select>
                </div>

                {/* 3. Booth No. */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Booth No.
                  </label>
                  <select
                    value={filters.boothNo}
                    onChange={(e) => {
                      setFilters({ ...filters, boothNo: e.target.value });
                      setCurrentPage(1);
                    }}
                    className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="ALL">All Booths</option>
                    {boothOptions.map(b => (
                      <option key={b} value={b.toString()}>Booth #{b}</option>
                    ))}
                  </select>
                </div>

                {/* 4. Gender */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Gender
                  </label>
                  <select
                    value={filters.gender}
                    onChange={(e) => {
                      setFilters({ ...filters, gender: e.target.value });
                      setCurrentPage(1);
                    }}
                    className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="ALL">All Genders</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other / As Recorded</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 pt-1">
                {/* 5. Age Range */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Age Range (Min - Max)
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.ageMin}
                      onChange={(e) => {
                        setFilters({ ...filters, ageMin: e.target.value });
                        setCurrentPage(1);
                      }}
                      className="w-1/2 px-2 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <span className="text-slate-400 text-xs">-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.ageMax}
                      onChange={(e) => {
                        setFilters({ ...filters, ageMax: e.target.value });
                        setCurrentPage(1);
                      }}
                      className="w-1/2 px-2 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* 6. Has Mobile */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Has Mobile Phone
                  </label>
                  <div className="grid grid-cols-3 gap-1 p-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-center text-xs">
                    {(['ALL', 'YES', 'NO'] as const).map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => {
                          setFilters(prev => ({ ...prev, hasMobile: val }));
                          setCurrentPage(1);
                        }}
                        className={`py-1 rounded-md text-xs font-semibold transition-all ${
                          filters.hasMobile === val
                            ? 'bg-blue-600 text-white font-bold shadow-2xs'
                            : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        {val === 'ALL' ? 'All' : val === 'YES' ? 'Yes' : 'No'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 7. Deceased */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Deceased Status
                  </label>
                  <div className="grid grid-cols-3 gap-1 p-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-center text-xs">
                    {(['ALL', 'YES', 'NO'] as const).map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => {
                          setFilters(prev => ({ ...prev, deceased: val }));
                          setCurrentPage(1);
                        }}
                        className={`py-1 rounded-md text-xs font-semibold transition-all ${
                          filters.deceased === val
                            ? 'bg-blue-600 text-white font-bold shadow-2xs'
                            : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        {val === 'ALL' ? 'All' : val === 'YES' ? 'Yes' : 'No'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 8. Community / Stakeholder Groups */}
                <div className="overflow-visible">
                  <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Community / Stakeholder Groups
                  </label>
                  <CommunityMultiSelectDropdown
                    selectedGroups={filters.communityGroups}
                    onToggleGroup={toggleCommunityGroupFilter}
                    onClearAll={clearAllCommunityGroups}
                    onSelectAll={selectAllCommunityGroups}
                    align="right"
                  />
                </div>
              </div>

              {/* Direct Switch Link to Advanced Filters */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-200 dark:border-slate-800 text-[11px]">
                <span className="text-slate-400">
                  Need location, EPIC, house number, email, or address filters?
                </span>
                <button
                  type="button"
                  onClick={() => setFilterViewMode('ADVANCED')}
                  className="font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  <span>Switch to Advanced Filters (All 5 Categories)</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. Main Voters Table Container */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        {/* Table Subheader Bar */}
        <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Showing {paginatedVoters.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{' '}
              {Math.min(currentPage * itemsPerPage, filteredVoters.length)} of {filteredVoters.length.toLocaleString()} matching electors
            </span>
            {selectedVoterIds.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[11px] font-bold">
                {selectedVoterIds.length} selected
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Items Per Page */}
            <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
              <span>Rows:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none"
              >
                <option value={6}>6</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>

            <button
              onClick={handleRefresh}
              className="flex items-center gap-1 px-2.5 py-1 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-800 transition-colors"
            >
              <RefreshCw className="w-3 h-3 text-slate-400" />
              <span>Sync</span>
            </button>
            <button
              onClick={() => setShowSmsModal(true)}
              className="flex items-center gap-1 px-2.5 py-1 bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-amber-800 dark:text-amber-300 text-xs font-bold rounded-lg border border-amber-200 dark:border-amber-800 transition-colors"
            >
              <Send className="w-3 h-3 text-amber-600 dark:text-amber-400" />
              <span>SMS {selectedVoterIds.length > 0 ? `(${selectedVoterIds.length})` : ''}</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1 px-2.5 py-1 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold rounded-lg transition-colors"
            >
              <Download className="w-3 h-3 text-slate-300" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Table Content with EXACT 9 requested columns in strict order */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                {/* Checkbox column for batch operations */}
                <th className="py-3 px-3 w-8 text-center">
                  <input
                    type="checkbox"
                    checked={selectedVoterIds.length === paginatedVoters.length && paginatedVoters.length > 0}
                    onChange={toggleSelectAll}
                    className="w-3.5 h-3.5 rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500"
                  />
                </th>

                {/* 1. Constituency No. */}
                <th className="py-3 px-3 w-28 whitespace-nowrap">
                  1. Constituency No.
                </th>

                {/* 2. Booth No. */}
                <th className="py-3 px-3 w-24 whitespace-nowrap">
                  2. Booth No.
                </th>

                {/* 3. Sr. No. */}
                <th className="py-3 px-3 w-20 whitespace-nowrap">
                  3. Sr. No.
                </th>

                {/* 4. Elector Name & Relative */}
                <th className="py-3 px-3 min-w-[220px]">
                  4. Elector Name & Relative
                </th>

                {/* 5. EPIC ID */}
                <th className="py-3 px-3 w-32 whitespace-nowrap">
                  5. EPIC ID
                </th>

                {/* 6. Age / Sex */}
                <th className="py-3 px-3 w-28 whitespace-nowrap">
                  6. Age / Sex
                </th>

                {/* 7. Booth Station & Ward */}
                <th className="py-3 px-3 min-w-[200px]">
                  7. Booth Station & Ward
                </th>

                {/* 8. Contact */}
                <th className="py-3 px-3 w-32 whitespace-nowrap">
                  8. Contact
                </th>

                {/* 9. View Profile */}
                <th className="py-3 px-3 text-right w-28 whitespace-nowrap">
                  9. View Profile
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-medium">
              {paginatedVoters.length > 0 ? (
                paginatedVoters.map((voter) => {
                  const isSelected = selectedVoterIds.includes(voter.id);
                  const constituencyDisplay = voter.constituencyNo || (voter.assemblySegment ? voter.assemblySegment.split(' - ')[0] : '215');
                  const wardDisplay = voter.ward || voter.prabhaag || 'Ward 12';

                  return (
                    <tr
                      key={voter.id}
                      className={`hover:bg-blue-50/30 dark:hover:bg-slate-800/40 transition-colors ${
                        isSelected ? 'bg-blue-50/40 dark:bg-blue-950/30' : ''
                      }`}
                    >
                      {/* Batch Select Checkbox */}
                      <td className="py-3 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectOne(voter.id)}
                          className="w-3.5 h-3.5 rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500"
                        />
                      </td>

                      {/* 1. Constituency No. */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 font-mono text-xs font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded">
                          AC-{constituencyDisplay}
                        </span>
                      </td>

                      {/* 2. Booth No. */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 font-mono text-xs font-bold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/50 px-2 py-0.5 rounded">
                          #{voter.boothNumber}
                        </span>
                      </td>

                      {/* 3. Sr. No. */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 rounded">
                          #{voter.serialNo}
                        </span>
                      </td>

                      {/* 4. Elector Name & Relative (includes Hindi name where available) */}
                      <td className="py-3 px-3">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <button
                              onClick={() => onSelectVoter(voter)}
                              className="font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 text-left transition-colors"
                              title="Click to view complete voter profile"
                            >
                              {voter.fullName}
                            </button>
                            {voter.hindiName && (
                              <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                                {voter.hindiName}
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 flex-wrap">
                            <span>
                              {voter.relationType === 'Father'
                                ? 'S/o'
                                : voter.relationType === 'Husband'
                                ? 'W/o'
                                : voter.relationType === 'Mother'
                                ? 'D/o'
                                : 'R/o'}{' '}
                              {voter.relativeName}
                            </span>
                            {voter.relativeHindiName && (
                              <span className="text-slate-400">({voter.relativeHindiName})</span>
                            )}
                          </div>

                          {/* Saved Community / Stakeholder Group Associations */}
                          {(() => {
                            const allocs = getAllocationsForElector(voter.id || voter.voterCode);
                            const st = getElectorStatus(voter.id || voter.voterCode);
                            if (allocs.length > 0) {
                              return (
                                <div className="flex items-center gap-1 flex-wrap pt-0.5">
                                  {allocs.map(a => (
                                    <span
                                      key={a.id}
                                      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800"
                                      title={`${a.category}: ${a.groupName} (${a.verificationStatus}) in ${a.villageOrLocality}`}
                                    >
                                      <Users className="w-2.5 h-2.5" />
                                      <span>{a.groupName.split('/')[0].trim()}</span>
                                      {a.verificationStatus === 'VERIFIED' && (
                                        <Check className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" />
                                      )}
                                    </span>
                                  ))}
                                </div>
                              );
                            }
                            if (st === 'NOT_ASSOCIATED') {
                              return (
                                <div className="pt-0.5">
                                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800">
                                    Not Associated
                                  </span>
                                </div>
                              );
                            }
                            if (st === 'NOT_DISCLOSED') {
                              return (
                                <div className="pt-0.5">
                                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                    Not Disclosed
                                  </span>
                                </div>
                              );
                            }
                            return null;
                          })()}
                        </div>
                      </td>

                      {/* 5. EPIC ID */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="inline-flex items-center gap-1">
                          <span className="font-mono text-[11px] font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded tracking-wide">
                            {voter.epicNumber}
                          </span>
                          <button
                            onClick={() => handleCopyEpic(voter.epicNumber)}
                            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded transition-colors"
                            title="Copy EPIC ID"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      </td>

                      {/* 6. Age / Sex (compact format) */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5 text-xs">
                          <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                            {voter.age} yrs
                          </span>
                          <span className="text-slate-400">/</span>
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              voter.gender === 'MALE'
                                ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50'
                                : voter.gender === 'FEMALE'
                                ? 'bg-pink-50 dark:bg-pink-950/60 text-pink-700 dark:text-pink-400 border border-pink-200 dark:border-pink-900/50'
                                : 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-900/50'
                            }`}
                          >
                            {voter.gender === 'MALE' ? 'Male' : voter.gender === 'FEMALE' ? 'Female' : 'Other'}
                          </span>
                        </div>
                      </td>

                      {/* 7. Booth Station & Ward */}
                      <td className="py-3 px-3">
                        <div className="max-w-[240px]">
                          <span
                            className="font-semibold text-xs text-slate-900 dark:text-slate-100 block truncate"
                            title={voter.pollingStation}
                          >
                            {voter.pollingStation}
                          </span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate">{wardDisplay}</span>
                          </span>
                        </div>
                      </td>

                      {/* 8. Contact */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        {voter.mobile ? (
                          <a
                            href={`tel:${voter.mobile}`}
                            className="inline-flex items-center gap-1 font-mono text-[11px] text-blue-600 dark:text-blue-400 hover:underline"
                            title="Call elector"
                          >
                            <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{voter.mobile}</span>
                          </a>
                        ) : (
                          <span className="text-slate-400 text-xs font-mono">—</span>
                        )}
                      </td>

                      {/* 9. View Profile (Action button) */}
                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <button
                          onClick={() => onSelectVoter(voter)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold rounded-xl text-xs transition-all shadow-xs shrink-0"
                          title="Open Central Voter Profile"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Profile</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-500 dark:text-slate-400">
                    <Users className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                    <p className="font-semibold text-xs text-slate-700 dark:text-slate-200">
                      No electors found matching criteria
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Try clearing filters or adjusting your global search query.
                    </p>
                    <button
                      onClick={handleResetFilters}
                      className="mt-3 px-3 py-1 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors"
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
        <div className="p-3 bg-slate-50/70 dark:bg-slate-900/70 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <div>
            Showing {paginatedVoters.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{' '}
            {Math.min(currentPage * itemsPerPage, filteredVoters.length)} of {filteredVoters.length.toLocaleString()} entries
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-1 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 transition-colors"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4 text-slate-600 dark:text-slate-300" />
            </button>

            {Array.from({ length: Math.min(3, totalPages) }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-7 h-7 rounded text-xs font-bold transition-all ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
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
                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                {totalPages.toLocaleString()}
              </button>
            )}

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 transition-colors"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4 text-slate-600 dark:text-slate-300" />
            </button>
          </div>
        </div>
      </div>

      {/* Add Voter Modal */}
      {showAddVoterModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 shadow-2xl space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Register New Elector</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Add verified voter information into the electoral roll register.</p>
              </div>
              <button
                onClick={() => setShowAddVoterModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddVoterSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Full Name (English)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Narayan Joshi"
                    value={newVoterForm.fullName}
                    onChange={(e) => setNewVoterForm({ ...newVoterForm, fullName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Hindi / Local Name</label>
                  <input
                    type="text"
                    placeholder="e.g. रमेश नारायण जोशी"
                    value={newVoterForm.hindiName}
                    onChange={(e) => setNewVoterForm({ ...newVoterForm, hindiName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Relative Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Father / Husband Name"
                    value={newVoterForm.relativeName}
                    onChange={(e) => setNewVoterForm({ ...newVoterForm, relativeName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Relation Type</label>
                  <select
                    value={newVoterForm.relationType}
                    onChange={(e) => setNewVoterForm({ ...newVoterForm, relationType: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  >
                    <option value="Father">Father (S/o)</option>
                    <option value="Husband">Husband (W/o)</option>
                    <option value="Mother">Mother (D/o)</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Sex / Gender</label>
                  <select
                    value={newVoterForm.gender}
                    onChange={(e) => setNewVoterForm({ ...newVoterForm, gender: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Age</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 35"
                    value={newVoterForm.age}
                    onChange={(e) => setNewVoterForm({ ...newVoterForm, age: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">EPIC Number</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. WXE8921029"
                    value={newVoterForm.epicNumber}
                    onChange={(e) => setNewVoterForm({ ...newVoterForm, epicNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Constituency No.</label>
                  <input
                    type="text"
                    placeholder="e.g. 215"
                    value={newVoterForm.constituencyNo}
                    onChange={(e) => setNewVoterForm({ ...newVoterForm, constituencyNo: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Assigned Booth</label>
                  <select
                    value={newVoterForm.boothNumber}
                    onChange={(e) => setNewVoterForm({ ...newVoterForm, boothNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  >
                    {boothOptions.map(b => (
                      <option key={b} value={b.toString()}>
                        Booth #{b}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Contact Phone</label>
                  <input
                    type="text"
                    placeholder="+91 98220 00000"
                    value={newVoterForm.mobile}
                    onChange={(e) => setNewVoterForm({ ...newVoterForm, mobile: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Residential Address</label>
                <textarea
                  rows={2}
                  placeholder="Plot/Flat no, Lane, Locality, Area"
                  value={newVoterForm.address}
                  onChange={(e) => setNewVoterForm({ ...newVoterForm, address: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddVoterModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
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
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 shadow-2xl space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Broadcast Campaign SMS</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Target: {selectedVoterIds.length > 0 ? `${selectedVoterIds.length} Selected Voters` : `${filteredVoters.length.toLocaleString()} Filtered Voters`}
                </p>
              </div>
              <button
                onClick={() => setShowSmsModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">SMS Template / Content</label>
                <textarea
                  rows={4}
                  value={smsMessage}
                  onChange={(e) => setSmsMessage(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
                <span className="text-[10px] text-slate-400 block mt-1">
                  Supports voter tags: {'{VoterName}'}, {'{BoothNo}'}, {'{PollingStation}'}
                </span>
              </div>

              <div className="p-3 bg-blue-50/60 dark:bg-blue-950/40 rounded-xl border border-blue-100 dark:border-blue-900/60 flex items-center gap-2">
                <Send className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <span className="text-[11px] text-blue-800 dark:text-blue-300">
                  Estimated delivery cost: ₹{((selectedVoterIds.length > 0 ? selectedVoterIds.length : filteredVoters.length) * 0.12).toFixed(2)} via DLT SMS Gateway.
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => setShowSmsModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
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
