import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import { type User } from "../../types";

interface DeleteDialogProps {
  open: boolean;
  user: User | null;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteDialog: React.FC<DeleteDialogProps> = ({
  open,
  user,
  onClose,
  onConfirm,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm User Deletion</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete {user?.name}? This action cannot be
          undone.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDialog;
