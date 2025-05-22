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
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const GradientBackground = styled(Box)({
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const AnimatedPaper = motion(Paper);

const Login: FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { login } = useAuth();
  const navigate = useNavigate();

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
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)",
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
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Sign in to continue to Dish Ranking
            </Typography>

            {error && (
              <Fade in={!!error}>
                <Alert
                  severity="error"
                  sx={{ width: "100%", mt: 3, borderRadius: 2 }}
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
                      borderColor: "rgba(0, 0, 0, 0.1)",
                    },
                    "&:hover fieldset": {
                      borderColor: "primary.main",
                    },
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
                      borderColor: "rgba(0, 0, 0, 0.1)",
                    },
                    "&:hover fieldset": {
                      borderColor: "primary.main",
                    },
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
                }}
              >
                {isSubmitting ? "Signing In..." : "Sign In"}
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
