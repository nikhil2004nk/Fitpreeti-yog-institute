import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authService } from '../services/auth';
import type { User, RegisterData, LoginData } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Use silent method to avoid redirecting on initial load
        const userData = await authService.getProfileSilent();
        setUser(userData);
      } catch (error) {
        // User is not authenticated
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (data: LoginData) => {
    try {
      const response = await authService.login(data.phone, data.pin);
      // Handle nested response structure: response.data.user or response.data.data.user
      let user: User | undefined;
      
      if (response.data) {
        // Check nested structure: response.data.data.user
        if (response.data.data && typeof response.data.data === 'object' && 'user' in response.data.data) {
          user = response.data.data.user as User | undefined;
        }
        // Check direct: response.data.user
        if (!user && 'user' in response.data) {
          user = response.data.user as User | undefined;
        }
      }
      
      if (user) {
        setUser(user);
      } else {
        // If user data not in response, fetch profile
        const userData = await authService.getProfile();
        setUser(userData);
      }
    } catch (error) {
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      await authService.register(data);
      // After registration, automatically login
      await login({ phone: data.phone, pin: data.pin });
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      // Even if logout fails on server, clear local state
      setUser(null);
      throw error;
    }
  };

  const refreshUser = async () => {
    try {
      const userData = await authService.getProfile();
      setUser(userData);
    } catch (error) {
      setUser(null);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

