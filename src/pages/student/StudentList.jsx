import React, { useState, useEffect } from 'react';
import { Users, Plus, Search, Layers, GraduationCap, Phone, BedDouble, Trash2, Edit, Sparkles, Building } from 'lucide-react';
import api from '../../services/axios';
import { Modal } from '../../components/common/Modal';
import { Toast } from '../../components/common/Toast';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { useAuth } from '../../context/AuthContext';

export const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedFloor, setSelectedFloor] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, id: null });
  const [editingStudent, setEditingStudent] = useState(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    roomNo: 'A-101',
    floor: 1,
    course: 'Computer Science & Engineering',
    year: '3rd Year',
    parentName: 'Parent Name',
    parentPhone: '+91 99887 76655',
    gender: 'Male',
    messType: 'Veg',
    feeStatus: 'Paid',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  });

  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });
  const { user } = useAuth();

  const fetchStudents = async () => {
    try {
      const [stuRes, roomRes] = await Promise.all([
        api.get('/students'),
        api.get('/rooms').catch(() => ({ data: [] })),
      ]);
      setStudents(stuRes.data || []);
      setRooms(roomRes.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const openAddModal = () => {
    setEditingStudent(null);
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      roomNo: 'A-101',
      floor: 1,
      course: 'Computer Science & Engineering',
      year: '3rd Year',
      parentName: 'Parent Name',
      parentPhone: '+91 99887 76655',
      gender: 'Male',
      messType: 'Veg',
      feeStatus: 'Paid',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (stu) => {
    setEditingStudent(stu);
    setFormData({
      fullName: stu.fullName || stu.name || '',
      email: stu.email || '',
      phone: stu.phone || '',
      roomNo: stu.roomNo || 'A-101',
      floor: stu.floor || 1,
      course: stu.course || 'Computer Science & Engineering',
      year: stu.year || '3rd Year',
      parentName: stu.parentName || 'Parent Name',
      parentPhone: stu.parentPhone || '+91 99887 76655',
      gender: stu.gender || 'Male',
      messType: stu.messType || 'Veg',
      feeStatus: stu.feeStatus || 'Paid',
      photo: stu.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    });
    setIsModalOpen(true);
  };

  const handleSaveStudent = async (e) => {
    e.preventDefault();
    try {
      if (editingStudent) {
        await api.put(`/students/${editingStudent._id || editingStudent.id}`, formData);
        setToast({ isVisible: true, message: `Student ${formData.fullName} updated successfully!`, type: 'success' });
      } else {
        await api.post('/students', formData);
        setToast({ isVisible: true, message: `Student ${formData.fullName} added to Floor ${formData.floor}!`, type: 'success' });
      }
      setIsModalOpen(false);
      fetchStudents();
    } catch (err) {
      setToast({ isVisible: true, message: 'Failed to save student', type: 'error' });
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm.id) return;
    try {
      await api.delete(`/students/${deleteConfirm.id}`);
      setToast({ isVisible: true, message: 'Student record deleted', type: 'success' });
      setDeleteConfirm({ isOpen: false, id: null });
      fetchStudents();
    } catch (err) {
      setToast({ isVisible: true, message: 'Failed to delete student', type: 'error' });
    }
  };

  const floorFilterOptions = ['All', '1st Floor', '2nd Floor', '3rd Floor', '4th Floor'];

  const filteredStudents = students.filter((s) => {
    const sFloor = s.floor || 1;
    if (selectedFloor !== 'All') {
      const targetFloorNum = parseInt(selectedFloor);
      if (sFloor !== targetFloorNum) return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        (s.fullName || s.name || '').toLowerCase().includes(q) ||
        (s.studentId || '').toLowerCase().includes(q) ||
        (s.roomNo || '').toLowerCase().includes(q) ||
        (s.course || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <Toast isVisible={toast.isVisible} message={toast.message} type={toast.type} onClose={() => setToast((p) => ({ ...p, isVisible: false }))} />
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Delete Student Record"
        message="Are you sure you want to delete this student from the hostel register?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm({ isOpen: false, id: null })}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-100">Student Directory & Floor Records</h1>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-xs text-slate-400 mt-1">Floor-wise student list, room bed numbers, department & parent contact profiles</p>
        </div>
        {user?.role === 'admin' && (
          <button
            onClick={openAddModal}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/25 flex items-center gap-2 transition shrink-0 border border-white/20"
          >
            <Plus className="w-4 h-4" /> Add New Student
          </button>
        )}
      </div>

      {/* Floor Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-2">
        {floorFilterOptions.map((fl) => (
          <button
            key={fl}
            onClick={() => setSelectedFloor(fl)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all duration-300 ${
              selectedFloor === fl
                ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/20 scale-[1.02]'
                : 'bg-slate-900/90 text-slate-400 hover:text-slate-200 border border-amber-500/20'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5" /> {fl}
            </span>
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="glass-card rounded-2xl p-4 border border-amber-500/20">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Student Name, ID, Department, or Room Number..."
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-950/80 border border-amber-500/20 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition shadow-inner"
          />
        </div>
      </div>

      {/* Student Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.map((stu) => (
          <div
            key={stu._id || stu.id}
            className="glass-card rounded-3xl p-6 border border-amber-500/20 space-y-4 relative overflow-hidden flex flex-col justify-between hover:scale-[1.02] transition shadow-xl"
          >
            <div className="space-y-3">
              {/* Top Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={stu.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                    alt={stu.fullName || stu.name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-500/40 shadow-md shrink-0"
                  />
                  <div>
                    <h3 className="font-black text-sm text-slate-100">{stu.fullName || stu.name}</h3>
                    <p className="text-[11px] font-mono text-amber-400 font-bold">{stu.studentId || 'STU-2026'}</p>
                    <p className="text-[10px] text-slate-400 font-semibold">{stu.email}</p>
                  </div>
                </div>
              </div>

              {/* Badges Bar */}
              <div className="flex items-center gap-2 pt-1">
                <span className="px-3 py-1 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Floor {stu.floor || 1}
                </span>
                <span className="px-3 py-1 rounded-full text-[10px] font-black bg-orange-500/20 text-orange-300 border border-orange-500/30">
                  Room {stu.roomNo || 'A-101'}
                </span>
                <span className="px-3 py-1 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {stu.status || 'Inside Hostel'}
                </span>
              </div>

              {/* Department & Contact Info */}
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-amber-500/10 space-y-1.5 text-xs font-semibold">
                <div className="flex justify-between">
                  <span className="text-slate-400">Department / Course:</span>
                  <span className="text-slate-100 font-bold">{stu.course || 'Computer Science'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Batch / Year:</span>
                  <span className="text-amber-300 font-bold">{stu.year || '3rd Year'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Student Phone:</span>
                  <span className="text-slate-200 font-mono">{stu.phone || '+91 99887 76655'}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-800">
                  <span className="text-slate-400">Parent Phone:</span>
                  <span className="text-slate-300 font-mono">{stu.parentPhone || '+91 98765 43210'}</span>
                </div>
              </div>
            </div>

            {/* Admin Actions */}
            {user?.role === 'admin' && (
              <div className="pt-3 border-t border-amber-500/20 flex items-center justify-end gap-2">
                <button
                  onClick={() => openEditModal(stu)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 border border-amber-500/30 text-xs font-bold flex items-center gap-1 transition"
                >
                  <Edit className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => setDeleteConfirm({ isOpen: true, id: stu._id || stu.id })}
                  className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold flex items-center gap-1 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add / Edit Student Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingStudent ? 'Edit Student Details' : 'Add New Hostel Student'}>
        <form onSubmit={handleSaveStudent} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Full Student Name</label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-amber-500/20 text-xs text-slate-100"
              placeholder="e.g. Sara Khan"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Floor Number</label>
              <select
                value={formData.floor}
                onChange={(e) => setFormData({ ...formData, floor: parseInt(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-amber-500/20 text-xs text-slate-100"
              >
                <option value={1}>1st Floor</option>
                <option value={2}>2nd Floor</option>
                <option value={3}>3rd Floor</option>
                <option value={4}>4th Floor</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Room Number</label>
              <input
                type="text"
                required
                value={formData.roomNo}
                onChange={(e) => setFormData({ ...formData, roomNo: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-amber-500/20 text-xs text-slate-100"
                placeholder="e.g. A-101"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-amber-500/20 text-xs text-slate-100"
                placeholder="student@hostel.com"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Phone Number</label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-amber-500/20 text-xs text-slate-100"
                placeholder="+91 99887 76655"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Department / Course</label>
              <input
                type="text"
                value={formData.course}
                onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-amber-500/20 text-xs text-slate-100"
                placeholder="Computer Science & Engineering"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Year / Batch</label>
              <select
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-amber-500/20 text-xs text-slate-100"
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Parent Name</label>
              <input
                type="text"
                value={formData.parentName}
                onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-amber-500/20 text-xs text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Parent Phone</label>
              <input
                type="text"
                value={formData.parentPhone}
                onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-amber-500/20 text-xs text-slate-100"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-amber-500/20 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs shadow-lg"
            >
              Save Student Profile
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
