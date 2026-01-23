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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import AddItemDialog from "./AddItemDialog";
import ChargesList from "./ChargesList";
import { useAppDispatch, useAppSelector, type RootState } from "../utils/hooks";
import {
  deleteItem,
  clearItems,
} from "../store/billSlice";
import { formatCurrency } from "../utils/helpers";
import type { BillItem } from "../types";

export default function ItemsList() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state: RootState) => state.bill.items);
  const persons = useAppSelector((state: RootState) => state.bill.persons);

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BillItem | null>(null);
  const [showClearItemsDialog, setShowClearItemsDialog] = useState(false);

  const handleEdit = (item: BillItem) => {
    setEditingItem(item);
    setAddDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setAddDialogOpen(false);
    setEditingItem(null);
  };

  const handleClearItems = () => {
    dispatch(clearItems());
    setShowClearItemsDialog(false);
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );


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
              <Stack direction="row" spacing={1}>
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
                {items.length > 0 && (
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteSweepIcon />}
                    onClick={() => setShowClearItemsDialog(true)}
                  >
                    Delete All
                  </Button>
                )}
              </Stack>
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
                </Stack>

                {/* Discount & Additional Charges Section */}
                <Box sx={{ bgcolor: "action.hover", p: 2, borderRadius: 1 }}>
                  <ChargesList />
                </Box>
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

      {/* Clear Items Dialog */}
      <Dialog open={showClearItemsDialog} onClose={() => setShowClearItemsDialog(false)}>
        <DialogTitle>Delete all items?</DialogTitle>
        <DialogContent>
          <Typography>
            This will delete all items in the bill. This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowClearItemsDialog(false)}>Cancel</Button>
          <Button onClick={handleClearItems} color="error" variant="contained">
            Delete All
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
