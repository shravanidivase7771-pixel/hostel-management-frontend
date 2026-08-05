import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Building2, Lock, Mail, Shield, User, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { Toast } from '../../components/common/Toast';

export const Login = () => {
  const [role, setRole] = useState('admin');
  const [email, setEmail] = useState('admin@hostel.com');
  const [password, setPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(true);
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });

  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleRoleSwitch = (selectedRole) => {
    setRole(selectedRole);
    if (selectedRole === 'admin') setEmail('admin@hostel.com');
    else if (selectedRole === 'student') setEmail('student@hostel.com');
    else if (selectedRole === 'warden') setEmail('warden@hostel.com');
    else if (selectedRole === 'watchman') setEmail('watchman@hostel.com');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);

    if (result.success) {
      setToast({ isVisible: true, message: 'Login successful! Redirecting...', type: 'success' });
      setTimeout(() => {
        const userRole = result.user?.role || role;
        if (userRole === 'student') navigate('/dashboard/student');
        else if (userRole === 'warden') navigate('/dashboard/warden');
        else if (userRole === 'watchman') navigate('/dashboard/watchman');
        else navigate('/dashboard/admin');
      }, 800);
    } else {
      setToast({ isVisible: true, message: result.message || 'Invalid credentials', type: 'error' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0d14] flex items-center justify-center p-4 lg:p-8 relative overflow-hidden">
      <Toast
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((prev) => ({ ...prev, isVisible: false }))}
      />

      {/* Decorative Orbs */}
      <div className="absolute top-10 left-10 w-96 h-96 rounded-full bg-amber-500/15 blur-3xl animate-pulse" />
      <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-orange-600/15 blur-3xl animate-pulse" />

      {/* Split Screen Container */}
      <div className="w-full max-w-5xl glass-card rounded-3xl overflow-hidden border border-amber-500/20 shadow-2xl grid grid-cols-1 lg:grid-cols-2 relative z-10">
        
        {/* Left Side: Warm Luxury Illustration & Showcase */}
        <div className="relative p-8 md:p-12 bg-gradient-to-br from-amber-600 via-orange-600 to-amber-700 flex flex-col justify-between overflow-hidden">
          {/* Animated Background SVG blobs */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-amber-400/20 blur-2xl animate-float" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-orange-400/20 blur-2xl animate-float" />

          {/* Logo & Headline */}
          <div className="relative z-10 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-950/40 backdrop-blur-md flex items-center justify-center text-amber-300 border border-white/20 shadow-xl">
              <Building2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-black uppercase tracking-widest text-amber-200 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-yellow-300" /> Commercial Enterprise Suite
              </span>
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
                Hostel & Mess Administration
              </h1>
              <p className="text-xs text-amber-100/90 leading-relaxed pt-2">
                Automated room allocation, real-time Watchman gate sync, digital QR IDs, mess menus, and PDF fee receipts.
              </p>
            </div>
          </div>

          {/* SVG Artwork Illustration */}
          <div className="relative z-10 my-8 py-4 flex justify-center">
            <svg className="w-64 h-48 drop-shadow-2xl" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="50" y="80" width="300" height="180" rx="20" fill="#0f141f" fillOpacity="0.8" stroke="#fef3c7" strokeWidth="2"/>
              <rect x="80" y="110" width="60" height="60" rx="10" fill="#f59e0b" fillOpacity="0.3" stroke="#fde047" strokeWidth="1.5"/>
              <rect x="170" y="110" width="60" height="60" rx="10" fill="#f97316" fillOpacity="0.3" stroke="#fde047" strokeWidth="1.5"/>
              <rect x="260" y="110" width="60" height="60" rx="10" fill="#f59e0b" fillOpacity="0.3" stroke="#fde047" strokeWidth="1.5"/>
              <path d="M50 80L200 20L350 80" stroke="#fef3c7" strokeWidth="4" strokeLinecap="round"/>
              <circle cx="200" cy="50" r="12" fill="#fbbf24"/>
              <rect x="165" y="190" width="70" height="70" rx="8" fill="#d97706"/>
            </svg>
          </div>

          {/* Highlights */}
          <div className="relative z-10 flex items-center justify-between text-[11px] font-extrabold text-amber-100 border-t border-white/20 pt-4">
            <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-yellow-300" /> Socket.IO Sync</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-yellow-300" /> Multi-Role Portal</span>
          </div>
        </div>

        {/* Right Side: Glassmorphism Login Form */}
        <div className="p-8 md:p-12 flex flex-col justify-center space-y-6 bg-slate-950/80 backdrop-blur-xl">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-slate-100 tracking-tight">Sign In to Your Account</h2>
            <p className="text-xs text-slate-400">Select your role to access your personalized workspace</p>
          </div>

          {/* Role Selector Tabs */}
          <div className="grid grid-cols-4 gap-1 p-1.5 bg-slate-900 rounded-2xl border border-amber-500/20">
            {['admin', 'student', 'warden', 'watchman'].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => handleRoleSwitch(r)}
                className={`py-2 text-[11px] font-black capitalize rounded-xl transition-all duration-300 ${
                  role === r
                    ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/30 scale-[1.03]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-extrabold text-slate-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-900/90 border border-amber-500/20 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition shadow-inner"
                  placeholder="Enter email"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-extrabold text-slate-300">Password</label>
                <Link to="/forgot-password" className="text-[11px] text-amber-400 font-extrabold hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-900/90 border border-amber-500/20 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition shadow-inner"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-400 font-semibold">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded accent-amber-500"
                />
                <span>Remember me</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 transition disabled:opacity-50 mt-4 border border-white/20"
            >
              <span>{loading ? 'Authenticating...' : `Sign In as ${role.toUpperCase()}`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="text-center text-xs text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-amber-400 font-extrabold hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
