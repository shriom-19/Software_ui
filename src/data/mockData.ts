import {
  User,
  Karyakarta,
  UpdateRequest,
  Voter,
  VoterProfile,
  Booth,
  BLO,
  OfficeTicket,
  Campaign,
  AuditLog,
  FilterItem,
  SubscriptionPlan
} from '../types';

export const CURRENT_ELECTION_CONTEXT = {
  electionName: "Lok Sabha General Elections 2024",
  state: "Maharashtra",
  constituency: "34 - Pune Parliamentary Constituency",
  candidateName: "Adv. Vikram Patil",
  partyName: "Rashtriya Vikas Morcha",
  totalVoters: 2154200,
  coveredVoters: 1682300,
  totalBooths: 2045,
  activeKaryakartas: 4850,
  liveSurveyProgressPercent: 78.2,
  voterSlipsGeneratedPercent: 84.6,
  turnoutTargetPercent: 72.0
};

export const MOCK_BOOTHS: Booth[] = [
  {
    boothNumber: 101,
    name: "Navbharat High School, Room 1",
    locality: "Kothrud Depot Road",
    prabhaag: "Prabhaag 12 - Kothrud West",
    totalVoters: 1142,
    maleVoters: 590,
    femaleVoters: 552,
    otherVoters: 0,
    grade: "A",
    isSwing: false,
    isVulnerable: false,
    bloName: "Sanjay K. Kulkarni",
    bloPhone: "+91 98220 11234",
    karyakartaCount: 5,
    slipsDeliveredPercent: 92,
    lastTurnoutPercent: 68.4,
    projectedTurnoutPercent: 74.0,
    supportLevel: "HIGH",
    lat: 18.5074,
    lng: 73.8077
  },
  {
    boothNumber: 102,
    name: "Navbharat High School, Room 2",
    locality: "Kothrud Depot Road",
    prabhaag: "Prabhaag 12 - Kothrud West",
    totalVoters: 1205,
    maleVoters: 620,
    femaleVoters: 585,
    otherVoters: 0,
    grade: "A",
    isSwing: false,
    isVulnerable: false,
    bloName: "Asha V. More",
    bloPhone: "+91 98220 54321",
    karyakartaCount: 4,
    slipsDeliveredPercent: 88,
    lastTurnoutPercent: 65.2,
    projectedTurnoutPercent: 71.5,
    supportLevel: "HIGH",
    lat: 18.5080,
    lng: 73.8085
  },
  {
    boothNumber: 103,
    name: "Dr. Babasaheb Ambedkar Samaj Mandir",
    locality: "Paud Phata",
    prabhaag: "Prabhaag 12 - Kothrud West",
    totalVoters: 980,
    maleVoters: 510,
    femaleVoters: 470,
    otherVoters: 0,
    grade: "B",
    isSwing: true,
    isVulnerable: false,
    bloName: "Rameshwar P. Mane",
    bloPhone: "+91 94220 98765",
    karyakartaCount: 3,
    slipsDeliveredPercent: 74,
    lastTurnoutPercent: 54.1,
    projectedTurnoutPercent: 66.0,
    supportLevel: "MEDIUM",
    lat: 18.5135,
    lng: 73.8164
  },
  {
    boothNumber: 104,
    name: "Pune Municipal Primary School No. 18",
    locality: "Erandwane",
    prabhaag: "Prabhaag 13 - Erandwane",
    totalVoters: 1350,
    maleVoters: 710,
    femaleVoters: 640,
    otherVoters: 0,
    grade: "B",
    isSwing: true,
    isVulnerable: true,
    bloName: "Geeta N. Salunkhe",
    bloPhone: "+91 98901 23456",
    karyakartaCount: 6,
    slipsDeliveredPercent: 68,
    lastTurnoutPercent: 51.3,
    projectedTurnoutPercent: 63.8,
    supportLevel: "MEDIUM",
    lat: 18.5112,
    lng: 73.8321
  },
  {
    boothNumber: 105,
    name: "Abasaheb Garware College, Hall B",
    locality: "Karve Road",
    prabhaag: "Prabhaag 13 - Erandwane",
    totalVoters: 1480,
    maleVoters: 790,
    femaleVoters: 690,
    otherVoters: 0,
    grade: "C",
    isSwing: true,
    isVulnerable: false,
    bloName: "Dattatraya Shinde",
    bloPhone: "+91 97632 11098",
    karyakartaCount: 3,
    slipsDeliveredPercent: 58,
    lastTurnoutPercent: 48.9,
    projectedTurnoutPercent: 58.2,
    supportLevel: "LOW",
    lat: 18.5148,
    lng: 73.8360
  },
  {
    boothNumber: 106,
    name: "Modern High School, Wing A",
    locality: "Shivajinagar Gaothan",
    prabhaag: "Prabhaag 14 - Shivajinagar",
    totalVoters: 1120,
    maleVoters: 580,
    femaleVoters: 540,
    otherVoters: 0,
    grade: "A",
    isSwing: false,
    isVulnerable: false,
    bloName: "Nitin B. Jagtap",
    bloPhone: "+91 98505 44321",
    karyakartaCount: 4,
    slipsDeliveredPercent: 85,
    lastTurnoutPercent: 69.1,
    projectedTurnoutPercent: 73.4,
    supportLevel: "HIGH",
    lat: 18.5284,
    lng: 73.8502
  },
  {
    boothNumber: 107,
    name: "Ferguson Junior College Library",
    locality: "FC Road",
    prabhaag: "Prabhaag 14 - Shivajinagar",
    totalVoters: 1290,
    maleVoters: 670,
    femaleVoters: 620,
    otherVoters: 0,
    grade: "B",
    isSwing: true,
    isVulnerable: false,
    bloName: "Madhavi R. Joshi",
    bloPhone: "+91 98231 77654",
    karyakartaCount: 4,
    slipsDeliveredPercent: 71,
    lastTurnoutPercent: 58.3,
    projectedTurnoutPercent: 67.0,
    supportLevel: "MEDIUM",
    lat: 18.5228,
    lng: 73.8415
  },
  {
    boothNumber: 108,
    name: "Gokhale Memorial Community Hall",
    locality: "Deccan Gymkhana",
    prabhaag: "Prabhaag 14 - Shivajinagar",
    totalVoters: 890,
    maleVoters: 450,
    femaleVoters: 440,
    otherVoters: 0,
    grade: "D",
    isSwing: true,
    isVulnerable: true,
    bloName: "Pravin S. Gaikwad",
    bloPhone: "+91 99224 88321",
    karyakartaCount: 2,
    slipsDeliveredPercent: 44,
    lastTurnoutPercent: 41.5,
    projectedTurnoutPercent: 52.0,
    supportLevel: "LOW",
    lat: 18.5181,
    lng: 73.8427
  }
];

