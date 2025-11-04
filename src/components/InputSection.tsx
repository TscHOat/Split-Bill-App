import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  TextField,
  Stack,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import { useAppDispatch, useAppSelector, type RootState } from '../utils/hooks';
import { addPerson, resetItemsAndPersons } from '../store/billSlice';

export default function InputSection({ onImportClick }: { onImportClick: () => void }) {
  const dispatch = useAppDispatch();
  const persons = useAppSelector((state: RootState) => state.bill.persons);
  const [newPersonName, setNewPersonName] = useState('');
  const [showClearDialog, setShowClearDialog] = useState(false);

  const handleAddPerson = () => {
    if (newPersonName.trim()) {
      dispatch(addPerson(newPersonName.trim()));
      setNewPersonName('');
    }
  };

  const handleClearAll = () => {
    dispatch(resetItemsAndPersons());
    setShowClearDialog(false);
  };

  return (
    <>
      <Card sx={{ p: 3 }}>
        <Stack spacing={3}>
          {/* Header */}
          <Box>
            <Typography variant="h5" gutterBottom>
              📋 Setup Your Bill
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Add people and items, then calculate fair split
            </Typography>
          </Box>

          {/* Add Person Section */}
          <Box>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
              Add People
            </Typography>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1}
              alignItems={{ xs: 'stretch', sm: 'flex-end' }}
            >
              <TextField
                label="Person name"
                value={newPersonName}
                onChange={(e) => setNewPersonName(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAddPerson();
                  }
                }}
                size="small"
                sx={{ flex: 1 }}
              />
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddPerson}
                disabled={!newPersonName.trim()}
                sx={{ whiteSpace: 'nowrap', width: { xs: '100%', sm: 'auto' } }}
              >
                Add Person
              </Button>
            </Stack>
          </Box>

          {/* People List */}
          {persons.length > 0 && (
            <Box>
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                People in this bill: {persons.length}
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {persons.map((person) => (
                  <Box
                    key={person.id}
                    sx={{
                      px: 2,
                      py: 1,
                      bgcolor: 'primary.light',
                      color: 'primary.dark',
                      borderRadius: 2,
                      fontSize: '0.9rem',
                      fontWeight: 500,
                    }}
                  >
                    👤 {person.name}
                  </Box>
                ))}
              </Stack>
            </Box>
          )}

          {/* Action Buttons */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            <Button
              variant="outlined"
              startIcon={<FileDownloadIcon />}
              onClick={onImportClick}
              sx={{ flex: { xs: 1, sm: 'auto' } }}
            >
              Import JSON
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteSweepIcon />}
              onClick={() => setShowClearDialog(true)}
              sx={{ flex: { xs: 1, sm: 'auto' } }}
            >
              Clear All
            </Button>
          </Stack>
        </Stack>
      </Card>

      {/* Clear Dialog */}
      <Dialog open={showClearDialog} onClose={() => setShowClearDialog(false)}>
        <DialogTitle>Clear all data?</DialogTitle>
        <DialogContent>
          <Typography>
            This will delete all items, people, and settings. This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowClearDialog(false)}>Cancel</Button>
          <Button onClick={handleClearAll} color="error" variant="contained">
            Clear All
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
