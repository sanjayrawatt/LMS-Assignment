'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const modules = [
    { name: 'Sales', path: '/dashboard/sales', roles: ['Sales', 'Admin'] },
    { name: 'Sanction', path: '/dashboard/sanction', roles: ['Sanction', 'Admin'] },
    { name: 'Disbursement', path: '/dashboard/disbursement', roles: ['Disbursement', 'Admin'] },
    { name: 'Collection', path: '/dashboard/collection', roles: ['Collection', 'Admin'] },
  ];

  const allowedModules = modules.filter(m => m.roles.includes(user?.role || ''));

  return (
    <div className="flex min-h-screen bg-[#0b0f1a]">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 p-6 flex flex-col">
        <div className="text-2xl font-black mb-12 text-blue-500 tracking-tighter">
          LMS <span className="text-white">PRO</span>
        </div>
        
        <nav className="flex-1 space-y-2">
          {allowedModules.map((m) => (
            <Link 
              key={m.path} 
              href={m.path}
              className={`block px-4 py-3 rounded-xl transition-all duration-200 border ${
                pathname === m.path 
                ? 'bg-blue-600/10 text-blue-400 border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.1)]' 
                : 'text-slate-400 border-transparent hover:bg-slate-800/50'
              }`}
            >
              {m.name}
            </Link>
          ))}
        </nav>

        <div className="mt-auto border-t border-slate-800 pt-6 pb-12">
          <div className="mb-4 px-2">
            <p className="text-sm font-bold truncate">{user?.name}</p>
            <p className="text-xs text-slate-500 uppercase font-black">{user?.role}</p>
          </div>
          <button 
            onClick={logout}
            className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-400/5 rounded-lg transition-colors cursor-pointer"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
