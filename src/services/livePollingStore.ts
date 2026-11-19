import { useState, useEffect } from 'react';
import { MOCK_BOOTHS, MOCK_VOTERS, MOCK_USERS } from '../data/mockData';
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

// -------------------------------------------------------------
// Notification Settings Types & Defaults
// -------------------------------------------------------------
export type NotificationFrequency = '15m' | '30m' | '60m' | '2h';

export interface NotificationSettings {
  inAppEnabled: boolean;
  inAppFrequency: NotificationFrequency;
  inAppRecipients: string[]; // User IDs from MOCK_USERS
  emailEnabled: boolean;
  emailFrequency: NotificationFrequency;
  emailRecipients: string[]; // User IDs from MOCK_USERS
  categories: {
    overallTurnout: boolean;
    boothUpdates: boolean;
    lowTurnoutAlerts: boolean;
    importantAlerts: boolean;
    finalReports: boolean;
  };
  lastUpdated: string;
}

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  inAppEnabled: true,
  inAppFrequency: '30m',
  inAppRecipients: ['usr-01', 'usr-02', 'usr-03'],
  emailEnabled: true,
  emailFrequency: '60m',
  emailRecipients: ['usr-01', 'usr-02'],
  categories: {
    overallTurnout: true,
    boothUpdates: true,
    lowTurnoutAlerts: true,
    importantAlerts: true,
    finalReports: true
  },
  lastUpdated: 'Today, 07:00 AM'
};

// -------------------------------------------------------------
// Election Lifecycle Types
// -------------------------------------------------------------
export type LifecycleMode = 'ACTIVE_DAY1' | 'ACTIVE_DAY2' | 'EXPIRED' | 'UPCOMING';

export interface ElectionLifecycleInfo {
  electionName: string;
  electionDate: string;
  availabilityPeriod: string;
  startDateTime: string;
  endDateTime: string;
  status: 'ACTIVE' | 'EXPIRED' | 'UPCOMING';
  lifecycleMode: LifecycleMode;
  remainingTimeFormatted: string;
  progressPercent: number;
  dayLabel: string;
}

// -------------------------------------------------------------
// Historical Election Records Types
// -------------------------------------------------------------
export interface HistoricalBoothStat {
  boothNumber: number;
  name: string;
  locality: string;
  totalVoters: number;
  actualVotesCast: number;
  remainingVoters: number;
  finalTurnoutPercent: number;
  previousTurnoutPercent: number;
  grade: 'A' | 'B' | 'C' | 'D';
  bloName: string;
  karyakartaCount: number;
}

export interface HistoricalNotificationLog {
  id: string;
  timestamp: string;
  category: string;
  channel: 'IN_APP' | 'EMAIL' | 'BOTH';
  recipientCount: number;
  title: string;
  message: string;
}

export interface HistoricalReport {
  title: string;
  type: 'PDF' | 'EXCEL';
  size: string;
  description: string;
  filename: string;
}

export interface HistoricalElection {
  id: string;
  name: string;
  date: string;
  electionType: string;
  totalVoters: number;
  totalVotesCast: number;
  finalTurnoutPercent: number;
  previousTurnoutPercent?: number;
  totalBooths: number;
  status: 'COMPLETED';
  completedAt: string;
  hourlyProgress: TimeSlotData[];
  boothStats: HistoricalBoothStat[];
  notificationLogs: HistoricalNotificationLog[];
  reports: HistoricalReport[];
}

// -------------------------------------------------------------
// Local Storage Keys
// -------------------------------------------------------------
const STORAGE_KEY_VOTING = 'rajtantra_live_polling_records_v1';
const STORAGE_KEY_NOTIFS = 'rajtantra_polling_notification_settings_v2';
const STORAGE_KEY_LIFECYCLE = 'rajtantra_polling_lifecycle_mode_v2';
const STORAGE_KEY_LOGS = 'rajtantra_polling_notification_logs_v2';

