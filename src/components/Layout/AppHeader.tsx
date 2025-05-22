import React from "react";
import { Typography, Box, Button } from "@mui/material";
import ThemeToggle from "../../UI/ThemeToggle";
import { StyledAppBar, StyledToolbar, StyledAvatar } from "./DashboardStyles";
import type { AuthContextType } from "../../types";

interface AppHeaderProps {
  currentUser: AuthContextType["currentUser"];
  onLogout: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ currentUser, onLogout }) => {
  const getUserInitials = () => {
    if (!currentUser || !currentUser.username) return "?";
    return currentUser.username.charAt(0).toUpperCase();
  };

  return (
    <StyledAppBar position="static">
      <StyledToolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{
            fontFamily: '"Poppins", sans-serif',
            fontWeight: 600,
            color: "#fff",
          }}
        >
          Dish Ranking App
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {currentUser && (
            <>
              <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
                <StyledAvatar sx={{ mr: 1 }}>{getUserInitials()}</StyledAvatar>
                <Typography
                  variant="body1"
                  sx={{
                    fontFamily: '"Inter", sans-serif',
                    fontWeight: 500,
                    color: "#fff",
                  }}
                >
                  {currentUser.username}
                  {currentUser.isAdmin && " (Admin)"}
                </Typography>
                <ThemeToggle sx={{ ml: 1 }} />
              </Box>
              <Button
                onClick={onLogout}
                sx={{
                  fontFamily: '"Inter", sans-serif',
                  textTransform: "none",
                  borderRadius: "6px",
                  padding: "6px 12px",
                  border: "1px solid rgba(255, 255, 255, 0.5)",
                  color: "#fff",
                  "&:hover": {
                    background: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                Logout
              </Button>
            </>
          )}
        </Box>
      </StyledToolbar>
    </StyledAppBar>
  );
};

export default AppHeader;
