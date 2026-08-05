import React, { useEffect, useState } from 'react';
import {
  Users,
  BedDouble,
  CheckCircle,
  XCircle,
  AlertTriangle,
  UserCheck,
  CreditCard,
  ClipboardCheck,
  Wrench,
  Clock,
  TrendingUp,
  Activity,
  ArrowRightLeft,
  Sparkles,
  Zap
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  AreaChart, Area,
  LineChart, Line
} from 'recharts';
import api from '../../services/axios';
import { useSocket } from '../../context/SocketContext';
import { SkeletonCard, SkeletonTable } from '../../components/common/Skeleton';

export const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const socket = useSocket();

  const fetchDashboardData = async () => {
    try {
      const res = await api.get('/dashboard/summary');
      setData(res.data);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on('dashboard_stats_changed', () => {
      fetchDashboardData();
    });
    return () => socket.off('dashboard_stats_changed');
  }, [socket]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard />
        </div>
        <SkeletonTable rows={4} />
      </div>
    );
  }

  const s = data?.summary || {};
  const analytics = data?.analytics || {};

  const PIE_COLORS = ['#f59e0b', '#10b981', '#f97316', '#ef4444', '#8b5cf6'];

  const cards = [
    { label: 'Total Students', value: s.totalStudents || 0, icon: Users, color: 'text-amber-400', bg: 'from-amber-600/20 to-slate-900 border-amber-500/30' },
    { label: 'Total Rooms', value: s.totalRooms || 0, icon: BedDouble, color: 'text-orange-400', bg: 'from-orange-600/20 to-slate-900 border-orange-500/30' },
    { label: 'Occupied Rooms', value: s.occupiedRooms || 0, icon: CheckCircle, color: 'text-emerald-400', bg: 'from-emerald-600/20 to-slate-900 border-emerald-500/30' },
    { label: 'Available Rooms', value: s.availableRooms || 0, icon: XCircle, color: 'text-yellow-400', bg: 'from-yellow-600/20 to-slate-900 border-yellow-500/30' },
    { label: 'Inside Hostel', value: s.studentsInside || 0, icon: UserCheck, color: 'text-teal-400', bg: 'from-teal-600/20 to-slate-900 border-teal-500/30' },
    { label: 'Outside Hostel', value: s.studentsOutside || 0, icon: ArrowRightLeft, color: 'text-rose-400', bg: 'from-rose-600/25 to-slate-900 border-rose-500/40', highlight: true },
    { label: 'Today Attendance', value: s.todayAttendance || 0, icon: ClipboardCheck, color: 'text-amber-400', bg: 'from-amber-600/20 to-slate-900 border-amber-500/30' },
    { label: 'Today Visitors', value: s.todayVisitors || 0, icon: Users, color: 'text-purple-400', bg: 'from-purple-600/20 to-slate-900 border-purple-500/30' },
    { label: 'Today Payments', value: s.todayPayments || 0, icon: CreditCard, color: 'text-emerald-400', bg: 'from-emerald-600/20 to-slate-900 border-emerald-500/30' },
    { label: 'Pending Complaints', value: s.pendingComplaints || 0, icon: AlertTriangle, color: 'text-rose-400', bg: 'from-rose-600/20 to-slate-900 border-rose-500/30' },
    { label: 'Pending Leaves', value: s.pendingLeaves || 0, icon: Clock, color: 'text-amber-400', bg: 'from-amber-600/20 to-slate-900 border-amber-500/30' },
    { label: 'Pending Maintenance', value: s.pendingMaintenance || 0, icon: Wrench, color: 'text-orange-400', bg: 'from-orange-600/20 to-slate-900 border-orange-500/30' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="glass-card rounded-3xl p-7 border border-amber-500/20 bg-gradient-to-r from-amber-950/60 via-slate-900 to-orange-950/60 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden shadow-2xl">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-amber-500/15 blur-3xl" />
        <div className="space-y-1 relative z-10">
          <span className="text-xs font-black uppercase tracking-widest text-amber-400 flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-300" /> Executive Overview Portal
          </span>
          <h1 className="text-3xl font-black text-slate-100 tracking-tight">Admin Control Center</h1>
          <p className="text-xs text-slate-400">Real-time statistics & interactive analytics graphs</p>
        </div>
        <div className="flex items-center gap-3 relative z-10">
          <div className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 text-xs font-black shadow-lg shadow-amber-500/30 border border-white/20 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-slate-950" /> Occupancy Rate: {s.occupancyRate || 0}%
          </div>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className={`glass-card rounded-2xl p-4 border bg-gradient-to-b transition-all duration-300 hover:scale-[1.03] ${card.bg} ${
                card.highlight ? 'ring-2 ring-rose-500/50 glow-amber' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-xl bg-slate-950/70 border border-white/10 ${card.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[9px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  Live
                </span>
              </div>
              <p className="text-[11px] font-bold text-slate-400 truncate">{card.label}</p>
              <h3 className="text-xl font-black text-slate-100 mt-1">{card.value}</h3>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart: Attendance Analytics */}
        <div className="glass-card rounded-3xl p-6 border border-amber-500/20 space-y-4">
          <h3 className="text-xs font-black text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-amber-400" /> Attendance Trends (Monthly)
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.monthlyAttendance || []}>
                <defs>
                  <linearGradient id="barAmber" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity={1} />
                    <stop offset="100%" stopColor="#b45309" stopOpacity={0.6} />
                  </linearGradient>
                  <linearGradient id="barRed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity={1} />
                    <stop offset="100%" stopColor="#b91c1c" stopOpacity={0.6} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#0f141f', borderColor: '#d97706', borderRadius: '12px', fontSize: '11px', color: '#f8fafc' }} />
                <Bar dataKey="present" fill="url(#barAmber)" radius={[8, 8, 0, 0]} name="Present %" />
                <Bar dataKey="absent" fill="url(#barRed)" radius={[8, 8, 0, 0]} name="Absent %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart: Room Occupancy */}
        <div className="glass-card rounded-3xl p-6 border border-amber-500/20 space-y-4">
          <h3 className="text-xs font-black text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <BedDouble className="w-4 h-4 text-emerald-400" /> Room Occupancy Ratio
          </h3>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.roomOccupancy || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={6}
                  dataKey="value"
                >
                  {(analytics.roomOccupancy || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f141f', borderColor: '#d97706', borderRadius: '12px', fontSize: '11px', color: '#f8fafc' }} />
                <Legend wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Area Chart: Payment Analytics */}
        <div className="glass-card rounded-3xl p-6 border border-amber-500/20 space-y-4">
          <h3 className="text-xs font-black text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-amber-400" /> Payment Revenue Collections (₹)
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.paymentTrends || []}>
                <defs>
                  <linearGradient id="areaAmber" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="areaEmerald" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#0f141f', borderColor: '#d97706', borderRadius: '12px', fontSize: '11px', color: '#f8fafc' }} />
                <Area type="monotone" dataKey="hostelFees" stroke="#f59e0b" strokeWidth={3} fill="url(#areaAmber)" name="Hostel Fees" />
                <Area type="monotone" dataKey="messFees" stroke="#10b981" strokeWidth={3} fill="url(#areaEmerald)" name="Mess Fees" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Line Chart: Complaint Analytics */}
        <div className="glass-card rounded-3xl p-6 border border-amber-500/20 space-y-4">
          <h3 className="text-xs font-black text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" /> Complaints Resolution Dynamics
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.complaintAnalytics || []}>
                <XAxis dataKey="category" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#0f141f', borderColor: '#d97706', borderRadius: '12px', fontSize: '11px', color: '#f8fafc' }} />
                <Line type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={3} name="Resolved" dot={{ r: 4 }} />
                <Line type="monotone" dataKey="open" stroke="#ef4444" strokeWidth={3} name="Open" dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent System Audit Logs */}
      <div className="glass-card rounded-3xl p-6 border border-amber-500/20 space-y-4">
        <h3 className="text-xs font-black text-slate-100 uppercase tracking-wider flex items-center gap-2">
          <Activity className="w-4 h-4 text-amber-400" /> Live Audit Trail
        </h3>
        <div className="space-y-2">
          {(data?.recentActivities || []).map((act, i) => (
            <div key={i} className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/90 border border-amber-500/10 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 font-black flex items-center justify-center text-xs shadow-md">
                  {act.user ? act.user.charAt(0) : 'S'}
                </div>
                <div>
                  <p className="font-bold text-slate-100">{act.action}</p>
                  <p className="text-[10px] text-slate-400">By {act.user || 'System'}</p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-slate-500">
                {act.timestamp ? new Date(act.timestamp).toLocaleTimeString() : 'Just now'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
