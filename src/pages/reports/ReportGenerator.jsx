import React, { useState, useEffect } from 'react';
import { FileBarChart, Download, Printer, FileSpreadsheet } from 'lucide-react';
import api from '../../services/axios';
import * as XLSX from 'xlsx';
import { Toast } from '../../components/common/Toast';

export const ReportGenerator = () => {
  const [reportType, setReportType] = useState('Student Report');
  const [reportData, setReportData] = useState({});
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await api.get('/reports');
        setReportData(res.data || {});
      } catch (err) {
        console.error(err);
      }
    };
    fetchReports();
  }, []);

  const reportTypes = [
    'Student Report',
    'Attendance Report',
    'Payment Report',
    'Complaint Report',
    'Visitor Report',
    'Mess Report',
    'Room Report',
  ];

  const getActiveData = () => {
    switch (reportType) {
      case 'Student Report':
        return reportData.students || [];
      case 'Attendance Report':
        return reportData.attendance || [];
      case 'Payment Report':
        return reportData.payments || [];
      case 'Complaint Report':
        return reportData.complaints || [];
      case 'Visitor Report':
        return reportData.visitors || [];
      case 'Mess Report':
        return reportData.mess || [];
      case 'Room Report':
        return reportData.rooms || [];
      default:
        return [];
    }
  };

  const currentList = getActiveData();

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(currentList);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, reportType);
    XLSX.writeFile(wb, `${reportType.replace(/\s+/g, '_')}.xlsx`);
    setToast({ isVisible: true, message: `${reportType} exported to Excel!`, type: 'success' });
  };

  return (
    <div className="space-y-6">
      <Toast isVisible={toast.isVisible} message={toast.message} type={toast.type} onClose={() => setToast((p) => ({ ...p, isVisible: false }))} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100">Analytics & Report Generator</h1>
          <p className="text-xs text-slate-400 mt-1">Export institutional data into PDF reports, Excel spreadsheets, or print copies</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={exportExcel}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-4 h-4" /> Export Excel
          </button>
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" /> Print Report
          </button>
        </div>
      </div>

      {/* Report Type Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-2">
        {reportTypes.map((type) => (
          <button
            key={type}
            onClick={() => setReportType(type)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              reportType === type
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Report Preview Table */}
      <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <FileBarChart className="w-4 h-4 text-blue-400" /> {reportType} Preview ({currentList.length} records)
          </h3>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Identifier / Title</th>
                <th className="py-3 px-4">Status / Category</th>
                <th className="py-3 px-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {currentList.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-slate-500">
                    No data available for this report
                  </td>
                </tr>
              ) : (
                currentList.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/30 transition">
                    <td className="py-3 px-4 font-mono text-slate-500">{idx + 1}</td>
                    <td className="py-3 px-4 font-bold text-slate-100">{item.fullName || item.title || item.studentName || item.roomNumber || item.visitorName || 'Record'}</td>
                    <td className="py-3 px-4 text-blue-400 font-medium">{item.status || item.category || item.type || 'Active'}</td>
                    <td className="py-3 px-4 font-mono text-[10px] text-slate-400">{item.date || item.createdAt || '2026-07-29'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
