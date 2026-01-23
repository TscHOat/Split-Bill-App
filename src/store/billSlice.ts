import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { BillItem, BillState, Charge } from '../types';
import { generateId } from '../utils/helpers';

const initialState: BillState = {
  items: [],
  persons: [],
  charges: [],
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

    addCharge: (state, action: PayloadAction<Omit<Charge, 'id'>>) => {
      const newCharge: Charge = {
        ...action.payload,
        id: generateId(),
      };
      state.charges.push(newCharge);
    },

    updateCharge: (state, action: PayloadAction<Charge>) => {
      const index = state.charges.findIndex((charge) => charge.id === action.payload.id);
      if (index !== -1) {
        state.charges[index] = action.payload;
      }
    },

    deleteCharge: (state, action: PayloadAction<string>) => {
      state.charges = state.charges.filter((charge) => charge.id !== action.payload);
    },

    clearCharges: (state) => {
      state.charges = [];
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
      state.charges = [];
    },

    clearItems: (state) => {
      state.items = [];
    },

    clearPersons: (state) => {
      state.persons = [];
      // Also clear assigned persons from items
      state.items.forEach((item) => {
        item.assignedPerson = '';
      });
    },
  },
});

export const {
  addItem,
  updateItem,
  deleteItem,
  addPerson,
  removePerson,
  addCharge,
  updateCharge,
  deleteCharge,
  clearCharges,
  loadFromJson,
  clearBill,
  resetItemsAndPersons,
  clearItems,
  clearPersons,
} = billSlice.actions;

export default billSlice.reducer;
