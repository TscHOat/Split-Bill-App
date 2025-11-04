import { TextField } from '@mui/material';
import type { TextFieldProps } from '@mui/material';

interface QuantityFieldProps extends Omit<TextFieldProps, 'onChange' | 'type' | 'inputProps'> {
  onChange: (value: number) => void;
  value: number;
}

export default function QuantityField({
  onChange,
  value,
  ...props
}: QuantityFieldProps) {
  return (
    <TextField
      type="number"
      fullWidth
      size="small"
      value={value}
      onChange={(e) => onChange(parseInt(e.target.value) || 1)}
      inputProps={{ step: '1', min: '1' }}
      label="Quantity"
      {...props}
    />
  );
}
