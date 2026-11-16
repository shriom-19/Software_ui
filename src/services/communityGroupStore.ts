import { useState, useEffect } from 'react';
import { CommunityGroupAssociation, CommunityGroupCategory, ElectorAssociationStatus } from '../types';

export interface CategoryMeta {
  category: CommunityGroupCategory;
  defaultGroupName: string;
  badgeBg: string;
  badgeColor: string;
  borderClass: string;
  dotColor: string;
  description: string;
}

export const COMMUNITY_GROUP_CATEGORIES: CategoryMeta[] = [
  {
    category: 'Agriculture',
    defaultGroupName: "Farmers / Farmers' Associations",
    badgeBg: 'bg-emerald-50 dark:bg-emerald-950/60',
    badgeColor: 'text-emerald-700 dark:text-emerald-400',
    borderClass: 'border-emerald-200 dark:border-emerald-800',
    dotColor: 'bg-emerald-500',
    description: 'Farmers, Krishi Vikas Sangh, irrigation & farm worker associations'
  },
  {
    category: 'Sugar Industry',
    defaultGroupName: 'Sugar Factory Workers / Sugar Cooperative Members',
    badgeBg: 'bg-amber-50 dark:bg-amber-950/60',
    badgeColor: 'text-amber-700 dark:text-amber-400',
    borderClass: 'border-amber-200 dark:border-amber-800',
    dotColor: 'bg-amber-500',
    description: 'Sugar mill staff, cane grower societies & seasonal factory personnel'
  },
  {
    category: 'Childcare & Community Services',
    defaultGroupName: 'Anganwadi Workers / Balwadi Staff',
    badgeBg: 'bg-pink-50 dark:bg-pink-950/60',
    badgeColor: 'text-pink-700 dark:text-pink-400',
    borderClass: 'border-pink-200 dark:border-pink-800',
    dotColor: 'bg-pink-500',
    description: 'Anganwadi sevikas, helpers, Balwadi teachers & community health volunteers'
  },
  {
    category: 'Village Community',
    defaultGroupName: 'Village Community Members',
    badgeBg: 'bg-blue-50 dark:bg-blue-950/60',
    badgeColor: 'text-blue-700 dark:text-blue-400',
    borderClass: 'border-blue-200 dark:border-blue-800',
    dotColor: 'bg-blue-500',
    description: 'Gram Sabha active community elders, youth mandals & village forums'
  },
  {
    category: 'Local Organisations',
    defaultGroupName: 'Local Stakeholders / Association Members',
    badgeBg: 'bg-purple-50 dark:bg-purple-950/60',
    badgeColor: 'text-purple-700 dark:text-purple-400',
    borderClass: 'border-purple-200 dark:border-purple-800',
    dotColor: 'bg-purple-500',
    description: 'Vyapar mandals, trader guilds, market associations & RWA committees'
  },
  {
    category: 'Cooperatives',
    defaultGroupName: 'Cooperative Society Members',
    badgeBg: 'bg-indigo-50 dark:bg-indigo-950/60',
    badgeColor: 'text-indigo-700 dark:text-indigo-400',
    borderClass: 'border-indigo-200 dark:border-indigo-800',
    dotColor: 'bg-indigo-500',
    description: 'Patsanstha credit societies, milk dairies & housing cooperative members'
  },
  {
    category: 'Self-Help Groups',
    defaultGroupName: 'SHG Members',
    badgeBg: 'bg-teal-50 dark:bg-teal-950/60',
    badgeColor: 'text-teal-700 dark:text-teal-400',
    borderClass: 'border-teal-200 dark:border-teal-800',
    dotColor: 'bg-teal-500',
    description: 'Mahila Bachat Gat members, women micro-enterprise & cluster networks'
  },
  {
    category: 'Other',
    defaultGroupName: 'Other Community Groups',
    badgeBg: 'bg-slate-100 dark:bg-slate-800',
    badgeColor: 'text-slate-700 dark:text-slate-300',
    borderClass: 'border-slate-300 dark:border-slate-700',
    dotColor: 'bg-slate-500',
    description: 'Special interest civic forums, transport unions & voluntary collectives'
  }
];

