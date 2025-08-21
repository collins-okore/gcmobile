import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import {Platform} from 'react-native';

// Get the correct base URL based on platform
const getBaseURL = () => {
  if (process.env.API_BASE_URL) {
    return process.env.API_BASE_URL; // Production/custom environment
  }
  // return 'https://a5e2a068b62d.ngrok-free.app/api';
  return 'https://api.gateconnect.io/api';
  // return 'http://192.168.100.44:1337/api';

  // Development URLs
  // if (Platform.OS === 'android') {
  //   return 'http://10.0.2.2:1337/api'; // Android emulator
  // } else {
  //   return 'http://localhost:1337/api'; // iOS simulator
  // }
};

// Create a base axios instance with default config
const apiClient = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('gc-connect-token');
    if (
      token &&
      config.url !== '/auth/local/register' &&
      config.url !== '/auth/local'
    ) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// Response interceptor for handling common errors
apiClient.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    // Handle common errors like 401 Unauthorized
    // if (error.response && error.response.status === 401) {
    //   // Clear AsyncStorage and redirect to login
    //   AsyncStorage.removeItem("gc-connect-token");
    //   AsyncStorage.removeItem("gc-connect-user");
    //   // In React Native, you'd navigate to login screen instead
    // }
    return Promise.reject(error);
  },
);

export default apiClient;