export const MOCK_VOTERS: Voter[] = [
  {
    id: "46250582",
    voterCode: "46250582",
    epicNumber: "WXE4829102",
    partNo: 325,
    serialNo: 1,
    fullName: "Rajesh Kumar Verma",
    relativeName: "Ramesh Verma",
    relationType: "Father",
    gender: "MALE",
    age: 42,
    dob: "1982-06-14",
    mobile: "+91 98221 44001",
    email: "rajesh.verma@example.com",
    address: "Plot 14, Lane 3, Kasba Peth, Pune 411011",
    houseNo: "Plot 14",
    constituency: "34 - Pune",
    assemblySegment: "215 - Kasba Peth",
    prabhaag: "Prabhaag 12",
    gan: "Gan 8",
    boothNumber: 101,
    pollingStation: "PMC School No. 12, Kasba Peth",
    caste: "Maratha",
    occupation: "Business",
    qualification: "Graduate",
    bloodGroup: "O+",
    schemeBeneficiary: ["Ayushman Bharat", "PM Awas Yojana"],
    politicalLeaning: "STRONG_SUPPORTER",
    isInfluencer: true,
    influencerScope: "Vyapar Mandal Committee Member",
    voterSlipStatus: "DELIVERED",
    verified: true,
    hasVoted: true,
    isVisited: true,
    isFavorite: true,
    isHelped: true,
    isDeceased: false,
    isOutside: false,
    karyakartaName: "Vikas M. Patil",
    colorCode: "Blue"
  },
  {
    id: "46251581",
    voterCode: "46251581",
    epicNumber: "WXE0821443",
    partNo: 325,
    serialNo: 2,
    fullName: "Sunita Rajesh Verma",
    relativeName: "Rajesh Verma",
    relationType: "Husband",
    gender: "FEMALE",
    age: 38,
    dob: "1986-09-22",
    mobile: "+91 98221 44002",
    email: "sunita.verma@example.com",
    address: "Plot 14, Lane 3, Kasba Peth, Pune 411011",
    houseNo: "Plot 14",
    constituency: "34 - Pune",
    assemblySegment: "215 - Kasba Peth",
    prabhaag: "Prabhaag 12",
    gan: "Gan 8",
    boothNumber: 101,
    pollingStation: "PMC School No. 12, Kasba Peth",
    caste: "Maratha",
    occupation: "Homemaker",
    qualification: "Post Graduate",
    bloodGroup: "B+",
    schemeBeneficiary: ["Majhi Ladki Bahin Yojana"],
    politicalLeaning: "STRONG_SUPPORTER",
    isInfluencer: false,
    voterSlipStatus: "DELIVERED",
    verified: true,
    hasVoted: true,
    isVisited: true,
    isFavorite: false,
    isHelped: true,
    isDeceased: false,
    isOutside: false,
    karyakartaName: "Vikas M. Patil",
    colorCode: "Blue"
  },
  {
    id: "46251582",
    voterCode: "46251582",
    epicNumber: "WXE3109244",
    partNo: 325,
    serialNo: 3,
    fullName: "Pooja Santosh Deshmukh",
    relativeName: "Santosh Deshmukh",
    relationType: "Father",
    gender: "FEMALE",
    age: 21,
    dob: "2003-03-11",
    mobile: "+91 97654 32110",
    address: "Flat 402, Shiv Plaza, Kasba Peth, Pune 411011",
    houseNo: "Flat 402",
    constituency: "34 - Pune",
    assemblySegment: "215 - Kasba Peth",
    prabhaag: "Prabhaag 12",
    gan: "Gan 8",
    boothNumber: 107,
    pollingStation: "Navin Marathi Shala, Shanipar",
    caste: "Maratha",
    occupation: "Student",
    qualification: "Undergraduate",
    bloodGroup: "A+",
    schemeBeneficiary: ["Youth Apprenticeship Scheme"],
    politicalLeaning: "NEUTRAL",
    isInfluencer: false,
    voterSlipStatus: "PRINTED",
    verified: true,
    hasVoted: false,
    isVisited: true,
    isFavorite: false,
    isHelped: false,
    isDeceased: false,
    isOutside: false,
    karyakartaName: "Ramesh M. More",
    colorCode: "Orange"
  },
  {
    id: "46251583",
    voterCode: "46251583",
    epicNumber: "WXE1290384",
    partNo: 325,
    serialNo: 4,
    fullName: "Amit Baban Shinde",
    relativeName: "Baban Shinde",
    relationType: "Father",
    gender: "MALE",
    age: 29,
    dob: "1995-11-05",
    mobile: "+91 99900 12345",
    address: "House 88, Gaothan, Kasba Peth, Pune 411011",
    houseNo: "House 88",
    constituency: "34 - Pune",
    assemblySegment: "215 - Kasba Peth",
    prabhaag: "Prabhaag 12",
    gan: "Gan 8",
    boothNumber: 106,
    pollingStation: "Shri Shivaji Maratha High School",
    caste: "OBC",
    occupation: "Private Service",
    qualification: "Graduate",
    bloodGroup: "O-",
    schemeBeneficiary: ["PM Mudra Loan"],
    politicalLeaning: "LEANING_SUPPORTER",
    isInfluencer: false,
    voterSlipStatus: "GENERATED",
    verified: true,
    hasVoted: false,
    isVisited: false,
    isFavorite: true,
    isHelped: false,
    isDeceased: false,
    isOutside: true,
    karyakartaName: "Ganesh K. Kulkarni",
    colorCode: "Yellow"
  },
  {
    id: "46251584",
    voterCode: "46251584",
    epicNumber: "WXE7765109",
    partNo: 325,
    serialNo: 5,
    fullName: "Kavita Ashok Patil",
    relativeName: "Ashok Patil",
    relationType: "Father",
    gender: "FEMALE",
    age: 54,
    dob: "1970-08-19",
    mobile: "+91 98230 99887",
    address: "Bldg 3, Erandwane, Pune 411004",
    houseNo: "Bldg 3",
    constituency: "34 - Pune",
    assemblySegment: "215 - Kasba Peth",
    prabhaag: "Prabhaag 14",
    gan: "Gan 4",
    boothNumber: 108,
    pollingStation: "Garware Commerce College",
    caste: "Maratha",
    occupation: "Teacher",
    qualification: "Post Graduate",
    bloodGroup: "AB+",
    schemeBeneficiary: ["Jan Arogya Yojana", "Majhi Ladki Bahin Yojana"],
    politicalLeaning: "STRONG_SUPPORTER",
    isInfluencer: true,
    influencerScope: "Anganwadi Supervisor",
    voterSlipStatus: "DELIVERED",
    verified: true,
    hasVoted: true,
    isVisited: true,
    isFavorite: true,
    isHelped: true,
    isDeceased: false,
    isOutside: false,
    karyakartaName: "Pooja S. Jadhav",
    colorCode: "Green"
  },
  {
    id: "46251585",
    voterCode: "46251585",
    epicNumber: "WXE5544321",
    partNo: 325,
    serialNo: 6,
    fullName: "Surendra Mohan Joshi",
    relativeName: "Mohan Joshi",
    relationType: "Father",
    gender: "MALE",
    age: 67,
    dob: "1957-01-30",
    mobile: "+91 99221 00398",
    address: "Bungalow 7, Deccan, Pune 411004",
    houseNo: "Bungalow 7",
    constituency: "34 - Pune",
    assemblySegment: "215 - Kasba Peth",
    prabhaag: "Prabhaag 14",
    gan: "Gan 4",
    boothNumber: 108,
    pollingStation: "Garware Commerce College",
    caste: "Brahmin",
    occupation: "Retired",
    qualification: "Doctorate",
    bloodGroup: "O+",
    schemeBeneficiary: ["Senior Citizen Concession"],
    politicalLeaning: "STRONG_SUPPORTER",
    isInfluencer: true,
    influencerScope: "Resident Welfare President",
    voterSlipStatus: "DELIVERED",
    verified: true,
    hasVoted: true,
    isVisited: true,
    isFavorite: false,
    isHelped: false,
    isDeceased: false,
    isOutside: false,
    karyakartaName: "Asha V. More",
    colorCode: "Purple"
  },
  {
    id: "v-001",
    voterCode: "46251586",
    epicNumber: "MH34089211",
    partNo: 101,
    serialNo: 42,
    fullName: "Sunita Ramesh Deshmukh",
    relativeName: "Ramesh Deshmukh",
    relationType: "Husband",
    gender: "FEMALE",
    age: 46,
    dob: "1978-04-12",
    mobile: "+91 98224 55102",
    address: "Flat 402, Shivshankar Heights, Near Ideal Colony, Kothrud, Pune 411038",
    houseNo: "Flat 402",
    constituency: "34 - Pune",
    assemblySegment: "214 - Kothrud",
    prabhaag: "Prabhaag 12 - Kothrud West",
    gan: "Gan 8",
    boothNumber: 101,
    pollingStation: "Navbharat High School, Room 1",
    caste: "Maratha",
    occupation: "School Teacher",
    qualification: "Post Graduate",
    bloodGroup: "B+",
    schemeBeneficiary: ["Majhi Ladki Bahin Yojana", "Mahatma Phule Jan Arogya"],
    politicalLeaning: "STRONG_SUPPORTER",
    isInfluencer: true,
    influencerScope: "President, Ideal Colony Mahila Mandal",
    voterSlipStatus: "DELIVERED",
    verified: true,
    hasVoted: true,
    isVisited: true,
    isFavorite: true,
    isHelped: true,
    isDeceased: false,
    isOutside: false,
    karyakartaName: "Vikas M. Patil",
    colorCode: "Blue"
  },
  {
    id: "v-002",
    voterCode: "46251587",
    epicNumber: "MH34089212",
    partNo: 101,
    serialNo: 43,
    fullName: "Ramesh Vasantrao Deshmukh",
    relativeName: "Vasantrao Deshmukh",
    relationType: "Father",
    gender: "MALE",
    age: 52,
    dob: "1972-09-25",
    mobile: "+91 98224 55101",
    address: "Flat 402, Shivshankar Heights, Near Ideal Colony, Kothrud, Pune 411038",
    houseNo: "Flat 402",
    constituency: "34 - Pune",
    assemblySegment: "214 - Kothrud",
    prabhaag: "Prabhaag 12 - Kothrud West",
    gan: "Gan 8",
    boothNumber: 101,
    pollingStation: "Navbharat High School, Room 1",
    caste: "Maratha",
    occupation: "Senior Electrical Engineer, MSEDCL",
    qualification: "Engineering Graduate",
    bloodGroup: "O+",
    schemeBeneficiary: [],
    politicalLeaning: "STRONG_SUPPORTER",
    isInfluencer: false,
    voterSlipStatus: "DELIVERED",
    verified: true,
    hasVoted: true,
    isVisited: true,
    isFavorite: true,
    isHelped: false,
    isDeceased: false,
    isOutside: false,
    karyakartaName: "Vikas M. Patil",
    colorCode: "Blue"
  },
  {
    id: "v-006",
    voterCode: "46251588",
    epicNumber: "MH34015670",
    partNo: 103,
    serialNo: 112,
    fullName: "Prashant Bhimrao Kamble",
    relativeName: "Bhimrao Kamble",
    relationType: "Father",
    gender: "MALE",
    age: 38,
    dob: "1986-03-10",
    mobile: "+91 97645 22019",
    address: "House 45, Paud Road Basti, Pune 411038",
    houseNo: "House 45",
    constituency: "34 - Pune",
    assemblySegment: "214 - Kothrud",
    prabhaag: "Prabhaag 12 - Kothrud West",
    gan: "Gan 8",
    boothNumber: 103,
    pollingStation: "Dr. Babasaheb Ambedkar Samaj Mandir",
    caste: "SC (Neo-Buddhist)",
    occupation: "Auto Rickshaw Driver",
    qualification: "Secondary (10th)",
    bloodGroup: "AB+",
    schemeBeneficiary: ["PM Awas Yojana", "Ayushman Bharat"],
    politicalLeaning: "NEUTRAL",
    isInfluencer: true,
    influencerScope: "Paud Phata Rickshaw Union Rep",
    voterSlipStatus: "GENERATED",
    verified: true,
    hasVoted: false,
    isVisited: true,
    isFavorite: false,
    isHelped: true,
    isDeceased: false,
    isOutside: false,
    karyakartaName: "Ramesh M. More",
    colorCode: "Yellow"
  },
  {
    id: "v-008",
    voterCode: "46251589",
    epicNumber: "MH34029810",
    partNo: 104,
    serialNo: 205,
    fullName: "Mohammad Irfan Shaikh",
    relativeName: "Abdul Ghaffar Shaikh",
    relationType: "Father",
    gender: "MALE",
    age: 44,
    dob: "1980-05-19",
    mobile: "+91 99220 33451",
    address: "Plot 12, Gulmohar Lane, Erandwane, Pune 411004",
    houseNo: "Plot 12",
    constituency: "34 - Pune",
    assemblySegment: "214 - Kothrud",
    prabhaag: "Prabhaag 13 - Erandwane",
    gan: "Gan 2",
    boothNumber: 104,
    pollingStation: "Pune Municipal Primary School No. 18",
    caste: "Muslim (OBC)",
    occupation: "Hardware Store Owner",
    qualification: "Higher Secondary (12th)",
    bloodGroup: "B-",
    schemeBeneficiary: ["PM Mudra Loan"],
    politicalLeaning: "LEANING_OPPOSITION",
    isInfluencer: false,
    voterSlipStatus: "NOT_GENERATED",
    verified: true,
    hasVoted: false,
    isVisited: false,
    isFavorite: false,
    isHelped: false,
    isDeceased: false,
    isOutside: true,
    karyakartaName: "Pooja S. Jadhav",
    colorCode: "Red"
  }
];

