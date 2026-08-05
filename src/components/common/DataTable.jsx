import React, { useState } from 'react';
import { Search, Filter, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import * as XLSX from 'xlsx';

export const DataTable = ({ columns, data, searchField = 'name', title = 'Records' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(8);

  const filteredData = (data || []).filter((item) => {
    if (!searchTerm) return true;
    const value = item[searchField] || item.fullName || item.title || item.studentName || '';
    return value.toString().toLowerCase().includes(searchTerm.toLowerCase());
  });

  const totalPages = Math.ceil(filteredData.length / rowsPerPage) || 1;
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, title);
    XLSX.writeFile(wb, `${title}_Report.xlsx`);
  };

  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4">
      {/* Table Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <h3 className="text-sm font-bold text-slate-100">{title}</h3>
        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Filter records..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
          <button
            onClick={exportToExcel}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Excel</span>
          </button>
        </div>
      </div>

      {/* Table Body */}
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} className="py-3 px-4 font-semibold">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-8 text-slate-500">
                  No records found
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rowIndex) => (
                <tr key={row._id || row.id || rowIndex} className="hover:bg-slate-800/30 transition">
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className="py-3 px-4 font-medium">
                      {col.render ? col.render(row) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs text-slate-400">
        <span>
          Showing {paginatedData.length} of {filteredData.length} entries
        </span>
        <div className="flex items-center gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            className="p-1.5 rounded-lg border border-slate-800 disabled:opacity-30 hover:bg-slate-800 transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-semibold text-slate-200">
            {currentPage} / {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            className="p-1.5 rounded-lg border border-slate-800 disabled:opacity-30 hover:bg-slate-800 transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
