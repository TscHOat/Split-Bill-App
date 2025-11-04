# FieldList Component

## 📋 Overview

`FieldList` adalah komponen universal yang **generate form fields secara dinamis** berdasarkan array konfigurasi field (objects). Lebih modular, ringkas, dan scalable dibanding membuat component individual per field.

## 🎯 Konsep

```tsx
// SEBELUM: Repetitif, many components
<ItemNameField value={...} onChange={...} />
<PriceField value={...} onChange={...} />
<QuantityField value={...} onChange={...} />
<PersonSelectField value={...} onChange={...} persons={persons} />
<ItemTotalDisplay price={...} quantity={...} />

// SESUDAH: Konfigurasi, 1 component
const fields: FieldConfig[] = [
  { type: 'text', key: 'name', value: name, onChange: setName },
  { type: 'price', key: 'price', value: price, onChange: setPrice },
  // ...
];

<FieldList fields={fields} />
```

## 🏗️ Supported Field Types

| Type | Purpose | Example |
|------|---------|---------|
| `text` | Text input | Item name, description |
| `price` | Currency input (Rp) | Price, charge, tax |
| `quantity` | Number input | Quantity |
| `select-person` | Person dropdown | Assigned person |
| `discount` | Discount amount (Rp) | Discount |
| `charge` | Service/tax charge (Rp) | Service charge, tax |
| `total-display` | Read-only total | Price × Quantity display |
| `custom` | Custom JSX | Any custom component |

## 📝 Field Configuration (FieldConfig Type)

### Text Field
```tsx
{
  type: 'text',
  key: 'name',                    // Unique identifier
  value: string,
  onChange: (value: string) => void,
  autoFocus?: boolean,            // Optional
  label?: string                  // Optional (not used yet)
}
```

### Price Field
```tsx
{
  type: 'price',
  key: 'price',
  value: number,
  onChange: (value: number) => void,
  label?: string
}
```

### Quantity Field
```tsx
{
  type: 'quantity',
  key: 'quantity',
  value: number,
  onChange: (value: number) => void,
  label?: string
}
```

### Select Person Field
```tsx
{
  type: 'select-person',
  key: 'assignedPerson',
  value: string,                  // Person ID
  onChange: (value: string) => void,
  persons: Person[],              // Required!
  label?: string
}
```

### Total Display Field
```tsx
{
  type: 'total-display',
  key: 'total',
  price: number,
  quantity: number
}
```

### Discount/Charge Field
```tsx
{
  type: 'discount' | 'charge',
  key: 'discount',
  value: number,
  onChange: (value: number) => void,
  label?: string
}
```

### Custom Field
```tsx
{
  type: 'custom',
  key: 'customField',
  render: <YourComponent />
}
```

## 💡 Usage Examples

### 1. AddItemDialog (Current Implementation)

```tsx
import { FieldList, type FieldConfig } from './FieldList';

export default function AddItemDialog({ ... }) {
  const [formData, setFormData] = useState({ name: '', price: 0, quantity: 1, assignedPerson: '' });
  const persons = useAppSelector(state => state.bill.persons);

  const fields: FieldConfig[] = [
    {
      type: 'text',
      key: 'name',
      value: formData.name,
      onChange: (name) => setFormData({ ...formData, name }),
      autoFocus: true,
    },
    {
      type: 'price',
      key: 'price',
      value: formData.price,
      onChange: (price) => setFormData({ ...formData, price }),
    },
    {
      type: 'quantity',
      key: 'quantity',
      value: formData.quantity,
      onChange: (quantity) => setFormData({ ...formData, quantity }),
    },
    {
      type: 'select-person',
      key: 'assignedPerson',
      value: formData.assignedPerson,
      onChange: (assignedPerson) => setFormData({ ...formData, assignedPerson }),
      persons,
    },
    {
      type: 'total-display',
      key: 'total',
      price: formData.price,
      quantity: formData.quantity,
    },
  ];

  return (
    <DialogContent>
      <FieldList fields={fields} spacing={2} />
    </DialogContent>
  );
}
```

