import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  CardContent,
} from "@mui/material";
import { type User, type Dish, type UserSelection } from "../../types";
import { DishesContainer, DishCard } from "./StyledComponents";

interface EditDialogProps {
  open: boolean;
  user: User | null;
  dishes: Dish[];
  selections: UserSelection[];
  onClose: () => void;
  onSave: () => void;
  onSelectionChange: (dishId: number, rank: number) => void;
}

const EditDialog: React.FC<EditDialogProps> = ({
  open,
  user,
  dishes,
  selections,
  onClose,
  onSave,
  onSelectionChange,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Selections for {user?.name}</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          Select up to 3 dishes and assign ranks (1st, 2nd, 3rd):
        </Typography>

        <DishesContainer>
          {dishes.map((dish) => {
            const selection = selections.find((s) => s.dishId === dish.id);
            const rank = selection ? selection.rank : null;

            return (
              <DishCard key={dish.id} variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {dish.dishName}
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    {rank && (
                      <Chip
                        label={`Rank ${rank}`}
                        color="primary"
                        size="small"
                        sx={{ mb: 1 }}
                      />
                    )}
                  </Box>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                      size="small"
                      variant={rank === 1 ? "contained" : "outlined"}
                      onClick={() => onSelectionChange(dish.id, 1)}
                    >
                      1st
                    </Button>
                    <Button
                      size="small"
                      variant={rank === 2 ? "contained" : "outlined"}
                      onClick={() => onSelectionChange(dish.id, 2)}
                    >
                      2nd
                    </Button>
                    <Button
                      size="small"
                      variant={rank === 3 ? "contained" : "outlined"}
                      onClick={() => onSelectionChange(dish.id, 3)}
                    >
                      3rd
                    </Button>
                  </Box>
                </CardContent>
              </DishCard>
            );
          })}
        </DishesContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onSave} color="primary" variant="contained">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditDialog;