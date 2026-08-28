import { RegistrationRecord, PRICE_PER_DOSE } from '../types/registration';

const STORAGE_KEY = 'influenza_gi_registrations_v1';
const API_URL_KEY = 'influenza_gi_api_url_v1';

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
    return JSON.parse(rawData);
  } catch (error) {
    console.error('Failed to parse registrations from localStorage', error);
    return [];
  }
}

export function setLocalRegistrations(records: RegistrationRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
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
    if (json && Array.isArray(json.data)) {
      // Save fresh data into local cache
      setLocalRegistrations(json.data);
      return { success: true, data: json.data };
    } else if (Array.isArray(json)) {
      setLocalRegistrations(json);
      return { success: true, data: json };
    }

    return { success: false, data: getLocalRegistrations(), error: 'รูปแบบข้อมูลไม่ถูกต้อง' };
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
      // Use standard fetch or no-cors for Google Apps Script
      fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(newRecord),
        mode: 'no-cors', // Google Apps Script redirects require no-cors or standard text
      }).catch(e => console.warn('Background cloud post warning:', e));
    } catch (e) {
      console.warn('Cloud post error:', e);
    }
  }

  return newRecord;
}

export function deleteRegistration(id: string): RegistrationRecord[] {
  const existing = getLocalRegistrations();
  const filtered = existing.filter(item => item.id !== id);
  setLocalRegistrations(filtered);
  return filtered;
}

export function clearAllRegistrations(): void {
  setLocalRegistrations([]);
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
