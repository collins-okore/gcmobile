import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from './apiClient';
import apiUrls from './apiUrls';
import qs from 'qs';

// Types
interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  phone?: string;
  phoneCountryCode?: string;
  phoneCallingCode?: string;
  password: string;
}

interface AuthResponse {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    phoneCountryCode?: string;
    phoneCallingCode?: string;
  };
  jwt: string;
}

interface ProfileData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  phoneCountryCode?: string; // Country code like "KE", "US"
  phoneCallingCode?: string; // Calling code like "+254", "+27"
  resident?: {
    id: string;
    houseNumber: string;
    blockCourt: string;
    estate?: {
      id: string;
      name: string;
    };
  };
  role?: {
    id: string;
    name: string;
  };
  estateManager?: {
    id: string;
    name: string;
  };
}

interface PasswordChangeData {
  current_password: string;
  new_password: string;
}

interface ProfileResponse {
  avatarUrl: string | null;
  block: string;
  blocked: boolean;
  email: string;
  estateManager: {
    id: string;
    name: string;
  };
  firstName: string;
  id: string;
  lastLoginTime: string;
  lastName: string;
  phone: string;
  phoneCountryCode?: string;
  phoneCallingCode?: string;
  resident: {
    id: string;
    houseNumber: string;
    blockCourt: string;
    estate?: {
      id: string;
      name: string;
    };
  };
  role: {
    id: string;
    name: string;
  };
  securityGuard: {
    id: string;
    name: string;
    estate?: {
      id: string;
      name: string;
    };
  };
  createdAt: string;
  updatedAt: string;
}

// Auth service functions
const authService = {
  // Login user
  login: async (credentials: LoginCredentials) => {
    const response = await apiClient.post<AuthResponse>(
      apiUrls.AUTH_URLS.LOGIN,
      {
        identifier: credentials.email,
        password: credentials.password,
      },
    );
    // Store token and user in AsyncStorage
    await AsyncStorage.setItem('gc-connect-token', response.data?.jwt);
    await AsyncStorage.setItem(
      'gc-connect-user',
      JSON.stringify(response.data.user),
    );
    return response.data;
  },

  // Register new user
  register: async (userData: RegisterData) => {
    const response = await apiClient.post<AuthResponse>(
      apiUrls.AUTH_URLS.REGISTER,
      userData,
    );

    return response.data;
  },

  // Logout user
  logout: async () => {
    await AsyncStorage.removeItem('gc-connect-token');
    await AsyncStorage.removeItem('gc-connect-user');
  },

  // Get current user
  getCurrentUser: async () => {
    const userStr = await AsyncStorage.getItem('gc-connect-user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },

  // Check if user is authenticated
  isAuthenticated: async () => {
    const token = await AsyncStorage.getItem('gc-connect-token');
    return !!token;
  },

  // Get token
  getToken: async () => {
    return await AsyncStorage.getItem('gc-connect-token');
  },
  getAssignedEstate: async () => {
    const response = await apiClient.get(apiUrls.AUTH_URLS.GET_ASSIGNED_ESTATE);
    return response.data;
  },

  // Get user profile
  getProfile: async () => {
    const queryString = qs.stringify({
      populate: [
        'role',
        'estateManager',
        'resident',
        'resident.estate',
        'securityGuard',
        'securityGuard.estate',
      ],
    });
    const response = await apiClient.get<ProfileResponse>(
      apiUrls.AUTH_URLS.GET_PROFILE + `?${queryString}`,
    );

    return response.data;
  },

  // Update user profile
  updateProfile: async (profileData: ProfileData) => {
    const response = await apiClient.put(
      apiUrls.AUTH_URLS.UPDATE_PROFILE + `/${profileData.id}`,
      profileData,
    );

    // Update user in AsyncStorage if successful
    if (response.data) {
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        const updatedUser = {...currentUser, ...profileData};
        await AsyncStorage.setItem(
          'gc-connect-user',
          JSON.stringify(updatedUser),
        );
      }
    }

    return response.data;
  },

  // Change password
  changePassword: async (passwordData: PasswordChangeData) => {
    const response = await apiClient.put(
      apiUrls.AUTH_URLS.CHANGE_PASSWORD,
      passwordData,
    );
    return response.data;
  },
};

export default authService;
