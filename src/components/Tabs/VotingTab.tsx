import React, { useContext, useState, useEffect, useCallback } from "react";
import { Box, Typography } from "@mui/material";
import { DishContext } from "../../context/DishContext";
import Pagination from "../../UI/Pagination";
import { StyledAlert, PageTitle, StyledButton } from "./VotingTabStyles";
import SearchBar from "../Voting/SearchBar";
import DishCard from "../Voting/DishCard";

const VotingTab: React.FC = () => {
  const {
    dishes,
    userSelections,
    updateSelection,
    clearSelections,
    page,
    setPage,
  } = useContext(DishContext);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [filteredDishes, setFilteredDishes] = useState(dishes);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

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
    setPage(1);
  }, [debouncedQuery, dishes, setPage]);

  const getPaginatedDishes = useCallback(() => {
    const startIndex = (page - 1) * 6;
    return filteredDishes.slice(startIndex, startIndex + 6);
  }, [filteredDishes, page]);

  const getDishRank = (dishId: number) => {
    const selection = userSelections.find((s) => s.dishId === dishId);
    return selection ? selection.rank : null;
  };

  const handleRank = (dishId: number, rank: number) =>
    updateSelection(dishId, rank);
  const getButtonVariant = (dishId: number, rank: number) =>
    getDishRank(dishId) === rank ? "contained" : "outlined";

  const paginatedDishes = getPaginatedDishes();
  const totalPages = Math.ceil(filteredDishes.length / 6);
  const rankedDishesCount = userSelections.length;

  return (
    <Box
      sx={{
        padding: { xs: 2, sm: 3, md: 4 },
        maxWidth: "1400px",
        margin: "0 auto",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          mb: 4,
        }}
      >
        <PageTitle>Vote for Your Favorite Dishes</PageTitle>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="subtitle1">
            Selected: {rankedDishesCount}/3
          </Typography>
          <StyledButton
            variant="outlined"
            onClick={clearSelections}
            disabled={rankedDishesCount === 0}
          >
            Clear Selections
          </StyledButton>
        </Box>
      </Box>

      {/* Search */}
      <Box sx={{ mb: 4 }}>
        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Box>

      {/* Alert */}
      {rankedDishesCount === 3 && (
        <StyledAlert severity="success" sx={{ mb: 3 }}>
          Thank you for voting! You've selected your top 3 dishes. You can
          change your selections at any time.
        </StyledAlert>
      )}

      {/* No Results */}
      {paginatedDishes.length === 0 && debouncedQuery && (
        <Typography textAlign="center" color="text.secondary" sx={{ py: 4 }}>
          No dishes found matching "{debouncedQuery}"
        </Typography>
      )}

      {/* Dish Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(auto-fill, minmax(280px, 1fr))",
            md: "repeat(auto-fill, minmax(320px, 1fr))",
          },
          gap: 3,
        }}
      >
        {paginatedDishes.map((dish) => (
          <DishCard
            key={dish.id}
            dish={dish}
            getDishRank={getDishRank}
            handleRank={handleRank}
            getButtonVariant={getButtonVariant}
          />
        ))}
      </Box>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onChange={setPage}
          />
        </Box>
      )}
    </Box>
  );
};

export default VotingTab;