### 2. Charge Configuration Form

```tsx
const chargeFields: FieldConfig[] = [
  {
    type: 'price',
    key: 'serviceCharge',
    value: serviceCharge,
    onChange: setServiceCharge,
  },
  {
    type: 'price',
    key: 'tax',
    value: tax,
    onChange: setTax,
  },
];

<FieldList fields={chargeFields} />
```

### 3. Custom Mixed Form

```tsx
const fields: FieldConfig[] = [
  { type: 'text', key: 'title', value: title, onChange: setTitle },
  { type: 'price', key: 'amount', value: amount, onChange: setAmount },
  {
    type: 'custom',
    key: 'divider',
    render: <Divider sx={{ my: 2 }} />,
  },
  { type: 'select-person', key: 'person', value: personId, onChange: setPersonId, persons },
];

<FieldList fields={fields} spacing={2} />
```

## ⚙️ Props

```tsx
interface FieldListProps extends StackProps {
  fields: FieldConfig[];      // Array of field configurations
  spacing?: number;           // Space between fields (default: 2)
  // ... All StackProps available (sx, py, etc.)
}
```

## ✨ Keuntungan

### 1. **Modular & Reusable**
   - Satu komponen untuk semua field types
   - Field config bisa disimpan di constant
   - Mudah reuse di form berbeda

### 2. **Less Boilerplate**
   ```tsx
   // BEFORE: 5 komponen
   <ItemNameField />
   <PriceField />
   <QuantityField />
   <PersonSelectField />
   <ItemTotalDisplay />

   // AFTER: 1 komponen
   <FieldList fields={fields} />
   ```

### 3. **Easy to Maintain**
   - Tambah field type baru → Update `FieldConfig` union + switch case
   - Tidak perlu touch multiple component files
   - Field logic centralized di FieldList.tsx

### 4. **Flexible**
   - Support custom field dengan `type: 'custom'`
   - Semua MUI Stack props tersedia
   - Easy to add validation, error display, etc.

### 5. **Better State Management**
   ```tsx
   // Simple state object
   const [formData, setFormData] = useState({ name: '', price: 0, ... });
   
   // Field config dengan callbacks
   const fields = [
     { ..., onChange: (val) => setFormData({ ...formData, name: val }) }
   ];
   ```

## 🔄 Adding a New Field Type

### Step 1: Add to FieldConfig Union Type
```tsx
export type FieldConfig =
  // ... existing types
  | {
      type: 'new-type';
      key: string;
      value: any;
      onChange: (value: any) => void;
      // ... specific props
    };
```

### Step 2: Add to Switch Case
```tsx
const renderField = (field: FieldConfig): ReactNode => {
  switch (field.type) {
    // ... existing cases
    case 'new-type':
      return (
        <YourComponent
          value={field.value}
          onChange={field.onChange}
          // ... map other props
        />
      );
    default:
      return null;
  }
};
```

### Step 3: Use in Form
```tsx
const fields: FieldConfig[] = [
  {
    type: 'new-type',
    key: 'myField',
    value: myValue,
    onChange: setMyValue,
  },
];
```

## 🎓 Best Practices

### ✅ Do
- Keep field config clean and organized
- Use unique keys for each field
- Group related fields logically
- Use `custom` type for special cases
- Memoize field config if needed (useMemo)

### ❌ Don't
- Don't mix unrelated field types
- Don't create dynamic field config in render
- Don't forget unique `key` prop
- Don't put complex logic in onChange

## 📚 Related Components

- `ItemNameField` - Text input component
- `PriceField` - Price input component
- `QuantityField` - Quantity input component
- `PersonSelectField` - Person selection component
- `ItemTotalDisplay` - Total display component
- `DiscountField` - Discount amount input
- `ChargeField` - Charge amount input

---

**FieldList membuat form development lebih clean, scalable, dan maintainable!** 🚀