export const COMMUNITY_FILTER_OPTIONS = [
  { id: 'Agriculture', label: "Farmers / Farmers' Associations", shortLabel: 'Farmers' },
  { id: 'Sugar Industry', label: 'Sugar Factory Workers / Sugar Cooperative Members', shortLabel: 'Sugar Workers' },
  { id: 'Childcare & Community Services', label: 'Anganwadi / Balwadi Workers', shortLabel: 'Anganwadi' },
  { id: 'Village Community', label: 'Village Community Members', shortLabel: 'Village Community' },
  { id: 'Local Organisations', label: 'Local Stakeholders / Association Members', shortLabel: 'Local Stakeholders' },
  { id: 'Cooperatives', label: 'Cooperative Society Members', shortLabel: 'Cooperatives' },
  { id: 'Self-Help Groups', label: 'Self-Help Group Members', shortLabel: 'SHG Members' },
  { id: 'Other', label: 'Other Community Groups', shortLabel: 'Other Groups' },
  { id: 'NOT_ASSOCIATED', label: 'Not Associated', shortLabel: 'Not Associated' },
  { id: 'NOT_DISCLOSED', label: 'Not Disclosed', shortLabel: 'Not Disclosed' }
];

// Initial seeded allocations linked to electors in MOCK_VOTERS
const INITIAL_COMMUNITY_ALLOCATIONS: CommunityGroupAssociation[] = [
  // Rajesh Kumar Verma (46250582 / WXE4829102)
  {
    id: 'cga-001',
    electorId: '46250582',
    category: 'Local Organisations',
    groupName: 'Local Stakeholders / Association Members',
    villageOrLocality: 'Kasba Peth, Pune',
    designation: 'Executive Committee Member, Vyapar Mandal',
    allocationDate: '2024-01-15',
    verificationStatus: 'VERIFIED',
    notes: 'Voluntarily declared during trader forum registration. Holds voting rights in city market guild.',
    allocatedBy: 'Vikas M. Patil (Booth Incharge)',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 'cga-002',
    electorId: '46250582',
    category: 'Cooperatives',
    groupName: 'Cooperative Society Members',
    villageOrLocality: 'Kasba Peth',
    designation: 'Shareholder Member',
    allocationDate: '2024-02-10',
    verificationStatus: 'VERIFIED',
    notes: 'Member of Kasba Sahakari Patsanstha since 2012.',
    allocatedBy: 'Vikas M. Patil',
    createdAt: '2024-02-10T11:00:00Z',
    updatedAt: '2024-02-10T11:00:00Z'
  },
  // Sunita Rajesh Verma (46251581 / WXE0821443)
  {
    id: 'cga-003',
    electorId: '46251581',
    category: 'Self-Help Groups',
    groupName: 'SHG Members',
    villageOrLocality: 'Kasba Peth, Ward 12',
    designation: 'Treasurer, Janaki Mahila Bachat Gat',
    allocationDate: '2024-02-05',
    verificationStatus: 'VERIFIED',
    notes: 'Active in monthly micro-savings and government scheme guidance.',
    allocatedBy: 'Pooja S. Jadhav (Karyakarta)',
    createdAt: '2024-02-05T09:15:00Z',
    updatedAt: '2024-02-05T09:15:00Z'
  },
  // Amit Baban Shinde (46251583 / WXE1290384)
  {
    id: 'cga-004',
    electorId: '46251583',
    category: 'Sugar Industry',
    groupName: 'Sugar Factory Workers / Sugar Cooperative Members',
    villageOrLocality: 'Gaothan, Kasba Peth',
    designation: 'Maintenance Technician, Cooperative Sugar Mill',
    allocationDate: '2024-03-12',
    verificationStatus: 'UNVERIFIED',
    notes: 'Self-declared union membership awaiting verification from mill worker registry.',
    allocatedBy: 'Self-Declared Field Survey',
    createdAt: '2024-03-12T14:20:00Z',
    updatedAt: '2024-03-12T14:20:00Z'
  },
  // Kavita Ashok Patil (46251584 / WXE7765109)
  {
    id: 'cga-005',
    electorId: '46251584',
    category: 'Childcare & Community Services',
    groupName: 'Anganwadi Workers / Balwadi Staff',
    villageOrLocality: 'Erandwane, Ward 14',
    designation: 'Anganwadi Supervisor (ICDS Cluster 4)',
    allocationDate: '2023-11-20',
    verificationStatus: 'VERIFIED',
    notes: 'Coordinates 8 Balwadis in Erandwane and Deccan areas.',
    allocatedBy: 'Central Verification Desk',
    createdAt: '2023-11-20T12:00:00Z',
    updatedAt: '2024-01-10T16:00:00Z'
  },
  {
    id: 'cga-006',
    electorId: '46251584',
    category: 'Self-Help Groups',
    groupName: 'SHG Members',
    villageOrLocality: 'Erandwane',
    designation: 'Cluster Mentor',
    allocationDate: '2024-01-08',
    verificationStatus: 'VERIFIED',
    notes: 'Mentors 3 local women self-help clusters under MAVIM.',
    allocatedBy: 'Central Verification Desk',
    createdAt: '2024-01-08T10:00:00Z',
    updatedAt: '2024-01-08T10:00:00Z'
  },
  // Surendra Mohan Joshi (46251585 / WXE5544321)
  {
    id: 'cga-007',
    electorId: '46251585',
    category: 'Local Organisations',
    groupName: 'Local Stakeholders / Association Members',
    villageOrLocality: 'Deccan Gymkhana, Ward 14',
    designation: 'President, Deccan Resident Welfare Association',
    allocationDate: '2023-08-14',
    verificationStatus: 'VERIFIED',
    notes: 'Key community convener for civic issues, traffic, and municipal works.',
    allocatedBy: 'Asha V. More (BLO Coordinator)',
    createdAt: '2023-08-14T11:45:00Z',
    updatedAt: '2024-01-02T10:00:00Z'
  },
  // Sunita Ramesh Deshmukh (v-001 / MH34089211)
  {
    id: 'cga-008',
    electorId: 'v-001',
    category: 'Village Community',
    groupName: 'Village Community Members',
    villageOrLocality: 'Kothrud West, Ward 12',
    designation: 'Community Welfare Council Member',
    allocationDate: '2024-01-18',
    verificationStatus: 'VERIFIED',
    notes: 'Active in neighborhood sanitation and cultural festivals committee.',
    allocatedBy: 'Vikas M. Patil',
    createdAt: '2024-01-18T15:30:00Z',
    updatedAt: '2024-01-18T15:30:00Z'
  },
  {
    id: 'cga-009',
    electorId: 'v-001',
    category: 'Self-Help Groups',
    groupName: 'SHG Members',
    villageOrLocality: 'Ideal Colony, Kothrud',
    designation: 'President, Ideal Mahila Mandal & Bachat Gat',
    allocationDate: '2023-09-01',
    verificationStatus: 'VERIFIED',
    notes: 'Voluntarily leads 40 women members in micro-credit activities.',
    allocatedBy: 'Vikas M. Patil',
    createdAt: '2023-09-01T10:00:00Z',
    updatedAt: '2024-02-14T11:20:00Z'
  },
  // Prashant Bhimrao Kamble (v-006 / MH34015670)
  {
    id: 'cga-010',
    electorId: 'v-006',
    category: 'Agriculture',
    groupName: "Farmers / Farmers' Associations",
    villageOrLocality: 'Paud Phata / Mulshi Border',
    designation: 'Family Farmland Co-holder',
    allocationDate: '2024-02-18',
    verificationStatus: 'UNVERIFIED',
    notes: 'Self-reported ancestral agricultural plot association awaiting 7/12 sync.',
    allocatedBy: 'Field Survey Desk',
    createdAt: '2024-02-18T13:10:00Z',
    updatedAt: '2024-02-18T13:10:00Z'
  },
  {
    id: 'cga-011',
    electorId: 'v-006',
    category: 'Other',
    groupName: 'Other Community Groups',
    villageOrLocality: 'Paud Road, Ward 12',
    designation: 'Representative, Paud Phata Auto Workers Union',
    allocationDate: '2023-10-10',
    verificationStatus: 'VERIFIED',
    notes: 'Verified representative for informal transport workforce welfare.',
    allocatedBy: 'Ramesh M. More',
    createdAt: '2023-10-10T09:00:00Z',
    updatedAt: '2023-10-10T09:00:00Z'
  },
  // Mohammad Irfan Shaikh (v-008 / MH34029810)
  {
    id: 'cga-012',
    electorId: 'v-008',
    category: 'Cooperatives',
    groupName: 'Cooperative Society Members',
    villageOrLocality: 'Erandwane, Ward 13',
    designation: 'Active Member, Hardware Traders Credit Cooperative',
    allocationDate: '2023-12-05',
    verificationStatus: 'VERIFIED',
    notes: 'Active member with verified passbook entry.',
    allocatedBy: 'Pooja S. Jadhav',
    createdAt: '2023-12-05T14:00:00Z',
    updatedAt: '2023-12-05T14:00:00Z'
  }
];

