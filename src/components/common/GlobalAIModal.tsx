import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Sparkles,
  X,
  Send,
  Lock,
  Unlock,
  Zap,
  Bot,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Maximize2,
  Minimize2,
  Plus,
  Search,
  MessageSquare,
  Paperclip,
  Download,
  FileSpreadsheet,
  FileText,
  PieChart,
  BarChart2,
  Table,
  CheckCircle2,
  AlertCircle,
  Clock,
  ChevronDown,
  Trash2,
  Edit2,
  CornerDownLeft,
  Users,
  Vote,
  ExternalLink,
  Square,
  AlertTriangle,
  Check,
  PhoneCall
} from 'lucide-react';
import { CURRENT_ELECTION_CONTEXT, MOCK_BOOTHS } from '../../data/mockData';
import { useToast } from './Toast';

interface GlobalAIModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAiLocked: boolean;
  setIsAiLocked: (locked: boolean) => void;
  onNavigateToView: (view: string) => void;
}

// Conversation and Message Models
export interface AIMessage {
  id: string;
  sender: 'user' | 'ai';
  timestamp: string;
  text?: string;
  toolExecution?: {
    toolName: string;
    status: 'IN_PROGRESS' | 'DONE';
  };
  resultSummary?: {
    total: number;
    metrics: { label: string; value: string | number }[];
  };
  tableData?: {
    headers: string[];
    rows: (string | number)[][];
    reportActionLabel?: string;
    reportActionView?: string;
  };
  chartData?: {
    type: 'DONUT' | 'BAR';
    title: string;
    items: { label: string; percentage: number; count?: number; color: string }[];
  };
  fileCard?: {
    title: string;
    format: 'EXCEL' | 'CSV' | 'PDF';
    size: string;
    recordCount: number;
    filename: string;
  };
  approvalRequest?: {
    id: string;
    actionName: string;
    audience: string;
    boothScope: string;
    recipientCount: number;
    channel: 'WHATSAPP' | 'SMS' | 'VOICE_CALL';
    messagePreview: string;
    schedule: string;
    estimatedCost: string;
    status: 'PENDING' | 'APPROVED' | 'CANCELLED';
  };
  actionButton?: {
    label: string;
    view: string;
  };
}

export interface AIConversation {
  id: string;
  title: string;
  group: 'TODAY' | 'YESTERDAY' | 'PREVIOUS_7_DAYS' | 'PREVIOUS_30_DAYS';
  lastUpdated: string;
  messages: AIMessage[];
}

