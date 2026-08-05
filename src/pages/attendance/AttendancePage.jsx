import React, { useState, useEffect } from 'react';
import { ClipboardCheck, Calendar, CheckCircle2, XCircle, Clock } from 'lucide-react';
import api from '../../services/axios';
import { DataTable } from '../../components/common/DataTable';
import { Toast } from '../../components/common/Toast';

export const AttendancePage = () => {
  const [attendance, setAttendance] = useState([]);
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });

  const fetchAttendance = async () => {
    try {
      const res = await api.get('/attendance');
      setAttendance(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const markAttendance = async (studentId, status) => {
    try {
      await api.post('/attendance', { studentId, status, date: new Date().toISOString().split('T')[0] });
      setToast({ isVisible: true, message: `Attendance marked ${status}!`, type: 'success' });
      fetchAttendance();
    } catch (err) {
      setToast({ isVisible: true, message: 'Failed to mark attendance', type: 'error' });
    }
  };

  const columns = [
    { header: 'Student Name', accessor: 'studentName', render: (row) => <span className="font-bold text-slate-100">{row.studentName}</span> },
    { header: 'Room No', accessor: 'roomNo', render: (row) => <span className="font-bold text-slate-300">{row.roomNo || 'A-101'}</span> },
    { header: 'Date', accessor: 'date', render: (row) => <span className="font-mono text-slate-400">{row.date}</span> },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <span
          className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase ${
            row.status === 'Present'
              ? 'bg-emerald-500/20 text-emerald-300'
              : row.status === 'Absent'
              ? 'bg-rose-500/20 text-rose-300'
              : 'bg-amber-500/20 text-amber-300'
          }`}
        >
          {row.status}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Toast isVisible={toast.isVisible} message={toast.message} type={toast.type} onClose={() => setToast((p) => ({ ...p, isVisible: false }))} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100">Daily & Monthly Attendance</h1>
          <p className="text-xs text-slate-400 mt-1">Night curfew attendance verification and monthly log history</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => markAttendance('STU-2026-001', 'Present')}
            className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md flex items-center gap-1"
          >
            <CheckCircle2 className="w-3.5 h-3.5" /> Mark Present
          </button>
          <button
            onClick={() => markAttendance('STU-2026-001', 'Absent')}
            className="px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md flex items-center gap-1"
          >
            <XCircle className="w-3.5 h-3.5" /> Mark Absent
          </button>
        </div>
      </div>

      <DataTable columns={columns} data={attendance} searchField="studentName" title="Attendance History Records" />
    </div>
  );
};
