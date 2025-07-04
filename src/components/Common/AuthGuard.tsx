import React from 'react';
import {View, Text, StyleSheet, ActivityIndicator, Alert} from 'react-native';
import {useAuth} from '../../hooks';
import colors from '../../themes/colors';
import fonts from '../../themes/fonts';
import Button from './Button';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showUserInfo?: boolean;
}

/**
 * AuthGuard component that uses the useAuth hook to:
 * 1. Show loading state while checking authentication
 * 2. Render children if user is authenticated
 * 3. Show fallback content if user is not authenticated
 * 4. Display user information and logout option
 */
const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  fallback,
  showUserInfo = false,
}) => {
  const {
    user,
    isLoading,
    isAuthenticated,
    error,
    refreshUser,
    logout,
    clearError,
  } = useAuth();

  // Show loading indicator while checking auth state
  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Checking authentication...</Text>
      </View>
    );
  }

  // Show error if there's an authentication error
  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>⚠️ Authentication Error</Text>
        <Text style={styles.errorMessage}>{error}</Text>
        <View style={styles.buttonContainer}>
          <Button title="Clear Error" onPress={clearError} />
          <Button
            title="Retry"
            onPress={() => refreshUser()}
            containerStyle={styles.retryButton}
          />
        </View>
      </View>
    );
  }

  // If not authenticated, show fallback or default message
  if (!isAuthenticated) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <View style={styles.container}>
        <Text style={styles.notAuthText}>🔒 Access Restricted</Text>
        <Text style={styles.notAuthMessage}>
          Please sign in to access this content.
        </Text>
      </View>
    );
  }

  // User is authenticated, show content
  return (
    <View style={styles.authenticatedContainer}>
      {showUserInfo && user && (
        <View style={styles.userInfoContainer}>
          <Text style={styles.welcomeText}>
            Welcome back, {user.first_name}! 👋
          </Text>
          <Text style={styles.roleText}>Role: {user.role.name}</Text>
          <Text style={styles.emailText}>{user.email}</Text>

          <View style={styles.authActions}>
            <Button
              title="Refresh Profile"
              onPress={() => refreshUser()}
              containerStyle={styles.refreshButton}
            />
            <Button
              title="Logout"
              onPress={() => {
                Alert.alert(
                  'Confirm Logout',
                  'Are you sure you want to logout?',
                  [
                    {text: 'Cancel', style: 'cancel'},
                    {
                      text: 'Logout',
                      onPress: () => logout(),
                      style: 'destructive',
                    },
                  ],
                );
              }}
              containerStyle={styles.logoutButton}
            />
          </View>
        </View>
      )}

      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.whiteBg,
  },
  authenticatedContainer: {
    flex: 1,
    backgroundColor: colors.whiteBg,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.grayFont,
  },
  errorText: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: '#e74c3c',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.grayFont,
    textAlign: 'center',
    marginBottom: 24,
  },
  notAuthText: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.darkFont,
    marginBottom: 8,
    textAlign: 'center',
  },
  notAuthMessage: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.grayFont,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  retryButton: {
    backgroundColor: colors.primary,
  },
  userInfoContainer: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    margin: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  welcomeText: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.darkFont,
    marginBottom: 4,
  },
  roleText: {
    fontSize: 14,
    fontFamily: fonts.semibold,
    color: colors.primary,
    marginBottom: 4,
  },
  emailText: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.grayFont,
    marginBottom: 16,
  },
  authActions: {
    flexDirection: 'row',
    gap: 12,
  },
  refreshButton: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  logoutButton: {
    flex: 1,
    backgroundColor: '#6c757d',
  },
});

export default AuthGuard;
