import { TextField } from '@mui/material';

interface ChargeFieldProps {
  value: number;
  onChange: (value: number) => void;
  label?: string;
}

export default function ChargeField({ 
  value, 
  onChange, 
  label = 'Charge (Rp)' 
}: ChargeFieldProps) {
  return (
    <TextField
      label={label}
      type="number"
      fullWidth
      value={value}
      onChange={(e) => onChange(Math.max(0, parseFloat(e.target.value) || 0))}
      inputProps={{ step: '1000', min: '0' }}
      size="small"
    />
  );
}