export const MOCK_VOTER_PROFILE_SAMPLE: VoterProfile = {
  ...MOCK_VOTERS[0],
  familyMembers: [
    {
      epicNumber: "MH34089212",
      fullName: "Ramesh Vasantrao Deshmukh",
      relation: "Husband",
      age: 52,
      gender: "Male",
      serialNo: 43
    },
    {
      epicNumber: "MH34089213",
      fullName: "Aditya Ramesh Deshmukh",
      relation: "Son",
      age: 21,
      gender: "Male",
      serialNo: 44
    },
    {
      epicNumber: "MH34089214",
      fullName: "Shreya Ramesh Deshmukh",
      relation: "Daughter",
      age: 19,
      gender: "Female",
      serialNo: 45
    }
  ],
  surveys: [
    {
      id: "surv-1",
      date: "2024-04-10",
      surveyorName: "Ganesh Patil (Karyakarta #104)",
      keyIssue: "Morning water pressure problem in 4th floor flats",
      opinionOnCandidate: "Highly positive due to work on Kothrud flyover and streetlights",
      likelihoodToVote: "Definite (10/10)"
    },
    {
      id: "surv-2",
      date: "2024-02-14",
      surveyorName: "Pooja Jadhav (Karyakarta #109)",
      keyIssue: "Need pedestrian crossing near Navbharat School",
      opinionOnCandidate: "Favorable",
      likelihoodToVote: "Definite (9/10)"
    }
  ],
  issuesRaised: [
    {
      ticketId: "TKT-8491",
      category: "Water Supply",
      date: "2024-03-22",
      status: "RESOLVED",
      description: "Low water pressure reported during 6:00 AM - 8:00 AM supply slot."
    },
    {
      ticketId: "TKT-9204",
      category: "Roads & Infrastructure",
      date: "2024-04-05",
      status: "IN_PROGRESS",
      description: "Speed breaker requested near Ideal Colony Gate 2."
    }
  ],
  communications: [
    {
      id: "comm-1",
      channel: "WHATSAPP",
      date: "2024-04-15 11:30 AM",
      campaignName: "Voter Slip & Polling Station Card",
      status: "DELIVERED",
      summary: "Digital slip image sent with booth location and QR code link."
    },
    {
      id: "comm-2",
      channel: "VOICE_CALL",
      date: "2024-04-12 06:15 PM",
      campaignName: "Candidate Appeal by Adv. Vikram Patil",
      status: "RESPONDED",
      summary: "Listened for 42s; selected '1' to confirm voting support."
    },
    {
      id: "comm-3",
      channel: "IN_PERSON",
      date: "2024-04-08 10:00 AM",
      campaignName: "Door-to-Door Outreach Week 3",
      status: "RESPONDED",
      summary: "Brochure handed over by local booth team."
    }
  ],
  documents: [
    {
      name: "Voter_Information_Slip_MH34089211.pdf",
      type: "Official Slip (Generated)",
      uploadedAt: "2024-04-14"
    },
    {
      name: "Booth_Mapping_Certificate.pdf",
      type: "ECI Form 8 Record",
      uploadedAt: "2024-01-20"
    }
  ],
  timeline: [
    {
      date: "2024-04-15",
      title: "Digital Voter Slip Delivered via WhatsApp",
      description: "Delivered to +91 98224 55102 with verified status."
    },
    {
      date: "2024-04-10",
      title: "Door-to-Door Survey Completed",
      description: "Survey conducted by Karyakarta Ganesh Patil; marked as Strong Supporter."
    },
    {
      date: "2024-03-22",
      title: "Public Issue Registered: Water Pressure",
      description: "Ticket TKT-8491 opened and coordinated with Pune Municipal Corporation Ward Officer."
    },
    {
      date: "2024-01-15",
      title: "Electoral Roll Verified",
      description: "Voter name verified in Final Electoral Roll publication (Part 101, Serial 42)."
    }
  ]
};

export const MOCK_USERS: User[] = [
  {
    id: "usr-01",
    name: "Adv. Vikram Patil",
    email: "vikram.patil@indata-election.in",
    phone: "+91 98220 99000",
    role: "CANDIDATE_ADMIN",
    status: "ACTIVE",
    assignedBooths: [101, 102, 103, 104, 105, 106, 107, 108],
    modulePermissions: ["ALL"],
    canImportData: true,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    lastActive: "Just now"
  },
  {
    id: "usr-02",
    name: "Dr. Sameer Deshpande",
    email: "sameer.d@indata-election.in",
    phone: "+91 98221 44556",
    role: "WAR_ROOM_HEAD",
    status: "ACTIVE",
    assignedBooths: [101, 102, 103, 104, 105, 106, 107, 108],
    modulePermissions: ["DASHBOARD", "VOTERS", "CAMPAIGN", "REPORTS", "OFFICE", "LIVE_MAP"],
    canImportData: true,
    lastActive: "4 mins ago"
  },
  {
    id: "usr-03",
    name: "Sachin Babar",
    email: "sachin.babar@indata-election.in",
    phone: "+91 98500 12345",
    role: "PRABHAAG_INCHARGE",
    status: "ACTIVE",
    prabhaag: "Prabhaag 12 - Kothrud West",
    assignedBooths: [101, 102, 103],
    modulePermissions: ["VOTERS", "KARYAKARTAS", "OFFICE", "LIVE_MAP"],
    canImportData: false,
    lastActive: "18 mins ago"
  },
  {
    id: "usr-04",
    name: "Pooja Jadhav",
    email: "pooja.j@indata-election.in",
    phone: "+91 94230 78901",
    role: "KARYAKARTA",
    status: "ACTIVE",
    prabhaag: "Prabhaag 12 - Kothrud West",
    assignedBooths: [101],
    voterSerialRange: "1 to 250",
    modulePermissions: ["VOTER_SEARCH", "SURVEY", "SLIP_DISTRIBUTION"],
    canImportData: false,
    lastActive: "1 hour ago"
  },
  {
    id: "usr-05",
    name: "Ganesh Patil",
    email: "ganesh.p@indata-election.in",
    phone: "+91 98229 11450",
    role: "KARYAKARTA",
    status: "ACTIVE",
    prabhaag: "Prabhaag 12 - Kothrud West",
    assignedBooths: [102],
    voterSerialRange: "251 to 500",
    modulePermissions: ["VOTER_SEARCH", "SURVEY", "SLIP_DISTRIBUTION"],
    canImportData: false,
    lastActive: "35 mins ago"
  },
  {
    id: "usr-06",
    name: "Mahesh Thorat",
    email: "mahesh.t@indata-election.in",
    phone: "+91 98909 33221",
    role: "DATA_OPERATOR",
    status: "ACTIVE",
    assignedBooths: [101, 102, 103, 104],
    modulePermissions: ["VOTER_VIEW", "REPORTS_EXPORT"],
    canImportData: false,
    lastActive: "2 hours ago"
  }
];

export const MOCK_KARYAKARTAS: Karyakarta[] = [
  {
    id: "kar-101",
    name: "Pooja Jadhav",
    phone: "+91 94230 78901",
    prabhaag: "Prabhaag 12 - Kothrud West",
    assignedBooth: 101,
    surveysCompleted: 184,
    voterSlipsDelivered: 420,
    status: "APPROVED",
    joinedDate: "2024-02-01",
    isOnline: true,
    currentLocation: { lat: 18.5074, lng: 73.8077, label: "Ideal Colony Circle" }
  },
  {
    id: "kar-102",
    name: "Ganesh Patil",
    phone: "+91 98229 11450",
    prabhaag: "Prabhaag 12 - Kothrud West",
    assignedBooth: 102,
    surveysCompleted: 210,
    voterSlipsDelivered: 512,
    status: "APPROVED",
    joinedDate: "2024-02-05",
    isOnline: true,
    currentLocation: { lat: 18.5085, lng: 73.8090, label: "Mayur Colony Lane 4" }
  },
  {
    id: "kar-103",
    name: "Vikas More",
    phone: "+91 98233 44556",
    prabhaag: "Prabhaag 13 - Erandwane",
    assignedBooth: 104,
    surveysCompleted: 95,
    voterSlipsDelivered: 230,
    status: "APPROVED",
    joinedDate: "2024-03-01",
    isOnline: false,
    currentLocation: { lat: 18.5112, lng: 73.8321, label: "Erandwane Gaothan" }
  },
  {
    id: "kar-104",
    name: "Supriya Salve",
    phone: "+91 97654 33210",
    prabhaag: "Prabhaag 14 - Shivajinagar",
    assignedBooth: 106,
    surveysCompleted: 142,
    voterSlipsDelivered: 310,
    status: "APPROVED",
    joinedDate: "2024-03-10",
    isOnline: true,
    currentLocation: { lat: 18.5284, lng: 73.8502, label: "FC Road Deccan" }
  },
  {
    id: "kar-105",
    name: "Amol Chordia",
    phone: "+91 98555 12099",
    prabhaag: "Prabhaag 12 - Kothrud West",
    assignedBooth: 103,
    surveysCompleted: 0,
    voterSlipsDelivered: 0,
    status: "PENDING",
    joinedDate: "2024-04-18",
    isOnline: false
  },
  {
    id: "kar-106",
    name: "Deepak Sutar",
    phone: "+91 98224 88771",
    prabhaag: "Prabhaag 13 - Erandwane",
    assignedBooth: 105,
    surveysCompleted: 0,
    voterSlipsDelivered: 0,
    status: "PENDING",
    joinedDate: "2024-04-18",
    isOnline: false
  }
];

