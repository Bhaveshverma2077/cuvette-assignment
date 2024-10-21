import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUserData(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserData = async (token) => {
    try {
      const response = await fetch(
        `http://${import.meta.env.VITE_API_URL}/user`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error(error);
      logout();
      window.location.href = "/signup";
    } finally {
      setLoading(false);
    }
  };

  const login = async (token) => {
    localStorage.setItem("token", token);
    return fetchUserData(token);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const value = { user, login, logout, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (redirect = true) => {
  const navigate = useNavigate();
  const context = useContext(AuthContext);
  useEffect(() => {
    if (localStorage.getItem("token")) return;
    if (redirect && !context.user) {
      navigate("/signup");
    }
  }, []);
  return context;
};
