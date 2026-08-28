import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, RotateCw, Receipt, Sparkles, ExternalLink } from 'lucide-react';
import { RegistrationRecord } from '../types/registration';

interface SuccessScreenProps {
  lastRecord: RegistrationRecord | null;
  onReset: () => void;
  onGoToAdmin: () => void;
}

export const SuccessScreen: React.FC<SuccessScreenProps> = ({
  lastRecord,
  onReset,
  onGoToAdmin,
}) => {
  useEffect(() => {
    // Fire confetti celebration
    const count = 200;
    const defaults = {
      origin: { y: 0.6 },
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });
    fire(0.2, {
      spread: 60,
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  }, []);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-200/80 text-center relative overflow-hidden">
        
        {/* Top celebratory banner */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/20 animate-bounce">
          <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-600" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 mb-3">
          <Sparkles className="w-3.5 h-3.5" /> ลงทะเบียนสำเร็จเรียบร้อย
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
          เย้! บันทึกข้อมูลสำเร็จแล้ว
        </h2>
        <p className="text-slate-500 text-sm sm:text-base mt-2 max-w-md mx-auto">
          ระบบได้บันทึกข้อมูลการจองวัคซีนของท่านและผู้ร่วมรับการฉีดเรียบร้อยแล้ว เตรียมแขนรอรับภูมิคุ้มกันได้เลย! 💪💉
        </p>

        {/* Receipt Card */}
        {lastRecord && (
          <div className="mt-8 p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200/80 text-left">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-blue-600" />
                <span className="font-bold text-slate-700 text-sm">หลักฐานการลงทะเบียน</span>
              </div>
              <span className="text-xs font-mono font-bold bg-blue-100 text-blue-800 px-2.5 py-1 rounded-md">
                {lastRecord.id}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
              <div>
                <span className="text-slate-500 block">ผู้ลงทะเบียนหลัก</span>
                <span className="font-semibold text-slate-800 text-sm sm:text-base">{lastRecord.names[0]}</span>
              </div>
              <div>
                <span className="text-slate-500 block">วันที่และเวลา</span>
                <span className="font-medium text-slate-700">{lastRecord.thaiDateFormatted}</span>
              </div>
              <div>
                <span className="text-slate-500 block">จำนวนผู้ฉีดทั้งหมด</span>
                <span className="font-semibold text-slate-800">{lastRecord.personCount} ท่าน</span>
              </div>
              <div>
                <span className="text-slate-500 block">ยอดรวมทั้งสิ้น</span>
                <span className="font-black text-emerald-600 text-base">
                  {lastRecord.totalPrice.toLocaleString('th-TH')} บาท
                </span>
              </div>
            </div>

            {/* List of registered names */}
            <div className="mt-4 pt-3 border-t border-slate-200/70">
              <span className="text-xs text-slate-500 block mb-2 font-medium">รายชื่อในรอบนี้:</span>
              <div className="flex flex-wrap gap-1.5">
                {lastRecord.names.map((name, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 bg-white border border-slate-200 text-slate-700 px-2.5 py-1 rounded-lg text-xs font-medium"
                  >
                    <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 text-[10px] flex items-center justify-center font-bold">
                      {i + 1}
                    </span>
                    {name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Action Button: Reset & Add More */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={onReset}
            className="w-full sm:w-2/3 py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-extrabold text-base sm:text-lg flex items-center justify-center gap-2.5 shadow-xl shadow-blue-600/25 hover:shadow-blue-600/35 active:scale-[0.99] transition-all cursor-pointer"
          >
            <RotateCw className="w-5 h-5" />
            <span>มีคนอยากโดนจิ้มเพิ่ม กดตรงนี้จ้า 🔄</span>
          </button>

          <button
            type="button"
            onClick={onGoToAdmin}
            className="w-full sm:w-1/3 py-4 px-4 rounded-2xl border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-sm sm:text-base flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-[0.99]"
          >
            <span>ดูรายการที่แอดมิน</span>
            <ExternalLink className="w-4 h-4 text-slate-400" />
          </button>
        </div>

      </div>
    </div>
  );
};
