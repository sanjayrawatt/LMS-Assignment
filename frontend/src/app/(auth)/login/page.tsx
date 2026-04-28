'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data.token, res.data.user);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full glass-card p-8 shadow-2xl">
        <h1 className="text-3xl font-black mb-2 text-blue-500">Welcome Back</h1>
        <p className="text-slate-400 mb-8">Sign in to your LMS account</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email Address</label>
            <input
              type="email"
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" className="w-full btn-primary py-3 rounded-lg font-bold text-lg mt-4">
            Sign In
          </button>
        </form>

        <p className="mt-6 text-center text-slate-500 text-sm">
          Don't have an account? <Link href="/register" className="text-blue-400 font-bold">Create one</Link>
        </p>

        <div className="mt-8 pt-8 border-t border-slate-800">
          <p className="text-[10px] uppercase font-black text-slate-600 mb-2 tracking-widest">Demo Accounts</p>
          <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500">
            <div>Admin: admin@lms.com</div>
            <div>Borrower: borrower@lms.com</div>
            <div>Sales: sales@lms.com</div>
            <div>Sanction: sanction@lms.com</div>
          </div>
        </div>
      </div>
    </div>
  );
}
