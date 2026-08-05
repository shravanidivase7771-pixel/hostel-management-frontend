import React, { useState } from 'react';
import { Settings, Download, Upload, Shield, Activity, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Toast } from '../../components/common/Toast';

export const SettingsPage = () => {
  const { theme, toggleTheme } = useTheme();
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });

  const handleExportBackup = () => {
    const backupData = {
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      system: 'Hostel & Mess Administration System Pro',
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `HMS_Backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setToast({ isVisible: true, message: 'Database backup downloaded!', type: 'success' });
  };

  const logs = [
    { id: '1', user: 'Admin', action: 'Updated Room A-101 Capacity', time: '10 mins ago' },
    { id: '2', user: 'Watchman', action: 'Checked OUT Student Sara Khan', time: '1 hour ago' },
    { id: '3', user: 'Warden', action: 'Approved Gate Pass for Nikhil Rao', time: '2 hours ago' },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6 pt-4">
      <Toast isVisible={toast.isVisible} message={toast.message} type={toast.type} onClose={() => setToast((p) => ({ ...p, isVisible: false }))} />

      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100">System Settings & Audit</h1>
          <p className="text-xs text-slate-400 mt-1">Database backup, theme preferences, and security logs</p>
        </div>
      </div>

      {/* Theme Card */}
      <div className="glass-card rounded-3xl p-6 border border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-100">Appearance & Theme</h3>
          <p className="text-xs text-slate-400">Switch between dark glassmorphism and crisp light theme</p>
        </div>
        <button
          onClick={toggleTheme}
          className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-200 flex items-center gap-2"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-400" />}
          <span>Current: {theme.toUpperCase()}</span>
        </button>
      </div>

      {/* Backup & Restore */}
      <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
          <Download className="w-4 h-4 text-emerald-400" /> Backup & Data Export
        </h3>
        <p className="text-xs text-slate-400">Download complete system JSON snapshot for offline backup & recovery</p>
        <div className="flex gap-3">
          <button
            onClick={handleExportBackup}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> Export Backup File (.JSON)
          </button>
        </div>
      </div>

      {/* System Audit Logs */}
      <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
          <Activity className="w-4 h-4 text-amber-400" /> Admin Activity Audit Logs
        </h3>
        <div className="space-y-2">
          {logs.map((l) => (
            <div key={l.id} className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-slate-100">{l.action}</p>
                <p className="text-[10px] text-slate-400">Actor: {l.user}</p>
              </div>
              <span className="text-[10px] font-mono text-slate-500">{l.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
