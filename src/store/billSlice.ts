import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { BillItem, BillState } from '../types';
import { generateId } from '../utils/helpers';

const initialState: BillState = {
  items: [],
  persons: [],
  serviceCharge: 0,
  tax: 0,
  discount: 0,
};

const billSlice = createSlice({
  name: 'bill',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<Omit<BillItem, 'id'>>) => {
      const newItem: BillItem = {
        ...action.payload,
        id: generateId(),
      };
      state.items.push(newItem);
    },

    updateItem: (state, action: PayloadAction<BillItem>) => {
      const index = state.items.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },

    deleteItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },

    addPerson: (state, action: PayloadAction<string>) => {
      // Check if person already exists
      if (!state.persons.some((p) => p.name === action.payload)) {
        state.persons.push({
          id: generateId(),
          name: action.payload,
        });
      }
    },

    removePerson: (state, action: PayloadAction<string>) => {
      state.persons = state.persons.filter((p) => p.id !== action.payload);
      // Also remove person from assigned items
      state.items.forEach((item) => {
        if (item.assignedPerson === action.payload) {
          item.assignedPerson = '';
        }
      });
    },

    setServiceCharge: (state, action: PayloadAction<number>) => {
      state.serviceCharge = action.payload;
    },

    setTax: (state, action: PayloadAction<number>) => {
      state.tax = action.payload;
    },

    setDiscount: (state, action: PayloadAction<number>) => {
      state.discount = action.payload;
    },

    loadFromJson: (_state, action: PayloadAction<BillState>) => {
      return action.payload;
    },

    clearBill: () => {
      return initialState;
    },

    resetItemsAndPersons: (state) => {
      state.items = [];
      state.persons = [];
      state.serviceCharge = 0;
      state.tax = 0;
      state.discount = 0;
    },
  },
});

export const {
  addItem,
  updateItem,
  deleteItem,
  addPerson,
  removePerson,
  setServiceCharge,
  setTax,
  setDiscount,
  loadFromJson,
  clearBill,
  resetItemsAndPersons,
} = billSlice.actions;

export default billSlice.reducer;
