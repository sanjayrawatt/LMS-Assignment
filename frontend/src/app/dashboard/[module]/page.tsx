'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';

export default function ModulePage() {
  const { module } = useParams();
  const { user } = useAuth();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [utrInput, setUtrInput] = useState<{ [key: string]: string }>({});
  const [repayingLoanId, setRepayingLoanId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [module]);

  const fetchData = async () => {
    setLoading(true);
    try {
      let endpoint = '';
      if (module === 'sales') endpoint = '/loans/leads';
      if (module === 'sanction') endpoint = '/loans/applied';
      if (module === 'disbursement') endpoint = '/loans/sanctioned';
      if (module === 'collection') endpoint = '/loans/active';

      const res = await api.get(endpoint);
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (loanId: string, action: string, body?: any) => {
    try {
      let endpoint = '';
      if (action === 'status') endpoint = `/loans/${loanId}/status`;
      if (action === 'disburse') endpoint = `/loans/${loanId}/disburse`;
      if (action === 'payment') endpoint = `/loans/${loanId}/payment`;

      if (action === 'status' || action === 'disburse') {
        await api.patch(endpoint, body);
      } else {
        await api.post(endpoint, body);
        setUtrInput({ ...utrInput, [loanId]: '' }); // Clear input
      }
      fetchData();
    } catch (err) {
      alert('Action failed');
    }
  };

  if (loading) return <div className="text-slate-400">Loading {module} data...</div>;

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-4xl font-black capitalize tracking-tight">{module}</h1>
        <p className="text-slate-500">Manage {module} operations and tracking</p>
      </header>

      <div className="glass-card overflow-hidden border-slate-800">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800/50 text-slate-400 text-xs uppercase font-black tracking-widest border-b border-slate-800">
              <th className="p-4">Entity</th>
              <th className="p-4">Details</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {data.map((item) => (
              <tr key={item._id} className="hover:bg-slate-800/30 transition-colors">
                <td className="p-4">
                  <div className="font-bold">{item.borrowerId?.name || item.name}</div>
                  <div className="text-xs text-slate-500">{item.borrowerId?.email || item.email}</div>
                </td>
                <td className="p-4">
                  {item.amount ? (
                    <div>
                      <p className="text-sm">₹{item.amount.toLocaleString()}</p>
                      <p className="text-xs text-slate-500">{item.tenure} days @ 12%</p>
                    </div>
                  ) : (
                    <span className="text-slate-500 text-xs">New Lead</span>
                  )}
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${
                    item.status === 'Applied' ? 'bg-yellow-500/10 text-yellow-500' :
                    item.status === 'Sanctioned' ? 'bg-blue-500/10 text-blue-500' :
                    item.status === 'Disbursed' ? 'bg-purple-500/10 text-purple-500' :
                    'bg-slate-700/50 text-slate-400'
                  }`}>
                    {item.status || 'Lead'}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    {module === 'sanction' && (
                      <>
                        <button 
                          onClick={() => handleAction(item._id, 'status', { status: 'Sanctioned' })}
                          className="px-3 py-1 bg-blue-600 text-xs font-bold rounded hover:bg-blue-700 cursor-pointer"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => handleAction(item._id, 'status', { status: 'Rejected', rejectionReason: 'Low Score' })}
                          className="px-3 py-1 bg-red-600/10 text-red-500 text-xs font-bold rounded hover:bg-red-600/20 cursor-pointer"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {module === 'disbursement' && (
                      <button 
                        onClick={() => handleAction(item._id, 'disburse')}
                        className="px-3 py-1 bg-purple-600 text-xs font-bold rounded hover:bg-purple-700 cursor-pointer"
                      >
                        Mark Disbursed
                      </button>
                    )}
                    {module === 'collection' && (
                      <div className="flex flex-col gap-2 min-w-[150px]">
                        {repayingLoanId === item._id ? (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="space-y-2 bg-slate-900/50 p-3 rounded-lg border border-slate-700"
                          >
                            <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Transaction UTR</label>
                            <input 
                              type="text" 
                              placeholder="e.g. UTR123456"
                              className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-2 text-xs outline-none focus:border-blue-500"
                              value={utrInput[item._id] || ''}
                              onChange={(e) => setUtrInput({ ...utrInput, [item._id]: e.target.value })}
                            />
                            <div className="flex gap-2 pt-1">
                              <button 
                                onClick={() => {
                                  if (utrInput[item._id]) {
                                    handleAction(item._id, 'payment', { 
                                      utr: utrInput[item._id], 
                                      amount: item.outstanding, 
                                      date: new Date() 
                                    });
                                    setRepayingLoanId(null);
                                  }
                                }}
                                className="flex-1 px-2 py-1.5 bg-green-600 text-[10px] font-black uppercase rounded hover:bg-green-700 transition-all cursor-pointer"
                              >
                                Confirm
                              </button>
                              <button 
                                onClick={() => setRepayingLoanId(null)}
                                className="px-2 py-1.5 bg-slate-800 text-[10px] font-black uppercase rounded hover:bg-slate-700 transition-all cursor-pointer"
                              >
                                ✕
                              </button>
                            </div>
                          </motion.div>
                        ) : (
                          <button 
                            onClick={() => setRepayingLoanId(item._id)}
                            className="px-4 py-2 bg-blue-600/10 text-blue-400 border border-blue-500/20 text-xs font-black uppercase rounded hover:bg-blue-600/20 transition-all cursor-pointer"
                          >
                            Record Repayment
                          </button>
                        )}
                      </div>
                    )}
                    {module === 'sales' && (
                      <span className="text-xs text-slate-500 italic">No actions needed</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-500">No records found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
