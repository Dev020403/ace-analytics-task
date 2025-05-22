import React, { type FC } from "react";
import {
  Pagination as MuiPagination,
  styled,
  Box,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { motion } from "framer-motion";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onChange: (page: number) => void;
  siblingCount?: number;
  boundaryCount?: number;
}

// Completely redesigned pagination with custom styling
const StyledPagination = styled(MuiPagination)(({ theme }) => ({
  "& .MuiPaginationItem-root": {
    fontSize: "1rem",
    fontWeight: 600,
    margin: "0 4px",
    minWidth: "40px",
    height: "40px",
    borderRadius: "12px", // Square-ish look instead of circles
    transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    color: "#0288D1",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    "&:hover": {
      backgroundColor: "rgba(2, 136, 209, 0.1)",
      transform: "translateY(-2px)",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      borderColor: "rgba(2, 136, 209, 0.3)",
    },
    [theme.breakpoints.down("sm")]: {
      minWidth: "36px",
      height: "36px",
      fontSize: "0.9rem",
      margin: "0 2px",
    },
    [theme.breakpoints.down("xs")]: {
      minWidth: "32px",
      height: "32px",
      fontSize: "0.8rem",
      margin: "0 1px",
    },
  },
  "& .MuiPaginationItem-page.Mui-selected": {
    background: "linear-gradient(135deg, #0288D1, #00C4B4)",
    color: "#fff",
    fontWeight: 700,
    boxShadow: "0 4px 12px rgba(2, 136, 209, 0.4)",
    border: "none",
    transform: "scale(1.05)",
    "&:hover": {
      background: "linear-gradient(135deg, #0277BD, #00B7A8)",
      boxShadow: "0 6px 16px rgba(2, 136, 209, 0.5)",
    },
  },
  "& .MuiPaginationItem-ellipsis": {
    border: "none",
    background: "transparent",
    color: "rgba(255, 255, 255, 0.5)",
  },
  "& .MuiPaginationItem-previousNext, & .MuiPaginationItem-firstLast": {
    fontWeight: "bold",
    color: "#0288D1",
    border: "1px solid rgba(2, 136, 209, 0.2)",
    "&:hover": {
      backgroundColor: "rgba(2, 136, 209, 0.1)",
    },
    "&.Mui-disabled": {
      opacity: 0.3,
      color: "rgba(255, 255, 255, 0.3)",
      border: "1px solid rgba(255, 255, 255, 0.1)",
    },
  },
}));

const Pagination: FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onChange,
  siblingCount = 1,
  boundaryCount = 1,
}) => {
  const handleChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    onChange(value);
  };
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isExtraSmall = useMediaQuery("(max-width:400px)");
  
  // Adjust sibling and boundary counts for smaller screens
  const responsiveSiblingCount = isExtraSmall ? 1 : isMobile ? 0 : siblingCount;
  const responsiveBoundaryCount = isExtraSmall ? 0 : isMobile ? 1 : boundaryCount;
  
  // Custom page number display
  const PageIndicator = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      key={currentPage} // This makes it re-animate when page changes
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Typography
        sx={{
          fontFamily: '"Inter", sans-serif',
          fontSize: { xs: "0.85rem", sm: "0.95rem" },
          fontWeight: 500,
          color: theme.palette.text.primary, // Use theme-aware text color
          letterSpacing: "0.02em",
          padding: { xs: "6px 10px", sm: "8px 12px" },
          borderRadius: "8px",
          background:
            theme.palette.mode === "light"
              ? "rgba(0, 0, 0, 0.03)"
              : "rgba(255, 255, 255, 0.03)", // Conditional background
          border:
            theme.palette.mode === "light"
              ? "1px solid rgba(0, 0, 0, 0.08)"
              : "1px solid rgba(255, 255, 255, 0.08)", // Conditional border
          marginBottom: { xs: 1, sm: 2 },
          marginTop: { xs: 0.5, sm: 1 },
          textAlign: "center",
        }}
      >
        Page <b>{currentPage}</b> of <b>{totalPages}</b>
      </Typography>
    </motion.div>
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mt: { xs: 2, sm: 3, md: 4 },
        py: { xs: 2, sm: 3 },
        px: { xs: 0.5, sm: 1 },
      }}
    >
      <PageIndicator />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <StyledPagination
          count={totalPages}
          page={currentPage}
          onChange={handleChange}
          variant="outlined"
          shape="rounded"
          size={isMobile ? "medium" : "large"}
          siblingCount={responsiveSiblingCount}
          boundaryCount={responsiveBoundaryCount}
          showFirstButton={!isExtraSmall}
          showLastButton={!isExtraSmall}
          sx={{
            "& .MuiPagination-ul": {
              gap: { xs: "2px", sm: "4px", md: "6px" },
              flexWrap: "nowrap",
              justifyContent: "center",
            },
          }}
        />
      </motion.div>
    </Box>
  );
};

export default Pagination;