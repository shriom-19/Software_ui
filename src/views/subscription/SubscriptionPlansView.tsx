import React, { useState } from 'react';
import {
  CreditCard,
  Sparkles,
  Check,
  Send,
  Video,
  ExternalLink,
  ShieldCheck,
  HelpCircle,
  X,
  Layers,
  ChevronRight,
  Printer,
  Vote,
  Package,
  Minus,
  FileText,
  Clock,
  AlertCircle,
  CheckCircle2,
  Info
} from 'lucide-react';
import { MOCK_SUBSCRIPTION_PLANS } from '../../data/mockData';
import { SubscriptionPlan } from '../../types';
import { useToast } from '../../components/common/Toast';

export const SubscriptionPlansView: React.FC = () => {
  const { showToast } = useToast();
  const [activeCategory, setActiveCategory] = useState<'SOFTWARE' | 'RECHARGE' | 'EXTRA_SERVICE' | 'COMPARISON'>('SOFTWARE');
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Enquiry Modal state
  const [selectedPlanForEnquiry, setSelectedPlanForEnquiry] = useState<SubscriptionPlan | null>(null);
  const [enquiryContact, setEnquiryContact] = useState('+91 98220 99000');
  const [enquiryNotes, setEnquiryNotes] = useState('Interested in enterprise quote for Pune constituency election campaign.');

  // Selected Plan Summary Modal
  const [selectedPlanForSummary, setSelectedPlanForSummary] = useState<SubscriptionPlan | null>(null);

  // Pending Quote Modal
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  // Pending upgrade request state
  const [hasPendingUpgrade, setHasPendingUpgrade] = useState(true);

  const filteredPlans = MOCK_SUBSCRIPTION_PLANS.filter((p) => p.category === activeCategory);

  const handleOpenEnquiry = (plan: SubscriptionPlan) => {
    setSelectedPlanForEnquiry(plan);
  };

  const handleSubmitEnquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlanForEnquiry) return;

    showToast(
      `Service Enquiry logged for "${selectedPlanForEnquiry.name}". Reference: ENQ-${Math.floor(1000 + Math.random() * 9000)} (Demo state, no payment charged).`,
      'success'
    );
    setSelectedPlanForEnquiry(null);
  };

  const handleCancelPendingQuote = () => {
    setHasPendingUpgrade(false);
    setIsQuoteModalOpen(false);
    showToast('Pending quotation upgrade request #QT-PUN-2024-884 cancelled successfully.', 'info');
  };

  // Matrix Comparison Data
  const comparisonMatrix = [
    {
      category: 'Core Voter Intelligence',
      features: [
        {
          name: 'Voter Board & Electoral Roll Search',
          standard: true,
          aiPro: true,
          office6m: true,
          officeAi12m: true
        },
        {
          name: 'Central Voter 360° Profile & Family Tree',
          standard: true,
          aiPro: true,
          office6m: true,
          officeAi12m: true
        },
        {
          name: 'Demographic & Caste Clustering Matrix',
          standard: true,
          aiPro: true,
          office6m: false,
          officeAi12m: 'Basic'
        },
        {
          name: 'ECI Roll Duplicate & Cross-Ward Detection',
          standard: true,
          aiPro: true,
          office6m: false,
          officeAi12m: true
        }
      ]
    },
    {
      category: 'Field & Karyakarta Operations',
      features: [
        {
          name: 'Karyakarta Cadre Management & Allotments',
          standard: true,
          aiPro: true,
          office6m: 'Limited',
          officeAi12m: 'Limited'
        },
        {
          name: 'Live GPS Field Map & Turnout Telemetry',
          standard: true,
          aiPro: true,
          office6m: false,
          officeAi12m: false
        },
        {
          name: 'Thermal 58mm Voter Slip Print Support',
          standard: true,
          aiPro: true,
          office6m: false,
          officeAi12m: false
        },
        {
          name: 'Door-to-Door Survey Questionnaires',
          standard: true,
          aiPro: true,
          office6m: false,
          officeAi12m: false
        }
      ]
    },
    {
      category: 'Artificial Intelligence & Strategy Bot',
      features: [
        {
          name: 'Global AI Assistant & War Room Copilot',
          standard: false,
          aiPro: true,
          office6m: false,
          officeAi12m: true
        },
        {
          name: 'Historical Turnout & Swing Booth Modeling',
          standard: false,
          aiPro: true,
          office6m: false,
          officeAi12m: false
        },
        {
          name: 'AI Regional Voice Script Generator (Marathi/Hindi)',
          standard: false,
          aiPro: true,
          office6m: false,
          officeAi12m: false
        },
        {
          name: 'Vulnerability Detection in Opposition Strongholds',
          standard: false,
          aiPro: true,
          office6m: false,
          officeAi12m: false
        }
      ]
    },
    {
      category: 'Constituency Office & Grievance Governance',
      features: [
        {
          name: 'Daily Citizen Visitor Registration',
          standard: true,
          aiPro: true,
          office6m: true,
          officeAi12m: true
        },
        {
          name: 'Official Letter Generator with Candidate Letterhead',
          standard: 'Standard',
          aiPro: 'Standard',
          office6m: true,
          officeAi12m: true
        },
        {
          name: 'AI Duplicate Grievance Detection across Bastis',
          standard: false,
          aiPro: true,
          office6m: false,
          officeAi12m: true
        },
        {
          name: 'Government Department Follow-up Tracking',
          standard: 'Basic',
          aiPro: 'Basic',
          office6m: true,
          officeAi12m: true
        }
      ]
    },
    {
      category: 'Communications & Infrastructure SLA',
      features: [
        {
          name: 'WhatsApp Business API Slip Broadcasts',
          standard: 'Credit Based',
          aiPro: 'Credit Based',
          office6m: 'Credit Based',
          officeAi12m: 'Credit Based'
        },
        {
          name: 'Dedicated Cloud War Room Server & Encryption',
          standard: 'Standard Cloud',
          aiPro: 'Dedicated Cluster',
          office6m: 'Standard Cloud',
          officeAi12m: 'Dedicated Cluster'
        },
        {
          name: '24/7 Election War Room Support Engineer',
          standard: false,
          aiPro: true,
          office6m: false,
          officeAi12m: true
        }
      ]
    }
  ];

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Commercial Tier & Services
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
              Pricing Quotation Inquiries
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 mt-1">
            Subscription Plans & Campaign Recharges
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure election software tiers, WhatsApp / AI voice credits, EVM hardware demo kits, and thermal printers.
          </p>
        </div>

        {/* Demo Video Action */}
        <button
          onClick={() => setIsVideoModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors shadow-xs"
        >
          <Video className="w-4 h-4 text-amber-400" />
          <span>Watch Portal Demo Video</span>
        </button>
      </div>

      {/* Subscription Status & Pending Contract Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Active Plan Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Active Commercial License</span>
              </span>
              <span className="text-xs text-slate-400 font-semibold">Tier ID: SUB-ELEC-STD</span>
            </div>
            <h3 className="text-lg font-black text-slate-900">Election Module - Standard</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Authorized for Candidate Adv. Vikram Patil (Pune Constituency, 8 Booths, 14 Karyakartas).
            </p>

            <div className="grid grid-cols-3 gap-2 mt-4 text-center">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 block font-semibold">Validity</span>
                <span className="text-xs font-bold text-slate-800">Dec 31, 2024</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 block font-semibold">Allocated Booths</span>
                <span className="text-xs font-bold text-slate-800">8 / 8 Active</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 block font-semibold">AI Features</span>
                <span className="text-xs font-bold text-amber-600">Standard (Locked)</span>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">Commercial SLA: Enterprise Support</span>
            <button
              onClick={() => {
                const stdPlan = MOCK_SUBSCRIPTION_PLANS.find(p => p.id === 'sub-elec-std');
                if (stdPlan) setSelectedPlanForSummary(stdPlan);
              }}
              className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              <span>View License Details</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Pending Commercial Upgrade State */}
        {hasPendingUpgrade ? (
          <div className="bg-amber-50/70 p-5 rounded-2xl border-2 border-amber-300 shadow-xs flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-2">
              <Sparkles className="w-24 h-24 text-amber-200/50" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-200 text-amber-900 border border-amber-300 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-700 animate-spin" />
                  <span>Pending Super Admin Approval</span>
                </span>
                <span className="text-xs font-mono font-bold text-amber-800">Quote #QT-PUN-2024-884</span>
              </div>
              <h3 className="text-lg font-black text-slate-900">
                Upgrade: Election Module + AI Mode (Pro)
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Formal commercial agreement draft prepared on 18 Oct 2024. Waiting for Super Admin sign-off and activation.
              </p>

              <div className="bg-white/80 p-3 rounded-xl border border-amber-200 mt-3 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Requested Tier:</span>
                  <span className="font-bold text-slate-900">Election Suite + Pro AI War Room</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Includes:</span>
                  <span className="font-semibold text-slate-800">Strategy Bot, Voice Scripts, Swing Modeling</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Commercial Term:</span>
                  <span className="font-semibold text-slate-800">6 Months Enterprise Campaign License</span>
                </div>
              </div>
            </div>

            <div className="pt-3 mt-4 border-t border-amber-200/80 flex items-center justify-between gap-2">
              <button
                onClick={() => setIsQuoteModalOpen(true)}
                className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Review Draft Agreement</span>
              </button>
              <button
                onClick={handleCancelPendingQuote}
                className="text-xs text-rose-600 hover:text-rose-800 font-semibold"
              >
                Withdraw Request
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-slate-50 p-5 rounded-2xl border border-dashed border-slate-300 flex flex-col items-center justify-center text-center">
            <Sparkles className="w-8 h-8 text-slate-400 mb-2" />
            <h4 className="font-bold text-slate-700 text-sm">No Pending Subscription Requests</h4>
            <p className="text-xs text-slate-500 max-w-sm mt-1">
              Select any Pro AI software tier or hardware recharge pack below to request an official quotation.
            </p>
          </div>
        )}
      </div>

      {/* Safety Notice */}
      <div className="p-3.5 bg-slate-100 rounded-2xl border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
        <span className="flex items-center gap-2 font-medium">
          <ShieldCheck className="w-4 h-4 text-brand-600 shrink-0" />
          <span>
            Demonstration Mode: Pricing requests submit a service enquiry to Indata Commercial Desk. No live credit card transactions or payment gateways are triggered.
          </span>
        </span>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl text-xs font-semibold text-slate-700 max-w-2xl overflow-x-auto">
        <button
          onClick={() => setActiveCategory('SOFTWARE')}
          className={`flex-1 py-2 px-3 text-center rounded-xl transition-all whitespace-nowrap ${
            activeCategory === 'SOFTWARE' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'hover:text-slate-900'
          }`}
        >
          Software Subscription Plans
        </button>
        <button
          onClick={() => setActiveCategory('RECHARGE')}
          className={`flex-1 py-2 px-3 text-center rounded-xl transition-all whitespace-nowrap ${
            activeCategory === 'RECHARGE' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'hover:text-slate-900'
          }`}
        >
          Campaign Recharge Packs
        </button>
        <button
          onClick={() => setActiveCategory('EXTRA_SERVICE')}
          className={`flex-1 py-2 px-3 text-center rounded-xl transition-all whitespace-nowrap ${
            activeCategory === 'EXTRA_SERVICE' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'hover:text-slate-900'
          }`}
        >
          Hardware & Extra Services
        </button>
        <button
          onClick={() => setActiveCategory('COMPARISON')}
          className={`flex-1 py-2 px-3 text-center rounded-xl transition-all whitespace-nowrap ${
            activeCategory === 'COMPARISON' ? 'bg-white text-brand-700 shadow-xs font-extrabold' : 'hover:text-slate-900'
          }`}
        >
          Plan Comparison Matrix
        </button>
      </div>

      {/* TAB: PLAN COMPARISON MATRIX */}
      {activeCategory === 'COMPARISON' ? (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg">
                  Side-by-Side Enterprise Feature Comparison
                </h3>
                <p className="text-xs text-slate-500">
                  Detailed evaluation of Standard vs AI Pro Mode across election campaigns and constituency office modules.
                </p>
              </div>
              <button
                onClick={() => {
                  const aiPlan = MOCK_SUBSCRIPTION_PLANS.find(p => p.id === 'sub-elec-ai');
                  if (aiPlan) handleOpenEnquiry(aiPlan);
                }}
                className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs transition-colors shadow-xs flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Request AI Pro Quotation</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-700">
                    <th className="p-3.5 pl-6 font-extrabold w-1/3">Feature Capability</th>
                    <th className="p-3.5 font-bold text-center w-1/6">
                      <div>Election Standard</div>
                      <span className="text-[10px] text-emerald-600 font-semibold">(Current Active)</span>
                    </th>
                    <th className="p-3.5 font-bold text-center w-1/6 bg-brand-50/50 text-brand-900 border-x border-brand-100">
                      <div className="flex items-center justify-center gap-1">
                        <Sparkles className="w-3 h-3 text-brand-600" />
                        <span>Election + AI Mode</span>
                      </div>
                      <span className="text-[10px] text-brand-600 font-bold">(Recommended)</span>
                    </th>
                    <th className="p-3.5 font-bold text-center w-1/6">
                      <div>Office (6M)</div>
                      <span className="text-[10px] text-slate-400">Constituency</span>
                    </th>
                    <th className="p-3.5 font-bold text-center w-1/6">
                      <div>Office + AI (12M)</div>
                      <span className="text-[10px] text-slate-400">Annual</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {comparisonMatrix.map((group, gIdx) => (
                    <React.Fragment key={gIdx}>
                      <tr className="bg-slate-50 font-extrabold text-[11px] text-slate-500 uppercase tracking-wider">
                        <td colSpan={5} className="py-2.5 px-6">
                          {group.category}
                        </td>
                      </tr>
                      {group.features.map((feat, fIdx) => (
                        <tr key={fIdx} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3 px-6 text-slate-800 font-medium">{feat.name}</td>
                          
                          {/* Standard Column */}
                          <td className="py-3 px-3 text-center">
                            {feat.standard === true ? (
                              <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                            ) : feat.standard === false ? (
                              <Minus className="w-4 h-4 text-slate-300 mx-auto" />
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                                {feat.standard}
                              </span>
                            )}
                          </td>

                          {/* AI Pro Column */}
                          <td className="py-3 px-3 text-center bg-brand-50/20 border-x border-brand-100">
                            {feat.aiPro === true ? (
                              <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                              </div>
                            ) : feat.aiPro === false ? (
                              <Minus className="w-4 h-4 text-slate-300 mx-auto" />
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-100 text-brand-800">
                                {feat.aiPro}
                              </span>
                            )}
                          </td>

                          {/* Office 6M */}
                          <td className="py-3 px-3 text-center">
                            {feat.office6m === true ? (
                              <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                            ) : feat.office6m === false ? (
                              <Minus className="w-4 h-4 text-slate-300 mx-auto" />
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                                {feat.office6m}
                              </span>
                            )}
                          </td>

                          {/* Office AI 12M */}
                          <td className="py-3 px-3 text-center">
                            {feat.officeAi12m === true ? (
                              <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                            ) : feat.officeAi12m === false ? (
                              <Minus className="w-4 h-4 text-slate-300 mx-auto" />
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                                {feat.officeAi12m}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Regular Plans Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-3xl border-2 p-6 flex flex-col justify-between shadow-xs transition-all relative ${
                plan.popular ? 'border-brand-600 ring-4 ring-brand-50' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-6 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-brand-600 text-white shadow-xs">
                  Recommended Tier
                </span>
              )}

              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">{plan.name}</h3>
                    {plan.duration && <span className="text-[11px] text-slate-400 font-semibold">{plan.duration}</span>}
                  </div>
                  {plan.hasAiMode && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-600" />
                      <span>AI Mode</span>
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 mb-4 leading-relaxed">{plan.description}</p>

                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 mb-5 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 font-semibold block">Commercial Status:</span>
                    <span className="text-sm font-extrabold text-brand-700">{plan.priceNote}</span>
                  </div>
                  <button
                    onClick={() => setSelectedPlanForSummary(plan)}
                    className="text-[11px] text-brand-600 font-bold hover:underline flex items-center gap-0.5"
                  >
                    <span>Summary</span>
                    <Info className="w-3 h-3" />
                  </button>
                </div>

                {/* Feature Checklist */}
                <div className="space-y-2.5 text-xs text-slate-700 mb-6">
                  {plan.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="leading-snug">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-slate-100">
                {plan.status === 'ACTIVE' ? (
                  <div className="w-full py-2.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-center font-bold text-xs rounded-xl flex items-center justify-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Current Active Plan</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleOpenEnquiry(plan)}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs transition-colors shadow-xs flex items-center justify-center gap-2 ${
                      plan.popular
                        ? 'bg-brand-600 hover:bg-brand-700 text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                    }`}
                  >
                    <span>Request Service / Enquiry</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Selected Plan Summary Drawer/Modal */}
      {selectedPlanForSummary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-xl max-w-lg w-full border border-slate-200 overflow-hidden p-6 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase text-brand-600">Product Specification Dossier</span>
                <h3 className="font-extrabold text-slate-900 text-lg">{selectedPlanForSummary.name}</h3>
              </div>
              <button
                onClick={() => setSelectedPlanForSummary(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Service Category:</span>
                  <span className="font-bold text-slate-800">{selectedPlanForSummary.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Duration / Validity:</span>
                  <span className="font-bold text-slate-800">{selectedPlanForSummary.duration || 'Campaign Pack'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">AI Intelligence Core:</span>
                  <span className="font-bold text-slate-800">
                    {selectedPlanForSummary.hasAiMode ? 'Full AI Engine Enabled' : 'Standard Core Only'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Commercial Status:</span>
                  <span className="font-bold text-brand-700">{selectedPlanForSummary.priceNote}</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-2">Included Deliverables & Specifications:</h4>
                <div className="space-y-2">
                  {selectedPlanForSummary.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 bg-slate-50 p-2 rounded-xl border border-slate-100">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-slate-700 leading-snug">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px] flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  Hardware and extra services are deployed by Indata Field Technical Engineers within 48 hours of formal Super Admin agreement execution.
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedPlanForSummary(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const plan = selectedPlanForSummary;
                    setSelectedPlanForSummary(null);
                    handleOpenEnquiry(plan);
                  }}
                  className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl transition-colors shadow-sm"
                >
                  Proceed to Enquiry
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Review Draft Agreement Modal */}
      {isQuoteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden p-6 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-600" />
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Formal Agreement Draft</h3>
                  <span className="text-[10px] text-slate-400">Ref: QT-PUN-2024-884 (Draft v1.2)</span>
                </div>
              </div>
              <button onClick={() => setIsQuoteModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Applicant:</span>
                  <span className="font-bold text-slate-900">Adv. Vikram Patil Campaign Committee</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Constituency:</span>
                  <span className="font-semibold text-slate-800">34 - Pune Parliamentary / Kothrud</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Upgrade Service:</span>
                  <span className="font-bold text-amber-700">Election Module + AI Mode (Pro)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Target Activation:</span>
                  <span className="font-semibold text-slate-800">Within 2 hours of Super Admin Approval</span>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl p-3 bg-white space-y-1 text-[11px]">
                <p className="font-bold text-slate-800">Agreement Terms & Commercial Scope:</p>
                <p className="text-slate-600">
                  1. Unlocks AI War Room Global Chat Assistant with real-time constituency queries.
                </p>
                <p className="text-slate-600">
                  2. Enables Turnout Predictor Bot and automated swing booth vulnerability alerts.
                </p>
                <p className="text-slate-600">
                  3. Dedicated technical account representative assigned for polling day coordination.
                </p>
              </div>

              <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-[11px]">
                <p className="font-semibold">Current Commercial Status:</p>
                <p>Awaiting counter-signature from Indata State Super Administrator. No payment will be debited until final execution.</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleCancelPendingQuote}
                  className="px-3.5 py-1.5 text-rose-600 hover:bg-rose-50 font-bold rounded-xl"
                >
                  Withdraw Request
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsQuoteModalOpen(false);
                    showToast('Agreement draft acknowledged. Super Admin will contact you.', 'info');
                  }}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-xs"
                >
                  Close Draft
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enquiry Confirmation Modal */}
      {selectedPlanForEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-xl max-w-md w-full border border-slate-200 overflow-hidden p-6 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase text-brand-600">Service Request</span>
                <h3 className="font-bold text-slate-900 text-base">{selectedPlanForEnquiry.name}</h3>
              </div>
              <button onClick={() => setSelectedPlanForEnquiry(null)} className="p-1 text-slate-400 hover:text-slate-600 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitEnquiry} className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Tier:</span>
                  <span className="font-bold text-slate-800">{selectedPlanForEnquiry.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">AI Features:</span>
                  <span className="font-bold text-slate-800">{selectedPlanForEnquiry.hasAiMode ? 'Included' : 'Standard'}</span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Contact Phone (for Quotation)</label>
                <input
                  type="tel"
                  required
                  value={enquiryContact}
                  onChange={(e) => setEnquiryContact(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Campaign Requirements / Notes</label>
                <textarea
                  rows={3}
                  value={enquiryNotes}
                  onChange={(e) => setEnquiryNotes(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-[11px]">
                <span>An enquiry submission does not trigger any payment deduction or instant license activation.</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedPlanForEnquiry(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl transition-colors shadow-sm"
                >
                  Submit Service Enquiry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Demo Video Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-950 rounded-3xl shadow-2xl max-w-2xl w-full border border-slate-800 overflow-hidden text-white animate-scale-up">
            <div className="p-4 px-6 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm">Indata Candidate Portal Overview Video</h3>
              </div>
              <button onClick={() => setIsVideoModalOpen(false)} className="p-1 text-slate-400 hover:text-white rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="h-72 bg-slate-900 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-brand-600/30 border border-brand-500/50 flex items-center justify-center text-brand-400 mb-3">
                <Video className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-base text-white">Interactive Product Tour</h4>
              <p className="text-xs text-slate-400 max-w-md mt-1 mb-4">
                Full walk-through of War Room analytics, voter board search, slip thermal printing, and ground karyakarta tracking.
              </p>
              <button
                onClick={() => {
                  setIsVideoModalOpen(false);
                  showToast('Demo video playback completed.', 'info');
                }}
                className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl transition-colors"
              >
                Close Video Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
