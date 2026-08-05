import React, { useState } from 'react';
import { Wrench, Plus, CheckCircle, Clock, UserCheck } from 'lucide-react';
import { DataTable } from '../../components/common/DataTable';
import { Modal } from '../../components/common/Modal';
import { Toast } from '../../components/common/Toast';

export const MaintenancePage = () => {
  const [tasks, setTasks] = useState([
    { id: 'm1', title: 'AC Filter Cleaning', roomNo: 'A-101', staff: 'Electrician Team', priority: 'Medium', status: 'In Progress', date: '2026-07-29' },
    { id: 'm2', title: 'Bathroom Tap Repair', roomNo: 'B-204', staff: 'Ramesh Plumber', priority: 'High', status: 'Completed', date: '2026-07-28' },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', roomNo: 'A-101', staff: 'General Staff', priority: 'Medium' });
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });

  const handleCreate = (e) => {
    e.preventDefault();
    setTasks([{ id: Date.now().toString(), ...formData, status: 'In Progress', date: new Date().toISOString().split('T')[0] }, ...tasks]);
    setIsModalOpen(false);
    setToast({ isVisible: true, message: 'Maintenance task assigned!', type: 'success' });
  };

  const columns = [
    { header: 'Task Title', accessor: 'title', render: (row) => <span className="font-bold text-slate-100">{row.title}</span> },
    { header: 'Room No', accessor: 'roomNo', render: (row) => <span className="font-bold text-slate-300">{row.roomNo}</span> },
    { header: 'Assigned Staff', accessor: 'staff', render: (row) => <span className="text-blue-400 font-semibold">{row.staff}</span> },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase ${row.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>
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
          <h1 className="text-2xl font-extrabold text-slate-100">Hostel Maintenance Tracker</h1>
          <p className="text-xs text-slate-400 mt-1">Staff assignment, repair status, and work logs</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/20 flex items-center gap-2 transition shrink-0"
        >
          <Plus className="w-4 h-4" /> Raise Request
        </button>
      </div>

      <DataTable columns={columns} data={tasks} searchField="title" title="Maintenance Tasks" />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Assign Maintenance Task">
        <form onSubmit={handleCreate} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Task Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Room No</label>
              <input
                type="text"
                value={formData.roomNo}
                onChange={(e) => setFormData({ ...formData, roomNo: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Assigned Staff</label>
              <input
                type="text"
                value={formData.staff}
                onChange={(e) => setFormData({ ...formData, staff: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100"
              />
            </div>
          </div>
          <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-slate-300">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs">
              Assign Task
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
