import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, ShieldCheck, ArrowRightLeft, BedDouble, UtensilsCrossed, FileBarChart, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Home = () => {
  const { user } = useAuth();

  const getDashboardRoute = () => {
    switch (user?.role) {
      case 'student':
        return '/dashboard/student';
      case 'warden':
        return '/dashboard/warden';
      case 'watchman':
        return '/dashboard/watchman';
      default:
        return '/dashboard/admin';
    }
  };

  const featureCards = [
    { title: 'Real-Time Watchman Module', desc: 'Instant student check-out/check-in with live Socket.IO dashboard sync across all roles.', icon: ArrowRightLeft, color: 'text-amber-400', bg: 'from-amber-600/20 to-slate-900 border-amber-500/30' },
    { title: 'Floor & Room Allocations', desc: 'Floor-wise bed capacity tracking, room amenities, and resident student department records.', icon: BedDouble, color: 'text-orange-400', bg: 'from-orange-600/20 to-slate-900 border-orange-500/30' },
    { title: 'Mess & Food Management', desc: 'Daily special thalis, weekly menu calendar, food quality ratings, and mess subscriptions.', icon: UtensilsCrossed, color: 'text-emerald-400', bg: 'from-emerald-600/20 to-slate-900 border-emerald-500/30' },
    { title: 'Analytics & PDF Reports', desc: 'Interactive Recharts analytics, audit trails, and one-click Excel/PDF report downloads.', icon: FileBarChart, color: 'text-yellow-400', bg: 'from-yellow-600/20 to-slate-900 border-yellow-500/30' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0d14] text-slate-100 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-amber-600/15 blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-orange-600/15 blur-3xl" />

      {/* Top Navbar */}
      <nav className="glass-panel sticky top-0 z-40 border-b border-amber-500/20 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/30 border border-white/20">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-black text-lg animated-warm-text">HMS PRO</h1>
            <p className="text-[10px] text-amber-400 font-extrabold uppercase tracking-widest">Hostel Administration</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <Link
              to={getDashboardRoute()}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/30 flex items-center gap-2 transition border border-white/20"
            >
              <span>Go to {user.role.toUpperCase()} Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <Link
              to="/login"
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/30 flex items-center gap-2 transition border border-white/20"
            >
              <span>Sign In Portal</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-extrabold shadow-sm">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span>Next-Gen Student Hostel & Mess Software</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-100 tracking-tight leading-tight">
              Commercial Grade <span className="animated-warm-text">Hostel Management</span> System
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed">
              Complete multi-role platform for Admins, Students, Wardens, and Watchmen with real-time Socket.IO check-in/out gate synchronization, floor allocations, digital QR passes, and mess billing.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to="/login"
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow-xl shadow-amber-500/30 flex items-center gap-2 transition border border-white/20"
              >
                <span>Launch Portal</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Hero Banner Image */}
          <div className="glass-card rounded-3xl p-3 border border-amber-500/20 shadow-2xl relative group overflow-hidden">
            <img
              src="https://media.licdn.com/dms/image/v2/D4D12AQHAvVyCouSs9g/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1684146941612?e=2147483647&v=beta&t=R2kELfbiRdbSynFyTSMAdLvErItkwRbY-5yzyrm5578"
              alt="Student Hostel Management Software Guide"
              className="w-full h-80 md:h-96 object-cover rounded-2xl group-hover:scale-105 transition duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl glass-panel border border-amber-500/20">
              <p className="text-xs font-black text-slate-100">The Ultimate Student Hostel Management Software</p>
              <p className="text-[10px] text-amber-400 font-bold mt-0.5">Automated Allocation • Real-time Gate Security • Digital Mess</p>
            </div>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
          {featureCards.map((c, i) => {
            const Icon = c.icon;
            return (
              <div key={i} className={`glass-card rounded-3xl p-6 border bg-gradient-to-b ${c.bg} space-y-3`}>
                <div className={`p-3 rounded-2xl bg-slate-950/80 border border-amber-500/20 inline-block ${c.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-black text-slate-100">{c.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{c.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