export const GlobalAIModal: React.FC<GlobalAIModalProps> = ({
  isOpen,
  onClose,
  isAiLocked,
  setIsAiLocked,
  onNavigateToView
}) => {
  const { showToast } = useToast();

  // Fullscreen expansion toggle (75-85% default vs 100% full screen)
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Search in conversation history
  const [historySearch, setHistorySearch] = useState('');

  // Current active conversation ID
  const [activeConvId, setActiveConvId] = useState<string>('conv-1');

  // Input query state
  const [inputValue, setInputValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<{ name: string; size: string }[]>([]);

  // Ref to chat message end for auto-scrolling
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Initial Sample Conversations matching Section 8
  const [conversations, setConversations] = useState<AIConversation[]>([
    {
      id: 'conv-1',
      title: 'Voters Above 60 in Booth 125',
      group: 'TODAY',
      lastUpdated: '10:45 AM',
      messages: [
        {
          id: 'm-1-1',
          sender: 'user',
          timestamp: '10:42 AM',
          text: 'Find voters above 60 in Booth 125.'
        },
        {
          id: 'm-1-2',
          sender: 'ai',
          timestamp: '10:43 AM',
          text: 'I found 248 matching voter records in Booth 125.',
          toolExecution: {
            toolName: 'Voter Database SQL Query (Age > 60 AND Booth = 125)',
            status: 'DONE'
          },
          resultSummary: {
            total: 248,
            metrics: [
              { label: 'Total Matching Voters', value: 248 },
              { label: 'Male', value: 132 },
              { label: 'Female', value: 116 },
              { label: 'Records with Mobile', value: 184 }
            ]
          },
          tableData: {
            headers: ['EPIC ID', 'Voter Name', 'Age', 'Gender', 'Mobile', 'Polling Station'],
            rows: [
              ['WXE4829102', 'Babanrao Shinde', 64, 'Male', '+91 98221 44001', 'Booth #125 - Garware College'],
              ['WXE0821443', 'Sumanbai Joshi', 71, 'Female', '+91 98221 44002', 'Booth #125 - Garware College'],
              ['WXE3109244', 'Ramchandra Kulkarni', 68, 'Male', '+91 97654 32110', 'Booth #125 - Garware College'],
              ['WXE1290384', 'Anandi Patwardhan', 66, 'Female', '+91 99900 12345', 'Booth #125 - Garware College']
            ],
            reportActionLabel: 'View Voters in Master Directory',
            reportActionView: 'voters'
          }
        }
      ]
    },
    {
      id: 'conv-2',
      title: 'Generate Pending Survey Report',
      group: 'TODAY',
      lastUpdated: '09:15 AM',
      messages: [
        {
          id: 'm-2-1',
          sender: 'user',
          timestamp: '09:12 AM',
          text: 'Generate an Excel report of voters who have not completed the survey.'
        },
        {
          id: 'm-2-2',
          sender: 'ai',
          timestamp: '09:13 AM',
          text: 'The report has been prepared for the selected election and authorized data scope.',
          toolExecution: {
            toolName: 'Survey Reporting Pipeline & Excel Generator',
            status: 'DONE'
          },
          resultSummary: {
            total: 21540,
            metrics: [
              { label: 'Total Registered Voters', value: '21,540' },
              { label: 'Survey Completed', value: '16,420' },
              { label: 'Survey Pending', value: '5,120' },
              { label: 'Completion Rate', value: '76.2%' }
            ]
          },
          fileCard: {
            title: 'Unsurveyed_Voter_Records_Pune_Central.xlsx',
            format: 'EXCEL',
            size: '2.4 MB',
            recordCount: 5120,
            filename: 'INDATA_Survey_Pending_Report_2024.xlsx'
          }
        }
      ]
    },
    {
      id: 'conv-3',
      title: 'Gender Distribution Analysis',
      group: 'YESTERDAY',
      lastUpdated: 'Yesterday, 04:20 PM',
      messages: [
        {
          id: 'm-3-1',
          sender: 'user',
          timestamp: 'Yesterday, 04:18 PM',
          text: 'Show gender distribution of voters.'
        },
        {
          id: 'm-3-2',
          sender: 'ai',
          timestamp: 'Yesterday, 04:19 PM',
          text: 'Here is the gender distribution for the currently selected constituency (Pune AC 215).',
          toolExecution: {
            toolName: 'Demographic Roll Aggregation Engine',
            status: 'DONE'
          },
          chartData: {
            type: 'DONUT',
            title: 'Constituency Gender Breakdown',
            items: [
              { label: 'Male Voters', percentage: 51.4, count: 127560, color: '#3b82f6' },
              { label: 'Female Voters', percentage: 48.5, count: 121090, color: '#a855f7' },
              { label: 'Other / Unspecified', percentage: 0.1, count: 180, color: '#94a3b8' }
            ]
          }
        }
      ]
    },
    {
      id: 'conv-4',
      title: 'Booth-wise Voter Distribution',
      group: 'PREVIOUS_7_DAYS',
      lastUpdated: 'Nov 02, 2024',
      messages: [
        {
          id: 'm-4-1',
          sender: 'user',
          timestamp: 'Nov 02, 02:00 PM',
          text: 'Show the top 5 booths by voter count.'
        },
        {
          id: 'm-4-2',
          sender: 'ai',
          timestamp: 'Nov 02, 02:01 PM',
          text: 'Here is the booth-wise voter count report for the top 5 largest polling stations.',
          toolExecution: {
            toolName: 'Booth Ranking Index & Density Analyzer',
            status: 'DONE'
          },
          tableData: {
            headers: ['Booth', 'Polling Location', 'Total Voters', 'Karyakartas Assigned'],
            rows: [
              ['#101', 'Navbharat High School, Room 1', 1410, '3 Karyakartas'],
              ['#102', 'Navbharat High School, Room 2', 1350, '3 Karyakartas'],
              ['#103', 'Dr. Ambedkar Samaj Mandir', 1205, '2 Karyakartas'],
              ['#104', 'Pune Municipal School No. 18', 1150, '2 Karyakartas'],
              ['#105', 'Abasaheb Garware College', 1120, '2 Karyakartas']
            ],
            reportActionLabel: 'Open Full Booth Readiness Matrix',
            reportActionView: 'dashboard'
          }
        }
      ]
    },
    {
      id: 'conv-5',
      title: 'Campaign Performance Analysis',
      group: 'PREVIOUS_7_DAYS',
      lastUpdated: 'Oct 30, 2024',
      messages: []
    },
    {
      id: 'conv-6',
      title: 'Karyakarta Activity Report',
      group: 'PREVIOUS_30_DAYS',
      lastUpdated: 'Oct 22, 2024',
      messages: []
    }
  ]);

  // Current active conversation
  const currentConversation = useMemo(() => {
    return conversations.find((c) => c.id === activeConvId) || conversations[0];
  }, [conversations, activeConvId]);

  // Auto-scroll on new message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, currentConversation?.messages.length, isGenerating]);

  if (!isOpen) return null;

  // Suggested Prompts by Category (Section 6)
  const suggestedPrompts = [
    { category: 'Voter Search', prompt: 'Find voters above 60 in Booth 125' },
    { category: 'Voter Search', prompt: 'Show voters without mobile numbers' },
    { category: 'Voter Analytics', prompt: 'Show gender distribution across all booths' },
    { category: 'Voter Analytics', prompt: 'Show the top 5 booths by voter count' },
    { category: 'Survey Operations', prompt: 'Generate an Excel report of voters who have not completed the survey' },
    { category: 'Campaign Outreach', prompt: 'Schedule a WhatsApp broadcast to all female beneficiaries in Prabhaag 12' }
  ];

  // Conversation Management Handlers
  const handleStartNewChat = () => {
    const newId = `conv-${Date.now()}`;
    const newChat: AIConversation = {
      id: newId,
      title: 'New Conversation',
      group: 'TODAY',
      lastUpdated: 'Just now',
      messages: []
    };
    setConversations((prev) => [newChat, ...prev]);
    setActiveConvId(newId);
    showToast('Started new AI conversation workspace.', 'info');
  };

  const handleDeleteConversation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (activeConvId === id) {
      const remaining = conversations.filter((c) => c.id !== id);
      if (remaining.length > 0) setActiveConvId(remaining[0].id);
    }
    showToast('Conversation deleted.', 'info');
  };

  const handleRenameConversation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const current = conversations.find(c => c.id === id);
    const newTitle = window.prompt('Rename conversation:', current?.title || '');
    if (newTitle && newTitle.trim()) {
      setConversations(prev => prev.map(c => c.id === id ? { ...c, title: newTitle.trim() } : c));
    }
  };

  // Submit Prompt Handler (Interactive response generator)
  const handleSubmitMessage = (textToSend: string) => {
    const text = textToSend.trim();
    if (!text || isGenerating) return;

    if (isAiLocked) {
      showToast('Global AI Mode is locked on this account tier. Please view Subscription Plans.', 'error');
      return;
    }

    const userMessage: AIMessage = {
      id: `m-user-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text
    };

    // Update active conversation
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeConvId) {
          const isFirstMessage = c.messages.length === 0;
          return {
            ...c,
            title: isFirstMessage ? (text.length > 32 ? text.slice(0, 32) + '...' : text) : c.title,
            lastUpdated: 'Just now',
            messages: [...c.messages, userMessage]
          };
        }
        return c;
      })
    );

    setInputValue('');
    setIsGenerating(true);

    // Dynamic simulated response based on user prompt keywords
    setTimeout(() => {
      let aiMessage: AIMessage;
      const lower = text.toLowerCase();

      if (lower.includes('whatsapp') || lower.includes('broadcast') || lower.includes('schedule') || lower.includes('sms')) {
        // Human Approval Required Action (Section 11)
        aiMessage = {
          id: `m-ai-${Date.now()}`,
          sender: 'ai',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: 'I have prepared the campaign parameters for your targeted broadcast. This operation will deliver messages to external voters and requires your explicit approval.',
          toolExecution: {
            toolName: 'Campaign Dispatch Engine & DLT SMS Routing Gate',
            status: 'DONE'
          },
          approvalRequest: {
            id: `APPR-${Math.floor(1000 + Math.random() * 9000)}`,
            actionName: 'WhatsApp Beneficiary Outreach Broadcast',
            audience: 'Female Electorate enrolled in Majhi Ladki Bahin Scheme',
            boothScope: 'Prabhaag 12 (Booths 101 - 108)',
            recipientCount: 3840,
            channel: 'WHATSAPP',
            messagePreview: 'Namaskar! Respected voter, this is an update regarding development initiatives and welfare schemes under candidate Adv. Vikram Patil.',
            schedule: 'Immediate execution upon confirmation',
            estimatedCost: '₹460.80 (@ ₹0.12/msg DLT rate)',
            status: 'PENDING'
          }
        };
      } else if (lower.includes('gender') || lower.includes('male') || lower.includes('female')) {
        aiMessage = {
          id: `m-ai-${Date.now()}`,
          sender: 'ai',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: 'Here is the gender distribution for the currently selected constituency.',
          toolExecution: {
            toolName: 'Constituency Roll Gender Distribution Pipeline',
            status: 'DONE'
          },
          chartData: {
            type: 'DONUT',
            title: 'Gender Distribution - 2,48,650 Registered Electors',
            items: [
              { label: 'Male Voters', percentage: 51.4, count: 127560, color: '#3b82f6' },
              { label: 'Female Voters', percentage: 48.5, count: 121090, color: '#a855f7' },
              { label: 'Third Gender / Others', percentage: 0.1, count: 180, color: '#64748b' }
            ]
          }
        };
      } else if (lower.includes('booth') || lower.includes('top 5') || lower.includes('count')) {
        aiMessage = {
          id: `m-ai-${Date.now()}`,
          sender: 'ai',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: 'Here is the booth-wise voter count report for the largest polling stations.',
          toolExecution: {
            toolName: 'Booth Ranking Index & Density Analyzer',
            status: 'DONE'
          },
          tableData: {
            headers: ['Booth', 'Polling Location', 'Total Voters', 'Turnout Target'],
            rows: [
              ['#101', 'Navbharat High School, Room 1', 1410, '72% (1,015 votes)'],
              ['#102', 'Navbharat High School, Room 2', 1350, '70% (945 votes)'],
              ['#103', 'Dr. Ambedkar Samaj Mandir', 1205, '75% (903 votes)'],
              ['#104', 'Pune Municipal School No. 18', 1150, '68% (782 votes)'],
              ['#105', 'Abasaheb Garware College', 1120, '74% (828 votes)']
            ],
            reportActionLabel: 'Inspect in War Room Matrix',
            reportActionView: 'dashboard'
          }
        };
      } else if (lower.includes('excel') || lower.includes('report') || lower.includes('survey')) {
        aiMessage = {
          id: `m-ai-${Date.now()}`,
          sender: 'ai',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: 'The report has been prepared for the selected election and authorized data scope.',
          toolExecution: {
            toolName: 'Survey Reporting Pipeline & Export Formatter',
            status: 'DONE'
          },
          resultSummary: {
            total: 21540,
            metrics: [
              { label: 'Total Verified Roll', value: '21,540' },
              { label: 'Survey Completed', value: '16,420' },
              { label: 'Survey Pending', value: '5,120' },
              { label: 'Coverage Rate', value: '76.2%' }
            ]
          },
          fileCard: {
            title: 'Unsurveyed_Voter_Records_Pune.xlsx',
            format: 'EXCEL',
            size: '2.4 MB',
            recordCount: 5120,
            filename: 'INDATA_Survey_Pending_Report.xlsx'
          }
        };
      } else {
        // Default smart response with data lookup
        aiMessage = {
          id: `m-ai-${Date.now()}`,
          sender: 'ai',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: `Query analyzed for "${text}". I inspected the electoral database for ${CURRENT_ELECTION_CONTEXT.constituency}. 2,045 booths and 21.54 L voters are currently registered. You can export filtered summaries or launch targeted outreach directly.`,
          toolExecution: {
            toolName: 'Natural Language SQL Parser & Aggregator',
            status: 'DONE'
          },
          actionButton: {
            label: 'Open Total Voters Directory',
            view: 'voters'
          }
        };
      }

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === activeConvId) {
            return {
              ...c,
              messages: [...c.messages, aiMessage]
            };
          }
          return c;
        })
      );

      setIsGenerating(false);
    }, 1200);
  };

  const handleApprovalAction = (msgId: string, approved: boolean) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeConvId) {
          return {
            ...c,
            messages: c.messages.map((m) => {
              if (m.id === msgId && m.approvalRequest) {
                return {
                  ...m,
                  approvalRequest: {
                    ...m.approvalRequest,
                    status: approved ? 'APPROVED' : 'CANCELLED'
                  }
                };
              }
              return m;
            })
          };
        }
        return c;
      })
    );

    if (approved) {
      showToast('Action approved. Broadcast has been queued for execution.', 'success');
    } else {
      showToast('Action cancelled. No messages were dispatched.', 'info');
    }
  };

  const handleDownloadFile = (filename: string) => {
    showToast(`Downloading ${filename}...`, 'success');
  };

  const handleAttachFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.csv,.xlsx,.xls,.doc,.docx';
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (file) {
        setAttachedFiles((prev) => [...prev, { name: file.name, size: `${(file.size / 1024).toFixed(1)} KB` }]);
        showToast(`Attached ${file.name}`, 'info');
      }
    };
    input.click();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end animate-fadeIn">
      {/* AI Workspace Panel: 75-85% on desktop, full screen if toggled */}
      <div
        className={`h-full bg-slate-50 flex flex-col transition-all duration-300 shadow-2xl border-l border-slate-200 ${
          isFullScreen ? 'w-full' : 'w-full md:w-[82%] lg:w-[80%]'
        }`}
      >
        {/* 1. Header Bar matching Section 3 */}
        <div className="h-16 px-4 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-sm text-slate-900">INDATA Global AI Mode</h2>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                  AI Available
                </span>
                {/* Subscription Status Chip */}
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                  <ShieldCheck className="w-3 h-3 text-purple-600" />
                  AI Mode Active
                </span>
              </div>
              <p className="text-[11px] text-slate-500 truncate max-w-md">
                Electoral intelligence for {CURRENT_ELECTION_CONTEXT.constituency}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* New Chat Button */}
            <button
              onClick={handleStartNewChat}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold rounded-xl text-xs border border-purple-200 transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Chat</span>
            </button>

            {/* Expand / Collapse Fullscreen */}
            <button
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors hidden sm:block"
              title={isFullScreen ? 'Exit Full Screen' : 'Expand to Full Screen'}
            >
              {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
              title="Close AI Mode"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 2. Main Workspace Layout (Sidebar History + Chat Area) */}
        <div className="flex-1 flex overflow-hidden">
          {/* A. Conversation History Left Sidebar (ChatGPT-style) */}
          <div className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 hidden md:flex">
            {/* Search History */}
            <div className="p-3 border-b border-slate-100">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search chats..."
                  value={historySearch}
                  onChange={(e) => setHistorySearch(e.target.value)}
                  className="w-full pl-8 pr-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* History List Grouped by Timeline */}
            <div className="flex-1 overflow-y-auto p-2 space-y-4 text-xs">
              {['TODAY', 'YESTERDAY', 'PREVIOUS_7_DAYS', 'PREVIOUS_30_DAYS'].map((grp) => {
                const groupConvs = conversations.filter(
                  (c) => c.group === grp && c.title.toLowerCase().includes(historySearch.toLowerCase())
                );
                if (groupConvs.length === 0) return null;

                const groupLabel =
                  grp === 'TODAY'
                    ? 'Today'
                    : grp === 'YESTERDAY'
                    ? 'Yesterday'
                    : grp === 'PREVIOUS_7_DAYS'
                    ? 'Previous 7 Days'
                    : 'Previous 30 Days';

                return (
                  <div key={grp}>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 block mb-1.5">
                      {groupLabel}
                    </span>
                    <div className="space-y-0.5">
                      {groupConvs.map((conv) => {
                        const isActive = conv.id === activeConvId;
                        return (
                          <div
                            key={conv.id}
                            onClick={() => setActiveConvId(conv.id)}
                            className={`group flex items-center justify-between p-2 rounded-xl cursor-pointer transition-all ${
                              isActive
                                ? 'bg-purple-50/80 text-purple-950 font-bold border border-purple-200/80 shadow-xs'
                                : 'text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-purple-600' : 'text-slate-400'}`} />
                              <span className="truncate text-xs">{conv.title}</span>
                            </div>

                            {/* Actions on hover */}
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={(e) => handleRenameConversation(conv.id, e)}
                                className="p-0.5 text-slate-400 hover:text-slate-700"
                                title="Rename"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                              <button
                                onClick={(e) => handleDeleteConversation(conv.id, e)}
                                className="p-0.5 text-slate-400 hover:text-rose-600"
                                title="Delete"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Sidebar Footer Indicator */}
            <div className="p-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Conversations saved</span>
              <span className="font-mono">{conversations.length} total</span>
            </div>
          </div>

          {/* B. Main Chat Conversation Area (ChatGPT-style) */}
          <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50/60">
            {/* Scrollable Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
              {/* First-Time Welcome Screen if conversation is empty */}
              {currentConversation.messages.length === 0 ? (
                <div className="max-w-2xl mx-auto py-8 text-center space-y-4 animate-fadeIn">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center mx-auto shadow-lg">
                    <Sparkles className="w-7 h-7" />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                      How can I help you today?
                    </h2>
                    <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                      Ask INDATA AI to search voter records, analyze election data, generate reports, prepare campaigns or help you operate the portal.
                    </p>
                  </div>

                  {/* Suggested Prompts Grid */}
                  <div className="pt-4 text-left">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2 text-center">
                      Suggested Inquiries
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {suggestedPrompts.map((item, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSubmitMessage(item.prompt)}
                          className="p-3 bg-white hover:bg-purple-50/50 rounded-xl border border-slate-200 hover:border-purple-300 text-left transition-all shadow-xs group"
                        >
                          <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider block mb-0.5">
                            {item.category}
                          </span>
                          <span className="text-xs text-slate-800 font-medium group-hover:text-purple-900 block leading-tight">
                            {item.prompt}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* Messages Stream */
                <div className="max-w-4xl mx-auto space-y-6">
                  {currentConversation.messages.map((msg) => {
                    const isUser = msg.sender === 'user';
                    return (
                      <div
                        key={msg.id}
                        className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
                      >
                        {/* AI Icon */}
                        {!isUser && (
                          <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                            <Sparkles className="w-4 h-4" />
                          </div>
                        )}

                        {/* Message Bubble Container */}
                        <div
                          className={`max-w-[85%] rounded-2xl p-4 space-y-3 shadow-xs ${
                            isUser
                              ? 'bg-blue-600 text-white ml-12 rounded-br-xs'
                              : 'bg-white text-slate-900 border border-slate-200 mr-12 rounded-tl-xs'
                          }`}
                        >
                          {/* Tool Execution Badge if present */}
                          {msg.toolExecution && (
                            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-purple-50 text-purple-700 border border-purple-100 rounded-lg text-[11px] font-medium w-fit">
                              <Zap className="w-3 h-3 text-purple-600 animate-pulse" />
                              <span>{msg.toolExecution.toolName}</span>
                            </div>
                          )}

                          {/* Message Text */}
                          {msg.text && (
                            <p className={`text-xs leading-relaxed whitespace-pre-wrap ${isUser ? 'text-white' : 'text-slate-800'}`}>
                              {msg.text}
                            </p>
                          )}

                          {/* Numerical Result Summary */}
                          {msg.resultSummary && (
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                              {msg.resultSummary.metrics.map((met, i) => (
                                <div key={i} className="p-2 bg-slate-50 border border-slate-100 rounded-xl">
                                  <span className="text-[10px] text-slate-400 font-medium block">{met.label}</span>
                                  <span className="text-sm font-black text-slate-900 font-mono mt-0.5 block">
                                    {met.value}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Embedded Table Component */}
                          {msg.tableData && (
                            <div className="overflow-x-auto border border-slate-200 rounded-xl my-2">
                              <table className="w-full text-left border-collapse text-[11px]">
                                <thead>
                                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                                    {msg.tableData.headers.map((h, i) => (
                                      <th key={i} className="py-2 px-3">{h}</th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                  {msg.tableData.rows.map((row, rIdx) => (
                                    <tr key={rIdx} className="hover:bg-slate-50/60">
                                      {row.map((cell, cIdx) => (
                                        <td key={cIdx} className="py-2 px-3 font-medium text-slate-800">
                                          {cell}
                                        </td>
                                      ))}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}

                          {/* Embedded Donut Chart Component */}
                          {msg.chartData && (
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 my-2">
                              <span className="text-xs font-bold text-slate-800 block mb-2">{msg.chartData.title}</span>
                              <div className="flex flex-col sm:flex-row items-center gap-4">
                                <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
                                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                    <path
                                      className="text-purple-500"
                                      strokeDasharray="48.5, 51.5"
                                      strokeDashoffset="0"
                                      strokeWidth="4"
                                      stroke="currentColor"
                                      fill="none"
                                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    />
                                    <path
                                      className="text-blue-600"
                                      strokeDasharray="51.4, 48.6"
                                      strokeDashoffset="-48.5"
                                      strokeWidth="4"
                                      stroke="currentColor"
                                      fill="none"
                                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    />
                                  </svg>
                                  <div className="absolute text-center">
                                    <span className="text-xs font-black text-slate-900">2.48L</span>
                                  </div>
                                </div>

                                <div className="flex-1 space-y-1.5 w-full">
                                  {msg.chartData.items.map((item, i) => (
                                    <div key={i} className="flex items-center justify-between text-xs p-1.5 bg-white rounded-lg border border-slate-100">
                                      <div className="flex items-center gap-1.5">
                                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                                        <span className="font-semibold text-slate-700">{item.label}</span>
                                      </div>
                                      <div className="text-right">
                                        <span className="font-bold text-slate-900 font-mono">{item.percentage}%</span>
                                        {item.count && (
                                          <span className="text-[10px] text-slate-400 block font-mono">({item.count.toLocaleString()})</span>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Downloadable File Card */}
                          {msg.fileCard && (
                            <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl flex items-center justify-between gap-3 my-2">
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                                  <FileSpreadsheet className="w-5 h-5" />
                                </div>
                                <div className="min-w-0">
                                  <span className="font-bold text-slate-900 text-xs block truncate">
                                    {msg.fileCard.title}
                                  </span>
                                  <span className="text-[10px] text-slate-500 block">
                                    {msg.fileCard.format} • {msg.fileCard.size} • {msg.fileCard.recordCount.toLocaleString()} records
                                  </span>
                                </div>
                              </div>

                              <button
                                onClick={() => handleDownloadFile(msg.fileCard!.filename)}
                                className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs transition-colors shrink-0 shadow-xs"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span>Download</span>
                              </button>
                            </div>
                          )}

                          {/* Human Approval Preview Card (Section 11) */}
                          {msg.approvalRequest && (
                            <div className="p-4 bg-amber-50/90 border border-amber-300 rounded-xl space-y-3 my-2">
                              <div className="flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                                <span className="font-bold text-xs text-amber-950 uppercase tracking-wider">
                                  Human Approval Required Before Dispatch
                                </span>
                              </div>

                              <div className="grid grid-cols-2 gap-2 text-[11px] bg-white/80 p-2.5 rounded-lg border border-amber-200">
                                <div><span className="text-slate-400">Action:</span> <strong>{msg.approvalRequest.actionName}</strong></div>
                                <div><span className="text-slate-400">Audience:</span> <strong>{msg.approvalRequest.audience}</strong></div>
                                <div><span className="text-slate-400">Scope:</span> <strong>{msg.approvalRequest.boothScope}</strong></div>
                                <div><span className="text-slate-400">Recipients:</span> <strong>{msg.approvalRequest.recipientCount.toLocaleString()}</strong></div>
                                <div><span className="text-slate-400">Schedule:</span> <strong>{msg.approvalRequest.schedule}</strong></div>
                                <div><span className="text-slate-400">Cost:</span> <strong>{msg.approvalRequest.estimatedCost}</strong></div>
                              </div>

                              <div className="p-2 bg-white rounded-lg border border-amber-200 text-[11px] text-slate-700">
                                <span className="font-semibold block text-slate-500 mb-0.5">Message Preview:</span>
                                <em>"{msg.approvalRequest.messagePreview}"</em>
                              </div>

                              <div className="flex items-center justify-end gap-2 pt-1">
                                {msg.approvalRequest.status === 'PENDING' ? (
                                  <>
                                    <button
                                      onClick={() => handleApprovalAction(msg.id, false)}
                                      className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold"
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      onClick={() => handleApprovalAction(msg.id, true)}
                                      className="flex items-center gap-1 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold shadow-xs"
                                    >
                                      <Check className="w-3.5 h-3.5" />
                                      <span>Approve & Execute</span>
                                    </button>
                                  </>
                                ) : msg.approvalRequest.status === 'APPROVED' ? (
                                  <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2.5 py-1 rounded-md flex items-center gap-1">
                                    <CheckCircle2 className="w-3.5 h-3.5" /> Approved & Executed
                                  </span>
                                ) : (
                                  <span className="text-xs font-bold text-slate-600 bg-slate-200 px-2.5 py-1 rounded-md">
                                    Cancelled by Candidate
                                  </span>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Navigation Action Button */}
                          {(msg.actionButton || msg.tableData?.reportActionLabel) && (
                            <button
                              onClick={() => {
                                const target = msg.actionButton?.view || msg.tableData?.reportActionView || 'dashboard';
                                onNavigateToView(target);
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition-colors mt-1"
                            >
                              <span>{msg.actionButton?.label || msg.tableData?.reportActionLabel}</span>
                              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                            </button>
                          )}

                          {/* Timestamp */}
                          <div className={`text-[10px] ${isUser ? 'text-blue-100' : 'text-slate-400'} text-right`}>
                            {msg.timestamp}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Typing / Generating Indicator */}
                  {isGenerating && (
                    <div className="flex gap-3 justify-start items-center">
                      <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                        <Sparkles className="w-4 h-4 animate-spin" />
                      </div>
                      <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-600 flex items-center gap-2 shadow-xs">
                        <div className="flex gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-bounce" />
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-bounce [animation-delay:0.2s]" />
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-bounce [animation-delay:0.4s]" />
                        </div>
                        <span>Querying electoral database & synthesizing response...</span>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* C. Fixed Bottom Chat Input & Suggested Prompt Chips */}
            <div className="p-4 bg-white border-t border-slate-200 shrink-0">
              <div className="max-w-4xl mx-auto space-y-2.5">
                {/* Horizontal Quick Suggestions Strip */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-[11px]">
                  <span className="text-slate-400 font-semibold shrink-0">Quick Ask:</span>
                  {suggestedPrompts.slice(0, 4).map((p, i) => (
                    <button
                      key={i}
                      onClick={() => handleSubmitMessage(p.prompt)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200 border border-slate-200 rounded-full font-medium text-slate-700 whitespace-nowrap transition-colors"
                    >
                      {p.prompt}
                    </button>
                  ))}
                </div>

                {/* Attached files preview */}
                {attachedFiles.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {attachedFiles.map((f, i) => (
                      <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200">
                        <FileText className="w-3 h-3 text-purple-600" />
                        <span>{f.name} ({f.size})</span>
                        <button
                          onClick={() => setAttachedFiles(prev => prev.filter((_, idx) => idx !== i))}
                          className="hover:text-rose-600 ml-1"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Main Input Box */}
                <div className="relative border border-slate-300 rounded-2xl bg-white shadow-xs focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-500/20 transition-all p-2">
                  <textarea
                    ref={textareaRef}
                    rows={2}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmitMessage(inputValue);
                      }
                    }}
                    placeholder="Ask anything about your election data... (Shift + Enter for new line)"
                    className="w-full text-xs text-slate-900 placeholder:text-slate-400 resize-none bg-transparent focus:outline-none p-1.5"
                  />

                  {/* Bottom Action Bar inside Input */}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={handleAttachFile}
                        className="flex items-center gap-1 px-2.5 py-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg text-xs font-medium transition-colors"
                        title="Attach PDF, Excel or document"
                      >
                        <Paperclip className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Attach Data</span>
                      </button>

                      <span className="text-[10px] text-slate-400 hidden sm:inline">
                        Supports CSV, Excel, PDF
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {isGenerating ? (
                        <button
                          onClick={() => setIsGenerating(false)}
                          className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs flex items-center gap-1 transition-colors"
                        >
                          <Square className="w-3 h-3 fill-current" />
                          <span>Stop</span>
                        </button>
                      ) : (
                        <button
                          disabled={!inputValue.trim()}
                          onClick={() => handleSubmitMessage(inputValue)}
                          className="flex items-center gap-1.5 px-4 py-1.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 disabled:hover:bg-purple-600 text-white font-bold rounded-xl text-xs transition-colors shadow-xs"
                        >
                          <span>Send</span>
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 px-1">
                  <span>Authorized electoral reporting pipeline • Role: Candidate Admin</span>
                  <span>Press <strong>Enter</strong> to submit, <strong>Shift + Enter</strong> for line break</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
