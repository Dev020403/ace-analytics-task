import "./App.css";
import LoginPage from "./pages/LoginPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { DishProvider } from "./context/DishContext";
import { ThemeProvider } from "./context/ThemeContext"; // Import our new ThemeProvider
import ProtectedRoute from "./components/Auth/ProtectedRoutes";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DishProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route element={<ProtectedRoute />}>
                <Route
                  path="/app"
                  element={
                    <DishProvider>
                      <Dashboard />
                    </DishProvider>
                  }
                />
              </Route>
            </Routes>
          </BrowserRouter>
        </DishProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;