// -------------------------------------------------------------
// Baseline Initial Data
// -------------------------------------------------------------
const getInitialVotingRecords = (): Record<string, VoterVotingRecord> => {
  const records: Record<string, VoterVotingRecord> = {};
  MOCK_VOTERS.forEach((voter, index) => {
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

const INITIAL_NOTIFICATION_LOGS: HistoricalNotificationLog[] = [
  {
    id: 'log-01',
    timestamp: '19 Nov 2024, 05:00 PM',
    category: 'Overall Turnout',
    channel: 'BOTH',
    recipientCount: 5,
    title: 'Constituency Milestone Reached: 58.4%',
    message: 'Constituency turnout surpassed 58.4% (5,910 votes cast across 8 booths). High voter turnout noted in Booth #101 and #106.'
  },
  {
    id: 'log-02',
    timestamp: '19 Nov 2024, 03:00 PM',
    category: 'Booth-wise Updates',
    channel: 'IN_APP',
    recipientCount: 3,
    title: 'Afternoon Voting Pick-Up Alert',
    message: 'Dr. Ambedkar Samaj Mandir (Booth #103) witnessed a 12% surge in afternoon queue density.'
  },
  {
    id: 'log-03',
    timestamp: '19 Nov 2024, 01:00 PM',
    category: 'Low-Turnout Alerts',
    channel: 'EMAIL',
    recipientCount: 2,
    title: 'Low Turnout Warning: Booth #108',
    message: 'Gokhale Memorial Community Hall (Booth #108) lagging at 28.6% turnout. Karyakartas alerted for door-to-door mobilization.'
  },
  {
    id: 'log-04',
    timestamp: '19 Nov 2024, 11:00 AM',
    category: 'Important Alerts',
    channel: 'BOTH',
    recipientCount: 5,
    title: 'Mid-Morning Polling Status Verified',
    message: 'All 8 EVM machines running smoothly. Zero machine malfunctions or queue disruptions reported by BLOs.'
  },
  {
    id: 'log-05',
    timestamp: '19 Nov 2024, 07:00 AM',
    category: 'Important Alerts',
    channel: 'BOTH',
    recipientCount: 5,
    title: 'Poll Commencement Confirmed',
    message: 'Mock polls completed with all polling agents present. Voting started promptly at 07:00 AM across all booths.'
  }
];

// Baseline Historical Elections
const BASELINE_HISTORICAL_ELECTIONS: HistoricalElection[] = [
  {
    id: 'hist-2019-vs',
    name: 'Maharashtra Vidhan Sabha Elections 2019',
    date: '21 Oct 2019',
    electionType: 'State Legislative Assembly (Kasba & Kothrud)',
    totalVoters: 1940500,
    totalVotesCast: 1137133,
    finalTurnoutPercent: 58.6,
    previousTurnoutPercent: 56.2,
    totalBooths: 1980,
    status: 'COMPLETED',
    completedAt: '24 Oct 2019 (Results Declared)',
    hourlyProgress: [
      { time: '07:00 AM', label: 'Poll Commencement', votes: 79599, percentage: 4.1, deltaVotes: 79599, deltaPercentage: 4.1 },
      { time: '09:00 AM', label: 'Morning Surge', votes: 238797, percentage: 12.3, deltaVotes: 159198, deltaPercentage: 8.2 },
      { time: '11:00 AM', label: 'Mid-Morning', votes: 443481, percentage: 22.9, deltaVotes: 204684, deltaPercentage: 10.6 },
      { time: '01:00 PM', label: 'Midday Report', votes: 670908, percentage: 34.6, deltaVotes: 227427, deltaPercentage: 11.7 },
      { time: '03:00 PM', label: 'Post-Lunch', votes: 852849, percentage: 44.0, deltaVotes: 181941, deltaPercentage: 9.4 },
      { time: '05:00 PM', label: 'Evening Peak', votes: 1057533, percentage: 54.5, deltaVotes: 204684, deltaPercentage: 10.5 },
      { time: '06:00 PM', label: 'Poll Closure', votes: 1137133, percentage: 58.6, deltaVotes: 79600, deltaPercentage: 4.1 }
    ],
    boothStats: [
      { boothNumber: 101, name: 'Navbharat High School, Room 1', locality: 'Kothrud Depot Road', totalVoters: 1142, actualVotesCast: 781, remainingVoters: 361, finalTurnoutPercent: 68.4, previousTurnoutPercent: 64.0, grade: 'A', bloName: 'Sanjay K. Kulkarni', karyakartaCount: 5 },
      { boothNumber: 102, name: 'Navbharat High School, Room 2', locality: 'Kothrud Depot Road', totalVoters: 1205, actualVotesCast: 786, remainingVoters: 419, finalTurnoutPercent: 65.2, previousTurnoutPercent: 61.5, grade: 'A', bloName: 'Sunita M. Deshmukh', karyakartaCount: 4 },
      { boothNumber: 103, name: 'Dr. Ambedkar Samaj Mandir', locality: 'Ganesh Nagar, Kothrud', totalVoters: 980, actualVotesCast: 530, remainingVoters: 450, finalTurnoutPercent: 54.1, previousTurnoutPercent: 52.0, grade: 'B', bloName: 'Ramesh P. Chavan', karyakartaCount: 3 },
      { boothNumber: 104, name: 'Pune Municipal Primary School No. 18', locality: 'Paud Road', totalVoters: 1350, actualVotesCast: 693, remainingVoters: 657, finalTurnoutPercent: 51.3, previousTurnoutPercent: 49.0, grade: 'B', bloName: 'Pravin G. More', karyakartaCount: 4 },
      { boothNumber: 105, name: 'Abasaheb Garware College, Hall B', locality: 'Karve Road', totalVoters: 1480, actualVotesCast: 724, remainingVoters: 756, finalTurnoutPercent: 48.9, previousTurnoutPercent: 46.2, grade: 'C', bloName: 'Dattatraya Shinde', karyakartaCount: 3 },
      { boothNumber: 106, name: 'Modern High School, Wing A', locality: 'Shivajinagar Gaothan', totalVoters: 1120, actualVotesCast: 774, remainingVoters: 346, finalTurnoutPercent: 69.1, previousTurnoutPercent: 65.0, grade: 'A', bloName: 'Nitin B. Jagtap', karyakartaCount: 4 },
      { boothNumber: 107, name: 'Ferguson Junior College Library', locality: 'FC Road', totalVoters: 1290, actualVotesCast: 752, remainingVoters: 538, finalTurnoutPercent: 58.3, previousTurnoutPercent: 55.4, grade: 'B', bloName: 'Madhavi R. Joshi', karyakartaCount: 4 },
      { boothNumber: 108, name: 'Gokhale Memorial Community Hall', locality: 'Deccan Gymkhana', totalVoters: 1560, actualVotesCast: 647, remainingVoters: 913, finalTurnoutPercent: 41.5, previousTurnoutPercent: 39.8, grade: 'D', bloName: 'Anil K. Kulkarni', karyakartaCount: 2 }
    ],
    notificationLogs: [
      { id: 'hlog-1', timestamp: '21 Oct 2019, 06:30 PM', category: 'Final Reports', channel: 'BOTH', recipientCount: 5, title: 'Final Turnout Certified: 58.6%', message: 'Official Form 20 figures reconciled. Total 11,37,133 electors voted.' },
      { id: 'hlog-2', timestamp: '21 Oct 2019, 01:00 PM', category: 'Overall Turnout', channel: 'IN_APP', recipientCount: 4, title: 'Post-Noon Surge 34.6%', message: 'Suburban voting picked up across Kothrud segment.' }
    ],
    reports: [
      { title: 'ECI Form 20 Final Result Sheet', type: 'PDF', size: '2.4 MB', description: 'Official certified booth-by-booth vote tallies and ECI verification.', filename: 'ECI_Form_20_Maharashtra_VS_2019.pdf' },
      { title: 'Detailed Booth-wise Turnout Ledger', type: 'EXCEL', size: '1.8 MB', description: 'Complete polling station breakdown with gender and margin differentials.', filename: 'Booth_Wise_Turnout_VS_2019.xlsx' },
      { title: 'Cadre Slip Delivery & Voting Reconciliation', type: 'PDF', size: '940 KB', description: 'Final report on voter slip distribution vs actual turnout.', filename: 'Voter_Slip_Audit_VS_2019.pdf' }
    ]
  },
  {
    id: 'hist-2019-ls',
    name: 'Lok Sabha General Elections 2019',
    date: '23 Apr 2019',
    electionType: 'Parliamentary General Elections (Pune Constituency)',
    totalVoters: 1890200,
    totalVotesCast: 941319,
    finalTurnoutPercent: 49.8,
    previousTurnoutPercent: 54.1,
    totalBooths: 1895,
    status: 'COMPLETED',
    completedAt: '25 May 2019 (Results Declared)',
    hourlyProgress: [
      { time: '07:00 AM', label: 'Poll Commencement', votes: 65892, percentage: 3.5, deltaVotes: 65892, deltaPercentage: 3.5 },
      { time: '09:00 AM', label: 'Morning Surge', votes: 197676, percentage: 10.5, deltaVotes: 131784, deltaPercentage: 7.0 },
      { time: '11:00 AM', label: 'Mid-Morning', votes: 385940, percentage: 20.4, deltaVotes: 188264, deltaPercentage: 9.9 },
      { time: '01:00 PM', label: 'Midday Report', votes: 564791, percentage: 29.9, deltaVotes: 178851, deltaPercentage: 9.5 },
      { time: '03:00 PM', label: 'Post-Lunch', votes: 715402, percentage: 37.8, deltaVotes: 150611, deltaPercentage: 7.9 },
      { time: '05:00 PM', label: 'Evening Peak', votes: 875426, percentage: 46.3, deltaVotes: 160024, deltaPercentage: 8.5 },
      { time: '06:00 PM', label: 'Poll Closure', votes: 941319, percentage: 49.8, deltaVotes: 65893, deltaPercentage: 3.5 }
    ],
    boothStats: [
      { boothNumber: 101, name: 'Navbharat High School, Room 1', locality: 'Kothrud Depot Road', totalVoters: 1142, actualVotesCast: 730, remainingVoters: 412, finalTurnoutPercent: 63.9, previousTurnoutPercent: 66.0, grade: 'A', bloName: 'Sanjay K. Kulkarni', karyakartaCount: 5 },
      { boothNumber: 102, name: 'Navbharat High School, Room 2', locality: 'Kothrud Depot Road', totalVoters: 1205, actualVotesCast: 710, remainingVoters: 495, finalTurnoutPercent: 58.9, previousTurnoutPercent: 60.0, grade: 'B', bloName: 'Sunita M. Deshmukh', karyakartaCount: 4 },
      { boothNumber: 103, name: 'Dr. Ambedkar Samaj Mandir', locality: 'Ganesh Nagar, Kothrud', totalVoters: 980, actualVotesCast: 470, remainingVoters: 510, finalTurnoutPercent: 47.9, previousTurnoutPercent: 50.0, grade: 'C', bloName: 'Ramesh P. Chavan', karyakartaCount: 3 },
      { boothNumber: 104, name: 'Pune Municipal Primary School No. 18', locality: 'Paud Road', totalVoters: 1350, actualVotesCast: 620, remainingVoters: 730, finalTurnoutPercent: 45.9, previousTurnoutPercent: 48.0, grade: 'C', bloName: 'Pravin G. More', karyakartaCount: 4 },
      { boothNumber: 105, name: 'Abasaheb Garware College, Hall B', locality: 'Karve Road', totalVoters: 1480, actualVotesCast: 650, remainingVoters: 830, finalTurnoutPercent: 43.9, previousTurnoutPercent: 45.0, grade: 'C', bloName: 'Dattatraya Shinde', karyakartaCount: 3 },
      { boothNumber: 106, name: 'Modern High School, Wing A', locality: 'Shivajinagar Gaothan', totalVoters: 1120, actualVotesCast: 690, remainingVoters: 430, finalTurnoutPercent: 61.6, previousTurnoutPercent: 63.0, grade: 'A', bloName: 'Nitin B. Jagtap', karyakartaCount: 4 },
      { boothNumber: 107, name: 'Ferguson Junior College Library', locality: 'FC Road', totalVoters: 1290, actualVotesCast: 680, remainingVoters: 610, finalTurnoutPercent: 52.7, previousTurnoutPercent: 54.0, grade: 'B', bloName: 'Madhavi R. Joshi', karyakartaCount: 4 },
      { boothNumber: 108, name: 'Gokhale Memorial Community Hall', locality: 'Deccan Gymkhana', totalVoters: 1560, actualVotesCast: 570, remainingVoters: 990, finalTurnoutPercent: 36.5, previousTurnoutPercent: 38.0, grade: 'D', bloName: 'Anil K. Kulkarni', karyakartaCount: 2 }
    ],
    notificationLogs: [
      { id: 'hlog-3', timestamp: '23 Apr 2019, 06:15 PM', category: 'Final Reports', channel: 'BOTH', recipientCount: 5, title: '2019 LS Polling Concluded', message: 'Final turnout recorded at 49.8% across 1,895 polling stations.' }
    ],
    reports: [
      { title: 'ECI Form 20 Final Result Sheet 2019', type: 'PDF', size: '2.1 MB', description: 'Certified parliamentary constituency poll returns.', filename: 'ECI_Form_20_Pune_LS_2019.pdf' },
      { title: 'Full Booth Turnout & Margin Matrix', type: 'EXCEL', size: '1.5 MB', description: 'Comprehensive raw data file for election analytics.', filename: 'Booth_Turnout_Matrix_LS_2019.xlsx' }
    ]
  },
  {
    id: 'hist-2022-pmc',
    name: 'Pune Municipal Corporation (PMC) Elections 2022',
    date: '15 Dec 2022',
    electionType: 'Urban Local Body Civic Elections (All 41 Wards)',
    totalVoters: 1620000,
    totalVotesCast: 861840,
    finalTurnoutPercent: 53.2,
    previousTurnoutPercent: 51.5,
    totalBooths: 1650,
    status: 'COMPLETED',
    completedAt: '18 Dec 2022 (Results Declared)',
    hourlyProgress: [
      { time: '07:00 AM', label: 'Poll Commencement', votes: 64800, percentage: 4.0, deltaVotes: 64800, deltaPercentage: 4.0 },
      { time: '09:00 AM', label: 'Morning Surge', votes: 194400, percentage: 12.0, deltaVotes: 129600, deltaPercentage: 8.0 },
      { time: '11:00 AM', label: 'Mid-Morning', votes: 356400, percentage: 22.0, deltaVotes: 162000, deltaPercentage: 10.0 },
      { time: '01:00 PM', label: 'Midday Report', votes: 518400, percentage: 32.0, deltaVotes: 162000, deltaPercentage: 10.0 },
      { time: '03:00 PM', label: 'Post-Lunch', votes: 664200, percentage: 41.0, deltaVotes: 145800, deltaPercentage: 9.0 },
      { time: '05:00 PM', label: 'Evening Peak', votes: 793800, percentage: 49.0, deltaVotes: 129600, deltaPercentage: 8.0 },
      { time: '06:00 PM', label: 'Poll Closure', votes: 861840, percentage: 53.2, deltaVotes: 68040, deltaPercentage: 4.2 }
    ],
    boothStats: [
      { boothNumber: 101, name: 'Navbharat High School, Room 1', locality: 'Kothrud Depot Road', totalVoters: 1142, actualVotesCast: 710, remainingVoters: 432, finalTurnoutPercent: 62.1, previousTurnoutPercent: 59.5, grade: 'A', bloName: 'Sanjay K. Kulkarni', karyakartaCount: 5 },
      { boothNumber: 102, name: 'Navbharat High School, Room 2', locality: 'Kothrud Depot Road', totalVoters: 1205, actualVotesCast: 735, remainingVoters: 470, finalTurnoutPercent: 61.0, previousTurnoutPercent: 58.0, grade: 'A', bloName: 'Sunita M. Deshmukh', karyakartaCount: 4 },
      { boothNumber: 103, name: 'Dr. Ambedkar Samaj Mandir', locality: 'Ganesh Nagar, Kothrud', totalVoters: 980, actualVotesCast: 515, remainingVoters: 465, finalTurnoutPercent: 52.5, previousTurnoutPercent: 50.0, grade: 'B', bloName: 'Ramesh P. Chavan', karyakartaCount: 3 },
      { boothNumber: 104, name: 'Pune Municipal Primary School No. 18', locality: 'Paud Road', totalVoters: 1350, actualVotesCast: 660, remainingVoters: 690, finalTurnoutPercent: 48.8, previousTurnoutPercent: 47.0, grade: 'C', bloName: 'Pravin G. More', karyakartaCount: 4 },
      { boothNumber: 105, name: 'Abasaheb Garware College, Hall B', locality: 'Karve Road', totalVoters: 1480, actualVotesCast: 700, remainingVoters: 780, finalTurnoutPercent: 47.2, previousTurnoutPercent: 46.0, grade: 'C', bloName: 'Dattatraya Shinde', karyakartaCount: 3 },
      { boothNumber: 106, name: 'Modern High School, Wing A', locality: 'Shivajinagar Gaothan', totalVoters: 1120, actualVotesCast: 720, remainingVoters: 400, finalTurnoutPercent: 64.2, previousTurnoutPercent: 62.0, grade: 'A', bloName: 'Nitin B. Jagtap', karyakartaCount: 4 },
      { boothNumber: 107, name: 'Ferguson Junior College Library', locality: 'FC Road', totalVoters: 1290, actualVotesCast: 710, remainingVoters: 580, finalTurnoutPercent: 55.0, previousTurnoutPercent: 53.0, grade: 'B', bloName: 'Madhavi R. Joshi', karyakartaCount: 4 },
      { boothNumber: 108, name: 'Gokhale Memorial Community Hall', locality: 'Deccan Gymkhana', totalVoters: 1560, actualVotesCast: 610, remainingVoters: 950, finalTurnoutPercent: 39.1, previousTurnoutPercent: 37.0, grade: 'D', bloName: 'Anil K. Kulkarni', karyakartaCount: 2 }
    ],
    notificationLogs: [
      { id: 'hlog-4', timestamp: '15 Dec 2022, 06:30 PM', category: 'Final Reports', channel: 'BOTH', recipientCount: 5, title: 'Civic Polls Complete: 53.2%', message: 'Pune Municipal Corporation turnout declared across 41 ward panels.' }
    ],
    reports: [
      { title: 'PMC Civic Polls Certified Result Sheet', type: 'PDF', size: '1.9 MB', description: 'Certified ward-by-ward vote return statement.', filename: 'PMC_Election_Results_2022.pdf' },
      { title: 'Ward-wise Voter Slip & EVM Audit', type: 'EXCEL', size: '1.2 MB', description: 'Complete civic polling station dataset.', filename: 'PMC_Ward_Turnout_2022.xlsx' }
    ]
  }
];

// -------------------------------------------------------------
// Singleton Persistent State Stores
// -------------------------------------------------------------
let globalVotingRecords: Record<string, VoterVotingRecord> = (() => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_VOTING);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to load live polling records from storage', e);
  }
  return getInitialVotingRecords();
})();

