import { type FC } from "react";
import Login from "../components/Auth/Login";
import { Box, Container } from "@mui/material";

const LoginPage: FC = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(135deg, #0288D1 0%, #26C6DA 100%)",
      }}
    >
      <Container
        component="main"
        maxWidth="lg"
        sx={{
          flexGrow: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Container maxWidth="xs">
          <Login />
        </Container>
      </Container>
    </Box>
  );
};

export default LoginPage;