export const MOCK_UPDATE_REQUESTS: UpdateRequest[] = [
  {
    id: "REQ-2024-0891",
    voterId: "v-001",
    voterName: "Rajesh Kumar Verma",
    epicNumber: "WXE4829102",
    boothNumber: 101,
    locality: "Lane 3, Mayur Colony, Kothrud",
    karyakartaId: "kar-101",
    karyakartaName: "Pooja Jadhav",
    karyakartaPhone: "+91 98224 44001",
    field: "Contact & Occupation",
    currentValue: "Mobile: Not Verified, Job: Private",
    proposedValue: "Mobile: +91 98221 44001, Job: High School Teacher",
    updatedFields: [
      { field: "mobile", label: "Mobile Number", oldValue: "+91 98220 00000", newValue: "+91 98221 44001" },
      { field: "occupation", label: "Occupation", oldValue: "Private Service", newValue: "High School Teacher" },
      { field: "qualification", label: "Qualification", oldValue: "Graduate", newValue: "Post Graduate (B.Ed)" },
      { field: "schemeBeneficiary", label: "Govt Scheme", oldValue: "None", newValue: "Majhi Ladki Bahin Yojana", isNew: true }
    ],
    reason: "Met voter in person during doorstep verification. Voter verified Aadhaar-linked mobile & teacher identity card.",
    requestedAt: "2024-04-18 10:15 AM",
    status: "PENDING"
  },
  {
    id: "REQ-2024-0892",
    voterId: "v-002",
    voterName: "Sunita Rajesh Verma",
    epicNumber: "WXE0821443",
    boothNumber: 101,
    locality: "Lane 3, Mayur Colony, Kothrud",
    karyakartaId: "kar-101",
    karyakartaName: "Pooja Jadhav",
    karyakartaPhone: "+91 98224 44001",
    field: "Address & Family Link",
    currentValue: "Old Flat No 12, Mayur Colony",
    proposedValue: "Plot 14, Lane 3, Mayur Colony",
    updatedFields: [
      { field: "address", label: "Residential Address", oldValue: "Flat 12, Old Chawl, Mayur Colony", newValue: "Plot 14, Lane 3, Mayur Colony, Kothrud, Pune 411038" },
      { field: "houseNo", label: "House No", oldValue: "12", newValue: "Plot 14" },
      { field: "relationType", label: "Relation Head", oldValue: "Father (Ramesh)", newValue: "Husband (Rajesh Kumar Verma)" }
    ],
    reason: "Family shifted into newly built home 6 months back. Verified electricity meter bill.",
    requestedAt: "2024-04-18 09:40 AM",
    status: "PENDING"
  },
  {
    id: "REQ-2024-0893",
    voterId: "v-003",
    voterName: "Pooja Santosh Deshmukh",
    epicNumber: "WXE3109244",
    boothNumber: 107,
    locality: "Shiv Plaza, Kothrud Stand",
    karyakartaId: "kar-103",
    karyakartaName: "Ramesh M. More",
    karyakartaPhone: "+91 98220 54321",
    field: "Marital Status & Surname",
    currentValue: "Pooja Santosh Deshmukh (Age 21)",
    proposedValue: "Pooja Santosh Deshmukh (Age 22, DOB updated)",
    updatedFields: [
      { field: "dob", label: "Date of Birth", oldValue: "2003-05-14", newValue: "2002-05-14" },
      { field: "age", label: "Age", oldValue: "21", newValue: "22" },
      { field: "mobile", label: "Mobile Number", oldValue: "None", newValue: "+91 97654 32110", isNew: true },
      { field: "bloodGroup", label: "Blood Group", oldValue: "Not Specified", newValue: "B+ (Donor)", isNew: true }
    ],
    reason: "EPIC age corrected per 10th marksheet; voter volunteered as blood donor for booth emergency squad.",
    requestedAt: "2024-04-18 08:30 AM",
    status: "PENDING",
    hasConflict: true,
    conflictNote: "Worker Ganesh Patil (kar-102) previously flagged this voter as relocated on 2024-04-15."
  },
  {
    id: "REQ-2024-0894",
    voterId: "v-004",
    voterName: "Amit Baban Shinde",
    epicNumber: "WXE1290384",
    boothNumber: 106,
    locality: "House 88, Gaothan, Erandwane",
    karyakartaId: "kar-102",
    karyakartaName: "Ganesh K. Kulkarni",
    karyakartaPhone: "+91 98229 11450",
    field: "Voter Status (Relocated)",
    currentValue: "Active Resident",
    proposedValue: "Outside (Working in Bengaluru)",
    updatedFields: [
      { field: "isOutside", label: "Out of Station Flag", oldValue: "No (Local)", newValue: "Yes (Bengaluru Tech Park)" },
      { field: "mobile", label: "Primary WhatsApp", oldValue: "+91 98220 00000", newValue: "+91 99900 12345" }
    ],
    reason: "Parents reported Amit relocated for IT job; will return for polling day if provided early travel intimation.",
    requestedAt: "2024-04-17 06:15 PM",
    status: "PENDING"
  },
  {
    id: "REQ-2024-0895",
    voterId: "v-005",
    voterName: "Kavita Ashok Patil",
    epicNumber: "WXE7765109",
    boothNumber: 108,
    locality: "Bldg 3, Erandwane",
    karyakartaId: "kar-104",
    karyakartaName: "Vikas M. Patil",
    karyakartaPhone: "+91 98223 99887",
    field: "Influencer Tagging & Support",
    currentValue: "Normal Voter (Neutral)",
    proposedValue: "Key Influencer (Strong Supporter)",
    updatedFields: [
      { field: "politicalLeaning", label: "Political Stance", oldValue: "NEUTRAL / UNKNOWN", newValue: "STRONG_SUPPORTER" },
      { field: "isInfluencer", label: "Influencer Flag", oldValue: "No", newValue: "Yes (Society Secretary)" },
      { field: "influencerScope", label: "Influence Radius", oldValue: "None", newValue: "Chintamani Co-Op Society (120 flats)", isNew: true }
    ],
    reason: "Secretary of Chintamani Co-op Society. Met candidate team at evening corner sabha.",
    requestedAt: "2024-04-17 04:45 PM",
    status: "PENDING"
  },
  {
    id: "REQ-2024-0896",
    voterId: "v-006",
    voterName: "Surendra Mohan Joshi",
    epicNumber: "WXE5544321",
    boothNumber: 108,
    locality: "Bungalow 7, Deccan Gymkhana",
    karyakartaId: "kar-105",
    karyakartaName: "Asha V. More",
    karyakartaPhone: "+91 98221 00998",
    field: "Senior Citizen Support / Assistance",
    currentValue: "Age 67 (Walk-in voter)",
    proposedValue: "Wheelchair Assistance Required",
    updatedFields: [
      { field: "isHelped", label: "Assistance Flag", oldValue: "No", newValue: "Yes (Senior Citizen Wheelchair)" },
      { field: "mobile", label: "Caretaker Contact", oldValue: "None", newValue: "+91 98221 00998", isNew: true }
    ],
    reason: "Senior citizen with limited mobility requested wheelchair pick-and-drop on election day.",
    requestedAt: "2024-04-16 11:20 AM",
    status: "APPROVED",
    reviewedBy: "Anand Shinde (Admin)",
    reviewedAt: "2024-04-16 02:15 PM"
  },
  {
    id: "REQ-2024-0897",
    voterId: "v-007",
    voterName: "Datta Narayan Kadam",
    epicNumber: "WXE8901234",
    boothNumber: 102,
    locality: "Ganesh Krupa Bldg, Kothrud",
    karyakartaId: "kar-101",
    karyakartaName: "Pooja Jadhav",
    karyakartaPhone: "+91 98224 44001",
    field: "Deceased Voter Flag",
    currentValue: "Active",
    proposedValue: "Deceased (Mark for Death List)",
    updatedFields: [
      { field: "isDeceased", label: "Deceased Status", oldValue: "Alive / Active", newValue: "Deceased (Passed away Nov 2023)" },
      { field: "voterSlipStatus", label: "Slip Delivery", oldValue: "PENDING", newValue: "CANCELLED" }
    ],
    reason: "Death certificate verified by family. Death occurred 18-Nov-2023 at Deenanath Mangeshkar Hospital.",
    requestedAt: "2024-04-16 09:10 AM",
    status: "APPROVED",
    reviewedBy: "Anand Shinde (Admin)",
    reviewedAt: "2024-04-16 01:30 PM"
  },
  {
    id: "REQ-2024-0898",
    voterId: "v-008",
    voterName: "Mahesh Bapu Jagtap",
    epicNumber: "WXE9912041",
    boothNumber: 103,
    locality: "Swapnanagari, Paud Road",
    karyakartaId: "kar-102",
    karyakartaName: "Ganesh K. Kulkarni",
    karyakartaPhone: "+91 98229 11450",
    field: "Complete Name & EPIC Correction",
    currentValue: "Mahesh Bapu Jagtap",
    proposedValue: "Mahesh Bapusaheb Jagtap-Patil",
    updatedFields: [
      { field: "fullName", label: "Full Name", oldValue: "Mahesh Bapu Jagtap", newValue: "Mahesh Bapusaheb Jagtap-Patil" },
      { field: "caste", label: "Caste Community", oldValue: "General", newValue: "Maratha (96 Kuli)" }
    ],
    reason: "Name mismatch with official gazette notification submitted by karyakarta.",
    requestedAt: "2024-04-15 03:25 PM",
    status: "REJECTED",
    rejectionReason: "Incomplete documentation. Gazette notification scan is unreadable and does not match EPIC record photo.",
    reviewedBy: "Anand Shinde (Admin)",
    reviewedAt: "2024-04-15 05:40 PM"
  },
  {
    id: "REQ-2024-0899",
    voterId: "v-009",
    voterName: "Anjali Deepak Chitnis",
    epicNumber: "WXE3344112",
    boothNumber: 104,
    locality: "Karve Nagar, Pune",
    karyakartaId: "kar-103",
    karyakartaName: "Ramesh M. More",
    karyakartaPhone: "+91 98220 54321",
    field: "Mobile & Scheme Allocation",
    currentValue: "No Mobile, No Scheme",
    proposedValue: "Mobile: +91 97650 11223, Scheme: PM SVANidhi",
    updatedFields: [
      { field: "mobile", label: "Mobile", oldValue: "None", newValue: "+91 97650 11223", isNew: true },
      { field: "schemeBeneficiary", label: "Govt Scheme", oldValue: "None", newValue: "PM SVANidhi Micro Credit", isNew: true }
    ],
    reason: "Street vendor registered under PM SVANidhi. Wants update on kiosk stall allotment.",
    requestedAt: "2024-04-15 11:00 AM",
    status: "SYNC_FAILED",
    syncError: "ECI Roll Lock: Central database sync timeout on Electoral Part 104. Retry required."
  },
  {
    id: "REQ-2024-0900",
    voterId: "v-010",
    voterName: "Sameer Ashokrao Gokhale",
    epicNumber: "WXE6711902",
    boothNumber: 105,
    locality: "Prabhat Road, Lane 10",
    karyakartaId: "kar-105",
    karyakartaName: "Asha V. More",
    karyakartaPhone: "+91 98221 00998",
    field: "Address Shift / Outside Ward",
    currentValue: "Prabhat Road Lane 10",
    proposedValue: "Baner Highway (Shifted 2022)",
    updatedFields: [
      { field: "isOutside", label: "Outside Ward Flag", oldValue: "Local Resident", newValue: "Shifted Outside (Baner)" },
      { field: "newAddress", label: "Current Address", oldValue: "Prabhat Rd, Pune", newValue: "Apt 902, Mont Vert, Baner, Pune 411045", isNew: true }
    ],
    reason: "Voter sold Pune property and shifted to Baner. Still registered in Kasba Peth electoral roll.",
    requestedAt: "2024-04-14 02:40 PM",
    status: "APPROVED",
    reviewedBy: "Anand Shinde (Admin)",
    reviewedAt: "2024-04-14 04:10 PM"
  },
  {
    id: "REQ-2024-0901",
    voterId: "v-011",
    voterName: "Sharada Pandurang Shinde",
    epicNumber: "WXE4412890",
    boothNumber: 101,
    locality: "Mayur Colony, Kothrud",
    karyakartaId: "kar-101",
    karyakartaName: "Pooja Jadhav",
    karyakartaPhone: "+91 98224 44001",
    field: "Favorite / Family Influence",
    currentValue: "Untagged",
    proposedValue: "Favorite / Influencer Family",
    updatedFields: [
      { field: "isFavorite", label: "Favorite Star Marker", oldValue: "No", newValue: "Yes (Core Influencer Family)" },
      { field: "isVisited", label: "Doorstep Visit", oldValue: "Not Visited", newValue: "Visited (Twice by Karyakarta)" }
    ],
    reason: "Matriarch of respected 18-voter joint family in Lane 4. Committed entire family vote.",
    requestedAt: "2024-04-14 10:15 AM",
    status: "APPROVED",
    reviewedBy: "Anand Shinde (Admin)",
    reviewedAt: "2024-04-14 12:00 PM"
  },
  {
    id: "REQ-2024-0902",
    voterId: "v-012",
    voterName: "Kiran Tukaram Sonawane",
    epicNumber: "WXE9102456",
    boothNumber: 107,
    locality: "Paud Phata, Kothrud",
    karyakartaId: "kar-103",
    karyakartaName: "Ramesh M. More",
    karyakartaPhone: "+91 98220 54321",
    field: "Wrong Booth Linkage",
    currentValue: "Booth 107 (Paud Phata)",
    proposedValue: "Booth 106 (Erandwane)",
    updatedFields: [
      { field: "boothNumber", label: "Booth Allocation", oldValue: "107", newValue: "106" },
      { field: "pollingStation", label: "Polling Station", oldValue: "Kothrud Stand High School", newValue: "Erandwane Samaj Mandir" }
    ],
    reason: "Voter residence physically falls under Booth 106 boundary. Incorrectly entered in 107 in draft roll.",
    requestedAt: "2024-04-13 04:10 PM",
    status: "REJECTED",
    rejectionReason: "Booth boundary re-allocation requires Form 8 submission with ECI BLO sign-off. Cannot be altered unilaterally via candidate field app.",
    reviewedBy: "Anand Shinde (Admin)",
    reviewedAt: "2024-04-13 05:20 PM"
  }
];

