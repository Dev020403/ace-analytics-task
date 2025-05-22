import {
    TableContainer,
    TableHead,
    TableRow,
    TableCell,
    Chip,
    type TableContainerProps,
  } from "@mui/material";
  import { styled } from "@mui/system";
  
  // Styled Components for ResultsTab
  export const StyledTableContainer = styled(TableContainer)<TableContainerProps>(
    ({ theme }) => ({
      borderRadius: "16px",
      backgroundColor: theme.palette.background.paper,
      overflowX: "auto",
      "&::-webkit-scrollbar": {
        height: 8,
      },
      "&::-webkit-scrollbar-thumb": {
        backgroundColor: "#0288D1",
        borderRadius: 4,
      },
    })
  );
  
  export const StyledTableHead = styled(TableHead)(() => ({
    backgroundColor: "#0288D1",
    "& .MuiTableCell-root": {
      color: "#fff",
      fontWeight: 600,
      fontFamily: '"Inter", sans-serif',
      fontSize: "1rem",
      padding: "16px",
    },
  }));
  
  export const StyledTableRow = styled(TableRow)(({ theme }) => ({
    transition: "background 0.3s ease",
    "&:hover": {
      backgroundColor:
        theme.palette.mode === "dark"
          ? "rgba(255, 255, 255, 0.05)"
          : "rgba(0, 0, 0, 0.035)",
    },
    "& .MuiTableCell-root": {
      padding: theme.spacing(2),
      borderBottom: `1px solid ${theme.palette.divider}`,
    },
  }));
  
  export const RankCell = styled(TableCell)(({ theme }) => ({
    fontWeight: 700,
    fontSize: "1.1rem",
    color: theme.palette.primary.main,
    fontFamily: '"Inter", sans-serif',
  }));
  
  export const StyledImage = styled("img")(({ theme }) => ({
    width: 85,
    height: 60,
    objectFit: "cover",
    borderRadius: 8,
    [theme.breakpoints.down("sm")]: {
      width: 65,
      height: 45,
    },
  }));
  
  export const UserRankChip = styled(Chip, {
    shouldForwardProp: (prop) => prop !== "rank",
  })<{ rank?: number }>(
    ({ rank }) => ({
      fontWeight: "bold",
      fontFamily: '"Inter", sans-serif',
      borderRadius: 8,
      color: "#fff",
      backgroundColor:
        rank === 1
          ? "#FFB300"
          : rank === 2
          ? "#90A4AE"
          : rank === 3
          ? "#A1887F"
          : "#4DD0E1",
      padding: "4px 8px",
    })
  );