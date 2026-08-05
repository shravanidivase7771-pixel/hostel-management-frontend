import React, { useState, useEffect } from 'react';
import { CreditCard, Download, FileText, CheckCircle2, Clock } from 'lucide-react';
import api from '../../services/axios';
import { DataTable } from '../../components/common/DataTable';
import { Modal } from '../../components/common/Modal';
import { Toast } from '../../components/common/Toast';

export const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });

  const fetchPayments = async () => {
    try {
      const res = await api.get('/payments');
      setPayments(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const openReceiptModal = (payment) => {
    setSelectedReceipt(payment);
  };

  const columns = [
    { header: 'Student Name', accessor: 'studentName', render: (row) => <span className="font-bold text-slate-100">{row.studentName}</span> },
    { header: 'Fee Type', accessor: 'type', render: (row) => <span className="font-semibold text-blue-400">{row.type}</span> },
    { header: 'Amount (₹)', accessor: 'amount', render: (row) => <span className="font-mono font-bold text-emerald-400">₹{(row.amount || 0).toLocaleString()}</span> },
    { header: 'Transaction ID', accessor: 'transactionId', render: (row) => <span className="font-mono text-[10px] text-slate-400">{row.transactionId || 'TXN123456'}</span> },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase ${row.status === 'Paid' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>
          {row.status}
        </span>
      ),
    },
    {
      header: 'Receipt',
      accessor: 'receipt',
      render: (row) => (
        <button
          onClick={() => openReceiptModal(row)}
          className="px-2.5 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] font-bold flex items-center gap-1"
        >
          <FileText className="w-3 h-3" /> PDF Receipt
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Toast isVisible={toast.isVisible} message={toast.message} type={toast.type} onClose={() => setToast((p) => ({ ...p, isVisible: false }))} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100">Fee Payments & Receipts</h1>
          <p className="text-xs text-slate-400 mt-1">Hostel fees, mess charges, transaction logs and digital PDF receipts</p>
        </div>
      </div>

      <DataTable columns={columns} data={payments} searchField="studentName" title="Payment Transactions" />

      {/* PDF Receipt Modal */}
      <Modal isOpen={!!selectedReceipt} onClose={() => setSelectedReceipt(null)} title="Official Fee Receipt">
        {selectedReceipt && (
          <div className="space-y-4 p-2" id="pdf-receipt">
            <div className="text-center pb-3 border-b border-slate-800">
              <h3 className="font-extrabold text-base text-blue-400">HOSTEL & MESS ADMINISTRATION</h3>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest">Official Fee Receipt</p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Receipt No:</span>
                <span className="font-mono text-slate-200">REC-2026-{selectedReceipt.id || '01'}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Student Name:</span>
                <span className="font-bold text-slate-100">{selectedReceipt.studentName}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Fee Category:</span>
                <span className="text-blue-400 font-semibold">{selectedReceipt.type}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Amount Paid:</span>
                <span className="font-mono font-extrabold text-emerald-400 text-sm">₹{selectedReceipt.amount}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Status:</span>
                <span className="font-bold text-emerald-400">SUCCESSFUL (PAID)</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end gap-2">
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Download / Print PDF
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
