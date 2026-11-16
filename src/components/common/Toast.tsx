import React, { createContext, useContext, useState } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'warning' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-2xl shadow-premium-lg text-sm font-semibold border backdrop-blur-md transition-all animate-slide-in ${
              toast.type === 'success'
                ? 'bg-blue-50/95 dark:bg-[#111C30]/95 text-blue-950 dark:text-blue-100 border-blue-200 dark:border-blue-800'
                : toast.type === 'error'
                ? 'bg-rose-50/95 dark:bg-rose-950/90 text-rose-950 dark:text-rose-100 border-rose-200 dark:border-rose-800'
                : toast.type === 'warning'
                ? 'bg-amber-50/95 dark:bg-amber-950/90 text-amber-950 dark:text-amber-100 border-amber-200 dark:border-amber-800'
                : 'bg-slate-900/95 text-white border-slate-700'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />}
              {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />}
              {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />}
              {toast.type === 'info' && <Info className="w-5 h-5 text-blue-400 shrink-0" />}
              <span className="leading-snug">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 rounded-lg shrink-0 transition-colors btn-tactile"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    return {
      showToast: (message: string, type: ToastType = 'info') => {
        console.info(`[Toast Fallback] (${type}): ${message}`);
      }
    };
  }
  return context;
};
