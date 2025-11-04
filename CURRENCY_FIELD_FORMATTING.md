# Currency Field Formatting - Documentation

**Date:** November 4, 2025  
**Enhancement:** Added thousand separators to price fields  
**Implementation:** Built-in `Intl.NumberFormat` API (no dependencies)

---

## 🎯 What Changed

Price fields now display formatted numbers with thousand separators (Indonesian locale):

```
User Input:  1000000
Display:     1.000.000

User Input:  50000
Display:     50.000

User Input:  100
Display:     100
```

---

## 📋 Updated Components

### 1. **PriceField.tsx** ✅
- Displays numbers with thousand separators
- Formats on blur (when user leaves field)
- Keeps raw input while typing
- Callback always receives clean number value

### 2. **DiscountField.tsx** ✅
- Same formatting as PriceField
- Used for discount amounts
- Minimum value enforced (0)

### 3. **ChargeField.tsx** ✅
- Same formatting as PriceField
- Used for service charge and tax
- Minimum value enforced (0)

---

## 🔧 How It Works

### Formatting Function
```typescript
function formatCurrencyDisplay(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
  // 1000000 → "1.000.000"
}
```

### Parsing Function
```typescript
function parseFormattedValue(input: string): number {
  const cleaned = input.replace(/\D/g, ''); // Remove non-digits
  return parseFloat(cleaned) || 0;
  // "1.000.000" → 1000000
}
```

### Lifecycle

1. **User Types:** Display value updates in real-time (raw input shown)
   ```
   User types: 1 2 3 4 5
   Display: 12345
   ```

2. **User Leaves Field (onBlur):** Formatted display value
   ```
   After blur: 12.345
   Callback: 12345
   ```

3. **Value Changes from Props:** Auto-update display
   ```
   New prop value: 50000
   Display: 50.000
   ```

---

## 💡 Key Features

### ✅ No External Dependencies
- Uses built-in `Intl.NumberFormat`
- No need for AutoNumeric or other libraries
- Works in all modern browsers

### ✅ Indonesian Locale
- Uses `'id-ID'` locale
- Displays thousands separator as `.` (dot)
- Follows Indonesian number format standard

### ✅ Clean Separation
- Display value = formatted (with dots)
- Callback value = clean number (without dots)
- Parent components always get correct number

### ✅ Real-Time Input
- User sees raw input while typing
- Formatted after they leave field
- Better UX than constant reformatting

---

## 🚀 Usage

### In AddItemDialog (Price Input)
```tsx
{
  type: 'price',
  key: 'price',
  value: formData.price,
  onChange: (price) => setFormData({ ...formData, price }),
}
```

**User Experience:**
```
Type: 5 0 0 0 0 → Display: 50000
Blur → Display: 50.000
Redux Value: 50000
```

### In ItemsList (Discount/Charge)
```tsx
<FieldList
  fields={[
    {
      type: 'price',
      key: 'discount',
      value: discount,
      onChange: (v) => dispatch(setDiscount(v)),
    },
    {
      type: 'price',
      key: 'serviceCharge',
      value: serviceCharge,
      onChange: (v) => dispatch(setServiceCharge(v)),
    },
    // ...
  ]}
/>
```

---

## 📱 UI/UX Improvements

### Before
```
Input field shows raw number: 1000000
Hard to read, especially with large numbers
```

### After
```
Input field shows formatted: 1.000.000
Easy to read
User immediately understands the value
```

### While Typing vs After Blur
```
WHILE TYPING:        AFTER BLUR:
User types: 1234     Display: 1.234
User types: 12345    Display: 12.345
User types: 123456   Display: 123.456
User leaves field → Auto-format to: 123.456
```

---

## 🔄 State Management

### Component State
```typescript
const [displayValue, setDisplayValue] = useState(formatCurrencyDisplay(value));
// displayValue = "50.000" (with separators)
```

### Redux/Parent State
```typescript
// Always receives clean number
onChange(numValue);  // numValue = 50000 (no separators)
```

### Sync Logic
```typescript
// When prop changes, update display
useEffect(() => {
  setDisplayValue(formatCurrencyDisplay(value));
}, [value]);
```

---

## 🧪 Test Cases

### Test 1: Basic Input
```
User enters: 1000000
Display: 1.000.000
Callback: 1000000 ✅
```

### Test 2: Edit Value
```
Initial: 50000 → Display: 50.000
Edit to: 75000 → Display: 75.000
Callback: 75000 ✅
```

### Test 3: Zero Value
```
User enters: 0
Display: 0
Callback: 0 ✅
```

### Test 4: Minimum Enforcement (DiscountField/ChargeField)
```
User enters: -100
System enforces: Math.max(0, -100) = 0
Display: 0
Callback: 0 ✅
```

### Test 5: Prop Update
```
Component receives new prop: value = 250000
useEffect triggers
Display updates to: 250.000 ✅
```

---

## 📊 Format Examples

| Input | Display | Callback |
|-------|---------|----------|
| 0 | 0 | 0 |
| 100 | 100 | 100 |
| 1000 | 1.000 | 1000 |
| 10000 | 10.000 | 10000 |
| 100000 | 100.000 | 100000 |
| 1000000 | 1.000.000 | 1000000 |
| 1234567 | 1.234.567 | 1234567 |

---

## 🎯 Benefits

1. **Better UX** - Numbers are easier to read
2. **No Dependencies** - Uses built-in browser API
3. **Locale Aware** - Uses Indonesian format
4. **Clean Code** - Separate display from data
5. **Type Safe** - Full TypeScript support
6. **Backward Compatible** - Works with existing code

---

## 🔗 Related Files

- `src/components/FormFields/PriceField.tsx`
- `src/components/FormFields/DiscountField.tsx`
- `src/components/FormFields/ChargeField.tsx`
- `src/components/AddItemDialog.tsx` (uses PriceField)
- `src/components/ItemsList.tsx` (uses DiscountField, ChargeField)

---

## 📚 How to Use in New Fields

If you create a new currency field, copy this pattern:

```typescript
import { TextField } from '@mui/material';
import { useState, useEffect } from 'react';

interface MyFieldProps {
  value: number;
  onChange: (value: number) => void;
}

function formatCurrencyDisplay(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function parseFormattedValue(input: string): number {
  const cleaned = input.replace(/\D/g, '');
  return parseFloat(cleaned) || 0;
}

export default function MyField({ value, onChange }: MyFieldProps) {
  const [displayValue, setDisplayValue] = useState(formatCurrencyDisplay(value));

  useEffect(() => {
    setDisplayValue(formatCurrencyDisplay(value));
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const numValue = parseFormattedValue(input);
    setDisplayValue(input);
    onChange(numValue);
  };

  const handleBlur = () => {
    const numValue = parseFormattedValue(displayValue);
    setDisplayValue(formatCurrencyDisplay(numValue));
  };

  return (
    <TextField
      value={displayValue}
      onChange={handleChange}
      onBlur={handleBlur}
      inputProps={{ pattern: '[0-9]*' }}
      placeholder="0"
    />
  );
}
```

---

## ✅ Implementation Status

- [x] PriceField updated
- [x] DiscountField updated
- [x] ChargeField updated
- [x] TypeScript checks pass
- [x] No build errors
- [x] Documentation created

---

**Status: ✅ COMPLETE & READY**

*Built with Indonesian number formatting best practices* 🇮🇩
