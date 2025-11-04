# FieldList Quick Reference

## 📋 Cheat Sheet

### Import
```tsx
import { FieldList, type FieldConfig } from './components/FieldList';
```

### Basic Usage
```tsx
const fields: FieldConfig[] = [
  { type: 'text', key: 'name', value: name, onChange: setName },
  { type: 'price', key: 'price', value: price, onChange: setPrice },
];

<FieldList fields={fields} spacing={2} />
```

---

## 🎨 All Field Types

| Type | Value Type | Example |
|------|-----------|---------|
| `text` | `string` | `{ type: 'text', key: 'x', value: '', onChange: setName }` |
| `price` | `number` | `{ type: 'price', key: 'x', value: 0, onChange: setPrice }` |
| `quantity` | `number` | `{ type: 'quantity', key: 'x', value: 1, onChange: setQty }` |
| `discount` | `number` | `{ type: 'discount', key: 'x', value: 0, onChange: setDisc }` |
| `charge` | `number` | `{ type: 'charge', key: 'x', value: 0, onChange: setTax }` |
| `select-person` | `string` | `{ type: 'select-person', key: 'x', value: '', onChange: setPerson, persons }` |
| `total-display` | N/A | `{ type: 'total-display', key: 'x', price: 100, quantity: 2 }` |
| `custom` | N/A | `{ type: 'custom', key: 'x', render: <Component /> }` |

---

## 💡 Common Patterns

### With useState
```tsx
const [formData, setFormData] = useState({
  name: '',
  price: 0,
  quantity: 1,
});

const fields: FieldConfig[] = [
  {
    type: 'text',
    key: 'name',
    value: formData.name,
    onChange: (name) => setFormData({ ...formData, name }),
  },
  // ...
];
```

### With Redux
```tsx
const dispatch = useAppDispatch();
const discount = useAppSelector((state) => state.bill.discount);

const fields: FieldConfig[] = [
  {
    type: 'discount',
    key: 'discount',
    value: discount,
    onChange: (v) => dispatch(setDiscount(v)),
  },
];
```

### Responsive Layout
```tsx
<FieldList
  fields={fields}
  direction={{ xs: 'column', sm: 'row' }}  // Stack on mobile, row on desktop
  spacing={1}
/>
```

### Custom Styling
```tsx
<FieldList
  fields={fields}
  sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 1 }}
/>
```

---

## 🔧 Adding a New Field Type (5 minutes)

1. **Create component** (optional, if new):
```tsx
// src/components/FormFields/MyField.tsx
export default function MyField({ value, onChange }: Props) {
  return <TextField value={value} onChange={(e) => onChange(e.target.value)} />;
}
```

2. **Update FieldConfig** in `FieldList.tsx`:
```tsx
| {
    type: 'my-type';
    key: string;
    value: string;
    onChange: (value: string) => void;
  }
```

3. **Add renderField case**:
```tsx
case 'my-type':
  return <MyField value={field.value} onChange={field.onChange} />;
```

4. **Use it**:
```tsx
const fields: FieldConfig[] = [
  { type: 'my-type', key: 'field', value, onChange },
];
```

---

## ✅ Validation Pattern

```tsx
const handleSubmit = () => {
  if (!formData.name.trim()) {
    alert('Name required');
    return;
  }
  if (formData.price <= 0) {
    alert('Price must be > 0');
    return;
  }
  // Valid, proceed...
};
```

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `FieldList/README.md` | Field type reference & examples |
| `FieldList/EXAMPLES.tsx` | 10 code examples |
| `FIELDLIST_GUIDE.md` | Full architecture guide |
| `FIELDLIST_ARCHITECTURE_DIAGRAM.md` | Visual diagrams |
| `COMPLETION_FIELDLIST.md` | Completion report |

---

## 🚀 Real-World Examples

### Example 1: AddItemDialog (Refactored ✅)
```tsx
const fields: FieldConfig[] = [
  { type: 'text', key: 'name', value: formData.name, onChange: (v) => setFormData({ ...formData, name: v }), autoFocus: true },
  { type: 'price', key: 'price', value: formData.price, onChange: (v) => setFormData({ ...formData, price: v }) },
  { type: 'quantity', key: 'qty', value: formData.quantity, onChange: (v) => setFormData({ ...formData, quantity: v }) },
  { type: 'select-person', key: 'person', value: formData.assignedPerson, onChange: (v) => setFormData({ ...formData, assignedPerson: v }), persons },
  { type: 'total-display', key: 'total', price: formData.price, quantity: formData.quantity },
];

<FieldList fields={fields} spacing={2} />
```

### Example 2: ItemsList Charges (Refactored ✅)
```tsx
<FieldList
  fields={[
    { type: 'price', key: 'discount', value: discount, onChange: (v) => dispatch(setDiscount(Math.max(0, v))) },
    { type: 'price', key: 'serviceCharge', value: serviceCharge, onChange: (v) => dispatch(setServiceCharge(Math.max(0, v))) },
    { type: 'price', key: 'tax', value: tax, onChange: (v) => dispatch(setTax(Math.max(0, v))) },
  ] as FieldConfig[]}
  direction={{ xs: 'column', sm: 'row' }}
  spacing={1}
/>
```

---

## 🎯 Do's and Don'ts

### ✅ DO
- Define field config at component top level
- Use unique keys for each field
- Leverage TypeScript type checking
- Keep onChange simple (state update or dispatch)
- Use `useMemo` for complex field configs

### ❌ DON'T
- Create field config inside render
- Use duplicate keys
- Mix different data types in value
- Put complex logic in onChange
- Forget required props (persons for select-person)

---

## 🆘 Troubleshooting

### Field doesn't update?
```tsx
// ❌ Wrong - forgot to pass onChange
{ type: 'text', key: 'name', value: name }

// ✅ Correct - onChange updates state
{ type: 'text', key: 'name', value: name, onChange: setName }
```

### Type error on value?
```tsx
// ❌ Wrong - price expects number, got string
{ type: 'price', key: 'price', value: '100', onChange: setPrice }

// ✅ Correct
{ type: 'price', key: 'price', value: 100, onChange: setPrice }
```

### Missing persons dropdown options?
```tsx
// ❌ Wrong - forgot persons prop
{ type: 'select-person', key: 'person', value: '', onChange: setPerson }

// ✅ Correct
{ type: 'select-person', key: 'person', value: '', onChange: setPerson, persons }
```

---

## 📞 Quick Links

- **Component:** `src/components/FieldList/FieldList.tsx`
- **Examples:** `src/components/FieldList/EXAMPLES.tsx`
- **Full Docs:** `FieldList/README.md`
- **Architecture:** `FIELDLIST_ARCHITECTURE_DIAGRAM.md`

---

## ⚡ TL;DR

```tsx
// 1. Import
import { FieldList, type FieldConfig } from './components/FieldList';

// 2. Define config
const fields: FieldConfig[] = [
  { type: 'text', key: 'name', value: name, onChange: setName },
  { type: 'price', key: 'price', value: price, onChange: setPrice },
];

// 3. Render
<FieldList fields={fields} spacing={2} />

// Done! 🎉
```

---

*Save this file for quick reference!*
