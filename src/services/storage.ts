import { RegistrationRecord, PRICE_PER_DOSE } from '../types/registration';

const STORAGE_KEY = 'influenza_gi_registrations_v1';
const API_URL_KEY = 'influenza_gi_api_url_v1';
const DELETED_IDS_KEY = 'influenza_gi_deleted_ids_v1';

// Default Google Apps Script Web App URL for Google Sheets cloud sync
export const DEFAULT_API_URL = 'https://script.google.com/macros/s/AKfycbxTMejQQx9ajUn5U-7-JmfvQZ_gZhmi7_yJo4h8vb4j-1aTJ5U4SzV6YUeaWrPFXLbfFQ/exec';

export function getApiUrl(): string {
  try {
    return localStorage.getItem(API_URL_KEY) || DEFAULT_API_URL;
  } catch {
    return DEFAULT_API_URL;
  }
}

export function setApiUrl(url: string): void {
  try {
    localStorage.setItem(API_URL_KEY, url.trim());
  } catch (error) {
    console.error('Failed to set API URL in localStorage', error);
  }
}

export function getDeletedIds(): Set<string> {
  try {
    const raw = localStorage.getItem(DELETED_IDS_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

export function addDeletedId(id: string): void {
  try {
    const set = getDeletedIds();
    set.add(String(id).trim());
    localStorage.setItem(DELETED_IDS_KEY, JSON.stringify(Array.from(set)));
  } catch (e) {
    console.error('Failed to add deleted ID', e);
  }
}

export function addMultipleDeletedIds(ids: string[]): void {
  try {
    const set = getDeletedIds();
    ids.forEach(id => set.add(String(id).trim()));
    localStorage.setItem(DELETED_IDS_KEY, JSON.stringify(Array.from(set)));
  } catch (e) {
    console.error('Failed to add multiple deleted IDs', e);
  }
}

export function formatThaiDateTime(dateInput: Date | string): string {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  
  const thaiMonths = [
    'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
    'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
  ];

  const day = date.getDate();
  const month = thaiMonths[date.getMonth()];
  const year = date.getFullYear() + 543; // BE Year
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return `${day} ${month} ${year} เวลา ${hours}:${minutes} น.`;
}

export function getLocalRegistrations(): RegistrationRecord[] {
  try {
    const rawData = localStorage.getItem(STORAGE_KEY);
    if (!rawData) return [];
    const list: RegistrationRecord[] = JSON.parse(rawData);
    const deletedIds = getDeletedIds();
    return list.filter(item => item && item.id && !deletedIds.has(String(item.id).trim()));
  } catch (error) {
    console.error('Failed to parse registrations from localStorage', error);
    return [];
  }
}

export function setLocalRegistrations(records: RegistrationRecord[]): void {
  try {
    const deletedIds = getDeletedIds();
    const filtered = records.filter(item => item && item.id && !deletedIds.has(String(item.id).trim()));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to save to localStorage', error);
  }
}

/**
 * Fetch registrations from Cloud API (Google Sheet / Backend)
 * If successful, syncs and caches into LocalStorage
 */
export async function fetchCloudRegistrations(): Promise<{ success: boolean; data: RegistrationRecord[]; error?: string }> {
  const apiUrl = getApiUrl();
  if (!apiUrl) {
    return { success: false, data: getLocalRegistrations(), error: 'ยังไม่ได้ตั้งค่า URL ฐานข้อมูลออนไลน์' };
  }

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const json = await response.json();
    let rawList: any[] = [];
    if (json && Array.isArray(json.data)) {
      rawList = json.data;
    } else if (Array.isArray(json)) {
      rawList = json;
    }

    const deletedIds = getDeletedIds();

    // กรองเฉพาะแถวที่สมบูรณ์ และตัดแถวที่ถูกสั่งลบออกอย่างถาวร
    const validRecords: RegistrationRecord[] = rawList.filter((item: any) => {
      if (!item || !item.id) return false;
      if (deletedIds.has(String(item.id).trim())) return false; // ข้ามรายการที่เคยลบไปแล้ว

      const hasNames = Array.isArray(item.names) && item.names.length > 0 && item.names.some((n: string) => n && n.trim().length > 0);
      return hasNames && item.thaiDateFormatted && item.thaiDateFormatted.trim().length > 0;
    });

    setLocalRegistrations(validRecords);
    return { success: true, data: validRecords };
  } catch (err: any) {
    console.warn('Cloud fetch warning (using local cache):', err.message);
    return { success: false, data: getLocalRegistrations(), error: err.message || 'ไม่สามารถเชื่อมต่อ Cloud ได้' };
  }
}

/**
 * Save new registration to both LocalStorage and Cloud API
 */
export async function saveRegistration(names: string[]): Promise<RegistrationRecord> {
  const validNames = names.map(n => n.trim()).filter(n => n.length > 0);
  const now = new Date();
  
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const recordId = `GI-2569-${now.getTime().toString().slice(-4)}${randomSuffix}`;

  const newRecord: RegistrationRecord = {
    id: recordId,
    names: validNames,
    personCount: validNames.length,
    pricePerDose: PRICE_PER_DOSE,
    totalPrice: validNames.length * PRICE_PER_DOSE,
    createdAt: now.toISOString(),
    thaiDateFormatted: formatThaiDateTime(now),
  };

  // 1. Save to Local Cache first
  const existing = getLocalRegistrations();
  const updated = [newRecord, ...existing];
  setLocalRegistrations(updated);

  // 2. Send to Cloud API (Google Sheet / Webhook) in background
  const apiUrl = getApiUrl();
  if (apiUrl) {
    try {
      fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(newRecord),
        mode: 'no-cors',
      }).catch(e => console.warn('Background cloud post warning:', e));
    } catch (e) {
      console.warn('Cloud post error:', e);
    }
  }

  return newRecord;
}

