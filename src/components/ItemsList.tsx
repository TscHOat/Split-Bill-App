import { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  IconButton,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddItemDialog from "./AddItemDialog";
import { FieldList, type FieldConfig } from "./FieldList";
import { useAppDispatch, useAppSelector, type RootState } from "../utils/hooks";
import {
  deleteItem,
  setServiceCharge,
  setTax,
  setDiscount,
} from "../store/billSlice";
import { formatCurrency } from "../utils/helpers";
import type { BillItem } from "../types";

export default function ItemsList() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state: RootState) => state.bill.items);
  const serviceCharge = useAppSelector(
    (state: RootState) => state.bill.serviceCharge
  );
  const tax = useAppSelector((state: RootState) => state.bill.tax);
  const discount = useAppSelector((state: RootState) => state.bill.discount);
  const persons = useAppSelector((state: RootState) => state.bill.persons);

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BillItem | null>(null);

  const handleEdit = (item: BillItem) => {
    setEditingItem(item);
    setAddDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setAddDialogOpen(false);
    setEditingItem(null);
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const totalDiscount = discount;
  const subtotalAfterDiscount = subtotal - totalDiscount;
  const serviceChargeAmount = serviceCharge;
  const taxAmount = tax;

  return (
    <>
      <Card>
        <CardContent>
          <Stack spacing={3}>
            {/* Header */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h5">🍽️ Items</Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => {
                  setEditingItem(null);
                  setAddDialogOpen(true);
                }}
                disabled={persons.length === 0}
              >
                Add Item
              </Button>
            </Box>

            {persons.length === 0 && (
              <Alert severity="info">
                👤 Add people first before adding items
              </Alert>
            )}

            {items.length === 0 ? (
              <Typography color="text.secondary" align="center" sx={{ py: 3 }}>
                No items added yet. Click "Add Item" to get started.
              </Typography>
            ) : (
              <>
                {/* Items Table */}
                <TableContainer
                  sx={{
                    overflowX: "auto",
                    borderRadius: 1,
                    boxShadow: "none",
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Table size="small" sx={{ minWidth: 600 }}>
                    <TableHead sx={{ bgcolor: "action.hover" }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>
                          Item Name
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>
                          Price
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>
                          Qty
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>
                          Subtotal
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: 600 }}>
                          Person
                        </TableCell>
                        <TableCell
                          align="center"
                          width={100}
                          sx={{ fontWeight: 600 }}
                        >
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {items.map((item) => {
                        const itemTotal = item.price * item.quantity;
                        const person = persons.find(
                          (p) => p.id === item.assignedPerson
                        );

                        return (
                          <TableRow key={item.id} hover>
                            <TableCell sx={{ fontWeight: 500 }}>
                              {item.name}
                            </TableCell>
                            <TableCell align="right">
                              {formatCurrency(item.price)}
                            </TableCell>
                            <TableCell align="right">{item.quantity}</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 600 }}>
                              {formatCurrency(itemTotal)}
                            </TableCell>
                            <TableCell align="center">
                              {person?.name || "-"}
                            </TableCell>
                            <TableCell align="center">
                              <IconButton
                                size="small"
                                onClick={() => handleEdit(item)}
                                color="primary"
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => dispatch(deleteItem(item.id))}
                                color="error"
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* Summary */}
                <Stack
                  spacing={1}
                  sx={{ borderTop: "2px solid", borderColor: "divider", pt: 2 }}
                >
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography>Subtotal:</Typography>
                    <Typography sx={{ fontWeight: 600 }}>
                      {formatCurrency(subtotal)}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      color: "success.main",
                    }}
                  >
                    <Typography>Total Discount:</Typography>
                    <Typography sx={{ fontWeight: 600 }}>
                      -{formatCurrency(totalDiscount)}
                    </Typography>
                  </Box>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography>After Discount:</Typography>
                    <Typography sx={{ fontWeight: 600 }}>
                      {formatCurrency(subtotalAfterDiscount)}
                    </Typography>
                  </Box>
                </Stack>

                {/* Service Charge & Tax Settings */}
                <Stack
                  spacing={2}
                  sx={{ bgcolor: "action.hover", p: 2, borderRadius: 1 }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    ⚙️ Discount & Additional Charges
                  </Typography>
                  <FieldList
                    fields={
                      [
                        {
                          label: "Discount",
                          type: "price",
                          key: "discount",
                          value: discount,
                          onChange: (value) =>
                            dispatch(setDiscount(Math.max(0, value))),
                        },
                        {
                          label: "Service Charge",
                          type: "price",
                          key: "serviceCharge",
                          value: serviceCharge,
                          onChange: (value) =>
                            dispatch(setServiceCharge(Math.max(0, value))),
                        },
                        {
                          label: "Tax",
                          type: "price",
                          key: "tax",
                          value: tax,
                          onChange: (value) =>
                            dispatch(setTax(Math.max(0, value))),
                        },
                      ] as FieldConfig[]
                    }
                    spacing={1}
                    direction={{ xs: "column", sm: "row" }}
                  />
                  {(totalDiscount > 0 ||
                    serviceChargeAmount > 0 ||
                    taxAmount > 0) && (
                    <Stack
                      spacing={0.5}
                      sx={{
                        mt: 1,
                        pt: 1,
                        borderTop: "1px solid",
                        borderColor: "divider",
                      }}
                    >
                      {totalDiscount > 0 && (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            fontSize: "0.9rem",
                          }}
                        >
                          <Typography variant="body2">Discount:</Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, color: "success.main" }}
                          >
                            -{formatCurrency(totalDiscount)}
                          </Typography>
                        </Box>
                      )}
                      {serviceChargeAmount > 0 && (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            fontSize: "0.9rem",
                          }}
                        >
                          <Typography variant="body2">
                            Service Charge:
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {formatCurrency(serviceChargeAmount)}
                          </Typography>
                        </Box>
                      )}
                      {taxAmount > 0 && (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            fontSize: "0.9rem",
                          }}
                        >
                          <Typography variant="body2">Tax:</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {formatCurrency(taxAmount)}
                          </Typography>
                        </Box>
                      )}
                    </Stack>
                  )}
                </Stack>
              </>
            )}
          </Stack>
        </CardContent>
      </Card>

      {/* Add/Edit Item Dialog */}
      <AddItemDialog
        open={addDialogOpen}
        onClose={handleCloseDialog}
        editingItem={editingItem}
      />
    </>
  );
}
