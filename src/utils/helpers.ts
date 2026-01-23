/**
 * Helper functions for Split Bill App
 */

import type {
  BillItem,
  BillState,
  BillSummary,
  SplitBillCalculation,
  Person,
} from "../types";

/**
 * Generate unique ID
 */
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Calculate split bill with fair distribution of costs and charges
 */
export const calculateSplitBill = (
  billState: BillState
): SplitBillCalculation => {
  const { items, persons, charges } = billState;

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

  // Calculate total discount and charges
  let totalDiscount = 0;
  let totalCharges = 0;
  let serviceChargeAmount = 0;
  let taxAmount = 0;

  charges.forEach((charge) => {
    if (charge.type === 'discount') {
      totalDiscount += charge.amount;
    } else {
      totalCharges += charge.amount;
    }
    // For backwards compatibility with BillSummary interface
    if (charge.name.toLowerCase().includes('service') || charge.name.toLowerCase().includes('servis')) {
      serviceChargeAmount += charge.amount;
    }
    if (charge.name.toLowerCase().includes('tax') || charge.name.toLowerCase().includes('pajak') || charge.name.toLowerCase().includes('ppn')) {
      taxAmount += charge.amount;
    }
  });

  const subtotalAfterDiscount = subtotal - totalDiscount;
  const grandTotal = subtotalAfterDiscount + totalCharges;

  // Calculate per person breakdown
  const billSummary = calculatePerPersonAmount(
    items,
    persons,
    subtotal,
    charges
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
 * 2. Charges are split based on splitMethod (equal or proportional)
 * 3. Discounts are proportionally distributed based on item cost
 */
const calculatePerPersonAmount = (
  items: BillItem[],
  persons: Person[],
  subtotal: number,
  charges: any[]
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

    // Calculate discount for this person based on split method
    let personDiscountAmount = 0;
    charges.forEach((charge) => {
      if (charge.type === 'discount') {
        if (charge.splitMethod === 'equal') {
          // Split equally among all persons
          personDiscountAmount += charge.amount / persons.length;
        } else if (charge.splitMethod === 'proportional') {
          // Split proportionally based on item amount
          personDiscountAmount += subtotal > 0 ? (personItemPrice / subtotal) * charge.amount : 0;
        }
      }
    });

    // Calculate charges for this person based on split method
    let personCharges = 0;
    charges.forEach((charge) => {
      if (charge.type === 'charge') {
        if (charge.splitMethod === 'equal') {
          // Split equally among all persons
          personCharges += charge.amount / persons.length;
        } else if (charge.splitMethod === 'proportional') {
          // Split proportionally based on item amount
          personCharges += subtotal > 0 ? (personItemPrice / subtotal) * charge.amount : 0;
        }
      }
    });

    // Calculate service charge share for BillSummary interface
    const shareOfServiceCharge = personCharges;

    // Calculate tax share for BillSummary interface (sum of taxes)
    let taxAmount = 0;
    charges.forEach((charge) => {
      if ((charge.name.toLowerCase().includes('tax') || 
           charge.name.toLowerCase().includes('pajak') || 
           charge.name.toLowerCase().includes('ppn')) &&
          charge.type === 'charge') {
        if (charge.splitMethod === 'equal') {
          taxAmount += charge.amount / persons.length;
        } else if (charge.splitMethod === 'proportional') {
          taxAmount += subtotal > 0 ? (personItemPrice / subtotal) * charge.amount : 0;
        }
      }
    });

    // Final amount = item price - discount + charges
    const finalAmount =
      personItemPrice -
      personDiscountAmount +
      personCharges;

    return {
      personId: person.id,
      personName: person.name,
      totalItemPrice: personItemPrice,
      discountAmount: personDiscountAmount,
      taxAmount,
      shareOfServiceCharge,
      finalAmount,
    };
  });

  return billSummary;
};

/**
 * Format currency
 */
export const formatCurrency = (value: number, currency = "Rp"): string => {
  return `${currency} ${value.toLocaleString("id-ID", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
};

/**
 * Validate JSON import format
 */
export const validateJsonImport = (
  json: unknown
): json is import("../types").JsonImportFormat => {
  if (typeof json !== "object" || json === null) return false;

  const obj = json as Record<string, unknown>;

  // Check required fields
  if (!Array.isArray(obj.items) || !Array.isArray(obj.persons)) return false;

  // Validate items structure
  const validItems = (obj.items as unknown[]).every((item) => {
    if (typeof item !== "object" || item === null) return false;
    const i = item as Record<string, unknown>;
    return (
      typeof i.name === "string" &&
      typeof i.price === "number" &&
      typeof i.quantity === "number" &&
      typeof i.assignedPerson === "string"
    );
  });

  // Validate persons structure
  const validPersons = (obj.persons as unknown[]).every((person) => {
    if (typeof person !== "object" || person === null) return false;
    const p = person as Record<string, unknown>;
    return typeof p.name === "string";
  });

  // Validate charges structure (optional)
  let validCharges = true;
  if (obj.charges !== undefined) {
    if (!Array.isArray(obj.charges)) return false;
    validCharges = (obj.charges as unknown[]).every((charge) => {
      if (typeof charge !== "object" || charge === null) return false;
      const c = charge as Record<string, unknown>;
      return (
        typeof c.name === "string" &&
        typeof c.amount === "number" &&
        (c.type === "charge" || c.type === "discount") &&
        (c.splitMethod === "equal" || c.splitMethod === "proportional")
      );
    });
  }

  return validItems && validPersons && validCharges;
};
