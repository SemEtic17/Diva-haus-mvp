import { createContext, useState, useEffect } from 'react';
import { loginUser, API_BASE_URL } from '../api'; // NEW: Import API_BASE_URL
import { toast } from '../components/Toaster';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/status`, { credentials: 'include' }); // Add credentials: 'include'
      if (response.ok) {
        const data = await response.json();
        setIsAuthenticated(true);
        setUserInfo({ id: data._id, name: data.name, email: data.email });
      } else {
        setIsAuthenticated(false);
        setUserInfo(null);
      }
    } catch (error) {
      toast.error('Error checking authentication status.');
      setIsAuthenticated(false);
      setUserInfo(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const login = async (email, password) => {
    try {
      await loginUser({ email, password });
      await checkAuthStatus();
      toast.success('Logged in successfully!');
    } catch (error) {
      toast.error(error.message || 'Login failed.');
      setIsAuthenticated(false);
      setUserInfo(null);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, { method: 'POST', credentials: 'include' }); // Add credentials: 'include'
      setIsAuthenticated(false);
      setUserInfo(null);
      toast.info('Logged out.');
    } catch (error) {
      toast.error(error.message || 'Logout failed.');
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userInfo, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
