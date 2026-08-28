/**
 * =========================================================================
 * Google Apps Script สำหรับระบบลงทะเบียนฉีดวัคซีน influenza-gi
 * บริษัทโกลบอลอินเตอร์ จำกัด (Global Inter Co., Ltd.)
 * =========================================================================
 * 
 * วิธีติดตั้งใน Google Sheets:
 * 1. เปิด Google Sheets เปล่า (สร้างใหม่ที่ sheets.new)
 * 2. ไปที่เมนู ส่วนขยาย (Extensions) > Apps Script
 * 3. ลบโค้ดเดิมทั้งหมดออก แล้ววางโค้ดทั้งหมดนี้ลงไป
 * 4. กดปุ่ม "บันทึก" (รูปแผ่นดิสก์)
 * 5. กดปุ่มสีน้ำเงินมุมขวาบน "การทำให้ใช้งานได้" (Deploy) > "การทำให้ใช้งานได้รายการใหม่" (New deployment)
 * 6. เลือกประเภทเป็น "เว็บแอป" (Web app)
 *    - คำอธิบาย: influenza-gi API
 *    - ดำเนินการในฐานะ: ตัวฉัน (Me)
 *    - ผู้มีสิทธิ์เข้าถึง: ทุกคน (Anyone)  <--- สำคัญมาก! ต้องเลือก Anyone
 * 7. กดปุ่ม "ทำให้ใช้งานได้" (Deploy) แล้วให้สิทธิ์การเข้าถึง (Authorize access)
 * 8. คัดลอก "URL ของเว็บแอป" (ขึ้นต้นด้วย https://script.google.com/macros/s/.../exec)
 *    นำไปวางในหน้า Admin ของเว็บแอป influenza-gi
 * =========================================================================
 */

const SHEET_NAME = "รายชื่อลงทะเบียนวัคซีน";

function setupSheetIfNeeded(ss) {
  const spreadsheet = ss || SpreadsheetApp.getActiveSpreadsheet();
  if (!spreadsheet) return null;
  
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
    sheet.appendRow([
      "รหัสการจอง",
      "วัน-เวลาที่ลงทะเบียน",
      "รายชื่อทั้งหมดในรอบนี้",
      "คนที่ 1",
      "คนที่ 2",
      "คนที่ 3",
      "คนที่ 4",
      "คนที่ 5",
      "จำนวนคน",
      "ราคาต่อเข็ม (บาท)",
      "ยอดเงินรวม (บาท)",
      "Timestamp (ISO)"
    ]);
    
    const headerRange = sheet.getRange(1, 1, 1, 12);
    headerRange.setBackground("#0284c7");
    headerRange.setFontColor("#ffffff");
    headerRange.setFontWeight("bold");
    headerRange.setHorizontalAlignment("center");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// ฟังก์ชันสำหรับทดสอบรัน
function testRun() {
  const sheet = setupSheetIfNeeded();
  Logger.log("สร้าง/ตรวจสอบตารางสำเร็จ: " + (sheet ? sheet.getName() : ""));
}

// GET: ดึงข้อมูลการลงทะเบียนทั้งหมดไปแสดงที่หน้า Admin
function doGet(e) {
  try {
    const sheet = setupSheetIfNeeded();
    if (!sheet) return createJsonResponse({ status: "error", error: "Spreadsheet not found" });
    
    const data = sheet.getDataRange().getValues();
    if (data.length <= 1) {
      return createJsonResponse({ status: "success", data: [] });
    }
    
    const rows = data.slice(1);
    const records = rows.map((row, idx) => {
      const namesList = [];
      for (let i = 3; i <= 7; i++) {
        if (row[i] && String(row[i]).trim() !== "" && String(row[i]).trim() !== "-") {
          namesList.push(String(row[i]).trim());
        }
      }
      if (namesList.length === 0 && row[2]) {
        namesList.push(...String(row[2]).split(",").map(s => s.trim()).filter(s => s.length > 0));
      }

      return {
        id: row[0] || `GI-2569-${idx + 1}`,
        thaiDateFormatted: row[1] || "",
        names: namesList,
        personCount: Number(row[8]) || namesList.length || 1,
        pricePerDose: Number(row[9]) || 390,
        totalPrice: Number(row[10]) || (namesList.length * 390),
        createdAt: row[11] || new Date().toISOString()
      };
    }).reverse(); // เอาล่าสุดขึ้นก่อน

    return createJsonResponse({ status: "success", data: records });
  } catch (err) {
    return createJsonResponse({ status: "error", error: err.toString() });
  }
}

// POST: บันทึกข้อมูลการลงทะเบียนใหม่เมื่อมีคนกดส่งฟอร์ม
function doPost(e) {
  try {
    const sheet = setupSheetIfNeeded();
    if (!sheet) return createJsonResponse({ status: "error", error: "Spreadsheet not found" });
    
    let body = {};
    if (e.postData && e.postData.contents) {
      body = JSON.parse(e.postData.contents);
    } else if (e.parameter) {
      body = e.parameter;
    }

    const id = body.id || `GI-2569-${new Date().getTime()}`;
    const thaiDate = body.thaiDateFormatted || "";
    const names = Array.isArray(body.names) ? body.names : [];
    const personCount = Number(body.personCount) || names.length || 1;
    const pricePerDose = Number(body.pricePerDose) || 390;
    const totalPrice = Number(body.totalPrice) || (personCount * pricePerDose);
    const createdAt = body.createdAt || new Date().toISOString();

    // บันทึกแถวใหม่ลง Google Sheet
    sheet.appendRow([
      id,
      thaiDate,
      names.join(", "),
      names[0] || "-",
      names[1] || "-",
      names[2] || "-",
      names[3] || "-",
      names[4] || "-",
      personCount,
      pricePerDose,
      totalPrice,
      createdAt
    ]);

    return createJsonResponse({ status: "success", message: "Saved to Google Sheet successfully", id: id });
  } catch (err) {
    return createJsonResponse({ status: "error", error: err.toString() });
  }
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
