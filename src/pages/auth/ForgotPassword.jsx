import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Building, Mail, ArrowLeft, Send } from 'lucide-react';
import { Toast } from '../../components/common/Toast';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setToast({ isVisible: true, message: 'Password reset link sent to your email!', type: 'success' });
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      <Toast
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((prev) => ({ ...prev, isVisible: false }))}
      />

      <div className="w-full max-w-md glass-card rounded-3xl p-8 border border-slate-800 shadow-2xl relative z-10">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/30 mb-3">
            <Building className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-100 tracking-tight">Reset Password</h2>
          <p className="text-xs text-slate-400 mt-1">Enter your registered email to receive reset instructions</p>
        </div>

        {submitted ? (
          <div className="text-center py-4 space-y-4">
            <p className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/30">
              Check your inbox! We've dispatched a password reset link to <span className="underline">{email}</span>.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-xs text-blue-400 hover:underline font-semibold"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
                  placeholder="name@hostel.com"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition"
            >
              <Send className="w-4 h-4" />
              <span>Send Reset Instructions</span>
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <Link to="/login" className="text-xs text-slate-400 hover:text-slate-200 inline-flex items-center gap-1 font-semibold">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};
