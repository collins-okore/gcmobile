import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import React, {useEffect, useState} from 'react';
import colors from '../../themes/colors';
import fonts from '../../themes/fonts';
import {UserIcon} from 'react-native-heroicons/outline';
import {useAuth} from '../../contexts/AuthContext';

const ProfileSummary = () => {
  const {user, loadFullProfile} = useAuth();
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  // Load full profile on component mount if we don't have extended data
  useEffect(() => {
    const loadProfile = async () => {
      if (user && !user.house_number && !user.resident) {
        setIsLoadingProfile(true);
        try {
          await loadFullProfile();
        } catch (error) {
          console.error('Failed to load profile:', error);
        } finally {
          setIsLoadingProfile(false);
        }
      }
    };

    loadProfile();
  }, [user, loadFullProfile]);

  // Format user name
  const userName = user
    ? `${user.first_name} ${user.last_name}`.trim()
    : 'Loading...';

  // Format address - prioritize resident data, fallback to direct properties
  const userAddress = user
    ? user.resident?.house_number && user.resident?.block_court
      ? `House ${user.resident.house_number}, Block ${user.resident.block_court}`
      : user.house_number && user.block
      ? `House ${user.house_number}, Block ${user.block}`
      : user.estate_name || 'Address not available'
    : 'Loading...';

  return (
    <View style={styles.container}>
      <View style={styles.profile}>
        <View style={styles.avatar}>
          {isLoadingProfile ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <UserIcon color={colors.darkFont} size={24} />
          )}
        </View>
        <View style={styles.details}>
          <Text style={styles.residentName}>{userName}</Text>
          <Text style={styles.residentAddress}>{userAddress}</Text>
        </View>
      </View>
      <View style={styles.stats}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>2</Text>
          <Text style={styles.statLabel}>Household</Text>
        </View>

        <View style={styles.statSeparator} />

        <View style={styles.statItem}>
          <Text style={styles.statValue}>12</Text>
          <Text style={styles.statLabel}>Visits</Text>
        </View>

        <View style={styles.statSeparator} />

        <View style={styles.statItem}>
          <Text style={styles.statValue}>3</Text>
          <Text style={styles.statLabel}>Vehicles</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.whiteBg,
    paddingHorizontal: 16,
    paddingTop: 32,
    paddingBottom: 24,
  },
  profile: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 65,
    height: 65,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    borderRadius: 30,
    backgroundColor: colors.grayBg,
  },
  details: {
    flexDirection: 'column',
    marginLeft: 16,
  },
  residentName: {
    fontSize: 20,
    fontFamily: fonts.semibold,
    color: colors.darkFont,
    marginTop: 12,
    marginBottom: 1,
    textAlign: 'center',
  },
  residentAddress: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.grayFont,
    textAlign: 'center',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 18,
    fontFamily: fonts.regular,
    color: colors.grayFont,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.darkFont,
  },
  statSeparator: {
    width: 1,
    height: 24,
    backgroundColor: '#EFEFEF',
    marginHorizontal: 20,
  },
});

export default ProfileSummary;
