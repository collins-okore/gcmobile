import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import colors from '../../themes/colors';
import fonts from '../../themes/fonts';
import {UserIcon} from 'react-native-heroicons/outline';
import {useAuth} from '../../contexts/AuthContext';
import {useFocusEffect} from '@react-navigation/native';
import residentHouseholdMemberService from '../../services/residentHouseholdMemberService';
import residentGuestService from '../../services/residentGuestService';
import residentVehicleService from '../../services/residentVehicleService';

const ProfileSummary = () => {
  const {user, loadFullProfile} = useAuth();
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  // Load full profile on component mount if we don't have extended data
  useEffect(() => {
    const loadProfile = async () => {
      if (user && !user.houseNumber && !user.resident) {
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
    ? `${user.firstName} ${user.lastName}`.trim()
    : 'Loading...';

  // Format address - prioritize resident data, fallback to direct properties
  const userAddress = user
    ? user.resident?.houseNumber && user.resident?.blockCourt
      ? `House ${user.resident.houseNumber}, Block ${user.resident.blockCourt}`
      : user.houseNumber && user.blockCourt
      ? `House ${user.houseNumber}, Block ${user.blockCourt}`
      : user.estateName || 'Address not available'
    : 'Loading...';

  const [householdMembersCount, setHouseholdMembersCount] = useState(0);
  const [visitsCount, setVisitsCount] = useState(0);
  const [vehiclesCount, setVehiclesCount] = useState(0);

  const fetchCounts = useCallback(async () => {
    try {
      const [householdResponse, visitsResponse, vehiclesResponse] =
        await Promise.all([
          residentHouseholdMemberService.getAllHouseholdMembers({
            pagination: {
              page: 1,
              pageSize: 10,
            },
            sort: ['updatedAt:desc'],
          }),
          residentGuestService.getAllResidentGuests({
            filters: {
              status: {
                $in: ['arrived', 'pending', 'departed'],
              },
            },
            sort: ['updatedAt:desc'],
            pagination: {
              page: 1,
              pageSize: 10,
            },
          }),
          residentVehicleService.getAllVehicles({
            pagination: {
              page: 1,
              pageSize: 10,
            },
            sort: ['updatedAt:desc'],
          }),
        ]);

      setHouseholdMembersCount(householdResponse.meta?.pagination?.total || 0);
      setVisitsCount(visitsResponse.meta?.total || 0);
      setVehiclesCount(vehiclesResponse.meta?.pagination?.total || 0);
    } catch (error) {
      console.error('Error fetching profile counts:', error);
    }
  }, []);

  // Fetch counts when screen becomes visible
  useFocusEffect(
    useCallback(() => {
      fetchCounts();
    }, [fetchCounts]),
  );

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
          <Text style={styles.statValue}>{householdMembersCount}</Text>
          <Text style={styles.statLabel}>Household</Text>
        </View>

        <View style={styles.statSeparator} />

        <View style={styles.statItem}>
          <Text style={styles.statValue}>{visitsCount}</Text>
          <Text style={styles.statLabel}>Visits</Text>
        </View>

        <View style={styles.statSeparator} />

        <View style={styles.statItem}>
          <Text style={styles.statValue}>{vehiclesCount}</Text>
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
