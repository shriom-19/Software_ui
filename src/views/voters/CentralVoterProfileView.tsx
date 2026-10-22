import React, { useState } from 'react';
import {
  ArrowLeft,
  Printer,
  Phone,
  MessageSquare,
  Share2,
  MapPin,
  Vote,
  Users,
  Briefcase,
  FileText,
  Clock,
  Shield,
  HelpCircle,
  Building2,
  Calendar,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Eye,
  Lock,
  Tag
} from 'lucide-react';
import { Voter, VoterProfile } from '../../types';
import { MOCK_VOTER_PROFILE_SAMPLE } from '../../data/mockData';
import { useToast } from '../../components/common/Toast';

interface CentralVoterProfileViewProps {
  voter?: Voter | null;
  onBack: () => void;
  onOpenVoterSlip: (voter: Voter) => void;
}

export const CentralVoterProfileView: React.FC<CentralVoterProfileViewProps> = ({
  voter,
  onBack,
  onOpenVoterSlip
}) => {
  const { showToast } = useToast();
  // Use selected voter or fallback to sample voter profile
  const profile: VoterProfile = voter ? { ...MOCK_VOTER_PROFILE_SAMPLE, ...voter } : MOCK_VOTER_PROFILE_SAMPLE;

  const [activeTab, setActiveTab] = useState<
    'identity' | 'address' | 'occupation' | 'political' | 'family' | 'surveys' | 'issues' | 'communications' | 'documents' | 'timeline'
  >('identity');

  const [politicalLeaning, setPoliticalLeaning] = useState(profile.politicalLeaning);
  const [isInfluencer, setIsInfluencer] = useState(profile.isInfluencer);

  const handleUpdateLeaning = (newLeaning: any) => {
    setPoliticalLeaning(newLeaning);
    showToast(`Voter leaning updated to ${newLeaning.replace('_', ' ')} (simulated)`, 'success');
  };

  const handleWhatsApp = () => {
    showToast(`Simulated WhatsApp outreach initiated to ${profile.mobile}`, 'info');
  };

  const handleCall = () => {
    showToast(`Connecting click-to-call with ${profile.fullName} (${profile.mobile})`, 'info');
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Total Voters</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCall}
            className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-xs border border-slate-200 shadow-xs transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-emerald-600" />
            <span>Call Voter</span>
          </button>
          <button
            onClick={handleWhatsApp}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-xl text-xs border border-emerald-200 shadow-xs transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
            <span>WhatsApp Slip</span>
          </button>
          <button
            onClick={() => onOpenVoterSlip(profile)}
            className="flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs shadow-xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Official Slip</span>
          </button>
        </div>
      </div>

      {/* Voter Profile Master Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="bg-gradient-to-r from-slate-900 via-brand-950 to-indigo-950 p-6 text-white flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            {/* Voter Photo / Avatar */}
            <div className="w-20 h-20 rounded-2xl bg-white/10 border-2 border-white/20 flex flex-col items-center justify-center text-center p-1 shrink-0 backdrop-blur-sm">
              <span className="text-xl font-black text-amber-300">
                {profile.fullName.split(' ').map(n => n[0]).slice(0, 2).join('')}
              </span>
              <span className="text-[9px] text-white/70 uppercase font-semibold mt-0.5">Photo Roll</span>
            </div>

            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl md:text-2xl font-black text-white">{profile.fullName}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-brand-500/30 text-brand-200 border border-brand-400/40">
                  {profile.politicalLeaning.replace('_', ' ')}
                </span>
                {profile.isInfluencer && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-400 text-slate-950">
                    Community Influencer
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-y-1 gap-x-4 mt-2 text-xs text-slate-300">
                <span className="font-mono text-amber-300 font-bold">EPIC: {profile.epicNumber}</span>
                <span>Part: {profile.partNo} • Serial: {profile.serialNo}</span>
                <span>{profile.age} Yrs • {profile.gender}</span>
                <span>Mobile: {profile.mobile}</span>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-xs space-y-1 shrink-0">
            <div className="flex justify-between gap-4">
              <span className="text-slate-300">Booth:</span>
              <span className="font-bold text-white">Booth #{profile.boothNumber}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-300">Constituency:</span>
              <span className="font-bold text-brand-200">{profile.constituency}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-300">Voter Slip:</span>
              <span className="font-bold text-emerald-300">{profile.voterSlipStatus}</span>
            </div>
          </div>
        </div>

        {/* 10 Navigation Tabs */}
        <div className="flex border-b border-slate-200 overflow-x-auto no-scrollbar bg-slate-50/80 px-4">
          {[
            { id: 'identity', label: 'Identity & Personal' },
            { id: 'address', label: 'Address & Polling' },
            { id: 'occupation', label: 'Occupation & Welfare' },
            { id: 'political', label: 'Political Leaning' },
            { id: 'family', label: `Family (${profile.familyMembers?.length || 0})` },
            { id: 'surveys', label: `Surveys (${profile.surveys?.length || 0})` },
            { id: 'issues', label: `Issues (${profile.issuesRaised?.length || 0})` },
            { id: 'communications', label: 'Communications' },
            { id: 'documents', label: 'Documents' },
            { id: 'timeline', label: 'Activity Timeline' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-3 text-xs font-bold whitespace-nowrap border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-brand-600 text-brand-700 bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Body */}
        <div className="p-6">
          {/* TAB 1: Identity & Personal */}
          {activeTab === 'identity' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                Personal & Electoral Roll Identification
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[11px]">Full Name (as per ECI Roll):</span>
                  <span className="font-bold text-slate-900 text-sm mt-0.5 block">{profile.fullName}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[11px]">{profile.relationType}'s Name:</span>
                  <span className="font-bold text-slate-900 text-sm mt-0.5 block">{profile.relativeName}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[11px]">EPIC Number:</span>
                  <span className="font-mono font-bold text-brand-700 text-sm mt-0.5 block">{profile.epicNumber}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[11px]">Date of Birth / Age:</span>
                  <span className="font-bold text-slate-800 mt-0.5 block">{profile.dob} ({profile.age} Years)</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[11px]">Gender:</span>
                  <span className="font-bold text-slate-800 mt-0.5 block">{profile.gender}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[11px]">Aadhaar Masked Status:</span>
                  <span className="font-mono text-slate-500 mt-0.5 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                    <span>•••• •••• 8812 (Seeded)</span>
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Address & Polling */}
          {activeTab === 'address' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                Residential Address & Polling Station Coordinates
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Residential Address:</span>
                    <span className="font-semibold text-slate-800 mt-0.5 block">{profile.address}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Prabhaag / Ward:</span>
                    <span className="font-medium text-slate-800 block">{profile.prabhaag}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Assembly Segment:</span>
                    <span className="font-medium text-slate-800 block">{profile.assemblySegment}</span>
                  </div>
                </div>

                <div className="p-4 bg-brand-50/60 rounded-xl border border-brand-200 space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-brand-600" />
                    <span className="font-bold text-brand-900">Polling Station Allotment</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Booth Number & Name:</span>
                    <span className="font-bold text-slate-900 block">Booth #{profile.boothNumber} - {profile.pollingStation}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Serial in Roll:</span>
                    <span className="font-mono font-bold text-slate-800 block">Part {profile.partNo}, Serial {profile.serialNo}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Occupation & Welfare Schemes */}
          {activeTab === 'occupation' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                Occupation, Caste, & Government Welfare Schemes
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[11px]">Occupation:</span>
                  <span className="font-bold text-slate-900 mt-0.5 block">{profile.occupation}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[11px]">Caste Cluster:</span>
                  <span className="font-bold text-slate-900 mt-0.5 block">{profile.caste}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[11px]">Income Estimation Tier:</span>
                  <span className="font-medium text-slate-700 mt-0.5 block">Middle Income (MIG)</span>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-700 block mb-2">Availing Government Benefits:</span>
                <div className="flex flex-wrap gap-2">
                  {profile.schemeBeneficiary?.map((s, idx) => (
                    <span key={idx} className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{s}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Political Leaning & Influence */}
          {activeTab === 'political' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                Political Orientation & Grassroots Influence
              </h3>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Classify Political Leaning (Field Surveyor Input)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  {[
                    { id: 'STRONG_SUPPORTER', label: 'Strong Supporter', color: 'emerald' },
                    { id: 'LEANING_SUPPORTER', label: 'Leaning Supporter', color: 'teal' },
                    { id: 'NEUTRAL', label: 'Neutral / Undecided', color: 'amber' },
                    { id: 'LEANING_OPPOSITION', label: 'Leaning Opposition', color: 'rose' },
                    { id: 'STRONG_OPPOSITION', label: 'Strong Opposition', color: 'red' }
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleUpdateLeaning(item.id)}
                      className={`p-2.5 rounded-xl text-xs font-bold text-center border transition-all ${
                        politicalLeaning === item.id
                          ? 'bg-brand-600 text-white border-brand-700 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {profile.isInfluencer && (
                <div className="p-4 bg-purple-50 rounded-xl border border-purple-200 text-xs">
                  <div className="flex items-center gap-2 font-bold text-purple-900 mb-1">
                    <Tag className="w-4 h-4 text-purple-700" />
                    <span>Local Community Influencer Profile</span>
                  </div>
                  <p className="text-purple-800">{profile.influencerScope}</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: Family Relationships */}
          {activeTab === 'family' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-sm font-bold text-slate-900">
                  Household Family Members ({profile.familyMembers?.length || 0} Listed)
                </h3>
                <span className="text-xs text-slate-500">Mappable based on shared address & serial sequence</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {profile.familyMembers?.map((m, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{m.fullName}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                        {m.relation}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-mono">EPIC: {m.epicNumber} • Sr #{m.serialNo}</p>
                    <p className="text-[11px] text-slate-600">{m.age} Yrs • {m.gender}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: Surveys */}
          {activeTab === 'surveys' && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                Field Survey History
              </h3>
              {profile.surveys?.map((s) => (
                <div key={s.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">Surveyor: {s.surveyorName}</span>
                    <span className="text-slate-400 text-[11px]">{s.date}</span>
                  </div>
                  <p className="text-slate-700"><strong>Key Issue:</strong> {s.keyIssue}</p>
                  <p className="text-slate-700"><strong>Candidate Sentiment:</strong> {s.opinionOnCandidate}</p>
                  <p className="text-emerald-700 font-semibold">Likelihood to Vote: {s.likelihoodToVote}</p>
                </div>
              ))}
            </div>
          )}

          {/* TAB 7: Issues Raised */}
          {activeTab === 'issues' && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                Constituency Office Grievances
              </h3>
              {profile.issuesRaised?.map((issue) => (
                <div key={issue.ticketId} className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-brand-700">{issue.ticketId}</span>
                      <span className="font-bold text-slate-900">{issue.category}</span>
                      <span className="text-slate-400 text-[11px]">{issue.date}</span>
                    </div>
                    <p className="text-slate-600 mt-1">{issue.description}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    issue.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {issue.status}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* TAB 8: Communications */}
          {activeTab === 'communications' && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                Multi-Channel Outreach Log
              </h3>
              {profile.communications?.map((c) => (
                <div key={c.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.2 rounded font-bold text-[10px] bg-slate-200 text-slate-700">
                        {c.channel}
                      </span>
                      <span className="font-bold text-slate-900">{c.campaignName}</span>
                    </div>
                    <p className="text-slate-600 text-[11px] mt-0.5">{c.summary}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-[10px] text-emerald-600 block">{c.status}</span>
                    <span className="text-[10px] text-slate-400">{c.date}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 9: Documents */}
          {activeTab === 'documents' && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                Official Electoral Artifacts & Slips
              </h3>
              {profile.documents?.map((doc, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-brand-600" />
                    <div>
                      <span className="font-bold text-slate-900 block">{doc.name}</span>
                      <span className="text-[11px] text-slate-400">{doc.type} • Uploaded {doc.uploadedAt}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => onOpenVoterSlip(profile)}
                    className="px-3 py-1 bg-white hover:bg-slate-100 text-brand-700 font-bold border border-slate-200 rounded-lg"
                  >
                    View Slip
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* TAB 10: Timeline */}
          {activeTab === 'timeline' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                Chronological Voter Interaction Timeline
              </h3>
              <div className="space-y-3 pl-2 border-l-2 border-brand-200">
                {profile.timeline?.map((item, idx) => (
                  <div key={idx} className="relative pl-4 text-xs">
                    <div className="w-2.5 h-2.5 rounded-full bg-brand-600 absolute -left-[21px] top-1"></div>
                    <span className="text-[10px] text-slate-400 font-medium block">{item.date}</span>
                    <span className="font-bold text-slate-900 block">{item.title}</span>
                    <p className="text-slate-600 text-[11px] mt-0.5">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
