import React, { useContext, useMemo } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";
import { DishContext } from "../../context/DishContext";
import { AuthContext } from "../../context/AuthContext";
import {
  StyledTableContainer,
  StyledTableHead,
  StyledTableRow,
  RankCell,
  StyledImage,
  UserRankChip,
} from "./ResultsTabStyles";

const ResultsTab: React.FC = () => {
  const { calculateResults, userSelections } = useContext(DishContext);
  const { currentUser } = useContext(AuthContext);

  // Use useMemo to recalculate when selections change
  const rankedDishes = useMemo(() => {
    return calculateResults();
  }, [calculateResults, userSelections]);

  return (
    <Box sx={{ px: { xs: 2, sm: 4 }, py: 5, maxWidth: "1400px", mx: "auto" }}>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          fontFamily: '"Inter", sans-serif',
          color: "#0288D1",
          mb: 4,
        }}
      >
        Dish Rankings Results
      </Typography>

      <StyledTableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="Dish rankings table">
          <StyledTableHead>
            <TableRow>
              <TableCell>Rank</TableCell>
              <TableCell>Dish</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Total Points</TableCell>
              {currentUser && <TableCell>Your Ranking</TableCell>}
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {rankedDishes.map((dish, index) => (
              <StyledTableRow
                key={dish.id}
                sx={{
                  backgroundColor: dish.userRank
                    ? "rgba(2, 136, 209, 0.05)"
                    : "transparent",
                }}
              >
                <RankCell>#{index + 1}</RankCell>

                <TableCell>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: 600, fontFamily: '"Inter", sans-serif' }}
                  >
                    {dish.dishName}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontFamily: '"Inter", sans-serif' }}
                  >
                    {dish.description.length > 100
                      ? `${dish.description.slice(0, 100)}...`
                      : dish.description}
                  </Typography>
                </TableCell>

                <TableCell>
                  <StyledImage src={dish.image} alt={dish.dishName} />
                </TableCell>

                <TableCell>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 600,
                      fontFamily: '"Inter", sans-serif',
                    }}
                  >
                    {dish.points}
                  </Typography>
                </TableCell>

                {currentUser && (
                  <TableCell>
                    {dish.userRank ? (
                      <UserRankChip
                        label={`#${dish.userRank} (${dish.userPoints} pts)`}
                        rank={dish.userRank}
                      />
                    ) : (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontFamily: '"Inter", sans-serif' }}
                      >
                        Not Ranked
                      </Typography>
                    )}
                  </TableCell>
                )}
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </StyledTableContainer>

      <Box sx={{ mt: 3, textAlign: "center" }}>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontFamily: '"Inter", sans-serif' }}
        >
          Ranking System: 1st place = 30 points, 2nd = 20 points, 3rd = 10
        </Typography>
      </Box>
    </Box>
  );
};

export default ResultsTab;
