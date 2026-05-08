import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { authAPI } from '../services/api';
import { storage } from '../utils/storage';

interface User {
  email: string;
  name?: string;
  full_name?: string;
  username?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; user?: User }>;
  register: (userData: any) => Promise<{ success: boolean; error?: string; user?: User }>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  // Check for stored auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await storage.getItem('authToken');
        const userData = await storage.getItem('userData');
        
        if (token && userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Auth check error:', error);
      }
    };
    
    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string; user?: User }> => {
    setLoading(true);
    try {
      const response = await authAPI.login({ email, password });
      
      if (response.access_token) {
        const userData: User = {
          email: response.user?.email || email,
          name: response.user?.full_name || response.user?.name,
          full_name: response.user?.full_name,
          username: response.user?.username,
          role: response.user?.role || 'user',
        };
        
        setUser(userData);
        await storage.setItem('authToken', response.access_token);
        await storage.setItem('userData', JSON.stringify(userData));
        setLoading(false);
        
        return { success: true, user: userData };
      }
      
      setLoading(false);
      return { success: false, error: 'Invalid credentials' };
    } catch (error: any) {
      console.error('Login error:', error);
      setLoading(false);
      return { 
        success: false, 
        error: error.message || 'Login failed. Please check your credentials and try again.' 
      };
    }
  };

  const register = async (userData: any): Promise<{ success: boolean; error?: string; user?: User }> => {
    setLoading(true);
    try {
      const response = await authAPI.register(userData);
      
      if (response.access_token) {
        const newUser: User = {
          email: response.user?.email || userData.email,
          name: response.user?.full_name || userData.full_name,
          full_name: response.user?.full_name || userData.full_name,
          username: response.user?.username || userData.username,
          role: response.user?.role || userData.role || 'user',
        };
        
        setUser(newUser);
        await storage.setItem('authToken', response.access_token);
        await storage.setItem('userData', JSON.stringify(newUser));
        setLoading(false);
        
        return { success: true, user: newUser };
      }
      
      setLoading(false);
      return { success: false, error: 'Registration failed' };
    } catch (error: any) {
      console.error('Registration error:', error);
      setLoading(false);
      return { 
        success: false, 
        error: error.message || 'Registration failed. Please try again.' 
      };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
      setUser(null);
      await storage.removeItem('authToken');
      await storage.removeItem('userData');
    } catch (error) {
      console.error('Logout error:', error);
      // Clear local state anyway
      setUser(null);
      await storage.removeItem('authToken');
      await storage.removeItem('userData');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
