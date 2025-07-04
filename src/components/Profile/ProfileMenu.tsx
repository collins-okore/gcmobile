import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {useAuth} from '../../contexts/AuthContext';
import colors from '../../themes/colors';
import {
  UserIcon,
  ChevronRightIcon,
  UserGroupIcon,
  TruckIcon,
  ArrowLeftStartOnRectangleIcon,
} from 'react-native-heroicons/outline';
import fonts from '../../themes/fonts';

const ProfileMenu = () => {
  const navigation = useNavigation();
  const {logout, isLoading} = useAuth();

  const handleEditProfile = () => {
    navigation.navigate('EditResidentProfile' as never);
  };

  const handleHouseholdMembers = () => {
    navigation.navigate('ResidentHouseholdMembers' as never);
  };

  const handleVehicles = () => {
    navigation.navigate('ResidentVehicles' as never);
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
    <>
      <View style={styles.container}>
        <TouchableOpacity style={styles.menuItem} onPress={handleEditProfile}>
          <View style={styles.left}>
            <UserIcon color={colors.darkFont} size={24} />
            <Text style={styles.menuItemText}>Edit Profile Info</Text>
          </View>
          <View style={styles.right}>
            <ChevronRightIcon color={colors.darkFont} size={24} />
          </View>
        </TouchableOpacity>
        <View style={styles.menuItemSeparator} />
        <TouchableOpacity
          style={styles.menuItem}
          onPress={handleHouseholdMembers}>
          <View style={styles.left}>
            <UserGroupIcon color={colors.darkFont} size={24} />
            <Text style={styles.menuItemText}>Household Members</Text>
          </View>
          <View style={styles.right}>
            <ChevronRightIcon color={colors.darkFont} size={24} />
          </View>
        </TouchableOpacity>
        <View style={styles.menuItemSeparator} />
        <TouchableOpacity style={styles.menuItem} onPress={handleVehicles}>
          <View style={styles.left}>
            <TruckIcon color={colors.darkFont} size={24} />
            <Text style={styles.menuItemText}>My Vehicles</Text>
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
              style={[styles.menuItemText, isLoading && styles.disabledText]}>
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
  );
};

const styles = StyleSheet.create({
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

export default ProfileMenu;
