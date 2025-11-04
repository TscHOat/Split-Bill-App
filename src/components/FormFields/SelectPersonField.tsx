import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import type { SelectProps } from '@mui/material';
import type { Person } from '../../types';

interface SelectPersonFieldProps extends Omit<SelectProps, 'onChange'> {
  onChange: (value: string) => void;
  value: string;
  persons: Person[];
}

export default function SelectPersonField({
  onChange,
  value,
  persons,
  ...props
}: SelectPersonFieldProps) {
  return (
    <FormControl fullWidth size="small">
      <InputLabel>Assigned Person</InputLabel>
      <Select
        value={value}
        label="Assigned Person"
        onChange={(e) => onChange(e.target.value as string)}
        {...props}
      >
        {persons.map((person) => (
          <MenuItem key={person.id} value={person.id}>
            {person.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