// Initial seeded elector statuses:
// Pooja Santosh Deshmukh: NOT_DISCLOSED
// Ramesh Vasantrao Deshmukh: NOT_ASSOCIATED
const INITIAL_ELECTOR_STATUSES: Record<string, ElectorAssociationStatus> = {
  '46251582': 'NOT_DISCLOSED', // Pooja Deshmukh
  'v-002': 'NOT_ASSOCIATED'     // Ramesh Vasantrao Deshmukh
};

class CommunityGroupStoreManager {
  private allocations: CommunityGroupAssociation[] = [];
  private electorStatuses: Record<string, ElectorAssociationStatus> = {};
  private listeners: Set<() => void> = new Set();
  private lastUpdated: string = new Date().toISOString();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const storedAlloc = window.localStorage.getItem('indata_community_allocations_v1');
        const storedStatuses = window.localStorage.getItem('indata_elector_statuses_v1');

        if (storedAlloc) {
          this.allocations = JSON.parse(storedAlloc);
        } else {
          this.allocations = [...INITIAL_COMMUNITY_ALLOCATIONS];
          window.localStorage.setItem('indata_community_allocations_v1', JSON.stringify(this.allocations));
        }

        if (storedStatuses) {
          this.electorStatuses = JSON.parse(storedStatuses);
        } else {
          this.electorStatuses = { ...INITIAL_ELECTOR_STATUSES };
          window.localStorage.setItem('indata_elector_statuses_v1', JSON.stringify(this.electorStatuses));
        }
      } else {
        this.allocations = [...INITIAL_COMMUNITY_ALLOCATIONS];
        this.electorStatuses = { ...INITIAL_ELECTOR_STATUSES };
      }
    } catch {
      this.allocations = [...INITIAL_COMMUNITY_ALLOCATIONS];
      this.electorStatuses = { ...INITIAL_ELECTOR_STATUSES };
    }
  }

  private persist() {
    try {
      this.lastUpdated = new Date().toISOString();
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem('indata_community_allocations_v1', JSON.stringify(this.allocations));
        window.localStorage.setItem('indata_elector_statuses_v1', JSON.stringify(this.electorStatuses));
      }
    } catch {
      // Ignore storage errors
    }
    this.notify();
  }

  private notify() {
    this.listeners.forEach(cb => {
      try {
        cb();
      } catch (err) {
        console.error('Error notifying listener:', err);
      }
    });

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('community-groups-updated', {
        detail: { timestamp: this.lastUpdated }
      }));
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public getAllocations(): CommunityGroupAssociation[] {
    return [...this.allocations];
  }

  public getAllocationsForElector(electorId: string): CommunityGroupAssociation[] {
    return this.allocations.filter(a => a.electorId === electorId);
  }

  public getElectorStatus(electorId: string): ElectorAssociationStatus {
    const direct = this.electorStatuses[electorId];
    if (direct) return direct;
    const count = this.getAllocationsForElector(electorId).length;
    return count > 0 ? 'ACTIVE' : 'NOT_DISCLOSED';
  }

  public setElectorStatus(electorId: string, status: ElectorAssociationStatus) {
    if (status === 'ACTIVE') {
      delete this.electorStatuses[electorId];
    } else {
      this.electorStatuses[electorId] = status;
      // If marked not associated or not disclosed, remove existing active allocations to stay consistent
      this.allocations = this.allocations.filter(a => a.electorId !== electorId);
    }
    this.persist();
  }

  public addOrUpdateAllocation(
    electorId: string,
    data: {
      category: CommunityGroupCategory;
      groupName: string;
      villageOrLocality: string;
      designation?: string;
      allocationDate?: string;
      verificationStatus: 'VERIFIED' | 'UNVERIFIED';
      notes?: string;
    },
    existingId?: string
  ): CommunityGroupAssociation {
    // Clear any negative status for this elector
    delete this.electorStatuses[electorId];

    const now = new Date().toISOString();
    const dateStr = data.allocationDate || now.slice(0, 10);

    if (existingId) {
      const idx = this.allocations.findIndex(a => a.id === existingId);
      if (idx !== -1) {
        const updated: CommunityGroupAssociation = {
          ...this.allocations[idx],
          category: data.category,
          groupName: data.groupName,
          villageOrLocality: data.villageOrLocality,
          designation: data.designation || '',
          allocationDate: dateStr,
          verificationStatus: data.verificationStatus,
          notes: data.notes || '',
          updatedAt: now
        };
        this.allocations[idx] = updated;
        this.persist();
        return updated;
      }
    }

    const newRecord: CommunityGroupAssociation = {
      id: `cga-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      electorId,
      category: data.category,
      groupName: data.groupName,
      villageOrLocality: data.villageOrLocality,
      designation: data.designation || '',
      allocationDate: dateStr,
      verificationStatus: data.verificationStatus,
      notes: data.notes || '',
      allocatedBy: 'Authorized Candidate Admin',
      createdAt: now,
      updatedAt: now
    };

    this.allocations.unshift(newRecord);
    this.persist();
    return newRecord;
  }

  public deleteAllocation(id: string): boolean {
    const beforeCount = this.allocations.length;
    this.allocations = this.allocations.filter(a => a.id !== id);
    if (this.allocations.length !== beforeCount) {
      this.persist();
      return true;
    }
    return false;
  }

  public toggleVerification(id: string): void {
    const item = this.allocations.find(a => a.id === id);
    if (item) {
      item.verificationStatus = item.verificationStatus === 'VERIFIED' ? 'UNVERIFIED' : 'VERIFIED';
      item.updatedAt = new Date().toISOString();
      this.persist();
    }
  }

  public resetToDefaults(): void {
    this.allocations = [...INITIAL_COMMUNITY_ALLOCATIONS];
    this.electorStatuses = { ...INITIAL_ELECTOR_STATUSES };
    this.persist();
  }

  public getCommunityStatistics() {
    const allAllocations = this.allocations;

    // Unique electors with at least one active allocation
    const uniqueAssociatedElectors = new Set(allAllocations.map(a => a.electorId));
    const totalAssociatedElectors = uniqueAssociatedElectors.size;

    // Category counts
    const categoryCounts: Record<CommunityGroupCategory, number> = {
      'Agriculture': 0,
      'Sugar Industry': 0,
      'Childcare & Community Services': 0,
      'Village Community': 0,
      'Local Organisations': 0,
      'Cooperatives': 0,
      'Self-Help Groups': 0,
      'Other': 0
    };

    let verifiedCount = 0;
    let unverifiedCount = 0;

    allAllocations.forEach(a => {
      if (categoryCounts[a.category] !== undefined) {
        categoryCounts[a.category]++;
      }
      if (a.verificationStatus === 'VERIFIED') {
        verifiedCount++;
      } else {
        unverifiedCount++;
      }
    });

    // Count not associated & not disclosed from status map
    let notAssociatedCount = 0;
    let notDisclosedCount = 0;

    Object.values(this.electorStatuses).forEach(status => {
      if (status === 'NOT_ASSOCIATED') notAssociatedCount++;
      if (status === 'NOT_DISCLOSED') notDisclosedCount++;
    });

    const totalAllocations = allAllocations.length;

    // Distribution percentages
    const distribution = Object.entries(categoryCounts).map(([cat, count]) => ({
      category: cat as CommunityGroupCategory,
      count,
      percentage: totalAllocations > 0 ? Math.round((count / totalAllocations) * 100) : 0
    }));

    // Verification rate
    const verificationRate = totalAllocations > 0 ? Math.round((verifiedCount / totalAllocations) * 100) : 0;

    return {
      totalAssociatedElectors,
      totalAllocations,
      farmersCount: categoryCounts['Agriculture'],
      sugarWorkersCount: categoryCounts['Sugar Industry'],
      anganwadiCount: categoryCounts['Childcare & Community Services'],
      villageCommunityCount: categoryCounts['Village Community'],
      localStakeholdersCount: categoryCounts['Local Organisations'],
      cooperativesCount: categoryCounts['Cooperatives'],
      shgCount: categoryCounts['Self-Help Groups'],
      otherCount: categoryCounts['Other'],
      pendingVerification: unverifiedCount,
      verifiedCount,
      notAssociatedCount,
      notDisclosedCount,
      distribution,
      verificationRate,
      lastUpdated: this.lastUpdated
    };
  }
}

export const communityGroupStore = new CommunityGroupStoreManager();

export function useCommunityGroups() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const unsubscribe = communityGroupStore.subscribe(() => {
      setTick(t => t + 1);
    });

    const handleCustomEvent = () => setTick(t => t + 1);
    if (typeof window !== 'undefined') {
      window.addEventListener('community-groups-updated', handleCustomEvent);
    }

    return () => {
      unsubscribe();
      if (typeof window !== 'undefined') {
        window.removeEventListener('community-groups-updated', handleCustomEvent);
      }
    };
  }, []);

  return {
    allocations: communityGroupStore.getAllocations(),
    stats: communityGroupStore.getCommunityStatistics(),
    getAllocationsForElector: (electorId: string) => communityGroupStore.getAllocationsForElector(electorId),
    getElectorStatus: (electorId: string) => communityGroupStore.getElectorStatus(electorId),
    setElectorStatus: (electorId: string, status: ElectorAssociationStatus) => communityGroupStore.setElectorStatus(electorId, status),
    addOrUpdateAllocation: communityGroupStore.addOrUpdateAllocation.bind(communityGroupStore),
    deleteAllocation: communityGroupStore.deleteAllocation.bind(communityGroupStore),
    toggleVerification: communityGroupStore.toggleVerification.bind(communityGroupStore),
    resetToDefaults: communityGroupStore.resetToDefaults.bind(communityGroupStore)
  };
}
