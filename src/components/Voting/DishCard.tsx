// components/DishCard.tsx
import React from "react";
import {
  Typography,
  CardContent,
  CardMedia,
  Box
} from "@mui/material";
import { motion } from "framer-motion";
import { StyledCard, StyledChip, StyledButton, ButtonContainer } from "../Tabs/VotingTabStyles";

interface Dish {
  id: number;
  dishName: string;
  description: string;
  image: string;
}

interface DishCardProps {
  dish: Dish;
  getDishRank: (dishId: number) => number | null;
  handleRank: (dishId: number, rank: number) => void;
  getButtonVariant: (dishId: number, rank: number) => "contained" | "outlined";
}

const DishCard: React.FC<DishCardProps> = ({
  dish,
  getDishRank,
  handleRank,
  getButtonVariant,
}) => (
  <motion.div
    key={dish.id}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <StyledCard>
      {getDishRank(dish.id) && (
        <StyledChip
          label={`Rank ${getDishRank(dish.id)}`}
          color="primary"
        />
      )}
      <CardMedia
        component="img"
        height="300"
        image={dish.image}
        alt={dish.dishName}
        sx={{ objectFit: "cover", loading: "lazy" }}
      />
      <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>{dish.dishName}</Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            lineHeight: 1.6,
            display: "-webkit-box",
            WebkitLineClamp: { xs: 3, md: 4 },
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {dish.description}
        </Typography>
        <Box sx={{ mt: "auto" }}>
          <Typography variant="subtitle2" gutterBottom>
            Select Rank:
          </Typography>
          <ButtonContainer>
            {[1, 2, 3].map((rank) => (
              <StyledButton
                key={rank}
                onClick={() => handleRank(dish.id, rank)}
                variant={getButtonVariant(dish.id, rank)}
              >
                {rank === 1 ? "1st (30 pts)" : rank === 2 ? "2nd (20 pts)" : "3rd (10 pts)"}
              </StyledButton>
            ))}
          </ButtonContainer>
        </Box>
      </CardContent>
    </StyledCard>
  </motion.div>
);

export default DishCard;
