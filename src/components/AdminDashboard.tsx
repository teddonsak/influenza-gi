import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Users,
  Search,
  Trash2,
  Calendar,
  DollarSign,
  TrendingUp,
  Sparkles,
  ArrowLeft,
  Syringe,
  AlertTriangle
} from 'lucide-react';
import { RegistrationRecord, PRICE_PER_DOSE, COMPANY_NAME } from '../types/registration';
import { exportRegistrationsToExcel } from '../services/excelExport';

interface AdminDashboardProps {
  registrations: RegistrationRecord[];
  onDeleteRecord: (id: string) => void;
  onClearAll: () => void;
  onSeedMockData: () => void;
  onBackToRegister: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  registrations,
  onDeleteRecord,
  onClearAll,
  onSeedMockData,
  onBackToRegister,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Search filtering
  const filteredRegistrations = registrations.filter((item) => {
    const query = searchTerm.toLowerCase().trim();
    if (!query) return true;
    const matchId = item.id.toLowerCase().includes(query);
    const matchNames = item.names.some((name) => name.toLowerCase().includes(query));
    const matchDate = item.thaiDateFormatted.toLowerCase().includes(query);
    return matchId || matchNames || matchDate;
  });

  // Calculate statistics
  const totalSubmissions = registrations.length;
  const totalPeopleVaccinated = registrations.reduce((acc, curr) => acc + curr.personCount, 0);
  const totalRevenue = registrations.reduce((acc, curr) => acc + curr.totalPrice, 0);
  const avgPeoplePerOrder = totalSubmissions > 0 ? (totalPeopleVaccinated / totalSubmissions).toFixed(1) : '0';

