import { TextField } from '@mui/material';
import type { TextFieldProps } from '@mui/material';

interface PriceFieldProps extends Omit<TextFieldProps, 'onChange' | 'type' | 'inputProps'> {
  onChange: (value: number) => void;
  value: number;
  currency?: string;
}

export default function PriceField({
  onChange,
  value,
  currency = 'Rp',
  ...props
}: PriceFieldProps) {
  return (
    <TextField
      type="number"
      fullWidth
      size="small"
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
      inputProps={{ step: '100', min: '0' }}
      label={`${props.label} (${currency})`}
      {...props}
    />
  );
}
