import React, { useState, useEffect, useContext } from "react";
import api from "../services/api";

const AuthContext = React.createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStoragedData() {
      const storagedUser = localStorage.getItem("@App:user");
      const storagedToken = localStorage.getItem("@App:token");

      if (storagedUser && storagedToken) {
        api.defaults.headers.Authorization = `Bearer ${storagedToken}`;
        setUser(JSON.parse(storagedUser));
      }
      setLoading(false);
    }
    loadStoragedData();
  }, []);

  async function login(username, password) {
    try {
      const response = await api.post("/api/users/login", {
        username,
        password,
      });
      const { user, token } = response.data;

      setUser(user);
      localStorage.setItem("@App:user", JSON.stringify(user));
      localStorage.setItem("@App:token", token);

      api.defaults.headers.Authorization = `Bearer ${token}`;
    } catch (error) {
      console.error("Error: ", error);
      throw new Error("Usuário ou senha inválidos.");
    }
  }

  function logout() {
    localStorage.removeItem("@App:user");
    localStorage.removeItem("@App:token");
    setUser(null);
    api.defaults.headers.Authorization = null;
  }

  return (
    <AuthContext.Provider
      value={{ signed: !!user, user, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}
