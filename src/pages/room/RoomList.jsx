import React, { useState, useEffect } from 'react';
import { BedDouble, Plus, CheckCircle, XCircle, Users, Layers, GraduationCap, Phone, MapPin, UserPlus, Sparkles, Building } from 'lucide-react';
import api from '../../services/axios';
import { Modal } from '../../components/common/Modal';
import { Toast } from '../../components/common/Toast';
import { useAuth } from '../../context/AuthContext';

export const RoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedFloor, setSelectedFloor] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedRoomForAssign, setSelectedRoomForAssign] = useState(null);
  const [assignStudentId, setAssignStudentId] = useState('');

  const [formData, setFormData] = useState({
    roomNumber: 'A-103',
    block: 'Block A',
    floor: 1,
    type: 'Single',
    capacity: 1,
    rentPerMonth: 12000,
    facilities: 'AC, Wi-Fi, Attached Bath',
  });

  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });
  const { user } = useAuth();

  const fetchRooms = async () => {
    try {
      const [roomsRes, studentsRes] = await Promise.all([
        api.get('/rooms'),
        api.get('/students'),
      ]);
      setRooms(roomsRes.data || []);
      setStudents(studentsRes.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    try {
      await api.post('/rooms', {
        ...formData,
        facilities: formData.facilities.split(',').map((s) => s.trim()),
      });
      setIsModalOpen(false);
      setToast({ isVisible: true, message: `Room ${formData.roomNumber} added to Floor ${formData.floor}!`, type: 'success' });
      fetchRooms();
    } catch (err) {
      setToast({ isVisible: true, message: 'Failed to create room', type: 'error' });
    }
  };

  const handleAssignStudent = async (e) => {
    e.preventDefault();
    if (!selectedRoomForAssign || !assignStudentId) return;

    try {
      const stu = students.find((s) => s._id === assignStudentId || s.id === assignStudentId || s.studentId === assignStudentId);
      if (stu) {
        await api.put(`/students/${stu._id || stu.id}`, { roomNo: selectedRoomForAssign.roomNumber });
      }
      setIsAssignModalOpen(false);
      setToast({ isVisible: true, message: `Student assigned to Room ${selectedRoomForAssign.roomNumber}!`, type: 'success' });
      fetchRooms();
    } catch (err) {
      setToast({ isVisible: true, message: 'Failed to assign room', type: 'error' });
    }
  };

  const floorsList = [1, 2, 3, 4];
  const floorFilterOptions = ['All', '1st Floor', '2nd Floor', '3rd Floor', '4th Floor'];

  // Compute floor breakdown statistics
  const getFloorStats = (floorNum) => {
    const floorRooms = rooms.filter((r) => r.floor === floorNum);
    const totalRooms = floorRooms.length;
    const occupied = floorRooms.reduce((acc, r) => acc + (r.occupancy || 0), 0);
    const capacity = floorRooms.reduce((acc, r) => acc + (r.capacity || 1), 0);
    const availableBeds = capacity - occupied;

    // Collect all resident students on this floor
    const residentStudents = [];
    floorRooms.forEach((r) => {
      if (r.assignedStudents && r.assignedStudents.length > 0) {
        r.assignedStudents.forEach((stu) => {
          residentStudents.push({ ...stu, roomNumber: r.roomNumber });
        });
      }
    });

    return { totalRooms, occupied, capacity, availableBeds, residentStudents };
  };

  const filteredRooms = rooms.filter((r) => {
    if (selectedFloor === 'All') return true;
    const floorNum = parseInt(selectedFloor);
    return r.floor === floorNum;
  });

  return (
    <div className="space-y-6">
      <Toast isVisible={toast.isVisible} message={toast.message} type={toast.type} onClose={() => setToast((p) => ({ ...p, isVisible: false }))} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-100">Floor & Room Allocations</h1>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-xs text-slate-400 mt-1">Detailed breakdown of rooms per floor, capacity, and resident student department records</p>
        </div>
        {user?.role === 'admin' && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/25 flex items-center gap-2 transition shrink-0 border border-white/20"
          >
            <Plus className="w-4 h-4" /> Add New Room
          </button>
        )}
      </div>

      {/* Floor-by-Floor Summary Cards Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {floorsList.map((flNum) => {
          const stats = getFloorStats(flNum);
          return (
            <div
              key={flNum}
              onClick={() => setSelectedFloor(`${flNum}st Floor`)}
              className="glass-card rounded-2xl p-4 border border-amber-500/20 bg-gradient-to-b from-amber-950/20 to-slate-900 cursor-pointer hover:scale-[1.02] transition shadow-xl"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    <Building className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-black text-slate-100">{flNum}th Floor</h3>
                </div>
                <span className="text-[10px] font-black text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30">
                  {stats.totalRooms} Rooms
                </span>
              </div>
              <div className="space-y-1 mt-3">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-400">Total Beds:</span>
                  <span className="text-slate-100 font-bold">{stats.capacity}</span>
                </div>
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-400">Occupied:</span>
                  <span className="text-emerald-400 font-bold">{stats.occupied}</span>
                </div>
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-400">Available Beds:</span>
                  <span className="text-amber-400 font-bold">{stats.availableBeds}</span>
                </div>
                <div className="flex justify-between text-xs font-semibold pt-1 border-t border-amber-500/10">
                  <span className="text-slate-400">Resident Students:</span>
                  <span className="text-orange-400 font-black">{stats.residentStudents.length} Students</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floor Filter Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-2 pt-2">
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
              <Layers className="w-3.5 h-3.5" /> {fl}
            </span>
          </button>
        ))}
      </div>

      {/* Room Cards Grid with Resident Student Profiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map((r) => {
          const isFull = (r.occupancy || 0) >= (r.capacity || 1);
          return (
            <div
              key={r._id || r.id}
              className="glass-card rounded-3xl p-6 border border-amber-500/20 space-y-4 relative overflow-hidden flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 font-black flex items-center justify-center border border-white/20 shadow-md">
                      <BedDouble className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-black text-lg text-slate-100">{r.roomNumber}</h3>
                        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          Floor {r.floor || 1}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-semibold">{r.block || 'Block A'} • {r.type || r.roomType || 'Single'} Room</p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                      isFull ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    }`}
                  >
                    {isFull ? 'Full' : 'Available'}
                  </span>
                </div>

                {/* Occupancy Progress */}
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-300">
                    <span>Bed Occupancy:</span>
                    <span className="font-mono text-emerald-400 font-bold">{r.occupancy || 0} / {r.capacity || 1} Beds</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-amber-500/20">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isFull ? 'bg-rose-500' : 'bg-gradient-to-r from-amber-500 to-emerald-400'
                      }`}
                      style={{ width: `${Math.min(((r.occupancy || 0) / (r.capacity || 1)) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Facilities Pills */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(r.facilities || ['AC', 'Wi-Fi', 'Attached Bath']).map((f, i) => (
                    <span key={i} className="px-2.5 py-0.5 rounded-lg bg-slate-950/80 text-[10px] font-extrabold text-slate-400 border border-amber-500/10">
                      {f}
                    </span>
                  ))}
                </div>

                {/* Assigned Resident Students Section */}
                <div className="pt-3 border-t border-amber-500/20 space-y-2">
                  <h4 className="text-[11px] font-black text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-amber-400" /> Resident Students ({ (r.assignedStudents || []).length })
                  </h4>
                  {(r.assignedStudents || []).length === 0 ? (
                    <p className="text-xs text-slate-500 italic py-1">No student currently assigned to this room</p>
                  ) : (
                    (r.assignedStudents || []).map((stu, i) => (
                      <div key={i} className="p-3 rounded-2xl bg-slate-950/80 border border-amber-500/20 flex items-center gap-3">
                        <img
                          src={stu.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                          alt={stu.name}
                          className="w-10 h-10 rounded-xl object-cover border border-amber-500/30 shrink-0 shadow-md"
                        />
                        <div className="overflow-hidden flex-1">
                          <p className="font-black text-xs text-slate-100 truncate">{stu.name}</p>
                          <p className="text-[10px] font-bold text-amber-400 truncate">
                            Department: {stu.course || 'Computer Science'} ({stu.year || '3rd Year'})
                          </p>
                          <p className="text-[9px] text-slate-500 font-mono">ID: {stu.studentId} • {stu.phone}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Action Button */}
              {user?.role === 'admin' && !isFull && (
                <button
                  onClick={() => {
                    setSelectedRoomForAssign(r);
                    setIsAssignModalOpen(true);
                  }}
                  className="w-full mt-3 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-amber-400 border border-amber-500/30 text-xs font-black flex items-center justify-center gap-1.5 transition"
                >
                  <UserPlus className="w-3.5 h-3.5" /> Assign Student to Room
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Room Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Hostel Room">
        <form onSubmit={handleCreateRoom} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Room Number</label>
            <input
              type="text"
              required
              value={formData.roomNumber}
              onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-amber-500/20 text-xs text-slate-100"
              placeholder="e.g. A-103"
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
              <label className="block text-xs font-bold text-slate-300 mb-1">Block</label>
              <input
                type="text"
                value={formData.block}
                onChange={(e) => setFormData({ ...formData, block: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-amber-500/20 text-xs text-slate-100"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Room Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-amber-500/20 text-xs text-slate-100"
              >
                <option value="Single">Single</option>
                <option value="Double">Double</option>
                <option value="Triple">Triple</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Monthly Rent (₹)</label>
              <input
                type="number"
                value={formData.rentPerMonth}
                onChange={(e) => setFormData({ ...formData, rentPerMonth: parseInt(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-amber-500/20 text-xs text-slate-100"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Facilities (comma separated)</label>
            <input
              type="text"
              value={formData.facilities}
              onChange={(e) => setFormData({ ...formData, facilities: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-amber-500/20 text-xs text-slate-100"
            />
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
              Save Room
            </button>
          </div>
        </form>
      </Modal>

      {/* Assign Student Modal */}
      <Modal isOpen={isAssignModalOpen} onClose={() => setIsAssignModalOpen(false)} title={`Assign Student to Room ${selectedRoomForAssign?.roomNumber}`}>
        <form onSubmit={handleAssignStudent} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Select Student</label>
            <select
              required
              value={assignStudentId}
              onChange={(e) => setAssignStudentId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-amber-500/20 text-xs text-slate-100"
            >
              <option value="">Select Student to Assign...</option>
              {students.map((stu) => (
                <option key={stu._id || stu.id} value={stu._id || stu.id}>
                  {stu.fullName || stu.name} ({stu.course || 'Computer Science'}) - ID: {stu.studentId}
                </option>
              ))}
            </select>
          </div>
          <div className="pt-3 border-t border-amber-500/20 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAssignModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-lg"
            >
              Confirm Room Assignment
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
