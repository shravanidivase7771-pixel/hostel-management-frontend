import React, { useState, useEffect } from 'react';
import { Menu, Sun, Moon, Bell, Search, User, Shield, CheckCircle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import api from '../../services/axios';

export const Navbar = ({ toggleSidebar }) => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const socket = useSocket();

  const [notifications, setNotifications] = useState([
    { id: '1', title: 'New Gatepass Request', message: 'Nikhil Rao requested a gate pass.', read: false },
    { id: '2', title: 'Mess Menu Updated', message: 'Sunday special menu updated.', read: false },
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!socket) return;

    socket.on('inout_updated', (data) => {
      setNotifications((prev) => [
        {
          id: Date.now().toString(),
          title: `Student Gate Alert (${data.status})`,
          message: `${data.studentName} has clicked ${data.status} at gate.`,
          read: false,
        },
        ...prev,
      ]);
    });

    socket.on('notification_sent', (data) => {
      setNotifications((prev) => [data, ...prev]);
    });

    return () => {
      socket.off('inout_updated');
      socket.off('notification_sent');
    };
  }, [socket]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <header className="sticky top-0 z-30 h-16 glass-panel border-b border-slate-800/80 px-4 flex items-center justify-between">
      {/* Mobile Toggle & Search */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => toggleSidebar((prev) => !prev)}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 md:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative hidden sm:block w-64 md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Global search (Student, Room, Payment...)"
            className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Theme Switcher */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl bg-slate-900/60 border border-slate-800/80 text-slate-300 hover:text-amber-400 hover:bg-slate-800/60 transition"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4 text-slate-700" />}
        </button>

        {/* Live Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl bg-slate-900/60 border border-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800/60 transition"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 glass-card rounded-2xl p-4 shadow-2xl z-50 border border-slate-800">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                <h4 className="text-xs font-bold text-slate-200">Live Notifications</h4>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-[10px] text-blue-400 hover:underline font-medium"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                {notifications.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-4">No notifications yet</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-2.5 rounded-xl border text-xs ${
                        n.read
                          ? 'bg-slate-900/40 border-slate-800/50 text-slate-400'
                          : 'bg-blue-500/10 border-blue-500/30 text-slate-200 font-medium'
                      }`}
                    >
                      <p className="font-semibold text-blue-400">{n.title}</p>
                      <p className="mt-0.5 text-[11px] opacity-90">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Role Badge */}
        <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-slate-800/80">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-blue-500/20">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="text-left">
            <p className="text-xs font-semibold text-slate-200 leading-tight">{user?.name || 'User'}</p>
            <p className="text-[10px] font-medium text-emerald-400 capitalize flex items-center gap-1">
              <CheckCircle className="w-3 h-3 inline" /> {user?.role || 'student'}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
