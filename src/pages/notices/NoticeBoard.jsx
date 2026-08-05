import React, { useState, useEffect } from 'react';
import { Bell, Pin, Plus, Download, FileText } from 'lucide-react';
import api from '../../services/axios';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../../components/common/Modal';
import { Toast } from '../../components/common/Toast';

export const NoticeBoard = () => {
  const [notices, setNotices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '', category: 'General', isPinned: false });
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });
  const { user } = useAuth();

  const fetchNotices = async () => {
    try {
      const res = await api.get('/notices');
      setNotices(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/notices', formData);
      setIsModalOpen(false);
      setToast({ isVisible: true, message: 'Notice posted on board!', type: 'success' });
      fetchNotices();
    } catch (err) {
      setToast({ isVisible: true, message: 'Failed to post notice', type: 'error' });
    }
  };

  return (
    <div className="space-y-6">
      <Toast isVisible={toast.isVisible} message={toast.message} type={toast.type} onClose={() => setToast((p) => ({ ...p, isVisible: false }))} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100">Digital Notice Board</h1>
          <p className="text-xs text-slate-400 mt-1">Official circulars, exam mess timings, and maintenance announcements</p>
        </div>
        {user?.role === 'admin' && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-500/20 flex items-center gap-2 transition shrink-0"
          >
            <Plus className="w-4 h-4" /> Post New Notice
          </button>
        )}
      </div>

      <div className="space-y-4">
        {notices.map((n) => (
          <div
            key={n._id || n.id}
            className={`glass-card rounded-3xl p-6 border space-y-3 relative transition ${
              n.isPinned
                ? 'border-amber-500/40 bg-gradient-to-r from-amber-950/20 via-slate-900 to-slate-950 shadow-xl'
                : 'border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {n.isPinned && <Pin className="w-4 h-4 text-amber-400 fill-amber-400" />}
                <h3 className="text-base font-extrabold text-slate-100">{n.title}</h3>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase">
                {n.category || 'General'}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">{n.content}</p>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-slate-800">
              <span>Posted by: <strong className="text-slate-200">{n.postedBy || 'Admin Office'}</strong></span>
              <span>{n.createdAt ? new Date(n.createdAt).toLocaleDateString() : 'Today'}</span>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Post Circular / Notice">
        <form onSubmit={handleCreate} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Notice Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Notice Content</label>
            <textarea
              rows={4}
              required
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="pin"
              checked={formData.isPinned}
              onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
            />
            <label htmlFor="pin" className="text-xs text-slate-300 font-medium">Pin this notice to top</label>
          </div>
          <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-slate-300">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs">
              Post Notice
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
