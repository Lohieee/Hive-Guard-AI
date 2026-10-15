import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, X, PhoneCall, Info } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'critical' | 'sms' | 'info';
  title: string;
  message: string;
  timestamp?: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 6000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const styles = {
    success: {
      bg: 'bg-emerald-900 text-white border-emerald-700',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    },
    warning: {
      bg: 'bg-amber-900 text-white border-amber-700',
      icon: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
    },
    critical: {
      bg: 'bg-rose-950 text-white border-rose-800',
      icon: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
    },
    sms: {
      bg: 'bg-slate-900 text-white border-amber-500/50 shadow-amber-500/10',
      icon: <PhoneCall className="w-5 h-5 text-amber-400 shrink-0 animate-bounce" />,
    },
    info: {
      bg: 'bg-slate-900 text-white border-slate-700',
      icon: <Info className="w-5 h-5 text-blue-400 shrink-0" />,
    },
  }[toast.type];

  return (
    <div
      className={`pointer-events-auto p-4 rounded-2xl border shadow-xl flex items-start gap-3 backdrop-blur-md transition-all duration-300 animate-in slide-in-from-bottom-5 ${styles.bg}`}
    >
      <div className="mt-0.5">{styles.icon}</div>
      <div className="flex-1 pr-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300/90">{toast.title}</h4>
        <p className="text-xs text-slate-200 mt-0.5 leading-snug">{toast.message}</p>
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-white/60 hover:text-white transition-colors p-1"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
