import React from 'react';
import { LogOut, AlertCircle } from 'lucide-react';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const LogoutModal: React.FC<LogoutModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-[#111C30] rounded-3xl shadow-2xl max-w-md w-full border border-slate-200 dark:border-[#273750] overflow-hidden p-6 text-center animate-scale-up">
        <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-4 border border-rose-200 dark:border-rose-900/50">
          <LogOut className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-[#F1F5FC] mb-1">Confirm Portal Logout</h3>
        <p className="text-sm text-slate-500 dark:text-[#A5B3C9] mb-6">
          Are you sure you want to end your active session on Indata Candidate Admin Portal? You will need to log in again to access election war room records.
        </p>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-[#A5B3C9] bg-slate-100 dark:bg-[#17243A] hover:bg-slate-200 dark:hover:bg-[#1f304d] rounded-xl transition-colors btn-tactile"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-sm transition-colors btn-tactile"
          >
            Yes, Log Out
          </button>
        </div>
      </div>
    </div>
  );
};
