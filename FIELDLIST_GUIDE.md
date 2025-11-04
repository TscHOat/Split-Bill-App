# FieldList Architecture Guide

## 📚 Overview

Sebagian besar aplikasi Split Bill telah direfactor menggunakan **FieldList** - komponen universal yang **generate form fields secara dinamis** dari array konfigurasi. Ini menggantikan pattern lama yang membuat individual component per field.

## 🔄 Before vs After

### ❌ BEFORE: Individual Components (Old Pattern)
```tsx
// Importing banyak komponen
import {
  ItemNameField,
  PriceField,
  QuantityField,
  PersonSelectField,
  ItemTotalDisplay,
  DiscountField,
  ChargeField,
} from './FormFields';

// Rendering setiap field manual
<Stack spacing={2}>
  <ItemNameField value={...} onChange={...} />
  <PriceField value={...} onChange={...} />
  <QuantityField value={...} onChange={...} />
  <PersonSelectField value={...} onChange={...} persons={persons} />
  <ItemTotalDisplay price={...} quantity={...} />
  <DiscountField value={...} onChange={...} />
  <ChargeField value={...} onChange={...} />
</Stack>
```

**Masalah:**
- ❌ Import banyak komponen
- ❌ Repetitif rendering
- ❌ Sulit scale ketika tambah field
- ❌ Kombinasi field config dan component spreading

### ✅ AFTER: FieldList (New Pattern)
```tsx
import { FieldList, type FieldConfig } from './FieldList';

// Konfigurasi field sebagai array objects
const fields: FieldConfig[] = [
  { type: 'text', key: 'name', value: name, onChange: setName },
  { type: 'price', key: 'price', value: price, onChange: setPrice },
  { type: 'quantity', key: 'quantity', value: quantity, onChange: setQuantity },
  { type: 'select-person', key: 'person', value: personId, onChange: setPersonId, persons },
  { type: 'total-display', key: 'total', price, quantity },
  { type: 'discount', key: 'discount', value: discount, onChange: setDiscount },
  { type: 'charge', key: 'charge', value: charge, onChange: setCharge },
];

// Satu komponen render semua
<FieldList fields={fields} spacing={2} />
```

**Keuntungan:**
- ✅ Hanya import FieldList
- ✅ Config-driven (data → UI)
- ✅ Mudah scale & maintain
- ✅ Reusable di berbagai form

---

## 📁 Architecture

### File Structure
```
src/components/
├── FieldList/
│   ├── FieldList.tsx          # Main component
│   ├── index.ts               # Export
│   └── README.md              # Detailed docs
│
├── FormFields/                # Individual field components (underlying)
│   ├── TextInputField.tsx
│   ├── PriceField.tsx
│   ├── QuantityField.tsx
│   ├── PersonSelectField.tsx
│   ├── ItemTotalDisplay.tsx
│   ├── DiscountField.tsx
│   ├── ChargeField.tsx
│   └── index.ts
│
├── AddItemDialog.tsx          # ✅ REFACTORED: Uses FieldList
├── ItemsList.tsx              # ✅ REFACTORED: Uses FieldList
├── InputSection.tsx           # Can be refactored
├── JsonImportDialog.tsx       # Can be refactored
└── Layout.tsx
```

### Data Flow

```
User Action (onChange)
        ↓
FieldList (renders fields)
        ↓
Field Component (TextInputField, PriceField, etc)
        ↓
Form State (useState)
        ↓
Dispatch Redux Action
        ↓
Redux Store
```

---

## 🎯 Supported Field Types

| Type | Component | Use Case |
|------|-----------|----------|
| `text` | TextInputField | Item name, description |
| `price` | PriceField | Price, discount, tax |
| `quantity` | QuantityField | Item quantity |
| `select-person` | PersonSelectField | Select assigned person |
| `discount` | DiscountField | Discount amount |
| `charge` | ChargeField | Service charge, tax |
| `total-display` | ItemTotalDisplay | Read-only total |
| `custom` | Custom JSX | Any custom component |

---

