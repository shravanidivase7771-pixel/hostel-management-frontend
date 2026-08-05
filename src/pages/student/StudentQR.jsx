import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { QRCodeSVG } from 'qrcode.react';
import { QrCode, ShieldCheck, Download, Printer } from 'lucide-react';

export const StudentQR = () => {
  const { user } = useAuth();
  const studentId = user?.studentId || 'STU-2026-001';

  return (
    <div className="max-w-md mx-auto space-y-6 pt-6">
      <div className="glass-card rounded-3xl p-8 border border-slate-800 text-center space-y-6 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-blue-600/20 blur-2xl" />

        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center mb-2 border border-blue-500/30">
            <QrCode className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-black text-slate-100">Official Student QR ID</h2>
          <p className="text-xs text-slate-400">Scan at Main Gate for Watchman verification & Gate Pass clearance</p>
        </div>

        <div className="p-6 rounded-3xl bg-white/95 border-4 border-slate-800 shadow-2xl inline-block">
          <QRCodeSVG
            value={JSON.stringify({
              studentId,
              name: user?.name || 'Nikhil Rao',
              roomNo: user?.roomNo || 'A-101',
              verified: true,
            })}
            size={180}
            bgColor="#ffffff"
            fgColor="#0f172a"
            level="H"
          />
        </div>

        <div className="space-y-1 text-xs">
          <p className="font-extrabold text-slate-100 text-base">{user?.name || 'Nikhil Rao'}</p>
          <p className="font-mono text-blue-400 font-bold">{studentId}</p>
          <p className="text-slate-400">Room: A-101 | Block A | CSE 3rd Year</p>
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-center gap-3">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 transition"
          >
            <Printer className="w-4 h-4 text-emerald-400" />
            <span>Print ID Pass</span>
          </button>
        </div>
      </div>
    </div>
  );
};
