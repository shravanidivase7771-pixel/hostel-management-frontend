import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Heart, Share2, Download, MapPin, Tag, UserCheck, Trash2 } from 'lucide-react';
import api from '../../services/axios';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../../components/common/Modal';
import { Toast } from '../../components/common/Toast';

export const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    venue: 'Main Auditorium',
    description: '',
    organizer: 'Hostel Committee',
    date: '2026-08-15',
    category: 'Cultural',
    banner: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
  });
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });
  const { user } = useAuth();

  const fetchEvents = async () => {
    try {
      const res = await api.get('/events');
      setEvents(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/events', formData);
      setIsModalOpen(false);
      setToast({ isVisible: true, message: 'Event published successfully!', type: 'success' });
      fetchEvents();
    } catch (err) {
      setToast({ isVisible: true, message: 'Failed to create event', type: 'error' });
    }
  };

  const handleLike = async (id) => {
    try {
      await api.post(`/events/${id}/like`);
      fetchEvents();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/events/${id}`);
      setToast({ isVisible: true, message: 'Event deleted', type: 'info' });
      fetchEvents();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <Toast isVisible={toast.isVisible} message={toast.message} type={toast.type} onClose={() => setToast((p) => ({ ...p, isVisible: false }))} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100">Hostel Events & Festivals</h1>
          <p className="text-xs text-slate-400 mt-1">Upcoming celebrations, sports tournaments, and cultural activities</p>
        </div>
        {user?.role === 'admin' && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/20 flex items-center gap-2 transition shrink-0"
          >
            <Plus className="w-4 h-4" /> Create New Event
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map((evt) => (
          <div key={evt._id || evt.id} className="glass-card rounded-3xl overflow-hidden border border-slate-800 space-y-4 relative flex flex-col justify-between">
            <div className="relative h-48 w-full overflow-hidden">
              <img src={evt.banner} alt={evt.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
              <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-indigo-600 text-white shadow-md">
                {evt.category || 'Cultural'}
              </span>
            </div>

            <div className="p-6 pt-0 space-y-3">
              <h3 className="text-lg font-extrabold text-slate-100">{evt.title}</h3>
              <p className="text-xs text-slate-400 line-clamp-2">{evt.description}</p>

              <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 pt-2 border-t border-slate-800">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-blue-400" /> <span>{evt.venue}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" /> <span>{evt.date}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <button
                  onClick={() => handleLike(evt._id || evt.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold transition"
                >
                  <Heart className="w-3.5 h-3.5 fill-rose-400" />
                  <span>{(evt.likes || []).length} Likes</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      setToast({ isVisible: true, message: 'Event link copied!', type: 'success' });
                    }}
                    className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
                    title="Share Event"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  {user?.role === 'admin' && (
                    <button
                      onClick={() => handleDelete(evt._id || evt.id)}
                      className="p-2 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                      title="Delete Event"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Event">
        <form onSubmit={handleCreate} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Event Title</label>
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
              <label className="block text-xs font-semibold text-slate-300 mb-1">Venue</label>
              <input
                type="text"
                value={formData.venue}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
            <textarea
              rows={3}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100"
            />
          </div>
          <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-slate-300">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs">
              Publish Event
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
