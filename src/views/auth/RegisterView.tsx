import React, { useState } from 'react';
import {
  Check,
  ChevronRight,
  ChevronLeft,
  User,
  Building,
  Vote,
  MapPin,
  Calendar,
  Layers,
  FileCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Shield,
  AlertCircle
} from 'lucide-react';
import { useToast } from '../../components/common/Toast';

interface RegisterViewProps {
  onNavigateToLogin: () => void;
  onRegistrationComplete: () => void;
}

export const RegisterView: React.FC<RegisterViewProps> = ({
  onNavigateToLogin,
  onRegistrationComplete
}) => {
  const { showToast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isApprovedBySuperAdmin, setIsApprovedBySuperAdmin] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Account Details
    adminFullName: 'Adv. Vikram Patil',
    adminEmail: 'vikram.patil@indata-election.in',
    adminPhone: '+91 98220 99000',
    adminPassword: 'SecurePassword@2024',
    confirmPassword: 'SecurePassword@2024',

    // Step 2: Candidate & Organization
    candidateName: 'Adv. Vikram Shankarrao Patil',
    organizationOrParty: 'Rashtriya Vikas Morcha',
    partyShortCode: 'RVM',
    electionSymbol: 'Sun & Wheel',
    officeAddress: 'Shivaji Chowk, Deccan Gymkhana, Pune 411004',

    // Step 3: Election Type
    electionType: 'Lok Sabha' as 'Lok Sabha' | 'Vidhan Sabha' | 'Municipal' | 'Zilla Parishad' | 'Gram Panchayat',

    // Step 4: Election Geography (Dynamic)
    state: 'Maharashtra',
    constituency: '34 - Pune Parliamentary Constituency',
    assemblySegment: '214 - Kothrud',
    cityOrDistrict: 'Pune',
    wardNumber: 'Ward 12',
    taluka: 'Haveli',
    gramPanchayatName: '',
    estimatedBooths: 2045,

    // Step 5: Election Details
    electionDate: '2024-05-13',
    nominationFilingDate: '2024-04-25',
    campaignSlogan: 'Pune Vikas Sankalp 2024',
    targetTurnoutGoal: '72%',

    // Step 6: Data & Service Selection
    selectedModules: ['VOTER_BOARD', 'LIVE_MAP', 'WAR_ROOM', 'OFFICE_GRIEVANCE', 'AI_INTELLIGENCE'],
    needsPhysicalSlipPrinters: true,
    needsEvmDemoUnits: true,
    whatsappPackCredits: '50000',
    aiVoiceMinutes: '25000'
  });

  const steps = [
    { number: 1, label: 'Account Details', icon: User },
    { number: 2, label: 'Candidate & Party', icon: Building },
    { number: 3, label: 'Election Type', icon: Vote },
    { number: 4, label: 'Geography', icon: MapPin },
    { number: 5, label: 'Election Details', icon: Calendar },
    { number: 6, label: 'Services & Modules', icon: Layers },
    { number: 7, label: 'Review & Submit', icon: FileCheck }
  ];

  const handleNext = () => {
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    showToast('Registration submitted for Super Admin review!', 'success');
  };

  const handleSimulateApproval = () => {
    setIsApprovedBySuperAdmin(true);
    showToast('Demo: Candidate Portal approved by Super Admin!', 'success');
  };

  return (
    <div className="min-h-screen bg-slate-900 py-10 px-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-indigo-900 px-8 py-6 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950 uppercase">
                New Candidate Onboarding
              </span>
              <span className="text-xs text-brand-200">7-Step Wizard</span>
            </div>
            <h1 className="text-xl font-extrabold mt-1">Indata Candidate Portal Registration</h1>
          </div>
          <button
            onClick={onNavigateToLogin}
            className="text-xs text-brand-200 hover:text-white hover:underline font-medium"
          >
            Already have an account? Sign In
          </button>
        </div>

        {/* Step Progress Bar */}
        {!isSubmitted && (
          <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 overflow-x-auto no-scrollbar">
            <div className="flex items-center justify-between min-w-[640px]">
              {steps.map((step) => {
                const isPassed = step.number < currentStep;
                const isCurrent = step.number === currentStep;
                return (
                  <div key={step.number} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold transition-all shadow-sm ${
                          isPassed
                            ? 'bg-emerald-600 text-white'
                            : isCurrent
                            ? 'bg-brand-600 text-white ring-4 ring-brand-100'
                            : 'bg-white border border-slate-300 text-slate-500'
                        }`}
                      >
                        {isPassed ? <Check className="w-4 h-4" /> : step.number}
                      </div>
                      <span
                        className={`text-[11px] font-semibold mt-1 whitespace-nowrap ${
                          isCurrent ? 'text-brand-700' : 'text-slate-500'
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                    {step.number !== 7 && (
                      <div
                        className={`w-12 h-0.5 mx-2 -mt-4 transition-colors ${
                          isPassed ? 'bg-emerald-500' : 'bg-slate-200'
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="p-8">
          {isSubmitted ? (
            /* Submission & Pending Review State */
            <div className="text-center py-8 max-w-lg mx-auto">
              {!isApprovedBySuperAdmin ? (
                <>
                  <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-4 border border-amber-200">
                    <Clock className="w-8 h-8 animate-pulse" />
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 uppercase">
                    Status: Pending Super Admin Verification
                  </span>
                  <h2 className="text-2xl font-extrabold text-slate-900 mt-3 mb-2">
                    Application Submitted Successfully
                  </h2>
                  <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                    Your candidate portal request for <strong>{formData.candidateName}</strong> ({formData.constituency}) has been logged under reference code <strong>IND-2024-8841</strong>. Super Admin will verify election nomination eligibility and activate your war room instance within 24 hours.
                  </p>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs space-y-2 mb-6">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Candidate:</span>
                      <span className="font-bold text-slate-800">{formData.candidateName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Election:</span>
                      <span className="font-bold text-slate-800">{formData.electionType} ({formData.state})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Constituency:</span>
                      <span className="font-bold text-brand-700">{formData.constituency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Target Booths:</span>
                      <span className="font-bold text-slate-800">{formData.estimatedBooths} Booths</span>
                    </div>
                  </div>

                  {/* Demo approval simulation button */}
                  <div className="bg-brand-50 p-4 rounded-2xl border border-brand-200 mb-6">
                    <p className="text-xs text-brand-900 font-semibold mb-2">
                      ⚡ Demo Evaluation Feature
                    </p>
                    <button
                      onClick={handleSimulateApproval}
                      className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs transition-colors shadow-sm"
                    >
                      Simulate Instant Super Admin Approval
                    </button>
                  </div>

                  <button
                    onClick={onNavigateToLogin}
                    className="text-xs text-slate-500 hover:text-slate-700 font-semibold"
                  >
                    Return to Portal Login
                  </button>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4 border border-emerald-200">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 uppercase">
                    Status: Portal Approved & Provisioned
                  </span>
                  <h2 className="text-2xl font-extrabold text-slate-900 mt-3 mb-2">
                    Candidate Portal is Live!
                  </h2>
                  <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                    Super Admin has confirmed your electoral credentials. Your dedicated war room and voter analytics workspace is now ready for deployment.
                  </p>

                  <button
                    onClick={onRegistrationComplete}
                    className="w-full py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <span>Launch War Room Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          ) : (
            /* Multi-Step Forms */
            <form onSubmit={currentStep === 7 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
              {/* STEP 1: Account Details */}
              {currentStep === 1 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="border-b border-slate-100 pb-3 mb-4">
                    <h3 className="text-lg font-bold text-slate-900">Step 1: Administrator Account Details</h3>
                    <p className="text-xs text-slate-500">Provide primary credentials for Candidate / Campaign Head.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Admin Full Name</label>
                      <input
                        type="text"
                        required
                        value={formData.adminFullName}
                        onChange={(e) => setFormData({ ...formData, adminFullName: e.target.value })}
                        className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Official Email Address</label>
                      <input
                        type="email"
                        required
                        value={formData.adminEmail}
                        onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                        className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Phone (WhatsApp enabled)</label>
                      <input
                        type="tel"
                        required
                        value={formData.adminPhone}
                        onChange={(e) => setFormData({ ...formData, adminPhone: e.target.value })}
                        className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                      <input
                        type="password"
                        required
                        value={formData.adminPassword}
                        onChange={(e) => setFormData({ ...formData, adminPassword: e.target.value })}
                        className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Candidate and Organization Details */}
              {currentStep === 2 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="border-b border-slate-100 pb-3 mb-4">
                    <h3 className="text-lg font-bold text-slate-900">Step 2: Candidate & Organization Information</h3>
                    <p className="text-xs text-slate-500">Official candidate name as filed in Form 2A/2B nomination papers.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Candidate Official Name</label>
                      <input
                        type="text"
                        required
                        value={formData.candidateName}
                        onChange={(e) => setFormData({ ...formData, candidateName: e.target.value })}
                        className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Political Party / Organization</label>
                      <input
                        type="text"
                        required
                        value={formData.organizationOrParty}
                        onChange={(e) => setFormData({ ...formData, organizationOrParty: e.target.value })}
                        className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Allotted Election Symbol</label>
                      <input
                        type="text"
                        value={formData.electionSymbol}
                        onChange={(e) => setFormData({ ...formData, electionSymbol: e.target.value })}
                        className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Central Campaign Office Address</label>
                      <input
                        type="text"
                        value={formData.officeAddress}
                        onChange={(e) => setFormData({ ...formData, officeAddress: e.target.value })}
                        className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Election Type */}
              {currentStep === 3 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="border-b border-slate-100 pb-3 mb-4">
                    <h3 className="text-lg font-bold text-slate-900">Step 3: Select Election Tier</h3>
                    <p className="text-xs text-slate-500">Indata configures geographic hierarchy and voter boundaries based on this selection.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      { type: 'Lok Sabha', desc: 'Parliamentary General Elections (Multi-Assembly segments)' },
                      { type: 'Vidhan Sabha', desc: 'State Legislative Assembly Elections' },
                      { type: 'Municipal', desc: 'PMC / BMC / Municipal Corporation Wards' },
                      { type: 'Zilla Parishad', desc: 'District Council & Panchayat Samiti Gats' },
                      { type: 'Gram Panchayat', desc: 'Village level local governance wards' }
                    ].map((item) => (
                      <div
                        key={item.type}
                        onClick={() => setFormData({ ...formData, electionType: item.type as any })}
                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                          formData.electionType === item.type
                            ? 'border-brand-600 bg-brand-50/50 shadow-sm'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-sm text-slate-900">{item.type}</span>
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                            formData.electionType === item.type ? 'border-brand-600 bg-brand-600 text-white' : 'border-slate-300'
                          }`}>
                            {formData.electionType === item.type && <Check className="w-3 h-3" />}
                          </div>
                        </div>
                        <p className="text-xs text-slate-500">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 4: Election Geography (Dynamic based on Election Type) */}
              {currentStep === 4 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="border-b border-slate-100 pb-3 mb-4">
                    <h3 className="text-lg font-bold text-slate-900">Step 4: Dynamic Election Geography</h3>
                    <p className="text-xs text-slate-500">Configuring administrative units for {formData.electionType}.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">State / UT</label>
                      <input
                        type="text"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500"
                      />
                    </div>

                    {formData.electionType === 'Lok Sabha' && (
                      <>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Parliamentary Constituency</label>
                          <input
                            type="text"
                            value={formData.constituency}
                            onChange={(e) => setFormData({ ...formData, constituency: e.target.value })}
                            className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Key Assembly Segment(s)</label>
                          <input
                            type="text"
                            value={formData.assemblySegment}
                            onChange={(e) => setFormData({ ...formData, assemblySegment: e.target.value })}
                            className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500"
                          />
                        </div>
                      </>
                    )}

                    {formData.electionType === 'Vidhan Sabha' && (
                      <>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Assembly Constituency (Vidhan Sabha)</label>
                          <input
                            type="text"
                            value={formData.assemblySegment}
                            onChange={(e) => setFormData({ ...formData, assemblySegment: e.target.value })}
                            className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">District</label>
                          <input
                            type="text"
                            value={formData.cityOrDistrict}
                            onChange={(e) => setFormData({ ...formData, cityOrDistrict: e.target.value })}
                            className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500"
                          />
                        </div>
                      </>
                    )}

                    {(formData.electionType === 'Municipal' || formData.electionType === 'Zilla Parishad') && (
                      <>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">City / Municipal Corporation</label>
                          <input
                            type="text"
                            value={formData.cityOrDistrict}
                            onChange={(e) => setFormData({ ...formData, cityOrDistrict: e.target.value })}
                            className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Prabhaag / Ward Number</label>
                          <input
                            type="text"
                            value={formData.wardNumber}
                            onChange={(e) => setFormData({ ...formData, wardNumber: e.target.value })}
                            className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500"
                          />
                        </div>
                      </>
                    )}

                    {formData.electionType === 'Gram Panchayat' && (
                      <>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Taluka / Block</label>
                          <input
                            type="text"
                            value={formData.taluka}
                            onChange={(e) => setFormData({ ...formData, taluka: e.target.value })}
                            className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Gram Panchayat Name</label>
                          <input
                            type="text"
                            value={formData.gramPanchayatName || 'Shivane Gram Panchayat'}
                            onChange={(e) => setFormData({ ...formData, gramPanchayatName: e.target.value })}
                            className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500"
                          />
                        </div>
                      </>
                    )}

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Estimated Polling Booths</label>
                      <input
                        type="number"
                        value={formData.estimatedBooths}
                        onChange={(e) => setFormData({ ...formData, estimatedBooths: parseInt(e.target.value) || 0 })}
                        className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: Election Details */}
              {currentStep === 5 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="border-b border-slate-100 pb-3 mb-4">
                    <h3 className="text-lg font-bold text-slate-900">Step 5: Election Schedule & Campaign Goals</h3>
                    <p className="text-xs text-slate-500">Key milestones and target metrics.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Official Polling Date</label>
                      <input
                        type="date"
                        value={formData.electionDate}
                        onChange={(e) => setFormData({ ...formData, electionDate: e.target.value })}
                        className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Nomination Filing Date</label>
                      <input
                        type="date"
                        value={formData.nominationFilingDate}
                        onChange={(e) => setFormData({ ...formData, nominationFilingDate: e.target.value })}
                        className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Campaign Slogan / Motto</label>
                      <input
                        type="text"
                        value={formData.campaignSlogan}
                        onChange={(e) => setFormData({ ...formData, campaignSlogan: e.target.value })}
                        className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Target Voter Turnout (%)</label>
                      <input
                        type="text"
                        value={formData.targetTurnoutGoal}
                        onChange={(e) => setFormData({ ...formData, targetTurnoutGoal: e.target.value })}
                        className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 6: Data and Service Selection */}
              {currentStep === 6 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="border-b border-slate-100 pb-3 mb-4">
                    <h3 className="text-lg font-bold text-slate-900">Step 6: Data & Service Selection</h3>
                    <p className="text-xs text-slate-500">Configure portal modules, outreach credits, and hardware demo kits.</p>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-slate-800">Software Modules</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { id: 'VOTER_BOARD', name: 'Total Voters & Central Voter Profile' },
                        { id: 'LIVE_MAP', name: 'Interactive Live Field Map with Karyakarta GPS' },
                        { id: 'WAR_ROOM', name: 'War Room Operational Command Dashboard' },
                        { id: 'OFFICE_GRIEVANCE', name: 'Office Grievance & Visitor Registration' },
                        { id: 'AI_INTELLIGENCE', name: 'Global AI Intelligence & Strategy Bot' }
                      ].map((mod) => (
                        <label key={mod.id} className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.selectedModules.includes(mod.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData({ ...formData, selectedModules: [...formData.selectedModules, mod.id] });
                              } else {
                                setFormData({ ...formData, selectedModules: formData.selectedModules.filter(m => m !== mod.id) });
                              }
                            }}
                            className="rounded text-brand-600 focus:ring-brand-500"
                          />
                          <span className="text-xs font-medium text-slate-700">{mod.name}</span>
                        </label>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-slate-100">
                      <label className="block text-xs font-bold text-slate-800 mb-2">Hardware & Extra Services</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <label className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.needsPhysicalSlipPrinters}
                            onChange={(e) => setFormData({ ...formData, needsPhysicalSlipPrinters: e.target.checked })}
                            className="rounded text-brand-600 focus:ring-brand-500"
                          />
                          <span className="text-xs font-medium text-slate-700">Bluetooth Thermal Voter Slip Printers (Pack of 10)</span>
                        </label>
                        <label className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.needsEvmDemoUnits}
                            onChange={(e) => setFormData({ ...formData, needsEvmDemoUnits: e.target.checked })}
                            className="rounded text-brand-600 focus:ring-brand-500"
                          />
                          <span className="text-xs font-medium text-slate-700">Interactive EVM + VVPAT Physical Demo Units</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 7: Review and Submit */}
              {currentStep === 7 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="border-b border-slate-100 pb-3 mb-4">
                    <h3 className="text-lg font-bold text-slate-900">Step 7: Final Review & Submission</h3>
                    <p className="text-xs text-slate-500">Please review all submitted information before dispatching to Super Admin.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Candidate & Organization:</span>
                      <p className="font-bold text-slate-800 text-sm mt-0.5">{formData.candidateName}</p>
                      <p className="text-brand-600 font-medium">{formData.organizationOrParty} ({formData.partyShortCode})</p>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Admin Contact:</span>
                      <p className="font-bold text-slate-800 text-sm mt-0.5">{formData.adminFullName}</p>
                      <p className="text-slate-600">{formData.adminEmail} • {formData.adminPhone}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Election Tier & Geography:</span>
                      <p className="font-bold text-slate-800 mt-0.5">{formData.electionType} - {formData.constituency}</p>
                      <p className="text-slate-600">State: {formData.state} • Approx {formData.estimatedBooths} Booths</p>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Selected Services:</span>
                      <p className="font-bold text-slate-800 mt-0.5">{formData.selectedModules.length} Software Modules</p>
                      <p className="text-slate-600">EVM Demo: {formData.needsEvmDemoUnits ? 'Yes' : 'No'} • Slip Printers: {formData.needsPhysicalSlipPrinters ? 'Yes' : 'No'}</p>
                    </div>
                  </div>

                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
                    <Shield className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>
                      Submission will trigger Super Admin verification. You will be provided demo evaluation access immediately.
                    </span>
                  </div>
                </div>
              )}

              {/* Navigation Controls */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-6">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous Step</span>
                  </button>
                ) : (
                  <div></div>
                )}

                {currentStep < 7 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-all shadow-md shadow-brand-600/20"
                  >
                    <span>Next: {steps[currentStep].label}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20"
                  >
                    <FileCheck className="w-4 h-4" />
                    <span>Submit Candidate Registration</span>
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