export const MOCK_BLOS: BLO[] = [
  {
    id: "blo-01",
    name: "Sanjay K. Kulkarni",
    phone: "+91 98220 11234",
    designation: "Assistant Teacher, Pune ZP",
    department: "School Education Dept",
    boothNumber: 101,
    pollingStation: "Navbharat High School, Room 1",
    constituency: "34 - Pune",
    status: "ACTIVE",
    lastVerifiedDate: "2024-04-10"
  },
  {
    id: "blo-02",
    name: "Asha V. More",
    phone: "+91 98220 54321",
    designation: "Junior Clerk, Taluka Office",
    department: "Revenue Department",
    boothNumber: 102,
    pollingStation: "Navbharat High School, Room 2",
    constituency: "34 - Pune",
    status: "ACTIVE",
    lastVerifiedDate: "2024-04-11"
  },
  {
    id: "blo-03",
    name: "Rameshwar P. Mane",
    phone: "+91 94220 98765",
    designation: "Headmaster, PMC Primary School",
    department: "PMC Education Board",
    boothNumber: 103,
    pollingStation: "Dr. Babasaheb Ambedkar Samaj Mandir",
    constituency: "34 - Pune",
    status: "ACTIVE",
    lastVerifiedDate: "2024-04-08"
  },
  {
    id: "blo-04",
    name: "Geeta N. Salunkhe",
    phone: "+91 98901 23456",
    designation: "Gramsevak, Haveli Taluka",
    department: "Rural Development",
    boothNumber: 104,
    pollingStation: "Pune Municipal Primary School No. 18",
    constituency: "34 - Pune",
    status: "ACTIVE",
    lastVerifiedDate: "2024-04-12"
  },
  {
    id: "blo-05",
    name: "Dattatraya Shinde",
    phone: "+91 97632 11098",
    designation: "Clerk, Registration Office",
    department: "Stamps & Registration",
    boothNumber: 105,
    pollingStation: "Abasaheb Garware College, Hall B",
    constituency: "34 - Pune",
    status: "ON_LEAVE",
    lastVerifiedDate: "2024-04-02"
  }
];

export const MOCK_TICKETS: OfficeTicket[] = [
  {
    id: "TKT-9210",
    visitorName: "Narayan Govind Joshi",
    visitorPhone: "+91 98220 33119",
    visitorAddress: "Plot 34, Dahanukar Colony, Kothrud",
    isLinkedVoter: true,
    voterEpic: "MH34091104",
    category: "Water Supply",
    priority: "HIGH",
    status: "OPEN",
    assignedTo: "Sachin Babar (Prabhaag Incharge)",
    createdAt: "2024-04-18 09:30 AM",
    updatedAt: "2024-04-18 10:00 AM",
    description: "Entire Dahanukar Colony Lane 3 has faced low municipal pressure for 5 straight days. Requested tanker coordination or booster line inspection.",
    comments: [
      {
        author: "Adv. Vikram Patil Office Desk",
        text: "Letter drafted and sent to PMC Water Dept Executive Engineer Mr. Gite.",
        timestamp: "2024-04-18 10:15 AM"
      }
    ]
  },
  {
    id: "TKT-9208",
    visitorName: "Shabana Begum Mansuri",
    visitorPhone: "+91 98900 44211",
    visitorAddress: "Opposite Shivaji Statue, Shivajinagar",
    isLinkedVoter: false,
    category: "Pension",
    priority: "MEDIUM",
    status: "IN_PROGRESS",
    assignedTo: "Office Helpdesk (Sanjay Shinde)",
    createdAt: "2024-04-17 03:15 PM",
    updatedAt: "2024-04-18 11:20 AM",
    description: "Sanjay Gandhi Niradhar Yojana monthly pension not credited into bank for 3 months. Visitor has passbook and acknowledgment slip.",
    comments: [
      {
        author: "Helpdesk Operator",
        text: "Checked status on MahaDBT portal. Aadhaar NPCI seeding pending at postal bank. Directed to head post office for e-KYC.",
        timestamp: "2024-04-17 04:00 PM"
      }
    ]
  },
  {
    id: "TKT-9195",
    visitorName: "Mahesh Balkrishna Kadam",
    visitorPhone: "+91 97630 11984",
    visitorAddress: "Flat 12, Swapnashilp, Erandwane",
    isLinkedVoter: true,
    voterEpic: "MH34033418",
    category: "Roads & Infrastructure",
    priority: "CRITICAL",
    status: "RESOLVED",
    assignedTo: "Sachin Babar",
    createdAt: "2024-04-14 11:00 AM",
    updatedAt: "2024-04-16 05:45 PM",
    description: "Deep pothole causing accidents near Erandwane fire station crossing.",
    resolutionNote: "Road maintenance contractor deployed cold-mix asphalt patch on April 15 evening. Road cleared and inspected.",
    comments: [
      {
        author: "Sachin Babar",
        text: "PMC ward junior engineer visited spot with Karyakarta Vikas More.",
        timestamp: "2024-04-15 02:30 PM"
      },
      {
        author: "Candidate Office",
        text: "Photographs of completed road patch received. Ticket marked resolved.",
        timestamp: "2024-04-16 05:45 PM"
      }
    ]
  },
  {
    id: "TKT-9180",
    visitorName: "Savita Vijay Gaikwad",
    visitorPhone: "+91 94220 88761",
    visitorAddress: "Near Gandhi Bhavan, Kothrud",
    isLinkedVoter: true,
    voterEpic: "MH34089211",
    category: "Electricity",
    priority: "MEDIUM",
    status: "RESOLVED",
    assignedTo: "Pooja Jadhav",
    createdAt: "2024-04-12 10:30 AM",
    updatedAt: "2024-04-13 04:00 PM",
    description: "Streetlights not functioning on internal society approach road for 2 weeks.",
    resolutionNote: "MSEDCL line worker replaced 3 faulty LED units and tested circuit.",
    comments: [
      {
        author: "Pooja Jadhav",
        text: "MSEDCL junior engineer contacted on WhatsApp hotline; crew dispatched.",
        timestamp: "2024-04-12 01:00 PM"
      }
    ]
  }
];

export const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: "cmp-01",
    name: "Voter Slip Broadcast - Booths 101 to 105",
    channel: "WHATSAPP",
    campaignType: "Voter Slip Sharing",
    targetAudience: "Verified Supporters & Neutrals in Kothrud (Booths 101-105)",
    recipientCount: 4500,
    deliveredCount: 4320,
    readCount: 3890,
    failedCount: 180,
    status: "RUNNING",
    scheduledTime: "2024-04-18 09:00 AM",
    createdDate: "2024-04-17",
    messageTemplate: "Namaskar {Name} ji! Here is your official voter slip for Booth #{Booth}. Vote for change and development on Election Day!",
    estimatedCostCredits: 4500,
    booths: [101, 102, 103, 104, 105]
  },
  {
    id: "cmp-02",
    name: "Youth First-Time Voter Drive",
    channel: "SMS",
    campaignType: "Voting Information",
    targetAudience: "Voters aged 18-24 across all Prabhaags",
    recipientCount: 8200,
    deliveredCount: 7950,
    readCount: 7100,
    failedCount: 250,
    status: "COMPLETED",
    scheduledTime: "2024-04-16 06:00 PM",
    createdDate: "2024-04-15",
    messageTemplate: "Your vote shapes Pune's future! Check your polling center online at Indata Portal or contact our helpline at 1800-INDATA.",
    estimatedCostCredits: 8200
  },
  {
    id: "cmp-03",
    name: "Candidate Audio Message by Adv. Vikram Patil",
    channel: "AI_VOICE",
    campaignType: "General Announcement",
    targetAudience: "Senior Citizens & Women Beneficiaries",
    recipientCount: 12000,
    deliveredCount: 10450,
    readCount: 8900,
    answeredCount: 9680,
    callDurationSeconds: 42,
    failedCount: 1550,
    status: "SCHEDULED",
    scheduledTime: "2024-04-20 10:00 AM",
    createdDate: "2024-04-18",
    messageTemplate: "Personal voice message highlighting Ladki Bahin assistance, healthcare expansion, and metro line extensions in Pune.",
    estimatedCostCredits: 24000,
    language: "Marathi (Pune dialect)",
    voiceModel: "Adv. Vikram Patil (AI Cloned HD)"
  },
  {
    id: "cmp-04",
    name: "Booth Turnout Surge Reminder",
    channel: "BULK",
    campaignType: "Election Day Reminder",
    targetAudience: "Booths 103, 105, 108 (Identified Swing Zones)",
    recipientCount: 3500,
    deliveredCount: 0,
    readCount: 0,
    failedCount: 0,
    status: "DRAFT",
    scheduledTime: "2024-04-22 07:00 AM",
    createdDate: "2024-04-18",
    messageTemplate: "Voting has begun! Polls close at 6 PM. Transport assistance available from booth karyakartas.",
    estimatedCostCredits: 3500,
    booths: [103, 105, 108]
  },
  {
    id: "cmp-05",
    name: "Shiv Jayanti Greetings Broadcast",
    channel: "WHATSAPP",
    campaignType: "Festival / Holiday Greetings",
    targetAudience: "All Verified WhatsApp Contacts (Prabhaag 12)",
    recipientCount: 15400,
    deliveredCount: 15120,
    readCount: 14200,
    failedCount: 280,
    status: "COMPLETED",
    scheduledTime: "2024-02-19 08:00 AM",
    createdDate: "2024-02-18",
    messageTemplate: "Jai Bhavani, Jai Shivaji! Heartiest wishes on Chhatrapati Shivaji Maharaj Jayanti from Adv. Vikram Patil & Family.",
    estimatedCostCredits: 15400
  },
  {
    id: "cmp-06",
    name: "Senior Citizen Wheelchair Van Coordination",
    channel: "AI_VOICE",
    campaignType: "Volunteer / Worker Communication",
    targetAudience: "Voters 65+ with Wheelchair Assistance Flag",
    recipientCount: 1420,
    deliveredCount: 1380,
    readCount: 1300,
    answeredCount: 1310,
    callDurationSeconds: 35,
    failedCount: 40,
    status: "SCHEDULED",
    scheduledTime: "2024-04-21 04:00 PM",
    createdDate: "2024-04-18",
    messageTemplate: "Namaskar! Wheelchair transport van has been scheduled for your household tomorrow at 9 AM for Booth 101.",
    estimatedCostCredits: 2840,
    language: "Marathi",
    voiceModel: "Karyakarta Voice Agent"
  }
];

