import React from 'react';
import { Edit3, CheckCircle2, FileCheck2 } from 'lucide-react';
import { FormStep } from '../types/registration';

interface StepIndicatorProps {
  currentStep: FormStep;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  const steps = [
    { key: 'form', title: '1. กรอกรายชื่อ', icon: Edit3 },
    { key: 'preview', title: '2. ตรวจสอบข้อมูล & ยอดเงิน', icon: FileCheck2 },
    { key: 'success', title: '3. บันทึกสำเร็จ', icon: CheckCircle2 },
  ];

  const getStepIndex = (step: FormStep) => {
    switch (step) {
      case 'form': return 0;
      case 'preview': return 1;
      case 'success': return 2;
      default: return 0;
    }
  };

  const currentIndex = getStepIndex(currentStep);

  return (
    <div className="w-full max-w-2xl mx-auto mb-8 px-2">
      <div className="relative flex items-center justify-between">
        
        {/* Progress Bar Background */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 -z-0 rounded-full" />
        
        {/* Active Progress Bar */}
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-blue-500 to-teal-400 -z-0 rounded-full transition-all duration-500"
          style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isDone = idx < currentIndex;
          const isActive = idx === currentIndex;

          return (
            <div key={step.key} className="flex flex-col items-center z-10">
              <div
                className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                  isActive
                    ? 'bg-blue-600 text-white ring-4 ring-blue-100 shadow-lg shadow-blue-500/30 scale-110'
                    : isDone
                    ? 'bg-teal-500 text-white ring-4 ring-teal-50'
                    : 'bg-white text-slate-400 border-2 border-slate-300'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span
                className={`mt-2 text-xs sm:text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-blue-700 font-bold'
                    : isDone
                    ? 'text-teal-700'
                    : 'text-slate-400'
                }`}
              >
                {step.title}
              </span>
            </div>
          );
        })}

      </div>
    </div>
  );
};
