import { Stack } from '@mui/material';
import type { StackProps } from '@mui/material';
import type { ReactNode } from 'react';
import PriceField from '../FormFields/PriceField';
import QuantityField from '../FormFields/QuantityField';
import PersonSelectField from '../FormFields/PersonSelectField';
import ItemTotalDisplay from '../FormFields/ItemTotalDisplay';
import DiscountField from '../FormFields/DiscountField';
import ChargeField from '../FormFields/ChargeField';
import TextInputField from '../FormFields/TextInputField';
import type { Person } from '../../types';

/**
 * Field configuration type
 * Supports various field types with their specific props
 */
export type FieldConfig =
  | {
      type: 'text';
      key: string;
      label?: string;
      value: string;
      onChange: (value: string) => void;
      autoFocus?: boolean;
    }
  | {
      type: 'price';
      key: string;
      label?: string;
      value: number;
      onChange: (value: number) => void;
    }
  | {
      type: 'quantity';
      key: string;
      label?: string;
      value: number;
      onChange: (value: number) => void;
    }
  | {
      type: 'select-person';
      key: string;
      label?: string;
      value: string;
      onChange: (value: string) => void;
      persons: Person[];
    }
  | {
      type: 'total-display';
      key: string;
      price: number;
      quantity: number;
    }
  | {
      type: 'discount';
      key: string;
      label?: string;
      value: number;
      onChange: (value: number) => void;
    }
  | {
      type: 'charge';
      key: string;
      label?: string;
      value: number;
      onChange: (value: number) => void;
    }
  | {
      type: 'custom';
      key: string;
      render: ReactNode;
    };

interface FieldListProps extends StackProps {
  fields: FieldConfig[];
  spacing?: number;
}

/**
 * FieldList Component
 * 
 * Renders form fields dynamically based on field configuration array.
 * Supports multiple field types: text, price, quantity, select-person, total-display, discount, charge, custom
 * 
 * @example
 * ```tsx
 * const fields: FieldConfig[] = [
 *   { type: 'text', key: 'name', value: name, onChange: setName },
 *   { type: 'price', key: 'price', value: price, onChange: setPrice },
 *   { type: 'select-person', key: 'person', value: personId, onChange: setPersonId, persons }
 * ];
 * 
 * <FieldList fields={fields} spacing={2} />
 * ```
 */
export default function FieldList({ fields, spacing = 2, ...props }: FieldListProps) {
  const renderField = (field: FieldConfig): ReactNode => {
    switch (field.type) {
      case 'text':
        return (
          <TextInputField
            label={field.label}
            value={field.value}
            onChange={field.onChange}
            autoFocus={field.autoFocus}
          />
        );

      case 'price':
        return (
          <PriceField
            label={field.label}
            value={field.value}
            onChange={field.onChange}
          />
        );

      case 'quantity':
        return (
          <QuantityField
            label={field.label}
            value={field.value}
            onChange={field.onChange}
          />
        );

      case 'select-person':
        return (
          <PersonSelectField
            value={field.value}
            onChange={field.onChange}
            persons={field.persons}
          />
        );

      case 'total-display':
        return (
          <ItemTotalDisplay
            price={field.price}
            quantity={field.quantity}
          />
        );

      case 'discount':
        return (
          <DiscountField
            value={field.value}
            onChange={field.onChange}
          />
        );

      case 'charge':
        return (
          <ChargeField
            value={field.value}
            onChange={field.onChange}
          />
        );

      case 'custom':
        return field.render;

      default:
        return null;
    }
  };

  return (
    <Stack spacing={spacing} {...props}>
      {fields.map((field) => (
        <div key={field.key}>{renderField(field)}</div>
      ))}
    </Stack>
  );
}
