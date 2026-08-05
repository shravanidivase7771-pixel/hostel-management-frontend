import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Lock, Camera, Save, KeyRound } from 'lucide-react';
import { Toast } from '../../components/common/Toast';

export const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    const updated = { ...user, name, email };
    setUser(updated);
    localStorage.setItem('user', JSON.stringify(updated));
    setToast({ isVisible: true, message: 'Profile updated successfully!', type: 'success' });
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    setToast({ isVisible: true, message: 'Password changed successfully!', type: 'success' });
    setCurrentPassword('');
    setNewPassword('');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pt-4">
      <Toast isVisible={toast.isVisible} message={toast.message} type={toast.type} onClose={() => setToast((p) => ({ ...p, isVisible: false }))} />

      {/* Avatar Card */}
      <div className="glass-card rounded-3xl p-6 border border-slate-800 flex flex-col sm:flex-row items-center gap-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-2xl border-4 border-slate-800">
            {name ? name.charAt(0).toUpperCase() : 'U'}
          </div>
          <button className="absolute bottom-0 right-0 p-2 rounded-full bg-blue-600 text-white shadow-lg border-2 border-slate-950 hover:bg-blue-500">
            <Camera className="w-4 h-4" />
          </button>
        </div>
        <div className="text-center sm:text-left space-y-1">
          <h2 className="text-xl font-extrabold text-slate-100">{name}</h2>
          <p className="text-xs text-blue-400 font-semibold">{email}</p>
          <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 inline-block mt-2">
            Role: {user?.role || 'Student'}
          </span>
        </div>
      </div>

      {/* Edit Info */}
      <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
          <User className="w-4 h-4 text-blue-400" /> Account Personal Details
        </h3>
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:border-blue-500"
              />
            </div>
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/20 flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" /> Save Profile Info
          </button>
        </form>
      </div>

      {/* Change Password */}
      <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-indigo-400" /> Security & Change Password
        </h3>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Current Password</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">New Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100"
              />
            </div>
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/20"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};
