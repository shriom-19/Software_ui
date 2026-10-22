import React, { useState } from 'react';
import { Sparkles, X, Send, Lock, Unlock, Zap, Bot, ArrowRight, ShieldCheck, ChevronRight } from 'lucide-react';
import { CURRENT_ELECTION_CONTEXT } from '../../data/mockData';

interface GlobalAIModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAiLocked: boolean;
  setIsAiLocked: (locked: boolean) => void;
  onNavigateToView: (view: string) => void;
}

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  actionButton?: {
    label: string;
    view: string;
  };
  metrics?: { label: string; value: string; trend?: string }[];
}

export const GlobalAIModal: React.FC<GlobalAIModalProps> = ({
  isOpen,
  onClose,
  isAiLocked,
  setIsAiLocked,
  onNavigateToView
}) => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-1',
      sender: 'ai',
      text: `Namaskar! I am your Indata Election AI Intelligence Assistant for ${CURRENT_ELECTION_CONTEXT.constituency}. Ask me anything about booth vulnerabilities, demographic segments, karyakarta coverage, or campaign messaging.`
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  if (!isOpen) return null;

  const quickPrompts = [
    "Identify top 3 swing booths with low turnout",
    "How many women beneficiaries are covered under Ladki Bahin Yojana?",
    "Summarize unresolved water supply issues in Kothrud",
    "What is the projected turnout in Prabhaag 12?"
  ];

  const handleSend = (userText: string) => {
    if (!userText.trim() || isAiLocked) return;

    const userMsg: Message = {
      id: Math.random().toString(),
      sender: 'user',
      text: userText
    };

    setMessages((prev) => [...prev, userMsg]);
    setQuery('');
    setIsTyping(true);

    setTimeout(() => {
      let reply: Message;
      const lower = userText.toLowerCase();

      if (lower.includes('swing') || lower.includes('booth') || lower.includes('turnout')) {
        reply = {
          id: Math.random().toString(),
          sender: 'ai',
          text: `Based on 2019 and 2024 survey analytics, Booth #103 (Paud Phata - 54.1% last turnout) and Booth #108 (Deccan - 41.5% last turnout) are critical swing pockets. We recommend deploying 2 additional Karyakartas to Booth #108 for door-to-door voter slip distribution.`,
          actionButton: {
            label: "Open Booth Intelligence in War Room",
            view: "dashboard"
          },
          metrics: [
            { label: "Booth 103 Projected Turnout", value: "66.0%", trend: "+11.9%" },
            { label: "Booth 108 Projected Turnout", value: "52.0%", trend: "+10.5%" }
          ]
        };
      } else if (lower.includes('ladki') || lower.includes('women') || lower.includes('beneficiar')) {
        reply = {
          id: Math.random().toString(),
          sender: 'ai',
          text: `There are 38,900 identified Mukhyamantri Majhi Ladki Bahin Yojana beneficiaries across Pune Constituency. 86.4% of them are positively inclined towards candidate Adv. Vikram Patil. A targeted WhatsApp broadcast can increase overall female voter turnout by an estimated 7.2%.`,
          actionButton: {
            label: "Launch Women Outreach Campaign",
            view: "campaigns"
          },
          metrics: [
            { label: "Total Beneficiaries", value: "38,900" },
            { label: "Favorable Sentiment", value: "86.4%" }
          ]
        };
      } else if (lower.includes('water') || lower.includes('issue') || lower.includes('kothrud')) {
        reply = {
          id: Math.random().toString(),
          sender: 'ai',
          text: `Grievance analysis shows 18 open tickets regarding low morning water pressure along Karve Road and Dahanukar Colony. Coordinated action with PMC Ward Executive Engineer is underway for Ticket #TKT-9210.`,
          actionButton: {
            label: "Review Open Public Issues",
            view: "office"
          }
        };
      } else {
        reply = {
          id: Math.random().toString(),
          sender: 'ai',
          text: `Analyzed query across 2.1M voters, 2,045 booths, and field survey databases. Overall campaign coverage in ${CURRENT_ELECTION_CONTEXT.constituency} is currently at 78.2%, with strong ground momentum in Kothrud and Erandwane segments.`,
          actionButton: {
            label: "View Total Voters Database",
            view: "voters"
          }
        };
      }

      setMessages((prev) => [...prev, reply]);
      setIsTyping(false);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-xl h-full shadow-2xl flex flex-col border-l border-slate-200 animate-slide-left">
        {/* Header */}
        <div className="p-4 px-6 border-b border-slate-200 bg-gradient-to-r from-brand-900 via-brand-800 to-indigo-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base">Global AI Mode</h3>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                  isAiLocked ? 'bg-rose-500/30 text-rose-200 border border-rose-400/40' : 'bg-emerald-500/30 text-emerald-200 border border-emerald-400/40'
                }`}>
                  {isAiLocked ? 'Locked / Pro Tier' : 'Active • Enterprise'}
                </span>
              </div>
              <p className="text-xs text-indigo-200">Indata Election Intelligence Engine v4.2</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Simulation toggle button for locked/unlocked state demonstration */}
            <button
              onClick={() => setIsAiLocked(!isAiLocked)}
              className="text-[11px] flex items-center gap-1 px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Demo toggle between Locked & Active state"
            >
              {isAiLocked ? <Unlock className="w-3.5 h-3.5 text-amber-300" /> : <Lock className="w-3.5 h-3.5 text-slate-300" />}
              <span>{isAiLocked ? 'Unlock Demo' : 'Simulate Lock'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        {isAiLocked ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4 shadow-sm border border-amber-200">
              <Lock className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-2">AI Mode Requires Pro Subscription</h4>
            <p className="text-sm text-slate-600 max-w-sm mb-6">
              Real-time AI War Room insights, sentiment prediction models, and automated booth intelligence require an active Election Module + AI Mode license.
            </p>
            <div className="flex flex-col gap-3 w-full max-w-xs">
              <button
                onClick={() => {
                  onClose();
                  onNavigateToView('subscription');
                }}
                className="w-full py-2.5 px-4 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl text-sm shadow-md transition-colors flex items-center justify-center gap-2"
              >
                <span>View AI Subscription Plans</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsAiLocked(false)}
                className="text-xs text-brand-600 hover:underline font-medium"
              >
                (Demo Mode: Click to Unlock Instant Access)
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Chat Messages */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'ai' && (
                    <div className="w-8 h-8 rounded-lg bg-brand-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-1">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] rounded-2xl p-4 text-sm ${
                      msg.sender === 'user'
                        ? 'bg-brand-600 text-white rounded-br-none shadow-sm'
                        : 'bg-white text-slate-800 rounded-bl-none border border-slate-200 shadow-sm'
                    }`}
                  >
                    <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>

                    {msg.metrics && (
                      <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-100">
                        {msg.metrics.map((m, idx) => (
                          <div key={idx} className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                            <span className="text-[11px] text-slate-500 block">{m.label}</span>
                            <div className="flex items-baseline gap-1 mt-0.5">
                              <span className="font-bold text-slate-800">{m.value}</span>
                              {m.trend && <span className="text-[10px] text-emerald-600 font-semibold">{m.trend}</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {msg.actionButton && (
                      <button
                        onClick={() => {
                          onClose();
                          onNavigateToView(msg.actionButton!.view);
                        }}
                        className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-700 hover:text-brand-800 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-lg transition-colors border border-brand-200"
                      >
                        <span>{msg.actionButton.label}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3 items-center text-xs text-slate-500">
                  <div className="w-8 h-8 rounded-lg bg-brand-600 text-white flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-white border border-slate-200 px-4 py-2.5 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Prompts */}
            <div className="p-3 bg-white border-t border-slate-100 flex gap-2 overflow-x-auto no-scrollbar">
              {quickPrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(prompt)}
                  className="whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100 hover:bg-brand-50 hover:text-brand-700 text-slate-700 border border-slate-200 hover:border-brand-300 transition-colors shrink-0"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-4 bg-white border-t border-slate-200 flex items-center gap-2">
              <input
                type="text"
                placeholder="Ask Indata AI (e.g. 'Turnout projection in Ward 14')..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSend(query);
                }}
                className="flex-1 px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
              />
              <button
                onClick={() => handleSend(query)}
                disabled={!query.trim()}
                className="p-2.5 bg-brand-600 text-white rounded-xl hover:bg-brand-700 disabled:opacity-40 disabled:hover:bg-brand-600 transition-colors shadow-sm"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
