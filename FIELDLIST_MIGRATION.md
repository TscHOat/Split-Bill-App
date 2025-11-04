# FieldList Migration Checklist

Use this checklist when refactoring a component to use FieldList.

---

## Pre-Migration Analysis

- [ ] Identify all form fields in component
- [ ] Group fields by type (text, price, select, etc.)
- [ ] Check if field type is already supported by FieldList
- [ ] If not, plan new field type implementation
- [ ] Document current form structure
- [ ] Identify Redux dependencies (if any)

---

## Field Type Mapping

Map your current form fields to FieldList types:

| Current Field | FieldList Type | Notes |
|---------------|----------------|-------|
| TextField text | `text` | Generic text input |
| TextField number | `price` | Currency/number input |
| TextField currency | `price` | Use PriceField internally |
| Select dropdown | `select-person` | For person selection |
| Number spinner | `quantity` | For quantities |
| Display text | `total-display` | Read-only display |
| Checkbox | `custom` | Use custom type |
| Textarea | `custom` | Use custom type |
| Custom component | `custom` | Use custom render |

---

## Implementation Steps

### Step 1: Backup Current Code
```bash
# Take note of current form structure
# Screenshot or copy implementation
```

### Step 2: Import FieldList
```tsx
import { FieldList, type FieldConfig } from './FieldList';
```

### Step 3: Remove Old Imports
Remove field-specific imports:
```tsx
// REMOVE these if not used elsewhere:
import ItemNameField from './FormFields/ItemNameField';
import PriceField from './FormFields/PriceField';
// etc.

// REMOVE if only used for form:
import { TextField } from '@mui/material';
import { Stack } from '@mui/material';  // Keep if used elsewhere
```

### Step 4: Create Field Config
Define your form fields as config array:

```tsx
const fields: FieldConfig[] = [
  {
    type: 'text',
    key: 'fieldName',
    value: stateValue,
    onChange: (val) => setStateValue(val),
    // Optional: autoFocus: true, label, etc.
  },
  {
    type: 'price',
    key: 'priceField',
    value: price,
    onChange: (val) => dispatch(setPrice(val)),
  },
  // ... more fields
];
```

### Step 5: Replace Rendering
Replace old rendering:

```tsx
// REMOVE:
<Stack spacing={2}>
  <ItemNameField value={...} onChange={...} />
  <PriceField value={...} onChange={...} />
  {/* ... etc */}
</Stack>

// REPLACE WITH:
<FieldList fields={fields} spacing={2} />
```

### Step 6: Handle Layout Props
If using Stack layout props, pass to FieldList:

```tsx
// BEFORE:
<Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
  <TextField ... />
  <TextField ... />
</Stack>

// AFTER:
<FieldList
  fields={fields}
  spacing={1}
  direction={{ xs: 'column', sm: 'row' }}
/>
```

### Step 7: Test Component
- [ ] All fields render correctly
- [ ] Input values update component state
- [ ] Redux dispatch works (if applicable)
- [ ] onChange callbacks fire correctly
- [ ] Form validation works
- [ ] Responsive layout works

### Step 8: TypeScript Check
```bash
# Run TypeScript compiler
npm run build

# Check for errors
# Fix any type issues
```

### Step 9: Manual Testing
- [ ] Add new data (test input)
- [ ] Edit existing data
- [ ] Validate form (if applicable)
- [ ] Test on mobile (responsive)
- [ ] Test on tablet (responsive)
- [ ] Test on desktop (responsive)

### Step 10: Code Review
- [ ] Check field config readability
- [ ] Verify all onChange callbacks
- [ ] Ensure error handling
- [ ] Check for edge cases
- [ ] Verify no regressions

---

## Field Configuration Template

### Text Field
```tsx
{
  type: 'text',
  key: 'unique_key',
  value: stateValue,
  onChange: (value: string) => setState(value),
  autoFocus?: boolean,
}
```

### Price Field
```tsx
{
  type: 'price',
  key: 'unique_key',
  value: numericValue,
  onChange: (value: number) => setState(Math.max(0, value)),
}
```

### Quantity Field
```tsx
{
  type: 'quantity',
  key: 'unique_key',
  value: numericValue,
  onChange: (value: number) => setState(Math.max(1, value)),
}
```

### Select Person Field
```tsx
{
  type: 'select-person',
  key: 'unique_key',
  value: selectedId,
  onChange: (value: string) => setState(value),
  persons: personList,  // Required!
}
```

