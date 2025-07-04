# Authentication Hook (`useAuth`)

A comprehensive React hook for managing user authentication state in the React Native app.

## Features

- 🔐 Automatically loads user and token from AsyncStorage on mount
- 🔄 Provides loading states for better UX
- 🚪 Easy logout functionality
- 🔥 Refresh user data from server
- ⚠️ Error handling with helpful messages
- 💾 Persistent authentication across app restarts

## Usage

### Basic Usage

```typescript
import {useAuth} from '../hooks';

const MyComponent = () => {
  const {
    user,
    token,
    isLoading,
    isAuthenticated,
    error,
    refreshUser,
    logout,
    clearError,
  } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <View>
      <Text>Welcome, {user?.first_name}!</Text>
      <Text>Role: {user?.role.name}</Text>
      {error && <ErrorMessage message={error} onDismiss={clearError} />}
    </View>
  );
};
```

### Advanced Usage Examples

#### Profile Screen with Refresh

```typescript
const ProfileScreen = () => {
  const {user, isLoading, error, refreshUser, clearError} = useAuth();

  const handleRefresh = async () => {
    await refreshUser();
  };

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
      }>
      <Text>
        {user?.first_name} {user?.last_name}
      </Text>
      <Text>{user?.email}</Text>
    </ScrollView>
  );
};
```

#### Navigation Guard

```typescript
const ProtectedScreen = () => {
  const {isAuthenticated, isLoading} = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigation.navigate('Login');
    }
  }, [isAuthenticated, isLoading, navigation]);

  if (isLoading) return <LoadingSpinner />;
  if (!isAuthenticated) return null;

  return <YourProtectedContent />;
};
```

#### Logout Button

```typescript
const LogoutButton = () => {
  const {logout, isLoading} = useAuth();

  const handleLogout = async () => {
    await logout();
    // Navigation will be handled by auth state change
  };

  return <Button title="Logout" onPress={handleLogout} loading={isLoading} />;
};
```

## Return Values

| Property           | Type                  | Description                                 |
| ------------------ | --------------------- | ------------------------------------------- |
| `user`             | `User \| null`        | Current logged-in user data                 |
| `token`            | `string \| null`      | Authentication token                        |
| `isLoading`        | `boolean`             | Loading state for async operations          |
| `isAuthenticated`  | `boolean`             | True if user is logged in                   |
| `error`            | `string \| null`      | Error message if any operation fails        |
| `refreshUser`      | `() => Promise<void>` | Refresh user data from server               |
| `refreshAuthState` | `() => Promise<void>` | Immediately refresh auth state from storage |
| `logout`           | `() => Promise<void>` | Logout and clear auth data                  |
| `clearError`       | `() => void`          | Clear current error message                 |

## User Object Structure

```typescript
interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  role: {
    name: string; // 'resident', 'security_guard', 'estate_manager', etc.
  };
}
```

## Error Handling

The hook automatically handles common scenarios:

- **Token Expiration**: Automatically clears auth data when 401 is received
- **Network Errors**: Provides user-friendly error messages
- **Storage Corruption**: Clears corrupted data and shows error
- **Server Issues**: Handles server errors gracefully

## Integration with Sign In

After successful sign-in using `authService.login()`, the authentication state is updated immediately by calling `refreshAuthState()`:

```typescript
// In SignIn component
const response = await authService.login(credentials);
await refreshAuthState(); // Immediately updates auth state
```

The hook provides two ways to detect authentication changes:

1. **Immediate**: Call `refreshAuthState()` to instantly update state
2. **Automatic**: Storage polling mechanism checks for changes every 5 seconds

For the best user experience, always call `refreshAuthState()` immediately after login for instant navigation.
