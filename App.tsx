/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {StatusBar, Platform} from 'react-native';
import {AuthProvider} from './src/contexts/AuthContext';
import AuthStateNavigator from './src/navigators/AuthStateNavigator';
import ToastManager from 'toastify-react-native';
import CustomToast from './src/components/Common/CustomToast';
import FCMHandler from './src/components/Common/FCMHandler';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

// Inner component that uses the safe area hook
const AppContent: React.FC = () => {
  const insets = useSafeAreaInsets();

  // Platform-specific top offset calculation
  const getTopOffset = () => {
    if (Platform.OS === 'ios') {
      return insets.top + 16;
    } else {
      // Android - add extra padding since translucent status bar affects positioning
      return 0;
    }
  };

  // Custom toast configuration
  const toastConfig = {
    success: (props: any) => <CustomToast {...props} type="success" />,
    error: (props: any) => <CustomToast {...props} type="error" />,
    warning: (props: any) => <CustomToast {...props} type="warning" />,
    info: (props: any) => <CustomToast {...props} type="info" />,
    default: (props: any) => <CustomToast {...props} type="default" />,
  };

  return (
    <AuthProvider>
      <FCMHandler>
        <NavigationContainer>
          <StatusBar
            barStyle="dark-content"
            backgroundColor="transparent"
            translucent={Platform.OS === 'android'}
          />
          <AuthStateNavigator />
        </NavigationContainer>

        {/* Toast Manager with custom components */}
        <ToastManager
          config={toastConfig}
          position="top"
          duration={3000}
          animationStyle="fade"
          theme="light"
          showProgressBar={false}
          topOffset={getTopOffset()}
        />
      </FCMHandler>
    </AuthProvider>
  );
};

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
}

export default App;