## 📋 Refactored Components

### 1. AddItemDialog.tsx ✅
**Location:** `src/components/AddItemDialog.tsx`

**What Changed:**
```tsx
// BEFORE
<Stack spacing={2}>
  <ItemNameField value={...} onChange={...} />
  <PriceField value={...} onChange={...} />
  <QuantityField value={...} onChange={...} />
  <PersonSelectField value={...} onChange={...} persons={persons} />
  <ItemTotalDisplay price={...} quantity={...} />
</Stack>

// AFTER
const fields: FieldConfig[] = [
  { type: 'text', key: 'name', value: formData.name, onChange: ... },
  { type: 'price', key: 'price', value: formData.price, onChange: ... },
  { type: 'quantity', key: 'quantity', value: formData.quantity, onChange: ... },
  { type: 'select-person', key: 'assignedPerson', value: formData.assignedPerson, onChange: ..., persons },
  { type: 'total-display', key: 'total', price: formData.price, quantity: formData.quantity },
];

<FieldList fields={fields} spacing={2} py={1} />
```

**Benefits:**
- 👉 Cleaner JSX
- 👉 Config-driven
- 👉 Easier to extend

**Testing:** Tested with add/edit functionality ✅

---

### 2. ItemsList.tsx ✅
**Location:** `src/components/ItemsList.tsx`

**What Changed:**
```tsx
// BEFORE
<Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
  <TextField
    label="Discount (Rp)"
    type="number"
    value={discount}
    onChange={(e) => dispatch(setDiscount(parseFloat(e.target.value) || 0))}
    // ... more props
  />
  <TextField
    label="Service Charge (Rp)"
    // ...
  />
  <TextField
    label="Tax (Rp)"
    // ...
  />
</Stack>

// AFTER
<FieldList
  fields={[
    { type: 'price', key: 'discount', value: discount, onChange: (v) => dispatch(setDiscount(Math.max(0, v))) },
    { type: 'price', key: 'serviceCharge', value: serviceCharge, onChange: (v) => dispatch(setServiceCharge(Math.max(0, v))) },
    { type: 'price', key: 'tax', value: tax, onChange: (v) => dispatch(setTax(Math.max(0, v))) },
  ] as FieldConfig[]}
  spacing={1}
  direction={{ xs: 'column', sm: 'row' }}
/>
```

**Benefits:**
- 👉 Removed TextFields dependency
- 👉 Cleaner code
- 👉 Uses PriceField component internally

**Testing:** Tested with discount/charge inputs ✅

---

## 🚀 How to Use FieldList

### Basic Example
```tsx
import { FieldList, type FieldConfig } from '../components/FieldList';

export default function MyForm() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);

  const fields: FieldConfig[] = [
    {
      type: 'text',
      key: 'name',
      value: name,
      onChange: setName,
      autoFocus: true,
    },
    {
      type: 'price',
      key: 'price',
      value: price,
      onChange: setPrice,
    },
  ];

  return <FieldList fields={fields} spacing={2} />;
}
```

### Complex Example with Redux
```tsx
import { FieldList, type FieldConfig } from '../components/FieldList';
import { useAppDispatch, useAppSelector } from '../utils/hooks';
import { setDiscount, setTax } from '../store/billSlice';

export default function BillSettings() {
  const dispatch = useAppDispatch();
  const discount = useAppSelector(state => state.bill.discount);
  const tax = useAppSelector(state => state.bill.tax);

  const fields: FieldConfig[] = [
    {
      type: 'discount',
      key: 'discount',
      value: discount,
      onChange: (v) => dispatch(setDiscount(Math.max(0, v))),
    },
    {
      type: 'charge',
      key: 'tax',
      value: tax,
      onChange: (v) => dispatch(setTax(Math.max(0, v))),
    },
  ];

  return (
    <Stack>
      <Typography variant="h6">Bill Settings</Typography>
      <FieldList fields={fields} spacing={2} />
    </Stack>
  );
}
```

---

## 🔧 Adding New Field Types

