import { TextField } from '@mui/material';
import { useState, useEffect } from 'react';

interface ChargeFieldProps {
  value: number;
  onChange: (value: number) => void;
  label?: string;
}

/**
 * Format number with thousand separators (1.000.000)
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
  const cleaned = input.replace(/\D/g, '');
  return parseFloat(cleaned) || 0;
}

export default function ChargeField({ 
  value, 
  onChange, 
  label = 'Charge (Rp)' 
}: ChargeFieldProps) {
  const [displayValue, setDisplayValue] = useState(formatCurrencyDisplay(value));

  useEffect(() => {
    setDisplayValue(formatCurrencyDisplay(value));
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const numValue = Math.max(0, parseFormattedValue(input));
    setDisplayValue(input);
    onChange(numValue);
  };

  const handleBlur = () => {
    const numValue = Math.max(0, parseFormattedValue(displayValue));
    setDisplayValue(formatCurrencyDisplay(numValue));
  };

  return (
    <TextField
      label={label}
      fullWidth
      value={displayValue}
      onChange={handleChange}
      onBlur={handleBlur}
      inputProps={{ step: '1000', min: '0', pattern: '[0-9]*' }}
      placeholder="0"
      size="small"
    />
  );
}
