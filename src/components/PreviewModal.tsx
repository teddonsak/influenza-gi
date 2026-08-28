import React from 'react';
import { UserCheck, ArrowLeft, CheckCircle, Calculator, ShieldCheck, HeartPulse } from 'lucide-react';
import { RegistrationFormData, PRICE_PER_DOSE, COMPANY_NAME } from '../types/registration';

interface PreviewModalProps {
  formData: RegistrationFormData;
  onBack: () => void;
  onConfirm: () => void;
  isSubmitting?: boolean;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({
  formData,
  onBack,
  onConfirm,
  isSubmitting = false,
}) => {
  // Filter only filled names
  const validNames = [
    formData.person1,
    formData.person2,
    formData.person3,
    formData.person4,
    formData.person5,
  ].map((n) => n.trim()).filter((n) => n.length > 0);

  const count = validNames.length;
  const totalPrice = count * PRICE_PER_DOSE;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80">
        
        {/* Header */}
        <div className="text-center pb-6 border-b border-slate-100">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3 shadow-inner">
            <UserCheck className="w-7 h-7 text-blue-600" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800">
            ตรวจสอบข้อมูลการลงทะเบียน
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            โปรดตรวจสอบความถูกต้องของรายชื่อและยอดชำระก่อนยืนยัน
          </p>
        </div>

        {/* Names List Summary */}
        <div className="mt-6">
          <div className="flex items-center justify-between text-sm font-bold text-slate-700 mb-3">
            <span>รายชื่อผู้รับการฉีดวัคซีน</span>
            <span className="text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full font-bold">
              รวม {count} ท่าน
            </span>
          </div>

          <div className="space-y-2.5">
            {validNames.map((name, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 hover:bg-blue-50/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold ${
                    index === 0
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-200 text-slate-700'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800 text-sm sm:text-base">
                      {name}
                    </span>
                    {index === 0 && (
                      <span className="ml-2 text-xs bg-blue-100/80 text-blue-800 px-2 py-0.5 rounded-md font-semibold">
                        ผู้ติดต่อหลัก
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-xs text-slate-500 font-medium hidden sm:block">
                  1 เข็ม ({PRICE_PER_DOSE}.-)
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Price Calculation Box */}
        <div className="mt-6 p-5 rounded-2xl bg-gradient-to-br from-blue-50/80 to-teal-50/80 border border-blue-100">
          <div className="flex items-center gap-2 text-blue-900 font-bold text-sm mb-3">
            <Calculator className="w-4 h-4 text-blue-600" />
            <span>สรุปยอดเงินรวม</span>
          </div>

          <div className="space-y-2 text-sm text-slate-600">
            <div className="flex justify-between items-center">
              <span>จำนวนผู้ฉีด ({count} ท่าน × {PRICE_PER_DOSE} บาท)</span>
              <span className="font-semibold text-slate-800">{totalPrice.toLocaleString('th-TH')} บาท</span>
            </div>
            <div className="flex justify-between items-center text-xs text-teal-700">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> ค่าแพทย์และอุปกรณ์ทางการแพทย์
              </span>
              <span className="font-medium">รวมแล้ว (ฟรี)</span>
            </div>
            <div className="pt-3 border-t border-blue-200/60 flex justify-between items-center">
              <span className="font-bold text-slate-900 text-base">ยอดชำระสุทธิทั้งสิ้น</span>
              <span className="text-2xl font-black text-blue-600">
                {totalPrice.toLocaleString('th-TH')} <span className="text-sm font-semibold text-slate-600">บาท</span>
              </span>
            </div>
          </div>
        </div>

        {/* Notice */}
        <div className="mt-4 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-2.5">
          <HeartPulse className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>
            บริษัท {COMPANY_NAME} ขอให้พนักงานและครอบครัวมีสุขภาพแข็งแรง ปลอดภัยจากไข้หวัดใหญ่ตลอดปี 2569
          </span>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col-reverse sm:flex-row gap-3">
          
          {/* Back Button */}
          <button
            type="button"
            onClick={onBack}
            disabled={isSubmitting}
            className="w-full sm:w-1/2 py-3.5 px-4 rounded-2xl border-2 border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-[0.99]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>อุ๊ย! พิมพ์ผิด ขอถอยไปแก้แป๊บ 🚗💨</span>
          </button>

          {/* Confirm Button */}
          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className="w-full sm:w-1/2 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/40 transition-all cursor-pointer active:scale-[0.99] group"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                กำลังบันทึกข้อมูล...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>ยืนยัน! จัดเต็มมาเลยพี่ 💉✨</span>
              </span>
            )}
          </button>

        </div>

      </div>
    </div>
  );
};
