export interface RegistrationRecord {
  id: string;
  names: string[];
  personCount: number;
  pricePerDose: number;
  totalPrice: number;
  createdAt: string; // ISO 8601 string
  thaiDateFormatted: string;
}

export interface RegistrationFormData {
  person1: string;
  person2: string;
  person3: string;
  person4: string;
  person5: string;
}

export type FormStep = 'form' | 'preview' | 'success';
export type PageView = 'register' | 'admin';

export const PRICE_PER_DOSE = 390;
export const COMPANY_NAME = "บริษัทโกลบอลอินเตอร์ จำกัด";
export const CAMPAIGN_TITLE = "ลงทะเบียนฉีดวัคซีนไข้หวัดใหญ่ ประจำปี 2569";