export const MOCK_AUDIT_LOGS: AuditLog[] = [
  {
    id: "aud-1092",
    timestamp: "2024-04-18 10:42:15",
    actor: "Adv. Vikram Patil (Candidate)",
    role: "CANDIDATE_ADMIN",
    module: "Total Voters",
    action: "EXPORT_VOTER_LIST_CSV",
    relatedRecord: "Booth #101 (Navbharat High School)",
    ipAddress: "192.168.1.105 (Pune)",
    device: "Chrome / Windows 11",
    outcome: "SUCCESS",
    details: "Exported CSV containing 1,142 verified voter records for field printing."
  },
  {
    id: "aud-1091",
    timestamp: "2024-04-18 10:20:00",
    actor: "Sachin Babar (Prabhaag Incharge)",
    role: "PRABHAAG_INCHARGE",
    module: "Office & Issues",
    action: "CREATE_OFFICE_TICKET",
    relatedRecord: "Ticket #TKT-9210 (Water Supply)",
    ipAddress: "114.143.120.45 (Pune Mobile)",
    device: "Mobile Safari / iOS 17",
    outcome: "SUCCESS",
    details: "Logged priority citizen grievance regarding municipal pipeline pressure."
  },
  {
    id: "aud-1090",
    timestamp: "2024-04-18 09:12:44",
    actor: "Dr. Sameer Deshpande (War Room Head)",
    role: "WAR_ROOM_HEAD",
    module: "Campaign Control",
    action: "DISPATCH_CAMPAIGN_BROADCAST",
    relatedRecord: "CMP-01 (Voter Slip Broadcast)",
    ipAddress: "192.168.1.120 (War Room Server)",
    device: "Firefox / Ubuntu 22.04",
    outcome: "SUCCESS",
    details: "Initiated 4,500 WhatsApp message dispatches with dynamic slip payload."
  },
  {
    id: "aud-1089",
    timestamp: "2024-04-18 08:35:10",
    actor: "Ganesh Patil",
    role: "KARYAKARTA",
    module: "Users & Karyakarta",
    action: "SUBMIT_UPDATE_REQUEST",
    relatedRecord: "User ID #kar-102",
    ipAddress: "157.34.89.210 (Jio 5G)",
    device: "Android App / Chrome Mobile",
    outcome: "SUCCESS",
    details: "Submitted request to update primary mobile number."
  },
  {
    id: "aud-1088",
    timestamp: "2024-04-17 19:40:02",
    actor: "Pooja Jadhav",
    role: "KARYAKARTA",
    module: "Live Field Map",
    action: "LOG_SURVEY_LOCATION",
    relatedRecord: "Voter #MH34089211",
    ipAddress: "106.213.14.77 (Airtel 4G)",
    device: "Indata Karyakarta App",
    outcome: "SUCCESS",
    details: "Survey location marked at Ideal Colony coordinates."
  },
  {
    id: "aud-1087",
    timestamp: "2024-04-17 17:15:33",
    actor: "Mahesh Thorat",
    role: "DATA_OPERATOR",
    module: "Total Voters",
    action: "BULK_DELETE_ATTEMPT",
    relatedRecord: "Booth #108 Roll",
    ipAddress: "192.168.1.189",
    device: "Chrome / Windows 10",
    outcome: "FAILED",
    details: "Unauthorized bulk deletion rejected by role policy. Alert flagged to Super Admin."
  }
];

export const MOCK_FILTERS: FilterItem[] = [
  // Caste
  { id: "flt-c1", category: "Caste", name: "Maratha", code: "CST_MRT", usageCount: 48210, description: "Major agrarian & urban community across western Maharashtra" },
  { id: "flt-c2", category: "Caste", name: "Brahmin", code: "CST_BRH", usageCount: 22400, description: "Predominant demographic in Kothrud, Deccan & Erandwane segments" },
  { id: "flt-c3", category: "Caste", name: "OBC (Mali, Vanjari, Dhangar)", code: "CST_OBC", usageCount: 31200, description: "Crucial artisan and backward class voter clusters" },
  { id: "flt-c4", category: "Caste", name: "SC (Neo-Buddhist / Matang)", code: "CST_SC", usageCount: 19800, description: "Urban pocket communities with strong grassroots mobilization" },
  { id: "flt-c5", category: "Caste", name: "Muslim", code: "CST_MSL", usageCount: 14200, description: "Concentrated in central cantonment and Shivaji Nagar wards" },
  { id: "flt-c6", category: "Caste", name: "Jain / Marwari", code: "CST_JIN", usageCount: 9400, description: "Trading & merchant communities in commercial hubs" },

  // Occupation
  { id: "flt-o1", category: "Occupation", name: "IT & Software Professional", code: "OCC_IT", usageCount: 38400, description: "Hinjawadi & Senapati Bapat Road tech workforce" },
  { id: "flt-o2", category: "Occupation", name: "Govt / PSU Employee", code: "OCC_GOV", usageCount: 16700, description: "Secretariat, Postal, Defense & Railway personnel" },
  { id: "flt-o3", category: "Occupation", name: "Business / Shop Owner", code: "OCC_BIZ", usageCount: 24500, description: "Retailers, small-scale enterprises & service providers" },
  { id: "flt-o4", category: "Occupation", name: "College Student", code: "OCC_STU", usageCount: 42100, description: "Youth voters across Pune's educational institutions" },
  { id: "flt-o5", category: "Occupation", name: "Homemaker", code: "OCC_HMK", usageCount: 51200, description: "Key demographic for family welfare schemes" },
  { id: "flt-o6", category: "Occupation", name: "Retired / Senior Citizen", code: "OCC_RET", usageCount: 29000, description: "High voter turnout demographic (>82% historical)" },

  // Scheme
  { id: "flt-s1", category: "Scheme", name: "Mukhyamantri Majhi Ladki Bahin Yojana", code: "SCH_LBY", usageCount: 38900, description: "Direct benefit transfer of ₹1,500/month to eligible women" },
  { id: "flt-s2", category: "Scheme", name: "Mahatma Jyotirao Phule Jan Arogya Yojana", code: "SCH_MJP", usageCount: 29400, description: "Cashless medical insurance coverage up to ₹5 Lakh" },
  { id: "flt-s3", category: "Scheme", name: "PM Awas Yojana (Urban)", code: "SCH_PMAY", usageCount: 8200, description: "Subsidized housing loans & slum rehabilitation units" },
  { id: "flt-s4", category: "Scheme", name: "Sanjay Gandhi Niradhar Anudan", code: "SCH_SGNA", usageCount: 6500, description: "Pension for destitute, widows and disabled individuals" },

  // Qualification
  { id: "flt-q1", category: "Qualification", name: "Post Graduate / Doctorate", code: "QLF_PG", usageCount: 24100, description: "Engineers, Doctors, MBAs, Academics" },
  { id: "flt-q2", category: "Qualification", name: "Graduate (Degree Holder)", code: "QLF_GRD", usageCount: 58200, description: "Bachelor degree holders in arts, commerce, sciences" },
  { id: "flt-q3", category: "Qualification", name: "Higher Secondary (12th Pass)", code: "QLF_HSC", usageCount: 34900, description: "Completed junior college" },
  { id: "flt-q4", category: "Qualification", name: "Secondary (10th Pass)", code: "QLF_SSC", usageCount: 28400, description: "Matriculation completed" },

  // Custom Values
  { id: "flt-v1", category: "Custom Values", name: "Society Committee Member", code: "CST_RWA", usageCount: 4200, description: "RWA chairpersons and apartment management council" },
  { id: "flt-v2", category: "Custom Values", name: "Youth Club / Ganesh Mandal Worker", code: "CST_MND", usageCount: 8900, description: "Grassroots community festival organizers" },
  { id: "flt-v3", category: "Custom Values", name: "Senior Citizen Club Leader", code: "CST_SCC", usageCount: 2100, description: "Park morning group and pensioner association coordinators" }
];

