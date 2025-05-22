import { AppBar, Toolbar, Avatar, Box, Button } from "@mui/material";
import { styled } from "@mui/system";

export const StyledAppBar = styled(AppBar)(() => ({
  background: "#0288D1",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
}));

export const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  padding: "0 16px",
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    gap: "8px",
    padding: "8px 16px",
  },
}));

export const StyledAvatar = styled(Avatar)(() => ({
  background: "#00C4B4",
  transition: "opacity 0.2s ease",
  "&:hover": {
    opacity: 0.9,
  },
}));

export const StyledNavBar = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: theme.palette.background.paper,
  borderRadius: "999px",
  padding: "8px",
  margin: "24px auto",
  maxWidth: "520px",
  gap: "8px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    borderRadius: "16px",
    padding: "12px",
    gap: "12px",
  },
}));

export const StyledNavButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "isActive",
})<{ isActive?: boolean }>(({ theme, isActive }) => ({
  borderRadius: "999px",
  textTransform: "none",
  fontFamily: '"Inter", sans-serif',
  fontWeight: 500,
  fontSize: "1rem",
  padding: "8px 20px",
  color: isActive ? "#fff" : theme.palette.text.primary,
  background: isActive
    ? "linear-gradient(to right, #0288D1, #26C6DA)"
    : "transparent",
  border: isActive ? "none" : `1px solid ${theme.palette.divider}`,
  transition: "all 0.3s ease",
  boxShadow: isActive ? "0 3px 10px rgba(0,0,0,0.15)" : "none",
  "&:hover": {
    background: isActive
      ? "linear-gradient(to right, #0277BD, #00ACC1)"
      : "rgba(2, 136, 209, 0.1)",
  },
  [theme.breakpoints.down("sm")]: {
    width: "100%",
    maxWidth: "240px",
  },
}));
