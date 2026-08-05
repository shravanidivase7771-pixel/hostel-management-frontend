import React, { useState, useEffect } from 'react';
import { UserCheck, Plus, Clock } from 'lucide-react';
import api from '../../services/axios';
import { DataTable } from '../../components/common/DataTable';
import { Modal } from '../../components/common/Modal';
import { Toast } from '../../components/common/Toast';

export const VisitorHistory = () => {
  const [visitors, setVisitors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    visitorName: '',
    studentName: 'Nikhil Rao',
    studentRoom: 'A-101',
    relation: 'Father',
    contact: '+91 98765 43210',
    purpose: 'Personal visit',
  });
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });

  const fetchVisitors = async () => {
    try {
      const res = await api.get('/visitors');
      setVisitors(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/visitors', {
        ...formData,
        inTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toISOString().split('T')[0],
        status: 'Checked In',
      });
      setIsModalOpen(false);
      setToast({ isVisible: true, message: 'Visitor checked in successfully!', type: 'success' });
      fetchVisitors();
    } catch (err) {
      setToast({ isVisible: true, message: 'Failed to record visitor', type: 'error' });
    }
  };

  const columns = [
    { header: 'Visitor Name', accessor: 'visitorName', render: (row) => <span className="font-bold text-slate-100">{row.visitorName}</span> },
    { header: 'Visiting Student', accessor: 'studentName', render: (row) => <span>{row.studentName}<br/><span className="text-[10px] text-slate-400">Room: {row.studentRoom}</span></span> },
    { header: 'Relation & Contact', accessor: 'relation', render: (row) => <span>{row.relation}<br/><span className="text-[10px] text-slate-400">{row.contact}</span></span> },
    { header: 'In / Out Time', accessor: 'inTime', render: (row) => <span className="font-mono text-slate-300">{row.inTime} - {row.outTime || 'Present'}</span> },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${row.status === 'Checked In' ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-400'}`}>
          {row.status || 'Checked Out'}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Toast isVisible={toast.isVisible} message={toast.message} type={toast.type} onClose={() => setToast((p) => ({ ...p, isVisible: false }))} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100">Visitor Gate Register</h1>
          <p className="text-xs text-slate-400 mt-1">Campus visitor logs, identity verification & exit timestamps</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-500/20 flex items-center gap-2 transition shrink-0"
        >
          <Plus className="w-4 h-4" /> Check In Visitor
        </button>
      </div>

      <DataTable columns={columns} data={visitors} searchField="visitorName" title="Visitor Log History" />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Visitor Check In">
        <form onSubmit={handleCreate} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Visitor Full Name</label>
            <input
              type="text"
              required
              value={formData.visitorName}
              onChange={(e) => setFormData({ ...formData, visitorName: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Visiting Student</label>
              <input
                type="text"
                value={formData.studentName}
                onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Student Room</label>
              <input
                type="text"
                value={formData.studentRoom}
                onChange={(e) => setFormData({ ...formData, studentRoom: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100"
              />
            </div>
          </div>
          <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-slate-300">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs">
              Confirm Check In
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
