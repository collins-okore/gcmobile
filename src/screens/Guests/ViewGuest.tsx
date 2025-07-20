import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {ArrowLeftIcon} from 'react-native-heroicons/outline';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Toast} from 'toastify-react-native';
import residentGuestService, {
  ResidentGuest,
} from '../../services/residentGuestService';

import colors from '../../themes/colors';
import fonts from '../../themes/fonts';
import {format, isThisYear} from 'date-fns';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from '../../components/Common/Icon';
import DropdownMenu from '../../components/Common/DropdownMenu';
import {normalize} from '../../lib/normalize';

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const time = format(date, 'HH:mm');

  // If it's this year, don't show the year
  if (isThisYear(date)) {
    return `${format(date, 'do MMM')} · ${time}`; // e.g., "1st Jun · 12:28"
  }

  return `${format(date, 'dd MMM yyyy')} · ${time}`; // e.g., "13 May 2022 · 13:30"
};

const ViewGuest = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {guestId} = route.params as {guestId: string};

  const [guest, setGuest] = useState<ResidentGuest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch guest data on component mount
  useEffect(() => {
    const fetchGuest = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await residentGuestService.getResidentGuestById(
          guestId,
          {
            populate: ['resident.user'],
          },
        );

        setGuest(normalize(response.data));
      } catch (err: any) {
        console.error('Error fetching guest:', err);
        setError('Failed to load guest details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (guestId) {
      fetchGuest();
    }
  }, [guestId]);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleEditPress = () => {
    (navigation as any).navigate('EditResidentGuest', {guestId});
  };

  const handleCancelGuest = () => {
    Alert.alert(
      'Cancel Guest',
      `Are you sure you want to cancel ${guest?.name}'s visit? This action cannot be undone.`,
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: confirmCancelGuest,
        },
      ],
    );
  };

  const confirmCancelGuest = async () => {
    try {
      setLoading(true);
      await residentGuestService.markGuestAsCancelled(guestId);

      // Update local state
      setGuest(prev => (prev ? {...prev, status: 'cancelled'} : null));

      Toast.show({
        type: 'success',
        text1: 'Guest Cancelled',
        text2: `${guest?.name}'s visit has been cancelled`,
        position: 'top',
        visibilityTime: 3000,
      });
    } catch (error: any) {
      console.error('Error cancelling guest:', error);

      let errorMessage = 'Failed to cancel guest. Please try again.';

      if (error.response?.status === 404) {
        errorMessage = 'Guest not found. It may have been deleted.';
      } else if (error.response?.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      Toast.show({
        type: 'error',
        text1: 'Failed to Cancel',
        text2: errorMessage,
        position: 'top',
        visibilityTime: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get status display info
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending':
        return {text: 'Pending', color: '#FF9800', bgColor: '#FFF3E0'};
      case 'arrived':
        return {text: 'Checked In', color: colors.primary, bgColor: '#E3F2FD'};
      case 'departed':
        return {text: 'Departed', color: '#4CAF50', bgColor: '#E8F5E8'};
      case 'cancelled':
        return {text: 'Cancelled', color: '#F44336', bgColor: '#FFEBEE'};
      default:
        return {text: 'Unknown', color: colors.grayFont, bgColor: '#F5F5F5'};
    }
  };

  // Loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.screen}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.whiteBg} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading guest details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error state
  if (error || !guest) {
    return (
      <SafeAreaView style={styles.screen}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.whiteBg} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || 'Guest not found'}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={handleBackPress}>
            <Text style={styles.retryText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const statusInfo = getStatusInfo(guest.status);

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.whiteBg} />
      <ScrollView style={styles.scrollView}>
        <View style={styles.scrollContent}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBackPress}>
              <ArrowLeftIcon size={24} color={colors.darkFont} />
            </TouchableOpacity>
            <DropdownMenu
              trigger={
                <View style={styles.editButton}>
                  <Icon
                    size={21}
                    color={colors.darkFont}
                    name="ellipsis-h-alt"
                  />
                </View>
              }
              options={[
                {
                  label: 'Edit Guest',
                  value: 'edit',
                  icon: 'edit',
                  onPress: handleEditPress,
                },
                // Only show cancel option if guest is not already cancelled or departed
                ...(guest.status !== 'cancelled' && guest.status !== 'departed'
                  ? [
                      {
                        label: 'Cancel Guest',
                        value: 'cancel',
                        icon: 'ban',
                        textColor: '#F44336',
                        onPress: handleCancelGuest,
                      },
                    ]
                  : []),
              ]}
              testID="guest-options-menu"
            />
          </View>
          <View style={styles.guestInfo}>
            <Text style={styles.guestId}>#{guest.id}</Text>
            <Text style={styles.guestName}>{guest.name}</Text>
            <View style={styles.statusRow}>
              <View
                style={[styles.status, {backgroundColor: statusInfo.bgColor}]}>
                <Text style={[styles.statusText, {color: statusInfo.color}]}>
                  {statusInfo.text}
                </Text>
              </View>
              <Text style={styles.timeText}>
                {formatDate(guest.arrivalTime)}
              </Text>
            </View>
          </View>
          <View style={styles.guestDetails}>
            <View style={styles.guestDetailsHeader}>
              <Text style={styles.guestDetailsTitle}>Guest Details</Text>
            </View>
            <View style={styles.guestDetailsItem}>
              <Text style={styles.guestDetailsTitle}>Full Name</Text>
              <Text style={styles.guestDetailsValue}>{guest.name}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.guestDetailsItem}>
              <Text style={styles.guestDetailsTitle}>ID Number</Text>
              <Text style={styles.guestDetailsValue}>{guest.idNumber}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.guestDetailsItem}>
              <Text style={styles.guestDetailsTitle}>Phone</Text>
              <Text style={styles.guestDetailsValue}>{guest.phone}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.guestDetailsItem}>
              <Text style={styles.guestDetailsTitle}>Purpose</Text>
              <Text style={styles.guestDetailsValue}>{guest.purpose}</Text>
            </View>
            <View style={styles.divider} />

            {guest.resident?.houseNumber && (
              <>
                <View style={styles.divider} />
                <View style={styles.guestDetailsItem}>
                  <Text style={styles.guestDetailsTitle}>House Number</Text>
                  <Text style={styles.guestDetailsValue}>
                    House {guest.resident.houseNumber}
                  </Text>
                </View>
              </>
            )}
            {guest.resident?.unit && (
              <>
                <View style={styles.divider} />
                <View style={styles.guestDetailsItem}>
                  <Text style={styles.guestDetailsTitle}>Unit</Text>
                  <Text style={styles.guestDetailsValue}>
                    {guest.resident.unit}
                  </Text>
                </View>
              </>
            )}
          </View>
          {(guest.vehicleLicensePlate ||
            guest.vehicleMake ||
            guest.vehicleModel ||
            guest.vehicleColor) && (
            <View style={styles.guestDetails}>
              <View style={styles.guestDetailsHeader}>
                <Text style={styles.guestDetailsTitle}>Vehicle Details</Text>
              </View>
              {guest.vehicleLicensePlate && (
                <>
                  <View style={styles.guestDetailsItem}>
                    <Text style={styles.guestDetailsTitle}>License Plate</Text>
                    <Text style={styles.guestDetailsValue}>
                      {guest.vehicleLicensePlate}
                    </Text>
                  </View>
                  {(guest.vehicleMake ||
                    guest.vehicleModel ||
                    guest.vehicleColor) && <View style={styles.divider} />}
                </>
              )}
              {guest.vehicleMake && (
                <>
                  <View style={styles.guestDetailsItem}>
                    <Text style={styles.guestDetailsTitle}>Vehicle Make</Text>
                    <Text style={styles.guestDetailsValue}>
                      {guest.vehicleMake}
                    </Text>
                  </View>
                  {(guest.vehicleModel || guest.vehicleColor) && (
                    <View style={styles.divider} />
                  )}
                </>
              )}
              {guest.vehicleModel && (
                <>
                  <View style={styles.guestDetailsItem}>
                    <Text style={styles.guestDetailsTitle}>Vehicle Model</Text>
                    <Text style={styles.guestDetailsValue}>
                      {guest.vehicleModel}
                    </Text>
                  </View>
                  {guest.vehicleColor && <View style={styles.divider} />}
                </>
              )}
              {guest.vehicleColor && (
                <View style={styles.guestDetailsItem}>
                  <Text style={styles.guestDetailsTitle}>Vehicle Color</Text>
                  <Text style={styles.guestDetailsValue}>
                    {guest.vehicleColor}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F3F5F7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 0,
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 0,
  },
  editButton: {
    paddingVertical: 8,
    paddingHorizontal: 0,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  guestInfo: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  guestId: {
    fontSize: 14,
    color: colors.grayFont,
    fontFamily: fonts.regular,
  },
  guestName: {
    fontSize: 24,
    color: colors.darkFont,
    fontFamily: fonts.semibold,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
  },
  status: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#E3F2FD',
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    color: colors.primary,
    fontFamily: fonts.semibold,
  },
  timeText: {
    fontSize: 14,
    color: colors.darkFont,
    fontFamily: fonts.regular,
  },
  guestDetails: {
    paddingVertical: 8,
    backgroundColor: colors.whiteBg,
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  guestDetailsHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  iconContainer: {
    backgroundColor: '#E3F2FD',
    borderRadius: 5,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  guestDetailsTitle: {
    fontSize: 16,
    color: colors.darkFont,
    fontFamily: fonts.semibold,
  },
  guestDetailsValue: {
    fontSize: 16,
    color: colors.darkFont,
    fontFamily: fonts.regular,
  },
  guestDetailsItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
    marginHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F5F7',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.grayFont,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F5F7',
    paddingHorizontal: 32,
  },
  errorText: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.grayFont,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  retryText: {
    fontSize: 16,
    fontFamily: fonts.semibold,
    color: colors.whiteBg,
  },
});

export default ViewGuest;
