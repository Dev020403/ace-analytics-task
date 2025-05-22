import React, { useContext } from "react";
import { Box, Typography, CardContent, CardMedia } from "@mui/material";
import { DishContext } from "../../context/DishContext";
import Pagination from "../../UI/Pagination";
import { motion } from "framer-motion";
import {
  StyledCard,
  StyledChip,
  StyledButton,
  StyledAlert,
  PageTitle,
  ButtonContainer,
} from "./VotingTabStyles";

const VotingTab: React.FC = () => {
  const {
    getPaginatedDishes,
    userSelections,
    updateSelection,
    clearSelections,
    page,
    setPage,
    totalPages,
  } = useContext(DishContext);

  const dishes = getPaginatedDishes();

  const getDishRank = (dishId: number): number | null => {
    const selection = userSelections.find(
      (selection) => selection.dishId === dishId
    );
    return selection ? selection.rank : null;
  };

  const handleRank = (dishId: number, rank: number) => {
    updateSelection(dishId, rank);
  };

  const getButtonVariant = (dishId: number, rank: number) => {
    return getDishRank(dishId) === rank ? "contained" : "outlined";
  };

  const rankedDishesCount = userSelections.length;

  return (
    <Box
      sx={{
        padding: { xs: 2, sm: 3, md: 4 },
        maxWidth: "1400px",
        margin: "0 auto",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: { xs: "center", sm: "space-between" },
          alignItems: { xs: "center", sm: "flex-start" },
          flexDirection: { xs: "column", sm: "row" },
          mb: { xs: 3, sm: 4 },
          gap: 2,
        }}
      >
        <PageTitle>Vote for Your Favorite Dishes</PageTitle>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            width: { xs: "100%", sm: "auto" },
            justifyContent: { xs: "center", sm: "flex-end" },
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              fontFamily: '"Inter", sans-serif',
              fontWeight: 500,
              fontSize: { xs: "0.9rem", sm: "1rem" },
            }}
          >
            Selected: {rankedDishesCount}/3
          </Typography>
          <StyledButton
            variant="outlined"
            color="secondary"
            onClick={clearSelections}
            disabled={rankedDishesCount === 0}
            sx={{
              borderColor: rankedDishesCount === 0 ? "grey.400" : "#D81B60",
              color: rankedDishesCount === 0 ? "grey.400" : "#D81B60",
              "&:hover": {
                background: "rgba(216, 27, 96, 0.1)",
                borderColor: "#D81B60",
              },
            }}
          >
            Clear Selections
          </StyledButton>
        </Box>
      </Box>

      {rankedDishesCount === 3 && (
        <StyledAlert severity="success" sx={{ mb: { xs: 3, sm: 4 } }}>
          Thank you for voting! You've selected your top 3 dishes. You can
          change your selections at any time.
        </StyledAlert>
      )}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(auto-fill, minmax(280px, 1fr))",
            md: "repeat(auto-fill, minmax(320px, 1fr))",
          },
          gap: { xs: 2, sm: 3 },
        }}
      >
        {dishes.map((dish) => (
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
                  aria-label={`Rank ${getDishRank(dish.id)} for ${
                    dish.dishName
                  }`}
                />
              )}
              <CardMedia
                component="img"
                height="300"
                image={dish.image}
                alt={dish.dishName}
                sx={{ objectFit: "cover", loading: "lazy" }}
              />
              <CardContent
                sx={{
                  flexGrow: 1,
                  padding: { xs: 2, sm: 2.5, md: 3 },
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography
                  gutterBottom
                  variant="h5"
                  component="div"
                  sx={{
                    fontFamily: '"Poppins", sans-serif',
                    fontWeight: 600,
                    fontSize: { xs: "1.1rem", sm: "1.25rem", md: "1.5rem" },
                  }}
                >
                  {dish.dishName}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 2,
                    fontFamily: '"Inter", sans-serif',
                    lineHeight: 1.6,
                    fontSize: { xs: "0.8rem", sm: "0.875rem" },
                    display: "-webkit-box",
                    WebkitLineClamp: { xs: 3, md: 4 },
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {dish.description}
                </Typography>

                <Box sx={{ mt: "auto" }}>
                  <Typography
                    variant="subtitle2"
                    gutterBottom
                    sx={{
                      fontWeight: 500,
                      fontSize: { xs: "0.8rem", sm: "0.875rem" },
                    }}
                  >
                    Select Rank:
                  </Typography>
                  <ButtonContainer>
                    <StyledButton
                      onClick={() => handleRank(dish.id, 1)}
                      variant={getButtonVariant(dish.id, 1)}
                      aria-label={`Rank 1st for ${dish.dishName}`}
                    >
                      1st (30 pts)
                    </StyledButton>
                    <StyledButton
                      onClick={() => handleRank(dish.id, 2)}
                      variant={getButtonVariant(dish.id, 2)}
                      aria-label={`Rank 2nd for ${dish.dishName}`}
                    >
                      2nd (20 pts)
                    </StyledButton>
                    <StyledButton
                      onClick={() => handleRank(dish.id, 3)}
                      variant={getButtonVariant(dish.id, 3)}
                      aria-label={`Rank 3rd for ${dish.dishName}`}
                    >
                      3rd (10 pts)
                    </StyledButton>
                  </ButtonContainer>
                </Box>
              </CardContent>
            </StyledCard>
          </motion.div>
        ))}
      </Box>

      {totalPages > 1 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: { xs: 3, sm: 4 },
          }}
        >
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onChange={(value) => setPage(value)}
          />
        </Box>
      )}
    </Box>
  );
};

export default VotingTab;
