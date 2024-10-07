import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import { useState } from 'react';

interface AddDataFormProps {
  addContent: React.FC;
  formWidth: number;
}

const AddDataForm: React.FC<AddDataFormProps> = ({
  addContent: AddContent,
  formWidth,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const handleButtonClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Box
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
        }}
      >
        <Fab color="primary" aria-label="add" onClick={handleButtonClick}>
          <AddIcon />
        </Fab>
      </Box>

      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            width: formWidth,
          },
        }}
      >
        <DialogContent>
          <AddContent />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            閉じる
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddDataForm;
