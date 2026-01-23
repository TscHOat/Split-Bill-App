import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useAppDispatch } from '../utils/hooks';
import {
  addCharge,
  updateCharge,
} from '../store/billSlice';
import { FieldList, type FieldConfig } from './FieldList';
import type { Charge, ChargeType, SplitMethod } from '../types';

interface AddChargeDialogProps {
  open: boolean;
  onClose: () => void;
  editingCharge?: Charge | null;
}

const defaultFormData: Omit<Charge, 'id'> = {
  name: '',
  amount: 0,
  type: 'charge',
  splitMethod: 'equal',
};

export default function AddChargeDialog({
  open,
  onClose,
  editingCharge,
}: AddChargeDialogProps) {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState<Omit<Charge, 'id'>>(defaultFormData);

  // Update form data when dialog opens/closes or editing charge changes
  useEffect(() => {
    if (open) {
      if (editingCharge) {
        setFormData({
          name: editingCharge.name,
          amount: editingCharge.amount,
          type: editingCharge.type,
          splitMethod: editingCharge.splitMethod,
        });
      } else {
        setFormData(defaultFormData);
      }
    }
  }, [open, editingCharge]);

  const handleClose = () => {
    setFormData(defaultFormData);
    onClose();
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      alert('Please enter charge name');
      return;
    }

    if (formData.amount <= 0) {
      alert('Amount must be greater than 0');
      return;
    }

    if (editingCharge) {
      dispatch(updateCharge({ ...formData, id: editingCharge.id }));
    } else {
      dispatch(addCharge(formData));
    }

    handleClose();
  };

  // Define form fields configuration
  const fields: FieldConfig[] = [
    {
      type: 'text',
      key: 'name',
      label: 'Charge Name',
      value: formData.name,
      onChange: (name) => setFormData({ ...formData, name }),
      autoFocus: true,
    },
    {
      type: 'price',
      key: 'amount',
      label: 'Amount',
      value: formData.amount,
      onChange: (amount) => setFormData({ ...formData, amount }),
    },
    {
      type: 'custom',
      key: 'type',
      render: (
        <FormControl fullWidth size="small">
          <InputLabel>Type</InputLabel>
          <Select
            value={formData.type}
            label="Type"
            onChange={(e) =>
              setFormData({ ...formData, type: e.target.value as ChargeType })
            }
          >
            <MenuItem value="charge">Charge (Add to total)</MenuItem>
            <MenuItem value="discount">Discount (Subtract from total)</MenuItem>
          </Select>
        </FormControl>
      ),
    },
    {
      type: 'custom',
      key: 'splitMethod',
      render: (
        <FormControl fullWidth size="small">
          <InputLabel>Split Method</InputLabel>
          <Select
            value={formData.splitMethod}
            label="Split Method"
            onChange={(e) =>
              setFormData({ ...formData, splitMethod: e.target.value as SplitMethod })
            }
          >
            <MenuItem value="equal">Split Equally</MenuItem>
            <MenuItem value="proportional">Split Proportionally (by amount paid)</MenuItem>
          </Select>
        </FormControl>
      ),
    },
  ];

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{editingCharge ? 'Edit Charge' : 'Add New Charge'}</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <FieldList fields={fields} spacing={2} py={1} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          {editingCharge ? 'Update' : 'Add'} Charge
        </Button>
      </DialogActions>
    </Dialog>
  );
}
