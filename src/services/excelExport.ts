import * as XLSX from 'xlsx';
import { RegistrationRecord, PRICE_PER_DOSE } from '../types/registration';

export function exportRegistrationsToExcel(registrations: RegistrationRecord[]): void {
  if (!registrations || registrations.length === 0) {
    alert('ไม่มีข้อมูลสำหรับส่งออกเป็นไฟล์ Excel');
    return;
  }

  const workbook = XLSX.utils.book_new();

  // =========================================================================
  // Sheet 1: รายชื่อผู้รับการฉีดวัคซีน (รายบุคคล 1 แถวต่อ 1 ท่าน)
  // เหมาะสำหรับฝ่ายบุคคล/พยาบาลใช้เช็กชื่อหน้างานวันฉีดวัคซีน
  // =========================================================================
  const individualRows: Array<{
    'ลำดับ': number | string;
    'ชื่อ-นามสกุล ผู้รับการฉีดวัคซีน': string;
    'รหัสการจอง': string;
    'วัน-เวลาที่ลงทะเบียน': string;
    'ลำดับในรอบ': string;
    'ราคา (บาท)': number | string;
  }> = [];

  let personIndex = 1;
  registrations.forEach((record) => {
    record.names.forEach((name, nIdx) => {
      individualRows.push({
        'ลำดับ': personIndex++,
        'ชื่อ-นามสกุล ผู้รับการฉีดวัคซีน': name,
        'รหัสการจอง': record.id,
        'วัน-เวลาที่ลงทะเบียน': record.thaiDateFormatted,
        'ลำดับในรอบ': `คนที่ ${nIdx + 1}`,
        'ราคา (บาท)': PRICE_PER_DOSE,
      });
    });
  });

  const totalPersons = individualRows.length;
  const totalAmount = totalPersons * PRICE_PER_DOSE;

  // Add summary row at bottom of individual list
  individualRows.push({
    'ลำดับ': 'รวมทั้งหมด',
    'ชื่อ-นามสกุล ผู้รับการฉีดวัคซีน': `รวมผู้ฉีดทั้งหมด ${totalPersons} ท่าน`,
    'รหัสการจอง': '-',
    'วัน-เวลาที่ลงทะเบียน': '-',
    'ลำดับในรอบ': '-',
    'ราคา (บาท)': totalAmount,
  });

  const wsIndividual = XLSX.utils.json_to_sheet(individualRows);
  wsIndividual['!cols'] = [
    { wch: 12 }, // ลำดับ
    { wch: 36 }, // ชื่อ-นามสกุล
    { wch: 20 }, // รหัสการจอง
    { wch: 26 }, // วัน-เวลาที่ลงทะเบียน
    { wch: 16 }, // ลำดับในรอบ
    { wch: 16 }, // ราคา
  ];

  XLSX.utils.book_append_sheet(workbook, wsIndividual, 'รายชื่อผู้ฉีดวัคซีน (รายคน)');

  // =========================================================================
  // Sheet 2: สรุปตามรอบการลงทะเบียน (Group / Batch Summary)
  // เหมาะสำหรับฝ่ายการเงิน/บัญชีเช็กยอดรวมแต่ละรอบ
  // =========================================================================
  const batchRows = registrations.map((item, index) => ({
    'ลำดับ': index + 1,
    'รหัสการจอง': item.id,
    'วัน-เวลาที่ลงทะเบียน': item.thaiDateFormatted,
    'รายชื่อผู้ลงทะเบียนในรอบนี้': item.names.join(', '),
    'จำนวนคน (ท่าน)': item.personCount,
    'ราคาต่อเข็ม (บาท)': item.pricePerDose,
    'ยอดเงินรวม (บาท)': item.totalPrice,
  }));

  const summaryBatchRow = {
    'ลำดับ': 'รวมทั้งหมด',
    'รหัสการจอง': '-',
    'วัน-เวลาที่ลงทะเบียน': '-',
    'รายชื่อผู้ลงทะเบียนในรอบนี้': `รวม ${registrations.length} รอบการลงทะเบียน`,
    'จำนวนคน (ท่าน)': totalPersons,
    'ราคาต่อเข็ม (บาท)': '-',
    'ยอดเงินรวม (บาท)': totalAmount,
  };

  const wsBatch = XLSX.utils.json_to_sheet([...batchRows, summaryBatchRow]);
  wsBatch['!cols'] = [
    { wch: 10 }, // ลำดับ
    { wch: 20 }, // รหัสการจอง
    { wch: 26 }, // วัน-เวลา
    { wch: 45 }, // รายชื่อทุกคนในรอบ
    { wch: 16 }, // จำนวนคน
    { wch: 18 }, // ราคาต่อเข็ม
    { wch: 20 }, // ยอดเงินรวม
  ];

  XLSX.utils.book_append_sheet(workbook, wsBatch, 'สรุปตามรอบการลงทะเบียน');

  // Generate file name with current date
  const now = new Date();
  const dateStr = `${now.getFullYear() + 543}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  const fileName = `รายชื่อลงทะเบียนวัคซีนไข้หวัดใหญ่_2569_GI_${dateStr}.xlsx`;

  // Save and download
  XLSX.writeFile(workbook, fileName);
}
