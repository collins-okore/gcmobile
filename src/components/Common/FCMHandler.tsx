import React, {useEffect} from 'react';
import {Toast} from 'toastify-react-native';
import {useFCM} from '../../hooks';
import {useAuth} from '../../contexts/AuthContext';
import fcmService from '../../services/fcmService';

interface FCMHandlerProps {
  children: React.ReactNode;
}

const FCMHandler: React.FC<FCMHandlerProps> = ({children}) => {
  const {isAuthenticated} = useAuth();

  // Handle notification when app is opened from background
  const handleNotificationOpened = (message: any) => {
    console.log('Notification opened app:', message);

    // You can navigate to specific screens based on notification data
    if (message?.data?.screen) {
      // Navigate to specific screen
      // navigation.navigate(message.data.screen, message.data.params);
    }

    // Show toast notification
    if (message?.notification?.title) {
      Toast.show({
        type: 'info',
        text1: message.notification.title,
        text2: message.notification.body,
        position: 'top',
      });
    }
  };

  // Handle foreground messages
  const handleForegroundMessage = (message: any) => {
    console.log('Foreground message received:', message);

    // Show local notification or update UI
    if (message?.notification?.title) {
      Toast.show({
        type: 'info',
        text1: message.notification.title,
        text2: message.notification.body,
        position: 'top',
      });
    }
  };

  // Handle background messages
  const handleBackgroundMessage = (message: any) => {
    console.log('Background message received:', message);
    // Handle background messages here
    // This will be called when the app is in the background
  };

  const {initializeFCM, setupForegroundHandler, setupBackgroundHandler} =
    useFCM({
      onNotificationOpened: handleNotificationOpened,
      autoInitialize: false, // We'll initialize manually when user is authenticated
    });

  useEffect(() => {
    // Setup message handlers
    setupForegroundHandler(handleForegroundMessage);
    setupBackgroundHandler(handleBackgroundMessage);
  }, [setupForegroundHandler, setupBackgroundHandler]);

  // Request notification permission on app startup
  useEffect(() => {
    const requestPermissionOnStartup = async () => {
      try {
        await fcmService.checkAndRequestNotificationPermission();
      } catch (error) {
        console.error(
          'Error requesting notification permission on startup:',
          error,
        );
      }
    };

    requestPermissionOnStartup();
  }, []);

  useEffect(() => {
    // Initialize FCM only when user is authenticated
    if (isAuthenticated) {
      initializeFCM();
    }
  }, [isAuthenticated, initializeFCM]);

  return <>{children}</>;
};

export default FCMHandler;
