import React, { useState, type FC } from "react";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Avatar,
  Alert,
  Fade,
  Zoom,
  CssBaseline,
  styled,
  useTheme as useMuiTheme,
  CircularProgress,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";

const GradientBackground = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: theme.palette.mode === "light"
    ? "linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)"
    : "linear-gradient(135deg, #1e1e1e 0%, #121212 100%)",
  transition: "background 0.3s ease",
}));

const AnimatedPaper = motion(Paper);

const Login: FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { mode } = useTheme(); // Get current theme mode
  const muiTheme = useMuiTheme(); // Get the MUI theme object

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    if (!username || !password) {
      setError("Please enter both username and password");
      setIsSubmitting(false);
      return;
    }

    try {
      const success = await login(username, password);
      if (success) {
        navigate("/app");
      } else {
        setError("Invalid username or password");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <CssBaseline />
      <GradientBackground>
        <Container component="main" maxWidth="xs">
          <AnimatedPaper
            elevation={6}
            sx={{
              padding: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              borderRadius: 3,
              background: mode === "light"
                ? "rgba(255, 255, 255, 0.95)"
                : "rgba(30, 30, 30, 0.85)",
              backdropFilter: "blur(10px)",
              boxShadow: mode === "light"
                ? "0 8px 32px rgba(0, 0, 0, 0.1)"
                : "0 8px 32px rgba(0, 0, 0, 0.3)",
              border: mode === "light"
                ? "1px solid rgba(255, 255, 255, 0.2)"
                : "1px solid rgba(255, 255, 255, 0.05)",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Zoom in={true} style={{ transitionDelay: "100ms" }}>
              <Avatar
                sx={{
                  margin: 1,
                  bgcolor: "primary.main",
                  width: 60,
                  height: 60,
                }}
              >
                <LockOutlinedIcon fontSize="medium" />
              </Avatar>
            </Zoom>

            <Typography
              component="h1"
              variant="h5"
              sx={{
                mt: 1,
                fontWeight: 600,
                background: "linear-gradient(135deg, #0288D1 0%, #26C6DA 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Welcome Back
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ mt: 1 }}
            >
              Sign in to continue to Dish Ranking
            </Typography>

            {error && (
              <Fade in={!!error}>
                <Alert
                  severity="error"
                  sx={{ 
                    width: "100%", 
                    mt: 3, 
                    borderRadius: 2,
                    backgroundColor: mode === "light" 
                      ? "rgba(253, 237, 237, 0.95)" 
                      : "rgba(95, 33, 32, 0.9)",
                  }}
                >
                  {error}
                </Alert>
              </Fade>
            )}

            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ mt: 3, width: "100%" }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "& fieldset": {
                      borderColor: mode === "light" 
                        ? "rgba(0, 0, 0, 0.1)" 
                        : "rgba(255, 255, 255, 0.15)",
                    },
                    "&:hover fieldset": {
                      borderColor: "primary.main",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: muiTheme.palette.text.secondary,
                  },
                  "& .MuiInputBase-input": {
                    color: muiTheme.palette.text.primary,
                  },
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "& fieldset": {
                      borderColor: mode === "light" 
                        ? "rgba(0, 0, 0, 0.1)" 
                        : "rgba(255, 255, 255, 0.15)",
                    },
                    "&:hover fieldset": {
                      borderColor: "primary.main",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: muiTheme.palette.text.secondary,
                  },
                  "& .MuiInputBase-input": {
                    color: muiTheme.palette.text.primary,
                  },
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isSubmitting}
                sx={{
                  mt: 3,
                  mb: 2,
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600,
                  background: "linear-gradient(135deg, #0288D1 0%, #26C6DA 100%)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #0278D1 0%, #26C6DA 100%)"
                  },
                  "&.Mui-disabled": {
                    background: mode === "light"
                      ? "rgba(0, 0, 0, 0.12)"
                      : "rgba(255, 255, 255, 0.12)",
                    color: mode === "light"
                      ? "rgba(0, 0, 0, 0.26)"
                      : "rgba(255, 255, 255, 0.3)",
                  },
                }}
              >
                {isSubmitting ? <CircularProgress></CircularProgress> : "Sign In"}
              </Button>

              <Typography
                variant="body2"
                color="text.secondary"
                align="center"
                sx={{ mt: 2, fontSize: "0.8rem", opacity: 0.7 }}
              >
                Demo credentials: username "user1" / password "password1"
              </Typography>
            </Box>
          </AnimatedPaper>
        </Container>
      </GradientBackground>
    </>
  );
};

export default Login;