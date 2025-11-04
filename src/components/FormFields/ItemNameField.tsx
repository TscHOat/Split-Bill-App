import { TextField } from '@mui/material';

interface ItemNameFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export default function ItemNameField({ value, onChange }: ItemNameFieldProps) {
  return (
    <TextField
      label="Item name"
      fullWidth
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="e.g., Nasi Goreng Spesial"
      autoFocus
      size="medium"
    />
  );
}
