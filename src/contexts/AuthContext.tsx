import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authService from '../services/authService';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  phoneCountryCode?: string;
  phoneCallingCode?: string;
  role?: {
    id?: string;
    name: string;
  };
  // Extended profile data
  avatarUrl?: string | null;
  houseNumber?: string;
  blockCourt?: string;
  estateName?: string;
  resident?: {
    id: string;
    houseNumber: string;
    blockCourt: string;
  };
  blocked?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface AuthContextValue {
  // State
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;

  // Actions
  login: (credentials: {email: string; password: string}) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  loadFullProfile: () => Promise<void>;
  refreshAuthState: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Derived state
  const isAuthenticated = !!(user && token);

  // Clear auth data from state and AsyncStorage
  const clearAuthData = useCallback(async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem('gc-connect-user'),
        AsyncStorage.removeItem('gc-connect-token'),
      ]);
      setUser(null);
      setToken(null);
      setError(null);
    } catch (err) {
      console.error('Error clearing auth data:', err);
      setError('Failed to clear authentication data');
    }
  }, []);

  // Load user and token from AsyncStorage
  const loadAuthData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [storedUser, storedToken] = await Promise.all([
        AsyncStorage.getItem('gc-connect-user'),
        AsyncStorage.getItem('gc-connect-token'),
      ]);

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }

      if (storedToken) {
        setToken(storedToken);
      }
    } catch (err) {
      console.error('Error loading auth data:', err);
      setError('Failed to load authentication data');
      // Clear potentially corrupted data
      await clearAuthData();
    } finally {
      setIsLoading(false);
    }
  }, [clearAuthData]);

  // Login function
  const login = useCallback(
    async (credentials: {email: string; password: string}) => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await authService.login(credentials);

        // Update state immediately with basic user data
        setUser(response.user);
        setToken(response.jwt);

        // Load full profile data in the background
        try {
          const profileData = await authService.getProfile();

          // Transform and merge profile data
          const transformedUser: User = {
            id: profileData.id,
            firstName: profileData.firstName,
            lastName: profileData.lastName,
            email: profileData.email,
            phone: profileData.phone,
            role: {
              id: profileData.role?.id,
              name: profileData.role?.name,
            },
            // Extended profile data
            avatarUrl: profileData.avatarUrl,
            houseNumber: profileData?.resident?.houseNumber || '',
            blockCourt: profileData?.resident?.blockCourt || '',
            estateName:
              profileData?.resident?.estate?.name ||
              profileData?.securityGuard?.estate?.name ||
              'Unknown',
            resident: profileData.resident,
            blocked: profileData.blocked,
            createdAt: profileData.createdAt,
            updatedAt: profileData.updatedAt,
          };

          // Update with full profile data
          setUser(transformedUser);
          await AsyncStorage.setItem(
            'gc-connect-user',
            JSON.stringify(transformedUser),
          );
        } catch (profileErr) {
          console.warn(
            'AuthContext: Failed to load full profile after login:',
            profileErr,
          );
          // Continue with basic user data if profile loading fails
        }
      } catch (err: any) {
        console.error('Login error:', err);

        // Handle different error types
        let errorMessage = 'An unexpected error occurred. Please try again.';

        if (err.response) {
          if (err.response.status === 401) {
            errorMessage = 'Invalid email or password. Please try again.';
          } else if (err.response.status === 422) {
            errorMessage = 'Please check your email and password format.';
          } else if (err.response.status >= 500) {
            errorMessage = 'Server error. Please try again later.';
          } else if (err.response.data?.message) {
            errorMessage = err.response.data.message;
          }
        } else if (err.request) {
          errorMessage =
            'Network error. Please check your internet connection.';
        }

        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  // Refresh user data from the server (basic profile)
  const refreshUser = useCallback(async () => {
    if (!token) {
      setError('No authentication token available');
      return;
    }

    try {
      setError(null);
      const userData = await authService.getProfile();

      // Update user in state
      setUser(userData);

      // Update user in AsyncStorage
      await AsyncStorage.setItem('gc-connect-user', JSON.stringify(userData));
    } catch (err: any) {
      console.error('Error refreshing user data:', err);

      if (err.response?.status === 401) {
        // Token is invalid, clear auth data
        await clearAuthData();
        setError('Session expired. Please log in again.');
      } else {
        setError('Failed to refresh user data');
      }
    }
  }, [token, clearAuthData]);

  // Load full profile with extended data
  const loadFullProfile = useCallback(async () => {
    if (!token) {
      setError('No authentication token available');
      return;
    }

    try {
      setError(null);
      const profileData = await authService.getProfile();

      // Transform the profile data to match our User interface
      const transformedUser: User = {
        id: profileData.id,
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        email: profileData.email,
        phone: profileData.phone,
        role: {
          id: profileData.role?.id,
          name: profileData.role?.name || 'Unknown',
        },
        // Extended profile data
        avatarUrl: profileData.avatarUrl,
        houseNumber: profileData?.resident?.houseNumber || '',
        blockCourt: profileData?.resident?.blockCourt || '',
        estateName:
          profileData?.resident?.estate?.name ||
          profileData?.securityGuard?.estate?.name ||
          'Unknown',
        resident: profileData.resident,
        blocked: profileData.blocked,
        createdAt: profileData.createdAt,
        updatedAt: profileData.updatedAt,
      };

      // Update user in state
      setUser(transformedUser);

      // Update user in AsyncStorage
      await AsyncStorage.setItem(
        'gc-connect-user',
        JSON.stringify(transformedUser),
      );
    } catch (err: any) {
      console.error('Error loading full profile:', err);

      if (err.response?.status === 401) {
        // Token is invalid, clear auth data
        await clearAuthData();
        setError('Session expired. Please log in again.');
      } else {
        setError('Failed to load profile data');
      }
    }
  }, [token, clearAuthData]);

  // Refresh auth state from storage
  const refreshAuthState = useCallback(async () => {
    try {
      setError(null);

      const [storedUser, storedToken] = await Promise.all([
        AsyncStorage.getItem('gc-connect-user'),
        AsyncStorage.getItem('gc-connect-token'),
      ]);

      if (storedUser && storedToken) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setToken(storedToken);
      } else {
        setUser(null);
        setToken(null);
      }
    } catch (err) {
      console.error('Error refreshing auth state:', err);
      setError('Failed to refresh authentication state');
    }
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      await authService.logout();
      await clearAuthData();
    } catch (err) {
      console.error('Error during logout:', err);
      // Still clear local data even if server logout fails
      await clearAuthData();
      setError('Logout completed, but there was an issue with the server');
    } finally {
      setIsLoading(false);
    }
  }, [clearAuthData]);

  // Clear error function
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Load auth data on mount
  useEffect(() => {
    loadAuthData();
  }, [loadAuthData]);

  // Listen for storage changes (polling mechanism)
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const currentToken = await AsyncStorage.getItem('gc-connect-token');
        const currentUser = await AsyncStorage.getItem('gc-connect-user');

        // Check if auth state has changed externally
        const hasTokenChanged = (currentToken || null) !== token;
        const hasUserChanged =
          currentUser !== (user ? JSON.stringify(user) : null);

        if (hasTokenChanged || hasUserChanged) {
          await refreshAuthState();
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
      }
    };

    // Check every 5 seconds
    const interval = setInterval(checkAuthStatus, 5000);

    return () => clearInterval(interval);
  }, [token, user, refreshAuthState]);

  const value: AuthContextValue = {
    // State
    user,
    token,
    isLoading,
    isAuthenticated,
    error,

    // Actions
    login,
    logout,
    refreshUser,
    loadFullProfile,
    refreshAuthState,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