let globalNotificationSettings: NotificationSettings = (() => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_NOTIFS);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to load notification settings from storage', e);
  }
  return DEFAULT_NOTIFICATION_SETTINGS;
})();

let globalLifecycleMode: LifecycleMode = (() => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_LIFECYCLE) as LifecycleMode;
    if (saved && ['ACTIVE_DAY1', 'ACTIVE_DAY2', 'EXPIRED', 'UPCOMING'].includes(saved)) {
      return saved;
    }
  } catch (e) {
    console.error('Failed to load lifecycle mode from storage', e);
  }
  return 'ACTIVE_DAY1';
})();

let globalNotificationLogs: HistoricalNotificationLog[] = (() => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_LOGS);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to load notification logs from storage', e);
  }
  return INITIAL_NOTIFICATION_LOGS;
})();

const listeners = new Set<() => void>();

const broadcastChange = () => {
  try {
    localStorage.setItem(STORAGE_KEY_VOTING, JSON.stringify(globalVotingRecords));
    localStorage.setItem(STORAGE_KEY_NOTIFS, JSON.stringify(globalNotificationSettings));
    localStorage.setItem(STORAGE_KEY_LIFECYCLE, globalLifecycleMode);
    localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(globalNotificationLogs));
  } catch (e) {
    console.error('Failed to persist polling state to storage', e);
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

// Calculate hourly progression curve
export const computeHourlyProgress = (totalVotes: number, totalVoters: number): TimeSlotData[] => {
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
    const boothVoters = Object.values(globalVotingRecords).filter((v) => v.boothNumber === b.boothNumber);
    const explicitlyVotedCount = boothVoters.filter((v) => v.hasVoted).length;

    const baseRatio = BOOTH_BASE_VOTED_RATIOS[b.boothNumber] ?? (b.lastTurnoutPercent / 100 || 0.58);
    let estimatedBaseVotes = Math.round(b.totalVoters * baseRatio);

    const runtimeDelta = explicitlyVotedCount - Math.round(boothVoters.length * 0.5);
    const actualVotesCast = Math.min(b.totalVoters, Math.max(0, estimatedBaseVotes + (runtimeDelta > 0 ? runtimeDelta : 0)));
    const remainingVoters = Math.max(0, b.totalVoters - actualVotesCast);
    const liveTurnoutPercent = Number(((actualVotesCast / b.totalVoters) * 100).toFixed(1));

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
    // Prevent modifying records if expired / read-only
    if (globalLifecycleMode === 'EXPIRED') {
      console.warn('Cannot toggle voter status: Live polling window has expired. Historical records are read-only.');
      return;
    }

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
    globalLifecycleMode = 'ACTIVE_DAY1';
    globalNotificationSettings = { ...DEFAULT_NOTIFICATION_SETTINGS };
    globalNotificationLogs = [...INITIAL_NOTIFICATION_LOGS];
    broadcastChange();
  };

  // -----------------------------------------------------------
  // Notification Settings Methods
  // -----------------------------------------------------------
  const updateNotificationSettings = (newSettings: Partial<NotificationSettings>) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

    globalNotificationSettings = {
      ...globalNotificationSettings,
      ...newSettings,
      lastUpdated: `${dateStr}, ${timeStr}`
    };
    broadcastChange();
  };

  const addNotificationLog = (log: Omit<HistoricalNotificationLog, 'id' | 'timestamp'>) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

    const newEntry: HistoricalNotificationLog = {
      ...log,
      id: 'log-' + Date.now(),
      timestamp: `${dateStr}, ${timeStr}`
    };

    globalNotificationLogs = [newEntry, ...globalNotificationLogs];
    broadcastChange();
  };

  // -----------------------------------------------------------
  // Lifecycle Management Methods
  // -----------------------------------------------------------
  const setLifecycleMode = (mode: LifecycleMode) => {
    globalLifecycleMode = mode;
    broadcastChange();
  };

  const lifecycleInfo: ElectionLifecycleInfo = (() => {
    switch (globalLifecycleMode) {
      case 'ACTIVE_DAY1':
        return {
          electionName: 'Lok Sabha General Elections 2024',
          electionDate: '19 Nov 2024',
          availabilityPeriod: '19 Nov 2024, 07:00 AM – 21 Nov 2024, 07:00 AM (48 Hours Max)',
          startDateTime: '2024-11-19T07:00:00',
          endDateTime: '2024-11-21T07:00:00',
          status: 'ACTIVE',
          lifecycleMode: 'ACTIVE_DAY1',
          remainingTimeFormatted: '28 hours, 15 minutes remaining',
          progressPercent: 41,
          dayLabel: 'Day 1 of 2 (Polling Day Active)'
        };
      case 'ACTIVE_DAY2':
        return {
          electionName: 'Lok Sabha General Elections 2024',
          electionDate: '19 Nov 2024',
          availabilityPeriod: '19 Nov 2024, 07:00 AM – 21 Nov 2024, 07:00 AM (48 Hours Max)',
          startDateTime: '2024-11-19T07:00:00',
          endDateTime: '2024-11-21T07:00:00',
          status: 'ACTIVE',
          lifecycleMode: 'ACTIVE_DAY2',
          remainingTimeFormatted: '4 hours, 45 minutes remaining',
          progressPercent: 90,
          dayLabel: 'Day 2 of 2 (Reconciliation & Wrap-up Window)'
        };
      case 'EXPIRED':
        return {
          electionName: 'Lok Sabha General Elections 2024',
          electionDate: '19 Nov 2024',
          availabilityPeriod: '19 Nov 2024, 07:00 AM – 21 Nov 2024, 07:00 AM (Ended)',
          startDateTime: '2024-11-19T07:00:00',
          endDateTime: '2024-11-21T07:00:00',
          status: 'EXPIRED',
          lifecycleMode: 'EXPIRED',
          remainingTimeFormatted: '0 hours remaining (48h Window Expired)',
          progressPercent: 100,
          dayLabel: 'Live Window Concluded (Archived to History)'
        };
      case 'UPCOMING':
        return {
          electionName: 'Lok Sabha General Elections 2024',
          electionDate: '19 Nov 2024',
          availabilityPeriod: 'Scheduled: 19 Nov 2024, 07:00 AM – 21 Nov 2024, 07:00 AM',
          startDateTime: '2024-11-19T07:00:00',
          endDateTime: '2024-11-21T07:00:00',
          status: 'UPCOMING',
          lifecycleMode: 'UPCOMING',
          remainingTimeFormatted: 'Polls commence in 2 days, 14 hours',
          progressPercent: 0,
          dayLabel: 'Upcoming Scheduled Poll'
        };
    }
  })();

  // -----------------------------------------------------------
  // Historical Elections List (With auto-archived 2024 election if expired)
  // -----------------------------------------------------------
  const historicalElections: HistoricalElection[] = (() => {
    // If expired, dynamically include the completed 2024 election as the most recent record
    if (globalLifecycleMode === 'EXPIRED') {
      const archived2024: HistoricalElection = {
        id: 'hist-2024-ls',
        name: 'Lok Sabha General Elections 2024 (Recently Concluded)',
        date: '19 Nov 2024',
        electionType: 'Parliamentary General Election (34 - Pune)',
        totalVoters: summary.totalRegisteredVoters,
        totalVotesCast: summary.totalVotesCast,
        finalTurnoutPercent: summary.overallVotingPercentage,
        previousTurnoutPercent: 49.8,
        totalBooths: summary.totalPollingBooths,
        status: 'COMPLETED',
        completedAt: '21 Nov 2024 (48h Period Elapsed - Auto-Archived)',
        hourlyProgress: constituencyHourlyProgress,
        boothStats: boothLiveStats.map((b) => ({
          boothNumber: b.boothNumber,
          name: b.name,
          locality: b.locality,
          totalVoters: b.totalVoters,
          actualVotesCast: b.actualVotesCast,
          remainingVoters: b.remainingVoters,
          finalTurnoutPercent: b.liveTurnoutPercent,
          previousTurnoutPercent: b.previousTurnoutPercent,
          grade: b.grade,
          bloName: b.bloName,
          karyakartaCount: b.karyakartaCount
        })),
        notificationLogs: globalNotificationLogs,
        reports: [
          {
            title: 'Official ECI Form 20 Certified Return (2024)',
            type: 'PDF',
            size: '2.8 MB',
            description: 'Final reconciled poll summary with EVM serial verification and RO seal.',
            filename: 'ECI_Form_20_Pune_LS_2024.pdf'
          },
          {
            title: 'Complete Booth-wise Turnout Ledger (2024)',
            type: 'EXCEL',
            size: '1.9 MB',
            description: 'All 8 booths hourly turnout data, gender distribution, and swing comparison.',
            filename: 'Booth_Wise_Turnout_Matrix_LS_2024.xlsx'
          },
          {
            title: 'Cadre Slip Delivery & Voting Audit (2024)',
            type: 'PDF',
            size: '1.1 MB',
            description: 'Voter slip delivery reconciliation vs actual electors voted.',
            filename: 'Cadre_Slip_Delivery_Audit_LS_2024.pdf'
          }
        ]
      };

      return [archived2024, ...BASELINE_HISTORICAL_ELECTIONS];
    }

    return BASELINE_HISTORICAL_ELECTIONS;
  })();

  const getHistoricalElectionById = (id: string): HistoricalElection | undefined => {
    return historicalElections.find((e) => e.id === id);
  };

  return {
    boothLiveStats,
    summary,
    constituencyHourlyProgress,
    votingRecords: globalVotingRecords,
    getVoterVotingRecord,
    toggleVoterVotingStatus,
    resetAllPollingData,
    // Notification & Lifecycle extensions
    notificationSettings: globalNotificationSettings,
    updateNotificationSettings,
    notificationLogs: globalNotificationLogs,
    addNotificationLog,
    lifecycleInfo,
    setLifecycleMode,
    historicalElections,
    getHistoricalElectionById
  };
};
