import { TextField } from '@mui/material';

interface DiscountFieldProps {
  value: number;
  onChange: (value: number) => void;
  label?: string;
}

export default function DiscountField({ 
  value, 
  onChange, 
  label = 'Discount (Rp)' 
}: DiscountFieldProps) {
  return (
    <TextField
      label={label}
      type="number"
      fullWidth
      value={value}
      onChange={(e) => onChange(Math.max(0, parseFloat(e.target.value) || 0))}
      inputProps={{ step: '1000', min: '0' }}
    />
  );
}
