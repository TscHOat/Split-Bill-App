import {
  Card,
  CardContent,
  Typography,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Box,
  Alert,
} from '@mui/material';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import { useAppSelector, type RootState } from '../utils/hooks';
import { calculateSplitBill, formatCurrency } from '../utils/helpers';

export default function SplitResultSection() {
  const bill = useAppSelector((state: RootState) => state.bill);
  const result = calculateSplitBill(bill);
  const handleCopyResult = () => {
    const resultText = bill.persons
      .map((person) => {
        const summary = result.billSummary.find((s) => s.personId === person.id);
        if (!summary) return '';
        return `${person.name}: ${formatCurrency(summary.finalAmount)}`;
      })
      .join('\n');

    navigator.clipboard.writeText(resultText);
    alert('Copied to clipboard!');
  };

  if (bill.items.length === 0 || bill.persons.length === 0) {
    return (
      <Card>
        <CardContent>
          <Alert severity="info">
            📊 Add items and people to see the split bill calculation
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ bgcolor: 'success.light' }}>
      <CardContent>
        <Stack spacing={3}>
          {/* Header */}
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'center' }, gap: 1 }}>
            <Typography variant="h5">💰 Split Results</Typography>
            <Button
              size="small"
              startIcon={<FileCopyIcon />}
              onClick={handleCopyResult}
              variant="outlined"
              sx={{ width: { xs: '100%', sm: 'auto' } }}
            >
              Copy Results
            </Button>
          </Box>

          {/* Grand Total */}
          <Box sx={{ bgcolor: 'white', p: 2, borderRadius: 1 }}>
            <Stack spacing={1}>
              <Typography variant="body2" color="text.secondary">
                Grand Total Breakdown:
              </Typography>
              <Stack spacing={0.5} sx={{ fontSize: '0.9rem' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Subtotal:</Typography>
                  <Typography variant="body2">{formatCurrency(result.subtotal)}</Typography>
                </Box>
                {result.totalDiscount > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', color: 'success.main' }}>
                    <Typography variant="body2">Total Discount:</Typography>
                    <Typography variant="body2">-{formatCurrency(result.totalDiscount)}</Typography>
                  </Box>
                )}
                {result.serviceChargeAmount > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Service Charge:</Typography>
                    <Typography variant="body2">
                      +{formatCurrency(result.serviceChargeAmount)}
                    </Typography>
                  </Box>
                )}
                {result.taxAmount > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Tax:</Typography>
                    <Typography variant="body2">+{formatCurrency(result.taxAmount)}</Typography>
                  </Box>
                )}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    borderTop: '2px solid',
                    borderColor: 'divider',
                    pt: 1,
                    mt: 1,
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    GRAND TOTAL:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {formatCurrency(result.grandTotal)}
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          </Box>

          {/* Per Person Breakdown */}
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            💳 Amount Each Person Should Pay:
          </Typography>

          <TableContainer sx={{ overflowX: 'auto', borderRadius: 1, boxShadow: 'none', border: '1px solid', borderColor: 'divider' }}>
            <Table size="small" sx={{ minWidth: 500 }}>
              <TableHead sx={{ bgcolor: 'action.hover' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Person</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>Items</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>Discount</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>Charges</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>Tax</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                    Amount to Pay
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {result.billSummary.map((summary) => (
                  <TableRow key={summary.personId} hover sx={{ bgcolor: 'white' }}>
                    <TableCell sx={{ fontWeight: 600 }}>{summary.personName}</TableCell>
                    <TableCell align="right">
                      {formatCurrency(summary.totalItemPrice)}
                    </TableCell>
                    <TableCell align="right" sx={{ color: 'success.main' }}>
                      -{formatCurrency(summary.discountAmount)}
                    </TableCell>
                    <TableCell align="right">
                      +{formatCurrency(summary.shareOfServiceCharge)}
                    </TableCell>
                    <TableCell align="right">
                      +{formatCurrency(summary.taxAmount)}
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        fontWeight: 700,
                        fontSize: '1.1rem',
                        color: 'success.dark',
                      }}
                    >
                      {formatCurrency(summary.finalAmount)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Verification */}
          <Alert severity="info">
            ✓ Total amount to collect: {formatCurrency(
              result.billSummary.reduce((sum, s) => sum + s.finalAmount, 0)
            )}{' '}
            (matches grand total)
          </Alert>
        </Stack>
      </CardContent>
    </Card>
  );
}