export const MOCK_SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: "sub-elec-std",
    name: "Election Module - Standard",
    category: "SOFTWARE",
    description: "Complete candidate election management suite with real-time war room and voter mapping.",
    features: [
      "Full Voter Board & Advanced Search",
      "Karyakarta & Member Roster Management",
      "Interactive Live Field Map with Booth Polygons",
      "Central Voter 360° Profile Access",
      "Predefined Analytical Reports & CSV Exports",
      "Dedicated Candidate Office Grievance Tracker"
    ],
    duration: "Full Election Cycle (6 Months)",
    hasAiMode: false,
    priceNote: "Contact Sales / Enterprise Quote",
    popular: false,
    status: "ACTIVE"
  },
  {
    id: "sub-elec-ai",
    name: "Election Module + AI Mode (Pro)",
    category: "SOFTWARE",
    description: "Enterprise election suite supercharged with real-time AI War Room insights and Strategy Bot.",
    features: [
      "Everything in Election Module Standard",
      "Real-Time Global AI Mode Chat Assistant",
      "Strategy Bot with Historical Turnout Modeling",
      "Automated Swing Booth Vulnerability Alerts",
      "AI Voice Call Script Generator & Optimization",
      "Priority Cloud Server Allocation & 24/7 War Room Desk"
    ],
    duration: "Full Election Cycle (6 Months)",
    hasAiMode: true,
    priceNote: "Contact Sales / Enterprise Quote",
    popular: true,
    status: "AVAILABLE"
  },
  {
    id: "sub-off-6m",
    name: "Office Module - 6 Months",
    category: "SOFTWARE",
    description: "Dedicated MLA / MP Constituency Office suite for daily citizen footfall and grievance resolution.",
    features: [
      "Citizen Visitor Registration & Voter Matching",
      "Ticket Lifecycle Tracking (Water, Roads, Pension)",
      "Official Letter Generator with Candidate Header",
      "Departmental Task Assignment & WhatsApp Notifications",
      "Monthly Constituency Grievance Reports"
    ],
    duration: "6 Months Validity",
    hasAiMode: false,
    priceNote: "Constituency Office Plan",
    popular: false,
    status: "AVAILABLE"
  },
  {
    id: "sub-off-12m-ai",
    name: "Office Module - 12 Months + AI Mode",
    category: "SOFTWARE",
    description: "Full year constituency governance with AI duplicate complaint detection and sentiment analysis.",
    features: [
      "Everything in Office Module 6M",
      "12 Months Extended Constituency Cloud Storage",
      "AI Duplicate Detection across wards & bastis",
      "Automatic Citizen Feedback Follow-up IVR",
      "Annual Development Work Performance Dossier"
    ],
    duration: "12 Months (Annual)",
    hasAiMode: true,
    priceNote: "Annual Governance Tier",
    popular: false,
    status: "AVAILABLE"
  },
  {
    id: "rch-wa-50k",
    name: "WhatsApp Broadcast Pack - 50,000 Messages",
    category: "RECHARGE",
    description: "High-throughput verified WhatsApp Business API credits with media templates and button slips.",
    features: [
      "50,000 Verified Meta API Messages",
      "Official Verified Channel Delivery",
      "Voter Slip Media PDF & PNG Attachment Support",
      "Detailed Read Receipt & Click Tracking",
      "No Expiry across current election year"
    ],
    duration: "Non-expiring within election cycle",
    hasAiMode: false,
    priceNote: "Configurable Volume Pack",
    status: "AVAILABLE"
  },
  {
    id: "rch-voice-25k",
    name: "AI Voice Call Outreach - 25,000 Minutes",
    category: "RECHARGE",
    description: "Dynamic voice calling in regional language (Marathi/Hindi) with candidate voice clone option.",
    features: [
      "25,000 Dynamic Outbound Calling Minutes",
      "Natural conversational Marathi & Hindi AI voice",
      "Interactive keypad DTMF survey responses (Press 1 / Press 2)",
      "Live call pickup analytics & audio recordings"
    ],
    duration: "Election Campaign Duration",
    hasAiMode: true,
    priceNote: "Per-Minute Credit Pack",
    status: "AVAILABLE"
  },
  {
    id: "prd-evm-demo",
    name: "Interactive EVM + VVPAT Physical Demo Units",
    category: "EXTRA_SERVICE",
    description: "Hardware training units with candidate dummy ballot strip and realistic beep & slip display for voter education.",
    features: [
      "Pre-programmed ballot paper with Candidate Name & Symbol at slot #1",
      "Realistic VVPAT transparent window cut-out display",
      "Rechargeable battery (12 hours continuous field use)",
      "Rugged carry briefcase for booth training sessions"
    ],
    priceNote: "Unit Supply & Configuration",
    hasAiMode: false,
    status: "AVAILABLE"
  },
  {
    id: "prd-bt-printer",
    name: "Heavy-Duty Bluetooth Thermal Slip Printers (Pack of 10)",
    category: "EXTRA_SERVICE",
    description: "Fast mobile thermal printers compatible with Indata Karyakarta Android App for on-the-spot voter slip printing.",
    features: [
      "10x Bluetooth 4.2 Portable 58mm Thermal Printers",
      "50x High-quality Thermal Paper Rolls included",
      "Direct one-click print from Karyakarta App",
      "1,500 voter slips per battery charge"
    ],
    priceNote: "Hardware Bundle",
    hasAiMode: false,
    status: "AVAILABLE"
  },
  {
    id: "prd-swag",
    name: "Election Campaign Flags, Caps & Badges Kit",
    category: "EXTRA_SERVICE",
    description: "High-visibility party branded campaign materials for rallies, padayatras, and booth tables.",
    features: [
      "5,000 Custom Candidate Photo Caps",
      "1,000 Vehicle & Padayatra Hand Flags",
      "2,500 Karyakarta Photo ID Badges with Lanyards",
      "Weather-resistant UV printed cloth material"
    ],
    priceNote: "Campaign Publicity Pack",
    hasAiMode: false,
    status: "AVAILABLE"
  },
  {
    id: "prd-voter-search",
    name: "Dedicated High-Speed Voter Search Portal / Web Terminal",
    category: "EXTRA_SERVICE",
    description: "Ultra-fast public search kiosk & web subdomain for voters to look up their booth, serial number, and polling station by mobile OTP or name.",
    features: [
      "Branded Candidate Web Search Terminal with Custom Subdomain",
      "Instant EPIC / Name / Mobile soundex search algorithm",
      "One-click WhatsApp Slip download for citizens",
      "SSL Secured cloud infrastructure handling 50k queries/min",
      "Live analytics on citizen search locations & unmapped voters"
    ],
    priceNote: "Custom Web Terminal Deployment",
    hasAiMode: false,
    status: "AVAILABLE"
  }
];

export const MOCK_HISTORICAL_ELECTIONS = [
  {
    year: "2019 Lok Sabha",
    winnerName: "Girish Bapat (BJP)",
    winnerParty: "BJP",
    winnerVotes: 632835,
    winnerVoteShare: 61.1,
    runnerUpName: "Mohan Joshi (INC)",
    runnerUpParty: "INC",
    runnerUpVotes: 308217,
    runnerUpVoteShare: 29.8,
    margin: 324618,
    totalTurnoutPercent: 49.8,
    totalVotesPolled: 1035654
  },
  {
    year: "2014 Lok Sabha",
    winnerName: "Anil Shirole (BJP)",
    winnerParty: "BJP",
    winnerVotes: 569825,
    winnerVoteShare: 57.3,
    runnerUpName: "Dr. Vishwajeet Kadam (INC)",
    runnerUpParty: "INC",
    runnerUpVotes: 254056,
    runnerUpVoteShare: 25.5,
    margin: 315769,
    totalTurnoutPercent: 54.1,
    totalVotesPolled: 994210
  },
  {
    year: "2009 Lok Sabha",
    winnerName: "Suresh Kalmadi (INC)",
    winnerParty: "INC",
    winnerVotes: 279973,
    winnerVoteShare: 38.1,
    runnerUpName: "Anil Shirole (BJP)",
    runnerUpParty: "BJP",
    runnerUpVotes: 254272,
    runnerUpVoteShare: 34.6,
    margin: 25701,
    totalTurnoutPercent: 40.7,
    totalVotesPolled: 734992
  }
];

export interface DashboardTask {
  id: string;
  title: string;
  assignedTo: string;
  assignedRole: string;
  boothNumber: number;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  deadline: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE';
  category: string;
}

export const MOCK_DASHBOARD_TASKS: DashboardTask[] = [
  {
    id: "TSK-101",
    title: "Distribute remaining 120 voter slips in Paud Phata swing cluster",
    assignedTo: "Vikas Mane",
    assignedRole: "Karyakarta",
    boothNumber: 103,
    priority: "CRITICAL",
    deadline: "Today, 5:00 PM",
    status: "OVERDUE",
    category: "Slip Distribution"
  },
  {
    id: "TSK-102",
    title: "Verify 18 unmapped senior citizens for home voting assistance",
    assignedTo: "Pooja Jadhav",
    assignedRole: "Karyakarta Lead",
    boothNumber: 101,
    priority: "HIGH",
    deadline: "Tomorrow, 12:00 PM",
    status: "IN_PROGRESS",
    category: "Voter Verification"
  },
  {
    id: "TSK-103",
    title: "Escalate low water pressure grievance TKT-9210 to PMC Ward Officer",
    assignedTo: "Ramesh Shinde",
    assignedRole: "War Room Operator",
    boothNumber: 105,
    priority: "HIGH",
    deadline: "Today, 6:30 PM",
    status: "IN_PROGRESS",
    category: "Citizen Grievance"
  },
  {
    id: "TSK-104",
    title: "Set up Bluetooth slip printer desks at Navbharat School gate",
    assignedTo: "Ganesh Patil",
    assignedRole: "Booth Adhyaksh",
    boothNumber: 102,
    priority: "MEDIUM",
    deadline: "In 2 days",
    status: "PENDING",
    category: "Booth Setup"
  },
  {
    id: "TSK-105",
    title: "Cross-check ECI roll additions with BLO Sanjay Kulkarni",
    assignedTo: "Amit Deshmukh",
    assignedRole: "Prabhaag Incharge",
    boothNumber: 101,
    priority: "LOW",
    deadline: "Completed 2h ago",
    status: "COMPLETED",
    category: "Roll Audit"
  },
  {
    id: "TSK-106",
    title: "AI Voice broadcast follow-up for 420 undecided youth electors",
    assignedTo: "Sneha Joshi",
    assignedRole: "Campaign Manager",
    boothNumber: 104,
    priority: "MEDIUM",
    deadline: "Today, 8:00 PM",
    status: "IN_PROGRESS",
    category: "Campaign Outreach"
  }
];

export const MOCK_MONITORING_EVENTS = {
  booth: [
    { id: 'be-1', time: '3m ago', title: 'Booth #101 crossed 92% slip delivery', location: 'Navbharat High School', user: 'Sanjay Kulkarni (BLO)', status: 'NORMAL', icon: 'CheckCircle2' },
    { id: 'be-2', time: '18m ago', title: 'Swing warning flag raised for Booth #103', location: 'Paud Phata', user: 'Strategy Bot', status: 'ALERT', icon: 'AlertTriangle' },
    { id: 'be-3', time: '34m ago', title: 'Table agent verification confirmed for Booth #104', location: 'PMC Primary School', user: 'Ramesh Shinde', status: 'NORMAL', icon: 'ShieldCheck' },
    { id: 'be-4', time: '55m ago', title: 'Booth Adhyaksh replacement request received', location: 'Booth #108 Deccan', user: 'Amit Deshmukh', status: 'WARNING', icon: 'Clock' }
  ],
  worker: [
    { id: 'we-1', time: '1m ago', title: 'Pooja Jadhav checked in live at Kothrud Ward 12', location: 'GPS 18.5074, 73.8077', user: 'Pooja Jadhav', status: 'ACTIVE', icon: 'MapPin' },
    { id: 'we-2', time: '12m ago', title: 'Ganesh Patil completed 24 family door-to-door visits', location: 'Booth #102', user: 'Ganesh Patil', status: 'ACTIVE', icon: 'Award' },
    { id: 'we-3', time: '29m ago', title: 'Vikas Mane battery low warning on mobile terminal', location: 'Booth #103 Paud Phata', user: 'Telemetry System', status: 'WARNING', icon: 'AlertCircle' },
    { id: 'we-4', time: '1h ago', title: '6 newly recruited youth volunteers enrolled into Squad C', location: 'Central Office', user: 'Adv. Vikram Patil', status: 'ACTIVE', icon: 'Users' }
  ],
  survey: [
    { id: 'se-1', time: '4m ago', title: 'New household survey: Supporter (4 members mapped)', location: 'Dahanukar Colony', user: 'Pooja Jadhav', status: 'CONFIRMED', icon: 'Check' },
    { id: 'se-2', time: '9m ago', title: 'Scheme beneficiary verified: Ladki Bahin Yojana', location: 'Erandwane Lane 4', user: 'Sunita Rao', status: 'CONFIRMED', icon: 'Sparkles' },
    { id: 'se-3', time: '22m ago', title: 'Undecided swing voter survey flagged for follow-up call', location: 'Mayur Colony', user: 'Ganesh Patil', status: 'FOLLOW_UP', icon: 'PhoneCall' },
    { id: 'se-4', time: '41m ago', title: 'Water shortage grievance noted in household survey', location: 'Paud Road', user: 'Vikas Mane', status: 'TICKET_LINKED', icon: 'AlertTriangle' }
  ],
  field: [
    { id: 'fe-1', time: '2m ago', title: 'Voter Slip Batch #14 sync completed (180 records)', location: 'Mobile Terminal Cloud', user: 'Background Sync', status: 'SYNCED', icon: 'RefreshCw' },
    { id: 'fe-2', time: '15m ago', title: 'Thermal printer roll replacement delivered to Paud Station', location: 'Paud Phata Desk', user: 'Field Logistics', status: 'DELIVERED', icon: 'Printer' },
    { id: 'fe-3', time: '38m ago', title: 'Grievance ticket TKT-9210 escalated to Municipal Officer', location: 'PMC Ward 12', user: 'Office Desk', status: 'ESCALATED', icon: 'AlertTriangle' },
    { id: 'fe-4', time: '1h ago', title: 'Constituency boundary telemetry recalibrated with ECI GeoJSON', location: 'Pune LS-34', user: 'GIS System', status: 'SYNCED', icon: 'Radio' }
  ]
};

