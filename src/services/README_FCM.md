# FCM (Firebase Cloud Messaging) Implementation

This document explains how FCM is implemented in the GateConnect mobile app for push notifications.

## Overview

The FCM implementation automatically:

- Registers FCM tokens after user login
- Updates the backend when tokens are refreshed
- Handles foreground and background notifications
- Manages notification permissions

## Files Created/Modified

### New Files:

- `src/services/fcmService.ts` - Core FCM service
- `src/hooks/useFCM.ts` - React hook for FCM functionality
- `src/components/Common/FCMHandler.tsx` - Component wrapper for FCM setup

### Modified Files:

- `src/services/authService.ts` - Added firebaseToken to ProfileData interface and auto-registration after login
- `src/hooks/index.ts` - Exported useFCM hook
- `App.tsx` - Added FCMHandler wrapper
- `index.js` - Added background message handler

## How It Works

### 1. Automatic Token Registration

When a user logs in successfully, the system automatically:

- Requests notification permissions
- Gets the FCM token
- Registers the token with the backend using the `updateProfile` function
- Sets up token refresh listeners

### 2. Token Refresh Handling

The system listens for token refreshes and automatically updates the backend:

```typescript
messaging().onTokenRefresh(async token => {
  await fcmService.registerFCMToken(token);
});
```

### 3. Notification Handling

- **Foreground**: Shows alerts or updates UI
- **Background**: Handles messages when app is in background
- **App Opened**: Handles notifications that open the app

## Usage Examples

### Basic Usage in a Component:

```typescript
import {useFCM} from '../hooks';

const MyComponent = () => {
  const {registerToken, getToken} = useFCM();

  const handleManualRegistration = async () => {
    const token = await registerToken();
    console.log('Token registered:', token);
  };

  return (
    <Button onPress={handleManualRegistration} title="Register FCM Token" />
  );
};
```

### Custom Notification Handling:

```typescript
import {useFCM} from '../hooks';

const MyComponent = () => {
  const {setupForegroundHandler} = useFCM();

  useEffect(() => {
    setupForegroundHandler(message => {
      // Custom handling for foreground messages
      console.log('Custom foreground handler:', message);
    });
  }, [setupForegroundHandler]);

  return <View />;
};
```

### Manual Token Registration:

```typescript
import fcmService from '../services/fcmService';

const registerTokenManually = async () => {
  const token = await fcmService.getFCMToken();
  if (token) {
    await fcmService.registerFCMToken(token);
  }
};
```

## Backend Integration

The FCM token is sent to the backend using the existing `updateProfile` API endpoint:

```typescript
// The token is included in the profile data
const profileData = {
  ...currentUser,
  firebaseToken: token,
};

await authService.updateProfile(profileData);
```

## Configuration

### Required Firebase Setup:

1. Ensure `google-services.json` (Android) and `GoogleService-Info.plist` (iOS) are properly configured
2. Firebase project should have Cloud Messaging enabled
3. APNs certificate should be uploaded to Firebase Console (for iOS)

### Permissions:

- iOS: Add notification permissions to `Info.plist`
- Android: Permissions are handled automatically by the Firebase SDK

## Testing

### Test FCM Token Registration:

1. Login to the app
2. Check console logs for "FCM token registered successfully"
3. Verify the token is sent to your backend

### Test Token Refresh:

1. The token refresh happens automatically
2. Check console logs for "FCM token refreshed"
3. Verify the new token is sent to your backend

### Test Notifications:

1. Send a test notification from Firebase Console
2. Test in foreground, background, and app closed states
3. Verify notification handling works as expected

## Troubleshooting

### Common Issues:

1. **Token not registering**: Check Firebase configuration files
2. **Permissions denied**: Ensure notification permissions are granted
3. **Backend not receiving tokens**: Check the `updateProfile` API endpoint
4. **Notifications not showing**: Verify notification handlers are properly set up

### Debug Logs:

The implementation includes comprehensive logging. Check console for:

- "FCM token registered successfully"
- "FCM token refreshed"
- "Foreground message received"
- "Background message received"
- "Notification opened app"

## Security Considerations

1. FCM tokens are sensitive data - ensure they're transmitted securely
2. Validate tokens on the backend before storing
3. Implement proper token cleanup when users logout
4. Consider token expiration and refresh strategies
