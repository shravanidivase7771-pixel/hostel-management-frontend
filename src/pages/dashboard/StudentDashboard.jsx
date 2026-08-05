import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { QRCodeSVG } from 'qrcode.react';
import { Utensils, Bell, Calendar, QrCode, Gift, CreditCard, ArrowRightLeft, Sparkles, UserCheck } from 'lucide-react';
import api from '../../services/axios';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const socket = useSocket();

  const [studentStatus, setStudentStatus] = useState('Inside Hostel');
  const [messMenu, setMessMenu] = useState({});
  const [notices, setNotices] = useState([]);
  const [events, setEvents] = useState([]);

  const studentId = user?.studentId || 'STU-2026-001';
  const roomNo = user?.roomNo || 'A-101';

  useEffect(() => {
    // Resilient data fetching for student portal
    const loadData = async () => {
      try {
        const messRes = await api.get('/mess').catch(() => ({ data: {} }));
        const noticeRes = await api.get('/notices').catch(() => ({ data: [] }));
        const eventRes = await api.get('/events').catch(() => ({ data: [] }));

        setMessMenu(messRes.data?.messInfo || messRes.data || {});
        setNotices(Array.isArray(noticeRes.data) ? noticeRes.data : []);
        setEvents(Array.isArray(eventRes.data) ? eventRes.data : []);
      } catch (err) {
        console.error('Student dashboard fetch error:', err);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on('inout_updated', (data) => {
      if (data && (data.studentId === studentId || data.studentName === user?.name)) {
        setStudentStatus(data.status === 'OUT' ? 'Outside Hostel' : 'Inside Hostel');
      }
    });
    return () => socket.off('inout_updated');
  }, [socket, studentId, user?.name]);

  return (
    <div className="space-y-6">
      {/* Student Welcome Banner */}
      <div className="glass-card rounded-3xl p-6 border border-amber-500/20 bg-gradient-to-r from-amber-950/60 via-slate-900 to-orange-950/60 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-amber-500/15 blur-3xl" />
        <div className="flex items-center gap-4 relative z-10">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
            alt={user?.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-500/50 shadow-xl"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-100">Welcome, {user?.name || 'Student'}!</h1>
              <span
                className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border flex items-center gap-1 ${
                  studentStatus === 'Outside Hostel'
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                }`}
              >
                <ArrowRightLeft className="w-3 h-3" /> {studentStatus}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 font-semibold">
              Room: <span className="text-amber-300 font-bold">{roomNo}</span> | ID: <span className="text-orange-400 font-mono font-extrabold">{studentId}</span>
            </p>
          </div>
        </div>

        {/* Digital QR ID Pass */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="p-3 rounded-2xl bg-slate-950/80 border border-amber-500/20 flex items-center gap-3 shadow-inner">
            <QRCodeSVG value={`STUDENT:${studentId}`} size={46} bgColor="transparent" fgColor="#f59e0b" />
            <div className="text-left">
              <p className="text-[10px] text-amber-400 font-black uppercase tracking-wider">Digital Pass</p>
              <p className="text-xs font-black text-slate-100">Verified Student</p>
            </div>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Today's Special Mess Menu */}
        <div className="glass-card rounded-3xl p-6 border border-amber-500/20 space-y-3 bg-gradient-to-br from-amber-950/30 to-slate-900">
          <div className="flex items-center justify-between pb-2 border-b border-amber-500/20">
            <h3 className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <Utensils className="w-4 h-4" /> Today's Mess Special
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30">Veg / Non-Veg</span>
          </div>
          <p className="text-sm font-black text-slate-100">
            {messMenu?.todaySpecial || 'Special Paneer Butter Masala & Gulab Jamun'}
          </p>
          <div className="text-[11px] text-slate-400 space-y-1 pt-1 font-semibold">
            <p><strong className="text-amber-300">Breakfast:</strong> Poha, Tea, Boiled Eggs</p>
            <p><strong className="text-amber-300">Lunch:</strong> Dal Tadka, Jeera Rice, Chapati, Salad</p>
            <p><strong className="text-amber-300">Dinner:</strong> Paneer Masala, Rice, Sweet Dessert</p>
          </div>
        </div>

        {/* Fee & Gate Pass Summary */}
        <div className="glass-card rounded-3xl p-6 border border-amber-500/20 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-amber-500/20">
            <h3 className="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-400" /> Fee & Account Status
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Cleared</span>
          </div>
          <div className="space-y-2 font-semibold">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Hostel Monthly Fee:</span>
              <span className="font-bold text-emerald-400">₹12,000 (Paid)</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Mess Monthly Subscription:</span>
              <span className="font-bold text-emerald-400">₹3,500 (Paid)</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Gate Pass Clearance:</span>
              <span className="font-bold text-amber-400">Active / Allowed</span>
            </div>
          </div>
        </div>

        {/* Birthday Widget */}
        <div className="glass-card rounded-3xl p-6 border border-amber-500/20 space-y-3 bg-gradient-to-br from-purple-950/30 to-slate-900">
          <div className="flex items-center justify-between pb-2 border-b border-amber-500/20">
            <h3 className="text-xs font-black text-purple-400 uppercase tracking-wider flex items-center gap-2">
              <Gift className="w-4 h-4" /> Hostel Birthday Celebration
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black bg-purple-500/20 text-purple-300 border border-purple-500/30">Today</span>
          </div>
          <div className="flex items-center gap-3 pt-1">
            <div className="w-10 h-10 rounded-full bg-purple-500/20 text-purple-400 font-bold flex items-center justify-center text-xs">
              🎉
            </div>
            <div>
              <p className="text-xs font-black text-slate-100">Sara Khan (Room B-204)</p>
              <p className="text-[10px] text-slate-400 font-semibold">Wishing her a very Happy Birthday today!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Notices & Events */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Notice Board */}
        <div className="glass-card rounded-3xl p-6 border border-amber-500/20 space-y-3">
          <h3 className="text-xs font-black text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <Bell className="w-4 h-4 text-amber-400" /> Pinned Hostel Notices
          </h3>
          <div className="space-y-2">
            {notices.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-2">No active notices posted</p>
            ) : (
              notices.slice(0, 3).map((n) => (
                <div key={n._id || n.id} className="p-3.5 rounded-2xl bg-slate-950/80 border border-amber-500/10">
                  <h4 className="text-xs font-extrabold text-amber-400">{n.title}</h4>
                  <p className="text-[11px] text-slate-300 mt-1">{n.content}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="glass-card rounded-3xl p-6 border border-amber-500/20 space-y-3">
          <h3 className="text-xs font-black text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <Calendar className="w-4 h-4 text-orange-400" /> Upcoming Hostel Fests & Events
          </h3>
          <div className="space-y-2">
            {events.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-2">No upcoming events scheduled</p>
            ) : (
              events.slice(0, 2).map((evt) => (
                <div key={evt._id || evt.id} className="p-3.5 rounded-2xl bg-slate-950/80 border border-amber-500/10 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-100">{evt.title}</h4>
                    <p className="text-[10px] text-slate-400 font-semibold">{evt.venue} | Date: {evt.date}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-xl text-[10px] font-black bg-orange-500/20 text-orange-300 border border-orange-500/30">
                    {evt.category || 'Event'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
