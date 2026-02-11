// src/auth/AuthProvider.jsx
import { createContext, useState } from "react";
import axios from "../api/axios";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    return token && role ? { token, role } : null;
  });

  const [cartCount, setCartCount] = useState(0);

  const login = (token, role) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    setAuth({ token, role });
  };

  const logout = () => {
    localStorage.clear();
    setAuth(null);
    setCartCount(0);
  };

  // 🔑 single source of truth
  const refreshCartCount = async () => {
    if (!auth || auth.role !== "user") {
      setCartCount(0);
      return;
    }

    try {
      const res = await axios.get("/cart");
      setCartCount(res.data?.items?.length || 0);
    } catch {
      setCartCount(0);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        auth,
        login,
        logout,
        cartCount,
        setCartCount,
        refreshCartCount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;