### Step 1: Create Field Component (if needed)
If field type doesn't exist yet, create it in `FormFields/`:

```tsx
// src/components/FormFields/MyCustomField.tsx
import { TextField } from '@mui/material';

interface MyCustomFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export default function MyCustomField({ value, onChange }: MyCustomFieldProps) {
  return (
    <TextField
      label="My Custom Field"
      fullWidth
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
```

### Step 2: Update FieldList.tsx

**A. Add to FieldConfig Union Type:**
```tsx
export type FieldConfig =
  // ... existing types
  | {
      type: 'my-custom';
      key: string;
      value: string;
      onChange: (value: string) => void;
    };
```

**B. Add to renderField switch:**
```tsx
const renderField = (field: FieldConfig): ReactNode => {
  switch (field.type) {
    // ... existing cases
    case 'my-custom':
      return (
        <MyCustomField
          value={field.value}
          onChange={field.onChange}
        />
      );
    default:
      return null;
  }
};
```

**C. Add import:**
```tsx
import MyCustomField from '../FormFields/MyCustomField';
```

### Step 3: Use in Form
```tsx
const fields: FieldConfig[] = [
  {
    type: 'my-custom',
    key: 'myField',
    value: myValue,
    onChange: setMyValue,
  },
];

<FieldList fields={fields} />
```

---

## 📚 Components Ready to Refactor

### InputSection.tsx
```tsx
// Currently: Manual text input for adding person
// Can be refactored to use FieldList for person name input
```

### JsonImportDialog.tsx
```tsx
// Currently: Basic TextArea
// Can be refactored with FieldList + custom field for JSON
```

---

## ✨ Best Practices

### ✅ Do
- Keep field config simple and readable
- Use unique `key` for each field
- Leverage TypeScript with `FieldConfig` type
- Organize fields logically (input, display, custom)
- Memoize complex field configs (use `useMemo`)

### ❌ Don't
- Create dynamic field config in render (performance issue)
- Mix multiple responsibilities in onChange callback
- Forget unique keys
- Put complex logic in field definitions
- Forget to handle edge cases (Math.max, parseFloat, etc.)

---

## 🧪 Testing Checklist

When refactoring a form to use FieldList:

- [ ] All fields render correctly
- [ ] onChange callbacks work properly
- [ ] Values update in Redux/state
- [ ] Form validation still works
- [ ] Responsive layout maintained
- [ ] No TypeScript errors
- [ ] Build completes successfully

---

## 📊 Code Reduction

### By Component

| Component | Lines Reduced | Method |
|-----------|---------------|--------|
| AddItemDialog | ~35 | Removed individual field imports & rendering |
| ItemsList | ~30 | Replaced 3 TextFields with FieldList |
| Total | ~65 | - |

### Import Reduction
```
BEFORE:
- ItemNameField
- PriceField
- QuantityField
- PersonSelectField
- ItemTotalDisplay
- DiscountField
- ChargeField
Total: 7 imports

AFTER:
- FieldList, type FieldConfig
Total: 2 imports (including type)
```

---

## 🎓 Learning Path

1. **Understand FieldConfig** - Type definition with field options
2. **Learn renderField switch** - How fields map to components
3. **Study examples** - AddItemDialog, ItemsList implementations
4. **Add new field type** - Extend FieldConfig + add case
5. **Refactor components** - Apply pattern to other forms

---

## 🔗 Related Files

- `src/components/FieldList/FieldList.tsx` - Main implementation
- `src/components/FieldList/index.ts` - Exports
- `src/components/FormFields/` - Individual field components
- `src/components/AddItemDialog.tsx` - Example 1
- `src/components/ItemsList.tsx` - Example 2

---

## 🚀 Next Steps

1. **Refactor InputSection** - Add person name field using FieldList
2. **Refactor JsonImportDialog** - Custom JSON field
3. **Add validation UI** - Error display in fields
4. **Add Storybook** - Visual component library
5. **Unit tests** - Test FieldList rendering logic

---

**FieldList makes form development cleaner, faster, and more maintainable!** 🎯
