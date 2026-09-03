import React from 'react';
import { useStore } from '../context/StoreContext';
import { CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useStore();

  return (
    <div
      id="toast-container"
      className="fixed top-20 right-4 z-50 flex flex-col gap-3 max-w-md w-full pointer-events-none px-4"
    >
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            id={`toast-${t.id}`}
            className="pointer-events-auto flex items-start gap-3 p-4 rounded-xl bg-neutral-900/95 border border-neutral-800 shadow-2xl backdrop-blur-md"
            style={{
              borderLeftWidth: '4px',
              borderLeftColor:
                t.type === 'success' ? '#22c55e' : t.type === 'error' ? '#ef4444' : '#ff1e27',
              boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.8), 0 0 20px -5px rgba(255, 30, 39, 0.25)',
            }}
          >
            <div className="shrink-0 mt-0.5">
              {t.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              {t.type === 'error' && <AlertTriangle className="w-5 h-5 text-red-500" />}
              {t.type === 'info' && <Info className="w-5 h-5 text-red-400" />}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-white tracking-wide">{t.title}</h4>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">{t.message}</p>
            </div>

            <button
              onClick={() => removeToast(t.id)}
              className="text-neutral-500 hover:text-white transition-colors p-1"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
