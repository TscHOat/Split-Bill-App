/**
 * Helper functions for Split Bill App
 */

import type { BillItem, BillState, BillSummary, SplitBillCalculation, Person } from '../types';

/**
 * Generate unique ID
 */
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Calculate split bill with fair distribution of costs and discounts
 */
export const calculateSplitBill = (billState: BillState): SplitBillCalculation => {
  const { items, persons, serviceCharge, tax, discount } = billState;

  if (items.length === 0 || persons.length === 0) {
    return {
      subtotal: 0,
      totalDiscount: 0,
      serviceChargeAmount: 0,
      taxAmount: 0,
      grandTotal: 0,
      billSummary: [],
    };
  }

  // Calculate subtotal
  let subtotal = 0;
  items.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;
  });

  // Calculate discount amount (global nominal discount)
  const totalDiscount = discount;
  const subtotalAfterDiscount = subtotal - totalDiscount;

  // Service charge and tax are already nominal amounts
  const serviceChargeAmount = serviceCharge;
  const taxAmount = tax;
  const grandTotal = subtotalAfterDiscount + serviceChargeAmount + taxAmount;

  // Calculate per person breakdown
  const billSummary = calculatePerPersonAmount(
    items,
    persons,
    subtotal,
    totalDiscount,
    serviceChargeAmount,
    taxAmount
  );

  return {
    subtotal,
    totalDiscount,
    serviceChargeAmount,
    taxAmount,
    grandTotal,
    billSummary,
  };
};

/**
 * Calculate amount for each person
 * Fair distribution means:
 * 1. Each person pays only for items they ordered
 * 2. Discount is proportionally distributed based on item cost
 * 3. Service charge and tax are distributed proportionally to subtotal before discount
 */
const calculatePerPersonAmount = (
  items: BillItem[],
  persons: Person[],
  subtotal: number,
  totalDiscount: number,
  serviceChargeAmount: number,
  taxAmount: number
): BillSummary[] => {
  // Group items by person
  const personItemMap = new Map<string, BillItem[]>();
  persons.forEach((person) => {
    personItemMap.set(person.id, []);
  });

  items.forEach((item) => {
    if (personItemMap.has(item.assignedPerson)) {
      personItemMap.get(item.assignedPerson)!.push(item);
    }
  });

  // Calculate per person amount
  const billSummary: BillSummary[] = persons.map((person) => {
    const personItems = personItemMap.get(person.id) || [];

    // Calculate total item price for this person (before discount)
    const personItemPrice = personItems.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);

    // Calculate discount for this person (proportionally based on their items)
    const personDiscountAmount =
      subtotal > 0 ? (personItemPrice / subtotal) * totalDiscount : 0;

    // Calculate service charge share (proportionally)
    const personServiceChargeShare =
      subtotal > 0 ? (personItemPrice / subtotal) * serviceChargeAmount : 0;

    // Calculate tax share (proportionally)
    const personTaxShare = subtotal > 0 ? (personItemPrice / subtotal) * taxAmount : 0;

    // Final amount = item price - discount + service charge + tax
    const finalAmount =
      personItemPrice - personDiscountAmount + personServiceChargeShare + personTaxShare;

    return {
      personId: person.id,
      personName: person.name,
      totalItemPrice: personItemPrice,
      discountAmount: personDiscountAmount,
      shareOfServiceCharge: personServiceChargeShare + personTaxShare, // Combined service charge and tax
      finalAmount,
    };
  });

  return billSummary;
};

/**
 * Format currency
 */
export const formatCurrency = (value: number, currency = 'Rp'): string => {
  return `${currency} ${value.toLocaleString('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
};

/**
 * Validate JSON import format
 */
export const validateJsonImport = (json: unknown): json is import('../types').JsonImportFormat => {
  if (typeof json !== 'object' || json === null) return false;

  const obj = json as Record<string, unknown>;

  // Check required fields
  if (!Array.isArray(obj.items) || !Array.isArray(obj.persons)) return false;

  // Validate items structure
  const validItems = (obj.items as unknown[]).every((item) => {
    if (typeof item !== 'object' || item === null) return false;
    const i = item as Record<string, unknown>;
    return (
      typeof i.name === 'string' &&
      typeof i.price === 'number' &&
      typeof i.quantity === 'number' &&
      typeof i.assignedPerson === 'string'
    );
  });

  // Validate persons structure
  const validPersons = (obj.persons as unknown[]).every((person) => {
    if (typeof person !== 'object' || person === null) return false;
    const p = person as Record<string, unknown>;
    return typeof p.name === 'string';
  });

  return validItems && validPersons;
};
