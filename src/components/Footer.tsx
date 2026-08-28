import React from 'react';
import { Heart, Shield } from 'lucide-react';
import { COMPANY_NAME } from '../types/registration';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto bg-white border-t border-slate-200 py-8 text-slate-500 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">{COMPANY_NAME}</span>
            <span>• By.หนุ่มทะเลใต้</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-teal-600" /> วัคซีนมาตรฐาน 4 สายพันธุ์
            </span>
            <span>•</span>
            <span>ราคาพิเศษ 390 บาท/เข็ม</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-slate-400">
              สร้างด้วย <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> เพื่อชาวโกลบอลอินเตอร์
            </span>
          </div>

        </div>
      </div>
    </footer>
  );
};
