import { AppBar, Toolbar, Typography, Container, Box } from '@mui/material';
import { useState } from 'react';
import InputSection from './InputSection';
import ItemsList from './ItemsList';
import SplitResultSection from './SplitResultSection';
import JsonImportDialog from './JsonImportDialog';

export default function Layout() {
  const [importDialogOpen, setImportDialogOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* App Bar */}
      <AppBar position="sticky" elevation={1}>
        <Toolbar sx={{ gap: 1 }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
            💰 Split Bill
          </Typography>
          <Typography variant="body2" sx={{ mr: { xs: 0, sm: 2 }, display: { xs: 'none', sm: 'block' } }}>
            Fair cost distribution
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3 }, px: { xs: 1, sm: 2 }, flex: 1 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, sm: 3 } }}>
          {/* Input Section */}
          <InputSection onImportClick={() => setImportDialogOpen(true)} />

          {/* Items List */}
          <ItemsList />

          {/* Split Result */}
          <SplitResultSection />
        </Box>
      </Container>

      {/* JSON Import Dialog */}
      <JsonImportDialog
        open={importDialogOpen}
        onClose={() => setImportDialogOpen(false)}
      />

      {/* Footer */}
      <Box
        sx={{
          bgcolor: 'background.paper',
          borderTop: '1px solid',
          borderColor: 'divider',
          py: { xs: 1.5, sm: 2 },
          mt: 'auto',
        }}
      >
        <Container maxWidth="lg" sx={{ px: { xs: 1, sm: 2 } }}>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
            © 2025 Split Bill App | Distribute costs fairly 🎯
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
