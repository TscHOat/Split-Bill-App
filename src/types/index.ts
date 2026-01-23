/**
 * Type definitions for Split Bill App
 */

export interface BillItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  assignedPerson: string;
}

export interface Person {
  id: string;
  name: string;
}

export type ChargeType = 'discount' | 'charge';
export type SplitMethod = 'equal' | 'proportional';

export interface Charge {
  id: string;
  name: string;
  amount: number;
  type: ChargeType; // 'discount' or 'charge'
  splitMethod: SplitMethod; // 'equal' or 'proportional'
}

export interface BillSummary {
  personId: string;
  personName: string;
  totalItemPrice: number;
  discountAmount: number;
  taxAmount:number;
  shareOfServiceCharge: number;
  finalAmount: number;
}

export interface BillState {
  items: BillItem[];
  persons: Person[];
  charges: Charge[];
}

export interface SplitBillCalculation {
  subtotal: number;
  totalDiscount: number;
  serviceChargeAmount: number;
  taxAmount: number;
  grandTotal: number;
  billSummary: BillSummary[];
}

export interface JsonImportFormat {
  items: Array<{
    name: string;
    price: number;
    quantity: number;
    assignedPerson: string;
  }>;
  persons: Array<{
    name: string;
  }>;
  charges?: Array<{
    name: string;
    amount: number;
    type: ChargeType;
    splitMethod: SplitMethod;
  }>;
}
