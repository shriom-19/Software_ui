import React, { useRef } from 'react';
import { X, Printer, Download, MapPin, CheckCircle, QrCode } from 'lucide-react';
import { Voter } from '../../types';
import { CURRENT_ELECTION_CONTEXT } from '../../data/mockData';

interface VoterSlipModalProps {
  voter: Voter | null;
  onClose: () => void;
}

export const VoterSlipModal: React.FC<VoterSlipModalProps> = ({ voter, onClose }) => {
  const printRef = useRef<HTMLDivElement>(null);

  if (!voter) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h3 className="font-bold text-slate-800 text-lg">Official Voter Information Slip</h3>
            <p className="text-xs text-slate-500">Democracy Outreach • Verified Electoral Record</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Voter Slip Preview */}
        <div className="p-6 overflow-y-auto max-h-[75vh]">
          <div
            ref={printRef}
            className="border-2 border-dashed border-slate-300 rounded-xl p-5 bg-gradient-to-b from-amber-50/20 via-white to-blue-50/20 shadow-sm relative text-slate-800"
          >
            {/* Slip Header */}
            <div className="border-b border-slate-200 pb-3 mb-3 text-center">
              <div className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 uppercase tracking-wider mb-1">
                ELECTION VOTER INFORMATION CARD
              </div>
              <h4 className="font-extrabold text-base text-slate-900">{CURRENT_ELECTION_CONTEXT.electionName}</h4>
              <p className="text-xs font-semibold text-brand-700">{CURRENT_ELECTION_CONTEXT.constituency}</p>
              <p className="text-[11px] text-slate-500">Candidate: <span className="font-bold text-slate-700">{CURRENT_ELECTION_CONTEXT.candidateName}</span> ({CURRENT_ELECTION_CONTEXT.partyName})</p>
            </div>

            {/* Voter Details Grid */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="col-span-2 space-y-1.5 text-xs">
                <div>
                  <span className="text-slate-500 block text-[11px]">Voter Full Name:</span>
                  <span className="font-bold text-slate-900 text-sm">{voter.fullName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">{voter.relationType}'s Name:</span>
                  <span className="font-medium text-slate-800">{voter.relativeName}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <span className="text-slate-500 text-[11px]">Age / Gender:</span>
                    <p className="font-bold text-slate-800">{voter.age} Yrs / {voter.gender}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px]">EPIC (Voter ID):</span>
                    <p className="font-mono font-bold text-brand-700">{voter.epicNumber}</p>
                  </div>
                </div>
              </div>

              {/* Photo & QR */}
              <div className="flex flex-col items-center justify-between border-l border-slate-200 pl-3">
                <div className="w-16 h-20 bg-slate-100 border border-slate-300 rounded flex flex-col items-center justify-center text-slate-400 text-[10px] text-center p-1">
                  <span>VOTER PHOTO</span>
                </div>
                <div className="mt-2 flex flex-col items-center">
                  <QrCode className="w-8 h-8 text-slate-700" />
                  <span className="text-[9px] text-slate-400">Scan for Map</span>
                </div>
              </div>
            </div>

            {/* Booth Information Box */}
            <div className="bg-brand-50/70 border border-brand-200 rounded-lg p-3 text-xs mb-3">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-brand-700 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-brand-900">Booth #{voter.boothNumber}</span>
                    <span className="font-mono font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-brand-200">
                      Serial No: {voter.serialNo}
                    </span>
                  </div>
                  <p className="text-slate-700 font-medium mt-1">{voter.pollingStation}</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">{voter.address}</p>
                </div>
              </div>
            </div>

            {/* Footer Notice */}
            <div className="text-[10px] text-slate-500 border-t border-slate-200 pt-2 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-emerald-600" /> Verified via Indata Electoral Roll
              </span>
              <span>Valid along with standard Govt Photo ID</span>
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="flex items-center justify-end gap-3 px-6 py-3 bg-slate-50 border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-sm transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Slip</span>
          </button>
        </div>
      </div>
    </div>
  );
};
