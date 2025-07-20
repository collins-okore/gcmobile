/**
 * EXAMPLE USAGE of useAuth Hook
 *
 * This file demonstrates various ways to use the useAuth hook
 * in your React Native components.
 */

import React from 'react';
import {View, Text, ScrollView, RefreshControl} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useAuth} from './index';
import AuthGuard from '../components/Common/AuthGuard';
import Button from '../components/Common/Button';

// Example 1: Simple Authentication Check
const SimpleAuthExample = () => {
  const {isAuthenticated, isLoading, user} = useAuth();

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (!isAuthenticated) {
    return <Text>Please login to continue</Text>;
  }

  return <Text>Welcome {user?.first_name}!</Text>;
};

// Example 2: Profile Screen with Refresh
const ProfileScreenExample = () => {
  const {user, isLoading, error, refreshUser, clearError} = useAuth();

  const handleRefresh = async () => {
    await refreshUser();
  };

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
      }>
      {error && (
        <View>
          <Text>Error: {error}</Text>
          <Button title="Clear Error" onPress={clearError} />
        </View>
      )}

      <Text>
        Name: {user?.first_name} {user?.last_name}
      </Text>
      <Text>Email: {user?.email}</Text>
      <Text>Role: {user?.role.name}</Text>
    </ScrollView>
  );
};

// Example 3: Protected Route Component
const ProtectedRouteExample = () => {
  const {isAuthenticated, isLoading} = useAuth();
  const navigation = useNavigation();

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Navigate to login screen
      navigation.navigate('SignIn' as never);
    }
  }, [isAuthenticated, isLoading, navigation]);

  if (isLoading) {
    return <Text>Checking authentication...</Text>;
  }

  if (!isAuthenticated) {
    return null; // Will navigate away
  }

  return (
    <View>
      <Text>This is protected content!</Text>
    </View>
  );
};

// Example 4: Role-based Access Control
const RoleBasedExample = () => {
  const {user, isAuthenticated} = useAuth();

  if (!isAuthenticated) {
    return <Text>Please login</Text>;
  }

  const userRole = user?.role.name;

  switch (userRole) {
    case 'resident':
      return <Text>Resident Dashboard</Text>;
    case 'security_guard':
      return <Text>Security Guard Dashboard</Text>;
    case 'estate_manager':
      return <Text>Estate Manager Dashboard</Text>;
    default:
      return <Text>Unknown role: {userRole}</Text>;
  }
};

// Example 5: Using AuthGuard Component
const AuthGuardExample = () => {
  return (
    <AuthGuard showUserInfo={true}>
      <View>
        <Text>This content is protected by AuthGuard!</Text>
        <Text>Only authenticated users can see this.</Text>
      </View>
    </AuthGuard>
  );
};

// Example 6: Custom Logout Button
const LogoutButtonExample = () => {
  const {logout, isLoading} = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      // The auth state will update automatically
      // Navigation can be handled by listening to auth state
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <Button
      title="Logout"
      onPress={() => handleLogout()}
      disabled={isLoading}
      loading={isLoading}
    />
  );
};

// Example 7: Conditional Rendering Based on Auth State
const ConditionalRenderingExample = () => {
  const {isAuthenticated, user, isLoading} = useAuth();

  if (isLoading) {
    return <Text>Loading authentication state...</Text>;
  }

  return (
    <View>
      {isAuthenticated ? (
        <View>
          <Text>✅ You are logged in as {user?.first_name}</Text>
          <Text>Your role: {user?.role.name}</Text>
        </View>
      ) : (
        <View>
          <Text>❌ You are not logged in</Text>
          <Text>Please sign in to access your account</Text>
        </View>
      )}
    </View>
  );
};

// Example 8: Hook in useEffect for Side Effects
const SideEffectExample = () => {
  const {isAuthenticated, user} = useAuth();

  React.useEffect(() => {
    if (isAuthenticated && user) {
      // You could perform other side effects here:
      // - Analytics tracking
      // - Load user-specific data
      // - Set up real-time connections
      // - etc.
    }
  }, [isAuthenticated, user]);

  return <Text>Check console for side effect logs</Text>;
};

/*
// Example Usage in Main App Component:

const App = () => {
  const {isAuthenticated, isLoading} = useAuth();

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <AuthenticatedNavigator />
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
};

// Example in a Stack Navigator:

const ProtectedStack = () => {
  return (
    <AuthGuard fallback={<LoginScreen />}>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </AuthGuard>
  );
};
*/

export {
  SimpleAuthExample,
  ProfileScreenExample,
  ProtectedRouteExample,
  RoleBasedExample,
  AuthGuardExample,
  LogoutButtonExample,
  ConditionalRenderingExample,
  SideEffectExample,
};
