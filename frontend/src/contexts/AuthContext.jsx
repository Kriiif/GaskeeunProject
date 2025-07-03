import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

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
    try {
      const res = await axios.post('http://localhost:3000/api/v1/auth/login', { email, password });

      if (!res.data?.token) throw new Error("Login failed");

      console.log("Login successful:", res.data);
      localStorage.setItem('token', res.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      setToken(res.data.token);
      setUser(res.data.user);
    } catch (error) {
      // Extract error message from response
      const errorMessage = error.response?.data?.message || error.message || "Login failed";
      throw new Error(errorMessage);
    }
  };

  // Google login
  const loginWithGoogle = async (googleToken) => {
    try {
      const res = await axios.post('http://localhost:3000/api/v1/auth/login-google', {
        token: googleToken,
      });

      if (!res.data?.token) throw new Error("Google login failed");

      localStorage.setItem('token', res.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      setToken(res.data.token);
      setUser(res.data.user);
    } catch (error) {
      // Extract error message from response
      const errorMessage = error.response?.data?.message || error.message || "Google login failed";
      throw new Error(errorMessage);
    }
  };

  // Signup
  const signup = async (signupData) => {
    try {
      const res = await axios.post('http://localhost:3000/api/v1/auth/signup', signupData);

      if (!res.data?.token) throw new Error("Signup failed");

      console.log("Signup successful:", res.data);
      localStorage.setItem('token', res.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      setToken(res.data.token);
      setUser(res.data.user);
    } catch (error) {
      // Extract error message from response
      const errorMessage = error.response?.data?.message || error.message || "Signup failed";
      throw new Error(errorMessage);
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      const res = await axios.put('http://localhost:3000/api/v1/users/profile', profileData);
      
      if (res.data?.success) {
        setUser(res.data.data); // Update user state with new data
        return res.data;
      }
      throw new Error("Profile update failed");
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Profile update failed";
      throw new Error(errorMessage);
    }
  };

  // Change password
  const changePassword = async (passwordData) => {
    try {
      const res = await axios.put('http://localhost:3000/api/v1/users/change-password', passwordData);
      
      if (res.data?.success) {
        return res.data;
      }
      throw new Error("Password change failed");
    } catch (error) {
      // Extract error message from response
      const errorMessage = error.response?.data?.message || error.message || "Password change failed";
      throw new Error(errorMessage);
    }
  };

  const value = {
    user,
    token,
    login,
    loginWithGoogle,
    signup,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