### Display Field
```tsx
{
  type: 'total-display',
  key: 'unique_key',
  price: numericValue,
  quantity: numericValue,
}
```

### Discount Field
```tsx
{
  type: 'discount',
  key: 'unique_key',
  value: numericValue,
  onChange: (value: number) => setState(Math.max(0, value)),
}
```

### Charge Field
```tsx
{
  type: 'charge',
  key: 'unique_key',
  value: numericValue,
  onChange: (value: number) => setState(Math.max(0, value)),
}
```

### Custom Field
```tsx
{
  type: 'custom',
  key: 'unique_key',
  render: (
    <YourCustomComponent
      // ... pass props
    />
  ),
}
```

---

## Common Issues & Solutions

### Issue: "Cannot find module 'FieldList'"
**Solution:** Check import path is correct relative to component location
```tsx
// In AddItemDialog (same folder):
import { FieldList } from './FieldList';

// In other components:
import { FieldList } from '../FieldList';
```

### Issue: TypeScript errors for field props
**Solution:** Ensure `FieldConfig[]` type is applied
```tsx
const fields: FieldConfig[] = [  // ← Add type annotation
  // ...
];
```

### Issue: onChange not firing
**Solution:** Check onChange callback signature
```tsx
// ✅ Correct
onChange: (value: number) => dispatch(setPrice(value))

// ❌ Wrong
onChange: () => dispatch(setPrice(value))  // Missing parameter
```

### Issue: Form layout looks wrong
**Solution:** Pass layout props to FieldList
```tsx
<FieldList
  fields={fields}
  spacing={2}
  direction={{ xs: 'column', sm: 'row' }}
  sx={{ /* custom styling */ }}
/>
```

### Issue: Field not rendering
**Solution:** Check field key is unique
```tsx
const fields: FieldConfig[] = [
  { type: 'text', key: 'name', ... },  // ✅ Unique
  { type: 'price', key: 'name', ... }, // ❌ Duplicate key!
];
```

---

## Post-Migration Verification

### Code Quality
- [ ] No unused imports
- [ ] No TypeScript errors
- [ ] No linting errors
- [ ] Code is readable
- [ ] Comments added if needed

### Functionality
- [ ] All fields work
- [ ] Form validates
- [ ] Redux dispatch works
- [ ] State updates correctly
- [ ] No console errors

### Performance
- [ ] No performance degradation
- [ ] Render optimized
- [ ] No memory leaks
- [ ] Responsive layout works

### Documentation
- [ ] Updated component comments
- [ ] Added field config explanation
- [ ] Documented new dependencies
- [ ] Added usage example

---

## Example Migration: Complete

### Original Code (InputSection.tsx)
```tsx
<TextField
  label="Person name"
  value={newPersonName}
  onChange={(e) => setNewPersonName(e.target.value)}
  onKeyPress={(e) => e.key === 'Enter' && handleAddPerson()}
/>
```

### Refactored Code
```tsx
const fields: FieldConfig[] = [
  {
    type: 'text',
    key: 'personName',
    value: newPersonName,
    onChange: setNewPersonName,
  },
];

<FieldList fields={fields} />
```

---

## Quick Checklist (Copy-Paste)

```
PRE-MIGRATION
- [ ] Backup current code
- [ ] List all form fields
- [ ] Map fields to types

IMPLEMENTATION
- [ ] Import FieldList
- [ ] Remove old imports
- [ ] Create field config
- [ ] Replace rendering
- [ ] Handle layout props

TESTING
- [ ] Fields render
- [ ] Input updates state
- [ ] Redux dispatch works
- [ ] Form validates
- [ ] Responsive works

VERIFICATION
- [ ] TypeScript compiles
- [ ] No errors
- [ ] No regressions
- [ ] Manual testing done
- [ ] Code review passed
```

---

## Resources

- **Implementation:** `src/components/FieldList/FieldList.tsx`
- **Field Types:** `src/components/FieldList/README.md`
- **Architecture:** `FIELDLIST_GUIDE.md`
- **Examples:** `src/components/FieldList/EXAMPLES.tsx`
- **Quick Ref:** `FIELDLIST_QUICK_REF.md`

---

## Questions?

Refer to:
1. `FIELDLIST_QUICK_REF.md` - Quick answers
2. `src/components/FieldList/README.md` - Field type details
3. `FIELDLIST_GUIDE.md` - Architecture & patterns
4. `src/components/FieldList/EXAMPLES.tsx` - Working examples

---

**Good luck with your migration!** 🚀
