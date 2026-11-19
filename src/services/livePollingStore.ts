import { useState, useEffect } from 'react';
import { MOCK_BOOTHS, MOCK_VOTERS } from '../data/mockData';
import { Voter, Booth } from '../types';

export interface VoterVotingRecord {
  voterId: string;
  epicNumber: string;
  fullName: string;
  boothNumber: number;
  hasVoted: boolean;
  votingDate: string;
  votingTime: string;
  updatedBy: string;
  updatedAt: string;
}

export interface TimeSlotData {
  time: string;
  label: string;
  votes: number;
  percentage: number;
  deltaVotes: number;
  deltaPercentage: number;
}

export interface BoothLivePollingStats {
  boothNumber: number;
  name: string;
  locality: string;
  totalVoters: number;
  bloName: string;
  bloPhone: string;
  karyakartaCount: number;
  slipsDeliveredPercent: number;
  projectedTurnoutPercent: number;
  previousTurnoutPercent: number;
  actualVotesCast: number;
  remainingVoters: number;
  liveTurnoutPercent: number;
  maleVoted: number;
  femaleVoted: number;
  otherVoted: number;
  lastUpdated: string;
  grade: 'A' | 'B' | 'C' | 'D';
  hourlyProgress: TimeSlotData[];
}

export interface ConstituencyPollingSummary {
  totalRegisteredVoters: number;
  totalVotesCast: number;
  totalPendingVoters: number;
  overallVotingPercentage: number;
  totalPollingBooths: number;
  boothsReporting: number;
  verifiedVotingPercentage: number;
  lastSyncTime: string;
}

// Initial baseline mock data for voter voting records
const getInitialVotingRecords = (): Record<string, VoterVotingRecord> => {
  const records: Record<string, VoterVotingRecord> = {};
  
  MOCK_VOTERS.forEach((voter, index) => {
    // Initial voted status seeded from voter.hasVoted or realistic pattern
    const hasVoted = voter.hasVoted ?? (index % 3 !== 0);
    const hour = 7 + (index % 10);
    const minute = (index * 7) % 60;
    const timeStr = `${hour > 12 ? hour - 12 : hour}:${minute.toString().padStart(2, '0')} ${hour >= 12 ? 'PM' : 'AM'}`;

    records[voter.id] = {
      voterId: voter.id,
      epicNumber: voter.epicNumber,
      fullName: voter.fullName,
      boothNumber: voter.boothNumber,
      hasVoted,
      votingDate: '19 Nov 2024',
      votingTime: hasVoted ? timeStr : '--',
      updatedBy: hasVoted ? (voter.karyakartaName || 'Booth Agent Sanjay K.') : 'Not Reported',
      updatedAt: hasVoted ? '19 Nov 2024, ' + timeStr : ''
    };
  });

  return records;
};

// Local storage key for persistent polling state across sessions
const STORAGE_KEY = 'rajtantra_live_polling_records_v1';

let globalVotingRecords: Record<string, VoterVotingRecord> = (() => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load live polling records from storage', e);
  }
  return getInitialVotingRecords();
})();

const listeners = new Set<() => void>();

const broadcastChange = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(globalVotingRecords));
  } catch (e) {
    console.error('Failed to persist polling records', e);
  }
  listeners.forEach((listener) => listener());
};

// Seed baseline turnout ratios for sample booths 101-108
const BOOTH_BASE_VOTED_RATIOS: Record<number, number> = {
  101: 0.684,
  102: 0.652,
  103: 0.541,
  104: 0.513,
  105: 0.489,
  106: 0.691,
  107: 0.583,
  108: 0.415
};

// Helper: Calculate hourly progression curve
export const computeHourlyProgress = (totalVotes: number, totalVoters: number): TimeSlotData[] => {
  // Proportions of day's total vote at standard reporting checkpoints
  const intervals = [
    { time: '07:00 AM', label: 'Poll Commencement', weight: 0.08 },
    { time: '09:00 AM', label: 'Morning Surge', weight: 0.22 },
    { time: '11:00 AM', label: 'Mid-Morning Update', weight: 0.41 },
    { time: '01:00 PM', label: 'Midday Report', weight: 0.60 },
    { time: '03:00 PM', label: 'Post-Lunch Pickup', weight: 0.77 },
    { time: '05:00 PM', label: 'Evening Peak', weight: 0.94 },
    { time: '06:00 PM', label: 'Poll Closure (Final)', weight: 1.00 }
  ];

  let previousVotes = 0;
  return intervals.map((interval) => {
    const cumulativeVotes = Math.round(totalVotes * interval.weight);
    const deltaVotes = cumulativeVotes - previousVotes;
    const percentage = Number(((cumulativeVotes / (totalVoters || 1)) * 100).toFixed(1));
    const previousPercentage = Number(((previousVotes / (totalVoters || 1)) * 100).toFixed(1));
    const deltaPercentage = Number((percentage - previousPercentage).toFixed(1));

    previousVotes = cumulativeVotes;

    return {
      time: interval.time,
      label: interval.label,
      votes: cumulativeVotes,
      percentage,
      deltaVotes: Math.max(0, deltaVotes),
      deltaPercentage: Math.max(0, deltaPercentage)
    };
  });
};

