import { TextField } from '@mui/material';
import { useState, useEffect } from 'react';
import type { TextFieldProps } from '@mui/material';

interface PriceFieldProps extends Omit<TextFieldProps, 'onChange' | 'type' | 'inputProps'> {
  onChange: (value: number) => void;
  value: number;
  currency?: string;
}

/**
 * Format number with thousand separators (1.000.000)
 * Using Intl.NumberFormat for localized formatting
 */
function formatCurrencyDisplay(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Remove formatting and convert to number
 */
function parseFormattedValue(input: string): number {
  // Remove all non-digit characters except decimal point
  const cleaned = input.replace(/\D/g, '');
  return parseFloat(cleaned) || 0;
}

export default function PriceField({
  onChange,
  value,
  currency = 'Rp',
  ...props
}: PriceFieldProps) {
  const [displayValue, setDisplayValue] = useState(formatCurrencyDisplay(value));

  // Sync display value when prop value changes
  useEffect(() => {
    setDisplayValue(formatCurrencyDisplay(value));
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    
    // Update display with formatted version
    const numValue = parseFormattedValue(input);
    setDisplayValue(input); // Keep user input as-is while typing
    
    // Callback with clean number
    onChange(numValue);
  };

  const handleBlur = () => {
    // Format the display value when user leaves the field
    const numValue = parseFormattedValue(displayValue);
    setDisplayValue(formatCurrencyDisplay(numValue));
  };

  return (
    <TextField
      fullWidth
      size="small"
      value={displayValue}
      onChange={handleChange}
      onBlur={handleBlur}
      inputProps={{ step: '1000', min: '0', pattern: '[0-9]*' }}
      label={`${props.label} (${currency})`}
      placeholder="0"
      {...props}
    />
  );
}
