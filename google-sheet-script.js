/**
 * =========================================================================
 * Google Apps Script สำหรับระบบลงทะเบียนฉีดวัคซีน influenza-gi
 * บริษัทโกลบอลอินเตอร์ จำกัด (Global Inter Co., Ltd.)
 * =========================================================================
 * 
 * รองรับ: บันทึกข้อมูล / ดึงข้อมูลแบบเรียลไทม์ / ลบรายรายการ / ล้างตาราง
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

function testRun() {
  const sheet = setupSheetIfNeeded();
  Logger.log("ตารางพร้อมใช้งาน: " + (sheet ? sheet.getName() : ""));
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
    const records = [];

    rows.forEach((row, idx) => {
      // ข้ามแถวที่ว่าง
      if (!row[0] && !row[1] && !row[2]) return;

      const namesList = [];
      for (let i = 3; i <= 7; i++) {
        if (row[i] && String(row[i]).trim() !== "" && String(row[i]).trim() !== "-") {
          namesList.push(String(row[i]).trim());
        }
      }
      if (namesList.length === 0 && row[2]) {
        namesList.push(...String(row[2]).split(",").map(s => s.trim()).filter(s => s.length > 0));
      }

      records.push({
        id: String(row[0]) || `GI-2569-${idx + 1}`,
        thaiDateFormatted: String(row[1]) || "",
        names: namesList,
        personCount: Number(row[8]) || namesList.length || 1,
        pricePerDose: Number(row[9]) || 390,
        totalPrice: Number(row[10]) || (namesList.length * 390),
        createdAt: String(row[11]) || new Date().toISOString()
      });
    });

    records.reverse(); // เอาล่าสุดขึ้นก่อน

    return createJsonResponse({ status: "success", data: records });
  } catch (err) {
    return createJsonResponse({ status: "error", error: err.toString() });
  }
}

// POST: บันทึกใหม่ / ลบรายการ / ล้างทั้งหมด
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

    // 1. จัดการคำสั่งลบรายรายการ (Action: delete)
    if (body.action === 'delete' && body.id) {
      const targetId = String(body.id).trim();
      const data = sheet.getDataRange().getValues();
      let deleted = false;
      
      for (let i = 1; i < data.length; i++) {
        if (String(data[i][0]).trim() === targetId) {
          sheet.deleteRow(i + 1); // Row index is 1-based
          deleted = true;
          break;
        }
      }
      return createJsonResponse({ status: "success", message: deleted ? "Deleted row from sheet" : "Row not found" });
    }

    // 2. จัดการคำสั่งล้างทั้งหมด (Action: clear_all)
    if (body.action === 'clear_all') {
      const lastRow = sheet.getLastRow();
      if (lastRow > 1) {
        sheet.deleteRows(2, lastRow - 1);
      }
      return createJsonResponse({ status: "success", message: "All rows cleared" });
    }

    // 3. บันทึกข้อมูลการลงทะเบียนใหม่
    const id = body.id || `GI-2569-${new Date().getTime()}`;
    const thaiDate = body.thaiDateFormatted || "";
    const names = Array.isArray(body.names) ? body.names : [];
    const personCount = Number(body.personCount) || names.length || 1;
    const pricePerDose = Number(body.pricePerDose) || 390;
    const totalPrice = Number(body.totalPrice) || (personCount * pricePerDose);
    const createdAt = body.createdAt || new Date().toISOString();

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
