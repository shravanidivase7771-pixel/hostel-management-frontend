import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = ({ isVisible, message, type = 'success', onClose }) => {
  if (!isVisible) return null;

  const bgColors = {
    success: 'bg-emerald-950/90 border-emerald-500/40 text-emerald-300',
    error: 'bg-rose-950/90 border-rose-500/40 text-rose-300',
    info: 'bg-blue-950/90 border-blue-500/40 text-blue-300',
  };

  const icons = {
    success: CheckCircle2,
    error: AlertCircle,
    info: Info,
  };

  const Icon = icons[type] || CheckCircle2;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-2xl ${bgColors[type]}`}
      >
        <Icon className="w-5 h-5 shrink-0" />
        <span className="text-xs font-semibold">{message}</span>
        <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 ml-2">
          <X className="w-4 h-4" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};
