import messaging, {
  getMessaging,
  requestPermission,
  hasPermission,
  AuthorizationStatus,
} from '@react-native-firebase/messaging';
import authService from './authService';
import {getApp} from '@react-native-firebase/app';
import {PermissionsAndroid, Platform} from 'react-native';

// FCM service functions
const fcmService = {
  // Check Android POST_NOTIFICATIONS permission
  checkAndroidNotificationPermission: async (): Promise<boolean> => {
    if (Platform.OS !== 'android') {
      return true; // Not applicable on iOS
    }

    try {
      // Check if we're on Android 13+ (API 33+)
      if (Platform.Version >= 33) {
        const permission = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );
        console.log(
          'Android POST_NOTIFICATIONS permission status:',
          permission,
        );
        return permission;
      }
      return true; // Permission not required on Android < 13
    } catch (error) {
      console.error('Error checking Android notification permission:', error);
      return false;
    }
  },

  // Request Android POST_NOTIFICATIONS permission
  requestAndroidNotificationPermission: async (): Promise<boolean> => {
    if (Platform.OS !== 'android') {
      return true; // Not applicable on iOS
    }

    try {
      // Check if we're on Android 13+ (API 33+)
      if (Platform.Version >= 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          {
            title: 'Notification Permission',
            message:
              'Gate Connect needs notification permission to send you important updates.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        console.log('Android POST_NOTIFICATIONS permission result:', granted);
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
      return true; // Permission not required on Android < 13
    } catch (error) {
      console.error('Error requesting Android notification permission:', error);
      return false;
    }
  },

  // Request notification permissions
  requestUserPermission: async (): Promise<boolean> => {
    const app = getApp();
    const messagingInstance = getMessaging(app);

    let authStatus = await hasPermission(messagingInstance);
    const enabled =
      authStatus === AuthorizationStatus.AUTHORIZED ||
      authStatus === AuthorizationStatus.PROVISIONAL;

    if (!enabled) {
      authStatus = await requestPermission(messagingInstance);
    }

    return (
      authStatus === AuthorizationStatus.AUTHORIZED ||
      authStatus === AuthorizationStatus.PROVISIONAL
    );
  },

  // Check and request notification permission (Android 13+ and iOS)
  checkAndRequestNotificationPermission: async (): Promise<boolean> => {
    try {
      // First check Android POST_NOTIFICATIONS permission
      const androidPermissionGranted =
        await fcmService.checkAndroidNotificationPermission();
      console.log(
        'Android POST_NOTIFICATIONS permission granted:',
        androidPermissionGranted,
      );

      // If Android permission is not granted, request it
      if (!androidPermissionGranted) {
        const androidPermissionRequested =
          await fcmService.requestAndroidNotificationPermission();
        console.log(
          'Android POST_NOTIFICATIONS permission requested:',
          androidPermissionRequested,
        );

        if (!androidPermissionRequested) {
          console.log('Android POST_NOTIFICATIONS permission denied');
          return false;
        }
      }

      // Then check Firebase messaging permission
      const messaging = getMessaging();
      let authStatus = await hasPermission(messaging);
      const enabled =
        authStatus === AuthorizationStatus.AUTHORIZED ||
        authStatus === AuthorizationStatus.PROVISIONAL;

      console.log('Firebase authStatus', authStatus);
      console.log('Firebase enabled', enabled);

      if (!enabled) {
        authStatus = await requestPermission(messaging);
        console.log('Firebase request permission authStatus', authStatus);
      }

      console.log(
        'After Firebase request permission authStatus',
        authStatus === AuthorizationStatus.AUTHORIZED,
        authStatus === AuthorizationStatus.PROVISIONAL,
      );

      const firebasePermissionGranted =
        authStatus === AuthorizationStatus.AUTHORIZED ||
        authStatus === AuthorizationStatus.PROVISIONAL;

      console.log(
        'Final permission status - Android:',
        androidPermissionGranted,
        'Firebase:',
        firebasePermissionGranted,
      );

      // Both Android and Firebase permissions should be granted
      return androidPermissionGranted && firebasePermissionGranted;
    } catch (error) {
      console.error(
        'Error checking/requesting notification permission:',
        error,
      );
      return false;
    }
  },

  // Get FCM token
  getFCMToken: async (): Promise<string | null> => {
    try {
      const token = await messaging().getToken();
      return token;
    } catch (error) {
      console.error('Error getting FCM token:', error);
      return null;
    }
  },

  // Register FCM token with backend
  registerFCMToken: async (token: string): Promise<boolean> => {
    try {
      const currentUser = await authService.getCurrentUser();
      if (!currentUser) {
        console.error('No current user found');
        return false;
      }

      // Update profile with FCM token
      const profileData = {
        id: currentUser.id,
        firebaseToken: token,
      };

      await authService.updateProfile(profileData);
      console.log('FCM token registered successfully');
      return true;
    } catch (error) {
      console.error('Error registering FCM token:', error);
      return false;
    }
  },

  // Initialize FCM token handling
  initializeFCM: async (): Promise<void> => {
    try {
      // Request permission first
      const hasPermission = await fcmService.requestUserPermission();
      if (!hasPermission) {
        console.log('Notification permission denied');
        return;
      }

      // Get initial token
      const token = await fcmService.getFCMToken();
      if (token) {
        await fcmService.registerFCMToken(token);
      }

      // Listen for token refresh
      fcmService.setupTokenRefreshListener();
    } catch (error) {
      console.error('Error initializing FCM:', error);
    }
  },

  // Setup token refresh listener
  setupTokenRefreshListener: (): void => {
    messaging().onTokenRefresh(async token => {
      console.log('FCM token refreshed:', token);
      await fcmService.registerFCMToken(token);
    });
  },

  // Setup foreground message handler
  setupForegroundHandler: (): void => {
    messaging().onMessage(async remoteMessage => {
      console.log('Foreground message received:', remoteMessage);
      // Handle foreground messages here
      // You can show a local notification or update UI
    });
  },

  // Setup background message handler
  setupBackgroundHandler: (): void => {
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Background message received:', remoteMessage);
      // Handle background messages here
      // This will be called when the app is in the background
    });
  },

  // Get initial notification when app is opened from background
  getInitialNotification: async () => {
    try {
      const remoteMessage = await messaging().getInitialNotification();
      if (remoteMessage) {
        console.log('Initial notification:', remoteMessage);
        return remoteMessage;
      }
    } catch (error) {
      console.error('Error getting initial notification:', error);
    }
    return null;
  },

  // Setup notification opened listener
  setupNotificationOpenedListener: (callback: (message: any) => void): void => {
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('Notification opened app:', remoteMessage);
      callback(remoteMessage);
    });
  },

  // Complete FCM setup
  setupFCM: async (
    onNotificationOpened?: (message: any) => void,
  ): Promise<void> => {
    try {
      // Initialize FCM
      await fcmService.initializeFCM();

      // Setup message handlers
      fcmService.setupForegroundHandler();
      fcmService.setupBackgroundHandler();

      // Setup notification opened listener
      if (onNotificationOpened) {
        fcmService.setupNotificationOpenedListener(onNotificationOpened);
      }

      // Get initial notification
      await fcmService.getInitialNotification();

      console.log('FCM setup completed successfully');
    } catch (error) {
      console.error('Error setting up FCM:', error);
    }
  },
};

export default fcmService;
