/**
 * TEST EXAMPLE: Authentication Flow with Logout
 *
 * This example demonstrates how the logout functionality works
 * and how it integrates with the AuthStateNavigator.
 */

import React from 'react';
import {View, Text, StyleSheet, Alert} from 'react-native';
import {useAuth} from './index';
import Button from '../components/Common/Button';
import colors from '../themes/colors';
import fonts from '../themes/fonts';

const AuthTestExample = () => {
  const {user, isAuthenticated, isLoading, logout} = useAuth();

  const handleTestLogout = async () => {
    Alert.alert(
      'Test Logout',
      'This will test the logout functionality. Are you sure?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Test Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              console.error('Logout test failed:', error);
            }
          },
        },
      ],
    );
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Loading authentication state...</Text>
      </View>
    );
  }

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>❌ Not Authenticated</Text>
        <Text style={styles.subtitle}>
          This component should only be visible to authenticated users.
        </Text>
        <Text style={styles.note}>
          If you see this, the logout worked correctly!
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>✅ Authentication Test</Text>

      <View style={styles.userInfo}>
        <Text style={styles.userText}>
          Logged in as: {user?.first_name} {user?.last_name}
        </Text>
        <Text style={styles.roleText}>Role: {user?.role.name}</Text>
        <Text style={styles.emailText}>Email: {user?.email}</Text>
      </View>

      <Button
        title="Test Logout"
        onPress={handleTestLogout}
        variant="outline"
        containerStyle={styles.button}
      />

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>🧪 Test Instructions:</Text>
        <Text style={styles.infoText}>
          1. Tap "Test Logout" button{'\n'}
          2. Confirm the logout{'\n'}
          3. Watch the AuthStateNavigator switch to login screen{'\n'}
          4. The navigation should be automatic and instant
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.whiteBg,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontFamily: fonts.bold,
    color: colors.darkFont,
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.grayFont,
    textAlign: 'center',
    marginBottom: 10,
  },
  note: {
    fontSize: 14,
    fontFamily: fonts.semibold,
    color: colors.primary,
    textAlign: 'center',
    marginTop: 10,
  },
  userInfo: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  userText: {
    fontSize: 18,
    fontFamily: fonts.semibold,
    color: colors.darkFont,
    marginBottom: 8,
  },
  roleText: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.primary,
    marginBottom: 4,
  },
  emailText: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.grayFont,
  },
  button: {
    marginBottom: 20,
  },
  infoBox: {
    backgroundColor: '#e3f2fd',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  infoTitle: {
    fontSize: 16,
    fontFamily: fonts.semibold,
    color: colors.darkFont,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.darkFont,
    lineHeight: 20,
  },
});

/*
// To use this test component, add it to any screen temporarily:

const TestScreen = () => {
  return <AuthTestExample />;
};

// Or add it to your navigation for testing:

<Stack.Screen 
  name="AuthTest" 
  component={AuthTestExample}
  options={{title: 'Auth Test'}}
/>
*/

export default AuthTestExample;
