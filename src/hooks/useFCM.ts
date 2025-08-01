import {useEffect, useCallback} from 'react';
import fcmService from '../services/fcmService';

interface UseFCMOptions {
  onNotificationOpened?: (message: any) => void;
  autoInitialize?: boolean;
}

const useFCM = (options: UseFCMOptions = {}) => {
  const {onNotificationOpened, autoInitialize = true} = options;

  // Initialize FCM
  const initializeFCM = useCallback(async () => {
    try {
      await fcmService.setupFCM(onNotificationOpened);
    } catch (error) {
      console.error('Error initializing FCM:', error);
    }
  }, [onNotificationOpened]);

  // Register FCM token manually
  const registerToken = useCallback(async () => {
    try {
      const token = await fcmService.getFCMToken();
      if (token) {
        await fcmService.registerFCMToken(token);
        return token;
      }
      return null;
    } catch (error) {
      console.error('Error registering FCM token:', error);
      return null;
    }
  }, []);

  // Request notification permissions
  const requestPermission = useCallback(async () => {
    try {
      return await fcmService.requestUserPermission();
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }, []);

  // Get current FCM token
  const getToken = useCallback(async () => {
    try {
      return await fcmService.getFCMToken();
    } catch (error) {
      console.error('Error getting FCM token:', error);
      return null;
    }
  }, []);

  // Setup foreground message handler
  const setupForegroundHandler = useCallback(
    (handler: (message: any) => void) => {
      fcmService.setupForegroundHandler = () => {
        // Override the default foreground handler
        const messaging = require('@react-native-firebase/messaging').default;
        messaging().onMessage(async (remoteMessage: any) => {
          console.log('Foreground message received:', remoteMessage);
          handler(remoteMessage);
        });
      };
    },
    [],
  );

  // Setup background message handler
  const setupBackgroundHandler = useCallback(
    (handler: (message: any) => void) => {
      const messaging = require('@react-native-firebase/messaging').default;
      messaging().setBackgroundMessageHandler(async (remoteMessage: any) => {
        console.log('Background message received:', remoteMessage);
        handler(remoteMessage);
      });
    },
    [],
  );

  // Initialize FCM on mount if autoInitialize is true
  useEffect(() => {
    if (autoInitialize) {
      initializeFCM();
    }
  }, [autoInitialize, initializeFCM]);

  return {
    initializeFCM,
    registerToken,
    requestPermission,
    getToken,
    setupForegroundHandler,
    setupBackgroundHandler,
  };
};

export default useFCM;
