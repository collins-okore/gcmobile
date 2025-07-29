import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Alert,
  Modal, // <-- Add Modal import
} from 'react-native';
import React, {useState} from 'react';
import {ArrowLeftIcon} from 'react-native-heroicons/outline';
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from '@react-navigation/native';
import {Toast} from 'toastify-react-native';
import securityGuardGuestService, {
  SecurityGuardGuest,
} from '../../../services/securityGuardGuestService';

import colors from '../../../themes/colors';
import fonts from '../../../themes/fonts';
import {format, isThisYear} from 'date-fns';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from '../../../components/Common/Icon';
import DropdownMenu from '../../../components/Common/DropdownMenu';
import {normalize} from '../../../lib/normalize';
import DateTimeInput from '../../../components/Common/DateTimeInput';

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

  const [guest, setGuest] = useState<SecurityGuardGuest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showArrivalModal, setShowArrivalModal] = useState(false);
  const [arrivalTime, setArrivalTime] = useState(new Date());
  const [showDepartureModal, setShowDepartureModal] = useState(false);
  const [departureTime, setDepartureTime] = useState(new Date());

  // Fetch guest data
  const fetchGuest = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await securityGuardGuestService.getGuestById(guestId, {
        populate: ['resident', 'resident.user'],
        pagination: {
          page: 1,
          pageSize: 1,
        },
      });

      setGuest(normalize(response.data));
    } catch (err: any) {
      console.error('Error fetching guest:', err);
      setError('Failed to load guest details. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [guestId]);

  // Fetch guest data on component mount and auto-refresh when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      if (guestId) {
        fetchGuest();
      }
    }, [guestId, fetchGuest]),
  );

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleEditPress = () => {
    (navigation as any).navigate('EditSecurityGuardGuest', {guestId});
  };

  const handleMarkAsArrived = () => {
    setArrivalTime(new Date());
    setShowArrivalModal(true);
  };

  const handleArrivalModalCancel = () => {
    setShowArrivalModal(false);
  };

  const handleArrivalModalSubmit = async () => {
    setShowArrivalModal(false);
    await confirmMarkAsArrived(arrivalTime);
  };

  // Update confirmMarkAsArrived to accept arrivalTime
  const confirmMarkAsArrived = async (selectedTime?: Date) => {
    try {
      setLoading(true);
      await securityGuardGuestService.markGuestAsArrived(
        guestId,
        selectedTime ? selectedTime.toISOString() : undefined,
      );
      setGuest(prev =>
        prev
          ? {
              ...prev,
              status: 'arrived',
              arrivalTime: selectedTime
                ? selectedTime.toISOString()
                : prev.arrivalTime,
            }
          : null,
      );
      Toast.show({
        type: 'success',
        text1: 'Guest Checked In',
        text2: `${guest?.name} has been marked as arrived`,
        position: 'top',
        visibilityTime: 3000,
      });
    } catch (error: any) {
      console.error('Error marking guest as arrived:', error);
      Toast.show({
        type: 'error',
        text1: 'Failed to Check In',
        text2: 'Failed to mark guest as arrived. Please try again.',
        position: 'top',
        visibilityTime: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsDeparted = () => {
    setDepartureTime(new Date());
    setShowDepartureModal(true);
  };

  const handleDepartureModalCancel = () => {
    setShowDepartureModal(false);
  };

  const handleDepartureModalSubmit = async () => {
    setShowDepartureModal(false);
    await confirmMarkAsDeparted(departureTime);
  };

  // Update confirmMarkAsDeparted to accept departureTime
  const confirmMarkAsDeparted = async (selectedTime?: Date) => {
    try {
      setLoading(true);
      const departureTimeStr = selectedTime
        ? selectedTime.toISOString()
        : new Date().toISOString();
      await securityGuardGuestService.markGuestAsDeparted(
        guestId,
        departureTimeStr,
      );
      setGuest(prev =>
        prev
          ? {...prev, status: 'departed', departureTime: departureTimeStr}
          : null,
      );
      Toast.show({
        type: 'success',
        text1: 'Guest Departed',
        text2: `${guest?.name} has been marked as departed`,
        position: 'top',
        visibilityTime: 3000,
      });
    } catch (error: any) {
      console.error('Error marking guest as departed:', error);
      Toast.show({
        type: 'error',
        text1: 'Failed to Mark Departed',
        text2: 'Failed to mark guest as departed. Please try again.',
        position: 'top',
        visibilityTime: 4000,
      });
    } finally {
      setLoading(false);
    }
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
      await securityGuardGuestService.markGuestAsCancelled(guestId);

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
      Toast.show({
        type: 'error',
        text1: 'Failed to Cancel',
        text2: 'Failed to cancel guest. Please try again.',
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

  // Get dropdown menu options based on guest status
  const getMenuOptions = () => {
    const options: Array<{
      label: string;
      value: string;
      icon: string;
      onPress: () => void;
    }> = [];

    // Only allow editing for pending or arrived guests
    if (guest?.status === 'pending' || guest?.status === 'arrived') {
      options.push({
        label: 'Edit Guest',
        value: 'edit',
        icon: 'edit',
        onPress: handleEditPress,
      });
    }

    if (guest?.status === 'pending') {
      options.push({
        label: 'Mark as Arrived',
        value: 'arrived',
        icon: 'check',
        onPress: handleMarkAsArrived,
      });
    }

    if (guest?.status === 'arrived') {
      options.push({
        label: 'Mark as Departed',
        value: 'departed',
        icon: 'sign-out',
        onPress: handleMarkAsDeparted,
      });
    }

    // Only show cancel option if guest is not already cancelled or departed
    if (guest?.status !== 'cancelled' && guest?.status !== 'departed') {
      options.push({
        label: 'Cancel Guest',
        value: 'cancel',
        icon: 'ban',
        onPress: handleCancelGuest,
      });
    }

    return options;
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
              options={getMenuOptions()}
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
              <Text style={styles.guestDetailsValue}>
                {guest.phoneCallingCode || ''}
                {guest.phone}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.guestDetailsItem}>
              <Text style={styles.guestDetailsTitle}>Purpose</Text>
              <Text style={styles.guestDetailsValue}>{guest.purpose}</Text>
            </View>
            <View style={styles.divider} />

            {guest.resident && (
              <>
                <View style={styles.guestDetailsItem}>
                  <Text style={styles.guestDetailsTitle}>
                    Visiting Resident
                  </Text>
                  <Text style={styles.guestDetailsValue}>
                    {guest.resident.user
                      ? `${guest.resident.user.firstName} ${guest.resident.user.lastName}`
                      : 'N/A'}
                  </Text>
                </View>
                <View style={styles.divider} />
              </>
            )}

            {guest.resident?.houseNumber && (
              <>
                <View style={styles.guestDetailsItem}>
                  <Text style={styles.guestDetailsTitle}>House Number</Text>
                  <Text style={styles.guestDetailsValue}>
                    House {guest.resident.houseNumber}
                  </Text>
                </View>
                <View style={styles.divider} />
              </>
            )}

            {guest.resident?.unit && (
              <>
                <View style={styles.guestDetailsItem}>
                  <Text style={styles.guestDetailsTitle}>Unit</Text>
                  <Text style={styles.guestDetailsValue}>
                    {guest.resident.unit}
                  </Text>
                </View>
                <View style={styles.divider} />
              </>
            )}

            {guest.estate && (
              <>
                <View style={styles.guestDetailsItem}>
                  <Text style={styles.guestDetailsTitle}>Estate</Text>
                  <Text style={styles.guestDetailsValue}>
                    {guest.estate.name}
                  </Text>
                </View>
                <View style={styles.divider} />
              </>
            )}

            <View style={styles.guestDetailsItem}>
              <Text style={styles.guestDetailsTitle}>Arrival Time</Text>
              <Text style={styles.guestDetailsValue}>
                {formatDate(guest.arrivalTime)}
              </Text>
            </View>
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
                      {guest.vehicleLicensePlate &&
                      guest.vehicleLicensePlate.trim()
                        ? guest.vehicleLicensePlate.toUpperCase()
                        : 'No Vehicle'}
                    </Text>
                  </View>
                  <View style={styles.divider} />
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
                  <View style={styles.divider} />
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
                  <View style={styles.divider} />
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

          {guest.departureTime && (
            <View style={styles.guestDetails}>
              <View style={styles.guestDetailsHeader}>
                <Text style={styles.guestDetailsTitle}>Departure Details</Text>
              </View>
              <View style={styles.guestDetailsItem}>
                <Text style={styles.guestDetailsTitle}>Departure Time</Text>
                <Text style={styles.guestDetailsValue}>
                  {formatDate(guest.departureTime)}
                </Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
      {/* Arrival Time Modal */}
      <Modal
        visible={showArrivalModal}
        transparent
        animationType="slide"
        onRequestClose={handleArrivalModalCancel}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.4)',
          }}>
          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 16,
              padding: 24,
              width: '85%',
            }}>
            <Text
              style={{
                fontSize: 18,
                fontFamily: fonts.semibold,
                marginBottom: 16,
              }}>
              Select Arrival Time
            </Text>
            <DateTimeInput
              label="Arrival Time"
              value={arrivalTime}
              onChange={setArrivalTime}
              mode="datetime"
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                marginTop: 16,
              }}>
              <TouchableOpacity
                onPress={handleArrivalModalCancel}
                style={{marginRight: 16}}>
                <Text style={{color: colors.grayFont, fontSize: 16}}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleArrivalModalSubmit}>
                <Text
                  style={{
                    color: colors.primary,
                    fontSize: 16,
                    fontFamily: fonts.semibold,
                  }}>
                  Submit
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* Departure Time Modal */}
      <Modal
        visible={showDepartureModal}
        transparent
        animationType="slide"
        onRequestClose={handleDepartureModalCancel}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.4)',
          }}>
          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 16,
              padding: 24,
              width: '85%',
            }}>
            <Text
              style={{
                fontSize: 18,
                fontFamily: fonts.semibold,
                marginBottom: 16,
              }}>
              Select Departure Time
            </Text>
            <DateTimeInput
              label="Departure Time"
              value={departureTime}
              onChange={setDepartureTime}
              mode="datetime"
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                marginTop: 16,
              }}>
              <TouchableOpacity
                onPress={handleDepartureModalCancel}
                style={{marginRight: 16}}>
                <Text style={{color: colors.grayFont, fontSize: 16}}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDepartureModalSubmit}>
                <Text
                  style={{
                    color: colors.primary,
                    fontSize: 16,
                    fontFamily: fonts.semibold,
                  }}>
                  Submit
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
