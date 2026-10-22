import React, { useState } from 'react';
import {
  Search,
  Phone,
  MessageSquare,
  Users,
  Vote,
  ExternalLink,
  Filter,
  CheckCircle2,
  Clock,
  Shield
} from 'lucide-react';
import { MOCK_VOTERS, MOCK_USERS } from '../../data/mockData';
import { Voter, User } from '../../types';
import { useToast } from '../../components/common/Toast';

interface PhoneBookViewProps {
  onSelectVoter: (voter: Voter) => void;
  onSelectUser: (user: User) => void;
}

export const PhoneBookView: React.FC<PhoneBookViewProps> = ({
  onSelectVoter,
  onSelectUser
}) => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'voters' | 'users'>('voters');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredVoters = MOCK_VOTERS.filter(v =>
    v.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.mobile.includes(searchTerm) ||
    v.epicNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = MOCK_USERS.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.phone.includes(searchTerm) ||
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCall = (name: string, phone: string) => {
    showToast(`Click-to-Call triggered for ${name} (${phone}) - safe simulated dialer.`, 'info');
  };

  const handleWhatsApp = (name: string, phone: string) => {
    showToast(`Simulated WhatsApp dialogue opened for ${name} (${phone}).`, 'info');
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Communication Directory
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
              Verified Contacts
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 mt-1">
            Constituency Phone Book
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Quick click-to-call and WhatsApp outreach for voters and campaign personnel.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600">
          <button
            onClick={() => setActiveTab('voters')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              activeTab === 'voters' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            <Vote className="w-4 h-4 text-brand-600" />
            <span>Voter Contacts ({filteredVoters.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              activeTab === 'users' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4 text-teal-600" />
            <span>Campaign Team ({filteredUsers.length})</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={
              activeTab === 'voters'
                ? "Search voter name, phone number, or EPIC ID..."
                : "Search campaign staff, Karyakartas, or role..."
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500 focus:bg-white"
          />
        </div>
      </div>

      {/* Contacts List Grid */}
      {activeTab === 'voters' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVoters.map((voter) => (
            <div
              key={voter.id}
              className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-brand-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm hover:text-brand-600 cursor-pointer" onClick={() => onSelectVoter(voter)}>
                      {voter.fullName}
                    </h3>
                    <p className="text-xs text-slate-500">Booth #{voter.boothNumber} • Sr {voter.serialNo}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    voter.politicalLeaning === 'STRONG_SUPPORTER' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {voter.politicalLeaning.replace('_', ' ')}
                  </span>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs space-y-1 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Mobile Phone:</span>
                    <span className="font-mono font-bold text-slate-800">{voter.mobile}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">EPIC ID:</span>
                    <span className="font-mono text-brand-700">{voter.epicNumber}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => handleCall(voter.fullName, voter.mobile)}
                  className="flex-1 py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Call</span>
                </button>
                <button
                  onClick={() => handleWhatsApp(voter.fullName, voter.mobile)}
                  className="flex-1 py-1.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                  <span>WhatsApp</span>
                </button>
                <button
                  onClick={() => onSelectVoter(voter)}
                  className="p-1.5 text-slate-400 hover:text-brand-600 rounded-lg hover:bg-slate-100 transition-colors"
                  title="View Full Profile"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-brand-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm hover:text-brand-600 cursor-pointer" onClick={() => onSelectUser(user)}>
                      {user.name}
                    </h3>
                    <p className="text-xs text-brand-700 font-semibold">{user.role.replace('_', ' ')}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800">
                    {user.status}
                  </span>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs space-y-1 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Direct Contact:</span>
                    <span className="font-mono font-bold text-slate-800">{user.phone}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Assigned Area:</span>
                    <span className="text-slate-700">{user.prabhaag || 'All Booths'}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => handleCall(user.name, user.phone)}
                  className="flex-1 py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Call Team</span>
                </button>
                <button
                  onClick={() => handleWhatsApp(user.name, user.phone)}
                  className="flex-1 py-1.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                  <span>WhatsApp</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
