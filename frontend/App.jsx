import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from './components/auth/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Login from './components/auth/login';
import SignUp from "./components/auth/singup";
import ForgotPassword from "./components/auth/ForgotPassword";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsAuthenticated(false);
        return;
      }
  
      try {
        const response = await fetch("http://localhost:3001/api/auth/verify-token", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
  
        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          const data = await response.json();
          if (data.error === "Token expired" || data.error === "Invalid token") {
            setIsAuthenticated(false);
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            localStorage.removeItem("user_id");
          }
        }
      } catch (error) {
        console.error("Token verification failed:", error);
        // Prevents unnecessary logout on network errors
        setIsAuthenticated(true);
      }
    };
  
    verifyToken();
  }, []);
  

  return (
    <Router>
      <Routes>
        {/* Prevents authenticated users from accessing login/signup */}
        <Route path="/" element={isAuthenticated ? <Navigate to="/Dashboard" /> : <Login />} />
        <Route path="/Login" element={isAuthenticated ? <Navigate to="/Dashboard" /> : <Login />} />
        <Route path="/SignUp" element={isAuthenticated ? <Navigate to="/SignUp" /> : <SignUp />} />
        <Route path="/forgotPassword" element={isAuthenticated ? <Navigate to="/forgotPassword" /> : <ForgotPassword />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/Dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