export async function deleteRegistration(id: string): Promise<RegistrationRecord[]> {
  // บันทึก ID ลง Blacklist เพื่อไม่ให้ Cloud ส่งกลับมาแสดงอีก
  addDeletedId(id);

  const existing = getLocalRegistrations();
  const filtered = existing.filter(item => String(item.id).trim() !== String(id).trim());
  setLocalRegistrations(filtered);

  const apiUrl = getApiUrl();
  if (apiUrl) {
    try {
      fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action: 'delete', id: id }),
        mode: 'no-cors',
      }).catch(e => console.warn('Background cloud delete warning:', e));
    } catch (e) {
      console.warn('Cloud delete error:', e);
    }
  }

  return filtered;
}

export async function clearAllRegistrations(): Promise<void> {
  const current = getLocalRegistrations();
  const currentIds = current.map(item => String(item.id).trim());
  addMultipleDeletedIds(currentIds);

  setLocalRegistrations([]);

  const apiUrl = getApiUrl();
  if (apiUrl) {
    try {
      fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action: 'clear_all' }),
        mode: 'no-cors',
      }).catch(e => console.warn('Background cloud clear warning:', e));
    } catch (e) {
      console.warn('Cloud clear error:', e);
    }
  }
}

export function seedSampleData(): RegistrationRecord[] {
  const now = new Date();
  const sampleItems: RegistrationRecord[] = [
    {
      id: 'GI-2569-8801',
      names: ['สมชาย มุ่งมั่นดี', 'สมหญิง มุ่งมั่นดี'],
      personCount: 2,
      pricePerDose: PRICE_PER_DOSE,
      totalPrice: 2 * PRICE_PER_DOSE,
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 3).toISOString(),
      thaiDateFormatted: formatThaiDateTime(new Date(now.getTime() - 1000 * 60 * 60 * 3)),
    },
    {
      id: 'GI-2569-8802',
      names: ['กิตติศักดิ์ เจริญพร', 'วราภรณ์ เจริญพร', 'ด.ช. กิตติภพ เจริญพร'],
      personCount: 3,
      pricePerDose: PRICE_PER_DOSE,
      totalPrice: 3 * PRICE_PER_DOSE,
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24).toISOString(),
      thaiDateFormatted: formatThaiDateTime(new Date(now.getTime() - 1000 * 60 * 60 * 24)),
    },
    {
      id: 'GI-2569-8803',
      names: ['ณิชาภา รักสุขภาพ'],
      personCount: 1,
      pricePerDose: PRICE_PER_DOSE,
      totalPrice: 1 * PRICE_PER_DOSE,
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 48).toISOString(),
      thaiDateFormatted: formatThaiDateTime(new Date(now.getTime() - 1000 * 60 * 60 * 48)),
    }
  ];

  setLocalRegistrations(sampleItems);
  return sampleItems;
}
