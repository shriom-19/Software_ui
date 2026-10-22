import React, { useState } from 'react';
import {
  History,
  Bot,
  BarChart3,
  TrendingUp,
  Lock,
  Unlock,
  Send,
  Sparkles,
  ArrowRight,
  Download,
  CheckCircle2,
  Table
} from 'lucide-react';
import { MOCK_HISTORICAL_ELECTIONS, CURRENT_ELECTION_CONTEXT } from '../../data/mockData';
import { useToast } from '../../components/common/Toast';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  tableData?: { heading: string; rows: [string, string, string][] };
}

export const PreviousElectionView: React.FC = () => {
  const { showToast } = useToast();
  const [activeMode, setActiveMode] = useState<'MANUAL' | 'BOT'>('MANUAL');
  const [selectedElection, setSelectedElection] = useState(MOCK_HISTORICAL_ELECTIONS[0]);
  const [isBotLocked, setIsBotLocked] = useState(false);

  // Strategy Bot chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'bot',
      text: `Namaskar! I am your Election Strategy Bot. I can analyze booth swing factors, historical party margins from 2009-2019, and suggest counter-strategies for low turnout pockets.`
    }
  ]);
  const [botInput, setBotInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendBot = (text: string) => {
    if (!text.trim() || isBotLocked) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: 'user',
      text
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setBotInput('');
    setIsTyping(true);

    setTimeout(() => {
      let reply: ChatMessage;
      const lower = text.toLowerCase();

      if (lower.includes('margin') || lower.includes('2019') || lower.includes('win')) {
        reply = {
          id: Math.random().toString(),
          sender: 'bot',
          text: `In 2019 Lok Sabha, the winning margin was 324,618 votes (61.1% vote share). The strongest lead came from Kothrud Assembly segment (+88,400 lead).`,
          tableData: {
            heading: "2019 Assembly Segment Lead Matrix",
            rows: [
              ["214 - Kothrud", "BJP +88,420", "Turnout: 58.2%"],
              ["215 - Shivajinagar", "BJP +42,100", "Turnout: 51.4%"],
              ["212 - Parvati", "BJP +62,300", "Turnout: 54.0%"]
            ]
          }
        };
      } else if (lower.includes('turnout') || lower.includes('swing') || lower.includes('booth')) {
        reply = {
          id: Math.random().toString(),
          sender: 'bot',
          text: `Historical turnout trends indicate that urban apartment clusters in Erandwane average 48-52% turnout, while basti clusters in Paud Phata touch 64-68%. Focusing transport assistance and early morning voter slip reminders can capture 8,000+ incremental votes.`,
          tableData: {
            heading: "Projected High-Yield Turnout Opportunities",
            rows: [
              ["Ward 12 (Kothrud West)", "Target: 74%", "Gap to Close: 1,400 votes"],
              ["Ward 13 (Erandwane)", "Target: 68%", "Gap to Close: 2,100 votes"],
              ["Ward 14 (Shivajinagar)", "Target: 65%", "Gap to Close: 1,850 votes"]
            ]
          }
        };
      } else {
        reply = {
          id: Math.random().toString(),
          sender: 'bot',
          text: `Strategy analysis calculated: Maintaining a 45%+ share in Kothrud while holding neutral voters in Erandwane ensures an unassailable parliamentary lead.`
        };
      }

      setChatMessages((prev) => [...prev, reply]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Electoral Intelligence
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-200">
              Dual Analytics Engine
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 mt-1">
            Previous Election & Strategy
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Switch between Manual / Power BI statistical modeling and conversational Strategy Bot.
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-700">
          <button
            onClick={() => setActiveMode('MANUAL')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              activeMode === 'MANUAL' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-brand-600" />
            <span>Manual / Power BI Mode</span>
          </button>
          <button
            onClick={() => setActiveMode('BOT')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              activeMode === 'BOT' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            <Bot className="w-4 h-4 text-fuchsia-600" />
            <span>Strategy Bot Mode</span>
          </button>
        </div>
      </div>

      {activeMode === 'MANUAL' ? (
        /* MODE 1: Manual / Power BI Mode */
        <div className="space-y-6">
          {/* Election Picker & High-level stats */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Select Historical General Election</h3>
                <p className="text-xs text-slate-500">Compare past winning margins and candidate voter share.</p>
              </div>

              <div className="flex items-center gap-2">
                {MOCK_HISTORICAL_ELECTIONS.map((elec) => (
                  <button
                    key={elec.year}
                    onClick={() => setSelectedElection(elec)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      selectedElection.year === elec.year
                        ? 'bg-brand-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {elec.year}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Election Summary Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <span className="text-slate-400 block text-[11px]">Winning Candidate & Party:</span>
                <span className="font-bold text-slate-900 text-sm mt-0.5 block">{selectedElection.winnerName}</span>
                <span className="text-brand-700 font-semibold">{selectedElection.winnerVotes.toLocaleString()} votes ({selectedElection.winnerVoteShare}%)</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <span className="text-slate-400 block text-[11px]">Runner-Up Candidate:</span>
                <span className="font-bold text-slate-900 text-sm mt-0.5 block">{selectedElection.runnerUpName}</span>
                <span className="text-slate-600 font-semibold">{selectedElection.runnerUpVotes.toLocaleString()} votes ({selectedElection.runnerUpVoteShare}%)</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <span className="text-slate-400 block text-[11px]">Winning Margin:</span>
                <span className="font-bold text-emerald-600 text-base mt-0.5 block">+{selectedElection.margin.toLocaleString()}</span>
                <span className="text-slate-500">Dominant Lead</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <span className="text-slate-400 block text-[11px]">Overall Voter Turnout:</span>
                <span className="font-bold text-slate-900 text-base mt-0.5 block">{selectedElection.totalTurnoutPercent}%</span>
                <span className="text-slate-500">{selectedElection.totalVotesPolled.toLocaleString()} polled</span>
              </div>
            </div>
          </div>

          {/* Visual Trend Bars (Power BI style layout) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <h3 className="font-bold text-slate-900 text-sm mb-1">Vote Share Comparison</h3>
              <p className="text-xs text-slate-500 mb-4">Historical distribution across frontrunners.</p>

              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span>{selectedElection.winnerParty}</span>
                    <span className="font-bold">{selectedElection.winnerVoteShare}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                    <div className="bg-brand-600 h-full rounded-full" style={{ width: `${selectedElection.winnerVoteShare}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span>{selectedElection.runnerUpParty}</span>
                    <span className="font-bold">{selectedElection.runnerUpVoteShare}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                    <div className="bg-slate-400 h-full rounded-full" style={{ width: `${selectedElection.runnerUpVoteShare}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span>Others / Independents / NOTA</span>
                    <span className="font-bold">
                      {(100 - selectedElection.winnerVoteShare - selectedElection.runnerUpVoteShare).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                    <div className="bg-amber-400 h-full rounded-full" style={{ width: `${(100 - selectedElection.winnerVoteShare - selectedElection.runnerUpVoteShare).toFixed(1)}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Segment Breakdown */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <h3 className="font-bold text-slate-900 text-sm mb-1">Constituency Assembly Breakdown</h3>
              <p className="text-xs text-slate-500 mb-3">Segment victory shares in {selectedElection.year}.</p>

              <div className="space-y-2 text-xs">
                {[
                  { segment: '214 - Kothrud', lead: '+88,400', turnout: '58.2%', status: 'Safe Stronghold' },
                  { segment: '215 - Shivajinagar', lead: '+42,100', turnout: '51.4%', status: 'Favorable' },
                  { segment: '212 - Parvati', lead: '+62,300', turnout: '54.0%', status: 'Safe Stronghold' },
                  { segment: '210 - Pune Cantonment', lead: '+14,200', turnout: '46.8%', status: 'Swing Pocket' }
                ].map((s, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-100">
                    <div>
                      <span className="font-bold text-slate-900 block">{s.segment}</span>
                      <span className="text-[10px] text-slate-400">Turnout: {s.turnout}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-emerald-600 block">{s.lead}</span>
                      <span className="text-[10px] text-slate-500">{s.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* MODE 2: Strategy Bot Chat Interface */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden flex flex-col h-[600px]">
          {/* Bot Mode Sub-header */}
          <div className="p-4 px-6 bg-gradient-to-r from-fuchsia-950 via-slate-900 to-indigo-950 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <Bot className="w-5 h-5 text-fuchsia-400 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm">Strategy Bot - Pune War Room Advisor</h3>
                  <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase ${
                    isBotLocked ? 'bg-amber-400 text-slate-950' : 'bg-emerald-500/30 text-emerald-200'
                  }`}>
                    {isBotLocked ? 'Locked / Pro' : 'Active Tier'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Trained on ECI 2009-2024 records and polling station registers</p>
              </div>
            </div>

            <button
              onClick={() => setIsBotLocked(!isBotLocked)}
              className="text-[11px] flex items-center gap-1 px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-white font-semibold transition-colors"
            >
              {isBotLocked ? <Unlock className="w-3.5 h-3.5 text-amber-300" /> : <Lock className="w-3.5 h-3.5 text-slate-300" />}
              <span>{isBotLocked ? 'Unlock Bot' : 'Simulate Lock'}</span>
            </button>
          </div>

          {isBotLocked ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mb-3">
                <Lock className="w-7 h-7" />
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-1">Strategy Bot Requires Pro License</h4>
              <p className="text-xs text-slate-500 max-w-sm mb-4">
                Conversational strategy optimization and booth vulnerability projections are unlocked on Election Module Pro.
              </p>
              <button
                onClick={() => setIsBotLocked(false)}
                className="px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-brand-700"
              >
                Unlock Strategy Bot Demo
              </button>
            </div>
          ) : (
            <>
              {/* Chat Thread */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/50">
                {chatMessages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {m.sender === 'bot' && (
                      <div className="w-8 h-8 rounded-lg bg-fuchsia-700 text-white flex items-center justify-center shrink-0">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}
                    <div
                      className={`max-w-[85%] rounded-2xl p-4 text-xs ${
                        m.sender === 'user'
                          ? 'bg-brand-600 text-white rounded-br-none'
                          : 'bg-white text-slate-800 rounded-bl-none border border-slate-200 shadow-xs'
                      }`}
                    >
                      <p className="whitespace-pre-line leading-relaxed">{m.text}</p>

                      {m.tableData && (
                        <div className="mt-3 pt-3 border-t border-slate-100">
                          <span className="font-bold text-slate-900 block mb-1 text-[11px]">
                            {m.tableData.heading}
                          </span>
                          <div className="divide-y divide-slate-100 bg-slate-50 rounded-lg p-2 border border-slate-100">
                            {m.tableData.rows.map((row, rIdx) => (
                              <div key={rIdx} className="flex justify-between py-1 text-[10px]">
                                <span className="font-semibold text-slate-800">{row[0]}</span>
                                <span className="font-bold text-emerald-700">{row[1]}</span>
                                <span className="text-slate-500">{row[2]}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex gap-2 items-center text-xs text-slate-400">
                    <div className="w-6 h-6 rounded bg-fuchsia-700 text-white flex items-center justify-center">
                      <Bot className="w-3 h-3" />
                    </div>
                    <span>Strategy Bot is computing booth turnout models...</span>
                  </div>
                )}
              </div>

              {/* Bot Input */}
              <div className="p-4 bg-white border-t border-slate-200 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Ask strategy question (e.g. 'What was the winning margin in 2019?' or 'Analyze swing booths')..."
                  value={botInput}
                  onChange={(e) => setBotInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendBot(botInput);
                  }}
                  className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-fuchsia-500 focus:bg-white"
                />
                <button
                  onClick={() => handleSendBot(botInput)}
                  disabled={!botInput.trim()}
                  className="p-2.5 bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-xl transition-colors disabled:opacity-40 shadow-xs"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
