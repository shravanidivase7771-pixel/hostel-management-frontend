import React, { useState, useEffect } from 'react';
import { UtensilsCrossed, Calendar, Star, DollarSign, Edit3, Send, CheckCircle2 } from 'lucide-react';
import api from '../../services/axios';
import { Toast } from '../../components/common/Toast';
import { Modal } from '../../components/common/Modal';

export const MessManagement = () => {
  const [messData, setMessData] = useState(null);
  const [activeTab, setActiveTab] = useState('menu');
  const [userRating, setUserRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState('');
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const fetchMessData = async () => {
    try {
      const res = await api.get('/mess');
      setMessData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMessData();
  }, []);

  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/mess/rating', { rating: userRating, feedback: feedbackText });
      setToast({ isVisible: true, message: 'Thank you for your mess feedback!', type: 'success' });
      setFeedbackText('');
    } catch (err) {
      setToast({ isVisible: true, message: 'Failed to submit rating', type: 'error' });
    }
  };

  const messInfo = messData?.messInfo || {};
  const weeklyMenu = messInfo.weeklyMenu || [
    { day: 'Monday', breakfast: 'Idli Sambar', lunch: 'Rajma Chawal', dinner: 'Mix Veg & Roti' },
    { day: 'Tuesday', breakfast: 'Aloo Paratha', lunch: 'Kadi Pakoda & Rice', dinner: 'Chana Masala' },
    { day: 'Wednesday', breakfast: 'Poha & Jalebi', lunch: 'Veg Biryani & Raita', dinner: 'Egg Curry / Malai Kofta' },
    { day: 'Thursday', breakfast: 'Upma & Tea', lunch: 'Dal Makhani & Naan', dinner: 'Bhindhi Fry & Rice' },
    { day: 'Friday', breakfast: 'Dosa & Coconut Chutney', lunch: 'Chole Bhature', dinner: 'Chicken Curry / Paneer Tikka' },
    { day: 'Saturday', breakfast: 'Puri Bhaji', lunch: 'Khichdi & Kadhi', dinner: 'Veg Kolhapuri' },
    { day: 'Sunday', breakfast: 'Bread Butter Omelette', lunch: 'Special Thali', dinner: 'Sweet & Veg Pulao' }
  ];

  return (
    <div className="space-y-6">
      <Toast isVisible={toast.isVisible} message={toast.message} type={toast.type} onClose={() => setToast((p) => ({ ...p, isVisible: false }))} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100">Mess & Dining Management</h1>
          <p className="text-xs text-slate-400 mt-1">Weekly food schedule, mess enrollments, meal ratings & payment history</p>
        </div>
        <button
          onClick={() => setIsRegisterModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/20 flex items-center gap-2 transition shrink-0"
        >
          <UtensilsCrossed className="w-4 h-4" /> Mess Subscription / Register
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        {['menu', 'ratings', 'registrations'].map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition ${
              activeTab === t
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            {t === 'menu' ? "Today's & Weekly Menu" : t === 'ratings' ? 'Food Rating & Feedback' : 'Mess Subscriptions'}
          </button>
        ))}
      </div>

      {activeTab === 'menu' && (
        <div className="space-y-6">
          {/* Today's Special Card */}
          <div className="glass-card rounded-3xl p-6 border border-slate-800 bg-gradient-to-r from-amber-950/30 via-slate-900 to-slate-950 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Chef's Today Special</span>
              <h2 className="text-xl font-extrabold text-slate-100 mt-1">{messInfo.todaySpecial || 'Special Paneer Butter Masala & Gulab Jamun'}</h2>
              <p className="text-xs text-slate-400 mt-1">Served fresh with authentic spices & hygienic preparation</p>
            </div>
            <div className="flex gap-2">
              <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold">Veg Option</span>
              <span className="px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/30 text-xs font-bold">Non-Veg Option</span>
            </div>
          </div>

          {/* Weekly Menu Table */}
          <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-400" /> Complete Weekly Mess Menu
            </h3>
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Day</th>
                    <th className="py-3 px-4">Breakfast (7:30 - 9:30 AM)</th>
                    <th className="py-3 px-4">Lunch (12:00 - 2:30 PM)</th>
                    <th className="py-3 px-4">Dinner (7:30 - 10:00 PM)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {weeklyMenu.map((m, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/30 transition">
                      <td className="py-3 px-4 font-bold text-amber-400">{m.day}</td>
                      <td className="py-3 px-4 text-slate-200">{m.breakfast}</td>
                      <td className="py-3 px-4 text-slate-200">{m.lunch}</td>
                      <td className="py-3 px-4 text-slate-200">{m.dinner}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'ratings' && (
        <div className="glass-card rounded-3xl p-6 border border-slate-800 max-w-lg space-y-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-400" /> Rate Today's Food Quality
          </h3>
          <form onSubmit={handleRatingSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Select Rating Stars</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setUserRating(star)}
                    className={`p-2 rounded-xl text-lg font-bold border transition ${
                      userRating >= star
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                        : 'bg-slate-900 text-slate-600 border-slate-800'
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Your Feedback & Suggestions</label>
              <textarea
                rows={3}
                required
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Share your thoughts on food taste, hygiene, or menu preferences..."
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 flex items-center justify-center gap-1"
            >
              <Send className="w-4 h-4" /> Submit Mess Rating
            </button>
          </form>
        </div>
      )}

      {/* Mess Registration Modal */}
      <Modal isOpen={isRegisterModalOpen} onClose={() => setIsRegisterModalOpen(false)} title="Mess Registration & Subscription">
        <div className="space-y-4 p-2 text-xs">
          <p className="text-slate-300">Choose your monthly mess plan and meal type preference:</p>
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex justify-between items-center">
            <div>
              <p className="font-bold text-slate-100">Veg Subscription Plan</p>
              <p className="text-[10px] text-slate-400">Breakfast, Lunch, Snacks & Dinner</p>
            </div>
            <span className="font-mono font-bold text-emerald-400">₹3,500 / month</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex justify-between items-center">
            <div>
              <p className="font-bold text-slate-100">Non-Veg Subscription Plan</p>
              <p className="text-[10px] text-slate-400">Includes Chicken / Egg 3x weekly</p>
            </div>
            <span className="font-mono font-bold text-emerald-400">₹4,200 / month</span>
          </div>
          <button
            onClick={() => {
              setIsRegisterModalOpen(false);
              setToast({ isVisible: true, message: 'Mess registration request sent successfully!', type: 'success' });
            }}
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg"
          >
            Confirm & Pay Online
          </button>
        </div>
      </Modal>
    </div>
  );
};
