import { useState } from 'react';
import {
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import AddChargeDialog from './AddChargeDialog';
import { useAppDispatch, useAppSelector, type RootState } from '../utils/hooks';
import {
  deleteCharge,
  clearCharges,
} from '../store/billSlice';
import { formatCurrency } from '../utils/helpers';
import type { Charge } from '../types';

export default function ChargesList() {
  const dispatch = useAppDispatch();
  const charges = useAppSelector((state: RootState) => state.bill.charges);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCharge, setEditingCharge] = useState<Charge | null>(null);
  const [showClearDialog, setShowClearDialog] = useState(false);

  const handleOpenDialog = (charge?: Charge) => {
    if (charge) {
      setEditingCharge(charge);
    } else {
      setEditingCharge(null);
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingCharge(null);
  };

  const handleClearCharges = () => {
    dispatch(clearCharges());
    setShowClearDialog(false);
  };

  return (
    <>
      <Stack spacing={2}>
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box sx={{ fontWeight: 600 }}>⚙️ Discount & Additional Charges</Box>
          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              size="small"
            >
              Add Charge
            </Button>
            {charges.length > 0 && (
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteSweepIcon />}
                onClick={() => setShowClearDialog(true)}
                size="small"
              >
                Delete All
              </Button>
            )}
          </Stack>
        </Box>

        {/* Charges Table */}
        {charges.length > 0 ? (
          <TableContainer
            sx={{
              borderRadius: 1,
              boxShadow: 'none',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Table size="small">
              <TableHead sx={{ bgcolor: 'action.hover' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                    Amount
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>
                    Type
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>
                    Split Method
                  </TableCell>
                  <TableCell align="center" width={100} sx={{ fontWeight: 600 }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {charges.map((charge) => (
                  <TableRow key={charge.id} hover>
                    <TableCell sx={{ fontWeight: 500 }}>{charge.name}</TableCell>
                    <TableCell align="right">
                      <Box sx={{ color: charge.type === 'discount' ? 'success.main' : 'error.main' }}>
                        {charge.type === 'discount' ? '-' : '+'}
                        {formatCurrency(charge.amount)}
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box
                        sx={{
                          display: 'inline-block',
                          px: 1.5,
                          py: 0.5,
                          bgcolor: charge.type === 'discount' ? 'success.light' : 'error.main',
                          borderRadius: 1,
                          fontSize: '0.85rem',
                          fontWeight: 500,
                          color: charge.type === 'discount' ? 'success.dark' : 'white',
                        }}
                      >
                        {charge.type === 'discount' ? 'Discount' : 'Charge'}
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box
                        sx={{
                          display: 'inline-block',
                          px: 1.5,
                          py: 0.5,
                          bgcolor: 'info.main',
                          borderRadius: 1,
                          fontSize: '0.85rem',
                          fontWeight: 500,
                          color: 'white',
                        }}
                      >
                        {charge.splitMethod === 'equal' ? 'Equal' : 'Proportional'}
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(charge)}
                        color="primary"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => dispatch(deleteCharge(charge.id))}
                        color="error"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box sx={{ textAlign: 'center', py: 3, color: 'text.secondary' }}>
            No charges added yet. Click "Add Charge" to get started.
          </Box>
        )}
      </Stack>

      {/* Add/Edit Charge Dialog */}
      <AddChargeDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        editingCharge={editingCharge}
      />

      {/* Clear Charges Dialog */}
      <Dialog open={showClearDialog} onClose={() => setShowClearDialog(false)}>
        <DialogTitle>Delete all charges?</DialogTitle>
        <DialogContent>
          <Box>This will delete all charges and discounts. This action cannot be undone.</Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowClearDialog(false)}>Cancel</Button>
          <Button onClick={handleClearCharges} color="error" variant="contained">
            Delete All
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
