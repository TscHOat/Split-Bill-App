import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import type { Person } from '../../types';

interface PersonSelectFieldProps {
  value: string;
  onChange: (value: string) => void;
  persons: Person[];
}

export default function PersonSelectField({ value, onChange, persons }: PersonSelectFieldProps) {
  return (
    <FormControl fullWidth>
      <InputLabel>Assigned Person</InputLabel>
      <Select
        value={value}
        label="Assigned Person"
        onChange={(e) => onChange(e.target.value)}
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
