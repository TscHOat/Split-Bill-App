/**
 * EXAMPLES: FieldList Usage Patterns
 * 
 * File ini berisi berbagai contoh penggunaan FieldList untuk referensi
 * ⚠️ Ini adalah FILE DOKUMENTASI - Jangan di-import ke aplikasi!
 * 
 * Gunakan contoh-contoh di bawah sebagai template ketika membuat form baru.
 * Copy & modify sesuai kebutuhan Anda.
 * 
 * @example
 * // Copy struktur dari contoh yang relevan, sesuaikan dengan kebutuhan
 * const fields: FieldConfig[] = [
 *   { type: 'text', key: 'name', value: name, onChange: setName },
 *   { type: 'price', key: 'price', value: price, onChange: setPrice },
 * ];
 * 
 * return <FieldList fields={fields} spacing={2} />;
 */

// @ts-nocheck - This is documentation file with intentional import variations

import { useState } from 'react';
import { Stack, Box, Typography } from '@mui/material';
import { FieldList, type FieldConfig } from './FieldList';
import { useAppDispatch, useAppSelector, type RootState } from '../../utils/hooks';
import { setDiscount, setTax, setServiceCharge } from '../../store/billSlice';

// ============================================================================
// EXAMPLE 1: Simple Text + Price Fields
// ============================================================================
export function Example1_SimpleForm() {
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

// ============================================================================
// EXAMPLE 2: Form dengan Total Display
// ============================================================================
export function Example2_WithTotalDisplay() {
  const [itemName, setItemName] = useState('');
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const fields: FieldConfig[] = [
    {
      type: 'text',
      key: 'itemName',
      value: itemName,
      onChange: setItemName,
    },
    {
      type: 'price',
      key: 'price',
      value: price,
      onChange: setPrice,
    },
    {
      type: 'quantity',
      key: 'quantity',
      value: quantity,
      onChange: setQuantity,
    },
    {
      type: 'total-display',
      key: 'total',
      price,
      quantity,
    },
  ];

  return <FieldList fields={fields} spacing={2} />;
}

// ============================================================================
// EXAMPLE 3: Form dengan Select Field
// ============================================================================
export function Example3_WithSelectPerson() {
  const [itemName, setItemName] = useState('');
  const [price, setPrice] = useState(0);
  const [selectedPersonId, setSelectedPersonId] = useState('');
  
  // Get persons dari Redux
  const persons = useAppSelector((state: RootState) => state.bill.persons);

  const fields: FieldConfig[] = [
    {
      type: 'text',
      key: 'itemName',
      value: itemName,
      onChange: setItemName,
    },
    {
      type: 'price',
      key: 'price',
      value: price,
      onChange: setPrice,
    },
    {
      type: 'select-person',
      key: 'person',
      value: selectedPersonId,
      onChange: setSelectedPersonId,
      persons, // Required untuk select field
    },
  ];

  return <FieldList fields={fields} spacing={2} />;
}

// ============================================================================
// EXAMPLE 4: Charge Settings (Multiple Price Fields)
// ============================================================================
export function Example4_ChargeSettings() {
  const dispatch = useAppDispatch();
  const discount = useAppSelector((state: RootState) => state.bill.discount);
  const serviceCharge = useAppSelector((state: RootState) => state.bill.serviceCharge);
  const tax = useAppSelector((state: RootState) => state.bill.tax);

  const fields: FieldConfig[] = [
    {
      type: 'discount',
      key: 'discount',
      value: discount,
      onChange: (v) => dispatch(setDiscount(Math.max(0, v))),
    },
    {
      type: 'charge',
      key: 'serviceCharge',
      value: serviceCharge,
      onChange: (v) => dispatch(setServiceCharge(Math.max(0, v))),
    },
    {
      type: 'charge',
      key: 'tax',
      value: tax,
      onChange: (v) => dispatch(setTax(Math.max(0, v))),
    },
  ];

  return (
    <Stack spacing={2}>
      <Typography variant="h6">⚙️ Charge Settings</Typography>
      <FieldList
        fields={fields}
        spacing={1}
        direction={{ xs: 'column', sm: 'row' }}
      />
    </Stack>
  );
}

// ============================================================================
// EXAMPLE 5: Form dengan Custom Field
// ============================================================================
export function Example5_WithCustomField() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);

  const fields: FieldConfig[] = [
    {
      type: 'text',
      key: 'name',
      value: name,
      onChange: setName,
    },
    {
      type: 'price',
      key: 'price',
      value: price,
      onChange: setPrice,
    },
    {
      type: 'custom',
      key: 'info',
      render: (
        <Box
          sx={{
            p: 1.5,
            bgcolor: 'info.light',
            color: 'info.dark',
            borderRadius: 1,
            fontSize: '0.875rem',
          }}
        >
          ℹ️ This is a custom field component
        </Box>
      ),
    },
  ];

  return <FieldList fields={fields} spacing={2} />;
}

// ============================================================================
// EXAMPLE 6: Full Item Dialog (Actual AddItemDialog Pattern)
// ============================================================================
export function Example6_FullItemDialog() {
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    quantity: 1,
    assignedPerson: '',
  });

  const persons = useAppSelector((state: RootState) => state.bill.persons);

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

  return <FieldList fields={fields} spacing={2} />;
}

