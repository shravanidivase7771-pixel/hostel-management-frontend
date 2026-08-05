import React, { useState, useEffect } from 'react';
import { ShieldCheck, AlertTriangle, Clock, PhoneCall, BedDouble, Users, CheckCircle, XCircle } from 'lucide-react';
import api from '../../services/axios';
import { Toast } from '../../components/common/Toast';

export const WardenDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [gatePasses, setGatePasses] = useState([]);
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });

  const fetchData = async () => {
    try {
      const [compRes, gateRes] = await Promise.all([
        api.get('/complaints'),
        api.get('/gatepasses'),
      ]);
      setComplaints(compRes.data || []);
      setGatePasses(gateRes.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApproveGatePass = async (id) => {
    try {
      await api.put(`/gatepasses/${id}`, { status: 'Approved' });
      setToast({ isVisible: true, message: 'Gate pass approved by Warden!', type: 'success' });
      fetchData();
    } catch (err) {
      setToast({ isVisible: true, message: 'Failed to update gate pass', type: 'error' });
    }
  };

  const handleResolveComplaint = async (id) => {
    try {
      await api.put(`/complaints/${id}`, { status: 'Resolved' });
      setToast({ isVisible: true, message: 'Complaint marked as resolved!', type: 'success' });
      fetchData();
    } catch (err) {
      setToast({ isVisible: true, message: 'Failed to update complaint', type: 'error' });
    }
  };

  return (
    <div className="space-y-6">
      <Toast
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((prev) => ({ ...prev, isVisible: false }))}
      />

      <div className="glass-card rounded-3xl p-6 border border-slate-800 bg-gradient-to-r from-indigo-950/40 via-slate-900 to-slate-950 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5 mb-1">
            <ShieldCheck className="w-4 h-4" /> Warden Supervision Office
          </span>
          <h1 className="text-2xl font-extrabold text-slate-100">Warden Dashboard</h1>
          <p className="text-xs text-slate-400 mt-1">Block A & B maintenance, leave approvals & discipline</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pending Leave / Gate Pass Approvals */}
        <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4" /> Pending Gate Pass Approvals
            </h3>
            <span className="text-xs text-slate-400 font-bold">{gatePasses.length} Requests</span>
          </div>
          <div className="space-y-3">
            {gatePasses.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">No pending gate pass requests</p>
            ) : (
              gatePasses.map((gp) => (
                <div key={gp._id || gp.id} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-bold text-slate-100">{gp.studentName} ({gp.roomNo})</h4>
                    <p className="text-[11px] text-slate-400">Reason: {gp.reason}</p>
                    <p className="text-[10px] text-amber-400">Out: {gp.outDate} | Return: {gp.returnDate}</p>
                  </div>
                  {gp.status !== 'Approved' ? (
                    <button
                      onClick={() => handleApproveGatePass(gp._id || gp.id)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition"
                    >
                      Approve
                    </button>
                  ) : (
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg">Approved</span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Complaints Needing Attention */}
        <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Open Complaints
            </h3>
            <span className="text-xs text-slate-400 font-bold">{complaints.length} Total</span>
          </div>
          <div className="space-y-3">
            {complaints.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">No complaints filed</p>
            ) : (
              complaints.map((c) => (
                <div key={c._id || c.id} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-100">{c.title}</h4>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-rose-500/20 text-rose-300">
                        {c.priority || 'High'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">By {c.studentName || 'Student'} ({c.roomNo})</p>
                  </div>
                  {c.status !== 'Resolved' ? (
                    <button
                      onClick={() => handleResolveComplaint(c._id || c.id)}
                      className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition"
                    >
                      Resolve
                    </button>
                  ) : (
                    <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-lg">Resolved</span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Emergency Contact Card */}
      <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-3 bg-gradient-to-br from-rose-950/20 to-slate-900">
        <h3 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-2">
          <PhoneCall className="w-4 h-4" /> Emergency Contact Card
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs">
            <p className="font-bold text-slate-200">Hostel Chief Warden</p>
            <p className="text-blue-400 font-mono font-bold mt-1">+91 98111 22334</p>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs">
            <p className="font-bold text-slate-200">Main Gate Watchman</p>
            <p className="text-amber-400 font-mono font-bold mt-1">+91 98222 33445</p>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs">
            <p className="font-bold text-slate-200">Campus Ambulance / Doctor</p>
            <p className="text-emerald-400 font-mono font-bold mt-1">+91 98333 44556</p>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs">
            <p className="font-bold text-slate-200">Local Police Station</p>
            <p className="text-rose-400 font-mono font-bold mt-1">102 / +91 98444 55667</p>
          </div>
        </div>
      </div>
    </div>
  );
};
