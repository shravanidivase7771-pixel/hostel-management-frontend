import React, { useState, useEffect } from 'react';
import { ShieldCheck, Plus, CheckCircle, Clock } from 'lucide-react';
import api from '../../services/axios';
import { DataTable } from '../../components/common/DataTable';
import { Modal } from '../../components/common/Modal';
import { Toast } from '../../components/common/Toast';

export const GatePassList = () => {
  const [passes, setPasses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    studentName: 'Nikhil Rao',
    roomNo: 'A-101',
    reason: 'Medical Checkup',
    destination: 'City Hospital',
    outDate: '2026-07-30',
    returnDate: '2026-07-30',
  });
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });

  const fetchPasses = async () => {
    try {
      const res = await api.get('/gatepasses');
      setPasses(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPasses();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/gatepasses', formData);
      setIsModalOpen(false);
      setToast({ isVisible: true, message: 'Gate pass requested!', type: 'success' });
      fetchPasses();
    } catch (err) {
      setToast({ isVisible: true, message: 'Failed to request gate pass', type: 'error' });
    }
  };

  const columns = [
    { header: 'Student Name', accessor: 'studentName', render: (row) => <span className="font-bold text-slate-100">{row.studentName}</span> },
    { header: 'Room', accessor: 'roomNo', render: (row) => <span className="font-bold text-slate-300">{row.roomNo}</span> },
    { header: 'Reason & Destination', accessor: 'reason', render: (row) => <span>{row.reason}<br/><span className="text-[10px] text-slate-400">Dest: {row.destination}</span></span> },
    { header: 'Out / Return Date', accessor: 'outDate', render: (row) => <span className="font-mono text-amber-400">{row.outDate} → {row.returnDate}</span> },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase ${row.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>
          {row.status || 'Pending'}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Toast isVisible={toast.isVisible} message={toast.message} type={toast.type} onClose={() => setToast((p) => ({ ...p, isVisible: false }))} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100">Student Gate Pass Clearance</h1>
          <p className="text-xs text-slate-400 mt-1">Leave applications, medical emergency passes & warden approvals</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/20 flex items-center gap-2 transition shrink-0"
        >
          <Plus className="w-4 h-4" /> Request Gate Pass
        </button>
      </div>

      <DataTable columns={columns} data={passes} searchField="studentName" title="Gate Pass Applications" />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Apply for Gate Pass">
        <form onSubmit={handleCreate} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Reason for Leaving</label>
            <input
              type="text"
              required
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Destination Address</label>
            <input
              type="text"
              required
              value={formData.destination}
              onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Out Date</label>
              <input
                type="date"
                value={formData.outDate}
                onChange={(e) => setFormData({ ...formData, outDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Return Date</label>
              <input
                type="date"
                value={formData.returnDate}
                onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100"
              />
            </div>
          </div>
          <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-slate-300">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs">
              Submit Application
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
