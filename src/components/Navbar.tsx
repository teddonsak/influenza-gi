import React from 'react';
import { Syringe, LayoutDashboard, UserPlus } from 'lucide-react';
import { PageView } from '../types/registration';

interface NavbarProps {
  currentView: PageView;
  onNavigate: (view: PageView) => void;
  recordCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, recordCount }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => onNavigate('register')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Syringe className="w-5 h-5 sm:w-6 sm:h-6 rotate-45" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base sm:text-lg text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors">
                  โกลบอลอินเตอร์ จำกัด
                </span>
                <span className="text-xs bg-blue-100 text-blue-700 font-semibold px-2 py-0.5 rounded-full hidden xs:inline-block">
                  GI-CARE
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                ระบบลงทะเบียนฉีดวัคซีนไข้หวัดใหญ่ 2569
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => onNavigate('register')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                currentView === 'register'
                  ? 'bg-blue-50 text-blue-600 ring-1 ring-blue-500/20 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <UserPlus className="w-4 h-4 text-blue-500" />
              <span className="hidden sm:inline">ลงทะเบียน</span>
              <span className="sm:hidden">ฟอร์ม</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('admin')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-sm font-medium transition-all relative cursor-pointer ${
                currentView === 'admin'
                  ? 'bg-slate-900 text-white font-semibold shadow-md shadow-slate-900/10'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <LayoutDashboard className={`w-4 h-4 ${currentView === 'admin' ? 'text-teal-300' : 'text-slate-500'}`} />
              <span>Admin</span>
              {recordCount > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                  currentView === 'admin'
                    ? 'bg-teal-400 text-slate-950'
                    : 'bg-blue-600 text-white'
                }`}>
                  {recordCount}
                </span>
              )}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
