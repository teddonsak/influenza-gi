import * as XLSX from 'xlsx';
import { RegistrationRecord } from '../types/registration';

export function exportRegistrationsToExcel(registrations: RegistrationRecord[]): void {
  if (!registrations || registrations.length === 0) {
    alert('ไม่มีข้อมูลสำหรับส่งออกเป็นไฟล์ Excel');
    return;
  }

  // Build rows data
  const rows = registrations.map((item, index) => {
    return {
      'ลำดับ': index + 1,
      'รหัสการจอง': item.id,
      'วัน-เวลาที่ลงทะเบียน': item.thaiDateFormatted,
      'รายชื่อทั้งหมด': item.names.join(', '),
      'คนที่ 1': item.names[0] || '-',
      'คนที่ 2': item.names[1] || '-',
      'คนที่ 3': item.names[2] || '-',
      'คนที่ 4': item.names[3] || '-',
      'คนที่ 5': item.names[4] || '-',
      'จำนวนคน (ท่าน)': item.personCount,
      'ราคาต่อเข็ม (บาท)': item.pricePerDose,
      'ยอดเงินรวม (บาท)': item.totalPrice,
    };
  });

  // Calculate totals
  const totalPersons = registrations.reduce((acc, curr) => acc + curr.personCount, 0);
  const totalAmount = registrations.reduce((acc, curr) => acc + curr.totalPrice, 0);

  // Add Summary Row
  const summaryRow = {
    'ลำดับ': 'รวมทั้งหมด',
    'รหัสการจอง': '-',
    'วัน-เวลาที่ลงทะเบียน': '-',
    'รายชื่อทั้งหมด': `รวม ${registrations.length} รายการ`,
    'คนที่ 1': '-',
    'คนที่ 2': '-',
    'คนที่ 3': '-',
    'คนที่ 4': '-',
    'คนที่ 5': '-',
    'จำนวนคน (ท่าน)': totalPersons,
    'ราคาต่อเข็ม (บาท)': '-',
    'ยอดเงินรวม (บาท)': totalAmount,
  };

  const fullData = [...rows, summaryRow];

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(fullData);

  // Define column widths
  const colWidths = [
    { wch: 8 },   // ลำดับ
    { wch: 18 },  // รหัสการจอง
    { wch: 28 },  // วัน-เวลาที่ลงทะเบียน
    { wch: 40 },  // รายชื่อทั้งหมด
    { wch: 22 },  // คนที่ 1
    { wch: 22 },  // คนที่ 2
    { wch: 22 },  // คนที่ 3
    { wch: 22 },  // คนที่ 4
    { wch: 22 },  // คนที่ 5
    { wch: 16 },  // จำนวนคน
    { wch: 18 },  // ราคาต่อเข็ม
    { wch: 20 },  // ยอดเงินรวม
  ];
  worksheet['!cols'] = colWidths;

  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'รายชื่อผู้ลงทะเบียนวัคซีน');

  // Generate file name with current date
  const now = new Date();
  const dateStr = `${now.getFullYear() + 543}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  const fileName = `รายงานลงทะเบียนวัคซีนไข้หวัดใหญ่_2569_GI_${dateStr}.xlsx`;

  // Write file
  XLSX.writeFile(workbook, fileName);
}
