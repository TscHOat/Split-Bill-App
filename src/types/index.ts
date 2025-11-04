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

export interface BillSummary {
  personId: string;
  personName: string;
  totalItemPrice: number;
  discountAmount: number;
  shareOfServiceCharge: number;
  finalAmount: number;
}

export interface BillState {
  items: BillItem[];
  persons: Person[];
  serviceCharge: number; // nominal amount in Rp
  tax: number; // nominal amount in Rp
  discount: number; // global discount in nominal Rp
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
  serviceCharge?: number;
  tax?: number;
  discount?: number;
}
