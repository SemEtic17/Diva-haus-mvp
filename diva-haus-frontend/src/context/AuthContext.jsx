import { createContext, useState, useEffect } from 'react';
import { loginUser } from '../api';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    // This effect could be used to verify the token with the backend
    // and fetch user data. For now, we'll just decode it.
    if (token) {
      try {
        // In a real app, you'd verify the token with the backend
        // For simplicity, we'll decode it. Never trust the frontend!
        const decoded = JSON.parse(atob(token.split('.')[1]));
        // A simple check if token is expired
        if (decoded.exp * 1000 < Date.now()) {
            logout();
        } else {
            // You could fetch user data here if you store user id in token
            setUser({ token }); // Simplified user object
        }
      } catch (error) {
        logout();
      }
    }
  }, [token]);

  const login = async (email, password) => {
    try {
      const data = await loginUser({ email, password });
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser({ token: data.token }); // Simplified user object
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const setUserAndToken = (data) => {
    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUser({ token: data.token });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, token, setUserAndToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
