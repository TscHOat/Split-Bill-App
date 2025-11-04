import { TextField } from '@mui/material';
import type { TextFieldProps } from '@mui/material';

interface TextInputFieldProps extends Omit<TextFieldProps, 'onChange'> {
  onChange: (value: string) => void;
  value: string;
}

export default function TextInputField({
  onChange,
  value,
  ...props
}: TextInputFieldProps) {
  return (
    <TextField
      fullWidth
      size="small"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      {...props}
    />
  );
}
