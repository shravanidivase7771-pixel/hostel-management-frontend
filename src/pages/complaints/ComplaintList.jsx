import React, { useState, useEffect } from 'react';
import { AlertTriangle, Plus, CheckCircle, Clock } from 'lucide-react';
import api from '../../services/axios';
import { DataTable } from '../../components/common/DataTable';
import { Modal } from '../../components/common/Modal';
import { Toast } from '../../components/common/Toast';

export const ComplaintList = () => {
  const [complaints, setComplaints] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Plumbing',
    priority: 'Medium',
    description: '',
  });
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });

  const fetchComplaints = async () => {
    try {
      const res = await api.get('/complaints');
      setComplaints(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/complaints', formData);
      setIsModalOpen(false);
      setToast({ isVisible: true, message: 'Complaint registered successfully!', type: 'success' });
      fetchComplaints();
    } catch (err) {
      setToast({ isVisible: true, message: 'Failed to submit complaint', type: 'error' });
    }
  };

  const columns = [
    { header: 'Title & Category', accessor: 'title', render: (row) => <div><p className="font-bold text-slate-100">{row.title}</p><p className="text-[10px] text-slate-400">{row.category}</p></div> },
    { header: 'Student & Room', accessor: 'studentName', render: (row) => <span>{row.studentName || 'Student'}<br/><span className="text-[10px] text-slate-400">{row.roomNo || 'A-101'}</span></span> },
    {
      header: 'Priority',
      accessor: 'priority',
      render: (row) => (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${row.priority === 'High' ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'}`}>
          {row.priority || 'Medium'}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase ${row.status === 'Resolved' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>
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
          <h1 className="text-2xl font-extrabold text-slate-100">Complaints Management</h1>
          <p className="text-xs text-slate-400 mt-1">Track student issue tickets, priority levels, and resolution status</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-500/20 flex items-center gap-2 transition shrink-0"
        >
          <Plus className="w-4 h-4" /> Raise Complaint
        </button>
      </div>

      <DataTable columns={columns} data={complaints} searchField="title" title="Complaint Tickets" />

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Raise New Complaint">
        <form onSubmit={handleCreate} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Issue Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100"
              placeholder="e.g. Water heater leak"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100"
              >
                <option value="Plumbing">Plumbing</option>
                <option value="Electrical">Electrical</option>
                <option value="Wi-Fi">Wi-Fi & Network</option>
                <option value="Cleanliness">Cleanliness</option>
                <option value="Mess Food">Mess Food</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100"
            />
          </div>
          <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
            >
              Submit Ticket
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
