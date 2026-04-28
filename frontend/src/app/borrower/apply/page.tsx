'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';

export default function BorrowerApply() {
  const { user, logout } = useAuth();
  const [step, setStep] = useState(2); // Start from Step 2 as Step 1 is Auth
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 2 Data
  const [details, setDetails] = useState({
    dob: '',
    salary: 0,
    pan: '',
    employmentStatus: 'Salaried'
  });

  // Step 4 Data
  const [loanConfig, setLoanConfig] = useState({
    amount: 50000,
    tenure: 30
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.post('/loans/submit-details', details);
      setStep(3);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Verification failed');
      if (err.response?.data?.errors) {
        setError(err.response.data.errors.join(', '));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleFileUpload = () => {
    if (selectedFile) {
      setStep(4);
    }
  };

  const handleApply = async () => {
    setLoading(true);
    try {
      await api.post('/loans/apply', {
        ...loanConfig,
        salarySlipUrl: 'https://example.com/mock-slip.pdf'
      });
      setStep(5); // Success step
    } catch (err: any) {
      setError(err.response?.data?.message || 'Application failed');
    } finally {
      setLoading(false);
    }
  };

  const SI = (loanConfig.amount * 12 * loanConfig.tenure) / (365 * 100);
  const totalRepayment = loanConfig.amount + SI;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full glass-card p-8 shadow-2xl">
        <div className="flex justify-between mb-8">
          {[2, 3, 4].map((s) => (
            <div key={s} className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${step >= s ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-400'}`}>
                {s}
              </div>
              <span className="text-xs mt-2 text-slate-400">
                {s === 2 ? 'Details' : s === 3 ? 'Upload' : 'Configure'}
              </span>
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h2 className="text-2xl font-bold mb-6">Personal Details & Eligibility</h2>
              <form onSubmit={handleDetailsSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Date of Birth</label>
                  <input
                    type="date"
                    required
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"
                    value={details.dob}
                    onChange={(e) => setDetails({ ...details, dob: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Monthly Salary (₹)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 30000"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"
                    value={details.salary}
                    onChange={(e) => setDetails({ ...details, salary: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">PAN Number</label>
                  <input
                    type="text"
                    required
                    placeholder="ABCDE1234F"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white uppercase"
                    value={details.pan}
                    onChange={(e) => setDetails({ ...details, pan: e.target.value.toUpperCase() })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Employment Status</label>
                  <select
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"
                    value={details.employmentStatus}
                    onChange={(e) => setDetails({ ...details, employmentStatus: e.target.value })}
                  >
                    <option value="Salaried">Salaried</option>
                    <option value="Self-Employed">Self-Employed</option>
                    <option value="Unemployed">Unemployed</option>
                  </select>
                </div>
                {error && <p className="text-red-400 text-sm">{error}</p>}
                <button type="submit" disabled={loading} className="w-full btn-primary py-3 rounded-lg font-bold">
                  {loading ? 'Verifying...' : 'Continue to Upload'}
                </button>
              </form>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-center"
            >
              <h2 className="text-2xl font-bold mb-6">Upload Salary Slip</h2>
              <div className="border-2 border-dashed border-slate-700 rounded-xl p-12 mb-6 hover:border-blue-500 transition-colors">
                {selectedFile ? (
                  <div className="flex flex-col items-center">
                    <div className="text-blue-400 text-4xl mb-4">📄</div>
                    <p className="text-white font-bold mb-2">{selectedFile.name}</p>
                    <p className="text-slate-500 text-xs">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                    <button onClick={() => setSelectedFile(null)} className="mt-4 text-xs text-red-400 hover:underline">Remove file</button>
                  </div>
                ) : (
                  <>
                    <p className="text-slate-400 mb-4">Click to upload PDF or JPG (Max 5MB)</p>
                    <label className="px-6 py-3 bg-slate-800 rounded-lg hover:bg-slate-700 cursor-pointer transition-all border border-slate-700">
                      Select File
                      <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} />
                    </label>
                  </>
                )}
              </div>
              <button 
                onClick={handleFileUpload} 
                disabled={!selectedFile}
                className="w-full btn-primary py-3 rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to Final Step
              </button>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h2 className="text-2xl font-bold mb-6">Loan Configuration</h2>
              <div className="space-y-8">
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium">Loan Amount: ₹{loanConfig.amount.toLocaleString()}</label>
                  </div>
                  <input
                    type="range"
                    min="50000"
                    max="500000"
                    step="5000"
                    className="w-full accent-blue-500"
                    value={loanConfig.amount}
                    onChange={(e) => setLoanConfig({ ...loanConfig, amount: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium">Tenure: {loanConfig.tenure} Days</label>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="365"
                    className="w-full accent-purple-500"
                    value={loanConfig.tenure}
                    onChange={(e) => setLoanConfig({ ...loanConfig, tenure: Number(e.target.value) })}
                  />
                </div>

                <div className="bg-slate-900/50 p-6 rounded-xl border border-blue-500/20">
                  <h3 className="text-blue-400 font-bold mb-4 uppercase tracking-wider text-xs">Repayment Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-slate-400 text-xs">Interest Rate</p>
                      <p className="font-bold">12% p.a.</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs">Interest Amount</p>
                      <p className="font-bold text-green-400">₹{SI.toFixed(2)}</p>
                    </div>
                    <div className="col-span-2 border-t border-slate-800 pt-4 mt-2">
                      <p className="text-slate-400 text-xs">Total Repayment</p>
                      <p className="text-2xl font-bold text-blue-400">₹{totalRepayment.toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                <button onClick={handleApply} disabled={loading} className="w-full btn-primary py-4 rounded-lg font-bold text-lg">
                  {loading ? 'Processing...' : 'Apply Now'}
                </button>
              </div>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
                ✓
              </div>
              <h2 className="text-3xl font-bold mb-2">Application Submitted!</h2>
              <p className="text-slate-400 mb-8">Our team will review your application and get back to you soon.</p>
              <button onClick={() => window.location.href = '/'} className="px-8 py-3 bg-slate-800 rounded-lg hover:bg-slate-700 font-bold">
                Go to Home
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <button 
          onClick={logout}
          className="mt-8 text-sm text-red-400 hover:text-red-500 font-bold flex items-center gap-2 transition-colors cursor-pointer"
        >
          ← Logout and Exit
        </button>
      </div>
    </div>
  );
}
