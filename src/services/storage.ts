import { RegistrationRecord, PRICE_PER_DOSE } from '../types/registration';

const STORAGE_KEY = 'influenza_gi_registrations_v1';

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

export function getRegistrations(): RegistrationRecord[] {
  try {
    const rawData = localStorage.getItem(STORAGE_KEY);
    if (!rawData) {
      // Return empty array initially, or initial mock data if desired
      return [];
    }
    return JSON.parse(rawData);
  } catch (error) {
    console.error('Failed to parse registrations from localStorage', error);
    return [];
  }
}

export function saveRegistration(names: string[]): RegistrationRecord {
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

  const existing = getRegistrations();
  const updated = [newRecord, ...existing];
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to save registration to localStorage', error);
  }

  return newRecord;
}

export function deleteRegistration(id: string): RegistrationRecord[] {
  const existing = getRegistrations();
  const filtered = existing.filter(item => item.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to update localStorage', error);
  }
  return filtered;
}

export function clearAllRegistrations(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear registrations from localStorage', error);
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

  localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleItems));
  return sampleItems;
}
