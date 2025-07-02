import { createContext, useEffect, useState } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);

  // Auto-login if token exists
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      axios.get('http://localhost:3000/api/v1/auth/me')
        .then((res) => {
          setUser(res.data.user); // Set user from response
        })
        .catch((err) => {
          console.error("Auto-login failed:", err);
          logout();
        });
    }
  }, [token]);

  // Email/password login
  const login = async (email, password) => {
    const res = await axios.post('http://localhost:3000/api/v1/auth/login', { email, password });

    if (!res.data?.token) throw new Error("Login failed");

    console.log("Login successful:", res.data);
    localStorage.setItem('token', res.data.token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
    setToken(res.data.token);
    setUser(res.data.user);
  };

  // Google login
  const loginWithGoogle = async (googleToken) => {
    const res = await axios.post('http://localhost:3000/api/v1/auth/login-google', {
      token: googleToken,
    });

    if (!res.data?.token) throw new Error("Google login failed");

    localStorage.setItem('token', res.data.token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
    setToken(res.data.token);
    setUser(res.data.user);
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
