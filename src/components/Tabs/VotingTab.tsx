import React, { useContext, useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  CardContent,
  CardMedia,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
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
    dishes,
    userSelections,
    updateSelection,
    clearSelections,
    page,
    setPage,
  } = useContext(DishContext);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [filteredDishes, setFilteredDishes] = useState(dishes);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Filter dishes based on debounced query
  useEffect(() => {
    if (!dishes) return;

    if (!debouncedQuery) {
      setFilteredDishes(dishes);
      return;
    }

    const filtered = dishes.filter(
      (dish) =>
        dish.dishName.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        dish.description.toLowerCase().includes(debouncedQuery.toLowerCase())
    );

    setFilteredDishes(filtered);
    // Reset to first page when search changes
    setPage(1);
  }, [debouncedQuery, dishes, setPage]);

  // Get paginated dishes from filtered results
  const getPaginatedDishes = useCallback(() => {
    const startIndex = (page - 1) * 6; // Using 6 as itemsPerPage from DishContext
    const endIndex = startIndex + 6;
    return filteredDishes.slice(startIndex, endIndex);
  }, [filteredDishes, page]);

  const paginatedDishes = getPaginatedDishes();

  // Calculate total pages based on filtered dishes
  const calculatedTotalPages = Math.ceil(filteredDishes.length / 6);

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

      {/* Search input */}
      <Box sx={{ mb: { xs: 3, sm: 4 } }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search dishes by name or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              "&.Mui-focused fieldset": {
                borderColor: "primary.main",
              },
            },
          }}
        />
      </Box>

      {rankedDishesCount === 3 && (
        <StyledAlert severity="success" sx={{ mb: { xs: 3, sm: 4 } }}>
          Thank you for voting! You've selected your top 3 dishes. You can
          change your selections at any time.
        </StyledAlert>
      )}

      {paginatedDishes.length === 0 && debouncedQuery && (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No dishes found matching "{debouncedQuery}"
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Try a different search term or clear the search
          </Typography>
        </Box>
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
        {paginatedDishes.map((dish) => (
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

      {calculatedTotalPages > 1 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: { xs: 3, sm: 4 },
          }}
        >
          <Pagination
            currentPage={page}
            totalPages={calculatedTotalPages}
            onChange={(value) => setPage(value)}
          />
        </Box>
      )}
    </Box>
  );
};

export default VotingTab;
