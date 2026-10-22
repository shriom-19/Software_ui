export type Role = 'SUPER_ADMIN' | 'CANDIDATE_ADMIN' | 'WAR_ROOM_HEAD' | 'PRABHAAG_INCHARGE' | 'BOOTH_ADHYAKSH' | 'KARYAKARTA' | 'DATA_OPERATOR';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  prabhaag?: string;
  assignedBooths: number[];
  voterSerialRange?: string;
  modulePermissions: string[];
  canImportData: boolean;
  avatar?: string;
  lastActive: string;
}

export interface Karyakarta {
  id: string;
  name: string;
  phone: string;
  prabhaag: string;
  assignedBooth: number;
  surveysCompleted: number;
  voterSlipsDelivered: number;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
  joinedDate: string;
  currentLocation?: { lat: number; lng: number; label: string };
  isOnline: boolean;
}

export interface UpdateRequest {
  id: string;
  karyakartaId: string;
  karyakartaName: string;
  field: string;
  currentValue: string;
  proposedValue: string;
  reason: string;
  requestedAt: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface Voter {
  id: string;
  epicNumber: string;
  partNo: number;
  serialNo: number;
  fullName: string;
  relativeName: string;
  relationType: 'Father' | 'Husband' | 'Mother' | 'Other';
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  age: number;
  dob: string;
  mobile: string;
  address: string;
  constituency: string;
  assemblySegment: string;
  prabhaag: string;
  boothNumber: number;
  pollingStation: string;
  caste: string;
  occupation: string;
  schemeBeneficiary?: string[];
  politicalLeaning: 'STRONG_SUPPORTER' | 'LEANING_SUPPORTER' | 'NEUTRAL' | 'LEANING_OPPOSITION' | 'STRONG_OPPOSITION';
  isInfluencer: boolean;
  influencerScope?: string;
  voterSlipStatus: 'NOT_GENERATED' | 'GENERATED' | 'PRINTED' | 'DELIVERED';
  familyHeadEpic?: string;
  verified: boolean;
}

export interface VoterProfile extends Voter {
  familyMembers: {
    epicNumber: string;
    fullName: string;
    relation: string;
    age: number;
    gender: string;
    serialNo: number;
  }[];
  surveys: {
    id: string;
    date: string;
    surveyorName: string;
    keyIssue: string;
    opinionOnCandidate: string;
    likelihoodToVote: string;
  }[];
  issuesRaised: {
    ticketId: string;
    category: string;
    date: string;
    status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
    description: string;
  }[];
  communications: {
    id: string;
    channel: 'WHATSAPP' | 'SMS' | 'VOICE_CALL' | 'IN_PERSON';
    date: string;
    campaignName: string;
    status: 'DELIVERED' | 'FAILED' | 'RESPONDED';
    summary: string;
  }[];
  documents: {
    name: string;
    type: string;
    uploadedAt: string;
  }[];
  timeline: {
    date: string;
    title: string;
    description: string;
    icon?: string;
  }[];
}

export interface Booth {
  boothNumber: number;
  name: string;
  locality: string;
  prabhaag: string;
  totalVoters: number;
  maleVoters: number;
  femaleVoters: number;
  otherVoters: number;
  grade: 'A' | 'B' | 'C' | 'D';
  isSwing: boolean;
  isVulnerable: boolean;
  bloName: string;
  bloPhone: string;
  karyakartaCount: number;
  slipsDeliveredPercent: number;
  lastTurnoutPercent: number;
  projectedTurnoutPercent: number;
  supportLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  lat: number;
  lng: number;
}

export interface BLO {
  id: string;
  name: string;
  phone: string;
  designation: string;
  department: string;
  boothNumber: number;
  pollingStation: string;
  constituency: string;
  status: 'ACTIVE' | 'ON_LEAVE' | 'REPLACED';
  lastVerifiedDate: string;
}

export interface OfficeTicket {
  id: string;
  visitorName: string;
  visitorPhone: string;
  visitorAddress: string;
  isLinkedVoter: boolean;
  voterEpic?: string;
  category: 'Water Supply' | 'Electricity' | 'Roads & Infrastructure' | 'Sanitation' | 'Pension' | 'Ration & Civil Supplies' | 'Healthcare' | 'Other';
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'ESCALATED';
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
  description: string;
  resolutionNote?: string;
  comments: {
    author: string;
    text: string;
    timestamp: string;
  }[];
}

export interface Campaign {
  id: string;
  name: string;
  channel: 'WHATSAPP' | 'SMS' | 'AI_VOICE' | 'BULK';
  targetAudience: string;
  recipientCount: number;
  deliveredCount: number;
  readCount: number;
  status: 'DRAFT' | 'SCHEDULED' | 'RUNNING' | 'COMPLETED' | 'PAUSED';
  scheduledTime: string;
  createdDate: string;
  messageTemplate: string;
  estimatedCostCredits: number;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  module: string;
  action: string;
  relatedRecord: string;
  ipAddress: string;
  device: string;
  outcome: 'SUCCESS' | 'FAILED' | 'WARNING';
  details: string;
}

export interface FilterItem {
  id: string;
  category: 'Caste' | 'Occupation' | 'Scheme' | 'Qualification' | 'Custom Values';
  name: string;
  code: string;
  usageCount: number;
  description?: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  category: 'SOFTWARE' | 'RECHARGE' | 'EXTRA_SERVICE';
  description: string;
  features: string[];
  duration?: string;
  hasAiMode: boolean;
  priceNote: string;
  popular?: boolean;
  status: 'ACTIVE' | 'ENQUIRED' | 'AVAILABLE';
}
