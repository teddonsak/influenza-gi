import React, { useState } from 'react';
import { User, Users, AlertCircle, Trash2, ShieldCheck, HeartPulse } from 'lucide-react';
import { RegistrationFormData, PRICE_PER_DOSE, COMPANY_NAME, CAMPAIGN_TITLE } from '../types/registration';

interface RegistrationFormProps {
  formData: RegistrationFormData;
  setFormData: React.Dispatch<React.SetStateAction<RegistrationFormData>>;
  onSubmit: () => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  formData,
  setFormData,
  onSubmit,
}) => {
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: keyof RegistrationFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field === 'person1' && value.trim()) {
      setError(null);
    }
  };

  const handleClear = () => {
    if (window.confirm('คุณต้องการล้างข้อมูลที่กรอกทั้งหมดใช่หรือไม่?')) {
      setFormData({
        person1: '',
        person2: '',
        person3: '',
        person4: '',
        person5: '',
      });
      setError(null);
    }
  };

  const filledCount = Object.values(formData).filter((name) => name.trim().length > 0).length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.person1.trim()) {
      setError('กรุณากรอกชื่อคนที่ 1 (ผู้ติดต่อหลัก) ก่อนดำเนินการต่อ');
      return;
    }
    setError(null);
    onSubmit();
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Campaign Header Card */}
      <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-teal-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-blue-600/15 mb-8 relative overflow-hidden">
        
        {/* Background decorative circles */}
        <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/10 rounded-full blur-xl pointer-events-none" />
        <div className="absolute -left-8 -bottom-8 w-40 h-40 bg-teal-300/10 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-teal-100 border border-white/20 mb-3">
            <HeartPulse className="w-3.5 h-3.5 text-teal-300 animate-pulse" />
            โครงการส่งเสริมสุขภาพพนักงาน
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight leading-snug">
            {CAMPAIGN_TITLE}
          </h1>
          <p className="text-blue-100 font-medium text-sm sm:text-base mt-1">
            {COMPANY_NAME}
          </p>

          {/* Pricing Highlight Pill */}
          <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white">
                <ShieldCheck className="w-5 h-5 text-teal-200" />
              </span>
              <div>
                <div className="text-xs text-blue-100">ค่าบริการรวมเบ็ดเสร็จ</div>
                <div className="text-lg sm:text-xl font-black text-white">
                  ราคา <span className="text-amber-300 text-2xl font-black">{PRICE_PER_DOSE}</span> บาท / 1 เข็ม
                </div>
              </div>
            </div>

            <div className="text-xs bg-teal-500/30 text-teal-100 px-3 py-1.5 rounded-xl border border-teal-300/30 font-medium">
              วัคซีน 4 สายพันธุ์มาตรฐานสากล
            </div>
          </div>
        </div>
      </div>

      {/* Main Registration Form Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80">
        
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-slate-800">
              รายชื่อผู้ประสงค์ฉีดวัคซีน (สูงสุด 5 ท่าน)
            </h2>
          </div>
          {filledCount > 0 && (
            <button
              type="button"
              onClick={handleClear}
              className="text-xs text-slate-400 hover:text-rose-500 flex items-center gap-1 transition-colors cursor-pointer"
              title="ล้างข้อมูลที่กรอกทั้งหมด"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>ล้างข้อมูล</span>
            </button>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 flex items-start gap-3 text-sm animate-shake">
            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">{error}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Person 1 (Required) */}
          <div className="relative">
            <label className="flex items-center justify-between text-sm font-semibold text-slate-700 mb-1.5">
              <span className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">1</span>
                ชื่อคนที่ 1 (ผู้ติดต่อหลัก)
              </span>
              <span className="text-xs bg-rose-50 text-rose-600 border border-rose-200 px-2 py-0.5 rounded-full font-medium">
                * บังคับกรอก (Required)
              </span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-5 h-5 text-blue-500" />
              </div>
              <input
                type="text"
                value={formData.person1}
                onChange={(e) => handleChange('person1', e.target.value)}
                placeholder="เช่น นายสมชาย มุ่งมั่นดี (แผนก IT)"
                className={`w-full pl-11 pr-4 py-3.5 rounded-2xl border transition-all text-slate-800 placeholder-slate-400 font-medium ${
                  error
                    ? 'border-rose-400 ring-2 ring-rose-100 bg-rose-50/20 focus:border-rose-500'
                    : 'border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 bg-slate-50/40 focus:bg-white'
                }`}
                autoFocus
              />
            </div>
          </div>

          {/* Person 2 (Optional) */}
          <div className="relative">
            <label className="flex items-center justify-between text-sm font-semibold text-slate-700 mb-1.5">
              <span className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 text-xs flex items-center justify-center font-bold">2</span>
                ชื่อคนที่ 2
              </span>
              <span className="text-xs text-slate-400 font-normal">
                (ไม่บังคับกรอก)
              </span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={formData.person2}
                onChange={(e) => handleChange('person2', e.target.value)}
                placeholder="เช่น นางสมหญิง มุ่งมั่นดี (คู่สมรส / ครอบครัว)"
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 bg-slate-50/40 focus:bg-white transition-all text-slate-800 placeholder-slate-400 font-medium"
              />
            </div>
          </div>

          {/* Person 3 (Optional) */}
          <div className="relative">
            <label className="flex items-center justify-between text-sm font-semibold text-slate-700 mb-1.5">
              <span className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 text-xs flex items-center justify-center font-bold">3</span>
                ชื่อคนที่ 3
              </span>
              <span className="text-xs text-slate-400 font-normal">
                (ไม่บังคับกรอก)
              </span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={formData.person3}
                onChange={(e) => handleChange('person3', e.target.value)}
                placeholder="เช่น ด.ช. กิตติ มุ่งมั่นดี (บุตร)"
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 bg-slate-50/40 focus:bg-white transition-all text-slate-800 placeholder-slate-400 font-medium"
              />
            </div>
          </div>

          {/* Person 4 (Optional) */}
          <div className="relative">
            <label className="flex items-center justify-between text-sm font-semibold text-slate-700 mb-1.5">
              <span className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 text-xs flex items-center justify-center font-bold">4</span>
                ชื่อคนที่ 4
              </span>
              <span className="text-xs text-slate-400 font-normal">
                (ไม่บังคับกรอก)
              </span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={formData.person4}
                onChange={(e) => handleChange('person4', e.target.value)}
                placeholder="เช่น นายประเสริฐ มุ่งมั่นดี (บิดา/มารดา/เพื่อนร่วมงาน)"
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 bg-slate-50/40 focus:bg-white transition-all text-slate-800 placeholder-slate-400 font-medium"
              />
            </div>
          </div>

          {/* Person 5 (Optional) */}
          <div className="relative">
            <label className="flex items-center justify-between text-sm font-semibold text-slate-700 mb-1.5">
              <span className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 text-xs flex items-center justify-center font-bold">5</span>
                ชื่อคนที่ 5
              </span>
              <span className="text-xs text-slate-400 font-normal">
                (ไม่บังคับกรอก)
              </span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={formData.person5}
                onChange={(e) => handleChange('person5', e.target.value)}
                placeholder="เช่น นางปราณี มุ่งมั่นดี"
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 bg-slate-50/40 focus:bg-white transition-all text-slate-800 placeholder-slate-400 font-medium"
              />
            </div>
          </div>

          {/* Live Summary Preview Box */}
          <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
            <div className="text-xs text-slate-600">
              จำนวนที่ระบุ: <span className="font-bold text-slate-900 text-sm">{filledCount > 0 ? filledCount : 0}</span> ท่าน
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500 block">ประเมินยอดรวม</span>
              <span className="font-extrabold text-blue-600 text-base">
                {filledCount > 0 ? (filledCount * PRICE_PER_DOSE).toLocaleString('th-TH') : 0} บาท
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full group relative inline-flex items-center justify-center px-8 py-4 text-base sm:text-lg font-bold text-white bg-gradient-to-r from-blue-600 via-blue-700 to-teal-600 rounded-2xl shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] transition-all duration-200 cursor-pointer overflow-hidden"
            >
              {/* Highlight flare */}
              <div className="absolute inset-0 w-1/2 h-full bg-white/20 skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000" />
              
              <span className="flex items-center gap-2">
                ขอดูผลงานก่อนส่งหน่อยเด้ 🧐
              </span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
