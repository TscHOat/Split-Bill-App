// FormFields - Modular Input Components

## 📋 Overview

FormFields adalah direktori yang berisi komponen-komponen input form yang modular dan reusable. Setiap komponen fokus pada satu jenis input dengan logika dan styling terkapsulasi.

## 🎯 Struktur

```
src/components/FormFields/
├── ItemNameField.tsx        # Text input untuk nama item
├── PriceField.tsx           # Number input untuk harga
├── QuantityField.tsx        # Number input untuk jumlah
├── PersonSelectField.tsx    # Select dropdown untuk pilih orang
├── ItemTotalDisplay.tsx     # Display component untuk total
└── index.ts                 # Barrel export
```

## 📦 Components

### 1. ItemNameField
```tsx
import { ItemNameField } from './FormFields';

<ItemNameField
  value={name}
  onChange={(name) => setName(name)}
/>
```

**Props:**
- `value: string` - Nilai item name
- `onChange: (value: string) => void` - Callback saat value berubah

**Features:**
- ✅ Auto-focus pada mount
- ✅ Full width
- ✅ Placeholder text

---

### 2. PriceField
```tsx
import { PriceField } from './FormFields';

<PriceField
  value={price}
  onChange={(price) => setPrice(price)}
/>
```

**Props:**
- `value: number` - Nilai harga
- `onChange: (value: number) => void` - Callback saat value berubah

**Features:**
- ✅ Number input type
- ✅ Step 0.01
- ✅ Min 0

---

### 3. QuantityField
```tsx
import { QuantityField } from './FormFields';

<QuantityField
  value={quantity}
  onChange={(quantity) => setQuantity(quantity)}
/>
```

**Props:**
- `value: number` - Nilai quantity
- `onChange: (value: number) => void` - Callback saat value berubah

**Features:**
- ✅ Number input type
- ✅ Step 1
- ✅ Min 1

---

### 4. PersonSelectField
```tsx
import { PersonSelectField } from './FormFields';

<PersonSelectField
  value={selectedPersonId}
  onChange={(personId) => setSelectedPersonId(personId)}
  persons={personList}
/>
```

**Props:**
- `value: string` - Selected person ID
- `onChange: (value: string) => void` - Callback saat selection berubah
- `persons: Person[]` - List of available persons

**Features:**
- ✅ Dropdown select
- ✅ Dynamic options from props
- ✅ Full width

---

### 5. ItemTotalDisplay
```tsx
import { ItemTotalDisplay } from './FormFields';

<ItemTotalDisplay
  price={50000}
  quantity={2}
/>
```

**Props:**
- `price: number` - Unit price
- `quantity: number` - Quantity

**Features:**
- ✅ Auto calculate total
- ✅ Formatted currency output
- ✅ Secondary text styling

---

## 🏗️ Architecture Benefits

### 1. Modularity
- ✅ Setiap komponen berdiri sendiri
- ✅ Logika terisolasi
- ✅ Mudah di-reuse

### 2. Maintainability
- ✅ Perubahan di satu tempat
- ✅ Styling konsisten
- ✅ Mudah di-debug

### 3. Testability
- ✅ Component individual bisa di-test
- ✅ Props-based interface clear
- ✅ No side effects

### 4. Scalability
- ✅ Mudah tambah field baru
- ✅ Mudah reuse di form lain
- ✅ Konsisten patterns

## 📝 Membuat Field Baru

### Template
```tsx
// src/components/FormFields/NewField.tsx

interface NewFieldProps {
  value: string; // atau tipe sesuai kebutuhan
  onChange: (value: string) => void;
}

export default function NewField({ value, onChange }: NewFieldProps) {
  return (
    <TextField
      label="New Field"
      fullWidth
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
```

### Steps
1. Create file `YourField.tsx` di folder ini
2. Definisikan interface props (value, onChange, dan lainnya)
3. Implement component dengan MUI components
4. Export dari `index.ts`
5. Use di form

### Contoh: Discount Field
```tsx
// DiscountField.tsx
interface DiscountFieldProps {
  value: number;
  onChange: (value: number) => void;
}

export default function DiscountField({ value, onChange }: DiscountFieldProps) {
  return (
    <TextField
      label="Discount (Rp)"
      type="number"
      fullWidth
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
      inputProps={{ step: '1000', min: '0' }}
    />
  );
}
```

## 🔄 Usage dalam AddItemDialog

```tsx
import {
  ItemNameField,
  PriceField,
  QuantityField,
  PersonSelectField,
  ItemTotalDisplay,
} from './FormFields';

// Di component:
<Stack spacing={2}>
  <ItemNameField
    value={formData.name}
    onChange={(name) => setFormData({ ...formData, name })}
  />
  <PriceField
    value={formData.price}
    onChange={(price) => setFormData({ ...formData, price })}
  />
  {/* ... lebih simple dan modular */}
</Stack>
```

## ✨ Best Practices

### ✅ Do
- Fokus satu jenis input per component
- Gunakan TypeScript types yang jelas
- Callback untuk onChange
- Full width untuk konsistensi
- Meaningful prop names

### ❌ Don't
- Mixing different input types
- Complex logic di field component
- Global state management di field
- Magic numbers/strings
- Conditional rendering based on external state

## 📈 Future Enhancements

- [ ] Custom validation rules
- [ ] Error message display
- [ ] Loading states
- [ ] Disabled states
- [ ] Tooltip/helper text
- [ ] Storybook documentation
- [ ] Unit tests

---

**Pattern ini membuat codebase lebih maintainable dan scalable!**
