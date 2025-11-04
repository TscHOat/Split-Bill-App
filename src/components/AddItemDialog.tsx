import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { useAppDispatch, useAppSelector, type RootState } from "../utils/hooks";
import { addItem, updateItem } from "../store/billSlice";
import { FieldList, type FieldConfig } from "./FieldList";
import type { BillItem } from "../types";

interface AddItemDialogProps {
  open: boolean;
  onClose: () => void;
  editingItem?: BillItem | null;
}

const defaultFormData = {
  name: "",
  price: 0,
  quantity: 1,
  assignedPerson: "",
};

export default function AddItemDialog({
  open,
  onClose,
  editingItem,
}: AddItemDialogProps) {
  const dispatch = useAppDispatch();
  const persons = useAppSelector((state: RootState) => state.bill.persons);

  const [formData, setFormData] =
    useState<Omit<BillItem, "id">>(defaultFormData);

  // Update form data ketika dialog dibuka atau editing item berubah
  useEffect(() => {
    if (open) {
      if (editingItem) {
        setFormData({
          name: editingItem.name,
          price: editingItem.price,
          quantity: editingItem.quantity,
          assignedPerson: editingItem.assignedPerson,
        });
      } else {
        setFormData(defaultFormData);
      }
    }
  }, [open, editingItem]);

  const handleClose = () => {
    setFormData(defaultFormData);
    onClose();
  };

  const handleSubmit = () => {
    if (!formData.name.trim() || !formData.assignedPerson) {
      alert("Please fill all fields");
      return;
    }

    if (formData.price <= 0) {
      alert("Price must be greater than 0");
      return;
    }

    if (formData.quantity <= 0) {
      alert("Quantity must be greater than 0");
      return;
    }

    if (editingItem) {
      dispatch(
        updateItem({
          ...formData,
          id: editingItem.id,
        })
      );
    } else {
      dispatch(addItem(formData));
    }

    handleClose();
  };

  // Define form fields configuration
  const fields: FieldConfig[] = [
    {
      label: "Item Name",
      type: "text",
      key: "name",
      value: formData.name,
      onChange: (name) => setFormData({ ...formData, name }),
      autoFocus: true,
    },
    {
      type: "price",
      key: "price",
      label: "Price",
      value: formData.price,
      onChange: (price) => setFormData({ ...formData, price }),
    },
    {
      type: "quantity",
      key: "quantity",
      value: formData.quantity,
      onChange: (quantity) => setFormData({ ...formData, quantity }),
    },
    {
      type: "select-person",
      key: "assignedPerson",
      value: formData.assignedPerson,
      onChange: (assignedPerson) =>
        setFormData({ ...formData, assignedPerson }),
      persons,
    },
    {
      type: "total-display",
      key: "total",
      price: formData.price,
      quantity: formData.quantity,
    },
  ];

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{editingItem ? "Edit Item" : "Add New Item"}</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <FieldList fields={fields} spacing={2} py={1} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          {editingItem ? "Update" : "Add"} Item
        </Button>
      </DialogActions>
    </Dialog>
  );
}