export const MOCK_ATTENTION_ALERTS = [
  {
    id: "alt-01",
    severity: "CRITICAL",
    category: "Voter Slip Lag",
    title: "3 High-Priority Swing Booths Under 50% Slip Distribution",
    description: "Booth #103 (Paud Phata, 48% slips), Booth #108 (Deccan, 44%), and Booth #112 (Karve Nagar, 46%) require urgent mobilizer surge before tomorrow evening.",
    affectedArea: "Prabhaag 12 & 14 (3 Polling Stations, 3,420 Electors)",
    timestamp: "12m ago",
    actionLabel: "Dispatch Surge Squad",
    actionView: "map"
  },
  {
    id: "alt-02",
    severity: "HIGH",
    category: "Public Grievance",
    title: "Critical Water Supply Disruption in Dahanukar Colony",
    description: "Ticket #TKT-9210 escalated: Low municipal water pressure reported by 45 resident households in swing sector. Immediate water tanker dispatch coordinated.",
    affectedArea: "Dahanukar Colony, Kothrud (Booth #102 & #103)",
    timestamp: "24m ago",
    actionLabel: "Open Ticket Desk",
    actionView: "office"
  },
  {
    id: "alt-03",
    severity: "HIGH",
    category: "Cadre Inactivity",
    title: "5 Assigned Karyakartas Inactive on Field for > 48 Hours",
    description: "Field terminals at Booths #106 and #110 have recorded 0 door-to-door surveys since yesterday morning. Follow-up automated SMS dispatched.",
    affectedArea: "Prabhaag 13 - Erandwane East",
    timestamp: "1h ago",
    actionLabel: "Reassign Cadre",
    actionView: "users-members"
  },
  {
    id: "alt-04",
    severity: "WARNING",
    category: "Campaign Broadcast",
    title: "WhatsApp Delivery Rate Dip on Inactive Carrier Network",
    description: "142 broadcast messages temporarily queued due to carrier DND filtration on BSNL mobile range in rural prabhaags.",
    affectedArea: "Rural Outskirts Sector 4",
    timestamp: "2h ago",
    actionLabel: "Review Campaign",
    actionView: "campaigns"
  },
  {
    id: "alt-05",
    severity: "WARNING",
    category: "Roll Audit",
    title: "68 Voter Records Require Address Landmark Geocoding",
    description: "Newly migrated ECI addition entries lack building/apartment coordinates for automatic slip delivery route optimization.",
    affectedArea: "Booth #105 (Garware College Locality)",
    timestamp: "3h ago",
    actionLabel: "Inspect Roll",
    actionView: "voters"
  }
];

export interface MemberRecord {
  id: string;
  name: string;
  phone: string;
  membershipId: string;
  role: string;
  status: 'ACTIVE' | 'INACTIVE' | 'NEWLY_REGISTERED';
  joinedDate: string;
  assignedBooth: number;
  prabhaag: string;
}

export const MOCK_ORGANISATION_MEMBERS: MemberRecord[] = [
  { id: 'mem-001', name: 'Adv. Vikram Patil', phone: '+91 98220 99000', membershipId: 'RVM-PN-001', role: 'Candidate / Chief Patron', status: 'ACTIVE', joinedDate: '2021-01-15', assignedBooth: 101, prabhaag: 'Prabhaag 12 - Kothrud West' },
  { id: 'mem-002', name: 'Ganesh Patil', phone: '+91 98220 12345', membershipId: 'RVM-PN-042', role: 'Booth Adhyaksh Lead', status: 'ACTIVE', joinedDate: '2022-03-10', assignedBooth: 102, prabhaag: 'Prabhaag 12 - Kothrud West' },
  { id: 'mem-003', name: 'Pooja Jadhav', phone: '+91 98220 23456', membershipId: 'RVM-PN-089', role: 'Mahila Morcha Coordinator', status: 'ACTIVE', joinedDate: '2022-06-18', assignedBooth: 101, prabhaag: 'Prabhaag 12 - Kothrud West' },
  { id: 'mem-004', name: 'Vikas Mane', phone: '+91 98220 34567', membershipId: 'RVM-PN-112', role: 'Field Squad Lead', status: 'ACTIVE', joinedDate: '2023-01-20', assignedBooth: 103, prabhaag: 'Prabhaag 12 - Kothrud West' },
  { id: 'mem-005', name: 'Sunita Rao', phone: '+91 98220 45678', membershipId: 'RVM-PN-154', role: 'Youth Mobilizer', status: 'NEWLY_REGISTERED', joinedDate: '2024-03-01', assignedBooth: 104, prabhaag: 'Prabhaag 13 - Erandwane' },
  { id: 'mem-006', name: 'Ramesh Shinde', phone: '+91 98220 56789', membershipId: 'RVM-PN-188', role: 'Booth Secretary', status: 'ACTIVE', joinedDate: '2023-08-14', assignedBooth: 105, prabhaag: 'Prabhaag 13 - Erandwane' },
  { id: 'mem-007', name: 'Amit Deshmukh', phone: '+91 98220 67890', membershipId: 'RVM-PN-201', role: 'Prabhaag Incharge', status: 'ACTIVE', joinedDate: '2021-11-05', assignedBooth: 106, prabhaag: 'Prabhaag 14 - Shivajinagar' },
  { id: 'mem-008', name: 'Kavita Joshi', phone: '+91 98220 78901', membershipId: 'RVM-PN-245', role: 'Ward Volunteer', status: 'INACTIVE', joinedDate: '2022-09-12', assignedBooth: 107, prabhaag: 'Prabhaag 14 - Shivajinagar' },
  { id: 'mem-009', name: 'Sachin Kulkarni', phone: '+91 98220 89012', membershipId: 'RVM-PN-290', role: 'Social Media Cell', status: 'NEWLY_REGISTERED', joinedDate: '2024-04-02', assignedBooth: 108, prabhaag: 'Prabhaag 14 - Shivajinagar' },
  { id: 'mem-010', name: 'Deepak More', phone: '+91 98220 90123', membershipId: 'RVM-PN-310', role: 'Booth Volunteer', status: 'INACTIVE', joinedDate: '2023-04-18', assignedBooth: 103, prabhaag: 'Prabhaag 12 - Kothrud West' }
];

export const MOCK_CASTE_CATEGORIES = [
  { name: 'General / Open Category', code: 'GEN', voterCount: 712000, percentage: 33.1, color: '#3b82f6' },
  { name: 'OBC (Other Backward Classes)', code: 'OBC', voterCount: 624000, percentage: 29.0, color: '#06b6d4' },
  { name: 'SC (Scheduled Castes)', code: 'SC', voterCount: 298000, percentage: 13.8, color: '#8b5cf6' },
  { name: 'Religious Minorities', code: 'MIN', voterCount: 184000, percentage: 8.5, color: '#6366f1' },
  { name: 'ST / NT (Nomadic Tribes)', code: 'NT', voterCount: 142000, percentage: 6.6, color: '#f59e0b' },
  { name: 'Other / Unclassified', code: 'OTH', voterCount: 194200, percentage: 9.0, color: '#94a3b8' }
];

export const MOCK_CASTE_DISTRIBUTION = [
  { casteName: 'Maratha', category: 'General / Open Category', voterCount: 482100, percentage: 22.4, color: '#2563eb' },
  { casteName: 'Mali (OBC)', category: 'OBC', voterCount: 198000, percentage: 9.2, color: '#0284c7' },
  { casteName: 'Brahmin', category: 'General / Open Category', voterCount: 224000, percentage: 10.4, color: '#4f46e5' },
  { casteName: 'Neo-Buddhist (SC)', category: 'SC', voterCount: 198000, percentage: 9.2, color: '#7c3aed' },
  { casteName: 'Vanjari (OBC/NT)', category: 'OBC', voterCount: 114000, percentage: 5.3, color: '#0891b2' },
  { casteName: 'Muslim', category: 'Religious Minorities', voterCount: 142000, percentage: 6.6, color: '#9333ea' },
  { casteName: 'Matang (SC)', category: 'SC', voterCount: 100000, percentage: 4.6, color: '#a855f7' },
  { casteName: 'Dhangar (OBC/NT)', category: 'OBC', voterCount: 88000, percentage: 4.1, color: '#0ea5e9' },
  { casteName: 'Jain / Marwari', category: 'General / Open Category', voterCount: 94000, percentage: 4.4, color: '#38bdf8' },
  { casteName: 'Other Micro Communities', category: 'Other / Unclassified', voterCount: 514100, percentage: 23.8, color: '#cbd5e1' }
];

export interface AssemblyConstituency {
  id: string;
  code: string;
  name: string;
  totalVoters: number;
  totalBooths: number;
}

export interface ParliamentaryConstituency {
  id: string;
  name: string;
  code: string;
  state: string;
  totalVoters: number;
  totalBooths: number;
  assemblySegments: AssemblyConstituency[];
}

export const MOCK_CONSTITUENCIES: ParliamentaryConstituency[] = [
  {
    id: "pc-34",
    name: "34 - Pune Parliamentary Constituency",
    code: "PC-34",
    state: "Maharashtra",
    totalVoters: 2154200,
    totalBooths: 2045,
    assemblySegments: [
      { id: "ac-all", code: "ALL", name: "All Vidhan Sabha Segments", totalVoters: 2154200, totalBooths: 2045 },
      { id: "ac-214", code: "214", name: "214 - Kothrud Assembly Segment", totalVoters: 412500, totalBooths: 395 },
      { id: "ac-215", code: "215", name: "215 - Shivajinagar Assembly Segment", totalVoters: 345800, totalBooths: 320 },
      { id: "ac-208", code: "208", name: "208 - Vadgaon Sheri Assembly Segment", totalVoters: 472100, totalBooths: 440 },
      { id: "ac-210", code: "210", name: "210 - Pune Cantonment Assembly Segment", totalVoters: 312400, totalBooths: 295 },
      { id: "ac-211", code: "211", name: "211 - Kasba Peth Assembly Segment", totalVoters: 289400, totalBooths: 285 },
      { id: "ac-212", code: "212", name: "212 - Parvati Assembly Segment", totalVoters: 322000, totalBooths: 310 }
    ]
  },
  {
    id: "pc-35",
    name: "35 - Baramati Parliamentary Constituency",
    code: "PC-35",
    state: "Maharashtra",
    totalVoters: 2314500,
    totalBooths: 2180,
    assemblySegments: [
      { id: "ac-bar-all", code: "ALL", name: "All Vidhan Sabha Segments", totalVoters: 2314500, totalBooths: 2180 },
      { id: "ac-213", code: "213", name: "213 - Khadakwasla Assembly Segment", totalVoters: 512000, totalBooths: 490 },
      { id: "ac-214b", code: "214", name: "214 - Daund Assembly Segment", totalVoters: 324000, totalBooths: 310 }
    ]
  }
];



