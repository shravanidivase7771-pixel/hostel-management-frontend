import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Download, Maximize2, X, Plus } from 'lucide-react';
import api from '../../services/axios';
import { Modal } from '../../components/common/Modal';
import { Toast } from '../../components/common/Toast';

export const GalleryPage = () => {
  const [items, setItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState(null);
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });

  const categories = [
    'All',
    'Freshers Party',
    'Traditional Day',
    'Sports Day',
    'Annual Day',
    'Farewell',
    'Ganesh Festival',
    'Hostel Building',
    'Rooms',
    'Mess Food Photos',
    'Gym & Campus'
  ];

  const fetchGallery = async () => {
    try {
      const res = await api.get('/gallery');
      setItems(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const filteredItems = items.filter(
    (item) => activeCategory === 'All' || item.album === activeCategory || item.category === activeCategory
  );

  return (
    <div className="space-y-6">
      <Toast isVisible={toast.isVisible} message={toast.message} type={toast.type} onClose={() => setToast((p) => ({ ...p, isVisible: false }))} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100">Hostel Memories & Gallery</h1>
          <p className="text-xs text-slate-400 mt-1">High-definition album archives, masonry layout, and media downloads</p>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              activeCategory === cat
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Masonry Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredItems.map((img) => (
          <div
            key={img._id || img.id}
            className="group glass-card rounded-3xl overflow-hidden border border-slate-800 relative cursor-pointer shadow-lg hover:border-blue-500/50 transition duration-300"
            onClick={() => setSelectedImage(img)}
          >
            <img src={img.url} alt={img.caption} className="w-full h-48 object-cover group-hover:scale-105 transition duration-300" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition p-4 flex flex-col justify-between">
              <span className="self-end p-2 rounded-xl bg-slate-900/80 text-white">
                <Maximize2 className="w-4 h-4" />
              </span>
              <div>
                <span className="text-[9px] font-extrabold uppercase text-blue-400">{img.album}</span>
                <h4 className="text-xs font-bold text-slate-100">{img.caption}</h4>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Fullscreen Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="relative max-w-4xl w-full text-center space-y-3">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-10 right-0 p-2 rounded-xl bg-slate-800 text-white hover:bg-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
            <img src={selectedImage.url} alt={selectedImage.caption} className="max-h-[75vh] mx-auto rounded-2xl border border-slate-800 shadow-2xl object-contain" />
            <p className="text-sm font-bold text-slate-100">{selectedImage.caption}</p>
            <a
              href={selectedImage.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg"
            >
              <Download className="w-4 h-4" /> Download High Res Image
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