export const useLivePollingStore = () => {
  const [, setTick] = useState(0);

  useEffect(() => {
    const handleUpdate = () => setTick((t) => t + 1);
    listeners.add(handleUpdate);
    return () => {
      listeners.delete(handleUpdate);
    };
  }, []);

  // Compute booth-by-booth live stats
  const boothLiveStats: BoothLivePollingStats[] = MOCK_BOOTHS.map((b) => {
    // Find explicitly tracked voters belonging to this booth
    const boothVoters = Object.values(globalVotingRecords).filter((v) => v.boothNumber === b.boothNumber);
    const explicitlyVotedCount = boothVoters.filter((v) => v.hasVoted).length;

    // Use ratio baseline combined with dynamic updates
    const baseRatio = BOOTH_BASE_VOTED_RATIOS[b.boothNumber] ?? (b.lastTurnoutPercent / 100 || 0.58);
    let estimatedBaseVotes = Math.round(b.totalVoters * baseRatio);

    // Adjust with explicit voter updates
    const runtimeDelta = explicitlyVotedCount - Math.round(boothVoters.length * 0.5);
    const actualVotesCast = Math.min(b.totalVoters, Math.max(0, estimatedBaseVotes + (runtimeDelta > 0 ? runtimeDelta : 0)));
    const remainingVoters = Math.max(0, b.totalVoters - actualVotesCast);
    const liveTurnoutPercent = Number(((actualVotesCast / b.totalVoters) * 100).toFixed(1));

    // Gender breakdown
    const maleVoted = Math.round(actualVotesCast * 0.518);
    const femaleVoted = Math.round(actualVotesCast * 0.481);
    const otherVoted = Math.max(0, actualVotesCast - maleVoted - femaleVoted);

    const hourlyProgress = computeHourlyProgress(actualVotesCast, b.totalVoters);

    return {
      boothNumber: b.boothNumber,
      name: b.name,
      locality: b.locality,
      totalVoters: b.totalVoters,
      bloName: b.bloName,
      bloPhone: b.bloPhone,
      karyakartaCount: b.karyakartaCount,
      slipsDeliveredPercent: b.slipsDeliveredPercent,
      projectedTurnoutPercent: b.projectedTurnoutPercent,
      previousTurnoutPercent: b.lastTurnoutPercent,
      actualVotesCast,
      remainingVoters,
      liveTurnoutPercent,
      maleVoted,
      femaleVoted,
      otherVoted,
      lastUpdated: 'Today, 05:45 PM',
      grade: b.grade,
      hourlyProgress
    };
  });

  // Consolidated Constituency Level Summary
  const summary: ConstituencyPollingSummary = (() => {
    const totalRegisteredVoters = boothLiveStats.reduce((acc, curr) => acc + curr.totalVoters, 0);
    const totalVotesCast = boothLiveStats.reduce((acc, curr) => acc + curr.actualVotesCast, 0);
    const totalPendingVoters = totalRegisteredVoters - totalVotesCast;
    const overallVotingPercentage = Number(((totalVotesCast / (totalRegisteredVoters || 1)) * 100).toFixed(1));
    const totalPollingBooths = boothLiveStats.length;
    const boothsReporting = boothLiveStats.filter((b) => b.actualVotesCast > 0).length;
    const verifiedVotingPercentage = Number((overallVotingPercentage * 0.985).toFixed(1));

    return {
      totalRegisteredVoters,
      totalVotesCast,
      totalPendingVoters,
      overallVotingPercentage,
      totalPollingBooths,
      boothsReporting,
      verifiedVotingPercentage,
      lastSyncTime: 'Live Telemetry (Every 60s)'
    };
  })();

  // Constituency-wide hourly progress
  const constituencyHourlyProgress: TimeSlotData[] = computeHourlyProgress(
    summary.totalVotesCast,
    summary.totalRegisteredVoters
  );

  // Toggle voting status for an individual voter
  const toggleVoterVotingStatus = (
    voterId: string,
    forcedStatus?: boolean,
    updatedByName: string = 'Super Admin Adv. Vikram Patil'
  ) => {
    const existing = globalVotingRecords[voterId];
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

    const newStatus = forcedStatus !== undefined ? forcedStatus : !(existing?.hasVoted ?? false);

    globalVotingRecords[voterId] = {
      ...(existing || {
        voterId,
        epicNumber: 'WXE' + voterId.slice(0, 7),
        fullName: 'Voter #' + voterId,
        boothNumber: 101
      }),
      hasVoted: newStatus,
      votingDate: newStatus ? dateStr : '--',
      votingTime: newStatus ? timeStr : '--',
      updatedBy: updatedByName,
      updatedAt: newStatus ? `${dateStr}, ${timeStr}` : ''
    };

    broadcastChange();
  };

  const getVoterVotingRecord = (voterId: string): VoterVotingRecord | undefined => {
    return globalVotingRecords[voterId];
  };

  const resetAllPollingData = () => {
    globalVotingRecords = getInitialVotingRecords();
    broadcastChange();
  };

  return {
    boothLiveStats,
    summary,
    constituencyHourlyProgress,
    votingRecords: globalVotingRecords,
    getVoterVotingRecord,
    toggleVoterVotingStatus,
    resetAllPollingData
  };
};