  const handleExport = () => {
    exportRegistrationsToExcel(registrations);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบรายการลงทะเบียนของ "${name}" (${id})?`)) {
      onDeleteRecord(id);
    }
  };

  const handleClearAll = () => {
    if (window.confirm('คำเตือน: คุณต้องการลบข้อมูลการลงทะเบียนทั้งหมดออกจากระบบใช่หรือไม่? ข้อมูลจะไม่สามารถกู้คืนได้')) {
      onClearAll();
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Top Header & Actions Bar */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-teal-700 bg-teal-50 border border-teal-200/80 px-3 py-1 rounded-full w-fit mb-2">
              <Syringe className="w-3.5 h-3.5" />
              แผงควบคุมผู้ดูแลระบบ (Admin Console)
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              รายการลงทะเบียนฉีดวัคซีน 2569
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              {COMPANY_NAME} • อัตราค่าบริการ {PRICE_PER_DOSE} บาท/เข็ม
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={onBackToRegister}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-all shadow-xs cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>หน้าลงทะเบียน</span>
            </button>

            <button
              type="button"
              onClick={handleExport}
              disabled={registrations.length === 0}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold shadow-md shadow-emerald-600/20 hover:shadow-lg transition-all cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>ดาวน์โหลดไฟล์ Excel (.xlsx)</span>
            </button>
          </div>

        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
          
          {/* Total Submissions */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/70">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
              <span>จำนวนรอบที่ลงทะเบียน</span>
              <Calendar className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl font-black text-slate-800">
              {totalSubmissions.toLocaleString('th-TH')} <span className="text-xs font-semibold text-slate-400">รายการ</span>
            </div>
          </div>

          {/* Total Persons */}
          <div className="bg-blue-50/60 rounded-2xl p-4 border border-blue-200/70">
            <div className="flex items-center justify-between text-blue-700 text-xs font-medium mb-1">
              <span>ยอดผู้ประสงค์ฉีดรวม</span>
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-black text-blue-700">
              {totalPeopleVaccinated.toLocaleString('th-TH')} <span className="text-xs font-semibold text-blue-500">คน / โดส</span>
            </div>
          </div>

          {/* Total Revenue */}
          <div className="bg-emerald-50/60 rounded-2xl p-4 border border-emerald-200/70">
            <div className="flex items-center justify-between text-emerald-700 text-xs font-medium mb-1">
              <span>ยอดเงินรวมทั้งสิ้น</span>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-emerald-700">
              {totalRevenue.toLocaleString('th-TH')} <span className="text-xs font-semibold text-emerald-500">บาท</span>
            </div>
          </div>

          {/* Avg per order */}
          <div className="bg-purple-50/60 rounded-2xl p-4 border border-purple-200/70">
            <div className="flex items-center justify-between text-purple-700 text-xs font-medium mb-1">
              <span>เฉลี่ยต่อรายการ</span>
              <TrendingUp className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-2xl font-black text-purple-700">
              {avgPeoplePerOrder} <span className="text-xs font-semibold text-purple-500">คน/รอบ</span>
            </div>
          </div>

        </div>
      </div>

      {/* Table & Controls Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80">
        
        {/* Table Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
          
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ค้นหาตามชื่อ, รหัสการจอง, หรือวันที่..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-sm font-medium transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 hover:text-slate-600"
              >
                ล้างคำค้น
              </button>
            )}
          </div>

          {/* Secondary helper actions */}
          <div className="flex items-center gap-2">
            {registrations.length === 0 && (
              <button
                type="button"
                onClick={onSeedMockData}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold border border-amber-200 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>เพิ่มข้อมูลตัวอย่าง (Mock Data)</span>
              </button>
            )}

            {registrations.length > 0 && (
              <button
                type="button"
                onClick={handleClearAll}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 border border-rose-200 text-xs font-semibold transition-colors cursor-pointer"
                title="ลบข้อมูลทั้งหมด"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>ล้างทั้งหมด</span>
              </button>
            )}
          </div>

        </div>

        {/* Registrations Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200/90 shadow-xs">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/90 text-xs uppercase font-bold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">#</th>
                <th className="py-3.5 px-4">วันที่ - เวลา</th>
                <th className="py-3.5 px-4">รหัสการจอง</th>
                <th className="py-3.5 px-4">รายชื่อผู้ลงทะเบียนในรอบนั้น</th>
                <th className="py-3.5 px-4 text-center">จำนวนคน</th>
                <th className="py-3.5 px-4 text-right">ราคารวม</th>
                <th className="py-3.5 px-4 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/70">
              {filteredRegistrations.length > 0 ? (
                filteredRegistrations.map((record, index) => (
                  <tr key={record.id} className="hover:bg-slate-50/80 transition-colors">
                    
                    {/* Index */}
                    <td className="py-4 px-4 font-semibold text-slate-400 text-xs">
                      {index + 1}
                    </td>

                    {/* Date/Time */}
                    <td className="py-4 px-4 whitespace-nowrap text-xs text-slate-700">
                      <div className="font-medium">{record.thaiDateFormatted}</div>
                    </td>

                    {/* ID */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="font-mono text-xs font-bold bg-slate-100 text-slate-700 px-2 py-1 rounded-md">
                        {record.id}
                      </span>
                    </td>

                    {/* Names Badges */}
                    <td className="py-4 px-4">
                      <div className="flex flex-wrap gap-1.5 max-w-lg">
                        {record.names.map((name, nIdx) => (
                          <span
                            key={nIdx}
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-medium ${
                              nIdx === 0
                                ? 'bg-blue-50 text-blue-800 border border-blue-200 font-semibold'
                                : 'bg-slate-100 text-slate-700 border border-slate-200'
                            }`}
                          >
                            <span className="text-[10px] font-bold text-slate-400">
                              {nIdx + 1}.
                            </span>
                            {name}
                            {nIdx === 0 && (
                              <span className="text-[9px] bg-blue-200/60 text-blue-900 px-1 rounded">
                                หลัก
                              </span>
                            )}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Person Count */}
                    <td className="py-4 px-4 text-center whitespace-nowrap">
                      <span className="inline-flex items-center justify-center font-bold px-2.5 py-1 rounded-full text-xs bg-slate-100 text-slate-800">
                        {record.personCount} ท่าน
                      </span>
                    </td>

                    {/* Total Price */}
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <span className="font-bold text-emerald-600 text-sm">
                        {record.totalPrice.toLocaleString('th-TH')}
                      </span>
                      <span className="text-xs text-slate-400 ml-1">บาท</span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-center whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleDelete(record.id, record.names[0])}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="ลบรายการนี้"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 px-4 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <AlertTriangle className="w-8 h-8 text-slate-300" />
                      <p className="text-base font-semibold text-slate-600">
                        {searchTerm ? 'ไม่พบข้อมูลที่ตรงกับคำค้นหา' : 'ยังไม่มีข้อมูลการลงทะเบียนในระบบ'}
                      </p>
                      <p className="text-xs text-slate-400">
                        {searchTerm
                          ? 'ลองค้นหาด้วยคำอื่น หรือกดล้างคำค้น'
                          : 'เมื่อมีผู้ลงทะเบียนผ่านหน้าเว็บ ข้อมูลจะปรากฏที่นี่ทันที หรือกดปุ่มเพิ่มข้อมูลตัวอย่างเพื่อทดสอบ'}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Summary in Table */}
        {filteredRegistrations.length > 0 && (
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
            <div>
              แสดง {filteredRegistrations.length} จากทั้งหมด {registrations.length} รายการ
            </div>
            <div className="font-semibold text-slate-700">
              ยอดรวมของผู้ที่แสดงในหน้านี้: {filteredRegistrations.reduce((a, c) => a + c.personCount, 0)} คน ({filteredRegistrations.reduce((a, c) => a + c.totalPrice, 0).toLocaleString('th-TH')} บาท)
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
