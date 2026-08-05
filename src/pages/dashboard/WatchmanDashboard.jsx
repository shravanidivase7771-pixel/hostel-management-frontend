import React, { useState, useEffect } from 'react';
import { Search, LogOut as LogOutIcon, LogIn as LogInIcon, ShieldCheck, UserCheck, Clock, MapPin, AlertCircle, RefreshCw, Zap } from 'lucide-react';
import api from '../../services/axios';
import { useSocket } from '../../context/SocketContext';
import { Toast } from '../../components/common/Toast';
import { Modal } from '../../components/common/Modal';

export const WatchmanDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [inOutLogs, setInOutLogs] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isOutModalOpen, setIsOutModalOpen] = useState(false);
  const [destination, setDestination] = useState('');
  const [reason, setReason] = useState('');
  const [expectedReturnTime, setExpectedReturnTime] = useState('');
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });
  const [loading, setLoading] = useState(false);

  const socket = useSocket();

  const fetchLogs = async () => {
    try {
      const res = await api.get('/inout');
      setInOutLogs(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on('inout_updated', (updatedRecord) => {
      fetchLogs();
      setToast({
        isVisible: true,
        message: `Real-time Update: ${updatedRecord.studentName} marked ${updatedRecord.status}!`,
        type: 'info',
      });
    });

    return () => socket.off('inout_updated');
  }, [socket]);

  const handleSearch = async (e) => {
    const q = e.target.value;
    setSearchQuery(q);
    if (!q.trim()) {
      setSearchResults([]);
      return;
    }
    try {
      const res = await api.get(`/inout/search?query=${encodeURIComponent(q)}`);
      setSearchResults(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const openCheckOutModal = (student) => {
    setSelectedStudent(student);
    setDestination('City Market / Library');
    setReason('Personal / Academic');
    const defaultReturn = new Date(Date.now() + 4 * 3600000).toISOString().slice(0, 16);
    setExpectedReturnTime(defaultReturn);
    setIsOutModalOpen(true);
  };

  const handleCheckOutSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStudent) return;

    setLoading(true);
    try {
      await api.post('/inout/checkout', {
        studentId: selectedStudent.studentId || selectedStudent._id,
        studentName: selectedStudent.fullName || selectedStudent.name,
        roomNo: selectedStudent.roomNo || selectedStudent.roomNumber || 'A-101',
        phone: selectedStudent.phone || '+91 99887 76655',
        photo: selectedStudent.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        destination,
        reason,
        expectedReturnTime,
      });

      setIsOutModalOpen(false);
      setSearchQuery('');
      setSearchResults([]);
      setToast({ isVisible: true, message: `Student ${selectedStudent.fullName || selectedStudent.name} checked OUT successfully!`, type: 'success' });
    } catch (err) {
      setToast({ isVisible: true, message: 'Check OUT failed', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async (logId) => {
    try {
      await api.put(`/inout/checkin/${logId}`);
      setToast({ isVisible: true, message: 'Student checked IN successfully!', type: 'success' });
    } catch (err) {
      setToast({ isVisible: true, message: 'Check IN failed', type: 'error' });
    }
  };

  const outsideStudents = inOutLogs.filter((log) => log.status === 'OUT');

  return (
    <div className="space-y-6">
      <Toast
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((prev) => ({ ...prev, isVisible: false }))}
      />

      {/* Header Banner */}
      <div className="glass-card rounded-3xl p-7 border border-slate-800 bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-950 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-amber-600/10 blur-3xl" />
        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2 text-amber-400 font-extrabold text-xs uppercase tracking-wider">
            <Zap className="w-4 h-4" /> Live Gate Security Clearance
          </div>
          <h1 className="text-3xl font-black text-slate-100 tracking-tight">Watchman Desk Control</h1>
          <p className="text-xs text-slate-400">Instant student check-out/check-in & live Socket.IO dashboard sync</p>
        </div>
        <div className="flex items-center gap-3 relative z-10">
          <div className="px-4 py-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-extrabold flex items-center gap-2 shadow-lg glow-amber">
            <UserCheck className="w-4 h-4" />
            <span>{outsideStudents.length} Students Currently Outside</span>
          </div>
          <button
            onClick={fetchLogs}
            className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition shadow-md"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search & Check OUT Tool */}
      <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4 shadow-xl">
        <h3 className="text-sm font-extrabold text-slate-100 flex items-center gap-2">
          <Search className="w-4 h-4 text-blue-400" /> Search Student for Gate Entry
        </h3>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search by Student Name, Student ID, Room Number or Contact..."
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 shadow-inner transition"
          />
        </div>

        {/* Search Results Cards */}
        {searchResults.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {searchResults.map((stu) => (
              <div key={stu._id || stu.id} className="glass-card rounded-2xl p-4 border border-slate-800 flex gap-3.5 items-center hover:scale-[1.02] transition">
                <img
                  src={stu.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                  alt={stu.fullName || stu.name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-700 shadow-md shrink-0"
                />
                <div className="overflow-hidden flex-1">
                  <h4 className="text-xs font-bold text-slate-100 truncate">{stu.fullName || stu.name}</h4>
                  <p className="text-[11px] text-blue-400 font-extrabold font-mono">{stu.studentId || 'ID: STU-2026'}</p>
                  <p className="text-[10px] text-slate-400">Room: {stu.roomNo || stu.roomNumber || 'A-101'}</p>
                </div>
                <button
                  onClick={() => openCheckOutModal(stu)}
                  className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20 flex items-center gap-1 shrink-0 transition"
                >
                  <LogOutIcon className="w-4 h-4" /> OUT
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Real-time Gate In/Out Log Table */}
      <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-sm font-extrabold text-slate-100 flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-400" /> Today's Live Gate Entry Logs
          </h3>
          <span className="text-xs text-slate-400 font-extrabold">{inOutLogs.length} total entries</span>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Student Photo & Name</th>
                <th className="py-3.5 px-4">Room No</th>
                <th className="py-3.5 px-4">Destination & Reason</th>
                <th className="py-3.5 px-4">Out Time</th>
                <th className="py-3.5 px-4">Expected Return</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {inOutLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-500">
                    No gate entries recorded today
                  </td>
                </tr>
              ) : (
                inOutLogs.map((log) => (
                  <tr key={log._id || log.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4 flex items-center gap-3">
                      <img
                        src={log.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                        alt={log.studentName}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-700 shadow-sm"
                      />
                      <div>
                        <p className="font-extrabold text-slate-100">{log.studentName}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{log.studentId}</p>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-200">{log.roomNo}</td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-200">{log.destination}</p>
                      <p className="text-[10px] text-slate-400">{log.reason}</p>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-amber-400 font-bold">
                      {log.outTime ? new Date(log.outTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                      {log.expectedReturnTime ? new Date(log.expectedReturnTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                          log.status === 'OUT'
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/30 animate-pulse glow-amber'
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        }`}
                      >
                        {log.status === 'OUT' ? 'Outside Hostel' : 'Returned'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {log.status === 'OUT' ? (
                        <button
                          onClick={() => handleCheckIn(log._id || log.id)}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-500/20 flex items-center gap-1 ml-auto transition"
                        >
                          <LogInIcon className="w-3.5 h-3.5" /> Click IN
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-500 font-semibold italic">Completed</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Check OUT Modal */}
      <Modal isOpen={isOutModalOpen} onClose={() => setIsOutModalOpen(false)} title="Student Check OUT Entry">
        {selectedStudent && (
          <form onSubmit={handleCheckOutSubmit} className="space-y-4">
            <div className="flex items-center gap-3 p-3.5 bg-slate-900 rounded-2xl border border-slate-800">
              <img
                src={selectedStudent.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                alt={selectedStudent.fullName || selectedStudent.name}
                className="w-12 h-12 rounded-xl object-cover border border-slate-700"
              />
              <div>
                <h4 className="font-extrabold text-xs text-slate-100">{selectedStudent.fullName || selectedStudent.name}</h4>
                <p className="text-[11px] text-slate-400">
                  Room: {selectedStudent.roomNo || selectedStudent.roomNumber || 'A-101'} | ID: {selectedStudent.studentId || 'STU-2026'}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Destination Address</label>
              <input
                type="text"
                required
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:border-blue-500"
                placeholder="Where is the student going?"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Reason for Leaving</label>
              <input
                type="text"
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:border-blue-500"
                placeholder="Reason (Medical, Home visit, Shopping...)"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Expected Return Date & Time</label>
              <input
                type="datetime-local"
                required
                value={expectedReturnTime}
                onChange={(e) => setExpectedReturnTime(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:border-blue-500"
              />
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsOutModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20"
              >
                {loading ? 'Saving...' : 'Confirm OUT & Broadcast'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
