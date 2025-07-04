import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from './apiClient';
import apiUrls from './apiUrls';

// Types
interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
}

interface AuthResponse {
  user: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    role: {
      name: string;
    };
  };
  access_token: string;
}

interface ProfileData {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  phone_country_code?: string; // Country code like "KE", "US"
  phone_calling_code?: string; // Calling code like "+254", "+27"
}

interface PasswordChangeData {
  current_password: string;
  new_password: string;
}

interface ProfileResponse {
  avatar_url: string | null;
  block: string;
  blocked: boolean;
  created_at: string;
  email: string;
  estateManager: string[];
  estate_name: string;
  first_name: string;
  house_number: string;
  id: string;
  last_login: string;
  last_name: string;
  phone: string;
  phone_country_code?: string;
  phone_calling_code?: string;
  resident: {
    id: string;
    house_number: string;
    block_court: string;
  };
  role: {
    id: string;
    name: string;
  };
  role_id: string;
  securityGuard: null;
  updated_at: string;
}

// Auth service functions
const authService = {
  // Login user
  login: async (credentials: LoginCredentials) => {
    const response = await apiClient.post<AuthResponse>(
      apiUrls.AUTH_URLS.LOGIN,
      credentials,
    );
    // Store token and user in AsyncStorage
    await AsyncStorage.setItem('gc-connect-token', response.data?.access_token);
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
    const response = await apiClient.get<ProfileResponse>(
      apiUrls.AUTH_URLS.GET_PROFILE,
    );
    return response.data;
  },

  // Update user profile
  updateProfile: async (profileData: ProfileData) => {
    const response = await apiClient.put(
      apiUrls.AUTH_URLS.GET_PROFILE,
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
