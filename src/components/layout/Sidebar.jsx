import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  BedDouble,
  ClipboardCheck,
  AlertTriangle,
  Wrench,
  CreditCard,
  UtensilsCrossed,
  UserCheck,
  ArrowRightLeft,
  Bell,
  Calendar,
  Image,
  FileBarChart,
  MessageSquare,
  User,
  Settings,
  ShieldCheck,
  LogOut,
  Building2,
  QrCode,
  Sparkles,
  PhoneCall
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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

  // Dedicated role-based navigation item lists
  const adminLinks = [
    { label: 'Admin Dashboard', path: '/dashboard/admin', icon: LayoutDashboard },
    { label: 'Watchman Gate Desk', path: '/inout', icon: ArrowRightLeft, highlight: true },
    { label: 'Student Directory', path: '/students', icon: Users },
    { label: 'Rooms & Allocations', path: '/rooms', icon: BedDouble },
    { label: 'Attendance Logs', path: '/attendance', icon: ClipboardCheck },
    { label: 'Complaints Tickets', path: '/complaints', icon: AlertTriangle },
    { label: 'Maintenance Work', path: '/maintenance', icon: Wrench },
    { label: 'Fee Payments', path: '/payments', icon: CreditCard },
    { label: 'Mess & Food Menu', path: '/mess', icon: UtensilsCrossed },
    { label: 'Visitor Register', path: '/visitors', icon: UserCheck },
    { label: 'Gate Passes', path: '/gatepass', icon: ShieldCheck },
    { label: 'Notice Board', path: '/notices', icon: Bell },
    { label: 'Events & Fests', path: '/events', icon: Calendar },
    { label: 'Memories Gallery', path: '/gallery', icon: Image },
    { label: 'Reports & Export', path: '/reports', icon: FileBarChart },
    { label: 'Ratings & Feedback', path: '/feedback', icon: MessageSquare },
    { label: 'Profile Account', path: '/profile', icon: User },
    { label: 'System Settings', path: '/settings', icon: Settings },
  ];

  const studentLinks = [
    { label: 'Student Dashboard', path: '/dashboard/student', icon: LayoutDashboard },
    { label: 'My Profile', path: '/profile', icon: User },
    { label: 'My Room Details', path: '/rooms', icon: BedDouble },
    { label: 'My Digital QR ID', path: '/student-qr', icon: QrCode },
    { label: 'My Attendance', path: '/attendance', icon: ClipboardCheck },
    { label: 'My Complaints', path: '/complaints', icon: AlertTriangle },
    { label: 'Apply Leave / Gate Pass', path: '/gatepass', icon: ShieldCheck },
    { label: 'Maintenance Request', path: '/maintenance', icon: Wrench },
    { label: 'Mess Menu & Rating', path: '/mess', icon: UtensilsCrossed },
    { label: 'Payment History', path: '/payments', icon: CreditCard },
    { label: 'Visitor History', path: '/visitors', icon: UserCheck },
    { label: 'My In-Out History', path: '/inout', icon: ArrowRightLeft },
    { label: 'Hostel Events', path: '/events', icon: Calendar },
    { label: 'Memories Gallery', path: '/gallery', icon: Image },
    { label: 'Notice Board', path: '/notices', icon: Bell },
    { label: 'Feedback & Rating', path: '/feedback', icon: MessageSquare },
  ];

  const wardenLinks = [
    { label: 'Warden Dashboard', path: '/dashboard/warden', icon: LayoutDashboard },
    { label: 'Student Directory', path: '/students', icon: Users },
    { label: 'Room Occupancy', path: '/rooms', icon: BedDouble },
    { label: 'Approve Leaves & Passes', path: '/gatepass', icon: ShieldCheck, highlight: true },
    { label: 'Monitor Complaints', path: '/complaints', icon: AlertTriangle },
    { label: 'Assign Maintenance', path: '/maintenance', icon: Wrench },
    { label: 'View Reports', path: '/reports', icon: FileBarChart },
    { label: 'Notice Board', path: '/notices', icon: Bell },
    { label: 'Profile Account', path: '/profile', icon: User },
  ];

  const watchmanLinks = [
    { label: 'Watchman Gate Desk', path: '/dashboard/watchman', icon: LayoutDashboard, highlight: true },
    { label: 'Student In / Out Log', path: '/inout', icon: ArrowRightLeft },
    { label: 'Visitor Entry & Exit', path: '/visitors', icon: UserCheck },
    { label: 'QR Gate Pass Verify', path: '/student-qr', icon: QrCode },
    { label: 'Search Room Details', path: '/rooms', icon: BedDouble },
    { label: 'Notice Board', path: '/notices', icon: Bell },
    { label: 'Profile Account', path: '/profile', icon: User },
  ];

  const getLinksForRole = () => {
    switch (user?.role) {
      case 'student':
        return studentLinks;
      case 'warden':
        return wardenLinks;
      case 'watchman':
        return watchmanLinks;
      default:
        return adminLinks;
    }
  };

  const navLinksToRender = getLinksForRole();

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen w-64 glass-panel transition-all duration-300 border-r border-amber-500/20 shadow-2xl ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}
    >
      <div className="flex flex-col h-full px-4 py-5">
        {/* Brand Logo Header */}
        <div className="flex items-center gap-3 px-3 pb-5 border-b border-amber-500/20">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20 border border-white/20">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <h1 className="font-black text-lg tracking-tight animated-warm-text">
                HOSTEL HMS
              </h1>
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            </div>
            <p className="text-[10px] text-amber-400 font-extrabold uppercase tracking-widest">
              {user?.role || 'User'} Portal
            </p>
          </div>
        </div>

        {/* User Card */}
        <div className="mt-4 mb-3 p-3.5 rounded-2xl bg-gradient-to-r from-slate-900/90 to-amber-950/30 border border-amber-500/20 flex items-center gap-3 shadow-inner">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 font-black flex items-center justify-center border border-white/20 text-xs shadow-md">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-black truncate text-slate-100">{user?.name || 'User Name'}</p>
            <p className="text-[10px] text-amber-400 font-extrabold truncate capitalize flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping inline-block" /> {user?.role || 'student'}
            </p>
          </div>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
          {navLinksToRender.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => toggleSidebar && toggleSidebar(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-extrabold transition-all duration-300 relative group ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/25 border border-white/20 scale-[1.02]'
                      : link.highlight
                      ? 'bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/30'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0 transition group-hover:scale-110" />
                <span className="truncate">{link.label}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Logout */}
        <div className="pt-4 border-t border-amber-500/20">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-2xl text-xs font-black text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition shadow-md"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
