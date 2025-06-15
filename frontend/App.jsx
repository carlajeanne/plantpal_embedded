import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from './components/auth/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Login from './components/auth/login';
import SignUp from "./components/auth/singup";
import ForgotPassword from "./components/auth/ForgotPassword";




function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Listen for storage events to detect sign-out from other components
    useEffect(() => {
        const handleStorageChange = () => {
            const token = localStorage.getItem("token");
            setIsAuthenticated(!!token);
        };

        window.addEventListener("storage", handleStorageChange);
        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    useEffect(() => {
        const verifyToken = async () => {
            setIsLoading(true);
            const token = localStorage.getItem("token");
            
            if (!token) {
                setIsAuthenticated(false);
                setIsLoading(false);
                return;
            }
    
            try {
              const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/verify-token`, {
                method: "POST",
                headers: {
                  "Authorization": `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              });
    
                if (response.ok) {
                    setIsAuthenticated(true);
                } else {
                    const data = await response.json();
                    if (data.error === "Token expired" || data.error === "Invalid token") {
                        setIsAuthenticated(false);
                        localStorage.removeItem("token");
                        localStorage.removeItem("user_id");
                    }
                }
            } catch (error) {
                console.error("Token verification failed:", error);
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        };
    
        verifyToken();
    }, []); 
    
    // Show a loading state while auth is being checked
    if (isLoading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

  

  return (
    <Router>
      <Routes>
        {/* Prevents authenticated users from accessing login/signup */}
        <Route path="/" element={isAuthenticated ? <Navigate to="/Dashboard" /> : <Login />} />
        <Route path="/Login" element={isAuthenticated ? <Navigate to="/Dashboard" /> : <Login />} />
        <Route path="/SignUp" element={isAuthenticated ? <Navigate to="/Dashboard" /> : <SignUp />} />
        <Route path="/forgotPassword" element={isAuthenticated ? <Navigate to="/Dashboard" /> : <ForgotPassword />} />


        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/Dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
