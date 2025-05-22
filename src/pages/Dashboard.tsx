import React, { useContext, useState } from "react";
import { Box, Container, Typography, useTheme } from "@mui/material";
import { DishContext } from "../context/DishContext";
import { AuthContext } from "../context/AuthContext";
import VotingTab from "../components/Tabs/VotingTab";
import ResultsTab from "../components/Tabs/ResultsTab";
import AdminPanel from "../components/Tabs/AdminPanel";
import { useNavigate } from "react-router-dom";
import Loader from "../UI/Loader";
import AppHeader from "../components/Layout/AppHeader";
import Navigation from "../components/Layout/Navigation";
import TabPanel from "../components/Layout/TabPanel";

const Dashboard: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const { currentUser, logout } = useContext(AuthContext);
  const { loading, error } = useContext(DishContext);
  const navigate = useNavigate();
  const theme = useTheme();

  const handleTabChange = (newValue: number) => {
    setTabValue(newValue);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <Container>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <Typography
            variant="h5"
            color="error"
            sx={{ fontFamily: '"Inter", sans-serif' }}
          >
            {error}
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, bgcolor: theme.palette.background.default }}>
      {/* App header with user info and logout */}
      <AppHeader currentUser={currentUser} onLogout={handleLogout} />

      {/* Navigation */}
      <Navigation
        tabValue={tabValue}
        isAdmin={!!currentUser?.isAdmin}
        onTabChange={handleTabChange}
      />

      {/* Tab panels */}
      <TabPanel value={tabValue} index={0}>
        <VotingTab />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <ResultsTab />
      </TabPanel>
      {currentUser?.isAdmin && (
        <TabPanel value={tabValue} index={2}>
          <AdminPanel />
        </TabPanel>
      )}
    </Box>
  );
};

export default Dashboard;
