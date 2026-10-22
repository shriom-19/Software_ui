import React, { useState } from 'react';
import {
  Megaphone,
  Plus,
  MessageSquare,
  PhoneCall,
  Mail,
  Send,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Play,
  Pause,
  RotateCcw,
  Users,
  ChevronRight,
  ChevronLeft,
  X,
  CreditCard,
  Sparkles,
  Eye,
  FileText,
  Check,
  Layers,
  ShieldCheck,
  AlertCircle,
  BarChart2,
  Phone,
  UserCheck,
  Search
} from 'lucide-react';
import { MOCK_CAMPAIGNS, MOCK_BOOTHS, MOCK_VOTERS } from '../../data/mockData';
import { Campaign, Voter } from '../../types';
import { useToast } from '../../components/common/Toast';

export const CampaignControlView: React.FC = () => {
  const { showToast } = useToast();
  const [campaigns, setCampaigns] = useState<Campaign[]>(MOCK_CAMPAIGNS);
  const [workspaceTab, setWorkspaceTab] = useState<'BROADCASTS' | 'TEMPLATES' | 'INDIVIDUAL' | 'BILLING'>('BROADCASTS');
  const [activeChannelTab, setActiveChannelTab] = useState<string>('ALL');

  // Selected Campaign for Detailed Delivery & Error Inspection
  const [selectedCampaignForStats, setSelectedCampaignForStats] = useState<Campaign | null>(null);

  // Recharge Modal State
  const [isRechargeModalOpen, setIsRechargeModalOpen] = useState(false);
  const [rechargePackName, setRechargePackName] = useState('50,000 WhatsApp Business Credits');

  // Individual 1-to-1 Dispatch Form State
  const [individualChannel, setIndividualChannel] = useState<'WHATSAPP' | 'SMS'>('WHATSAPP');
  const [recipientSearch, setRecipientSearch] = useState('');
  const [selectedVoterRecipient, setSelectedVoterRecipient] = useState<Voter | null>(MOCK_VOTERS[0]);
  const [individualCustomPhone, setIndividualCustomPhone] = useState(MOCK_VOTERS[0]?.mobile || '+91 98220 12345');
  const [individualMessage, setIndividualMessage] = useState(
    'Namaskar {Name} ji, this is a direct message from Adv. Vikram Patil election office. Polling station: Booth #{Booth}. Reply for any assistance.'
  );

  // Wizard Modal State
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);

  // Wizard form state
  const [channel, setChannel] = useState<'WHATSAPP' | 'SMS' | 'AI_VOICE' | 'BULK'>('WHATSAPP');
  const [campaignName, setCampaignName] = useState('');
  const [targetAudience, setTargetAudience] = useState('All Verified Supporters in Kothrud');
  const [selectedBooths, setSelectedBooths] = useState<number[]>([101, 102]);
  const [messageTemplate, setMessageTemplate] = useState(
    'Namaskar {Name} ji! Here is your official voter slip for Booth #{Booth}. Vote for change and development on Election Day!'
  );
  const [scheduledDate, setScheduledDate] = useState('2024-04-20 10:00 AM');
  const [recipientCount, setRecipientCount] = useState(4500);

  // Filtered campaigns
  const filteredCampaigns = campaigns.filter(
    (c) => activeChannelTab === 'ALL' || c.channel === activeChannelTab
  );

  const handleToggleStatus = (id: string) => {
    setCampaigns((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const newStatus = c.status === 'RUNNING' ? 'PAUSED' : 'RUNNING';
          showToast(`Campaign ${c.name} is now ${newStatus}. (Simulated)`, 'info');
          return { ...c, status: newStatus as any };
        }
        return c;
      })
    );
  };

  const handleStartWizard = () => {
    setWizardStep(1);
    setCampaignName('Pune Development Appeal - Phase 2');
    setIsWizardOpen(true);
  };

  const handleCreateCampaign = () => {
    const newCamp: Campaign = {
      id: `cmp-${Date.now().toString().slice(-4)}`,
      name: campaignName || 'Custom Broadcast Campaign',
      channel,
      targetAudience,
      recipientCount,
      deliveredCount: 0,
      readCount: 0,
      status: 'SCHEDULED',
      scheduledTime: scheduledDate,
      createdDate: '2024-04-18',
      messageTemplate,
      estimatedCostCredits: recipientCount
    };

    setCampaigns([newCamp, ...campaigns]);
    setIsWizardOpen(false);
    showToast(
      `Campaign "${newCamp.name}" scheduled successfully (Demo Simulation). No live SMS or calls placed.`,
      'success'
    );
  };

  const handleSendIndividual = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(
      `Test 1-to-1 ${individualChannel} message dispatched to ${individualCustomPhone} (Simulation - no real charges).`,
      'success'
    );
  };

  const handleRechargeRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setIsRechargeModalOpen(false);
    showToast(`Campaign credit top-up request logged for ${rechargePackName}. Sales desk notified.`, 'success');
  };

  // Pre-approved message templates
  const PRESET_TEMPLATES = [
    {
      id: 'tpl-1',
      title: 'Official Voter Slip Media Push',
      channel: 'WHATSAPP',
      dltId: 'DLT-WA-881204',
      body: 'Namaskar {Name} ji! Here is your official voter slip for Booth #{Booth} ({PollingStation}). Serial #{SerialNo}. Polling date: May 13. Please cast your valuable vote for development!',
      category: 'Voter Information'
    },
    {
      id: 'tpl-2',
      title: 'Election Day Morning Turnout Push',
      channel: 'SMS',
      dltId: 'DLT-SMS-339011',
      body: 'Urgent: Voting has commenced at {PollingStation} (Booth #{Booth}). Carry your EPIC {EPIC} or Aadhaar card. Polling closes at 6:00 PM. - Adv. Vikram Patil',
      category: 'Turnout Mobilization'
    },
    {
      id: 'tpl-3',
      title: 'Marathi Regional Voice Greeting',
      channel: 'AI_VOICE',
      dltId: 'IVR-VOICE-102',
      body: 'नमस्कार {Name} जी, मी विक्रम पाटील बोलतोय. आपल्या कोथरूड आणि पुणे शहराच्या विकासासाठी आपले मत अत्यंत महत्त्वाचे आहे...',
      category: 'Audio Broadcast'
    },
    {
      id: 'tpl-4',
      title: 'Karyakarta Booth Assembly Alert',
      channel: 'BULK',
      dltId: 'INT-CADRE-09',
      body: 'Attention Karyakartas: Booth #{Booth} reporting 42% turnout at 1:00 PM. Mobilize apartment door-to-door follow-up squads immediately.',
      category: 'Workforce Alert'
    }
  ];

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Outreach Command
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
              Multi-Channel Broadcast
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 mt-1">
            Campaign Control & Broadcast Wizard
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure automated WhatsApp voter slip pushes, SMS drives, AI voice calls, 1-to-1 dispatches, and credit recharge.
          </p>
        </div>

        <button
          onClick={handleStartWizard}
          className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create Campaign Wizard</span>
        </button>
      </div>

      {/* Safety Notice Banner */}
      <div className="bg-slate-900 text-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shrink-0">
            <AlertTriangle className="w-5 h-5 text-slate-900" />
          </div>
          <div>
            <span className="font-bold text-white block">ECI Demonstration Mode Active</span>
            <span className="text-slate-400 text-[11px]">
              Campaign execution is safely simulated. Real message delivery or outbound telecalling requires verified Meta WhatsApp Business & DLT telecom registration.
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 shrink-0">
          <CreditCard className="w-4 h-4 text-emerald-400" />
          <span className="font-mono text-emerald-300 font-bold">Balance: 124,500 Credits</span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl text-xs font-bold text-slate-700 max-w-2xl">
        <button
          onClick={() => setWorkspaceTab('BROADCASTS')}
          className={`flex-1 py-2 text-center rounded-xl transition-all ${
            workspaceTab === 'BROADCASTS' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
          }`}
        >
          Campaign Broadcasts ({campaigns.length})
        </button>
        <button
          onClick={() => setWorkspaceTab('TEMPLATES')}
          className={`flex-1 py-2 text-center rounded-xl transition-all ${
            workspaceTab === 'TEMPLATES' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
          }`}
        >
          Templates Library ({PRESET_TEMPLATES.length})
        </button>
        <button
          onClick={() => setWorkspaceTab('INDIVIDUAL')}
          className={`flex-1 py-2 text-center rounded-xl transition-all ${
            workspaceTab === 'INDIVIDUAL' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
          }`}
        >
          1-to-1 Communication
        </button>
        <button
          onClick={() => setWorkspaceTab('BILLING')}
          className={`flex-1 py-2 text-center rounded-xl transition-all ${
            workspaceTab === 'BILLING' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
          }`}
        >
          Recharge & Billing
        </button>
      </div>

      {/* TAB 1: CAMPAIGN BROADCASTS */}
      {workspaceTab === 'BROADCASTS' && (
        <div className="space-y-4 animate-fade-in">
          {/* Channel Filters */}
          <div className="flex flex-wrap items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs">
            {[
              { id: 'ALL', label: 'All Channels' },
              { id: 'WHATSAPP', label: 'WhatsApp Broadcasts' },
              { id: 'SMS', label: 'SMS Drives' },
              { id: 'AI_VOICE', label: 'AI Voice Calling' },
              { id: 'BULK', label: 'Bulk Mobilization' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveChannelTab(tab.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeChannelTab === tab.id
                    ? 'bg-brand-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Campaigns Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Campaign Name & ID</th>
                    <th className="py-3 px-4">Channel</th>
                    <th className="py-3 px-4">Target Audience</th>
                    <th className="py-3 px-4">Volume (Sent / Deliv / Read)</th>
                    <th className="py-3 px-4">Scheduled Time</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredCampaigns.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900 block">{c.name}</span>
                        <span className="font-mono text-[10px] text-slate-400">{c.id}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-slate-100 text-slate-800">
                          {c.channel}
                        </span>
                      </td>
                      <td className="py-3 px-4 max-w-xs truncate">{c.targetAudience}</td>
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          <span className="font-bold text-slate-900 block">
                            {c.deliveredCount.toLocaleString()} / {c.recipientCount.toLocaleString()}
                          </span>
                          <div className="w-24 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-emerald-500 h-full rounded-full"
                              style={{
                                width: `${c.recipientCount ? (c.deliveredCount / c.recipientCount) * 100 : 0}%`
                              }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium text-slate-800">{c.scheduledTime}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          c.status === 'RUNNING'
                            ? 'bg-emerald-100 text-emerald-800'
                            : c.status === 'COMPLETED'
                            ? 'bg-blue-100 text-blue-800'
                            : c.status === 'SCHEDULED'
                            ? 'bg-purple-100 text-purple-800'
                            : c.status === 'PAUSED'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedCampaignForStats(c)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-brand-50 text-slate-700 hover:text-brand-700 font-bold rounded-lg text-xs transition-colors"
                            title="Inspect Execution Stats & Error Logs"
                          >
                            Stats & Errors
                          </button>
                          <button
                            onClick={() => handleToggleStatus(c.id)}
                            className="px-2.5 py-1 bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold rounded-lg text-xs transition-colors"
                          >
                            {c.status === 'RUNNING' ? 'Pause' : 'Resume'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TEMPLATES LIBRARY */}
      {workspaceTab === 'TEMPLATES' && (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Pre-Approved Telecom & Meta DLT Templates</h3>
              <p className="text-xs text-slate-500">Compliant templates ready for broadcast with dynamic candidate variables.</p>
            </div>
            <span className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
              100% TRAI DLT Compliant
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PRESET_TEMPLATES.map((tpl) => (
              <div key={tpl.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                    {tpl.channel} • {tpl.category}
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">{tpl.dltId}</span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm">{tpl.title}</h4>
                <p className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 leading-relaxed font-sans">
                  "{tpl.body}"
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <span className="text-[11px] text-slate-400">Merge tags: {'{Name}'}, {'{Booth}'}, {'{PollingStation}'}</span>
                  <button
                    onClick={() => {
                      setMessageTemplate(tpl.body);
                      setChannel(tpl.channel as any);
                      setIsWizardOpen(true);
                      setWizardStep(3);
                      showToast(`Template "${tpl.title}" loaded into campaign composer.`, 'info');
                    }}
                    className="px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs transition-colors"
                  >
                    Use in Campaign
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: INDIVIDUAL 1-TO-1 DISPATCH */}
      {workspaceTab === 'INDIVIDUAL' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs max-w-2xl mx-auto space-y-5 animate-fade-in text-xs">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-base">Direct Individual Outreach Dispatch</h3>
            <p className="text-slate-500 mt-0.5">Send a test or direct personalized outreach to a single citizen or team member.</p>
          </div>

          <form onSubmit={handleSendIndividual} className="space-y-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Select Channel</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setIndividualChannel('WHATSAPP')}
                  className={`p-3 rounded-xl border-2 text-center font-bold ${
                    individualChannel === 'WHATSAPP' ? 'border-brand-600 bg-brand-50 text-brand-900' : 'border-slate-200 text-slate-600'
                  }`}
                >
                  WhatsApp Single Message
                </button>
                <button
                  type="button"
                  onClick={() => setIndividualChannel('SMS')}
                  className={`p-3 rounded-xl border-2 text-center font-bold ${
                    individualChannel === 'SMS' ? 'border-brand-600 bg-brand-50 text-brand-900' : 'border-slate-200 text-slate-600'
                  }`}
                >
                  Direct SMS Alert
                </button>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Target Recipient Mobile Phone</label>
              <input
                type="tel"
                required
                value={individualCustomPhone}
                onChange={(e) => setIndividualCustomPhone(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Personalized Message Body</label>
              <textarea
                rows={4}
                required
                value={individualMessage}
                onChange={(e) => setIndividualMessage(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 font-sans"
              />
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-slate-600">
              <span className="font-bold block text-slate-800 text-[11px]">Preview Output:</span>
              <p className="italic text-[11px]">"{individualMessage.replace('{Name}', 'Sunita Deshmukh').replace('{Booth}', '101')}"</p>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-[11px]">
              <span>Demonstration Sandbox: Clicking dispatch logs a simulated event. No real telecom charges will occur.</span>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Dispatch Safe Simulated Message</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 4: RECHARGE & BILLING */}
      {workspaceTab === 'BILLING' && (
        <div className="space-y-6 animate-fade-in">
          {/* Credit Balances */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase">WhatsApp Broadcast Balance</span>
              <p className="text-2xl font-black text-slate-900 mt-1">45,680</p>
              <span className="text-xs text-emerald-600 font-semibold">Credits Available</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase">High-Speed SMS Credits</span>
              <p className="text-2xl font-black text-slate-900 mt-1">68,400</p>
              <span className="text-xs text-blue-600 font-semibold">Telecom DLT Active</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase">AI Voice Minutes</span>
              <p className="text-2xl font-black text-slate-900 mt-1">10,420</p>
              <span className="text-xs text-purple-600 font-semibold">Minutes Remaining</span>
            </div>
          </div>

          {/* Top-up Packages Grid */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Campaign Outreach Recharge Packs</h3>
                <p className="text-xs text-slate-500">Request bulk message bundles for constituency broadcast drives.</p>
              </div>
              <button
                onClick={() => setIsRechargeModalOpen(true)}
                className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs transition-colors"
              >
                Request Custom Credit Quote
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: 'WhatsApp Pack - 50k', credits: '50,000 Messages', validity: 'Full Election Cycle', note: 'Quotation Placeholder' },
                { name: 'Bulk SMS Drive - 100k', credits: '100,000 DLT SMS', validity: 'Full Election Cycle', note: 'Quotation Placeholder' },
                { name: 'AI Voice Calling - 25k Min', credits: '25,000 Regional Minutes', validity: 'Full Election Cycle', note: 'Quotation Placeholder' }
              ].map((pack, idx) => (
                <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                  <h4 className="font-bold text-slate-900 text-sm">{pack.name}</h4>
                  <p className="text-brand-700 font-bold">{pack.credits}</p>
                  <p className="text-slate-500 text-[11px]">Validity: {pack.validity}</p>
                  <p className="text-slate-400 text-[10px]">{pack.note}</p>
                  <button
                    onClick={() => {
                      setRechargePackName(pack.name);
                      setIsRechargeModalOpen(true);
                    }}
                    className="w-full mt-2 py-2 bg-white hover:bg-brand-50 text-brand-700 border border-brand-200 font-bold rounded-xl text-xs transition-colors"
                  >
                    Request Top-Up
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Execution Stats & Error Inspector Modal */}
      {selectedCampaignForStats && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden p-6 animate-scale-up space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="font-mono text-[10px] text-brand-600 font-bold">{selectedCampaignForStats.id}</span>
                <h3 className="font-bold text-slate-900 text-base">{selectedCampaignForStats.name}</h3>
              </div>
              <button onClick={() => setSelectedCampaignForStats(null)} className="p-1 text-slate-400 hover:text-slate-600 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Funnel Metrics */}
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">Queued</span>
                <span className="text-base font-black text-slate-900 mt-0.5 block">{selectedCampaignForStats.recipientCount.toLocaleString()}</span>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <span className="text-[10px] text-emerald-700 font-semibold block uppercase">Delivered</span>
                <span className="text-base font-black text-emerald-900 mt-0.5 block">{selectedCampaignForStats.deliveredCount.toLocaleString()}</span>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                <span className="text-[10px] text-blue-700 font-semibold block uppercase">Read Rate</span>
                <span className="text-base font-black text-blue-900 mt-0.5 block">72.4%</span>
              </div>
              <div className="p-3 bg-rose-50 rounded-xl border border-rose-200">
                <span className="text-[10px] text-rose-700 font-semibold block uppercase">Failed / Bounce</span>
                <span className="text-base font-black text-rose-900 mt-0.5 block">3.8%</span>
              </div>
            </div>

            {/* Error Diagnostics Table */}
            <div>
              <span className="font-bold text-slate-800 block mb-2">Delivery Error Log & Diagnostics</span>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {[
                  { reason: 'Handset unreachable / Switched off', count: 112, code: 'ERR_TELECOM_UNREACHABLE', sample: '+91 98220 44***' },
                  { reason: 'Invalid Indian mobile number format', count: 28, code: 'ERR_INVALID_MSISDN', sample: '+91 00000 00***' },
                  { reason: 'TRAI silent hours hold policy (10 PM - 7 AM)', count: 18, code: 'ERR_TRAI_SILENT_HOURS', sample: '+91 98909 11***' }
                ].map((err, i) => (
                  <div key={i} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-[11px]">
                    <div>
                      <span className="font-semibold text-slate-800 block">{err.reason}</span>
                      <span className="font-mono text-[10px] text-slate-400">{err.code} • Sample: {err.sample}</span>
                    </div>
                    <span className="font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                      {err.count} records
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 bg-slate-100 rounded-xl text-slate-600 text-[11px]">
              <p>Delivery telemetry synchronized from verified Meta WhatsApp Business Cloud Webhook.</p>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedCampaignForStats(null)}
                className="px-4 py-2 bg-slate-900 text-white font-bold rounded-xl text-xs"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Request Recharge Pack Modal */}
      {isRechargeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-xl max-w-md w-full border border-slate-200 overflow-hidden p-6 animate-scale-up space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-brand-600 uppercase">Credit Top-Up</span>
                <h3 className="font-bold text-slate-900 text-base">Request Campaign Credits</h3>
              </div>
              <button onClick={() => setIsRechargeModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRechargeRequest} className="space-y-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Credit Package</label>
                <select
                  value={rechargePackName}
                  onChange={(e) => setRechargePackName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 font-medium"
                >
                  <option value="50,000 WhatsApp Business Credits">50,000 WhatsApp Business Credits</option>
                  <option value="100,000 DLT High-Speed SMS">100,000 DLT High-Speed SMS</option>
                  <option value="25,000 AI Voice Outreach Minutes">25,000 AI Voice Outreach Minutes</option>
                  <option value="Enterprise Multi-Channel Campaign Pack">Enterprise Multi-Channel Campaign Pack</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Authorized Contact Phone</label>
                <input
                  type="tel"
                  defaultValue="+91 98220 99000"
                  required
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-[11px]">
                <span>Demonstration State: Submitting request logs an enquiry for sales quotation. No live payment gateway triggered.</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsRechargeModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl transition-colors shadow-sm"
                >
                  Submit Top-Up Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Campaign Creation Wizard Modal (6 steps) */}
      {isWizardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-scale-up">
            {/* Wizard Header */}
            <div className="p-5 px-6 bg-gradient-to-r from-slate-900 to-brand-900 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                  Step {wizardStep} of 6
                </span>
                <h3 className="font-bold text-lg">Create Campaign Broadcast</h3>
              </div>
              <button onClick={() => setIsWizardOpen(false)} className="p-1.5 text-slate-400 hover:text-white rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Wizard Step Progress Pills */}
            <div className="bg-slate-50 border-b border-slate-200 p-3 px-6 flex items-center justify-between text-xs">
              {['Channel', 'Audience', 'Content', 'Schedule', 'Preview', 'Confirm'].map((st, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                    wizardStep === i + 1
                      ? 'bg-brand-600 text-white'
                      : wizardStep > i + 1
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}>
                    {i + 1}
                  </span>
                  <span className={`hidden sm:inline font-semibold ${wizardStep === i + 1 ? 'text-brand-700' : 'text-slate-400'}`}>
                    {st}
                  </span>
                </div>
              ))}
            </div>

            {/* Step Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
              {wizardStep === 1 && (
                <div className="space-y-3">
                  <h4 className="font-bold text-sm text-slate-900">Step 1: Choose Broadcast Delivery Channel</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'WHATSAPP', name: 'WhatsApp Media Message', desc: 'Deliver voter slips with image & QR code' },
                      { id: 'SMS', name: 'High-Priority SMS', desc: 'Fast text alerts via Telecom DLT route' },
                      { id: 'AI_VOICE', name: 'AI Voice Telecall', desc: 'Automated interactive candidate audio message' },
                      { id: 'BULK', name: 'Bulk Field Broadcast', desc: 'Karyakarta mass dispatch notification' }
                    ].map((item) => (
                      <div
                        key={item.id}
                        onClick={() => setChannel(item.id as any)}
                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                          channel === item.id ? 'border-brand-600 bg-brand-50/50 shadow-xs' : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <span className="font-bold text-slate-900 block text-sm">{item.name}</span>
                        <p className="text-slate-500 mt-1">{item.desc}</p>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2">
                    <label className="block font-semibold text-slate-700 mb-1">Campaign Title</label>
                    <input
                      type="text"
                      value={campaignName}
                      onChange={(e) => setCampaignName(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>
              )}

              {wizardStep === 2 && (
                <div className="space-y-3">
                  <h4 className="font-bold text-sm text-slate-900">Step 2: Target Audience & Booth Filtering</h4>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Target Segment Description</label>
                    <input
                      type="text"
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1.5">Filter by Booths</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {MOCK_BOOTHS.map((b) => (
                        <div
                          key={b.boothNumber}
                          onClick={() => {
                            setSelectedBooths(prev =>
                              prev.includes(b.boothNumber)
                                ? prev.filter(x => x !== b.boothNumber)
                                : [...prev, b.boothNumber]
                            );
                          }}
                          className={`p-2.5 rounded-xl border text-center cursor-pointer ${
                            selectedBooths.includes(b.boothNumber)
                              ? 'bg-brand-50 border-brand-500 text-brand-900 font-bold'
                              : 'bg-slate-50 border-slate-200 text-slate-600'
                          }`}
                        >
                          <span>Booth #{b.boothNumber}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Recipient Count (Demo estimate)</label>
                    <input
                      type="number"
                      value={recipientCount}
                      onChange={(e) => setRecipientCount(parseInt(e.target.value) || 0)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>
              )}

              {wizardStep === 3 && (
                <div className="space-y-3">
                  <h4 className="font-bold text-sm text-slate-900">Step 3: Message Content & Merge Variables</h4>
                  <p className="text-slate-500">Insert tags like <code className="bg-slate-100 px-1 py-0.5 rounded">{'{Name}'}</code> and <code className="bg-slate-100 px-1 py-0.5 rounded">{'{Booth}'}</code>.</p>
                  <textarea
                    rows={4}
                    value={messageTemplate}
                    onChange={(e) => setMessageTemplate(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-sans focus:ring-2 focus:ring-brand-500"
                  />
                  <div className="p-3 bg-slate-100 rounded-xl text-slate-600">
                    <span className="font-bold text-slate-800 block mb-1">Preview with sample voter:</span>
                    <p className="italic">"{messageTemplate.replace('{Name}', 'Sunita Deshmukh').replace('{Booth}', '101')}"</p>
                  </div>
                </div>
              )}

              {wizardStep === 4 && (
                <div className="space-y-3">
                  <h4 className="font-bold text-sm text-slate-900">Step 4: Dispatch Schedule & Rate Limiting</h4>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Scheduled Dispatch Time</label>
                    <input
                      type="text"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-800">
                    <span>Note: Campaigns adhere to TRAI / ECI silent-hour policies (No outreach between 10:00 PM and 7:00 AM).</span>
                  </div>
                </div>
              )}

              {wizardStep === 5 && (
                <div className="space-y-3">
                  <h4 className="font-bold text-sm text-slate-900">Step 5: Pre-Flight Campaign Inspection</h4>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Campaign Name:</span>
                      <span className="font-bold text-slate-900">{campaignName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Channel:</span>
                      <span className="font-bold text-brand-700">{channel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Audience:</span>
                      <span className="font-bold text-slate-800">{targetAudience}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Total Recipients:</span>
                      <span className="font-bold text-slate-900">{recipientCount.toLocaleString()} Voters</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Estimated Cost:</span>
                      <span className="font-bold text-emerald-700">{recipientCount.toLocaleString()} Credits</span>
                    </div>
                  </div>
                </div>
              )}

              {wizardStep === 6 && (
                <div className="text-center py-4 space-y-3">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-base text-slate-900">Ready to Schedule Simulated Broadcast</h4>
                  <p className="text-slate-600 max-w-sm mx-auto">
                    Clicking Confirm will register this broadcast in your Campaign Control board. In this demonstration mode, simulated metrics will update over time.
                  </p>
                </div>
              )}
            </div>

            {/* Wizard Footer Controls */}
            <div className="p-4 px-6 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              {wizardStep > 1 ? (
                <button
                  type="button"
                  onClick={() => setWizardStep(wizardStep - 1)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-700 font-semibold hover:bg-slate-100 text-xs flex items-center gap-1.5"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>
              ) : (
                <div></div>
              )}

              {wizardStep < 6 ? (
                <button
                  type="button"
                  onClick={() => setWizardStep(wizardStep + 1)}
                  className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm"
                >
                  <span>Next Step</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleCreateCampaign}
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md"
                >
                  <Send className="w-4 h-4" />
                  <span>Confirm & Launch Campaign</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
