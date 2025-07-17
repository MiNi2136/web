import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [userType, setUserType] = useState(localStorage.getItem("userType") || null);

  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");

    if (userType) localStorage.setItem("userType", userType);
    else localStorage.removeItem("userType");
  }, [token, userType]);

  return (
    <AuthContext.Provider value={{ token, setToken, userType, setUserType }}>
      {children}
    </AuthContext.Provider>
  );
};
