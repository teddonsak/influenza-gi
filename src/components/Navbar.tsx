import React from 'react';
import { Syringe, ArrowLeft, Shield } from 'lucide-react';
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

          {/* Navigation Area: Only display back/status when in Admin mode */}
          <div className="flex items-center gap-2 sm:gap-3">
            {currentView === 'admin' ? (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-xs">
                  <Shield className="w-3.5 h-3.5 text-teal-400" />
                  <span>ระบบจัดการแอดมิน</span>
                  {recordCount > 0 && (
                    <span className="bg-teal-400 text-slate-950 px-1.5 py-0.2 rounded-full font-black text-[10px]">
                      {recordCount}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => onNavigate('register')}
                  className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all cursor-pointer shadow-xs"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>กลับหน้าลงทะเบียน</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200/60">
                  <span>วัคซีน 2569</span>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
