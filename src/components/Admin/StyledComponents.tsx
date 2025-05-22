import { styled } from "@mui/material/styles";
import {
  TableContainer,
  TableHead,
  Avatar,
  Box,
  Card,
} from "@mui/material";

// Styled components
export const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[4],
  overflow: "hidden",
  marginBottom: theme.spacing(4),
}));

export const StyledTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  "& .MuiTableCell-head": {
    color: theme.palette.common.white,
    fontWeight: 600,
    fontSize: "0.95rem",
  },
}));

export const UserAvatar = styled(Avatar)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  width: 40,
  height: 40,
}));

export const DishesContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  gap: theme.spacing(2),
  marginTop: theme.spacing(2),
}));

export const DishCard = styled(Card)(({ theme }) => ({
  width: "100%",
  maxWidth: "300px",
  [theme.breakpoints.up("sm")]: {
    width: "calc(50% - 16px)",
  },
  [theme.breakpoints.up("md")]: {
    width: "calc(33.333% - 16px)",
  },
}));