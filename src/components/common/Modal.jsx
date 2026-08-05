import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-md' }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className={`w-full ${maxWidth} glass-card rounded-2xl p-6 border border-slate-800 shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar`}
        >
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
            <h3 className="text-base font-bold text-slate-100">{title}</h3>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div>{children}</div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
