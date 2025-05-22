import { styled } from "@mui/material/styles";
import { Card, Chip, Button, Alert, Box, Typography } from "@mui/material";

// Custom Styled Components
export const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  borderRadius: "16px",
  overflow: "hidden",
  background: "rgba(255, 255, 255, 0.1)", // Glassmorphism effect
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: theme.breakpoints.down("sm") ? "none" : "translateY(-8px)",
    boxShadow: "0 8px 40px rgba(0, 0, 0, 0.2)",
  },
}));

export const StyledChip = styled(Chip)(({ theme }) => ({
  position: "absolute",
  top: theme.breakpoints.down("sm") ? 8 : 12,
  right: theme.breakpoints.down("sm") ? 8 : 12,
  zIndex: 1,
  fontWeight: "bold",
  background: "linear-gradient(45deg, #00C4B4, #0288D1)",
  color: "#fff",
  padding: theme.breakpoints.down("sm") ? "2px 6px" : "4px 8px",
  fontSize: theme.breakpoints.down("sm") ? theme.typography.caption.fontSize : theme.typography.body2.fontSize,
  borderRadius: "12px",
  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
  animation: "bounce 0.3s ease",
  "@keyframes bounce": {
    "0%": { transform: "scale(1)" },
    "50%": { transform: "scale(1.2)" },
    "100%": { transform: "scale(1)" },
  },
}));

export const StyledButton = styled(Button)(({ theme, variant }) => ({
  borderRadius: "8px",
  padding: theme.breakpoints.down("sm") ? "6px 12px" : "8px 16px",
  fontSize: theme.breakpoints.down("sm") ? "0.8rem" : "0.875rem",
  fontWeight: 600,
  textTransform: "none",
  background:
    variant === "contained"
      ? "linear-gradient(45deg, #0288D1, #00C4B4)"
      : "transparent",
  color: variant === "contained" ? "#fff" : theme.palette.text.primary,
  border: `1px solid ${theme.palette.divider}`,
  transition: "all 0.3s ease",
  "&:hover": {
    background:
      variant === "contained"
        ? "linear-gradient(45deg, #0277BD, #00B7A8)"
        : "rgba(0, 188, 212, 0.1)",
    transform: theme.breakpoints.down("sm") ? "scale(1.02)" : "scale(1.05)",
  },
  position: "relative",
  overflow: "hidden",
  "&:after": {
    content: '""',
    position: "absolute",
    width: "100px",
    height: "100px",
    background: "radial-gradient(circle, rgba(255,255,255,0.3) 10%, transparent 10%)",
    transform: "scale(0)",
    transition: "transform 0.3s ease",
    top: "50%",
    left: "50%",
    pointerEvents: "none",
  },
  "&:active:after": {
    transform: "scale(2)",
    transition: "transform 0.1s ease",
  },
}));

export const StyledAlert = styled(Alert)(({ theme }) => ({
  borderRadius: "12px",
  background: "linear-gradient(45deg, #00C4B4, #0288D1)",
  color: "#fff",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
  animation: "fadeIn 0.5s ease",
  padding: theme.breakpoints.down("sm") ? "8px 12px" : "10px 16px",
  fontSize: theme.breakpoints.down("sm") ? "0.8rem" : "0.875rem",
  "@keyframes fadeIn": {
    from: { opacity: 0, transform: "translateY(20px)" },
    to: { opacity: 1, transform: "translateY(0)" },
  },
}));

export const PageTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontFamily: '"Poppins", sans-serif',
  background: "linear-gradient(45deg, #0288D1, #00C4B4)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  fontSize: theme.breakpoints.down("sm") ? "1.75rem" : "3rem",
  lineHeight: theme.breakpoints.down("sm") ? 1.3 : 1.2,
  marginBottom: theme.breakpoints.down("sm") ? theme.spacing(2) : 0,
}));

export const ButtonContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: 1,
  flexWrap: "wrap",
  justifyContent: theme.breakpoints.down("sm") ? "center" : "flex-start",
}));