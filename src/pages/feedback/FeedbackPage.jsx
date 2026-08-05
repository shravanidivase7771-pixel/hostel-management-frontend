import React, { useState } from 'react';
import { MessageSquare, Star, Send } from 'lucide-react';
import { Toast } from '../../components/common/Toast';

export const FeedbackPage = () => {
  const [messRating, setMessRating] = useState(5);
  const [hostelRating, setHostelRating] = useState(5);
  const [comments, setComments] = useState('');
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setToast({ isVisible: true, message: 'Thank you! Your feedback has been recorded.', type: 'success' });
    setComments('');
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 pt-4">
      <Toast isVisible={toast.isVisible} message={toast.message} type={toast.type} onClose={() => setToast((p) => ({ ...p, isVisible: false }))} />

      <div className="glass-card rounded-3xl p-8 border border-slate-800 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-100">Hostel & Mess Rating</h1>
            <p className="text-xs text-slate-400">Share your overall residence experience & food feedback</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Hostel Facilities & Hygiene Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setHostelRating(star)}
                  className={`p-2 rounded-xl text-lg font-bold border transition ${
                    hostelRating >= star ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' : 'bg-slate-900 text-slate-600 border-slate-800'
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Mess Food Quality Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setMessRating(star)}
                  className={`p-2 rounded-xl text-lg font-bold border transition ${
                    messRating >= star ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' : 'bg-slate-900 text-slate-600 border-slate-800'
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Detailed Remarks</label>
            <textarea
              rows={4}
              required
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Tell us what you liked or how we can improve our services..."
              className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" /> Submit Feedback
          </button>
        </form>
      </div>
    </div>
  );
};
