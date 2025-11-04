import { Typography } from '@mui/material';
import { formatCurrency } from '../../utils/helpers';

interface ItemTotalDisplayProps {
  price: number;
  quantity: number;
}

export default function ItemTotalDisplay({ price, quantity }: ItemTotalDisplayProps) {
  const total = price * quantity;

  return (
    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
      Total: {formatCurrency(total)}
    </Typography>
  );
}
