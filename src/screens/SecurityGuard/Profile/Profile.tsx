import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Alert,
} from 'react-native';
import {useAuth} from '../../../contexts/AuthContext';
import colors from '../../../themes/colors';
import fonts from '../../../themes/fonts';
import ProfileSummary from './ProfileSummary';
import {useNavigation} from '@react-navigation/native';
import {ChevronRightIcon, UserIcon} from 'react-native-heroicons/outline';
import {ArrowLeftStartOnRectangleIcon} from 'react-native-heroicons/solid';

const Profile = () => {
  const navigation = useNavigation();
  const {logout, isLoading} = useAuth();

  const handleEditProfile = () => {
    navigation.navigate('EditProfile' as never);
  };

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              // Navigation will be handled automatically by AuthStateNavigator
              // when useAuth detects the authentication state change
            } catch (error) {
              console.error('Sign out error:', error);
              Alert.alert(
                'Sign Out Error',
                'There was an issue signing you out. Please try again.',
                [{text: 'OK'}],
              );
            }
          },
        },
      ],
      {cancelable: true},
    );
  };
  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.whiteBg} />

      <ScrollView contentContainerStyle={styles.scrollView}>
        <SafeAreaView style={styles.safeArea}>
          {/* <View style={styles.topbar}>
        <Text style={styles.title}>Profile</Text>
      </View> */}
          <ProfileSummary />
          <>
            <View style={styles.container}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={handleEditProfile}>
                <View style={styles.left}>
                  <UserIcon color={colors.darkFont} size={24} />
                  <Text style={styles.menuItemText}>Edit Profile Info</Text>
                </View>
                <View style={styles.right}>
                  <ChevronRightIcon color={colors.darkFont} size={24} />
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.container}>
              <TouchableOpacity
                style={[styles.menuItem, isLoading && styles.disabledMenuItem]}
                onPress={handleSignOut}
                disabled={isLoading}>
                <View style={styles.left}>
                  <ArrowLeftStartOnRectangleIcon
                    color={isLoading ? colors.grayFont : colors.darkFont}
                    size={24}
                  />
                  <Text
                    style={[
                      styles.menuItemText,
                      isLoading && styles.disabledText,
                    ]}>
                    {isLoading ? 'Signing Out...' : 'Sign Out'}
                  </Text>
                </View>
                <View style={styles.right}>
                  <ChevronRightIcon
                    color={isLoading ? colors.grayFont : colors.darkFont}
                    size={24}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </>
        </SafeAreaView>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.whiteBg,
  },
  safeArea: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontFamily: fonts.bold,
    color: colors.darkFont,
    marginTop: 16,
    marginBottom: 16,
  },
  scrollView: {
    flexGrow: 1,

    backgroundColor: colors.grayBg,
  },
  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignContent: 'center',
    paddingHorizontal: 16,
    backgroundColor: colors.whiteBg,
  },
  container: {
    backgroundColor: colors.whiteBg,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    marginTop: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  menuItemText: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.darkFont,
    marginLeft: 16,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  right: {
    alignItems: 'center',
  },
  menuItemSeparator: {
    height: 1,
    backgroundColor: '#EFEFEF',
  },
  disabledMenuItem: {
    opacity: 0.6,
  },
  disabledText: {
    color: colors.grayFont,
  },
});

export default Profile;
