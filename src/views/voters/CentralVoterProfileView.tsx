import React, { useState, useRef, useEffect } from 'react';
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
  EyeOff,
  Lock,
  Tag,
  AlertCircle,
  Plus,
  Trash2,
  Edit3,
  PhoneCall,
  Copy,
  Download,
  X,
  QrCode,
  Navigation,
  UserCheck,
  Star,
  Send,
  Check,
  Bookmark,
  AlertTriangle,
  Heart,
  ChevronDown,
  Info,
  CheckCircle
} from 'lucide-react';
import { Voter, VoterProfile } from '../../types';
import { MOCK_VOTER_PROFILE_SAMPLE, MOCK_VOTERS } from '../../data/mockData';
import { useToast } from '../../components/common/Toast';

interface CentralVoterProfileViewProps {
  voter?: Voter | null;
  onBack: () => void;
  onOpenVoterSlip: (voter: Voter) => void;
  onSelectVoter?: (voter: Voter) => void;
}

export const CentralVoterProfileView: React.FC<CentralVoterProfileViewProps> = ({
  voter,
  onBack,
  onOpenVoterSlip,
  onSelectVoter
}) => {
  const { showToast } = useToast();

  // Primary active profile state
  const [profile, setProfile] = useState<VoterProfile>(() => {
    return voter ? { ...MOCK_VOTER_PROFILE_SAMPLE, ...voter } : MOCK_VOTER_PROFILE_SAMPLE;
  });

  // Keep in sync if parent voter prop updates
  useEffect(() => {
    if (voter) {
      setProfile({ ...MOCK_VOTER_PROFILE_SAMPLE, ...voter });
    }
  }, [voter]);

  // Interactive profile state
  const [politicalLeaning, setPoliticalLeaning] = useState(profile.politicalLeaning);
  const [isInfluencer, setIsInfluencer] = useState<boolean>(Boolean(profile.isInfluencer));
  const [isFavorite, setIsFavorite] = useState<boolean>(Boolean(profile.isFavorite));
  const [isVisited, setIsVisited] = useState<boolean>(profile.isVisited ?? true);
  const [isHelped, setIsHelped] = useState<boolean>(Boolean(profile.isHelped));
  const [isOutside, setIsOutside] = useState<boolean>(Boolean(profile.isOutside));
  const [voterSlipStatus, setVoterSlipStatus] = useState<string>(profile.voterSlipStatus || 'DELIVERED');
  const [maskedIdsRevealed, setMaskedIdsRevealed] = useState<boolean>(false);

  // Lists state
  const [tags, setTags] = useState<string[]>(profile.tags || [
    'Core Supporter',
    'Senior Citizen Head',
    'Ladki Bahin Beneficiary',
    'Vyapar Mandal',
    'Door-to-Door Visited'
  ]);
  const [surveys, setSurveys] = useState(profile.surveys || []);
  const [officeVisits, setOfficeVisits] = useState(profile.officeVisits || []);
  const [issuesRaised, setIssuesRaised] = useState(profile.issuesRaised || []);
  const [communications, setCommunications] = useState(profile.communications || []);
  const [documents, setDocuments] = useState(profile.documents || []);
  const [timeline, setTimeline] = useState(profile.timeline || []);
  const [notes, setNotes] = useState(profile.notes || []);

  // Filter state for Activity Timeline
  const [timelineFilter, setTimelineFilter] = useState<'ALL' | 'SURVEY' | 'TICKET' | 'COMMUNICATION' | 'OFFICE' | 'SYSTEM'>('ALL');

  // Modals state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [isShareBoothModalOpen, setIsShareBoothModalOpen] = useState(false);
  const [isShareVoterSlipWhatsAppModalOpen, setIsShareVoterSlipWhatsAppModalOpen] = useState(false);
  const [isConductSurveyModalOpen, setIsConductSurveyModalOpen] = useState(false);
  const [isCreateTicketModalOpen, setIsCreateTicketModalOpen] = useState(false);
  const [isAddOfficeVisitModalOpen, setIsAddOfficeVisitModalOpen] = useState(false);
  const [isAddNoteModalOpen, setIsAddNoteModalOpen] = useState(false);
  const [isShareProfileModalOpen, setIsShareProfileModalOpen] = useState(false);
  const [isUploadDocModalOpen, setIsUploadDocModalOpen] = useState(false);
  const [isAddTagModalOpen, setIsAddTagModalOpen] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [selectedDocPreview, setSelectedDocPreview] = useState<any | null>(null);

  // Form states
  const [editFormData, setEditFormData] = useState({
    fullName: profile.fullName,
    relativeName: profile.relativeName,
    relationType: profile.relationType,
    age: profile.age,
    gender: profile.gender,
    dob: profile.dob,
    mobile: profile.mobile,
    alternateMobile: profile.alternateMobile || '+91 94220 88123',
    email: profile.email || 'rajesh.verma@example.com',
    address: profile.address,
    houseNo: profile.houseNo || 'Plot 14',
    prabhaag: profile.prabhaag,
    assemblySegment: profile.assemblySegment,
    boothNumber: profile.boothNumber,
    pollingStation: profile.pollingStation,
    occupation: profile.occupation,
    qualification: profile.qualification || 'Graduate',
    bloodGroup: profile.bloodGroup || 'O+'
  });

  const [newSurveyData, setNewSurveyData] = useState({
    surveyorName: 'Pooja Jadhav (Karyakarta #109)',
    keyIssue: 'Morning water pressure in society block B',
    opinionOnCandidate: 'Highly positive',
    likelihoodToVote: 'Definite (10/10)',
    remarks: 'Family confirmed 4 votes. Requested candidate visit to Ganpati mandal.'
  });

  const [newTicketData, setNewTicketData] = useState({
    category: 'Water Supply',
    priority: 'HIGH' as 'HIGH' | 'MEDIUM' | 'LOW',
    assignedTo: 'Karyakarta Rohit Shinde',
    description: 'Low water pressure reported during morning supply hours.',
    followUpDate: '2024-04-25'
  });

  const [newVisitData, setNewVisitData] = useState({
    reason: 'Grievance Resolution & PM Scheme Guidance',
    staffName: 'Rohit Shinde (Constituency Office Secretary)',
    notes: 'Voter visited constituency central office regarding pipeline inspection status.',
    followUpDate: '2024-04-28'
  });

  const [newNoteData, setNewNoteData] = useState({
    category: 'Strategy & Outreach',
    content: 'Influential elder in society. Recommend personal invitation for candidate townhall.'
  });

  const [newTagInput, setNewTagInput] = useState('');
  const [newDocData, setNewDocData] = useState({
    name: 'Identity_Verification_Slip.pdf',
    type: 'Identity Proof Verification'
  });

  // Call simulation state
  const [callDuration, setCallDuration] = useState(0);
  const [isCallingActive, setIsCallingActive] = useState(false);

  useEffect(() => {
    let timer: any;
    if (isCallingActive) {
      timer = setInterval(() => setCallDuration(d => d + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isCallingActive]);

  // Smooth scroll handler for sticky jump bar
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -90; // offset for sticky navigation
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`${label} copied to clipboard!`, 'info');
  };

  // 1. Update Leaning
  const handleUpdateLeaning = (newLeaning: any) => {
    setPoliticalLeaning(newLeaning);
    const newTimelineEntry = {
      date: 'Just now',
      title: `Political Leaning Updated to ${newLeaning.replace('_', ' ')}`,
      description: `Updated by authorized Candidate Admin via Central Profile.`,
      type: 'PROFILE' as const,
      performedBy: 'Candidate Admin'
    };
    setTimeline([newTimelineEntry, ...timeline]);
    showToast(`Voter political leaning updated to ${newLeaning.replace('_', ' ')}`, 'success');
  };

  // 2. Save Edit Voter Information
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile(prev => ({
      ...prev,
      ...editFormData
    }));
    setIsEditModalOpen(false);
    const newTimelineEntry = {
      date: 'Just now',
      title: 'Voter Record Information Updated',
      description: `Core personal and electoral roll information updated by Admin.`,
      type: 'PROFILE' as const,
      performedBy: 'Candidate Admin'
    };
    setTimeline([newTimelineEntry, ...timeline]);
    showToast('Voter information updated successfully!', 'success');
  };

  // 3. Delete Voter Record
  const handleDeleteConfirm = () => {
    setIsDeleteModalOpen(false);
    showToast(`Voter record ${profile.epicNumber} archived and deleted from active roll.`, 'warning');
    setTimeout(() => {
      onBack();
    }, 600);
  };

  // 4. Record Survey
  const handleSaveSurvey = (e: React.FormEvent) => {
    e.preventDefault();
    const newSurv = {
      id: `surv-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      surveyorName: newSurveyData.surveyorName,
      keyIssue: newSurveyData.keyIssue,
      opinionOnCandidate: newSurveyData.opinionOnCandidate,
      likelihoodToVote: newSurveyData.likelihoodToVote,
      status: 'COMPLETED' as const,
      remarks: newSurveyData.remarks
    };
    setSurveys([newSurv, ...surveys]);
    setIsConductSurveyModalOpen(false);
    const newTimelineEntry = {
      date: 'Just now',
      title: 'New Field Survey Recorded',
      description: `Survey by ${newSurv.surveyorName}: Likelihood to vote ${newSurv.likelihoodToVote}.`,
      type: 'SURVEY' as const,
      performedBy: newSurv.surveyorName
    };
    setTimeline([newTimelineEntry, ...timeline]);
    showToast('Survey recorded and saved successfully!', 'success');
  };

  // 5. Create Ticket
  const handleSaveTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const newTkt = {
      ticketId: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      category: newTicketData.category,
      date: new Date().toISOString().split('T')[0],
      status: 'OPEN' as const,
      priority: newTicketData.priority,
      assignedTo: newTicketData.assignedTo,
      description: newTicketData.description
    };
    setIssuesRaised([newTkt, ...issuesRaised]);
    setIsCreateTicketModalOpen(false);
    const newTimelineEntry = {
      date: 'Just now',
      title: `Grievance Ticket ${newTkt.ticketId} Created`,
      description: `${newTkt.category} ticket assigned to ${newTkt.assignedTo}.`,
      type: 'TICKET' as const,
      performedBy: 'Constituency Desk'
    };
    setTimeline([newTimelineEntry, ...timeline]);
    showToast(`Ticket ${newTkt.ticketId} created successfully!`, 'success');
  };

  // 6. Add Office Visit
  const handleSaveOfficeVisit = (e: React.FormEvent) => {
    e.preventDefault();
    const newVis = {
      id: `vis-${Date.now()}`,
      date: `${new Date().toISOString().split('T')[0]} 11:00 AM`,
      reason: newVisitData.reason,
      staffName: newVisitData.staffName,
      notes: newVisitData.notes,
      followUpDate: newVisitData.followUpDate,
      status: 'COMPLETED' as const
    };
    setOfficeVisits([newVis, ...officeVisits]);
    setIsAddOfficeVisitModalOpen(false);
    const newTimelineEntry = {
      date: 'Just now',
      title: 'Constituency Office Visit Logged',
      description: `Handled by ${newVis.staffName}: ${newVis.reason}.`,
      type: 'OFFICE' as const,
      performedBy: newVis.staffName
    };
    setTimeline([newTimelineEntry, ...timeline]);
    showToast('Office visit recorded successfully!', 'success');
  };

  // 7. Add Note
  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    const newNt = {
      id: `not-${Date.now()}`,
      date: `${new Date().toISOString().split('T')[0]} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      author: 'Candidate Admin',
      category: newNoteData.category,
      content: newNoteData.content
    };
    setNotes([newNt, ...notes]);
    setIsAddNoteModalOpen(false);
    const newTimelineEntry = {
      date: 'Just now',
      title: `Operational Note Added (${newNt.category})`,
      description: newNt.content,
      type: 'PROFILE' as const,
      performedBy: 'Candidate Admin'
    };
    setTimeline([newTimelineEntry, ...timeline]);
    showToast('Operational note recorded!', 'success');
  };

  // 8. Share Booth Location on WhatsApp
  const handleSendBoothWhatsApp = () => {
    setIsShareBoothModalOpen(false);
    const newComm = {
      id: `comm-${Date.now()}`,
      channel: 'WHATSAPP' as const,
      date: 'Just now',
      campaignName: 'Booth Location & Polling Guide Outreach',
      status: 'DELIVERED' as const,
      summary: `Booth #${profile.boothNumber} location and Google Maps link shared with ${profile.fullName}.`
    };
    setCommunications([newComm, ...communications]);
    const newTimelineEntry = {
      date: 'Just now',
      title: 'Booth Location Shared on WhatsApp',
      description: `Sent Booth #${profile.boothNumber} directions & GPS coordinates to ${profile.mobile}.`,
      type: 'COMMUNICATION' as const,
      performedBy: 'WhatsApp Campaign Engine'
    };
    setTimeline([newTimelineEntry, ...timeline]);
    showToast(`Booth location & map coordinates sent to ${profile.mobile} via WhatsApp!`, 'success');
  };

  // 9. Share Voter Slip on WhatsApp
  const handleSendVoterSlipWhatsApp = () => {
    setIsShareVoterSlipWhatsAppModalOpen(false);
    setVoterSlipStatus('DELIVERED');
    const newComm = {
      id: `comm-${Date.now()}`,
      channel: 'WHATSAPP' as const,
      date: 'Just now',
      campaignName: 'Official Digital Voter Information Slip',
      status: 'DELIVERED' as const,
      summary: `Digital slip image and verification link sent to ${profile.fullName} (${profile.mobile}).`
    };
    setCommunications([newComm, ...communications]);
    const newTimelineEntry = {
      date: 'Just now',
      title: 'Digital Voter Slip Delivered on WhatsApp',
      description: `EPIC ${profile.epicNumber} slip link sent to ${profile.mobile}. Status marked as DELIVERED.`,
      type: 'SLIP' as const,
      performedBy: 'WhatsApp Bot Dispatcher'
    };
    setTimeline([newTimelineEntry, ...timeline]);
    showToast(`Digital voter slip successfully delivered to ${profile.mobile}!`, 'success');
  };

  // 10. Call Action
  const handleStartCall = () => {
    setIsCallingActive(true);
    setCallDuration(0);
    setIsCallModalOpen(true);
  };

  const handleEndCall = () => {
    setIsCallingActive(false);
    setIsCallModalOpen(false);
    const durationStr = `${Math.floor(callDuration / 60)}m ${callDuration % 60}s`;
    const newComm = {
      id: `comm-${Date.now()}`,
      channel: 'VOICE_CALL' as const,
      date: 'Just now',
      campaignName: 'Direct Voter Connect Call',
      status: 'RESPONDED' as const,
      summary: `Call connected for ${durationStr}. Voter acknowledged candidate appeal.`
    };
    setCommunications([newComm, ...communications]);
    const newTimelineEntry = {
      date: 'Just now',
      title: `Voice Call Completed (${durationStr})`,
      description: `Outbound call to ${profile.mobile} completed with connected response.`,
      type: 'COMMUNICATION' as const,
      performedBy: 'Calling Gateway'
    };
    setTimeline([newTimelineEntry, ...timeline]);
    showToast(`Call logged (${durationStr}) into communication history.`, 'info');
  };

  // 11. Upload Document
  const handleSaveDoc = (e: React.FormEvent) => {
    e.preventDefault();
    const newDoc = {
      name: newDocData.name,
      type: newDocData.type,
      uploadedAt: new Date().toISOString().split('T')[0],
      size: '620 KB',
      uploadedBy: 'Candidate Admin'
    };
    setDocuments([newDoc, ...documents]);
    setIsUploadDocModalOpen(false);
    const newTimelineEntry = {
      date: 'Just now',
      title: `New Document Uploaded: ${newDoc.name}`,
      description: `${newDoc.type} added to voter record.`,
      type: 'DOCUMENT' as const,
      performedBy: 'Candidate Admin'
    };
    setTimeline([newTimelineEntry, ...timeline]);
    showToast('Document uploaded successfully!', 'success');
  };

  // 12. Add Tag
  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTagInput.trim() && !tags.includes(newTagInput.trim())) {
      const cleanTag = newTagInput.trim().startsWith('#') ? newTagInput.trim() : `#${newTagInput.trim()}`;
      setTags([...tags, cleanTag]);
      setNewTagInput('');
      setIsAddTagModalOpen(false);
      showToast(`Tag ${cleanTag} added!`, 'success');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
    showToast(`Tag ${tagToRemove} removed`, 'info');
  };

  // Switch to linked family member profile
  const handleOpenLinkedFamilyMember = (epicNumber: string, fullName: string) => {
    const existingVoter = MOCK_VOTERS.find(v => v.epicNumber === epicNumber);
    if (existingVoter) {
      if (onSelectVoter) {
        onSelectVoter(existingVoter);
      } else {
        setProfile({ ...MOCK_VOTER_PROFILE_SAMPLE, ...existingVoter });
      }
      showToast(`Switched profile to ${existingVoter.fullName}`, 'info');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Create profile representation
      const simulatedMember: Voter = {
        ...profile,
        id: epicNumber,
        voterCode: epicNumber,
        epicNumber,
        fullName,
        serialNo: profile.serialNo + 1,
        gender: fullName.toLowerCase().includes('shreya') ? 'FEMALE' : 'MALE',
        age: 21,
        relationType: 'Father',
        relativeName: profile.fullName
      };
      if (onSelectVoter) {
        onSelectVoter(simulatedMember);
      } else {
        setProfile({ ...MOCK_VOTER_PROFILE_SAMPLE, ...simulatedMember });
      }
      showToast(`Switched profile to ${fullName}`, 'info');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Filtered timeline
  const filteredTimeline = timeline.filter(item => {
    if (timelineFilter === 'ALL') return true;
    return item.type === timelineFilter;
  });

  return (
    <div className="space-y-6 pb-20 animate-fade-in text-slate-800 dark:text-slate-100">
      {/* =========================================================================
          STICKY TOP SUB-BAR WITH JUMP LINKS & QUICK SHORTCUTS
      ========================================================================= */}
      <div className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 py-3 -mx-6 px-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 transition-colors">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs transition-colors shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Total Voters</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 border-l border-slate-200 dark:border-slate-800 pl-3">
            <span className="text-xs font-black text-slate-900 dark:text-white truncate max-w-[180px]">
              {profile.fullName}
            </span>
            <span className="font-mono text-[11px] font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60 px-2 py-0.5 rounded border border-brand-200 dark:border-brand-800">
              {profile.epicNumber}
            </span>
          </div>
        </div>

        {/* Section Jump Nav Pills (Continuous single-page scrolling) */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 max-w-full text-[11px] font-bold">
          {[
            { id: 'sec-overview', label: 'Overview' },
            { id: 'sec-actions', label: 'Actions' },
            { id: 'sec-personal', label: 'Personal' },
            { id: 'sec-address', label: 'Address' },
            { id: 'sec-election', label: 'Election' },
            { id: 'sec-occupation', label: 'Occupation' },
            { id: 'sec-political', label: 'Political' },
            { id: 'sec-family', label: `Family (${profile.familyMembers?.length || 0})` },
            { id: 'sec-surveys', label: `Surveys (${surveys.length})` },
            { id: 'sec-office', label: `Office (${officeVisits.length})` },
            { id: 'sec-tickets', label: `Tickets (${issuesRaised.length})` },
            { id: 'sec-communications', label: 'Outreach' },
            { id: 'sec-documents', label: `Documents (${documents.length})` },
            { id: 'sec-tags', label: 'Tags' },
            { id: 'sec-timeline', label: 'Timeline' }
          ].map(sec => (
            <button
              key={sec.id}
              onClick={() => scrollToSection(sec.id)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-brand-50 hover:text-brand-700 dark:hover:bg-brand-950/50 dark:hover:text-brand-300 transition-colors whitespace-nowrap"
            >
              {sec.label}
            </button>
          ))}
        </div>

        {/* Header Action Shortcuts */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleStartCall}
            className="p-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-xl hover:bg-emerald-100 transition-colors shadow-xs"
            title="Call Voter"
          >
            <PhoneCall className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsWhatsAppModalOpen(true)}
            className="p-2 bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800 rounded-xl hover:bg-brand-100 transition-colors shadow-xs"
            title="WhatsApp Voter"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
          <button
            onClick={() => onOpenVoterSlip(profile)}
            className="flex items-center gap-1.5 px-3 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs shadow-xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print Slip</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          SECTION A: VOTER PROFILE HEADER (NAVY MASTER BANNER)
      ========================================================================= */}
      <section id="sec-overview" className="bg-slate-950 text-white rounded-3xl border border-slate-800 shadow-premium-lg overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="p-6 md:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Voter Photograph / Avatar Roll */}
            <div className="relative group shrink-0">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-slate-900 via-brand-950 to-slate-800 border-2 border-white/20 shadow-xl flex flex-col items-center justify-center text-center p-1 backdrop-blur-md">
                <span className="text-2xl font-black text-amber-300 tracking-wide">
                  {profile.fullName.split(' ').map(n => n[0]).slice(0, 2).join('')}
                </span>
                <span className="text-[10px] text-slate-300 uppercase font-bold mt-1 tracking-wider">
                  Roll Photo
                </span>
              </div>
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="absolute -bottom-1.5 -right-1.5 p-1.5 bg-brand-600 hover:bg-brand-500 text-white rounded-lg shadow-md transition-transform active:scale-95"
                title="Edit Voter Profile"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Voter Primary Meta & Classification */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                  {profile.fullName}
                </h1>

                {/* Leaning Badge */}
                <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-brand-500/30 text-brand-200 border border-brand-400/40 shadow-xs">
                  {politicalLeaning.replace('_', ' ')}
                </span>

                {/* Status Badges */}
                {isInfluencer && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-400 text-slate-950 flex items-center gap-1 shadow-xs">
                    <Star className="w-3 h-3 fill-slate-950" />
                    <span>Influencer</span>
                  </span>
                )}
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <UserCheck className="w-3 h-3" />
                  <span>Verified Roll</span>
                </span>
                {profile.hasVoted && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                    <Vote className="w-3 h-3" />
                    <span>2024 Voted</span>
                  </span>
                )}
              </div>

              {/* Electoral Roll Identifiers */}
              <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs text-slate-300">
                <span className="flex items-center gap-1.5 font-mono text-amber-300 font-bold bg-slate-900/80 px-2 py-0.5 rounded border border-slate-700/60">
                  <span>EPIC: {profile.epicNumber}</span>
                  <button
                    onClick={() => copyToClipboard(profile.epicNumber, 'EPIC Number')}
                    className="hover:text-white transition-colors"
                    title="Copy EPIC"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </span>
                <span className="text-slate-400">•</span>
                <span>Part: <strong className="text-white">{profile.partNo}</strong></span>
                <span className="text-slate-400">•</span>
                <span>Serial: <strong className="text-white">#{profile.serialNo}</strong></span>
                <span className="text-slate-400">•</span>
                <span>{profile.age} Yrs • {profile.gender}</span>
                <span className="text-slate-400">•</span>
                <span className="flex items-center gap-1">
                  <span>Mob:</span>
                  <strong className="text-white font-mono">{profile.mobile}</strong>
                  <button
                    onClick={() => copyToClipboard(profile.mobile, 'Mobile Number')}
                    className="hover:text-amber-300 transition-colors"
                    title="Copy Mobile"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Context Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 text-xs space-y-2 shrink-0 w-full lg:w-72 shadow-inner">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Assigned Booth:</span>
              <span className="font-bold text-white bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                Booth #{profile.boothNumber}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Constituency:</span>
              <span className="font-bold text-brand-300">{profile.constituency}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Slip Status:</span>
              <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                voterSlipStatus === 'DELIVERED'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : voterSlipStatus === 'PRINTED'
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}>
                {voterSlipStatus}
              </span>
            </div>
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Quick Flags:</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    setIsFavorite(!isFavorite);
                    showToast(isFavorite ? 'Removed from favorites' : 'Marked as VIP / Starred Voter', 'info');
                  }}
                  className={`p-1 rounded ${isFavorite ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                  title="Starred / VIP"
                >
                  <Star className="w-3.5 h-3.5 fill-current" />
                </button>
                <button
                  onClick={() => {
                    setIsVisited(!isVisited);
                    showToast(isVisited ? 'Marked as Not Visited' : 'Marked as Visited', 'info');
                  }}
                  className={`p-1 rounded ${isVisited ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                  title="Visited"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    setIsHelped(!isHelped);
                    showToast(isHelped ? 'Unmarked Helped' : 'Marked as Helped', 'info');
                  }}
                  className={`p-1 rounded ${isHelped ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                  title="Grievance / Helped"
                >
                  <Heart className="w-3.5 h-3.5 fill-current" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION B: QUICK ACTION PANEL (12 PROMINENT ACTIONS)
      ========================================================================= */}
      <section id="sec-actions" className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 font-bold">
              <ZapIcon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                Voter Operations & Quick Action Hub
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                12 essential single-click administrative and field operations for this voter
              </p>
            </div>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg">
            Role: Authorized Admin
          </span>
        </div>

        {/* 12 Quick Action Buttons Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {/* Action 1: Edit Voter Information */}
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="flex flex-col items-center justify-center text-center p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-brand-50 dark:hover:bg-brand-950/40 border border-slate-200 dark:border-slate-700/80 hover:border-brand-300 dark:hover:border-brand-700 text-slate-800 dark:text-slate-200 transition-all group shadow-2xs hover:shadow-sm"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Edit3 className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold leading-tight">Edit Details</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Update roll info</span>
          </button>

          {/* Action 2: Delete Voter Record */}
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="flex flex-col items-center justify-center text-center p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-slate-200 dark:border-slate-700/80 hover:border-rose-300 dark:hover:border-rose-700 text-slate-800 dark:text-slate-200 transition-all group shadow-2xs hover:shadow-sm"
          >
            <div className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Trash2 className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-rose-600 dark:text-rose-400 leading-tight">Delete Record</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Archive voter</span>
          </button>

          {/* Action 3: Call Voter */}
          <button
            onClick={handleStartCall}
            className="flex flex-col items-center justify-center text-center p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-200 dark:border-slate-700/80 hover:border-emerald-300 dark:hover:border-emerald-700 text-slate-800 dark:text-slate-200 transition-all group shadow-2xs hover:shadow-sm"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <PhoneCall className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold leading-tight">Call Voter</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Direct outreach</span>
          </button>

          {/* Action 4: WhatsApp Message */}
          <button
            onClick={() => setIsWhatsAppModalOpen(true)}
            className="flex flex-col items-center justify-center text-center p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-200 dark:border-slate-700/80 hover:border-emerald-300 dark:hover:border-emerald-700 text-slate-800 dark:text-slate-200 transition-all group shadow-2xs hover:shadow-sm"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <MessageSquare className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold leading-tight">WhatsApp</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Quick message</span>
          </button>

          {/* Action 5: Conduct Survey */}
          <button
            onClick={() => setIsConductSurveyModalOpen(true)}
            className="flex flex-col items-center justify-center text-center p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200 dark:border-slate-700/80 hover:border-indigo-300 dark:hover:border-indigo-700 text-slate-800 dark:text-slate-200 transition-all group shadow-2xs hover:shadow-sm"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <FileCheckIcon className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold leading-tight">Conduct Survey</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Record opinion</span>
          </button>

          {/* Action 6: Create Ticket */}
          <button
            onClick={() => setIsCreateTicketModalOpen(true)}
            className="flex flex-col items-center justify-center text-center p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-amber-50 dark:hover:bg-amber-950/40 border border-slate-200 dark:border-slate-700/80 hover:border-amber-300 dark:hover:border-amber-700 text-slate-800 dark:text-slate-200 transition-all group shadow-2xs hover:shadow-sm"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <AlertCircle className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold leading-tight">Create Ticket</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Log grievance</span>
          </button>

          {/* Action 7: Add Note */}
          <button
            onClick={() => setIsAddNoteModalOpen(true)}
            className="flex flex-col items-center justify-center text-center p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-purple-50 dark:hover:bg-purple-950/40 border border-slate-200 dark:border-slate-700/80 hover:border-purple-300 dark:hover:border-purple-700 text-slate-800 dark:text-slate-200 transition-all group shadow-2xs hover:shadow-sm"
          >
            <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <FileText className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold leading-tight">Add Note</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Field observation</span>
          </button>

          {/* Action 8: Print Voter Slip */}
          <button
            onClick={() => onOpenVoterSlip(profile)}
            className="flex flex-col items-center justify-center text-center p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700/80 hover:border-slate-300 text-slate-800 dark:text-slate-200 transition-all group shadow-2xs hover:shadow-sm"
          >
            <div className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Printer className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold leading-tight">Print Voter Slip</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Official card</span>
          </button>

          {/* Action 9: Share Voter Slip on WhatsApp (DEDICATED MODAL) */}
          <button
            onClick={() => setIsShareVoterSlipWhatsAppModalOpen(true)}
            className="flex flex-col items-center justify-center text-center p-3.5 rounded-2xl bg-brand-50/70 dark:bg-brand-950/30 hover:bg-brand-100/80 dark:hover:bg-brand-900/40 border border-brand-200 dark:border-brand-800 text-brand-900 dark:text-brand-200 transition-all group shadow-2xs hover:shadow-sm"
          >
            <div className="w-9 h-9 rounded-xl bg-brand-600 text-white flex items-center justify-center mb-2 group-hover:scale-110 transition-transform shadow-xs">
              <QrCode className="w-4 h-4" />
            </div>
            <span className="text-xs font-black leading-tight text-brand-700 dark:text-brand-300">Slip on WhatsApp</span>
            <span className="text-[10px] text-brand-600/70 dark:text-brand-400/70 mt-0.5">Digital delivery</span>
          </button>

          {/* Action 10: Share Booth Location on WhatsApp (DEDICATED MODAL) */}
          <button
            onClick={() => setIsShareBoothModalOpen(true)}
            className="flex flex-col items-center justify-center text-center p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 hover:bg-amber-100/80 dark:hover:bg-amber-900/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 transition-all group shadow-2xs hover:shadow-sm"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform shadow-xs font-black">
              <MapPin className="w-4 h-4" />
            </div>
            <span className="text-xs font-black leading-tight text-amber-800 dark:text-amber-300">Booth on WhatsApp</span>
            <span className="text-[10px] text-amber-700/70 dark:text-amber-400/70 mt-0.5">Map & directions</span>
          </button>

          {/* Action 11: Share Profile */}
          <button
            onClick={() => setIsShareProfileModalOpen(true)}
            className="flex flex-col items-center justify-center text-center p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-cyan-50 dark:hover:bg-cyan-950/40 border border-slate-200 dark:border-slate-700/80 hover:border-cyan-300 dark:hover:border-cyan-700 text-slate-800 dark:text-slate-200 transition-all group shadow-2xs hover:shadow-sm"
          >
            <div className="w-9 h-9 rounded-xl bg-cyan-100 dark:bg-cyan-950/70 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Share2 className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold leading-tight">Share Profile</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Secure summary</span>
          </button>

          {/* Action 12: View Complete History */}
          <button
            onClick={() => scrollToSection('sec-timeline')}
            className="flex flex-col items-center justify-center text-center p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700/80 hover:border-slate-300 text-slate-800 dark:text-slate-200 transition-all group shadow-2xs hover:shadow-sm"
          >
            <div className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold leading-tight">View History</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Audit timeline</span>
          </button>
        </div>
      </section>

      {/* =========================================================================
          SECTION C: BASIC & PERSONAL INFORMATION
      ========================================================================= */}
      <section id="sec-personal" className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-5 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Basic & Personal Identification
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Official Electoral Commission roll identification and civil credentials
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Information</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-750">
            <span className="text-slate-400 dark:text-slate-400 block text-[11px] font-medium">Full Name (ECI Roll):</span>
            <span className="font-bold text-slate-900 dark:text-white text-sm mt-1 block">{profile.fullName}</span>
          </div>

          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-750">
            <span className="text-slate-400 dark:text-slate-400 block text-[11px] font-medium">{profile.relationType || 'Relative'}'s Name:</span>
            <span className="font-bold text-slate-900 dark:text-white text-sm mt-1 block">{profile.relativeName}</span>
          </div>

          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-750">
            <span className="text-slate-400 dark:text-slate-400 block text-[11px] font-medium">Gender & Blood Group:</span>
            <span className="font-bold text-slate-900 dark:text-white text-sm mt-1 block">
              {profile.gender} • Blood Group: {profile.bloodGroup || 'O+'}
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-750">
            <span className="text-slate-400 dark:text-slate-400 block text-[11px] font-medium">Date of Birth & Age:</span>
            <span className="font-bold text-slate-900 dark:text-white text-sm mt-1 block">
              {profile.dob} ({profile.age} Years)
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-750">
            <span className="text-slate-400 dark:text-slate-400 block text-[11px] font-medium">Primary Mobile Number:</span>
            <span className="font-mono font-bold text-brand-600 dark:text-brand-400 text-sm mt-1 flex items-center justify-between">
              <span>{profile.mobile}</span>
              <button
                onClick={() => copyToClipboard(profile.mobile, 'Mobile')}
                className="text-slate-400 hover:text-slate-700"
                title="Copy"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-750">
            <span className="text-slate-400 dark:text-slate-400 block text-[11px] font-medium">Alternate Contact Number:</span>
            <span className="font-mono font-bold text-slate-800 dark:text-slate-200 text-sm mt-1 block">
              {profile.alternateMobile || '+91 94220 88123'}
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-750">
            <span className="text-slate-400 dark:text-slate-400 block text-[11px] font-medium">Email Address:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm mt-1 truncate block">
              {profile.email || 'rajesh.verma@example.com'}
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-750">
            <span className="text-slate-400 dark:text-slate-400 block text-[11px] font-medium">EPIC / Voter ID Number:</span>
            <span className="font-mono font-black text-brand-700 dark:text-brand-300 text-sm mt-1 flex items-center justify-between">
              <span>{profile.epicNumber}</span>
              <button
                onClick={() => copyToClipboard(profile.epicNumber, 'EPIC')}
                className="text-slate-400 hover:text-slate-700"
                title="Copy EPIC"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-750">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 dark:text-slate-400 block text-[11px] font-medium">Aadhaar (Masked):</span>
              <button
                onClick={() => setMaskedIdsRevealed(!maskedIdsRevealed)}
                className="text-[10px] text-brand-600 hover:underline flex items-center gap-0.5"
              >
                {maskedIdsRevealed ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                <span>{maskedIdsRevealed ? 'Hide' : 'Reveal'}</span>
              </button>
            </div>
            <span className="font-mono font-medium text-slate-700 dark:text-slate-300 text-sm mt-1 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>{maskedIdsRevealed ? '8841 9920 8812' : (profile.aadhaarNumberMasked || '•••• •••• 8812')}</span>
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-750">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 dark:text-slate-400 block text-[11px] font-medium">PAN Card (Masked):</span>
              <button
                onClick={() => setMaskedIdsRevealed(!maskedIdsRevealed)}
                className="text-[10px] text-brand-600 hover:underline flex items-center gap-0.5"
              >
                {maskedIdsRevealed ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                <span>{maskedIdsRevealed ? 'Hide' : 'Reveal'}</span>
              </button>
            </div>
            <span className="font-mono font-medium text-slate-700 dark:text-slate-300 text-sm mt-1 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>{maskedIdsRevealed ? 'ABCDE4921K' : (profile.panNumberMasked || '•••••492K')}</span>
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-750">
            <span className="text-slate-400 dark:text-slate-400 block text-[11px] font-medium">Education / Qualification:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 text-sm mt-1 block">
              {profile.qualification || 'Graduate (B.Com)'}
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-750">
            <span className="text-slate-400 dark:text-slate-400 block text-[11px] font-medium">Caste Cluster:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 text-sm mt-1 block">
              {profile.caste || 'Maratha'}
            </span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION D: ADDRESS & LOCATION INFORMATION
      ========================================================================= */}
      <section id="sec-address" className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-5 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Address & Polling Station Coordinates
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Residential address, administrative ward boundaries, and verified polling location
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMapModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-50 dark:bg-brand-950 hover:bg-brand-100 text-brand-700 dark:text-brand-300 rounded-xl text-xs font-bold border border-brand-200 dark:border-brand-800 transition-colors"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>View on Map</span>
            </button>
            <button
              onClick={() => setIsShareBoothModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-black shadow-xs transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Location</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Residential Address Details */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-750 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
              <span className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                Residential Registration
              </span>
              <span className="text-[10px] font-bold text-slate-500">House No: {profile.houseNo || 'Plot 14'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Full Residential Address:</span>
              <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm mt-0.5 leading-snug">
                {profile.address}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <span className="text-slate-400 block text-[11px]">Prabhaag:</span>
                <span className="font-medium text-slate-800 dark:text-slate-200 block">{profile.prabhaag}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Assembly Segment:</span>
                <span className="font-medium text-slate-800 dark:text-slate-200 block">{profile.assemblySegment}</span>
              </div>
            </div>
          </div>

          {/* Polling Station Coordinates */}
          <div className="p-4 bg-brand-50/60 dark:bg-brand-950/30 rounded-2xl border border-brand-200 dark:border-brand-800/80 space-y-3">
            <div className="flex items-center justify-between border-b border-brand-200/60 dark:border-brand-800 pb-2">
              <div className="flex items-center gap-1.5 text-brand-900 dark:text-brand-300 font-bold uppercase tracking-wider text-xs">
                <Building2 className="w-3.5 h-3.5" />
                <span>Assigned Polling Centre</span>
              </div>
              <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-brand-600 text-white">
                Booth #{profile.boothNumber}
              </span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Polling Station & Hall:</span>
              <span className="font-bold text-slate-900 dark:text-white text-sm block mt-0.5">
                {profile.pollingStation}
              </span>
              <span className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 block">
                {profile.pollingStationAddress || 'Navbharat High School Ground Floor, Hall No 4, Kothrud Depot Road'}
              </span>
            </div>
            <div className="flex items-center justify-between pt-1">
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-[11px]">GPS Coordinates:</span>
                <span className="font-mono font-bold text-brand-700 dark:text-brand-300">
                  {profile.gpsCoordinates || '18.5089° N, 73.8152° E'}
                </span>
              </div>
              <button
                onClick={() => setIsMapModalOpen(true)}
                className="text-xs font-bold text-brand-700 dark:text-brand-400 hover:underline flex items-center gap-1"
              >
                <span>Open in Maps</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION E: ELECTION INFORMATION
      ========================================================================= */}
      <section id="sec-election" className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-5 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
              <Vote className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Election & Electoral Roll Information
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Official booth classification, slip generation history, and verified turnout tracking
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
            Final Roll Publication: Verified
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-750">
            <span className="text-slate-400 block text-[11px]">Voter Status:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm mt-1 flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              <span>Active on Official Roll</span>
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-750">
            <span className="text-slate-400 block text-[11px]">Voter Classification:</span>
            <span className="font-bold text-slate-900 dark:text-white text-sm mt-1 block">
              Priority Core Voter
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-750">
            <span className="text-slate-400 block text-[11px]">Part & Serial Sequence:</span>
            <span className="font-mono font-bold text-brand-700 dark:text-brand-300 text-sm mt-1 block">
              Part {profile.partNo} • Serial #{profile.serialNo}
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-750">
            <span className="text-slate-400 block text-[11px]">Voter Slip Delivery Status:</span>
            <span className="font-bold text-slate-900 dark:text-white text-sm mt-1 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>{voterSlipStatus}</span>
            </span>
          </div>
        </div>

        {/* Historical Voting Records Table */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
            Historical Turnout Track Record
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 text-xs">
            {[
              { election: '2024 Lok Sabha', status: 'VOTED', date: 'May 2024', verified: true },
              { election: '2019 Vidhan Sabha', status: 'VOTED', date: 'Oct 2019', verified: true },
              { election: '2019 Lok Sabha', status: 'VOTED', date: 'Apr 2019', verified: true },
              { election: '2017 PMC Civic', status: 'VOTED', date: 'Feb 2017', verified: true },
              { election: '2014 Lok Sabha', status: 'VOTED', date: 'Apr 2014', verified: true }
            ].map((v, i) => (
              <div key={i} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 text-center">
                <span className="font-bold text-slate-900 dark:text-white block text-[11px]">{v.election}</span>
                <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  {v.status}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">{v.date}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION F: OCCUPATION & PROFILE INFORMATION
      ========================================================================= */}
      <section id="sec-occupation" className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-5 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Occupation, Profile & Welfare Schemes
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Socio-economic tier, employment background, and government beneficiary records
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-750">
            <span className="text-slate-400 block text-[11px]">Primary Occupation:</span>
            <span className="font-bold text-slate-900 dark:text-white text-sm mt-1 block">
              {profile.occupation || 'Business / Trading'}
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-750">
            <span className="text-slate-400 block text-[11px]">Employment Status:</span>
            <span className="font-bold text-slate-900 dark:text-white text-sm mt-1 block">
              Self-Employed / Business Owner
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-750">
            <span className="text-slate-400 block text-[11px]">Estimated Income Tier:</span>
            <span className="font-bold text-brand-700 dark:text-brand-300 text-sm mt-1 block">
              Middle Income Tier (MIG)
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-750">
            <span className="text-slate-400 block text-[11px]">Communication Preference:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 text-sm mt-1 block">
              WhatsApp & In-Person Visits
            </span>
          </div>
        </div>

        {/* Welfare Beneficiary Chips */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2.5">
            Availing Government Welfare Schemes:
          </span>
          <div className="flex flex-wrap gap-2">
            {[
              'Ladki Bahin Yojana (Family Beneficiary)',
              'Ayushman Bharat Golden Card',
              'PM Awas Yojana (Subsidized Housing)',
              'PM Mudra Loan Scheme'
            ].map((s, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{s}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION G: POLITICAL INTEREST INFORMATION
      ========================================================================= */}
      <section id="sec-political" className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Political Interest & Grassroots Orientation
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Surveyor-verified political leaning, influence scope, and community standing
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold px-2.5 py-1 bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 rounded-lg">
            Role Restricted Data
          </span>
        </div>

        {/* Privacy notice banner */}
        <div className="p-3 mb-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-brand-600 dark:text-brand-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Permissions Notice:</strong> Sensitive political information is strictly restricted under candidate administration permissions. Political orientation is recorded only from explicit field survey interactions and is never automatically inferred from personal data.
          </p>
        </div>

        {/* Leaning Selector */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
            Classify Political Orientation (Admin / Surveyor Control)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {[
              { id: 'STRONG_SUPPORTER', label: 'Strong Supporter', color: 'brand' },
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
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Community Influencer & Personality Notes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-xs">
          <div className="p-4 bg-purple-50/70 dark:bg-purple-950/30 rounded-2xl border border-purple-200 dark:border-purple-800/80 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-purple-950 dark:text-purple-200 text-xs">
              <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
              <span>Grassroots Influence Classification</span>
            </div>
            <p className="text-purple-900 dark:text-purple-300 leading-relaxed">
              {profile.influencerScope || 'Vyapar Mandal Committee Member; highly respected in Kasba Peth market association.'}
            </p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-xs">
              <Tag className="w-4 h-4 text-brand-600" />
              <span>Personality & Voter Psychology Profile</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Respected elder in society block. Values civic delivery and water pipeline maintenance. Direct influence on 20-25 shopkeeper families in lane 3.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION H: FAMILY / HOUSEHOLD INFORMATION
      ========================================================================= */}
      <section id="sec-family" className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Family & Household Linkage ({profile.familyMembers?.length || 0} Members)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Mapped based on shared residential address, part sequence, and family head linkage
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950 px-2.5 py-1 rounded-lg">
            Head of Family: {profile.fullName}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
          {profile.familyMembers?.map((m, idx) => (
            <div
              key={idx}
              className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs space-y-2 hover:border-brand-300 dark:hover:border-brand-700 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white text-sm">{m.fullName}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                    {m.relation}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-1">
                  EPIC: {m.epicNumber} • Sr #{m.serialNo}
                </p>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                  {m.age} Yrs • {m.gender} • Booth #{profile.boothNumber}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                  {m.leaning ? m.leaning.replace('_', ' ') : 'CONFIRMED SUPPORTER'}
                </span>
                <button
                  onClick={() => handleOpenLinkedFamilyMember(m.epicNumber, m.fullName)}
                  className="flex items-center gap-1 text-[11px] font-bold text-brand-600 dark:text-brand-400 hover:text-brand-800 hover:underline"
                >
                  <span>Open Profile</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION I: SURVEY INFORMATION
      ========================================================================= */}
      <section id="sec-surveys" className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <FileCheckIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Field Survey History ({surveys.length} Records)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Door-to-door feedback, issue intake, and candidate sentiment tracking
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsConductSurveyModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Conduct New Survey</span>
          </button>
        </div>

        <div className="space-y-3">
          {surveys.map((s) => (
            <div
              key={s.id}
              className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 dark:text-white text-sm">
                    Surveyor: {s.surveyorName}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                    {s.status || 'COMPLETED'}
                  </span>
                </div>
                <span className="text-slate-400 text-[11px] font-medium">{s.date}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                <div>
                  <span className="text-slate-400 block text-[11px]">Key Grievance / Issue Raised:</span>
                  <p className="font-medium text-slate-800 dark:text-slate-200 mt-0.5">{s.keyIssue}</p>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Opinion on Candidate:</span>
                  <p className="font-medium text-slate-800 dark:text-slate-200 mt-0.5">{s.opinionOnCandidate}</p>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <span className="text-brand-700 dark:text-brand-300 font-bold">
                  Likelihood to Vote: {s.likelihoodToVote}
                </span>
                {s.remarks && (
                  <span className="text-slate-500 dark:text-slate-400 italic text-[11px]">
                    Note: {s.remarks}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION J: OFFICE INTERACTION HISTORY
      ========================================================================= */}
      <section id="sec-office" className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Office Interaction & Visit History ({officeVisits.length} Visits)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                In-person visits to constituency office, representations, and discussions
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAddOfficeVisitModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-black shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Office Visit</span>
          </button>
        </div>

        <div className="space-y-3">
          {officeVisits.map((vis) => (
            <div
              key={vis.id}
              className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white text-sm">
                  {vis.reason}
                </span>
                <span className="text-slate-400 text-[11px] font-medium">{vis.date}</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {vis.notes}
              </p>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                <span className="text-slate-500 dark:text-slate-400">
                  Staff In-Charge: <strong className="text-slate-700 dark:text-slate-200">{vis.staffName}</strong>
                </span>
                {vis.followUpDate && (
                  <span className="font-bold text-amber-600 dark:text-amber-400">
                    Follow-up Scheduled: {vis.followUpDate}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION K: ISSUES / TICKETS (GRIEVANCES)
      ========================================================================= */}
      <section id="sec-tickets" className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Constituency Grievance Tickets ({issuesRaised.length})
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Civic issues, public works petitions, and resolution tracking
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCreateTicketModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create New Ticket</span>
          </button>
        </div>

        <div className="space-y-3">
          {issuesRaised.map((issue) => (
            <div
              key={issue.ticketId}
              className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs space-y-2"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-bold text-brand-700 dark:text-brand-300 text-sm">
                      {issue.ticketId}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {issue.category}
                    </span>
                    <span className="text-slate-400 text-[11px] font-medium">{issue.date}</span>
                    {issue.priority && (
                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                        issue.priority === 'HIGH' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {issue.priority} PRIORITY
                      </span>
                    )}
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    {issue.description}
                  </p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold shrink-0 ${
                  issue.status === 'RESOLVED'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                }`}>
                  {issue.status}
                </span>
              </div>
              {issue.resolution && (
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-[11px] text-emerald-700 dark:text-emerald-300 bg-emerald-50/50 dark:bg-emerald-950/20 p-2 rounded-lg">
                  <strong>Resolution:</strong> {issue.resolution}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION L: COMMUNICATION HISTORY
      ========================================================================= */}
      <section id="sec-communications" className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Multi-Channel Outreach & Communication History
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Log of automated campaigns, WhatsApp deliveries, and telephonic engagements
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsWhatsAppModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs font-bold hover:bg-emerald-100 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send WhatsApp</span>
            </button>
            <button
              onClick={handleStartCall}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold hover:bg-slate-200 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Voter</span>
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {communications.map((c) => (
            <div
              key={c.id}
              className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded font-extrabold text-[10px] ${
                    c.channel === 'WHATSAPP' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                    c.channel === 'VOICE_CALL' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' : 'bg-slate-200 text-slate-800'
                  }`}>
                    {c.channel}
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">{c.campaignName}</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-[11px] mt-0.5">{c.summary}</p>
              </div>
              <div className="text-right shrink-0">
                <span className="font-bold text-[10px] text-emerald-600 dark:text-emerald-400 block">{c.status}</span>
                <span className="text-[10px] text-slate-400">{c.date}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION M: DOCUMENTS & ATTACHMENTS
      ========================================================================= */}
      <section id="sec-documents" className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Official Electoral Artifacts & Documents ({documents.length})
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Generated voter slips, Form 8 representations, and civil ID copies
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsUploadDocModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Upload Document</span>
          </button>
        </div>

        <div className="space-y-3">
          {documents.map((doc, idx) => (
            <div
              key={idx}
              className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block text-sm">{doc.name}</span>
                  <span className="text-[11px] text-slate-400">
                    {doc.type} • {doc.size || '420 KB'} • Uploaded {doc.uploadedAt}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedDocPreview(doc)}
                  className="px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-brand-700 dark:text-brand-300 font-bold border border-slate-200 dark:border-slate-700 rounded-xl"
                >
                  View
                </button>
                <button
                  onClick={() => showToast(`Downloading ${doc.name}`, 'info')}
                  className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                  title="Download"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION N: CLASSIFICATION & TAGS
      ========================================================================= */}
      <section id="sec-tags" className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-50 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Voter Classification & Custom Segmentation Tags
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Segment voters into targeted campaign broadcasts and specialized karyakarta squads
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAddTagModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Custom Tag</span>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <span className="text-xs font-bold text-slate-400 block mb-2 uppercase tracking-wider text-[11px]">
              Active Tags ({tags.length})
            </span>
            <div className="flex flex-wrap gap-2">
              {tags.map((t, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-brand-50 dark:bg-brand-950/40 text-brand-800 dark:text-brand-300 border border-brand-200 dark:border-brand-800 text-xs font-bold flex items-center gap-1.5"
                >
                  <span>{t}</span>
                  <button
                    onClick={() => handleRemoveTag(t)}
                    className="text-brand-400 hover:text-brand-700 dark:hover:text-white"
                    title="Remove Tag"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
              <span className="text-slate-400 block text-[11px]">Primary Segment:</span>
              <span className="font-bold text-slate-900 dark:text-white mt-0.5 block">Urban Merchant Middle Class</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
              <span className="text-slate-400 block text-[11px]">Mobilization Priority:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 block">High (Morning Slot Voter)</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
              <span className="text-slate-400 block text-[11px]">Assigned Karyakarta:</span>
              <span className="font-bold text-brand-600 dark:text-brand-400 mt-0.5 block">{profile.karyakartaName || 'Vikas M. Patil'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION O: CHRONOLOGICAL ACTIVITY TIMELINE
      ========================================================================= */}
      <section id="sec-timeline" className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Chronological Activity & Interaction Timeline
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Complete audit trail of surveys, office visits, ticket updates, and messaging
              </p>
            </div>
          </div>

          {/* Timeline Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs font-bold">
            {(['ALL', 'SURVEY', 'TICKET', 'COMMUNICATION', 'OFFICE', 'SYSTEM'] as const).map(f => (
              <button
                key={f}
                onClick={() => setTimelineFilter(f)}
                className={`px-3 py-1 rounded-lg transition-colors whitespace-nowrap text-[11px] ${
                  timelineFilter === f
                    ? 'bg-brand-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4 pl-3 border-l-2 border-brand-200 dark:border-brand-900 ml-3">
          {filteredTimeline.map((item, idx) => (
            <div key={idx} className="relative pl-5 text-xs space-y-1">
              {/* Dot */}
              <div className="w-3 h-3 rounded-full bg-brand-600 border-2 border-white dark:border-slate-900 absolute -left-[23px] top-1 shadow-xs" />

              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                    {item.title}
                  </span>
                  {item.type && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {item.type}
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-slate-400 font-medium">
                  {item.date}
                </span>
              </div>

              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-xs">
                {item.description}
              </p>

              {item.performedBy && (
                <span className="text-[10px] text-slate-400 font-medium block">
                  Action performed by: <strong className="text-slate-600 dark:text-slate-300">{item.performedBy}</strong>
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          MODAL 1: EDIT VOTER INFORMATION
      ========================================================================= */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-850">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-brand-600" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Edit Voter Information</h3>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={editFormData.fullName}
                    onChange={e => setEditFormData({ ...editFormData, fullName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Relative's Name</label>
                  <input
                    type="text"
                    value={editFormData.relativeName}
                    onChange={e => setEditFormData({ ...editFormData, relativeName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Age</label>
                  <input
                    type="number"
                    value={editFormData.age}
                    onChange={e => setEditFormData({ ...editFormData, age: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Gender</label>
                  <select
                    value={editFormData.gender}
                    onChange={e => setEditFormData({ ...editFormData, gender: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  >
                    <option value="MALE">MALE</option>
                    <option value="FEMALE">FEMALE</option>
                    <option value="OTHER">OTHER</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Primary Mobile Number</label>
                  <input
                    type="text"
                    value={editFormData.mobile}
                    onChange={e => setEditFormData({ ...editFormData, mobile: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Alternate Contact</label>
                  <input
                    type="text"
                    value={editFormData.alternateMobile}
                    onChange={e => setEditFormData({ ...editFormData, alternateMobile: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Email Address</label>
                  <input
                    type="email"
                    value={editFormData.email}
                    onChange={e => setEditFormData({ ...editFormData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Occupation</label>
                  <input
                    type="text"
                    value={editFormData.occupation}
                    onChange={e => setEditFormData({ ...editFormData, occupation: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Residential Address</label>
                  <textarea
                    rows={2}
                    value={editFormData.address}
                    onChange={e => setEditFormData({ ...editFormData, address: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: DELETE VOTER CONFIRMATION
      ========================================================================= */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Delete Voter Record?</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Are you sure you want to remove <strong>{profile.fullName}</strong> ({profile.epicNumber})? This will archive the record and prevent export in active constituency lists. This action is permanently audited.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs"
              >
                Yes, Delete Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: SHARE BOOTH LOCATION ON WHATSAPP (DEDICATED WORKFLOW)
      ========================================================================= */}
      {isShareBoothModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-amber-50/60 dark:bg-amber-950/40">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-amber-600" />
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">Share Booth Location on WhatsApp</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Verified polling coordinates & guide</p>
                </div>
              </div>
              <button
                onClick={() => setIsShareBoothModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-white dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Recipient Voter:</span>
                  <strong className="text-slate-900 dark:text-white">{profile.fullName}</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Recipient Mobile:</span>
                  <span className="font-mono font-bold text-brand-600 dark:text-brand-400">{profile.mobile}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Assigned Polling Booth:</span>
                  <span className="font-bold text-slate-900 dark:text-white">Booth #{profile.boothNumber}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">GPS Coordinates:</span>
                  <span className="font-mono text-amber-600 dark:text-amber-400 font-bold">{profile.gpsCoordinates || '18.5089° N, 73.8152° E'}</span>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Message Preview (WhatsApp Ready):
                </label>
                <div className="p-3.5 bg-emerald-50/70 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-800 font-sans text-xs text-slate-800 dark:text-slate-200 leading-relaxed space-y-1">
                  <p>Namaste <strong>{profile.fullName}</strong> ji,</p>
                  <p>Here are your official polling booth details for <strong>{profile.constituency}</strong>:</p>
                  <p className="mt-1">📍 <strong>Station:</strong> {profile.pollingStation}</p>
                  <p>🗳️ <strong>Booth:</strong> #{profile.boothNumber} | Part {profile.partNo} | Sr #{profile.serialNo}</p>
                  <p>🗺️ <strong>Directions:</strong> https://maps.google.com/?q=18.5089,73.8152</p>
                  <p className="text-[11px] text-emerald-800 dark:text-emerald-300 font-semibold mt-2">
                    Polling Date: 20 Nov 2024 (7 AM - 6 PM). Please cast your valuable vote!
                  </p>
                  <p className="text-[11px] text-slate-500">— Rashtriya Vikas Morcha</p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsShareBoothModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSendBoothWhatsApp}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs"
                >
                  <Send className="w-4 h-4" />
                  <span>Send on WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 4: SHARE DIGITAL VOTER SLIP ON WHATSAPP (DEDICATED WORKFLOW)
      ========================================================================= */}
      {isShareVoterSlipWhatsAppModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-brand-50/60 dark:bg-brand-950/40">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-brand-600" />
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">Share Digital Voter Slip on WhatsApp</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Generates instant mobile-friendly slip</p>
                </div>
              </div>
              <button
                onClick={() => setIsShareVoterSlipWhatsAppModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-white dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              {/* Slip Card Preview */}
              <div className="p-4 bg-gradient-to-br from-slate-900 to-brand-950 text-white rounded-2xl border border-slate-700 space-y-2 shadow-md">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider block">Official Slip Card</span>
                    <h4 className="text-sm font-black text-white">{profile.fullName}</h4>
                    <span className="font-mono text-xs text-brand-200 font-bold">EPIC: {profile.epicNumber}</span>
                  </div>
                  <div className="p-2 bg-white rounded-xl text-slate-950 shrink-0">
                    <QrCode className="w-8 h-8" />
                  </div>
                </div>
                <div className="pt-2 border-t border-white/10 text-[11px] text-slate-300 flex justify-between">
                  <span>Part: {profile.partNo} • Serial: {profile.serialNo}</span>
                  <span>Booth #{profile.boothNumber}</span>
                </div>
              </div>

              {/* Message Preview */}
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  WhatsApp Text Message Preview:
                </label>
                <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800 text-[11px] text-slate-800 dark:text-slate-200 space-y-1">
                  <p>Namaste <strong>{profile.fullName}</strong> ji,</p>
                  <p>Your official Voter Slip is ready: EPIC <strong>{profile.epicNumber}</strong>, Part {profile.partNo}, Serial #{profile.serialNo}.</p>
                  <p>📍 Polling Centre: {profile.pollingStation}</p>
                  <p className="text-emerald-700 dark:text-emerald-300 font-bold">
                    Download Official Slip: https://indata-voters.in/slip/{profile.epicNumber}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsShareVoterSlipWhatsAppModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSendVoterSlipWhatsApp}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold shadow-xs"
                >
                  <Send className="w-4 h-4" />
                  <span>Deliver Slip via WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 5: CONDUCT / RECORD SURVEY
      ========================================================================= */}
      {isConductSurveyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-indigo-50/60 dark:bg-indigo-950/40">
              <div className="flex items-center gap-2">
                <FileCheckIcon className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Record Door-to-Door Field Survey</h3>
              </div>
              <button
                onClick={() => setIsConductSurveyModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-white dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSurvey} className="p-6 space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Assigned Surveyor / Karyakarta</label>
                <input
                  type="text"
                  value={newSurveyData.surveyorName}
                  onChange={e => setNewSurveyData({ ...newSurveyData, surveyorName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Key Grievance / Priority Issue</label>
                <input
                  type="text"
                  value={newSurveyData.keyIssue}
                  onChange={e => setNewSurveyData({ ...newSurveyData, keyIssue: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Opinion on Candidate</label>
                  <select
                    value={newSurveyData.opinionOnCandidate}
                    onChange={e => setNewSurveyData({ ...newSurveyData, opinionOnCandidate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  >
                    <option value="Highly positive">Highly positive</option>
                    <option value="Favorable">Favorable</option>
                    <option value="Neutral / Undecided">Neutral / Undecided</option>
                    <option value="Unfavorable">Unfavorable</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Likelihood to Vote</label>
                  <select
                    value={newSurveyData.likelihoodToVote}
                    onChange={e => setNewSurveyData({ ...newSurveyData, likelihoodToVote: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  >
                    <option value="Definite (10/10)">Definite (10/10)</option>
                    <option value="High (8-9/10)">High (8-9/10)</option>
                    <option value="Moderate (5-7/10)">Moderate (5-7/10)</option>
                    <option value="Unlikely (<5/10)">Unlikely (&lt;5/10)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Survey Remarks / Field Notes</label>
                <textarea
                  rows={2}
                  value={newSurveyData.remarks}
                  onChange={e => setNewSurveyData({ ...newSurveyData, remarks: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsConductSurveyModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-xs"
                >
                  Save Survey
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 6: CREATE GRIEVANCE TICKET
      ========================================================================= */}
      {isCreateTicketModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-rose-50/60 dark:bg-rose-950/40">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-rose-600" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Create Grievance Ticket</h3>
              </div>
              <button
                onClick={() => setIsCreateTicketModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-white dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTicket} className="p-6 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Issue Category</label>
                  <select
                    value={newTicketData.category}
                    onChange={e => setNewTicketData({ ...newTicketData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  >
                    <option value="Water Supply">Water Supply</option>
                    <option value="Roads & Infrastructure">Roads & Infrastructure</option>
                    <option value="Streetlights & Electricity">Streetlights & Electricity</option>
                    <option value="Sanitation & Drainage">Sanitation & Drainage</option>
                    <option value="Senior Citizen Pension">Senior Citizen Pension</option>
                    <option value="General Civic Inquiry">General Civic Inquiry</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Priority</label>
                  <select
                    value={newTicketData.priority}
                    onChange={e => setNewTicketData({ ...newTicketData, priority: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  >
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Assigned Karyakarta / In-charge</label>
                <input
                  type="text"
                  value={newTicketData.assignedTo}
                  onChange={e => setNewTicketData({ ...newTicketData, assignedTo: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Issue Description</label>
                <textarea
                  rows={3}
                  value={newTicketData.description}
                  onChange={e => setNewTicketData({ ...newTicketData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateTicketModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold shadow-xs"
                >
                  Create Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 7: ADD OFFICE VISIT
      ========================================================================= */}
      {isAddOfficeVisitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-amber-50/60 dark:bg-amber-950/40">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Record Constituency Office Visit</h3>
              </div>
              <button
                onClick={() => setIsAddOfficeVisitModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-white dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveOfficeVisit} className="p-6 space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Reason for Visit</label>
                <input
                  type="text"
                  value={newVisitData.reason}
                  onChange={e => setNewVisitData({ ...newVisitData, reason: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Staff In-Charge</label>
                <input
                  type="text"
                  value={newVisitData.staffName}
                  onChange={e => setNewVisitData({ ...newVisitData, staffName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Interaction Notes & Discussions</label>
                <textarea
                  rows={3}
                  value={newVisitData.notes}
                  onChange={e => setNewVisitData({ ...newVisitData, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Follow-up Target Date</label>
                <input
                  type="date"
                  value={newVisitData.followUpDate}
                  onChange={e => setNewVisitData({ ...newVisitData, followUpDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddOfficeVisitModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black shadow-xs"
                >
                  Log Visit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 8: ADD OPERATIONAL NOTE
      ========================================================================= */}
      {isAddNoteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-purple-50/60 dark:bg-purple-950/40">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Add Operational Note</h3>
              </div>
              <button
                onClick={() => setIsAddNoteModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-white dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNote} className="p-6 space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Category</label>
                <select
                  value={newNoteData.category}
                  onChange={e => setNewNoteData({ ...newNoteData, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                >
                  <option value="Strategy & Outreach">Strategy & Outreach</option>
                  <option value="Grievance Follow-up">Grievance Follow-up</option>
                  <option value="Family & Household">Family & Household</option>
                  <option value="Polling Day Mobilization">Polling Day Mobilization</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Note Content</label>
                <textarea
                  rows={4}
                  value={newNoteData.content}
                  onChange={e => setNewNoteData({ ...newNoteData, content: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddNoteModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-xs"
                >
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 9: CALL SIMULATION MODAL
      ========================================================================= */}
      {isCallModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-sm w-full border border-slate-200 dark:border-slate-800 p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto animate-pulse">
              <PhoneCall className="w-8 h-8" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Outbound Call Active</span>
              <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1">{profile.fullName}</h3>
              <p className="font-mono text-sm text-brand-600 dark:text-brand-400 font-bold">{profile.mobile}</p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
              <span className="text-xs text-slate-400 block">Call Duration</span>
              <span className="text-2xl font-mono font-black text-slate-900 dark:text-white">
                {String(Math.floor(callDuration / 60)).padStart(2, '0')}:{String(callDuration % 60).padStart(2, '0')}
              </span>
            </div>
            <button
              onClick={handleEndCall}
              className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-2xl text-xs shadow-md transition-colors"
            >
              End Call & Log Conversation
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 10: QUICK WHATSAPP OUTREACH
      ========================================================================= */}
      {isWhatsAppModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-emerald-600">
                <MessageSquare className="w-5 h-5" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Direct WhatsApp Message</h3>
              </div>
              <button onClick={() => setIsWhatsAppModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="text-xs space-y-3">
              <p className="text-slate-600 dark:text-slate-300">
                Send personal campaign message to <strong>{profile.fullName}</strong> ({profile.mobile}):
              </p>
              <textarea
                rows={3}
                defaultValue={`Namaste ${profile.fullName} ji, Thank you for supporting our campaign. We are committed to resolving lane 3 water pressure and civic concerns. Best regards, Team Adv. Vikram Patil.`}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setIsWhatsAppModalOpen(false)}
                  className="px-4 py-2 rounded-xl border text-slate-600 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setIsWhatsAppModalOpen(false);
                    showToast(`WhatsApp message sent to ${profile.mobile}!`, 'success');
                  }}
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
                >
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 11: SHARE PROFILE SUMMARY
      ========================================================================= */}
      {isShareProfileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-cyan-600">
                <Share2 className="w-5 h-5" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Share Permitted Profile Summary</h3>
              </div>
              <button onClick={() => setIsShareProfileModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="text-xs space-y-3">
              <p className="text-slate-500">
                Summary card excluding sensitive national identifiers (Aadhaar / PAN omitted):
              </p>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl font-mono text-[11px] space-y-1">
                <p><strong>{profile.fullName}</strong> | {profile.gender}, {profile.age} Yrs</p>
                <p>EPIC: {profile.epicNumber} | Part {profile.partNo} | Sr #{profile.serialNo}</p>
                <p>Booth #{profile.boothNumber} - {profile.pollingStation}</p>
                <p>Address: {profile.address}</p>
                <p>Contact: {profile.mobile}</p>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => {
                    const text = `${profile.fullName} | EPIC: ${profile.epicNumber} | Booth #${profile.boothNumber} | Mobile: ${profile.mobile}`;
                    copyToClipboard(text, 'Profile Summary');
                    setIsShareProfileModalOpen(false);
                  }}
                  className="px-5 py-2 rounded-xl bg-brand-600 text-white font-bold text-xs"
                >
                  Copy Summary Text
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 12: UPLOAD DOCUMENT
      ========================================================================= */}
      {isUploadDocModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-brand-600">
                <FileText className="w-5 h-5" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Upload Voter Document</h3>
              </div>
              <button onClick={() => setIsUploadDocModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleSaveDoc} className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Document Name</label>
                <input
                  type="text"
                  value={newDocData.name}
                  onChange={e => setNewDocData({ ...newDocData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  required
                />
              </div>
              <div>
                <label className="font-bold block mb-1">Document Classification</label>
                <select
                  value={newDocData.type}
                  onChange={e => setNewDocData({ ...newDocData, type: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                >
                  <option value="Identity Proof Verification">Identity Proof Verification</option>
                  <option value="ECI Form 8 Representation">ECI Form 8 Representation</option>
                  <option value="Official Voter Slip PDF">Official Voter Slip PDF</option>
                  <option value="Grievance Application Copy">Grievance Application Copy</option>
                </select>
              </div>
              <div className="p-4 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl text-center text-slate-400">
                <FileText className="w-8 h-8 mx-auto mb-1 text-slate-400" />
                <span>Simulated File Selected (PDF, JPG, PNG)</span>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsUploadDocModalOpen(false)}
                  className="px-4 py-2 rounded-xl border text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-600 text-white font-bold"
                >
                  Upload & Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 13: ADD CUSTOM TAG
      ========================================================================= */}
      {isAddTagModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-sm w-full border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-brand-600">
                <Tag className="w-5 h-5" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Add Classification Tag</h3>
              </div>
              <button onClick={() => setIsAddTagModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleAddTag} className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Tag Name (e.g. #KeyContact)</label>
                <input
                  type="text"
                  placeholder="#VyaparMandal"
                  value={newTagInput}
                  onChange={e => setNewTagInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddTagModalOpen(false)}
                  className="px-4 py-2 rounded-xl border text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-600 text-white font-bold"
                >
                  Add Tag
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 14: DOCUMENT PREVIEW MODAL
      ========================================================================= */}
      {selectedDocPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">{selectedDocPreview.name}</h3>
                <span className="text-xs text-slate-500">{selectedDocPreview.type}</span>
              </div>
              <button onClick={() => setSelectedDocPreview(null)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="p-8 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl text-center space-y-2 bg-slate-50 dark:bg-slate-850">
              <FileText className="w-12 h-12 text-brand-600 mx-auto" />
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Verified Electoral Artifact Preview</p>
              <p className="text-[11px] text-slate-500">
                Uploaded by {selectedDocPreview.uploadedBy || 'Admin Desk'} on {selectedDocPreview.uploadedAt}
              </p>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  showToast(`Downloaded ${selectedDocPreview.name}`, 'success');
                  setSelectedDocPreview(null);
                }}
                className="px-5 py-2 rounded-xl bg-brand-600 text-white font-bold text-xs flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Download Document</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 15: MAP LOCATION PREVIEW MODAL
      ========================================================================= */}
      {isMapModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-brand-600">
                <MapPin className="w-5 h-5" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Polling Station Location & Route</h3>
              </div>
              <button onClick={() => setIsMapModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="h-48 rounded-2xl bg-gradient-to-tr from-slate-800 via-brand-950 to-slate-900 text-white flex flex-col items-center justify-center text-center p-4 relative overflow-hidden border border-slate-700">
                <MapPin className="w-8 h-8 text-amber-400 mb-2 animate-bounce" />
                <span className="font-bold text-sm">Booth #{profile.boothNumber}</span>
                <span className="text-xs text-slate-300 max-w-xs">{profile.pollingStation}</span>
                <span className="font-mono text-[10px] text-amber-300 mt-1">Coordinates: 18.5089° N, 73.8152° E</span>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-1">
                <span className="text-slate-400 text-[11px] block">Complete Address:</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  {profile.pollingStationAddress || 'Navbharat High School Ground Floor, Hall No 4, Kothrud Depot Road, Pune 411038'}
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setIsMapModalOpen(false)}
                  className="px-4 py-2 rounded-xl border text-slate-600 text-xs font-bold"
                >
                  Close
                </button>
                <a
                  href={`https://maps.google.com/?q=18.5089,73.8152`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2 rounded-xl bg-brand-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Open in Google Maps</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper icon component
const ZapIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const FileCheckIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <path d="m9 15 2 2 4-4" />
  </svg>
);
