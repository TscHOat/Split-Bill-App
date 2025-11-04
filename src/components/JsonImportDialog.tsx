import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  Typography,
  Alert,
  Box,
  Tabs,
  Tab,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useAppDispatch, useAppSelector, type RootState } from '../utils/hooks';
import { loadFromJson } from '../store/billSlice';
import { validateJsonImport, generateId } from '../utils/helpers';
import type { JsonImportFormat } from '../types';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`import-tabpanel-${index}`}
      aria-labelledby={`import-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

interface JsonImportDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function JsonImportDialog({ open, onClose }: JsonImportDialogProps) {
  const dispatch = useAppDispatch();
  const bill = useAppSelector((state: RootState) => state.bill);
  const [tabValue, setTabValue] = useState(0);
  const [importJson, setImportJson] = useState('');
  const [error, setError] = useState('');

  const handleClose = () => {
    setImportJson('');
    setError('');
    setTabValue(0);
    onClose();
  };

  const handleImport = () => {
    try {
      const parsed = JSON.parse(importJson);
      if (!validateJsonImport(parsed)) {
        setError(
          'Invalid JSON format. Please check the template and ensure all required fields are present.'
        );
        return;
      }

      // Transform to internal format
      const persons = parsed.persons.map((p) => ({
        id: generateId(),
        name: p.name,
      }));

      const personMap = new Map(persons.map((p) => [p.name, p.id]));

      const items = parsed.items.map((item) => ({
        id: generateId(),
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        assignedPerson: personMap.get(item.assignedPerson) || '',
      }));

      const newBillState = {
        items,
        persons,
        serviceCharge: parsed.serviceCharge || 0,
        tax: parsed.tax || 0,
        discount: parsed.discount || 0,
      };

      dispatch(loadFromJson(newBillState));
      setError('');
      handleClose();
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const exportJson = () => {
    const exportData: JsonImportFormat = {
      items: bill.items.map((item) => {
        const person = bill.persons.find((p) => p.id === item.assignedPerson);
        return {
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          assignedPerson: person?.name || '',
        };
      }),
      persons: bill.persons.map((p) => ({ name: p.name })),
      serviceCharge: bill.serviceCharge,
      tax: bill.tax,
      discount: bill.discount,
    };

    const jsonString = JSON.stringify(exportData, null, 2);
    navigator.clipboard.writeText(jsonString);
    alert('Bill data copied to clipboard!');
  };

  const template: JsonImportFormat = {
    items: [
      {
        name: 'Nasi Goreng Spesial',
        price: 35000,
        quantity: 1,
        assignedPerson: 'Alice',
      },
      {
        name: 'Mie Ayam',
        price: 25000,
        quantity: 2,
        assignedPerson: 'Bob',
      },
      {
        name: 'Es Cendol',
        price: 8000,
        quantity: 3,
        assignedPerson: 'Charlie',
      },
    ],
    persons: [
      { name: 'Alice' },
      { name: 'Bob' },
      { name: 'Charlie' },
    ],
    serviceCharge: 15000,
    tax: 20000,
    discount: 10000,
  };

  const copyTemplate = () => {
    const templateString = JSON.stringify(template, null, 2);
    navigator.clipboard.writeText(templateString);
    alert('Template copied to clipboard!');
    setImportJson(templateString);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>💾 JSON Import/Export</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Tabs
          value={tabValue}
          onChange={(_, newValue) => setTabValue(newValue)}
          aria-label="import/export tabs"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Import" id="import-tab-0" aria-controls="import-tabpanel-0" />
          <Tab label="Export" id="import-tab-1" aria-controls="import-tabpanel-1" />
          <Tab label="Template" id="import-tab-2" aria-controls="import-tabpanel-2" />
        </Tabs>

        {/* Import Tab */}
        <TabPanel value={tabValue} index={0}>
          <Stack spacing={2}>
            <Typography variant="body2" color="text.secondary">
              Paste your JSON bill data below to import it.
            </Typography>
            <TextField
              multiline
              rows={10}
              fullWidth
              value={importJson}
              onChange={(e) => {
                setImportJson(e.target.value);
                setError('');
              }}
              placeholder='Paste your JSON here...'
              sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}
            />
            {error && <Alert severity="error">{error}</Alert>}
          </Stack>
        </TabPanel>

        {/* Export Tab */}
        <TabPanel value={tabValue} index={1}>
          <Stack spacing={2}>
            <Typography variant="body2" color="text.secondary">
              Your current bill data in JSON format:
            </Typography>
            <TextField
              multiline
              rows={10}
              fullWidth
              value={JSON.stringify(
                {
                  items: bill.items.map((item) => {
                    const person = bill.persons.find((p) => p.id === item.assignedPerson);
                    return {
                      name: item.name,
                      price: item.price,
                      quantity: item.quantity,
                      assignedPerson: person?.name || '',
                    };
                  }),
                  persons: bill.persons.map((p) => ({ name: p.name })),
                  serviceCharge: bill.serviceCharge,
                  tax: bill.tax,
                  discount: bill.discount,
                },
                null,
                2
              )}
              InputProps={{ readOnly: true }}
              sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}
            />
            <Alert severity="info">Click "Copy Export" button to copy this to clipboard</Alert>
          </Stack>
        </TabPanel>

        {/* Template Tab */}
        <TabPanel value={tabValue} index={2}>
          <Stack spacing={2}>
            <Typography variant="body2" color="text.secondary">
              Use this template structure for importing bills:
            </Typography>
            <TextField
              multiline
              rows={10}
              fullWidth
              value={JSON.stringify(template, null, 2)}
              InputProps={{ readOnly: true }}
              sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}
            />
            <Alert severity="info">
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
                Fields explanation:
              </Typography>
              <Typography component="div" variant="body2" sx={{ pl: 2 }}>
                • <strong>items</strong>: Array of items ordered
                <br />
                • <strong>name</strong>: Item name
                <br />
                • <strong>price</strong>: Price per item (Rp)
                <br />
                • <strong>quantity</strong>: Number of items
                <br />
                • <strong>assignedPerson</strong>: Person who ordered (must match persons list)
                <br />
                • <strong>persons</strong>: Array of people in the bill
                <br />
                • <strong>serviceCharge</strong>: Service charge amount in Rp (optional)
                <br />
                • <strong>tax</strong>: Tax amount in Rp (optional)
                <br />
                • <strong>discount</strong>: Discount amount in Rp (optional)
              </Typography>
            </Alert>
          </Stack>
        </TabPanel>
      </DialogContent>
      <DialogActions>
        {tabValue === 0 && (
          <>
            <Button onClick={() => copyTemplate()}>Use Template</Button>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleImport} variant="contained">
              Import Bill
            </Button>
          </>
        )}
        {tabValue === 1 && (
          <>
            <Button onClick={handleClose}>Close</Button>
            <Button
              onClick={exportJson}
              variant="contained"
              startIcon={<ContentCopyIcon />}
              disabled={bill.items.length === 0}
            >
              Copy Export
            </Button>
          </>
        )}
        {tabValue === 2 && (
          <>
            <Button onClick={handleClose}>Close</Button>
            <Button onClick={() => copyTemplate()} variant="contained" startIcon={<ContentCopyIcon />}>
              Copy Template
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}