// ============================================================================
// EXAMPLE 7: Responsive Layout dengan Direction Prop
// ============================================================================
export function Example7_ResponsiveLayout() {
  const [discount, setDiscount] = useState(0);
  const [serviceCharge, setServiceCharge] = useState(0);
  const [tax, setTax] = useState(0);

  const fields: FieldConfig[] = [
    {
      type: 'discount',
      key: 'discount',
      value: discount,
      onChange: setDiscount,
    },
    {
      type: 'charge',
      key: 'serviceCharge',
      value: serviceCharge,
      onChange: setServiceCharge,
    },
    {
      type: 'charge',
      key: 'tax',
      value: tax,
      onChange: setTax,
    },
  ];

  return (
    <>
      {/* Stack vertical di mobile, horizontal di desktop */}
      <Typography variant="h6" gutterBottom>
        Mobile-First Layout
      </Typography>
      <FieldList
        fields={fields}
        spacing={1}
        direction={{ xs: 'column', sm: 'row' }}
      />

      {/* Selalu horizontal */}
      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
        Always Horizontal
      </Typography>
      <FieldList
        fields={fields}
        spacing={1}
        direction="row"
      />

      {/* Selalu vertikal */}
      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
        Always Vertical (default)
      </Typography>
      <FieldList
        fields={fields}
        spacing={2}
      />
    </>
  );
}

// ============================================================================
// EXAMPLE 8: Conditional Fields
// ============================================================================
export function Example8_ConditionalFields() {
  const [itemName, setItemName] = useState('');
  const [hasDiscount, setHasDiscount] = useState(false);
  const [discount, setDiscount] = useState(0);

  // Conditionally add discount field
  const baseFields: FieldConfig[] = [
    {
      type: 'text',
      key: 'itemName',
      value: itemName,
      onChange: setItemName,
    },
    {
      type: 'custom',
      key: 'checkbox',
      render: (
        <Box>
          <input
            type="checkbox"
            checked={hasDiscount}
            onChange={(e) => setHasDiscount(e.target.checked)}
          />
          <span> Apply discount?</span>
        </Box>
      ),
    },
  ];

  // Add discount field conditionally
  const fields: FieldConfig[] = hasDiscount
    ? [
        ...baseFields,
        {
          type: 'discount',
          key: 'discount',
          value: discount,
          onChange: setDiscount,
        },
      ]
    : baseFields;

  return <FieldList fields={fields} spacing={2} />;
}

// ============================================================================
// EXAMPLE 9: Memoized Field Config (Performance Optimization)
// ============================================================================
import { useMemo } from 'react';

export function Example9_MemoizedFields() {
  const dispatch = useAppDispatch();
  const discount = useAppSelector((state: RootState) => state.bill.discount);
  const serviceCharge = useAppSelector((state: RootState) => state.bill.serviceCharge);
  const persons = useAppSelector((state: RootState) => state.bill.persons);
  const [itemName, setItemName] = useState('');

  // Memoize field config untuk avoid re-render
  const fields = useMemo(
    () => [
      {
        type: 'text' as const,
        key: 'name',
        value: itemName,
        onChange: setItemName,
      },
      {
        type: 'discount' as const,
        key: 'discount',
        value: discount,
        onChange: (v: number) => dispatch(setDiscount(v)),
      },
      {
        type: 'charge' as const,
        key: 'serviceCharge',
        value: serviceCharge,
        onChange: (v: number) => dispatch(setServiceCharge(v)),
      },
    ] as FieldConfig[],
    [itemName, discount, serviceCharge, dispatch]
  );

  return <FieldList fields={fields} spacing={2} />;
}

// ============================================================================
// EXAMPLE 10: Multi-Step Form dengan Multiple FieldLists
// ============================================================================
export function Example10_MultiStepForm() {
  const [step, setStep] = useState(1);
  const [itemName, setItemName] = useState('');
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [personId, setPersonId] = useState('');

  const persons = useAppSelector((state: RootState) => state.bill.persons);

  // Step 1: Item details
  const step1Fields: FieldConfig[] = [
    {
      type: 'text',
      key: 'itemName',
      value: itemName,
      onChange: setItemName,
    },
    {
      type: 'price',
      key: 'price',
      value: price,
      onChange: setPrice,
    },
  ];

  // Step 2: Quantity & Assignment
  const step2Fields: FieldConfig[] = [
    {
      type: 'quantity',
      key: 'quantity',
      value: quantity,
      onChange: setQuantity,
    },
    {
      type: 'select-person',
      key: 'person',
      value: personId,
      onChange: setPersonId,
      persons,
    },
  ];

  return (
    <Stack spacing={2}>
      <Typography variant="h6">Step {step} of 2</Typography>

      {step === 1 && <FieldList fields={step1Fields} spacing={2} />}
      {step === 2 && <FieldList fields={step2Fields} spacing={2} />}

      <Stack direction="row" spacing={1}>
        {step > 1 && (
          <button onClick={() => setStep(step - 1)}>Back</button>
        )}
        <button onClick={() => setStep(step + 1)} disabled={step === 2}>
          Next
        </button>
      </Stack>
    </Stack>
  );
}

export default Example1_SimpleForm;
